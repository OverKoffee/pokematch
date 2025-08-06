import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

export default function GameOver() {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  return (
    <>
      <Confetti
        width={width}
        height={height}
        numberOfPieces={500}
        colors={["#f00", "#0f0", "#00f"]}
        recycle={false}
      />
      <div className="game-over-content">
        <h1> Winner! </h1>
        <p>Great job!</p>
        <button onClick={() => navigate("/")}>Return Home</button>
      </div>
    </>
  );
}
