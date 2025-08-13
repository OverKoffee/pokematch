import { useNavigate } from "react-router-dom";
import fam from "./assets/fam.jpg";

export default function Love() {
  const navigate = useNavigate();

  return (
    <div className="easter-egg-div">
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1>💖陳總💖</h1>
        <h2> 我超級愛妳!</h2>
        <h2>妳真的很可愛 😘</h2>

        <img
          src={fam}
          alt="Our family"
          style={{
            maxWidth: "min(90vw, 560px)",
            width: "100%",
            borderRadius: 12,
            boxShadow: "0 6px 16px rgba(0,0,0,.25)",
          }}
          onError={(e) => {
            // helpful fallback if path/case is wrong
            e.currentTarget.replaceWith(
              document.createTextNode("Image not found at " + imgSrc)
            );
          }}
        />
        <p>This is my easter egg for you!</p>
        <button className="button" onClick={() => navigate("/")}>
          Back home
        </button>
      </div>
    </div>
  );
}
