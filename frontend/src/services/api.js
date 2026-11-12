/**
 * api.js
 * 
 * Servicios de comunicación con el backend (API REST)
 * Consulta los endpoints públicos de la base de datos (MySQL vía API)
 * con fallback seguro en caso de que el backend esté en proceso de inicio.
 */

const API_BASE_URL = '/api';

// Datos de fallback seguros si el backend aún no está iniciado o en fase de seed
const DEFAULT_ESPECIALIDADES = [
  { id: 1, nombre: 'Cardiología', descripcion: 'Prevención cardiovascular, chequeos y control de presión arterial.' },
  { id: 2, nombre: 'Pediatría', descripcion: 'Atención integral y seguimiento del desarrollo infantil.' },
  { id: 3, nombre: 'Dermatología', descripcion: 'Diagnóstico y tratamiento de afecciones de la piel y control de lunares.' },
  { id: 4, nombre: 'Clínica Médica', descripcion: 'Atención primaria integral, diagnóstico preventivo y chequeos anuales.' },
  { id: 5, nombre: 'Traumatología', descripcion: 'Tratamiento de lesiones óseas, articulares y musculares.' },
  { id: 6, nombre: 'Ginecología', descripcion: 'Salud reproductiva femenina y controles periódicos preventivos.' },
  { id: 7, nombre: 'Oftalmología', descripcion: 'Exámenes visuales, agudeza visual y salud ocular.' },
  { id: 8, nombre: 'Kinesiología', descripcion: 'Rehabilitación física, kinesiología motora y fisioterapia.' }
];

const DEFAULT_COBERTURAS = [
  { id: 1, nombre: 'OSDE' },
  { id: 2, nombre: 'Swiss Medical' },
  { id: 3, nombre: 'Galeno' },
  { id: 4, nombre: 'Medifé' },
  { id: 5, nombre: 'PAMI' },
  { id: 6, nombre: 'IOMA' },
  { id: 7, nombre: 'OSECAC' },
  { id: 8, nombre: 'Accord Salud' },
  { id: 9, nombre: 'Particular' }
];

/**
 * Obtener listado público de especialidades médicas (GET /api/especialidades)
 */
export async function getEspecialidades() {
  try {
    const response = await fetch(`${API_BASE_URL}/especialidades`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`Error en API: ${response.status}`);
    }
    const data = await response.json();
    // Soporta respuestas de formato { data: [...] } o array directo [...]
    const list = Array.isArray(data) ? data : (data.data || DEFAULT_ESPECIALIDADES);
    return list.length > 0 ? list : DEFAULT_ESPECIALIDADES;
  } catch (error) {
    console.warn('[API] Fallback en especialidades (backend offline o sin conexión):', error.message);
    return DEFAULT_ESPECIALIDADES;
  }
}

/**
 * Obtener listado público de coberturas / obras sociales (GET /api/coberturas)
 */
export async function getCoberturas() {
  try {
    const response = await fetch(`${API_BASE_URL}/coberturas`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`Error en API: ${response.status}`);
    }
    const data = await response.json();
    const list = Array.isArray(data) ? data : (data.data || DEFAULT_COBERTURAS);
    return list.length > 0 ? list : DEFAULT_COBERTURAS;
  } catch (error) {
    console.warn('[API] Fallback en coberturas (backend offline o sin conexión):', error.message);
    return DEFAULT_COBERTURAS;
  }
}

export default {
  getEspecialidades,
  getCoberturas
};
