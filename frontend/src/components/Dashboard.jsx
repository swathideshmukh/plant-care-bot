import React, { useEffect, useState } from "react";
import axios from "axios";
import AddPlantForm from "./AddPlantForm";
import { FaTint } from "react-icons/fa"; // Water drop icon
import "./Dashboard.css";

export default function Dashboard() {
  const [plants, setPlants] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Determine plant card status
  const getCardClass = (plant) => {
    const nextWatering = new Date(
      new Date(plant.lastWateredAt).getTime() + plant.wateringFrequency * 24 * 60 * 60 * 1000
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((nextWatering - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "overdue";
    if (diffDays <= 1) return "due-soon";
    return "healthy";
  };

  const fetchPlants = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/plants");
      setPlants(res.data);
    } catch (err) {
      console.error("Error fetching plants:", err);
    }
  };

  const deletePlant = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/plants/${id}`);
      fetchPlants();
    } catch (err) {
      console.error("Error deleting plant:", err);
    }
  };

  const waterPlant = async (id) => {
    try {
      const today = new Date().toISOString();
      await axios.put(`http://localhost:5000/api/plants/${id}`, {
        lastWateredAt: today
      });
      fetchPlants(); // Refresh plants to update UI
    } catch (err) {
      console.error("Error watering plant:", err);
    }
  };

  const isDueToday = (plant) => {
    const nextWatering = new Date(
      new Date(plant.lastWateredAt).getTime() + plant.wateringFrequency * 24 * 60 * 60 * 1000
    );
    const today = new Date();
    return nextWatering.toDateString() === today.toDateString();
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>
          Welcome to your <span className="highlight">Plant Care</span> Dashboard
        </h1>
        <button
          className="add-plant-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "＋ Add a New Plant"}
        </button>
      </header>

      {/* Add Plant Form */}
      {showForm && (
        <div className="form-container show">
          <AddPlantForm refresh={fetchPlants} closeForm={() => setShowForm(false)} />
        </div>
      )}

      {/* Plant Cards Grid */}
      <div className="plant-grid">
        {plants.map((plant, index) => (
          <div
            key={plant._id}
            className={`plant-card ${getCardClass(plant)}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="card-header">
              <h5 className="card-title">🌿 {plant.name}</h5>
              <p className="card-type">{plant.type}</p>
            </div>
            <div className="card-body">
              <p className="card-text">
                <strong>Last Watered:</strong> {new Date(plant.lastWateredAt).toLocaleDateString()}
              </p>
              <p className="card-text">
                <strong>Next Watering:</strong>{" "}
                {new Date(
                  new Date(plant.lastWateredAt).getTime() +
                  plant.wateringFrequency * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
                {isDueToday(plant) && <span className="badge due-today">Due Today!</span>}
              </p>
            </div>
            <div className="card-footer">
              <button className="water-btn" onClick={() => waterPlant(plant._id)}>
                <FaTint /> Water
              </button>
              <button className="delete-btn" onClick={() => deletePlant(plant._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
