// ==================== GAME STATE ====================
const gameState = {
    // Character Stats (1-20 scale)
    stats: {
        Strength: 5,
        Discipline: 5,
        Intelligence: 5,
        Focus: 5,
        Resilience: 5,
        Ambition: 5,
    },

    // Vitals
    vitals: {
        Health: 100,
        XP: 0,
        Level: 1,
        Rank: 'Recruit',
        currentDay: 1,
    },

    // Sobriety Engine (CRITICAL - Cannot be reset by user)
    sobriety: {
        noWeedToday: true,
        sobrietyStreak: 0,
        totalSlips: 0, // PERMANENT COUNTER
        lastSlipDate: null,
    },

    // Finance Tracker
    finances: {
        currentBalance: 0,
        goal: 1270,
        transactions: [],
    },

    // Daily Phases
    dailyPhases: {
        morning: {
            time: '0600',
            completed: false,
            habits: {
                PT: false,
                ASVABStudy: false,
                Reading: false,
            },
        },
        afterSchool: {
            time: '1630',
            completed: false,
            habits: {
                PT: false,
                ASVABStudy: false,
                Reading: false,
            },
        },
        evening: {
            time: '2130',
            completed: false,
            habits: {
                Sleep: false,
            },
        },
    },

    // Logbook
    logbook: [],

    // Game Settings
    settings: {
        gameStartDate: new Date().toISOString(),
        lastLogDate: new Date().toDateString(),
    },
};

// ==================== MILITARY RANK PROGRESSION ====================
const rankProgression = [
    'Recruit',
    'Seaman Recruit',
    'Seaman Apprentice',
    'Seaman',
    'Petty Officer 3rd Class',
    'Petty Officer 2nd Class',
    'Petty Officer 1st Class',
    'Chief Petty Officer',
    'Senior Chief Petty Officer',
    'Master Chief Petty Officer',
    'Fleet Master Chief',
    'Commander',
];

// ==================== HABIT XP VALUES ====================
const habitXPValues = {
    PT: 100,
    ASVABStudy: 80,
    Reading: 80,
    Sleep: 100,
    Sobriety: 150, // Highest XP reward
};

// ==================== STORAGE FUNCTIONS ====================
function saveGameState() {
    try {
        localStorage.setItem('navyResetRPGState', JSON.stringify(gameState));
    } catch (e) {
        console.error('Failed to save game state:', e);
    }
}

function loadGameState() {
    try {
        const savedState = localStorage.getItem('navyResetRPGState');
        if (savedState) {
            const parsed = JSON.parse(savedState);
            Object.assign(gameState, parsed);
        }
    } catch (e) {
        console.error('Failed to load game state:', e);
    }
}

function resetGameState() {
    if (confirm('⚠️ RESET ALL PROGRESS? This cannot be undone! (Slips counter will remain)')) {
        const slipsBackup = gameState.sobriety.totalSlips;
        localStorage.removeItem('navyResetRPGState');
        location.reload();
    }
}

// ==================== LOGGING SYSTEM ====================
function logEvent(message, type = 'neutral') {
    const timestamp = new Date().toLocaleString();
    const logEntry = {
        message,
        type,
        timestamp,
        day: gameState.vitals.currentDay,
    };
    gameState.logbook.push(logEntry);
    saveGameState();
    return logEntry;
}

// ==================== XP & LEVELING SYSTEM ====================
function addXP(amount, reason = '') {
    gameState.vitals.XP += amount;
    logEvent(`+${amount} XP: ${reason}`, 'xp');

    // Check for level up
    const xpRequired = gameState.vitals.Level * 100;
    if (gameState.vitals.XP >= xpRequired) {
        levelUp();
    }

    saveGameState();
    return amount;
}

function levelUp() {
    gameState.vitals.XP = 0;
    gameState.vitals.Level += 1;

    // Update rank
    if (gameState.vitals.Level - 1 < rankProgression.length) {
        gameState.vitals.Rank = rankProgression[gameState.vitals.Level - 1];
    }

    // Stat boost on level up
    const statBoost = 0.5;
    Object.keys(gameState.stats).forEach(stat => {
        gameState.stats[stat] = Math.min(20, gameState.stats[stat] + statBoost);
    });

    logEvent(
        `🎖️ LEVEL UP! Now Level ${gameState.vitals.Level} - ${gameState.vitals.Rank}`,
        'levelup'
    );
    saveGameState();
}

// ==================== STAT SYSTEM ====================
function modifyStat(stat, amount, reason = '') {
    const currentValue = gameState.stats[stat] || 0;
    gameState.stats[stat] = Math.max(1, Math.min(20, currentValue + amount));
    if (reason) {
        logEvent(`${stat} ${amount > 0 ? '+' : ''}${amount}: ${reason}`, 'stat');
    }
    saveGameState();
}

// ==================== SOBRIETY ENGINE (CRITICAL LOGIC) ====================
function handleSobrietyCheck(isSober) {
    if (isSober) {
        gameState.sobriety.noWeedToday = true;
        gameState.sobriety.sobrietyStreak += 1;

        // XP reward
        addXP(habitXPValues.Sobriety, 'Sobriety maintained');

        // Resilience boost
        modifyStat('Resilience', 1, 'Sobriety maintained');

        logEvent(
            `✅ Sobriety Day ${gameState.sobriety.sobrietyStreak}: Resilience +1`,
            'sobriety_success'
        );
    } else {
        // SLIP LOGIC - IRREVERSIBLE
        gameState.sobriety.noWeedToday = false;
        gameState.sobriety.totalSlips += 1; // PERMANENT
        gameState.sobriety.sobrietyStreak = 0; // Reset streak
        gameState.sobriety.lastSlipDate = new Date().toDateString();

        // Penalties
        modifyStat('Resilience', -2, 'Sobriety slip');
        gameState.vitals.Health = Math.max(0, gameState.vitals.Health - 15);

        logEvent(
            `❌ SLIP #${gameState.sobriety.totalSlips}: Resilience -2, Health -15`,
            'sobriety_fail'
        );
    }

    saveGameState();
}

// ==================== HABIT COMPLETION ====================
function completeHabit(phase, habit) {
    if (!gameState.dailyPhases[phase]) return false;

    // Prevent double completion
    if (gameState.dailyPhases[phase].habits[habit]) {
        logEvent(`${habit} already completed this phase`, 'warning');
        return false;
    }

    gameState.dailyPhases[phase].habits[habit] = true;
    const xpGain = habitXPValues[habit] || 50;

    addXP(xpGain, `${habit} completed at ${gameState.dailyPhases[phase].time}`);

    // Stat bonuses
    if (habit === 'PT') {
        modifyStat('Strength', 1, 'PT session');
        modifyStat('Discipline', 0.5, 'PT dedication');
    } else if (habit === 'ASVABStudy') {
        modifyStat('Intelligence', 1, 'ASVAB study');
        modifyStat('Focus', 0.5, 'Sustained focus');
    } else if (habit === 'Reading') {
        modifyStat('Intelligence', 0.5, 'Reading');
    } else if (habit === 'Sleep') {
        gameState.vitals.Health = Math.min(100, gameState.vitals.Health + 20);
        modifyStat('Resilience', 0.5, 'Quality sleep');
    }

    logEvent(`✓ ${habit} completed`, 'habit');
    saveGameState();
    return true;
}

// ==================== FINANCE SYSTEM ====================
function addMoney(amount, description = '') {
    gameState.finances.currentBalance += amount;
    gameState.finances.transactions.push({
        amount,
        description,
        date: new Date().toLocaleString(),
        balance: gameState.finances.currentBalance,
    });

    logEvent(`💰 +$${amount}: ${description}`, 'finance');

    // Check if goal reached
    if (gameState.finances.currentBalance >= gameState.finances.goal) {
        logEvent('🏆 FINANCIAL GOAL REACHED: $1,270!', 'milestone');
        modifyStat('Ambition', 2, 'Financial goal achieved');
    }

    saveGameState();
}

// ==================== DAILY RESET ====================
function advanceDay() {
    gameState.vitals.currentDay += 1;

    // Check sobriety for new day
    gameState.sobriety.noWeedToday = true;

    // Reset daily habits
    Object.keys(gameState.dailyPhases).forEach(phase => {
        gameState.dailyPhases[phase].completed = false;
        Object.keys(gameState.dailyPhases[phase].habits).forEach(habit => {
            gameState.dailyPhases[phase].habits[habit] = false;
        });
    });

    logEvent(`📅 Day ${gameState.vitals.currentDay} begins`, 'day_start');
    saveGameState();
}

// ==================== INITIALIZATION ====================
function initializeGame() {
    loadGameState();

    // Check if it's a new day
    const lastLogDate = gameState.settings.lastLogDate;
    const today = new Date().toDateString();

    if (lastLogDate !== today) {
        advanceDay();
        gameState.settings.lastLogDate = today;
    }

    saveGameState();
}

// Initialize on load
initializeGame();
