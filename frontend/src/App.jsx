import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  FolderTree,
  Tags,
  Users,
  Package,
  Calendar,
  Wrench,
  ShieldAlert,
  BarChart3,
  Bell,
  LogOut,
  Search,
  Plus,
  Check,
  X,
  Shield,
  ArrowRightLeft,
  RefreshCw,
  Eye,
  Download
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

const BrandLogo = ({ size = 28 }) => {
  const pad = Math.round(size * 0.15);
  const svgSize = size - pad * 2;
  return (
    <div
      style={{
        width: size,
        height: size,
        background: "rgba(217, 119, 6, 0.1)",
        border: "1.5px solid #d97706",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#d97706"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Top isometric platform representing an asset */}
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        {/* Layered database/resource tracks representing tracking and organization */}
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
        {/* Central index line representing alignment and asset flow */}
        <path d="M12 22V12" />
      </svg>
    </div>
  );
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: "10px" }}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: "10px" }}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const CustomSelect = ({ value, onChange, options, placeholder = "Select option", style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="custom-select-container" style={{ position: "relative", width: "100%", ...style }}>
      <div
        className="form-control"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "8px",
          padding: "10px 14px",
          color: selectedOption ? "#c3c2b7" : "#8e8d85",
          userSelect: "none"
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <span style={{ fontSize: "10px", opacity: 0.6, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </div>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            backgroundColor: "#2c2c2a",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            maxHeight: "220px",
            overflowY: "auto"
          }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                backgroundColor: value === opt.value ? "rgba(217, 119, 6, 0.15)" : "transparent",
                color: value === opt.value ? "#d97706" : "#c3c2b7",
                fontSize: "14px",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => {
                if (value !== opt.value) e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
              }}
              onMouseLeave={(e) => {
                if (value !== opt.value) e.currentTarget.style.backgroundColor = "transparent";
              }}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState("");

  const [loaded, setLoaded] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Initializing application...");

  const [currentTab, setCurrentTab] = useState("dashboard");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [audits, setAudits] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [logs, setLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const [activeModal, setActiveModal] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedAudit, setSelectedAudit] = useState(null);

  const [deptForm, setDeptForm] = useState({ name: "", parentId: "", headId: "" });
  const [catForm, setCatForm] = useState({ name: "", fields: "" });
  const [assetForm, setAssetForm] = useState({
    name: "", category: "", serialNumber: "", acquisitionDate: "",
    acquisitionCost: "", condition: "Excellent", location: "", isBookable: false, customFields: {}
  });
  const [allocateForm, setAllocateForm] = useState({ employeeId: "", departmentId: "", expectedReturnDate: "" });
  const [transferForm, setTransferForm] = useState({ targetEmployeeId: "" });
  const [returnForm, setReturnForm] = useState({ condition: "Good", remarks: "" });
  const [bookingForm, setBookingForm] = useState({ assetId: "", date: "", startTime: "09:00", endTime: "10:00" });
  const [maintenanceForm, setMaintenanceForm] = useState({ assetId: "", description: "", priority: "Medium" });
  const [auditForm, setAuditForm] = useState({ name: "", scope: "All", startDate: "", endDate: "", auditors: [] });

  const [orgSubTab, setOrgSubTab] = useState("departments");
  const [selectedAllocAssetId, setSelectedAllocAssetId] = useState("");
  const [transferTargetEmployeeId, setTransferTargetEmployeeId] = useState("");
  const [transferReason, setTransferReason] = useState("");
  const [selectedBookingAssetId, setSelectedBookingAssetId] = useState("");
  const [selectedBookingDate, setSelectedBookingDate] = useState("2026-07-12");

  const apiRequest = async (endpoint, method = "GET", body = null) => {
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const config = { method, headers };
    if (body) {
      config.body = JSON.stringify(body);
    }
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Request failed");
    }
    return response.json();
  };

  const loadData = async () => {
    try {
      setLoaded(false);
      setLoadingMsg("Loading profile...");
      const profile = await apiRequest("/auth/me");
      setUser(profile);

      setLoadingMsg("Loading departments...");
      const deptsData = await apiRequest("/departments");
      setDepartments(deptsData);

      setLoadingMsg("Loading categories...");
      const catsData = await apiRequest("/categories");
      setCategories(catsData);

      setLoadingMsg("Loading assets...");
      const assetsData = await apiRequest("/assets");
      setAssets(assetsData);

      setLoadingMsg("Loading bookings...");
      const bookingsData = await apiRequest("/bookings");
      setBookings(bookingsData);

      setLoadingMsg("Loading maintenance...");
      const maintData = await apiRequest("/maintenance");
      setMaintenance(maintData);

      setLoadingMsg("Loading audits...");
      const auditsData = await apiRequest("/audits");
      setAudits(auditsData);

      setLoadingMsg("Loading transfers...");
      const transfersData = await apiRequest("/transfers");
      setTransfers(transfersData);

      setLoadingMsg("Loading allocations...");
      const allocationsData = await apiRequest("/allocations");
      setAllocations(allocationsData);

      setLoadingMsg("Loading notifications...");
      const notifsData = await apiRequest("/notifications");
      setNotifications(notifsData);

      setLoadingMsg("Loading analytics...");
      const analyticsData = await apiRequest("/analytics");
      setAnalytics(analyticsData);

      if (profile.role === "Admin") {
        setLoadingMsg("Loading directory...");
        const employeesData = await apiRequest("/employees");
        setEmployees(employeesData);

        setLoadingMsg("Loading logs...");
        const logsData = await apiRequest("/logs");
        setLogs(logsData);
      } else {
        try {
          const employeesData = await apiRequest("/employees");
          setEmployees(employeesData);
        } catch (err) {
          console.error("Failed to load employee list: ", err);
        }
      }

      if (assetsData.length > 0) {
        setSelectedAllocAssetId(prev => prev || assetsData[0].id);
        const bookables = assetsData.filter(a => a.isBookable);
        if (bookables.length > 0) {
          setSelectedBookingAssetId(prev => prev || bookables[0].id);
        }
      }

      setLoaded(true);
    } catch (err) {
      console.error(err);
      setLoaded(true);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    } else {
      setLoaded(true);
    }
  }, [token]);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoaded(false);
      setLoadingMsg("Registering...");
      const data = await apiRequest("/auth/signup", "POST", { email, password, name });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setAuthError("");
    } catch (err) {
      setAuthError(err.message);
      setLoaded(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoaded(false);
      setLoadingMsg("Logging in...");
      const data = await apiRequest("/auth/login", "POST", { email, password });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setAuthError("");
    } catch (err) {
      setAuthError(err.message);
      setLoaded(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setLoaded(true);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setAuthError("Enter email address to reset password");
      return;
    }
    try {
      const res = await apiRequest("/auth/forgot-password", "POST", { email });
      alert(res.message);
      setAuthError("");
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const addDepartment = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/departments", "POST", deptForm);
      setDeptForm({ name: "", parentId: "", headId: "" });
      setActiveModal(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleDeptStatus = async (dept) => {
    try {
      const newStatus = dept.status === "Active" ? "Inactive" : "Active";
      await apiRequest(`/departments/${dept.id}`, "PUT", { status: newStatus });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      const fieldsArray = catForm.fields.split(",").map(f => f.trim()).filter(Boolean);
      await apiRequest("/categories", "POST", { name: catForm.name, fields: fieldsArray });
      setCatForm({ name: "", fields: "" });
      setActiveModal(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const updateEmployeeRole = async (empId, role) => {
    try {
      await apiRequest(`/employees/${empId}/role`, "PUT", { role });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const updateEmployeeDept = async (empId, departmentId) => {
    try {
      await apiRequest(`/employees/${empId}/role`, "PUT", { departmentId });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const registerAsset = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/assets", "POST", assetForm);
      setAssetForm({
        name: "", category: "", serialNumber: "", acquisitionDate: "",
        acquisitionCost: "", condition: "Excellent", location: "", isBookable: false, customFields: {}
      });
      setActiveModal(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const allocateAsset = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/assets/allocate", "POST", {
        assetId: selectedAsset.id,
        ...allocateForm
      });
      setAllocateForm({ employeeId: "", departmentId: "", expectedReturnDate: "" });
      setActiveModal(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const requestTransfer = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/assets/request-transfer", "POST", {
        assetId: selectedAsset.id,
        targetEmployeeId: transferForm.targetEmployeeId
      });
      setTransferForm({ targetEmployeeId: "" });
      setActiveModal(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const approveTransfer = async (transferId) => {
    try {
      await apiRequest(`/transfers/${transferId}/approve`, "POST");
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const returnAsset = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/assets/return", "POST", {
        assetId: selectedAsset.id,
        condition: returnForm.condition,
        remarks: returnForm.remarks
      });
      setReturnForm({ condition: "Good", remarks: "" });
      setActiveModal(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const bookResource = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/bookings", "POST", bookingForm);
      setBookingForm({ assetId: "", date: "", startTime: "09:00", endTime: "10:00" });
      setActiveModal(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await apiRequest(`/bookings/${id}/status`, "PUT", { status });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const createMaintenanceRequest = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/maintenance", "POST", maintenanceForm);
      setMaintenanceForm({ assetId: "", description: "", priority: "Medium" });
      setActiveModal(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const updateMaintenanceStatus = async (id, status, technician = "") => {
    try {
      await apiRequest(`/maintenance/${id}/status`, "PUT", { status, technician });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const createAuditCycle = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/audits", "POST", auditForm);
      setAuditForm({ name: "", scope: "All", startDate: "", endDate: "", auditors: [] });
      setActiveModal(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const verifyAuditAsset = async (auditId, assetId, verificationStatus) => {
    try {
      await apiRequest(`/audits/${auditId}/verify`, "PUT", { assetId, verificationStatus });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const closeAuditCycle = async (auditId) => {
    try {
      await apiRequest(`/audits/${auditId}/close`, "PUT");
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await apiRequest(`/notifications/${id}/read`, "PUT");
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const exportCSVReport = () => {
    const headers = ["Asset Tag", "Asset Name", "Category", "Condition", "Status", "Location", "Value"];
    const rows = assets.map(a => [a.tag, a.name, a.category, a.condition, a.status, a.location, a.acquisitionCost]);
    let csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AssetFlow_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const inlineAllocateAsset = async (e) => {
    e.preventDefault();
    if (!selectedAllocAssetId) return;
    try {
      await apiRequest("/assets/allocate", "POST", {
        assetId: selectedAllocAssetId,
        employeeId: allocateForm.employeeId,
        departmentId: allocateForm.departmentId,
        expectedReturnDate: allocateForm.expectedReturnDate
      });
      setAllocateForm({ employeeId: "", departmentId: "", expectedReturnDate: "" });
      loadData();
      alert("Asset successfully allocated!");
    } catch (err) {
      alert(err.message);
    }
  };

  const inlineRequestTransfer = async (e) => {
    e.preventDefault();
    if (!selectedAllocAssetId) return;
    try {
      await apiRequest("/assets/request-transfer", "POST", {
        assetId: selectedAllocAssetId,
        targetEmployeeId: transferTargetEmployeeId
      });
      setTransferTargetEmployeeId("");
      setTransferReason("");
      loadData();
      alert("Transfer request submitted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const inlineBookResource = async (slotStart, slotEnd) => {
    if (!selectedBookingAssetId) return;
    try {
      await apiRequest("/bookings", "POST", {
        assetId: selectedBookingAssetId,
        date: selectedBookingDate,
        startTime: slotStart,
        endTime: slotEnd
      });
      loadData();
      alert("Booking successfully registered!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (!token) {
    return (
      <div className="auth-wrapper" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#121315",
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(217, 119, 6, 0.1) 0%, transparent 60%)"
      }}>
        <div className="card auth-card" style={{
          backgroundColor: "#0d111d",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          padding: "40px 32px",
          maxWidth: "440px",
          width: "100%",
          position: "relative",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)"
        }}>
          {/* Close button X */}
          <button
            type="button"
            onClick={() => {
              setEmail("");
              setPassword("");
              setName("");
              setAuthError("");
            }}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "none",
              border: "none",
              color: "#8e8d85",
              cursor: "pointer",
              transition: "color 0.2s"
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px" }}>
            <BrandLogo />
            <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#ffffff", marginTop: "16px", marginBottom: "4px" }}>
              {authMode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p style={{ fontSize: "14px", color: "#8e8d85" }}>
              {authMode === "login" ? "Log in to your WhiteRock account" : "Sign up for a WhiteRock account"}
            </p>
          </div>

          {/* Social Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
            <button
              type="button"
              onClick={() => {
                setEmail("admin@assetflow.com");
                setPassword("admin123");
                alert("Simulating Google sign-in. Demo admin credentials loaded!");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                padding: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
            >
              <GoogleIcon />
              Continue with Google
            </button>
            {/* <button 
              type="button" 
              onClick={() => {
                setEmail("employee@assetflow.com");
                setPassword("password123");
                alert("Simulating GitHub sign-in. Demo employee credentials loaded!");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                padding: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
            >
              <GithubIcon />
              Continue with GitHub
            </button> */}
          </div>

          {/* Separator */}
          <div style={{ display: "flex", alignItems: "center", margin: "24px 0", gap: "10px" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }} />
            <span style={{ fontSize: "12px", color: "#5a5e66" }}>or continue with email</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }} />
          </div>

          {authError && <div style={{ color: "#ef4444", fontSize: "13px", marginBottom: "16px", textAlign: "center", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "8px", borderRadius: "6px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>{authError}</div>}

          <form onSubmit={authMode === "login" ? handleLogin : handleSignup}>
            {authMode === "signup" && (
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "12px", color: "#8e8d85", marginBottom: "6px", display: "block" }}>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  style={{
                    backgroundColor: "rgba(15, 23, 42, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    color: "#c3c2b7",
                    fontSize: "14px"
                  }}
                />
              </div>
            )}
            <div className="form-group" style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", color: "#8e8d85", marginBottom: "6px", display: "block" }}>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  backgroundColor: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#c3c2b7",
                  fontSize: "14px"
                }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "12px", color: "#8e8d85", marginBottom: "6px", display: "block" }}>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  backgroundColor: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#c3c2b7",
                  fontSize: "14px"
                }}
              />
            </div>
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: "#d97706",
                color: "white",
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "15px",
                boxShadow: "0 4px 12px rgba(217, 119, 6, 0.2)",
                cursor: "pointer",
                border: "none",
                transition: "all 0.2s"
              }}
            >
              {authMode === "login" ? "Log in" : "Sign up"}
            </button>


          </form>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", fontSize: "13px" }}>
            <span
              style={{ color: "#8e8d85", cursor: "pointer", textDecoration: "underline" }}
              onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
            >
              {authMode === "login" ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </span>
            {authMode === "login" && (
              <span style={{ color: "#d97706", cursor: "pointer" }} onClick={handleForgotPassword}>
                Forgot Password?
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!user || !loaded) {
    return (
      <div className="fixed inset-0 bg-[#1e1e1f] flex flex-col items-center justify-center gap-4 z-50">
        {/* Spinner */}
        <div className="w-10 h-10 border-2 border-gray-700 border-t-amber-600 rounded-full animate-spin" />

        {/* Logo */}
        <div className="flex items-center gap-2">
          <BrandLogo />
          <span className="text-[#c3c2b7] font-bold text-lg">WhiteRock</span>
        </div>

        <p className="text-gray-400 text-sm">{loadingMsg}</p>
      </div>
    );
  }

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter ? a.category === categoryFilter : true;
    const matchesStatus = statusFilter ? a.status === statusFilter : true;
    const matchesLoc = locationFilter ? a.location.toLowerCase().includes(locationFilter.toLowerCase()) : true;
    return matchesSearch && matchesCat && matchesStatus && matchesLoc;
  });

  return (
    <div className="app-container" style={{ position: "relative" }}>
      {!loaded && (
        <div className="absolute inset-0 bg-[#1e1e1f] flex flex-col items-center justify-center gap-4 z-10">
          {/* Spinner */}
          <div className="w-10 h-10 border-2 border-gray-700 border-t-amber-600 rounded-full animate-spin" />

          {/* Logo */}
          <div className="flex items-center gap-2">
            <BrandLogo />
            <span className="text-[#c3c2b7] font-bold text-lg">WhiteRock</span>
          </div>

          <p className="text-gray-400 text-sm">{loadingMsg}</p>
        </div>
      )}
      <div className="sidebar">
        <div className="logo-container">
          <BrandLogo />
          <span>WhiteRock</span>
        </div>
        <div className="nav-links">
          <div className={`nav-item ${currentTab === "dashboard" ? "active" : ""}`} onClick={() => setCurrentTab("dashboard")}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>
          {user.role === "Admin" && (
            <div className={`nav-item ${currentTab === "orgSetup" ? "active" : ""}`} onClick={() => { setCurrentTab("orgSetup"); setOrgSubTab("departments"); }}>
              <FolderTree size={18} />
              <span>Organization Setup</span>
            </div>
          )}
          <div className={`nav-item ${currentTab === "assets" ? "active" : ""}`} onClick={() => setCurrentTab("assets")}>
            <Package size={18} />
            <span>Assets</span>
          </div>
          <div className={`nav-item ${currentTab === "allocations" ? "active" : ""}`} onClick={() => setCurrentTab("allocations")}>
            <ArrowRightLeft size={18} />
            <span>Allocation & Transfer</span>
          </div>
          <div className={`nav-item ${currentTab === "bookings" ? "active" : ""}`} onClick={() => setCurrentTab("bookings")}>
            <Calendar size={18} />
            <span>Resource Booking</span>
          </div>
          <div className={`nav-item ${currentTab === "maintenance" ? "active" : ""}`} onClick={() => setCurrentTab("maintenance")}>
            <Wrench size={18} />
            <span>Maintenance</span>
          </div>
          <div className={`nav-item ${currentTab === "audits" ? "active" : ""}`} onClick={() => setCurrentTab("audits")}>
            <ShieldAlert size={18} />
            <span>Audits</span>
          </div>
          {user.role === "Admin" && (
            <div className={`nav-item ${currentTab === "reports" ? "active" : ""}`} onClick={() => setCurrentTab("reports")}>
              <BarChart3 size={18} />
              <span>Reports</span>
            </div>
          )}
          <div className={`nav-item ${currentTab === "notifications" ? "active" : ""}`} onClick={() => setCurrentTab("notifications")}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
              <Bell size={18} />
              <span>Notifications</span>
              {notifications.filter(n => !n.read).length > 0 && (
                <span style={{
                  background: "#ef4444",
                  color: "#ffffff",
                  fontSize: "10px",
                  fontWeight: "bold",
                  padding: "1px 5px",
                  borderRadius: "10px",
                  marginLeft: "auto",
                  lineHeight: "1"
                }}>
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="user-profile-section">
          <div className="flex-between">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
            <button onClick={handleLogout} className="notification-bell" style={{ border: "none", background: "none" }}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="page-title" style={{ textTransform: "capitalize" }}>{currentTab}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", position: "relative" }}>
            <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={18} />
              {notifications.filter(n => !n.read).length > 0 && <div className="notification-badge" />}
            </div>
            {showNotifications && (
              <div className="notification-dropdown">
                <h4 style={{ margin: "0 0 8px 0", fontSize: "14px" }}>Notifications</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
                  {notifications.length === 0 ? (
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`notification-item ${!n.read ? "unread" : ""}`} onClick={() => markNotificationRead(n.id)}>
                        <span>{n.message}</span>
                        <span className="notification-time">{new Date(n.createdAt).toLocaleTimeString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {currentTab === "dashboard" && (
          <div>
            {/* Overdue Return warning banner */}
            {(() => {
              const overdueCount = assets.filter(a => a.status === "Allocated" && a.expectedReturnDate && new Date(a.expectedReturnDate) < new Date()).length;
              if (overdueCount > 0) {
                return (
                  <div style={{
                    backgroundColor: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid #ef4444",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    color: "#ef4444",
                    fontSize: "14px"
                  }}>
                    <ShieldAlert size={20} />
                    <span><strong>{overdueCount} assets overdue for return</strong> - flagged for follow-up</span>
                  </div>
                );
              }
              return null;
            })()}

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "24px"
            }}>
              {/* 1. Available */}
              <div className="card kpi-card" style={{ display: "flex", gap: "16px", alignItems: "center", padding: "16px" }}>
                <div className="kpi-icon-wrapper" style={{ backgroundColor: "#10b981", width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={20} style={{ color: "#fff" }} />
                </div>
                <div>
                  <div className="kpi-value" style={{ fontSize: "20px", fontWeight: "bold" }}>{assets.filter(a => a.status === "Available").length}</div>
                  <div className="kpi-label" style={{ fontSize: "12px", color: "#8e8d85" }}>Available</div>
                </div>
              </div>

              {/* 2. Allocated */}
              <div className="card kpi-card" style={{ display: "flex", gap: "16px", alignItems: "center", padding: "16px" }}>
                <div className="kpi-icon-wrapper" style={{ backgroundColor: "#06b6d4", width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ArrowRightLeft size={20} style={{ color: "#fff" }} />
                </div>
                <div>
                  <div className="kpi-value" style={{ fontSize: "20px", fontWeight: "bold" }}>{assets.filter(a => a.status === "Allocated").length}</div>
                  <div className="kpi-label" style={{ fontSize: "12px", color: "#8e8d85" }}>Allocated</div>
                </div>
              </div>

              {/* 3. Under Maintenance */}
              <div className="card kpi-card" style={{ display: "flex", gap: "16px", alignItems: "center", padding: "16px" }}>
                <div className="kpi-icon-wrapper" style={{ backgroundColor: "#f59e0b", width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Wrench size={20} style={{ color: "#fff" }} />
                </div>
                <div>
                  <div className="kpi-value" style={{ fontSize: "20px", fontWeight: "bold" }}>{assets.filter(a => a.status === "Under Maintenance").length}</div>
                  <div className="kpi-label" style={{ fontSize: "12px", color: "#8e8d85" }}>Under Maintenance</div>
                </div>
              </div>

              {/* 4. Active Bookings */}
              <div className="card kpi-card" style={{ display: "flex", gap: "16px", alignItems: "center", padding: "16px" }}>
                <div className="kpi-icon-wrapper" style={{ backgroundColor: "#d97706", width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Calendar size={20} style={{ color: "#fff" }} />
                </div>
                <div>
                  <div className="kpi-value" style={{ fontSize: "20px", fontWeight: "bold" }}>{bookings.filter(b => b.status === "Upcoming").length}</div>
                  <div className="kpi-label" style={{ fontSize: "12px", color: "#8e8d85" }}>Active Bookings</div>
                </div>
              </div>

              {/* 5. Pending Transfers */}
              <div className="card kpi-card" style={{ display: "flex", gap: "16px", alignItems: "center", padding: "16px" }}>
                <div className="kpi-icon-wrapper" style={{ backgroundColor: "#8b5cf6", width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <RefreshCw size={20} style={{ color: "#fff" }} />
                </div>
                <div>
                  <div className="kpi-value" style={{ fontSize: "20px", fontWeight: "bold" }}>{transfers.filter(t => t.status === "Requested").length}</div>
                  <div className="kpi-label" style={{ fontSize: "12px", color: "#8e8d85" }}>Pending Transfers</div>
                </div>
              </div>

              {/* 6. Upcoming Returns */}
              <div className="card kpi-card" style={{ display: "flex", gap: "16px", alignItems: "center", padding: "16px" }}>
                <div className="kpi-icon-wrapper" style={{ backgroundColor: "#ec4899", width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bell size={20} style={{ color: "#fff" }} />
                </div>
                <div>
                  <div className="kpi-value" style={{ fontSize: "20px", fontWeight: "bold" }}>{assets.filter(a => a.status === "Allocated" && a.expectedReturnDate && new Date(a.expectedReturnDate) >= new Date()).length}</div>
                  <div className="kpi-label" style={{ fontSize: "12px", color: "#8e8d85" }}>Upcoming Returns</div>
                </div>
              </div>
            </div>

            <div className="dashboard-sections">
              <div className="section-left">
                <div className="card">
                  <h3 style={{ marginBottom: "16px" }}>Recent Asset Allocations</h3>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Asset Tag</th>
                          <th>Asset Name</th>
                          <th>Category</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assets.slice(0, 5).map(asset => (
                          <tr key={asset.id}>
                            <td>{asset.tag}</td>
                            <td>{asset.name}</td>
                            <td>{asset.category}</td>
                            <td>
                              <span className={`status-badge ${asset.status.toLowerCase().replace(" ", "-")}`}>
                                {asset.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="section-right">
                <div className="card">
                  <h3 style={{ marginBottom: "16px" }}>Quick Actions</h3>
                  <div className="quick-actions">
                    {(user.role === "Asset Manager" || user.role === "Admin") && (
                      <button className="btn btn-primary w-full" onClick={() => setActiveModal("addAsset")}>
                        <Plus size={16} /> Register New Asset
                      </button>
                    )}
                    <button className="btn btn-secondary w-full" onClick={() => setCurrentTab("bookings")}>
                      <Calendar size={16} /> Book Shared Resource
                    </button>
                    <button className="btn btn-secondary w-full" onClick={() => {
                      setMaintenanceForm({ assetId: assets[0]?.id || "", description: "", priority: "Medium" });
                      setActiveModal("requestMaintenance");
                    }}>
                      <Wrench size={16} /> Request Maintenance
                    </button>
                    {user.role === "Admin" && (
                      <button className="btn btn-secondary w-full" onClick={() => setActiveModal("addAudit")}>
                        <ShieldAlert size={16} /> Schedule Audit
                      </button>
                    )}
                  </div>
                </div>

                <div className="card" style={{ borderLeft: "4px solid #f59e0b" }}>
                  <h3 style={{ marginBottom: "12px", color: "#f59e0b", display: "flex", alignItems: "center", gap: "8px" }}>
                    <ShieldAlert size={20} /> Active Alerts
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {assets.filter(a => a.status === "Allocated" && a.expectedReturnDate && new Date(a.expectedReturnDate) < new Date()).map(a => (
                      <div key={a.id} style={{ fontSize: "13px" }}>
                        <strong>Overdue:</strong> {a.name} ({a.tag}) was expected on {a.expectedReturnDate}.
                      </div>
                    ))}
                    {assets.filter(a => a.status === "Allocated" && a.expectedReturnDate && new Date(a.expectedReturnDate) >= new Date() && (new Date(a.expectedReturnDate) - new Date()) / (1000 * 60 * 60 * 24) <= 3).map(a => (
                      <div key={a.id} style={{ fontSize: "13px" }}>
                        <strong>Return Upcoming:</strong> {a.name} ({a.tag}) due soon ({a.expectedReturnDate}).
                      </div>
                    ))}
                    {assets.filter(a => a.status === "Allocated" && a.expectedReturnDate).length === 0 && (
                      <span style={{ fontSize: "13px", color: "#8e8d85" }}>No alerts at the moment.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === "orgSetup" && user.role === "Admin" && (
          <div>
            <div className="card">
              {/* Internal Tab Bar */}
              <div style={{ display: "flex", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", marginBottom: "20px", gap: "24px" }}>
                <button style={{
                  padding: "10px 0",
                  background: "none",
                  border: "none",
                  borderBottom: orgSubTab === "departments" ? "2px solid #d97706" : "2px solid transparent",
                  color: orgSubTab === "departments" ? "#d97706" : "#8e8d85",
                  cursor: "pointer",
                  fontWeight: orgSubTab === "departments" ? "bold" : "normal"
                }} onClick={() => setOrgSubTab("departments")}>Departments</button>

                <button style={{
                  padding: "10px 0",
                  background: "none",
                  border: "none",
                  borderBottom: orgSubTab === "categories" ? "2px solid #d97706" : "2px solid transparent",
                  color: orgSubTab === "categories" ? "#d97706" : "#8e8d85",
                  cursor: "pointer",
                  fontWeight: orgSubTab === "categories" ? "bold" : "normal"
                }} onClick={() => setOrgSubTab("categories")}>Categories</button>

                <button style={{
                  padding: "10px 0",
                  background: "none",
                  border: "none",
                  borderBottom: orgSubTab === "employees" ? "2px solid #d97706" : "2px solid transparent",
                  color: orgSubTab === "employees" ? "#d97706" : "#8e8d85",
                  cursor: "pointer",
                  fontWeight: orgSubTab === "employees" ? "bold" : "normal"
                }} onClick={() => setOrgSubTab("employees")}>Employee</button>

                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px", paddingBottom: "4px" }}>
                  <button className="btn btn-primary" style={{ padding: "6px 12px", fontSize: "13px" }} onClick={() => {
                    if (orgSubTab === "departments") setActiveModal("addDept");
                    else if (orgSubTab === "categories") setActiveModal("addCat");
                    else alert("Admin roles can be assigned by modifying the role dropdown in the Employee list below.");
                  }}>
                    <Plus size={14} /> Add {orgSubTab === "departments" ? "Department" : orgSubTab === "categories" ? "Category" : "Role"}
                  </button>
                </div>
              </div>

              {/* Sub tab content: Departments */}
              {orgSubTab === "departments" && (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Department Name</th>
                        <th>Parent Department</th>
                        <th>Head</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map(dept => {
                        const parent = departments.find(d => d.id === dept.parentId);
                        const head = employees.find(e => e.id === dept.headId);
                        return (
                          <tr key={dept.id}>
                            <td>{dept.name}</td>
                            <td>{parent ? parent.name : "None"}</td>
                            <td>{head ? head.name : "None"}</td>
                            <td>
                              <span className={`status-badge ${dept.status === "Active" ? "active" : "inactive"}`}>
                                {dept.status}
                              </span>
                            </td>
                            <td>
                              <button className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => toggleDeptStatus(dept)}>
                                Toggle Status
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Sub tab content: Categories */}
              {orgSubTab === "categories" && (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Category Name</th>
                        <th>Specific Fields</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(cat => (
                        <tr key={cat.id}>
                          <td>{cat.name}</td>
                          <td>
                            {cat.fields.map((f, idx) => (
                              <span key={idx} style={{ marginRight: "8px", padding: "2px 6px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "4px", fontSize: "12px" }}>
                                {f}
                              </span>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Sub tab content: Employees */}
              {orgSubTab === "employees" && (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map(emp => {
                        const dept = departments.find(d => d.id === emp.departmentId);
                        return (
                          <tr key={emp.id}>
                            <td>{emp.name}</td>
                            <td>{emp.email}</td>
                            <td>
                              <select className="form-control" style={{ padding: "4px 8px" }} value={emp.departmentId} onChange={e => updateEmployeeDept(emp.id, e.target.value)}>
                                <option value="">No Department</option>
                                {departments.map(d => (
                                  <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <select className="form-control" style={{ padding: "4px 8px" }} value={emp.role} onChange={e => updateEmployeeRole(emp.id, e.target.value)}>
                                <option value="Employee">Employee</option>
                                <option value="Department Head">Department Head</option>
                                <option value="Asset Manager">Asset Manager</option>
                                <option value="Admin">Admin</option>
                              </select>
                            </td>
                            <td>
                              <span className={`status-badge ${emp.status === "Active" ? "active" : "inactive"}`}>
                                {emp.status}
                              </span>
                            </td>
                            <td>
                              <button className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={async () => {
                                const newStatus = emp.status === "Active" ? "Inactive" : "Active";
                                await apiRequest(`/employees/${emp.id}/role`, "PUT", { status: newStatus });
                                loadData();
                              }}>
                                Toggle Status
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {currentTab === "assets" && (
          <div>
            <div className="card mb-4">
              <h3>Search & Filters</h3>
              <div className="search-bar mt-4">
                <input type="text" className="form-control" placeholder="Search by name, tag, location, serial number..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                <select className="form-control" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Allocated">Allocated</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Lost">Lost</option>
                  <option value="Retired">Retired</option>
                  <option value="Disposed">Disposed</option>
                </select>
                <input type="text" className="form-control" placeholder="Filter by location..." value={locationFilter} onChange={e => setLocationFilter(e.target.value)} />
              </div>
            </div>

            <div className="card">
              <div className="flex-between mb-4">
                <h3>Asset Directory</h3>
                {(user.role === "Asset Manager" || user.role === "Admin") && (
                  <button className="btn btn-primary" onClick={() => setActiveModal("addAsset")}>
                    <Plus size={16} /> Register Asset
                  </button>
                )}
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Tag</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Condition</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Details</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssets.map(asset => {
                      const holder = employees.find(e => e.id === asset.employeeId);
                      return (
                        <tr key={asset.id}>
                          <td>{asset.tag}</td>
                          <td>{asset.name}</td>
                          <td>{asset.category}</td>
                          <td>{asset.condition}</td>
                          <td>{asset.location}</td>
                          <td>
                            <span className={`status-badge ${asset.status.toLowerCase().replace(" ", "-")}`}>
                              {asset.status}
                            </span>
                          </td>
                          <td style={{ fontSize: "12px" }}>
                            {holder && <div>Holder: {holder.name}</div>}
                            {asset.expectedReturnDate && <div>Due: {asset.expectedReturnDate}</div>}
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "8px" }}>
                              {asset.status === "Available" && (user.role === "Asset Manager" || user.role === "Admin") && (
                                <button className="btn btn-primary" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => {
                                  setSelectedAsset(asset);
                                  setActiveModal("allocate");
                                }}>
                                  Allocate
                                </button>
                              )}
                              {asset.status === "Allocated" && asset.employeeId === user.id && (
                                <button className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => {
                                  setSelectedAsset(asset);
                                  setActiveModal("return");
                                }}>
                                  Return
                                </button>
                              )}
                              {asset.status === "Allocated" && (
                                <button className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => {
                                  setSelectedAsset(asset);
                                  setActiveModal("transfer");
                                }}>
                                  Transfer
                                </button>
                              )}
                              {user.role === "Asset Manager" || user.role === "Admin" ? (
                                <button className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => {
                                  setSelectedAsset(asset);
                                  setAssetForm({
                                    name: asset.name,
                                    category: asset.category,
                                    serialNumber: asset.serialNumber,
                                    acquisitionDate: asset.acquisitionDate,
                                    acquisitionCost: asset.acquisitionCost,
                                    condition: asset.condition,
                                    location: asset.location,
                                    isBookable: asset.isBookable,
                                    customFields: asset.customFields
                                  });
                                  setActiveModal("editAsset");
                                }}>
                                  Edit
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {currentTab === "allocations" && (
          <div>
            <div className="card mb-4">
              <h3>Asset Allocation & Transfer</h3>
              <p style={{ color: "#8e8d85", fontSize: "14px", marginTop: "4px" }}>
                Select an asset below to allocate it to an employee or initiate a transfer request if it's already allocated.
              </p>

              <div style={{ marginTop: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Select Asset</label>
                <CustomSelect
                  value={selectedAllocAssetId}
                  onChange={(val) => {
                    setSelectedAllocAssetId(val);
                    setTransferTargetEmployeeId("");
                    setTransferReason("");
                  }}
                  options={assets.map(a => ({
                    value: a.id,
                    label: `${a.name} (${a.tag}) - Status: ${a.status} ${a.employeeId ? `(Held by: ${employees.find(emp => emp.id === a.employeeId)?.name || 'Unknown'})` : ''}`
                  }))}
                  placeholder="-- Choose an Asset --"
                />
              </div>
            </div>

            {(() => {
              const selectedAssetItem = assets.find(a => a.id === selectedAllocAssetId);
              if (!selectedAssetItem) return null;

              if (selectedAssetItem.status === "Allocated") {
                const holder = employees.find(e => e.id === selectedAssetItem.employeeId);
                const dept = departments.find(d => d.id === selectedAssetItem.departmentId);
                return (
                  <div className="card mb-4" style={{ borderLeft: "4px solid #ef4444" }}>
                    <div style={{
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid #ef4444",
                      borderRadius: "8px",
                      padding: "16px",
                      color: "#ef4444",
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px"
                    }}>
                      <ShieldAlert size={24} />
                      <div>
                        <strong>Already Allocated:</strong> This asset is currently assigned to <strong>{holder ? holder.name : "Unknown Employee"}</strong> ({dept ? dept.name : "No Department"}). Direct re-allocation is blocked. Submit a transfer request below.
                      </div>
                    </div>

                    <form onSubmit={inlineRequestTransfer}>
                      <h4 style={{ marginBottom: "16px" }}>Submit Transfer Request</h4>
                      <div className="form-group">
                        <label>From (Current Holder)</label>
                        <input type="text" className="form-control" value={holder ? holder.name : "Unknown Employee"} disabled />
                      </div>
                      <div className="form-group">
                        <label>To (Target Employee)</label>
                        <CustomSelect
                          value={transferTargetEmployeeId}
                          onChange={val => setTransferTargetEmployeeId(val)}
                          options={employees.filter(e => e.id !== selectedAssetItem.employeeId).map(e => ({
                            value: e.id,
                            label: `${e.name} (${e.email})`
                          }))}
                          placeholder="-- Select Target Employee --"
                        />
                      </div>
                      <div className="form-group">
                        <label>Reason for Transfer</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Please provide details for the transfer..."
                          value={transferReason}
                          onChange={e => setTransferReason(e.target.value)}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary mt-2">
                        Submit Transfer Request
                      </button>
                    </form>
                  </div>
                );
              }

              if (selectedAssetItem.status === "Available") {
                return (
                  <div className="card mb-4" style={{ borderLeft: "4px solid #10b981" }}>
                    <form onSubmit={inlineAllocateAsset}>
                      <h4 style={{ marginBottom: "16px" }}>Allocate Asset</h4>
                      <div className="form-group">
                        <label>Employee</label>
                        <CustomSelect
                          value={allocateForm.employeeId}
                          onChange={val => setAllocateForm({ ...allocateForm, employeeId: val })}
                          options={employees.map(e => ({
                            value: e.id,
                            label: `${e.name} (${e.email})`
                          }))}
                          placeholder="-- Select Employee --"
                        />
                      </div>
                      <div className="form-group">
                        <label>Department</label>
                        <CustomSelect
                          value={allocateForm.departmentId}
                          onChange={val => setAllocateForm({ ...allocateForm, departmentId: val })}
                          options={departments.map(d => ({
                            value: d.id,
                            label: d.name
                          }))}
                          placeholder="-- Select Department --"
                        />
                      </div>
                      <div className="form-group">
                        <label>Expected Return Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={allocateForm.expectedReturnDate}
                          onChange={e => setAllocateForm({ ...allocateForm, expectedReturnDate: e.target.value })}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary mt-2">
                        Allocate Asset
                      </button>
                    </form>
                  </div>
                );
              }

              return (
                <div className="card mb-4">
                  <p style={{ color: "#ef4444" }}>
                    This asset status is currently <strong>{selectedAssetItem.status}</strong> and cannot be allocated or transferred.
                  </p>
                </div>
              );
            })()}

            {/* Allocation & Transfer History */}
            {selectedAllocAssetId && (
              <div className="card">
                <h3>Allocation History</h3>
                <div className="table-container mt-4">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Event</th>
                        <th>Details</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Active Allocations */}
                      {allocations.filter(al => al.assetId === selectedAllocAssetId).map(al => {
                        const emp = employees.find(e => e.id === al.employeeId);
                        return (
                          <tr key={al.id}>
                            <td>{al.allocatedAt}</td>
                            <td>Allocation</td>
                            <td>Allocated to {emp ? emp.name : "Employee"} (Due: {al.expectedReturnDate || "N/A"})</td>
                            <td>
                              <span className={`status-badge ${al.status.toLowerCase()}`}>{al.status}</span>
                            </td>
                            <td>
                              {al.status === "Active" && (
                                <button className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => {
                                  setSelectedAsset(assets.find(a => a.id === selectedAllocAssetId));
                                  setActiveModal("return");
                                }}>
                                  Return Asset
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {/* Transfers */}
                      {transfers.filter(tr => tr.assetId === selectedAllocAssetId).map(tr => {
                        const fromEmp = employees.find(e => e.id === tr.fromEmployeeId);
                        const toEmp = employees.find(e => e.id === tr.toEmployeeId);
                        return (
                          <tr key={tr.id}>
                            <td>{new Date(tr.requestedAt).toLocaleDateString()}</td>
                            <td>Transfer Request</td>
                            <td>From {fromEmp ? fromEmp.name : "Unknown"} to {toEmp ? toEmp.name : "Unknown"}</td>
                            <td>
                              <span className={`status-badge ${tr.status.toLowerCase()}`}>{tr.status}</span>
                            </td>
                            <td>
                              {tr.status === "Requested" && (user.role === "Asset Manager" || user.role === "Admin") && (
                                <button className="btn btn-primary" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => approveTransfer(tr.id)}>
                                  Approve Transfer
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {allocations.filter(al => al.assetId === selectedAllocAssetId).length === 0 &&
                        transfers.filter(tr => tr.assetId === selectedAllocAssetId).length === 0 && (
                          <tr>
                            <td colSpan="5" style={{ textAlign: "center", color: "#8e8d85" }}>No history found for this asset.</td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {currentTab === "bookings" && (
          <div>
            <div className="card mb-4">
              <h3>Resource Booking Calendar</h3>
              <p style={{ color: "#8e8d85", fontSize: "14px", marginTop: "4px" }}>
                Select a shared bookable resource and date to schedule or view hourly bookings.
              </p>

              <div className="search-bar mt-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px" }}>Shared Resource</label>
                  <select
                    className="form-control"
                    value={selectedBookingAssetId}
                    onChange={e => setSelectedBookingAssetId(e.target.value)}
                  >
                    <option value="">-- Choose Resource --</option>
                    {assets.filter(a => a.isBookable).map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.tag})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px" }}>Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedBookingDate}
                    onChange={e => setSelectedBookingDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {selectedBookingAssetId && (
              <div className="card mb-4">
                <h4 style={{ marginBottom: "16px" }}>Hourly Slots for {selectedBookingDate}</h4>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "12px"
                }}>
                  {[
                    { start: "09:00", end: "10:00" },
                    { start: "10:00", end: "11:00" },
                    { start: "11:00", end: "12:00" },
                    { start: "12:00", end: "13:00" },
                    { start: "13:00", end: "14:00" },
                    { start: "14:00", end: "15:00" },
                    { start: "15:00", end: "16:00" },
                    { start: "16:00", end: "17:00" },
                    { start: "17:00", end: "18:00" }
                  ].map(slot => {
                    const booking = bookings.find(b =>
                      b.assetId === selectedBookingAssetId &&
                      b.date === selectedBookingDate &&
                      b.status !== "Cancelled" &&
                      b.startTime === slot.start
                    );
                    const booker = booking ? employees.find(e => e.id === booking.employeeId) : null;

                    if (booking) {
                      return (
                        <div
                          key={slot.start}
                          style={{
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                            border: "1.5px solid #ef4444",
                            borderRadius: "8px",
                            padding: "16px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: "8px"
                          }}
                        >
                          <div>
                            <span style={{ fontSize: "14px", fontWeight: "bold", color: "#ef4444" }}>{slot.start} - {slot.end}</span>
                            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
                              Booked by: <strong>{booker ? booker.name : "Employee"}</strong>
                            </div>
                          </div>
                          {(booking.employeeId === user.id || user.role === "Admin") && (
                            <button
                              className="btn btn-danger"
                              style={{ alignSelf: "flex-end", padding: "4px 8px", fontSize: "11px" }}
                              onClick={() => updateBookingStatus(booking.id, "Cancelled")}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={slot.start}
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.02)",
                          border: "1.5px dashed rgba(255, 255, 255, 0.1)",
                          borderRadius: "8px",
                          padding: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}
                      >
                        <div>
                          <span style={{ fontSize: "14px", fontWeight: "bold", color: "#8e8d85" }}>{slot.start} - {slot.end}</span>
                          <div style={{ fontSize: "12px", color: "#8e8d85", marginTop: "2px" }}>Available</div>
                        </div>
                        <button
                          className="btn btn-primary"
                          style={{ padding: "6px 12px", fontSize: "12px" }}
                          onClick={() => inlineBookResource(slot.start, slot.end)}
                        >
                          Book Slot
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="card">
              <h3>Your Bookings</h3>
              <div className="table-container mt-4">
                <table>
                  <thead>
                    <tr>
                      <th>Resource</th>
                      <th>Date</th>
                      <th>Time Slot</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.filter(b => b.employeeId === user.id || user.role === "Admin").map(b => {
                      const res = assets.find(a => a.id === b.assetId);
                      return (
                        <tr key={b.id}>
                          <td>{res ? `${res.name} (${res.tag})` : "Unknown"}</td>
                          <td>{b.date}</td>
                          <td>{b.startTime} - {b.endTime}</td>
                          <td>
                            <span className={`status-badge ${b.status.toLowerCase()}`}>
                              {b.status}
                            </span>
                          </td>
                          <td>
                            {b.status === "Upcoming" && (
                              <button className="btn btn-danger" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => updateBookingStatus(b.id, "Cancelled")}>
                                Cancel Booking
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {bookings.filter(b => b.employeeId === user.id || user.role === "Admin").length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: "center", color: "#8e8d85" }}>No bookings found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {currentTab === "maintenance" && (
          <div>
            <div className="card mb-4" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3>Maintenance Management Kanban</h3>
                <p style={{ color: "#8e8d85", fontSize: "14px", marginTop: "4px" }}>
                  Track tickets through approval, assignment, execution, and resolution.
                </p>
              </div>
              <button className="btn btn-primary" onClick={() => {
                setMaintenanceForm({ assetId: assets[0]?.id || "", description: "", priority: "Medium" });
                setActiveModal("requestMaintenance");
              }}>
                <Plus size={16} /> Raise Ticket
              </button>
            </div>

            {/* Kanban columns wrapper */}
            <div style={{
              display: "flex",
              gap: "16px",
              overflowX: "auto",
              paddingBottom: "20px",
              minHeight: "500px"
            }}>
              {[
                { title: "Pending", key: "Pending", color: "#f59e0b" },
                { title: "Approved", key: "Approved", color: "#06b6d4" },
                { title: "Technician Assigned", key: "Technician Assigned", color: "#8b5cf6" },
                { title: "In Progress", key: "In Progress", color: "#3b82f6" },
                { title: "Resolved", key: "Resolved", color: "#10b981" }
              ].map(col => {
                const colTickets = maintenance.filter(m => {
                  if (col.key === "Approved") {
                    return m.status === "Approved" && !m.technician;
                  }
                  if (col.key === "Technician Assigned") {
                    return m.status === "Technician Assigned" || (m.status === "Approved" && m.technician);
                  }
                  return m.status === col.key;
                });

                return (
                  <div
                    key={col.key}
                    style={{
                      flex: "1",
                      minWidth: "260px",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "8px",
                      padding: "16px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: `2px solid ${col.color}`, paddingBottom: "8px" }}>
                      <span style={{ fontWeight: "bold", fontSize: "14px" }}>{col.title}</span>
                      <span style={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "bold"
                      }}>{colTickets.length}</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {colTickets.map(ticket => {
                        const assetItem = assets.find(a => a.id === ticket.assetId);
                        const requester = employees.find(e => e.id === ticket.employeeId);

                        return (
                          <div
                            key={ticket.id}
                            style={{
                              backgroundColor: "#2c2c2a",
                              border: "1px solid rgba(255, 255, 255, 0.04)",
                              borderRadius: "6px",
                              padding: "12px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px"
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <span style={{ fontWeight: "bold", fontSize: "13px", color: "var(--primary)" }}>
                                {assetItem ? assetItem.name : "Asset"}
                              </span>
                              <span style={{ fontSize: "11px", color: "#8e8d85" }}>{assetItem?.tag}</span>
                            </div>

                            <p style={{ fontSize: "12px", margin: "4px 0", color: "#c3c2b7", wordBreak: "break-word" }}>
                              {ticket.description}
                            </p>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                              <span style={{
                                fontSize: "10px",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontWeight: "bold",
                                backgroundColor: ticket.priority === "High" ? "rgba(239, 68, 68, 0.15)" : ticket.priority === "Medium" ? "rgba(245, 158, 11, 0.15)" : "rgba(255,255,255,0.08)",
                                color: ticket.priority === "High" ? "#ef4444" : ticket.priority === "Medium" ? "#f59e0b" : "#8e8d85"
                              }}>{ticket.priority}</span>
                              <span style={{ fontSize: "11px", color: "#8e8d85" }}>By: {requester?.name || "Employee"}</span>
                            </div>

                            {ticket.technician && (
                              <div style={{ fontSize: "11px", color: "#8b5cf6", marginTop: "4px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "4px" }}>
                                🛠️ Tech: {ticket.technician}
                              </div>
                            )}

                            {(user.role === "Asset Manager" || user.role === "Admin") && (
                              <div style={{ display: "flex", gap: "6px", marginTop: "8px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "8px" }}>
                                {ticket.status === "Pending" && (
                                  <>
                                    <button
                                      className="btn btn-primary"
                                      style={{ flex: 1, padding: "4px 6px", fontSize: "11px" }}
                                      onClick={() => updateMaintenanceStatus(ticket.id, "Approved")}
                                    >
                                      Approve
                                    </button>
                                    <button
                                      className="btn btn-danger"
                                      style={{ padding: "4px 6px", fontSize: "11px" }}
                                      onClick={() => updateMaintenanceStatus(ticket.id, "Rejected")}
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}

                                {ticket.status === "Approved" && !ticket.technician && (
                                  <button
                                    className="btn btn-primary w-full"
                                    style={{ padding: "4px 6px", fontSize: "11px" }}
                                    onClick={() => {
                                      const tech = prompt("Enter Technician name:");
                                      if (tech) {
                                        updateMaintenanceStatus(ticket.id, "Technician Assigned", tech);
                                      }
                                    }}
                                  >
                                    Assign Technician
                                  </button>
                                )}

                                {(ticket.status === "Technician Assigned" || (ticket.status === "Approved" && ticket.technician)) && (
                                  <button
                                    className="btn btn-primary w-full"
                                    style={{ padding: "4px 6px", fontSize: "11px" }}
                                    onClick={() => updateMaintenanceStatus(ticket.id, "In Progress")}
                                  >
                                    Start Work
                                  </button>
                                )}

                                {ticket.status === "In Progress" && (
                                  <button
                                    className="btn btn-primary w-full"
                                    style={{ padding: "4px 6px", fontSize: "11px" }}
                                    onClick={() => updateMaintenanceStatus(ticket.id, "Resolved")}
                                  >
                                    Mark Resolved
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {colTickets.length === 0 && (
                        <div style={{ textAlign: "center", color: "#8e8d85", fontSize: "12px", padding: "20px 0" }}>
                          No tickets
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentTab === "audits" && (
          <div>
            <div className="card mb-4">
              <div className="flex-between">
                <h3>Asset Audit Cycles</h3>
                {user.role === "Admin" && (
                  <button className="btn btn-primary" onClick={() => setActiveModal("addAudit")}>
                    <Plus size={16} /> Schedule Audit Cycle
                  </button>
                )}
              </div>
            </div>

            <div className="card">
              <h3>All Audit Cycles</h3>
              <div className="table-container mt-4">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Scope</th>
                      <th>Date Range</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audits.map(audit => (
                      <tr key={audit.id}>
                        <td>{audit.name}</td>
                        <td>{audit.scope}</td>
                        <td>{audit.startDate} to {audit.endDate}</td>
                        <td>
                          <span className={`status-badge ${audit.status.toLowerCase()}`}>
                            {audit.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => {
                              setSelectedAudit(audit);
                              setActiveModal("viewAuditResults");
                            }}>
                              View Discrepancy & Verification
                            </button>
                            {audit.status === "Active" && (user.role === "Asset Manager" || user.role === "Admin") && (
                              <button className="btn btn-danger" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => closeAuditCycle(audit.id)}>
                                Close Audit (Lock)
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {currentTab === "reports" && (
          <div>
            <div className="card mb-4">
              <div className="flex-between">
                <h3>System Reports & Analytics</h3>
                <button className="btn btn-primary" onClick={exportCSVReport}>
                  <Download size={16} /> Export CSV Report
                </button>
              </div>
            </div>

            <div className="grid-cols-2 mb-4">
              <div className="card">
                <h3>Asset Conditions Breakdown</h3>
                <div className="chart-placeholder">
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar" style={{ height: "140px" }} />
                    <span className="chart-bar-label">Excellent</span>
                  </div>
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar" style={{ height: "60px" }} />
                    <span className="chart-bar-label">Good</span>
                  </div>
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar" style={{ height: "20px" }} />
                    <span className="chart-bar-label">Fair</span>
                  </div>
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar" style={{ height: "10px" }} />
                    <span className="chart-bar-label">Damaged</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3>Allocations by Category</h3>
                <div className="chart-placeholder">
                  {Object.keys(analytics?.categoryCounts || {}).map(catName => {
                    const count = analytics.categoryCounts[catName];
                    const heightPercent = Math.min(150, count * 50);
                    return (
                      <div key={catName} className="chart-bar-wrapper">
                        <div className="chart-bar" style={{ height: `${heightPercent}px` }} />
                        <span className="chart-bar-label">{catName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {user.role === "Admin" && (
              <div className="card">
                <h3>System Activity Audit Logs</h3>
                <div className="table-container mt-4">
                  <table>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Action Performed</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map(log => (
                        <tr key={log.id}>
                          <td>{log.userName}</td>
                          <td>{log.action}</td>
                          <td>{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {currentTab === "notifications" && (
          <div className="card">
            <div className="flex-between mb-4">
              <h3>System Notifications</h3>
              {notifications.filter(n => !n.read).length > 0 && (
                <button className="btn btn-secondary" onClick={() => {
                  notifications.forEach(n => { if (!n.read) markNotificationRead(n.id); });
                }}>
                  Mark all as read
                </button>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>
              {notifications.length === 0 ? (
                <div style={{ textAlign: "center", color: "#8e8d85", padding: "40px" }}>
                  No notifications yet.
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    style={{
                      backgroundColor: n.read ? "rgba(255, 255, 255, 0.01)" : "rgba(217, 119, 6, 0.05)",
                      border: n.read ? "1px solid rgba(255,255,255,0.03)" : "1px solid #d97706",
                      borderRadius: "8px",
                      padding: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer"
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "14px", color: "#c3c2b7", fontWeight: n.read ? "normal" : "bold" }}>{n.message}</span>
                      <span style={{ display: "block", fontSize: "12px", color: "#8e8d85", marginTop: "4px" }}>
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {!n.read && (
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#d97706" }} />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {activeModal === "addDept" && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Department</h3>
              <button className="notification-bell" onClick={() => setActiveModal(null)}><X size={16} /></button>
            </div>
            <form onSubmit={addDepartment}>
              <div className="form-group">
                <label>Department Name</label>
                <input type="text" className="form-control" value={deptForm.name} onChange={e => setDeptForm({ ...deptForm, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Parent Department</label>
                <select className="form-control" value={deptForm.parentId} onChange={e => setDeptForm({ ...deptForm, parentId: e.target.value })}>
                  <option value="">None</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Department Head</label>
                <select className="form-control" value={deptForm.headId} onChange={e => setDeptForm({ ...deptForm, headId: e.target.value })}>
                  <option value="">None</option>
                  {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === "addCat" && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Asset Category</h3>
              <button className="notification-bell" onClick={() => setActiveModal(null)}><X size={16} /></button>
            </div>
            <form onSubmit={addCategory}>
              <div className="form-group">
                <label>Category Name</label>
                <input type="text" className="form-control" value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Category Specific Fields (Comma separated)</label>
                <input type="text" className="form-control" placeholder="Warranty Period, RAM, Storage" value={catForm.fields} onChange={e => setCatForm({ ...catForm, fields: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {(activeModal === "addAsset" || activeModal === "editAsset") && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{activeModal === "addAsset" ? "Register Asset" : "Edit Asset"}</h3>
              <button className="notification-bell" onClick={() => setActiveModal(null)}><X size={16} /></button>
            </div>
            <form onSubmit={activeModal === "addAsset" ? registerAsset : async (e) => {
              e.preventDefault();
              try {
                await apiRequest(`/assets/${selectedAsset.id}`, "PUT", assetForm);
                setActiveModal(null);
                loadData();
              } catch (err) {
                alert(err.message);
              }
            }}>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label>Asset Name</label>
                  <input type="text" className="form-control" value={assetForm.name} onChange={e => setAssetForm({ ...assetForm, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <CustomSelect
                    value={assetForm.category}
                    onChange={val => setAssetForm({ ...assetForm, category: val })}
                    options={categories.map(c => ({ value: c.name, label: c.name }))}
                    placeholder="Select Category"
                  />
                </div>
              </div>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label>Serial Number</label>
                  <input type="text" className="form-control" value={assetForm.serialNumber} onChange={e => setAssetForm({ ...assetForm, serialNumber: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Acquisition Cost ($)</label>
                  <input type="number" className="form-control" value={assetForm.acquisitionCost} onChange={e => setAssetForm({ ...assetForm, acquisitionCost: e.target.value })} required />
                </div>
              </div>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label>Acquisition Date</label>
                  <input type="date" className="form-control" value={assetForm.acquisitionDate} onChange={e => setAssetForm({ ...assetForm, acquisitionDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Condition</label>
                  <CustomSelect
                    value={assetForm.condition}
                    onChange={val => setAssetForm({ ...assetForm, condition: val })}
                    options={[
                      { value: "Excellent", label: "Excellent" },
                      { value: "Good", label: "Good" },
                      { value: "Fair", label: "Fair" },
                      { value: "Damaged", label: "Damaged" }
                    ]}
                    placeholder="Select Condition"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" className="form-control" value={assetForm.location} onChange={e => setAssetForm({ ...assetForm, location: e.target.value })} required />
              </div>
              <div className="form-group flex-row gap-2">
                <input type="checkbox" checked={assetForm.isBookable} onChange={e => setAssetForm({ ...assetForm, isBookable: e.target.checked })} />
                <label>This asset is a bookable/shared resource</label>
              </div>

              {assetForm.category && (
                <div style={{ marginTop: "16px", padding: "16px", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <h4 style={{ marginBottom: "12px" }}>Category-specific Details</h4>
                  {categories.find(c => c.name === assetForm.category)?.fields.map(field => (
                    <div className="form-group" key={field}>
                      <label>{field}</label>
                      <input type="text" className="form-control" value={assetForm.customFields[field] || ""} onChange={e => {
                        const newFields = { ...assetForm.customFields, [field]: e.target.value };
                        setAssetForm({ ...assetForm, customFields: newFields });
                      }} />
                    </div>
                  ))}
                </div>
              )}

              <div className="modal-footer mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{activeModal === "addAsset" ? "Register" : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === "allocate" && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Allocate Asset</h3>
              <button className="notification-bell" onClick={() => setActiveModal(null)}><X size={16} /></button>
            </div>
            <form onSubmit={allocateAsset}>
              <div className="form-group">
                <label>Allocate To Employee</label>
                <CustomSelect
                  value={allocateForm.employeeId}
                  onChange={val => setAllocateForm({ ...allocateForm, employeeId: val })}
                  options={employees.map(emp => ({ value: emp.id, label: emp.name }))}
                  placeholder="Select Employee"
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <CustomSelect
                  value={allocateForm.departmentId}
                  onChange={val => setAllocateForm({ ...allocateForm, departmentId: val })}
                  options={departments.map(d => ({ value: d.id, label: d.name }))}
                  placeholder="Select Department"
                />
              </div>
              <div className="form-group">
                <label>Expected Return Date (Optional)</label>
                <input type="date" className="form-control" value={allocateForm.expectedReturnDate} onChange={e => setAllocateForm({ ...allocateForm, expectedReturnDate: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm Allocation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === "transfer" && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Transfer Asset</h3>
              <button className="notification-bell" onClick={() => setActiveModal(null)}><X size={16} /></button>
            </div>
            <form onSubmit={requestTransfer}>
              <div className="form-group">
                <label>Select Target Employee</label>
                <select className="form-control" value={transferForm.targetEmployeeId} onChange={e => setTransferForm({ targetEmployeeId: e.target.value })} required>
                  <option value="">Select Employee</option>
                  {employees.map(emp => emp.id !== user.id && <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Request Transfer</button>
              </div>
            </form>
            {transfers.filter(t => t.assetId === selectedAsset?.id && t.status === "Requested").length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <h4>Pending Transfer Requests</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                  {transfers.filter(t => t.assetId === selectedAsset?.id && t.status === "Requested").map(t => {
                    const fromEmp = employees.find(e => e.id === t.fromEmployeeId);
                    const toEmp = employees.find(e => e.id === t.toEmployeeId);
                    return (
                      <div key={t.id} className="flex-between" style={{ padding: "10px", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                        <span style={{ fontSize: "13px" }}>From {fromEmp?.name} to {toEmp?.name}</span>
                        {(user.role === "Asset Manager" || user.role === "Admin" || user.role === "Department Head") && (
                          <button className="btn btn-primary" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => approveTransfer(t.id)}>
                            Approve
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeModal === "return" && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Return Asset</h3>
              <button className="notification-bell" onClick={() => setActiveModal(null)}><X size={16} /></button>
            </div>
            <form onSubmit={returnAsset}>
              <div className="form-group">
                <label>Condition Notes</label>
                <select className="form-control" value={returnForm.condition} onChange={e => setReturnForm({ ...returnForm, condition: e.target.value })}>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Damaged">Damaged</option>
                </select>
              </div>
              <div className="form-group">
                <label>Check-in Remarks</label>
                <textarea className="form-control" value={returnForm.remarks} onChange={e => setReturnForm({ ...returnForm, remarks: e.target.value })} required />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Process Return</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === "book" && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Book Shared Resource</h3>
              <button className="notification-bell" onClick={() => setActiveModal(null)}><X size={16} /></button>
            </div>
            <form onSubmit={bookResource}>
              <div className="form-group">
                <label>Resource / Space</label>
                <select className="form-control" value={bookingForm.assetId} onChange={e => setBookingForm({ ...bookingForm, assetId: e.target.value })} required>
                  <option value="">Select Resource</option>
                  {assets.filter(a => a.isBookable).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Booking Date</label>
                <input type="date" className="form-control" value={bookingForm.date} onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })} required />
              </div>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label>Start Time</label>
                  <input type="time" className="form-control" value={bookingForm.startTime} onChange={e => setBookingForm({ ...bookingForm, startTime: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input type="time" className="form-control" value={bookingForm.endTime} onChange={e => setBookingForm({ ...bookingForm, endTime: e.target.value })} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === "requestMaintenance" && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Raise Maintenance Request</h3>
              <button className="notification-bell" onClick={() => setActiveModal(null)}><X size={16} /></button>
            </div>
            <form onSubmit={createMaintenanceRequest}>
              <div className="form-group">
                <label>Asset</label>
                <select className="form-control" value={maintenanceForm.assetId} onChange={e => setMaintenanceForm({ ...maintenanceForm, assetId: e.target.value })} required>
                  <option value="">Select Asset</option>
                  {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.tag})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Description of Issue</label>
                <textarea className="form-control" value={maintenanceForm.description} onChange={e => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select className="form-control" value={maintenanceForm.priority} onChange={e => setMaintenanceForm({ ...maintenanceForm, priority: e.target.value })}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === "addAudit" && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Audit Cycle</h3>
              <button className="notification-bell" onClick={() => setActiveModal(null)}><X size={16} /></button>
            </div>
            <form onSubmit={createAuditCycle}>
              <div className="form-group">
                <label>Audit Name</label>
                <input type="text" className="form-control" placeholder="Annual Q3 Electronics Audit" value={auditForm.name} onChange={e => setAuditForm({ ...auditForm, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Scope (Department/Location)</label>
                <input type="text" className="form-control" placeholder="Engineering or HQ Floor 4" value={auditForm.scope} onChange={e => setAuditForm({ ...auditForm, scope: e.target.value })} required />
              </div>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" className="form-control" value={auditForm.startDate} onChange={e => setAuditForm({ ...auditForm, startDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" className="form-control" value={auditForm.endDate} onChange={e => setAuditForm({ ...auditForm, endDate: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Auditors Assigned</label>
                <select className="form-control" multiple value={auditForm.auditors} onChange={e => {
                  const opts = Array.from(e.target.selectedOptions, option => option.value);
                  setAuditForm({ ...auditForm, auditors: opts });
                }}>
                  {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>)}
                </select>
                <span style={{ fontSize: "11px", color: "#8e8d85" }}>Hold Ctrl/Cmd to select multiple</span>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Schedule Audit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === "viewAuditResults" && selectedAudit && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="modal-content" style={{ maxWidth: "700px" }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedAudit.name} - Verification & Discrepancies</h3>
              <button className="notification-bell" onClick={() => setActiveModal(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <h4 style={{ marginBottom: "12px" }}>Verify Scope Assets</h4>
              <div className="table-container" style={{ maxHeight: "250px", overflowY: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Location</th>
                      <th>Audit Status</th>
                      <th>Verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map(asset => {
                      const result = selectedAudit.results[asset.id];
                      return (
                        <tr key={asset.id}>
                          <td>{asset.name} ({asset.tag})</td>
                          <td>{asset.location}</td>
                          <td>
                            <span style={{ fontSize: "12px", color: result ? "#10b981" : "#f59e0b" }}>
                              {result ? `Verified: ${result.status}` : "Pending Verification"}
                            </span>
                          </td>
                          <td>
                            {selectedAudit.status === "Active" && (
                              <div style={{ display: "flex", gap: "4px" }}>
                                <button className="btn btn-primary" style={{ padding: "2px 6px", fontSize: "11px" }} onClick={() => verifyAuditAsset(selectedAudit.id, asset.id, "Verified")}>
                                  Verified
                                </button>
                                <button className="btn btn-secondary" style={{ padding: "2px 6px", fontSize: "11px" }} onClick={() => verifyAuditAsset(selectedAudit.id, asset.id, "Damaged")}>
                                  Damaged
                                </button>
                                <button className="btn btn-danger" style={{ padding: "2px 6px", fontSize: "11px" }} onClick={() => verifyAuditAsset(selectedAudit.id, asset.id, "Missing")}>
                                  Missing
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <h4 style={{ marginTop: "24px", marginBottom: "12px" }}>Discrepancy Report</h4>
              <div style={{ padding: "12px", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.08)", fontSize: "13px" }}>
                {Object.keys(selectedAudit.results).filter(key => selectedAudit.results[key].status !== "Verified").length === 0 ? (
                  <span>No discrepancies found yet.</span>
                ) : (
                  Object.keys(selectedAudit.results).filter(key => selectedAudit.results[key].status !== "Verified").map(key => {
                    const asset = assets.find(a => a.id === key);
                    const res = selectedAudit.results[key];
                    return (
                      <div key={key} style={{ marginBottom: "6px" }}>
                        <strong>{asset?.name} ({asset?.tag}):</strong> Reported as <span style={{ color: "#ef4444" }}>{res.status}</span> by {res.verifiedBy}.
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => setActiveModal(null)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
