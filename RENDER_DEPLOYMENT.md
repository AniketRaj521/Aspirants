# 🚀 Render Deployment Guide for ASPIRANTS AI

This repository is pre-configured with a Render Blueprint (`render.yaml`) for zero-configuration, production hosting.

---

## ⚡ Option 1: One-Click Deploy via Render Blueprint (Recommended)

1. Sign in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** in the top right corner and select **Blueprint**.
3. Connect your GitHub repository: `https://github.com/AniketRaj521/Aspirants.git`.
4. Render will automatically detect `render.yaml` and configure two services:
   - **`aspirants-backend`** (Python FastAPI Web Service)
   - **`aspirants-frontend`** (React/Vite Static Site with SPA Rewrites)
5. Fill in the optional environment variables when prompted:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `GROQ_API_KEY`: Your Groq API key
6. Click **Apply**.
   - Render will build and deploy both services automatically!
   - Your frontend will be live on `https://aspirants-frontend.onrender.com`.

---

## 🛠️ Option 2: Manual Deploy on Render

If you prefer to create the services individually:

### 1. Deploy the Backend Web Service
1. In Render, click **New +** -> **Web Service**.
2. Connect `https://github.com/AniketRaj521/Aspirants.git`.
3. Configure settings:
   - **Name:** `aspirants-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path:** `/health`
4. Add Environment Variables:
   - `GEMINI_API_KEY` = your API key
   - `GROQ_API_KEY` = your API key
   - `FRONTEND_URL` = your frontend Render URL
5. Click **Deploy Web Service** and copy your backend URL (e.g. `https://aspirants-backend.onrender.com`).

### 2. Deploy the Frontend Static Site
1. Click **New +** -> **Static Site**.
2. Connect `https://github.com/AniketRaj521/Aspirants.git`.
3. Configure settings:
   - **Name:** `aspirants-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. In **Redirects / Rewrites**:
   - Add a rewrite rule:
     - **Type:** `Rewrite`
     - **Source:** `/*`
     - **Destination:** `/index.html`
5. In **Environment Variables**:
   - `VITE_API_URL` = `https://aspirants-backend.onrender.com` (your backend URL)
6. Click **Deploy Static Site**.

---

## 🔒 Security & Best Practices Configured
- **SPA Routing**: Full rewrite (`/* -> /index.html`) ensures pages like `/dashboard`, `/certifications`, and `/roadmaps` reload properly without 404 errors.
- **Dynamic CORS**: FastAPI dynamically accepts requests from localhost and `*.onrender.com`.
- **Environment Normalization**: Frontend auto-detects `VITE_API_URL` and formats protocols correctly.
