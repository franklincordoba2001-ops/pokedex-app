import axios from 'axios';

/**
 * Instancia de Axios configurada con la URL base de PokéAPI obtenida desde
 * las variables de entorno de Vite (VITE_POKEAPI_URL).
 * Se define un fallback en caso de no encontrarse definida en el entorno.
 */
const BASE_URL = import.meta.env.VITE_POKEAPI_URL || 'https://pokeapi.co/api/v2';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Obtiene el listado paginado inicial del catálogo de Pokémon.
 *
 * @param {number} [limit=20] - Cantidad de registros a solicitar.
 * @param {number} [offset=0] - Desplazamiento inicial para paginación.
 * @returns {Promise<Array<{name: string, url: string}>>} Arreglo con nombres y URLs de los Pokémon.
 */
export const getPokemonList = async (limit = 20, offset = 0) => {
  try {
    const response = await apiClient.get('/pokemon', {
      params: { limit, offset },
    });
    return response.data.results;
  } catch (error) {
    console.error(
      `[pokemonService] Error en getPokemonList (limit=${limit}, offset=${offset}):`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        'Error al obtener el catálogo de Pokémon. Verifica tu conexión.'
    );
  }
};

/**
 * Consulta los detalles completos de un Pokémon específico (sprites, estadísticas y tipos).
 *
 * @param {string|number} nameOrId - Nombre (ej. "pikachu") o ID numérico (ej. 25).
 * @returns {Promise<Object>} Objeto con los datos detallados del Pokémon.
 */
export const getPokemonDetails = async (nameOrId) => {
  try {
    if (!nameOrId) {
      throw new Error('Se requiere un identificador o nombre válido de Pokémon.');
    }

    const cleanIdentifier = String(nameOrId).toLowerCase().trim();
    const response = await apiClient.get(`/pokemon/${cleanIdentifier}`);
    return response.data;
  } catch (error) {
    console.error(
      `[pokemonService] Error en getPokemonDetails para "${nameOrId}":`,
      error.response?.data || error.message
    );
    throw new Error(
      `No se pudo cargar la información del Pokémon "${nameOrId}".`
    );
  }
};

export default apiClient;

