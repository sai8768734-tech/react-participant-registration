import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS for dev client
const io = new SocketIOServer(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 4000;
const DATA_FILE = path.join(__dirname, "participants.json");

app.use(cors());
app.use(express.json());

// Ensure data file exists
function initDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
  }
}

function readParticipants() {
  initDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // If file is corrupted, reset to empty array
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
    return [];
  }
}

function writeParticipants(participants) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(participants, null, 2), "utf-8");
}

// -------------------------
// Validation helpers
// -------------------------

const allowedEmailDomains = ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com"];

function isValidEmail(email) {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicEmailRegex.test(trimmed)) return false;
  const domain = trimmed.split("@")[1].toLowerCase();
  return allowedEmailDomains.includes(domain);
}

function isValidPhone(phone) {
  if (typeof phone !== "string") return false;
  const trimmed = phone.trim();
  if (!trimmed.startsWith("+")) return false;
  const digits = trimmed.slice(1);
  if (!/^\d+$/.test(digits)) return false;
  // 10–15 digits after +
  return digits.length >= 10 && digits.length <= 15;
}

function validateParticipant(body) {
  const errors = {};

  const { fullName, email, phone, role, companyName, yearsOfExperience, department, currentYear } =
    body || {};

  if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!email || !isValidEmail(email)) {
    errors.email =
      "Valid email is required (allowed domains: gmail.com, outlook.com, yahoo.com, hotmail.com).";
  }

  if (!phone || !isValidPhone(phone)) {
    errors.phone =
      "Valid phone is required with country code (e.g. +91...), 10–15 digits, digits only after '+'.";
  }

  if (!role || (role !== "Student" && role !== "Working Professional")) {
    errors.role = "Role is required and must be either 'Student' or 'Working Professional'.";
  }

  if (role === "Working Professional") {
    if (!companyName || typeof companyName !== "string" || !companyName.trim()) {
      errors.companyName = "Company name is required for working professionals.";
    }
    const years = Number(yearsOfExperience);
    if (!Number.isFinite(years) || years < 0 || years > 50) {
      errors.yearsOfExperience = "Years of experience must be between 0 and 50.";
    }
  }

  if (role === "Student") {
    if (!department || typeof department !== "string" || !department.trim()) {
      errors.department = "Department is required for students.";
    }
    const year = Number(currentYear);
    if (!Number.isFinite(year) || year < 1 || year > 6) {
      errors.currentYear = "Current year must be between 1 and 6.";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

// -------------------------
// Routes
// -------------------------

app.get("/api/participants", (req, res) => {
  try {
    const participants = readParticipants();
    res.json(participants);
  } catch (err) {
    console.error("Error reading participants:", err);
    res.status(500).json({ message: "Failed to read participants." });
  }
});

app.post("/api/register", (req, res) => {
  const { valid, errors } = validateParticipant(req.body);

  if (!valid) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  try {
    const participants = readParticipants();

    const participant = {
      id: Date.now().toString(),
      fullName: req.body.fullName.trim(),
      email: req.body.email.trim(),
      phone: req.body.phone.trim(),
      role: req.body.role,
      companyName: req.body.role === "Working Professional" ? req.body.companyName.trim() : "",
      yearsOfExperience:
        req.body.role === "Working Professional"
          ? Number(req.body.yearsOfExperience)
          : null,
      department: req.body.role === "Student" ? req.body.department.trim() : "",
      currentYear:
        req.body.role === "Student" ? Number(req.body.currentYear) : null,
      timestamp: new Date().toISOString()
    };

    participants.push(participant);
    writeParticipants(participants);

    // Emit real-time update
    io.emit("new_participant", participant);

    res.status(201).json({ message: "Registration successful", participant });
  } catch (err) {
    console.error("Error saving participant:", err);
    res.status(500).json({ message: "Failed to save participant." });
  }
});

// -------------------------
// Socket.IO basic handlers
// -------------------------

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  initDataFile();
  console.log(`Server listening on http://localhost:${PORT}`);
});


