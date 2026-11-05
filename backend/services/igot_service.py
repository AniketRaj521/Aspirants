import json
import os
import re
from typing import List, Dict, Any


# ============================================================
# COURSE FILE LOCATIONS
# ============================================================

SERVICE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(SERVICE_DIR)
PROJECT_DIR = os.path.dirname(BACKEND_DIR)

COURSE_CANDIDATES = [
    os.path.join(BACKEND_DIR, "data", "courses.json"),
    os.path.join(PROJECT_DIR, "data", "courses.json"),
]


# ============================================================
# LOAD COURSES
# ============================================================

def load_courses() -> List[Dict[str, Any]]:
    """
    Load courses from the local STATWISE prototype catalogue.
    """

    for courses_file in COURSE_CANDIDATES:

        if not os.path.exists(courses_file):
            continue

        try:
            with open(courses_file, "r", encoding="utf-8") as file:
                data = json.load(file)

            # courses.json can be either:
            # [...]
            # OR
            # {"courses": [...]}

            if isinstance(data, list):
                print(f"Loaded courses from: {courses_file}")
                return data

            if isinstance(data, dict):

                courses = data.get("courses", [])

                if isinstance(courses, list):
                    print(f"Loaded courses from: {courses_file}")
                    return courses

        except json.JSONDecodeError as error:
            print(f"Invalid JSON in {courses_file}: {error}")
            return []

        except Exception as error:
            print(f"Error loading course catalogue: {error}")
            return []

    print("courses.json was not found.")

    for path in COURSE_CANDIDATES:
        print(f"Checked: {path}")

    return []


# ============================================================
# TEXT NORMALIZATION
# ============================================================

def normalize_text(value: Any) -> str:

    if value is None:
        return ""

    if isinstance(value, list):
        value = " ".join(str(item) for item in value)

    return re.sub(
        r"[^a-z0-9\s]",
        " ",
        str(value).lower()
    ).strip()


# ============================================================
# COURSE TEXT
# ============================================================

def course_text(course: Dict[str, Any]) -> str:

    fields = [
        course.get("course_id", ""),
        course.get("title", ""),
        course.get("name", ""),
        course.get("description", ""),
        course.get("category", ""),
        course.get("domain", ""),
        course.get("skill", ""),
        course.get("skills", ""),
        course.get("competency", ""),
        course.get("competencies", ""),
        course.get("tags", ""),
        course.get("level", ""),
        course.get("topics", ""),
    ]

    return normalize_text(" ".join(str(value) for value in fields))


# ============================================================
# TOKENIZE
# ============================================================

def tokenize(value: Any) -> set:

    text = normalize_text(value)

    return {
        word
        for word in text.split()
        if len(word) >= 3
    }


# ============================================================
# SKILL MATCHING
# ============================================================

def calculate_match_score(
    course: Dict[str, Any],
    skill_gaps: List[str],
    role: str = ""
) -> Dict[str, Any]:

    title = normalize_text(course.get("title", ""))
    description = normalize_text(course.get("description", ""))
    skill = normalize_text(course.get("skill", ""))
    level = normalize_text(course.get("level", ""))
    topics = normalize_text(course.get("topics", ""))

    full_text = course_text(course)

    matched_skills = []

    exact_skill_matches = 0
    topic_matches = 0

    # --------------------------------------------------------
    # Match each skill gap
    # --------------------------------------------------------

    for gap in skill_gaps:

        gap_normalized = normalize_text(gap)

        if not gap_normalized:
            continue

        # Strong exact skill match
        if gap_normalized == skill:
            matched_skills.append(gap)
            exact_skill_matches += 1
            continue

        # Skill appears in title/description/topics
        if gap_normalized in full_text:

            matched_skills.append(gap)
            topic_matches += 1
            continue

        # Token-level similarity
        gap_tokens = tokenize(gap)
        course_tokens = tokenize(full_text)

        if gap_tokens & course_tokens:

            matched_skills.append(gap)
            topic_matches += 1

    # --------------------------------------------------------
    # Score
    # --------------------------------------------------------

    score = 0

    # Exact competency/skill match
    score += exact_skill_matches * 60

    # Topic/description match
    score += topic_matches * 20

    # Role relevance
    role_normalized = normalize_text(role)

    if role_normalized:

        role_tokens = tokenize(role_normalized)
        course_tokens = tokenize(full_text)

        if role_tokens & course_tokens:
            score += 10

    # Strong relevance floor
    if exact_skill_matches > 0:
        score = max(score, 80)

    elif topic_matches > 0:
        score = max(score, 60)

    # Non-matching courses receive a small score
    if score == 0:
        score = 10

    score = min(score, 100)

    # --------------------------------------------------------
    # Recommendation reason
    # --------------------------------------------------------

    if exact_skill_matches > 0:

        reason = (
            "Strong recommendation because this course directly "
            "matches one or more identified competency gaps."
        )

    elif topic_matches > 0:

        reason = (
            "Recommended because the course content overlaps "
            "with your identified learning requirements."
        )

    else:

        reason = (
            "Suggested as an additional learning resource "
            "for broader competency development."
        )

    return {
        "match_score": score,
        "matched_skills": matched_skills,
        "recommendation_reason": reason,
    }


# ============================================================
# RECOMMEND COURSES
# ============================================================

def recommend_igot_courses(
    skill_gaps: List[str] = None,
    role: str = "",
    limit: int = 10
) -> Dict[str, Any]:

    courses = load_courses()

    if not courses:

        return {
            "status": "demo",
            "source": "STATWISE local demo catalogue",
            "integration": "iGOT Karmayogi API-ready adapter",
            "message": "No courses available.",
            "courses": []
        }

    skill_gaps = skill_gaps or []

    recommendations = []

    # --------------------------------------------------------
    # Score every course
    # --------------------------------------------------------

    for course in courses:

        scoring = calculate_match_score(
            course=course,
            skill_gaps=skill_gaps,
            role=role
        )

        course_copy = dict(course)

        course_copy.update(scoring)

        # Mark whether AI found a relevant match
        course_copy["ai_matched"] = (
            len(scoring["matched_skills"]) > 0
        )

        recommendations.append(course_copy)

    # --------------------------------------------------------
    # Sort highest match first
    # --------------------------------------------------------

    recommendations.sort(
        key=lambda item: item.get("match_score", 0),
        reverse=True
    )

    # --------------------------------------------------------
    # Return requested number
    # --------------------------------------------------------

    recommendations = recommendations[:limit]

    return {
        "status": "demo",
        "source": "STATWISE local demo catalogue",
        "integration": "iGOT Karmayogi API-ready adapter",

        "message": (
            "STATWISE AI analyzed the employee role and competency "
            "gaps and ranked learning resources from the local "
            "prototype catalogue. An authorized iGOT API can "
            "replace this catalogue in production."
        ),

        "role": role,

        "skill_gaps": skill_gaps,

        "total_recommendations": len(recommendations),

        "courses": recommendations
    }