import { useState, useEffect, useId } from 'react';
import { getPokemonList } from './services/pokemonService';
import PokemonCard from './components/PokemonCard';
import './App.css';

/**
 * Componente Principal de la Aplicación Pokédex.
 * Gestiona el catálogo de Pokémon, estado de búsqueda y renderizado condicional.
 */
function App() {
  // Estados requeridos de la interfaz
  const [pokemonList, setPokemonList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchInputId = useId();

  // Función para consultar el catálogo inicial desde la PokéAPI
  const fetchCatalog = () => {
    setLoading(true);
    setError(null);

    getPokemonList(60, 0)
      .then((data) => {
        setPokemonList(data);
      })
      .catch((err) => {
        setError(
          err.message ||
            'No fue posible obtener el catálogo. Por favor verifica tu conexión y la variable VITE_POKEAPI_URL.'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Efecto ejecutado una sola vez al montar el componente (consulta inicial)
  useEffect(() => {
    let isMounted = true;

    getPokemonList(60, 0)
      .then((data) => {
        if (isMounted) {
          setPokemonList(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err.message ||
              'No fue posible obtener el catálogo. Por favor verifica tu conexión y la variable VITE_POKEAPI_URL.'
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtrado reactivo en memoria en tiempo real sin recargar la página
  const filteredPokemon = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div className="pokedex-app">
      {/* Cabecera / Navbar */}
      <header className="pokedex-header">
        <div className="pokedex-header__content">
          <div className="pokedex-header__brand">
            <span className="pokedex-header__ball-icon" aria-hidden="true" />
            <h1 className="pokedex-header__title">Pokédex App</h1>
          </div>
          <p className="pokedex-header__subtitle">
            Explora y filtra Pokémon en tiempo real consumiendo PokéAPI v2 con Vite y React
          </p>
        </div>
      </header>

      {/* Contenedor principal */}
      <main className="pokedex-main">
        {/* Barra de Búsqueda Reactiva */}
        <section className="search-section" aria-label="Búsqueda de Pokémon">
          <div className="search-box">
            <label htmlFor={searchInputId} className="search-box__icon" aria-hidden="true">
              🔍
            </label>
            <input
              id={searchInputId}
              type="text"
              className="search-box__input"
              placeholder="Buscar Pokémon por nombre (ej. pikachu, charizard)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={loading && pokemonList.length === 0}
              autoComplete="off"
              aria-label="Buscar Pokémon por nombre"
            />
            {search && (
              <button
                type="button"
                className="search-box__clear"
                onClick={() => setSearch('')}
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
          <div className="search-meta">
            {!loading && !error && (
              <span className="search-meta__counter">
                Mostrando <strong>{filteredPokemon.length}</strong> de {pokemonList.length} Pokémon
              </span>
            )}
          </div>
        </section>

        {/* 1. Renderizado condicional: Estado de Carga Global */}
        {loading && (
          <div className="state-feedback state-feedback--loading" role="status" aria-live="polite">
            <div className="pokeball-spinner" />
            <p className="state-feedback__title">Conectando con PokéAPI...</p>
            <p className="state-feedback__desc">Cargando el catálogo de criaturas iniciales.</p>
          </div>
        )}

        {/* 2. Renderizado condicional: Error de Red / Conexión */}
        {!loading && error && (
          <div className="state-feedback state-feedback--error" role="alert">
            <span className="state-feedback__icon">⚠️</span>
            <h2 className="state-feedback__title">Error de Conexión</h2>
            <p className="state-feedback__desc">{error}</p>
            <button
              type="button"
              className="btn-retry"
              onClick={fetchCatalog}
            >
              Reintentar Conexión
            </button>
          </div>
        )}

        {/* 3. Renderizado condicional: Sin Coincidencias en el Filtro */}
        {!loading && !error && filteredPokemon.length === 0 && (
          <div className="state-feedback state-feedback--empty">
            <span className="state-feedback__icon">🔍</span>
            <h2 className="state-feedback__title">No se encontraron coincidencias</h2>
            <p className="state-feedback__desc">
              Ningún Pokémon coincide con el término de búsqueda <strong>"{search}"</strong>.
            </p>
            <button
              type="button"
              className="btn-retry"
              onClick={() => setSearch('')}
            >
              Limpiar Filtro
            </button>
          </div>
        )}

        {/* 4. Renderizado condicional: Cuadrícula con las Tarjetas Filtradas */}
        {!loading && !error && filteredPokemon.length > 0 && (
          <section className="pokemon-grid" aria-label="Catálogo de Pokémon">
            {filteredPokemon.map((pokemon) => (
              <PokemonCard
                key={pokemon.name}
                pokemonName={pokemon.name}
              />
            ))}
          </section>
        )}
      </main>

      {/* Pie de página */}
      <footer className="pokedex-footer">
        <p>
          Taller Práctico de Integración con APIs REST &middot; Construido con React 19, Vite y PokéAPI v2.
        </p>
      </footer>
    </div>
  );
}

export default App;
