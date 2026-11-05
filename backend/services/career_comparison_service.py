"""
STATWISE AI - Role-Based Skill Requirement Comparison Service
Provides:
1. Structured catalog of 15 Technology Career Roles with granular industry skill requirements
2. Standardized 1-5 numerical proficiency scale (Beginner=1 to Expert=5)
3. Dynamic weighted skill matching algorithm:
   Role Match Score = (Sum(min(Student Level / Required Level, 1) * Weight) / Sum(Weight)) * 100
4. Skill gap calculations and severity prioritization
5. Closest career match ranking
6. Personalized career action plan generation linking to roadmaps and certifications
"""

from typing import Dict, List, Any, Optional
import math
import json

# ============================================================
# NUMERICAL PROFICIENCY SCALE DEFINITIONS (1 - 5)
# ============================================================

PROFICIENCY_SCALE = {
    1: {"level": "Beginner", "min_score": 0, "max_score": 39, "description": "Foundational awareness; requires guidance on basic tasks"},
    2: {"level": "Basic", "min_score": 40, "max_score": 54, "description": "Working familiarity; can complete guided standard tasks"},
    3: {"level": "Intermediate", "min_score": 55, "max_score": 74, "description": "Autonomous practitioner; designs and implements production solutions"},
    4: {"level": "Advanced", "min_score": 75, "max_score": 84, "description": "Strong proficiency; solves complex problems and optimizes systems"},
    5: {"level": "Expert", "min_score": 85, "max_score": 100, "description": "Mastery level; architects systems, mentors teams, and leads technical strategy"}
}

def score_or_name_to_level(val: Any) -> int:
    """Converts a textual level name, 0-100 score, or existing number into standard 1-5 scale."""
    if val is None:
        return 0
    if isinstance(val, (int, float)):
        if 1 <= val <= 5:
            return int(round(val))
        if val >= 85:
            return 5
        if val >= 75:
            return 4
        if val >= 55:
            return 3
        if val >= 40:
            return 2
        if val > 0:
            return 1
        return 0

    if isinstance(val, str):
        v = val.strip().lower()
        if v.isdigit():
            iv = int(v)
            if 1 <= iv <= 5:
                return iv
            return score_or_name_to_level(iv)
        if "expert" in v or "master" in v:
            return 5
        if "advanced" in v or "proficient" in v:
            return 4
        if "intermediate" in v or "medium" in v:
            return 3
        if "basic" in v:
            return 2
        if "beginner" in v or "novice" in v:
            return 1
    return 0

def level_to_name(level: int) -> str:
    """Returns the descriptive name for a 1-5 level."""
    return PROFICIENCY_SCALE.get(level, {}).get("level", "Unassessed")

# ============================================================
# 15 INDUSTRY CAREER ROLES & DETAILED SKILL REQUIREMENTS
# ============================================================

CAREER_ROLES_CATALOG: Dict[str, Dict[str, Any]] = {
    "data_scientist": {
        "id": "data_scientist",
        "title": "Data Scientist",
        "category": "Data & AI",
        "description": "Extracts predictive insights from enterprise datasets, formulates statistical models, and deploys machine learning algorithms.",
        "industry": "Data & Artificial Intelligence",
        "average_salary": "$125,000 / ₹18 LPA",
        "market_demand": "High",
        "icon": "LineChart",
        "overview": "Data Scientists combine deep statistical mathematical analysis, programming, and predictive algorithms to solve strategic enterprise questions.",
        "skills": [
            {
                "name": "Python",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Core language for data modeling, statistical packages (Pandas, NumPy, Scikit-learn), and pipeline creation.",
                "recommended_courses": ["Python for Data Science – IBM", "Applied Data Science with Python – University of Michigan"],
                "recommended_certs": ["Certified Data Scientist (DASCA)", "IBM Data Science Professional Certificate"]
            },
            {
                "name": "SQL & Databases",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.8,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Essential for querying analytical data warehouses, window functions, and structured data extraction.",
                "recommended_courses": ["Advanced SQL for Data Scientists – Coursera", "The Complete SQL Bootcamp – Udemy"],
                "recommended_certs": ["Oracle Database SQL Certified Associate", "PostgreSQL Certified Professional"]
            },
            {
                "name": "Statistics & Probability",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Fundamental for hypothesis testing, confidence intervals, Bayesian inference, and avoiding false correlation.",
                "recommended_courses": ["Statistics and Probability – Khan Academy", "Probability and Statistics: To p or not to p? – Coursera"],
                "recommended_certs": ["Statistical Thinking for Data Science – edX"]
            },
            {
                "name": "Machine Learning",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Trains supervised and unsupervised algorithms (regression, classification, clustering, ensemble models).",
                "recommended_courses": ["Machine Learning Specialization – DeepLearning.AI", "Intro to Machine Learning – Kaggle"],
                "recommended_certs": ["AWS Certified Machine Learning – Specialty", "TensorFlow Developer Certificate"]
            },
            {
                "name": "Data Visualization & Storytelling",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.2,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Translates complex numerical findings into actionable visual narratives for business decision-makers.",
                "recommended_courses": ["Data Visualization with Tableau – UC Davis", "Data Storytelling and Visualization – Coursera"],
                "recommended_certs": ["Tableau Desktop Specialist", "Power BI Data Analyst Associate (PL-300)"]
            },
            {
                "name": "Deep Learning",
                "category": "Technical",
                "required_proficiency": 3,
                "importance_weight": 1.8,
                "importance": "Medium",
                "is_mandatory": False,
                "why_important": "Neural architectures for computer vision, audio classification, and unstructured text analytics.",
                "recommended_courses": ["Deep Learning Specialization – DeepLearning.AI", "PyTorch for Deep Learning Bootcamp"],
                "recommended_certs": ["NVIDIA Deep Learning Institute Certification"]
            },
            {
                "name": "Data Analysis & Pandas",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Exploratory data analysis, missing value imputation, transformations, and aggregation pipelines.",
                "recommended_courses": ["Data Analysis with Python – freeCodeCamp", "Pandas Mastery – Kaggle"],
                "recommended_certs": ["Google Advanced Data Analytics Certificate"]
            },
            {
                "name": "Problem Solving & Critical Thinking",
                "category": "Professional",
                "required_proficiency": 4,
                "importance_weight": 2.0,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Formulates business ambiguities into structured mathematical hypotheses and validates experimental models.",
                "recommended_courses": ["Critical Thinking & Problem Solving – edX"],
                "recommended_certs": ["McKinsey Problem Solving Frameworks"]
            },
            {
                "name": "Communication & Presentation",
                "category": "Professional",
                "required_proficiency": 4,
                "importance_weight": 2.0,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Presents experimental findings clearly to non-technical stakeholders and executive leadership.",
                "recommended_courses": ["Effective Communication for Technical Leaders – Coursera"],
                "recommended_certs": ["Executive Presentation Certification"]
            },
            {
                "name": "JavaScript",
                "category": "Technical",
                "required_proficiency": 1,
                "importance_weight": 0.5,
                "importance": "Low",
                "is_mandatory": False,
                "why_important": "Optional lightweight interactivity for client-facing dashboards or web-based visualizations.",
                "recommended_courses": ["JavaScript Basics – MDN Web Docs"],
                "recommended_certs": ["freeCodeCamp JavaScript Algorithms"]
            }
        ]
    },

    "data_analyst": {
        "id": "data_analyst",
        "title": "Data Analyst",
        "category": "Data & AI",
        "description": "Transforms raw company records into actionable executive dashboards, trend analytics, and strategic business metrics.",
        "industry": "Business Intelligence & Analytics",
        "average_salary": "$85,000 / ₹10 LPA",
        "market_demand": "High",
        "icon": "BarChart3",
        "overview": "Data Analysts examine transactional, operational, and customer records to identify actionable trends, bottlenecks, and ROI opportunities.",
        "skills": [
            {
                "name": "SQL & Databases",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Daily work involves writing complex joins, aggregations, subqueries, and window functions.",
                "recommended_courses": ["SQL for Data Analytics – Coursera", "Complete SQL Masterclass – Udemy"],
                "recommended_certs": ["Microsoft Certified: Azure Data Fundamentals (DP-900)"]
            },
            {
                "name": "Data Visualization & PowerBI/Tableau",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Constructs real-time KPI dashboards, interactive reports, and executive summaries.",
                "recommended_courses": ["Microsoft Power BI Desktop for Business Intelligence – Udemy", "Tableau A-Z – Coursera"],
                "recommended_certs": ["Microsoft Certified: Power BI Data Analyst (PL-300)", "Tableau Desktop Certified Associate"]
            },
            {
                "name": "Excel & Advanced Analytics",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 2.8,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Power Pivot, DAX expressions, VLOOKUP/XLOOKUP, and rapid financial/operational modeling.",
                "recommended_courses": ["Advanced Excel: Power Query, Power Pivot & DAX – Udemy"],
                "recommended_certs": ["Microsoft Office Specialist: Excel Expert"]
            },
            {
                "name": "Python",
                "category": "Technical",
                "required_proficiency": 3,
                "importance_weight": 2.0,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Automates repetitive ETL scripts and runs statistical tests via Pandas/Seaborn.",
                "recommended_courses": ["Google Data Analytics Professional Certificate", "Python for Data Analysis – Coursera"],
                "recommended_certs": ["Google Data Analytics Certificate"]
            },
            {
                "name": "Statistics & Probability",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Conducts A/B testing, variance analysis, sample sizing, and trend forecasting.",
                "recommended_courses": ["Basic Statistics – University of Amsterdam"],
                "recommended_certs": ["Six Sigma Yellow/Green Belt"]
            },
            {
                "name": "Data Cleaning & Preprocessing",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.2,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Identifies anomalies, standardizes date formats, handles nulls, and deduplicates records.",
                "recommended_courses": ["Data Wrangling & Cleaning – DataCamp"],
                "recommended_certs": ["Data Management & Governance Fundamentals"]
            },
            {
                "name": "Communication & Storytelling",
                "category": "Professional",
                "required_proficiency": 4,
                "importance_weight": 2.2,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Converts complex metric shifts into clear business takeaways for product and marketing managers.",
                "recommended_courses": ["Storytelling with Data – Cole Nussbaumer"],
                "recommended_certs": ["Business Communication Specialist"]
            },
            {
                "name": "Business Domain Acumen",
                "category": "Professional",
                "required_proficiency": 4,
                "importance_weight": 2.0,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Understands unit economics, conversion funnels, churn rate, and operational KPIs.",
                "recommended_courses": ["Business Foundations Specialization – Wharton"],
                "recommended_certs": ["CBAP (Certified Business Analysis Professional)"]
            }
        ]
    },

    "machine_learning_engineer": {
        "id": "machine_learning_engineer",
        "title": "Machine Learning Engineer",
        "category": "Data & AI",
        "description": "Bridges data science and software engineering to construct, train, optimize, and deploy scalable ML models into production.",
        "industry": "Artificial Intelligence & Robotics",
        "average_salary": "$140,000 / ₹22 LPA",
        "market_demand": "Very High",
        "icon": "Cpu",
        "overview": "ML Engineers productionize machine learning prototypes into low-latency, scalable microservices with automated retraining pipelines.",
        "skills": [
            {
                "name": "Python",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Primary language for model development, PyTorch/TensorFlow runtimes, and inference engines.",
                "recommended_courses": ["Advanced Python for High-Performance Computing – Coursera"],
                "recommended_certs": ["Python Institute PCAP/PCAT Certified"]
            },
            {
                "name": "Machine Learning",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Expertise in model validation, hyperparameter tuning, gradient boosting (XGBoost/LightGBM), and cost functions.",
                "recommended_courses": ["Machine Learning Specialization – Andrew Ng", "Feature Engineering – Kaggle"],
                "recommended_certs": ["AWS Certified Machine Learning – Specialty"]
            },
            {
                "name": "Deep Learning & Neural Networks",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.8,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Architects CNNs, RNNs, and Transformers using PyTorch or TensorFlow.",
                "recommended_courses": ["Deep Learning Specialization – DeepLearning.AI"],
                "recommended_certs": ["TensorFlow Developer Certificate"]
            },
            {
                "name": "MLOps & Model Deployment",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.8,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "MLflow, Kubeflow, model versioning, feature stores, drift detection, and automated retraining.",
                "recommended_courses": ["Machine Learning Engineering for Production (MLOps) – DeepLearning.AI"],
                "recommended_certs": ["Google Cloud Professional Machine Learning Engineer"]
            },
            {
                "name": "Data Structures & Algorithms",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Optimizes matrix operations, memory footprints, and algorithmic time complexity in batch inference.",
                "recommended_courses": ["Algorithms Specialization – Stanford / Coursera"],
                "recommended_certs": ["LeetCode Competency Benchmark"]
            },
            {
                "name": "Docker & Containerization",
                "category": "Technical",
                "required_proficiency": 3,
                "importance_weight": 2.0,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Packages model serving endpoints (FastAPI/Triton) into reproducible container images.",
                "recommended_courses": ["Docker and Kubernetes: The Complete Guide – Udemy"],
                "recommended_certs": ["Docker Certified Associate"]
            },
            {
                "name": "Cloud Computing (AWS/GCP)",
                "category": "Technical",
                "required_proficiency": 3,
                "importance_weight": 2.0,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Operates managed compute clusters, SageMaker/Vertex AI, and serverless inference endpoints.",
                "recommended_courses": ["AWS Certified Machine Learning Prep – A Cloud Guru"],
                "recommended_certs": ["AWS Certified Cloud Practitioner", "GCP Associate Cloud Engineer"]
            },
            {
                "name": "SQL & Databases",
                "category": "Technical",
                "required_proficiency": 3,
                "importance_weight": 1.8,
                "importance": "Medium",
                "is_mandatory": False,
                "why_important": "Extracts high-volume training samples and interacts with distributed databases.",
                "recommended_courses": ["SQL for Data Analysis – Udacity"],
                "recommended_certs": ["PostgreSQL Fundamentals"]
            }
        ]
    },

    "ai_engineer": {
        "id": "ai_engineer",
        "title": "AI Engineer",
        "category": "Data & AI",
        "description": "Builds cognitive systems, integrates modern LLMs, designs intelligent agents, and embeds AI into software products.",
        "industry": "Artificial Intelligence",
        "average_salary": "$145,000 / ₹24 LPA",
        "market_demand": "Very High",
        "icon": "BrainCircuit",
        "overview": "AI Engineers build practical applications utilizing Large Language Models, cognitive vision/speech APIs, vector search, and autonomous multi-agent frameworks.",
        "skills": [
            {
                "name": "Python",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Standard ecosystem for LLM orchestration (LangChain, LlamaIndex), Hugging Face, and async APIs.",
                "recommended_courses": ["Python for Everybody – University of Michigan"],
                "recommended_certs": ["Python Certified Professional Programmer"]
            },
            {
                "name": "Generative AI & LLMs",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Prompt engineering, temperature tuning, token budgeting, function calling, and structured output formatting.",
                "recommended_courses": ["Generative AI with Large Language Models – DeepLearning.AI / AWS"],
                "recommended_certs": ["DeepLearning.AI Generative AI Specialist", "AWS Certified AI Practitioner"]
            },
            {
                "name": "RAG & Vector Databases",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.8,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Retrieval-Augmented Generation, chunking strategies, embeddings, cosine similarity, ChromaDB/Pinecone/pgvector.",
                "recommended_courses": ["Building Applications with Vector Databases – DeepLearning.AI"],
                "recommended_certs": ["Pinecone Certified Vector Search Practitioner"]
            },
            {
                "name": "Machine Learning",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Understanding classical ML helps benchmark against LLMs and select the cost-effective model for each sub-problem.",
                "recommended_courses": ["Machine Learning Specialization – Andrew Ng"],
                "recommended_certs": ["AWS Machine Learning Specialty"]
            },
            {
                "name": "Agentic AI & Tool Calling",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Constructs autonomous agents capable of multi-step planning, reflection, and external tool/API execution.",
                "recommended_courses": ["AI Agentic Workflows with AutoGen & CrewAI – DeepLearning.AI"],
                "recommended_certs": ["LangChain Certified Application Developer"]
            },
            {
                "name": "Deep Learning & Neural Networks",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.2,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Architecture understanding of attention mechanisms, transformers, and transfer learning.",
                "recommended_courses": ["Transformers & BERT Architecture – Coursera"],
                "recommended_certs": ["NVIDIA DLI Certificate"]
            },
            {
                "name": "API Design & FastAPI",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.0,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Wraps AI workflows into low-latency async REST/WebSocket services for client integration.",
                "recommended_courses": ["FastAPI - The Complete Course 2026 – Udemy"],
                "recommended_certs": ["Certified API Architect"]
            },
            {
                "name": "AI Safety & Research Integrity",
                "category": "Professional",
                "required_proficiency": 3,
                "importance_weight": 1.8,
                "importance": "Medium",
                "is_mandatory": False,
                "why_important": "Guards against hallucination, prompt injection, data leakage, and ensures regulatory compliance.",
                "recommended_courses": ["AI Ethics & Governance – edX"],
                "recommended_certs": ["Responsible AI Certification – Microsoft"]
            },
            {
                "name": "React",
                "category": "Technical",
                "required_proficiency": 1,
                "importance_weight": 0.5,
                "importance": "Low",
                "is_mandatory": False,
                "why_important": "Allows developing basic interactive interfaces to demo generative prototypes to internal teams.",
                "recommended_courses": ["React Quickstart – Official Docs"],
                "recommended_certs": ["Meta Front-End Developer Basics"]
            }
        ]
    },

    "generative_ai_engineer": {
        "id": "generative_ai_engineer",
        "title": "Generative AI Engineer",
        "category": "Data & AI",
        "description": "Specializes strictly in Foundation Models, fine-tuning, advanced multimodal RAG architectures, and autonomous agent systems.",
        "industry": "Generative AI & Foundation Models",
        "average_salary": "$155,000 / ₹28 LPA",
        "market_demand": "Very High",
        "icon": "Sparkles",
        "overview": "Generative AI Engineers push the boundaries of LLM capabilities, implementing parameter-efficient fine-tuning (LoRA), hybrid search RAG, and agentic reasoning loops.",
        "skills": [
            {
                "name": "Python",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Hugging Face, vLLM, LangChain, DSPy, and custom generation loops require advanced Python mastery.",
                "recommended_courses": ["Advanced Python for AI Engineers – Real Python"],
                "recommended_certs": ["PCAP Certified Associate in Python Programming"]
            },
            {
                "name": "Generative AI & Prompt Engineering",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Few-shot prompting, ReAct reasoning, Chain-of-Thought, DSPy compilation, and system prompts.",
                "recommended_courses": ["Prompt Engineering for ChatGPT – Vanderbilt", "Advanced GenAI with Anthropic & OpenAI"],
                "recommended_certs": ["OpenAI Certified AI Practitioner"]
            },
            {
                "name": "RAG & Vector Databases",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Hybrid sparse/dense search, BM25 + dense embeddings, rerankers (Cohere), and contextual document retrieval.",
                "recommended_courses": ["Advanced Retrieval for AI – DeepLearning.AI"],
                "recommended_certs": ["Weaviate Certified Developer", "Qdrant Vector Certification"]
            },
            {
                "name": "Fine-Tuning & Quantization",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.8,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "LoRA, QLoRA, PEFT, Unsloth, GGUF/AWQ quantization for deploying models locally on edge/GPUs.",
                "recommended_courses": ["Fine-Tuning Large Language Models – DeepLearning.AI"],
                "recommended_certs": ["Hugging Face Open Source AI Certificate"]
            },
            {
                "name": "Agentic AI & Autonomous Workflows",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 2.8,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Orchestrates multi-agent teams with shared memory, dynamic delegation, and deterministic guardrails.",
                "recommended_courses": ["Autonomous Agents in Production – LangChain Academy"],
                "recommended_certs": ["CrewAI Multi-Agent Certification"]
            },
            {
                "name": "Deep Learning & Transformers",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Self-attention mechanisms, KV-cache optimization, rotary positional embeddings (RoPE), and decoding strategies.",
                "recommended_courses": ["Transformer Models in Depth – Stanford CS25"],
                "recommended_certs": ["NVIDIA LLM Acceleration Certificate"]
            },
            {
                "name": "Model Evaluation & LLM-as-a-Judge",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.2,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Ragas, DeepEval, G-Eval, BLEU/ROUGE, and automated golden dataset validation pipelines.",
                "recommended_courses": ["Evaluating LLM Systems – DeepLearning.AI"],
                "recommended_certs": ["AI Quality & Reliability Certificate"]
            },
            {
                "name": "Cloud AI Infrastructure (AWS/GCP)",
                "category": "Technical",
                "required_proficiency": 3,
                "importance_weight": 2.0,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Deploys on GPU instances (AWS Bedrock, SageMaker, GCP Vertex AI, RunPod).",
                "recommended_courses": ["Cloud AI Deployments – A Cloud Guru"],
                "recommended_certs": ["AWS Certified AI Practitioner"]
            }
        ]
    },

    "full_stack_dev": {
        "id": "full_stack_dev",
        "title": "Full Stack Developer",
        "category": "Software Engineering",
        "description": "Develops complete software applications, spanning client-side user interfaces, server-side APIs, database management, and cloud hosting.",
        "industry": "Software & Web Development",
        "average_salary": "$115,000 / ₹15 LPA",
        "market_demand": "Very High",
        "icon": "Layers",
        "overview": "Full Stack Developers create end-to-end web experiences, architecting responsive frontend interfaces and secure, scalable server microservices.",
        "skills": [
            {
                "name": "JavaScript & TypeScript",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Foundational language for both client browsers and Node.js server runtimes; strong typing with TypeScript.",
                "recommended_courses": ["TypeScript Masterclass – Academind", "Modern JavaScript From The Beginning – Brad Traversy"],
                "recommended_certs": ["W3Schools Certified JavaScript Developer", "OpenJS Node.js Application Developer (JSNAD)"]
            },
            {
                "name": "React & Modern Frontend",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Component state management, hooks, Next.js server components, and responsive DOM rendering.",
                "recommended_courses": ["The Ultimate React Course – Jonas Schmedtmann", "Complete Next.js Bootcamp"],
                "recommended_certs": ["Meta Front-End Developer Professional Certificate"]
            },
            {
                "name": "HTML & CSS",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 2.5,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Semantic page markup, accessibility (a11y), Tailwind CSS, Flexbox, and CSS Grid layouts.",
                "recommended_courses": ["Responsive Web Design Certification – freeCodeCamp"],
                "recommended_certs": ["freeCodeCamp Responsive Web Design Certificate"]
            },
            {
                "name": "Node.js & Backend APIs",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.8,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Express/NestJS or Python FastAPI microservices, JWT authentication, and RESTful CRUD endpoints.",
                "recommended_courses": ["NodeJS: The Complete Guide – Udemy", "Node.js Microservices – Coursera"],
                "recommended_certs": ["OpenJS Node.js Services Developer (JSNSD)"]
            },
            {
                "name": "SQL & Databases",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Schema design, relational joins, indexing, and ORM usage (Prisma, TypeORM, SQLAlchemy).",
                "recommended_courses": ["The Complete SQL Bootcamp – Jose Portilla"],
                "recommended_certs": ["PostgreSQL Associate Developer"]
            },
            {
                "name": "Git & CI/CD DevOps",
                "category": "Technical",
                "required_proficiency": 3,
                "importance_weight": 2.0,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Branching strategies, pull requests, automated GitHub Actions testing, and Vercel/Docker deployment.",
                "recommended_courses": ["Git & GitHub Bootcamp – Colt Steele"],
                "recommended_certs": ["GitHub Foundations Certification"]
            },
            {
                "name": "Data Structures & Algorithms",
                "category": "Technical",
                "required_proficiency": 3,
                "importance_weight": 2.0,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Efficient data manipulation, tree traversals, search algorithms, and interview readiness.",
                "recommended_courses": ["Master the Coding Interview: Data Structures + Algorithms – Andrei Neagoie"],
                "recommended_certs": ["HackerRank Software Engineer Certification"]
            },
            {
                "name": "Problem Solving & Critical Thinking",
                "category": "Professional",
                "required_proficiency": 4,
                "importance_weight": 2.0,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Debugs full-stack issues spanning client state, network payloads, server logs, and DB transactions.",
                "recommended_courses": ["Problem Solving Masterclass – Coursera"],
                "recommended_certs": ["Agile Certified Practitioner (PMI-ACP)"]
            },
            {
                "name": "Python",
                "category": "Technical",
                "required_proficiency": 3,
                "importance_weight": 1.5,
                "importance": "Medium",
                "is_mandatory": False,
                "why_important": "Useful for secondary services, background data workers, and AI integration.",
                "recommended_courses": ["Python Crash Course – Coursera"],
                "recommended_certs": ["Python Essentials – Cisco Networking Academy"]
            },
            {
                "name": "Machine Learning",
                "category": "Technical",
                "required_proficiency": 1,
                "importance_weight": 0.5,
                "importance": "Low",
                "is_mandatory": False,
                "why_important": "Basic comprehension for consuming model outputs or calling inference endpoints.",
                "recommended_courses": ["AI for Everyone – Andrew Ng"],
                "recommended_certs": ["AI Literacy Fundamentals"]
            }
        ]
    },

    "frontend_developer": {
        "id": "frontend_developer",
        "title": "Frontend Developer",
        "category": "Software Engineering",
        "description": "Specializes in client-side engineering, responsive user interfaces, animations, accessibility, and web application performance.",
        "industry": "Web Development & UX Engineering",
        "average_salary": "$105,000 / ₹13 LPA",
        "market_demand": "High",
        "icon": "Layout",
        "overview": "Frontend Developers deliver fluid, accessible, and high-performance digital experiences across mobile and desktop devices.",
        "skills": [
            {
                "name": "HTML & CSS",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Mastery of semantic markup, CSS Grid/Flexbox, transitions, keyframes, and Tailwind CSS.",
                "recommended_courses": ["CSS - The Complete Guide (incl. Flexbox, Grid & Sass) – Maximilian Schwarzmüller"],
                "recommended_certs": ["W3Schools Certified Front-End Developer"]
            },
            {
                "name": "JavaScript & TypeScript",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "ES6+ asynchronous programming, event loop, DOM manipulation, promises, and TypeScript types/generics.",
                "recommended_courses": ["JavaScript: Understanding the Weird Parts – Anthony Alicea"],
                "recommended_certs": ["Microsoft Technology Associate: JavaScript"]
            },
            {
                "name": "React & Modern Frontend",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Custom hooks, context API, memoization (useMemo/useCallback), component lifecycle, Next.js.",
                "recommended_courses": ["Epic React by Kent C. Dodds", "React - The Complete Guide – Academind"],
                "recommended_certs": ["Meta Front-End Developer Professional Certificate"]
            },
            {
                "name": "State Management (Redux/Zustand)",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Coordinates global application state across complex dashboards and asynchronous data fetching.",
                "recommended_courses": ["Redux Toolkit & Zustand Masterclass – Udemy"],
                "recommended_certs": ["Advanced React Architecture Certification"]
            },
            {
                "name": "UI/UX Design Principles & Accessibility",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.2,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Figma translation, WCAG 2.1 accessibility compliance, color contrast, and micro-interactions.",
                "recommended_courses": ["Google UX Design Professional Certificate"],
                "recommended_certs": ["Google UX Design Certificate"]
            },
            {
                "name": "Web Performance & Optimization",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.2,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Core Web Vitals (LCP, FID, CLS), code-splitting, lazy loading, and asset bundling (Vite/Webpack).",
                "recommended_courses": ["Web Performance Fundamentals – Frontend Masters"],
                "recommended_certs": ["Chrome DevTools Optimization Specialist"]
            },
            {
                "name": "REST & GraphQL API Integration",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.0,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Connects UI to backend services using Axios/Fetch, React Query, optimistic UI updates, and error handling.",
                "recommended_courses": ["TanStack Query (React Query) Complete Course – Udemy"],
                "recommended_certs": ["API Integration Master Certificate"]
            },
            {
                "name": "Git & Version Control",
                "category": "Technical",
                "required_proficiency": 3,
                "importance_weight": 1.8,
                "importance": "Medium",
                "is_mandatory": False,
                "why_important": "Version management, pull request workflows, and collaborative codebase synchronization.",
                "recommended_courses": ["Git Complete – Udemy"],
                "recommended_certs": ["GitHub Certified Associate"]
            }
        ]
    },

    "backend_developer": {
        "id": "backend_developer",
        "title": "Backend Developer",
        "category": "Software Engineering",
        "description": "Architects server architectures, REST/gRPC microservices, secure authentication, database schemas, and background queues.",
        "industry": "Software Engineering & Distributed Systems",
        "average_salary": "$120,000 / ₹17 LPA",
        "market_demand": "Very High",
        "icon": "Server",
        "overview": "Backend Developers construct the resilient server engines, transactional databases, and distributed communication backbones powering digital platforms.",
        "skills": [
            {
                "name": "Java / Python / Go",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Deep command of a primary server language (Java/Python/Go/C#) including OOP, concurrency, and memory management.",
                "recommended_courses": ["Backend Master Class [Golang + Postgres + Docker] – Udemy", "Java Backend Development Bootcamp"],
                "recommended_certs": ["Oracle Certified Professional: Java SE", "Python Institute PCPP1"]
            },
            {
                "name": "Backend APIs & Microservices",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "RESTful conventions, gRPC, message brokers (Kafka/RabbitMQ), rate limiting, and API gateways.",
                "recommended_courses": ["Microservices Software Architecture – Coursera", "Building Microservices with Spring Boot & Spring Cloud"],
                "recommended_certs": ["Software Architecture: Microservices – edX"]
            },
            {
                "name": "SQL & Relational Databases",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "ACID compliance, transaction isolation, schema normalization, index strategies, and execution plan tuning.",
                "recommended_courses": ["Database Management Systems – NPTEL / IIT", "High Performance MySQL – O'Reilly"],
                "recommended_certs": ["PostgreSQL Certified Engineer"]
            },
            {
                "name": "NoSQL & Caching (Redis/Mongo)",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "In-memory caching patterns, session stores, document stores, and pub/sub messaging.",
                "recommended_courses": ["Redis University – RU101", "MongoDB for Developers – MongoDB University"],
                "recommended_certs": ["Redis Certified Developer", "MongoDB Certified Associate Developer"]
            },
            {
                "name": "Data Structures & Algorithms",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Essential for low-latency request processing, graph traversals, and algorithmic efficiency.",
                "recommended_courses": ["Data Structures and Algorithms Specialization – UC San Diego"],
                "recommended_certs": ["LeetCode 300+ Verified Problem Solvers"]
            },
            {
                "name": "System Design & Scalability",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Horizontal scaling, load balancing, sharding, distributed consensus, and resilience patterns (Circuit Breaker).",
                "recommended_courses": ["Grokking the System Design Interview – Educative", "Designing Data-Intensive Applications Study Guide"],
                "recommended_certs": ["AWS Certified Solutions Architect – Associate"]
            },
            {
                "name": "Authentication & Security (OAuth/JWT)",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.2,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Protects endpoints against unauthorized access, SQL injection, CSRF, and enforces RBAC/ABAC policies.",
                "recommended_courses": ["OAuth 2.0 and OpenID Connect In Plain English – Udemy"],
                "recommended_certs": ["CompTIA Security+"]
            },
            {
                "name": "Docker & Containerization",
                "category": "Technical",
                "required_proficiency": 3,
                "importance_weight": 2.0,
                "importance": "Medium",
                "is_mandatory": False,
                "why_important": "Packages microservices into standard container images for automated Kubernetes deployment.",
                "recommended_courses": ["Docker for Java & Node Developers – Coursera"],
                "recommended_certs": ["Certified Kubernetes Application Developer (CKAD)"]
            }
        ]
    },

    "python_developer": {
        "id": "python_developer",
        "title": "Python Developer",
        "category": "Software Engineering",
        "description": "Constructs robust applications, web backends, automation scripts, and data ingestion pipelines using idiomatic Python.",
        "industry": "Software Development & Automation",
        "average_salary": "$115,000 / ₹15 LPA",
        "market_demand": "High",
        "icon": "Terminal",
        "overview": "Python Developers build clean, maintainable software across web frameworks, serverless lambdas, and enterprise data workflows.",
        "skills": [
            {
                "name": "Python (Core & OOP)",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Dunder methods, decorators, context managers, generators, type annotations, and idiomatic PEP 8 practices.",
                "recommended_courses": ["Python 3: Deep Dive Series – Fred Baptiste / Udemy", "Fluent Python Study Guide"],
                "recommended_certs": ["PCAP – Certified Associate in Python Programming", "PCPP – Certified Professional in Python Programming"]
            },
            {
                "name": "Django / FastAPI / Flask",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Constructs asynchronous APIs (FastAPI) or full enterprise web architectures (Django ORM, admin, auth).",
                "recommended_courses": ["Python and Django Full Stack Web Developer Bootcamp – Jose Portilla", "FastAPI Enterprise Mastery"],
                "recommended_certs": ["Django Certified Developer"]
            },
            {
                "name": "SQL & PostgreSQL / MySQL",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "SQLAlchemy ORM integration, raw query optimization, connection pooling, and Alembic migrations.",
                "recommended_courses": ["SQLAlchemy 2.0 In Depth – Real Python"],
                "recommended_certs": ["PostgreSQL Developer Certification"]
            },
            {
                "name": "Data Structures & Algorithms",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Algorithm implementation using Python's bisect, collections (deque, Counter), and heapq modules.",
                "recommended_courses": ["Python Data Structures & Algorithms – Udemy"],
                "recommended_certs": ["HackerRank Python 5-Star Gold Badge"]
            },
            {
                "name": "RESTful API Development",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Swagger/OpenAPI documentation, Pydantic validation, serialization, and error schemas.",
                "recommended_courses": ["REST APIs with Flask and Python – Udemy"],
                "recommended_certs": ["Certified API Developer"]
            },
            {
                "name": "AsyncIO & Concurrency",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.2,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Event loops, coroutines, Celery task queues, and non-blocking I/O operations.",
                "recommended_courses": ["Python Concurrency with AsyncIO – Matthew Fowler"],
                "recommended_certs": ["Advanced Python Concurrency Specialist"]
            },
            {
                "name": "Unit Testing & PyTest",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.0,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Fixtures, mocking, parameterization, coverage reports, and test-driven development (TDD).",
                "recommended_courses": ["Testing Python with PyTest – Brian Okken"],
                "recommended_certs": ["Software Quality Assurance Certificate"]
            },
            {
                "name": "Git & Docker",
                "category": "Technical",
                "required_proficiency": 3,
                "importance_weight": 1.8,
                "importance": "Medium",
                "is_mandatory": False,
                "why_important": "Containerizes Python runtimes and manages CI/CD build scripts.",
                "recommended_courses": ["Docker for Python Developers – Coursera"],
                "recommended_certs": ["GitHub Actions Specialist"]
            }
        ]
    },

    "java_developer": {
        "id": "java_developer",
        "title": "Java Developer",
        "category": "Software Engineering",
        "description": "Constructs enterprise distributed services, banking engines, and cloud microservices using Java and Spring Boot.",
        "industry": "Enterprise Software Engineering",
        "average_salary": "$125,000 / ₹18 LPA",
        "market_demand": "Very High",
        "icon": "Coffee",
        "overview": "Java Developers build enterprise backends, high-throughput microservices, and financial transaction platforms with strict typing and reliability.",
        "skills": [
            {
                "name": "Java",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Core language expertise: OOP, memory allocation, JVM tuning, Garbage Collection, lambdas, and streams.",
                "recommended_courses": ["Java Programming Masterclass – Tim Buchalka / Udemy", "NPTEL Programming in Java – IIT Kharagpur"],
                "recommended_certs": ["Oracle Certified Professional: Java SE 17 Developer", "Infosys / TCS Java Certified Associate"]
            },
            {
                "name": "Spring Boot & Spring Cloud",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Dependency Injection, Spring Data JPA, Spring Security, Actuator, and microservice discovery.",
                "recommended_courses": ["Spring & Hibernate for Beginners – Chad Darby", "Master Microservices with Spring Boot and Spring Cloud – In28Minutes"],
                "recommended_certs": ["VMware Certified Professional - Spring Developer"]
            },
            {
                "name": "Data Structures & Algorithms",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Java Collections Framework (HashMap, TreeMap, ConcurrentHashMap), algorithmic problem solving.",
                "recommended_courses": ["Data Structures and Algorithms in Java – Robert Lafore"],
                "recommended_certs": ["HackerRank Java 5-Star Gold Certification"]
            },
            {
                "name": "SQL & Hibernate / JPA",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Entity relationship mapping, JPQL, N+1 query problem avoidance, second-level caching.",
                "recommended_courses": ["High-Performance Java Persistence – Vlad Mihalcea"],
                "recommended_certs": ["Oracle Database SQL Certified Specialist"]
            },
            {
                "name": "Microservices Architecture",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Event-driven architecture with Apache Kafka, Circuit Breakers (Resilience4j), and Dockerized containers.",
                "recommended_courses": ["Event-Driven Microservices with Spring Cloud & Kafka – Udemy"],
                "recommended_certs": ["Confluent Certified Developer for Apache Kafka"]
            },
            {
                "name": "Multi-threading & Concurrency",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.2,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "java.util.concurrent (Executors, CompletableFuture, ReentrantLock, Virtual Threads in Java 21).",
                "recommended_courses": ["Java Multithreading, Concurrency & Performance Optimization – Michael Pogrebinsky"],
                "recommended_certs": ["Advanced Java Concurrency Specialist"]
            },
            {
                "name": "REST APIs & JUnit Testing",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.0,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "JUnit 5, Mockito, AssertJ, MockMvc integration testing, and Swagger API contracts.",
                "recommended_courses": ["Testing Spring Boot: Beginner to Guru – John Thompson"],
                "recommended_certs": ["Certified Software Quality Engineer"]
            },
            {
                "name": "Maven / Gradle Build Tools",
                "category": "Technical",
                "required_proficiency": 3,
                "importance_weight": 1.8,
                "importance": "Medium",
                "is_mandatory": False,
                "why_important": "Dependency management, multi-module project builds, and release packaging.",
                "recommended_courses": ["Apache Maven: Beginner to Guru – Udemy"],
                "recommended_certs": ["Gradle Certified Build Engineer"]
            }
        ]
    },

    "cloud_engineer": {
        "id": "cloud_engineer",
        "title": "Cloud Engineer",
        "category": "Cloud & DevOps",
        "description": "Designs, deploys, and manages resilient cloud infrastructure across Amazon Web Services, Google Cloud, and Microsoft Azure.",
        "industry": "Cloud Computing & Systems",
        "average_salary": "$130,000 / ₹20 LPA",
        "market_demand": "Very High",
        "icon": "Cloud",
        "overview": "Cloud Engineers configure secure virtual private clouds, auto-scaling compute fleets, serverless functions, and cost-optimized enterprise storage.",
        "skills": [
            {
                "name": "Cloud Platforms (AWS / GCP / Azure)",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Deep architectural mastery of core compute (EC2/Lambda), storage (S3), and database services.",
                "recommended_courses": ["AWS Certified Solutions Architect Associate – Stephane Maarek", "Google Cloud Associate Cloud Engineer – Coursera"],
                "recommended_certs": ["AWS Certified Solutions Architect – Associate", "Microsoft Certified: Azure Administrator Associate (AZ-104)"]
            },
            {
                "name": "Infrastructure as Code (Terraform)",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.8,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Declarative provisioning of cloud resources, state management, modules, and drift prevention.",
                "recommended_courses": ["HashiCorp Certified: Terraform Associate – Zeal Vora"],
                "recommended_certs": ["HashiCorp Certified: Terraform Associate (003)"]
            },
            {
                "name": "Cloud Networking & VPCs",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Subnets, route tables, NAT gateways, peering, VPNs, DirectConnect, and DNS (Route 53).",
                "recommended_courses": ["AWS Certified Advanced Networking Specialty – A Cloud Guru"],
                "recommended_certs": ["AWS Advanced Networking – Specialty"]
            },
            {
                "name": "Cloud Security & IAM",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Principle of Least Privilege, role assumption, KMS encryption, security groups, and audit trails.",
                "recommended_courses": ["AWS Certified Security – Specialty – Udemy"],
                "recommended_certs": ["AWS Certified Security – Specialty", "Azure Security Engineer (AZ-500)"]
            },
            {
                "name": "Linux Systems Administration",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "SSH management, user permissions, systemd services, disk partition management, and bash shell scripts.",
                "recommended_courses": ["Linux Administration Bootcamp – Jason Cannon"],
                "recommended_certs": ["Red Hat Certified System Administrator (RHCSA)", "CompTIA Linux+"]
            },
            {
                "name": "Docker & Kubernetes",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Deploys containerized services on managed clusters (EKS / GKE / AKS).",
                "recommended_courses": ["Kubernetes for the Absolute Beginners – Mumshad Mannambeth"],
                "recommended_certs": ["Certified Kubernetes Administrator (CKA)"]
            },
            {
                "name": "Monitoring & CloudWatch",
                "category": "Technical",
                "required_proficiency": 3,
                "importance_weight": 1.8,
                "importance": "Medium",
                "is_mandatory": False,
                "why_important": "Configures alarms, metric dashboards, log aggregation, and cost alert thresholds.",
                "recommended_courses": ["Observability in Modern Cloud – Coursera"],
                "recommended_certs": ["Datadog Certified Cloud Monitoring Professional"]
            },
            {
                "name": "Python or Bash Scripting",
                "category": "Technical",
                "required_proficiency": 3,
                "importance_weight": 2.0,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Automates routine maintenance tasks and interacts with cloud SDKs (Boto3).",
                "recommended_courses": ["Automate the Boring Stuff with Python – Al Sweigart"],
                "recommended_certs": ["AWS Certified Developer – Associate"]
            }
        ]
    },

    "devops_engineer": {
        "id": "devops_engineer",
        "title": "DevOps Engineer",
        "category": "Cloud & DevOps",
        "description": "Constructs automated continuous integration and continuous deployment (CI/CD) pipelines, manages Kubernetes, and drives infrastructure reliability.",
        "industry": "DevOps & Site Reliability Engineering",
        "average_salary": "$135,000 / ₹21 LPA",
        "market_demand": "Very High",
        "icon": "GitBranch",
        "overview": "DevOps Engineers bridge software development and operations, ensuring rapid, reliable, and automated releases through Infrastructure as Code and observability.",
        "skills": [
            {
                "name": "CI/CD Pipelines (GitHub Actions / Jenkins)",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Automates build, test, container packaging, security scan, and multi-environment deployment pipelines.",
                "recommended_courses": ["GitHub Actions - The Complete Guide – Academind", "Jenkins Bootcamp – Coursera"],
                "recommended_certs": ["GitHub Actions Certification", "CloudBees Certified Jenkins Engineer"]
            },
            {
                "name": "Docker & Containerization",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Multi-stage Docker builds, layer caching, slim base images, and container security vulnerability scanning.",
                "recommended_courses": ["Docker for DevOps – Udemy"],
                "recommended_certs": ["Docker Certified Associate (DCA)"]
            },
            {
                "name": "Kubernetes & Orchestration",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.8,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Pod lifecycle, Helm charts, ingress controllers, horizontal pod autoscalers (HPA), and ConfigMaps.",
                "recommended_courses": ["Certified Kubernetes Administrator (CKA) with Practice Tests – Mumshad Mannambeth"],
                "recommended_certs": ["Certified Kubernetes Administrator (CKA)", "Certified Kubernetes Application Developer (CKAD)"]
            },
            {
                "name": "Infrastructure as Code (Terraform / Ansible)",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Automated server configuration, multi-region cloud provisioning, and repeatable infrastructure.",
                "recommended_courses": ["Ansible for the Absolute Beginner – KodeKloud", "Terraform for DevOps – Udemy"],
                "recommended_certs": ["HashiCorp Certified: Terraform Associate"]
            },
            {
                "name": "Linux & Shell Scripting",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Bash scripting, network diagnostics (curl, netstat, tcpdump), cron jobs, and kernel process management.",
                "recommended_courses": ["Linux Mastery: Command Line, Bash & More – Zaid Sabih"],
                "recommended_certs": ["Linux Foundation Certified System Administrator (LFCS)"]
            },
            {
                "name": "Cloud Infrastructure (AWS/GCP)",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Manages hosted clusters (EKS/GKE), IAM roles, and cloud network topology.",
                "recommended_courses": ["AWS Certified DevOps Engineer – Professional – Stephane Maarek"],
                "recommended_certs": ["AWS Certified DevOps Engineer – Professional"]
            },
            {
                "name": "Monitoring & Observability (Prometheus/Grafana)",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.0,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "SLI/SLO tracking, Prometheus metrics scraping, Grafana dashboards, and Alertmanager routing.",
                "recommended_courses": ["Monitoring with Prometheus and Grafana – Udemy"],
                "recommended_certs": ["Prometheus Certified Associate (PCA)"]
            },
            {
                "name": "DevSecOps & Security Scanning",
                "category": "Technical",
                "required_proficiency": 3,
                "importance_weight": 1.8,
                "importance": "Medium",
                "is_mandatory": False,
                "why_important": "Static analysis (SonarQube), secret scanning (TruffleHog), and container scanning (Trivy).",
                "recommended_courses": ["DevSecOps: Building Security into CI/CD – Coursera"],
                "recommended_certs": ["Certified DevSecOps Professional (CDP)"]
            }
        ]
    },

    "cybersecurity_analyst": {
        "id": "cybersecurity_analyst",
        "title": "Cybersecurity Analyst",
        "category": "Security & Systems",
        "description": "Monitors systems for security threats, conducts vulnerability assessments, investigates security breaches, and enforces data protection policies.",
        "industry": "Information Security & Defense",
        "average_salary": "$115,000 / ₹16 LPA",
        "market_demand": "Very High",
        "icon": "ShieldCheck",
        "overview": "Cybersecurity Analysts defend enterprise networks, investigate suspicious telemetry, audit access privileges, and mitigate malicious intrusion attempts.",
        "skills": [
            {
                "name": "Network Security & Protocols",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Deep comprehension of TCP/IP, DNS, TLS/SSL, firewall rules, IDS/IPS, and packet capture analysis with Wireshark.",
                "recommended_courses": ["Wireshark Network Analysis – Laura Chappell", "Network Security Fundamentals – Coursera"],
                "recommended_certs": ["CompTIA Security+ (SY0-701)", "Cisco Certified CyberOps Associate"]
            },
            {
                "name": "Threat Intelligence & Vulnerability Assessment",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Scans infrastructure using Nessus/Qualys, maps threat actors using MITRE ATT&CK framework, and analyzes CVEs.",
                "recommended_courses": ["Vulnerability Assessment & Penetration Testing – SANS"],
                "recommended_certs": ["CompTIA Cybersecurity Analyst (CySA+)", "GIAC Certified Incident Handler (GCIH)"]
            },
            {
                "name": "Security Operations (SIEM & Log Analysis)",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.8,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Monitors alerts, writes queries, and correlates log telemetry across Splunk, Microsoft Sentinel, or ELK.",
                "recommended_courses": ["Splunk Certified Cybersecurity Defense – Coursera"],
                "recommended_certs": ["Splunk Core Certified Power User", "Microsoft Certified: Security Operations Analyst (SC-200)"]
            },
            {
                "name": "Cryptography & PKI",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Symmetric/asymmetric encryption, hashing (SHA-256), digital signatures, certificates, and TLS handshakes.",
                "recommended_courses": ["Cryptography I – Stanford / Dan Boneh"],
                "recommended_certs": ["Certified Information Systems Security Professional (CISSP) Associate"]
            },
            {
                "name": "Incident Response & Forensics",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Quarantines compromised hosts, collects memory dumps, preserves chain of custody, and drafts post-mortem reports.",
                "recommended_courses": ["Digital Forensics & Incident Response – Infosec"],
                "recommended_certs": ["Certified Incident Handler (EC-Council ECIH)"]
            },
            {
                "name": "Ethical Hacking & Penetration Testing",
                "category": "Technical",
                "required_proficiency": 3,
                "importance_weight": 2.2,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Simulates attacker methodologies using Metasploit, Nmap, and Burp Suite to uncover perimeter vulnerabilities.",
                "recommended_courses": ["The Complete Ethical Hacking Course – Heath Adams"],
                "recommended_certs": ["Certified Ethical Hacker (CEH)", "CompTIA PenTest+"]
            },
            {
                "name": "Python / Bash for Automation",
                "category": "Technical",
                "required_proficiency": 3,
                "importance_weight": 2.0,
                "importance": "Medium",
                "is_mandatory": False,
                "why_important": "Parses log batches, parses threat feeds, and automates incident remediation tasks.",
                "recommended_courses": ["Python for Cybersecurity – Coursera"],
                "recommended_certs": ["Certified Secure Software Lifecycle Professional"]
            },
            {
                "name": "Compliance & Security Frameworks (NIST / ISO)",
                "category": "Professional",
                "required_proficiency": 3,
                "importance_weight": 1.8,
                "importance": "Medium",
                "is_mandatory": False,
                "why_important": "Aligns company controls with NIST CSF, ISO 27001, SOC 2, and GDPR requirements.",
                "recommended_courses": ["Security Governance & Compliance – edX"],
                "recommended_certs": ["ISACA CISM / CRISC Associate"]
            }
        ]
    },

    "software_engineer": {
        "id": "software_engineer",
        "title": "Software Engineer",
        "category": "Software Engineering",
        "description": "Applies rigorous computer science fundamentals, object-oriented design, algorithms, and clean architecture to build reliable enterprise software.",
        "industry": "General Software Engineering",
        "average_salary": "$120,000 / ₹16 LPA",
        "market_demand": "Very High",
        "icon": "Code",
        "overview": "Software Engineers design, test, and maintain robust codebases, employing systematic algorithmic reasoning and design patterns across high-impact systems.",
        "skills": [
            {
                "name": "Data Structures & Algorithms",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Core requirement: arrays, linked lists, trees, graphs, sorting, dynamic programming, and complexity analysis.",
                "recommended_courses": ["Data Structures & Algorithms Specialization – Coursera", "Mastering DSA – LeetCode"],
                "recommended_certs": ["HackerRank Problem Solving (Advanced) Certificate"]
            },
            {
                "name": "Object-Oriented Programming (Java/C++/Python)",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "SOLID principles, encapsulation, polymorphism, inheritance, and clean architectural design patterns.",
                "recommended_courses": ["Design Patterns in Java / C++ – Erich Gamma / Udemy", "Clean Code – Robert C. Martin"],
                "recommended_certs": ["Oracle Certified Professional Java Developer"]
            },
            {
                "name": "System Design & Clean Architecture",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.8,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Constructs decoupled systems using Hexagonal / Clean Architecture, interfaces, and dependency inversion.",
                "recommended_courses": ["System Design Masterclass – ByteByteGo"],
                "recommended_certs": ["AWS Solutions Architect Associate"]
            },
            {
                "name": "SQL & Databases",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Data modeling, foreign keys, transaction handling, and relational query design.",
                "recommended_courses": ["Database Systems – Stanford Online"],
                "recommended_certs": ["Database Design Specialist"]
            },
            {
                "name": "Software Testing & Debugging",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Unit testing, integration testing, mocking, profiling, and memory leak analysis.",
                "recommended_courses": ["Software Testing and Automation – Coursera"],
                "recommended_certs": ["ISTQB Certified Tester"]
            },
            {
                "name": "Git & Collaborative Development",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.0,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Git rebasing, interactive conflict resolution, code reviews, and PR documentation.",
                "recommended_courses": ["Git In-Depth – Frontend Masters"],
                "recommended_certs": ["GitHub Certified Developer"]
            },
            {
                "name": "Problem Solving & Algorithmic Thinking",
                "category": "Professional",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Breaks down ambiguous problems into manageable, testable sub-problems with rigorous boundary checks.",
                "recommended_courses": ["Mathematical Thinking in Computer Science – Coursera"],
                "recommended_certs": ["ACM-ICPC Competitive Programmer Benchmark"]
            },
            {
                "name": "Communication & Teamwork",
                "category": "Professional",
                "required_proficiency": 4,
                "importance_weight": 2.0,
                "importance": "High",
                "is_mandatory": False,
                "why_important": "Collaborates cross-functionally with product managers, QA engineers, and design partners.",
                "recommended_courses": ["Teamwork Skills: Communicating Effectively in Groups – Coursera"],
                "recommended_certs": ["Certified ScrumMaster (CSM)"]
            }
        ]
    },

    "database_administrator": {
        "id": "database_administrator",
        "title": "Database Administrator",
        "category": "Security & Systems",
        "description": "Ensures peak database performance, high availability, disaster recovery, security auditing, and continuous data integrity.",
        "industry": "Database Infrastructure & Administration",
        "average_salary": "$115,000 / ₹15 LPA",
        "market_demand": "High",
        "icon": "Database",
        "overview": "Database Administrators configure high-throughput database servers, tune buffer pools, architect replication failovers, and safeguard enterprise business assets.",
        "skills": [
            {
                "name": "SQL & Advanced Query Optimization",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Analyzes EXPLAIN execution plans, eliminates table scans, creates composite indexes, and optimizes slow queries.",
                "recommended_courses": ["Advanced SQL Query Tuning – Coursera", "SQL Server Query Tuning and Optimization"],
                "recommended_certs": ["Oracle Database SQL Certified Associate", "Microsoft Certified: Azure Database Administrator Associate"]
            },
            {
                "name": "Database Architecture & Indexing",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "B-Tree, Hash, GIN, GiST indexing structures, table partitioning, tablespace management, and storage engines.",
                "recommended_courses": ["PostgreSQL Architecture and Administration – EnterpriseDB"],
                "recommended_certs": ["PostgreSQL 15 Certified Professional"]
            },
            {
                "name": "Backup, Recovery & Disaster Recovery",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Point-in-time recovery (PITR), WAL archiving, logical/physical backups, automated failover, and disaster testing.",
                "recommended_courses": ["Database Backup and Disaster Recovery Strategies – Pluralsight"],
                "recommended_certs": ["Oracle Database Administration Certified Professional (OCP)"]
            },
            {
                "name": "Performance Tuning & Profiling",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Buffer cache hit ratios, shared memory tuning, connection pooling (PgBouncer), vacuuming, and lock contention analysis.",
                "recommended_courses": ["High Performance PostgreSQL – Udemy"],
                "recommended_certs": ["Certified Database Performance Specialist"]
            },
            {
                "name": "Relational DBs (PostgreSQL / MySQL / Oracle)",
                "category": "Technical",
                "required_proficiency": 5,
                "importance_weight": 3.0,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Enterprise administration of open-source and proprietary relational DBMS engines.",
                "recommended_courses": ["PostgreSQL Administration – NPTEL"],
                "recommended_certs": ["Oracle Certified Associate (OCA)", "MySQL 8.0 Database Administrator"]
            },
            {
                "name": "High Availability & Replication",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.8,
                "importance": "Critical",
                "is_mandatory": True,
                "why_important": "Master-replica streaming replication, Patroni/Raft consensus, active-active configurations, and connection failover.",
                "recommended_courses": ["Database High Availability Masterclass – Udemy"],
                "recommended_certs": ["EnterpriseDB Certified Master"]
            },
            {
                "name": "Database Security & Access Control",
                "category": "Technical",
                "required_proficiency": 4,
                "importance_weight": 2.5,
                "importance": "High",
                "is_mandatory": True,
                "why_important": "Transparent data encryption (TDE), SSL connections, row-level security (RLS), role-based permissions, and auditing.",
                "recommended_courses": ["Database Security and Auditing – SANS Institute"],
                "recommended_certs": ["Certified Information Security Manager (CISM)"]
            },
            {
                "name": "Shell Scripting & Automation",
                "category": "Technical",
                "required_proficiency": 3,
                "importance_weight": 2.0,
                "importance": "Medium",
                "is_mandatory": False,
                "why_important": "Automates routine maintenance tasks, disk space alarms, backup verification, and log rotation.",
                "recommended_courses": ["Bash Scripting for DBAs – Coursera"],
                "recommended_certs": ["Linux System Administrator Essentials"]
            }
        ]
    }
}

# ============================================================
# SKILL COMPARISON ENGINE & FORMULAS
# ============================================================

def find_student_skill(student_skills: List[Dict[str, Any]], target_name: str) -> Optional[Dict[str, Any]]:
    """
    Finds a skill in the student's skill array using precise name and alias matching.
    Prevents false overlaps (e.g. Java vs JavaScript).
    """
    if not student_skills or not target_name:
        return None

    t = target_name.strip().lower()

    for s in student_skills:
        name = (s.get("name") or s.get("title") or s.get("skill_name") or "").strip().lower()
        if not name:
            continue
        
        # Exact match
        if name == t:
            return s
        
        # Disallow false Java / JavaScript match
        if (t == "java" and "javascript" in name) or (name == "java" and "javascript" in t):
            continue

        # Common aliases & subsets
        if t in ["sql & databases", "sql & relational databases", "sql"]:
            if name in ["sql", "sql & databases", "database", "databases", "mysql", "postgresql", "postgres"]:
                return s
        if t in ["react & modern frontend", "react"]:
            if name in ["react", "react.js", "react & modern frontend", "frontend", "frontend development"]:
                return s
        if t in ["python", "python (core & oop)"]:
            if name in ["python", "python programming", "python (core & oop)"]:
                return s
        if t in ["machine learning"]:
            if name in ["machine learning", "ml", "machine learning fundamentals"]:
                return s
        if t in ["statistics & probability"]:
            if name in ["statistics", "statistics & probability", "probability"]:
                return s
        if t in ["docker & containerization", "docker"]:
            if name in ["docker", "containerization", "docker & containerization"]:
                return s
        if t in ["html & css"]:
            if name in ["html", "css", "html & css", "html5", "css3"]:
                return s
        if t in ["javascript & typescript", "javascript"]:
            if name in ["javascript", "js", "typescript", "ts", "javascript & typescript"]:
                return s

    return None

def calculate_single_role_comparison(
    role_id: str,
    student_skills: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Calculates detailed skill-by-skill comparison, gap breakdown, and match percentage
    for a single career role against the student's real skills.
    """
    role = CAREER_ROLES_CATALOG.get(role_id)
    if not role:
        raise ValueError(f"Career role '{role_id}' not found in catalog.")

    requirements = role["skills"]
    compared_skills = []

    sum_weighted_match = 0.0
    sum_max_weights = 0.0

    met_count = 0
    improving_count = 0
    missing_count = 0
    mandatory_gap_count = 0

    critical_gaps = []

    for req in requirements:
        req_name = req["name"]
        req_level = req["required_proficiency"]  # 1 to 5
        weight = float(req.get("importance_weight", 1.0))
        is_mandatory = bool(req.get("is_mandatory", False))

        # Retrieve student skill
        matched_student_skill = find_student_skill(student_skills, req_name)
        
        if matched_student_skill:
            student_raw_level = matched_student_skill.get("level")
            student_score = matched_student_skill.get("currentScore") or matched_student_skill.get("current_score")
            student_level = score_or_name_to_level(student_raw_level or student_score)
            is_verified = bool(matched_student_skill.get("verified", False))
        else:
            student_level = 0
            is_verified = False

        # Gap calculation: max(0, required_level - student_level)
        gap = max(0, req_level - student_level)
        
        # Skill Match = min(student_level / required_level, 1.0)
        skill_match = min(student_level / req_level, 1.0) if req_level > 0 else 1.0
        weighted_score = skill_match * weight

        sum_weighted_match += weighted_score
        sum_max_weights += weight

        # Status & Categorization
        if student_level == 0:
            status = "Missing Skill"
            missing_count += 1
            if is_mandatory:
                mandatory_gap_count += 1
                priority = "Critical"
            else:
                priority = "High" if weight >= 2.5 else "Moderate"
        elif gap == 0:
            status = "Meets Requirement"
            met_count += 1
            priority = "Complete"
        elif gap == 1:
            status = "Moderate Gap"
            improving_count += 1
            priority = "Moderate"
        else:
            status = "Significant Gap"
            improving_count += 1
            priority = "Critical" if is_mandatory else "High"
            if is_mandatory:
                mandatory_gap_count += 1

        skill_comparison_item = {
            "skill_name": req_name,
            "category": req.get("category", "Technical"),
            "student_level": student_level,
            "student_level_name": level_to_name(student_level),
            "required_level": req_level,
            "required_level_name": level_to_name(req_level),
            "gap": gap,
            "skill_match_ratio": round(skill_match, 2),
            "importance_weight": weight,
            "importance": req.get("importance", "High"),
            "is_mandatory": is_mandatory,
            "status": status,
            "priority": priority,
            "is_verified": is_verified,
            "why_important": req.get("why_important", ""),
            "recommended_courses": req.get("recommended_courses", []),
            "recommended_certs": req.get("recommended_certs", [])
        }

        compared_skills.append(skill_comparison_item)

        if gap > 0:
            critical_gaps.append(skill_comparison_item)

    # Calculate overall match percentage
    raw_match_pct = (sum_weighted_match / sum_max_weights * 100.0) if sum_max_weights > 0 else 0.0
    
    # Slight penalty if mandatory core skills are completely missing (max 10% penalty for missing essentials)
    mandatory_penalty = 0.0
    if mandatory_gap_count > 0:
        mandatory_penalty = min(mandatory_gap_count * 2.5, 12.0)
    
    final_match_pct = max(0, min(100, round(raw_match_pct - mandatory_penalty)))

    # Sort critical gaps by priority (Critical first, then High, then Moderate)
    priority_order = {"Critical": 0, "High": 1, "Moderate": 2, "Complete": 3}
    critical_gaps.sort(key=lambda g: (priority_order.get(g["priority"], 99), -g["importance_weight"], -g["gap"]))

    return {
        "role_id": role["id"],
        "role_title": role["title"],
        "category": role["category"],
        "description": role["description"],
        "average_salary": role.get("average_salary", ""),
        "market_demand": role.get("market_demand", "High"),
        "match_percentage": final_match_pct,
        "raw_match_percentage": round(raw_match_pct, 1),
        "total_skills_required": len(requirements),
        "skills_meeting_requirements": met_count,
        "skills_needing_improvement": improving_count,
        "missing_skills_count": missing_count,
        "critical_mandatory_gaps_count": mandatory_gap_count,
        "compared_skills": compared_skills,
        "prioritized_gaps": critical_gaps,
        "score_explanation": {
            "formula": "Role Match Score = (Sum(Skill Match Ratio × Weight) / Sum(Weights)) × 100",
            "sum_weighted_match": round(sum_weighted_match, 2),
            "sum_max_weights": round(sum_max_weights, 2),
            "mandatory_penalty": round(mandatory_penalty, 1),
            "note": "A higher match score indicates direct competency alignment with current job descriptions. It is a benchmark of skill readiness, not a job guarantee."
        }
    }

def compare_multiple_roles(
    role_ids: List[str],
    student_skills: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Compares student skills across 1 or more selected career roles.
    Produces both individual role evaluations and a unified comparison matrix.
    """
    if not role_ids:
        role_ids = ["data_scientist", "full_stack_dev", "ai_engineer"]

    role_comparisons = []
    for r_id in role_ids:
        if r_id in CAREER_ROLES_CATALOG:
            role_comparisons.append(calculate_single_role_comparison(r_id, student_skills))

    # Build unique unified skill list across all selected roles for matrix table
    matrix_skills_dict = {}
    for comp in role_comparisons:
        for sk in comp["compared_skills"]:
            name = sk["skill_name"]
            if name not in matrix_skills_dict:
                matrix_skills_dict[name] = {
                    "skill_name": name,
                    "category": sk["category"],
                    "student_level": sk["student_level"],
                    "student_level_name": sk["student_level_name"],
                    "role_requirements": {}
                }
            matrix_skills_dict[name]["role_requirements"][comp["role_id"]] = {
                "required_level": sk["required_level"],
                "required_level_name": sk["required_level_name"],
                "gap": sk["gap"],
                "status": sk["status"],
                "importance": sk["importance"],
                "is_mandatory": sk["is_mandatory"]
            }

    # For any role that doesn't require a given skill in matrix, mark as "Not Required"
    matrix_rows = []
    for sk_name, row in matrix_skills_dict.items():
        for r_id in role_ids:
            if r_id not in row["role_requirements"]:
                row["role_requirements"][r_id] = {
                    "required_level": 0,
                    "required_level_name": "Not Required",
                    "gap": 0,
                    "status": "Not Required",
                    "importance": "None",
                    "is_mandatory": False
                }
        matrix_rows.append(row)

    # Sort matrix rows: skills with biggest total gaps first
    def row_gap_score(r):
        return sum(req.get("gap", 0) for req in r["role_requirements"].values())
    matrix_rows.sort(key=row_gap_score, reverse=True)

    # Build chart data structures
    # 1. Bar Chart: Career Match Comparison
    match_comparison_chart = [
        {
            "role_id": c["role_id"],
            "role_title": c["role_title"],
            "category": c["category"],
            "match_percentage": c["match_percentage"],
            "skills_met": c["skills_meeting_requirements"],
            "skills_gap": c["skills_needing_improvement"] + c["missing_skills_count"]
        }
        for c in role_comparisons
    ]

    # 2. Grouped Bar Chart: Top Skills vs Student Level
    top_skills_chart = []
    for row in matrix_rows[:8]:  # Top 8 most pertinent skills
        chart_item = {
            "skill": row["skill_name"],
            "student_level": row["student_level"]
        }
        for c in role_comparisons:
            chart_item[c["role_title"]] = row["role_requirements"][c["role_id"]]["required_level"]
        top_skills_chart.append(chart_item)

    # 3. Radar Chart Data
    radar_chart_data = []
    for row in matrix_rows[:6]:
        radar_item = {
            "subject": row["skill_name"],
            "Student": row["student_level"] * 20  # Scale 1-5 to 0-100 for visual clarity
        }
        for c in role_comparisons:
            radar_item[c["role_title"]] = row["role_requirements"][c["role_id"]]["required_level"] * 20
        radar_chart_data.append(radar_item)

    return {
        "status": "success",
        "selected_roles_count": len(role_comparisons),
        "roles": role_comparisons,
        "comparison_matrix": matrix_rows,
        "visualizations": {
            "match_comparison_chart": match_comparison_chart,
            "top_skills_chart": top_skills_chart,
            "radar_chart_data": radar_chart_data
        }
    }

def get_ranked_career_matches(student_skills: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Ranks all 15 career roles from highest to lowest match percentage
    based on the student's real skills.
    """
    ranked = []
    for r_id in CAREER_ROLES_CATALOG.keys():
        eval_result = calculate_single_role_comparison(r_id, student_skills)
        
        # Identify strengths (skills that meet or exceed requirement)
        strengths = [
            s["skill_name"] for s in eval_result["compared_skills"]
            if s["gap"] == 0 and s["student_level"] > 0
        ][:4]

        # Identify top gaps
        top_gaps = [
            f"{s['skill_name']} (-{s['gap']})" for s in eval_result["prioritized_gaps"]
        ][:3]

        ranked.append({
            "rank": 0,
            "role_id": eval_result["role_id"],
            "role_title": eval_result["role_title"],
            "category": eval_result["category"],
            "description": eval_result["description"],
            "average_salary": eval_result["average_salary"],
            "market_demand": eval_result["market_demand"],
            "match_percentage": eval_result["match_percentage"],
            "skills_met": eval_result["skills_meeting_requirements"],
            "skills_total": eval_result["total_skills_required"],
            "critical_gaps_count": eval_result["critical_mandatory_gaps_count"],
            "existing_strengths": strengths,
            "top_missing_skills": top_gaps
        })

    # Sort descending by match percentage, then by skills met
    ranked.sort(key=lambda r: (r["match_percentage"], r["skills_met"]), reverse=True)

    # Assign ranks
    for idx, r in enumerate(ranked):
        r["rank"] = idx + 1

    return ranked

def generate_career_action_plan(
    role_id: str,
    student_skills: List[Dict[str, Any]],
    weekly_hours: int = 10
) -> Dict[str, Any]:
    """
    Generates a personalized, step-by-step career improvement plan
    customized to close the student's specific gaps for the selected career role.
    """
    comparison = calculate_single_role_comparison(role_id, student_skills)
    role_title = comparison["role_title"]
    gaps = comparison["prioritized_gaps"]

    if not gaps:
        return {
            "role_id": role_id,
            "role_title": role_title,
            "status": "ready",
            "message": f"Congratulations! Your competencies already align with or exceed the benchmarks for {role_title}.",
            "milestones": []
        }

    # Group gaps into 4 actionable learning phases
    phases = [
        {
            "phase_number": 1,
            "phase_title": "Phase 1: Mandatory Core Foundations & Urgent Gaps",
            "duration_weeks": "Weeks 1–3",
            "focus": "Close critical prerequisite deficiencies in fundamental tools and syntax.",
            "skills_targeted": [],
            "action_items": []
        },
        {
            "phase_number": 2,
            "phase_title": "Phase 2: Intermediate Frameworks & Analytical Problem Solving",
            "duration_weeks": "Weeks 4–7",
            "focus": "Develop hands-on working familiarity with industry-standard libraries and architectures.",
            "skills_targeted": [],
            "action_items": []
        },
        {
            "phase_number": 3,
            "phase_title": "Phase 3: Production Projects & System Implementation",
            "duration_weeks": "Weeks 8–10",
            "focus": "Build verified, portfolio-ready capstone systems that demonstrate autonomous problem solving.",
            "skills_targeted": [],
            "action_items": []
        },
        {
            "phase_number": 4,
            "phase_title": "Phase 4: Industry Certification & Career Readiness",
            "duration_weeks": "Weeks 11–12",
            "focus": "Validate competency with industry certifications and complete mock interview benchmarks.",
            "skills_targeted": [],
            "action_items": []
        }
    ]

    # Distribute prioritized gaps across phases
    for idx, gap in enumerate(gaps):
        phase_idx = min(idx % 3, 2)  # Distribute among phases 1, 2, 3
        phases[phase_idx]["skills_targeted"].append(gap["skill_name"])
        
        # Build practical action item
        action_item = {
            "skill_name": gap["skill_name"],
            "current_level": gap["student_level_name"],
            "target_level": gap["required_level_name"],
            "priority": gap["priority"],
            "is_mandatory": gap["is_mandatory"],
            "hours_required": gap["gap"] * max(8, int(weekly_hours * 1.5)),
            "recommended_course": gap["recommended_courses"][0] if gap["recommended_courses"] else "Targeted Skill Mastery Module",
            "recommended_certification": gap["recommended_certs"][0] if gap["recommended_certs"] else "STATWISE Verified Competency Certificate",
            "practical_deliverable": f"Build a tested production module demonstrating mastery of {gap['skill_name']} at {gap['required_level_name']} level."
        }
        phases[phase_idx]["action_items"].append(action_item)

    # Phase 4 wraps up certifications & portfolio verification
    all_certs = []
    for g in gaps:
        all_certs.extend(g["recommended_certs"])
    unique_certs = list(dict.fromkeys(all_certs))[:3]

    phases[3]["skills_targeted"] = [g["skill_name"] for g in gaps[:4]]
    phases[3]["action_items"] = [
        {
            "skill_name": "Comprehensive Portfolio & Certification Audit",
            "current_level": "Self-Assessed",
            "target_level": "Industry-Verified",
            "priority": "High",
            "is_mandatory": True,
            "hours_required": weekly_hours * 2,
            "recommended_course": f"{role_title} Technical Interview Preparation – STATWISE AI",
            "recommended_certification": unique_certs[0] if unique_certs else "STATWISE Certified Career Practitioner",
            "practical_deliverable": f"Deploy a public GitHub repository showcasing all completed capstones with verified benchmarks for {role_title}."
        }
    ]

    return {
        "status": "success",
        "role_id": role_id,
        "role_title": role_title,
        "current_match_percentage": comparison["match_percentage"],
        "projected_match_percentage": 95,
        "total_learning_hours": sum(
            sum(item["hours_required"] for item in p["action_items"])
            for p in phases
        ),
        "weekly_hours": weekly_hours,
        "gaps_addressed_count": len(gaps),
        "phases": phases
    }
