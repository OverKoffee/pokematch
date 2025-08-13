import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

export default function GameOver() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const elapsedMs = state?.elapsedMs ?? 0;
  const difficulty = state?.difficultyLevel ?? "Easy";
  const { width, height } = useWindowSize();

  const [bestMs, setBestMs] = useState(null);
  const [isNewBest, setIsNewBest] = useState(false);

  const fmtTime = (ms) => {
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) return;

    const KEY = "pokematch_bestTimes";

    let store;
    try {
      store = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (store === null || typeof store !== "object") store = {};
    } catch {
      store = {};
    }

    const prev = Number(store[difficulty]);
    const hasValidPrev = Number.isFinite(prev) && prev > 0;

    if (!hasValidPrev || elapsedMs < prev) {
      store[difficulty] = elapsedMs; // store ms
      localStorage.setItem(KEY, JSON.stringify(store));
      setBestMs(elapsedMs);
      setIsNewBest(true);
    } else {
      setBestMs(prev);
      setIsNewBest(false);
    }
  }, [elapsedMs, difficulty]);

  return (
    <>
      <Confetti
        width={width}
        height={height}
        numberOfPieces={500}
        colors={["#f00", "#0f0", "#00f"]}
        recycle={false}
      />
      <div className="game-over-content" style={{ textAlign: "center" }}>
        <h1>Winner!</h1>

        <p>
          Your time: <strong>{fmtTime(elapsedMs)}</strong>
        </p>

        {bestMs != null &&
          (isNewBest ? (
            <p>
              🎉 <strong>New Best Time</strong> for{" "}
              <strong>{difficulty}</strong>: <strong>{fmtTime(bestMs)}</strong>
            </p>
          ) : (
            <p>
              Best {difficulty} time: <strong>{fmtTime(bestMs)}</strong>
            </p>
          ))}

        <button onClick={() => navigate("/")}>Return Home</button>
      </div>
    </>
  );
}
