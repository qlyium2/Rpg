// ==================== UI RENDERING ====================

function renderApp() {
    const app = document.getElementById('app');
    app.innerHTML = renderDashboard();
    attachEventListeners();
}

function renderDashboard() {
    const sobrietyStatus = getSobrietyStatus();
    const healthPercent = gameState.vitals.Health;
    const xpPercent = (gameState.vitals.XP / (gameState.vitals.Level * 100)) * 100;
    const financePercent = (gameState.finances.currentBalance / gameState.finances.goal) * 100;

    return `
        <!-- HEADER / SOBRIETY BANNER -->
        <header class="bg-gradient-to-r from-slate-900 to-black border-b border-green-500 sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <div class="flex justify-between items-center mb-3">
                    <h1 class="text-3xl font-bold text-green-400">⚔️ NAVY RESET RPG</h1>
                    <div class="text-right">
                        <p class="text-xs text-slate-400">Day ${gameState.vitals.currentDay}</p>
                        <p class="text-sm text-slate-300">Level ${gameState.vitals.Level} - ${gameState.vitals.Rank}</p>
                    </div>
                </div>

                <!-- SOBRIETY BANNER (CRITICAL) -->
                <div class="bg-gradient-to-r ${sobrietyStatus.bannerColor} p-3 rounded-lg border-2 ${sobrietyStatus.borderColor}">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="text-lg font-bold text-white">${sobrietyStatus.message}</p>
                            <p class="text-sm text-slate-200">Streak: ${gameState.sobriety.sobrietyStreak} days | Total Slips: <span class="text-red-400 font-bold">${gameState.sobriety.totalSlips}</span></p>
                        </div>
                        <button onclick="toggleSobrietyModal()" class="bg-white text-black px-4 py-2 rounded font-bold hover:bg-green-200">
                            ${gameState.sobriety.noWeedToday ? '✅ Confirm' : '⚠️ Report Slip'}
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- MAIN CONTENT -->
        <main class="max-w-7xl mx-auto px-4 py-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- LEFT COLUMN: STATS & VITALS -->
                <aside class="lg:col-span-1">
                    ${renderStatGrid()}
                    ${renderProgressBars()}
                </aside>

                <!-- CENTER COLUMN: DAILY PHASES & HABITS -->
                <section class="lg:col-span-2">
                    ${renderDailyPhases()}
                    ${renderFinanceTracker()}
                </section>
            </div>

            <!-- LOGBOOK -->
            <section class="mt-8">
                ${renderLogbook()}
            </section>

            <!-- SETTINGS -->
            <section class="mt-8 text-center pb-8">
                <button onclick="resetGameState()" class="bg-red-900 hover:bg-red-800 text-white px-6 py-2 rounded font-bold border border-red-500">
                    🔄 HARD RESET
                </button>
            </section>
        </main>

        <!-- SOBRIETY MODAL -->
        ${renderSobrietyModal()}
    `;
}

// ==================== STAT GRID ====================
function renderStatGrid() {
    const stats = gameState.stats;
    const statColors = {
        Strength: 'from-red-600 to-red-900',
        Discipline: 'from-blue-600 to-blue-900',
        Intelligence: 'from-purple-600 to-purple-900',
        Focus: 'from-yellow-600 to-yellow-900',
        Resilience: 'from-green-600 to-green-900',
        Ambition: 'from-orange-600 to-orange-900',
    };

    let html = '<div class="bg-slate-900 border border-green-500 rounded-lg p-4 mb-6">';
    html += '<h2 class="text-xl font-bold text-green-400 mb-4">STATS (1-20)</h2>';
    html += '<div class="grid grid-cols-2 gap-3">';

    Object.entries(stats).forEach(([stat, value]) => {
        const fillPercent = (value / 20) * 100;
        html += `
            <div class="bg-slate-800 p-3 rounded border border-slate-700">
                <p class="text-sm font-bold text-slate-300 mb-1">${stat}</p>
                <div class="w-full bg-slate-700 rounded h-4 overflow-hidden">
                    <div class="bg-gradient-to-r ${statColors[stat]} h-full" style="width: ${fillPercent}%"></div>
                </div>
                <p class="text-xs text-slate-400 mt-1 text-center">${value.toFixed(1)}/20</p>
            </div>
        `;
    });

    html += '</div></div>';
    return html;
}

// ==================== PROGRESS BARS ====================
function renderProgressBars() {
    const healthPercent = gameState.vitals.Health;
    const xpPercent = (gameState.vitals.XP / (gameState.vitals.Level * 100)) * 100;
    const financePercent = Math.min((gameState.finances.currentBalance / gameState.finances.goal) * 100, 100);

    return `
        <div class="bg-slate-900 border border-green-500 rounded-lg p-4 space-y-4">
            <h2 class="text-xl font-bold text-green-400">VITALS</h2>

            <!-- HEALTH -->
            <div>
                <p class="text-sm font-bold mb-2">HEALTH: ${gameState.vitals.Health}%</p>
                <div class="w-full bg-slate-700 rounded h-3 overflow-hidden">
                    <div class="bg-gradient-to-r from-red-600 to-red-900 h-full" style="width: ${healthPercent}%"></div>
                </div>
            </div>

            <!-- XP -->
            <div>
                <p class="text-sm font-bold mb-2">XP: ${gameState.vitals.XP}/${gameState.vitals.Level * 100}</p>
                <div class="w-full bg-slate-700 rounded h-3 overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-600 to-blue-900 h-full" style="width: ${xpPercent}%"></div>
                </div>
            </div>

            <!-- SOBRIETY STREAK -->
            <div class="bg-green-900 border border-green-500 p-3 rounded">
                <p class="text-sm font-bold text-green-300">🌿 Sobriety Streak</p>
                <p class="text-2xl font-bold text-green-400">${gameState.sobriety.sobrietyStreak} DAYS</p>
            </div>
        </div>
    `;
}

// ==================== DAILY PHASES ====================
function renderDailyPhases() {
    const phases = ['morning', 'afterSchool', 'evening'];
    let html = '<div class="bg-slate-900 border border-green-500 rounded-lg p-6">';
    html += '<h2 class="text-2xl font-bold text-green-400 mb-6">📅 DAILY MISSION LOG</h2>';

    phases.forEach(phaseName => {
        const phase = gameState.dailyPhases[phaseName];
        const phaseLabel = phaseName === 'morning' ? '🌅 Morning (0600)' : 
                          phaseName === 'afterSchool' ? '🌤️ After-School (1630)' : 
                          '🌙 Evening (2130)';

        html += `
            <div class="mb-6 bg-slate-800 p-4 rounded-lg border border-slate-700">
                <h3 class="text-lg font-bold text-green-300 mb-3">${phaseLabel}</h3>
                <div class="space-y-2">
        `;

        Object.entries(phase.habits).forEach(([habit, completed]) => {
            const xp = habitXPValues[habit];
            const btnClass = completed ? 'bg-green-700 text-white border-green-500' : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600';
            const btnText = completed ? `✅ ${habit} (+${xp} XP)` : `☐ ${habit}`;

            html += `
                <button onclick="handleHabitClick('${phaseName}', '${habit}')" 
                        class="w-full ${btnClass} px-4 py-2 rounded border-2 font-bold transition">
                    ${btnText}
                </button>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    html += '</div>';
    return html;
}

// ==================== FINANCE TRACKER ====================
function renderFinanceTracker() {
    const financePercent = Math.min((gameState.finances.currentBalance / gameState.finances.goal) * 100, 100);
    const remaining = Math.max(0, gameState.finances.goal - gameState.finances.currentBalance);

    return `
        <div class="bg-slate-900 border border-green-500 rounded-lg p-6 mt-6">
            <h2 class="text-2xl font-bold text-green-400 mb-4">💰 FINANCIAL GOAL</h2>
            <div class="bg-slate-800 p-4 rounded-lg mb-4">
                <p class="text-sm text-slate-300 mb-2">Progress: $${gameState.finances.currentBalance}/${gameState.finances.goal}</p>
                <div class="w-full bg-slate-700 rounded h-4 overflow-hidden mb-2">
                    <div class="bg-gradient-to-r from-green-600 to-green-900 h-full" style="width: ${financePercent}%"></div>
                </div>
                <p class="text-xs text-slate-400">${remaining > 0 ? `$${remaining} remaining` : '✅ GOAL ACHIEVED!'}</p>
            </div>

            <div class="grid grid-cols-3 gap-2">
                <button onclick="quickAddMoney(100)" class="bg-blue-700 hover:bg-blue-600 text-white px-3 py-2 rounded font-bold text-sm">+$100</button>
                <button onclick="quickAddMoney(500)" class="bg-blue-700 hover:bg-blue-600 text-white px-3 py-2 rounded font-bold text-sm">+$500</button>
                <button onclick="openMoneyModal()" class="bg-green-700 hover:bg-green-600 text-white px-3 py-2 rounded font-bold text-sm">Custom</button>
            </div>
        </div>
    `;
}

// ==================== LOGBOOK ====================
function renderLogbook() {
    const recentLogs = gameState.logbook.slice(-15).reverse();

    return `
        <div class="bg-slate-900 border border-green-500 rounded-lg p-6">
            <h2 class="text-2xl font-bold text-green-400 mb-4">📖 LOGBOOK (Last 15 Entries)</h2>
            <div class="space-y-2 max-h-96 overflow-y-auto bg-slate-800 p-4 rounded-lg">
                ${recentLogs.map(log => {
                    const typeEmoji = {
                        'habit': '✓',
                        'xp': '⚡',
                        'stat': '📊',
                        'sobriety_success': '✅',
                        'sobriety_fail': '❌',
                        'levelup': '🎖️',
                        'finance': '💰',
                        'day_start': '📅',
                        'milestone': '🏆',
                    }[log.type] || '•';

                    const typeColor = {
                        'sobriety_success': 'text-green-400',
                        'sobriety_fail': 'text-red-400',
                        'levelup': 'text-yellow-400',
                        'milestone': 'text-purple-400',
                    }[log.type] || 'text-slate-300';

                    return `
                        <div class="border-l-2 border-green-500 pl-3 py-1">
                            <p class="text-xs text-slate-400">${log.timestamp}</p>
                            <p class="text-sm ${typeColor}"><strong>${typeEmoji}</strong> ${log.message}</p>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// ==================== MODALS ====================
function renderSobrietyModal() {
    return `
        <div id="sobrietyModal" style="display: none;" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div class="bg-slate-900 border-2 border-green-500 rounded-lg p-8 max-w-md w-full">
                <h2 class="text-2xl font-bold text-green-400 mb-4">🌿 Sobriety Check</h2>
                <p class="text-slate-300 mb-6">Did you stay sober today?</p>
                <div class="space-y-3">
                    <button onclick="confirmSobriety(true)" class="w-full bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded font-bold border-2 border-green-500">
                        ✅ YES - I stayed sober
                    </button>
                    <button onclick="confirmSobriety(false)" class="w-full bg-red-700 hover:bg-red-600 text-white px-6 py-3 rounded font-bold border-2 border-red-500">
                        ❌ NO - I slipped (Permanent Record)
                    </button>
                    <button onclick="closeSobrietyModal()" class="w-full bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded font-bold">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ==================== EVENT LISTENERS ====================
function attachEventListeners() {
    // Delegated event handling will be done through onclick attributes
}

// ==================== CLICK HANDLERS ====================
function handleHabitClick(phase, habit) {
    const completed = completeHabit(phase, habit);
    if (completed) {
        renderApp();
    }
}

function toggleSobrietyModal() {
    const modal = document.getElementById('sobrietyModal');
    modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
}

function closeSobrietyModal() {
    document.getElementById('sobrietyModal').style.display = 'none';
}

function confirmSobriety(isSober) {
    handleSobrietyCheck(isSober);
    closeSobrietyModal();
    renderApp();
}

function quickAddMoney(amount) {
    addMoney(amount, `Quick add $${amount}`);
    renderApp();
}

function openMoneyModal() {
    const amount = prompt('Enter amount to add ($):');
    if (amount && !isNaN(amount)) {
        addMoney(parseInt(amount), `Custom addition: $${amount}`);
        renderApp();
    }
}

// ==================== UTILITY FUNCTIONS ====================
function getSobrietyStatus() {
    const streak = gameState.sobriety.sobrietyStreak;

    if (streak === 0) {
        return {
            message: '🚨 DAY 1: FRESH START',
            bannerColor: 'from-red-900 to-red-800',
            borderColor: 'border-red-500',
        };
    } else if (streak < 7) {
        return {
            message: `📍 DAY ${streak}: Building Momentum`,
            bannerColor: 'from-yellow-900 to-yellow-800',
            borderColor: 'border-yellow-500',
        };
    } else if (streak < 14) {
        return {
            message: `💪 DAY ${streak}: Turning Point`,
            bannerColor: 'from-blue-900 to-blue-800',
            borderColor: 'border-blue-500',
        };
    } else if (streak < 30) {
        return {
            message: `⚡ DAY ${streak}: Unstoppable`,
            bannerColor: 'from-purple-900 to-purple-800',
            borderColor: 'border-purple-500',
        };
    } else {
        return {
            message: `🏆 DAY ${streak}+: DIFFERENT PERSON`,
            bannerColor: 'from-green-900 to-green-800',
            borderColor: 'border-green-500',
        };
    }
}

// ==================== INITIALIZE UI ====================
window.addEventListener('DOMContentLoaded', () => {
    renderApp();
    // Re-render every 60 seconds to keep UI fresh
    setInterval(renderApp, 60000);
});
