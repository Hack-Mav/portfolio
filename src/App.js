import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { ROUTES } from "./constants/routes"

const NavigationBar = () => {
  const location = useLocation();

  // Hide the navbar on NotFound page
  console.log(location.pathname)
  if (location.pathname !== ROUTES.HOME && location.pathname !== ROUTES.ABOUT && location.pathname !== ROUTES.PROJECTS && location.pathname !== ROUTES.CONTACT) {
    return null;
  }

  return (
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
              transition: "color 0.1s, border-bottom 0.1s",
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
            About Me
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
  );
};

function App() {
  return (
    <Router>
      <div>
        {/* Conditional Navigation Bar */}
        <NavigationBar />

        {/* Routes */}
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.PROJECTS} element={<Projects />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />
          <Route path={ROUTES.UNDEFINED} element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
