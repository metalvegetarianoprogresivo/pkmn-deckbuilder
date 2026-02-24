// ── Basic Energy Detection ──────────────────────────────────────────────────
// Basic energies are unlimited (no 4-copy rule). Since the trimmed data
// doesn't include energyType, we detect by name.

const BASIC_ENERGY_NAMES = new Set([
    'Energía Agua', 'Energía Fuego', 'Energía Planta', 'Energía Rayo',
    'Energía Psíquica', 'Energía Lucha', 'Energía Oscura', 'Energía Metálica',
    'Energía Water Básica', 'Energía Fire Básica', 'Energía Grass Básica',
    'Energía Lightning Básica', 'Energía Fighting Básica', 'Energía Psychic Básica',
    'Energía Darkness Básica', 'Energía Metal Básica',
]);

function isBasicEnergy(card) {
    return card.category === 'Energía' && BASIC_ENERGY_NAMES.has(card.name);
}

// ── Category Helpers ────────────────────────────────────────────────────────

function categoryToDeckKey(category) {
    switch (category) {
        case 'Pokémon':    return 'pokemon';
        case 'Entrenador': return 'trainers';
        case 'Energía':    return 'energy';
        default:           return null;
    }
}

function getCategoryIcon(category) {
    switch (category) {
        case 'Pokémon':    return '\u26A1';
        case 'Entrenador': return '\uD83C\uDF93';
        case 'Energía':    return '\u2728';
        default:           return '\u2753';
    }
}

function getCategoryClass(category) {
    switch (category) {
        case 'Pokémon':    return 'cat-pokemon';
        case 'Entrenador': return 'cat-trainer';
        case 'Energía':    return 'cat-energy';
        default:           return '';
    }
}

// ── Data Loading ────────────────────────────────────────────────────────────

async function loadCardData(format) {
    isLoadingCards = true;
    updateCardLoadingState(true);

    const file = format === 'standard'
        ? 'data/standard-cards.min.json'
        : 'data/expanded-cards.min.json';

    try {
        const res = await fetch(file);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        loadedCards = await res.json();
        isLoadingCards = false;
        updateCardLoadingState(false);
        showToast(`${loadedCards.length} cartas cargadas (${format})`);
    } catch (err) {
        console.error('Error loading card data:', err);
        loadedCards = [];
        isLoadingCards = false;
        updateCardLoadingState(false);
        showToast('Error al cargar datos de cartas', 'warning');
    }
}

function updateCardLoadingState(loading) {
    const el = document.getElementById('cardLoadingState');
    if (el) el.style.display = loading ? 'block' : 'none';

    const input = document.getElementById('cardSearchInput');
    if (input) input.disabled = loading;
}

// ── Search Logic ────────────────────────────────────────────────────────────

let searchTimeout = null;

function onCardSearchInput(e) {
    const query = e.target.value.trim();

    if (searchTimeout) clearTimeout(searchTimeout);

    if (query.length < 2) {
        hideSearchResults();
        return;
    }

    searchTimeout = setTimeout(() => {
        performCardSearch(query);
    }, 200);
}

function performCardSearch(query) {
    if (!loadedCards.length || isLoadingCards) return;

    const lowerQuery = query.toLowerCase();

    const results = loadedCards
        .filter(card => card.name.toLowerCase().includes(lowerQuery))
        .slice(0, 50);

    // Prioritize starts-with, then alphabetical
    results.sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(lowerQuery);
        const bStarts = b.name.toLowerCase().startsWith(lowerQuery);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.name.localeCompare(b.name);
    });

    renderSearchResults(results.slice(0, 20));
}

// ── Render Search Results ───────────────────────────────────────────────────

function renderSearchResults(results) {
    const container = document.getElementById('cardSearchResults');
    if (!container) return;

    if (results.length === 0) {
        container.innerHTML = '<div class="no-results">No se encontraron cartas</div>';
        container.style.display = 'block';
        return;
    }

    container.innerHTML = results.map(card => {
        const imgUrl = card.image ? card.image + '/low.webp' : '';
        const catClass = getCategoryClass(card.category);
        const meta = [
            card.set.name,
            card.set.id + '-' + card.localId,
            card.hp ? card.hp + ' HP' : '',
            card.category === 'Pokémon' && card.stage ? card.stage : '',
        ].filter(Boolean).join(' \u2022 ');

        return `
            <div class="search-result-item ${catClass}" onclick="selectCardFromSearch('${card.id}')">
                ${imgUrl ? `<img class="search-result-img" src="${imgUrl}" alt="${card.name}" loading="lazy" onerror="this.style.display='none'">` : '<div class="search-result-img-placeholder"></div>'}
                <div class="search-result-info">
                    <div class="search-result-name">${card.name}</div>
                    <div class="search-result-meta">${meta}</div>
                </div>
                <div class="search-result-category">${getCategoryIcon(card.category)}</div>
            </div>
        `;
    }).join('');

    container.style.display = 'block';
}

function hideSearchResults() {
    const container = document.getElementById('cardSearchResults');
    if (container) {
        container.innerHTML = '';
        container.style.display = 'none';
    }
}

function selectCardFromSearch(cardId) {
    const card = loadedCards.find(c => c.id === cardId);
    if (!card) return;

    addCardFromData(card);

    document.getElementById('cardSearchInput').value = '';
    hideSearchResults();
}

// ── Format Switching ────────────────────────────────────────────────────────

function onFormatChange(format) {
    if (format === currentFormat && loadedCards.length > 0) return;
    currentFormat = format;
    localStorage.setItem('currentFormat', format);

    updateFormatButtons(format);
    loadCardData(format);
}

function updateFormatButtons(format) {
    const stdBtn = document.getElementById('formatStandard');
    const expBtn = document.getElementById('formatExpanded');
    if (stdBtn) stdBtn.classList.toggle('active', format === 'standard');
    if (expBtn) expBtn.classList.toggle('active', format === 'expanded');

    const subtitle = document.getElementById('formatSubtitle');
    if (subtitle) {
        subtitle.textContent = format === 'standard'
            ? 'Pokémon TCG \u2022 Formato Standard 2026'
            : 'Pokémon TCG \u2022 Formato Expanded';
    }
}

// ── Click Outside to Close ──────────────────────────────────────────────────

document.addEventListener('click', function(e) {
    const container = document.getElementById('cardSearchContainer');
    if (container && !container.contains(e.target)) {
        hideSearchResults();
    }
});
