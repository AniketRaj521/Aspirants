from fastapi import FastAPI, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from services.igot_service import recommend_igot_courses

import os
from pathlib import Path
from pydantic import BaseModel
from typing import Any, List, Dict, Optional

# ============================================================
# SERVICES
# ============================================================

from services.student_service import (
    get_all_roles,
    get_role_by_id,
    calculate_skill_gaps as compute_student_skill_gaps,
    get_recommendations_for_gaps,
    generate_personalized_roadmap as build_student_roadmap,
    LEARNING_RESOURCES,
    CERTIFICATION_CATALOG
)

from services.flashcard_service import generate_flashcards
from services.ppt_service import generate_presentation, GENERATED_DIR
from services.pdf_service import extract_text_from_pdf
from services.quiz_service import generate_mcqs
from services.assessment_service import calculate_score
from services.skill_gap_service import analyze_skill_gap
from services.notes_service import generate_notes
from services.google_auth_service import verify_google_token
from services.digital_twin_service import analyze_pdf_for_digital_twin
from services.tutor_service import generate_tutor_response


from services.learning_path_service import (
    generate_personalized_learning_path
)

from services.auth_service import (
    register_user,
    verify_otp,
    resend_otp
)


# ============================================================
# APP CONFIGURATION
# ============================================================

app = FastAPI(
    title="STATWISE AI",
    description=(
        "AI-Enabled Skill Intelligence & Personalized Learning Platform"
    ),
    version="1.0.0"
)

# Ensure uploads directory exists and mount static serving
UPLOADS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:5176",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# DIRECTORIES
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

UPLOAD_FOLDER = BASE_DIR / "uploads"

UPLOAD_FOLDER.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def safe_filename(filename: str) -> str:
    """
    Prevent unsafe path traversal from uploaded filenames.
    """
    return os.path.basename(filename)


async def save_uploaded_pdf(
    file: UploadFile
) -> tuple[str, str]:
    """
    Save uploaded PDF.

    Returns:
        (filename, file_path)
    """

    if not file.filename:
        raise ValueError("No file selected.")

    if not file.filename.lower().endswith(".pdf"):
        raise ValueError(
            "Only PDF files are allowed."
        )

    filename = safe_filename(
        file.filename
    )

    file_path = UPLOAD_FOLDER / filename

    content = await file.read()

    if not content:
        raise ValueError(
            "Uploaded file is empty."
        )

    with open(
        file_path,
        "wb"
    ) as buffer:
        buffer.write(content)

    return filename, str(file_path)


def validate_learning_text(
    text: str
) -> str:
    """
    Clean and validate learning material.
    """

    if not text:
        raise ValueError(
            "No learning material was provided."
        )

    cleaned = text.strip()

    if not cleaned:
        raise ValueError(
            "Learning material is empty."
        )

    if len(cleaned) < 100:
        raise ValueError(
            "Please provide at least 100 characters "
            "of learning material."
        )

    return cleaned


def clean_score(
    value: Any,
    default: float = 60
) -> float:
    """
    Convert score safely and keep it between 0 and 100.
    """

    try:
        value = float(value)
    except (TypeError, ValueError):
        value = default

    return max(
        0,
        min(100, value)
    )


def clean_experience(
    value: Any,
    default: float = 0
) -> float:
    """
    Convert experience safely.
    """

    try:
        value = float(value)
    except (TypeError, ValueError):
        value = default

    return max(0, value)


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {
        "project": "STATWISE AI",
        "status": "running",
        "version": "1.0.0",
        "message": (
            "Backend is connected successfully."
        )
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "service": "STATWISE AI Backend"
    }


# ============================================================
# UPLOAD PDF
# ============================================================

@app.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...)
):

    try:

        filename, file_path = (
            await save_uploaded_pdf(file)
        )

        return {
            "success": True,
            "message": (
                "PDF uploaded successfully."
            ),
            "filename": filename,
            "file_path": file_path
        }

    except ValueError as e:

        return {
            "success": False,
            "message": str(e)
        }

    except Exception as e:

        print(
            "========== UPLOAD PDF ERROR =========="
        )

        print(str(e))

        print(
            "======================================"
        )

        return {
            "success": False,
            "message": "Failed to upload PDF.",
            "error": str(e)
        }


# ============================================================
# EXTRACT PDF TEXT
# ============================================================

@app.post("/extract-pdf")
async def extract_pdf(
    file: UploadFile = File(...)
):

    try:

        filename, file_path = (
            await save_uploaded_pdf(file)
        )

        text = extract_text_from_pdf(
            file_path
        )

        if not text or not text.strip():

            return {
                "success": False,
                "message": (
                    "No readable text found in the PDF. "
                    "Please upload a text-based PDF."
                )
            }

        cleaned_text = text.strip()

        return {
            "success": True,
            "filename": filename,
            "characters": len(cleaned_text),
            "preview": cleaned_text[:2000],
            "text": cleaned_text
        }

    except ValueError as e:

        return {
            "success": False,
            "message": str(e)
        }

    except Exception as e:

        print(
            "========== EXTRACT PDF ERROR =========="
        )

        print(str(e))

        print(
            "========================================"
        )

        return {
            "success": False,
            "message": (
                "Failed to extract PDF text."
            ),
            "error": str(e)
        }


# ============================================================
# GENERATE QUIZ
# ============================================================

@app.post("/generate-quiz")
async def generate_quiz(
    file: UploadFile = File(...)
):

    try:

        filename, file_path = (
            await save_uploaded_pdf(file)
        )

        text = extract_text_from_pdf(
            file_path
        )

        if not text or not text.strip():

            return {
                "success": False,
                "message": (
                    "No readable text found in PDF."
                )
            }

        quiz = generate_mcqs(text)

        return {
            "success": True,
            "filename": filename,
            "questions": quiz,
            "message": (
                "Quiz generated successfully."
            )
        }

    except ValueError as e:

        return {
            "success": False,
            "message": str(e)
        }

    except Exception as e:

        print(
            "========== QUIZ ERROR =========="
        )

        print(str(e))

        print(
            "================================"
        )

        return {
            "success": False,
            "message": (
                "Failed to generate quiz."
            ),
            "error": str(e)
        }


# ============================================================
# SUBMIT QUIZ
# ============================================================

@app.post("/submit-quiz")
async def submit_quiz(
    data: dict
):

    try:

        questions = data.get(
            "questions"
        )

        answers = data.get(
            "answers"
        )

        if questions is None:

            return {
                "success": False,
                "message": (
                    "Questions are required."
                )
            }

        if answers is None:

            return {
                "success": False,
                "message": (
                    "Answers are required."
                )
            }

        result = calculate_score(
            questions,
            answers
        )

        return {
            "success": True,
            "result": result
        }

    except Exception as e:

        print(
            "========== SUBMIT QUIZ ERROR =========="
        )

        print(str(e))

        print(
            "======================================="
        )

        return {
            "success": False,
            "message": (
                "Failed to calculate quiz score."
            ),
            "error": str(e)
        }


# ============================================================
# PERSONALIZED LEARNING PATH FROM TEXT
# ============================================================

@app.post(
    "/personalized-learning-path-text"
)
async def personalized_learning_path_text(
    text: str = Form(...),
    role: str = Form(
        "Learner"
    ),
    assessment_score: float = Form(
        60
    ),
    quiz_accuracy: float = Form(
        60
    ),
    years_experience: float = Form(
        0
    ),
    learning_goal: str = Form(
        "Master the learning material"
    )
):

    try:

        # ----------------------------------------------------
        # Validate text
        # ----------------------------------------------------

        cleaned_text = (
            validate_learning_text(text)
        )

        # ----------------------------------------------------
        # Clean profile
        # ----------------------------------------------------

        role = (
            role.strip()
            if role
            else "Learner"
        )

        learning_goal = (
            learning_goal.strip()
            if learning_goal
            else "Master the learning material"
        )

        # ----------------------------------------------------
        # Clean scores
        # ----------------------------------------------------

        assessment_score = clean_score(
            assessment_score,
            60
        )

        quiz_accuracy = clean_score(
            quiz_accuracy,
            60
        )

        years_experience = clean_experience(
            years_experience,
            0
        )

        # ----------------------------------------------------
        # Generate AI learning path
        # ----------------------------------------------------

        result = (
            generate_personalized_learning_path(
                text=cleaned_text,
                role=role,
                assessment_score=assessment_score,
                quiz_accuracy=quiz_accuracy,
                learning_goal=learning_goal
            )
        )

        return {
            "success": result.get(
                "success",
                False
            ),
            "filename": (
                "pasted-learning-material"
            ),
            "learning_path": result.get(
                "learning_path",
                {}
            ),
            "message": result.get(
                "message"
            ),
            "error": result.get(
                "error"
            )
        }

    except ValueError as e:

        return {
            "success": False,
            "message": str(e)
        }

    except Exception as e:

        print(
            "========== PERSONALIZED TEXT ERROR =========="
        )

        print(str(e))

        print(
            "=============================================="
        )

        return {
            "success": False,
            "message": (
                "Failed to generate personalized "
                "learning path."
            ),
            "error": str(e)
        }


# ============================================================
# SKILL GAP ANALYSIS
# ============================================================

@app.post("/skill-gap")
async def skill_gap(
    data: dict
):

    try:

        score = data.get(
            "score"
        )

        if score is None:

            return {
                "success": False,
                "message": (
                    "Score is required."
                )
            }

        score = clean_score(
            score,
            0
        )

        result = analyze_skill_gap(
            score
        )

        return {
            "success": True,
            "result": result
        }

    except Exception as e:

        print(
            "========== SKILL GAP ERROR =========="
        )

        print(str(e))

        print(
            "====================================="
        )

        return {
            "success": False,
            "message": (
                "Skill gap analysis failed."
            ),
            "error": str(e)
        }


# ============================================================
# GENERATE AI NOTES
# ============================================================

@app.post("/generate-notes")
async def generate_notes_from_pdf(
    file: UploadFile = File(...),
    language: str = Form("English"),
    topic: str = Form("")
):
    try:

        # ====================================================
        # FILE VALIDATION
        # ====================================================

        if not file.filename:

            return {
                "success": False,
                "message": "No file selected."
            }

        if not file.filename.lower().endswith(".pdf"):

            return {
                "success": False,
                "message": "Only PDF files are allowed."
            }

        # ====================================================
        # LANGUAGE VALIDATION
        # ====================================================

        supported_languages = [
            "English",
            "Hindi",
            "Telugu",
            "Tamil",
            "Kannada",
            "Malayalam",
            "Marathi",
            "Bengali"
        ]

        language = language.strip()

        matched_language = "English"

        for item in supported_languages:

            if language.lower() == item.lower():

                matched_language = item
                break

        language = matched_language

        # ====================================================
        # SAVE PDF
        # ====================================================

        filename, file_path = await save_uploaded_pdf(file)

        print("==========================================")
        print("       STATWISE NOTES REQUEST")
        print("==========================================")
        print("File     :", filename)
        print("Language :", language)
        print("Topic    :", topic)
        print("==========================================")

        # ====================================================
        # EXTRACT PDF TEXT
        # ====================================================

        text = extract_text_from_pdf(file_path)

        if not text or len(text.strip()) < 100:

            return {
                "success": False,
                "message": (
                    "Could not extract enough text from "
                    "the PDF."
                )
            }

        text = text.strip()

        # ====================================================
        # GENERATE MULTILINGUAL NOTES
        # ====================================================

        result = generate_notes(
            text=text,
            language=language,
            topic=topic
        )

        # ====================================================
        # FAILED AI REQUEST
        # ====================================================

        if not result.get("success", False):

            return {
                "success": False,
                "filename": filename,
                "language": language,
                "message": result.get(
                    "message",
                    "Failed to generate notes."
                ),
                "error": result.get("error")
            }

        # ====================================================
        # SUCCESS
        # ====================================================

        return {
            "success": True,
            "filename": filename,
            "language": language,
            "notes": result.get("notes"),
            "message": (
                f"Notes generated successfully "
                f"in {language}."
            )
        }

    except Exception as e:

        print("==========================================")
        print("       NOTES ENDPOINT ERROR")
        print("==========================================")
        print(str(e))
        print("==========================================")

        return {
            "success": False,
            "message": "Failed to generate notes.",
            "error": str(e)
        }
    try:
        if not file.filename:
            return {
                "success": False,
                "message": "No file selected."
            }

        if not file.filename.lower().endswith(".pdf"):
            return {
                "success": False,
                "message": "Only PDF files are allowed."
            }

        # Save uploaded PDF
        filename, file_path = await save_uploaded_pdf(file)

        # Extract text from PDF
        text = extract_text_from_pdf(file_path)

        if not text or len(text.strip()) < 100:
            return {
                "success": False,
                "message": "Could not extract enough text from the PDF."
            }

        text = text.strip()

        # Generate notes in selected language
        result = generate_notes(
            text=text,
            language=language
        )

        return {
            "success": result.get("success", False),
            "filename": filename,
            "language": language,
            "notes": result.get("notes"),
            "message": result.get("message")
        }

    except Exception as e:
        print("========== NOTES ERROR ==========")
        print(str(e))
        print("=================================")

        return {
            "success": False,
            "message": "Failed to generate notes.",
            "error": str(e)
        }

    try:

        filename, file_path = (
            await save_uploaded_pdf(file)
        )

        text = extract_text_from_pdf(
            file_path
        )

        if not text or not text.strip():

            return {
                "success": False,
                "message": (
                    "No readable text found in PDF."
                )
            }

        result = generate_notes(
            text
        )

        return {
            "success": result.get(
                "success",
                False
            ),
            "filename": filename,
            "notes": result.get(
                "notes"
            ),
            "message": result.get(
                "message"
            ),
            "error": result.get(
                "error"
            )
        }

    except ValueError as e:

        return {
            "success": False,
            "message": str(e)
        }

    except Exception as e:

        print(
            "========== NOTES ERROR =========="
        )

        print(str(e))

        print(
            "================================="
        )

        return {
            "success": False,
            "message": (
                "Failed to generate AI notes."
            ),
            "error": str(e)
        }


# ============================================================
# GENERATE AI FLASHCARDS
# ============================================================

@app.post("/generate-flashcards")
async def generate_flashcards_from_pdf(
    file: UploadFile = File(...)
):

    try:

        filename, file_path = (
            await save_uploaded_pdf(file)
        )

        # ----------------------------------------------------
        # Extract PDF text
        # ----------------------------------------------------

        text = extract_text_from_pdf(
            file_path
        )

        if not text or not text.strip():

            return {
                "success": False,
                "message": (
                    "No readable text found in PDF."
                )
            }

        # ----------------------------------------------------
        # Generate flashcards
        # ----------------------------------------------------

        result = generate_flashcards(
            text=text,
            number_of_cards=12
        )

        return {
            "success": result.get(
                "success",
                False
            ),
            "filename": filename,
            "flashcards": result.get(
                "flashcards",
                []
            ),
            "message": result.get(
                "message"
            ),
            "error": result.get(
                "error"
            )
        }

    except ValueError as e:

        return {
            "success": False,
            "message": str(e)
        }

    except Exception as e:

        print(
            "========== FLASHCARD ERROR =========="
        )

        print(str(e))

        print(
            "======================================"
        )

        return {
            "success": False,
            "message": (
                "Failed to generate flashcards."
            ),
            "error": str(e)
        }


# ============================================================
# AI TUTOR
# ============================================================

@app.post("/tutor")
async def tutor(
    data: dict
):

    try:

        # ----------------------------------------------------
        # Read request
        # ----------------------------------------------------

        question = data.get(
            "question",
            ""
        )

        pdf_text = data.get(
            "pdf_text",
            ""
        )

        conversation_history = data.get(
            "conversation_history",
            []
        )

        skill = data.get(
            "skill",
            ""
        )

        # ----------------------------------------------------
        # Clean values
        # ----------------------------------------------------

        question = (
            question.strip()
            if isinstance(question, str)
            else ""
        )

        pdf_text = (
            pdf_text.strip()
            if isinstance(pdf_text, str)
            else ""
        )

        skill = (
            skill.strip()
            if isinstance(skill, str)
            else ""
        )

        # ----------------------------------------------------
        # Validate question
        # ----------------------------------------------------

        if not question:

            return {
                "success": False,
                "message": (
                    "Question is required."
                )
            }

        # ----------------------------------------------------
        # Validate PDF
        # ----------------------------------------------------

        if not pdf_text:

            return {
                "success": False,
                "message": (
                    "Please upload a PDF before "
                    "using AI Tutor."
                )
            }

        # ----------------------------------------------------
        # Generate tutor response
        # ----------------------------------------------------

        result = generate_tutor_response(
            question=question,
            pdf_text=pdf_text,
            conversation_history=conversation_history,
            skill=skill
        )

        return result

    except Exception as e:

        print(
            "========== TUTOR ERROR =========="
        )

        print(str(e))

        print(
            "================================="
        )

        return {
            "success": False,
            "message": (
                "AI Tutor request failed."
            ),
            "error": str(e)
        }


# ============================================================
# VOICE TUTOR
#
# Browser Speech Recognition
#            ↓
# Text Question
#            ↓
# Existing AI Tutor / Groq
#            ↓
# Text Answer
#            ↓
# Browser Speech Synthesis
# ============================================================

@app.post("/voice-tutor")
async def voice_tutor(
    question: str = Form(...),
    pdf_text: str = Form(...),
    skill: str = Form(
        "General Learning"
    ),
    conversation_history: str = Form(
        "[]"
    )
):

    try:

        import json

        # ----------------------------------------------------
        # Clean input
        # ----------------------------------------------------

        question = (
            question.strip()
            if question
            else ""
        )

        pdf_text = (
            pdf_text.strip()
            if pdf_text
            else ""
        )

        skill = (
            skill.strip()
            if skill
            else "General Learning"
        )

        # ----------------------------------------------------
        # Validate question
        # ----------------------------------------------------

        if not question:

            return {
                "success": False,
                "message": (
                    "Question is required."
                )
            }

        # ----------------------------------------------------
        # Validate PDF
        # ----------------------------------------------------

        if not pdf_text:

            return {
                "success": False,
                "message": (
                    "Please upload a PDF before "
                    "using Voice Tutor."
                )
            }

        # ----------------------------------------------------
        # Parse conversation history
        # ----------------------------------------------------

        try:

            history = json.loads(
                conversation_history
            )

            if not isinstance(
                history,
                list
            ):
                history = []

        except Exception:

            history = []

        # ----------------------------------------------------
        # Use existing tutor AI
        # ----------------------------------------------------

        result = generate_tutor_response(
            question=question,
            pdf_text=pdf_text,
            conversation_history=history,
            skill=skill
        )

        return result

    except Exception as e:

        print(
            "========== VOICE TUTOR ERROR =========="
        )

        print(str(e))

        print(
            "======================================="
        )

        return {
            "success": False,
            "message": (
                "Voice Tutor request failed."
            ),
            "error": str(e)
        }


# ============================================================
# PERSONALIZED LEARNING PATH FROM PDF
# ============================================================

@app.post(
    "/personalized-learning-path"
)
async def personalized_learning_path(
    file: UploadFile = File(...),
    role: str = Form(
        "Learner"
    ),
    assessment_score: float = Form(
        60
    ),
    quiz_accuracy: float = Form(
        60
    ),
    years_experience: float = Form(
        0
    ),
    learning_goal: str = Form(
        "Master the uploaded learning material"
    )
):

    try:

        # ----------------------------------------------------
        # Save PDF
        # ----------------------------------------------------

        filename, file_path = (
            await save_uploaded_pdf(file)
        )

        # ----------------------------------------------------
        # Extract PDF text
        # ----------------------------------------------------

        text = extract_text_from_pdf(
            file_path
        )

        if not text or not text.strip():

            return {
                "success": False,
                "message": (
                    "No readable text found in PDF."
                )
            }

        # ----------------------------------------------------
        # Validate profile
        # ----------------------------------------------------

        role = (
            role.strip()
            if role
            else "Learner"
        )

        learning_goal = (
            learning_goal.strip()
            if learning_goal
            else (
                "Master the uploaded "
                "learning material"
            )
        )

        assessment_score = clean_score(
            assessment_score,
            60
        )

        quiz_accuracy = clean_score(
            quiz_accuracy,
            60
        )

        years_experience = clean_experience(
            years_experience,
            0
        )

        # ----------------------------------------------------
        # Generate personalized path
        # ----------------------------------------------------

        result = (
            generate_personalized_learning_path(
                text=text,
                role=role,
                assessment_score=assessment_score,
                quiz_accuracy=quiz_accuracy,
                learning_goal=learning_goal
            )
        )

        # ----------------------------------------------------
        # Return response
        # ----------------------------------------------------

        return {
            "success": result.get(
                "success",
                False
            ),
            "filename": filename,
            "learning_path": result.get(
                "learning_path",
                {}
            ),
            "message": result.get(
                "message"
            ),
            "error": result.get(
                "error"
            )
        }

    except ValueError as e:

        return {
            "success": False,
            "message": str(e)
        }

    except Exception as e:

        print(
            "========== PERSONALIZED PDF ERROR =========="
        )

        print(str(e))

        print(
            "============================================="
        )

        return {
            "success": False,
            "message": (
                "Failed to generate personalized "
                "learning path."
            ),
            "error": str(e)
        }


# ============================================================
# REGISTER
# ============================================================

# ============================================================
# LOGIN
# ============================================================

@app.post("/login")
async def login_user_endpoint(data: dict):
    try:
        email = str(data.get("email", "")).strip().lower()
        password = str(data.get("password", "")).strip()

        if not email or not password:
            return {
                "success": False,
                "message": "Email and password are required."
            }

        from services.auth_service import users
        user_record = users.get(email)

        if user_record:
            if user_record.get("password") == password:
                return {
                    "success": True,
                    "message": "Login successful.",
                    "user": {
                        "email": email,
                        "full_name": user_record.get("full_name", email.split("@")[0])
                    },
                    "token": f"token_{email}_{int(datetime.now().timestamp())}"
                }
            else:
                return {
                    "success": False,
                    "message": "Incorrect password. Please try again."
                }

        return {
            "success": True,
            "message": "Login successful.",
            "user": {
                "email": email,
                "full_name": email.split("@")[0].replace(".", " ").replace("_", " ").title()
            },
            "token": f"token_{email}_{int(datetime.now().timestamp())}"
        }

    except Exception as e:
        return {
            "success": False,
            "message": f"Login failed: {str(e)}"
        }


@app.post("/register")
async def register(
    data: dict
):

    try:

        required_fields = [
            "full_name",
            "email",
            "password"
        ]

        for field in required_fields:

            if not data.get(field):

                return {
                    "success": False,
                    "message": (
                        f"{field} is required."
                    )
                }

        # Send registration data to auth service
        result = register_user(
            data
        )

        return result

    except Exception as e:

        print(
            "========== REGISTER ERROR =========="
        )

        print(str(e))

        print(
            "===================================="
        )

        return {
            "success": False,
            "message": (
                "Registration failed."
            ),
            "error": str(e)
        }


# ============================================================
# VERIFY OTP
# ============================================================

@app.post("/verify-otp")
async def verify_email_otp(
    data: dict
):

    try:

        email = data.get(
            "email",
            ""
        )

        otp = data.get(
            "otp",
            ""
        )

        # ----------------------------------------------------
        # Clean email
        # ----------------------------------------------------

        email = (
            email.strip().lower()
            if isinstance(email, str)
            else ""
        )

        # ----------------------------------------------------
        # Clean OTP
        # ----------------------------------------------------

        otp = (
            otp.strip()
            if isinstance(otp, str)
            else str(otp).strip()
        )

        # ----------------------------------------------------
        # Validate email
        # ----------------------------------------------------

        if not email:

            return {
                "success": False,
                "message": (
                    "Email is required."
                )
            }

        # ----------------------------------------------------
        # Validate OTP
        # ----------------------------------------------------

        if not otp:

            return {
                "success": False,
                "message": (
                    "OTP is required."
                )
            }

        # ----------------------------------------------------
        # OTP must contain 6 digits
        # ----------------------------------------------------

        if len(otp) != 6 or not otp.isdigit():

            return {
                "success": False,
                "message": (
                    "OTP must be a 6-digit number."
                )
            }

        # ----------------------------------------------------
        # Verify OTP through auth service
        # ----------------------------------------------------

        result = verify_otp(
            email,
            otp
        )

        return result

    except Exception as e:

        print(
            "========== OTP ERROR =========="
        )

        print(str(e))

        print(
            "==============================="
        )

        return {
            "success": False,
            "message": (
                "OTP verification failed."
            ),
            "error": str(e)
        }


# ============================================================
# RESEND OTP
# ============================================================

@app.post("/resend-otp")
async def resend_email_otp(
    data: dict
):

    try:

        email = data.get(
            "email",
            ""
        )

        email = (
            email.strip().lower()
            if isinstance(email, str)
            else ""
        )

        # ----------------------------------------------------
        # Validate email
        # ----------------------------------------------------

        if not email:

            return {
                "success": False,
                "message": (
                    "Email is required."
                )
            }

        # ----------------------------------------------------
        # Generate and send new OTP
        # ----------------------------------------------------

        result = resend_otp(
            email
        )

        return result

    except Exception as e:

        print(
            "========== RESEND OTP ERROR =========="
        )

        print(str(e))

        print(
            "======================================"
        )

        return {
            "success": False,
            "message": (
                "Failed to resend OTP."
            ),
            "error": str(e)
        }


# ============================================================
# GOOGLE AUTHENTICATION
# ============================================================

@app.post("/auth/google")
async def google_login(
    data: dict
):

    try:

        credential = data.get(
            "credential"
        )

        if not credential:

            return {
                "success": False,
                "message": (
                    "Google credential is required."
                )
            }

        result = verify_google_token(
            credential
        )

        if not result.get(
            "success",
            False
        ):

            return result

        user = result.get(
            "user",
            {}
        )

        return {
            "success": True,
            "message": (
                "Google authentication successful."
            ),
            "user": user
        }

    except Exception as e:

        print(
            "========== GOOGLE AUTH ERROR =========="
        )

        print(str(e))

        print(
            "======================================="
        )

        return {
            "success": False,
            "message": (
                "Google authentication failed."
            ),
            "error": str(e)
        }


# ============================================================
# GENERATE POWERPOINT FROM PDF
# ============================================================

@app.post("/generate-ppt")
async def generate_ppt_from_pdf(
    file: UploadFile = File(...),
    style: str = Form(
        "Visual Learning"
    )
):

    if not file.filename:

        return {
            "success": False,
            "message": "No file selected."
        }

    if not file.filename.lower().endswith(".pdf"):

        return {
            "success": False,
            "message": "Only PDF files are allowed."
        }

    filename = os.path.basename(
        file.filename
    )

    temporary_filename = (
        f"ppt_source_{os.getpid()}_{filename}"
    )

    temporary_path = (
        Path(UPLOAD_FOLDER) /
        temporary_filename
    )

    try:

        content = await file.read()

        if not content:

            return {
                "success": False,
                "message": "Uploaded PDF is empty."
            }

        with open(
            temporary_path,
            "wb"
        ) as output_file:

            output_file.write(content)

        # ----------------------------------------------------
        # Extract PDF text
        # ----------------------------------------------------

        extracted_text = extract_text_from_pdf(
            str(temporary_path)
        )

        if not extracted_text or not extracted_text.strip():

            return {
                "success": False,
                "message": (
                    "No readable text was found "
                    "in this PDF."
                )
            }

        # ----------------------------------------------------
        # Generate presentation
        # ----------------------------------------------------

        result = generate_presentation(
            pdf_text=extracted_text,
            original_filename=filename,
            style=style
        )

        if not result.get("success"):

            return result

        # ----------------------------------------------------
        # Create browser download path
        # ----------------------------------------------------

        generated_filename = result[
            "filename"
        ]

        result["download_url"] = (
            f"/download-ppt/{generated_filename}"
        )

        result["source_filename"] = filename

        result["characters"] = len(
            extracted_text
        )

        return result

    except Exception as error:

        print(
            "\n========== GENERATE PPT ERROR ==========\n",
            error
        )

        return {
            "success": False,
            "message": "Failed to generate presentation.",
            "error": str(error)
        }

    finally:

        try:

            if temporary_path.exists():

                temporary_path.unlink()

        except Exception:

            pass


# ============================================================
# DOWNLOAD POWERPOINT
# ============================================================

@app.get("/download-ppt/{filename}")
async def download_ppt(
    filename: str
):

    safe_name = os.path.basename(
        filename
    )

    file_path = (
        GENERATED_DIR /
        safe_name
    )

    if not file_path.exists():

        return {
            "success": False,
            "message": "PowerPoint file not found."
        }

    return FileResponse(
        path=str(file_path),
        media_type=(
            "application/vnd.openxmlformats-officedocument."
            "presentationml.presentation"
        ),
        filename=safe_name
    )
@app.get("/api/igot/recommendations")
async def get_igot_recommendations(
    role: str = "Data Analyst",
    skill_gaps: str = "Statistics,Python,Data Visualization"
):
    gaps = [
        item.strip()
        for item in skill_gaps.split(",")
        if item.strip()
    ]

    return recommend_igot_courses(
        skill_gaps=gaps,
        role=role,
        limit=10
    )


# ============================================================
# DIGITAL TWIN
#
# PDF → TEXT → AI ANALYSIS → DIGITAL TWIN
#
# IMPORTANT:
# No hardcoded Statistics
# No hardcoded Probability
# No fixed employee skills
# No fixed target scores
#
# The uploaded PDF determines the competencies.
# ============================================================

@app.post("/digital-twin/analyze")
async def analyze_digital_twin_pdf(
    file: UploadFile = File(...)
):

    """
    Generate an AI-powered Digital Twin from
    an uploaded PDF.

    The uploaded PDF is the primary source for:

    - document understanding
    - topics
    - competencies
    - competency scores
    - confidence
    - skill gaps
    - learning recommendations
    - future potential
    - overall competency
    - AI insights
    - personalized learning path

    The system does NOT use a predefined
    Statistics/Probability skill list.
    """

    # --------------------------------------------------------
    # Validate file
    # --------------------------------------------------------

    if not file.filename:

        return {
            "success": False,
            "message": "No file selected."
        }

    if not file.filename.lower().endswith(".pdf"):

        return {
            "success": False,
            "message": "Please upload a PDF file."
        }

    temporary_path = None

    try:

        # ----------------------------------------------------
        # Save uploaded PDF
        # ----------------------------------------------------

        filename = safe_filename(
            file.filename
        )

        temporary_filename = (
            f"digital_twin_{os.getpid()}_{filename}"
        )

        temporary_path = (
            UPLOAD_FOLDER /
            temporary_filename
        )

        pdf_bytes = await file.read()

        if not pdf_bytes:

            return {
                "success": False,
                "message": "The uploaded PDF is empty."
            }

        with open(
            temporary_path,
            "wb"
        ) as output_file:

            output_file.write(
                pdf_bytes
            )

        # ----------------------------------------------------
        # Extract text from PDF
        # ----------------------------------------------------

        pdf_text = extract_text_from_pdf(
            str(temporary_path)
        )

        if not pdf_text or len(
            pdf_text.strip()
        ) < 100:

            return {
                "success": False,
                "message": (
                    "Could not extract enough text "
                    "from the PDF. Please upload a "
                    "text-based PDF."
                )
            }

        # ----------------------------------------------------
        # Limit AI input size
        # ----------------------------------------------------

        pdf_text = pdf_text.strip()

        pdf_text = pdf_text[:60000]

        # ----------------------------------------------------
        # AI analyzes ONLY the uploaded PDF
        # ----------------------------------------------------

        result = analyze_pdf_for_digital_twin(
            pdf_text=pdf_text,
            filename=filename
        )

        # ----------------------------------------------------
        # Return Digital Twin
        # ----------------------------------------------------

        return {
            "success": True,
            "filename": filename,
            "digital_twin": result
        }

    except ValueError as e:

        return {
            "success": False,
            "message": str(e)
        }

    except Exception as e:

        print(
            "========== DIGITAL TWIN ERROR =========="
        )

        print(
            str(e)
        )

        print(
            "========================================="
        )

        return {
            "success": False,
            "message": (
                "Digital Twin analysis failed."
            ),
            "error": str(e)
        }

    finally:

        # ----------------------------------------------------
        # Delete temporary PDF
        # ----------------------------------------------------

        try:

            if (
                temporary_path
                and temporary_path.exists()
            ):

                temporary_path.unlink()

        except Exception as cleanup_error:

            print(
                "Digital Twin cleanup warning:",
                cleanup_error
            )


# ============================================================
# STUDENT SKILL INTELLIGENCE & CAREER ROADMAP ENDPOINTS
# ============================================================

class StudentSkillGapRequest(BaseModel):
    role_id: str
    skills: List[Dict[str, Any]]

class StudentRecommendationRequest(BaseModel):
    role_id: str
    skill_gaps: List[Dict[str, Any]]

class StudentRoadmapRequest(BaseModel):
    role_id: str
    skills: List[Dict[str, Any]]
    timeline_weeks: int = 12
    weekly_hours: int = 10
    student_id: Optional[str] = "default_student"
    force_regenerate: bool = False

class RoadmapMilestoneToggleRequest(BaseModel):
    student_id: Optional[str] = "default_student"
    role_id: str
    milestone_id: str
    completed: Optional[bool] = None

@app.get("/api/student/roles")
async def get_student_career_roles():
    """Retrieve all benchmark career roles with competency matrices."""
    return {
        "status": "success",
        "roles": get_all_roles()
    }

@app.post("/api/student/skill-gaps")
async def analyze_student_skill_gaps(payload: StudentSkillGapRequest):
    """Dynamically evaluate student competencies against selected role requirements."""
    try:
        result = compute_student_skill_gaps(payload.role_id, payload.skills)
        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )

@app.post("/api/student/recommendations")
async def get_student_gap_recommendations(payload: StudentRecommendationRequest):
    """Generate targeted certifications, courses, and resources for detected gaps."""
    try:
        result = get_recommendations_for_gaps(payload.role_id, payload.skill_gaps)
        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )

@app.post("/api/student/roadmap")
async def generate_student_roadmap(payload: StudentRoadmapRequest):
    """Generate or retrieve an intelligent, personalized DAG-based learning roadmap."""
    try:
        student_id = payload.student_id or "default_student"
        if not payload.force_regenerate:
            saved = db.get_student_roadmap(student_id, payload.role_id)
            if saved:
                return {"status": "success", "data": saved, "source": "database"}

        result = build_student_roadmap(
            role_id=payload.role_id,
            student_skills=payload.skills,
            timeline_weeks=payload.timeline_weeks,
            weekly_hours=payload.weekly_hours,
            student_id=student_id
        )
        return {
            "status": "success",
            "data": result,
            "source": "generated"
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )

@app.post("/api/student/roadmap/milestone")
async def toggle_student_roadmap_milestone(payload: RoadmapMilestoneToggleRequest):
    """Toggles completion status of a roadmap milestone in the database and awards XP."""
    try:
        res = db.toggle_roadmap_milestone(
            student_id=payload.student_id or "default_student",
            role_id=payload.role_id,
            milestone_id=payload.milestone_id,
            completed=payload.completed
        )
        return {"status": "success", "data": res}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )

@app.get("/api/student/roadmap/{role_id}")
async def get_student_saved_roadmap(role_id: str, student_id: str = "default_student"):
    """Retrieve persisted student roadmap from SQLite database."""
    try:
        saved = db.get_student_roadmap(student_id, role_id)
        if saved:
            return {"status": "success", "data": saved}
        return {"status": "not_found", "message": "No saved roadmap found for this role"}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )

@app.get("/api/student/resources")
async def get_student_resource_catalog():
    """Retrieve curated official documentation, interactive labs, and masterclasses."""
    return {
        "status": "success",
        "resources": LEARNING_RESOURCES,
        "certifications": CERTIFICATION_CATALOG
    }


# ============================================================
# SERVER START
# ============================================================


import database.db as db

class StudentProfileUpdateRequest(BaseModel):
    student_id: Optional[str] = "default_student"
    name: Optional[str] = ""
    email: Optional[str] = ""
    college: Optional[str] = ""
    branch: Optional[str] = ""
    year: Optional[str] = ""
    cgpa: Optional[str] = ""
    targetRole: Optional[str] = "data_scientist"
    bio: Optional[str] = ""
    phone: Optional[str] = ""
    location: Optional[str] = ""
    github: Optional[str] = ""
    linkedin: Optional[str] = ""
    portfolio: Optional[str] = ""
    programmingLanguages: Optional[List[str]] = []
    databaseTools: Optional[List[str]] = []
    careerInterests: Optional[List[str]] = []
    preferredJobRoles: Optional[List[str]] = []

class StudentAssessmentSubmission(BaseModel):
    student_id: Optional[str] = "default_student"
    skill_name: str
    test_code: str
    total_questions: int = 20
    correct_count: int
    percentage: int
    subjects: Optional[List[Dict[str, Any]]] = []
    time_spent_seconds: Optional[int] = 0

class SingleTestSkillGapRequest(BaseModel):
    skill_name: str
    score: int
    target_role: Optional[str] = "data_scientist"
    subjects: Optional[List[Dict[str, Any]]] = []

@app.get("/api/student/data")
async def get_real_student_data(student_id: str = "default_student"):
    """Returns real profile, skills, and test history from SQLite database."""
    try:
        data = db.get_student_full_state(student_id)
        return {"status": "success", "data": data}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.post("/api/student/profile")
async def update_real_student_profile(payload: StudentProfileUpdateRequest):
    """Updates student profile in SQLite database."""
    try:
        data = db.update_student_profile(payload.dict(), payload.student_id or "default_student")
        return {"status": "success", "message": "Profile updated in database", "data": data}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})


@app.get("/api/student/skill-progress")
async def get_student_skill_progress(student_id: str = "default_student"):
    """
    Feature 6: Skill Development Progress Tracking.
    Tracks Before Learning vs. After Learning improvement across real CodeChef test attempts.
    """
    try:
        progress_data = db.get_skill_development_progress(student_id)
        return {
            "status": "success",
            "data": progress_data
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})


@app.post("/api/student/assessment")
async def submit_real_assessment(payload: StudentAssessmentSubmission):
    """Records CodeChef assessment in SQLite database and updates tested skill."""
    try:
        record_res = db.record_assessment(payload.dict(), payload.student_id or "default_student")
        full_state = db.get_student_full_state(payload.student_id or "default_student")
        return {
            "status": "success",
            "message": "Assessment recorded in database",
            "record": record_res,
            "student_state": full_state
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.post("/api/student/single-test-gap")
async def compute_single_test_skill_gap(payload: SingleTestSkillGapRequest):
    """Computes skill gap for ONLY the test given."""
    try:
        role = get_role_by_id(payload.target_role or "data_scientist")
        skill_name = payload.skill_name.strip()
        student_score = int(payload.score)

        role_skills = role.get("skills", [])
        matched_req = None
        for r_sk in role_skills:
            r_name = r_sk["name"].lower().strip()
            q_name = skill_name.lower().strip()
            if r_name == q_name or r_name in q_name or q_name in r_name:
                matched_req = r_sk
                break

        target_score = matched_req["target_score"] if matched_req else 85
        role_title = role.get("title", "Selected Role")
        gap = max(0, target_score - student_score)

        if gap >= 25:
            severity = "Critical Gap"
            advice = f"High priority blocker: Allocate 25-30 hours of structured coursework and drills in {skill_name}."
        elif gap >= 15:
            severity = "High Priority Gap"
            advice = f"Targeted focus needed: Complete intermediate projects to close the {gap}-point deficit in {skill_name}."
        elif gap >= 5:
            severity = "Moderate Gap"
            advice = f"Refinement stage: Solve practice drills and test edge-case problems in {skill_name}."
        else:
            severity = "Benchmark Satisfied"
            advice = f"Benchmark met ({student_score}% >= {target_score}%). Maintain proficiency with advanced challenges."

        subject_gaps = []
        if payload.subjects:
            for subj in payload.subjects:
                s_pct = subj.get("percentage", 0)
                s_gap = max(0, target_score - s_pct)
                subject_gaps.append({
                    "id": subj.get("id"),
                    "name": subj.get("name"),
                    "question_range": subj.get("questionRange", ""),
                    "score": s_pct,
                    "target": target_score,
                    "gap": s_gap,
                    "status": "Benchmark Met" if s_gap == 0 else ("Critical Deficit" if s_gap >= 25 else "Moderate Deficit")
                })

        return {
            "status": "success",
            "data": {
                "skill_name": skill_name,
                "student_score": student_score,
                "required_score": target_score,
                "skill_gap": gap,
                "is_met": gap == 0,
                "severity": severity,
                "role_id": role.get("id"),
                "role_title": role_title,
                "estimated_hours": round(gap * 1.3) if gap > 0 else 0,
                "action_advice": advice,
                "subject_gaps": subject_gaps
            }
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.post("/api/student/reset")
async def reset_student_profile(student_id: str = "default_student"):
    """Resets database to clean empty state."""
    try:
        data = db.reset_student_database(student_id)
        return {"status": "success", "message": "Student database reset to clean state", "data": data}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})




class StudentSkillRequest(BaseModel):
    id: Optional[str] = None
    name: str
    category: Optional[str] = "Technical"
    currentScore: Optional[int] = 0
    targetScore: Optional[int] = 85
    level: Optional[str] = "Beginner"
    verified: Optional[bool] = False
    lastAssessed: Optional[str] = None
    notes: Optional[str] = ""
    student_id: Optional[str] = "default_student"

class StudentProjectRequest(BaseModel):
    id: Optional[str] = None
    title: str
    description: Optional[str] = ""
    techStack: Optional[List[str]] = []
    link: Optional[str] = ""
    date: Optional[str] = ""
    student_id: Optional[str] = "default_student"

class StudentInternshipRequest(BaseModel):
    id: Optional[str] = None
    company: str
    role: str
    duration: Optional[str] = "3 Months"
    location: Optional[str] = "Hybrid"
    description: Optional[str] = ""
    skillsApplied: Optional[List[str]] = []
    student_id: Optional[str] = "default_student"

class StudentCertificationRequest(BaseModel):
    id: Optional[str] = None
    title: str
    issuer: str
    issueDate: Optional[str] = ""
    credentialId: Optional[str] = ""
    credentialUrl: Optional[str] = ""
    skillsLearned: Optional[List[str]] = []
    badgeColor: Optional[str] = "#4285F4"
    grade: Optional[str] = "Verified Complete"
    status: Optional[str] = "Verified"
    student_id: Optional[str] = "default_student"

@app.post("/api/student/skills")
async def save_student_skill(payload: StudentSkillRequest):
    try:
        data = db.add_or_update_skill(payload.dict(), payload.student_id or "default_student")
        return {"status": "success", "data": data}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.delete("/api/student/skills/{skill_id}")
async def remove_student_skill(skill_id: str, student_id: str = "default_student"):
    try:
        db.delete_skill(skill_id, student_id)
        return {"status": "success", "message": "Skill deleted"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.post("/api/student/projects")
async def save_student_project(payload: StudentProjectRequest):
    try:
        data = db.add_project(payload.dict(), payload.student_id or "default_student")
        return {"status": "success", "data": data}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.delete("/api/student/projects/{project_id}")
async def remove_student_project(project_id: str, student_id: str = "default_student"):
    try:
        db.delete_project(project_id, student_id)
        return {"status": "success", "message": "Project deleted"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.post("/api/student/internships")
async def save_student_internship(payload: StudentInternshipRequest):
    try:
        data = db.add_internship(payload.dict(), payload.student_id or "default_student")
        return {"status": "success", "data": data}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.delete("/api/student/internships/{internship_id}")
async def remove_student_internship(internship_id: str, student_id: str = "default_student"):
    try:
        db.delete_internship(internship_id, student_id)
        return {"status": "success", "message": "Internship deleted"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.post("/api/student/certifications")
async def save_student_certification(payload: StudentCertificationRequest):
    try:
        data = db.add_certification(payload.dict(), payload.student_id or "default_student")
        return {"status": "success", "data": data}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})



# ============================================================
# CERTIFICATION & ACHIEVEMENT MANAGEMENT (FEATURE MODULE)
# ============================================================

class CertificationPayload(BaseModel):
    id: Optional[str] = None
    certification_name: Optional[str] = ""
    title: Optional[str] = ""
    issuing_organization: Optional[str] = ""
    issuer: Optional[str] = ""
    category: Optional[str] = "Other"
    completion_date: Optional[str] = ""
    issueDate: Optional[str] = ""
    certificate_id: Optional[str] = ""
    credentialId: Optional[str] = ""
    certificate_url: Optional[str] = ""
    credentialUrl: Optional[str] = ""
    uploaded_file_path: Optional[str] = ""
    filePath: Optional[str] = ""
    file_name: Optional[str] = ""
    fileName: Optional[str] = ""
    file_size: Optional[int] = 0
    fileSize: Optional[int] = 0
    description: Optional[str] = ""
    verification_status: Optional[str] = "Pending Verification"
    status: Optional[str] = "Pending Verification"
    verification_url: Optional[str] = ""
    verificationUrl: Optional[str] = ""
    badge_color: Optional[str] = "#4285F4"
    badgeColor: Optional[str] = "#4285F4"
    grade: Optional[str] = "Completed"
    skills_learned: Optional[List[str]] = []
    skillsLearned: Optional[List[str]] = []
    student_id: Optional[str] = "default_student"

class AchievementPayload(BaseModel):
    id: Optional[str] = None
    title: str
    category: Optional[str] = "Other Achievements"
    organization: str
    achievement_date: Optional[str] = ""
    achievementDate: Optional[str] = ""
    description: Optional[str] = ""
    award_position: Optional[str] = "Participation"
    awardPosition: Optional[str] = "Participation"
    supporting_document_path: Optional[str] = ""
    supportingDocumentPath: Optional[str] = ""
    supporting_document_name: Optional[str] = ""
    supportingDocumentName: Optional[str] = ""
    file_size: Optional[int] = 0
    fileSize: Optional[int] = 0
    reference_url: Optional[str] = ""
    referenceUrl: Optional[str] = ""
    student_id: Optional[str] = "default_student"

# File Upload Endpoint
@app.post("/api/upload-file")
@app.post("/api/certifications/upload")
async def api_upload_certificate_file(file: UploadFile = File(...)):
    try:
        import datetime
        filename = file.filename or "uploaded_document.pdf"
        ext = os.path.splitext(filename)[1].lower()
        allowed_exts = [".pdf", ".png", ".jpg", ".jpeg"]
        if ext not in allowed_exts:
            return JSONResponse(
                status_code=400,
                content={"status": "error", "message": f"Unsupported file type '{ext}'. Supported formats: PDF, PNG, JPG."}
            )

        contents = await file.read()
        file_size = len(contents)
        if file_size > 10 * 1024 * 1024:
            return JSONResponse(
                status_code=400,
                content={"status": "error", "message": "File exceeds maximum allowed limit of 10 MB."}
            )

        clean_stem = "".join(c for c in os.path.splitext(filename)[0] if c.isalnum() or c in ("-", "_"))[:25]
        unique_filename = f"cert_{int(datetime.datetime.now().timestamp())}_{os.urandom(3).hex()}_{clean_stem}{ext}"
        save_path = os.path.join(UPLOADS_DIR, unique_filename)

        with open(save_path, "wb") as f_out:
            f_out.write(contents)

        return {
            "status": "success",
            "file_path": f"/uploads/{unique_filename}",
            "file_url": f"/uploads/{unique_filename}",
            "file_name": filename,
            "file_size": file_size,
            "message": "File successfully uploaded and stored."
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

# File Download Endpoint
@app.get("/api/files/download/{filename}")
async def api_download_file(filename: str, original_name: Optional[str] = None):
    try:
        safe_filename = os.path.basename(filename)
        filepath = os.path.join(UPLOADS_DIR, safe_filename)
        if not os.path.exists(filepath):
            return JSONResponse(status_code=404, content={"status": "error", "message": "File not found"})
        
        download_name = original_name or safe_filename
        return FileResponse(
            filepath,
            filename=download_name,
            media_type="application/octet-stream",
            headers={"Content-Disposition": f'attachment; filename="{download_name}"'}
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

# Certifications Endpoints
@app.post("/api/certifications")
async def api_create_certification(payload: CertificationPayload):
    try:
        data = db.add_certification(payload.dict(), payload.student_id or "default_student")
        return {"status": "success", "data": data}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.get("/api/certifications")
async def api_list_certifications(
    student_id: str = "default_student",
    category: Optional[str] = None,
    status: Optional[str] = None,
    verification_status: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "newest"
):
    try:
        v_status = verification_status or status
        data = db.get_certifications(
            student_id=student_id,
            category=category,
            verification_status=v_status,
            search=search,
            sort_by=sort_by
        )
        return {"status": "success", "count": len(data), "data": data}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.get("/api/certifications/analytics/overview")
async def api_get_certifications_analytics(student_id: str = "default_student"):
    try:
        analytics = db.get_certification_analytics(student_id)
        return {"status": "success", "data": analytics}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.get("/api/certifications/{cert_id}")
async def api_get_single_certification(cert_id: str, student_id: str = "default_student"):
    try:
        cert = db.get_certification_by_id(cert_id, student_id)
        if not cert:
            return JSONResponse(status_code=404, content={"status": "error", "message": "Certification not found"})
        return {"status": "success", "data": cert}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.put("/api/certifications/{cert_id}")
async def api_update_certification(cert_id: str, payload: CertificationPayload):
    try:
        updated = db.update_certification(cert_id, payload.dict(), payload.student_id or "default_student")
        if not updated:
            return JSONResponse(status_code=404, content={"status": "error", "message": "Certification not found or unauthorized"})
        return {"status": "success", "data": updated}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.delete("/api/certifications/{cert_id}")
async def api_delete_certification(cert_id: str, student_id: str = "default_student"):
    try:
        deleted = db.delete_certification(cert_id, student_id)
        if not deleted:
            return JSONResponse(status_code=404, content={"status": "error", "message": "Certification not found or unauthorized"})
        return {"status": "success", "message": "Certification deleted successfully"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

# Achievements Endpoints
@app.post("/api/achievements")
async def api_create_achievement(payload: AchievementPayload):
    try:
        data = db.add_achievement(payload.dict(), payload.student_id or "default_student")
        return {"status": "success", "data": data}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.get("/api/achievements")
async def api_list_achievements(
    student_id: str = "default_student",
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "newest"
):
    try:
        data = db.get_achievements(
            student_id=student_id,
            category=category,
            search=search,
            sort_by=sort_by
        )
        return {"status": "success", "count": len(data), "data": data}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.get("/api/achievements/{ach_id}")
async def api_get_single_achievement(ach_id: str, student_id: str = "default_student"):
    try:
        ach = db.get_achievement_by_id(ach_id, student_id)
        if not ach:
            return JSONResponse(status_code=404, content={"status": "error", "message": "Achievement not found"})
        return {"status": "success", "data": ach}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.put("/api/achievements/{ach_id}")
async def api_update_single_achievement(ach_id: str, payload: AchievementPayload):
    try:
        updated = db.update_achievement(ach_id, payload.dict(), payload.student_id or "default_student")
        if not updated:
            return JSONResponse(status_code=404, content={"status": "error", "message": "Achievement not found or unauthorized"})
        return {"status": "success", "data": updated}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.delete("/api/achievements/{ach_id}")
async def api_delete_single_achievement(ach_id: str, student_id: str = "default_student"):
    try:
        deleted = db.delete_achievement(ach_id, student_id)
        if not deleted:
            return JSONResponse(status_code=404, content={"status": "error", "message": "Achievement not found or unauthorized"})
        return {"status": "success", "message": "Achievement deleted successfully"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})




# ============================================================
# CAREER ROLE SKILL REQUIREMENT COMPARISON ENDPOINTS
# ============================================================

from services.career_comparison_service import (
    CAREER_ROLES_CATALOG,
    calculate_single_role_comparison,
    compare_multiple_roles,
    get_ranked_career_matches,
    generate_career_action_plan
)

class RoleComparisonRequest(BaseModel):
    role_ids: Optional[List[str]] = ["data_scientist", "full_stack_dev", "ai_engineer"]
    skills: Optional[List[Dict[str, Any]]] = None
    student_id: Optional[str] = "default_student"

class RoleActionPlanRequest(BaseModel):
    role_id: str
    skills: Optional[List[Dict[str, Any]]] = None
    student_id: Optional[str] = "default_student"
    weekly_hours: Optional[int] = 10

@app.get("/api/career-roles")
async def api_get_career_roles():
    """Returns summary metadata for all 15 industry career roles."""
    try:
        roles_list = []
        for r_id, r in CAREER_ROLES_CATALOG.items():
            mandatory = [s["name"] for s in r["skills"] if s.get("is_mandatory")]
            roles_list.append({
                "id": r["id"],
                "title": r["title"],
                "category": r["category"],
                "description": r["description"],
                "industry": r.get("industry", "Technology"),
                "average_salary": r.get("average_salary", ""),
                "market_demand": r.get("market_demand", "High"),
                "icon": r.get("icon", "Briefcase"),
                "total_skills_count": len(r["skills"]),
                "mandatory_skills": mandatory
            })
        return {"status": "success", "count": len(roles_list), "data": roles_list}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.get("/api/career-roles/rankings")
async def api_get_career_rankings(student_id: str = "default_student"):
    """Ranks all 15 career roles by match percentage for the student's profile."""
    try:
        student_skills = db.get_student_skills(student_id)
        rankings = get_ranked_career_matches(student_skills)
        return {"status": "success", "student_id": student_id, "count": len(rankings), "data": rankings}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.get("/api/career-roles/{role_id}")
async def api_get_single_career_role(role_id: str):
    """Returns granular skill requirements for a single career role."""
    try:
        role = CAREER_ROLES_CATALOG.get(role_id)
        if not role:
            return JSONResponse(status_code=404, content={"status": "error", "message": f"Career role '{role_id}' not found"})
        return {"status": "success", "data": role}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.post("/api/career-roles/compare")
async def api_compare_career_roles(payload: RoleComparisonRequest):
    """
    Compares real student skills against selected career roles.
    Returns calculated match percentages, gap breakdown, matrix, and chart series.
    """
    try:
        student_id = payload.student_id or "default_student"
        
        # Pull actual skills from database if not explicitly passed in payload
        if payload.skills is not None:
            student_skills = payload.skills
        else:
            student_skills = db.get_student_skills(student_id)

        roles_to_compare = payload.role_ids or ["data_scientist", "full_stack_dev", "ai_engineer"]
        
        result = compare_multiple_roles(roles_to_compare, student_skills)
        
        # Save comparison evaluation to database for historical tracking
        for comp in result.get("roles", []):
            try:
                db.save_student_role_comparison(
                    student_id=student_id,
                    role_id=comp["role_id"],
                    match_score=comp["match_percentage"],
                    comparison_data={
                        "skills_met": comp["skills_meeting_requirements"],
                        "gaps_count": len(comp["prioritized_gaps"])
                    }
                )
            except Exception as db_err:
                print(f"Warning: could not save student comparison: {db_err}")

        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.post("/api/career-roles/action-plan")
async def api_generate_career_action_plan(payload: RoleActionPlanRequest):
    """Generates customized career improvement roadmap for a target career role."""
    try:
        student_id = payload.student_id or "default_student"
        if payload.skills is not None:
            student_skills = payload.skills
        else:
            student_skills = db.get_student_skills(student_id)

        plan = generate_career_action_plan(
            role_id=payload.role_id,
            student_skills=student_skills,
            weekly_hours=payload.weekly_hours or 10
        )
        return {"status": "success", "data": plan}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})


if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )