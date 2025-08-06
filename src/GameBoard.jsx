import { usePokeCardContext } from "./App";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GameBoard() {
  const { pokemonCards, setPokemonCards } = usePokeCardContext();
  const [flippedCards, setFlippedCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const navigate = useNavigate();

  function handleCardClick(id) {
    const clickedCard = pokemonCards.find((card) => {
      return card.uniqueId === id;
    });

    if (flippedCards.length >= 2 || clickedCard.isFlipped) {
      return;
    }

    const updatedCards = pokemonCards.map((card) => {
      if (card.uniqueId === id) {
        return { ...card, isFlipped: true };
      } else {
        return card;
      }
    });
    setPokemonCards(updatedCards);
    setFlippedCards([...flippedCards, clickedCard]);
  }

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards;
      const isMatch = firstCard.name === secondCard.name;

      if (isMatch) {
        setTimeout(() => {
          const updatedCards = pokemonCards.map((card) => {
            if (card.name === firstCard.name) {
              return { ...card, isMatched: true };
            } else {
              return card;
            }
          });
          setPokemonCards(updatedCards);
          setFlippedCards([]);
        }, 600);
      } else {
        setTimeout(() => {
          const updatedCards = pokemonCards.map((card) =>
            card.name === firstCard.name || card.name === secondCard.name
              ? { ...card, isFlipped: false }
              : card
          );
          setPokemonCards(updatedCards);
          setFlippedCards([]);
        }, 600);
      }
    }
    if (
      pokemonCards.length > 0 &&
      pokemonCards.every((card) => card.isMatched)
    ) {
      setGameOver(true);
    }
  }, [flippedCards, pokemonCards, setPokemonCards]);

  useEffect(() => {
    if (gameOver) {
      navigate("/gameover");
      setGameOver(false);
    }
  }, [gameOver]);

  return (
    <>
      <h2>Pokématch</h2>
      <div className="game-board">
        {pokemonCards.map((card) => (
          <div
            key={card.uniqueId}
            className={`poke-card ${card.isFlipped ? "is-flipped" : ""} ${
              card.isMatched ? "is-matched" : ""
            }`}
            onClick={() => handleCardClick(card.uniqueId)}
          >
            <div
              className={`card__inner ${card.isFlipped ? "is-flipped" : ""}`}
            >
              <div className="card__face card__face--front">
                <img src={card.pokeImage} alt="pokeImage fail.." />
              </div>
              <div className="card__face card__face--back">
                <img
                  src="./src/assets/images/pokeball.png"
                  width="30px"
                  alt="Pokecard"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* Reference:
    Card Flip - https://www.youtube.com/watch?v=QGVXmoZWZuw
*/
