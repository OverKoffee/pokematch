import { usePokeCardContext } from "./App";

export default function GameBoard() {
  const { pokemonCards, setPokemonCards } = usePokeCardContext();

  function handleCardClick(id) {
    const updatedCards = pokemonCards.map((card) => {
      if (card.uniqueId === id) {
        return { ...card, isFlipped: !card.isFlipped };
      } else {
        return card;
      }
    });
    setPokemonCards(updatedCards);
  }

  return (
    <>
      <h2>GameBoard</h2>
      <div className="game-board">
        {pokemonCards.map((card) => (
          <div
            key={card.uniqueId}
            className={`poke-card ${card.isFlipped ? "is-flipped" : ""}`}
            onClick={() => handleCardClick(card.uniqueId)}
          >
            {card.isFlipped ? (
              <img src={card.pokeImage} alt={`${card.name}`} />
            ) : (
              <div className="card-back">Pokecard</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

/* Reference:
    Card Flip - https://www.youtube.com/watch?v=QGVXmoZWZuw
*/
