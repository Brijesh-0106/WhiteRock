const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;
const SECRET = "assetflow_secret_key";
const DB_PATH = path.join(__dirname, "db.json");

app.use(cors());
app.use(express.json());

const initDb = {
  users: [
    {
      id: "u-1",
      email: "admin@assetflow.com",
      password: "admin123",
      name: "Admin User",
      role: "Admin",
      departmentId: "",
      status: "Active"
    },
    {
      id: "u-2",
      email: "manager@assetflow.com",
      password: "password123",
      name: "John Manager",
      role: "Asset Manager",
      departmentId: "d-1",
      status: "Active"
    },
    {
      id: "u-3",
      email: "head@assetflow.com",
      password: "password123",
      name: "Sarah Head",
      role: "Department Head",
      departmentId: "d-1",
      status: "Active"
    },
    {
      id: "u-4",
      email: "employee@assetflow.com",
      password: "password123",
      name: "Alice Employee",
      role: "Employee",
      departmentId: "d-1",
      status: "Active"
    }
  ],
  departments: [
    {
      id: "d-1",
      name: "Engineering",
      parentId: "",
      headId: "u-3",
      status: "Active"
    },
    {
      id: "d-2",
      name: "Operations",
      parentId: "",
      headId: "",
      status: "Active"
    }
  ],
  categories: [
    {
      id: "c-1",
      name: "Electronics",
      fields: ["Warranty Period", "RAM", "Storage"]
    },
    {
      id: "c-2",
      name: "Furniture",
      fields: ["Material", "Dimensions"]
    },
    {
      id: "c-3",
      name: "Vehicles",
      fields: ["License Plate", "Model Year"]
    }
  ],
  assets: [
    {
      id: "a-1",
      tag: "AF-0001",
      name: "MacBook Pro",
      category: "Electronics",
      serialNumber: "SN-98765",
      acquisitionDate: "2026-01-10",
      acquisitionCost: 1500,
      condition: "Excellent",
      location: "HQ Room 401",
      isBookable: false,
      status: "Allocated",
      departmentId: "d-1",
      employeeId: "u-4",
      expectedReturnDate: "2026-08-10",
      customFields: { "Warranty Period": "3 Years", "RAM": "16GB", "Storage": "512GB SSD" }
    },
    {
      id: "a-2",
      tag: "AF-0002",
      name: "Dell Monitor 27",
      category: "Electronics",
      serialNumber: "SN-43210",
      acquisitionDate: "2026-02-15",
      acquisitionCost: 300,
      condition: "Good",
      location: "HQ Room 402",
      isBookable: false,
      status: "Available",
      departmentId: "",
      employeeId: "",
      expectedReturnDate: "",
      customFields: { "Warranty Period": "2 Years", "RAM": "N/A", "Storage": "N/A" }
    },
    {
      id: "a-3",
      tag: "AF-0003",
      name: "Conference Room A",
      category: "Furniture",
      serialNumber: "SN-RM-A",
      acquisitionDate: "2026-01-01",
      acquisitionCost: 5000,
      condition: "Excellent",
      location: "HQ Floor 1",
      isBookable: true,
      status: "Available",
      departmentId: "",
      employeeId: "",
      expectedReturnDate: "",
      customFields: { "Material": "Glass and Wood", "Dimensions": "20x15 ft" }
    }
  ],
  allocations: [
    {
      id: "al-1",
      assetId: "a-1",
      employeeId: "u-4",
      departmentId: "d-1",
      allocatedAt: "2026-01-10",
      expectedReturnDate: "2026-08-10",
      returnedAt: "",
      returnCondition: "",
      returnRemarks: "",
      status: "Active"
    }
  ],
  transfers: [],
  bookings: [
    {
      id: "b-1",
      assetId: "a-3",
      employeeId: "u-4",
      date: "2026-07-15",
      startTime: "09:00",
      endTime: "10:00",
      status: "Upcoming"
    }
  ],
  maintenance: [],
  audits: [],
  notifications: [],
  logs: [
    {
      id: "l-1",
      userId: "u-1",
      userName: "Admin User",
      action: "System initialized",
      timestamp: "2026-07-12T11:00:00.000Z"
    }
  ]
};

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(initDb, null, 2));
    return initDb;
  }
  try {
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return initDb;
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function logAction(userId, userName, action) {
  const db = readDb();
  const newLog = {
    id: `l-${Date.now()}`,
    userId,
    userName,
    action,
    timestamp: new Date().toISOString()
  };
  db.logs.push(newLog);
  writeDb(db);
}

function notifyUser(userId, message) {
  const db = readDb();
  const notification = {
    id: `n-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    userId,
    message,
    read: false,
    createdAt: new Date().toISOString()
  };
  db.notifications.push(notification);
  writeDb(db);
}

function authMiddleware(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }
  try {
    const verified = jwt.verify(token, SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
}

app.post("/api/auth/signup", (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const db = readDb();
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }
  const newUser = {
    id: `u-${Date.now()}`,
    email,
    password,
    name,
    role: "Employee",
    departmentId: "",
    status: "Active"
  };
  db.users.push(newUser);
  writeDb(db);
  logAction(newUser.id, newUser.name, "User signed up as Employee");
  const token = jwt.sign({ id: newUser.id, role: newUser.role, name: newUser.name }, SECRET);
  res.json({ token, user: newUser });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const db = readDb();
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  if (user.status !== "Active") {
    return res.status(400).json({ error: "User account is inactive" });
  }
  const token = jwt.sign({ id: user.id, role: user.role, name: user.name, departmentId: user.departmentId }, SECRET);
  logAction(user.id, user.name, "User logged in");
  res.json({ token, user });
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  const db = readDb();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  const db = readDb();
  const user = db.users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ error: "Email not registered" });
  }
  res.json({ message: `Password reset instructions sent to ${email}` });
});

app.get("/api/departments", authMiddleware, (req, res) => {
  const db = readDb();
  res.json(db.departments);
});

app.post("/api/departments", authMiddleware, (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  const { name, parentId, headId } = req.body;
  const db = readDb();
  const newDept = {
    id: `d-${Date.now()}`,
    name,
    parentId: parentId || "",
    headId: headId || "",
    status: "Active"
  };
  db.departments.push(newDept);
  writeDb(db);
  logAction(req.user.id, req.user.name, `Created department ${name}`);
  res.json(newDept);
});

app.put("/api/departments/:id", authMiddleware, (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  const { name, parentId, headId, status } = req.body;
  const db = readDb();
  const deptIndex = db.departments.findIndex(d => d.id === req.params.id);
  if (deptIndex === -1) {
    return res.status(404).json({ error: "Department not found" });
  }
  db.departments[deptIndex] = {
    ...db.departments[deptIndex],
    name: name !== undefined ? name : db.departments[deptIndex].name,
    parentId: parentId !== undefined ? parentId : db.departments[deptIndex].parentId,
    headId: headId !== undefined ? headId : db.departments[deptIndex].headId,
    status: status !== undefined ? status : db.departments[deptIndex].status
  };
  writeDb(db);
  logAction(req.user.id, req.user.name, `Updated department ${db.departments[deptIndex].name}`);
  res.json(db.departments[deptIndex]);
});

app.get("/api/categories", authMiddleware, (req, res) => {
  const db = readDb();
  res.json(db.categories);
});

app.post("/api/categories", authMiddleware, (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  const { name, fields } = req.body;
  const db = readDb();
  const newCat = {
    id: `c-${Date.now()}`,
    name,
    fields: fields || []
  };
  db.categories.push(newCat);
  writeDb(db);
  logAction(req.user.id, req.user.name, `Created asset category ${name}`);
  res.json(newCat);
});

app.get("/api/employees", authMiddleware, (req, res) => {
  const db = readDb();
  const usersClean = db.users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    departmentId: u.departmentId,
    status: u.status
  }));
  res.json(usersClean);
});

app.put("/api/employees/:id/role", authMiddleware, (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  const { role, departmentId, status } = req.body;
  const db = readDb();
  const userIndex = db.users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: "Employee not found" });
  }
  db.users[userIndex] = {
    ...db.users[userIndex],
    role: role !== undefined ? role : db.users[userIndex].role,
    departmentId: departmentId !== undefined ? departmentId : db.users[userIndex].departmentId,
    status: status !== undefined ? status : db.users[userIndex].status
  };
  writeDb(db);
  logAction(req.user.id, req.user.name, `Updated user ${db.users[userIndex].name} role to ${db.users[userIndex].role}`);
  notifyUser(req.params.id, `Your role/status has been updated to ${db.users[userIndex].role}`);
  res.json(db.users[userIndex]);
});

app.get("/api/assets", authMiddleware, (req, res) => {
  const db = readDb();
  res.json(db.assets);
});

app.post("/api/assets", authMiddleware, (req, res) => {
  if (req.user.role !== "Asset Manager" && req.user.role !== "Admin") {
    return res.status(403).json({ error: "Asset Manager or Admin only" });
  }
  const { name, category, serialNumber, acquisitionDate, acquisitionCost, condition, location, isBookable, customFields } = req.body;
  const db = readDb();
  const tagNum = String(db.assets.length + 1).padStart(4, "0");
  const tag = `AF-${tagNum}`;
  const newAsset = {
    id: `a-${Date.now()}`,
    tag,
    name,
    category,
    serialNumber,
    acquisitionDate,
    acquisitionCost: Number(acquisitionCost),
    condition,
    location,
    isBookable: !!isBookable,
    status: "Available",
    departmentId: "",
    employeeId: "",
    expectedReturnDate: "",
    customFields: customFields || {}
  };
  db.assets.push(newAsset);
  writeDb(db);
  logAction(req.user.id, req.user.name, `Registered asset ${name} (${tag})`);
  res.json(newAsset);
});

app.get("/api/assets/:id", authMiddleware, (req, res) => {
  const db = readDb();
  const asset = db.assets.find(a => a.id === req.params.id);
  if (!asset) {
    return res.status(404).json({ error: "Asset not found" });
  }
  res.json(asset);
});

app.put("/api/assets/:id", authMiddleware, (req, res) => {
  if (req.user.role !== "Asset Manager" && req.user.role !== "Admin") {
    return res.status(403).json({ error: "Asset Manager or Admin only" });
  }
  const db = readDb();
  const index = db.assets.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Asset not found" });
  }
  db.assets[index] = {
    ...db.assets[index],
    ...req.body
  };
  writeDb(db);
  logAction(req.user.id, req.user.name, `Updated asset ${db.assets[index].name} (${db.assets[index].tag})`);
  res.json(db.assets[index]);
});

app.post("/api/assets/allocate", authMiddleware, (req, res) => {
  if (req.user.role !== "Asset Manager" && req.user.role !== "Admin") {
    return res.status(403).json({ error: "Asset Manager or Admin only" });
  }
  const { assetId, employeeId, departmentId, expectedReturnDate } = req.body;
  const db = readDb();
  const assetIndex = db.assets.findIndex(a => a.id === assetId);
  if (assetIndex === -1) {
    return res.status(404).json({ error: "Asset not found" });
  }
  const asset = db.assets[assetIndex];
  if (asset.status !== "Available") {
    return res.status(400).json({ error: `Asset is currently ${asset.status}`, holder: asset.employeeId });
  }
  db.assets[assetIndex].status = "Allocated";
  db.assets[assetIndex].employeeId = employeeId || "";
  db.assets[assetIndex].departmentId = departmentId || "";
  db.assets[assetIndex].expectedReturnDate = expectedReturnDate || "";

  const allocation = {
    id: `al-${Date.now()}`,
    assetId,
    employeeId: employeeId || "",
    departmentId: departmentId || "",
    allocatedAt: new Date().toISOString().split("T")[0],
    expectedReturnDate: expectedReturnDate || "",
    returnedAt: "",
    returnCondition: "",
    returnRemarks: "",
    status: "Active"
  };
  db.allocations.push(allocation);
  writeDb(db);
  logAction(req.user.id, req.user.name, `Allocated asset ${asset.name} (${asset.tag})`);
  if (employeeId) {
    notifyUser(employeeId, `Asset ${asset.name} has been allocated to you.`);
  }
  res.json(db.assets[assetIndex]);
});

app.post("/api/assets/request-transfer", authMiddleware, (req, res) => {
  const { assetId, targetEmployeeId } = req.body;
  const db = readDb();
  const asset = db.assets.find(a => a.id === assetId);
  if (!asset) {
    return res.status(404).json({ error: "Asset not found" });
  }
  const newTransfer = {
    id: `tr-${Date.now()}`,
    assetId,
    fromEmployeeId: asset.employeeId,
    toEmployeeId: targetEmployeeId,
    status: "Requested",
    requestedAt: new Date().toISOString()
  };
  db.transfers.push(newTransfer);
  writeDb(db);
  logAction(req.user.id, req.user.name, `Requested transfer of asset ${asset.name} (${asset.tag})`);
  const assetManager = db.users.find(u => u.role === "Asset Manager");
  if (assetManager) {
    notifyUser(assetManager.id, `Transfer request for ${asset.name} from ${req.user.name}`);
  }
  res.json(newTransfer);
});

app.get("/api/transfers", authMiddleware, (req, res) => {
  const db = readDb();
  res.json(db.transfers);
});

app.post("/api/transfers/:id/approve", authMiddleware, (req, res) => {
  const db = readDb();
  const trIndex = db.transfers.findIndex(t => t.id === req.params.id);
  if (trIndex === -1) {
    return res.status(404).json({ error: "Transfer request not found" });
  }
  const transfer = db.transfers[trIndex];
  const assetIndex = db.assets.findIndex(a => a.id === transfer.assetId);
  if (assetIndex === -1) {
    return res.status(404).json({ error: "Asset not found" });
  }
  const asset = db.assets[assetIndex];

  db.transfers[trIndex].status = "Approved";
  db.transfers[trIndex].approvedAt = new Date().toISOString();

  db.assets[assetIndex].employeeId = transfer.toEmployeeId;
  db.assets[assetIndex].status = "Allocated";

  const activeAlloc = db.allocations.find(a => a.assetId === transfer.assetId && a.status === "Active");
  if (activeAlloc) {
    activeAlloc.status = "Transferred";
    activeAlloc.returnedAt = new Date().toISOString().split("T")[0];
  }

  const newAlloc = {
    id: `al-${Date.now()}`,
    assetId: transfer.assetId,
    employeeId: transfer.toEmployeeId,
    departmentId: asset.departmentId,
    allocatedAt: new Date().toISOString().split("T")[0],
    expectedReturnDate: asset.expectedReturnDate,
    returnedAt: "",
    returnCondition: "",
    returnRemarks: "",
    status: "Active"
  };
  db.allocations.push(newAlloc);
  writeDb(db);
  logAction(req.user.id, req.user.name, `Approved transfer for asset ${asset.name} (${asset.tag})`);
  notifyUser(transfer.toEmployeeId, `Transfer of ${asset.name} to you has been approved.`);
  notifyUser(transfer.fromEmployeeId, `Transfer of ${asset.name} has been approved.`);
  res.json(db.transfers[trIndex]);
});

app.post("/api/assets/return", authMiddleware, (req, res) => {
  const { assetId, condition, remarks } = req.body;
  const db = readDb();
  const assetIndex = db.assets.findIndex(a => a.id === assetId);
  if (assetIndex === -1) {
    return res.status(404).json({ error: "Asset not found" });
  }
  const asset = db.assets[assetIndex];
  const activeAllocIndex = db.allocations.findIndex(a => a.assetId === assetId && a.status === "Active");
  if (activeAllocIndex !== -1) {
    db.allocations[activeAllocIndex].status = "Returned";
    db.allocations[activeAllocIndex].returnedAt = new Date().toISOString().split("T")[0];
    db.allocations[activeAllocIndex].returnCondition = condition;
    db.allocations[activeAllocIndex].returnRemarks = remarks;
  }
  db.assets[assetIndex].status = "Available";
  db.assets[assetIndex].employeeId = "";
  db.assets[assetIndex].departmentId = "";
  db.assets[assetIndex].expectedReturnDate = "";

  writeDb(db);
  logAction(req.user.id, req.user.name, `Returned asset ${asset.name} (${asset.tag})`);
  const manager = db.users.find(u => u.role === "Asset Manager");
  if (manager) {
    notifyUser(manager.id, `Asset ${asset.name} has been returned by ${req.user.name}`);
  }
  res.json(db.assets[assetIndex]);
});

app.get("/api/bookings", authMiddleware, (req, res) => {
  const db = readDb();
  res.json(db.bookings);
});

app.post("/api/bookings", authMiddleware, (req, res) => {
  const { assetId, date, startTime, endTime } = req.body;
  const db = readDb();
  const asset = db.assets.find(a => a.id === assetId);
  if (!asset) {
    return res.status(404).json({ error: "Resource not found" });
  }
  if (!asset.isBookable) {
    return res.status(400).json({ error: "Asset is not shared or bookable" });
  }
  const conflicts = db.bookings.filter(b =>
    b.assetId === assetId &&
    b.date === date &&
    b.status !== "Cancelled" &&
    ((startTime >= b.startTime && startTime < b.endTime) ||
      (endTime > b.startTime && endTime <= b.endTime) ||
      (startTime <= b.startTime && endTime >= b.endTime))
  );
  if (conflicts.length > 0) {
    return res.status(400).json({ error: "Time slot overlaps with an existing booking" });
  }
  const newBooking = {
    id: `b-${Date.now()}`,
    assetId,
    employeeId: req.user.id,
    date,
    startTime,
    endTime,
    status: "Upcoming"
  };
  db.bookings.push(newBooking);
  writeDb(db);
  logAction(req.user.id, req.user.name, `Booked resource ${asset.name} on ${date} ${startTime}-${endTime}`);
  res.json(newBooking);
});

app.put("/api/bookings/:id/status", authMiddleware, (req, res) => {
  const { status } = req.body;
  const db = readDb();
  const bookingIndex = db.bookings.findIndex(b => b.id === req.params.id);
  if (bookingIndex === -1) {
    return res.status(404).json({ error: "Booking not found" });
  }
  db.bookings[bookingIndex].status = status;
  writeDb(db);
  logAction(req.user.id, req.user.name, `Updated booking ${req.params.id} to ${status}`);
  res.json(db.bookings[bookingIndex]);
});

app.get("/api/maintenance", authMiddleware, (req, res) => {
  const db = readDb();
  res.json(db.maintenance);
});

app.post("/api/maintenance", authMiddleware, (req, res) => {
  const { assetId, description, priority } = req.body;
  const db = readDb();
  const asset = db.assets.find(a => a.id === assetId);
  if (!asset) {
    return res.status(404).json({ error: "Asset not found" });
  }
  const newRequest = {
    id: `m-${Date.now()}`,
    assetId,
    employeeId: req.user.id,
    description,
    priority,
    status: "Pending",
    technician: "",
    resolvedAt: ""
  };
  db.maintenance.push(newRequest);
  writeDb(db);
  logAction(req.user.id, req.user.name, `Raised maintenance request for ${asset.name}`);
  const manager = db.users.find(u => u.role === "Asset Manager");
  if (manager) {
    notifyUser(manager.id, `New maintenance request for ${asset.name} (${priority})`);
  }
  res.json(newRequest);
});

app.put("/api/maintenance/:id/status", authMiddleware, (req, res) => {
  const { status, technician } = req.body;
  const db = readDb();
  const mIndex = db.maintenance.findIndex(m => m.id === req.params.id);
  if (mIndex === -1) {
    return res.status(404).json({ error: "Maintenance request not found" });
  }
  const reqMaintenance = db.maintenance[mIndex];
  const assetIndex = db.assets.findIndex(a => a.id === reqMaintenance.assetId);

  db.maintenance[mIndex].status = status;
  if (technician) {
    db.maintenance[mIndex].technician = technician;
  }

  if (status === "Approved") {
    if (assetIndex !== -1) {
      db.assets[assetIndex].status = "Under Maintenance";
    }
  } else if (status === "Resolved") {
    db.maintenance[mIndex].resolvedAt = new Date().toISOString();
    if (assetIndex !== -1) {
      db.assets[assetIndex].status = "Available";
    }
  }
  writeDb(db);
  logAction(req.user.id, req.user.name, `Updated maintenance request ${req.params.id} to ${status}`);
  notifyUser(reqMaintenance.employeeId, `Maintenance request for asset has been ${status}.`);
  res.json(db.maintenance[mIndex]);
});

app.get("/api/audits", authMiddleware, (req, res) => {
  const db = readDb();
  res.json(db.audits);
});

app.post("/api/audits", authMiddleware, (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  const { name, scope, startDate, endDate, auditors } = req.body;
  const db = readDb();
  const newAudit = {
    id: `au-${Date.now()}`,
    name,
    scope,
    startDate,
    endDate,
    auditors: auditors || [],
    status: "Active",
    results: {}
  };
  db.audits.push(newAudit);
  writeDb(db);
  logAction(req.user.id, req.user.name, `Created audit cycle ${name}`);
  (auditors || []).forEach(auditorId => {
    notifyUser(auditorId, `You have been assigned to audit cycle ${name}`);
  });
  res.json(newAudit);
});

app.put("/api/audits/:id/verify", authMiddleware, (req, res) => {
  const { assetId, verificationStatus } = req.body;
  const db = readDb();
  const auditIndex = db.audits.findIndex(a => a.id === req.params.id);
  if (auditIndex === -1) {
    return res.status(404).json({ error: "Audit not found" });
  }
  db.audits[auditIndex].results[assetId] = {
    status: verificationStatus,
    verifiedBy: req.user.name,
    verifiedAt: new Date().toISOString()
  };
  writeDb(db);
  logAction(req.user.id, req.user.name, `Verified asset ${assetId} in audit ${req.params.id}`);
  res.json(db.audits[auditIndex]);
});

app.put("/api/audits/:id/close", authMiddleware, (req, res) => {
  const db = readDb();
  const auditIndex = db.audits.findIndex(a => a.id === req.params.id);
  if (auditIndex === -1) {
    return res.status(404).json({ error: "Audit not found" });
  }
  db.audits[auditIndex].status = "Completed";
  const results = db.audits[auditIndex].results;
  Object.keys(results).forEach(assetId => {
    const assetStatus = results[assetId].status;
    const assetIndex = db.assets.findIndex(a => a.id === assetId);
    if (assetIndex !== -1) {
      if (assetStatus === "Missing") {
        db.assets[assetIndex].status = "Lost";
      } else if (assetStatus === "Damaged") {
        db.assets[assetIndex].condition = "Damaged";
      }
    }
  });
  writeDb(db);
  logAction(req.user.id, req.user.name, `Closed audit cycle ${db.audits[auditIndex].name}`);
  res.json(db.audits[auditIndex]);
});

app.get("/api/analytics", authMiddleware, (req, res) => {
  const db = readDb();
  const totalAssets = db.assets.length;
  const allocatedAssets = db.assets.filter(a => a.status === "Allocated").length;
  const availableAssets = db.assets.filter(a => a.status === "Available").length;
  const maintenanceAssets = db.assets.filter(a => a.status === "Under Maintenance").length;
  const lostAssets = db.assets.filter(a => a.status === "Lost").length;

  const categoryCounts = {};
  db.assets.forEach(a => {
    categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
  });

  const departmentCounts = {};
  db.assets.forEach(a => {
    if (a.departmentId) {
      const dept = db.departments.find(d => d.id === a.departmentId);
      const name = dept ? dept.name : "Unknown";
      departmentCounts[name] = (departmentCounts[name] || 0) + 1;
    }
  });

  const maintenanceHistory = db.maintenance.length;
  res.json({
    totalAssets,
    allocatedAssets,
    availableAssets,
    maintenanceAssets,
    lostAssets,
    categoryCounts,
    departmentCounts,
    maintenanceHistory
  });
});

app.get("/api/notifications", authMiddleware, (req, res) => {
  const db = readDb();
  const userNotifications = db.notifications.filter(n => n.userId === req.user.id);
  res.json(userNotifications);
});

app.put("/api/notifications/:id/read", authMiddleware, (req, res) => {
  const db = readDb();
  const index = db.notifications.findIndex(n => n.id === req.params.id);
  if (index !== -1) {
    db.notifications[index].read = true;
    writeDb(db);
  }
  res.json({ success: true });
});

app.get("/api/logs", authMiddleware, (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  const db = readDb();
  res.json(db.logs);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
