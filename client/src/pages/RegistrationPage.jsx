import { useState } from "react";
import { registerParticipant } from "../services/api.js";

const allowedEmailDomains = ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com"];

function isValidEmail(email) {
  const trimmed = email.trim();
  const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicEmailRegex.test(trimmed)) return false;
  const domain = trimmed.split("@")[1]?.toLowerCase();
  return allowedEmailDomains.includes(domain);
}

function isValidPhone(phone) {
  const trimmed = phone.trim();
  if (!trimmed.startsWith("+")) return false;
  const digits = trimmed.slice(1);
  if (!/^\d+$/.test(digits)) return false;
  return digits.length >= 10 && digits.length <= 15;
}

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  role: "",
  companyName: "",
  yearsOfExperience: "",
  department: "",
  currentYear: ""
};

function RegistrationPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSuccessMessage("");
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    const { fullName, email, phone, role, companyName, yearsOfExperience, department, currentYear } =
      form;

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!email.trim() || !isValidEmail(email)) {
      newErrors.email =
        "Valid email is required (allowed: gmail.com, outlook.com, yahoo.com, hotmail.com).";
    }

    if (!phone.trim() || !isValidPhone(phone)) {
      newErrors.phone =
        "Phone must start with '+' and contain 10–15 digits, digits only after '+'.";
    }

    if (!role) {
      newErrors.role = "Role is required.";
    }

    if (role === "Working Professional") {
      if (!companyName.trim()) {
        newErrors.companyName = "Company name is required.";
      }
      const years = Number(yearsOfExperience);
      if (!Number.isFinite(years) || years < 0 || years > 50) {
        newErrors.yearsOfExperience = "Years of experience must be between 0 and 50.";
      }
    }

    if (role === "Student") {
      if (!department.trim()) {
        newErrors.department = "Department is required.";
      }
      const year = Number(currentYear);
      if (!Number.isFinite(year) || year < 1 || year > 6) {
        newErrors.currentYear = "Current year must be between 1 and 6.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setServerError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role,
        companyName: form.role === "Working Professional" ? form.companyName.trim() : undefined,
        yearsOfExperience:
          form.role === "Working Professional" ? Number(form.yearsOfExperience) : undefined,
        department: form.role === "Student" ? form.department.trim() : undefined,
        currentYear: form.role === "Student" ? Number(form.currentYear) : undefined
      };
      const res = await registerParticipant(payload);

      setSuccessMessage("Registration successful!");
      setForm(initialForm);
      setErrors({});
    } catch (err) {
      // Map server-side validation errors (if any) to the form
      if (err.details && typeof err.details === "object") {
        setErrors((prev) => ({
          ...prev,
          ...err.details
        }));
      }
      setServerError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const isWorkingProfessional = form.role === "Working Professional";
  const isStudent = form.role === "Student";

  return (
    <div className="card">
      <h2 className="card-title">Training Program Registration</h2>
      <p className="card-subtitle">
        Fill in your details to register. Trainers will see your submission instantly.
      </p>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              className={errors.fullName ? "input error" : "input"}
              placeholder="Enter your full name"
            />
            {errors.fullName && <p className="error-text">{errors.fullName}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "input error" : "input"}
              placeholder="you@example.com"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number (with country code) *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className={errors.phone ? "input error" : "input"}
              placeholder="+91XXXXXXXXXX"
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role *</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className={errors.role ? "input error" : "input"}
            >
              <option value="">Select role</option>
              <option value="Student">Student</option>
              <option value="Working Professional">Working Professional</option>
            </select>
            {errors.role && <p className="error-text">{errors.role}</p>}
          </div>
        </div>

        {isWorkingProfessional && (
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="companyName">Company Name *</label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={form.companyName}
                onChange={handleChange}
                className={errors.companyName ? "input error" : "input"}
                placeholder="Your organization"
              />
              {errors.companyName && <p className="error-text">{errors.companyName}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="yearsOfExperience">Years of Experience *</label>
              <input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="number"
                min="0"
                max="50"
                value={form.yearsOfExperience}
                onChange={handleChange}
                className={errors.yearsOfExperience ? "input error" : "input"}
                placeholder="e.g. 3"
              />
              {errors.yearsOfExperience && (
                <p className="error-text">{errors.yearsOfExperience}</p>
              )}
            </div>
          </div>
        )}

        {isStudent && (
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <input
                id="department"
                name="department"
                type="text"
                value={form.department}
                onChange={handleChange}
                className={errors.department ? "input error" : "input"}
                placeholder="e.g. Computer Science"
              />
              {errors.department && <p className="error-text">{errors.department}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="currentYear">Current Year *</label>
              <input
                id="currentYear"
                name="currentYear"
                type="number"
                min="1"
                max="6"
                value={form.currentYear}
                onChange={handleChange}
                className={errors.currentYear ? "input error" : "input"}
                placeholder="e.g. 3"
              />
              {errors.currentYear && <p className="error-text">{errors.currentYear}</p>}
            </div>
          </div>
        )}

        {serverError && <p className="error-text global-error">{serverError}</p>}
        {successMessage && <p className="success-text">{successMessage}</p>}

        <button className="button primary" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Registration"}
        </button>
      </form>
    </div>
  );
}

export default RegistrationPage;


