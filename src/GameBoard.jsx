import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePokeCardContext } from "./App";
import pokeball from "./assets/images/pokeball.png";

export default function GameBoard() {
  const { pokemonCards, setPokemonCards, difficultyLevel } =
    usePokeCardContext();

  const [flippedCards, setFlippedCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const navigate = useNavigate();

  const wrapRef = useRef(null);

  // target rows by difficulty
  const targetRows = useMemo(() => {
    const map = { Easy: 4, Medium: 5, Hard: 6 };
    return map[difficultyLevel] ?? 5;
  }, [difficultyLevel]);

  useLayoutEffect(() => {
    if (!wrapRef.current) return;
    const wrap = wrapRef.current;

    let raf = 0;
    let last = { cols: -1, w: -1, h: -1 };

    const calc = () => {
      const count = pokemonCards.length || 1;

      // Read precise container metrics
      const cs = getComputedStyle(wrap);
      const gap = parseFloat(cs.getPropertyValue("--gap")) || 10;
      const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      const rect = wrap.getBoundingClientRect();

      // usable inner size; epsilon avoids 1px overflow
      const W = rect.width - padX - 0.5;
      const H = rect.height - padY - 0.5;

      // Bail if wrap size basically unchanged
      if (Math.abs(W - last.w) < 0.5 && Math.abs(H - last.h) < 0.5) return;

      // ---- Difficulty bounds + minimum readable card width ----
      const CFG = {
        Easy: { minCols: 4, maxCols: 5, minCard: 56 }, // prefer 5 or 4
        Medium: { minCols: 4, maxCols: 6, minCard: 46 }, // prefer 5, allow 4–6
        Hard: { minCols: 6, maxCols: 7, minCard: 40 }, // prefer 6–7
      };
      const { minCols, maxCols, minCard } = CFG[difficultyLevel] ?? {
        minCols: 4,
        maxCols: 6,
        minCard: 46,
      };

      // Build candidate column counts (from widest to narrowest), clamp by card count
      const hi = Math.min(maxCols, count);
      const lo = Math.min(minCols, hi);
      const candidates = [];
      for (let c = hi; c >= lo; c--) candidates.push(c);

      // Score each candidate-- prefer meeting minCard, then maximize used width (fill)
      let best = null;
      let bestFallback = null;

      for (const cols of candidates) {
        const rows = Math.ceil(count / cols);

        const maxCellW = (W - gap * (cols - 1)) / cols; // horizontal limit
        const maxCellH = (H - gap * (rows - 1)) / rows; // vertical limit
        const wByHeight = (maxCellH * 5) / 7; // keeping my 5:7 aspect

        const cardW = Math.floor(Math.max(20, Math.min(maxCellW, wByHeight)));
        const cardH = Math.floor((cardW * 7) / 5);

        const usedWidth = cols * cardW + (cols - 1) * gap; // the actual grid width
        const fill = usedWidth / Math.max(W, 1); // 0..1 (how much width is filled)

        const candidate = { cols, cardW, cardH, fill };

        // bestFallback = the one that fills the most width (even if below minCard)
        if (!bestFallback || candidate.fill > bestFallback.fill)
          bestFallback = candidate;

        // If card is readable enough, pick the one that best fills width
        if (cardW >= minCard) {
          if (!best || candidate.fill > best.fill) best = candidate;
        }
      }

      const chosen = best ?? bestFallback;

      const board = wrap.querySelector(".game-board");
      if (board) {
        if (chosen.cols !== last.cols)
          board.style.setProperty("--cols", String(chosen.cols));
        board.style.setProperty("--card-w", `${chosen.cardW}px`);
        board.style.setProperty("--card-h", `${chosen.cardH}px`);
        board.style.visibility = "visible"; // show after first calculation
      }

      last = { cols: chosen.cols, w: W, h: H };
    };

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(calc); // throttle to one per frame
    });

    ro.observe(wrap);
    requestAnimationFrame(calc); // initial run

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [pokemonCards.length, difficultyLevel]);

  function handleCardClick(id) {
    const clickedCard = pokemonCards.find((card) => card.uniqueId === id);
    if (!clickedCard || flippedCards.length >= 2 || clickedCard.isFlipped)
      return;

    setPokemonCards(
      pokemonCards.map((card) =>
        card.uniqueId === id ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedCards((prev) => [...prev, clickedCard]);
  }

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards;
      const isMatch = firstCard.name === secondCard.name;

      setTimeout(() => {
        setPokemonCards((prev) =>
          prev.map((card) =>
            isMatch
              ? card.name === firstCard.name
                ? { ...card, isMatched: true }
                : card
              : card.name === firstCard.name || card.name === secondCard.name
              ? { ...card, isFlipped: false }
              : card
          )
        );
        setFlippedCards([]);
      }, 600);
    }

    if (pokemonCards.length > 0 && pokemonCards.every((c) => c.isMatched)) {
      setGameOver(true);
    }
  }, [flippedCards, pokemonCards, setPokemonCards]);

  useEffect(() => {
    if (gameOver) {
      navigate("/gameover");
      setGameOver(false);
    }
  }, [gameOver, navigate]);

  return (
    <>
      <h3>Pokématch</h3>

      <div className="board-wrap" ref={wrapRef}>
        <div className="game-board">
          {pokemonCards.map((card, index) => (
            <div
              key={card.uniqueId ?? `card-${index}`}
              className={`poke-card ${card.isFlipped ? "is-flipped" : ""} ${
                card.isMatched ? "is-matched" : ""
              }`}
              onClick={() => handleCardClick(card.uniqueId ?? index)}
            >
              <div
                className={`card__inner ${card.isFlipped ? "is-flipped" : ""}`}
              >
                <div className="card__face card__face--front">
                  <img src={card.pokeImage} alt={card.name} />
                </div>
                <div className="card__face card__face--back">
                  <img src={pokeball} width="30" alt="Pokéball" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* Reference:
   Card Flip - https://www.youtube.com/watch?v=QGVXmoZWZuw
*/
