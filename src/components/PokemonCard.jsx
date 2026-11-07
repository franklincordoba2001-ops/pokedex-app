import { useState, useEffect } from 'react';
import { getPokemonDetails } from '../services/pokemonService';

// Diccionario de colores oficiales por tipo de Pokémon para estilizado dinámico
const TYPE_COLORS = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
  dark: '#705848',
};

/**
 * Componente de tarjeta individual de Pokémon.
 * Gestiona de forma desacoplada la obtención de los detalles (sprites, stats, tipos)
 * de acuerdo con el nombre recibido vía props.
 *
 * @param {{ pokemonName: string, onSelect?: (pokemon: Object) => void }} props
 */
function PokemonCard({ pokemonName, onSelect }) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDetails = async () => {
      try {
        const data = await getPokemonDetails(pokemonName);
        if (isMounted) {
          setPokemon(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Error al cargar');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (pokemonName) {
      fetchDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [pokemonName]);

  // 1. Renderizado condicional: Estado de Carga (Skeleton)
  if (loading) {
    return (
      <div className="pokemon-card pokemon-card--loading" aria-busy="true">
        <div className="skeleton skeleton--image" />
        <div className="skeleton skeleton--badge" />
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--stats" />
      </div>
    );
  }

  // 2. Renderizado condicional: Manejo de Error en tarjeta individual
  if (error || !pokemon) {
    return (
      <div className="pokemon-card pokemon-card--error">
        <p className="pokemon-card__error-text">
          ⚠️ No se pudo cargar: <strong>{pokemonName}</strong>
        </p>
      </div>
    );
  }

  // Extracción y formateo de datos requeridos
  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;
  const formattedName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  // Sprite: preferir artwork oficial, con fallback al sprite frontal clásico
  const spriteUrl =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default ||
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';

  // Estadísticas base requeridas: HP y Ataque
  const hpStat =
    pokemon.stats?.find((stat) => stat.stat.name === 'hp')?.base_stat ?? 'N/A';
  const attackStat =
    pokemon.stats?.find((stat) => stat.stat.name === 'attack')?.base_stat ??
    'N/A';

  // Tipo primario para definir el color y gradiente de fondo de la tarjeta
  const primaryType = pokemon.types?.[0]?.type?.name || 'normal';
  const primaryColor = TYPE_COLORS[primaryType] || '#777';

  const handleCardClick = () => {
    if (onSelect && pokemon) {
      onSelect(pokemon);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && onSelect && pokemon) {
      e.preventDefault();
      onSelect(pokemon);
    }
  };

  return (
    <article
      className="pokemon-card pokemon-card--interactive"
      tabIndex={0}
      role="button"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      aria-label={`Ver detalles completos de ${formattedName}`}
      style={{
        '--type-color': primaryColor,
      }}
    >
      {/* Cabecera de la tarjeta: ID y Sprite */}
      <header className="pokemon-card__header">
        <span className="pokemon-card__id">{formattedId}</span>
        <div className="pokemon-card__image-container">
          <img
            src={spriteUrl}
            alt={`Sprite frontal oficial de ${formattedName}`}
            className="pokemon-card__image"
            loading="lazy"
          />
        </div>
      </header>

      {/* Cuerpo de la tarjeta: Nombre formateado y Tipos */}
      <div className="pokemon-card__body">
        <h3 className="pokemon-card__name">{formattedName}</h3>

        <div className="pokemon-card__types" aria-label="Tipos del Pokémon">
          {pokemon.types?.map((typeInfo) => {
            const typeName = typeInfo.type.name;
            const badgeColor = TYPE_COLORS[typeName] || '#888';
            return (
              <span
                key={typeName}
                className="pokemon-card__type-badge"
                style={{ backgroundColor: badgeColor }}
              >
                {typeName}
              </span>
            );
          })}
        </div>

        {/* Sección de Estadísticas Base: HP y Ataque */}
        <section className="pokemon-card__stats" aria-label="Estadísticas base">
          <div className="pokemon-card__stat-row">
            <span className="pokemon-card__stat-label">HP</span>
            <div className="pokemon-card__stat-bar-container">
              <div
                className="pokemon-card__stat-bar pokemon-card__stat-bar--hp"
                style={{
                  width: `${Math.min(100, ((typeof hpStat === 'number' ? hpStat : 0) / 160) * 100)}%`,
                }}
              />
            </div>
            <span className="pokemon-card__stat-value">{hpStat}</span>
          </div>

          <div className="pokemon-card__stat-row">
            <span className="pokemon-card__stat-label">Ataque</span>
            <div className="pokemon-card__stat-bar-container">
              <div
                className="pokemon-card__stat-bar pokemon-card__stat-bar--attack"
                style={{
                  width: `${Math.min(100, ((typeof attackStat === 'number' ? attackStat : 0) / 160) * 100)}%`,
                }}
              />
            </div>
            <span className="pokemon-card__stat-value">{attackStat}</span>
          </div>
        </section>

        <footer className="pokemon-card__footer">
          <span className="pokemon-card__hint">Ver detalles completos &rarr;</span>
        </footer>
      </div>
    </article>
  );
}

export default PokemonCard;
