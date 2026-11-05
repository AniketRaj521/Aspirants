import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Search,
  Target,
  Sparkles,
  ArrowRight,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Clock3,
  Layers,
  GraduationCap,
  Calendar,
  X,
  Plus,
  Zap,
  Check,
  ChevronRight,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  getStudentData,
  updateStudentProfile,
  DEFAULT_ROLES,
} from "../../services/studentStore";

// ============================================================
// STRUCTURED CAREER ROADMAPS DATASET (CLEAN & NON-DUPLICATE)
// ============================================================

const ROADMAPS_CATALOG = [
  {
    id: "data_scientist",
    category: "AI & Data",
    title: "AI & Data Scientist Roadmap",
    description: "Step-by-step progression covering Python, statistics, SQL, data wrangling, ML, and MLOps.",
    badge: "Most Popular",
    skills: ["Python", "Statistics", "SQL", "Machine Learning", "Pandas"],
    phases: [
      {
        phase: 1,
        title: "Python Programming & Core Syntax",
        timeline: "Weeks 1–2",
        hours: "20–25 Hours",
        topics: ["Python Basics & Control Flow", "Functions & Scope", "OOP Principles", "NumPy & Pandas Foundations"],
        courses: ["Python for Everybody (Coursera)", "Scientific Computing with Python"],
      },
      {
        phase: 2,
        title: "Statistics, Probability & Mathematics",
        timeline: "Weeks 3–4",
        hours: "25–30 Hours",
        topics: ["Descriptive & Inferential Statistics", "Probability Distributions", "Hypothesis Testing", "Linear Algebra Foundations"],
        courses: ["Statistics & Probability for Data Science (NPTEL)", "Mathematics for Machine Learning"],
      },
      {
        phase: 3,
        title: "SQL, Data Analysis & Visualization",
        timeline: "Weeks 5–6",
        hours: "20–25 Hours",
        topics: ["Complex SQL Joins & Subqueries", "Window Functions & CTEs", "Data Cleaning & Wrangling", "Matplotlib & Seaborn Dashboards"],
        courses: ["Advanced SQL for Analytics (Coursera)", "Data Analysis with Python"],
      },
      {
        phase: 4,
        title: "Machine Learning & Model Evaluation",
        timeline: "Weeks 7–9",
        hours: "35–40 Hours",
        topics: ["Supervised Regression & Classification", "Decision Trees & Random Forests", "Cross-Validation & Metrics", "Unsupervised Clustering"],
        courses: ["Machine Learning Specialization (Andrew Ng)", "Applied ML with Scikit-Learn"],
      },
      {
        phase: 5,
        title: "Real Projects & Industry Certification",
        timeline: "Weeks 10–12",
        hours: "30–35 Hours",
        topics: ["End-to-End Capstone Project", "ML Model Deployment (FastAPI)", "Portfolio & GitHub Showcase", "AWS Machine Learning Certification"],
        courses: ["AWS Certified Machine Learning Specialty", "Production ML Engineering (Coursera)"],
      },
    ],
  },
  {
    id: "ai_engineer",
    category: "AI & Data",
    title: "AI Engineer Roadmap",
    description: "Comprehensive visual guide for modern AI, neural networks, PyTorch, and generative models.",
    badge: "Trending Tech",
    skills: ["Python", "PyTorch", "Deep Learning", "Generative AI", "RAG"],
    phases: [
      {
        phase: 1,
        title: "Mathematical Foundations & Advanced Python",
        timeline: "Weeks 1–2",
        hours: "20–25 Hours",
        topics: ["Vector Calculus & Linear Algebra", "Object-Oriented Python", "NumPy Vectorization", "Matrix Decomposition"],
        courses: ["Mathematics for AI (Imperial College)", "Advanced Python for Engineers"],
      },
      {
        phase: 2,
        title: "Deep Learning & Neural Networks",
        timeline: "Weeks 3–4",
        hours: "30–35 Hours",
        topics: ["Perceptrons & Backpropagation", "Activation & Loss Functions", "PyTorch Tensor Operations", "CNNs for Computer Vision"],
        courses: ["Deep Learning Specialization (DeepLearning.AI)", "PyTorch Fundamentals"],
      },
      {
        phase: 3,
        title: "NLP, Transformers & Sequence Models",
        timeline: "Weeks 5–7",
        hours: "30–35 Hours",
        topics: ["Embeddings & Tokenization", "Self-Attention Mechanism", "Transformer Architecture", "Hugging Face Ecosystem"],
        courses: ["Natural Language Processing (Coursera)", "Transformers with Hugging Face"],
      },
      {
        phase: 4,
        title: "Generative AI, LLMs & RAG Systems",
        timeline: "Weeks 8–10",
        hours: "35–40 Hours",
        topics: ["LLM Fine-Tuning (LoRA / QLoRA)", "Vector Databases (Chroma/Pinecone)", "RAG Pipeline Architecture", "LangChain & LlamaIndex"],
        courses: ["Generative AI with Large Language Models (Coursera)", "LangChain for LLM Apps"],
      },
      {
        phase: 5,
        title: "AI Model Deployment & Production MLOps",
        timeline: "Weeks 11–12",
        hours: "25–30 Hours",
        topics: ["FastAPI Model Serving", "Dockerizing AI Applications", "vLLM & TensorRT Optimization", "Cloud GPU Deployment"],
        courses: ["MLOps & Production Deployment (DeepLearning.AI)", "AWS Certified AI Practitioner"],
      },
    ],
  },
  {
    id: "machine_learning",
    category: "AI & Data",
    title: "Machine Learning Roadmap",
    description: "Supervised & unsupervised learning, scikit-learn, feature engineering, and model deployment.",
    badge: "Core AI",
    skills: ["Python", "Scikit-Learn", "Feature Engineering", "Model Evaluation"],
    phases: [
      {
        phase: 1,
        title: "Python, Math & Exploratory Data Analysis",
        timeline: "Weeks 1–2",
        hours: "20–25 Hours",
        topics: ["Python for Scientific Computing", "Probability & Descriptive Statistics", "Data Preprocessing", "Feature Scaling & Imputation"],
        courses: ["Data Science & ML Bootcamp", "Python for Data Analysis"],
      },
      {
        phase: 2,
        title: "Classical Supervised Algorithms",
        timeline: "Weeks 3–5",
        hours: "30–35 Hours",
        topics: ["Linear & Logistic Regression", "Support Vector Machines (SVM)", "Decision Trees & Ensemble Methods", "Gradient Boosting (XGBoost/LightGBM)"],
        courses: ["Machine Learning Specialization (Coursera)", "Applied Predictive Modeling"],
      },
      {
        phase: 3,
        title: "Unsupervised Learning & Dimensionality Reduction",
        timeline: "Weeks 6–7",
        hours: "20–25 Hours",
        topics: ["K-Means & Hierarchical Clustering", "Principal Component Analysis (PCA)", "t-SNE & UMAP", "Anomaly Detection"],
        courses: ["Unsupervised Learning & Recommenders", "Feature Engineering for ML"],
      },
      {
        phase: 4,
        title: "Model Validation & Hyperparameter Tuning",
        timeline: "Weeks 8–9",
        hours: "20–25 Hours",
        topics: ["K-Fold Cross-Validation", "GridSearch & Optuna", "ROC-AUC, Precision & Recall", "Feature Importance Analysis"],
        courses: ["Advanced Machine Learning Techniques", "Hyperparameter Optimization"],
      },
      {
        phase: 5,
        title: "Production ML Pipelines & Deployment",
        timeline: "Weeks 10–12",
        hours: "25–30 Hours",
        topics: ["Building Scikit-Learn Pipelines", "REST API with FastAPI", "Model Serialization & Tracking (MLflow)", "Docker Deployment"],
        courses: ["Deploying Machine Learning Models", "AWS Certified Machine Learning"],
      },
    ],
  },
  {
    id: "java_backend_dev",
    category: "Software Engineering",
    title: "Java Developer Roadmap",
    description: "Core Java, OOP, Spring Boot, microservices architecture, Hibernate, and RESTful APIs.",
    badge: "High Demand",
    skills: ["Java", "Spring Boot", "Microservices", "Hibernate", "SQL"],
    phases: [
      {
        phase: 1,
        title: "Core Java, OOP & Collections Framework",
        timeline: "Weeks 1–2",
        hours: "25–30 Hours",
        topics: ["Java Syntax & Memory Management", "OOP Pillars & Design Patterns", "Java Collections Framework", "Generics & Streams API"],
        courses: ["Java Programming and Software Engineering (Coursera)", "Modern Java 17+ Mastery"],
      },
      {
        phase: 2,
        title: "Data Structures, Algorithms & SQL Databases",
        timeline: "Weeks 3–4",
        hours: "25–30 Hours",
        topics: ["Time Complexity & Problem Solving", "Lists, Stacks, Queues & Trees", "Relational Database Design", "JDBC & Connection Pooling"],
        courses: ["Data Structures in Java", "SQL Database Fundamentals"],
      },
      {
        phase: 3,
        title: "Spring Boot 3 & Hibernate JPA",
        timeline: "Weeks 5–7",
        hours: "35–40 Hours",
        topics: ["Spring Core & Dependency Injection", "Spring Data JPA & Entity Mapping", "Building RESTful Web Services", "Validation & Global Exception Handling"],
        courses: ["Spring Boot 3 Masterclass", "Hibernate & JPA Fundamentals"],
      },
      {
        phase: 4,
        title: "Microservices, Security & Message Queues",
        timeline: "Weeks 8–10",
        hours: "35–40 Hours",
        topics: ["Microservice Architecture & Discovery", "Spring Security & JWT Authentication", "Apache Kafka & RabbitMQ", "Dockerizing Spring Apps"],
        courses: ["Microservices with Spring Boot & Spring Cloud", "Spring Security & OAuth2"],
      },
      {
        phase: 5,
        title: "Cloud Deployment & Oracle Certification",
        timeline: "Weeks 11–12",
        hours: "25–30 Hours",
        topics: ["Container Orchestration with Kubernetes", "CI/CD Pipeline with GitHub Actions", "Monitoring with Prometheus & Grafana", "Oracle Certified Java Developer Exam"],
        courses: ["Oracle Certified Professional Java SE", "Deploying Java Apps on AWS"],
      },
    ],
  },
  {
    id: "full_stack_dev",
    category: "Software Engineering",
    title: "Full Stack Developer Roadmap",
    description: "End-to-end modern web stack: frontend, backend, APIs, database architecture, and DevOps.",
    badge: "Industry Staple",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker"],
    phases: [
      {
        phase: 1,
        title: "HTML5, Modern CSS & JavaScript / TypeScript",
        timeline: "Weeks 1–2",
        hours: "25–30 Hours",
        topics: ["Semantic HTML & Responsive CSS", "Modern JavaScript (ES6+)", "Asynchronous JS & Fetch API", "TypeScript Basics & Type Safety"],
        courses: ["The Complete Web Development Bootcamp", "TypeScript for Developers"],
      },
      {
        phase: 2,
        title: "React, State Management & Modern UI",
        timeline: "Weeks 3–4",
        hours: "30–35 Hours",
        topics: ["React Component Lifecycle & Hooks", "State Management (Zustand/Redux)", "Tailwind CSS & Component Libraries", "Routing with React Router"],
        courses: ["Full Stack React (Coursera / Meta)", "Modern React Front To Back"],
      },
      {
        phase: 3,
        title: "Node.js, Express & RESTful APIs",
        timeline: "Weeks 5–6",
        hours: "25–30 Hours",
        topics: ["Node.js Runtime & Event Loop", "Express Server & Middleware", "RESTful API Design & CRUD Operations", "Authentication with JWT & Cookies"],
        courses: ["Node.js, Express & MongoDB Bootcamp", "API Design with Node.js"],
      },
      {
        phase: 4,
        title: "Database Modeling (PostgreSQL / MongoDB)",
        timeline: "Weeks 7–9",
        hours: "30–35 Hours",
        topics: ["Relational Schema Design & Prisma ORM", "NoSQL Document Stores", "Indexing & Query Optimization", "Database Migrations & Transactions"],
        courses: ["Databases for Full Stack Developers", "Prisma & PostgreSQL Guide"],
      },
      {
        phase: 5,
        title: "Full Stack Deployment, CI/CD & Testing",
        timeline: "Weeks 10–12",
        hours: "25–30 Hours",
        topics: ["Unit & Integration Testing (Jest)", "Docker Containerization", "Automated CI/CD Pipelines", "Deploying on Cloud (Vercel / AWS)"],
        courses: ["Full Stack Open (University of Helsinki)", "Docker & Kubernetes for Web Developers"],
      },
    ],
  },
  {
    id: "devops_cloud",
    category: "Cloud & DevOps",
    title: "DevOps & Cloud Roadmap",
    description: "Infrastructure as code, cloud topologies (AWS/GCP), containerization, CI/CD, and security.",
    badge: "High Growth",
    skills: ["Linux", "Docker", "Kubernetes", "AWS", "Terraform"],
    phases: [
      {
        phase: 1,
        title: "Linux Administration, Networking & Shell",
        timeline: "Weeks 1–2",
        hours: "20–25 Hours",
        topics: ["Linux Filesystem & User Permissions", "Bash Shell Scripting & Automation", "TCP/IP, DNS, HTTP & SSH", "Git Version Control Workflows"],
        courses: ["Linux Fundamentals for DevOps", "Networking Basics for Engineers"],
      },
      {
        phase: 2,
        title: "Containerization with Docker",
        timeline: "Weeks 3–4",
        hours: "25–30 Hours",
        topics: ["Docker Architecture & Images", "Writing Production Dockerfiles", "Multi-Container with Docker Compose", "Image Optimization & Security"],
        courses: ["Docker for Beginners", "Container Security Best Practices"],
      },
      {
        phase: 3,
        title: "Kubernetes Orchestration & Helm",
        timeline: "Weeks 5–7",
        hours: "35–40 Hours",
        topics: ["Pods, Deployments & Services", "Ingress Controllers & Networking", "ConfigMaps & Persistent Volumes", "Package Management with Helm"],
        courses: ["Certified Kubernetes Administrator (CKA)", "Kubernetes Mastery"],
      },
      {
        phase: 4,
        title: "CI/CD Pipelines & Automation",
        timeline: "Weeks 8–9",
        hours: "25–30 Hours",
        topics: ["GitHub Actions Workflows", "Automated Build, Test & Lint", "Docker Registry Integration", "GitOps with ArgoCD"],
        courses: ["CI/CD Pipelines with GitHub Actions", "GitOps Fundamentals"],
      },
      {
        phase: 5,
        title: "Infrastructure as Code & AWS Certification",
        timeline: "Weeks 10–12",
        hours: "30–35 Hours",
        topics: ["Terraform Syntax & State Management", "Provisioning AWS Cloud Resources", "Cloud Monitoring with Prometheus", "AWS Certified Solutions Architect Exam"],
        courses: ["AWS Certified Solutions Architect Associate", "Terraform for DevOps"],
      },
    ],
  },
  {
    id: "cyber_security",
    category: "Security",
    title: "Cyber Security Roadmap",
    description: "Security architecture, network defense, ethical hacking, vulnerability analysis, and threat modeling.",
    badge: "Critical Field",
    skills: ["Networking", "Cryptography", "Ethical Hacking", "Linux", "SOC Analysis"],
    phases: [
      {
        phase: 1,
        title: "Networking & System Administration",
        timeline: "Weeks 1–2",
        hours: "20–25 Hours",
        topics: ["Network Architecture (OSI Model)", "Packet Analysis with Wireshark", "Linux & Windows Security Basics", "Command Line Security Tools"],
        courses: ["CompTIA Network+ Fundamentals", "Introduction to Cyber Security"],
      },
      {
        phase: 2,
        title: "Cryptography & Security Fundamentals",
        timeline: "Weeks 3–4",
        hours: "25–30 Hours",
        topics: ["Symmetric & Asymmetric Encryption", "Hashing, Salting & Digital Signatures", "SSL/TLS & PKI Certificates", "Authentication (IAM / OAuth)"],
        courses: ["Applied Cryptography", "Security Principles & IAM"],
      },
      {
        phase: 3,
        title: "Vulnerability Assessment & Web Security",
        timeline: "Weeks 5–7",
        hours: "30–35 Hours",
        topics: ["OWASP Top 10 Vulnerabilities", "SQL Injection & XSS Exploits", "Web App Penetration Testing", "Security Scanning (Burp Suite, Nmap)"],
        courses: ["Web Application Security", "Ethical Hacking Fundamentals"],
      },
      {
        phase: 4,
        title: "SOC Operations & Threat Defense",
        timeline: "Weeks 8–10",
        hours: "30–35 Hours",
        topics: ["SIEM Systems (Splunk / Elastic)", "Incident Detection & Response", "Log Analysis & Threat Hunting", "Firewalls & Intrusion Detection (IDS/IPS)"],
        courses: ["Cybersecurity Operations (Cisco)", "SOC Analyst Training"],
      },
      {
        phase: 5,
        title: "Security Compliance & CompTIA Certification",
        timeline: "Weeks 11–12",
        hours: "25–30 Hours",
        topics: ["GDPR, ISO 27001 & NIST Frameworks", "Risk Assessment & Mitigation", "Security Auditing Practice", "CompTIA Security+ Exam Prep"],
        courses: ["CompTIA Security+ Certification", "Certified Ethical Hacker (CEH)"],
      },
    ],
  },
  {
    id: "python_dev",
    category: "Software Engineering",
    title: "Python Developer Roadmap",
    description: "Core syntax, OOP, virtual environments, async programming, and modern web frameworks.",
    badge: "Versatile",
    skills: ["Python", "FastAPI", "Django", "SQLAlchemy", "PyTest"],
    phases: [
      {
        phase: 1,
        title: "Python Syntax, Data Structures & Logic",
        timeline: "Weeks 1–2",
        hours: "20–25 Hours",
        topics: ["Python Fundamentals & Operators", "Lists, Tuples, Sets & Dictionaries", "Comprehensions & Generators", "File I/O & Exception Handling"],
        courses: ["Complete Python Bootcamp", "Python 3 Deep Dive"],
      },
      {
        phase: 2,
        title: "Object-Oriented & Functional Python",
        timeline: "Weeks 3–4",
        hours: "25–30 Hours",
        topics: ["Classes, Inheritance & Magic Methods", "Decorators & Context Managers", "Type Hinting & Pydantic", "Unit Testing with PyTest"],
        courses: ["Advanced Object-Oriented Python", "Clean Code in Python"],
      },
      {
        phase: 3,
        title: "Web Backend with FastAPI",
        timeline: "Weeks 5–7",
        hours: "30–35 Hours",
        topics: ["FastAPI Routing & Path Parameters", "Request/Response Validation", "Asynchronous Endpoints (async/await)", "Authentication & Middleware"],
        courses: ["FastAPI Modern Python Web APIs", "Building REST APIs with Python"],
      },
      {
        phase: 4,
        title: "Database ORM & Background Tasks",
        timeline: "Weeks 8–9",
        hours: "25–30 Hours",
        topics: ["SQLAlchemy 2.0 & Alembic Migrations", "PostgreSQL Integration", "Celery & Redis Background Workers", "Caching Strategies"],
        courses: ["SQLAlchemy & Database Mastery", "Asynchronous Python & Celery"],
      },
      {
        phase: 5,
        title: "Testing, Packaging & Docker Deployment",
        timeline: "Weeks 10–12",
        hours: "25–30 Hours",
        topics: ["Test-Driven Development (TDD)", "Dockerizing Python Applications", "Poetry / Pipenv Package Management", "CI/CD & Cloud Deployment"],
        courses: ["Production Python Deployment", "Python Certification Mastery"],
      },
    ],
  },
  {
    id: "sql_databases",
    category: "Data & Systems",
    title: "SQL & Databases Roadmap",
    description: "Relational database design, query optimization, indexing, CTEs, and window functions.",
    badge: "Essential",
    skills: ["SQL", "PostgreSQL", "Database Design", "Performance Tuning"],
    phases: [
      {
        phase: 1,
        title: "Relational Concepts & Query Basics",
        timeline: "Weeks 1–2",
        hours: "15–20 Hours",
        topics: ["Tables, Primary & Foreign Keys", "SELECT, WHERE, ORDER BY, GROUP BY", "Aggregate Functions (SUM, AVG, COUNT)", "Filtering with HAVING & LIKE"],
        courses: ["SQL for Data Analysis", "Database Fundamentals"],
      },
      {
        phase: 2,
        title: "Complex Joins, Subqueries & Sets",
        timeline: "Weeks 3–4",
        hours: "20–25 Hours",
        topics: ["INNER, LEFT, RIGHT & FULL OUTER Joins", "Self-Joins & Cross-Joins", "Correlated Subqueries", "UNION, INTERSECT & EXCEPT"],
        courses: ["Mastering SQL Joins & Subqueries", "Intermediate Relational Database Design"],
      },
      {
        phase: 3,
        title: "Advanced Window Functions & CTEs",
        timeline: "Weeks 5–6",
        hours: "20–25 Hours",
        topics: ["ROW_NUMBER, RANK, DENSE_RANK", "LEAD, LAG & Running Totals", "Common Table Expressions (CTEs)", "Recursive CTEs"],
        courses: ["Advanced SQL Window Functions", "PostgreSQL Mastery"],
      },
      {
        phase: 4,
        title: "Indexing & Query Performance Tuning",
        timeline: "Weeks 7–8",
        hours: "20–25 Hours",
        topics: ["B-Tree, Hash & GIN Indexes", "EXPLAIN & EXPLAIN ANALYZE Plans", "Query Optimization Strategies", "Transactions & ACID Properties"],
        courses: ["High Performance SQL & Indexing", "Database Administration Basics"],
      },
      {
        phase: 5,
        title: "Database Architecture & Production Administration",
        timeline: "Weeks 9–10",
        hours: "20–25 Hours",
        topics: ["Normalization (1NF to BCNF)", "Stored Procedures & Triggers", "Replication & Sharding Overview", "Backup & Disaster Recovery"],
        courses: ["Database Architecture Masterclass", "PostgreSQL Associate Certification"],
      },
    ],
  },
  {
    id: "dsa",
    category: "Foundations",
    title: "DSA Roadmap",
    description: "Algorithmic thinking, time complexity, trees, graphs, and dynamic programming.",
    badge: "Interview Must",
    skills: ["Algorithms", "Data Structures", "Time Complexity", "Dynamic Programming"],
    phases: [
      {
        phase: 1,
        title: "Complexity Analysis, Arrays & Strings",
        timeline: "Weeks 1–2",
        hours: "20–25 Hours",
        topics: ["Big-O, Big-Theta & Space Complexity", "Two Pointers Technique", "Sliding Window Algorithm", "Prefix Sums & Frequency Arrays"],
        courses: ["Data Structures & Algorithms Specialization", "LeetCode Pattern Mastery"],
      },
      {
        phase: 2,
        title: "Linked Lists, Stacks & Queues",
        timeline: "Weeks 3–4",
        hours: "25–30 Hours",
        topics: ["Singly & Doubly Linked Lists", "Fast & Slow Pointer Technique", "Monotonic Stack Patterns", "Queue Implementations & Deques"],
        courses: ["Mastering Linear Data Structures", "Interview Coding Prep"],
      },
      {
        phase: 3,
        title: "Recursion, Trees & Binary Search",
        timeline: "Weeks 5–6",
        hours: "30–35 Hours",
        topics: ["Recursion & Backtracking", "Binary Search Trees (BST)", "Tree Traversals (Inorder/Preorder/Postorder/BFS)", "Lowest Common Ancestor"],
        courses: ["Trees and Graphs Masterclass", "Binary Search Algorithms"],
      },
      {
        phase: 4,
        title: "Graphs & Shortest Path Algorithms",
        timeline: "Weeks 7–9",
        hours: "30–35 Hours",
        topics: ["Graph Representations (Adjacency Matrix/List)", "BFS & DFS Traversal Patterns", "Dijkstra's & Bellman-Ford Algorithms", "Topological Sort & Cycle Detection"],
        courses: ["Graph Theory & Algorithms", "Advanced Problem Solving"],
      },
      {
        phase: 5,
        title: "Dynamic Programming & Greedy Algorithms",
        timeline: "Weeks 10–12",
        hours: "35–40 Hours",
        topics: ["1D & 2D Dynamic Programming", "Knapsack & Subsequence Problems", "Greedy Choice Property", "Mock Tech Interview Practice"],
        courses: ["Dynamic Programming from Scratch", "Coding Interview Bootcamp"],
      },
    ],
  },
  {
    id: "react_dev",
    category: "Software Engineering",
    title: "React Developer Roadmap",
    description: "Component architecture, state hooks, Next.js, and frontend performance optimization.",
    badge: "Modern Web",
    skills: ["React", "JavaScript", "Next.js", "Tailwind CSS"],
    phases: [
      {
        phase: 1,
        title: "Modern JavaScript & React Basics",
        timeline: "Weeks 1–2",
        hours: "20–25 Hours",
        topics: ["ES6 Modules, Destructuring & Closures", "JSX Syntax & Components", "Props, State & Event Handling", "Conditional Rendering & Lists"],
        courses: ["React Basics (Meta / Coursera)", "Modern React from Scratch"],
      },
      {
        phase: 2,
        title: "React Hooks & Component Lifecycle",
        timeline: "Weeks 3–4",
        hours: "25–30 Hours",
        topics: ["useState, useEffect & useRef", "useMemo & useCallback Performance", "Custom Hooks Architecture", "Forms & Controlled Inputs"],
        courses: ["Advanced React (Coursera)", "Mastering React Hooks"],
      },
      {
        phase: 3,
        title: "State Management & Client Routing",
        timeline: "Weeks 5–6",
        hours: "25–30 Hours",
        topics: ["Context API & Prop Drilling Solutions", "Zustand Global State Management", "React Router v6 Routing", "TanStack React Query for Server State"],
        courses: ["State Management in React", "React Query & Data Fetching"],
      },
      {
        phase: 4,
        title: "Next.js App Router & Server Components",
        timeline: "Weeks 7–9",
        hours: "30–35 Hours",
        topics: ["Server vs Client Components", "Static & Dynamic Route Handlers", "Server Actions & Mutations", "SEO Optimization & Metadata"],
        courses: ["Next.js App Router Masterclass", "Production Ready Next.js"],
      },
      {
        phase: 5,
        title: "Testing, Accessibility & Production Build",
        timeline: "Weeks 10–12",
        hours: "20–25 Hours",
        topics: ["Unit Testing with React Testing Library", "Accessibility (WCAG & a11y)", "Bundle Optimization & Code Splitting", "Deploying to Vercel / Netlify"],
        courses: ["Testing React Applications", "React Developer Certification"],
      },
    ],
  },
  {
    id: "backend_dev",
    category: "Software Engineering",
    title: "Backend Developer Roadmap",
    description: "RESTful architecture, microservices, authentication, databases, and API security.",
    badge: "Core Systems",
    skills: ["APIs", "Authentication", "Databases", "Microservices", "Docker"],
    phases: [
      {
        phase: 1,
        title: "Networking Protocols & Server Fundamentals",
        timeline: "Weeks 1–2",
        hours: "20–25 Hours",
        topics: ["HTTP/HTTPS Methods & Status Codes", "TCP/IP & DNS Resolution", "Web Servers (Nginx / Apache)", "API Architecture Paradigms"],
        courses: ["Backend Engineering Fundamentals", "Networking for Web Developers"],
      },
      {
        phase: 2,
        title: "RESTful API Design & Validation",
        timeline: "Weeks 3–4",
        hours: "25–30 Hours",
        topics: ["Clean REST Endpoint Conventions", "Request Validation & Sanitization", "Error Handling & Logging", "API Documentation with Swagger / OpenAPI"],
        courses: ["Designing RESTful APIs", "API Security Best Practices"],
      },
      {
        phase: 3,
        title: "Databases, ORM & Transactions",
        timeline: "Weeks 5–6",
        hours: "25–30 Hours",
        topics: ["SQL Relational Schema Modeling", "ORM Integration (Prisma / Hibernate)", "Transactions & Concurrency Control", "NoSQL Data Stores"],
        courses: ["Database Design for Backend Engineers", "PostgreSQL in Production"],
      },
      {
        phase: 4,
        title: "Authentication, Authorization & Caching",
        timeline: "Weeks 7–9",
        hours: "30–35 Hours",
        topics: ["JWT Tokens & Session Management", "Role-Based Access Control (RBAC)", "Redis In-Memory Caching", "Rate Limiting & Security Headers"],
        courses: ["Authentication & Security for Web Applications", "Redis for High Performance"],
      },
      {
        phase: 5,
        title: "Microservices, Message Brokers & Deployment",
        timeline: "Weeks 10–12",
        hours: "30–35 Hours",
        topics: ["Microservice Decomposition", "Message Queues (Kafka / RabbitMQ)", "Containerization with Docker", "CI/CD & Cloud Hosting"],
        courses: ["Microservices Architecture", "Cloud Backend Deployment"],
      },
    ],
  },
  {
    id: "git_github",
    category: "Foundations",
    title: "Git & GitHub Roadmap",
    description: "Branching strategies, rebase, merge conflicts, pull requests, and GitHub Actions.",
    badge: "Essential",
    skills: ["Git", "GitHub", "CI/CD", "Collaboration"],
    phases: [
      {
        phase: 1,
        title: "Version Control Concepts & Local Git",
        timeline: "Weeks 1–2",
        hours: "15–20 Hours",
        topics: ["Git Architecture (Working, Staging, Repo)", "git init, add, commit, status", "Viewing History with git log", "Undoing Changes with git restore"],
        courses: ["Git Complete: The Definitive Guide", "Version Control with Git"],
      },
      {
        phase: 2,
        title: "Branching & Merging Workflows",
        timeline: "Weeks 3–4",
        hours: "15–20 Hours",
        topics: ["Creating & Switching Branches", "Fast-Forward vs Three-Way Merge", "Resolving Merge Conflicts Confidently", "git stash & Cleaning Workspaces"],
        courses: ["Mastering Git Branching", "Pro Git Workflows"],
      },
      {
        phase: 3,
        title: "Remote Repositories & Collaboration",
        timeline: "Weeks 5–6",
        hours: "15–20 Hours",
        topics: ["git remote, push, fetch & pull", "Forks & Pull Requests (PRs)", "Code Reviews on GitHub", "Issue Tracking & Project Boards"],
        courses: ["Collaborating with GitHub", "Open Source Contribution Guide"],
      },
      {
        phase: 4,
        title: "Advanced Git: Rebase, Cherry-Pick & Bisect",
        timeline: "Weeks 7–8",
        hours: "15–20 Hours",
        topics: ["git rebase vs git merge", "Interactive Rebase (git rebase -i)", "git cherry-pick for Selective Commits", "Debugging with git bisect"],
        courses: ["Advanced Git Techniques", "Git Internals Under the Hood"],
      },
      {
        phase: 5,
        title: "Automation with GitHub Actions",
        timeline: "Weeks 9–10",
        hours: "15–20 Hours",
        topics: ["Writing YAML Workflow Files", "Automated Linting & Unit Testing", "Deploying via GitHub Actions", "Managing Secrets & Environments"],
        courses: ["GitHub Actions for Continuous Integration", "Automating Workflows with GitHub"],
      },
    ],
  },
];

const CATEGORIES = [
  "All Roadmaps",
  "AI & Data",
  "Software Engineering",
  "Cloud & DevOps",
  "Foundations",
];

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function PersonalizedRoadmap() {
  const navigate = useNavigate();

  // Read student data
  const [studentData, setStudentData] = useState(() => getStudentData());
  const selectedTargetRole = studentData?.profile?.targetRole || "data_scientist";

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All Roadmaps");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State for inspecting a roadmap
  const [activeRoadmapModal, setActiveRoadmapModal] = useState(null);

  // Filtered catalog
  const filteredCatalog = useMemo(() => {
    return ROADMAPS_CATALOG.filter((item) => {
      // Category filter
      if (selectedCategory !== "All Roadmaps" && item.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.skills.some((s) => s.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Set selected roadmap as target role
  const handleSetTargetRole = (roadmapId, roadmapTitle) => {
    updateStudentProfile({ targetRole: roadmapId });
    setStudentData(getStudentData());
    toast.success(`Target career set to ${roadmapTitle}!`, { icon: "🎯" });
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#172033] flex flex-col justify-between">
      {/* 1. TOP NAVBAR */}
      <Navbar dashboard={true} />

      {/* 2. MAIN ROADMAPS CONTAINER */}
      <main className="flex-1 mx-auto max-w-[1536px] w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ========================================================
            HERO HEADER
        ======================================================== */}
        <div className="relative overflow-hidden rounded-[2rem] border-2 border-[#F6D76A] bg-gradient-to-r from-[#FFF9E6] via-[#FFFDF5] to-[#FFF3B0] p-6 sm:p-8 lg:p-10 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E7DFAF] bg-white px-3.5 py-1.5 text-xs font-bold text-[#9A6900] shadow-2xs">
                <Compass size={14} className="text-[#F6D76A]" />
                <span>ASPIRANTS AI • Step-by-Step Learning Roadmaps</span>
              </div>

              <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-[#172033]">
                Explore Career Learning Roadmaps
              </h1>

              <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-slate-600">
                Ordered, step-by-step learning pathways engineered for tech aspirants. Select any career role below to view its 5-phase learning roadmap, key topics, timelines, and verified course recommendations.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#172033] px-4 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#263653] transition shrink-0"
            >
              <span>Go to Dashboard</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* ========================================================
            SEARCH & CATEGORY FILTERS
        ======================================================== */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E7DFAF] pb-5">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#172033] text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-[#FFF8D9] hover:text-[#172033]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roadmaps or skills..."
              className="h-10 w-full rounded-xl border border-[#E7DFAF] bg-white pl-9 pr-3 text-xs font-medium text-[#172033] outline-none focus:border-[#9A6900] focus:ring-2 focus:ring-[#F6D76A]/30"
            />
          </div>
        </div>

        {/* ========================================================
            THE ROADMAP CARDS GRID (AS SHOWN IN USER SCREENSHOT)
        ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCatalog.map((item) => {
            const isTarget = item.id === selectedTargetRole;

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`flex flex-col justify-between rounded-2xl border p-5 transition bg-white shadow-2xs hover:shadow-md ${
                  isTarget
                    ? "border-[#F6D76A] ring-2 ring-[#F6D76A]/40"
                    : "border-slate-200 hover:border-[#F6D76A]"
                }`}
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      ASPIRANTS AI
                    </span>

                    {isTarget ? (
                      <span className="rounded-md bg-[#FFF3B0] border border-[#F6D76A] px-2 py-0.5 text-[9px] font-black text-[#9A6900]">
                        Role Aligned
                      </span>
                    ) : (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 text-base font-extrabold text-[#172033]">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  {/* Skills preview tags */}
                  <div className="mt-3.5 flex flex-wrap gap-1">
                    {item.skills.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-[#FFFDF5] border border-slate-200 px-1.5 py-0.5 text-[9.5px] font-bold text-slate-600"
                      >
                        {s}
                      </span>
                    ))}
                    {item.skills.length > 3 && (
                      <span className="text-[9.5px] font-bold text-slate-400 px-1 py-0.5">
                        +{item.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom View Roadmap Button */}
                <div className="mt-5 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => setActiveRoadmapModal(item)}
                    className="w-full flex items-center justify-between text-xs font-bold text-[#172033] hover:text-[#9A6900] transition group"
                  >
                    <span>View Roadmap</span>
                    <ArrowRight
                      size={14}
                      className="text-[#9A6900] transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ========================================================
            DYNAMIC 5-PHASE ROADMAP DETAILS MODAL
        ======================================================== */}
        <AnimatePresence>
          {activeRoadmapModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[#E7DFAF] bg-white p-6 sm:p-8 shadow-2xl"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-[#FFF3B0] px-2 py-0.5 text-[10px] font-black text-[#9A6900]">
                        {activeRoadmapModal.category}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        5-Phase Progression
                      </span>
                    </div>
                    <h2 className="mt-2 text-2xl font-black text-[#172033]">
                      {activeRoadmapModal.title}
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600">
                      {activeRoadmapModal.description}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveRoadmapModal(null)}
                    className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* 5-Phase Ordered Timeline */}
                <div className="mt-6 space-y-4">
                  {activeRoadmapModal.phases.map((p) => (
                    <div
                      key={p.phase}
                      className="rounded-2xl border border-slate-200 bg-[#FFFDF5] p-5 transition hover:border-[#F6D76A] hover:bg-white hover:shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#172033] text-xs font-black text-[#F6D76A]">
                            {p.phase}
                          </span>
                          <div>
                            <h3 className="text-sm sm:text-base font-extrabold text-[#172033]">
                              {p.title}
                            </h3>
                            <span className="text-[11px] font-bold text-slate-400">
                              {p.timeline} • {p.hours}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-extrabold uppercase rounded-full bg-[#E6F5ED] text-[#16865B] px-2.5 py-0.5 self-start sm:self-auto">
                          Phase {p.phase} Milestone
                        </span>
                      </div>

                      {/* Topics */}
                      <div className="mt-3.5">
                        <span className="text-[11px] font-black uppercase text-slate-400 block mb-1.5">
                          Key Concepts & Drills:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {p.topics.map((t) => (
                            <span
                              key={t}
                              className="rounded-md bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700"
                            >
                              ✓ {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Recommended Courses */}
                      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <BookOpen size={13} className="text-[#9A6900]" />
                          <span>Curated: <strong>{p.courses.join(", ")}</strong></span>
                        </div>

                        <Link
                          to="/learning"
                          className="text-xs font-bold text-[#9A6900] hover:underline"
                        >
                          Find Courses →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Modal Footer Actions */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                  <button
                    onClick={() => {
                      handleSetTargetRole(activeRoadmapModal.id, activeRoadmapModal.title);
                      setActiveRoadmapModal(null);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-[#172033] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#263653] transition"
                  >
                    <Check size={14} className="text-[#F6D76A]" />
                    <span>Set as My Target Role</span>
                  </button>

                  <Link
                    to="/assessments"
                    className="flex items-center gap-1.5 rounded-xl border border-[#172033] bg-white px-4 py-2.5 text-xs font-bold text-[#172033] hover:bg-[#FFF8D9] transition"
                  >
                    <Zap size={13} className="text-[#9A6900]" />
                    <span>Take Skill Assessment for this Role</span>
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. FOOTER */}
      <Footer />
    </div>
  );
}
