import axios from "axios";

/*
=========================================================
STATWISE AI - FRONTEND API SERVICE
=========================================================

Backend:
http://127.0.0.1:8000

Start backend with:

python -m uvicorn main:app --reload

=========================================================
*/


// =======================================================
// API BASE URL
// =======================================================

export function normalizeApiUrl(raw) {
  if (typeof window !== "undefined" && window.location?.hostname) {
    const host = window.location.hostname;
    if (host.includes("onrender.com") && (!raw || raw.includes("localhost") || raw.includes("127.0.0.1"))) {
      return "https://aspirants-backend.onrender.com";
    }
  }

  if (!raw) return "http://127.0.0.1:8000";
  raw = String(raw).trim();

  let proto = "https://";
  if (raw.startsWith("http://")) {
    proto = "http://";
    raw = raw.slice(7);
  } else if (raw.startsWith("https://")) {
    proto = "https://";
    raw = raw.slice(8);
  }

  const hostPart = raw.split("/")[0].split(":")[0];
  if (!hostPart.includes(".") && hostPart !== "localhost" && hostPart !== "127.0.0.1") {
    raw = raw.replace(hostPart, `${hostPart}.onrender.com`);
  }

  return `${proto}${raw}`.replace(/\/+$/, "");
}

export const API_BASE_URL = normalizeApiUrl(
  import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000"
);


// =======================================================
// AXIOS INSTANCE
// =======================================================

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});


// =======================================================
// ERROR HANDLER
// =======================================================

const handleApiError = (error, defaultMessage) => {

  console.error("STATWISE API Error:", error);

  // Backend returned an error
  if (error.response) {

    const message =
      error.response.data?.message ||
      error.response.data?.detail ||
      error.response.data?.error ||
      defaultMessage;

    throw new Error(message);
  }

  // Request was sent but no response
  if (error.request) {

    throw new Error(
      "Cannot connect to STATWISE AI backend. Make sure FastAPI is running on port 8000."
    );
  }

  // Other error
  throw new Error(
    error.message || defaultMessage
  );
};


// =======================================================
// BACKEND HEALTH
// =======================================================

export const checkBackendHealth = async () => {

  try {

    const response = await api.get("/health");

    return response.data;

  } catch (error) {

    handleApiError(
      error,
      "STATWISE AI backend health check failed."
    );

  }

};


// =======================================================
// ROOT BACKEND CHECK
// =======================================================

export const checkBackend = async () => {

  try {

    const response = await api.get("/");

    return response.data;

  } catch (error) {

    handleApiError(
      error,
      "Unable to connect to STATWISE AI backend."
    );

  }

};


// =======================================================
// UPLOAD PDF
// =======================================================

export const uploadPDF = async (file) => {

  try {

    if (!file) {

      throw new Error(
        "Please select a PDF file."
      );

    }


    const isPDF =
      file.type === "application/pdf" ||
      file.name
        .toLowerCase()
        .endsWith(".pdf");


    if (!isPDF) {

      throw new Error(
        "Only PDF files are allowed."
      );

    }


    const formData = new FormData();

    formData.append(
      "file",
      file
    );


    const response = await api.post(
      "/upload-pdf",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );


    return response.data;

  } catch (error) {

    handleApiError(
      error,
      "Failed to upload PDF."
    );

  }

};


// =======================================================
// EXTRACT PDF TEXT
// =======================================================

export const extractPDF = async (file) => {

  try {

    if (!file) {

      throw new Error(
        "Please select a PDF file."
      );

    }


    const isPDF =
      file.type === "application/pdf" ||
      file.name
        .toLowerCase()
        .endsWith(".pdf");


    if (!isPDF) {

      throw new Error(
        "Only PDF files are allowed."
      );

    }


    const formData = new FormData();

    formData.append(
      "file",
      file
    );


    console.log(
      "Sending PDF to /extract-pdf..."
    );


    const response = await api.post(
      "/extract-pdf",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );


    console.log(
      "PDF extraction response:",
      response.data
    );


    return response.data;

  } catch (error) {

    handleApiError(
      error,
      "Failed to extract text from PDF."
    );

  }

};


// =======================================================
// GENERATE QUIZ
// =======================================================

export const generateQuiz = async (file) => {

  try {

    if (!file) {

      throw new Error(
        "Please select a PDF file."
      );

    }


    const isPDF =
      file.type === "application/pdf" ||
      file.name
        .toLowerCase()
        .endsWith(".pdf");


    if (!isPDF) {

      throw new Error(
        "Only PDF files are allowed."
      );

    }


    const formData = new FormData();

    formData.append(
      "file",
      file
    );


    console.log(
      "Sending PDF to /generate-quiz..."
    );


    const response = await api.post(
      "/generate-quiz",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );


    console.log(
      "Quiz response:",
      response.data
    );


    return response.data;

  } catch (error) {

    handleApiError(
      error,
      "Failed to generate quiz."
    );

  }

};


// =======================================================
// SUBMIT QUIZ
// =======================================================

export const submitQuiz = async (
  questions,
  answers
) => {

  try {

    if (!Array.isArray(questions)) {

      throw new Error(
        "Quiz questions must be an array."
      );

    }


    if (!answers) {

      throw new Error(
        "Quiz answers are required."
      );

    }


    const response = await api.post(
      "/submit-quiz",
      {
        questions,
        answers,
      }
    );


    return response.data;

  } catch (error) {

    handleApiError(
      error,
      "Failed to calculate quiz score."
    );

  }

};


// =======================================================
// SKILL GAP ANALYSIS
// =======================================================

export const analyzeSkillGap = async (
  score
) => {

  try {

    if (
      score === undefined ||
      score === null ||
      score === ""
    ) {

      throw new Error(
        "Assessment score is required."
      );

    }


    const response = await api.post(
      "/skill-gap",
      {
        score: Number(score),
      }
    );


    return response.data;

  } catch (error) {

    handleApiError(
      error,
      "Skill gap analysis failed."
    );

  }

};


// =======================================================
// GENERATE AI NOTES
// =======================================================

export const generateNotes = async (
  file
) => {

  try {

    if (!file) {

      throw new Error(
        "Please select a PDF file."
      );

    }


    const isPDF =
      file.type === "application/pdf" ||
      file.name
        .toLowerCase()
        .endsWith(".pdf");


    if (!isPDF) {

      throw new Error(
        "Only PDF files are allowed."
      );

    }


    const formData = new FormData();

    formData.append(
      "file",
      file
    );


    console.log(
      "Sending PDF to /generate-notes..."
    );


    const response = await api.post(
      "/generate-notes",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );


    console.log(
      "AI Notes response:",
      response.data
    );


    return response.data;

  } catch (error) {

    handleApiError(
      error,
      "Failed to generate AI notes."
    );

  }

};


// =======================================================
// AI TUTOR
// =======================================================

export const askTutor = async ({
  question,
  pdfText,
  conversationHistory = [],
  skill = "",
}) => {

  try {

    // ---------------------------------------------------
    // Validate question
    // ---------------------------------------------------

    if (
      !question ||
      !question.trim()
    ) {

      throw new Error(
        "Please enter a question."
      );

    }


    // ---------------------------------------------------
    // Validate PDF
    // ---------------------------------------------------

    if (
      !pdfText ||
      !pdfText.trim()
    ) {

      throw new Error(
        "Please upload a PDF before asking the AI Tutor."
      );

    }


    // ---------------------------------------------------
    // Prepare request
    // ---------------------------------------------------

    const requestData = {

      question:
        question.trim(),

      pdf_text:
        pdfText,

      conversation_history:
        Array.isArray(
          conversationHistory
        )
          ? conversationHistory
          : [],

      skill:
        skill || "",

    };


    console.log(
      "Sending AI Tutor request..."
    );

    console.log(
      "Tutor request:",
      {
        question:
          requestData.question,

        pdfCharacters:
          requestData.pdf_text.length,

        historyMessages:
          requestData
            .conversation_history
            .length,

        skill:
          requestData.skill,
      }
    );


    // ---------------------------------------------------
    // Send request
    // ---------------------------------------------------

    const response = await api.post(
      "/tutor",
      requestData
    );


    // ---------------------------------------------------
    // Log response
    // ---------------------------------------------------

    console.log(
      "AI Tutor response:",
      response.data
    );


    return response.data;

  } catch (error) {

    console.error(
      "AI Tutor request failed:",
      error
    );


    handleApiError(
      error,
      "AI Tutor request failed."
    );

  }

};
export const generatePPT = async ({
  file,
  style = "Visual Learning",
}) => {
  if (!file) {
    throw new Error("Please select a PDF file.");
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("style", style);

  const response = await fetch(
    `${API_BASE_URL}/generate-ppt`,
    {
      method: "POST",
      body: formData,
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "Invalid response received from backend."
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      "PPT generation failed."
    );
  }

  if (data?.success === false) {
    throw new Error(
      data?.message ||
      "PPT generation failed."
    );
  }

  return data;
};


// ===============================
// DIGITAL TWIN
// ===============================

export const analyzeDigitalTwin = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${API_BASE_URL}/digital-twin/analyze`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


// ===============================
// STUDENT INTELLIGENCE & ROADMAP
// ===============================

export const getStudentCareerRoles = async () => {
  try {
    const res = await api.get("/api/student/roles");
    return res.data?.roles || [];
  } catch (err) {
    console.warn("Backend roles failed, using client fallback", err);
    return [];
  }
};

export const fetchStudentSkillGaps = async (roleId, skills) => {
  try {
    const res = await api.post("/api/student/skill-gaps", {
      role_id: roleId,
      skills: skills,
    });
    return res.data?.data || null;
  } catch (err) {
    console.warn("Backend skill gaps failed, using client fallback", err);
    return null;
  }
};

export const fetchStudentRecommendations = async (roleId, skillGaps) => {
  try {
    const res = await api.post("/api/student/recommendations", {
      role_id: roleId,
      skill_gaps: skillGaps,
    });
    return res.data?.data || null;
  } catch (err) {
    console.warn("Backend recommendations failed, using client fallback", err);
    return null;
  }
};

export const fetchStudentRoadmap = async (
  roleId,
  skills,
  timelineWeeks = 12,
  weeklyHours = 10,
  forceRegenerate = false,
  studentId = "default_student"
) => {
  try {
    const res = await api.post("/api/student/roadmap", {
      role_id: roleId,
      skills: skills,
      timeline_weeks: timelineWeeks,
      weekly_hours: weeklyHours,
      force_regenerate: forceRegenerate,
      student_id: studentId,
    });
    return res.data?.data || null;
  } catch (err) {
    console.warn("Backend roadmap failed, using client fallback", err);
    return null;
  }
};

export const toggleStudentRoadmapMilestone = async (
  roleId,
  milestoneId,
  completed = null,
  studentId = "default_student"
) => {
  try {
    const res = await api.post("/api/student/roadmap/milestone", {
      role_id: roleId,
      milestone_id: milestoneId,
      completed: completed,
      student_id: studentId,
    });
    return res.data?.data || null;
  } catch (err) {
    console.warn("Milestone toggle backend sync failed", err);
    return null;
  }
};

export const fetchSavedRoadmap = async (roleId, studentId = "default_student") => {
  try {
    const res = await api.get(`/api/student/roadmap/${encodeURIComponent(roleId)}?student_id=${encodeURIComponent(studentId)}`);
    return res.data?.data || null;
  } catch (err) {
    return null;
  }
};

export const fetchStudentResources = async () => {
  try {
    const res = await api.get("/api/student/resources");
    return res.data || { resources: [], certifications: [] };
  } catch (err) {
    console.warn("Backend resources failed, using client fallback", err);
    return { resources: [], certifications: [] };
  }
};

// =======================================================
// DEFAULT AXIOS INSTANCE
// =======================================================

export default api;
export const fetchStudentSkillProgress = async (studentId = "default_student") => {
  try {
    const res = await api.get(`/api/student/skill-progress?student_id=${encodeURIComponent(studentId)}`);
    return res.data?.data || null;
  } catch (err) {
    console.warn("API skill progress call fallback:", err);
    return null;
  }
};

// =======================================================
// CERTIFICATIONS & ACHIEVEMENTS API CLIENT
// =======================================================

export const fetchCertifications = async (studentId = "default_student", params = {}) => {
  try {
    const q = new URLSearchParams({
      student_id: studentId,
      ...(params.category && params.category !== "all" ? { category: params.category } : {}),
      ...(params.verification_status && params.verification_status !== "all" ? { verification_status: params.verification_status } : {}),
      ...(params.search ? { search: params.search } : {}),
      ...(params.sort_by ? { sort_by: params.sort_by } : {}),
    });
    const res = await api.get(`/api/certifications?${q.toString()}`);
    return res.data?.data || [];
  } catch (err) {
    console.warn("fetchCertifications fallback:", err);
    return null;
  }
};

export const fetchCertificationById = async (certId, studentId = "default_student") => {
  try {
    const res = await api.get(`/api/certifications/${encodeURIComponent(certId)}?student_id=${encodeURIComponent(studentId)}`);
    return res.data?.data || null;
  } catch (err) {
    console.warn("fetchCertificationById failed:", err);
    return null;
  }
};

export const createCertification = async (payload) => {
  try {
    const res = await api.post("/api/certifications", payload);
    return res.data?.data || null;
  } catch (err) {
    console.error("createCertification failed:", err);
    throw err;
  }
};

export const updateCertification = async (certId, payload) => {
  try {
    const res = await api.put(`/api/certifications/${encodeURIComponent(certId)}`, payload);
    return res.data?.data || null;
  } catch (err) {
    console.error("updateCertification failed:", err);
    throw err;
  }
};

export const deleteCertification = async (certId, studentId = "default_student") => {
  try {
    const res = await api.delete(`/api/certifications/${encodeURIComponent(certId)}?student_id=${encodeURIComponent(studentId)}`);
    return res.data?.status === "success";
  } catch (err) {
    console.error("deleteCertification failed:", err);
    throw err;
  }
};

export const fetchCertificationAnalytics = async (studentId = "default_student") => {
  try {
    const res = await api.get(`/api/certifications/analytics/overview?student_id=${encodeURIComponent(studentId)}`);
    return res.data?.data || null;
  } catch (err) {
    console.warn("fetchCertificationAnalytics fallback:", err);
    return null;
  }
};

export const fetchAchievements = async (studentId = "default_student", params = {}) => {
  try {
    const q = new URLSearchParams({
      student_id: studentId,
      ...(params.category && params.category !== "all" ? { category: params.category } : {}),
      ...(params.search ? { search: params.search } : {}),
      ...(params.sort_by ? { sort_by: params.sort_by } : {}),
    });
    const res = await api.get(`/api/achievements?${q.toString()}`);
    return res.data?.data || [];
  } catch (err) {
    console.warn("fetchAchievements fallback:", err);
    return null;
  }
};

export const createAchievement = async (payload) => {
  try {
    const res = await api.post("/api/achievements", payload);
    return res.data?.data || null;
  } catch (err) {
    console.error("createAchievement failed:", err);
    throw err;
  }
};

export const updateAchievement = async (achId, payload) => {
  try {
    const res = await api.put(`/api/achievements/${encodeURIComponent(achId)}`, payload);
    return res.data?.data || null;
  } catch (err) {
    console.error("updateAchievement failed:", err);
    throw err;
  }
};

export const deleteAchievement = async (achId, studentId = "default_student") => {
  try {
    const res = await api.delete(`/api/achievements/${encodeURIComponent(achId)}?student_id=${encodeURIComponent(studentId)}`);
    return res.data?.status === "success";
  } catch (err) {
    console.error("deleteAchievement failed:", err);
    throw err;
  }
};

export const uploadCertificateFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/api/upload-file", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("uploadCertificateFile failed:", err);
    throw err;
  }
};


// =======================================================
// CAREER ROLE COMPARISON APIS
// =======================================================

export const fetchCareerRoles = async () => {
  try {
    const res = await api.get("/api/career-roles");
    return res.data?.data || [];
  } catch (err) {
    console.warn("fetchCareerRoles fallback:", err);
    return [];
  }
};

export const fetchCareerRoleById = async (roleId) => {
  try {
    const res = await api.get(`/api/career-roles/${encodeURIComponent(roleId)}`);
    return res.data?.data || null;
  } catch (err) {
    console.warn(`fetchCareerRoleById (${roleId}) fallback:`, err);
    return null;
  }
};

export const compareCareerRoles = async (payload) => {
  try {
    const res = await api.post("/api/career-roles/compare", payload);
    return res.data;
  } catch (err) {
    console.error("compareCareerRoles failed:", err);
    throw err;
  }
};

export const fetchCareerRankings = async (studentId = "default_student") => {
  try {
    const res = await api.get(`/api/career-roles/rankings?student_id=${encodeURIComponent(studentId)}`);
    return res.data?.data || [];
  } catch (err) {
    console.warn("fetchCareerRankings fallback:", err);
    return [];
  }
};

export const generateCareerActionPlan = async (payload) => {
  try {
    const res = await api.post("/api/career-roles/action-plan", payload);
    return res.data?.data || null;
  } catch (err) {
    console.error("generateCareerActionPlan failed:", err);
    throw err;
  }
};
