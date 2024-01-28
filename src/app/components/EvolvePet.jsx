"use client";
import styles from "../page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation.js";

export default function EvolvePet({ pet }) {
  const [hideEvolve, setHideEvolve] = useState(false);
  const [newData, setNewData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const petName = pet.name.charAt(0).toLowerCase() + pet.name.slice(1);

  let evolutionData;

  const router = useRouter();

  //fetches a pets information and handles evolve button visibility
  useEffect(() => {
    const fetchPokemonData = async (id) => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemonData = await response.json();

        //checks for evolutions
        // Fetch evolution chain data
        const speciesResponse = await fetch(pokemonData.species.url);
        const speciesData = await speciesResponse.json();
        const evolutionChainUrl = speciesData.evolution_chain.url;

        // Fetch evolution chain
        const evolutionChainResponse = await fetch(evolutionChainUrl);
        const evolutionChainData = await evolutionChainResponse.json();
        // if (pet.hearts != 5) {
        //   setHideEvolve(true);
        // }
        if (
          !evolutionChainData.chain ||
          !evolutionChainData.chain.evolves_to ||
          !evolutionChainData.chain.evolves_to[0] ||
          !evolutionChainData.chain.evolves_to[0].species ||
          !evolutionChainData.chain.evolves_to[0].species.name
        ) {
          setHideEvolve(true);
        }
        if (
          pokemonData.name ===
            evolutionChainData.chain.evolves_to[0].species.name &&
          !evolutionChainData.chain.evolves_to[0]?.evolves_to[0]?.species?.name
        ) {
          return setHideEvolve(true);
        }
        if (
          pokemonData.name ===
          evolutionChainData.chain.evolves_to[0]?.evolves_to[0]?.species?.name
        ) {
          return setHideEvolve(true);
        }
      } catch (error) {}
    };

    fetchPokemonData(pet.pokedexId);
  }, []);

  async function fetchEvolutionData() {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pet.pokedexId}`
    );
    const pokemonData = await response.json();

    // Fetch evolution chain data
    const speciesResponse = await fetch(pokemonData.species.url);
    const speciesData = await speciesResponse.json();
    const evolutionChainUrl = speciesData.evolution_chain.url;

    // Fetch evolution chain
    const evolutionChainResponse = await fetch(evolutionChainUrl);
    const evolutionChainData = await evolutionChainResponse.json();

    if (
      evolutionChainData.chain &&
      evolutionChainData.chain.evolves_to &&
      evolutionChainData.chain.evolves_to[0] &&
      evolutionChainData.chain.evolves_to[0].species &&
      evolutionChainData.chain.evolves_to[0].species.name &&
      evolutionChainData.chain.evolves_to[0].species.name !== petName &&
      evolutionChainData.chain.evolves_to[0]?.evolves_to?.[0]?.species?.name !==
        petName
    ) {
      console.log(evolutionChainData.chain.evolves_to[0].species.name);
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${evolutionChainData.chain.evolves_to[0].species.name}`
      );
      const evolvedPokemonData = await response.json();
      if (
        !evolutionChainData.chain.evolves_to[0].evolves_to ||
        !evolutionChainData.chain.evolves_to[0].evolves_to[0] ||
        !evolutionChainData.chain.evolves_to[0].evolves_to[0].species ||
        !evolutionChainData.chain.evolves_to[0].evolves_to[0].species.name
      ) {
        setHideEvolve(true);
      }
      evolutionData = evolvedPokemonData;
      return setNewData(evolvedPokemonData);
    } else if (
      evolutionChainData.chain.evolves_to &&
      evolutionChainData.chain.evolves_to[0] &&
      evolutionChainData.chain.evolves_to[0].evolves_to &&
      evolutionChainData.chain.evolves_to[0].evolves_to[0] &&
      evolutionChainData.chain.evolves_to[0].evolves_to[0].species &&
      evolutionChainData.chain.evolves_to[0].evolves_to[0].species.name &&
      evolutionChainData.chain.evolves_to[0].evolves_to[0].species.name !==
        petName
    ) {
      console.log(
        evolutionChainData.chain.evolves_to[0].evolves_to[0].species.name
      );
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${evolutionChainData.chain.evolves_to[0].evolves_to[0].species.name}`
      );
      const evolvedPokemonData = await response.json();
      setHideEvolve(true);
      evolutionData = evolvedPokemonData;
      return setNewData(evolvedPokemonData);
    } else {
      setHideEvolve(true);
      setError("Evolution chain data is undefined or incomplete");
    }
  }

  async function handleEvolution() {
    try {
      setLoading(true);
      await fetchEvolutionData();

      // Check if evolutionData is not null before accessing its properties
      if (!evolutionData) {
        return setError(" No evolution Data Found!");
      }
      const spriteUrl = pet.isShiny
        ? evolutionData.sprites.front_shiny
        : evolutionData.sprites.front_default;

      const capitalizedName =
        evolutionData.name.charAt(0).toUpperCase() +
        evolutionData.name.slice(1);

      console.log(capitalizedName);

      const response = await fetch(`/api/pets/${pet.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: capitalizedName,
          pokedexId: evolutionData.id,
          spriteUrl,
        }),
      });
      const info = await response.json();

      setError("");
      router.refresh();
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  //   useEffect(() => {
  //     console.log(newData);
  //   }, [newData]);

  return (
    <div>
      {!hideEvolve && (
        <button className={styles.loginBtn} onClick={handleEvolution} disabled={loading}>
          {loading ? "Evolving..." : "Evolve Me!"}
        </button>
      )}
      <p>{error}</p>
    </div>
  );
}
