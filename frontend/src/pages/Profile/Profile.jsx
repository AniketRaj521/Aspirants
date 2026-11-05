import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  Award,
  BookOpen,
  Target,
  Sparkles,
  Edit3,
  CheckCircle2,
  BarChart3,
  ChevronRight,
  X,
  Save,
  Plus,
  Trash2,
  Search,
  Filter,
  Check,
  Zap,
  Globe,
  Link2,
  Clock3,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  Sliders,
  ExternalLink,
  Code2,
  Database,
  FolderGit2,
  Briefcase,
  Compass,
  FileCheck2,
  Layers,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  getStudentData,
  updateStudentProfile,
  addStudentSkill,
  updateStudentSkill,
  deleteStudentSkill,
  addStudentProject,
  deleteStudentProject,
  addStudentInternship,
  deleteStudentInternship,
  subscribeToStudentData,
  DEFAULT_ROLES,
  calculateSkillGapsForRole,
  resetToEmptyProfile,
  loadSampleProfile,
  EMPTY_STUDENT_PROFILE,
  SAMPLE_STUDENT_PROFILE,
} from "../../services/studentStore";

export default function Profile() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(() => getStudentData());
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editModalTab, setEditModalTab] = useState("personal"); // 'personal' | 'languages' | 'career' | 'bio'
  const [profileForm, setProfileForm] = useState(studentData.profile);

  // Modal tag management helper states
  const [modalNewLang, setModalNewLang] = useState("");
  const [modalNewDb, setModalNewDb] = useState("");
  const [modalNewInterest, setModalNewInterest] = useState("");
  const [modalNewRole, setModalNewRole] = useState("");

  // Active section tab
  const [activeMainTab, setActiveMainTab] = useState("overview"); 
  // 'overview' | 'skills' | 'languages' | 'projects' | 'interests'

  // Skill management states
  const [skillCategoryFilter, setSkillCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  // Project & Internship modals
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isAddInternshipModalOpen, setIsAddInternshipModalOpen] = useState(false);

  // Tag inputs for Languages, Databases, Interests
  const [newLanguageInput, setNewLanguageInput] = useState("");
  const [newDatabaseInput, setNewDatabaseInput] = useState("");
  const [newInterestInput, setNewInterestInput] = useState("");

  // New Skill Form
  const [newSkill, setNewSkill] = useState({
    name: "",
    category: "Technical",
    currentScore: 65,
    targetScore: 85,
    notes: "",
  });

  // New Project Form
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    techStack: "",
    link: "",
    date: "",
  });

  // New Internship Form
  const [newInternship, setNewInternship] = useState({
    company: "",
    role: "",
    duration: "",
    location: "Hybrid",
    description: "",
    skillsApplied: "",
  });

  // Subscribe to real-time store updates
  useEffect(() => {
    const unsubscribe = subscribeToStudentData((data) => {
      setStudentData(data);
      if (!isEditingProfile) {
        setProfileForm(data.profile);
      }
    });
    return unsubscribe;
  }, [isEditingProfile]);

  const { profile, skills, stats, projects = [], internships = [], certifications = [] } = studentData;

  // Profile Strength & Completeness calculation
  const profileCompletion = useMemo(() => {
    let score = 0;
    if (profile.name) score += 10;
    if (profile.email) score += 10;
    if (profile.institution) score += 10;
    if (profile.branch) score += 10;
    if (profile.year) score += 10;
    if (profile.cgpa) score += 10;
    if (profile.programmingLanguages?.length > 0) score += 10;
    if (profile.databases?.length > 0) score += 10;
    if (profile.careerInterests?.length > 0) score += 10;
    if (projects.length > 0 || internships.length > 0) score += 10;
    return Math.min(score, 100);
  }, [profile, projects, internships]);

  // Skill stats
  const skillStats = useMemo(() => {
    const tech = skills.filter((s) => s.category === "Technical");
    const prof = skills.filter((s) => s.category === "Professional");
    const mastered = skills.filter((s) => s.currentScore >= 80);
    const inProgress = skills.filter((s) => s.currentScore < 80);
    const avgScore =
      skills.length > 0
        ? Math.round(
            skills.reduce((acc, curr) => acc + curr.currentScore, 0) /
              skills.length
          )
        : 0;

    return {
      total: skills.length,
      techCount: tech.length,
      profCount: prof.length,
      masteredCount: mastered.length,
      inProgressCount: inProgress.length,
      avgScore,
    };
  }, [skills]);

  // Target Role & Gaps
  const targetRoleObj = useMemo(() => {
    return (
      DEFAULT_ROLES.find((r) => r.id === profile.targetRole) || DEFAULT_ROLES[0]
    );
  }, [profile.targetRole]);

  const roleGaps = useMemo(() => {
    return calculateSkillGapsForRole(profile.targetRole, skills);
  }, [profile.targetRole, skills]);

  // Filtered skills
  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      const matchesSearch = s.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (skillCategoryFilter === "technical") return s.category === "Technical";
      if (skillCategoryFilter === "professional") return s.category === "Professional";
      if (skillCategoryFilter === "mastered") return s.currentScore >= 80;
      if (skillCategoryFilter === "needs_boost") return s.currentScore < 60;
      return true;
    });
  }, [skills, searchQuery, skillCategoryFilter]);

  // Save profile updates
  const handleSaveProfile = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error("Please enter student name");
      return;
    }
    updateStudentProfile(profileForm);
    setIsEditingProfile(false);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (_) {}
    toast.success(`Profile saved successfully for ${profileForm.name}! 🎉`);
  };

  // Reset entire profile to empty
  const handleResetProfile = () => {
    if (window.confirm("Reset profile to an empty form? All personal details will be cleared so a new student can enter their information.")) {
      resetToEmptyProfile();
      setProfileForm({ ...EMPTY_STUDENT_PROFILE, targetRole: "ai_engineer" });
      toast.success("Profile reset to empty slate! You can enter fresh details.");
    }
  };

  // Clear modal form fields
  const handleClearModalForm = () => {
    setProfileForm({
      ...EMPTY_STUDENT_PROFILE,
      targetRole: profileForm.targetRole || "ai_engineer",
      avatar: profileForm.avatar || EMPTY_STUDENT_PROFILE.avatar
    });
    toast.success("Form cleared! All input fields are now empty.");
  };

  // Quick-fill Example handler
  const handleQuickFillExample = () => {
    loadSampleProfile();
    setProfileForm({ ...SAMPLE_STUDENT_PROFILE });
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    toast.success("Example loaded: CSE 3rd Year • Python, Java, SQL • AI Interests! 🎉");
  };

  // Modal tag helpers
  const addFormLanguage = (lang) => {
    const val = (lang || modalNewLang).trim();
    if (!val) return;
    const current = profileForm.programmingLanguages || [];
    if (!current.includes(val)) {
      setProfileForm({ ...profileForm, programmingLanguages: [...current, val] });
    }
    setModalNewLang("");
  };

  const removeFormLanguage = (lang) => {
    setProfileForm({
      ...profileForm,
      programmingLanguages: (profileForm.programmingLanguages || []).filter((l) => l !== lang),
    });
  };

  const addFormDatabase = (db) => {
    const val = (db || modalNewDb).trim();
    if (!val) return;
    const current = profileForm.databases || [];
    if (!current.includes(val)) {
      setProfileForm({ ...profileForm, databases: [...current, val] });
    }
    setModalNewDb("");
  };

  const removeFormDatabase = (db) => {
    setProfileForm({
      ...profileForm,
      databases: (profileForm.databases || []).filter((d) => d !== db),
    });
  };

  const addFormInterest = (interest) => {
    const val = (interest || modalNewInterest).trim();
    if (!val) return;
    const current = profileForm.careerInterests || [];
    if (!current.includes(val)) {
      setProfileForm({ ...profileForm, careerInterests: [...current, val] });
    }
    setModalNewInterest("");
  };

  const removeFormInterest = (interest) => {
    setProfileForm({
      ...profileForm,
      careerInterests: (profileForm.careerInterests || []).filter((i) => i !== interest),
    });
  };

  const addFormPreferredRole = (role) => {
    const val = (role || modalNewRole).trim();
    if (!val) return;
    const current = profileForm.preferredJobRoles || [];
    if (!current.includes(val)) {
      setProfileForm({ ...profileForm, preferredJobRoles: [...current, val] });
    }
    setModalNewRole("");
  };

  const removeFormPreferredRole = (role) => {
    setProfileForm({
      ...profileForm,
      preferredJobRoles: (profileForm.preferredJobRoles || []).filter((r) => r !== role),
    });
  };

  // Add Language Tag
  const handleAddLanguage = (lang) => {
    const val = lang || newLanguageInput;
    if (!val.trim()) return;
    const current = profileForm.programmingLanguages || [];
    if (!current.includes(val.trim())) {
      const updated = {
        ...profileForm,
        programmingLanguages: [...current, val.trim()]
      };
      setProfileForm(updated);
      updateStudentProfile(updated);
      toast.success(`Language "${val.trim()}" added!`);
    }
    setNewLanguageInput("");
  };

  const handleRemoveLanguage = (lang) => {
    const updated = {
      ...profileForm,
      programmingLanguages: (profileForm.programmingLanguages || []).filter(l => l !== lang)
    };
    setProfileForm(updated);
    updateStudentProfile(updated);
  };

  // Add Database Tag
  const handleAddDatabase = (db) => {
    const val = db || newDatabaseInput;
    if (!val.trim()) return;
    const current = profileForm.databases || [];
    if (!current.includes(val.trim())) {
      const updated = {
        ...profileForm,
        databases: [...current, val.trim()]
      };
      setProfileForm(updated);
      updateStudentProfile(updated);
      toast.success(`Database "${val.trim()}" added!`);
    }
    setNewDatabaseInput("");
  };

  const handleRemoveDatabase = (db) => {
    const updated = {
      ...profileForm,
      databases: (profileForm.databases || []).filter(d => d !== db)
    };
    setProfileForm(updated);
    updateStudentProfile(updated);
  };

  // Add Career Interest Tag
  const handleAddInterest = (interest) => {
    const val = interest || newInterestInput;
    if (!val.trim()) return;
    const current = profileForm.careerInterests || [];
    if (!current.includes(val.trim())) {
      const updated = {
        ...profileForm,
        careerInterests: [...current, val.trim()]
      };
      setProfileForm(updated);
      updateStudentProfile(updated);
      toast.success(`Career interest "${val.trim()}" added!`);
    }
    setNewInterestInput("");
  };

  const handleRemoveInterest = (interest) => {
    const updated = {
      ...profileForm,
      careerInterests: (profileForm.careerInterests || []).filter(i => i !== interest)
    };
    setProfileForm(updated);
    updateStudentProfile(updated);
  };

  // Add Skill
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) {
      toast.error("Please enter a skill name");
      return;
    }
    addStudentSkill(newSkill);
    setNewSkill({
      name: "",
      category: "Technical",
      currentScore: 65,
      targetScore: 85,
      notes: "",
    });
    setIsAddSkillModalOpen(false);
    toast.success(`Skill "${newSkill.name}" added to profile! +50 XP`);
  };

  // Save edited skill
  const handleSaveEditedSkill = (e) => {
    e.preventDefault();
    if (!editingSkill) return;
    updateStudentSkill(editingSkill.id, {
      name: editingSkill.name,
      category: editingSkill.category,
      currentScore: Number(editingSkill.currentScore),
      targetScore: Number(editingSkill.targetScore),
      notes: editingSkill.notes,
    });
    setEditingSkill(null);
    toast.success("Skill proficiency updated!");
  };

  // Delete skill
  const handleDeleteSkill = (id, name) => {
    if (window.confirm(`Remove "${name}" from your skills?`)) {
      deleteStudentSkill(id);
      toast.success(`Skill "${name}" removed.`);
    }
  };

  // Add Project
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) {
      toast.error("Please enter a project title");
      return;
    }
    addStudentProject(newProject);
    setNewProject({
      title: "",
      description: "",
      techStack: "",
      link: "",
      date: "",
    });
    setIsAddProjectModalOpen(false);
    toast.success("Project added to your portfolio! +100 XP 🎉");
  };

  // Add Internship
  const handleAddInternship = (e) => {
    e.preventDefault();
    if (!newInternship.company.trim() || !newInternship.role.trim()) {
      toast.error("Please enter company and role");
      return;
    }
    addStudentInternship(newInternship);
    setNewInternship({
      company: "",
      role: "",
      duration: "",
      location: "Hybrid",
      description: "",
      skillsApplied: "",
    });
    setIsAddInternshipModalOpen(false);
    toast.success("Internship added to your career profile! +150 XP 🎉");
  };

  return (
    <div className="min-h-screen bg-[#FBF8EF] text-[#172033]">
      <Navbar dashboard={true} />

      {/* Profile Hero Banner */}
      <section className="relative overflow-hidden border-b border-[#EAD8A6] bg-gradient-to-r from-[#172033] via-[#1E2B45] to-[#172033] py-14 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#F6D76A_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            {/* Student Avatar & Basic Info */}
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-28 w-28 rounded-2xl border-4 border-[#F6D76A] object-cover shadow-xl"
                />
                <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-[#F6D76A] font-black text-[#172033] shadow-md">
                  ★
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                    {profile.name || "New Student (Profile Not Set)"}
                  </h1>
                  <span className="rounded-full bg-[#F6D76A]/20 px-3 py-1 text-xs font-bold text-[#F6D76A] border border-[#F6D76A]/40">
                    Level {stats.currentLevel} • {stats.levelTitle}
                  </span>
                </div>

                {/* College, Branch, Year Header */}
                <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-300">
                  <GraduationCap size={16} className="text-[#F6D76A]" />
                  <span>
                    {profile.branch || profile.year || profile.institution ? (
                      <>
                        <strong>{profile.branch || "Branch: Not Specified"}</strong> • {profile.year || "Year: Not Specified"} • {profile.institution || "College: Not Specified"}
                      </>
                    ) : (
                      <span className="italic text-gray-300">Academic details not entered yet (Click Edit Profile)</span>
                    )}
                  </span>
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <Target size={13} className="text-[#F6D76A]" />
                    Target Role:{" "}
                    <strong className="text-white">
                      {targetRoleObj.title}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    CGPA: <strong className="text-[#F6D76A]">{profile.cgpa || "Not entered"}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    ID: <strong className="text-white">{profile.studentId || "Not assigned"}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Demo Button */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Edit Profile Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsEditingProfile(true)}
                className="flex items-center gap-2 rounded-2xl bg-[#F6D76A] px-5 py-3 text-xs font-black text-[#172033] shadow-lg hover:bg-yellow-400 transition"
              >
                <Edit3 size={15} />
                Edit Profile
              </motion.button>

              {/* Reset / Empty Profile Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleResetProfile}
                title="Reset profile to an empty form for a new student"
                className="flex items-center gap-2 rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-xs font-bold text-white hover:bg-rose-500/20 hover:border-rose-400 transition shadow-md"
              >
                <Trash2 size={15} className="text-rose-400" />
                Reset to Empty Profile
              </motion.button>


            </div>
          </div>

          {/* Profile Strength Bar */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-300 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#F6D76A]" />
                Profile Information Completeness
              </span>
              <span className="font-black text-[#F6D76A]">
                {profileCompletion}% Complete
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${profileCompletion}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-emerald-400 to-[#F6D76A]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Profile Hub Navigation Tabs */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Onboarding Welcome Banner when Profile is Empty */}
        {!profile.name && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border-2 border-dashed border-[#F6D76A] bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 p-6 sm:p-8 shadow-sm"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#172033] text-[#F6D76A] shadow-md">
                  <Sparkles size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#172033]">
                    Welcome! Set Up Your Student Profile & Skill Hub
                  </h3>
                  <p className="mt-1 text-xs text-gray-600 max-w-2xl leading-relaxed">
                    Your profile is currently empty. Enter your personal details, college, branch (e.g. CSE), year (e.g. 3rd year), CGPA, programming languages (e.g. Python, Java), databases (e.g. SQL), and career interests (e.g. Artificial Intelligence) to personalize your AI recommendations and skill gap charts.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    setProfileForm({ ...EMPTY_STUDENT_PROFILE, targetRole: "ai_engineer" });
                    setEditModalTab("personal");
                    setIsEditingProfile(true);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-[#172033] px-5 py-3 text-xs font-black text-white shadow-md hover:bg-[#263553] transition"
                >
                  <Edit3 size={15} className="text-[#F6D76A]" />
                  Enter Your Details (Empty Form)
                </button>

              </div>
            </div>
          </motion.div>
        )}

        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#E8DAB2] bg-white p-2 shadow-sm">
          {[
            { id: "overview", label: "Academic & Personal Profile", icon: GraduationCap },
            { id: "languages", label: "Languages & Databases", icon: Code2 },
            { id: "skills", label: `Technical & Soft Skills (${skills.length})`, icon: BrainCircuit },
            { id: "projects", label: `Projects & Internships (${projects.length + internships.length})`, icon: FolderGit2 },
            { id: "certifications", label: `Certifications & Achievements (${(certifications?.length || 0) + ((studentData.achievements && studentData.achievements.length) || 0)})`, icon: Award },
            { id: "interests", label: "Career Interests & Roles", icon: Compass },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMainTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveMainTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                  isActive
                    ? "bg-[#172033] text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={15} className={isActive ? "text-[#F6D76A]" : "text-gray-400"} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ========================================================
            TAB 1: ACADEMIC & PERSONAL INFORMATION
        ======================================================== */}
        {activeMainTab === "overview" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Card: Academic Record */}
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-3xl border border-[#E8DAB2] bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-black text-[#172033] flex items-center gap-2">
                    <GraduationCap size={20} className="text-[#9A6900]" />
                    Academic Information & Qualifications
                  </h2>
                  <button
                    onClick={() => {
                      setEditModalTab("personal");
                      setIsEditingProfile(true);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-[#9A6900] hover:text-[#172033]"
                  >
                    <Edit3 size={13} /> Edit Academic Info
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#FBF8EF] p-4 border border-gray-100">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase">College / University</p>
                    <p className="mt-1 text-sm font-bold text-[#172033]">
                      {profile.institution || <span className="text-gray-400 font-normal italic">Not specified yet</span>}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#FBF8EF] p-4 border border-gray-100">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase">Branch / Department</p>
                    <p className="mt-1 text-sm font-bold text-[#172033]">
                      {profile.branch || <span className="text-gray-400 font-normal italic">Not specified yet (e.g. CSE)</span>}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#FBF8EF] p-4 border border-gray-100">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase">Current Year / Semester</p>
                    <p className="mt-1 text-sm font-bold text-[#172033]">
                      {profile.year || <span className="text-gray-400 font-normal italic">Not specified yet (e.g. 3rd year)</span>}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#FBF8EF] p-4 border border-gray-100">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase">Cumulative CGPA / Grade</p>
                    <p className="mt-1 text-sm font-black text-emerald-600">
                      {profile.cgpa || <span className="text-gray-400 font-normal italic">Not entered yet</span>}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#FBF8EF] p-4 border border-gray-100">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase">Degree Qualification</p>
                    <p className="mt-1 text-sm font-bold text-[#172033]">
                      {profile.qualification || <span className="text-gray-400 font-normal italic">Not specified yet</span>}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#FBF8EF] p-4 border border-gray-100">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase">Student Registration ID</p>
                    <p className="mt-1 text-sm font-mono font-bold text-[#172033]">
                      {profile.studentId || <span className="text-gray-400 font-normal italic">Not assigned yet</span>}
                    </p>
                  </div>
                </div>

                {/* Bio Summary */}
                <div className="mt-6 border-t border-gray-100 pt-5">
                  <p className="text-xs font-bold text-gray-500 uppercase">Career Bio / Objective</p>
                  <p className="mt-2 text-xs leading-relaxed text-gray-700 bg-[#FBF8EF] p-4 rounded-2xl border border-gray-100">
                    {profile.bio || "No summary added yet. Click Edit Profile to add your student objective."}
                  </p>
                </div>
              </div>

              {/* Quick Snapshot: Languages & Databases Preview */}
              <div className="rounded-3xl border border-[#E8DAB2] bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h3 className="text-base font-black text-[#172033] flex items-center gap-2">
                    <Code2 size={18} className="text-[#9A6900]" />
                    Programming Languages & Databases Known
                  </h3>
                  <button
                    onClick={() => setActiveMainTab("languages")}
                    className="text-xs font-bold text-[#9A6900] hover:underline"
                  >
                    Manage All
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500">Programming Languages:</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(profile.programmingLanguages && profile.programmingLanguages.length > 0) ? (
                        profile.programmingLanguages.map((lang) => (
                          <span
                            key={lang}
                            className="rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-900 border border-blue-200"
                          >
                            {lang}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 italic">No programming languages added yet (e.g. Python, Java).</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500">Databases & Query Engines:</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(profile.databases && profile.databases.length > 0) ? (
                        profile.databases.map((db) => (
                          <span
                            key={db}
                            className="rounded-xl bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-900 border border-purple-200"
                          >
                            {db}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 italic">No databases added yet (e.g. SQL, MongoDB).</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Contact, Socials & Role Match */}
            <div className="space-y-6 lg:col-span-1">
              {/* Role Alignment Gauge */}
              <div className="rounded-3xl border border-[#E8DAB2] bg-gradient-to-br from-[#172033] to-[#263553] p-6 text-white shadow-md">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#F6D76A]">
                  Target Career Role
                </p>
                <h3 className="mt-1 text-xl font-black text-white">
                  {targetRoleObj.title}
                </h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#F6D76A]">
                    {roleGaps.readinessPercentage}%
                  </span>
                  <span className="text-xs text-gray-300">Competency Match</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/20">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${roleGaps.readinessPercentage}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-amber-400 to-[#F6D76A]"
                  />
                </div>
                <button
                  onClick={() => navigate("/skills")}
                  className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#F6D76A] py-2.5 text-xs font-black text-[#172033] hover:bg-yellow-400 transition shadow-sm"
                >
                  View Role Skill Gaps
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Contact Information */}
              <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm space-y-3.5 text-xs">
                <h3 className="text-sm font-black text-[#172033] border-b border-gray-100 pb-3 flex items-center gap-2">
                  <User size={15} className="text-[#9A6900]" />
                  Contact & Links
                </h3>
                <div className="flex items-center gap-2.5 text-gray-700">
                  <Mail size={14} className="text-gray-400" />
                  <span>{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2.5 text-gray-700">
                    <Phone size={14} className="text-gray-400" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-2.5 text-gray-700">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between text-blue-600 hover:underline pt-2 border-t border-gray-100"
                  >
                    <span className="flex items-center gap-2">
                      <Link2 size={14} /> GitHub Profile
                    </span>
                    <ExternalLink size={12} />
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between text-blue-600 hover:underline"
                  >
                    <span className="flex items-center gap-2">
                      <Globe size={14} /> LinkedIn Profile
                    </span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: PROGRAMMING LANGUAGES & DATABASES
        ======================================================== */}
        {activeMainTab === "languages" && (
          <div className="space-y-8">
            {/* Programming Languages Section */}
            <div className="rounded-3xl border border-[#E8DAB2] bg-white p-7 shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-black text-[#172033] flex items-center gap-2">
                    <Code2 size={20} className="text-[#9A6900]" />
                    Programming Languages Known
                  </h2>
                  <p className="text-xs text-gray-500">
                    Add or remove the programming languages you are proficient in (e.g. Python, Java, C++, TypeScript).
                  </p>
                </div>

                {/* Input to add language */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add language..."
                    value={newLanguageInput}
                    onChange={(e) => setNewLanguageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddLanguage();
                      }
                    }}
                    className="rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2 text-xs outline-none focus:border-[#172033]"
                  />
                  <button
                    onClick={() => handleAddLanguage()}
                    className="rounded-xl bg-[#172033] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#263553]"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Current Languages Tags */}
              <div className="mt-5 flex flex-wrap gap-2.5 min-h-[36px] items-center">
                {(!profile.programmingLanguages || profile.programmingLanguages.length === 0) ? (
                  <p className="text-xs text-gray-400 italic">No programming languages added yet. Type a language above or click the quick-add buttons below.</p>
                ) : (
                  (profile.programmingLanguages || []).map((lang) => (
                    <span
                      key={lang}
                      className="flex items-center gap-2 rounded-2xl bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-900 border border-blue-200 shadow-2xs"
                    >
                      <span>{lang}</span>
                      <button
                        onClick={() => handleRemoveLanguage(lang)}
                        className="rounded-full p-0.5 text-blue-500 hover:bg-blue-200 hover:text-blue-900"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Quick Preset Pills */}
              <div className="mt-6 border-t border-gray-100 pt-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Quick-Add Popular Languages:
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Python", "Java", "C++", "JavaScript", "TypeScript", "SQL", "Go", "Rust", "C#"].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleAddLanguage(preset)}
                      className="rounded-xl border border-gray-200 bg-[#FBF8EF] px-3 py-1 text-xs font-semibold text-gray-700 hover:border-[#172033] hover:bg-white transition"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Databases Section */}
            <div className="rounded-3xl border border-[#E8DAB2] bg-white p-7 shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-black text-[#172033] flex items-center gap-2">
                    <Database size={20} className="text-[#9A6900]" />
                    Databases & Query Engines
                  </h2>
                  <p className="text-xs text-gray-500">
                    Relational, NoSQL, and vector database systems you can design and query with.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add database..."
                    value={newDatabaseInput}
                    onChange={(e) => setNewDatabaseInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddDatabase();
                      }
                    }}
                    className="rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2 text-xs outline-none focus:border-[#172033]"
                  />
                  <button
                    onClick={() => handleAddDatabase()}
                    className="rounded-xl bg-[#172033] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#263553]"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Current Database Tags */}
              <div className="mt-5 flex flex-wrap gap-2.5 min-h-[36px] items-center">
                {(!profile.databases || profile.databases.length === 0) ? (
                  <p className="text-xs text-gray-400 italic">No databases added yet. Type a database above or click the quick-add buttons below.</p>
                ) : (
                  (profile.databases || []).map((db) => (
                    <span
                      key={db}
                      className="flex items-center gap-2 rounded-2xl bg-purple-50 px-3.5 py-2 text-xs font-bold text-purple-900 border border-purple-200 shadow-2xs"
                    >
                      <span>{db}</span>
                      <button
                        onClick={() => handleRemoveDatabase(db)}
                        className="rounded-full p-0.5 text-purple-500 hover:bg-purple-200 hover:text-purple-900"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Preset Databases */}
              <div className="mt-6 border-t border-gray-100 pt-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Quick-Add Popular Databases:
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["SQL", "PostgreSQL", "MongoDB", "MySQL", "Redis", "SQLite", "Pinecone", "Oracle"].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleAddDatabase(preset)}
                      className="rounded-xl border border-gray-200 bg-[#FBF8EF] px-3 py-1 text-xs font-semibold text-gray-700 hover:border-[#172033] hover:bg-white transition"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: TECHNICAL & SOFT SKILLS MANAGEMENT
        ======================================================== */}
        {activeMainTab === "skills" && (
          <div className="space-y-6">
            {/* Controls Bar */}
            <div className="flex flex-col justify-between gap-4 rounded-3xl border border-[#E8DAB2] bg-white p-5 shadow-sm sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-black text-[#172033]">
                  Technical & Soft Skills Inventory
                </h2>
                <p className="text-xs text-gray-500">
                  Track and adjust proficiency ratings (0–100) across all technical frameworks and professional soft skills.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsAddSkillModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-[#172033] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#263553]"
              >
                <Plus size={16} className="text-[#F6D76A]" />
                Add New Skill
              </motion.button>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col gap-4 rounded-2xl border border-[#E8DAB2] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "all", label: "All Skills" },
                  { id: "technical", label: "Technical Skills" },
                  { id: "professional", label: "Soft / Professional Skills" },
                  { id: "mastered", label: "Mastered (>80%)" },
                  { id: "needs_boost", label: "Needs Boost (<60%)" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSkillCategoryFilter(tab.id)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                      skillCategoryFilter === tab.id
                        ? "bg-[#F6D76A] text-[#172033] shadow-2xs"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#FBF8EF] py-2 pl-9 pr-3 text-xs outline-none focus:border-[#172033]"
                />
              </div>
            </div>

            {/* Skills Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSkills.map((s) => {
                const isTech = s.category === "Technical";
                const isMastered = s.currentScore >= 80;

                return (
                  <motion.div
                    key={s.id}
                    layout
                    className="flex flex-col justify-between rounded-3xl border border-[#E8DAB2] bg-white p-5 shadow-2xs hover:shadow-md transition"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                            isTech
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-purple-50 text-purple-700 border border-purple-200"
                          }`}
                        >
                          {s.category}
                        </span>

                        <div className="flex items-center gap-1 text-gray-400">
                          <button
                            onClick={() => setEditingSkill(s)}
                            className="rounded-lg p-1.5 hover:bg-gray-100 hover:text-[#172033]"
                            title="Edit Proficiency"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(s.id, s.name)}
                            className="rounded-lg p-1.5 hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <h3 className="mt-3 text-base font-bold text-[#172033] flex items-center gap-1.5">
                        {s.name}
                        {s.verified && (
                          <ShieldCheck size={14} className="text-emerald-500" title="Verified" />
                        )}
                      </h3>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Proficiency: <strong className="text-gray-800">{s.level}</strong>
                      </p>

                      <div className="mt-4">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-gray-400">Score Rating:</span>
                          <span className="text-[#172033] font-black">{s.currentScore} / 100</span>
                        </div>
                        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                          <div
                            style={{ width: `${s.currentScore}%` }}
                            className={`h-full ${
                              isMastered
                                ? "bg-emerald-500"
                                : s.currentScore >= 60
                                ? "bg-amber-400"
                                : "bg-rose-400"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-gray-100 pt-3 flex items-center justify-between text-xs">
                      <span className="text-gray-400">Target: {s.targetScore}</span>
                      <button
                        onClick={() =>
                          navigate(`/assessments/quiz?skill=${encodeURIComponent(s.name)}`)
                        }
                        className="font-bold text-[#9A6900] hover:text-[#172033]"
                      >
                        Assess Skill
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: PROJECTS, INTERNSHIPS & PORTFOLIO
        ======================================================== */}
        {activeMainTab === "projects" && (
          <div className="space-y-8">
            {/* PROJECTS SECTION */}
            <div className="rounded-3xl border border-[#E8DAB2] bg-white p-7 shadow-sm space-y-6">
              <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-black text-[#172033] flex items-center gap-2">
                    <FolderGit2 size={20} className="text-[#9A6900]" />
                    Academic & Personal Projects
                  </h2>
                  <p className="text-xs text-gray-500">
                    Showcase key applications, capstones, and repositories you have engineered.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddProjectModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-[#172033] px-4 py-2 text-xs font-bold text-white hover:bg-[#263553]"
                >
                  <Plus size={14} className="text-[#F6D76A]" /> Add Project
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-[#FBF8EF] p-8 text-center">
                  <FolderGit2 className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm font-bold text-gray-700">No Projects Added Yet</p>
                  <p className="text-xs text-gray-500 mt-1">Showcase your technical projects, open-source work, or course capstones.</p>
                  <button
                    onClick={() => setIsAddProjectModalOpen(true)}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#172033] px-4 py-2 text-xs font-bold text-white hover:bg-[#263553]"
                  >
                    <Plus size={14} className="text-[#F6D76A]" /> Add Your First Project
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-[#FBF8EF] p-5 shadow-2xs hover:border-[#172033] transition"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <h3 className="text-base font-bold text-[#172033]">{proj.title}</h3>
                          <button
                            onClick={() => deleteStudentProject(proj.id)}
                            className="text-gray-400 hover:text-red-500"
                            title="Delete Project"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{proj.date || "Academic Project"}</p>
                        <p className="mt-2 text-xs leading-relaxed text-gray-700">{proj.description}</p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {proj.techStack?.map((t) => (
                            <span
                              key={t}
                              className="rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-[#172033] border border-gray-200"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {proj.link && (
                        <div className="mt-4 pt-3 border-t border-gray-200/60">
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                          >
                            <Link2 size={12} /> View Code / Demo
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* INTERNSHIPS SECTION */}
            <div className="rounded-3xl border border-[#E8DAB2] bg-white p-7 shadow-sm space-y-6">
              <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-black text-[#172033] flex items-center gap-2">
                    <Briefcase size={20} className="text-[#9A6900]" />
                    Industry Internships & Work Experience
                  </h2>
                  <p className="text-xs text-gray-500">
                    Industry engagements, research internships, and applied training roles.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddInternshipModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-[#172033] px-4 py-2 text-xs font-bold text-white hover:bg-[#263553]"
                >
                  <Plus size={14} className="text-[#F6D76A]" /> Add Internship
                </button>
              </div>

              {internships.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-[#FBF8EF] p-8 text-center">
                  <Briefcase className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm font-bold text-gray-700">No Internships Added Yet</p>
                  <p className="text-xs text-gray-500 mt-1">Record your industry training, research engagements, or corporate internships.</p>
                  <button
                    onClick={() => setIsAddInternshipModalOpen(true)}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#172033] px-4 py-2 text-xs font-bold text-white hover:bg-[#263553]"
                  >
                    <Plus size={14} className="text-[#F6D76A]" /> Add Your First Internship
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {internships.map((intern) => (
                    <div
                      key={intern.id}
                      className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-[#FBF8EF] p-5 shadow-2xs hover:border-[#172033] transition"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-base font-bold text-[#172033]">{intern.role}</h3>
                            <p className="text-xs font-black text-[#9A6900]">{intern.company}</p>
                          </div>
                          <button
                            onClick={() => deleteStudentInternship(intern.id)}
                            className="text-gray-400 hover:text-red-500"
                            title="Delete Internship"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <p className="mt-1 text-[11px] text-gray-500">
                          {intern.duration} • {intern.location}
                        </p>
                        <p className="mt-2.5 text-xs leading-relaxed text-gray-700">{intern.description}</p>

                        {intern.skillsApplied?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {intern.skillsApplied.map((s) => (
                              <span
                                key={s}
                                className="rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-gray-700 border border-gray-200"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: CAREER INTERESTS & PREFERRED JOB ROLES
        ======================================================== */}
        {activeMainTab === "interests" && (
          <div className="space-y-8">
            <div className="rounded-3xl border border-[#E8DAB2] bg-white p-7 shadow-sm space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-black text-[#172033] flex items-center gap-2">
                  <Compass size={20} className="text-[#9A6900]" />
                  Career Interests & Target Industry Domains
                </h2>
                <p className="text-xs text-gray-500">
                  Select or add your career fields of interest (e.g. Artificial Intelligence, Data Science, Web Development).
                </p>
              </div>

              {/* Tag Input */}
              <div className="flex items-center gap-2 max-w-md">
                <input
                  type="text"
                  placeholder="e.g. Generative AI, Cloud Systems..."
                  value={newInterestInput}
                  onChange={(e) => setNewInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddInterest();
                    }
                  }}
                  className="rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2 text-xs outline-none focus:border-[#172033] w-full"
                />
                <button
                  onClick={() => handleAddInterest()}
                  className="rounded-xl bg-[#172033] px-4 py-2 text-xs font-bold text-white hover:bg-[#263553]"
                >
                  Add
                </button>
              </div>

              {/* Current Interests */}
              <div className="flex flex-wrap gap-2.5 min-h-[36px] items-center">
                {(!profile.careerInterests || profile.careerInterests.length === 0) ? (
                  <p className="text-xs text-gray-400 italic">No career interests added yet. Type an interest above or click the popular career domain buttons below.</p>
                ) : (
                  (profile.careerInterests || []).map((interest) => (
                    <span
                      key={interest}
                      className="flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-2 text-xs font-bold text-amber-900 border border-amber-300 shadow-2xs"
                    >
                      <span>{interest}</span>
                      <button
                        onClick={() => handleRemoveInterest(interest)}
                        className="rounded-full p-0.5 text-amber-600 hover:bg-amber-200"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Quick Presets */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Popular Career Domains:
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    "Artificial Intelligence",
                    "Machine Learning Systems",
                    "Full Stack Development",
                    "Cloud Architecture",
                    "Data Science & Analytics",
                    "Cyber Security",
                    "DevOps & SRE",
                    "Blockchain & Web3",
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleAddInterest(preset)}
                      className="rounded-xl border border-gray-200 bg-[#FBF8EF] px-3 py-1 text-xs font-semibold text-gray-700 hover:border-[#172033] hover:bg-white transition"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preferred Job Roles & Target Role */}
            <div className="rounded-3xl border border-[#E8DAB2] bg-white p-7 shadow-sm space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-black text-[#172033] flex items-center gap-2">
                  <Target size={20} className="text-[#9A6900]" />
                  Preferred Job Roles & Engine Alignment
                </h2>
                <p className="text-xs text-gray-500">
                  Select your primary target career role to calculate real-time skill gaps, roadmaps, and course recommendations.
                </p>
              </div>

              <div className="max-w-xl">
                <label className="text-xs font-bold text-gray-700">Primary Target Career Role:</label>
                <select
                  value={profile.targetRole}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    const updated = { ...profileForm, targetRole: newRole };
                    setProfileForm(updated);
                    updateStudentProfile(updated);
                    toast.success(`Target role set to ${DEFAULT_ROLES.find(r => r.id === newRole)?.title}!`);
                  }}
                  className="mt-1.5 w-full rounded-2xl border border-gray-300 bg-[#FBF8EF] px-4 py-3 text-sm font-bold text-[#172033] outline-none"
                >
                  {DEFAULT_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl bg-amber-50/60 p-4 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <p className="font-bold flex items-center gap-1.5 mb-1">
                  <Sparkles size={14} className="text-[#9A6900]" />
                  Automated Platform Alignment:
                </p>
                Changing your target role automatically recalculates skill gaps across the entire platform, updates the Radar Spider chart on your Dashboard, and tailors course & roadmap recommendations.
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================
          EDIT PROFILE MODAL (Full Edit Suite)
      ========================================================= */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingProfile(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-[#EAD8A6] bg-white p-6 sm:p-8 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#172033] flex items-center gap-2">
                    <Edit3 size={20} className="text-[#9A6900]" />
                    Edit Student Profile & Information
                  </h2>
                  <p className="text-xs text-gray-500">
                    Enter or update your personal, academic, languages, databases, and career interests.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearModalForm}
                    title="Empty all input fields so you can start fresh"
                    className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-2xs"
                  >
                    <Trash2 size={13} />
                    Clear Form (Empty)
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="rounded-xl p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Subtabs for Modal Navigation */}
              <div className="flex border-b border-gray-200 mt-4 overflow-x-auto gap-1">
                {[
                  { id: "personal", label: "1. Personal & Academic", icon: GraduationCap },
                  { id: "languages", label: "2. Languages & Databases", icon: Code2 },
                  { id: "career", label: "3. Target Role & Interests", icon: Target },
                  { id: "bio", label: "4. Bio & Social Links", icon: User },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = editModalTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setEditModalTab(tab.id)}
                      className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-xs font-bold transition ${
                        active
                          ? "border-[#172033] text-[#172033] bg-[#FBF8EF] rounded-t-xl"
                          : "border-transparent text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <Icon size={14} className={active ? "text-[#9A6900]" : "text-gray-400"} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleSaveProfile} className="mt-6 space-y-5">
                {/* SUBTAB 1: PERSONAL & ACADEMIC */}
                {editModalTab === "personal" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-bold text-gray-700">Student Full Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Rahul Sharma"
                          value={profileForm.name}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, name: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-medium outline-none focus:border-[#172033]"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700">Email / Gmail Address *</label>
                        <input
                          type="email"
                          placeholder="e.g. rahul@gmail.com"
                          value={profileForm.email}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, email: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-medium outline-none focus:border-[#172033]"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-bold text-gray-700">College / University</label>
                        <input
                          type="text"
                          placeholder="e.g. National Institute of Technology / IIT"
                          value={profileForm.institution}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, institution: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-medium outline-none focus:border-[#172033]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700">Branch (e.g. CSE, IT, ECE)</label>
                        <input
                          type="text"
                          placeholder="e.g. CSE"
                          value={profileForm.branch || ""}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, branch: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-medium outline-none focus:border-[#172033]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700">Current Year</label>
                        <input
                          type="text"
                          placeholder="e.g. 3rd year"
                          value={profileForm.year || ""}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, year: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-medium outline-none focus:border-[#172033]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700">Cumulative CGPA / Grade</label>
                        <input
                          type="text"
                          placeholder="e.g. 8.85 / 10.0"
                          value={profileForm.cgpa || ""}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, cgpa: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-medium outline-none focus:border-[#172033]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700">Student ID / Roll No</label>
                        <input
                          type="text"
                          placeholder="e.g. STU-2026-8942"
                          value={profileForm.studentId || ""}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, studentId: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-medium outline-none focus:border-[#172033]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700">Degree Qualification</label>
                      <input
                        type="text"
                        placeholder="e.g. B.Tech in Computer Science and Engineering"
                        value={profileForm.qualification || ""}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, qualification: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-medium outline-none focus:border-[#172033]"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-bold text-gray-700">Phone / Mobile</label>
                        <input
                          type="text"
                          placeholder="e.g. +91 98765 43210"
                          value={profileForm.phone || ""}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, phone: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-medium outline-none focus:border-[#172033]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700">Location / City</label>
                        <input
                          type="text"
                          placeholder="e.g. Bengaluru, India"
                          value={profileForm.location || ""}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, location: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-medium outline-none focus:border-[#172033]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBTAB 2: LANGUAGES & DATABASES */}
                {editModalTab === "languages" && (
                  <div className="space-y-6">
                    {/* Programming Languages */}
                    <div className="rounded-2xl border border-gray-200 bg-[#FBF8EF] p-5">
                      <label className="text-xs font-black text-[#172033] flex items-center gap-1.5">
                        <Code2 size={16} className="text-[#9A6900]" />
                        Programming Languages Known (e.g. Python, Java)
                      </label>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Type a programming language and press Add or Enter:
                      </p>

                      <div className="mt-2.5 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Python, Java, C++, SQL..."
                          value={modalNewLang}
                          onChange={(e) => setModalNewLang(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addFormLanguage();
                            }
                          }}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium outline-none focus:border-[#172033]"
                        />
                        <button
                          type="button"
                          onClick={() => addFormLanguage()}
                          className="shrink-0 rounded-xl bg-[#172033] px-4 py-2 text-xs font-bold text-white hover:bg-[#263553]"
                        >
                          + Add
                        </button>
                      </div>

                      {/* Language Chips */}
                      <div className="mt-3 flex flex-wrap gap-2 min-h-[34px]">
                        {(profileForm.programmingLanguages && profileForm.programmingLanguages.length > 0) ? (
                          profileForm.programmingLanguages.map((lang) => (
                            <span
                              key={lang}
                              className="flex items-center gap-1.5 rounded-xl bg-blue-100 px-3 py-1 text-xs font-bold text-blue-900 border border-blue-200"
                            >
                              <span>{lang}</span>
                              <button
                                type="button"
                                onClick={() => removeFormLanguage(lang)}
                                className="text-blue-500 hover:text-blue-900"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic">No programming languages added yet.</span>
                        )}
                      </div>

                      {/* Quick Suggestions */}
                      <div className="mt-3 pt-3 border-t border-gray-200/60 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Quick Add:</span>
                        {["Python", "Java", "C++", "SQL", "JavaScript", "TypeScript", "Go"].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => addFormLanguage(p)}
                            className="rounded-lg bg-white border border-gray-200 px-2 py-0.5 text-[11px] font-semibold text-gray-700 hover:border-[#172033]"
                          >
                            + {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Databases */}
                    <div className="rounded-2xl border border-gray-200 bg-[#FBF8EF] p-5">
                      <label className="text-xs font-black text-[#172033] flex items-center gap-1.5">
                        <Database size={16} className="text-[#9A6900]" />
                        Databases & Query Engines (e.g. SQL, MongoDB)
                      </label>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Type a database system and press Add or Enter:
                      </p>

                      <div className="mt-2.5 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="e.g. SQL, PostgreSQL, MongoDB, Redis..."
                          value={modalNewDb}
                          onChange={(e) => setModalNewDb(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addFormDatabase();
                            }
                          }}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium outline-none focus:border-[#172033]"
                        />
                        <button
                          type="button"
                          onClick={() => addFormDatabase()}
                          className="shrink-0 rounded-xl bg-[#172033] px-4 py-2 text-xs font-bold text-white hover:bg-[#263553]"
                        >
                          + Add
                        </button>
                      </div>

                      {/* Database Chips */}
                      <div className="mt-3 flex flex-wrap gap-2 min-h-[34px]">
                        {(profileForm.databases && profileForm.databases.length > 0) ? (
                          profileForm.databases.map((db) => (
                            <span
                              key={db}
                              className="flex items-center gap-1.5 rounded-xl bg-purple-100 px-3 py-1 text-xs font-bold text-purple-900 border border-purple-200"
                            >
                              <span>{db}</span>
                              <button
                                type="button"
                                onClick={() => removeFormDatabase(db)}
                                className="text-purple-500 hover:text-purple-900"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic">No databases added yet.</span>
                        )}
                      </div>

                      {/* Quick Suggestions */}
                      <div className="mt-3 pt-3 border-t border-gray-200/60 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Quick Add:</span>
                        {["SQL (PostgreSQL / MySQL)", "MongoDB", "Redis", "Firebase", "Oracle"].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => addFormDatabase(p)}
                            className="rounded-lg bg-white border border-gray-200 px-2 py-0.5 text-[11px] font-semibold text-gray-700 hover:border-[#172033]"
                          >
                            + {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBTAB 3: TARGET ROLE & CAREER INTERESTS */}
                {editModalTab === "career" && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-bold text-gray-700">Primary Target Career Role</label>
                      <select
                        value={profileForm.targetRole}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, targetRole: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-bold text-[#172033] outline-none"
                      >
                        {DEFAULT_ROLES.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.title} ({r.category}) • Avg {r.averageSalary}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-[11px] text-gray-500">
                        This role dictates your automated skill gap calculations and personalized roadmaps.
                      </p>
                    </div>

                    {/* Career Interests */}
                    <div className="rounded-2xl border border-gray-200 bg-[#FBF8EF] p-5">
                      <label className="text-xs font-black text-[#172033] flex items-center gap-1.5">
                        <Compass size={16} className="text-[#9A6900]" />
                        Career Interests & Domains (e.g. Artificial Intelligence)
                      </label>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Add career interests you want to specialize in:
                      </p>

                      <div className="mt-2.5 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Artificial Intelligence, Machine Learning, Web Dev..."
                          value={modalNewInterest}
                          onChange={(e) => setModalNewInterest(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addFormInterest();
                            }
                          }}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium outline-none focus:border-[#172033]"
                        />
                        <button
                          type="button"
                          onClick={() => addFormInterest()}
                          className="shrink-0 rounded-xl bg-[#172033] px-4 py-2 text-xs font-bold text-white hover:bg-[#263553]"
                        >
                          + Add
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 min-h-[34px]">
                        {(profileForm.careerInterests && profileForm.careerInterests.length > 0) ? (
                          profileForm.careerInterests.map((interest) => (
                            <span
                              key={interest}
                              className="flex items-center gap-1.5 rounded-xl bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-300"
                            >
                              <span>{interest}</span>
                              <button
                                type="button"
                                onClick={() => removeFormInterest(interest)}
                                className="text-amber-600 hover:text-amber-900"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic">No career interests added yet.</span>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200/60 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Quick Add:</span>
                        {["Artificial Intelligence", "Machine Learning Systems", "Full Stack Development", "Cloud Architecture", "Data Science"].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => addFormInterest(p)}
                            className="rounded-lg bg-white border border-gray-200 px-2 py-0.5 text-[11px] font-semibold text-gray-700 hover:border-[#172033]"
                          >
                            + {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preferred Job Roles */}
                    <div className="rounded-2xl border border-gray-200 bg-[#FBF8EF] p-5">
                      <label className="text-xs font-black text-[#172033] flex items-center gap-1.5">
                        <Briefcase size={16} className="text-[#9A6900]" />
                        Preferred Job Roles
                      </label>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Add specific job titles you are aiming for:
                      </p>

                      <div className="mt-2.5 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="e.g. AI Engineer, SDE, Data Scientist..."
                          value={modalNewRole}
                          onChange={(e) => setModalNewRole(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addFormPreferredRole();
                            }
                          }}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium outline-none focus:border-[#172033]"
                        />
                        <button
                          type="button"
                          onClick={() => addFormPreferredRole()}
                          className="shrink-0 rounded-xl bg-[#172033] px-4 py-2 text-xs font-bold text-white hover:bg-[#263553]"
                        >
                          + Add
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 min-h-[34px]">
                        {(profileForm.preferredJobRoles && profileForm.preferredJobRoles.length > 0) ? (
                          profileForm.preferredJobRoles.map((role) => (
                            <span
                              key={role}
                              className="flex items-center gap-1.5 rounded-xl bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-300"
                            >
                              <span>{role}</span>
                              <button
                                type="button"
                                onClick={() => removeFormPreferredRole(role)}
                                className="text-emerald-600 hover:text-emerald-900"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic">No preferred roles added yet.</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBTAB 4: BIO & SOCIAL LINKS */}
                {editModalTab === "bio" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700">Student Bio / Objective</label>
                      <textarea
                        rows={4}
                        placeholder="e.g. 3rd-year CSE student passionate about Artificial Intelligence, distributed backend systems, and neural networks. Actively preparing for AI Engineer roles..."
                        value={profileForm.bio || ""}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, bio: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] p-3 text-xs outline-none focus:border-[#172033]"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700">GitHub Profile URL</label>
                        <input
                          type="url"
                          placeholder="https://github.com/yourhandle"
                          value={profileForm.github || ""}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, github: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-medium outline-none focus:border-[#172033]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700">LinkedIn Profile URL</label>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/yourprofile"
                          value={profileForm.linkedin || ""}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, linkedin: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-medium outline-none focus:border-[#172033]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700">Portfolio Website URL</label>
                        <input
                          type="url"
                          placeholder="https://yourportfolio.dev"
                          value={profileForm.portfolio || ""}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, portfolio: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-medium outline-none focus:border-[#172033]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal Footer */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>Dynamic: Updates all dashboards & skill roadmaps immediately.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-[#172033] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#263553] transition"
                    >
                      <Save size={14} className="text-[#F6D76A]" />
                      Save Profile Changes
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================
          ADD SKILL MODAL
      ========================================================= */}
      <AnimatePresence>
        {isAddSkillModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddSkillModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl border border-[#EAD8A6] bg-white p-7 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-lg font-black text-[#172033]">Add Skill to Profile</h2>
                <button onClick={() => setIsAddSkillModalOpen(false)} className="rounded-xl p-1.5 text-gray-400">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddSkill} className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700">Skill Name</label>
                  <input
                    type="text"
                    placeholder="e.g. PyTorch, Docker, Communication"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-medium outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Category</label>
                  <div className="mt-1.5 grid grid-cols-2 gap-3">
                    {["Technical", "Professional"].map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setNewSkill({ ...newSkill, category: cat })}
                        className={`rounded-xl border py-2.5 text-xs font-bold transition ${
                          newSkill.category === cat
                            ? "border-[#172033] bg-[#172033] text-white"
                            : "border-gray-200 bg-[#FBF8EF] text-gray-600"
                        }`}
                      >
                        {cat} Skill
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>Proficiency Score</span>
                    <span>{newSkill.currentScore} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newSkill.currentScore}
                    onChange={(e) => setNewSkill({ ...newSkill, currentScore: Number(e.target.value) })}
                    className="mt-2 w-full accent-[#172033]"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddSkillModalOpen(false)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#F6D76A] px-5 py-2 text-xs font-black text-[#172033]"
                  >
                    Save Skill
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================
          ADD PROJECT MODAL
      ========================================================= */}
      <AnimatePresence>
        {isAddProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddProjectModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl border border-[#EAD8A6] bg-white p-7 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-lg font-black text-[#172033]">Add Project to Profile</h2>
                <button onClick={() => setIsAddProjectModalOpen(false)} className="rounded-xl p-1.5 text-gray-400">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddProject} className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700">Project Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Distributed Analytics Engine"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2 text-xs outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Technologies Used (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Python, PyTorch, FastAPI, React"
                    value={newProject.techStack}
                    onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    placeholder="What does the project do and what was your implementation role?"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] p-2.5 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Repository / Demo Link</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={newProject.link}
                    onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2 text-xs outline-none"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddProjectModalOpen(false)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#F6D76A] px-5 py-2 text-xs font-black text-[#172033]"
                  >
                    Save Project (+100 XP)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================
          ADD INTERNSHIP MODAL
      ========================================================= */}
      <AnimatePresence>
        {isAddInternshipModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddInternshipModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl border border-[#EAD8A6] bg-white p-7 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-lg font-black text-[#172033]">Add Internship Experience</h2>
                <button onClick={() => setIsAddInternshipModalOpen(false)} className="rounded-xl p-1.5 text-gray-400">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddInternship} className="mt-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Google, DataScale"
                      value={newInternship.company}
                      onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3 py-2 text-xs outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Role / Title</label>
                    <input
                      type="text"
                      placeholder="e.g. AI Engineering Intern"
                      value={newInternship.role}
                      onChange={(e) => setNewInternship({ ...newInternship, role: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3 py-2 text-xs outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. May 2026 - July 2026"
                      value={newInternship.duration}
                      onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3 py-2 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Bengaluru / Remote"
                      value={newInternship.location}
                      onChange={(e) => setNewInternship({ ...newInternship, location: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3 py-2 text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Key Contributions & Learnings</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your work and impact..."
                    value={newInternship.description}
                    onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] p-2.5 text-xs outline-none"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddInternshipModalOpen(false)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#F6D76A] px-5 py-2 text-xs font-black text-[#172033]"
                  >
                    Save Internship (+150 XP)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}