import { usePokeCardContext } from "./App";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function StartPage() {
  const {
    typeFilter,
    setTypeFilter,
    setPokemonCards,
    pokemonList,
    setGameStarted,
  } = usePokeCardContext();

  const navigate = useNavigate();

  function handleGameStartClick() {
    let startingCardList =
      typeFilter === "All"
        ? pokemonList
        : pokemonList.filter((element) => element.types.includes(typeFilter));

    // fisher yates array shuffle method
    let shuffledCardList = [...startingCardList];
    for (let i = shuffledCardList.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let k = shuffledCardList[i];
      shuffledCardList[i] = shuffledCardList[j];
      shuffledCardList[j] = k;
    }
    const randomizedCards = shuffledCardList.slice(0, 9);
    const duplicatedCardList = [...randomizedCards, ...randomizedCards].map(
      (card, i) => ({
        ...card,
        uniqueId: i,
        isFlipped: false,
        isMatched: false,
      })
    );

    for (let i = duplicatedCardList.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let k = duplicatedCardList[i];
      duplicatedCardList[i] = duplicatedCardList[j];
      duplicatedCardList[j] = k;
    }
    setPokemonCards(duplicatedCardList);
    setGameStarted(true);
    navigate("/pokematch");
  }

  useEffect(() => {
    if (typeFilter === "All") {
      setPokemonCards(pokemonList);
    } else {
      let filteredTypeList = pokemonList.filter((element) => {
        return element.types.includes(typeFilter);
      });
      setPokemonCards(filteredTypeList);
    }
  }, [typeFilter, pokemonList]);

  return (
    <>
      <h1>Welcome</h1>
      <br />
      <h3>Choose your Pokemon type</h3>
      <br />
      <select
        className="filter-type-dropdown"
        defaultValue="All"
        onChange={(e) => {
          setTypeFilter(e.target.value);
        }}
      >
        <option value="All">All</option>
        <option value="bug">Bug</option>
        <option value="dark">Dark</option>
        <option value="dragon">Dragon</option>
        <option value="electric">Electric</option>
        <option value="fairy">Fairy</option>
        <option value="fighting">Fighting</option>
        <option value="fire">Fire</option>
        <option value="flying">Flying</option>
        <option value="ghost">Ghost</option>
        <option value="grass">Grass</option>
        <option value="ground">Ground</option>
        <option value="ice">Ice</option>
        <option value="normal">Normal</option>
        <option value="poison">Poison</option>
        <option value="psychic">Psychic</option>
        <option value="rock">Rock</option>
        <option value="steel">Steel</option>
        <option value="water">Water</option>
      </select>
      <br />
      <br />
      <br />
      <button className="button" onClick={handleGameStartClick}>
        Start Game
      </button>
    </>
  );
}
