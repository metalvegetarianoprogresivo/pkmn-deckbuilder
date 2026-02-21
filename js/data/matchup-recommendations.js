const matchupRecommendations = {
    gardevoir: {
        dragapult: [
            { type: 'tech', text: '+1 Technical Machine: Evolution - Acelera tu setup para establecer antes que Dragapult' },
            { type: 'tech', text: '+1 Budew - Bloquea el bench y limita Phantom Dive' },
            { type: 'strategy', text: 'Prioriza KO en Dragapult ex antes que en las evoluciones' },
            { type: 'strategy', text: 'Usa Counter Catcher cuando estén por ganar' },
            { type: 'remove', text: 'Considera -1 Luxurious Cape si ves mucho Dragapult' }
        ],
        gholdengo: [
            { type: 'tech', text: '+1-2 Frillish (WHT 44) - CRÍTICO: Bloquea Superior Energy Retrieval' },
            { type: 'tech', text: '+1 Jellicent ex - Oceanic Curse lockea sus Items' },
            { type: 'strategy', text: 'Usa Munkidori Adrena-Brain para math exacto' },
            { type: 'strategy', text: 'Counter Catcher para sacar Genesect del Active' },
            { type: 'remove', text: '-1 Mew ex si esperas mucho Gholdengo' }
        ],
        charizard: [
            { type: 'warning', text: '\u26A0\uFE0F MATCHUP MUY DIFÍCIL - Weakness x2 a Fire' },
            { type: 'tech', text: '+1 Scream Tail adicional - Snipe Charcadet temprano' },
            { type: 'tech', text: '+1 Drifloon - Tech opcional contra Fire' },
            { type: 'strategy', text: 'Juega EXTREMADAMENTE agresivo - gana antes de setup de Dusknoir' },
            { type: 'strategy', text: 'Usa Luxurious Cape para sobrevivir un turno extra' }
        ],
        mirror: [
            { type: 'tech', text: '+1 Jellicent ex - Domina el mirror con Oceanic Curse' },
            { type: 'tech', text: '+1 TM: Devolution - Counter a Jellicent del oponente' },
            { type: 'strategy', text: 'Quien establezca primero tiene ventaja significativa' },
            { type: 'strategy', text: 'Usa Adrena-Brain para math exacto de KOs' },
            { type: 'strategy', text: 'Guarda Counter Catcher para momentos críticos' }
        ],
        grimmsnarl: [
            { type: 'tech', text: '+1 Bravery Charm adicional - Mantén HP alto en Gardevoir' },
            { type: 'tech', text: '+1 Night Stretcher - Recuperación es crítica' },
            { type: 'strategy', text: 'Mantén HP de Gardevoir >170 HP (evita OHKO de Grimmsnarl)' },
            { type: 'strategy', text: 'Minimiza bench - N\'s Darmanitan snipea Basics' },
            { type: 'strategy', text: 'Juega agresivo con Munkidori para presión temprana' }
        ],
        aggro: [
            { type: 'tech', text: '+1 Bravery Charm - Sobrevivir es prioridad' },
            { type: 'tech', text: '+1 Night Stretcher - Recuperación constante' },
            { type: 'tech', text: '+1 Manaphy - Protección contra snipe' },
            { type: 'strategy', text: 'Prioriza establecer múltiples Gardevoir temprano' },
            { type: 'remove', text: '-1 Secret Box - Menos útil vs aggro' }
        ]
    },
    dragapult: {
        gardevoir: [
            { type: 'strategy', text: 'Usa Phantom Dive para snipe Basics en bench' },
            { type: 'strategy', text: 'Fuerza trade favorable con Reversal Energy' },
            { type: 'tech', text: '+1 Boss\'s Orders para cerrar juegos' }
        ],
        gholdengo: [
            { type: 'tech', text: '+1 Path to the Peak - Bloquea habilidades' },
            { type: 'strategy', text: 'Presión temprana con Phantom Dive' }
        ],
        mirror: [
            { type: 'tech', text: '+1 Manaphy - Protege tu bench' },
            { type: 'strategy', text: 'Quien establezca Dragapult primero gana' }
        ]
    },
    gholdengo: {
        gardevoir: [
            { type: 'strategy', text: 'Usa Superior Energy Retrieval para velocidad' },
            { type: 'tech', text: '+1 Counter Catcher para control' },
            { type: 'warning', text: '\u26A0\uFE0F Cuidado con Frillish - bloquea tu estrategia' }
        ],
        dragapult: [
            { type: 'tech', text: '+1 Manaphy - Protección contra Phantom Dive' },
            { type: 'strategy', text: 'Setup múltiples Gholdengo rápido' }
        ]
    },
    charizard: {
        gardevoir: [
            { type: 'strategy', text: '\u2705 MATCHUP FAVORABLE - Weakness a tu favor' },
            { type: 'tech', text: 'Maximiza Dusknoir para swings masivos' },
            { type: 'strategy', text: 'OHKO Gardevoir con facilidad' }
        ],
        dragapult: [
            { type: 'tech', text: '+1 Manaphy - Bloquea Phantom Dive' },
            { type: 'strategy', text: 'Prioriza establecer Charizard temprano' }
        ]
    }
};
