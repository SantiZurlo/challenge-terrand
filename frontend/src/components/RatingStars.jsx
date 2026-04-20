import { useState } from "react";

export default function RatingStars({ average, total, userScore, onRate, readOnly = false }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="rating-container">
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= (hovered || userScore || 0) ? "filled" : ""}`}
            onClick={() => !readOnly && onRate && onRate(star)}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            style={{ cursor: readOnly ? "default" : "pointer" }}
          >
            ★
          </span>
        ))}
      </div>
      <span className="rating-info">
        {average > 0 ? `${average} (${total} ${total === 1 ? "calificación" : "calificaciones"})` : "Sin calificaciones aún"}
      </span>
    </div>
  );
}