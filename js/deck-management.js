function loadPresetDeck(deckType) {
    selectedDeckType = deckType;

    if (deckType === 'custom') {
        currentDeck = { pokemon: [], trainers: [], energy: [] };
    } else if (presetDecks[deckType]) {
        const preset = presetDecks[deckType];
        currentDeck = {
            pokemon: [...preset.pokemon],
            trainers: [...preset.trainers],
            energy: [...preset.energy]
        };
    }

    renderDeck();
    updateCounts();
    showToast(`\u2705 Deck ${deckType} cargado`);
}

function addCard() {
    const name = document.getElementById('cardName').value.trim();
    const set = document.getElementById('cardSet').value.trim();
    const count = parseInt(document.getElementById('cardCount').value);
    const type = document.getElementById('cardType').value;

    if (!name) {
        showToast('\u26A0\uFE0F Ingresa el nombre de la carta', 'warning');
        return;
    }

    // Ensure currentDeck has all required properties
    if (!currentDeck.pokemon) currentDeck.pokemon = [];
    if (!currentDeck.trainers) currentDeck.trainers = [];
    if (!currentDeck.energy) currentDeck.energy = [];

    const card = { name, set, count };

    // Check if card already exists
    const existing = currentDeck[type].find(c => c.name === name);
    if (existing) {
        existing.count = Math.min(4, existing.count + count);
    } else {
        currentDeck[type].push(card);
    }

    // Clear inputs
    document.getElementById('cardName').value = '';
    document.getElementById('cardSet').value = '';
    document.getElementById('cardCount').value = '1';

    renderDeck();
    updateCounts();
    showToast(`\u2705 ${name} agregada`);
}

function renderDeck() {
    const container = document.getElementById('deckBuilder');

    // Ensure currentDeck has all required properties
    if (!currentDeck.pokemon) currentDeck.pokemon = [];
    if (!currentDeck.trainers) currentDeck.trainers = [];
    if (!currentDeck.energy) currentDeck.energy = [];

    let html = '';

    ['pokemon', 'trainers', 'energy'].forEach(type => {
        const categoryName = type === 'pokemon' ? 'Pokémon' : type === 'trainers' ? 'Trainers' : 'Energy';
        const cards = currentDeck[type] || [];
        const total = cards.reduce((sum, card) => sum + card.count, 0);

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
            cards.forEach((card, index) => {
                html += `
                    <div class="card-item">
                        <div class="card-controls">
                            <button class="card-btn" onclick="decrementCard('${type}', ${index})">−</button>
                            <span class="card-count-display">${card.count}</span>
                            <button class="card-btn" onclick="incrementCard('${type}', ${index})">+</button>
                            <button class="card-btn delete" onclick="removeCard('${type}', ${index})">🗑️</button>
                        </div>
                        <div style="flex: 1;">
                            <div class="card-name">${card.name}</div>
                            <div class="card-set">${card.set}</div>
                        </div>
                    </div>
                `;
            });
        }

        html += `</div>`;
    });

    container.innerHTML = html;
}

function incrementCard(type, index) {
    if (!currentDeck[type]) currentDeck[type] = [];
    if (currentDeck[type][index] && currentDeck[type][index].count < 4) {
        currentDeck[type][index].count++;
        renderDeck();
        updateCounts();
    }
}

function decrementCard(type, index) {
    if (!currentDeck[type]) currentDeck[type] = [];
    if (currentDeck[type][index] && currentDeck[type][index].count > 1) {
        currentDeck[type][index].count--;
        renderDeck();
        updateCounts();
    }
}

function removeCard(type, index) {
    if (!currentDeck[type]) currentDeck[type] = [];
    currentDeck[type].splice(index, 1);
    renderDeck();
    updateCounts();
    showToast('🗑️ Carta eliminada');
}

function updateCounts() {
    // Ensure currentDeck has all required properties
    if (!currentDeck.pokemon) currentDeck.pokemon = [];
    if (!currentDeck.trainers) currentDeck.trainers = [];
    if (!currentDeck.energy) currentDeck.energy = [];

    const pokemonTotal = currentDeck.pokemon.reduce((sum, card) => sum + card.count, 0);
    const trainerTotal = currentDeck.trainers.reduce((sum, card) => sum + card.count, 0);
    const energyTotal = currentDeck.energy.reduce((sum, card) => sum + card.count, 0);
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

function loadSavedDeck() {
    const saved = localStorage.getItem('currentDeck');
    const savedType = localStorage.getItem('selectedDeckType');

    if (saved) {
        try {
            currentDeck = JSON.parse(saved);
            // Ensure all properties exist
            if (!currentDeck.pokemon) currentDeck.pokemon = [];
            if (!currentDeck.trainers) currentDeck.trainers = [];
            if (!currentDeck.energy) currentDeck.energy = [];
        } catch (e) {
            console.error('Error loading saved deck:', e);
            currentDeck = { pokemon: [], trainers: [], energy: [] };
        }
        selectedDeckType = savedType || 'custom';
        renderDeck();
        updateCounts();
    } else {
        // Initialize empty deck if nothing saved
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
    showToast('🔄 Deck limpiado');
}
