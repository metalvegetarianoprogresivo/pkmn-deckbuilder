function loadPresetDeck(deckType) {
    selectedDeckType = deckType;

    if (deckType === 'custom') {
        currentDeck = { pokemon: [], trainers: [], energy: [] };
    } else if (presetDecks[deckType]) {
        const preset = presetDecks[deckType];
        currentDeck = {
            pokemon: preset.pokemon.map(c => ({ ...c })),
            trainers: preset.trainers.map(c => ({ ...c })),
            energy: preset.energy.map(c => ({ ...c }))
        };
    }

    renderDeck();
    updateCounts();
    showToast(`Deck ${deckType} cargado`);
}

// ── Add card from data object ───────────────────────────────────────────────

function addCardFromData(card) {
    const deckKey = categoryToDeckKey(card.category);
    if (!deckKey) {
        showToast('Categor\u00EDa de carta desconocida', 'warning');
        return;
    }

    ensureDeckArrays();

    if (getTotalCardCount() >= 60) {
        showToast('El deck ya tiene 60 cartas', 'warning');
        return;
    }

    if (!isBasicEnergy(card) && countCopiesByName(card.name) >= 4) {
        showToast(`M\u00E1ximo 4 copias de "${card.name}"`, 'warning');
        return;
    }

    const existing = currentDeck[deckKey].find(entry => entry.card && entry.card.id === card.id);
    if (existing) {
        existing.count++;
    } else {
        currentDeck[deckKey].push({ card, count: 1 });
    }

    renderDeck();
    updateCounts();
    showToast(`${card.name} agregada`);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function ensureDeckArrays() {
    if (!currentDeck.pokemon) currentDeck.pokemon = [];
    if (!currentDeck.trainers) currentDeck.trainers = [];
    if (!currentDeck.energy) currentDeck.energy = [];
}

function getEntryName(entry) {
    return entry.card ? entry.card.name : entry.name;
}

function getTotalCardCount() {
    ensureDeckArrays();
    let total = 0;
    ['pokemon', 'trainers', 'energy'].forEach(key => {
        currentDeck[key].forEach(entry => { total += entry.count; });
    });
    return total;
}

function countCopiesByName(name) {
    ensureDeckArrays();
    let total = 0;
    ['pokemon', 'trainers', 'energy'].forEach(key => {
        currentDeck[key].forEach(entry => {
            if (getEntryName(entry) === name) total += entry.count;
        });
    });
    return total;
}

// ── Render Deck ─────────────────────────────────────────────────────────────

function renderDeck() {
    const container = document.getElementById('deckBuilder');
    ensureDeckArrays();

    let html = '';

    ['pokemon', 'trainers', 'energy'].forEach(type => {
        const categoryName = type === 'pokemon' ? 'Pok\u00E9mon'
                           : type === 'trainers' ? 'Entrenadores'
                           : 'Energ\u00EDa';
        const cards = currentDeck[type] || [];
        const total = cards.reduce((sum, entry) => sum + entry.count, 0);

        html += `
            <div class="card-category">
                <div class="category-header">
                    ${categoryName}
                    <span class="card-count">${total}</span>
                </div>
        `;

        if (cards.length === 0) {
            html += `<div style="text-align: center; padding: 1rem; color: rgba(255,255,255,0.3); font-size: 0.875rem;">No hay cartas</div>`;
        } else {
            cards.forEach((entry, index) => {
                const isNewFormat = !!entry.card;
                const name = isNewFormat ? entry.card.name : entry.name;
                const setInfo = isNewFormat
                    ? `${entry.card.set.name} (${entry.card.set.id}-${entry.card.localId})`
                    : (entry.set || '');
                const imgUrl = isNewFormat && entry.card.image
                    ? entry.card.image + '/low.webp'
                    : null;

                html += `
                    <div class="card-item">
                        ${imgUrl ? `<img class="deck-card-thumb" src="${imgUrl}" alt="${name}" loading="lazy" onerror="this.style.display='none'">` : ''}
                        <div style="flex: 1; min-width: 0;">
                            <div class="card-name">${name}</div>
                            <div class="card-set">${setInfo}</div>
                        </div>
                        <div class="card-controls">
                            <button class="card-btn" onclick="decrementCard('${type}', ${index})">\u2212</button>
                            <span class="card-count-display">${entry.count}</span>
                            <button class="card-btn" onclick="incrementCard('${type}', ${index})">+</button>
                            <button class="card-btn delete" onclick="removeCard('${type}', ${index})">🗑\uFE0F</button>
                        </div>
                    </div>
                `;
            });
        }

        html += `</div>`;
    });

    container.innerHTML = html;
}

// ── Card Controls ───────────────────────────────────────────────────────────

function incrementCard(type, index) {
    ensureDeckArrays();
    const entry = currentDeck[type]?.[index];
    if (!entry) return;

    if (getTotalCardCount() >= 60) {
        showToast('El deck ya tiene 60 cartas', 'warning');
        return;
    }

    const name = getEntryName(entry);
    const basic = entry.card ? isBasicEnergy(entry.card) : false;

    if (!basic && countCopiesByName(name) >= 4) {
        showToast(`M\u00E1ximo 4 copias de "${name}"`, 'warning');
        return;
    }

    entry.count++;
    renderDeck();
    updateCounts();
}

function decrementCard(type, index) {
    ensureDeckArrays();
    const entry = currentDeck[type]?.[index];
    if (!entry) return;

    if (entry.count > 1) {
        entry.count--;
    } else {
        currentDeck[type].splice(index, 1);
    }
    renderDeck();
    updateCounts();
}

function removeCard(type, index) {
    ensureDeckArrays();
    if (!currentDeck[type]) return;
    currentDeck[type].splice(index, 1);
    renderDeck();
    updateCounts();
    showToast('Carta eliminada');
}

// ── Counts ──────────────────────────────────────────────────────────────────

function updateCounts() {
    ensureDeckArrays();

    const pokemonTotal = currentDeck.pokemon.reduce((sum, e) => sum + e.count, 0);
    const trainerTotal = currentDeck.trainers.reduce((sum, e) => sum + e.count, 0);
    const energyTotal = currentDeck.energy.reduce((sum, e) => sum + e.count, 0);
    const total = pokemonTotal + trainerTotal + energyTotal;

    document.getElementById('pokemonCount').textContent = pokemonTotal;
    document.getElementById('trainerCount').textContent = trainerTotal;
    document.getElementById('energyCount').textContent = energyTotal;
    document.getElementById('totalCards').textContent = total;

    const totalElement = document.getElementById('totalCards');
    if (total === 60) {
        totalElement.classList.add('complete');
    } else {
        totalElement.classList.remove('complete');
    }
}

// ── Save/Load ───────────────────────────────────────────────────────────────

function loadSavedDeck() {
    const saved = localStorage.getItem('currentDeck');
    const savedType = localStorage.getItem('selectedDeckType');

    if (saved) {
        try {
            currentDeck = JSON.parse(saved);
            ensureDeckArrays();
        } catch (e) {
            console.error('Error loading saved deck:', e);
            currentDeck = { pokemon: [], trainers: [], energy: [] };
        }
        selectedDeckType = savedType || 'custom';
        renderDeck();
        updateCounts();
    } else {
        currentDeck = { pokemon: [], trainers: [], energy: [] };
        renderDeck();
        updateCounts();
    }
}

function resetDeck() {
    if (!confirm('\u00BFLimpiar el deck actual?')) return;
    currentDeck = { pokemon: [], trainers: [], energy: [] };
    renderDeck();
    updateCounts();
    showToast('Deck limpiado');
}
