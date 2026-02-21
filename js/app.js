window.addEventListener('DOMContentLoaded', () => {
    loadSavedDeck();
    renderSavedDecks();
    setupEventListeners();

    // Load cached meta stats
    loadCachedMetaStats();

    // Check if daily update is needed
    checkForStatsUpdate();

    const savedStats = localStorage.getItem('testingStats');
    if (savedStats) {
        testingStats = JSON.parse(savedStats);
    }

    // Add Enter key handler for deck search
    document.getElementById('deckSearchInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchDeck();
        }
    });

    // Add Enter key handler for Limitless import
    document.getElementById('limitlessUrlInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            importFromLimitless();
        }
    });

    // Add input handler for real-time search
    document.getElementById('deckSearchInput')?.addEventListener('input', (e) => {
        if (e.target.value.length >= 2) {
            searchDeck();
        } else if (e.target.value.length === 0) {
            document.getElementById('deckSearchResults').innerHTML = '';
        }
    });

    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
});

function setupEventListeners() {
    document.querySelectorAll('.deck-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.deck-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const deckType = card.dataset.deck;
            loadPresetDeck(deckType);
        });
    });

    document.querySelectorAll('.matchup-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.matchup-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            const matchup = btn.dataset.matchup;
            showMatchupRecommendations(matchup);
        });
    });

    // Auto-save every 5 seconds
    setInterval(() => {
        localStorage.setItem('currentDeck', JSON.stringify(currentDeck));
        localStorage.setItem('selectedDeckType', selectedDeckType);
    }, 5000);
}
