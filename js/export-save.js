function formatDeckEntry(entry) {
    if (entry.card) {
        return `${entry.count} ${entry.card.name} ${entry.card.id}`;
    }
    return `${entry.count} ${entry.name} ${entry.set}`;
}

function exportDeck() {
    ensureDeckArrays();

    const pokemonTotal = currentDeck.pokemon.reduce((sum, e) => sum + e.count, 0);
    const trainerTotal = currentDeck.trainers.reduce((sum, e) => sum + e.count, 0);
    const energyTotal = currentDeck.energy.reduce((sum, e) => sum + e.count, 0);
    const total = pokemonTotal + trainerTotal + energyTotal;

    let decklist = `Pok\u00E9mon: ${pokemonTotal}\n`;
    currentDeck.pokemon.forEach(entry => {
        decklist += formatDeckEntry(entry) + '\n';
    });

    decklist += `\nEntrenadores: ${trainerTotal}\n`;
    currentDeck.trainers.forEach(entry => {
        decklist += formatDeckEntry(entry) + '\n';
    });

    decklist += `\nEnerg\u00EDa: ${energyTotal}\n`;
    currentDeck.energy.forEach(entry => {
        decklist += formatDeckEntry(entry) + '\n';
    });

    decklist += `\nTotal: ${total}/60`;

    document.getElementById('decklistText').textContent = decklist;
    openModal('exportModal');
}

function copyDecklist() {
    const text = document.getElementById('decklistText').textContent;
    navigator.clipboard.writeText(text).then(() => {
        showToast('\u00A1Decklist copiada!');
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
        showToast('Ingresa un nombre', 'warning');
        return;
    }

    const savedDecks = JSON.parse(localStorage.getItem('savedDecks') || '[]');
    savedDecks.push({
        name,
        deck: JSON.parse(JSON.stringify(currentDeck)),
        date: new Date().toISOString(),
        type: selectedDeckType,
        format: currentFormat
    });

    localStorage.setItem('savedDecks', JSON.stringify(savedDecks));
    renderSavedDecks();
    showToast(`Deck "${name}" guardado`);
}

function renderSavedDecks() {
    const savedDecks = JSON.parse(localStorage.getItem('savedDecks') || '[]');
    const container = document.getElementById('savedDecksList');

    if (savedDecks.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: rgba(255,255,255,0.4); font-size: 0.875rem; padding: 1rem;">No hay decks guardados</div>';
        return;
    }

    container.innerHTML = savedDecks.slice().reverse().map((saved, index) => {
        const realIndex = savedDecks.length - 1 - index;
        const formatLabel = saved.format ? ` \u2022 ${saved.format}` : '';
        return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: rgba(0,0,0,0.2); border-radius: 8px; margin-bottom: 0.5rem;">
            <div onclick="loadSavedDeckByIndex(${realIndex})" style="cursor: pointer; flex: 1;">
                <div style="font-weight: 600; font-size: 0.9rem;">${saved.name}</div>
                <div style="font-size: 0.75rem; color: rgba(255,255,255,0.4);">${new Date(saved.date).toLocaleDateString('es-ES')}${formatLabel}</div>
            </div>
            <button class="card-btn delete" onclick="deleteSavedDeck(${realIndex})">🗑\uFE0F</button>
        </div>`;
    }).join('');
}

function loadSavedDeckByIndex(index) {
    const savedDecks = JSON.parse(localStorage.getItem('savedDecks') || '[]');
    const saved = savedDecks[index];

    if (!saved) {
        showToast('Error al cargar deck', 'error');
        return;
    }

    try {
        currentDeck = JSON.parse(JSON.stringify(saved.deck));
        ensureDeckArrays();
        selectedDeckType = saved.type || 'custom';

        if (saved.format) {
            onFormatChange(saved.format);
        }

        renderDeck();
        updateCounts();
        closeModal('saveDeckModal');
        showToast(`Deck "${saved.name}" cargado`);
    } catch (e) {
        console.error('Error loading deck:', e);
        showToast('Error al cargar deck', 'error');
    }
}

function deleteSavedDeck(index) {
    if (!confirm('\u00BFEliminar este deck?')) return;

    const savedDecks = JSON.parse(localStorage.getItem('savedDecks') || '[]');
    savedDecks.splice(index, 1);
    localStorage.setItem('savedDecks', JSON.stringify(savedDecks));
    renderSavedDecks();
    showToast('Deck eliminado');
}

function loadDeck() {
    openModal('saveDeckModal');
    renderSavedDecks();
}
