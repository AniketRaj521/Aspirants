import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import IGOT from "./pages/IGOT";

import Home from "./pages/Home/Home";
import Upload from "./pages/Upload/Upload";
import Flashcards from "./pages/Flashcards";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import OTPVerification from "./pages/Auth/OTPVerification";

import Dashboard from "./pages/Dashboard/Dashboard";
import SkillIntelligence from "./pages/Skills/SkillIntelligence";
import PPTGenerator from "./pages/PPTGenerator/PPTGenerator";
import Learning from "./pages/Learning/Learning";

import Assessments from "./pages/Assessments/Assessments";
import AssessmentQuiz from "./pages/Assessments/AssessmentQuiz";
import CodeChefSkillTest from "./pages/Assessments/CodeChefSkillTest";
import DigitalTwin from "./pages/DigitalTwin/DigitalTwin";

import Tutor from "./pages/Tutor/Tutor";

import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import PersonalizedRoadmap from "./pages/Roadmaps/PersonalizedRoadmap";
import Certifications from "./pages/Certifications/Certifications";
import CareerComparison from "./pages/CareerComparison/CareerComparison";

import GenerateNotes from "./pages/GenerateNotes/GenerateNotes";
import ProtectedRoute from "./components/ProtectedRoute";


// =========================================================
// COMING SOON
// =========================================================

function ComingSoon({ title }) {
  return (
    <div className="min-h-screen bg-[#fffdf5] flex items-center justify-center px-6">

      <div className="max-w-lg rounded-3xl bg-white border border-black/10 p-10 text-center shadow-lg">

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F6D76A] text-2xl">
          🤖
        </div>

        <h1 className="text-3xl font-black text-[#172033]">
          {title}
        </h1>

        <p className="mt-4 leading-7 text-gray-500">
          This module is part of the STATWISE AI platform and
          will be connected to the AI backend in the next
          development stage.
        </p>

        <div className="mt-7 flex justify-center gap-3">

          <a
            href="/dashboard"
            className="rounded-xl bg-[#172033] px-5 py-3 font-bold text-white"
          >
            Dashboard
          </a>

          <a
            href="/learning"
            className="rounded-xl bg-[#F6D76A] px-5 py-3 font-bold text-[#172033]"
          >
            Learning
          </a>

        </div>

      </div>

    </div>
  );
}


// =========================================================
// 404
// =========================================================

function NotFound() {
  return (
    <div className="min-h-screen bg-[#fffdf5] flex items-center justify-center px-6">

      <div className="text-center">

        <div className="text-7xl font-black text-[#172033]">
          404
        </div>

        <h1 className="mt-4 text-2xl font-black">
          Page Not Found
        </h1>

        <p className="mt-2 text-gray-500">
          The page you are looking for does not exist.
        </p>

        <a
          href="/"
          className="mt-6 inline-block rounded-xl bg-[#F6D76A] px-6 py-3 font-black"
        >
          Back to Home
        </a>

      </div>

    </div>
  );
}


// =========================================================
// MAIN APP
// =========================================================

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* PUBLIC HOME & LANDING */}
        <Route
          path="/"
          element={
            <>
              <Navbar dashboard={true} />
              <Home />
              <Footer />
            </>
          }
        />

        {/* AUTHENTICATION */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<OTPVerification />} />

        {/* PROTECTED PLATFORM MODULES - ACCESS RESTRICTED WITHOUT LOGIN */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/roadmaps"
          element={
            <ProtectedRoute>
              <PersonalizedRoadmap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/skills"
          element={
            <ProtectedRoute>
              <SkillIntelligence />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learning"
          element={
            <ProtectedRoute>
              <Learning />
            </ProtectedRoute>
          }
        />

        <Route
          path="/certifications"
          element={
            <ProtectedRoute>
              <Certifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/career-comparison"
          element={
            <ProtectedRoute>
              <CareerComparison />
            </ProtectedRoute>
          }
        />

        {/* ASSESSMENTS (PROTECTED) */}
        <Route
          path="/assessments"
          element={
            <ProtectedRoute>
              <Assessments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assessments/quiz"
          element={
            <ProtectedRoute>
              <AssessmentQuiz />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assessments/codechef"
          element={
            <ProtectedRoute>
              <CodeChefSkillTest />
            </ProtectedRoute>
          }
        />

        {/* AI FEATURES & LEARNING TOOLS (PROTECTED) */}
        <Route
          path="/tutor"
          element={
            <ProtectedRoute>
              <Tutor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/generate-notes"
          element={
            <ProtectedRoute>
              <GenerateNotes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ppt-generator"
          element={
            <ProtectedRoute>
              <PPTGenerator />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/flashcards"
          element={
            <ProtectedRoute>
              <Flashcards />
            </ProtectedRoute>
          }
        />

        <Route
          path="/digital-twin"
          element={
            <ProtectedRoute>
              <DigitalTwin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/igot"
          element={
            <ProtectedRoute>
              <IGOT />
            </ProtectedRoute>
          }
        />

        {/* USER PROFILE & SETTINGS (PROTECTED) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />


        {/* FALLBACK */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;