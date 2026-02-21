function exportDeck() {
    // Ensure currentDeck has all required properties
    if (!currentDeck.pokemon) currentDeck.pokemon = [];
    if (!currentDeck.trainers) currentDeck.trainers = [];
    if (!currentDeck.energy) currentDeck.energy = [];

    let decklist = `Pokémon: ${currentDeck.pokemon.reduce((sum, card) => sum + card.count, 0)}\n`;
    currentDeck.pokemon.forEach(card => {
        decklist += `${card.count} ${card.name} ${card.set}\n`;
    });

    decklist += `\nTrainers: ${currentDeck.trainers.reduce((sum, card) => sum + card.count, 0)}\n`;
    currentDeck.trainers.forEach(card => {
        decklist += `${card.count} ${card.name} ${card.set}\n`;
    });

    decklist += `\nEnergy: ${currentDeck.energy.reduce((sum, card) => sum + card.count, 0)}\n`;
    currentDeck.energy.forEach(card => {
        decklist += `${card.count} ${card.name} ${card.set}\n`;
    });

    const total = currentDeck.pokemon.reduce((sum, card) => sum + card.count, 0) +
                 currentDeck.trainers.reduce((sum, card) => sum + card.count, 0) +
                 currentDeck.energy.reduce((sum, card) => sum + card.count, 0);

    decklist += `\nTotal: ${total}/60`;

    document.getElementById('decklistText').textContent = decklist;
    openModal('exportModal');
}

function copyDecklist() {
    const text = document.getElementById('decklistText').textContent;
    navigator.clipboard.writeText(text).then(() => {
        showToast('\u2705 \u00A1Decklist copiada!');
        closeModal('exportModal');
    });
}

function saveDeck() {
    openModal('saveDeckModal');
    document.getElementById('deckNameInput').value = '';
    renderSavedDecks();
}

function confirmSaveDeck() {
    const name = document.getElementById('deckNameInput').value.trim();
    if (!name) {
        showToast('\u26A0\uFE0F Ingresa un nombre', 'warning');
        return;
    }

    const savedDecks = JSON.parse(localStorage.getItem('savedDecks') || '[]');
    savedDecks.push({
        name,
        deck: JSON.parse(JSON.stringify(currentDeck)),
        date: new Date().toISOString(),
        type: selectedDeckType
    });

    localStorage.setItem('savedDecks', JSON.stringify(savedDecks));
    renderSavedDecks();
    showToast(`\u2705 Deck "${name}" guardado`);
}

function renderSavedDecks() {
    const savedDecks = JSON.parse(localStorage.getItem('savedDecks') || '[]');
    const container = document.getElementById('savedDecksList');

    if (savedDecks.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: rgba(255,255,255,0.4); font-size: 0.875rem; padding: 1rem;">No hay decks guardados</div>';
        return;
    }

    container.innerHTML = savedDecks.reverse().map((saved, index) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: rgba(0,0,0,0.2); border-radius: 8px; margin-bottom: 0.5rem;">
            <div onclick="loadSavedDeckByIndex(${savedDecks.length - 1 - index})" style="cursor: pointer; flex: 1;">
                <div style="font-weight: 600; font-size: 0.9rem;">${saved.name}</div>
                <div style="font-size: 0.75rem; color: rgba(255,255,255,0.4);">${new Date(saved.date).toLocaleDateString('es-ES')}</div>
            </div>
            <button class="card-btn delete" onclick="deleteSavedDeck(${savedDecks.length - 1 - index})">🗑️</button>
        </div>
    `).join('');
}

function loadSavedDeckByIndex(index) {
    const savedDecks = JSON.parse(localStorage.getItem('savedDecks') || '[]');
    const saved = savedDecks[index];

    if (!saved) {
        showToast('\u26A0\uFE0F Error al cargar deck', 'error');
        return;
    }

    try {
        currentDeck = JSON.parse(JSON.stringify(saved.deck));
        // Ensure all properties exist
        if (!currentDeck.pokemon) currentDeck.pokemon = [];
        if (!currentDeck.trainers) currentDeck.trainers = [];
        if (!currentDeck.energy) currentDeck.energy = [];

        selectedDeckType = saved.type || 'custom';

        renderDeck();
        updateCounts();
        closeModal('saveDeckModal');
        showToast(`\u2705 Deck "${saved.name}" cargado`);
    } catch (e) {
        console.error('Error loading deck:', e);
        showToast('\u26A0\uFE0F Error al cargar deck', 'error');
    }
}

function deleteSavedDeck(index) {
    if (!confirm('\u00BFEliminar este deck?')) return;

    const savedDecks = JSON.parse(localStorage.getItem('savedDecks') || '[]');
    savedDecks.splice(index, 1);
    localStorage.setItem('savedDecks', JSON.stringify(savedDecks));
    renderSavedDecks();
    showToast('🗑️ Deck eliminado');
}

function loadDeck() {
    openModal('saveDeckModal');
    renderSavedDecks();
}
