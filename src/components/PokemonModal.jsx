import { useEffect, useRef, useState } from 'react';

// Diccionario de colores de tipo
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

// Traducción amigable de estadísticas
const STAT_NAMES = {
  hp: 'Puntos de Salud (HP)',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'Ataque Especial',
  'special-defense': 'Defensa Especial',
  speed: 'Velocidad',
};

/**
 * Modal accesible de detalles completos de un Pokémon.
 * Incluye audio oficial (cries), medidas físicas, habilidades,
 * conmutador a versión Shiny y estadísticas base completas.
 *
 * @param {{ pokemon: Object, onClose: () => void }} props
 */
function PokemonModal({ pokemon, onClose }) {
  const [isPlayingCry, setIsPlayingCry] = useState(false);
  const [isShiny, setIsShiny] = useState(false);
  const audioRef = useRef(null);

  // Cierre con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!pokemon) return null;

  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;
  const formattedName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  const primaryType = pokemon.types?.[0]?.type?.name || 'normal';
  const primaryColor = TYPE_COLORS[primaryType] || '#6890F0';

  const officialArtwork =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default;

  const shinyArtwork =
    pokemon.sprites?.other?.['official-artwork']?.front_shiny ||
    pokemon.sprites?.front_shiny;

  const currentArtwork =
    isShiny && shinyArtwork ? shinyArtwork : officialArtwork;

  // Audio oficial de PokéAPI v2
  const cryAudioUrl = pokemon.cries?.latest || pokemon.cries?.legacy;

  const handlePlayCry = () => {
    if (!cryAudioUrl) return;
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => setIsPlayingCry(true))
        .catch((err) => console.warn('Audio play error:', err));
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-pokemon-title"
    >
      <div
        className="modal-card"
        style={{ '--type-color': primaryColor }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de Cierre */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Cerrar detalles del Pokémon"
        >
          ✕
        </button>

        {/* Cabecera del Modal */}
        <header className="modal-header">
          <span className="modal-id">{formattedId}</span>
          <h2 id="modal-pokemon-title" className="modal-title">
            {formattedName} {isShiny && <span className="modal-shiny-tag">Shiny</span>}
          </h2>

          <div className="pokemon-card__types" style={{ margin: '0.4rem 0' }}>
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
        </header>

        {/* Sección de Arte e Ilustraciones */}
        <div className="modal-artwork-section">
          <div className="modal-image-wrapper">
            <img
              src={currentArtwork}
              alt={`Ilustración oficial de ${formattedName}`}
              className="modal-main-image"
            />
          </div>

          <div className="modal-action-buttons">
            {/* Conmutador Shiny */}
            {shinyArtwork && (
              <button
                type="button"
                className={`btn-shiny ${isShiny ? 'btn-shiny--active' : ''}`}
                onClick={() => setIsShiny((prev) => !prev)}
                title="Alternar entre variante normal y variocolor (shiny)"
              >
                ✨ {isShiny ? 'Ver Normal' : 'Ver Shiny'}
              </button>
            )}

            {/* Botón de Sonido / Grito */}
            {cryAudioUrl && (
              <div className="modal-audio-controls">
                <audio
                  ref={audioRef}
                  src={cryAudioUrl}
                  onEnded={() => setIsPlayingCry(false)}
                  preload="none"
                />
                <button
                  type="button"
                  className={`btn-cry ${isPlayingCry ? 'btn-cry--playing' : ''}`}
                  onClick={handlePlayCry}
                  title="Escuchar sonido oficial de la criatura"
                >
                  🔊 {isPlayingCry ? 'Reproduciendo...' : 'Grito Oficial'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Datos Físicos: Altura, Peso y Habilidades */}
        <section className="modal-info-grid">
          <div className="modal-info-card">
            <span className="modal-info-label">Altura</span>
            <span className="modal-info-value">
              {(pokemon.height / 10).toFixed(1)} m
            </span>
          </div>

          <div className="modal-info-card">
            <span className="modal-info-label">Peso</span>
            <span className="modal-info-value">
              {(pokemon.weight / 10).toFixed(1)} kg
            </span>
          </div>

          <div className="modal-info-card modal-info-card--wide">
            <span className="modal-info-label">Habilidades</span>
            <span className="modal-info-value modal-info-value--abilities">
              {pokemon.abilities
                ?.map(
                  (a) =>
                    a.ability.name.charAt(0).toUpperCase() +
                    a.ability.name.slice(1)
                )
                .join(', ') || 'N/A'}
            </span>
          </div>
        </section>

        {/* Estadísticas Base Completas */}
        <section className="modal-stats-section">
          <h3 className="modal-section-title">Estadísticas Base</h3>
          <div className="modal-stats-list">
            {pokemon.stats?.map((statItem) => {
              const statName = statItem.stat.name;
              const displayName = STAT_NAMES[statName] || statName;
              const baseStat = statItem.base_stat;
              const percent = Math.min(100, (baseStat / 180) * 100);

              return (
                <div key={statName} className="modal-stat-row">
                  <span className="modal-stat-name">{displayName}</span>
                  <div className="modal-stat-bar-track">
                    <div
                      className="modal-stat-bar-fill"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: primaryColor,
                      }}
                    />
                  </div>
                  <span className="modal-stat-number">{baseStat}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default PokemonModal;
