"""
STATWISE AI - Real SQLite Database Module
Manages persistent storage for:
1. Student Profile & Academic Information
2. Assessed Skills & Competency Scores (strictly recorded upon test completion)
3. Assessment Test Submissions (CodeChef test history with genuine marks)
4. Portfolio Projects & Verified Internships
"""

import sqlite3
import json
import os
from pathlib import Path
from typing import Dict, List, Any, Optional

DB_DIR = Path(__file__).resolve().parent
DB_FILE = DB_DIR / "statwise.db"

def get_connection():
    """Returns a SQLite connection with row factory enabled."""
    conn = sqlite3.connect(DB_FILE, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the SQLite database tables if they do not exist."""
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Students Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        name TEXT DEFAULT '',
        email TEXT DEFAULT '',
        college TEXT DEFAULT '',
        branch TEXT DEFAULT '',
        year TEXT DEFAULT '',
        cgpa TEXT DEFAULT '',
        target_role TEXT DEFAULT 'data_scientist',
        bio TEXT DEFAULT '',
        phone TEXT DEFAULT '',
        location TEXT DEFAULT '',
        github TEXT DEFAULT '',
        linkedin TEXT DEFAULT '',
        portfolio TEXT DEFAULT '',
        programming_languages TEXT DEFAULT '[]',
        database_tools TEXT DEFAULT '[]',
        career_interests TEXT DEFAULT '[]',
        preferred_job_roles TEXT DEFAULT '[]',
        xp_points INTEGER DEFAULT 0,
        current_level INTEGER DEFAULT 1,
        assessments_completed INTEGER DEFAULT 0,
        study_streak_days INTEGER DEFAULT 0,
        total_study_hours REAL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 2. Student Skills Table (Populated ONLY when a student actually takes a test or adds a skill)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_skills (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT DEFAULT 'Technical',
        current_score INTEGER DEFAULT 0,
        target_score INTEGER DEFAULT 80,
        level TEXT DEFAULT 'Beginner',
        verified INTEGER DEFAULT 0,
        last_assessed TEXT DEFAULT '',
        notes TEXT DEFAULT '',
        FOREIGN KEY(student_id) REFERENCES students(id)
    )
    """)

    # 3. Assessment History Table (Stores real CodeChef test results)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS assessment_history (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        skill_name TEXT NOT NULL,
        test_code TEXT NOT NULL,
        total_questions INTEGER DEFAULT 20,
        correct_count INTEGER DEFAULT 0,
        percentage INTEGER DEFAULT 0,
        subjects_breakdown_json TEXT DEFAULT '[]',
        time_spent_seconds INTEGER DEFAULT 0,
        verdict TEXT DEFAULT 'Completed',
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(student_id) REFERENCES students(id)
    )
    """)

    # 4. Certifications Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS certifications (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        title TEXT NOT NULL,
        issuer TEXT NOT NULL,
        issue_date TEXT DEFAULT '',
        credential_id TEXT DEFAULT '',
        credential_url TEXT DEFAULT '',
        skills_learned TEXT DEFAULT '[]',
        badge_color TEXT DEFAULT '#4285F4',
        grade TEXT DEFAULT 'Verified Complete',
        status TEXT DEFAULT 'Verified',
        FOREIGN KEY(student_id) REFERENCES students(id)
    )
    """)

    # 5. Projects Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        tech_stack TEXT DEFAULT '[]',
        link TEXT DEFAULT '',
        date TEXT DEFAULT '',
        FOREIGN KEY(student_id) REFERENCES students(id)
    )
    """)

    # 6. Internships Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS internships (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        company TEXT NOT NULL,
        role TEXT NOT NULL,
        duration TEXT DEFAULT '',
        location TEXT DEFAULT '',
        description TEXT DEFAULT '',
        skills_applied TEXT DEFAULT '[]',
        FOREIGN KEY(student_id) REFERENCES students(id)
    )
    """)

    
    # 7. Student Roadmaps Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_roadmaps (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        role_id TEXT NOT NULL,
        roadmap_json TEXT NOT NULL,
        weekly_hours INTEGER DEFAULT 10,
        completion_percentage INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(student_id) REFERENCES students(id)
    )
    """)

    # 8. Roadmap Completed Milestones Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS roadmap_milestones (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        role_id TEXT NOT NULL,
        milestone_id TEXT NOT NULL,
        completed INTEGER DEFAULT 1,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(student_id) REFERENCES students(id)
    )
    """)

    # 9. Achievements Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        organization TEXT NOT NULL,
        achievement_date TEXT DEFAULT '',
        description TEXT DEFAULT '',
        award_position TEXT DEFAULT '',
        supporting_document_path TEXT DEFAULT '',
        supporting_document_name TEXT DEFAULT '',
        file_size INTEGER DEFAULT 0,
        reference_url TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(student_id) REFERENCES students(id)
    )
    """)

    # Dynamic migrations for certifications table
    cursor.execute("PRAGMA table_info(certifications)")
    existing_cols = {col[1] for col in cursor.fetchall()}
    cert_migration_cols = [
        ("certification_name", "TEXT DEFAULT ''"),
        ("issuing_organization", "TEXT DEFAULT ''"),
        ("category", "TEXT DEFAULT 'Other'"),
        ("completion_date", "TEXT DEFAULT ''"),
        ("certificate_id", "TEXT DEFAULT ''"),
        ("certificate_url", "TEXT DEFAULT ''"),
        ("uploaded_file_path", "TEXT DEFAULT ''"),
        ("file_name", "TEXT DEFAULT ''"),
        ("file_size", "INTEGER DEFAULT 0"),
        ("description", "TEXT DEFAULT ''"),
        ("verification_status", "TEXT DEFAULT 'Pending Verification'"),
        ("verification_url", "TEXT DEFAULT ''"),
        ("created_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"),
        ("updated_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    ]
    for col_name, col_type in cert_migration_cols:
        if col_name not in existing_cols:
            cursor.execute(f"ALTER TABLE certifications ADD COLUMN {col_name} {col_type}")


    # 10. Career Roles Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS career_roles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT DEFAULT '',
        industry TEXT DEFAULT 'Technology',
        average_salary TEXT DEFAULT '',
        market_demand TEXT DEFAULT 'High',
        icon TEXT DEFAULT 'Briefcase',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 11. Role Skill Requirements Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS role_skill_requirements (
        id TEXT PRIMARY KEY,
        role_id TEXT NOT NULL,
        skill_name TEXT NOT NULL,
        category TEXT DEFAULT 'Technical',
        required_proficiency INTEGER DEFAULT 3,
        recommended_level TEXT DEFAULT 'Intermediate',
        importance_weight REAL DEFAULT 1.0,
        importance TEXT DEFAULT 'High',
        is_mandatory INTEGER DEFAULT 0,
        why_important TEXT DEFAULT '',
        recommended_courses_json TEXT DEFAULT '[]',
        recommended_certs_json TEXT DEFAULT '[]',
        FOREIGN KEY(role_id) REFERENCES career_roles(id)
    )
    """)

    # 12. Student Role Comparisons Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_role_comparisons (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        role_id TEXT NOT NULL,
        match_score REAL DEFAULT 0,
        comparison_data_json TEXT DEFAULT '{}',
        compared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(student_id) REFERENCES students(id)
    )
    """)

    conn.commit()
    conn.close()

# Initialize DB on module import
init_db()

# ============================================================
# DATABASE CRUD OPERATIONS
# ============================================================

def get_or_create_student(student_id: str = "default_student") -> Dict[str, Any]:
    """Retrieves student record or creates a clean empty profile if not found."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
    row = cursor.fetchone()

    if not row:
        cursor.execute("""
        INSERT INTO students (id, target_role) VALUES (?, 'data_scientist')
        """, (student_id,))
        conn.commit()
        cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
        row = cursor.fetchone()

    student = dict(row)
    conn.close()

    # Parse JSON fields
    for field in ["programming_languages", "database_tools", "career_interests", "preferred_job_roles"]:
        try:
            student[field] = json.loads(student.get(field, "[]"))
        except:
            student[field] = []

    return student

def update_student_profile(profile_data: Dict[str, Any], student_id: str = "default_student") -> Dict[str, Any]:
    """Updates student personal and academic details in SQLite database."""
    conn = get_connection()
    cursor = conn.cursor()

    # Ensure student exists
    get_or_create_student(student_id)

    # Convert array fields to JSON strings
    prog_lang = json.dumps(profile_data.get("programmingLanguages", []))
    db_tools = json.dumps(profile_data.get("databaseTools", []))
    interests = json.dumps(profile_data.get("careerInterests", []))
    roles = json.dumps(profile_data.get("preferredJobRoles", []))

    cursor.execute("""
    UPDATE students SET
        name = ?,
        email = ?,
        college = ?,
        branch = ?,
        year = ?,
        cgpa = ?,
        target_role = ?,
        bio = ?,
        phone = ?,
        location = ?,
        github = ?,
        linkedin = ?,
        portfolio = ?,
        programming_languages = ?,
        database_tools = ?,
        career_interests = ?,
        preferred_job_roles = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    """, (
        profile_data.get("name", ""),
        profile_data.get("email", ""),
        profile_data.get("college", ""),
        profile_data.get("branch", ""),
        profile_data.get("year", ""),
        profile_data.get("cgpa", ""),
        profile_data.get("targetRole", "data_scientist"),
        profile_data.get("bio", ""),
        profile_data.get("phone", ""),
        profile_data.get("location", ""),
        profile_data.get("github", ""),
        profile_data.get("linkedin", ""),
        profile_data.get("portfolio", ""),
        prog_lang,
        db_tools,
        interests,
        roles,
        student_id
    ))

    conn.commit()
    conn.close()

    return get_student_full_state(student_id)

def get_student_skills(student_id: str = "default_student") -> List[Dict[str, Any]]:
    """Returns only real assessed skills for the student."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM student_skills WHERE student_id = ? ORDER BY current_score DESC
    """, (student_id,))
    rows = cursor.fetchall()
    conn.close()

    return [dict(r) for r in rows]

def record_assessment(assessment_data: Dict[str, Any], student_id: str = "default_student") -> Dict[str, Any]:
    """
    Records a real CodeChef test submission:
    1. Saves test attempt into assessment_history.
    2. Updates or inserts ONLY that skill into student_skills table.
    3. Increments student XP points and assessments_completed.
    """
    conn = get_connection()
    cursor = conn.cursor()

    skill_name = (assessment_data.get("skill_name") or assessment_data.get("skill") or "").strip()
    test_code = assessment_data.get("test_code", "CC-TEST20")
    total_q = int(assessment_data.get("total_questions", 20))
    correct = int(assessment_data.get("correct_count", 0))
    percentage = int(assessment_data.get("percentage", round((correct / max(1, total_q)) * 100)))
    subjects_json = json.dumps(assessment_data.get("subjects", []))
    time_spent = int(assessment_data.get("time_spent_seconds", 0))

    # 1. Insert assessment record
    test_id = f"test-{int(os.urandom(4).hex(), 16)}"
    cursor.execute("""
    INSERT INTO assessment_history 
    (id, student_id, skill_name, test_code, total_questions, correct_count, percentage, subjects_breakdown_json, time_spent_seconds)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (test_id, student_id, skill_name, test_code, total_q, correct, percentage, subjects_json, time_spent))

    # 2. Determine skill level
    if percentage >= 85:
        level = "Expert"
    elif percentage >= 75:
        level = "Advanced"
    elif percentage >= 55:
        level = "Intermediate"
    else:
        level = "Beginner"

    # Category determination
    prof_keywords = ["communication", "teamwork", "leadership", "problem", "time", "presentation"]
    category = "Professional" if any(k in skill_name.lower() for k in prof_keywords) else "Technical"

    # Check if skill already exists for student
    cursor.execute("SELECT id FROM student_skills WHERE student_id = ? AND LOWER(name) = LOWER(?)", (student_id, skill_name))
    existing_skill = cursor.fetchone()

    import datetime
    today_str = datetime.date.today().isoformat()

    if existing_skill:
        # Update existing skill score
        cursor.execute("""
        UPDATE student_skills SET
            current_score = ?,
            level = ?,
            verified = 1,
            last_assessed = ?
        WHERE id = ?
        """, (percentage, level, today_str, existing_skill["id"]))
    else:
        # Insert ONLY this tested skill
        skill_id = f"sk-{int(os.urandom(4).hex(), 16)}"
        cursor.execute("""
        INSERT INTO student_skills
        (id, student_id, name, category, current_score, target_score, level, verified, last_assessed)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
        """, (skill_id, student_id, skill_name, category, percentage, 85, level, today_str))

    # 3. Update student stats
    cursor.execute("""
    UPDATE students SET
        assessments_completed = assessments_completed + 1,
        xp_points = xp_points + 150,
        current_level = CASE WHEN (xp_points + 150) >= 500 THEN 2 ELSE 1 END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    """, (student_id,))

    conn.commit()
    conn.close()

    return {
        "assessment_id": test_id,
        "skill_name": skill_name,
        "score_percentage": percentage,
        "correct_count": correct,
        "total_questions": total_q,
        "level": level,
        "xp_awarded": 150
    }

def get_assessment_history(student_id: str = "default_student") -> List[Dict[str, Any]]:
    """Returns the list of real tests given by the student."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM assessment_history WHERE student_id = ? ORDER BY completed_at DESC
    """, (student_id,))
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        d = dict(r)
        try:
            d["subjects"] = json.loads(d.get("subjects_breakdown_json", "[]"))
        except:
            d["subjects"] = []
        result.append(d)

    return result

def add_or_update_skill(skill_data: Dict[str, Any], student_id: str = "default_student") -> Dict[str, Any]:
    """Adds or updates a custom student skill in SQLite database."""
    conn = get_connection()
    cursor = conn.cursor()
    
    skill_id = skill_data.get("id") or f"sk-{int(os.urandom(4).hex(), 16)}"
    name = skill_data.get("name", "").strip()
    category = skill_data.get("category", "Technical")
    current_score = int(skill_data.get("currentScore", 0))
    target_score = int(skill_data.get("targetScore", 80))
    level = skill_data.get("level", "Beginner")
    verified = 1 if skill_data.get("verified") else 0
    import datetime
    last_assessed = skill_data.get("lastAssessed") or datetime.date.today().isoformat()
    notes = skill_data.get("notes", "")

    cursor.execute("""
    INSERT INTO student_skills (id, student_id, name, category, current_score, target_score, level, verified, last_assessed, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        current_score = excluded.current_score,
        target_score = excluded.target_score,
        level = excluded.level,
        verified = excluded.verified,
        last_assessed = excluded.last_assessed,
        notes = excluded.notes
    """, (skill_id, student_id, name, category, current_score, target_score, level, verified, last_assessed, notes))
    
    conn.commit()
    conn.close()
    return {"id": skill_id, "name": name, "category": category, "currentScore": current_score, "targetScore": target_score, "level": level, "verified": bool(verified), "lastAssessed": last_assessed, "notes": notes}

def delete_skill(skill_id: str, student_id: str = "default_student") -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM student_skills WHERE id = ? AND student_id = ?", (skill_id, student_id))
    conn.commit()
    conn.close()
    return True

def get_projects(student_id: str = "default_student") -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM projects WHERE student_id = ?", (student_id,))
    rows = cursor.fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        try:
            d["techStack"] = json.loads(d.get("tech_stack", "[]"))
        except:
            d["techStack"] = []
        result.append(d)
    return result

def add_project(project_data: Dict[str, Any], student_id: str = "default_student") -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    p_id = project_data.get("id") or f"proj-{int(os.urandom(4).hex(), 16)}"
    title = project_data.get("title", "").strip()
    description = project_data.get("description", "")
    tech_stack = json.dumps(project_data.get("techStack", []))
    link = project_data.get("link", "")
    date = project_data.get("date", "")

    cursor.execute("""
    INSERT INTO projects (id, student_id, title, description, tech_stack, link, date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (p_id, student_id, title, description, tech_stack, link, date))
    conn.commit()
    conn.close()
    return {"id": p_id, "title": title, "description": description, "techStack": project_data.get("techStack", []), "link": link, "date": date}

def delete_project(project_id: str, student_id: str = "default_student") -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM projects WHERE id = ? AND student_id = ?", (project_id, student_id))
    conn.commit()
    conn.close()
    return True

def get_internships(student_id: str = "default_student") -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM internships WHERE student_id = ?", (student_id,))
    rows = cursor.fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        try:
            d["skillsApplied"] = json.loads(d.get("skills_applied", "[]"))
        except:
            d["skillsApplied"] = []
        result.append(d)
    return result

def add_internship(internship_data: Dict[str, Any], student_id: str = "default_student") -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    i_id = internship_data.get("id") or f"intern-{int(os.urandom(4).hex(), 16)}"
    company = internship_data.get("company", "").strip()
    role = internship_data.get("role", "").strip()
    duration = internship_data.get("duration", "")
    location = internship_data.get("location", "")
    description = internship_data.get("description", "")
    skills_applied = json.dumps(internship_data.get("skillsApplied", []))

    cursor.execute("""
    INSERT INTO internships (id, student_id, company, role, duration, location, description, skills_applied)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (i_id, student_id, company, role, duration, location, description, skills_applied))
    conn.commit()
    conn.close()
    return {"id": i_id, "company": company, "role": role, "duration": duration, "location": location, "description": description, "skillsApplied": internship_data.get("skillsApplied", [])}

def delete_internship(internship_id: str, student_id: str = "default_student") -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM internships WHERE id = ? AND student_id = ?", (internship_id, student_id))
    conn.commit()
    conn.close()
    return True

# ============================================================
# CERTIFICATION & ACHIEVEMENT MANAGEMENT (FEATURE MODULE)
# ============================================================

def format_certification_row(row_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Converts a SQLite row dictionary into a normalized certification object."""
    name = row_dict.get("certification_name") or row_dict.get("title") or ""
    issuer = row_dict.get("issuing_organization") or row_dict.get("issuer") or ""
    c_date = row_dict.get("completion_date") or row_dict.get("issue_date") or ""
    c_id = row_dict.get("certificate_id") or row_dict.get("credential_id") or ""
    c_url = row_dict.get("certificate_url") or row_dict.get("credential_url") or ""
    v_status = row_dict.get("verification_status") or row_dict.get("status") or "Pending Verification"
    file_path = row_dict.get("uploaded_file_path") or ""
    file_name = row_dict.get("file_name") or (file_path.split("/")[-1] if file_path else "")

    skills_raw = row_dict.get("skills_learned", "[]")
    if isinstance(skills_raw, str):
        try:
            skills_list = json.loads(skills_raw)
        except Exception:
            skills_list = [s.strip() for s in skills_raw.split(",") if s.strip()]
    elif isinstance(skills_raw, list):
        skills_list = skills_raw
    else:
        skills_list = []

    return {
        "id": row_dict.get("id"),
        "student_id": row_dict.get("student_id"),
        "studentId": row_dict.get("student_id"),
        "certification_name": name,
        "title": name,
        "issuing_organization": issuer,
        "issuer": issuer,
        "category": row_dict.get("category") or "Other",
        "completion_date": c_date,
        "issue_date": c_date,
        "issueDate": c_date,
        "certificate_id": c_id,
        "credential_id": c_id,
        "credentialId": c_id,
        "certificate_url": c_url,
        "credential_url": c_url,
        "credentialUrl": c_url,
        "uploaded_file_path": file_path,
        "filePath": file_path,
        "file_name": file_name,
        "fileName": file_name,
        "file_size": row_dict.get("file_size") or 0,
        "fileSize": row_dict.get("file_size") or 0,
        "description": row_dict.get("description") or "",
        "verification_status": v_status,
        "status": v_status,
        "verification_url": row_dict.get("verification_url") or c_url,
        "verificationUrl": row_dict.get("verification_url") or c_url,
        "grade": row_dict.get("grade") or "Completed",
        "badge_color": row_dict.get("badge_color") or "#4285F4",
        "badgeColor": row_dict.get("badge_color") or "#4285F4",
        "skills_learned": skills_list,
        "skillsLearned": skills_list,
        "created_at": str(row_dict.get("created_at") or ""),
        "updated_at": str(row_dict.get("updated_at") or "")
    }

def format_achievement_row(row_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Converts a SQLite row dictionary into a normalized achievement object."""
    doc_path = row_dict.get("supporting_document_path") or ""
    doc_name = row_dict.get("supporting_document_name") or (doc_path.split("/")[-1] if doc_path else "")

    return {
        "id": row_dict.get("id"),
        "student_id": row_dict.get("student_id"),
        "studentId": row_dict.get("student_id"),
        "title": row_dict.get("title", ""),
        "category": row_dict.get("category") or "Other Achievements",
        "organization": row_dict.get("organization") or "",
        "achievement_date": row_dict.get("achievement_date") or "",
        "achievementDate": row_dict.get("achievement_date") or "",
        "description": row_dict.get("description") or "",
        "award_position": row_dict.get("award_position") or "Participation",
        "awardPosition": row_dict.get("award_position") or "Participation",
        "supporting_document_path": doc_path,
        "supportingDocumentPath": doc_path,
        "supporting_document_name": doc_name,
        "supportingDocumentName": doc_name,
        "file_size": row_dict.get("file_size") or 0,
        "fileSize": row_dict.get("file_size") or 0,
        "reference_url": row_dict.get("reference_url") or "",
        "referenceUrl": row_dict.get("reference_url") or "",
        "created_at": str(row_dict.get("created_at") or ""),
        "updated_at": str(row_dict.get("updated_at") or "")
    }

def get_certifications(
    student_id: str = "default_student",
    category: Optional[str] = None,
    verification_status: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "newest"
) -> List[Dict[str, Any]]:
    """Retrieves all certifications for a student with flexible filtering and sorting."""
    conn = get_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM certifications WHERE student_id = ?"
    params = [student_id]

    if category and category.lower() != "all":
        query += " AND LOWER(category) = LOWER(?)"
        params.append(category)

    if verification_status and verification_status.lower() != "all":
        query += " AND (LOWER(verification_status) = LOWER(?) OR LOWER(status) = LOWER(?))"
        params.extend([verification_status, verification_status])

    if search and search.strip():
        s = f"%{search.strip().lower()}%"
        query += """ AND (
            LOWER(COALESCE(certification_name, '')) LIKE ? OR
            LOWER(COALESCE(title, '')) LIKE ? OR
            LOWER(COALESCE(issuing_organization, '')) LIKE ? OR
            LOWER(COALESCE(issuer, '')) LIKE ? OR
            LOWER(COALESCE(certificate_id, '')) LIKE ? OR
            LOWER(COALESCE(credential_id, '')) LIKE ?
        )"""
        params.extend([s, s, s, s, s, s])

    if sort_by == "oldest":
        query += " ORDER BY COALESCE(NULLIF(completion_date, ''), NULLIF(issue_date, ''), created_at) ASC"
    elif sort_by == "az":
        query += " ORDER BY LOWER(COALESCE(NULLIF(certification_name, ''), title)) ASC"
    else:
        # newest by default
        query += " ORDER BY COALESCE(NULLIF(completion_date, ''), NULLIF(issue_date, ''), created_at) DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return [format_certification_row(dict(r)) for r in rows]

def get_certification_by_id(cert_id: str, student_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Fetches a single certification record by ID."""
    conn = get_connection()
    cursor = conn.cursor()
    if student_id:
        cursor.execute("SELECT * FROM certifications WHERE id = ? AND student_id = ?", (cert_id, student_id))
    else:
        cursor.execute("SELECT * FROM certifications WHERE id = ?", (cert_id,))
    row = cursor.fetchone()
    conn.close()
    return format_certification_row(dict(row)) if row else None

def add_certification(cert_data: Dict[str, Any], student_id: str = "default_student") -> Dict[str, Any]:
    """Creates a new certification record in the database."""
    conn = get_connection()
    cursor = conn.cursor()

    c_id = cert_data.get("id") or f"cert-{int(os.urandom(6).hex(), 16)}"
    name = (cert_data.get("certification_name") or cert_data.get("title") or "").strip()
    issuer = (cert_data.get("issuing_organization") or cert_data.get("issuer") or "").strip()
    category = cert_data.get("category") or "Other"
    comp_date = cert_data.get("completion_date") or cert_data.get("issueDate") or cert_data.get("issue_date") or ""
    cert_id = cert_data.get("certificate_id") or cert_data.get("credentialId") or cert_data.get("credential_id") or ""
    cert_url = cert_data.get("certificate_url") or cert_data.get("credentialUrl") or cert_data.get("credential_url") or ""
    uploaded_file = cert_data.get("uploaded_file_path") or cert_data.get("filePath") or ""
    file_name = cert_data.get("file_name") or cert_data.get("fileName") or (uploaded_file.split("/")[-1] if uploaded_file else "")
    file_size = int(cert_data.get("file_size") or cert_data.get("fileSize") or 0)
    desc = cert_data.get("description") or ""
    v_status = cert_data.get("verification_status") or cert_data.get("status") or "Pending Verification"
    v_url = cert_data.get("verification_url") or cert_data.get("verificationUrl") or cert_url
    badge_color = cert_data.get("badge_color") or cert_data.get("badgeColor") or "#4285F4"
    grade = cert_data.get("grade") or "Completed"

    skills_learned = cert_data.get("skills_learned") or cert_data.get("skillsLearned") or []
    if isinstance(skills_learned, list):
        skills_json = json.dumps(skills_learned)
    else:
        skills_json = str(skills_learned)

    cursor.execute("""
    INSERT INTO certifications (
        id, student_id, certification_name, title, issuing_organization, issuer,
        category, completion_date, issue_date, certificate_id, credential_id,
        certificate_url, credential_url, uploaded_file_path, file_name, file_size,
        description, verification_status, status, verification_url, badge_color,
        grade, skills_learned, created_at, updated_at
    ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    """, (
        c_id, student_id, name, name, issuer, issuer,
        category, comp_date, comp_date, cert_id, cert_id,
        cert_url, cert_url, uploaded_file, file_name, file_size,
        desc, v_status, v_status, v_url, badge_color,
        grade, skills_json
    ))
    conn.commit()
    conn.close()

    return get_certification_by_id(c_id, student_id)

def update_certification(cert_id: str, cert_data: Dict[str, Any], student_id: str = "default_student") -> Optional[Dict[str, Any]]:
    """Updates an existing certification record."""
    conn = get_connection()
    cursor = conn.cursor()

    existing = get_certification_by_id(cert_id, student_id)
    if not existing:
        conn.close()
        return None

    name = cert_data.get("certification_name") or cert_data.get("title") or existing["certification_name"]
    issuer = cert_data.get("issuing_organization") or cert_data.get("issuer") or existing["issuing_organization"]
    category = cert_data.get("category") or existing["category"]
    comp_date = cert_data.get("completion_date") or cert_data.get("issueDate") or cert_data.get("issue_date") or existing["completion_date"]
    c_num = cert_data.get("certificate_id") if "certificate_id" in cert_data else (cert_data.get("credentialId") or existing["certificate_id"])
    c_url = cert_data.get("certificate_url") if "certificate_url" in cert_data else (cert_data.get("credentialUrl") or existing["certificate_url"])
    up_path = cert_data.get("uploaded_file_path") if "uploaded_file_path" in cert_data else (cert_data.get("filePath") or existing["uploaded_file_path"])
    f_name = cert_data.get("file_name") if "file_name" in cert_data else (cert_data.get("fileName") or existing["file_name"])
    f_size = cert_data.get("file_size") if "file_size" in cert_data else (cert_data.get("fileSize") or existing["file_size"])
    desc = cert_data.get("description") if "description" in cert_data else existing["description"]
    v_status = cert_data.get("verification_status") or cert_data.get("status") or existing["verification_status"]
    v_url = cert_data.get("verification_url") if "verification_url" in cert_data else (cert_data.get("verificationUrl") or existing["verification_url"])
    grade = cert_data.get("grade") or existing["grade"]

    cursor.execute("""
    UPDATE certifications SET
        certification_name = ?,
        title = ?,
        issuing_organization = ?,
        issuer = ?,
        category = ?,
        completion_date = ?,
        issue_date = ?,
        certificate_id = ?,
        credential_id = ?,
        certificate_url = ?,
        credential_url = ?,
        uploaded_file_path = ?,
        file_name = ?,
        file_size = ?,
        description = ?,
        verification_status = ?,
        status = ?,
        verification_url = ?,
        grade = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND student_id = ?
    """, (
        name, name, issuer, issuer, category, comp_date, comp_date,
        c_num, c_num, c_url, c_url, up_path, f_name, f_size,
        desc, v_status, v_status, v_url, grade, cert_id, student_id
    ))
    conn.commit()
    conn.close()

    return get_certification_by_id(cert_id, student_id)

def delete_certification(cert_id: str, student_id: str = "default_student") -> bool:
    """Deletes a certification record owned by the student."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM certifications WHERE id = ? AND student_id = ?", (cert_id, student_id))
    affected = cursor.rowcount
    conn.commit()
    conn.close()
    return affected > 0

# ============================================================
# ACHIEVEMENTS CRUD OPERATIONS
# ============================================================

def get_achievements(
    student_id: str = "default_student",
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "newest"
) -> List[Dict[str, Any]]:
    """Retrieves all achievements for a student with flexible filtering and sorting."""
    conn = get_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM achievements WHERE student_id = ?"
    params = [student_id]

    if category and category.lower() != "all":
        query += " AND LOWER(category) = LOWER(?)"
        params.append(category)

    if search and search.strip():
        s = f"%{search.strip().lower()}%"
        query += " AND (LOWER(title) LIKE ? OR LOWER(organization) LIKE ? OR LOWER(description) LIKE ?)"
        params.extend([s, s, s])

    if sort_by == "oldest":
        query += " ORDER BY COALESCE(NULLIF(achievement_date, ''), created_at) ASC"
    elif sort_by == "az":
        query += " ORDER BY LOWER(title) ASC"
    else:
        query += " ORDER BY COALESCE(NULLIF(achievement_date, ''), created_at) DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return [format_achievement_row(dict(r)) for r in rows]

def get_achievement_by_id(ach_id: str, student_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Fetches a single achievement record by ID."""
    conn = get_connection()
    cursor = conn.cursor()
    if student_id:
        cursor.execute("SELECT * FROM achievements WHERE id = ? AND student_id = ?", (ach_id, student_id))
    else:
        cursor.execute("SELECT * FROM achievements WHERE id = ?", (ach_id,))
    row = cursor.fetchone()
    conn.close()
    return format_achievement_row(dict(row)) if row else None

def add_achievement(ach_data: Dict[str, Any], student_id: str = "default_student") -> Dict[str, Any]:
    """Creates a new achievement record."""
    conn = get_connection()
    cursor = conn.cursor()

    a_id = ach_data.get("id") or f"ach-{int(os.urandom(6).hex(), 16)}"
    title = (ach_data.get("title") or "").strip()
    category = ach_data.get("category") or "Other Achievements"
    organization = (ach_data.get("organization") or "").strip()
    ach_date = ach_data.get("achievement_date") or ach_data.get("achievementDate") or ""
    desc = ach_data.get("description") or ""
    award_pos = ach_data.get("award_position") or ach_data.get("awardPosition") or "Participation"
    doc_path = ach_data.get("supporting_document_path") or ach_data.get("supportingDocumentPath") or ""
    doc_name = ach_data.get("supporting_document_name") or ach_data.get("supportingDocumentName") or (doc_path.split("/")[-1] if doc_path else "")
    file_size = int(ach_data.get("file_size") or ach_data.get("fileSize") or 0)
    ref_url = ach_data.get("reference_url") or ach_data.get("referenceUrl") or ""

    cursor.execute("""
    INSERT INTO achievements (
        id, student_id, title, category, organization,
        achievement_date, description, award_position,
        supporting_document_path, supporting_document_name, file_size, reference_url,
        created_at, updated_at
    ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    """, (
        a_id, student_id, title, category, organization,
        ach_date, desc, award_pos,
        doc_path, doc_name, file_size, ref_url
    ))
    conn.commit()
    conn.close()

    return get_achievement_by_id(a_id, student_id)

def update_achievement(ach_id: str, ach_data: Dict[str, Any], student_id: str = "default_student") -> Optional[Dict[str, Any]]:
    """Updates an existing achievement record."""
    conn = get_connection()
    cursor = conn.cursor()

    existing = get_achievement_by_id(ach_id, student_id)
    if not existing:
        conn.close()
        return None

    title = ach_data.get("title") or existing["title"]
    category = ach_data.get("category") or existing["category"]
    organization = ach_data.get("organization") or existing["organization"]
    ach_date = ach_data.get("achievement_date") or ach_data.get("achievementDate") or existing["achievement_date"]
    desc = ach_data.get("description") if "description" in ach_data else existing["description"]
    award_pos = ach_data.get("award_position") or ach_data.get("awardPosition") or existing["award_position"]
    doc_path = ach_data.get("supporting_document_path") if "supporting_document_path" in ach_data else (ach_data.get("supportingDocumentPath") or existing["supporting_document_path"])
    doc_name = ach_data.get("supporting_document_name") if "supporting_document_name" in ach_data else (ach_data.get("supportingDocumentName") or existing["supporting_document_name"])
    file_size = ach_data.get("file_size") if "file_size" in ach_data else (ach_data.get("fileSize") or existing["file_size"])
    ref_url = ach_data.get("reference_url") if "reference_url" in ach_data else (ach_data.get("referenceUrl") or existing["reference_url"])

    cursor.execute("""
    UPDATE achievements SET
        title = ?,
        category = ?,
        organization = ?,
        achievement_date = ?,
        description = ?,
        award_position = ?,
        supporting_document_path = ?,
        supporting_document_name = ?,
        file_size = ?,
        reference_url = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND student_id = ?
    """, (
        title, category, organization, ach_date, desc, award_pos,
        doc_path, doc_name, file_size, ref_url, ach_id, student_id
    ))
    conn.commit()
    conn.close()

    return get_achievement_by_id(ach_id, student_id)

def delete_achievement(ach_id: str, student_id: str = "default_student") -> bool:
    """Deletes an achievement record owned by the student."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM achievements WHERE id = ? AND student_id = ?", (ach_id, student_id))
    affected = cursor.rowcount
    conn.commit()
    conn.close()
    return affected > 0

# ============================================================
# CERTIFICATION & ACHIEVEMENT ANALYTICS
# ============================================================

def get_certification_analytics(student_id: str = "default_student") -> Dict[str, Any]:
    """Calculates dynamic category breakdowns, verification ratios, and timeline metrics."""
    certs = get_certifications(student_id)
    achievements = get_achievements(student_id)

    total_certs = len(certs)
    verified_certs = sum(1 for c in certs if c.get("verification_status") == "Verified" or c.get("status") == "Verified")
    pending_certs = sum(1 for c in certs if c.get("verification_status") == "Pending Verification" or c.get("status") == "Pending Verification")
    not_verified_certs = sum(1 for c in certs if c.get("verification_status") == "Not Verified" or c.get("status") == "Not Verified")
    total_achievements = len(achievements)

    # Current month certifications
    import datetime
    current_ym = datetime.datetime.now().strftime("%Y-%m")
    certs_this_month = sum(1 for c in certs if (c.get("completion_date") or "").startswith(current_ym) or (c.get("created_at") or "").startswith(current_ym))

    verification_rate = round((verified_certs / total_certs) * 100, 1) if total_certs > 0 else 0.0

    # Categorical breakdown
    cat_map: Dict[str, int] = {}
    for c in certs:
        cat = c.get("category") or "Other"
        cat_map[cat] = cat_map.get(cat, 0) + 1
    by_category = [{"category": k, "count": v} for k, v in sorted(cat_map.items(), key=lambda x: x[1], reverse=True)]

    # Issuer breakdown
    issuer_map: Dict[str, int] = {}
    for c in certs:
        iss = c.get("issuing_organization") or c.get("issuer") or "Unknown Issuer"
        issuer_map[iss] = issuer_map.get(iss, 0) + 1
    by_issuer = [{"issuer": k, "count": v} for k, v in sorted(issuer_map.items(), key=lambda x: x[1], reverse=True)[:8]]

    # Monthly completion trends (last 6 months)
    month_map: Dict[str, int] = {}
    for c in certs:
        d = c.get("completion_date") or c.get("created_at") or ""
        if len(d) >= 7:
            ym = d[:7]
            month_map[ym] = month_map.get(ym, 0) + 1
    monthly_trends = [{"month": k, "count": v} for k, v in sorted(month_map.items())]

    # Achievements breakdown by category
    ach_cat_map: Dict[str, int] = {}
    for a in achievements:
        cat = a.get("category") or "Other Achievements"
        ach_cat_map[cat] = ach_cat_map.get(cat, 0) + 1
    achievements_by_category = [{"category": k, "count": v} for k, v in sorted(ach_cat_map.items(), key=lambda x: x[1], reverse=True)]

    return {
        "summary": {
            "total_certifications": total_certs,
            "totalCertifications": total_certs,
            "verified_certifications": verified_certs,
            "verifiedCertifications": verified_certs,
            "pending_verification": pending_certs,
            "pendingVerification": pending_certs,
            "not_verified": not_verified_certs,
            "notVerified": not_verified_certs,
            "total_achievements": total_achievements,
            "totalAchievements": total_achievements,
            "certifications_this_month": certs_this_month,
            "certificationsThisMonth": certs_this_month,
            "verification_completion_pct": verification_rate,
            "verificationCompletionPercentage": verification_rate
        },
        "by_category": by_category,
        "byCategory": by_category,
        "by_issuer": by_issuer,
        "byIssuer": by_issuer,
        "monthly_trends": monthly_trends,
        "monthlyTrends": monthly_trends,
        "achievements_by_category": achievements_by_category,
        "achievementsByCategory": achievements_by_category
    }

def get_student_full_state(student_id: str = "default_student") -> Dict[str, Any]:
    """
    Returns the real, complete student state from database:
    - Profile (empty by default for new users)
    - Skills (ONLY the skills the user has actually tested!)
    - Real assessment history
    - Real stats
    - Real projects, internships, certifications
    """
    student = get_or_create_student(student_id)
    skills = get_student_skills(student_id)
    history = get_assessment_history(student_id)
    projs = get_projects(student_id)
    interns = get_internships(student_id)
    certs = get_certifications(student_id)

    profile = {
        "name": student.get("name", ""),
        "email": student.get("email", ""),
        "college": student.get("college", ""),
        "branch": student.get("branch", ""),
        "year": student.get("year", ""),
        "cgpa": student.get("cgpa", ""),
        "targetRole": student.get("target_role", "data_scientist"),
        "bio": student.get("bio", ""),
        "phone": student.get("phone", ""),
        "location": student.get("location", ""),
        "github": student.get("github", ""),
        "linkedin": student.get("linkedin", ""),
        "portfolio": student.get("portfolio", ""),
        "programmingLanguages": student.get("programming_languages", []),
        "databaseTools": student.get("database_tools", []),
        "careerInterests": student.get("career_interests", []),
        "preferredJobRoles": student.get("preferred_job_roles", []),
    }

    stats = {
        "xpPoints": student.get("xp_points", 0),
        "currentLevel": student.get("current_level", 1),
        "nextLevelXp": 500,
        "assessmentsCompleted": student.get("assessments_completed", 0),
        "studyStreakDays": student.get("study_streak_days", 0),
        "totalStudyHours": student.get("total_study_hours", 0),
        "certificationsEarned": len(certs)
    }

    # Format skills
    formatted_skills = []
    for s in skills:
        formatted_skills.append({
            "id": s["id"],
            "name": s["name"],
            "category": s["category"],
            "currentScore": s["current_score"],
            "targetScore": s["target_score"],
            "level": s["level"],
            "verified": bool(s["verified"]),
            "lastAssessed": s["last_assessed"],
            "notes": s.get("notes", "")
        })

    return {
        "profile": profile,
        "skills": formatted_skills,
        "stats": stats,
        "assessmentHistory": history,
        "certifications": certs,
        "achievements": achievements,
        "projects": projs,
        "internships": interns
    }


def save_student_roadmap(student_id: str, role_id: str, roadmap_data: Dict[str, Any], weekly_hours: int = 10):
    """Stores or updates a student's generated roadmap."""
    conn = get_connection()
    cursor = conn.cursor()

    roadmap_id = f"roadmap-{student_id}-{role_id}"
    roadmap_json = json.dumps(roadmap_data)
    completion = roadmap_data.get("completion_percentage", 0)

    cursor.execute("""
    INSERT INTO student_roadmaps (id, student_id, role_id, roadmap_json, weekly_hours, completion_percentage, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
        roadmap_json = excluded.roadmap_json,
        weekly_hours = excluded.weekly_hours,
        completion_percentage = excluded.completion_percentage,
        updated_at = CURRENT_TIMESTAMP
    """, (roadmap_id, student_id, role_id, roadmap_json, weekly_hours, completion))

    conn.commit()
    conn.close()
    return True

def get_student_roadmap(student_id: str, role_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves a student's saved roadmap with milestone completion status applied."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM student_roadmaps WHERE student_id = ? AND role_id = ?", (student_id, role_id))
    row = cursor.fetchone()

    if not row:
        conn.close()
        return None

    roadmap = json.loads(row["roadmap_json"])

    # Retrieve completed milestones
    cursor.execute("SELECT milestone_id FROM roadmap_milestones WHERE student_id = ? AND role_id = ?", (student_id, role_id))
    completed_rows = cursor.fetchall()
    completed_ids = {r["milestone_id"] for r in completed_rows}

    conn.close()

    # Apply completion status
    total_nodes = 0
    completed_nodes = 0
    for phase in roadmap.get("phases", []):
        phase_nodes = phase.get("nodes", [])
        for node in phase_nodes:
            total_nodes += 1
            if node["id"] in completed_ids:
                node["completed"] = True
                node["status"] = "Completed"
                completed_nodes += 1
        phase["status"] = "Completed" if phase_nodes and all(n.get("completed") for n in phase_nodes) else phase.get("status", "In Progress")

    roadmap["completed_nodes"] = completed_nodes
    roadmap["completion_percentage"] = round((completed_nodes / total_nodes) * 100) if total_nodes > 0 else 0

    return roadmap

def toggle_roadmap_milestone(student_id: str, role_id: str, milestone_id: str, completed: Optional[bool] = None) -> Dict[str, Any]:
    """Toggles or sets the completion state of a milestone."""
    conn = get_connection()
    cursor = conn.cursor()

    record_id = f"ms-{student_id}-{role_id}-{milestone_id}"

    # Check current state
    cursor.execute("SELECT * FROM roadmap_milestones WHERE student_id = ? AND role_id = ? AND milestone_id = ?", (student_id, role_id, milestone_id))
    existing = cursor.fetchone()

    is_completed = False
    if existing:
        # Delete if toggled off
        if completed is False or completed is None:
            cursor.execute("DELETE FROM roadmap_milestones WHERE student_id = ? AND role_id = ? AND milestone_id = ?", (student_id, role_id, milestone_id))
            is_completed = False
        else:
            is_completed = True
    else:
        # Insert completed
        cursor.execute("""
        INSERT INTO roadmap_milestones (id, student_id, role_id, milestone_id, completed, completed_at)
        VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
        """, (record_id, student_id, role_id, milestone_id))
        is_completed = True

        # Award XP for milestone completion
        cursor.execute("UPDATE students SET xp_points = xp_points + 120 WHERE id = ?", (student_id,))

    conn.commit()
    conn.close()

    return {"milestone_id": milestone_id, "completed": is_completed, "xp_awarded": 120 if is_completed else 0}

def get_roadmap_completed_milestones(student_id: str, role_id: str) -> List[str]:
    """Returns all completed milestone IDs for a student and role."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT milestone_id FROM roadmap_milestones WHERE student_id = ? AND role_id = ?", (student_id, role_id))
    rows = cursor.fetchall()
    conn.close()
    return [r["milestone_id"] for r in rows]

def reset_student_database(student_id: str = "default_student"):
    """Completely resets student database records to fresh empty state."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM student_skills WHERE student_id = ?", (student_id,))
    cursor.execute("DELETE FROM assessment_history WHERE student_id = ?", (student_id,))
    cursor.execute("DELETE FROM certifications WHERE student_id = ?", (student_id,))
    cursor.execute("DELETE FROM projects WHERE student_id = ?", (student_id,))
    cursor.execute("DELETE FROM internships WHERE student_id = ?", (student_id,))
    cursor.execute("DELETE FROM student_roadmaps WHERE student_id = ?", (student_id,))
    cursor.execute("DELETE FROM roadmap_milestones WHERE student_id = ?", (student_id,))

    cursor.execute("""
    UPDATE students SET
        name = '',
        email = '',
        college = '',
        branch = '',
        year = '',
        cgpa = '',
        target_role = 'data_scientist',
        bio = '',
        phone = '',
        location = '',
        github = '',
        linkedin = '',
        portfolio = '',
        programming_languages = '[]',
        database_tools = '[]',
        career_interests = '[]',
        preferred_job_roles = '[]',
        xp_points = 0,
        current_level = 1,
        assessments_completed = 0,
        study_streak_days = 0,
        total_study_hours = 0,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    """, (student_id,))

    conn.commit()
    conn.close()

    return get_student_full_state(student_id)


def get_skill_development_progress(student_id: str = "default_student") -> Dict[str, Any]:
    """
    Feature 6: Skill Development Progress Tracking.
    Calculates Before Learning vs. After Learning improvement for each skill across real test attempts.
    """
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM assessment_history WHERE student_id = ? ORDER BY completed_at ASC
    """, (student_id,))
    history_rows = cursor.fetchall()

    from collections import defaultdict
    by_skill = defaultdict(list)
    for r in history_rows:
        s_name = r["skill_name"].strip()
        by_skill[s_name.lower()].append(dict(r))

    cursor.execute("SELECT * FROM student_skills WHERE student_id = ?", (student_id,))
    skill_rows = cursor.fetchall()
    conn.close()

    skill_meta = {}
    for sk in skill_rows:
        name = sk["name"].strip()
        skill_meta[name.lower()] = dict(sk)

    skills_progress = []
    total_delta_sum = 0
    improved_count = 0
    mastered_count = 0

    all_skill_keys = set(by_skill.keys()) | set(skill_meta.keys())

    for k in all_skill_keys:
        attempts = by_skill.get(k, [])
        meta = skill_meta.get(k, {})
        display_name = meta.get("name") or (attempts[0]["skill_name"] if attempts else k.title())
        category = meta.get("category") or "Technical"
        target_score = meta.get("target_score", 80)

        if not attempts:
            current = float(meta.get("current_score", 0))
            before = current
            after = current
            attempts_count = 1
        elif len(attempts) == 1:
            before = float(attempts[0]["percentage"])
            after = float(attempts[0]["percentage"])
            attempts_count = 1
        else:
            before = float(attempts[0]["percentage"])
            after = float(attempts[-1]["percentage"])
            attempts_count = len(attempts)

        delta = round(after - before, 1)
        remaining_gap = max(0.0, round(target_score - after, 1))
        is_mastered = after >= target_score
        is_improved = delta > 0

        if is_improved:
            improved_count += 1
            total_delta_sum += delta
        if is_mastered:
            mastered_count += 1

        history_list = []
        for idx, att in enumerate(attempts):
            comp = att["completed_at"] or ""
            date_str = comp.split(" ")[0] if " " in comp else (comp.split("T")[0] if "T" in comp else comp)
            history_list.append({
                "attempt": idx + 1,
                "attempt_name": f"Attempt #{idx + 1}",
                "percentage": att["percentage"],
                "correct_count": att["correct_count"],
                "total_questions": att["total_questions"],
                "completed_at": comp,
                "date": date_str
            })

        skills_progress.append({
            "skill": display_name,
            "category": category,
            "before_score": before,
            "after_score": after,
            "target_score": target_score,
            "delta": delta,
            "improvement_percentage": delta,
            "remaining_gap": remaining_gap,
            "is_mastered": is_mastered,
            "is_improved": is_improved,
            "is_reattempted": attempts_count > 1,
            "attempts_count": attempts_count,
            "history": history_list
        })

    skills_progress.sort(key=lambda x: (1 if x["is_reattempted"] else 0, x["delta"]), reverse=True)
    avg_improvement = round(total_delta_sum / improved_count, 1) if improved_count > 0 else 0.0

    return {
        "skills_progress": skills_progress,
        "summary": {
            "total_assessed": len(skills_progress),
            "improved_count": improved_count,
            "mastered_count": mastered_count,
            "average_improvement": avg_improvement,
            "total_tests_taken": len(history_rows)
        }
    }


# ============================================================
# CAREER ROLE COMPARISON OPERATIONS
# ============================================================

def save_student_role_comparison(student_id: str, role_id: str, match_score: float, comparison_data: Dict[str, Any]) -> Dict[str, Any]:
    """Saves an evaluation comparison record for a student."""
    conn = get_connection()
    cursor = conn.cursor()
    comp_id = f"comp-{int(os.urandom(6).hex(), 16)}"
    data_json = json.dumps(comparison_data)
    cursor.execute("""
    INSERT INTO student_role_comparisons (id, student_id, role_id, match_score, comparison_data_json)
    VALUES (?, ?, ?, ?, ?)
    """, (comp_id, student_id, role_id, match_score, data_json))
    conn.commit()
    conn.close()
    return {"id": comp_id, "student_id": student_id, "role_id": role_id, "match_score": match_score}

def get_student_role_comparisons(student_id: str = "default_student") -> List[Dict[str, Any]]:
    """Fetches comparison history for a student."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM student_role_comparisons WHERE student_id = ? ORDER BY compared_at DESC
    """, (student_id,))
    rows = cursor.fetchall()
    conn.close()
    res = []
    for r in rows:
        d = dict(r)
        try:
            d["comparison_data"] = json.loads(d.get("comparison_data_json", "{}"))
        except:
            d["comparison_data"] = {}
        res.append(d)
    return res
