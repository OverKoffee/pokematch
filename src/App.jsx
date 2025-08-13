import { useState, useEffect, createContext, useContext, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import StartPage from "./StartPage";
import GameBoard from "./GameBoard";
import GameOver from "./GameOver";

const PokeCardContext = createContext();
export const usePokeCardContext = () => useContext(PokeCardContext);

const levelToPairs = { Easy: 10, Medium: 18, Hard: 26 };

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonCards, setPokemonCards] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [difficultyLevel, setDifficultyLevel] = useState("Easy");
  const [gameStarted, setGameStarted] = useState(false);
  const pairLevel = levelToPairs[difficultyLevel];

  useEffect(() => {
    const url = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=500";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const originalFullList = [];
        const results = data.results;

        results.forEach((element) => {
          const pokeID = element.url.split("/").filter(Boolean).pop();

          fetch(`https://pokeapi.co/api/v2/pokemon/${pokeID}`)
            .then((res) => res.json())
            .then((data) => {
              const individualPokemon = {
                id: Number(pokeID),
                name: element.name,
                pokeURL: element.url,
                pokeImage: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeID}.png`,
                types: data.types.map((type) => type.type.name),
              };
              originalFullList.push(individualPokemon);

              if (originalFullList.length === results.length) {
                setPokemonList(originalFullList);
                setPokemonCards(originalFullList);
              }
            });
        });
      });
  }, []);

  const ctx = useMemo(
    () => ({
      pokemonCards,
      setPokemonCards,
      pokemonList,
      typeFilter,
      setTypeFilter,
      pairLevel,
      difficultyLevel,
      setDifficultyLevel,
      gameStarted,
      setGameStarted,
    }),
    [pokemonCards, pokemonList, typeFilter, pairLevel, difficultyLevel]
  );

  return (
    <>
      <PokeCardContext.Provider value={ctx}>
        <div className="main-container">
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/pokematch" element={<GameBoard />} />
            <Route path="/gameover" element={<GameOver />} />
          </Routes>
        </div>
      </PokeCardContext.Provider>
    </>
  );
}

export default App;
