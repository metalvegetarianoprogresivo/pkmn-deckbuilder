// ─────────────────────────────────────────────────────────────────────────────
// deck-builder-api.js
// Cómo consumir los JSON estáticos de TCGDex desde tu deck builder en Vanilla JS
//
// Diferencias clave TCGDex vs Pokémon TCG API que afectan al frontend:
//
//   Campo         │ Pokémon TCG API             │ TCGDex
//   ──────────────┼─────────────────────────────┼──────────────────────────────
//   Legalidad     │ legalities.standard="Legal"  │ legal.standard = true (bool)
//   Tipo de carta │ supertype                    │ category
//   Imagen        │ images.small / images.large  │ image + '/low.webp' o '/high.png'
//   Evoluciona de │ evolvesFrom                  │ evolveFrom (sin 's')
//   Subtipo       │ subtypes[]                   │ stage (string único)
//
// ─────────────────────────────────────────────────────────────────────────────

// ── URLs base (ajusta si usas un dominio personalizado) ───────────────────────
const DATA_BASE = './data';

// ── Carga de datos ────────────────────────────────────────────────────────────

/** Carga el índice de todos los sets. Pequeño (~30 KB), cárgalo al inicio. */
async function loadSets() {
  const res = await fetch(`${DATA_BASE}/sets.json`);
  return res.json(); // Array de sets
}

/** Carga todas las cartas Standard-legal (pre-filtradas y recortadas). */
async function loadStandardCards() {
  const res = await fetch(`${DATA_BASE}/standard-cards.min.json`);
  return res.json(); // Array de cartas
}

/** Carga todas las cartas Expanded-legal. */
async function loadExpandedCards() {
  const res = await fetch(`${DATA_BASE}/expanded-cards.min.json`);
  return res.json();
}

/** Carga las cartas completas de un set específico (lazy, bajo demanda). */
async function loadSetCards(setId) {
  const res = await fetch(`${DATA_BASE}/cards/${setId}.json`);
  if (!res.ok) throw new Error(`Set ${setId} no encontrado`);
  return res.json();
}

/** Carga la metadata del último build (fecha, totales, etc.). */
async function loadMetadata() {
  const res = await fetch(`${DATA_BASE}/metadata.json`);
  return res.json();
}

// ── Imágenes ──────────────────────────────────────────────────────────────────
//
// TCGDex devuelve una URL base en card.image.
// Tú construyes la URL final añadiendo el sufijo de calidad y formato.

const CardImage = {
  /** Imagen pequeña, optimizada WebP (recomendado para listas y grids) */
  small:  (card) => card.image ? `${card.image}/low.webp`  : null,

  /** Imagen grande PNG (para modales y detalles de carta) */
  large:  (card) => card.image ? `${card.image}/high.png`  : null,

  /** Imagen pequeña PNG como fallback si WebP no está soportado */
  smallPng: (card) => card.image ? `${card.image}/low.png` : null,
};

// ── Legalidad ─────────────────────────────────────────────────────────────────
//
// ⚠️  DIFERENCIA CRÍTICA: TCGDex usa booleanos, no strings.
//     Pokémon TCG API: card.legalities.standard === "Legal"
//     TCGDex:          card.legal.standard === true

function esLegalEnFormato(card, formato) {
  // formato: 'standard' | 'expanded'
  return card.legal?.[formato] === true;
}

function obtenerBadgesLegalidad(card) {
  const badges = [];
  if (card.legal?.standard) badges.push('Standard');
  if (card.legal?.expanded)  badges.push('Expanded');
  return badges;
}

// ── Categorías de carta ───────────────────────────────────────────────────────
//
// En TCGDex el campo es "category" (no "supertype").
// Valores: "Pokémon" | "Trainer" | "Energy"

function getCategoryIcon(card) {
  switch (card.category) {
    case 'Pokémon': return '⚡';
    case 'Trainer':  return '🎓';
    case 'Energy':   return '✨';
    default:         return '❓';
  }
}

function esPokemon(card)  { return card.category === 'Pokémon'; }
function esTrainer(card)  { return card.category === 'Trainer'; }
function esEnergia(card)  { return card.category === 'Energy'; }
function esEnergiaBasica(card) {
  return esEnergia(card) && card.stage === 'Basic';
}

// ── Búsqueda y filtrado local ─────────────────────────────────────────────────

/**
 * Busca cartas por nombre en el array de cartas ya cargado.
 * TCGDex devuelve nombres ya en el idioma configurado (es, en, fr...).
 */
function buscarCartas(cards, { nombre = '', categoria = '', tipo = '', formato = null } = {}) {
  return cards.filter((card) => {
    if (nombre     && !card.name.toLowerCase().includes(nombre.toLowerCase())) return false;
    if (categoria  && card.category !== categoria)                             return false;
    if (tipo       && !card.types?.includes(tipo))                            return false;
    if (formato    && !esLegalEnFormato(card, formato))                       return false;
    return true;
  });
}

// ── Deck Builder ──────────────────────────────────────────────────────────────

class DeckBuilder {
  constructor(formato = 'standard') {
    this.formato  = formato;
    this.maxCartas = 60;
    this.deck = { pokemon: [], trainers: [], energy: [] };
  }

  /**
   * ⚠️ La legalidad en TCGDex es un booleano, no un string.
   */
  esLegal(card) {
    return card.legal?.[this.formato] === true;
  }

  getCategoria(card) {
    if (card.category === 'Pokémon') return 'pokemon';
    if (card.category === 'Trainer')  return 'trainers';
    if (card.category === 'Energy')   return 'energy';
    return null;
  }

  contarCopias(nombreCarta) {
    let total = 0;
    Object.values(this.deck).forEach((lista) => {
      lista.forEach((entry) => {
        if (entry.card.name === nombreCarta) total += entry.cantidad;
      });
    });
    return total;
  }

  contarTotal() {
    return Object.values(this.deck)
      .flat()
      .reduce((sum, entry) => sum + entry.cantidad, 0);
  }

  agregarCarta(card, cantidad = 1) {
    // Validar legalidad
    if (!this.esLegal(card)) {
      throw new Error(`${card.name} no es legal en formato ${this.formato}.`);
    }

    // Validar límite de copias (energías básicas son ilimitadas)
    if (!esEnergiaBasica(card)) {
      const copias = this.contarCopias(card.name);
      if (copias + cantidad > 4) {
        throw new Error(`Máximo 4 copias de "${card.name}" (tienes ${copias}).`);
      }
    }

    // Validar tamaño del deck
    const total = this.contarTotal();
    if (total + cantidad > this.maxCartas) {
      throw new Error(`El deck no puede superar ${this.maxCartas} cartas.`);
    }

    const categoria = this.getCategoria(card);
    if (!categoria) throw new Error(`Categoría desconocida: ${card.category}`);

    // Buscar si ya existe y sumar, o agregar nueva entrada
    const lista = this.deck[categoria];
    const existente = lista.find((e) => e.card.id === card.id);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      lista.push({ card, cantidad });
    }

    return this;
  }

  eliminarCarta(cardId) {
    for (const lista of Object.values(this.deck)) {
      const idx = lista.findIndex((e) => e.card.id === cardId);
      if (idx !== -1) { lista.splice(idx, 1); return true; }
    }
    return false;
  }

  /**
   * Exporta en formato PTCGO / PTCGL estándar.
   * TCGDex usa setId-localId como ID (mismo que Pokémon TCG API).
   */
  exportarPTCGO() {
    const lineas = [];

    const formatearLineas = (lista, titulo) => {
      if (!lista.length) return;
      lineas.push(titulo);
      lista.forEach(({ card, cantidad }) => {
        // Formato: "4 Charizard-ex sv3-54"
        lineas.push(`${cantidad} ${card.name} ${card.id}`);
      });
      lineas.push('');
    };

    formatearLineas(this.deck.pokemon,  'Pokémon:');
    formatearLineas(this.deck.trainers, 'Entrenador:');
    formatearLineas(this.deck.energy,   'Energía:');

    return lineas.join('\n').trim();
  }

  get resumen() {
    const total = this.contarTotal();
    return {
      total,
      pokemon:  this.deck.pokemon.reduce((s, e)  => s + e.cantidad, 0),
      trainers: this.deck.trainers.reduce((s, e) => s + e.cantidad, 0),
      energy:   this.deck.energy.reduce((s, e)   => s + e.cantidad, 0),
      completo: total === this.maxCartas,
    };
  }
}

// ── Ejemplo de uso completo ───────────────────────────────────────────────────

async function ejemploUso() {
  // 1. Cargar datos al iniciar la app
  const [sets, standardCards, meta] = await Promise.all([
    loadSets(),
    loadStandardCards(),
    loadMetadata(),
  ]);

  console.log(`📅 Datos actualizados: ${new Date(meta.lastUpdated).toLocaleDateString('es')}`);
  console.log(`🃏 ${meta.standardLegalCards} cartas Standard disponibles`);

  // 2. Buscar Pikachu en Standard
  const pikachus = buscarCartas(standardCards, {
    nombre:  'Pikachu',
    formato: 'standard',
  });
  console.log(`⚡ Pikachus en Standard: ${pikachus.length}`);

  // 3. Construir imagen de carta
  if (pikachus[0]) {
    const img = CardImage.small(pikachus[0]);
    console.log(`🖼  Imagen: ${img}`);
    // → https://assets.tcgdex.net/es/sv/sv3/94/low.webp
  }

  // 4. Construir un deck
  const deck = new DeckBuilder('standard');
  // deck.agregarCarta(pikachus[0], 4);
  // deck.agregarCarta(algoOtro, 2);
  // console.log(deck.exportarPTCGO());
  // console.log(deck.resumen);
}

// ejemploUso();
