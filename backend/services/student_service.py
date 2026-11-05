"""
STATWISE AI - Student Skill Intelligence & Career Roadmap Service
Provides:
1. Role-based skill benchmarks for top career paths
2. Dynamic skill gap analysis comparing student proficiencies against role standards
3. AI-powered course and certification recommendations
4. Structured 4-phase personalized learning roadmaps
5. Curated learning resource integration
"""

from typing import Dict, List, Any, Optional
import os
import json

# ============================================================
# CAREER ROLES & BENCHMARK COMPETENCY CATALOG
# ============================================================

CAREER_ROLES = {
    "java_developer": {
        "id": "java_developer",
        "title": "Java Enterprise & Backend Developer",
        "category": "Software Engineering",
        "description": "Architects scalable microservices, enterprise systems, and high-throughput backends using Java, Spring Boot, and cloud databases.",
        "average_salary": "$125,000 / ₹18 LPA",
        "market_demand": "Very High",
        "skills": [
            {"name": "Java", "target_score": 85, "category": "Technical", "importance": "Critical"},
            {"name": "Data Structures & Algorithms", "target_score": 80, "category": "Technical", "importance": "Critical"},
            {"name": "SQL & Databases", "target_score": 80, "category": "Technical", "importance": "High"},
            {"name": "Backend APIs & Spring Boot", "target_score": 82, "category": "Technical", "importance": "High"},
            {"name": "Git & CI/CD DevOps", "target_score": 75, "category": "Technical", "importance": "Medium"},
            {"name": "Problem Solving & Critical Thinking", "target_score": 82, "category": "Professional", "importance": "High"},
            {"name": "Cloud Computing (AWS/GCP)", "target_score": 75, "category": "Technical", "importance": "Medium"},
            {"name": "Teamwork & Collaboration", "target_score": 75, "category": "Professional", "importance": "Medium"},
            {"name": "Communication & Presentation", "target_score": 75, "category": "Professional", "importance": "Medium"}
        ]
    },
    "ai_engineer": {
        "id": "ai_engineer",
        "title": "AI & Machine Learning Engineer",
        "category": "Artificial Intelligence",
        "description": "Designs, builds, and deploys scalable machine learning models, deep neural networks, and generative AI systems into production.",
        "icon": "BrainCircuit",
        "average_salary": "$135,000 / ₹22,00,000",
        "market_demand": "Very High",
        "skills": [
            {"name": "Python", "category": "Technical", "target_score": 88, "importance": "Critical"},
            {"name": "Machine Learning", "category": "Technical", "target_score": 85, "importance": "Critical"},
            {"name": "Deep Learning & Neural Networks", "category": "Technical", "target_score": 80, "importance": "High"},
            {"name": "Data Structures & Algorithms", "category": "Technical", "target_score": 78, "importance": "High"},
            {"name": "SQL & Databases", "category": "Technical", "target_score": 75, "importance": "Medium"},
            {"name": "Cloud Computing (AWS/GCP)", "category": "Technical", "target_score": 72, "importance": "Medium"},
            {"name": "Problem Solving & Critical Thinking", "category": "Professional", "target_score": 85, "importance": "Critical"},
            {"name": "Communication & Presentation", "category": "Professional", "target_score": 75, "importance": "Medium"},
            {"name": "Project & Time Management", "category": "Professional", "target_score": 72, "importance": "Medium"},
            {"name": "Ethical AI & Research Integrity", "category": "Professional", "target_score": 80, "importance": "High"},
        ]
    },
    "data_scientist": {
        "id": "data_scientist",
        "title": "Data Scientist",
        "category": "Data Science",
        "description": "Extracts actionable insights from complex datasets using advanced statistical modeling, exploratory analytics, and predictive machine learning.",
        "icon": "LineChart",
        "average_salary": "$125,000 / ₹18,00,000",
        "market_demand": "High",
        "skills": [
            {"name": "Python", "category": "Technical", "target_score": 85, "importance": "Critical"},
            {"name": "Statistics & Probability", "category": "Technical", "target_score": 85, "importance": "Critical"},
            {"name": "Data Analysis & Pandas", "category": "Technical", "target_score": 85, "importance": "Critical"},
            {"name": "Machine Learning", "category": "Technical", "target_score": 78, "importance": "High"},
            {"name": "Data Visualization & Storytelling", "category": "Technical", "target_score": 82, "importance": "High"},
            {"name": "SQL & Databases", "category": "Technical", "target_score": 80, "importance": "High"},
            {"name": "Problem Solving & Critical Thinking", "category": "Professional", "target_score": 82, "importance": "High"},
            {"name": "Communication & Presentation", "category": "Professional", "target_score": 80, "importance": "High"},
            {"name": "Business Domain Acumen", "category": "Professional", "target_score": 75, "importance": "Medium"},
            {"name": "Teamwork & Collaboration", "category": "Professional", "target_score": 75, "importance": "Medium"},
        ]
    },
    "full_stack_dev": {
        "id": "full_stack_dev",
        "title": "Full Stack Software Engineer",
        "category": "Software Engineering",
        "description": "Architects, implements, and maintains robust modern web applications covering frontend interfaces, backend APIs, and database persistence.",
        "icon": "Code2",
        "average_salary": "$115,000 / ₹15,00,000",
        "market_demand": "Very High",
        "skills": [
            {"name": "JavaScript & TypeScript", "category": "Technical", "target_score": 85, "importance": "Critical"},
            {"name": "React & Modern Frontend", "category": "Technical", "target_score": 85, "importance": "Critical"},
            {"name": "Backend APIs & Node/Python", "category": "Technical", "target_score": 82, "importance": "Critical"},
            {"name": "SQL & Databases", "category": "Technical", "target_score": 80, "importance": "High"},
            {"name": "Data Structures & Algorithms", "category": "Technical", "target_score": 78, "importance": "High"},
            {"name": "Git & CI/CD DevOps", "category": "Technical", "target_score": 75, "importance": "Medium"},
            {"name": "Problem Solving & Critical Thinking", "category": "Professional", "target_score": 82, "importance": "High"},
            {"name": "Teamwork & Collaboration", "category": "Professional", "target_score": 80, "importance": "High"},
            {"name": "Communication & Presentation", "category": "Professional", "target_score": 75, "importance": "Medium"},
            {"name": "Project & Time Management", "category": "Professional", "target_score": 75, "importance": "Medium"},
        ]
    },
    "cloud_architect": {
        "id": "cloud_architect",
        "title": "Cloud Solutions Architect",
        "category": "Cloud & Infrastructure",
        "description": "Designs scalable, fault-tolerant, and secure cloud computing topologies across AWS, Azure, or GCP for enterprise applications.",
        "icon": "Cloud",
        "average_salary": "$145,000 / ₹25,00,000",
        "market_demand": "Very High",
        "skills": [
            {"name": "Cloud Computing (AWS/GCP)", "category": "Technical", "target_score": 90, "importance": "Critical"},
            {"name": "Networking & Security", "category": "Technical", "target_score": 85, "importance": "Critical"},
            {"name": "DevOps & Infrastructure as Code", "category": "Technical", "target_score": 82, "importance": "High"},
            {"name": "SQL & Databases", "category": "Technical", "target_score": 78, "importance": "High"},
            {"name": "Python", "category": "Technical", "target_score": 75, "importance": "Medium"},
            {"name": "Problem Solving & Critical Thinking", "category": "Professional", "target_score": 85, "importance": "Critical"},
            {"name": "Communication & Presentation", "category": "Professional", "target_score": 82, "importance": "High"},
            {"name": "Project & Time Management", "category": "Professional", "target_score": 80, "importance": "High"},
            {"name": "Leadership & Mentorship", "category": "Professional", "target_score": 75, "importance": "Medium"},
            {"name": "Teamwork & Collaboration", "category": "Professional", "target_score": 75, "importance": "Medium"},
        ]
    },
    "cyber_security": {
        "id": "cyber_security",
        "title": "Cyber Security Analyst",
        "category": "Information Security",
        "description": "Monitors, analyzes, and safeguards organizational digital assets against cyber threats, vulnerabilities, and intrusion attacks.",
        "icon": "ShieldCheck",
        "average_salary": "$118,000 / ₹16,00,000",
        "market_demand": "High",
        "skills": [
            {"name": "Networking & Security", "category": "Technical", "target_score": 88, "importance": "Critical"},
            {"name": "Ethical Hacking & Penetration Testing", "category": "Technical", "target_score": 82, "importance": "Critical"},
            {"name": "Python", "category": "Technical", "target_score": 75, "importance": "High"},
            {"name": "Cloud Computing (AWS/GCP)", "category": "Technical", "target_score": 75, "importance": "Medium"},
            {"name": "SQL & Databases", "category": "Technical", "target_score": 72, "importance": "Medium"},
            {"name": "Problem Solving & Critical Thinking", "category": "Professional", "target_score": 88, "importance": "Critical"},
            {"name": "Ethical AI & Research Integrity", "category": "Professional", "target_score": 85, "importance": "High"},
            {"name": "Communication & Presentation", "category": "Professional", "target_score": 78, "importance": "High"},
            {"name": "Project & Time Management", "category": "Professional", "target_score": 75, "importance": "Medium"},
            {"name": "Teamwork & Collaboration", "category": "Professional", "target_score": 75, "importance": "Medium"},
        ]
    },
    "devops_engineer": {
        "id": "devops_engineer",
        "title": "DevOps & SRE Engineer",
        "category": "Platform & Infrastructure",
        "description": "Bridges software development and IT operations through automated continuous integration, deployment pipelines, containerization, and observability.",
        "icon": "Terminal",
        "average_salary": "$128,000 / ₹19,00,000",
        "market_demand": "High",
        "skills": [
            {"name": "Git & CI/CD DevOps", "category": "Technical", "target_score": 88, "importance": "Critical"},
            {"name": "Cloud Computing (AWS/GCP)", "category": "Technical", "target_score": 85, "importance": "Critical"},
            {"name": "DevOps & Infrastructure as Code", "category": "Technical", "target_score": 85, "importance": "Critical"},
            {"name": "Python", "category": "Technical", "target_score": 78, "importance": "High"},
            {"name": "Networking & Security", "category": "Technical", "target_score": 75, "importance": "Medium"},
            {"name": "Problem Solving & Critical Thinking", "category": "Professional", "target_score": 82, "importance": "High"},
            {"name": "Teamwork & Collaboration", "category": "Professional", "target_score": 82, "importance": "High"},
            {"name": "Communication & Presentation", "category": "Professional", "target_score": 75, "importance": "Medium"},
            {"name": "Project & Time Management", "category": "Professional", "target_score": 75, "importance": "Medium"},
            {"name": "Ethical AI & Research Integrity", "category": "Professional", "target_score": 70, "importance": "Low"},
        ]
    },
    "statistical_officer": {
        "id": "statistical_officer",
        "title": "Statistical Officer",
        "category": "Statistics & Analytics",
        "description": "Conducts governmental and organizational statistical surveys, data audits, inferential analyses, and public policy reporting.",
        "icon": "BarChart3",
        "average_salary": "$95,000 / ₹12,00,000",
        "market_demand": "Stable",
        "skills": [
            {"name": "Statistics & Probability", "category": "Technical", "target_score": 88, "importance": "Critical"},
            {"name": "Data Analysis & Pandas", "category": "Technical", "target_score": 82, "importance": "Critical"},
            {"name": "Data Visualization & Storytelling", "category": "Technical", "target_score": 78, "importance": "High"},
            {"name": "Python", "category": "Technical", "target_score": 75, "importance": "High"},
            {"name": "SQL & Databases", "category": "Technical", "target_score": 70, "importance": "Medium"},
            {"name": "Communication & Presentation", "category": "Professional", "target_score": 82, "importance": "High"},
            {"name": "Problem Solving & Critical Thinking", "category": "Professional", "target_score": 80, "importance": "High"},
            {"name": "Ethical AI & Research Integrity", "category": "Professional", "target_score": 80, "importance": "High"},
            {"name": "Project & Time Management", "category": "Professional", "target_score": 75, "importance": "Medium"},
            {"name": "Teamwork & Collaboration", "category": "Professional", "target_score": 72, "importance": "Medium"},
        ]
    },
    "product_manager": {
        "id": "product_manager",
        "title": "Technical Product Manager",
        "category": "Product & Strategy",
        "description": "Drives product vision, feature prioritization, technical roadmaps, and stakeholder alignment for digital products.",
        "icon": "Target",
        "average_salary": "$138,000 / ₹22,00,000",
        "market_demand": "High",
        "skills": [
            {"name": "Communication & Presentation", "category": "Professional", "target_score": 90, "importance": "Critical"},
            {"name": "Project & Time Management", "category": "Professional", "target_score": 88, "importance": "Critical"},
            {"name": "Problem Solving & Critical Thinking", "category": "Professional", "target_score": 85, "importance": "High"},
            {"name": "Leadership & Mentorship", "category": "Professional", "target_score": 82, "importance": "High"},
            {"name": "Teamwork & Collaboration", "category": "Professional", "target_score": 85, "importance": "High"},
            {"name": "Data Analysis & Pandas", "category": "Technical", "target_score": 75, "importance": "High"},
            {"name": "Data Visualization & Storytelling", "category": "Technical", "target_score": 75, "importance": "Medium"},
            {"name": "SQL & Databases", "category": "Technical", "target_score": 70, "importance": "Medium"},
            {"name": "Python", "category": "Technical", "target_score": 65, "importance": "Low"},
            {"name": "Ethical AI & Research Integrity", "category": "Professional", "target_score": 78, "importance": "Medium"},
        ]
    }
}

# ============================================================
# CERTIFICATION & COURSE MASTER CATALOG
# ============================================================

CERTIFICATION_CATALOG = [
    {
        "id": "cert-aws-ml",
        "title": "AWS Certified Machine Learning - Specialty",
        "provider": "Amazon Web Services",
        "type": "Professional Certification",
        "category": "Technical",
        "skills_addressed": ["Machine Learning", "Cloud Computing (AWS/GCP)", "Deep Learning & Neural Networks"],
        "level": "Advanced",
        "duration": "40-60 hours",
        "credential_type": "Industry Recognized Exam",
        "rating": 4.9,
        "learners": "145k+",
        "url": "https://aws.amazon.com/certification/certified-machine-learning-specialty/",
        "icon_bg": "#FF9900",
        "badge_name": "AWS ML Specialist"
    },
    {
        "id": "cert-google-data-engineer",
        "title": "Google Cloud Professional Data Engineer",
        "provider": "Google Cloud",
        "type": "Professional Certification",
        "category": "Technical",
        "skills_addressed": ["Data Analysis & Pandas", "SQL & Databases", "Cloud Computing (AWS/GCP)"],
        "level": "Advanced",
        "duration": "50 hours",
        "credential_type": "Industry Recognized Exam",
        "rating": 4.8,
        "learners": "120k+",
        "url": "https://cloud.google.com/learn/certification/data-engineer",
        "icon_bg": "#4285F4",
        "badge_name": "GCP Data Engineer"
    },
    {
        "id": "cert-meta-fullstack",
        "title": "Meta Front-End & Back-End Professional Certificate",
        "provider": "Meta (via Coursera)",
        "type": "Professional Specialization",
        "category": "Technical",
        "skills_addressed": ["JavaScript & TypeScript", "React & Modern Frontend", "Backend APIs & Node/Python"],
        "level": "Intermediate",
        "duration": "7 months (6 hrs/wk)",
        "credential_type": "Coursera Professional Certificate",
        "rating": 4.8,
        "learners": "350k+",
        "url": "https://www.coursera.org/professional-certificates/meta-front-end-developer",
        "icon_bg": "#0668E1",
        "badge_name": "Meta Certified Developer"
    },
    {
        "id": "cert-deeplearning-ai-spec",
        "title": "Deep Learning Specialization (Andrew Ng)",
        "provider": "DeepLearning.AI",
        "type": "Specialization & Capstone",
        "category": "Technical",
        "skills_addressed": ["Deep Learning & Neural Networks", "Python", "Machine Learning"],
        "level": "Intermediate to Advanced",
        "duration": "3 months (8 hrs/wk)",
        "credential_type": "DeepLearning.AI Certificate",
        "rating": 4.9,
        "learners": "980k+",
        "url": "https://www.deeplearning.ai/courses/deep-learning-specialization/",
        "icon_bg": "#FF5722",
        "badge_name": "Deep Learning Master"
    },
    {
        "id": "cert-comptia-sec",
        "title": "CompTIA Security+ (SY0-701)",
        "provider": "CompTIA",
        "type": "Industry Security Certification",
        "category": "Technical",
        "skills_addressed": ["Networking & Security", "Ethical Hacking & Penetration Testing"],
        "level": "Intermediate",
        "duration": "45 hours",
        "credential_type": "Global ISO/ANSI Accredited",
        "rating": 4.8,
        "learners": "600k+",
        "url": "https://www.comptia.org/certifications/security",
        "icon_bg": "#C8102E",
        "badge_name": "CompTIA Security+ Certified"
    },
    {
        "id": "cert-pmi-capm",
        "title": "Certified Associate in Project Management (CAPM)",
        "provider": "Project Management Institute (PMI)",
        "type": "Professional Certification",
        "category": "Professional",
        "skills_addressed": ["Project & Time Management", "Leadership & Mentorship", "Teamwork & Collaboration"],
        "level": "Beginner to Intermediate",
        "duration": "35 contact hours",
        "credential_type": "Global PMI Credential",
        "rating": 4.7,
        "learners": "200k+",
        "url": "https://www.pmi.org/certifications/certified-associate-capm",
        "icon_bg": "#005596",
        "badge_name": "PMI CAPM Certified"
    },
    {
        "id": "cert-mckinsey-comm",
        "title": "Executive Business Communication & Storytelling",
        "provider": "Northwestern University (Coursera)",
        "type": "Professional Certificate",
        "category": "Professional",
        "skills_addressed": ["Communication & Presentation", "Data Visualization & Storytelling", "Problem Solving & Critical Thinking"],
        "level": "All Levels",
        "duration": "20 hours",
        "credential_type": "University Verified Certificate",
        "rating": 4.8,
        "learners": "180k+",
        "url": "https://www.coursera.org/specializations/business-communications",
        "icon_bg": "#4E2A84",
        "badge_name": "Executive Storyteller"
    },
    {
        "id": "cert-mit-algorithms",
        "title": "Design & Analysis of Algorithms",
        "provider": "MIT OpenCourseWare & edX",
        "type": "Advanced Academic Course",
        "category": "Technical",
        "skills_addressed": ["Data Structures & Algorithms", "Problem Solving & Critical Thinking"],
        "level": "Advanced",
        "duration": "12 weeks (8 hrs/wk)",
        "credential_type": "MITx Verified Certificate",
        "rating": 4.9,
        "learners": "420k+",
        "url": "https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/",
        "icon_bg": "#A31F34",
        "badge_name": "Algorithms Scholar"
    }
]

# ============================================================
# CURATED LEARNING RESOURCES DIRECTORY
# ============================================================

LEARNING_RESOURCES = [
    {
        "id": "res-python-official",
        "title": "Official Python Documentation & Tutorial",
        "skill": "Python",
        "category": "Technical",
        "type": "Documentation",
        "is_free": True,
        "duration": "Self-paced",
        "url": "https://docs.python.org/3/tutorial/",
        "description": "Comprehensive reference guide and interactive walkthrough for core Python standard libraries, data types, and asynchronous paradigms."
    },
    {
        "id": "res-kaggle-ml",
        "title": "Kaggle Learn: Intro to Machine Learning & Intermediate ML",
        "skill": "Machine Learning",
        "category": "Technical",
        "type": "Interactive Lab",
        "is_free": True,
        "duration": "12 hours",
        "url": "https://www.kaggle.com/learn/intro-to-machine-learning",
        "description": "Hands-on browser-based Jupyter notebooks with real datasets, covering decision trees, random forests, and validation techniques."
    },
    {
        "id": "res-fastai-dl",
        "title": "Practical Deep Learning for Coders",
        "skill": "Deep Learning & Neural Networks",
        "category": "Technical",
        "type": "Video Course",
        "is_free": True,
        "duration": "30 hours",
        "url": "https://course.fast.ai/",
        "description": "Top-rated practical deep learning course taught by Jeremy Howard using PyTorch and fastai."
    },
    {
        "id": "res-neetcode-dsa",
        "title": "NeetCode: Data Structures & Algorithms Roadmap",
        "skill": "Data Structures & Algorithms",
        "category": "Technical",
        "type": "Interactive Playground",
        "is_free": True,
        "duration": "Ongoing",
        "url": "https://neetcode.io/roadmap",
        "description": "Interactive visual tree and video walkthroughs of top coding interview patterns in Python, C++, and Java."
    },
    {
        "id": "res-mode-sql",
        "title": "Mode Analytics SQL Tutorial for Data Analysis",
        "skill": "SQL & Databases",
        "category": "Technical",
        "type": "Interactive Lab",
        "is_free": True,
        "duration": "10 hours",
        "url": "https://mode.com/sql-tutorial/",
        "description": "Real SQL queries against actual relational database schemas, from basic SELECTs to advanced window functions and aggregations."
    },
    {
        "id": "res-react-dev",
        "title": "Official React Documentation & Interactive Sandbox",
        "skill": "React & Modern Frontend",
        "category": "Technical",
        "type": "Documentation",
        "is_free": True,
        "duration": "15 hours",
        "url": "https://react.dev/learn",
        "description": "The newly rewritten interactive React documentation with hands-on exercises and component state mental models."
    },
    {
        "id": "res-harvard-cs50",
        "title": "Harvard CS50: Introduction to Computer Science",
        "skill": "Problem Solving & Critical Thinking",
        "category": "Technical",
        "type": "Video Course",
        "is_free": True,
        "duration": "40 hours",
        "url": "https://cs50.harvard.edu/x/",
        "description": "World-renowned computational thinking and problem solving masterclass taught by Professor David J. Malan."
    },
    {
        "id": "res-toastmasters-comm",
        "title": "TED Masterclass: The Official Guide to Public Speaking",
        "skill": "Communication & Presentation",
        "category": "Professional",
        "type": "Book / Audio",
        "is_free": False,
        "duration": "6 hours",
        "url": "https://www.ted.com/participate/ted-masterclass",
        "description": "Learn how to structure compelling arguments, present technical concepts simply, and captivate audiences."
    },
    {
        "id": "res-hbr-pm",
        "title": "Harvard Business Review Guide to Project Management",
        "skill": "Project & Time Management",
        "category": "Professional",
        "type": "Article / Guide",
        "is_free": True,
        "duration": "4 hours",
        "url": "https://hbr.org/topic/subject/project-management",
        "description": "Practical frameworks for scoping milestones, managing dependencies, and balancing trade-offs in technical projects."
    }
]

# ============================================================
# HELPER FUNCTIONS
# ============================================================

def get_all_roles() -> List[Dict[str, Any]]:
    """Returns all available career roles."""
    return list(CAREER_ROLES.values())

def get_role_by_id(role_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves a specific role definition."""
    clean_id = role_id.lower().replace(" ", "_").replace("-", "_")
    return CAREER_ROLES.get(clean_id) or CAREER_ROLES.get("ai_engineer")

def calculate_skill_gaps(role_id: str, student_skills: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Compares the student's current skill proficiencies against the target role benchmarks.
    Gaps are genuine and calculated strictly from real skill test results.
    Unassessed skills are explicitly marked as is_assessed=False with current_score=None.
    """
    role = get_role_by_id(role_id)
    if not role:
        role = CAREER_ROLES["ai_engineer"]

    # Convert student skills into a lookup dict
    student_map = {}
    for item in student_skills:
        name = item.get("name") or item.get("skill") or ""
        score = item.get("current_score") if item.get("current_score") is not None else item.get("currentScore")
        if score is None:
            score = item.get("score")
        if score is not None:
            student_map[name.strip().lower()] = float(score)

    gaps = []
    total_target = 0
    total_current = 0
    assessed_target = 0
    assessed_current = 0
    assessed_count = 0
    critical_count = 0
    high_count = 0

    for req in role["skills"]:
        skill_name = req["name"]
        target = req["target_score"]
        category = req.get("category", "Technical")
        importance = req.get("importance", "Medium")

        current = student_map.get(skill_name.lower())
        is_assessed = True
        if current is None:
            # Check partial match
            matched = False
            for s_name, s_val in student_map.items():
                if s_name in skill_name.lower() or skill_name.lower() in s_name:
                    current = s_val
                    matched = True
                    break
            if not matched:
                is_assessed = False
                current = None

        total_target += target

        if is_assessed:
            assessed_count += 1
            gap = max(0.0, target - current)
            total_current += min(current, target)
            assessed_target += target
            assessed_current += min(current, target)

            if gap >= 25:
                severity = "Critical Gap"
                critical_count += 1
                action = f"Critical deficit of {round(gap, 1)}% in {skill_name}. Allocate 25-30 hours of structured drills and coursework."
            elif gap >= 15:
                severity = "High Gap"
                high_count += 1
                action = f"High priority gap of {round(gap, 1)}% in {skill_name}. Complete intermediate projects to elevate proficiency."
            elif gap >= 5:
                severity = "Moderate Gap"
                action = f"Moderate gap of {round(gap, 1)}% in {skill_name}. Practice advanced problems and review edge cases."
            else:
                severity = "Benchmark Achieved"
                action = f"Benchmark achieved in {skill_name} ({round(current, 1)}% >= {target}%). Maintain proficiency with periodic drills."
        else:
            gap = float(target)
            severity = "Not Yet Assessed"
            action = f"Not yet assessed. Take the CodeChef 20-question skill test to evaluate genuine competency in {skill_name}."

        gaps.append({
            "skill": skill_name,
            "category": category,
            "current_score": round(current, 1) if is_assessed else None,
            "currentScore": round(current, 1) if is_assessed else None,
            "target_score": target,
            "targetScore": target,
            "gap": round(gap, 1),
            "is_assessed": is_assessed,
            "isAssessed": is_assessed,
            "severity": severity,
            "importance": importance,
            "action_advice": action,
            "estimated_hours_to_close": int(gap * 1.2) if gap > 0 else 0
        })

    # Sort: assessed skills first (highest gap first), then unassessed skills by importance
    def sort_key(x):
        is_ass = 1 if x["is_assessed"] else 0
        imp_weight = 3 if x["importance"] == "Critical" else (2 if x["importance"] == "High" else 1)
        return (is_ass, x["gap"], imp_weight)

    gaps.sort(key=sort_key, reverse=True)

    readiness_percentage = round((assessed_current / assessed_target) * 100, 1) if assessed_target > 0 else 0.0

    return {
        "role_id": role["id"],
        "role_title": role["title"],
        "readiness_percentage": readiness_percentage,
        "assessed_skills_count": assessed_count,
        "total_skills_count": len(role["skills"]),
        "critical_gaps_count": critical_count,
        "high_gaps_count": high_count,
        "gaps": gaps,
        "summary": (
            f"You are currently {readiness_percentage}% aligned with {role['title']} across {assessed_count} assessed skill(s). "
            f"Closing {critical_count + high_count} identified gap(s) will bring you to industry job-readiness."
            if assessed_count > 0 else
            f"Take your first CodeChef skill test to evaluate your competency against {role['title']}."
        )
    }


# ============================================================
# COMPREHENSIVE AI COURSE & CERTIFICATION RECOMMENDATION ENGINE
# ============================================================

# test_rec_builder.py
import json

import re

def matches_skill_strict(course_skill: str, target_skill: str) -> bool:
    """
    Performs precise semantic skill matching.
    Critically ensures 'Java' NEVER falsely matches 'JavaScript',
    and 'C' NEVER falsely matches 'C++', 'C#', or 'Cloud'.
    """
    if not course_skill or not target_skill:
        return False
    c = course_skill.strip().lower()
    t = target_skill.strip().lower()
    if c == t:
        return True
    # Prevent Java from matching JavaScript
    if t == "java" and "javascript" in c:
        return False
    if c == "java" and "javascript" in t:
        return False
    # Prevent C from matching C++, C#, CSS, Cloud
    if t == "c":
        return c in ["c", "c programming", "c language"] or c.startswith("c /") or c.endswith("/ c")
    # Substring with word boundary check
    escaped = re.escape(t)
    return bool(re.search(rf"(^|[^a-z0-9]){escaped}([^a-z0-9]|$)", c))


COURSES_CATALOG = [
    {
        "id": "rec-coursera-ml-spec",
        "title": "Machine Learning Specialization \u2013 Coursera",
        "short_title": "Machine Learning Specialization",
        "provider": "Coursera",
        "institution": "DeepLearning.AI & Stanford Online",
        "instructor": "Andrew Ng",
        "skills_addressed": [
            "Machine Learning",
            "Python",
            "Data Analysis & Pandas"
        ],
        "primary_skill": "Machine Learning",
        "difficulty": "Beginner to Intermediate",
        "duration": "3 months (8 hrs/wk)",
        "duration_hours": 96,
        "duration_type": "Specialization",
        "has_certificate": True,
        "certificate_type": "Stanford / DeepLearning.AI Coursera Verified Certificate",
        "rating": 4.9,
        "learners": "950k+",
        "url": "https://www.coursera.org/specializations/machine-learning-introduction",
        "icon_bg": "#0056D2",
        "badge_name": "Stanford ML Master",
        "is_free": False,
        "free_audit": True,
        "overview": "The world-renowned foundation course created by Andrew Ng and Stanford. Master supervised learning, decision trees, neural networks, and best ML practices."
    },
    {
        "id": "rec-kaggle-intro-ml",
        "title": "Introduction to Machine Learning \u2013 Kaggle",
        "short_title": "Intro to Machine Learning",
        "provider": "Kaggle",
        "institution": "Kaggle Learn",
        "instructor": "Dan Becker (Kaggle)",
        "skills_addressed": [
            "Machine Learning",
            "Python"
        ],
        "primary_skill": "Machine Learning",
        "difficulty": "Beginner",
        "duration": "12 hours (Hands-on labs)",
        "duration_hours": 12,
        "duration_type": "Micro-course",
        "has_certificate": True,
        "certificate_type": "Kaggle Micro-Course Certificate & Profile Badge",
        "rating": 4.8,
        "learners": "680k+",
        "url": "https://www.kaggle.com/learn/intro-to-machine-learning",
        "icon_bg": "#20BEFF",
        "badge_name": "Kaggle ML Scholar",
        "is_free": True,
        "free_audit": True,
        "overview": "Interactive browser-based Jupyter notebooks with real datasets. Learn model validation, decision trees, random forests, and scikit-learn without installing anything."
    },
    {
        "id": "rec-nptel-ml",
        "title": "Machine Learning courses \u2013 NPTEL",
        "short_title": "Machine Learning (IIT Madras)",
        "provider": "NPTEL",
        "institution": "IIT Madras & Ministry of Education",
        "instructor": "Prof. Balaraman Ravindran (IIT Madras)",
        "skills_addressed": [
            "Machine Learning",
            "Statistics & Probability",
            "Data Analysis & Pandas"
        ],
        "primary_skill": "Machine Learning",
        "difficulty": "Intermediate to Advanced",
        "duration": "12 weeks (Semester course)",
        "duration_hours": 48,
        "duration_type": "Academic Semester",
        "has_certificate": True,
        "certificate_type": "NPTEL & IIT Madras Proctored Elite Examination Certificate",
        "rating": 4.9,
        "learners": "320k+",
        "url": "https://nptel.ac.in/courses/106106139",
        "icon_bg": "#8B1E0F",
        "badge_name": "IIT Madras ML Fellow",
        "is_free": True,
        "free_audit": True,
        "overview": "Rigorous academic curriculum covering statistical learning theory, PAC learning, SVMs, Bayesian reasoning, and kernel methods taught by leading IIT professors."
    },
    {
        "id": "rec-kaggle-intermediate-ml",
        "title": "Intermediate Machine Learning \u2013 Kaggle",
        "short_title": "Intermediate ML Track",
        "provider": "Kaggle",
        "institution": "Kaggle Learn",
        "instructor": "Alexis Cook (Kaggle)",
        "skills_addressed": [
            "Machine Learning",
            "Data Analysis & Pandas"
        ],
        "primary_skill": "Machine Learning",
        "difficulty": "Intermediate",
        "duration": "15 hours (Hands-on labs)",
        "duration_hours": 15,
        "duration_type": "Micro-course",
        "has_certificate": True,
        "certificate_type": "Kaggle Intermediate ML Badge",
        "rating": 4.8,
        "learners": "410k+",
        "url": "https://www.kaggle.com/learn/intermediate-machine-learning",
        "icon_bg": "#20BEFF",
        "badge_name": "Kaggle ML Practitioner",
        "is_free": True,
        "free_audit": True,
        "overview": "Tackle missing values, non-numeric categorical variables, data leakage prevention, and advanced gradient boosting with XGBoost."
    },
    {
        "id": "rec-aws-ml-spec",
        "title": "AWS Certified Machine Learning - Specialty",
        "short_title": "AWS ML Specialty Certification",
        "provider": "AWS",
        "institution": "Amazon Web Services",
        "instructor": "AWS Certification Team",
        "skills_addressed": [
            "Machine Learning",
            "Cloud Computing (AWS/GCP)",
            "Deep Learning & Neural Networks"
        ],
        "primary_skill": "Machine Learning",
        "difficulty": "Advanced",
        "duration": "40-60 hours",
        "duration_hours": 50,
        "duration_type": "Industry Exam Prep",
        "has_certificate": True,
        "certificate_type": "AWS Certified Specialty Global Credential",
        "rating": 4.9,
        "learners": "145k+",
        "url": "https://aws.amazon.com/certification/certified-machine-learning-specialty/",
        "icon_bg": "#FF9900",
        "badge_name": "AWS ML Specialist",
        "is_free": False,
        "free_audit": False,
        "overview": "Validates enterprise capability to design, implement, deploy, and maintain machine learning solutions on Amazon Web Services SageMaker."
    },
    {
        "id": "rec-mit-ml",
        "title": "MIT 6.036: Introduction to Machine Learning",
        "short_title": "MIT Machine Learning (6.036)",
        "provider": "edX",
        "institution": "MIT OpenCourseWare",
        "instructor": "Prof. Leslie Kaelbling & Prof. Tomas Lozano-Perez",
        "skills_addressed": [
            "Machine Learning",
            "Statistics & Probability",
            "Problem Solving & Critical Thinking"
        ],
        "primary_skill": "Machine Learning",
        "difficulty": "Advanced",
        "duration": "14 weeks (10 hrs/wk)",
        "duration_hours": 140,
        "duration_type": "Academic Semester",
        "has_certificate": True,
        "certificate_type": "MITx Verified Academic Certificate",
        "rating": 4.9,
        "learners": "280k+",
        "url": "https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/",
        "icon_bg": "#A31F34",
        "badge_name": "MIT ML Scholar",
        "is_free": True,
        "free_audit": True,
        "overview": "Rigorous MIT engineering approach to machine learning: empirical risk minimization, gradient descent algorithms, reinforcement learning, and kernel tricks."
    },
    {
        "id": "rec-ibm-ml-spec",
        "title": "IBM Machine Learning Professional Certificate \u2013 Coursera",
        "short_title": "IBM Machine Learning Certificate",
        "provider": "Coursera",
        "institution": "IBM Skills Network",
        "instructor": "IBM Data Science Specialists",
        "skills_addressed": [
            "Machine Learning",
            "Python",
            "Data Analysis & Pandas"
        ],
        "primary_skill": "Machine Learning",
        "difficulty": "Intermediate",
        "duration": "3 months (6 hrs/wk)",
        "duration_hours": 72,
        "duration_type": "Professional Certificate",
        "has_certificate": True,
        "certificate_type": "IBM Professional Certificate & Digital Badge",
        "rating": 4.7,
        "learners": "320k+",
        "url": "https://www.coursera.org/professional-certificates/ibm-machine-learning",
        "icon_bg": "#052FAD",
        "badge_name": "IBM Certified ML Specialist",
        "is_free": False,
        "free_audit": True,
        "overview": "Practical machine learning: regression, classification, clustering, time series forecasting, and survival analysis with hands-on labs on IBM Watson Studio."
    },
    {
        "id": "rec-fcc-ml-python",
        "title": "Machine Learning with Python Certification \u2013 freeCodeCamp",
        "short_title": "freeCodeCamp Machine Learning",
        "provider": "freeCodeCamp",
        "institution": "freeCodeCamp.org",
        "instructor": "Tim Ruscica (Tech With Tim)",
        "skills_addressed": [
            "Machine Learning",
            "Python",
            "Deep Learning & Neural Networks"
        ],
        "primary_skill": "Machine Learning",
        "difficulty": "Intermediate",
        "duration": "300 hours (Comprehensive)",
        "duration_hours": 100,
        "duration_type": "Self-Paced Certification",
        "has_certificate": True,
        "certificate_type": "freeCodeCamp Verified Certification",
        "rating": 4.8,
        "learners": "550k+",
        "url": "https://www.freecodecamp.org/learn/machine-learning-with-python/",
        "icon_bg": "#0A0A23",
        "badge_name": "freeCodeCamp ML Engineer",
        "is_free": True,
        "free_audit": True,
        "overview": "Learn TensorFlow, neural networks, natural language processing with RNNs, reinforcement learning with Q-learning, and complete 5 practical ML projects."
    },
    {
        "id": "rec-gcp-ml-engineer",
        "title": "Google Cloud Professional Machine Learning Engineer",
        "short_title": "Google Cloud ML Engineer",
        "provider": "Google Cloud",
        "institution": "Google Cloud Training",
        "instructor": "Google Cloud Engineers",
        "skills_addressed": [
            "Machine Learning",
            "Cloud Computing (AWS/GCP)",
            "Data Analysis & Pandas"
        ],
        "primary_skill": "Machine Learning",
        "difficulty": "Advanced",
        "duration": "50 hours",
        "duration_hours": 50,
        "duration_type": "Industry Exam Prep",
        "has_certificate": True,
        "certificate_type": "Google Cloud Certified Professional Credential",
        "rating": 4.9,
        "learners": "110k+",
        "url": "https://cloud.google.com/learn/certification/machine-learning-engineer",
        "icon_bg": "#4285F4",
        "badge_name": "GCP Certified ML Engineer",
        "is_free": False,
        "free_audit": False,
        "overview": "Validates enterprise capability to architect, build, and productionize machine learning models using Vertex AI, BigQuery ML, and TensorFlow pipelines."
    },
    {
        "id": "rec-harvard-cs50-ai",
        "title": "Harvard CS50's Introduction to Artificial Intelligence with Python",
        "short_title": "Harvard CS50 AI",
        "provider": "edX",
        "institution": "Harvard University",
        "instructor": "Prof. David J. Malan & Brian Yu",
        "skills_addressed": [
            "Machine Learning",
            "Python",
            "Problem Solving & Critical Thinking"
        ],
        "primary_skill": "Machine Learning",
        "difficulty": "Intermediate",
        "duration": "7 weeks (10-30 hrs/wk)",
        "duration_hours": 80,
        "duration_type": "Academic Short-course",
        "has_certificate": True,
        "certificate_type": "HarvardX Verified Certificate",
        "rating": 4.9,
        "learners": "620k+",
        "url": "https://cs50.harvard.edu/ai/",
        "icon_bg": "#A51C30",
        "badge_name": "Harvard AI Scholar",
        "is_free": True,
        "free_audit": True,
        "overview": "Graph search algorithms, adversarial search, probability, Bayesian networks, Markov models, constraint satisfaction, and machine learning."
    },
    {
        "id": "rec-coursera-python-michigan",
        "title": "Programming for Everybody (Getting Started with Python) \u2013 Coursera",
        "short_title": "Python for Everybody",
        "provider": "Coursera",
        "institution": "University of Michigan",
        "instructor": "Dr. Charles Severance",
        "skills_addressed": [
            "Python"
        ],
        "primary_skill": "Python",
        "difficulty": "Beginner",
        "duration": "7 weeks (3 hrs/wk)",
        "duration_hours": 21,
        "duration_type": "Short-course",
        "has_certificate": True,
        "certificate_type": "University of Michigan Verified Certificate",
        "rating": 4.8,
        "learners": "3.1M+",
        "url": "https://www.coursera.org/learn/python",
        "icon_bg": "#0056D2",
        "badge_name": "Python Foundation Master",
        "is_free": False,
        "free_audit": True,
        "overview": "The world's most popular introductory Python course. Teaches variables, conditional execution, repeated loops, and functions using Python 3."
    },
    {
        "id": "rec-coursera-python3-spec",
        "title": "Python 3 Programming Specialization \u2013 Coursera",
        "short_title": "Python 3 Specialization",
        "provider": "Coursera",
        "institution": "University of Michigan",
        "instructor": "Paul Resnick & Christopher Brooks",
        "skills_addressed": [
            "Python",
            "Data Structures & Algorithms"
        ],
        "primary_skill": "Python",
        "difficulty": "Intermediate",
        "duration": "5 months (7 hrs/wk)",
        "duration_hours": 80,
        "duration_type": "Specialization",
        "has_certificate": True,
        "certificate_type": "University of Michigan Specialization Certificate",
        "rating": 4.7,
        "learners": "480k+",
        "url": "https://www.coursera.org/specializations/python-3-programming",
        "icon_bg": "#0056D2",
        "badge_name": "Python 3 Specialist",
        "is_free": False,
        "free_audit": True,
        "overview": "Deep dive into Python 3: dictionary sorting, lambda expressions, list comprehensions, object-oriented design, and external third-party API integration."
    },
    {
        "id": "rec-kaggle-python",
        "title": "Python Micro-Course \u2013 Kaggle",
        "short_title": "Kaggle Python Track",
        "provider": "Kaggle",
        "institution": "Kaggle Learn",
        "instructor": "Colin Morris (Kaggle)",
        "skills_addressed": [
            "Python"
        ],
        "primary_skill": "Python",
        "difficulty": "Beginner",
        "duration": "5 hours (Interactive labs)",
        "duration_hours": 5,
        "duration_type": "Micro-course",
        "has_certificate": True,
        "certificate_type": "Kaggle Python Certificate & Badge",
        "rating": 4.8,
        "learners": "520k+",
        "url": "https://www.kaggle.com/learn/python",
        "icon_bg": "#20BEFF",
        "badge_name": "Kaggle Python Coder",
        "is_free": True,
        "free_audit": True,
        "overview": "Fast, hands-on introduction to the essential Python syntax, standard libraries, list comprehensions, and external packages needed for data science."
    },
    {
        "id": "rec-nptel-python",
        "title": "The Joy of Computing using Python \u2013 NPTEL",
        "short_title": "Joy of Computing using Python",
        "provider": "NPTEL",
        "institution": "IIT Ropar",
        "instructor": "Prof. Sudarshan Iyengar (IIT Ropar)",
        "skills_addressed": [
            "Python",
            "Problem Solving & Critical Thinking"
        ],
        "primary_skill": "Python",
        "difficulty": "Beginner to Intermediate",
        "duration": "12 weeks (Semester course)",
        "duration_hours": 40,
        "duration_type": "Academic Semester",
        "has_certificate": True,
        "certificate_type": "NPTEL & IIT Ropar Proctored Certificate",
        "rating": 4.9,
        "learners": "410k+",
        "url": "https://nptel.ac.in/courses/106106182",
        "icon_bg": "#8B1E0F",
        "badge_name": "IIT Ropar Python Scholar",
        "is_free": True,
        "free_audit": True,
        "overview": "Playful and rigorous introduction to Python programming through interactive game design, natural language analysis, and algorithmic reasoning."
    },
    {
        "id": "rec-mit-python",
        "title": "MIT 6.00.1x: Introduction to Computer Science and Programming Using Python",
        "short_title": "MIT CS & Python (6.00.1x)",
        "provider": "edX",
        "institution": "Massachusetts Institute of Technology (MIT)",
        "instructor": "Prof. John Guttag & Prof. Eric Grimson",
        "skills_addressed": [
            "Python",
            "Data Structures & Algorithms",
            "Problem Solving & Critical Thinking"
        ],
        "primary_skill": "Python",
        "difficulty": "Intermediate",
        "duration": "9 weeks (14 hrs/wk)",
        "duration_hours": 90,
        "duration_type": "Academic Semester",
        "has_certificate": True,
        "certificate_type": "MITx Verified Certificate",
        "rating": 4.9,
        "learners": "1.4M+",
        "url": "https://www.edx.org/course/introduction-to-computer-science-and-programming-7",
        "icon_bg": "#A31F34",
        "badge_name": "MIT Computational Thinker",
        "is_free": True,
        "free_audit": True,
        "overview": "Computation fundamentals, algorithmic complexity, testing and debugging, object-oriented programming, and simulation models in Python."
    },
    {
        "id": "rec-fcc-scientific-python",
        "title": "Scientific Computing with Python \u2013 freeCodeCamp",
        "short_title": "Scientific Computing with Python",
        "provider": "freeCodeCamp",
        "institution": "freeCodeCamp.org",
        "instructor": "Dr. Charles Severance",
        "skills_addressed": [
            "Python",
            "Problem Solving & Critical Thinking"
        ],
        "primary_skill": "Python",
        "difficulty": "Beginner to Intermediate",
        "duration": "300 hours (Self-paced)",
        "duration_hours": 60,
        "duration_type": "Self-Paced Certification",
        "has_certificate": True,
        "certificate_type": "freeCodeCamp Verified Certification",
        "rating": 4.8,
        "learners": "890k+",
        "url": "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
        "icon_bg": "#0A0A23",
        "badge_name": "freeCodeCamp Python Master",
        "is_free": True,
        "free_audit": True,
        "overview": "Learn pure Python algorithms, string formatting, arithmetic formatters, polygon area calculators, and probability calculators."
    },
    {
        "id": "rec-coursera-sql-ucdavis",
        "title": "SQL for Data Science \u2013 Coursera",
        "short_title": "SQL for Data Science",
        "provider": "Coursera",
        "institution": "University of California, Davis",
        "instructor": "Sadie St. Lawrence",
        "skills_addressed": [
            "SQL & Databases",
            "Data Analysis & Pandas"
        ],
        "primary_skill": "SQL & Databases",
        "difficulty": "Beginner",
        "duration": "4 weeks (4 hrs/wk)",
        "duration_hours": 16,
        "duration_type": "Short-course",
        "has_certificate": True,
        "certificate_type": "UC Davis / Coursera Certificate",
        "rating": 4.6,
        "learners": "680k+",
        "url": "https://www.coursera.org/learn/sql-for-data-science",
        "icon_bg": "#0056D2",
        "badge_name": "UC Davis SQL Analyst",
        "is_free": False,
        "free_audit": True,
        "overview": "Learn SQL queries from fundamental SELECTs to complex JOINS, subqueries, CASE statements, and data profiling using SQLite."
    },
    {
        "id": "rec-kaggle-sql-intro",
        "title": "Intro to SQL \u2013 Kaggle",
        "short_title": "Kaggle Intro to SQL",
        "provider": "Kaggle",
        "institution": "Kaggle Learn",
        "instructor": "Alexis Cook (Kaggle)",
        "skills_addressed": [
            "SQL & Databases"
        ],
        "primary_skill": "SQL & Databases",
        "difficulty": "Beginner",
        "duration": "4 hours (BigQuery labs)",
        "duration_hours": 4,
        "duration_type": "Micro-course",
        "has_certificate": True,
        "certificate_type": "Kaggle SQL Foundation Badge",
        "rating": 4.8,
        "learners": "390k+",
        "url": "https://www.kaggle.com/learn/intro-to-sql",
        "icon_bg": "#20BEFF",
        "badge_name": "Kaggle SQL Starter",
        "is_free": True,
        "free_audit": True,
        "overview": "Query real terabyte-scale datasets on Google BigQuery directly from Python notebooks. Covers SELECT, FROM, WHERE, GROUP BY, and HAVING."
    },
    {
        "id": "rec-kaggle-sql-adv",
        "title": "Advanced SQL \u2013 Kaggle",
        "short_title": "Kaggle Advanced SQL",
        "provider": "Kaggle",
        "institution": "Kaggle Learn",
        "instructor": "Alexis Cook (Kaggle)",
        "skills_addressed": [
            "SQL & Databases",
            "Data Analysis & Pandas"
        ],
        "primary_skill": "SQL & Databases",
        "difficulty": "Intermediate",
        "duration": "5 hours (BigQuery labs)",
        "duration_hours": 5,
        "duration_type": "Micro-course",
        "has_certificate": True,
        "certificate_type": "Kaggle Advanced SQL Badge",
        "rating": 4.8,
        "learners": "260k+",
        "url": "https://www.kaggle.com/learn/advanced-sql",
        "icon_bg": "#20BEFF",
        "badge_name": "Kaggle SQL Pro",
        "is_free": True,
        "free_audit": True,
        "overview": "Master complex JOINs, analytic window functions (RANK, ROW_NUMBER, LEAD/LAG), nested and repeated data, and query optimization."
    },
    {
        "id": "rec-nptel-dbms",
        "title": "Database Management System \u2013 NPTEL",
        "short_title": "DBMS Masterclass (IIT Kharagpur)",
        "provider": "NPTEL",
        "institution": "IIT Kharagpur",
        "instructor": "Prof. Partha Pratim Das",
        "skills_addressed": [
            "SQL & Databases"
        ],
        "primary_skill": "SQL & Databases",
        "difficulty": "Intermediate",
        "duration": "8 weeks (Semester course)",
        "duration_hours": 32,
        "duration_type": "Academic Semester",
        "has_certificate": True,
        "certificate_type": "NPTEL & IIT Kharagpur Elite Certificate",
        "rating": 4.8,
        "learners": "250k+",
        "url": "https://nptel.ac.in/courses/106105175",
        "icon_bg": "#8B1E0F",
        "badge_name": "IIT KGP DBMS Scholar",
        "is_free": True,
        "free_audit": True,
        "overview": "In-depth relational algebra, query optimization algorithms, ACID transaction processing, concurrency control, and B+ tree index structures."
    },
    {
        "id": "rec-fcc-relational-db",
        "title": "Relational Database Certification \u2013 freeCodeCamp",
        "short_title": "freeCodeCamp Relational Database",
        "provider": "freeCodeCamp",
        "institution": "freeCodeCamp.org",
        "instructor": "freeCodeCamp Curriculum Staff",
        "skills_addressed": [
            "SQL & Databases",
            "Backend APIs & Node/Python"
        ],
        "primary_skill": "SQL & Databases",
        "difficulty": "Intermediate",
        "duration": "300 hours (Hands-on Linux & PostgreSQL)",
        "duration_hours": 70,
        "duration_type": "Self-Paced Certification",
        "has_certificate": True,
        "certificate_type": "freeCodeCamp Verified Certification",
        "rating": 4.9,
        "learners": "410k+",
        "url": "https://www.freecodecamp.org/learn/relational-database/",
        "icon_bg": "#0A0A23",
        "badge_name": "PostgreSQL Certified Developer",
        "is_free": True,
        "free_audit": True,
        "overview": "Hands-on browser-based Linux terminal: write Bash scripts, build PostgreSQL relational databases, and pass 5 real certification projects."
    },
    {
        "id": "rec-coursera-deeplearning-spec",
        "title": "Deep Learning Specialization \u2013 Coursera",
        "short_title": "Deep Learning Specialization",
        "provider": "Coursera",
        "institution": "DeepLearning.AI",
        "instructor": "Andrew Ng, Kian Katanforoosh",
        "skills_addressed": [
            "Deep Learning & Neural Networks",
            "Python",
            "Machine Learning"
        ],
        "primary_skill": "Deep Learning & Neural Networks",
        "difficulty": "Intermediate to Advanced",
        "duration": "3 months (8 hrs/wk)",
        "duration_hours": 96,
        "duration_type": "Specialization",
        "has_certificate": True,
        "certificate_type": "DeepLearning.AI Verified Certificate",
        "rating": 4.9,
        "learners": "980k+",
        "url": "https://www.coursera.org/specializations/deep-learning",
        "icon_bg": "#FF5722",
        "badge_name": "Deep Learning Master",
        "is_free": False,
        "free_audit": True,
        "overview": "Master neural networks, backprop vectorization, hyperparameter tuning, CNNs for computer vision, and transformers/attention mechanisms."
    },
    {
        "id": "rec-nptel-dl",
        "title": "Deep Learning \u2013 NPTEL",
        "short_title": "Deep Learning (IIT Madras)",
        "provider": "NPTEL",
        "institution": "IIT Madras",
        "instructor": "Prof. Mitesh Khapra (IIT Madras)",
        "skills_addressed": [
            "Deep Learning & Neural Networks",
            "Machine Learning"
        ],
        "primary_skill": "Deep Learning & Neural Networks",
        "difficulty": "Intermediate to Advanced",
        "duration": "12 weeks (Semester course)",
        "duration_hours": 48,
        "duration_type": "Academic Semester",
        "has_certificate": True,
        "certificate_type": "NPTEL & IIT Madras Elite Certificate",
        "rating": 4.9,
        "learners": "210k+",
        "url": "https://nptel.ac.in/courses/106106184",
        "icon_bg": "#8B1E0F",
        "badge_name": "IIT Madras DL Scholar",
        "is_free": True,
        "free_audit": True,
        "overview": "Comprehensive mathematical and algorithmic foundation of deep neural networks: autoencoders, generative models, optimization manifolds, and attention."
    },
    {
        "id": "rec-fastai-practical-dl",
        "title": "Practical Deep Learning for Coders \u2013 fast.ai",
        "short_title": "fast.ai Deep Learning",
        "provider": "fast.ai",
        "institution": "fast.ai / University of San Francisco",
        "instructor": "Jeremy Howard",
        "skills_addressed": [
            "Deep Learning & Neural Networks",
            "Python",
            "Machine Learning"
        ],
        "primary_skill": "Deep Learning & Neural Networks",
        "difficulty": "Intermediate",
        "duration": "30 hours (Hands-on PyTorch)",
        "duration_hours": 30,
        "duration_type": "Short-course",
        "has_certificate": True,
        "certificate_type": "fast.ai Course Completion Credential",
        "rating": 4.9,
        "learners": "750k+",
        "url": "https://course.fast.ai/",
        "icon_bg": "#000000",
        "badge_name": "fast.ai Practitioner",
        "is_free": True,
        "free_audit": True,
        "overview": "Top-rated practical deep learning course taught by Jeremy Howard. Build computer vision, NLP, and tabular models with PyTorch and fastai."
    },
    {
        "id": "rec-kaggle-dl-intro",
        "title": "Intro to Deep Learning \u2013 Kaggle",
        "short_title": "Kaggle Deep Learning",
        "provider": "Kaggle",
        "institution": "Kaggle Learn",
        "instructor": "Ryan Holbrook (Kaggle)",
        "skills_addressed": [
            "Deep Learning & Neural Networks",
            "Python"
        ],
        "primary_skill": "Deep Learning & Neural Networks",
        "difficulty": "Beginner to Intermediate",
        "duration": "8 hours (Interactive labs)",
        "duration_hours": 8,
        "duration_type": "Micro-course",
        "has_certificate": True,
        "certificate_type": "Kaggle Deep Learning Badge",
        "rating": 4.8,
        "learners": "310k+",
        "url": "https://www.kaggle.com/learn/intro-to-deep-learning",
        "icon_bg": "#20BEFF",
        "badge_name": "Kaggle DL Builder",
        "is_free": True,
        "free_audit": True,
        "overview": "Build deep neural networks with TensorFlow and Keras. Covers dense layers, activation functions, stochastic gradient descent, dropout, and batch normalization."
    },
    {
        "id": "rec-coursera-nlp-spec",
        "title": "Natural Language Processing Specialization \u2013 Coursera",
        "short_title": "NLP Specialization",
        "provider": "Coursera",
        "institution": "DeepLearning.AI",
        "instructor": "Younes Bensouda Mourri & Lukasz Kaiser",
        "skills_addressed": [
            "Deep Learning & Neural Networks",
            "Machine Learning",
            "Python"
        ],
        "primary_skill": "Deep Learning & Neural Networks",
        "difficulty": "Advanced",
        "duration": "4 months (6 hrs/wk)",
        "duration_hours": 96,
        "duration_type": "Specialization",
        "has_certificate": True,
        "certificate_type": "DeepLearning.AI NLP Certificate",
        "rating": 4.8,
        "learners": "290k+",
        "url": "https://www.coursera.org/specializations/natural-language-processing",
        "icon_bg": "#FF5722",
        "badge_name": "NLP Master",
        "is_free": False,
        "free_audit": True,
        "overview": "Build NLP systems: sentiment analysis with logistic regression, word2vec, POS tagging with HMMs, seq2seq models with attention, and transformer architectures."
    },
    {
        "id": "rec-coursera-genai-llm",
        "title": "Generative AI with Large Language Models \u2013 Coursera",
        "short_title": "Generative AI with LLMs",
        "provider": "Coursera",
        "institution": "DeepLearning.AI & AWS",
        "instructor": "Antje Barth & Chris Fregly",
        "skills_addressed": [
            "Deep Learning & Neural Networks",
            "Machine Learning",
            "Cloud Computing (AWS/GCP)"
        ],
        "primary_skill": "Deep Learning & Neural Networks",
        "difficulty": "Intermediate to Advanced",
        "duration": "3 weeks (5 hrs/wk)",
        "duration_hours": 16,
        "duration_type": "Short-course",
        "has_certificate": True,
        "certificate_type": "DeepLearning.AI & AWS Verified Certificate",
        "rating": 4.8,
        "learners": "340k+",
        "url": "https://www.coursera.org/learn/generative-ai-with-llms",
        "icon_bg": "#FF5722",
        "badge_name": "Generative AI Architect",
        "is_free": False,
        "free_audit": True,
        "overview": "Master transformer architectures, LLM pre-training, PEFT, LoRA fine-tuning, RLHF, and LangChain orchestration."
    },
    {
        "id": "rec-coursera-stats-michigan",
        "title": "Statistics with Python Specialization \u2013 Coursera",
        "short_title": "Statistics with Python",
        "provider": "Coursera",
        "institution": "University of Michigan",
        "instructor": "Brenda Gunderson & Kerby Shedden",
        "skills_addressed": [
            "Statistics & Probability",
            "Python",
            "Data Analysis & Pandas"
        ],
        "primary_skill": "Statistics & Probability",
        "difficulty": "Beginner to Intermediate",
        "duration": "2 months (6 hrs/wk)",
        "duration_hours": 48,
        "duration_type": "Specialization",
        "has_certificate": True,
        "certificate_type": "University of Michigan Certificate",
        "rating": 4.7,
        "learners": "290k+",
        "url": "https://www.coursera.org/specializations/statistics-with-python",
        "icon_bg": "#0056D2",
        "badge_name": "Michigan Stats Specialist",
        "is_free": False,
        "free_audit": True,
        "overview": "Covers data exploration, study design, statistical inference, confidence intervals, hypothesis testing, and regression modeling with Python statsmodels."
    },
    {
        "id": "rec-nptel-stats",
        "title": "Introduction to Probability and Statistics \u2013 NPTEL",
        "short_title": "Probability & Statistics (IIT Madras)",
        "provider": "NPTEL",
        "institution": "IIT Madras",
        "instructor": "Prof. G. Srinivasan (IIT Madras)",
        "skills_addressed": [
            "Statistics & Probability",
            "Problem Solving & Critical Thinking"
        ],
        "primary_skill": "Statistics & Probability",
        "difficulty": "Intermediate",
        "duration": "12 weeks (Semester course)",
        "duration_hours": 45,
        "duration_type": "Academic Semester",
        "has_certificate": True,
        "certificate_type": "NPTEL IIT Madras Proctored Certificate",
        "rating": 4.8,
        "learners": "180k+",
        "url": "https://nptel.ac.in/courses/111105041",
        "icon_bg": "#8B1E0F",
        "badge_name": "IIT Madras Stats Scholar",
        "is_free": True,
        "free_audit": True,
        "overview": "Rigorous treatment of random variables, expectation, variance, central limit theorem, parameter estimation, and ANOVA."
    },
    {
        "id": "rec-mit-probability",
        "title": "MIT 6.041x: Introduction to Probability - The Science of Uncertainty",
        "short_title": "MIT Probability (6.041x)",
        "provider": "edX",
        "institution": "MIT OpenCourseWare & edX",
        "instructor": "Prof. John Tsitsiklis (MIT)",
        "skills_addressed": [
            "Statistics & Probability",
            "Problem Solving & Critical Thinking"
        ],
        "primary_skill": "Statistics & Probability",
        "difficulty": "Advanced",
        "duration": "16 weeks (12 hrs/wk)",
        "duration_hours": 160,
        "duration_type": "Academic Semester",
        "has_certificate": True,
        "certificate_type": "MITx Verified Academic Certificate",
        "rating": 4.9,
        "learners": "220k+",
        "url": "https://www.edx.org/course/introduction-to-probability-the-science-of-uncer",
        "icon_bg": "#A31F34",
        "badge_name": "MIT Probability Scholar",
        "is_free": True,
        "free_audit": True,
        "overview": "Probabilistic models, conditioning, independence, counting methods, discrete and continuous random variables, inference, and Bernoulli/Poisson processes."
    },
    {
        "id": "rec-google-data-analytics",
        "title": "Google Data Analytics Professional Certificate \u2013 Coursera",
        "short_title": "Google Data Analytics Certificate",
        "provider": "Coursera",
        "institution": "Google",
        "instructor": "Google Career Certificates",
        "skills_addressed": [
            "Data Analysis & Pandas",
            "SQL & Databases",
            "Data Visualization & Storytelling"
        ],
        "primary_skill": "Data Analysis & Pandas",
        "difficulty": "Beginner to Intermediate",
        "duration": "6 months (10 hrs/wk)",
        "duration_hours": 140,
        "duration_type": "Professional Certificate",
        "has_certificate": True,
        "certificate_type": "Google Professional Credential",
        "rating": 4.8,
        "learners": "2.2M+",
        "url": "https://www.coursera.org/professional-certificates/google-data-analytics",
        "icon_bg": "#4285F4",
        "badge_name": "Google Certified Data Analyst",
        "is_free": False,
        "free_audit": True,
        "overview": "Job-ready data analysis: spreadsheets, SQL, Tableau data visualization, R programming, data integrity audits, and capstone case studies."
    },
    {
        "id": "rec-kaggle-pandas",
        "title": "Pandas Micro-Course \u2013 Kaggle",
        "short_title": "Kaggle Pandas Track",
        "provider": "Kaggle",
        "institution": "Kaggle Learn",
        "instructor": "Resident Data Scientists (Kaggle)",
        "skills_addressed": [
            "Data Analysis & Pandas",
            "Python"
        ],
        "primary_skill": "Data Analysis & Pandas",
        "difficulty": "Beginner",
        "duration": "4 hours (Hands-on labs)",
        "duration_hours": 4,
        "duration_type": "Micro-course",
        "has_certificate": True,
        "certificate_type": "Kaggle Pandas Badge",
        "rating": 4.8,
        "learners": "490k+",
        "url": "https://www.kaggle.com/learn/pandas",
        "icon_bg": "#20BEFF",
        "badge_name": "Pandas Data Wrangler",
        "is_free": True,
        "free_audit": True,
        "overview": "Short, hands-on exercises covering indexing, selecting, assigning, summary functions, maps, grouping, sorting, and data type formatting in Pandas."
    },
    {
        "id": "rec-kaggle-data-cleaning",
        "title": "Data Cleaning \u2013 Kaggle",
        "short_title": "Kaggle Data Cleaning",
        "provider": "Kaggle",
        "institution": "Kaggle Learn",
        "instructor": "Rachael Tatman (Kaggle)",
        "skills_addressed": [
            "Data Analysis & Pandas",
            "Python"
        ],
        "primary_skill": "Data Analysis & Pandas",
        "difficulty": "Intermediate",
        "duration": "5 hours (Interactive labs)",
        "duration_hours": 5,
        "duration_type": "Micro-course",
        "has_certificate": True,
        "certificate_type": "Kaggle Data Cleaning Badge",
        "rating": 4.8,
        "learners": "310k+",
        "url": "https://www.kaggle.com/learn/data-cleaning",
        "icon_bg": "#20BEFF",
        "badge_name": "Kaggle Data Sanitizer",
        "is_free": True,
        "free_audit": True,
        "overview": "Master real-world data issues: handling missing values, scaling and normalization, parsing dates, character encodings, and fuzzy matching."
    },
    {
        "id": "rec-fcc-data-analysis",
        "title": "Data Analysis with Python \u2013 freeCodeCamp",
        "short_title": "freeCodeCamp Data Analysis",
        "provider": "freeCodeCamp",
        "institution": "freeCodeCamp.org",
        "instructor": "Santiago Basulto",
        "skills_addressed": [
            "Data Analysis & Pandas",
            "Python",
            "Data Visualization & Storytelling"
        ],
        "primary_skill": "Data Analysis & Pandas",
        "difficulty": "Intermediate",
        "duration": "300 hours (Comprehensive)",
        "duration_hours": 60,
        "duration_type": "Self-Paced Certification",
        "has_certificate": True,
        "certificate_type": "freeCodeCamp Verified Certification",
        "rating": 4.9,
        "learners": "720k+",
        "url": "https://www.freecodecamp.org/learn/data-analysis-with-python/",
        "icon_bg": "#0A0A23",
        "badge_name": "freeCodeCamp Data Analyst",
        "is_free": True,
        "free_audit": True,
        "overview": "Read data from multiple sources (CSVs, SQL, APIs), process it with NumPy and Pandas, visualize with Matplotlib and Seaborn, and complete 5 real projects."
    },
    {
        "id": "rec-coursera-dsa-ucsd",
        "title": "Data Structures and Algorithms Specialization \u2013 Coursera",
        "short_title": "Data Structures & Algorithms",
        "provider": "Coursera",
        "institution": "UC San Diego & HSE University",
        "instructor": "Alexander S. Kulikov & Pavel Pevzner",
        "skills_addressed": [
            "Data Structures & Algorithms",
            "Problem Solving & Critical Thinking"
        ],
        "primary_skill": "Data Structures & Algorithms",
        "difficulty": "Intermediate",
        "duration": "4 months (6 hrs/wk)",
        "duration_hours": 96,
        "duration_type": "Specialization",
        "has_certificate": True,
        "certificate_type": "UCSD / Coursera Verified Specialization",
        "rating": 4.7,
        "learners": "410k+",
        "url": "https://www.coursera.org/specializations/data-structures-algorithms",
        "icon_bg": "#0056D2",
        "badge_name": "UCSD Algorithms Master",
        "is_free": False,
        "free_audit": True,
        "overview": "Comprehensive algorithmic training: greedy algorithms, divide and conquer, dynamic programming, graph traversals, and shortest path algorithms."
    },
    {
        "id": "rec-nptel-dsa",
        "title": "Design & Analysis of Algorithms \u2013 NPTEL",
        "short_title": "Design & Analysis of Algorithms",
        "provider": "NPTEL",
        "institution": "Chennai Mathematical Institute & IIT Madras",
        "instructor": "Prof. Madhavan Mukund",
        "skills_addressed": [
            "Data Structures & Algorithms",
            "Problem Solving & Critical Thinking"
        ],
        "primary_skill": "Data Structures & Algorithms",
        "difficulty": "Intermediate to Advanced",
        "duration": "8 weeks (Semester course)",
        "duration_hours": 32,
        "duration_type": "Academic Semester",
        "has_certificate": True,
        "certificate_type": "NPTEL CMI / IIT Madras Elite Certificate",
        "rating": 4.9,
        "learners": "310k+",
        "url": "https://nptel.ac.in/courses/106106131",
        "icon_bg": "#8B1E0F",
        "badge_name": "CMI Algorithms Scholar",
        "is_free": True,
        "free_audit": True,
        "overview": "Mathematical analysis of worst-case runtime complexity, amortized analysis, advanced graph algorithms, and NP-completeness."
    },
    {
        "id": "rec-mit-algorithms",
        "title": "MIT 6.006: Introduction to Algorithms",
        "short_title": "MIT Algorithms (6.006)",
        "provider": "MIT OpenCourseWare",
        "institution": "MIT OpenCourseWare",
        "instructor": "Prof. Erik Demaine & Prof. Srini Devadas",
        "skills_addressed": [
            "Data Structures & Algorithms",
            "Problem Solving & Critical Thinking"
        ],
        "primary_skill": "Data Structures & Algorithms",
        "difficulty": "Advanced",
        "duration": "14 weeks (10 hrs/wk)",
        "duration_hours": 120,
        "duration_type": "Academic Semester",
        "has_certificate": True,
        "certificate_type": "MIT OpenCourseWare Credential",
        "rating": 4.9,
        "learners": "850k+",
        "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/",
        "icon_bg": "#A31F34",
        "badge_name": "MIT Algorithmist",
        "is_free": True,
        "free_audit": True,
        "overview": "Introduction to mathematical modeling of computational problems: asymptotic analysis, binary search trees, hash tables, Dijkstra, dynamic programming."
    },
    {
        "id": "rec-coursera-meta-frontend",
        "title": "Meta Front-End Developer Professional Certificate \u2013 Coursera",
        "short_title": "Meta Front-End Professional Certificate",
        "provider": "Coursera",
        "institution": "Meta",
        "instructor": "Meta Staff Engineers",
        "skills_addressed": [
            "React & Modern Frontend",
            "JavaScript & TypeScript"
        ],
        "primary_skill": "React & Modern Frontend",
        "difficulty": "Beginner to Intermediate",
        "duration": "7 months (6 hrs/wk)",
        "duration_hours": 140,
        "duration_type": "Professional Certificate",
        "has_certificate": True,
        "certificate_type": "Meta Official Professional Certificate",
        "rating": 4.8,
        "learners": "380k+",
        "url": "https://www.coursera.org/professional-certificates/meta-front-end-developer",
        "icon_bg": "#0668E1",
        "badge_name": "Meta Certified Front-End Developer",
        "is_free": False,
        "free_audit": True,
        "overview": "Built by Meta engineers. Master HTML/CSS, modern JavaScript, React hooks, state management, UX design, and real portfolio capstones."
    },
    {
        "id": "rec-helsinki-fullstack",
        "title": "Full Stack Open: Deep Dive to Modern Web Development",
        "short_title": "University of Helsinki Full Stack Open",
        "provider": "University of Helsinki",
        "institution": "University of Helsinki",
        "instructor": "Matti Luukkainen",
        "skills_addressed": [
            "React & Modern Frontend",
            "JavaScript & TypeScript",
            "Backend APIs & Node/Python"
        ],
        "primary_skill": "React & Modern Frontend",
        "difficulty": "Intermediate to Advanced",
        "duration": "Self-paced (100 hours)",
        "duration_hours": 100,
        "duration_type": "Academic Self-Paced",
        "has_certificate": True,
        "certificate_type": "University of Helsinki Official Certificate & ECTS Credits",
        "rating": 4.9,
        "learners": "250k+",
        "url": "https://fullstackopen.com/en/",
        "icon_bg": "#107EAB",
        "badge_name": "Full Stack Master",
        "is_free": True,
        "free_audit": True,
        "overview": "Modern JavaScript, React, Redux, Node.js backend APIs, Express, MongoDB, GraphQL, TypeScript, and Docker containerization."
    },
    {
        "id": "rec-fcc-frontend-libraries",
        "title": "Front End Development Libraries \u2013 freeCodeCamp",
        "short_title": "freeCodeCamp Front End",
        "provider": "freeCodeCamp",
        "institution": "freeCodeCamp.org",
        "instructor": "freeCodeCamp Staff",
        "skills_addressed": [
            "React & Modern Frontend",
            "JavaScript & TypeScript"
        ],
        "primary_skill": "React & Modern Frontend",
        "difficulty": "Intermediate",
        "duration": "300 hours (Self-paced)",
        "duration_hours": 50,
        "duration_type": "Self-Paced Certification",
        "has_certificate": True,
        "certificate_type": "freeCodeCamp Verified Certification",
        "rating": 4.8,
        "learners": "620k+",
        "url": "https://www.freecodecamp.org/learn/front-end-development-libraries/",
        "icon_bg": "#0A0A23",
        "badge_name": "freeCodeCamp Front-End Pro",
        "is_free": True,
        "free_audit": True,
        "overview": "Learn how to style with Bootstrap and SASS, structure state with Redux, and build 5 React projects including a random quote machine, markdown previewer, and 25+5 clock."
    },
    {
        "id": "rec-aws-solutions-architect",
        "title": "AWS Certified Solutions Architect - Associate",
        "short_title": "AWS Solutions Architect Associate",
        "provider": "AWS",
        "institution": "Amazon Web Services",
        "instructor": "AWS Certification Team",
        "skills_addressed": [
            "Cloud Computing (AWS/GCP)",
            "Networking & Security"
        ],
        "primary_skill": "Cloud Computing (AWS/GCP)",
        "difficulty": "Intermediate",
        "duration": "50 hours",
        "duration_hours": 50,
        "duration_type": "Industry Exam Prep",
        "has_certificate": True,
        "certificate_type": "AWS Certified Solutions Architect Credential",
        "rating": 4.9,
        "learners": "520k+",
        "url": "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
        "icon_bg": "#FF9900",
        "badge_name": "AWS Solutions Architect",
        "is_free": False,
        "free_audit": False,
        "overview": "The industry benchmark for designing cost-optimized, highly available, fault-tolerant, and scalable distributed architectures on AWS."
    },
    {
        "id": "rec-gcp-data-engineer",
        "title": "Google Cloud Professional Data Engineer",
        "short_title": "Google Cloud Data Engineer",
        "provider": "Google Cloud",
        "institution": "Google Cloud",
        "instructor": "Google Cloud Training",
        "skills_addressed": [
            "Cloud Computing (AWS/GCP)",
            "SQL & Databases",
            "Data Analysis & Pandas"
        ],
        "primary_skill": "Cloud Computing (AWS/GCP)",
        "difficulty": "Advanced",
        "duration": "50 hours",
        "duration_hours": 50,
        "duration_type": "Industry Exam Prep",
        "has_certificate": True,
        "certificate_type": "Google Cloud Certified Professional Credential",
        "rating": 4.8,
        "learners": "160k+",
        "url": "https://cloud.google.com/learn/certification/data-engineer",
        "icon_bg": "#4285F4",
        "badge_name": "GCP Data Engineer",
        "is_free": False,
        "free_audit": False,
        "overview": "Architect big data processing systems: BigQuery, Cloud Dataflow, Dataproc, Cloud Pub/Sub, and Cloud Spanner for real-time analytics."
    },
    {
        "id": "rec-nptel-cloud",
        "title": "Cloud Computing \u2013 NPTEL",
        "short_title": "Cloud Computing (IIT Kharagpur)",
        "provider": "NPTEL",
        "institution": "IIT Kharagpur",
        "instructor": "Prof. Soumya Kanti Ghosh",
        "skills_addressed": [
            "Cloud Computing (AWS/GCP)"
        ],
        "primary_skill": "Cloud Computing (AWS/GCP)",
        "difficulty": "Intermediate",
        "duration": "8 weeks (Semester course)",
        "duration_hours": 32,
        "duration_type": "Academic Semester",
        "has_certificate": True,
        "certificate_type": "NPTEL IIT Kharagpur Elite Certificate",
        "rating": 4.8,
        "learners": "190k+",
        "url": "https://nptel.ac.in/courses/106105167",
        "icon_bg": "#8B1E0F",
        "badge_name": "IIT KGP Cloud Scholar",
        "is_free": True,
        "free_audit": True,
        "overview": "Fundamental architecture of virtualization, hypervisors, cloud storage, container orchestration, SLA modeling, and security."
    },
    {
        "id": "rec-comptia-sec",
        "title": "CompTIA Security+ (SY0-701) Prep",
        "short_title": "CompTIA Security+ (SY0-701)",
        "provider": "CompTIA",
        "institution": "CompTIA",
        "instructor": "CompTIA Authorized Instructors",
        "skills_addressed": [
            "Networking & Security",
            "Ethical Hacking & Penetration Testing"
        ],
        "primary_skill": "Networking & Security",
        "difficulty": "Intermediate",
        "duration": "45 hours",
        "duration_hours": 45,
        "duration_type": "Industry Exam Prep",
        "has_certificate": True,
        "certificate_type": "Global ISO/ANSI Accredited Security Credential",
        "rating": 4.8,
        "learners": "600k+",
        "url": "https://www.comptia.org/certifications/security",
        "icon_bg": "#C8102E",
        "badge_name": "CompTIA Security+ Certified",
        "is_free": False,
        "free_audit": False,
        "overview": "Global standard for establishing foundational cybersecurity knowledge: network vulnerabilities, threats, identity management, cryptography, and incidence response."
    },
    {
        "id": "rec-google-cybersecurity",
        "title": "Google Cybersecurity Professional Certificate \u2013 Coursera",
        "short_title": "Google Cybersecurity Certificate",
        "provider": "Coursera",
        "institution": "Google",
        "instructor": "Google Security Experts",
        "skills_addressed": [
            "Networking & Security",
            "Python",
            "SQL & Databases"
        ],
        "primary_skill": "Networking & Security",
        "difficulty": "Beginner to Intermediate",
        "duration": "6 months (7 hrs/wk)",
        "duration_hours": 120,
        "duration_type": "Professional Certificate",
        "has_certificate": True,
        "certificate_type": "Google Cybersecurity Professional Certificate",
        "rating": 4.8,
        "learners": "410k+",
        "url": "https://www.coursera.org/professional-certificates/google-cybersecurity",
        "icon_bg": "#4285F4",
        "badge_name": "Google Certified Cyber Analyst",
        "is_free": False,
        "free_audit": True,
        "overview": "Entry-level cybersecurity preparation: network security, SIEM tools (Chronicle, Splunk), Python security automation, Linux command line, and SQL data queries."
    },
    {
        "id": "rec-nptel-ethical-hacking",
        "title": "Ethical Hacking \u2013 NPTEL",
        "short_title": "Ethical Hacking (IIT Kharagpur)",
        "provider": "NPTEL",
        "institution": "IIT Kharagpur",
        "instructor": "Prof. Indranil Sengupta",
        "skills_addressed": [
            "Networking & Security",
            "Ethical Hacking & Penetration Testing"
        ],
        "primary_skill": "Networking & Security",
        "difficulty": "Intermediate to Advanced",
        "duration": "12 weeks (Semester course)",
        "duration_hours": 48,
        "duration_type": "Academic Semester",
        "has_certificate": True,
        "certificate_type": "NPTEL & IIT Kharagpur Elite Certificate",
        "rating": 4.9,
        "learners": "280k+",
        "url": "https://nptel.ac.in/courses/106105217",
        "icon_bg": "#8B1E0F",
        "badge_name": "IIT KGP Ethical Hacker",
        "is_free": True,
        "free_audit": True,
        "overview": "Network packet sniffing, port scanning, vulnerability discovery, buffer overflows, web application attacks, SQL injection, and defensive hardening."
    },
    {
        "id": "rec-coursera-google-pm",
        "title": "Google Project Management Professional Certificate \u2013 Coursera",
        "short_title": "Google Project Management Certificate",
        "provider": "Coursera",
        "institution": "Google",
        "instructor": "Google Career Certificates",
        "skills_addressed": [
            "Project & Time Management",
            "Teamwork & Collaboration",
            "Leadership & Mentorship"
        ],
        "primary_skill": "Project & Time Management",
        "difficulty": "Beginner to Intermediate",
        "duration": "6 months (10 hrs/wk)",
        "duration_hours": 140,
        "duration_type": "Professional Certificate",
        "has_certificate": True,
        "certificate_type": "Google Official Professional Certificate",
        "rating": 4.8,
        "learners": "1.2M+",
        "url": "https://www.coursera.org/professional-certificates/google-project-management",
        "icon_bg": "#4285F4",
        "badge_name": "Google Certified Project Manager",
        "is_free": False,
        "free_audit": True,
        "overview": "Job-ready agile project management: scrum ceremonies, sprint planning, project artifacts, stakeholder communication, and risk documentation."
    },
    {
        "id": "rec-coursera-comm-northwestern",
        "title": "Executive Business Communication & Storytelling \u2013 Northwestern University",
        "short_title": "Executive Business Communication",
        "provider": "Coursera",
        "institution": "Northwestern University",
        "instructor": "Prof. Randy Hlavac",
        "skills_addressed": [
            "Communication & Presentation",
            "Data Visualization & Storytelling",
            "Problem Solving & Critical Thinking"
        ],
        "primary_skill": "Communication & Presentation",
        "difficulty": "All Levels",
        "duration": "20 hours",
        "duration_hours": 20,
        "duration_type": "Short-course",
        "has_certificate": True,
        "certificate_type": "Northwestern University Verified Certificate",
        "rating": 4.8,
        "learners": "180k+",
        "url": "https://www.coursera.org/specializations/business-communications",
        "icon_bg": "#4E2A84",
        "badge_name": "Executive Storyteller",
        "is_free": False,
        "free_audit": True,
        "overview": "Structure compelling data narratives, articulate complex technical trade-offs to executives, and deliver memorable presentations."
    },
    {
        "id": "rec-harvard-cs50-intro",
        "title": "Harvard CS50: Introduction to Computer Science",
        "short_title": "Harvard CS50",
        "provider": "edX",
        "institution": "Harvard University",
        "instructor": "Prof. David J. Malan",
        "skills_addressed": [
            "Problem Solving & Critical Thinking",
            "Python",
            "Data Structures & Algorithms"
        ],
        "primary_skill": "Problem Solving & Critical Thinking",
        "difficulty": "All Levels",
        "duration": "12 weeks (12 hrs/wk)",
        "duration_hours": 100,
        "duration_type": "Academic Semester",
        "has_certificate": True,
        "certificate_type": "HarvardX Verified Certificate",
        "rating": 4.9,
        "learners": "4.5M+",
        "url": "https://cs50.harvard.edu/x/",
        "icon_bg": "#A51C30",
        "badge_name": "CS50 Scholar",
        "is_free": True,
        "free_audit": True,
        "overview": "World-renowned computational thinking and problem solving masterclass: C, Python, SQL, algorithms, memory management, and data abstractions."
    },
    {
        "id": "rec-atlassian-git",
        "title": "Version Control with Git \u2013 Atlassian",
        "short_title": "Git Version Control",
        "provider": "Coursera",
        "institution": "Atlassian",
        "instructor": "Atlassian University",
        "skills_addressed": [
            "Git & CI/CD DevOps",
            "Cloud Computing (AWS/GCP)",
            "Problem Solving & Critical Thinking"
        ],
        "primary_skill": "Git & CI/CD DevOps",
        "difficulty": "Beginner",
        "duration": "16 hours",
        "duration_hours": 16,
        "duration_type": "Short-course",
        "has_certificate": True,
        "certificate_type": "Atlassian Verified Professional Certificate",
        "rating": 4.8,
        "learners": "310k+",
        "url": "https://www.coursera.org/learn/version-control-with-git",
        "icon_bg": "#0052CC",
        "badge_name": "Git Master",
        "is_free": False,
        "free_audit": True,
        "overview": "Industry standard version control: branches, merges, pull requests, merge conflicts, rebasing, and GitHub collaboration workflows."
    },
    {
        "id": "rec-fcc-git-github",
        "title": "Git and GitHub for Beginners \u2013 freeCodeCamp",
        "short_title": "Git & GitHub Crash Course",
        "provider": "freeCodeCamp",
        "institution": "freeCodeCamp.org",
        "instructor": "Gwen Faraday",
        "skills_addressed": [
            "Git & CI/CD DevOps",
            "Python",
            "JavaScript & TypeScript"
        ],
        "primary_skill": "Git & CI/CD DevOps",
        "difficulty": "Beginner",
        "duration": "8 hours",
        "duration_hours": 8,
        "duration_type": "Micro-course",
        "has_certificate": True,
        "certificate_type": "freeCodeCamp Community Achievement Badge",
        "rating": 4.9,
        "learners": "1.2M+",
        "url": "https://www.freecodecamp.org/news/git-and-github-crash-course/",
        "icon_bg": "#0A0A23",
        "badge_name": "Git Pioneer",
        "is_free": True,
        "free_audit": True,
        "overview": "Hands-on guide to Git commands, repository hosting, open source pull requests, branching models, and SSH authentication."
    },
    {
        "id": "rec-ibm-devops-intro",
        "title": "Introduction to DevOps and Software Engineering \u2013 IBM",
        "short_title": "Intro to DevOps & CI/CD",
        "provider": "Coursera",
        "institution": "IBM",
        "instructor": "John Rofrano (IBM)",
        "skills_addressed": [
            "DevOps & Infrastructure as Code",
            "Git & CI/CD DevOps",
            "Cloud Computing (AWS/GCP)"
        ],
        "primary_skill": "DevOps & Infrastructure as Code",
        "difficulty": "Beginner to Intermediate",
        "duration": "4 weeks (4 hrs/wk)",
        "duration_hours": 16,
        "duration_type": "Short-course",
        "has_certificate": True,
        "certificate_type": "IBM Professional Certificate",
        "rating": 4.7,
        "learners": "140k+",
        "url": "https://www.coursera.org/learn/intro-to-devops",
        "icon_bg": "#1261FE",
        "badge_name": "DevOps Practitioner",
        "is_free": False,
        "free_audit": True,
        "overview": "Core DevOps principles, continuous integration, continuous deployment pipelines, test automation, and agile microservices."
    },
    {
        "id": "rec-kaggle-advanced-sql",
        "title": "Advanced SQL \u2013 Kaggle",
        "short_title": "Advanced SQL Queries",
        "provider": "Kaggle",
        "institution": "Kaggle Learn",
        "instructor": "Alexis Cook (Kaggle)",
        "skills_addressed": [
            "SQL & Databases",
            "Data Analysis & Pandas",
            "Python"
        ],
        "primary_skill": "SQL & Databases",
        "difficulty": "Intermediate",
        "duration": "10 hours (Interactive Labs)",
        "duration_hours": 10,
        "duration_type": "Micro-course",
        "has_certificate": True,
        "certificate_type": "Kaggle Advanced SQL Certificate",
        "rating": 4.8,
        "learners": "320k+",
        "url": "https://www.kaggle.com/learn/advanced-sql",
        "icon_bg": "#20BEFF",
        "badge_name": "SQL Analytics Expert",
        "is_free": True,
        "free_audit": True,
        "overview": "Master complex JOINs, analytic window functions, subqueries, unnesting, and querying petabyte-scale BigQuery databases."
    },
    {
        "id": "rec-ibm-sql-datascience",
        "title": "Databases and SQL for Data Science with Python \u2013 IBM",
        "short_title": "SQL for Data Science (IBM)",
        "provider": "Coursera",
        "institution": "IBM",
        "instructor": "Rav Ahuja",
        "skills_addressed": [
            "SQL & Databases",
            "Python",
            "Data Analysis & Pandas"
        ],
        "primary_skill": "SQL & Databases",
        "difficulty": "Beginner to Intermediate",
        "duration": "25 hours",
        "duration_hours": 25,
        "duration_type": "Short-course",
        "has_certificate": True,
        "certificate_type": "IBM Professional Certificate",
        "rating": 4.7,
        "learners": "580k+",
        "url": "https://www.coursera.org/learn/sql-data-science",
        "icon_bg": "#1261FE",
        "badge_name": "IBM SQL Data Specialist",
        "is_free": False,
        "free_audit": True,
        "overview": "Connect Python to relational databases, write complex DDL/DML, stored procedures, joins, and aggregate functions with live Cloud DB instances."
    },
    {
        "id": "rec-harvard-probability",
        "title": "Introduction to Probability \u2013 Harvard University",
        "short_title": "Harvard Probability",
        "provider": "edX",
        "institution": "Harvard University",
        "instructor": "Prof. Joe Blitzstein",
        "skills_addressed": [
            "Statistics & Probability",
            "Machine Learning",
            "Problem Solving & Critical Thinking"
        ],
        "primary_skill": "Statistics & Probability",
        "difficulty": "Intermediate to Advanced",
        "duration": "10 weeks (6 hrs/wk)",
        "duration_hours": 60,
        "duration_type": "Academic Semester",
        "has_certificate": True,
        "certificate_type": "HarvardX Verified Certificate",
        "rating": 4.9,
        "learners": "290k+",
        "url": "https://www.edx.org/learn/probability/harvard-university-introduction-to-probability",
        "icon_bg": "#A51C30",
        "badge_name": "Harvard Probabilist",
        "is_free": True,
        "free_audit": True,
        "overview": "Rigorous mathematical foundation of probability: random variables, conditional expectation, Markov chains, and Poisson processes."
    },
    {
        "id": "rec-michigan-stats-python",
        "title": "Statistics with Python Specialization \u2013 University of Michigan",
        "short_title": "Statistics with Python",
        "provider": "Coursera",
        "institution": "University of Michigan",
        "instructor": "Prof. Brady T. West",
        "skills_addressed": [
            "Statistics & Probability",
            "Python",
            "Data Analysis & Pandas"
        ],
        "primary_skill": "Statistics & Probability",
        "difficulty": "Beginner to Intermediate",
        "duration": "2 months (10 hrs/wk)",
        "duration_hours": 60,
        "duration_type": "Specialization",
        "has_certificate": True,
        "certificate_type": "University of Michigan Verified Certificate",
        "rating": 4.7,
        "learners": "170k+",
        "url": "https://www.coursera.org/specializations/statistics-with-python",
        "icon_bg": "#00274C",
        "badge_name": "Michigan Stats Analyst",
        "is_free": False,
        "free_audit": True,
        "overview": "Statistical inference, confidence intervals, hypothesis testing, ANOVA, and regression modeling implemented in Python."
    },
    {
        "id": "rec-ucsd-dsa-spec",
        "title": "Data Structures and Algorithms Specialization \u2013 UC San Diego",
        "short_title": "Data Structures & Algorithms",
        "provider": "Coursera",
        "institution": "UC San Diego & HSE",
        "instructor": "Prof. Alexander S. Kulikov & Neil Rhodes",
        "skills_addressed": [
            "Data Structures & Algorithms",
            "Problem Solving & Critical Thinking",
            "Python"
        ],
        "primary_skill": "Data Structures & Algorithms",
        "difficulty": "Intermediate to Advanced",
        "duration": "4 months (6 hrs/wk)",
        "duration_hours": 90,
        "duration_type": "Specialization",
        "has_certificate": True,
        "certificate_type": "UC San Diego Verified Specialization Certificate",
        "rating": 4.7,
        "learners": "420k+",
        "url": "https://www.coursera.org/specializations/data-structures-algorithms",
        "icon_bg": "#182B49",
        "badge_name": "Algorithmic Master",
        "is_free": False,
        "free_audit": True,
        "overview": "Comprehensive algorithmic problem solving: divide & conquer, dynamic programming, graph algorithms, NP-complete problems, and string algorithms."
    },
    {
        "id": "rec-fcc-javascript-dsa",
        "title": "JavaScript Algorithms and Data Structures \u2013 freeCodeCamp",
        "short_title": "JS Algorithms & Data Structures",
        "provider": "freeCodeCamp",
        "institution": "freeCodeCamp.org",
        "instructor": "Quincy Larson & Community",
        "skills_addressed": [
            "Data Structures & Algorithms",
            "JavaScript & TypeScript",
            "Problem Solving & Critical Thinking"
        ],
        "primary_skill": "Data Structures & Algorithms",
        "difficulty": "Beginner to Intermediate",
        "duration": "300 hours (Self-paced)",
        "duration_hours": 120,
        "duration_type": "Professional Certification",
        "has_certificate": True,
        "certificate_type": "freeCodeCamp Verified Certification",
        "rating": 4.9,
        "learners": "2.1M+",
        "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
        "icon_bg": "#0A0A23",
        "badge_name": "FCC Algorithmic Developer",
        "is_free": True,
        "free_audit": True,
        "overview": "Master algorithmic thinking, ES6, OOP, functional programming, recursion, and complex algorithmic coding challenges."
    },
    {
        "id": "rec-deeplearning-nlp-spec",
        "title": "Natural Language Processing Specialization \u2013 DeepLearning.AI",
        "short_title": "NLP Specialization",
        "provider": "Coursera",
        "institution": "DeepLearning.AI",
        "instructor": "Younes Bensouda Mourri & \u0141ukasz Kaiser",
        "skills_addressed": [
            "Deep Learning & Neural Networks",
            "Machine Learning",
            "Python"
        ],
        "primary_skill": "Deep Learning & Neural Networks",
        "difficulty": "Intermediate to Advanced",
        "duration": "3 months (8 hrs/wk)",
        "duration_hours": 80,
        "duration_type": "Specialization",
        "has_certificate": True,
        "certificate_type": "DeepLearning.AI Verified Specialization Certificate",
        "rating": 4.8,
        "learners": "260k+",
        "url": "https://www.coursera.org/specializations/natural-language-processing",
        "icon_bg": "#0056D2",
        "badge_name": "NLP Specialist",
        "is_free": False,
        "free_audit": True,
        "overview": "Master modern NLP: sentiment analysis, word2vec, recurrent neural networks, GRUs, LSTMs, attention mechanisms, and Transformer architectures."
    },
    {
        "id": "rec-ibm-ai-ethics",
        "title": "AI Ethics and Governance \u2013 IBM",
        "short_title": "AI Ethics & Responsible AI",
        "provider": "Coursera",
        "institution": "IBM",
        "instructor": "Phaedra Boinodiris",
        "skills_addressed": [
            "Ethical AI & Research Integrity",
            "Machine Learning",
            "Problem Solving & Critical Thinking"
        ],
        "primary_skill": "Ethical AI & Research Integrity",
        "difficulty": "Beginner to Intermediate",
        "duration": "14 hours",
        "duration_hours": 14,
        "duration_type": "Short-course",
        "has_certificate": True,
        "certificate_type": "IBM AI Ethics Verified Badge",
        "rating": 4.8,
        "learners": "85k+",
        "url": "https://www.coursera.org/learn/ai-ethics",
        "icon_bg": "#1261FE",
        "badge_name": "Responsible AI Guardian",
        "is_free": False,
        "free_audit": True,
        "overview": "Fairness, transparency, explainability (XAI), privacy, adversarial robustness, and governance frameworks for real-world AI systems."
    },
    {
        "id": "rec-wharton-business-analytics",
        "title": "Business Analytics Specialization \u2013 Wharton School",
        "short_title": "Wharton Business Analytics",
        "provider": "Coursera",
        "institution": "University of Pennsylvania (Wharton)",
        "instructor": "Prof. Peter Fader & Prof. Eric Bradlow",
        "skills_addressed": [
            "Business Domain Acumen",
            "Data Analysis & Pandas",
            "Communication & Presentation"
        ],
        "primary_skill": "Business Domain Acumen",
        "difficulty": "Beginner to Intermediate",
        "duration": "3 months (4 hrs/wk)",
        "duration_hours": 48,
        "duration_type": "Specialization",
        "has_certificate": True,
        "certificate_type": "Wharton Executive Education Certificate",
        "rating": 4.7,
        "learners": "350k+",
        "url": "https://www.coursera.org/specializations/business-analytics",
        "icon_bg": "#011F5B",
        "badge_name": "Wharton Business Strategist",
        "is_free": False,
        "free_audit": True,
        "overview": "Apply data science to customer analytics, operations, finance, and talent management to drive high-impact strategic business decisions."
    },
    {
        "id": "rec-duke-java-spec",
        "title": "Java Programming and Software Engineering Fundamentals \u2013 Duke University",
        "short_title": "Java Fundamentals Specialization",
        "provider": "Coursera",
        "institution": "Duke University",
        "instructor": "Prof. Owen Astrachan & Robert Duvall",
        "skills_addressed": [
            "Java",
            "Data Structures & Algorithms",
            "Problem Solving & Critical Thinking"
        ],
        "primary_skill": "Java",
        "difficulty": "Beginner to Intermediate",
        "duration": "3 months (6 hrs/wk)",
        "duration_hours": 72,
        "duration_type": "Specialization",
        "has_certificate": True,
        "certificate_type": "Duke University Verified Specialization Certificate",
        "rating": 4.8,
        "learners": "480k+",
        "url": "https://www.coursera.org/specializations/java-programming",
        "icon_bg": "#001A9C",
        "badge_name": "Duke Java Specialist",
        "is_free": False,
        "free_audit": True,
        "overview": "Duke's foundational Java specialization: core syntax, object-oriented design, algorithms, structured data, and building scalable software systems."
    },
    {
        "id": "rec-helsinki-java-mooc",
        "title": "Java Programming MOOC \u2013 University of Helsinki",
        "short_title": "Java Programming (MOOC.fi)",
        "provider": "University of Helsinki",
        "institution": "University of Helsinki",
        "instructor": "Department of Computer Science",
        "skills_addressed": [
            "Java",
            "Data Structures & Algorithms",
            "Problem Solving & Critical Thinking"
        ],
        "primary_skill": "Java",
        "difficulty": "Beginner to Intermediate",
        "duration": "14 weeks (Self-paced)",
        "duration_hours": 80,
        "duration_type": "Academic Course",
        "has_certificate": True,
        "certificate_type": "University of Helsinki ECTS Verified Certificate",
        "rating": 4.9,
        "learners": "350k+",
        "url": "https://java-programming.mooc.fi/",
        "icon_bg": "#002F6C",
        "badge_name": "Helsinki Java Master",
        "is_free": True,
        "free_audit": True,
        "overview": "The global gold-standard course for Java and OOP: automated unit-tested coding exercises, class hierarchies, interfaces, and clean architecture."
    },
    {
        "id": "rec-nptel-java",
        "title": "Programming in Java \u2013 NPTEL",
        "short_title": "Programming in Java (IIT Kharagpur)",
        "provider": "NPTEL",
        "institution": "IIT Kharagpur & Ministry of Education",
        "instructor": "Prof. Debasis Samanta (IIT Kharagpur)",
        "skills_addressed": [
            "Java",
            "Data Structures & Algorithms",
            "SQL & Databases"
        ],
        "primary_skill": "Java",
        "difficulty": "Intermediate",
        "duration": "12 weeks (Semester course)",
        "duration_hours": 48,
        "duration_type": "Academic Semester",
        "has_certificate": True,
        "certificate_type": "NPTEL & IIT Kharagpur Elite Examination Certificate",
        "rating": 4.9,
        "learners": "420k+",
        "url": "https://nptel.ac.in/courses/106105191",
        "icon_bg": "#8B1E0F",
        "badge_name": "IIT Kharagpur Java Scholar",
        "is_free": True,
        "free_audit": True,
        "overview": "Comprehensive academic masterclass: JVM architecture, multithreading, synchronization, Java Collections Framework, Swing/AWT, and JDBC database connectivity."
    },
    {
        "id": "rec-princeton-algorithms-java",
        "title": "Algorithms, Part I (in Java) \u2013 Princeton University",
        "short_title": "Princeton Algorithms in Java",
        "provider": "Coursera",
        "institution": "Princeton University",
        "instructor": "Prof. Robert Sedgewick & Kevin Wayne",
        "skills_addressed": [
            "Java",
            "Data Structures & Algorithms",
            "Problem Solving & Critical Thinking"
        ],
        "primary_skill": "Java",
        "difficulty": "Intermediate to Advanced",
        "duration": "6 weeks (8 hrs/wk)",
        "duration_hours": 48,
        "duration_type": "Academic Course",
        "has_certificate": True,
        "certificate_type": "Princeton University Coursera Certificate",
        "rating": 4.9,
        "learners": "1.1M+",
        "url": "https://www.coursera.org/learn/algorithms-part1",
        "icon_bg": "#FF6600",
        "badge_name": "Princeton Algorithmicist",
        "is_free": True,
        "free_audit": True,
        "overview": "Essential data structures and algorithms in Java: union-find, stacks, queues, quicksort, mergesort, heaps, binary search trees, and red-black trees."
    },
    {
        "id": "rec-fcc-java-full",
        "title": "Java Programming for Beginners \u2013 freeCodeCamp",
        "short_title": "Java Full Course (freeCodeCamp)",
        "provider": "freeCodeCamp",
        "institution": "freeCodeCamp.org",
        "instructor": "John Purcell & Community",
        "skills_addressed": [
            "Java",
            "Problem Solving & Critical Thinking"
        ],
        "primary_skill": "Java",
        "difficulty": "Beginner",
        "duration": "10 hours (Hands-on)",
        "duration_hours": 10,
        "duration_type": "Micro-course",
        "has_certificate": True,
        "certificate_type": "freeCodeCamp Verified Badge",
        "rating": 4.8,
        "learners": "2.8M+",
        "url": "https://www.freecodecamp.org/news/learn-java-full-course/",
        "icon_bg": "#0A0A23",
        "badge_name": "Java Code Pioneer",
        "is_free": True,
        "free_audit": True,
        "overview": "Core Java programming from scratch: variables, loops, arrays, OOP, inheritance, polymorphism, encapsulation, file I/O, and exception handling."
    },
    {
        "id": "rec-spring-boot-microservices",
        "title": "Spring Boot & Java Microservices \u2013 Coursera",
        "short_title": "Java Spring Boot Microservices",
        "provider": "Coursera",
        "institution": "LearnQuest / Google Cloud Partner",
        "instructor": "LearnQuest Senior Engineering Team",
        "skills_addressed": [
            "Java",
            "Backend APIs & Spring Boot",
            "SQL & Databases"
        ],
        "primary_skill": "Java",
        "difficulty": "Intermediate",
        "duration": "4 weeks (6 hrs/wk)",
        "duration_hours": 24,
        "duration_type": "Short-course",
        "has_certificate": True,
        "certificate_type": "Spring Boot Microservices Verified Certificate",
        "rating": 4.7,
        "learners": "160k+",
        "url": "https://www.coursera.org/learn/spring-framework",
        "icon_bg": "#6DB33F",
        "badge_name": "Spring Boot Architect",
        "is_free": False,
        "free_audit": True,
        "overview": "Production-grade enterprise Java: Spring Core, Spring Boot, RESTful APIs, Spring Data JPA, Hibernate, Actuator, and microservice architectures."
    },
    {
        "id": "rec-c-programming-nptel",
        "title": "Problem Solving through Programming in C \u2013 NPTEL",
        "short_title": "Programming in C (IIT Kharagpur)",
        "provider": "NPTEL",
        "institution": "IIT Kharagpur",
        "instructor": "Prof. Anupam Basu",
        "skills_addressed": [
            "C",
            "Problem Solving & Critical Thinking",
            "Data Structures & Algorithms"
        ],
        "primary_skill": "C",
        "difficulty": "Beginner to Intermediate",
        "duration": "12 weeks",
        "duration_hours": 48,
        "duration_type": "Academic Semester",
        "has_certificate": True,
        "certificate_type": "NPTEL & IIT Kharagpur Elite Certificate",
        "rating": 4.8,
        "learners": "380k+",
        "url": "https://nptel.ac.in/courses/106105171",
        "icon_bg": "#8B1E0F",
        "badge_name": "IIT C Programming Fellow",
        "is_free": True,
        "free_audit": True,
        "overview": "Foundational procedural programming: pointers, memory management, arrays, structures, file handling, and algorithmic problem solving in C."
    }
]


RELATED_SKILLS_MAP = {
    "Java": [
        "Data Structures & Algorithms",
        "SQL & Databases",
        "Backend APIs & Spring Boot",
        "Problem Solving & Critical Thinking",
        "Git & CI/CD DevOps"
    ],
    "C": [
        "Data Structures & Algorithms",
        "Problem Solving & Critical Thinking",
        "Networking & Security"
    ],
    "Machine Learning": [
        "Python",
        "Statistics & Probability",
        "Data Analysis & Pandas",
        "Deep Learning & Neural Networks",
        "Data Visualization & Storytelling",
        "Ethical AI & Research Integrity"
    ],
    "Python": [
        "Data Structures & Algorithms",
        "SQL & Databases",
        "Data Analysis & Pandas",
        "Problem Solving & Critical Thinking",
        "Machine Learning"
    ],
    "SQL & Databases": [
        "Data Analysis & Pandas",
        "Python",
        "Cloud Computing (AWS/GCP)",
        "Backend APIs & Spring Boot"
    ],
    "Statistics & Probability": [
        "Data Analysis & Pandas",
        "Machine Learning",
        "Python",
        "Data Visualization & Storytelling",
        "Problem Solving & Critical Thinking"
    ],
    "Deep Learning & Neural Networks": [
        "Machine Learning",
        "Python",
        "Statistics & Probability",
        "Cloud Computing (AWS/GCP)",
        "Ethical AI & Research Integrity"
    ],
    "Data Structures & Algorithms": [
        "Problem Solving & Critical Thinking",
        "Python",
        "Java",
        "JavaScript & TypeScript"
    ],
    "React & Modern Frontend": [
        "JavaScript & TypeScript",
        "Backend APIs & Node/Python",
        "Data Visualization & Storytelling"
    ],
    "JavaScript & TypeScript": [
        "React & Modern Frontend",
        "Backend APIs & Node/Python",
        "Data Structures & Algorithms"
    ],
    "Backend APIs & Node/Python": [
        "SQL & Databases",
        "Cloud Computing (AWS/GCP)",
        "Git & CI/CD DevOps",
        "JavaScript & TypeScript",
        "Python"
    ],
    "Backend APIs & Spring Boot": [
        "Java",
        "SQL & Databases",
        "Cloud Computing (AWS/GCP)",
        "Git & CI/CD DevOps"
    ],
    "Cloud Computing (AWS/GCP)": [
        "DevOps & Infrastructure as Code",
        "Git & CI/CD DevOps",
        "Networking & Security",
        "SQL & Databases"
    ],
    "DevOps & Infrastructure as Code": [
        "Git & CI/CD DevOps",
        "Cloud Computing (AWS/GCP)",
        "Networking & Security"
    ],
    "Git & CI/CD DevOps": [
        "DevOps & Infrastructure as Code",
        "Cloud Computing (AWS/GCP)",
        "Python",
        "Java"
    ],
    "Networking & Security": [
        "Ethical Hacking & Penetration Testing",
        "Cloud Computing (AWS/GCP)",
        "Python",
        "C"
    ],
    "Ethical Hacking & Penetration Testing": [
        "Networking & Security",
        "Python",
        "Cloud Computing (AWS/GCP)"
    ],
    "Data Analysis & Pandas": [
        "Python",
        "SQL & Databases",
        "Statistics & Probability",
        "Data Visualization & Storytelling",
        "Machine Learning"
    ],
    "Data Visualization & Storytelling": [
        "Data Analysis & Pandas",
        "Communication & Presentation",
        "Python",
        "Statistics & Probability"
    ],
    "Problem Solving & Critical Thinking": [
        "Data Structures & Algorithms",
        "Python",
        "Java",
        "Statistics & Probability"
    ],
    "Communication & Presentation": [
        "Data Visualization & Storytelling",
        "Business Domain Acumen",
        "Leadership & Mentorship",
        "Teamwork & Collaboration"
    ],
    "Business Domain Acumen": [
        "Data Analysis & Pandas",
        "Communication & Presentation",
        "Project & Time Management"
    ],
    "Project & Time Management": [
        "Teamwork & Collaboration",
        "Leadership & Mentorship",
        "Communication & Presentation"
    ],
    "Teamwork & Collaboration": [
        "Communication & Presentation",
        "Project & Time Management",
        "Leadership & Mentorship"
    ],
    "Leadership & Mentorship": [
        "Teamwork & Collaboration",
        "Communication & Presentation",
        "Project & Time Management"
    ],
    "Ethical AI & Research Integrity": [
        "Machine Learning",
        "Deep Learning & Neural Networks",
        "Problem Solving & Critical Thinking"
    ]
}


def score_course_recommendation(course: Dict[str, Any], gap_item: Dict[str, Any], role_id: str, role_skills: List[Dict[str, Any]], match_type: str = "direct", parent_skill: str = "") -> Dict[str, Any]:
    skill = gap_item.get("skill", "")
    is_assessed = gap_item.get("is_assessed", gap_item.get("isAssessed", False))
    raw_current = gap_item.get("current_score", gap_item.get("currentScore"))
    current_score = float(raw_current) if raw_current is not None else None
    target_score = float(gap_item.get("target_score", gap_item.get("targetScore", 80)))
    gap_val = float(gap_item.get("gap", target_score if current_score is None else max(0.0, target_score - current_score)))

    # 1. Student level classification
    if not is_assessed or current_score is None:
        student_level = "Beginner (Unassessed)"
        current_display = "Not Tested"
    elif current_score < 45:
        student_level = "Beginner"
        current_display = f"{round(current_score, 1)}%"
    elif current_score < 75:
        student_level = "Intermediate"
        current_display = f"{round(current_score, 1)}%"
    else:
        student_level = "Advanced"
        current_display = f"{round(current_score, 1)}%"

    # 2. Difficulty fit scoring
    course_diff = course.get("difficulty", "Beginner").lower()
    if student_level in ["Beginner", "Beginner (Unassessed)"]:
        if "beginner" in course_diff and "intermediate" not in course_diff:
            diff_score = 22
            fit_text = f"Optimal for foundational study in {skill} ({current_display}). Builds essential concepts step-by-step."
        elif "beginner to intermediate" in course_diff:
            diff_score = 19
            fit_text = f"Gentle progression from foundational concepts toward Intermediate benchmarks."
        elif "intermediate" in course_diff:
            diff_score = 12
            fit_text = f"Intermediate stretch goal. Recommended after completing initial introductory modules."
        else:
            diff_score = 6
            fit_text = f"Advanced specialization. Capstone target once you achieve >65% score."
    elif student_level == "Intermediate":
        if "intermediate" in course_diff or "beginner to intermediate" in course_diff:
            diff_score = 22
            fit_text = f"Directly matched for your Intermediate score ({current_display}). Targets benchmark readiness."
        elif "advanced" in course_diff:
            diff_score = 18
            fit_text = f"High-impact step-up to elevate your Intermediate proficiency ({current_display}) to mastery."
        else:
            diff_score = 10
            fit_text = f"Quick review of essential concepts to solidify missing fundamentals."
    else: # Advanced
        if "advanced" in course_diff:
            diff_score = 22
            fit_text = f"Rigorous advanced credential matching your high score ({current_display})."
        elif "intermediate" in course_diff:
            diff_score = 14
            fit_text = f"Comprehensive review and verification of core concepts."
        else:
            diff_score = 6
            fit_text = f"Foundational review."

    # 3. Role Criticality
    target_skill_for_imp = parent_skill if match_type == "related" and parent_skill else skill
    role_skill_entry = next((s for s in role_skills if matches_skill_strict(s["name"], target_skill_for_imp)), None)
    importance = role_skill_entry.get("importance", "Medium") if role_skill_entry else "Medium"

    if importance == "Critical":
        role_score = 16
    elif importance == "High":
        role_score = 12
    elif importance == "Medium":
        role_score = 8
    else:
        role_score = 4

    # 4. Deficit Urgency
    if gap_val >= 30:
        urgency_score = 15
    elif gap_val >= 20:
        urgency_score = 11
    elif gap_val >= 10:
        urgency_score = 8
    else:
        urgency_score = 4

    # 5. Credential Bonus
    cert_bonus = 8 if course.get("has_certificate") else 3

    # 6. Match Type bonus
    match_type_bonus = 12 if match_type == "direct" else 4

    # Base match calculation
    raw_match = 26 + diff_score + role_score + urgency_score + cert_bonus + match_type_bonus
    match_score = max(68, min(99, raw_match))

    provider = course["provider"]
    institution = course["institution"]
    duration = course["duration"]
    cert_type = course["certificate_type"]

    if match_type == "direct":
        if is_assessed and current_score is not None:
            reason = (
                f"AI recommends {course['short_title']} by {institution} ({provider}) "
                f"because your {skill} score is {round(current_score, 1)}% ({student_level}), "
                f"leaving a {round(gap_val, 1)}% deficit against your {target_score}% benchmark. "
                f"With {duration} duration, this resource provides {cert_type} "
                f"and delivers the exact depth needed to close this gap."
            )
        else:
            reason = (
                f"AI recommends {course['short_title']} by {institution} ({provider}) "
                f"as a core curriculum requirement for {skill} ({target_score}% benchmark). "
                f"With {duration} duration and {cert_type}, it builds complete competence "
                f"for the CodeChef skill evaluation."
            )
        match_type_label = "🎯 Direct Deficit Match"
        synergy_reason = ""
    else:
        match_type_label = "🔗 Related Skill Synergy"
        synergy_reason = f"Reinforces foundational {course['primary_skill']} to accelerate mastery in {parent_skill}."
        reason = (
            f"AI recommends this related synergy course in {course['primary_skill']} "
            f"to strengthen your learning progression for {parent_skill}. "
            f"Mastering {course['primary_skill']} eliminates bottlenecks in {parent_skill}."
        )

    return {
        **course,
        "match_score": match_score,
        "match_type": match_type,
        "match_type_label": match_type_label,
        "related_to_skill": parent_skill if match_type == "related" else "",
        "synergy_reason": synergy_reason,
        "matched_skill": skill,
        "current_score": current_score,
        "target_score": target_score,
        "gap_deficit": gap_val,
        "student_level": student_level,
        "level_fit": fit_text,
        "recommendation_reason": reason,
        "role_importance": importance,
    }


def get_recommendations_for_gaps(role_id: str, skill_gaps: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    AI-Powered Certification and Course Recommendations Engine.
    Dynamically recommends:
    1. Direct Deficit Courses (teaching the exact gap skill via strict semantic matching)
    2. Related Skill Synergies (foundations & complementary prerequisites)
    Considering current proficiency, role criticality, course difficulty, duration, and certificates.
    """
    role = get_role_by_id(role_id)
    role_skills = role.get("skills", []) if role else []
    role_title = role.get("title", "Selected Career Role") if role else "Selected Career Role"

    # Prioritize skills with positive gaps or unassessed skills
    positive_gaps = [g for g in skill_gaps if g.get("gap", 0) > 0 or not g.get("is_assessed", g.get("isAssessed", False))]
    if not positive_gaps and skill_gaps:
        positive_gaps = skill_gaps[:3]

    all_recommendations = []
    by_skill = {}
    seen_ids = set()
    direct_matches = []
    related_matches = []

    for gap_item in positive_gaps:
        skill_name = gap_item.get("skill", "")
        skill_recs = []

        # 1. Direct Skill Matches (Strict Matching!)
        for course in COURSES_CATALOG:
            is_direct = any(
                matches_skill_strict(s, skill_name)
                for s in course.get("skills_addressed", [])
            ) or matches_skill_strict(course.get("primary_skill", ""), skill_name)

            if is_direct:
                scored = score_course_recommendation(course, gap_item, role_id, role_skills, match_type="direct")
                skill_recs.append(scored)
                if course["id"] not in seen_ids:
                    all_recommendations.append(scored)
                    direct_matches.append(scored)
                    seen_ids.add(course["id"])

        # 2. Related Skill Synergies
        related_skills = RELATED_SKILLS_MAP.get(skill_name, [])
        for rel_skill in related_skills:
            for course in COURSES_CATALOG:
                if course["id"] in seen_ids:
                    continue
                if skill_name.lower() == "java":
                    t_lower = course.get("title", "").lower()
                    p_lower = course.get("primary_skill", "").lower()
                    if "javascript" in t_lower or "javascript" in p_lower:
                        continue
                is_related = any(
                    matches_skill_strict(s, rel_skill)
                    for s in course.get("skills_addressed", [])
                ) or matches_skill_strict(course.get("primary_skill", ""), rel_skill)

                if is_related:
                    scored = score_course_recommendation(
                        course, gap_item, role_id, role_skills,
                        match_type="related", parent_skill=skill_name
                    )
                    skill_recs.append(scored)
                    all_recommendations.append(scored)
                    related_matches.append(scored)
                    seen_ids.add(course["id"])

        skill_recs.sort(key=lambda x: (1 if x["match_type"] == "direct" else 0, x["match_score"]), reverse=True)
        by_skill[skill_name] = skill_recs

    # Sort overall recommendations: direct matches first, then highest score
    all_recommendations.sort(key=lambda x: (1 if x["match_type"] == "direct" else 0, x["match_score"]), reverse=True)

    recommended_certs = [r for r in all_recommendations if r.get("has_certificate") and r.get("duration_type") in ["Industry Exam Prep", "Professional Certificate", "Specialization", "Academic Semester"]][:8]
    recommended_resources = [r for r in all_recommendations if r.get("duration_type") in ["Micro-course", "Short-course"] or r.get("is_free")][:10]

    critical_count = sum(1 for g in positive_gaps if g.get("gap", 0) >= 20 and g.get("is_assessed", g.get("isAssessed", False)))
    top_skill = positive_gaps[0].get("skill", "your focus area") if positive_gaps else "your target competencies"
    summary = (
        f"AI evaluated {len(positive_gaps)} target competency area(s) for {role_title}. "
        f"Generated {len(all_recommendations)} personalized course and certification recommendation(s) "
        f"({len(direct_matches)} direct deficit matches, {len(related_matches)} related skill synergies) "
        f"specifically prioritized for {top_skill}."
    )

    return {
        "role_id": role_id,
        "role_title": role_title,
        "total_recommendations": len(all_recommendations),
        "direct_matches_count": len(direct_matches),
        "related_matches_count": len(related_matches),
        "recommendations": all_recommendations,
        "direct_matches": direct_matches,
        "related_matches": related_matches,
        "by_skill": by_skill,
        "certifications": recommended_certs,
        "learning_resources": recommended_resources,
        "summary": summary
    }


# ============================================================
# DIRECTED ACYCLIC GRAPH (DAG) PREREQUISITE DEPENDENCIES
# ============================================================

SKILL_PREREQUISITES = {
    "Python": [],
    "JavaScript & TypeScript": [],
    "Statistics & Probability": [],
    "SQL & Databases": [],
    "Problem Solving & Critical Thinking": [],
    "Networking & Security": [],
    "Communication & Presentation": [],
    "Project & Time Management": [],
    "Business Domain Acumen": [],
    "Teamwork & Collaboration": [],
    "Leadership & Mentorship": [],

    "Data Analysis & Pandas": ["Python", "SQL & Databases"],
    "Data Structures & Algorithms": ["Python", "Problem Solving & Critical Thinking"],
    "React & Modern Frontend": ["JavaScript & TypeScript"],
    "Backend APIs & Node/Python": ["Python", "SQL & Databases"],
    "Git & CI/CD DevOps": ["Problem Solving & Critical Thinking"],
    "Ethical Hacking & Penetration Testing": ["Networking & Security", "Python"],
    "Cloud Computing (AWS/GCP)": ["Networking & Security", "SQL & Databases"],

    "Machine Learning": ["Python", "Statistics & Probability", "Data Analysis & Pandas"],
    "Data Visualization & Storytelling": ["Data Analysis & Pandas", "Communication & Presentation"],
    "DevOps & Infrastructure as Code": ["Git & CI/CD DevOps", "Cloud Computing (AWS/GCP)"],

    "Deep Learning & Neural Networks": ["Machine Learning", "Python"],
    "Ethical AI & Research Integrity": ["Machine Learning", "Problem Solving & Critical Thinking"],
}

ROADMAP_SH_REFS = {
    "ai_engineer": {"title": "AI Engineer Roadmap", "url": "https://roadmap.sh/ai-engineer"},
    "data_scientist": {"title": "AI & Data Scientist Roadmap", "url": "https://roadmap.sh/ai-data-scientist"},
    "full_stack_dev": {"title": "Full Stack Developer Roadmap", "url": "https://roadmap.sh/full-stack"},
    "cloud_architect": {"title": "DevOps & Cloud Roadmap", "url": "https://roadmap.sh/devops"},
    "cyber_security": {"title": "Cyber Security Roadmap", "url": "https://roadmap.sh/cyber-security"},
    "devops_engineer": {"title": "DevOps Roadmap", "url": "https://roadmap.sh/devops"},

    "Python": {"title": "Python Roadmap", "url": "https://roadmap.sh/python"},
    "SQL & Databases": {"title": "SQL Roadmap", "url": "https://roadmap.sh/sql"},
    "Machine Learning": {"title": "Machine Learning Roadmap", "url": "https://roadmap.sh/machine-learning"},
    "Data Structures & Algorithms": {"title": "DSA Roadmap", "url": "https://roadmap.sh/datastructures-and-algorithms"},
    "React & Modern Frontend": {"title": "React Roadmap", "url": "https://roadmap.sh/react"},
    "Backend APIs & Node/Python": {"title": "Backend Roadmap", "url": "https://roadmap.sh/backend"},
    "Git & CI/CD DevOps": {"title": "Git & GitHub Roadmap", "url": "https://roadmap.sh/git-github"},
    "Cloud Computing (AWS/GCP)": {"title": "DevOps & Cloud", "url": "https://roadmap.sh/devops"}
}

def generate_personalized_roadmap(role_id: str, student_skills: List[Dict[str, Any]], timeline_weeks: int = 12, weekly_hours: int = 10, student_id: str = "default_student") -> Dict[str, Any]:
    """
    Intelligent Adaptive Learning Roadmap Generation Engine (Feature 5).
    Dynamically generates an ordered, step-by-step learning progression using:
    1. Student actual assessment results & skill gaps
    2. Directed Acyclic Graph (DAG) prerequisite dependencies
    3. Mastered skill skipping (skills >= 75% are skipped from basic phases)
    4. Verified course mapping to COURSES_CATALOG
    5. Study pace personalizations (weekly hours -> week duration)
    6. Practical exercises, portfolio projects & roadmap.sh reference links
    """
    # Check completed milestones from database
    try:
        from database.db import get_roadmap_completed_milestones, save_student_roadmap
        completed_ids = set(get_roadmap_completed_milestones(student_id, role_id))
    except Exception:
        completed_ids = set()

    if completed_ids is None:
        completed_ids = set()
    role = get_role_by_id(role_id) or CAREER_ROLES["data_scientist"]
    role_title = role["title"]

    # 1. Calculate actual skill gaps
    gaps_result = calculate_skill_gaps(role_id, student_skills)
    gaps = gaps_result["gaps"]

    # Student proficiency lookup
    student_map = {}
    for s in student_skills:
        name = s.get("name") or s.get("skill") or ""
        score = s.get("current_score") or s.get("currentScore") or s.get("score") or 0
        student_map[name.strip().lower()] = float(score)

    # 2. Categorize each skill by mastery vs deficit
    skill_nodes = []
    satisfied_skills = set()

    for gap_item in gaps:
        skill_name = gap_item["skill"]
        current = gap_item["current_score"]
        target = gap_item["target_score"]
        gap = gap_item["gap"]
        importance = gap_item["importance"]
        category = gap_item.get("category", "Technical")

        # Check if already mastered (score >= 75 or gap <= 5)
        is_assessed = gap_item.get("is_assessed", gap_item.get("isAssessed", False))
        is_mastered = is_assessed and current is not None and (current >= 75.0 or (gap <= 5.0 and current > 0))
        if is_mastered:
            satisfied_skills.add(skill_name.lower())

        # Determine priority
        if not is_assessed:
            priority = "High" if importance in ["Critical", "High"] else "Medium"
        elif gap >= 25:
            priority = "Critical"
        elif gap >= 15:
            priority = "High"
        elif gap >= 5:
            priority = "Medium"
        else:
            priority = "Low"

        # Find best matching verified course from COURSES_CATALOG
        matching_course = None
        for c in COURSES_CATALOG:
            if any(s.lower() == skill_name.lower() or skill_name.lower() in s.lower() for s in c["skills_addressed"]):
                matching_course = c
                break

        # Estimated effort hours based on gap deficit
        if is_mastered:
            estimated_hours = 0
        elif current is None or current < 40:
            estimated_hours = max(16, int(gap * 1.3))  # Foundational requires thorough study
        elif current < 75:
            estimated_hours = max(10, int(gap * 1.0))  # Guided practice & refinement
        else:
            estimated_hours = 6

        # Exercise & Project mapping
        if "sql" in skill_name.lower():
            exercise = "Write 15 complex relational queries with subqueries, GROUP BY, and window functions."
            project = "Design an e-commerce schema in SQLite with indexing and analyze customer retention cohorts."
        elif "python" in skill_name.lower():
            exercise = "Implement 20 algorithmic challenges utilizing list comprehensions, decorators, and generators."
            project = "Build an asynchronous CLI data extraction tool with unit tests and logging."
        elif "machine learning" in skill_name.lower():
            exercise = "Train, validate, and compare Random Forest vs Gradient Boosting classifiers with scikit-learn."
            project = "Deploy an end-to-end predictive model pipeline with hyperparameter tuning and cross-validation."
        elif "statistics" in skill_name.lower():
            exercise = "Perform hypothesis testing (t-tests, chi-squared) and confidence interval computations in Python."
            project = "Conduct an A/B testing analysis on user conversion data and deliver an executive report."
        elif "react" in skill_name.lower():
            exercise = "Build reusable component primitives with state hooks, effects, and custom hooks."
            project = "Develop an interactive data analytics dashboard with responsive charts and dark mode."
        elif "cloud" in skill_name.lower():
            exercise = "Configure IAM roles, S3 buckets, and EC2/Lambda execution environments."
            project = "Deploy a serverless microservice architecture with automated CI/CD deployment."
        elif "data structures" in skill_name.lower() or "algorithms" in skill_name.lower():
            exercise = "Solve 25 LeetCode-medium problems covering binary search, BFS/DFS, and dynamic programming."
            project = "Implement an optimized trie auto-complete engine and benchmarking suite."
        else:
            exercise = f"Complete guided exercises and competency assessments in {skill_name}."
            project = f"Deliver a portfolio artifact demonstrating production capability in {skill_name}."

        prereqs = SKILL_PREREQUISITES.get(skill_name, [])
        prereq_status = []
        all_prereqs_met = True
        for p in prereqs:
            p_score = student_map.get(p.lower(), 45.0)
            p_met = p.lower() in satisfied_skills or p_score >= 70.0
            if not p_met:
                all_prereqs_met = False
            prereq_status.append({"name": p, "met": p_met, "current_score": p_score})

        node_id = f"node-{skill_name.lower().replace(' ', '-').replace('&', 'and')}"
        is_completed = node_id in completed_ids or is_mastered

        skill_nodes.append({
            "id": node_id,
            "skill": skill_name,
            "category": category,
            "current_score": current,
            "target_score": target,
            "gap": gap,
            "priority": priority,
            "importance": importance,
            "is_mastered": is_mastered,
            "estimated_hours": estimated_hours,
            "prerequisites": prereq_status,
            "all_prereqs_met": all_prereqs_met,
            "role_context": f"Essential for {role_title}: provides the necessary competency to deliver industry standard deliverables.",
            "course": {
                "id": matching_course["id"] if matching_course else None,
                "title": matching_course["title"] if matching_course else f"Verified {skill_name} Course",
                "short_title": matching_course["short_title"] if matching_course else skill_name,
                "provider": matching_course["provider"] if matching_course else "Coursera / NPTEL",
                "institution": matching_course["institution"] if matching_course else "Accredited University",
                "instructor": matching_course.get("instructor") if matching_course else None,
                "url": matching_course["url"] if matching_course else "https://www.coursera.org",
                "duration": matching_course["duration"] if matching_course else "4-6 weeks",
                "duration_type": matching_course.get("duration_type", "Specialization") if matching_course else "Course",
                "has_certificate": matching_course.get("has_certificate", True) if matching_course else True,
                "certificate_type": matching_course.get("certificate_type", "Verified Certificate") if matching_course else "Verified Certificate",
                "is_free": matching_course.get("is_free", False) if matching_course else False,
                "overview": matching_course.get("overview", "") if matching_course else ""
            },
            "practical_exercise": exercise,
            "project_deliverable": project,
            "completion_criteria": f"Achieve score >= {target}% on CodeChef {skill_name} Assessment",
            "external_roadmap": ROADMAP_SH_REFS.get(skill_name) or ROADMAP_SH_REFS.get(role["id"]),
            "completed": is_completed,
            "status": "Completed" if is_completed else ("In Progress" if all_prereqs_met else "Up Next")
        })

    # 3. Directed Acyclic Graph (DAG) Topological Ordering
    # Prerequisite skills must precede dependent skills!
    # Among nodes with satisfied prerequisites, highest gap / priority comes first!
    remaining_nodes = [n for n in skill_nodes if not n["is_mastered"]]
    mastered_nodes = [n for n in skill_nodes if n["is_mastered"]]

    ordered_active_nodes = []
    resolved = set(satisfied_skills)

    while remaining_nodes:
        # Find candidates whose prerequisites are all resolved
        ready_candidates = [
            n for n in remaining_nodes
            if all(p["name"].lower() in resolved for p in n["prerequisites"])
        ]
        if not ready_candidates:
            # Cycle break or partial prereq: pick node with smallest pending prereqs & highest priority
            ready_candidates = remaining_nodes

        # Sort candidates by gap descending, critical priority first
        ready_candidates.sort(key=lambda x: (1 if x["priority"] == "Critical" else 0, x["gap"]), reverse=True)
        chosen = ready_candidates[0]

        ordered_active_nodes.append(chosen)
        resolved.add(chosen["skill"].lower())
        remaining_nodes.remove(chosen)

    # 4. Partition into Step-by-Step Structured Phases
    # Example Phase Structure:
    # Phase 1: Foundational Prerequisites & Critical Core Deficits
    # Phase 2: Applied Tooling & Framework Integration
    # Phase 3: Advanced Domain Competencies & Modeling
    # Phase 4: Production Capstone Project Implementation
    # Phase 5: Official Certification Defense & Industry Readiness

    phases = []
    current_week = 1
    hours_per_week = max(5, weekly_hours)

    # Divide ordered active nodes across stages (typically 2-3 skills per phase)
    stage_1_nodes = ordered_active_nodes[:2]
    stage_2_nodes = ordered_active_nodes[2:4]
    stage_3_nodes = ordered_active_nodes[4:]

    # Phase 1: Foundations
    if stage_1_nodes:
        phase_hours = sum(n["estimated_hours"] for n in stage_1_nodes)
        phase_weeks = max(1, round(phase_hours / hours_per_week))
        end_week = current_week + phase_weeks - 1
        phases.append({
            "phase_number": 1,
            "phase_id": "phase-foundations",
            "title": f"Phase 1: Foundational Prerequisite Deficits ({', '.join(n['skill'] for n in stage_1_nodes)})",
            "subtitle": f"Focus immediately on your highest-priority baseline gaps for {role_title}",
            "duration": f"Weeks {current_week}–{max(current_week, end_week)}",
            "weeks_span": phase_weeks,
            "estimated_hours": phase_hours,
            "status": "Completed" if all(n["completed"] for n in stage_1_nodes) else "In Progress",
            "nodes": stage_1_nodes
        })
        current_week = max(current_week + 1, end_week + 1)

    # Phase 2: Applied Tooling & Frameworks
    if stage_2_nodes:
        phase_hours = sum(n["estimated_hours"] for n in stage_2_nodes)
        phase_weeks = max(1, round(phase_hours / hours_per_week))
        end_week = current_week + phase_weeks - 1
        phases.append({
            "phase_number": 2,
            "phase_id": "phase-applied-tooling",
            "title": f"Phase 2: Applied Tooling & Intermediate Integration ({', '.join(n['skill'] for n in stage_2_nodes)})",
            "subtitle": "Leverage satisfied foundations to build practical, production-grade competency",
            "duration": f"Weeks {current_week}–{max(current_week, end_week)}",
            "weeks_span": phase_weeks,
            "estimated_hours": phase_hours,
            "status": "Completed" if all(n["completed"] for n in stage_2_nodes) else "Up Next",
            "nodes": stage_2_nodes
        })
        current_week = max(current_week + 1, end_week + 1)

    # Phase 3: Advanced Domain Deficits
    if stage_3_nodes:
        phase_hours = sum(n["estimated_hours"] for n in stage_3_nodes)
        phase_weeks = max(1, round(phase_hours / hours_per_week))
        end_week = current_week + phase_weeks - 1
        phases.append({
            "phase_number": 3,
            "phase_id": "phase-advanced-domain",
            "title": f"Phase 3: Advanced Specialization ({', '.join(n['skill'] for n in stage_3_nodes[:2])})",
            "subtitle": f"Tackle advanced analytical and domain modules required for senior {role_title} capability",
            "duration": f"Weeks {current_week}–{max(current_week, end_week)}",
            "weeks_span": phase_weeks,
            "estimated_hours": phase_hours,
            "status": "Completed" if all(n["completed"] for n in stage_3_nodes) else "Up Next",
            "nodes": stage_3_nodes
        })
        current_week = max(current_week + 1, end_week + 1)

    # Phase 4: Production Capstone Project
    capstone_hours = 25
    capstone_weeks = max(2, round(capstone_hours / hours_per_week))
    end_week = current_week + capstone_weeks - 1
    capstone_node = {
        "id": "node-capstone-project",
        "skill": "Multi-Disciplinary Production Capstone",
        "category": "Portfolio & Practical Delivery",
        "current_score": 0,
        "target_score": 100,
        "gap": 100,
        "priority": "High",
        "importance": "Critical",
        "is_mastered": False,
        "estimated_hours": capstone_hours,
        "prerequisites": [{"name": n["skill"], "met": n["completed"], "current_score": n["current_score"]} for n in ordered_active_nodes[:3]],
        "all_prereqs_met": all(n["completed"] for n in ordered_active_nodes[:2]),
        "role_context": f"Synthesizes all acquired competencies into an end-to-end working system matching actual {role_title} job specs.",
        "course": {
            "title": f"Production-Grade {role_title} Capstone Architecture",
            "short_title": "Industry Capstone",
            "provider": "STATWISE AI Portfolio Lab",
            "institution": "Enterprise Industry Mentors",
            "url": "https://github.com",
            "duration": "25 hours",
            "has_certificate": True,
            "certificate_type": "Verified Portfolio Artifact Credential",
            "is_free": True
        },
        "practical_exercise": "Architect repository structure, implement CI/CD tests, and containerize solution with Docker.",
        "project_deliverable": f"Deployed GitHub project with live URL, README documentation, and performance benchmarks for {role_title}.",
        "completion_criteria": "Peer review passing score and verified GitHub deployment",
        "external_roadmap": ROADMAP_SH_REFS.get(role["id"]),
        "completed": "node-capstone-project" in completed_ids,
        "status": "Completed" if "node-capstone-project" in completed_ids else "Up Next"
    }
    phases.append({
        "phase_number": len(phases) + 1,
        "phase_id": "phase-capstone",
        "title": "Phase 4: Real-World Capstone & End-to-End Delivery",
        "subtitle": f"Synthesize competencies into a public portfolio project tailored for {role_title}",
        "duration": f"Weeks {current_week}–{max(current_week, end_week)}",
        "weeks_span": capstone_weeks,
        "estimated_hours": capstone_hours,
        "status": "Completed" if capstone_node["completed"] else "Up Next",
        "nodes": [capstone_node]
    })
    current_week = max(current_week + 1, end_week + 1)

    # Phase 5: Industry Certification & Career Defense
    cert_hours = 20
    cert_weeks = max(2, round(cert_hours / hours_per_week))
    end_week = current_week + cert_weeks - 1
    cert_node = {
        "id": "node-certification-defense",
        "skill": "Official Industry Credential & Portfolio Defense",
        "category": "Career Validation",
        "current_score": 0,
        "target_score": 100,
        "gap": 100,
        "priority": "Critical",
        "importance": "Critical",
        "is_mastered": False,
        "estimated_hours": cert_hours,
        "prerequisites": [{"name": "Capstone Project", "met": capstone_node["completed"], "current_score": 100 if capstone_node["completed"] else 0}],
        "all_prereqs_met": capstone_node["completed"],
        "role_context": f"Validates your readiness with official third-party credential exams and technical interview defenses for {role_title}.",
        "course": {
            "title": f"Official {role_title} Examination Prep",
            "short_title": "Certification Defense",
            "provider": "Accredited Testing Authority",
            "institution": "Global Certification Board",
            "url": "https://www.coursera.org",
            "duration": "20 hours",
            "has_certificate": True,
            "certificate_type": "Official Industry Certification Credential",
            "is_free": False
        },
        "practical_exercise": "Take 3 timed mock certification exam papers and conduct 2 peer technical interview simulations.",
        "project_deliverable": "Official Certificate ID, verified LinkedIn badge, and tailored technical resume.",
        "completion_criteria": "Passing score on official certification examination or proctored defense",
        "external_roadmap": ROADMAP_SH_REFS.get(role["id"]),
        "completed": "node-certification-defense" in completed_ids,
        "status": "Completed" if "node-certification-defense" in completed_ids else "Up Next"
    }
    phases.append({
        "phase_number": len(phases) + 1,
        "phase_id": "phase-certification",
        "title": "Phase 5: Industry Certification & Job-Ready Defense",
        "subtitle": "Validate competencies through recognized industry credentials and interview readiness",
        "duration": f"Weeks {current_week}–{max(current_week, end_week)}",
        "weeks_span": cert_weeks,
        "estimated_hours": cert_hours,
        "status": "Completed" if cert_node["completed"] else "Up Next",
        "nodes": [cert_node]
    })

    # Summary Statistics
    all_nodes = [node for p in phases for node in p["nodes"]]
    total_nodes = len(all_nodes)
    completed_nodes = sum(1 for n in all_nodes if n["completed"])
    total_hours = sum(p["estimated_hours"] for p in phases)
    total_weeks = current_week - 1
    completion_percentage = round((completed_nodes / total_nodes) * 100) if total_nodes > 0 else 0

    result = {
        "role_id": role["id"],
        "role_title": role["title"],
        "weekly_hours": weekly_hours,
        "total_weeks": total_weeks,
        "total_hours": total_hours,
        "total_phases": len(phases),
        "total_nodes": total_nodes,
        "completed_nodes": completed_nodes,
        "completion_percentage": completion_percentage,
        "mastered_skills_skipped": [n["skill"] for n in mastered_nodes],
        "phases": phases,
        "official_roadmap_sh": ROADMAP_SH_REFS.get(role["id"]),
        "summary": (
            f"Generated an adaptive {len(phases)}-phase learning plan ({total_weeks} weeks at {weekly_hours}h/wk) for {role_title}. "
            f"Directly prioritizes {len(ordered_active_nodes)} competency deficits. "
            f"{len(mastered_nodes)} already-mastered skill(s) skipped to accelerate your career readiness."
        )
    }
    # Persist generated roadmap to SQLite database
    try:
        from database.db import save_student_roadmap
        save_student_roadmap(student_id, role["id"], result, weekly_hours)
    except Exception as e:
        pass

    return result
