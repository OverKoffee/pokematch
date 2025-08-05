import { useState, useEffect, createContext, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import StartPage from "./StartPage";
import GameBoard from "./GameBoard";

const PokeCardContext = createContext();
export const usePokeCardContext = () => useContext(PokeCardContext);

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonCards, setPokemonCards] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const url = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=1025";

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

  return (
    <>
      <PokeCardContext.Provider
        value={{
          pokemonCards,
          setPokemonCards,
          pokemonList,
          typeFilter,
          setTypeFilter,
          gameStarted,
          setGameStarted,
        }}
      >
        <div className="main-container">
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/pokematch" element={<GameBoard />} />
          </Routes>
        </div>
      </PokeCardContext.Provider>
    </>
  );
}

export default App;
