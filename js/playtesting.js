function buildTestingDeck() {
    deckForTesting = [];

    // Ensure currentDeck has all required properties
    if (!currentDeck.pokemon) currentDeck.pokemon = [];
    if (!currentDeck.trainers) currentDeck.trainers = [];
    if (!currentDeck.energy) currentDeck.energy = [];

    ['pokemon', 'trainers', 'energy'].forEach(type => {
        currentDeck[type].forEach(card => {
            for (let i = 0; i < card.count; i++) {
                deckForTesting.push({
                    name: card.name,
                    set: card.set,
                    type: type === 'trainers' ? 'trainer' : type.slice(0, -1)
                });
            }
        });
    });

    shuffleDeck();
}

function shuffleDeck() {
    for (let i = deckForTesting.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deckForTesting[i], deckForTesting[j]] = [deckForTesting[j], deckForTesting[i]];
    }
}

function drawHand() {
    // Ensure currentDeck has all required properties
    if (!currentDeck.pokemon) currentDeck.pokemon = [];
    if (!currentDeck.trainers) currentDeck.trainers = [];
    if (!currentDeck.energy) currentDeck.energy = [];

    const totalCards = currentDeck.pokemon.reduce((sum, card) => sum + card.count, 0) +
                      currentDeck.trainers.reduce((sum, card) => sum + card.count, 0) +
                      currentDeck.energy.reduce((sum, card) => sum + card.count, 0);

    if (totalCards < 7) {
        showToast('\u26A0\uFE0F Necesitas al menos 7 cartas', 'warning');
        return;
    }

    buildTestingDeck();
    currentHand = deckForTesting.slice(0, 7);
    mulliganCount = 0;
    testingStats.handsDrawn++;

    displayHand();
    analyzeHand();
    updateTestingStatsDisplay();

    document.getElementById('mulliganBtn').disabled = false;
    document.getElementById('handDisplay').style.display = 'block';

    showToast('\u{1F3B4} Mano inicial robada');
}

function mulligan() {
    if (mulliganCount >= 3) {
        showToast('\u26A0\uFE0F Máximo 3 mulligans', 'warning');
        return;
    }

    mulliganCount++;
    testingStats.mulligans++;

    deckForTesting = [...deckForTesting.slice(7), ...currentHand];
    shuffleDeck();
    currentHand = deckForTesting.slice(0, 7);

    displayHand();
    analyzeHand();
    updateTestingStatsDisplay();

    showToast(`\u{1F504} Mulligan ${mulliganCount}/3`);
}

function displayHand() {
    const container = document.getElementById('handCards');
    document.getElementById('handCount').textContent = `${currentHand.length} cartas (Mulligans: ${mulliganCount}/3)`;

    const pokemon = currentHand.filter(c => c.type === 'pokemon');
    const trainers = currentHand.filter(c => c.type === 'trainer');
    const energy = currentHand.filter(c => c.type === 'energy');

    let html = '';

    if (pokemon.length > 0) {
        html += '<div style="margin-bottom: 0.75rem;"><div style="font-size: 0.75rem; text-transform: uppercase; color: var(--accent); margin-bottom: 0.5rem;">Pokémon (' + pokemon.length + ')</div>';
        pokemon.forEach(card => {
            html += `<div style="padding: 0.5rem; background: rgba(217, 70, 239, 0.1); border: 1px solid var(--border); border-radius: 6px; margin-bottom: 0.25rem;">
                <div style="font-weight: 600;">${card.name}</div>
                <div style="font-size: 0.75rem; color: rgba(255,255,255,0.4);">${card.set}</div>
            </div>`;
        });
        html += '</div>';
    }

    if (trainers.length > 0) {
        html += '<div style="margin-bottom: 0.75rem;"><div style="font-size: 0.75rem; text-transform: uppercase; color: var(--accent); margin-bottom: 0.5rem;">Trainers (' + trainers.length + ')</div>';
        trainers.forEach(card => {
            html += `<div style="padding: 0.5rem; background: rgba(139, 92, 246, 0.1); border: 1px solid var(--border); border-radius: 6px; margin-bottom: 0.25rem;">
                <div style="font-weight: 600;">${card.name}</div>
                <div style="font-size: 0.75rem; color: rgba(255,255,255,0.4);">${card.set}</div>
            </div>`;
        });
        html += '</div>';
    }

    if (energy.length > 0) {
        html += '<div><div style="font-size: 0.75rem; text-transform: uppercase; color: var(--accent); margin-bottom: 0.5rem;">Energy (' + energy.length + ')</div>';
        energy.forEach(card => {
            html += `<div style="padding: 0.5rem; background: rgba(236, 72, 153, 0.1); border: 1px solid var(--border); border-radius: 6px; margin-bottom: 0.25rem;">
                <div style="font-weight: 600;">${card.name}</div>
                <div style="font-size: 0.75rem; color: rgba(255,255,255,0.4);">${card.set}</div>
            </div>`;
        });
        html += '</div>';
    }

    container.innerHTML = html;
}

function analyzeHand() {
    const pokemon = currentHand.filter(c => c.type === 'pokemon');
    const trainers = currentHand.filter(c => c.type === 'trainer');
    const energy = currentHand.filter(c => c.type === 'energy');

    const hasSupporter = trainers.some(c =>
        c.name.includes('Iono') ||
        c.name.includes('Professor') ||
        c.name.includes('Lillie')
    );

    const hasSearchBall = trainers.some(c =>
        c.name.includes('Ultra Ball') ||
        c.name.includes('Nest Ball')
    );

    let analysis = [];

    if (pokemon.length === 0) {
        analysis.push({
            icon: '\u274C',
            text: 'Sin Pokémon - \u00A1Mulligan obligatorio!',
            type: 'error'
        });
        testingStats.brickHands++;
    } else if (pokemon.length >= 1 && hasSupporter) {
        analysis.push({
            icon: '\u2705',
            text: 'MANO BUENA - Tienes Pokémon y Supporter',
            type: 'success'
        });
        testingStats.perfectHands++;
        testingStats.pokemonInHand++;
    } else {
        analysis.push({
            icon: '\u26A0\uFE0F',
            text: 'MANO MEDIOCRE - Falta consistencia',
            type: 'warning'
        });
    }

    if (hasSupporter) {
        analysis.push({
            icon: '\u2705',
            text: 'Tienes Supporter - Puedes hacer draw',
            type: 'success'
        });
        testingStats.supportersInHand++;
    } else {
        analysis.push({
            icon: '\u274C',
            text: 'Sin Supporters - Limitado en opciones',
            type: 'error'
        });
    }

    if (hasSearchBall) {
        analysis.push({
            icon: '\u2705',
            text: 'Tienes search balls - Puedes buscar Pokémon',
            type: 'info'
        });
    }

    if (energy.length >= 1) {
        analysis.push({
            icon: '\u2705',
            text: `${energy.length} ${energy.length === 1 ? 'energía' : 'energías'} - Puedes attachar`,
            type: 'success'
        });
        testingStats.energyInHand++;
    }

    const container = document.getElementById('handAnalysis');
    container.innerHTML = analysis.map(item => `
        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: ${
            item.type === 'success' ? 'rgba(16, 185, 129, 0.1)' :
            item.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' :
            item.type === 'error' ? 'rgba(239, 68, 68, 0.1)' :
            'rgba(139, 92, 246, 0.1)'
        }; border-radius: 8px; margin-bottom: 0.5rem;">
            <span style="font-size: 1.25rem;">${item.icon}</span>
            <span style="font-size: 0.875rem; color: ${
                item.type === 'success' ? 'var(--success)' :
                item.type === 'warning' ? 'var(--warning)' :
                item.type === 'error' ? 'var(--danger)' :
                'rgba(255,255,255,0.8)'
            };">${item.text}</span>
        </div>
    `).join('');
}

function updateTestingStatsDisplay() {
    localStorage.setItem('testingStats', JSON.stringify(testingStats));

    const container = document.getElementById('testingStats');
    const perfectRate = testingStats.handsDrawn > 0
        ? ((testingStats.perfectHands / testingStats.handsDrawn) * 100).toFixed(1)
        : 0;
    const brickRate = testingStats.handsDrawn > 0
        ? ((testingStats.brickHands / testingStats.handsDrawn) * 100).toFixed(1)
        : 0;

    container.innerHTML = `
        <div class="deck-breakdown">
            <div class="breakdown-item">
                <span class="breakdown-label">Manos probadas</span>
                <span class="breakdown-value">${testingStats.handsDrawn}</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label">Mulligans totales</span>
                <span class="breakdown-value">${testingStats.mulligans}</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label">Manos buenas</span>
                <span class="breakdown-value" style="color: var(--success);">${testingStats.perfectHands} (${perfectRate}%)</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label">Bricks</span>
                <span class="breakdown-value" style="color: var(--danger);">${testingStats.brickHands} (${brickRate}%)</span>
            </div>
        </div>
    `;
}

function resetTestingStats() {
    if (!confirm('\u00BFReiniciar estadísticas?')) return;

    testingStats = {
        handsDrawn: 0,
        mulligans: 0,
        pokemonInHand: 0,
        supportersInHand: 0,
        energyInHand: 0,
        perfectHands: 0,
        brickHands: 0
    };

    localStorage.setItem('testingStats', JSON.stringify(testingStats));
    updateTestingStatsDisplay();
    showToast('🗑️ Estadísticas reiniciadas');
}
