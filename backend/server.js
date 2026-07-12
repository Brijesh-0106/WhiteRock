const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;
const SECRET = "assetflow_secret_key";
const DB_PATH = path.join(__dirname, "db.json");
const MONGODB_URI = "mongodb+srv://phenomenal:Phenomenal@cluster0.9ubnr8w.mongodb.net/WhiteRock";

app.use(cors());
app.use(express.json());

// MongoDB Schema Definitions
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  departmentId: { type: String, default: "" },
  status: { type: String, default: "Active" }
});
const User = mongoose.model("User", userSchema);

const departmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  parentId: { type: String, default: "" },
  headId: { type: String, default: "" },
  status: { type: String, default: "Active" }
});
const Department = mongoose.model("Department", departmentSchema);

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  fields: [{ type: String }]
});
const Category = mongoose.model("Category", categorySchema);

const assetSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  tag: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  serialNumber: { type: String, required: true },
  acquisitionDate: { type: String, required: true },
  acquisitionCost: { type: Number, required: true },
  condition: { type: String, required: true },
  location: { type: String, required: true },
  isBookable: { type: Boolean, default: false },
  status: { type: String, default: "Available" },
  departmentId: { type: String, default: "" },
  employeeId: { type: String, default: "" },
  expectedReturnDate: { type: String, default: "" },
  customFields: { type: Map, of: String, default: {} }
});
const Asset = mongoose.model("Asset", assetSchema);

const allocationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  assetId: { type: String, required: true },
  employeeId: { type: String, default: "" },
  departmentId: { type: String, default: "" },
  allocatedAt: { type: String, required: true },
  expectedReturnDate: { type: String, default: "" },
  returnedAt: { type: String, default: "" },
  returnCondition: { type: String, default: "" },
  returnRemarks: { type: String, default: "" },
  status: { type: String, default: "Active" }
});
const Allocation = mongoose.model("Allocation", allocationSchema);

const transferSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  assetId: { type: String, required: true },
  fromEmployeeId: { type: String, default: "" },
  toEmployeeId: { type: String, default: "" },
  status: { type: String, default: "Requested" },
  requestedAt: { type: String, required: true },
  approvedAt: { type: String, default: "" }
});
const Transfer = mongoose.model("Transfer", transferSchema);

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  assetId: { type: String, required: true },
  employeeId: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, default: "Upcoming" }
});
const Booking = mongoose.model("Booking", bookingSchema);

const maintenanceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  assetId: { type: String, required: true },
  employeeId: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, default: "Medium" },
  status: { type: String, default: "Pending" },
  technician: { type: String, default: "" },
  resolvedAt: { type: String, default: "" }
});
const Maintenance = mongoose.model("Maintenance", maintenanceSchema);

const auditSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  scope: { type: String, default: "All" },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  auditors: [{ type: String }],
  status: { type: String, default: "Active" },
  results: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} }
});
const Audit = mongoose.model("Audit", auditSchema);

const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: String, required: true }
});
const Notification = mongoose.model("Notification", notificationSchema);

const logSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  action: { type: String, required: true },
  timestamp: { type: String, required: true }
});
const Log = mongoose.model("Log", logSchema);

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

// Database Seeding Logic
async function seedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("Database empty. Seeding initial data from db.json...");
      let dbData = initDb;
      if (fs.existsSync(DB_PATH)) {
        try {
          const raw = fs.readFileSync(DB_PATH, "utf8");
          dbData = JSON.parse(raw);
        } catch (e) {
          console.error("Failed to read db.json, using default initDb");
        }
      }
      if (dbData.users && dbData.users.length > 0) await User.insertMany(dbData.users);
      if (dbData.departments && dbData.departments.length > 0) await Department.insertMany(dbData.departments);
      if (dbData.categories && dbData.categories.length > 0) await Category.insertMany(dbData.categories);
      if (dbData.assets && dbData.assets.length > 0) await Asset.insertMany(dbData.assets);
      if (dbData.allocations && dbData.allocations.length > 0) await Allocation.insertMany(dbData.allocations);
      if (dbData.bookings && dbData.bookings.length > 0) await Booking.insertMany(dbData.bookings);
      if (dbData.logs && dbData.logs.length > 0) await Log.insertMany(dbData.logs);
      if (dbData.transfers && dbData.transfers.length > 0) await Transfer.insertMany(dbData.transfers);
      if (dbData.maintenance && dbData.maintenance.length > 0) await Maintenance.insertMany(dbData.maintenance);
      if (dbData.audits && dbData.audits.length > 0) await Audit.insertMany(dbData.audits);
      if (dbData.notifications && dbData.notifications.length > 0) await Notification.insertMany(dbData.notifications);
      console.log("Seeding completed successfully.");
    }
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    seedDatabase();
  })
  .catch(err => console.error("MongoDB connection error:", err));

async function logAction(userId, userName, action) {
  try {
    const newLog = new Log({
      id: `l-${Date.now()}`,
      userId,
      userName,
      action,
      timestamp: new Date().toISOString()
    });
    await newLog.save();
  } catch (err) {
    console.error("Failed to log action:", err);
  }
}

async function notifyUser(userId, message) {
  try {
    const notification = new Notification({
      id: `n-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId,
      message,
      read: false,
      createdAt: new Date().toISOString()
    });
    await notification.save();
  } catch (err) {
    console.error("Failed to notify user:", err);
  }
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

// API Routes
app.post("/api/auth/signup", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing fields" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const newUser = new User({
      id: `u-${Date.now()}`,
      email,
      password,
      name,
      role: "Employee",
      departmentId: "",
      status: "Active"
    });
    await newUser.save();
    await logAction(newUser.id, newUser.name, "User signed up as Employee");
    const token = jwt.sign({ id: newUser.id, role: newUser.role, name: newUser.name }, SECRET);
    res.json({ token, user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    if (user.status !== "Active") {
      return res.status(400).json({ error: "User account is inactive" });
    }
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name, departmentId: user.departmentId }, SECRET);
    await logAction(user.id, user.name, "User logged in");
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email not registered" });
    }
    res.json({ message: `Password reset instructions sent to ${email}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/departments", authMiddleware, async (req, res) => {
  try {
    const depts = await Department.find();
    res.json(depts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/departments", authMiddleware, async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  const { name, parentId, headId } = req.body;
  try {
    const newDept = new Department({
      id: `d-${Date.now()}`,
      name,
      parentId: parentId || "",
      headId: headId || "",
      status: "Active"
    });
    await newDept.save();
    await logAction(req.user.id, req.user.name, `Created department ${name}`);
    res.json(newDept);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/departments/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  const { name, parentId, headId, status } = req.body;
  try {
    const dept = await Department.findOne({ id: req.params.id });
    if (!dept) {
      return res.status(404).json({ error: "Department not found" });
    }
    if (name !== undefined) dept.name = name;
    if (parentId !== undefined) dept.parentId = parentId;
    if (headId !== undefined) dept.headId = headId;
    if (status !== undefined) dept.status = status;
    await dept.save();
    await logAction(req.user.id, req.user.name, `Updated department ${dept.name}`);
    res.json(dept);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/categories", authMiddleware, async (req, res) => {
  try {
    const cats = await Category.find();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/categories", authMiddleware, async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  const { name, fields } = req.body;
  try {
    const newCat = new Category({
      id: `c-${Date.now()}`,
      name,
      fields: fields || []
    });
    await newCat.save();
    await logAction(req.user.id, req.user.name, `Created asset category ${name}`);
    res.json(newCat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/employees", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    const usersClean = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      departmentId: u.departmentId,
      status: u.status
    }));
    res.json(usersClean);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/employees/:id/role", authMiddleware, async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  const { role, departmentId, status } = req.body;
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: "Employee not found" });
    }
    if (role !== undefined) user.role = role;
    if (departmentId !== undefined) user.departmentId = departmentId;
    if (status !== undefined) user.status = status;
    await user.save();
    await logAction(req.user.id, req.user.name, `Updated user ${user.name} role to ${user.role}`);
    await notifyUser(req.params.id, `Your role/status has been updated to ${user.role}`);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/assets", authMiddleware, async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/assets", authMiddleware, async (req, res) => {
  if (req.user.role !== "Asset Manager" && req.user.role !== "Admin") {
    return res.status(403).json({ error: "Asset Manager or Admin only" });
  }
  const { name, category, serialNumber, acquisitionDate, acquisitionCost, condition, location, isBookable, customFields } = req.body;
  try {
    const assetCount = await Asset.countDocuments();
    const tagNum = String(assetCount + 1).padStart(4, "0");
    const tag = `AF-${tagNum}`;
    const newAsset = new Asset({
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
    });
    await newAsset.save();
    await logAction(req.user.id, req.user.name, `Registered asset ${name} (${tag})`);
    res.json(newAsset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/assets/:id", authMiddleware, async (req, res) => {
  try {
    const asset = await Asset.findOne({ id: req.params.id });
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/assets/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "Asset Manager" && req.user.role !== "Admin") {
    return res.status(403).json({ error: "Asset Manager or Admin only" });
  }
  try {
    const asset = await Asset.findOne({ id: req.params.id });
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    Object.keys(req.body).forEach(key => {
      asset[key] = req.body[key];
    });
    await asset.save();
    await logAction(req.user.id, req.user.name, `Updated asset ${asset.name} (${asset.tag})`);
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/assets/allocate", authMiddleware, async (req, res) => {
  if (req.user.role !== "Asset Manager" && req.user.role !== "Admin") {
    return res.status(403).json({ error: "Asset Manager or Admin only" });
  }
  const { assetId, employeeId, departmentId, expectedReturnDate } = req.body;
  try {
    const asset = await Asset.findOne({ id: assetId });
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    if (asset.status !== "Available") {
      return res.status(400).json({ error: `Asset is currently ${asset.status}`, holder: asset.employeeId });
    }
    asset.status = "Allocated";
    asset.employeeId = employeeId || "";
    asset.departmentId = departmentId || "";
    asset.expectedReturnDate = expectedReturnDate || "";
    await asset.save();

    const allocation = new Allocation({
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
    });
    await allocation.save();

    await logAction(req.user.id, req.user.name, `Allocated asset ${asset.name} (${asset.tag})`);
    if (employeeId) {
      await notifyUser(employeeId, `Asset ${asset.name} has been allocated to you.`);
    }
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/allocations", authMiddleware, async (req, res) => {
  try {
    const allocs = await Allocation.find();
    res.json(allocs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/assets/request-transfer", authMiddleware, async (req, res) => {
  const { assetId, targetEmployeeId } = req.body;
  try {
    const asset = await Asset.findOne({ id: assetId });
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    const newTransfer = new Transfer({
      id: `tr-${Date.now()}`,
      assetId,
      fromEmployeeId: asset.employeeId,
      toEmployeeId: targetEmployeeId,
      status: "Requested",
      requestedAt: new Date().toISOString()
    });
    await newTransfer.save();
    await logAction(req.user.id, req.user.name, `Requested transfer of asset ${asset.name} (${asset.tag})`);
    const assetManager = await User.findOne({ role: "Asset Manager" });
    if (assetManager) {
      await notifyUser(assetManager.id, `Transfer request for ${asset.name} from ${req.user.name}`);
    }
    res.json(newTransfer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/transfers", authMiddleware, async (req, res) => {
  try {
    const transfers = await Transfer.find();
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/transfers/:id/approve", authMiddleware, async (req, res) => {
  try {
    const transfer = await Transfer.findOne({ id: req.params.id });
    if (!transfer) {
      return res.status(404).json({ error: "Transfer request not found" });
    }
    const asset = await Asset.findOne({ id: transfer.assetId });
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    transfer.status = "Approved";
    transfer.approvedAt = new Date().toISOString();
    await transfer.save();

    asset.employeeId = transfer.toEmployeeId;
    asset.status = "Allocated";
    await asset.save();

    const activeAlloc = await Allocation.findOne({ assetId: transfer.assetId, status: "Active" });
    if (activeAlloc) {
      activeAlloc.status = "Transferred";
      activeAlloc.returnedAt = new Date().toISOString().split("T")[0];
      await activeAlloc.save();
    }

    const newAlloc = new Allocation({
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
    });
    await newAlloc.save();

    await logAction(req.user.id, req.user.name, `Approved transfer for asset ${asset.name} (${asset.tag})`);
    await notifyUser(transfer.toEmployeeId, `Transfer of ${asset.name} to you has been approved.`);
    await notifyUser(transfer.fromEmployeeId, `Transfer of ${asset.name} has been approved.`);
    res.json(transfer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/assets/return", authMiddleware, async (req, res) => {
  const { assetId, condition, remarks } = req.body;
  try {
    const asset = await Asset.findOne({ id: assetId });
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    const activeAlloc = await Allocation.findOne({ assetId, status: "Active" });
    if (activeAlloc) {
      activeAlloc.status = "Returned";
      activeAlloc.returnedAt = new Date().toISOString().split("T")[0];
      activeAlloc.returnCondition = condition;
      activeAlloc.returnRemarks = remarks;
      await activeAlloc.save();
    }
    asset.status = "Available";
    asset.employeeId = "";
    asset.departmentId = "";
    asset.expectedReturnDate = "";
    await asset.save();

    await logAction(req.user.id, req.user.name, `Returned asset ${asset.name} (${asset.tag})`);
    const manager = await User.findOne({ role: "Asset Manager" });
    if (manager) {
      await notifyUser(manager.id, `Asset ${asset.name} has been returned by ${req.user.name}`);
    }
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/bookings", authMiddleware, async (req, res) => {
  const { assetId, date, startTime, endTime } = req.body;
  try {
    const asset = await Asset.findOne({ id: assetId });
    if (!asset) {
      return res.status(404).json({ error: "Resource not found" });
    }
    if (!asset.isBookable) {
      return res.status(400).json({ error: "Asset is not shared or bookable" });
    }
    const conflicts = await Booking.find({
      assetId,
      date,
      status: { $ne: "Cancelled" }
    });
    const hasOverlap = conflicts.some(b =>
      (startTime >= b.startTime && startTime < b.endTime) ||
      (endTime > b.startTime && endTime <= b.endTime) ||
      (startTime <= b.startTime && endTime >= b.endTime)
    );
    if (hasOverlap) {
      return res.status(400).json({ error: "Time slot overlaps with an existing booking" });
    }
    const newBooking = new Booking({
      id: `b-${Date.now()}`,
      assetId,
      employeeId: req.user.id,
      date,
      startTime,
      endTime,
      status: "Upcoming"
    });
    await newBooking.save();
    await logAction(req.user.id, req.user.name, `Booked resource ${asset.name} on ${date} ${startTime}-${endTime}`);
    res.json(newBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/bookings/:id/status", authMiddleware, async (req, res) => {
  const { status } = req.body;
  try {
    const booking = await Booking.findOne({ id: req.params.id });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    booking.status = status;
    await booking.save();
    await logAction(req.user.id, req.user.name, `Updated booking ${req.params.id} to ${status}`);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/maintenance", authMiddleware, async (req, res) => {
  try {
    const maintenance = await Maintenance.find();
    res.json(maintenance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/maintenance", authMiddleware, async (req, res) => {
  const { assetId, description, priority } = req.body;
  try {
    const asset = await Asset.findOne({ id: assetId });
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    const newRequest = new Maintenance({
      id: `m-${Date.now()}`,
      assetId,
      employeeId: req.user.id,
      description,
      priority,
      status: "Pending",
      technician: "",
      resolvedAt: ""
    });
    await newRequest.save();
    await logAction(req.user.id, req.user.name, `Raised maintenance request for ${asset.name}`);
    const manager = await User.findOne({ role: "Asset Manager" });
    if (manager) {
      await notifyUser(manager.id, `New maintenance request for ${asset.name} (${priority})`);
    }
    res.json(newRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/maintenance/:id/status", authMiddleware, async (req, res) => {
  const { status, technician } = req.body;
  try {
    const maint = await Maintenance.findOne({ id: req.params.id });
    if (!maint) {
      return res.status(404).json({ error: "Maintenance request not found" });
    }
    const asset = await Asset.findOne({ id: maint.assetId });
    maint.status = status;
    if (technician) {
      maint.technician = technician;
    }
    if (status === "Approved") {
      if (asset) {
        asset.status = "Under Maintenance";
        await asset.save();
      }
    } else if (status === "Resolved") {
      maint.resolvedAt = new Date().toISOString();
      if (asset) {
        asset.status = "Available";
        await asset.save();
      }
    }
    await maint.save();
    await logAction(req.user.id, req.user.name, `Updated maintenance request ${req.params.id} to ${status}`);
    await notifyUser(maint.employeeId, `Maintenance request for asset has been ${status}.`);
    res.json(maint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/audits", authMiddleware, async (req, res) => {
  try {
    const audits = await Audit.find();
    res.json(audits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/audits", authMiddleware, async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  const { name, scope, startDate, endDate, auditors } = req.body;
  try {
    const newAudit = new Audit({
      id: `au-${Date.now()}`,
      name,
      scope,
      startDate,
      endDate,
      auditors: auditors || [],
      status: "Active",
      results: {}
    });
    await newAudit.save();
    await logAction(req.user.id, req.user.name, `Created audit cycle ${name}`);
    (auditors || []).forEach(auditorId => {
      notifyUser(auditorId, `You have been assigned to audit cycle ${name}`);
    });
    res.json(newAudit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/audits/:id/verify", authMiddleware, async (req, res) => {
  const { assetId, verificationStatus } = req.body;
  try {
    const audit = await Audit.findOne({ id: req.params.id });
    if (!audit) {
      return res.status(404).json({ error: "Audit not found" });
    }
    const newResults = audit.results ? new Map(audit.results) : new Map();
    newResults.set(assetId, {
      status: verificationStatus,
      verifiedBy: req.user.name,
      verifiedAt: new Date().toISOString()
    });
    audit.results = newResults;
    await audit.save();
    await logAction(req.user.id, req.user.name, `Verified asset ${assetId} in audit ${req.params.id}`);
    res.json(audit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/audits/:id/close", authMiddleware, async (req, res) => {
  try {
    const audit = await Audit.findOne({ id: req.params.id });
    if (!audit) {
      return res.status(404).json({ error: "Audit not found" });
    }
    audit.status = "Completed";
    const results = audit.results || new Map();
    for (let [assetId, value] of results.entries()) {
      const assetStatus = value.status;
      const asset = await Asset.findOne({ id: assetId });
      if (asset) {
        if (assetStatus === "Missing") {
          asset.status = "Lost";
          await asset.save();
        } else if (assetStatus === "Damaged") {
          asset.condition = "Damaged";
          await asset.save();
        }
      }
    }
    await audit.save();
    await logAction(req.user.id, req.user.name, `Closed audit cycle ${audit.name}`);
    res.json(audit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/analytics", authMiddleware, async (req, res) => {
  try {
    const assets = await Asset.find();
    const depts = await Department.find();
    const maintList = await Maintenance.find();

    const totalAssets = assets.length;
    const allocatedAssets = assets.filter(a => a.status === "Allocated").length;
    const availableAssets = assets.filter(a => a.status === "Available").length;
    const maintenanceAssets = assets.filter(a => a.status === "Under Maintenance").length;
    const lostAssets = assets.filter(a => a.status === "Lost").length;

    const categoryCounts = {};
    assets.forEach(a => {
      categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
    });

    const departmentCounts = {};
    assets.forEach(a => {
      if (a.departmentId) {
        const dept = depts.find(d => d.id === a.departmentId);
        const name = dept ? dept.name : "Unknown";
        departmentCounts[name] = (departmentCounts[name] || 0) + 1;
      }
    });

    const maintenanceHistory = maintList.length;
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/notifications", authMiddleware, async (req, res) => {
  try {
    const userNotifications = await Notification.find({ userId: req.user.id });
    res.json(userNotifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/notifications/:id/read", authMiddleware, async (req, res) => {
  try {
    const notif = await Notification.findOne({ id: req.params.id });
    if (notif) {
      notif.read = true;
      await notif.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/logs", authMiddleware, async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  try {
    const logs = await Log.find();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Connected to Database URI: ${MONGODB_URI}`);
});
