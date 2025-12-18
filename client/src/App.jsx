import { Routes, Route, NavLink } from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import "./App.css";

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="container header-content">
          <h1 className="logo">Training Program Portal</h1>
          <nav className="nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
            >
              Registration
            </NavLink>
            <NavLink
              to="/list"
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
            >
              Dashboard
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="app-main">
        <div className="container">
          <Routes>
            <Route path="/" element={<RegistrationPage />} />
            <Route path="/list" element={<DashboardPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;


