import React, { useState, useEffect } from "react";
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

  if (!token) {
    return (
      <div className="auth-wrapper">
        <div className="card auth-card">
          <div className="logo-container" style={{ justifyContent: "center", marginBottom: "20px" }}>
            <BrandLogo />
            <span>WhiteRock</span>
          </div>
          <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
            {authMode === "login" ? "Welcome Back" : "Register Account"}
          </h2>
          {authError && <div style={{ color: "#ef4444", fontSize: "14px", marginBottom: "16px", textAlign: "center" }}>{authError}</div>}
          <form onSubmit={authMode === "login" ? handleLogin : handleSignup}>
            {authMode === "signup" && (
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-full mt-4">
              {authMode === "login" ? "Login" : "Sign Up"}
            </button>
          </form>
          <div className="flex-between mt-4" style={{ fontSize: "13px" }}>
            <span style={{ color: "var(--text-secondary)", cursor: "pointer" }} onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}>
              {authMode === "login" ? "Need an account? Sign Up" : "Already have an account? Login"}
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
            <>
              <div className={`nav-item ${currentTab === "departments" ? "active" : ""}`} onClick={() => setCurrentTab("departments")}>
                <FolderTree size={18} />
                <span>Departments</span>
              </div>
              <div className={`nav-item ${currentTab === "categories" ? "active" : ""}`} onClick={() => setCurrentTab("categories")}>
                <Tags size={18} />
                <span>Categories</span>
              </div>
              <div className={`nav-item ${currentTab === "employees" ? "active" : ""}`} onClick={() => setCurrentTab("employees")}>
                <Users size={18} />
                <span>Directory</span>
              </div>
            </>
          )}
          <div className={`nav-item ${currentTab === "assets" ? "active" : ""}`} onClick={() => setCurrentTab("assets")}>
            <Package size={18} />
            <span>Assets</span>
          </div>
          <div className={`nav-item ${currentTab === "bookings" ? "active" : ""}`} onClick={() => setCurrentTab("bookings")}>
            <Calendar size={18} />
            <span>Bookings</span>
          </div>
          <div className={`nav-item ${currentTab === "maintenance" ? "active" : ""}`} onClick={() => setCurrentTab("maintenance")}>
            <Wrench size={18} />
            <span>Maintenance</span>
          </div>
          <div className={`nav-item ${currentTab === "audits" ? "active" : ""}`} onClick={() => setCurrentTab("audits")}>
            <ShieldAlert size={18} />
            <span>Audits</span>
          </div>
          <div className={`nav-item ${currentTab === "reports" ? "active" : ""}`} onClick={() => setCurrentTab("reports")}>
            <BarChart3 size={18} />
            <span>Analytics</span>
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
            <div className="kpi-grid">
              <div className="card kpi-card">
                <div className="kpi-icon-wrapper" style={{ backgroundColor: "#d97706" }}>
                  <Package size={20} />
                </div>
                <div>
                  <div className="kpi-value">{analytics?.totalAssets || 0}</div>
                  <div className="kpi-label">Total Assets</div>
                </div>
              </div>
              <div className="card kpi-card">
                <div className="kpi-icon-wrapper" style={{ backgroundColor: "#10b981" }}>
                  <Check size={20} />
                </div>
                <div>
                  <div className="kpi-value">{analytics?.availableAssets || 0}</div>
                  <div className="kpi-label">Available</div>
                </div>
              </div>
              <div className="card kpi-card">
                <div className="kpi-icon-wrapper" style={{ backgroundColor: "#06b6d4" }}>
                  <ArrowRightLeft size={20} />
                </div>
                <div>
                  <div className="kpi-value">{analytics?.allocatedAssets || 0}</div>
                  <div className="kpi-label">Allocated</div>
                </div>
              </div>
              <div className="card kpi-card">
                <div className="kpi-icon-wrapper" style={{ backgroundColor: "#f59e0b" }}>
                  <Wrench size={20} />
                </div>
                <div>
                  <div className="kpi-value">{analytics?.maintenanceAssets || 0}</div>
                  <div className="kpi-label">Maintenance</div>
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

        {currentTab === "departments" && user.role === "Admin" && (
          <div className="card">
            <div className="flex-between mb-4">
              <h3>Organization Departments</h3>
              <button className="btn btn-primary" onClick={() => setActiveModal("addDept")}>
                <Plus size={16} /> Add Department
              </button>
            </div>
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
          </div>
        )}

        {currentTab === "categories" && user.role === "Admin" && (
          <div className="card">
            <div className="flex-between mb-4">
              <h3>Asset Categories</h3>
              <button className="btn btn-primary" onClick={() => setActiveModal("addCat")}>
                <Plus size={16} /> Add Category
              </button>
            </div>
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
          </div>
        )}

        {currentTab === "employees" && user.role === "Admin" && (
          <div className="card">
            <h3>Employee Directory & Role Promotion</h3>
            <div className="table-container mt-4">
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

        {currentTab === "bookings" && (
          <div>
            <div className="card mb-4">
              <div className="flex-between">
                <h3>Shared Resource Booking</h3>
                <button className="btn btn-primary" onClick={() => setActiveModal("book")}>
                  <Plus size={16} /> Book Shared Resource
                </button>
              </div>
              <div className="calendar-grid">
                <div className="calendar-day-header">Sun</div>
                <div className="calendar-day-header">Mon</div>
                <div className="calendar-day-header">Tue</div>
                <div className="calendar-day-header">Wed</div>
                <div className="calendar-day-header">Thu</div>
                <div className="calendar-day-header">Fri</div>
                <div className="calendar-day-header">Sat</div>

                {Array.from({ length: 35 }).map((_, idx) => {
                  const day = idx + 1 - 4;
                  const dateStr = `2026-07-${String(day).padStart(2, "0")}`;
                  const dayBookings = bookings.filter(b => b.date === dateStr);
                  const isToday = day === 12;

                  return (
                    <div key={idx} className={`calendar-day ${isToday ? "today" : ""}`}>
                      <span className="calendar-day-number">{day > 0 && day <= 31 ? day : ""}</span>
                      {day > 0 && day <= 31 && dayBookings.map(b => {
                        const res = assets.find(a => a.id === b.assetId);
                        return (
                          <div key={b.id} className="calendar-booking-indicator" style={{ backgroundColor: b.status === "Cancelled" ? "#ef4444" : "#d97706" }}>
                            {b.startTime} - {res?.name || "Resource"}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <h3>All Bookings List</h3>
              <div className="table-container mt-4">
                <table>
                  <thead>
                    <tr>
                      <th>Resource</th>
                      <th>Booked By</th>
                      <th>Date</th>
                      <th>Time Slot</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => {
                      const res = assets.find(a => a.id === b.assetId);
                      const employee = employees.find(e => e.id === b.employeeId);
                      const isOwner = b.employeeId === user.id;
                      return (
                        <tr key={b.id}>
                          <td>{res ? `${res.name} (${res.tag})` : "Unknown"}</td>
                          <td>{employee ? employee.name : "Employee"}</td>
                          <td>{b.date}</td>
                          <td>{b.startTime} - {b.endTime}</td>
                          <td>
                            <span className={`status-badge ${b.status.toLowerCase()}`}>
                              {b.status}
                            </span>
                          </td>
                          <td>
                            {(isOwner || user.role === "Admin") && b.status === "Upcoming" && (
                              <button className="btn btn-danger" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => updateBookingStatus(b.id, "Cancelled")}>
                                Cancel Booking
                              </button>
                            )}
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

        {currentTab === "maintenance" && (
          <div>
            <div className="card mb-4">
              <div className="flex-between">
                <h3>Maintenance Workflows</h3>
                <button className="btn btn-primary" onClick={() => {
                  setMaintenanceForm({ assetId: assets[0]?.id || "", description: "", priority: "Medium" });
                  setActiveModal("requestMaintenance");
                }}>
                  <Plus size={16} /> Raise Request
                </button>
              </div>
            </div>

            <div className="card">
              <h3>Maintenance Tickets</h3>
              <div className="table-container mt-4">
                <table>
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Requested By</th>
                      <th>Description</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Technician</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenance.map(m => {
                      const asset = assets.find(a => a.id === m.assetId);
                      const employee = employees.find(e => e.id === m.employeeId);
                      return (
                        <tr key={m.id}>
                          <td>{asset ? `${asset.name} (${asset.tag})` : "Unknown"}</td>
                          <td>{employee ? employee.name : "Employee"}</td>
                          <td>{m.description}</td>
                          <td>{m.priority}</td>
                          <td>
                            <span className={`status-badge ${m.status.toLowerCase()}`}>
                              {m.status}
                            </span>
                          </td>
                          <td>{m.technician || "Unassigned"}</td>
                          <td>
                            <div style={{ display: "flex", gap: "8px" }}>
                              {m.status === "Pending" && (user.role === "Asset Manager" || user.role === "Admin") && (
                                <>
                                  <button className="btn btn-primary" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => updateMaintenanceStatus(m.id, "Approved", "Tech-In-Charge")}>
                                    Approve & Assign
                                  </button>
                                  <button className="btn btn-danger" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => updateMaintenanceStatus(m.id, "Rejected")}>
                                    Reject
                                  </button>
                                </>
                              )}
                              {m.status === "Approved" && (user.role === "Asset Manager" || user.role === "Admin") && (
                                <button className="btn btn-primary" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => updateMaintenanceStatus(m.id, "Resolved")}>
                                  Mark Resolved
                                </button>
                              )}
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
                  <select className="form-control" value={assetForm.category} onChange={e => setAssetForm({ ...assetForm, category: e.target.value })} required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
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
                  <select className="form-control" value={assetForm.condition} onChange={e => setAssetForm({ ...assetForm, condition: e.target.value })}>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Damaged">Damaged</option>
                  </select>
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
                <select className="form-control" value={allocateForm.employeeId} onChange={e => setAllocateForm({ ...allocateForm, employeeId: e.target.value })} required>
                  <option value="">Select Employee</option>
                  {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Department</label>
                <select className="form-control" value={allocateForm.departmentId} onChange={e => setAllocateForm({ ...allocateForm, departmentId: e.target.value })}>
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
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
