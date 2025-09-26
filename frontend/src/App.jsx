import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-gradient">
        <div className="container">
          <a className="navbar-brand" href="#">
            🌱 Plant Care Manager
          </a>
        </div>
      </nav>

      {/* Main Dashboard */}
      <main className="container my-5">
        <h2 className="text-center mb-4 welcome-text">
          Welcome to your Plant Care Dashboard
        </h2>
        <Dashboard />
      </main>

      {/* Floating Chatbot */}
      <Chatbot />
    </div>
  );
}

export default App;
