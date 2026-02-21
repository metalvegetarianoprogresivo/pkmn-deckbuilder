function showMatchupRecommendations(matchup) {
    const recommendations = matchupRecommendations[selectedDeckType]?.[matchup];
    const container = document.getElementById('recommendations');

    // Try to get recommendations from database first
    if (recommendations) {
        let html = '';
        recommendations.forEach(rec => {
            html += `
                <div class="recommendation-item ${rec.type}">
                    <div class="recommendation-header">
                        ${rec.type === 'tech' ? '\u2795 Tech Card' :
                          rec.type === 'remove' ? '\u2796 Considerar Remover' :
                          rec.type === 'warning' ? '\u26A0\uFE0F Advertencia' :
                          '\u{1F4A1} Estrategia'}
                    </div>
                    <div class="recommendation-text">${rec.text}</div>
                </div>
            `;
        });
        container.innerHTML = html;
    }
    // Otherwise, generate generic recommendations
    else {
        const genericRecs = generateGenericRecommendations(matchup, selectedDeckType);

        if (genericRecs.length > 0) {
            let html = '<div style="background: rgba(245,158,11,0.1); border: 1px solid var(--warning); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;"><div style="font-weight: 700; color: var(--warning); margin-bottom: 0.5rem;">\u2139\uFE0F Recomendaciones Genéricas</div><div style="font-size: 0.875rem; color: rgba(255,255,255,0.7);">Estas son recomendaciones basadas en el tipo de deck. Para tips específicos de tu deck, selecciona un matchup conocido.</div></div>';

            genericRecs.forEach(rec => {
                html += `
                    <div class="recommendation-item ${rec.type}">
                        <div class="recommendation-header">
                            ${rec.type === 'tech' ? '\u2795 Tech Recomendado' :
                              rec.type === 'remove' ? '\u2796 Considerar' :
                              rec.type === 'warning' ? '\u26A0\uFE0F Ten en Cuenta' :
                              '\u{1F4A1} Consejo'}
                        </div>
                        <div class="recommendation-text">${rec.text}</div>
                    </div>
                `;
            });
            container.innerHTML = html;
        } else {
            container.innerHTML = '<div style="text-align: center; color: rgba(255,255,255,0.4); padding: 2rem;">No hay recomendaciones disponibles para este matchup</div>';
        }
    }

    // Show matchup info
    showMatchupInfo(matchup);
}

function generateGenericRecommendations(deckKey, yourDeckType) {
    const opponent = extendedMatchupData[deckKey];
    if (!opponent) return [];

    const recommendations = [
        {
            type: 'strategy',
            text: `\u{1F4CA} ${opponent.name} - Tipo: ${opponent.strengths[0]}`
        },
        {
            type: 'warning',
            text: `\u26A0\uFE0F Debilidad: ${opponent.weakness}`
        }
    ];

    // Add counter recommendations
    opponent.counters.forEach((counter, index) => {
        if (index < 3) { // Top 3 counters
            recommendations.push({
                type: 'tech',
                text: `\u2795 ${counter}`
            });
        }
    });

    // Add strategic tips
    opponent.tips.forEach(tip => {
        recommendations.push({
            type: 'strategy',
            text: `\u{1F4A1} ${tip}`
        });
    });

    // Add warnings about strengths
    opponent.strengths.forEach(strength => {
        recommendations.push({
            type: 'warning',
            text: `\u26A0\uFE0F Fortaleza enemiga: ${strength}`
        });
    });

    return recommendations;
}

function searchDeck() {
    const searchTerm = document.getElementById('deckSearchInput').value.trim().toLowerCase();
    const resultsContainer = document.getElementById('deckSearchResults');

    if (!searchTerm) {
        resultsContainer.innerHTML = '';
        return;
    }

    const matches = metaDecks.filter(deck =>
        deck.name.toLowerCase().includes(searchTerm) ||
        deck.type.toLowerCase().includes(searchTerm)
    );

    if (matches.length === 0) {
        resultsContainer.innerHTML = '<div style="text-align: center; color: rgba(255,255,255,0.4); padding: 1rem; font-size: 0.875rem;">No se encontraron decks</div>';
        return;
    }

    resultsContainer.innerHTML = matches.map(deck => `
        <div style="padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 0.5rem; cursor: pointer; transition: all 0.3s ease;"
             onclick="selectMatchupFromSearch('${deck.key}')"
             onmouseover="this.style.background='rgba(217,70,239,0.1)'; this.style.borderColor='var(--primary)'"
             onmouseout="this.style.background='rgba(0,0,0,0.3)'; this.style.borderColor='var(--border)'">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="font-size: 1.2rem; margin-right: 0.5rem;">${deck.icon}</span>
                    <span style="font-weight: 600;">${deck.name}</span>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.75rem; color: rgba(255,255,255,0.5);">Tier ${deck.tier} \u2022 ${deck.share}%</div>
                    <div style="font-size: 0.75rem; color: var(--accent);">${deck.type}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function selectMatchupFromSearch(deckKey) {
    document.querySelectorAll('.matchup-btn').forEach(b => b.classList.remove('selected'));
    showMatchupRecommendations(deckKey);
    document.getElementById('deckSearchInput').value = '';
    document.getElementById('deckSearchResults').innerHTML = '';
}

function showMatchupInfo(deckKey) {
    const deck = metaDecks.find(d => d.key === deckKey);
    const extended = extendedMatchupData[deckKey];

    if (!deck) return;

    const infoContainer = document.getElementById('matchupInfoContent');
    const infoSection = document.getElementById('selectedMatchupInfo');

    let html = `
        <div class="breakdown-item">
            <span class="breakdown-label">Meta Share</span>
            <span class="breakdown-value">${deck.share}%</span>
        </div>
        <div class="breakdown-item">
            <span class="breakdown-label">Tier</span>
            <span class="breakdown-value">Tier ${deck.tier}</span>
        </div>
        <div class="breakdown-item">
            <span class="breakdown-label">Tipo de Deck</span>
            <span class="breakdown-value">${deck.type}</span>
        </div>
    `;

    if (extended) {
        html += `
            <div class="breakdown-item">
                <span class="breakdown-label">Debilidad</span>
                <span class="breakdown-value" style="color: var(--danger);">${extended.weakness}</span>
            </div>
        `;
    }

    infoContainer.innerHTML = html;
    infoSection.style.display = 'block';
}
