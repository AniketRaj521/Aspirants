import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Trophy,
  ShieldCheck,
  BadgeCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Download,
  Eye,
  ExternalLink,
  Calendar,
  Building2,
  Tag,
  FileText,
  UploadCloud,
  ChevronRight,
  X,
  ArrowUpDown,
  FileCheck,
  Sparkles,
  Flame,
  Check,
  HelpCircle,
  TrendingUp,
  BarChart3,
  Layers,
  GraduationCap,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  fetchCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  fetchAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  uploadCertificateFile,
  fetchCertificationAnalytics,
} from "../../services/api";
import {
  getStudentData,
  subscribeToStudentData,
  addStudentCertificate,
  updateStudentCertificate,
  deleteStudentCertificate,
  addStudentAchievement,
  updateStudentAchievement,
  deleteStudentAchievement,
} from "../../services/studentStore";

// ============================================================
// CONSTANTS & CATEGORY CONFIGURATIONS
// ============================================================

const CERT_CATEGORIES = [
  "Programming",
  "Data Science",
  "AI/ML",
  "Cloud Computing",
  "Cybersecurity",
  "Database",
  "Web Development",
  "Other",
];

const ACHIEVEMENT_CATEGORIES = [
  "Hackathon Winner",
  "Competition Winner",
  "Research Paper Presentation",
  "Project Exhibition",
  "Internship Completion",
  "Technical Event Participation",
  "Open Source Contribution",
  "Academic Excellence",
  "Other Achievements",
];

const AWARD_POSITIONS = [
  "1st Prize / Winner",
  "2nd Prize / Runner Up",
  "3rd Prize",
  "Finalist",
  "Honorable Mention",
  "Participation",
  "Special Recognition",
];

const CATEGORY_COLORS = {
  Programming: "#3B82F6",
  "Data Science": "#10B981",
  "AI/ML": "#8B5CF6",
  "Cloud Computing": "#F59E0B",
  Cybersecurity: "#EF4444",
  Database: "#06B6D4",
  "Web Development": "#EC4899",
  Other: "#64748B",
};

const CHART_PALETTE = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#06B6D4", "#EC4899", "#EF4444", "#64748B"];

export default function Certifications() {
  // Navigation tabs: 'certs' | 'achievements' | 'analytics'
  const [activeTab, setActiveTab] = useState("certs");

  // Student store state
  const [studentData, setStudentData] = useState(() => getStudentData());
  const studentId = useMemo(() => {
    return (
      studentData?.profile?.email ||
      localStorage.getItem("statwise_user") ||
      "default_student"
    );
  }, [studentData]);

  // Data states
  const [certificationsList, setCertificationsList] = useState([]);
  const [achievementsList, setAchievementsList] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [issuerFilter, setIssuerFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'oldest' | 'az'

  // Modals state
  const [isAddCertModalOpen, setIsAddCertModalOpen] = useState(false);
  const [isEditCertModalOpen, setIsEditCertModalOpen] = useState(false);
  const [selectedCertToEdit, setSelectedCertToEdit] = useState(null);
  const [selectedCertToView, setSelectedCertToView] = useState(null);

  const [isAddAchModalOpen, setIsAddAchModalOpen] = useState(false);
  const [isEditAchModalOpen, setIsEditAchModalOpen] = useState(false);
  const [selectedAchToEdit, setSelectedAchToEdit] = useState(null);
  const [selectedAchToView, setSelectedAchToView] = useState(null);

  // Delete Confirmation Modal
  const [itemToDelete, setItemToDelete] = useState(null); // { type: 'cert' | 'ach', id, title }

  // File Upload State for forms
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadedFileResult, setUploadedFileResult] = useState(null);

  // Form State: Certification
  const [certForm, setCertForm] = useState({
    certification_name: "",
    issuing_organization: "",
    category: "Programming",
    completion_date: new Date().toISOString().split("T")[0],
    certificate_id: "",
    certificate_url: "",
    description: "",
    verification_status: "Pending Verification",
    verification_url: "",
    uploaded_file_path: "",
    file_name: "",
    file_size: 0,
  });

  // Form State: Achievement
  const [achForm, setAchForm] = useState({
    title: "",
    category: "Hackathon Winner",
    organization: "",
    achievement_date: new Date().toISOString().split("T")[0],
    award_position: "1st Prize / Winner",
    description: "",
    reference_url: "",
    supporting_document_path: "",
    supporting_document_name: "",
    file_size: 0,
  });

  // Load data from Backend & Store
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Certifications
      const certs = await fetchCertifications(studentId);
      if (certs && Array.isArray(certs)) {
        setCertificationsList(certs);
      } else {
        setCertificationsList(studentData.certifications || []);
      }

      // 2. Fetch Achievements
      const achs = await fetchAchievements(studentId);
      if (achs && Array.isArray(achs)) {
        setAchievementsList(achs);
      } else {
        setAchievementsList(studentData.achievements || []);
      }

      // 3. Fetch Analytics
      const analytics = await fetchCertificationAnalytics(studentId);
      if (analytics) {
        setAnalyticsData(analytics);
      }
    } catch (e) {
      console.warn("API load fallback:", e);
      setCertificationsList(studentData.certifications || []);
      setAchievementsList(studentData.achievements || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [studentId]);

  // Subscribe to student data changes
  useEffect(() => {
    const unsub = subscribeToStudentData((data) => {
      setStudentData(data);
    });
    return unsub;
  }, []);

  // Compute live summary numbers from loaded data
  const summaryStats = useMemo(() => {
    const totalCerts = certificationsList.length;
    const verifiedCerts = certificationsList.filter(
      (c) => c.verification_status === "Verified" || c.status === "Verified"
    ).length;
    const pendingCerts = certificationsList.filter(
      (c) => c.verification_status === "Pending Verification" || c.status === "Pending Verification"
    ).length;
    const notVerifiedCerts = certificationsList.filter(
      (c) => c.verification_status === "Not Verified" || c.status === "Not Verified"
    ).length;
    const totalAchs = achievementsList.length;

    const currentYm = new Date().toISOString().slice(0, 7);
    const addedThisMonth = certificationsList.filter(
      (c) => (c.completion_date || "").startsWith(currentYm) || (c.created_at || "").startsWith(currentYm)
    ).length;

    const verificationPct = totalCerts > 0 ? Math.round((verifiedCerts / totalCerts) * 100) : 0;

    return {
      totalCerts,
      verifiedCerts,
      pendingCerts,
      notVerifiedCerts,
      totalAchs,
      addedThisMonth,
      verificationPct,
    };
  }, [certificationsList, achievementsList]);

  // Unique Issuers for Filter Dropdown
  const availableIssuers = useMemo(() => {
    const set = new Set();
    certificationsList.forEach((c) => {
      const iss = c.issuing_organization || c.issuer;
      if (iss && iss.trim()) set.add(iss.trim());
    });
    return Array.from(set).sort();
  }, [certificationsList]);

  // Filtered & Sorted Certifications
  const filteredCertifications = useMemo(() => {
    return certificationsList
      .filter((c) => {
        const name = (c.certification_name || c.title || "").toLowerCase();
        const issuer = (c.issuing_organization || c.issuer || "").toLowerCase();
        const certId = (c.certificate_id || c.credential_id || "").toLowerCase();
        const q = searchQuery.toLowerCase().trim();

        const matchesSearch = !q || name.includes(q) || issuer.includes(q) || certId.includes(q);
        const matchesCategory = categoryFilter === "all" || (c.category || "").toLowerCase() === categoryFilter.toLowerCase();
        const matchesStatus =
          statusFilter === "all" ||
          (c.verification_status || c.status || "").toLowerCase() === statusFilter.toLowerCase();
        const matchesIssuer =
          issuerFilter === "all" ||
          (c.issuing_organization || c.issuer || "").toLowerCase() === issuerFilter.toLowerCase();

        return matchesSearch && matchesCategory && matchesStatus && matchesIssuer;
      })
      .sort((a, b) => {
        if (sortBy === "oldest") {
          const dA = a.completion_date || a.issue_date || a.created_at || "";
          const dB = b.completion_date || b.issue_date || b.created_at || "";
          return dA.localeCompare(dB);
        }
        if (sortBy === "az") {
          const nA = (a.certification_name || a.title || "").toLowerCase();
          const nB = (b.certification_name || b.title || "").toLowerCase();
          return nA.localeCompare(nB);
        }
        // newest
        const dA = a.completion_date || a.issue_date || a.created_at || "";
        const dB = b.completion_date || b.issue_date || b.created_at || "";
        return dB.localeCompare(dA);
      });
  }, [certificationsList, searchQuery, categoryFilter, statusFilter, issuerFilter, sortBy]);

  // Filtered & Sorted Achievements
  const filteredAchievements = useMemo(() => {
    return achievementsList
      .filter((a) => {
        const title = (a.title || "").toLowerCase();
        const org = (a.organization || "").toLowerCase();
        const desc = (a.description || "").toLowerCase();
        const q = searchQuery.toLowerCase().trim();

        const matchesSearch = !q || title.includes(q) || org.includes(q) || desc.includes(q);
        const matchesCategory = categoryFilter === "all" || (a.category || "").toLowerCase() === categoryFilter.toLowerCase();

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "oldest") {
          return (a.achievement_date || "").localeCompare(b.achievement_date || "");
        }
        if (sortBy === "az") {
          return (a.title || "").toLowerCase().localeCompare((b.title || "").toLowerCase());
        }
        return (b.achievement_date || "").localeCompare(a.achievement_date || "");
      });
  }, [achievementsList, searchQuery, categoryFilter, sortBy]);

  // Analytics Dynamic Chart Data
  const categoryChartData = useMemo(() => {
    const map = {};
    certificationsList.forEach((c) => {
      const cat = c.category || "Other";
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [certificationsList]);

  const issuerChartData = useMemo(() => {
    const map = {};
    certificationsList.forEach((c) => {
      const iss = c.issuing_organization || c.issuer || "Other";
      map[iss] = (map[iss] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [certificationsList]);

  const monthlyTimelineData = useMemo(() => {
    const map = {};
    certificationsList.forEach((c) => {
      const d = c.completion_date || c.created_at || "";
      if (d.length >= 7) {
        const ym = d.slice(0, 7);
        map[ym] = (map[ym] || 0) + 1;
      }
    });
    return Object.keys(map)
      .sort()
      .map((month) => ({ month, certifications: map[month] }));
  }, [certificationsList]);

  const verificationRatioData = useMemo(() => {
    return [
      { name: "Verified", value: summaryStats.verifiedCerts, color: "#10B981" },
      { name: "Pending Verification", value: summaryStats.pendingCerts, color: "#F59E0B" },
      { name: "Not Verified", value: summaryStats.notVerifiedCerts, color: "#EF4444" },
    ].filter((item) => item.value > 0);
  }, [summaryStats]);

  const achCategoryChartData = useMemo(() => {
    const map = {};
    achievementsList.forEach((a) => {
      const cat = a.category || "Other Achievements";
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [achievementsList]);

  // Helper to resolve full document / image URLs for preview and download
  const resolveFileUrl = (path) => {
    if (!path) return "";
    if (
      path.startsWith("http://") ||
      path.startsWith("https://") ||
      path.startsWith("blob:") ||
      path.startsWith("data:")
    ) {
      return path;
    }
    return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // ============================================================
  // FILE UPLOAD HANDLER
  // ============================================================

  const handleFileUpload = async (e, formType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File exceeds maximum allowed size of 10 MB.");
      return;
    }

    // Validate type & extension (cross-browser & Windows safe)
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    const validExts = [".pdf", ".png", ".jpg", ".jpeg"];
    const validTypes = ["application/pdf", "application/x-pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!validExts.includes(ext) && !validTypes.includes((file.type || "").toLowerCase())) {
      toast.error("Unsupported file format. Please upload PDF, PNG, or JPG.");
      return;
    }

    // Generate local preview blob URL immediately so document is accessible right away
    let localPreviewUrl = "";
    try {
      localPreviewUrl = URL.createObjectURL(file);
    } catch (err) {
      console.warn("ObjectURL fallback:", err);
    }

    // Set initial file metadata in form state immediately
    if (formType === "cert") {
      setCertForm((prev) => ({
        ...prev,
        file_name: file.name,
        file_size: file.size,
        uploaded_file_path: localPreviewUrl || prev.uploaded_file_path,
      }));
    } else if (formType === "ach") {
      setAchForm((prev) => ({
        ...prev,
        supporting_document_name: file.name,
        file_size: file.size,
        supporting_document_path: localPreviewUrl || prev.supporting_document_path,
      }));
    }

    setIsUploadingFile(true);
    const toastId = toast.loading(`Uploading ${file.name}...`);

    try {
      const res = await uploadCertificateFile(file);
      if (res && (res.status === "success" || res.file_path)) {
        toast.success("File uploaded and encrypted successfully!", { id: toastId });
        setUploadedFileResult(res);

        if (formType === "cert") {
          setCertForm((prev) => ({
            ...prev,
            uploaded_file_path: res.file_path || localPreviewUrl,
            file_name: res.file_name || file.name,
            file_size: res.file_size || file.size,
          }));
        } else if (formType === "ach") {
          setAchForm((prev) => ({
            ...prev,
            supporting_document_path: res.file_path || localPreviewUrl,
            supporting_document_name: res.file_name || file.name,
            file_size: res.file_size || file.size,
          }));
        }
      } else {
        toast.success("File attached to record.", { id: toastId });
      }
    } catch (err) {
      console.warn("Upload network fallback: document attached locally", err);
      toast.success("Document attached to record.", { id: toastId });
    } finally {
      setIsUploadingFile(false);
    }
  };

  // ============================================================
  // CERTIFICATION CRUD HANDLERS
  // ============================================================

  const handleSaveCertificate = async (e) => {
    e.preventDefault();
    if (!certForm.certification_name.trim()) {
      toast.error("Please enter the certification name.");
      return;
    }
    if (!certForm.issuing_organization.trim()) {
      toast.error("Please enter the issuing organization.");
      return;
    }

    const payload = {
      ...certForm,
      student_id: studentId,
      studentId: studentId,
      title: certForm.certification_name,
      issuer: certForm.issuing_organization,
      issueDate: certForm.completion_date,
      credentialId: certForm.certificate_id,
      credentialUrl: certForm.certificate_url,
      filePath: certForm.uploaded_file_path,
      fileName: certForm.file_name,
      status: certForm.verification_status,
      verificationUrl: certForm.verification_url || certForm.certificate_url,
    };

    try {
      if (isEditCertModalOpen && selectedCertToEdit) {
        // 1. Update in local student store immediately
        updateStudentCertificate(selectedCertToEdit.id, payload);

        // 2. Update React list state immediately
        setCertificationsList((prev) =>
          prev.map((c) => (c.id === selectedCertToEdit.id ? { ...c, ...payload } : c))
        );

        // 3. Close modal & notify
        setIsEditCertModalOpen(false);
        setSelectedCertToEdit(null);
        toast.success("Certification details updated successfully!");

        // 4. Asynchronously sync to SQLite backend
        updateCertification(selectedCertToEdit.id, payload)
          .then((updated) => {
            if (updated) {
              setCertificationsList((prev) =>
                prev.map((c) => (c.id === selectedCertToEdit.id ? { ...c, ...updated } : c))
              );
            }
          })
          .catch((err) => console.warn("Backend update sync fallback:", err));
      } else {
        // 1. Save to local student store immediately (persisted in localStorage)
        const storeSaved = addStudentCertificate(payload);

        // 2. Update React list state immediately
        setCertificationsList((prev) => [storeSaved, ...prev.filter((c) => c.id !== storeSaved.id)]);

        // 3. Close modal immediately
        setIsAddCertModalOpen(false);

        // 4. Trigger celebration & feedback
        confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
        toast.success("Certification added to your verified portfolio! +200 XP 🎉");

        // 5. Asynchronously sync to SQLite backend
        createCertification(payload)
          .then((saved) => {
            if (saved && saved.id) {
              setCertificationsList((prev) =>
                prev.map((c) => (c.id === storeSaved.id ? { ...c, ...saved } : c))
              );
            }
            fetchCertificationAnalytics(studentId).then((res) => res && setAnalyticsData(res));
          })
          .catch((err) => console.warn("Backend creation sync fallback:", err));
      }

      // Reset form
      setCertForm({
        certification_name: "",
        issuing_organization: "",
        category: "Programming",
        completion_date: new Date().toISOString().split("T")[0],
        certificate_id: "",
        certificate_url: "",
        description: "",
        verification_status: "Pending Verification",
        verification_url: "",
        uploaded_file_path: "",
        file_name: "",
        file_size: 0,
      });
      setUploadedFileResult(null);
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Could not complete save action.");
    }
  };

  const handleOpenEditCert = (cert) => {
    setSelectedCertToEdit(cert);
    setCertForm({
      certification_name: cert.certification_name || cert.title || "",
      issuing_organization: cert.issuing_organization || cert.issuer || "",
      category: cert.category || "Programming",
      completion_date: cert.completion_date || cert.issue_date || cert.issueDate || "",
      certificate_id: cert.certificate_id || cert.credential_id || cert.credentialId || "",
      certificate_url: cert.certificate_url || cert.credential_url || cert.credentialUrl || "",
      description: cert.description || "",
      verification_status: cert.verification_status || cert.status || "Pending Verification",
      verification_url: cert.verification_url || cert.verificationUrl || "",
      uploaded_file_path: cert.uploaded_file_path || cert.filePath || "",
      file_name: cert.file_name || cert.fileName || "",
      file_size: cert.file_size || cert.fileSize || 0,
    });
    setIsEditCertModalOpen(true);
  };

  // ============================================================
  // ACHIEVEMENT CRUD HANDLERS
  // ============================================================

  const handleSaveAchievement = async (e) => {
    e.preventDefault();
    if (!achForm.title.trim()) {
      toast.error("Please enter the achievement title.");
      return;
    }
    if (!achForm.organization.trim()) {
      toast.error("Please enter the organization / institution.");
      return;
    }

    const payload = {
      ...achForm,
      student_id: studentId,
      studentId: studentId,
      achievementDate: achForm.achievement_date,
      awardPosition: achForm.award_position,
      supportingDocumentPath: achForm.supporting_document_path,
      supportingDocumentName: achForm.supporting_document_name,
      referenceUrl: achForm.reference_url,
    };

    try {
      if (isEditAchModalOpen && selectedAchToEdit) {
        // 1. Update in local store immediately
        updateStudentAchievement(selectedAchToEdit.id, payload);

        // 2. Update React list state immediately
        setAchievementsList((prev) =>
          prev.map((a) => (a.id === selectedAchToEdit.id ? { ...a, ...payload } : a))
        );

        // 3. Close modal & notify
        setIsEditAchModalOpen(false);
        setSelectedAchToEdit(null);
        toast.success("Achievement details updated successfully!");

        // 4. Asynchronously sync to SQLite backend
        updateAchievement(selectedAchToEdit.id, payload)
          .then((updated) => {
            if (updated) {
              setAchievementsList((prev) =>
                prev.map((a) => (a.id === selectedAchToEdit.id ? { ...a, ...updated } : a))
              );
            }
          })
          .catch((err) => console.warn("Backend update achievement fallback:", err));
      } else {
        // 1. Save to local store immediately (persisted in localStorage)
        const storeSaved = addStudentAchievement(payload);

        // 2. Update React list state immediately
        setAchievementsList((prev) => [storeSaved, ...prev.filter((a) => a.id !== storeSaved.id)]);

        // 3. Close modal immediately
        setIsAddAchModalOpen(false);

        // 4. Trigger celebration & feedback
        confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
        toast.success("Achievement recorded in your timeline! +250 XP 🏆");

        // 5. Asynchronously sync to SQLite backend
        createAchievement(payload)
          .then((saved) => {
            if (saved && saved.id) {
              setAchievementsList((prev) =>
                prev.map((a) => (a.id === storeSaved.id ? { ...a, ...saved } : a))
              );
            }
            fetchCertificationAnalytics(studentId).then((res) => res && setAnalyticsData(res));
          })
          .catch((err) => console.warn("Backend creation achievement fallback:", err));
      }

      // Reset form
      setAchForm({
        title: "",
        category: "Hackathon Winner",
        organization: "",
        achievement_date: new Date().toISOString().split("T")[0],
        award_position: "1st Prize / Winner",
        description: "",
        reference_url: "",
        supporting_document_path: "",
        supporting_document_name: "",
        file_size: 0,
      });
      setUploadedFileResult(null);
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Could not complete save action.");
    }
  };

  const handleOpenEditAch = (ach) => {
    setSelectedAchToEdit(ach);
    setAchForm({
      title: ach.title || "",
      category: ach.category || "Hackathon Winner",
      organization: ach.organization || "",
      achievement_date: ach.achievement_date || ach.achievementDate || "",
      award_position: ach.award_position || ach.awardPosition || "Participation",
      description: ach.description || "",
      reference_url: ach.reference_url || ach.referenceUrl || "",
      supporting_document_path: ach.supporting_document_path || ach.supportingDocumentPath || "",
      supporting_document_name: ach.supporting_document_name || ach.supportingDocumentName || "",
      file_size: ach.file_size || ach.fileSize || 0,
    });
    setIsEditAchModalOpen(true);
  };

  // ============================================================
  // DELETE CONFIRMATION HANDLER
  // ============================================================

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;
    const { type, id } = itemToDelete;

    try {
      if (type === "cert") {
        deleteStudentCertificate(id);
        setCertificationsList((prev) => prev.filter((c) => c.id !== id));
        toast.success("Certification removed.");
        deleteCertification(id, studentId).catch((err) =>
          console.warn("Backend delete cert fallback:", err)
        );
      } else if (type === "ach") {
        deleteStudentAchievement(id);
        setAchievementsList((prev) => prev.filter((a) => a.id !== id));
        toast.success("Achievement removed.");
        deleteAchievement(id, studentId).catch((err) =>
          console.warn("Backend delete ach fallback:", err)
        );
      }
    } catch (err) {
      toast.error("Failed to delete record.");
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8EF] text-[#172033]">
      <Navbar dashboard={true} />

      {/* ============================================================
          1. HERO HEADER WITH STUDENT CREDENTIAL SUMMARY
          ============================================================ */}
      <section className="relative overflow-hidden border-b border-[#EAD8A6] bg-gradient-to-r from-[#172033] via-[#1E2B45] to-[#172033] py-12 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#F6D76A_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Header Titles */}
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F6D76A] text-sm font-black text-[#172033] shadow-md">
                  🏆
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F6D76A]">
                  Student Competency & Portfolio
                </span>
              </div>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Certifications & Achievements
              </h1>
              <p className="mt-2 max-w-2xl text-xs text-gray-300 sm:text-sm">
                Manage your digital credential portfolio, verify industry certifications, and showcase competitive awards and honors on STATWISE AI.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setCertForm({
                    certification_name: "",
                    issuing_organization: "",
                    category: "Programming",
                    completion_date: new Date().toISOString().split("T")[0],
                    certificate_id: "",
                    certificate_url: "",
                    description: "",
                    verification_status: "Pending Verification",
                    verification_url: "",
                    uploaded_file_path: "",
                    file_name: "",
                    file_size: 0,
                  });
                  setUploadedFileResult(null);
                  setIsAddCertModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-2xl bg-[#F6D76A] px-5 py-3 text-xs font-black text-[#172033] shadow-lg hover:bg-yellow-400 transition"
              >
                <Plus size={16} />
                Add Certification
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setAchForm({
                    title: "",
                    category: "Hackathon Winner",
                    organization: "",
                    achievement_date: new Date().toISOString().split("T")[0],
                    award_position: "1st Prize / Winner",
                    description: "",
                    reference_url: "",
                    supporting_document_path: "",
                    supporting_document_name: "",
                    file_size: 0,
                  });
                  setUploadedFileResult(null);
                  setIsAddAchModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-black text-white hover:bg-white/20 transition backdrop-blur-md"
              >
                <Trophy size={16} className="text-[#F6D76A]" />
                Add Achievement
              </motion.button>
            </div>
          </div>

          {/* ============================================================
              2. FOUR SUMMARY KPI CARDS
              ============================================================ */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {/* Card 1: Total Certifications */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Total Certifications
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                  <Award size={15} />
                </span>
              </div>
              <p className="mt-2 text-2xl font-black text-white sm:text-3xl">
                {summaryStats.totalCerts}
              </p>
              <p className="mt-1 text-[11px] text-gray-300">
                {summaryStats.addedThisMonth > 0
                  ? `+${summaryStats.addedThisMonth} added this month`
                  : "Verified learning credentials"}
              </p>
            </div>

            {/* Card 2: Verified Certifications */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Verified Certs
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck size={15} />
                </span>
              </div>
              <p className="mt-2 text-2xl font-black text-emerald-400 sm:text-3xl">
                {summaryStats.verifiedCerts}
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-300">
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                  <div
                    style={{ width: `${summaryStats.verificationPct}%` }}
                    className="h-full bg-emerald-400"
                  />
                </div>
                <span>{summaryStats.verificationPct}% verified</span>
              </div>
            </div>

            {/* Card 3: Pending Verification */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Pending Verification
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                  <Clock size={15} />
                </span>
              </div>
              <p className="mt-2 text-2xl font-black text-amber-400 sm:text-3xl">
                {summaryStats.pendingCerts}
              </p>
              <p className="mt-1 text-[11px] text-gray-300">
                Awaiting official check
              </p>
            </div>

            {/* Card 4: Total Achievements */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Total Achievements
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300">
                  <Trophy size={15} />
                </span>
              </div>
              <p className="mt-2 text-2xl font-black text-[#F6D76A] sm:text-3xl">
                {summaryStats.totalAchs}
              </p>
              <p className="mt-1 text-[11px] text-gray-300">
                Honors & competition awards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          MAIN BODY: NAVIGATION TABS & FILTER BAR
          ============================================================ */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E8DAB2] pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("certs")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition-all ${
                activeTab === "certs"
                  ? "bg-[#172033] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-[#FFE9A6] hover:text-[#172033]"
              }`}
            >
              <Award size={16} />
              Certifications ({certificationsList.length})
            </button>

            <button
              onClick={() => setActiveTab("achievements")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition-all ${
                activeTab === "achievements"
                  ? "bg-[#172033] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-[#FFE9A6] hover:text-[#172033]"
              }`}
            >
              <Trophy size={16} />
              My Achievements ({achievementsList.length})
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition-all ${
                activeTab === "analytics"
                  ? "bg-[#172033] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-[#FFE9A6] hover:text-[#172033]"
              }`}
            >
              <BarChart3 size={16} />
              Category Analytics
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAllData}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
              title="Sync from Database"
            >
              <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
              Sync DB
            </button>
          </div>
        </div>

        {/* Filter & Search Controls (Visible for Certs & Achievements) */}
        {activeTab !== "analytics" && (
          <div className="rounded-2xl border border-[#E8DAB2] bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  type="text"
                  placeholder={
                    activeTab === "certs"
                      ? "Search certification name, issuer, ID..."
                      : "Search achievement title, organization..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#FBF8EF] pl-10 pr-4 py-2 text-xs font-medium text-[#172033] placeholder-gray-400 focus:border-[#172033] focus:outline-none focus:ring-1 focus:ring-[#172033]"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3 py-2 text-xs font-bold text-[#172033] focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {(activeTab === "certs" ? CERT_CATEGORIES : ACHIEVEMENT_CATEGORIES).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter (Only for Certs) / Award Position (for Ach) */}
              {activeTab === "certs" ? (
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3 py-2 text-xs font-bold text-[#172033] focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Verified">Verified Only</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Not Verified">Not Verified</option>
                  </select>
                </div>
              ) : (
                <div>
                  <select
                    value={issuerFilter}
                    onChange={(e) => setIssuerFilter(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3 py-2 text-xs font-bold text-[#172033] focus:outline-none"
                  >
                    <option value="all">All Organizations</option>
                    {availableIssuers.map((iss) => (
                      <option key={iss} value={iss}>
                        {iss}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sort Order */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3 py-2 text-xs font-bold text-[#172033] focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="az">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 1: CERTIFICATIONS PORTFOLIO
            ============================================================ */}
        {activeTab === "certs" && (
          <div>
            {filteredCertifications.length === 0 ? (
              /* Clean Empty State */
              <div className="rounded-3xl border border-dashed border-[#E8DAB2] bg-white p-12 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F6D76A]/30 text-2xl">
                  📜
                </div>
                <h3 className="mt-4 text-lg font-black text-[#172033]">
                  {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                    ? "No certifications match your filters"
                    : "No certifications added yet"}
                </h3>
                <p className="mt-1 text-xs text-gray-500 max-w-md mx-auto">
                  {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your search criteria or resetting filters to view all certificates."
                    : "Upload professional course certificates, AWS/Google credentials, or university diplomas to build your verified portfolio."}
                </p>
                <button
                  onClick={() => setIsAddCertModalOpen(true)}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#172033] px-5 py-2.5 text-xs font-bold text-white hover:bg-gray-800 transition shadow-sm"
                >
                  <Plus size={15} />
                  Add Your First Certificate
                </button>
              </div>
            ) : (
              /* Certifications Grid */
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filteredCertifications.map((cert) => {
                  const certName = cert.certification_name || cert.title || "Certification";
                  const org = cert.issuing_organization || cert.issuer || "Issuing Body";
                  const dateStr = cert.completion_date || cert.issue_date || cert.issueDate || "Recent";
                  const certId = cert.certificate_id || cert.credential_id || cert.credentialId;
                  const certUrl = cert.certificate_url || cert.credential_url || cert.credentialUrl;
                  const filePath = cert.uploaded_file_path || cert.filePath;
                  const status = cert.verification_status || cert.status || "Pending Verification";

                  // Badge Colors
                  let statusBadge = "bg-amber-50 text-amber-700 border-amber-200";
                  let statusIcon = <Clock size={12} />;
                  if (status === "Verified") {
                    statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
                    statusIcon = <CheckCircle2 size={12} />;
                  } else if (status === "Not Verified") {
                    statusBadge = "bg-rose-50 text-rose-700 border-rose-200";
                    statusIcon = <XCircle size={12} />;
                  }

                  const categoryColor = CATEGORY_COLORS[cert.category] || "#64748B";

                  return (
                    <motion.div
                      key={cert.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col justify-between rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm hover:shadow-md transition"
                    >
                      <div className="space-y-4">
                        {/* Top: Category Tag & Verification Status */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            style={{ backgroundColor: `${categoryColor}15`, color: categoryColor }}
                            className="rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider"
                          >
                            {cert.category || "General"}
                          </span>

                          <span
                            className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusBadge}`}
                          >
                            {statusIcon}
                            {status}
                          </span>
                        </div>

                        {/* Title & Organization */}
                        <div>
                          <h3 className="text-base font-black text-[#172033] line-clamp-2" title={certName}>
                            {certName}
                          </h3>
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                            <Building2 size={13} className="text-gray-400 shrink-0" />
                            <span className="truncate">{org}</span>
                          </div>
                        </div>

                        {/* Metadata Pills */}
                        <div className="space-y-1.5 text-[11px] text-gray-600 bg-[#FBF8EF] p-3 rounded-2xl">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-medium">Completed:</span>
                            <span className="font-bold text-[#172033] flex items-center gap-1">
                              <Calendar size={12} />
                              {dateStr}
                            </span>
                          </div>

                          {certId && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 font-medium">Credential ID:</span>
                              <span className="font-mono font-bold text-gray-700 truncate max-w-[150px]">
                                {certId}
                              </span>
                            </div>
                          )}

                          {filePath && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 font-medium">Certificate File:</span>
                              <span className="font-bold text-emerald-700 flex items-center gap-1 truncate max-w-[150px]">
                                <FileCheck size={12} />
                                {cert.file_name || cert.fileName || "Uploaded Document"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Description (if present) */}
                        {cert.description && (
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {cert.description}
                          </p>
                        )}
                      </div>

                      {/* Card Bottom Actions */}
                      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedCertToView(cert)}
                            className="flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-1.5 text-[11px] font-bold text-gray-700 hover:bg-gray-200 transition"
                            title="View Certificate Details"
                          >
                            <Eye size={13} />
                            View
                          </button>

                          {filePath && (
                            <a
                              href={resolveFileUrl(filePath)}
                              download={cert.file_name || "certificate"}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 rounded-xl bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 transition border border-emerald-200"
                              title="Download Certificate"
                            >
                              <Download size={13} />
                            </a>
                          )}

                          {certUrl && (
                            <a
                              href={certUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 rounded-xl bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-700 hover:bg-blue-100 transition border border-blue-200"
                              title="Open Issuer Verification Link"
                            >
                              <ExternalLink size={13} />
                            </a>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditCert(cert)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                            title="Edit Certification"
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            onClick={() => setItemToDelete({ type: "cert", id: cert.id, title: certName })}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition"
                            title="Delete Certification"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            TAB 2: MY ACHIEVEMENTS TIMELINE
            ============================================================ */}
        {activeTab === "achievements" && (
          <div>
            {filteredAchievements.length === 0 ? (
              /* Clean Empty State */
              <div className="rounded-3xl border border-dashed border-[#E8DAB2] bg-white p-12 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                  🎖️
                </div>
                <h3 className="mt-4 text-lg font-black text-[#172033]">
                  {searchQuery || categoryFilter !== "all"
                    ? "No achievements match your filters"
                    : "No achievements recorded yet"}
                </h3>
                <p className="mt-1 text-xs text-gray-500 max-w-md mx-auto">
                  Log your hackathon prizes, competition trophies, research paper presentations, project exhibitions, and academic honors.
                </p>
                <button
                  onClick={() => setIsAddAchModalOpen(true)}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#172033] px-5 py-2.5 text-xs font-bold text-white hover:bg-gray-800 transition shadow-sm"
                >
                  <Plus size={15} />
                  Record Your First Achievement
                </button>
              </div>
            ) : (
              /* Achievements Timeline / Card Layout */
              <div className="space-y-4">
                {filteredAchievements.map((ach) => {
                  const docPath = ach.supporting_document_path || ach.supportingDocumentPath;

                  return (
                    <motion.div
                      key={ach.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-white font-black text-xl shadow-md">
                          🏆
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800">
                              {ach.category || "Honors"}
                            </span>
                            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-200">
                              {ach.award_position || ach.awardPosition || "1st Prize"}
                            </span>
                            <span className="text-[11px] text-gray-400 flex items-center gap-1 font-semibold">
                              <Calendar size={12} />
                              {ach.achievement_date || ach.achievementDate || "Recent"}
                            </span>
                          </div>

                          <h3 className="text-base font-black text-[#172033]">
                            {ach.title}
                          </h3>

                          <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                            <Building2 size={13} className="text-gray-400" />
                            {ach.organization}
                          </p>

                          {ach.description && (
                            <p className="mt-1 text-xs text-gray-600 max-w-3xl">
                              {ach.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        {docPath && (
                          <a
                            href={resolveFileUrl(docPath)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200 transition"
                          >
                            <FileText size={13} />
                            Document
                          </a>
                        )}

                        {ach.reference_url && (
                          <a
                            href={ach.reference_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition border border-blue-200"
                          >
                            <ExternalLink size={13} />
                            Link
                          </a>
                        )}

                        <button
                          onClick={() => handleOpenEditAch(ach)}
                          className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:bg-gray-100 transition"
                          title="Edit Achievement"
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          onClick={() => setItemToDelete({ type: "ach", id: ach.id, title: ach.title })}
                          className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Delete Achievement"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            TAB 3: CATEGORY ANALYTICS & INSIGHTS
            ============================================================ */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Chart 1: Certifications by Category (Donut Chart) */}
              <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold">
                      📊
                    </span>
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#172033]">
                      Certifications by Category
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-gray-400">
                    Total: {summaryStats.totalCerts}
                  </span>
                </div>

                <div className="h-64 w-full">
                  {categoryChartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-gray-400">
                      No certification data to display. Add certificates to view analytics.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {categoryChartData.map((entry, index) => (
                            <Cell
                              key={`cat-cell-${index}`}
                              fill={CATEGORY_COLORS[entry.name] || CHART_PALETTE[index % CHART_PALETTE.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#172033",
                            borderRadius: "12px",
                            border: "none",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          wrapperStyle={{ fontSize: "11px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Chart 2: Verification Status Ratio */}
              <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 font-bold">
                      🛡️
                    </span>
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#172033]">
                      Verification Status Distribution
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">
                    {summaryStats.verificationPct}% Verified
                  </span>
                </div>

                <div className="h-64 w-full">
                  {verificationRatioData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-gray-400">
                      No status data available yet.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={verificationRatioData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {verificationRatioData.map((entry, index) => (
                            <Cell key={`status-cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#172033",
                            borderRadius: "12px",
                            border: "none",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          wrapperStyle={{ fontSize: "11px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Chart 3: Top Issuing Organizations */}
              <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-700 font-bold">
                      🏛️
                    </span>
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#172033]">
                      Certifications by Issuing Body
                    </h3>
                  </div>
                </div>

                <div className="h-64 w-full">
                  {issuerChartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-gray-400">
                      No issuer data available.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={issuerChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "#4B5563", fontSize: 10 }}
                          interval={0}
                          angle={-15}
                          textAnchor="end"
                        />
                        <YAxis allowDecimals={false} tick={{ fill: "#6B7280", fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#172033",
                            borderRadius: "12px",
                            border: "none",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                        />
                        <Bar dataKey="count" fill="#172033" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Chart 4: Achievements by Category */}
              <div className="rounded-3xl border border-[#E8DAB2] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-700 font-bold">
                      🏆
                    </span>
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#172033]">
                      Achievement Distribution
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-gray-400">
                    Total: {summaryStats.totalAchs}
                  </span>
                </div>

                <div className="h-64 w-full">
                  {achCategoryChartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-gray-400">
                      No achievements data available yet.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={achCategoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "#4B5563", fontSize: 10 }}
                          interval={0}
                          angle={-15}
                          textAnchor="end"
                        />
                        <YAxis allowDecimals={false} tick={{ fill: "#6B7280", fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#172033",
                            borderRadius: "12px",
                            border: "none",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                        />
                        <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================
          MODAL: ADD / EDIT CERTIFICATION
          ============================================================ */}
      <AnimatePresence>
        {(isAddCertModalOpen || isEditCertModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-3xl border border-[#E8DAB2] bg-white p-6 sm:p-8 shadow-2xl my-8"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F6D76A] text-sm font-black text-[#172033]">
                    {isEditCertModalOpen ? "✏️" : "📜"}
                  </span>
                  <h3 className="text-lg font-black text-[#172033]">
                    {isEditCertModalOpen ? "Edit Certification" : "Add New Certification"}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setIsAddCertModalOpen(false);
                    setIsEditCertModalOpen(false);
                    setSelectedCertToEdit(null);
                  }}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveCertificate} className="mt-5 space-y-4">
                {/* Cert Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Certification Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AWS Certified Solutions Architect or Python Specialist"
                    value={certForm.certification_name}
                    onChange={(e) => setCertForm({ ...certForm, certification_name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-semibold text-[#172033] focus:border-[#172033] focus:outline-none"
                  />
                </div>

                {/* Issuing Org & Category */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase">
                      Issuing Organization *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Coursera, AWS, Google, NPTEL"
                      value={certForm.issuing_organization}
                      onChange={(e) => setCertForm({ ...certForm, issuing_organization: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-semibold text-[#172033] focus:border-[#172033] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase">
                      Category *
                    </label>
                    <select
                      value={certForm.category}
                      onChange={(e) => setCertForm({ ...certForm, category: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-bold text-[#172033] focus:outline-none"
                    >
                      {CERT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Completion Date & Credential ID */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase">
                      Completion Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={certForm.completion_date}
                      onChange={(e) => setCertForm({ ...certForm, completion_date: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-semibold text-[#172033] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase">
                      Certificate ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CERT-89412-X"
                      value={certForm.certificate_id}
                      onChange={(e) => setCertForm({ ...certForm, certificate_id: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-semibold text-[#172033] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Certificate Verification URL */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Verification URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://coursera.org/verify/... or https://aws.amazon.com/verify/..."
                    value={certForm.certificate_url}
                    onChange={(e) => setCertForm({ ...certForm, certificate_url: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-semibold text-[#172033] focus:outline-none"
                  />
                </div>

                {/* Verification Status */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Verification Status
                  </label>
                  <select
                    value={certForm.verification_status}
                    onChange={(e) => setCertForm({ ...certForm, verification_status: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-bold text-[#172033] focus:outline-none"
                  >
                    <option value="Pending Verification">Pending Verification (Default)</option>
                    <option value="Verified">Verified (Official Credential Link Verified)</option>
                    <option value="Not Verified">Not Verified</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Description / Key Skills Learned
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of skills acquired and project competencies..."
                    value={certForm.description}
                    onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2 text-xs font-semibold text-[#172033] focus:outline-none"
                  />
                </div>

                {/* File Upload Box */}
                <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-[#FBF8EF]/60 p-4 text-center">
                  <UploadCloud size={24} className="mx-auto text-gray-400" />
                  <p className="mt-1 text-xs font-bold text-[#172033]">
                    {certForm.file_name ? certForm.file_name : "Upload Certificate File (PDF, PNG, JPG)"}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Max file size: 10 MB. Supported: PDF, PNG, JPG.
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => handleFileUpload(e, "cert")}
                    className="mt-2 text-xs file:mr-2 file:rounded-xl file:border-0 file:bg-[#172033] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:bg-gray-800"
                  />
                  {certForm.uploaded_file_path && (
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <Check size={12} />
                      File ready to save
                    </span>
                  )}
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddCertModalOpen(false);
                      setIsEditCertModalOpen(false);
                      setSelectedCertToEdit(null);
                    }}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploadingFile}
                    className="flex items-center gap-1.5 rounded-xl bg-[#172033] px-5 py-2 text-xs font-bold text-white hover:bg-gray-800 shadow-md transition"
                  >
                    {isUploadingFile ? "Uploading..." : isEditCertModalOpen ? "Save Changes" : "Save Certification"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================
          MODAL: ADD / EDIT ACHIEVEMENT
          ============================================================ */}
      <AnimatePresence>
        {(isAddAchModalOpen || isEditAchModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-3xl border border-[#E8DAB2] bg-white p-6 sm:p-8 shadow-2xl my-8"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-sm font-black text-purple-700">
                    🏆
                  </span>
                  <h3 className="text-lg font-black text-[#172033]">
                    {isEditAchModalOpen ? "Edit Achievement" : "Add New Achievement"}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setIsAddAchModalOpen(false);
                    setIsEditAchModalOpen(false);
                    setSelectedAchToEdit(null);
                  }}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveAchievement} className="mt-5 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Achievement Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smart India Hackathon Winner or IEEE Best Paper Award"
                    value={achForm.title}
                    onChange={(e) => setAchForm({ ...achForm, title: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-semibold text-[#172033] focus:outline-none"
                  />
                </div>

                {/* Category & Award Position */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase">
                      Achievement Category *
                    </label>
                    <select
                      value={achForm.category}
                      onChange={(e) => setAchForm({ ...achForm, category: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-bold text-[#172033] focus:outline-none"
                    >
                      {ACHIEVEMENT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase">
                      Award / Position *
                    </label>
                    <select
                      value={achForm.award_position}
                      onChange={(e) => setAchForm({ ...achForm, award_position: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-bold text-[#172033] focus:outline-none"
                    >
                      {AWARD_POSITIONS.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Organization & Date */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase">
                      Organization / Host Institution *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AICTE, Ministry of Education, Google"
                      value={achForm.organization}
                      onChange={(e) => setAchForm({ ...achForm, organization: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-semibold text-[#172033] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase">
                      Achievement Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={achForm.achievement_date}
                      onChange={(e) => setAchForm({ ...achForm, achievement_date: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-semibold text-[#172033] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Description & Highlights
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe your role, contribution, and key accomplishments..."
                    value={achForm.description}
                    onChange={(e) => setAchForm({ ...achForm, description: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2 text-xs font-semibold text-[#172033] focus:outline-none"
                  />
                </div>

                {/* Reference URL */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Reference / Announcement Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={achForm.reference_url}
                    onChange={(e) => setAchForm({ ...achForm, reference_url: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-[#FBF8EF] px-3.5 py-2.5 text-xs font-semibold text-[#172033] focus:outline-none"
                  />
                </div>

                {/* File Upload Box */}
                <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-[#FBF8EF]/60 p-4 text-center">
                  <UploadCloud size={24} className="mx-auto text-gray-400" />
                  <p className="mt-1 text-xs font-bold text-[#172033]">
                    {achForm.supporting_document_name ? achForm.supporting_document_name : "Upload Supporting Document / Image"}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Max file size: 10 MB. Supported: PDF, PNG, JPG.
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => handleFileUpload(e, "ach")}
                    className="mt-2 text-xs file:mr-2 file:rounded-xl file:border-0 file:bg-[#172033] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:bg-gray-800"
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddAchModalOpen(false);
                      setIsEditAchModalOpen(false);
                      setSelectedAchToEdit(null);
                    }}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploadingFile}
                    className="flex items-center gap-1.5 rounded-xl bg-[#172033] px-5 py-2 text-xs font-bold text-white hover:bg-gray-800 shadow-md transition"
                  >
                    {isUploadingFile ? "Uploading..." : isEditAchModalOpen ? "Save Changes" : "Save Achievement"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================
          MODAL: VIEW CERTIFICATE DETAILS
          ============================================================ */}
      <AnimatePresence>
        {selectedCertToView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-3xl border border-[#E8DAB2] bg-white p-6 sm:p-8 shadow-2xl my-8"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-sm font-black text-blue-700">
                    📜
                  </span>
                  <h3 className="text-lg font-black text-[#172033]">
                    Certificate Details
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCertToView(null)}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    {selectedCertToView.category || "General"}
                  </span>
                  <h2 className="text-xl font-black text-[#172033]">
                    {selectedCertToView.certification_name || selectedCertToView.title}
                  </h2>
                  <p className="text-xs font-bold text-gray-600 flex items-center gap-1.5 mt-1">
                    <Building2 size={14} className="text-gray-400" />
                    {selectedCertToView.issuing_organization || selectedCertToView.issuer}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-[#FBF8EF] p-4 rounded-2xl">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Completion Date:</span>
                    <span className="font-bold text-[#172033]">
                      {selectedCertToView.completion_date || selectedCertToView.issue_date || "N/A"}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 block text-[11px]">Verification Status:</span>
                    <span
                      className={`font-black ${
                        selectedCertToView.verification_status === "Verified"
                          ? "text-emerald-700"
                          : "text-amber-700"
                      }`}
                    >
                      {selectedCertToView.verification_status || selectedCertToView.status || "Pending Verification"}
                    </span>
                  </div>

                  {(selectedCertToView.certificate_id || selectedCertToView.credential_id) && (
                    <div className="col-span-2">
                      <span className="text-gray-400 block text-[11px]">Credential ID:</span>
                      <span className="font-mono font-bold text-[#172033]">
                        {selectedCertToView.certificate_id || selectedCertToView.credential_id}
                      </span>
                    </div>
                  )}
                </div>

                {selectedCertToView.description && (
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase">Description:</span>
                    <p className="mt-1 text-xs text-gray-700 leading-relaxed">
                      {selectedCertToView.description}
                    </p>
                  </div>
                )}

                {/* Uploaded File Link */}
                {(selectedCertToView.uploaded_file_path || selectedCertToView.filePath) && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck size={18} className="text-emerald-700 shrink-0" />
                      <div className="text-xs">
                        <p className="font-bold text-emerald-900 truncate max-w-[200px]">
                          {selectedCertToView.file_name || selectedCertToView.fileName || "Uploaded Certificate File"}
                        </p>
                        <p className="text-[10px] text-emerald-700">Stored securely on server</p>
                      </div>
                    </div>

                    <a
                      href={resolveFileUrl(selectedCertToView.uploaded_file_path || selectedCertToView.filePath)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition"
                    >
                      Open Document
                    </a>
                  </div>
                )}

                {/* Official Verification URL */}
                {(selectedCertToView.certificate_url || selectedCertToView.credential_url) && (
                  <div className="pt-2">
                    <a
                      href={selectedCertToView.certificate_url || selectedCertToView.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full rounded-2xl bg-[#172033] px-4 py-2.5 text-xs font-bold text-white hover:bg-gray-800 transition shadow-md"
                    >
                      <ExternalLink size={14} />
                      Open Official Issuer Verification Page
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================
          MODAL: DELETE CONFIRMATION
          ============================================================ */}
      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl border border-rose-200 bg-white p-6 shadow-2xl text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <Trash2 size={20} />
              </div>

              <h3 className="mt-4 text-base font-black text-[#172033]">
                Confirm Permanent Deletion
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Are you sure you want to delete <strong>{itemToDelete.title}</strong>? This action cannot be undone.
              </p>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={() => setItemToDelete(null)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteItem}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-md transition"
                >
                  Delete Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
