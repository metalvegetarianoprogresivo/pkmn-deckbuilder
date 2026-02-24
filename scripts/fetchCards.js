// scripts/fetchCards.js
// ─────────────────────────────────────────────────────────────────────────────
// Fetches all Pokémon TCG data from TCGDex API and generates static JSON files.
//
// Generates:
//   data/metadata.json              → Info del build (fecha, totales, idioma)
//   data/sets.json                  → Todos los sets (compacto)
//   data/cards/{setId}.json         → Cartas completas por set
//   data/standard-cards.min.json    → Solo cartas Standard (campos esenciales)
//   data/expanded-cards.min.json    → Solo cartas Expanded (campos esenciales)
//
// TCGDex: https://api.tcgdex.net/v2
// Sin API Key — completamente gratuito y sin límite de rate documentado.
// ─────────────────────────────────────────────────────────────────────────────

const fs   = require('fs');
const path = require('path');

// ── Configuración ──────────────────────────────────────────────────────────────
const LANG          = process.env.TCGDEX_LANG || 'es'; // Idioma principal
const BASE_URL      = `https://api.tcgdex.net/v2/${LANG}`;
const DELAY_MS      = 400;  // Pausa entre requests (cortesía al servidor)
const MAX_RETRIES   = 3;
const DATA_DIR      = path.join(__dirname, '..', 'data');
const CARDS_DIR     = path.join(DATA_DIR, 'cards');

// ── Helpers ────────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch con reintentos y backoff exponencial.
 * TCGDex devuelve arrays directamente (sin wrapper { data: [...] }).
 */
async function apiFetch(url, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);

      if (res.status === 429) {
        const wait = parseInt(res.headers.get('retry-after') || '30', 10) * 1000;
        console.warn(`  ⚠️  Rate limit — esperando ${wait / 1000}s (intento ${attempt}/${retries})`);
        await sleep(wait);
        continue;
      }

      if (res.status === 404) {
        return null; // Recurso no encontrado — no es un error fatal
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      return await res.json();

    } catch (err) {
      if (attempt === retries) throw err;
      const backoff = Math.pow(2, attempt) * 1000;
      console.warn(`  ⚠️  Error (intento ${attempt}/${retries}): ${err.message} — reintentando en ${backoff}ms`);
      await sleep(backoff);
    }
  }
}

/**
 * Escribe JSON a disco con creación de directorios automática.
 */
function writeJSON(filePath, data, minified = false) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const content = minified
    ? JSON.stringify(data)
    : JSON.stringify(data, null, 2);

  fs.writeFileSync(filePath, content, 'utf-8');
  const sizeKB = (Buffer.byteLength(content, 'utf-8') / 1024).toFixed(1);
  console.log(`  💾 ${path.relative(process.cwd(), filePath)} (${sizeKB} KB)`);
}

// ── Diferencias clave TCGDex vs Pokémon TCG API ───────────────────────────────
//
//  Campo         | Pokémon TCG API          | TCGDex
//  --------------|--------------------------|----------------------------------
//  Legalidad     | legalities.standard      | legal.standard  (boolean)
//  Tipo de carta | supertype                | category
//  Imagen        | images.small / .large    | image (URL base, añadir sufijo)
//  Evoluciona de | evolvesFrom              | evolveFrom  (sin 's')
//  Subtipo       | subtypes[]               | stage (string único)
//  Set ID        | set.id                   | set.id  (mismo formato)
//
// Formato de imagen TCGDex:
//   Alta calidad PNG  → `${card.image}/high.png`
//   Baja calidad WebP → `${card.image}/low.webp`

/**
 * Recorta una carta a los campos esenciales para el deck builder.
 * Reduce el tamaño del JSON ~60% respecto a la carta completa.
 */
function trimCardForDeckBuilder(card) {
  return {
    // Identificación
    id:             card.id,
    localId:        card.localId,
    name:           card.name,

    // Tipo de carta (en TCGDex es "category", no "supertype")
    category:       card.category,          // "Pokémon" | "Trainer" | "Energy"
    stage:          card.stage || null,     // "Basic" | "Stage 1" | "Stage 2" | "VMAX" | etc.

    // Stats
    hp:             card.hp            || null,
    types:          card.types         || [],
    evolveFrom:     card.evolveFrom    || null, // ← "evolveFrom" (sin 's')
    regulationMark: card.regulationMark || null,

    // Legalidad — TCGDex usa booleanos, no strings
    // { standard: true, expanded: true }  (ausencia = no legal)
    legal: {
      standard: card.legal?.standard  === true,
      expanded: card.legal?.expanded  === true,
    },

    // Set (referencia compacta)
    set: {
      id:   card.set?.id,
      name: card.set?.name,
    },

    // Imagen — TCGDex devuelve URL base, tú construyes la URL final:
    //   Alta calidad:  image + '/high.png'
    //   Optimizado:    image + '/low.webp'
    image: card.image || null,

    // Tipo de energía (para distinguir básica de especial)
    energyType: card.energyType || null,

    // Número de carta en el set
    number: card.localId,
    rarity: card.rarity || null,
  };
}

// ── Pipeline principal ─────────────────────────────────────────────────────────
async function main() {
  console.log('🔄 Iniciando fetch desde TCGDex...');
  console.log(`   Idioma:   ${LANG}`);
  console.log(`   Base URL: ${BASE_URL}`);
  console.log(`   Output:   ${DATA_DIR}\n`);

  const startTime = Date.now();
  const stats = { sets: 0, cards: 0, standard: 0, expanded: 0, errors: [] };

  // ── Paso 1: Obtener todas las series ──────────────────────────────────────
  console.log('📚 Obteniendo series...');
  const series = await apiFetch(`${BASE_URL}/series`);

  if (!series || !Array.isArray(series)) {
    throw new Error('No se pudieron obtener las series de TCGDex.');
  }
  console.log(`  ✅ ${series.length} series encontradas\n`);

  // ── Paso 2: Obtener sets de cada serie ────────────────────────────────────
  console.log('📦 Obteniendo sets...');
  const allSets = [];

  for (const serieResume of series) {
    const serie = await apiFetch(`${BASE_URL}/series/${serieResume.id}`);
    if (!serie?.sets?.length) continue;

    for (const setResume of serie.sets) {
      allSets.push({
        id:          setResume.id,
        name:        setResume.name,
        serie:       { id: serie.id, name: serie.name },
        logo:        setResume.logo  || null,
        symbol:      setResume.symbol || null,
        cardCount:   setResume.cardCount || 0,
      });
    }
    await sleep(DELAY_MS);
  }

  stats.sets = allSets.length;
  writeJSON(path.join(DATA_DIR, 'sets.json'), allSets);
  console.log(`  ✅ ${allSets.length} sets totales\n`);

  // ── Paso 3: Obtener cartas de cada set ────────────────────────────────────
  console.log('🃏 Obteniendo cartas por set...');
  const standardCards = [];
  const expandedCards = [];

  for (const setInfo of allSets) {
    console.log(`\n  📂 ${setInfo.name} (${setInfo.id})`);

    // Fetch del set completo (incluye lista de cartas con localId)
    const setData = await apiFetch(`${BASE_URL}/sets/${setInfo.id}`);

    if (!setData?.cards?.length) {
      console.log('     ⚠️  Set sin cartas, omitiendo.');
      continue;
    }

    // Fetch individual de cada carta para obtener datos completos
    const fullCards = [];
    let setErrors = 0;

    for (const cardResume of setData.cards) {
      const cardId = `${setInfo.id}-${cardResume.localId}`;

      try {
        // TCGDex: endpoint de carta individual → /cards/{setId}-{localId}
        const card = await apiFetch(`${BASE_URL}/cards/${cardId}`);

        if (card) {
          fullCards.push(card);

          // Clasificar por formato de legalidad (booleano en TCGDex)
          if (card.legal?.standard === true) {
            standardCards.push(trimCardForDeckBuilder(card));
            stats.standard++;
          }
          if (card.legal?.expanded === true) {
            expandedCards.push(trimCardForDeckBuilder(card));
            stats.expanded++;
          }
        }
      } catch (err) {
        setErrors++;
        stats.errors.push(`${cardId}: ${err.message}`);
        console.warn(`     ⚠️  Error en carta ${cardId}: ${err.message}`);
      }

      await sleep(150); // Pausa pequeña entre cartas
    }

    stats.cards += fullCards.length;

    // Escribir JSON completo del set
    writeJSON(path.join(CARDS_DIR, `${setInfo.id}.json`), fullCards);

    const setStatus = setErrors > 0 ? ` (${setErrors} errores)` : '';
    console.log(`     ✅ ${fullCards.length} cartas${setStatus}`);

    await sleep(DELAY_MS);
  }

  // ── Paso 4: Escribir agregados por formato ────────────────────────────────
  console.log('\n📋 Escribiendo agregados por formato...');

  // Minificado para mejor performance en GitHub Pages
  writeJSON(
    path.join(DATA_DIR, 'standard-cards.min.json'),
    standardCards,
    true // minificado
  );
  writeJSON(
    path.join(DATA_DIR, 'expanded-cards.min.json'),
    expandedCards,
    true // minificado
  );

  // ── Paso 5: Metadata del build ────────────────────────────────────────────
  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

  const metadata = {
    lastUpdated:       new Date().toISOString(),
    lang:              LANG,
    source:            'https://api.tcgdex.net/v2',
    buildDurationMin:  parseFloat(elapsed),
    totalSets:         stats.sets,
    totalCards:        stats.cards,
    standardLegalCards: stats.standard,
    expandedLegalCards: stats.expanded,
    errors:            stats.errors.length,
    errorDetails:      stats.errors.length > 0 ? stats.errors : undefined,
  };

  writeJSON(path.join(DATA_DIR, 'metadata.json'), metadata);

  // ── Resumen final ──────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(60));
  console.log('🎉 ¡Fetch completado!');
  console.log(`   Sets:              ${stats.sets}`);
  console.log(`   Cartas totales:    ${stats.cards}`);
  console.log(`   Standard-legal:    ${stats.standard}`);
  console.log(`   Expanded-legal:    ${stats.expanded}`);
  console.log(`   Errores:           ${stats.errors.length}`);
  console.log(`   Tiempo:            ${elapsed} minutos`);
  console.log('─'.repeat(60));

  if (stats.errors.length > 0) {
    console.warn(`\n⚠️  ${stats.errors.length} errores durante el fetch (ver metadata.json)`);
  }
}

// ── Entry point ───────────────────────────────────────────────────────────────
main().catch((err) => {
  console.error('\n❌ Error fatal:', err.message);
  process.exit(1);
});
