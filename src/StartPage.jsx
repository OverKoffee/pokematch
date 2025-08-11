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

  const typeColors = {
    bug: "#A6B91A",
    dark: "#705746",
    dragon: "#6F35FC",
    electric: "#F7D02C",
    fairy: "#D685AD",
    fighting: "#C22E28",
    fire: "#EE8130",
    flying: "#A98FF3",
    ghost: "#735797",
    grass: "#7AC74C",
    ground: "#E2BF65",
    ice: "#96D9D6",
    normal: "#A8A77A",
    poison: "#A33EA1",
    psychic: "#F95587",
    rock: "#B6A136",
    steel: "#B7B7CE",
    water: "#6390F0",
  };

  const allTypes = ["All", ...Object.keys(typeColors)];

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
        style={{
          fontWeight: "bold",
          color: "#000000ff",
          backgroundColor: "#dcdbdb7a",
        }}
        className="filter-type-dropdown"
        defaultValue="All"
        onChange={(e) => {
          setTypeFilter(e.target.value);
        }}
      >
        {allTypes.map((type) => (
          <option
            key={type}
            value={type}
            style={{
              fontWeight: "bold",
              color: typeColors[type],
              backgroundColor: "#ffffffbb",
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
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

/*
  Reference: 

  Pokemon type colors: https://gist.github.com/apaleslimghost/0d25ec801ca4fc43317bcff298af43c3
*/
