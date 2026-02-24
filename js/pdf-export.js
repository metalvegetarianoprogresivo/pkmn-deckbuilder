// ── PDF Deck List Export ─────────────────────────────────────────────────────
// Uses pdf-lib to fill the official Play! Pokémon deck list template.

// XML coords from the PDF are at 1.5x scale of PDF points.
// Conversion: pdf_x = xml_left / 1.5, pdf_y = 792 - (xml_top / 1.5)

const PDF_LAYOUT = {
    // Column X positions (PDF points, from left)
    cols: {
        qty:    271,   // Center of QTY column
        name:   302,   // Start of NAME column
        set:    480,   // Start of SET column (Pokémon only)
        collNo: 510,   // Start of COLL.# column (Pokémon only)
        reg:    555,   // Start of REG column (Pokémon only)
    },
    // Section positions
    pokemon: {
        firstRowY: 585,  // Y of first data row baseline
        rowHeight: 12.7,
        maxRows:   12,
    },
    trainer: {
        firstRowY: 409,
        rowHeight: 12.7,
        maxRows:   20,
    },
    energy: {
        firstRowY: 126,
        rowHeight: 12.7,
        maxRows:   5,
    },
    // Format checkboxes (X marks)
    formatCheckbox: {
        standard: { x: 160, y: 738 },
        expanded: { x: 208, y: 738 },
    },
    fontSize: 8,
};

async function exportToPDF() {
    ensureDeckArrays();

    const total = getTotalCardCount();
    if (total === 0) {
        showToast('El deck est\u00E1 vac\u00EDo', 'warning');
        return;
    }

    try {
        showToast('Generando PDF...');

        // Load the template PDF
        const templateUrl = 'assets/deck-list-template.pdf';
        const templateBytes = await fetch(templateUrl).then(r => {
            if (!r.ok) throw new Error('No se pudo cargar la plantilla PDF');
            return r.arrayBuffer();
        });

        const { PDFDocument, StandardFonts, rgb } = PDFLib;
        const pdfDoc = await PDFDocument.load(templateBytes);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const page = pdfDoc.getPages()[0];

        const L = PDF_LAYOUT;
        const textColor = rgb(0.05, 0.05, 0.15);
        const checkColor = rgb(0.1, 0.1, 0.1);

        // ── Mark format checkbox ────────────────────────────────────────
        const formatPos = L.formatCheckbox[currentFormat];
        if (formatPos) {
            page.drawText('X', {
                x: formatPos.x,
                y: formatPos.y,
                size: 11,
                font,
                color: checkColor,
            });
        }

        // ── Helper to draw a row ────────────────────────────────────────
        function drawRow(section, rowIndex, entry) {
            const y = section.firstRowY - (rowIndex * section.rowHeight);
            const isNew = !!entry.card;
            const name = isNew ? entry.card.name : entry.name;
            const qty = String(entry.count);

            // QTY (centered)
            const qtyWidth = font.widthOfTextAtSize(qty, L.fontSize);
            page.drawText(qty, {
                x: L.cols.qty - qtyWidth / 2,
                y,
                size: L.fontSize,
                font,
                color: textColor,
            });

            // NAME
            page.drawText(name, {
                x: L.cols.name,
                y,
                size: L.fontSize,
                font,
                color: textColor,
            });

            return { name, isNew, entry };
        }

        // ── Helper to draw Pokémon row (with SET, COLL.#, REG) ──────────
        function drawPokemonRow(rowIndex, entry) {
            const { isNew } = drawRow(L.pokemon, rowIndex, entry);

            if (isNew) {
                const card = entry.card;

                // SET abbreviation
                page.drawText(card.set.id || '', {
                    x: L.cols.set,
                    y: L.pokemon.firstRowY - (rowIndex * L.pokemon.rowHeight),
                    size: L.fontSize,
                    font,
                    color: textColor,
                });

                // COLL.# (collector number)
                page.drawText(card.localId || card.number || '', {
                    x: L.cols.collNo,
                    y: L.pokemon.firstRowY - (rowIndex * L.pokemon.rowHeight),
                    size: L.fontSize,
                    font,
                    color: textColor,
                });

                // REG (regulation mark)
                if (card.regulationMark) {
                    page.drawText(card.regulationMark, {
                        x: L.cols.reg,
                        y: L.pokemon.firstRowY - (rowIndex * L.pokemon.rowHeight),
                        size: L.fontSize,
                        font,
                        color: textColor,
                    });
                }
            }
        }

        // ── Fill Pokémon section ─────────────────────────────────────────
        let row = 0;
        for (const entry of currentDeck.pokemon) {
            if (row >= L.pokemon.maxRows) break;
            drawPokemonRow(row, entry);
            row++;
        }

        // ── Fill Trainer section ─────────────────────────────────────────
        row = 0;
        for (const entry of currentDeck.trainers) {
            if (row >= L.trainer.maxRows) break;
            drawRow(L.trainer, row, entry);
            row++;
        }

        // ── Fill Energy section ──────────────────────────────────────────
        row = 0;
        for (const entry of currentDeck.energy) {
            if (row >= L.energy.maxRows) break;
            drawRow(L.energy, row, entry);
            row++;
        }

        // ── Save and download ────────────────────────────────────────────
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'pokemon-deck-list.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('PDF descargado');
    } catch (err) {
        console.error('PDF export error:', err);
        showToast('Error al generar PDF: ' + err.message, 'warning');
    }
}
