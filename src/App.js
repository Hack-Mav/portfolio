import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <nav
          style={{
            padding: "10px 40px",
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #ddd",
          }}
        >
          <ul
            style={{
              display: "flex",
              listStyleType: "none",
              margin: 0,
              padding: 0,
              justifyContent: "flex-end",
            }}
          >
            <li>
              <NavLink
                to="/"
                style={({ isActive }) => ({
                  padding: "10px 15px",
                  textDecoration: "none",
                  color: isActive ? "#007BFF" : "#000",
                  fontWeight: isActive ? "bold" : "normal",
                  borderBottom: isActive ? "2px solid #007BFF" : "none",
                  transition: "color 0.3s, border-bottom 0.3s",
                })}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                style={({ isActive }) => ({
                  padding: "10px 15px",
                  textDecoration: "none",
                  color: isActive ? "#007BFF" : "#000",
                  fontWeight: isActive ? "bold" : "normal",
                  borderBottom: isActive ? "2px solid #007BFF" : "none",
                  transition: "color 0.3s, border-bottom 0.3s",
                })}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/projects"
                style={({ isActive }) => ({
                  padding: "10px 15px",
                  textDecoration: "none",
                  color: isActive ? "#007BFF" : "#000",
                  fontWeight: isActive ? "bold" : "normal",
                  borderBottom: isActive ? "2px solid #007BFF" : "none",
                  transition: "color 0.3s, border-bottom 0.3s",
                })}
              >
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                style={({ isActive }) => ({
                  padding: "10px 15px",
                  textDecoration: "none",
                  color: isActive ? "#007BFF" : "#000",
                  fontWeight: isActive ? "bold" : "normal",
                  borderBottom: isActive ? "2px solid #007BFF" : "none",
                  transition: "color 0.3s, border-bottom 0.3s",
                })}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
