async function loadDashboard() {
    try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        renderDashboard(data);
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

async function switchMode(mode) {
    try {
        await fetch('/api/switch-mode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode })
        });
        showToast(`Switched to ${mode} mode`);
        loadDashboard();
    } catch (error) {
        console.error('Error switching mode:', error);
    }
}

async function handlePayment(passengerId, billType) {
    try {
        await fetch('/api/pay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ passengerId, billType })
        });
        showToast('Payment updated successfully');
        loadDashboard();
    } catch (error) {
        console.error('Error updating payment:', error);
    }
}

async function triggerForceMajeure() {
    try {
        await fetch('/api/force-majeure', { method: 'POST' });
        showToast('Force Majeure applied! Profit reduced by $50.', 'error');
        loadDashboard();
    } catch (error) {
        console.error('Error triggering force majeure:', error);
    }
}

async function sendNudge(passengerId) {
    try {
        await fetch('/api/nudge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ passengerId })
        });
        showToast(`Nudge sent to ${passengerId} via Telegram/Instagram`);
    } catch (error) {
        console.error('Error sending nudge:', error);
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const color = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    toast.className = `toast mb-3 px-6 py-3 rounded text-white font-semibold shadow-lg ${color}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        if(container.contains(toast)) {
            container.removeChild(toast);
        }
    }, 3000);
}

function renderDashboard(data) {
    const content = document.getElementById('dashboard-content');

    if (data.meta.mode === 'ORGANIZER') {
        content.innerHTML = renderOrganizer(data);
    } else if (data.meta.mode === 'FAMILY') {
        content.innerHTML = renderFamily(data);
    } else if (data.meta.mode === 'SOLO') {
        content.innerHTML = renderSolo(data);
    }
}

function renderOrganizer(data) {
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="glass-panel p-6">
                <h2 class="text-2xl font-semibold mb-4 text-yellow-400">Financials</h2>
                <div class="space-y-2">
                    <p class="text-gray-300">Collected: <span class="text-white font-bold">$${data.financials?.collected || 0}</span></p>
                    <p class="text-gray-300">Expected: <span class="text-white font-bold">$${data.financials?.expected || 0}</span></p>
                    <p class="text-gray-300">Net Profit: <span class="text-green-400 font-bold">$${data.financials?.projectedProfit || 0}</span></p>
                </div>

                <h3 class="text-xl font-semibold mt-6 mb-2 text-yellow-400">Risk Management</h3>
                <p class="text-gray-300 mb-2">Hotel Coverage: ${data.financials?.hotelCoverage || 'N/A'}</p>
                <p class="${data.financials?.status.includes('RISK') ? 'text-red-400 font-bold' : 'text-green-400'}">${data.financials?.status}</p>

                <button onclick="triggerForceMajeure()" class="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors">Simulate Force Majeure (-$50)</button>
            </div>

            <div class="glass-panel p-6">
                <h2 class="text-2xl font-semibold mb-4 text-yellow-400">Debtors</h2>
                <div class="space-y-4">
                    <div>
                        <h4 class="text-lg font-medium text-gray-400">Deposit Missing</h4>
                        <p class="text-red-400">${data.debtors?.deposit?.join(', ') || 'None'}</p>
                    </div>
                    <div>
                        <h4 class="text-lg font-medium text-gray-400">Boarding Unpaid</h4>
                        <p class="text-red-400">${data.debtors?.boarding?.join(', ') || 'None'}</p>
                    </div>
                    <div>
                        <h4 class="text-lg font-medium text-gray-400">Stay Unpaid</h4>
                        <p class="text-red-400">${data.debtors?.stay?.join(', ') || 'None'}</p>
                    </div>
                </div>

                <div class="mt-6 flex gap-2 overflow-x-auto pb-2">
                    <!-- Mock passenger actions -->
                    <button onclick="handlePayment('usr_test', 'deposit')" class="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-gray-600">Pay Deposit (Alex)</button>
                    <button onclick="handlePayment('usr_test', 'stay')" class="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-gray-600">Pay Stay (Alex)</button>
                    <button onclick="sendNudge('Sarah J.')" class="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-500">🔔 Nudge Sarah</button>
                </div>
            </div>
        </div>
    `;
}

function renderFamily(data) {
    return `
        <div class="max-w-2xl mx-auto glass-panel p-8 text-center">
            <h2 class="text-3xl font-semibold mb-6 text-pink-400">Family Pot</h2>
            <div class="text-5xl font-bold mb-4">$${data.financials?.sharedPot || 0}</div>
            <p class="text-xl text-gray-300">Total shared expenses</p>

            <div class="mt-8 pt-8 border-t border-gray-700">
                <h3 class="text-2xl font-semibold text-pink-400 mb-2">Egalitarian Split</h3>
                <p class="text-2xl font-medium">$${data.financials?.perPerson?.toFixed(2) || 0} <span class="text-gray-400 text-lg">per person</span></p>
            </div>

            <div class="mt-8">
                <h4 class="text-lg text-gray-400 mb-2">Participants</h4>
                <div class="flex flex-wrap justify-center gap-2">
                    ${data.group ? data.group.map(g => `<span class="bg-gray-800 px-4 py-1 rounded-full">${g}</span>`).join('') : ''}
                </div>
            </div>
        </div>
    `;
}

function renderSolo(data) {
    return `
        <div class="max-w-2xl mx-auto glass-panel p-8">
            <h2 class="text-3xl font-semibold mb-6 text-green-400">Solo Explorer Dashboard</h2>

            <div class="grid grid-cols-2 gap-6 mb-8">
                <div class="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
                    <p class="text-gray-400 mb-1">Destination</p>
                    <p class="text-2xl font-bold">${data.meta?.destination || 'N/A'}</p>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
                    <p class="text-gray-400 mb-1">Total Budget</p>
                    <p class="text-2xl font-bold">$${data.budget || 0}</p>
                </div>
            </div>

            <h3 class="text-xl font-semibold mb-4 text-green-400">Vehicle Profile</h3>
            ${data.vehicle ? `
                <div class="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <p><strong>Model:</strong> ${data.vehicle.make} ${data.vehicle.model}</p>
                    <p><strong>Type:</strong> ${data.vehicle.type}</p>
                    <p><strong>Energy Level:</strong> ${data.vehicle.currentLevel}%</p>
                    <div class="w-full bg-gray-700 h-2 mt-2 rounded">
                        <div class="bg-green-500 h-2 rounded" style="width: ${data.vehicle.currentLevel}%"></div>
                    </div>
                </div>
            ` : `<p class="text-gray-400">No vehicle added.</p>`}
        </div>
    `;
}

// Initial load
document.addEventListener('DOMContentLoaded', loadDashboard);
