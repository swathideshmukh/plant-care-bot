import React from 'react';

// This is a new file: WateringSlider.js
export default function WateringSlider({ value, onChange }) {
  const getWateringMessage = (days) => {
    if (days <= 2) return "Very Frequent";
    if (days <= 6) return "Frequent";
    if (days <= 14) return "Average";
    if (days <= 25) return "Infrequent";
    return "Very Infrequent";
  };

  return (
    <div className="watering-slider-container">
      <label htmlFor="wateringFrequency">Watering Frequency</label>
      <div className="slider-display">
        <span className="watering-icon">💧</span>
        <span className="watering-days">{value} days</span>
        <span className="watering-label">{getWateringMessage(value)}</span>
      </div>
      <input
        type="range"
        id="wateringFrequency"
        name="wateringFrequency"
        min="1"
        max="30" // Water every day up to once a month
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider"
      />
    </div>
  );
}