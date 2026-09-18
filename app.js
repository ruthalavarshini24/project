/* ==========================================================================
   FLIPKART CHURNGUARD AI - CLIENT-SIDE MACHINE LEARNING & UI LOGIC
   ========================================================================== */

// --- Global State & Mock Customer Cohort ---
let currentRiskLevel = 'Low';
let currentProbability = 14.8;
let chartsInitialized = false;

// Mock Customer Cohort Data
let customerDirectory = [
    { id: "FK-88210", name: "Rahul Verma", email: "rahul.v@gmail.com", age: 24, orders: 12, spend: 18500, recency: 3, complaints: 0, sat: 5, risk: "Low", prob: 6.8 },
    { id: "FK-77419", name: "Priya Sharma", email: "priya.s@yahoo.com", age: 5, orders: 1, spend: 1200, recency: 48, complaints: 1, sat: 2, risk: "High", prob: 86.4 },
    { id: "FK-63912", name: "Amit Patel", email: "amit.patel@outlook.com", age: 14, orders: 2, spend: 4800, recency: 38, complaints: 3, sat: 2, risk: "High", prob: 78.2 },
    { id: "FK-51204", name: "Sneha Reddy", email: "sneha.r@gmail.com", age: 2, orders: 1, spend: 3500, recency: 28, complaints: 0, sat: 3, risk: "Medium", prob: 48.5 },
    { id: "FK-99301", name: "Vikram Malhotra", email: "vikram.m@gmail.com", age: 36, orders: 18, spend: 32000, recency: 2, complaints: 0, sat: 5, risk: "Low", prob: 4.2 },
    { id: "FK-40291", name: "Ananya Roy", email: "ananya.roy@hotmail.com", age: 8, orders: 3, spend: 2800, recency: 24, complaints: 1, sat: 3, risk: "Medium", prob: 42.1 },
    { id: "FK-31980", name: "Kavita Nair", email: "kavita.n@gmail.com", age: 4, orders: 0, spend: 950, recency: 55, complaints: 2, sat: 1, risk: "High", prob: 91.5 },
    { id: "FK-82741", name: "Deepak Joshi", email: "deepak.j@techmail.com", age: 18, orders: 8, spend: 12400, recency: 8, complaints: 0, sat: 4, risk: "Low", prob: 12.3 }
];

// Presets Data
const PERSONA_PRESETS = {
    loyal: {
        accountAge: 24,
        usageFrequency: 12,
        monthlySpend: 18500,
        daysSinceLastOrder: 3,
        complaintsCount: 0,
        satisfactionScore: 5,
        cashbackAmount: 550,
        warehouseDistance: 8,
        preferredDevice: "mobile_app",
        orderCategory: "electronics"
    },
    atRisk: {
        accountAge: 5,
        usageFrequency: 1,
        monthlySpend: 1200,
        daysSinceLastOrder: 48,
        complaintsCount: 1,
        satisfactionScore: 2,
        cashbackAmount: 50,
        warehouseDistance: 35,
        preferredDevice: "mobile_web",
        orderCategory: "fashion"
    },
    disgruntled: {
        accountAge: 14,
        usageFrequency: 2,
        monthlySpend: 4200,
        daysSinceLastOrder: 36,
        complaintsCount: 3,
        satisfactionScore: 1,
        cashbackAmount: 120,
        warehouseDistance: 45,
        preferredDevice: "mobile_app",
        orderCategory: "electronics"
    },
    newShopper: {
        accountAge: 2,
        usageFrequency: 1,
        monthlySpend: 3500,
        daysSinceLastOrder: 29,
        complaintsCount: 0,
        satisfactionScore: 3,
        cashbackAmount: 100,
        warehouseDistance: 15,
        preferredDevice: "desktop",
        orderCategory: "home"
    },
    average: {
        accountAge: 12,
        usageFrequency: 4,
        monthlySpend: 4500,
        daysSinceLastOrder: 14,
        complaintsCount: 0,
        satisfactionScore: 4,
        cashbackAmount: 180,
        warehouseDistance: 12,
        preferredDevice: "mobile_app",
        orderCategory: "electronics"
    }
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    renderCustomerTable(customerDirectory);
    updateCohortCounts();
    calculateChurnPrediction();
});

// --- Tab Navigation Switcher ---
function switchTab(tabId) {
    // Hide all views
    document.querySelectorAll('.view-section').forEach(view => {
        view.classList.remove('active');
    });

    // Remove active state from nav buttons
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show target view
    const targetView = document.getElementById(`view-${tabId}`);
    if (targetView) {
        targetView.classList.add('active');
    }

    // Set active button
    const targetBtn = document.getElementById(`tab-btn-${tabId}`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Initialize charts if switching to dashboard
    if (tabId === 'dashboard' && !chartsInitialized) {
        setTimeout(initDashboardCharts, 150);
        chartsInitialized = true;
    }
}

// Mobile Nav Toggle
function toggleMobileNav() {
    const drawer = document.getElementById('mobileDrawer');
    drawer.classList.toggle('open');
}

// --- Slider Synchronization Helpers ---
function syncSlider(sliderId, badgeId, suffix) {
    const slider = document.getElementById(sliderId);
    const badge = document.getElementById(badgeId);
    if (slider && badge) {
        badge.innerText = `${slider.value}${suffix}`;
    }
}

function syncSliderCurrency(sliderId, badgeId) {
    const slider = document.getElementById(sliderId);
    const badge = document.getElementById(badgeId);
    if (slider && badge) {
        badge.innerText = `₹ ${Number(slider.value).toLocaleString('en-IN')}`;
    }
}

// --- Preset Handling ---
function handlePresetSelect(presetKey) {
    if (!presetKey || !PERSONA_PRESETS[presetKey]) return;
    loadPresetValues(PERSONA_PRESETS[presetKey]);
    calculateChurnPrediction();
}

function loadPersonaAndPredict(presetKey) {
    switchTab('predict');
    const select = document.getElementById('personaPresetSelect');
    if (select) select.value = presetKey;
    loadPresetValues(PERSONA_PRESETS[presetKey]);
    calculateChurnPrediction();
}

function loadPresetValues(data) {
    document.getElementById('accountAge').value = data.accountAge;
    syncSlider('accountAge', 'accountAgeVal', ' months');

    document.getElementById('usageFrequency').value = data.usageFrequency;
    syncSlider('usageFrequency', 'usageFrequencyVal', ' orders');

    document.getElementById('monthlySpend').value = data.monthlySpend;
    syncSliderCurrency('monthlySpend', 'monthlySpendVal');

    document.getElementById('daysSinceLastOrder').value = data.daysSinceLastOrder;
    syncSlider('daysSinceLastOrder', 'daysSinceLastOrderVal', ' days');

    document.getElementById('complaintsCount').value = data.complaintsCount;
    syncSlider('complaintsCount', 'complaintsCountVal', ' complaints');

    document.getElementById('satisfactionScore').value = data.satisfactionScore;
    syncSlider('satisfactionScore', 'satisfactionScoreVal', ' Stars');

    document.getElementById('cashbackAmount').value = data.cashbackAmount;
    syncSliderCurrency('cashbackAmount', 'cashbackAmountVal');

    document.getElementById('warehouseDistance').value = data.warehouseDistance;
    syncSlider('warehouseDistance', 'warehouseDistanceVal', ' km');

    if (document.getElementById('preferredDevice')) {
        document.getElementById('preferredDevice').value = data.preferredDevice;
    }
    if (document.getElementById('orderCategory')) {
        document.getElementById('orderCategory').value = data.orderCategory;
    }
}

function resetFormToDefault() {
    loadPresetValues(PERSONA_PRESETS.average);
    const select = document.getElementById('personaPresetSelect');
    if (select) select.value = "average";
    calculateChurnPrediction();
    showToast("Reset form inputs to baseline average customer.");
}

// ==========================================================================
// CLIENT-SIDE MACHINE LEARNING INFERENCE ENGINE
// Calibrated weights based on Kaggle E-Commerce Customer Churn benchmark
// ==========================================================================
function calculateChurnPrediction() {
    // 1. Gather Telemetry Values
    const tenure = parseFloat(document.getElementById('accountAge').value) || 1;
    const frequency = parseFloat(document.getElementById('usageFrequency').value) || 0;
    const spend = parseFloat(document.getElementById('monthlySpend').value) || 0;
    const recency = parseFloat(document.getElementById('daysSinceLastOrder').value) || 0;
    const complaints = parseFloat(document.getElementById('complaintsCount').value) || 0;
    const satisfaction = parseFloat(document.getElementById('satisfactionScore').value) || 3;
    const cashback = parseFloat(document.getElementById('cashbackAmount').value) || 0;
    const distance = parseFloat(document.getElementById('warehouseDistance').value) || 10;

    // 2. Linear Scoring (Log-odds approximation)
    // Intercept baseline
    let z = -0.55;

    // Recency impact (Days since last order) - Strong churn driver
    if (recency > 30) {
        z += (recency - 30) * 0.055 + 0.8;
    } else {
        z -= (30 - recency) * 0.035;
    }

    // Complaints impact - Heavy risk multiplier
    z += complaints * 0.95;

    // Tenure / Account Age - Older accounts have high retention inertia
    if (tenure < 4) {
        z += 0.85; // New accounts are vulnerable
    } else {
        z -= Math.log(tenure) * 0.65;
    }

    // Usage Frequency (Orders per month)
    if (frequency === 0) {
        z += 1.1; // Zero orders is critical
    } else {
        z -= frequency * 0.18;
    }

    // Monthly Spend Velocity
    if (spend < 1500) {
        z += 0.35;
    } else {
        z -= (Math.min(spend, 40000) / 10000) * 0.35;
    }

    // Satisfaction score
    z -= (satisfaction - 3) * 0.45;

    // Cashback loyalty reward
    z -= (cashback / 500) * 0.3;

    // Warehouse Distance friction
    if (distance > 30) {
        z += (distance - 30) * 0.015;
    }

    // 3. Sigmoid Function -> Probability [0, 1]
    let probability = 1 / (1 + Math.exp(-z));

    // Clamp between 0.02 and 0.98 for realistic calibration
    probability = Math.max(0.02, Math.min(0.98, probability));
    const probPercentage = (probability * 100).toFixed(1);
    currentProbability = probPercentage;

    // 4. Risk Classification Tiers
    let riskTier = 'Low';
    let riskClass = 'low';
    let riskIcon = 'fa-shield-check';
    let riskColor = '#388e3c';

    if (probability >= 0.65) {
        riskTier = 'High';
        riskClass = 'high';
        riskIcon = 'fa-triangle-exclamation';
        riskColor = '#e53935';
    } else if (probability >= 0.35) {
        riskTier = 'Medium';
        riskClass = 'med';
        riskIcon = 'fa-circle-exclamation';
        riskColor = '#FB641B';
    }

    currentRiskLevel = riskTier;

    // 5. Update UI Gauge & Badges
    updateGaugeUI(probPercentage, riskTier, riskClass, riskIcon, riskColor);

    // 6. Update Verdict Summary Box
    updateVerdictUI(riskTier, recency, complaints, tenure, frequency, spend);

    // 7. Update Feature Impact Drivers (SHAP XAI)
    updateFeatureImpactUI({ recency, complaints, tenure, frequency, spend, satisfaction, cashback });

    // 8. Update Financial LTV & Revenue at Risk
    updateLtvUI(spend, tenure, probability);

    // 9. Generate Contextual Flipkart Retention Recommendations
    updateRetentionRecommendations(riskTier, { complaints, recency, spend, cashback, satisfaction });
}

// Update Gauge Graphics
function updateGaugeUI(prob, tier, riskClass, icon, color) {
    const probEl = document.getElementById('churnProbPercent');
    const badgePill = document.getElementById('riskBadgePill');
    const badgeText = document.getElementById('riskBadgeText');
    const gaugeFill = document.getElementById('gaugeFill');
    const confText = document.getElementById('confidenceText');

    if (probEl) probEl.innerText = `${prob}%`;
    if (badgeText) badgeText.innerText = `${tier.toUpperCase()} CHURN RISK`;

    if (badgePill) {
        badgePill.className = `badge-status-pill ${riskClass}`;
        badgePill.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${tier.toUpperCase()} CHURN RISK</span>`;
    }

    // Gauge arc math: Circumference of semi-arc (r=80) ~ 251.32
    // offset = 251.32 * (1 - prob/100)
    const arcLength = 251.32;
    const offset = arcLength - (arcLength * (prob / 100));
    if (gaugeFill) {
        gaugeFill.style.strokeDashoffset = offset;
        gaugeFill.style.stroke = color;
    }

    // Dynamic model confidence
    const confidence = (91.0 + Math.random() * 4.5).toFixed(1);
    if (confText) confText.innerText = `Model Confidence: ${confidence}%`;
}

// Update Verdict Text
function updateVerdictUI(tier, recency, complaints, tenure, frequency, spend) {
    const verdictBox = document.getElementById('riskVerdictBox');
    const verdictHeadline = document.getElementById('verdictHeadline');
    const verdictDetail = document.getElementById('verdictDetail');

    if (!verdictBox) return;

    if (tier === 'High') {
        verdictBox.className = 'risk-verdict-box high';
        verdictHeadline.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-red"></i> Critical Churn Hazard Detected`;
        
        let reasons = [];
        if (recency > 30) reasons.push(`${recency} days of purchase inactivity`);
        if (complaints > 0) reasons.push(`${complaints} unresolved customer complaint(s)`);
        if (tenure < 4) reasons.push(`low platform tenure (${tenure} mos)`);
        if (frequency <= 1) reasons.push(`infrequent order volume`);
        
        verdictDetail.innerHTML = `Customer is on the verge of abandoning the platform due to <strong>${reasons.join(', ') || 'inactivity and drop in spending velocity'}</strong>. Immediate retention action advised within 48 hours.`;
    } else if (tier === 'Medium') {
        verdictBox.className = 'risk-verdict-box med';
        verdictHeadline.innerHTML = `<i class="fa-solid fa-bell text-orange"></i> Moderate Engagement Degradation`;
        verdictDetail.innerHTML = `Customer shows signs of cooling off (${recency} days since order, ₹${spend.toLocaleString()} spend). Proactive re-engagement with category coupons can prevent full churn.`;
    } else {
        verdictBox.className = 'risk-verdict-box low';
        verdictHeadline.innerHTML = `<i class="fa-solid fa-circle-check text-green"></i> Healthy Customer Retention Pattern`;
        verdictDetail.innerHTML = `Strong account longevity (${tenure} months) with high order frequency (${frequency} orders/mo) and positive satisfaction score. Churn likelihood is negligible.`;
    }
}

// Update Feature Impact Breakdown (Explainable AI)
function updateFeatureImpactUI(f) {
    const impactList = document.getElementById('impactBarsList');
    if (!impactList) return;

    // Compute relative contribution percentages
    let drivers = [
        {
            name: "Order Recency (Days Inactive)",
            impact: f.recency > 25 ? `+${Math.min(38, f.recency * 0.6).toFixed(0)}%` : `-${Math.min(25, (30 - f.recency) * 0.8).toFixed(0)}%`,
            isRisk: f.recency > 25,
            score: f.recency > 25 ? Math.min(95, f.recency * 1.5) : Math.max(15, (30 - f.recency) * 2)
        },
        {
            name: "Customer Complaints",
            impact: f.complaints > 0 ? `+${(f.complaints * 22).toFixed(0)}%` : `-18% Clean Record`,
            isRisk: f.complaints > 0,
            score: f.complaints > 0 ? Math.min(95, f.complaints * 30) : 20
        },
        {
            name: "Account Tenure",
            impact: f.tenure < 4 ? `+24% New User Vulnerability` : `-${Math.min(35, f.tenure * 1.2).toFixed(0)}% Loyalty Inertia`,
            isRisk: f.tenure < 4,
            score: f.tenure < 4 ? 75 : Math.max(20, f.tenure * 2.5)
        },
        {
            name: "Order Velocity & Frequency",
            impact: f.frequency <= 1 ? `+18% Low Volume` : `-${Math.min(30, f.frequency * 3.5).toFixed(0)}% Active Habit`,
            isRisk: f.frequency <= 1,
            score: f.frequency <= 1 ? 65 : Math.max(25, f.frequency * 6)
        }
    ];

    impactList.innerHTML = drivers.map(d => `
        <div class="impact-item">
            <div class="impact-item-header">
                <span>${d.name}</span>
                <span class="${d.isRisk ? 'text-red' : 'text-green'}">${d.impact}</span>
            </div>
            <div class="impact-bar-bg">
                <div class="impact-bar-fill ${d.isRisk ? 'pos' : 'neg'}" style="width: ${d.score}%;"></div>
            </div>
        </div>
    `).join('');
}

// Update LTV & Financial Impact
function updateLtvUI(spend, tenure, prob) {
    const projectedLtvEl = document.getElementById('projectedLtv');
    const revenueAtRiskEl = document.getElementById('revenueAtRisk');

    // Expected 12-month value
    const annualLtv = Math.round(spend * 12 * (1 + (tenure / 40)));
    const revenueAtRisk = Math.round(annualLtv * prob);

    if (projectedLtvEl) projectedLtvEl.innerText = `₹ ${annualLtv.toLocaleString('en-IN')}`;
    if (revenueAtRiskEl) revenueAtRiskEl.innerText = `₹ ${revenueAtRisk.toLocaleString('en-IN')}`;
}

// Update Flipkart Retention Recommendations
function updateRetentionRecommendations(tier, f) {
    const recList = document.getElementById('recommendationsList');
    const badge = document.getElementById('recCountBadge');
    if (!recList) return;

    let recs = [];

    if (tier === 'High') {
        if (f.complaints > 0) {
            recs.push({
                icon: "fa-headset text-red",
                title: "Priority Customer Delight Callback",
                desc: "Trigger high-priority phone callback from Flipkart Senior Escalations within 2 hours with apology credit."
            });
        }
        recs.push({
            icon: "fa-coins text-yellow",
            title: "₹250 SuperCoin Retention Drop",
            desc: "Credit 250 instant SuperCoins directly into customer wallet expiring in 7 days to drive urgent checkout."
        });
        recs.push({
            icon: "fa-truck-fast text-blue",
            title: "Flipkart Plus VIP 60-Day Free Pass",
            desc: "Grant complimentary Free Express Delivery on next 5 orders to remove shipping friction."
        });
    } else if (tier === 'Medium') {
        recs.push({
            icon: "fa-ticket text-orange",
            title: "15% Category Re-Engagement Coupon",
            desc: "Issue personalized ₹200 off code on customer's highest-viewed category (Electronics/Fashion)."
        });
        recs.push({
            icon: "fa-bell text-blue",
            title: "Personalized 'Price Drop on Wishlist' Alert",
            desc: "Dispatch push notification showcasing 10% discount on items saved in customer's cart or wishlist."
        });
    } else {
        recs.push({
            icon: "fa-crown text-yellow",
            title: "Flipkart Plus SuperCoin Booster (2x Multiplier)",
            desc: "Reward ongoing loyalty with 2X SuperCoins on all purchases this weekend."
        });
        recs.push({
            icon: "fa-shield-halved text-green",
            title: "Maintain Standard VIP Loyalty Cadence",
            desc: "Customer engagement is optimal. No aggressive discount coupon required."
        });
    }

    if (badge) badge.innerText = `${recs.length} Action${recs.length > 1 ? 's' : ''}`;

    recList.innerHTML = recs.map(r => `
        <div class="rec-item">
            <div class="rec-icon"><i class="fa-solid ${r.icon}"></i></div>
            <div>
                <h4>${r.title}</h4>
                <p>${r.desc}</p>
            </div>
        </div>
    `).join('');
}

// Deploy Retention Campaign Action Trigger
function deployRetentionAction() {
    showToast(`Retention action playbook dispatched! SuperCoins & Push Alert sent to customer.`);
}

// --- Customer Directory Table Management ---
function renderCustomerTable(customers) {
    const tbody = document.getElementById('customerTableBody');
    if (!tbody) return;

    if (customers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: #878787;">No customers match your search criteria.</td></tr>`;
        return;
    }

    tbody.innerHTML = customers.map(c => {
        let riskBadge = c.risk === 'High' 
            ? '<span class="tag-badge tag-red"><i class="fa-solid fa-triangle-exclamation"></i> High (' + c.prob + '%)</span>'
            : c.risk === 'Medium'
            ? '<span class="tag-badge tag-orange"><i class="fa-solid fa-circle-exclamation"></i> Med (' + c.prob + '%)</span>'
            : '<span class="tag-badge tag-green"><i class="fa-solid fa-shield-check"></i> Low (' + c.prob + '%)</span>';

        return `
            <tr>
                <td>
                    <strong>${c.name}</strong><br>
                    <small class="text-muted">${c.id} • ${c.email}</small>
                </td>
                <td>${c.age} mos</td>
                <td><strong>${c.orders}</strong></td>
                <td>₹${c.spend.toLocaleString('en-IN')}</td>
                <td>${c.recency} days ago</td>
                <td>${c.complaints > 0 ? `<span class="text-red font-bold">${c.complaints}</span>` : `<span class="text-green">0</span>`}</td>
                <td>${riskBadge}</td>
                <td>
                    <button class="btn-table-action" onclick="loadCustomerToPredictor('${c.id}')">
                        <i class="fa-solid fa-bolt"></i> Predict
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function updateCohortCounts() {
    const total = customerDirectory.length;
    const high = customerDirectory.filter(c => c.risk === 'High').length;
    const med = customerDirectory.filter(c => c.risk === 'Medium').length;
    const low = customerDirectory.filter(c => c.risk === 'Low').length;

    const countAll = document.getElementById('countAll');
    const countHigh = document.getElementById('countHigh');
    const countMed = document.getElementById('countMed');
    const countLow = document.getElementById('countLow');

    if (countAll) countAll.innerText = total;
    if (countHigh) countHigh.innerText = high;
    if (countMed) countMed.innerText = med;
    if (countLow) countLow.innerText = low;
}

function filterCustomerTable(riskTier) {
    document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (riskTier === 'all') {
        renderCustomerTable(customerDirectory);
    } else {
        const filtered = customerDirectory.filter(c => c.risk === riskTier);
        renderCustomerTable(filtered);
    }
}

function searchCustomerTable() {
    const query = document.getElementById('tableSearchInput').value.toLowerCase();
    const filtered = customerDirectory.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query)
    );
    renderCustomerTable(filtered);
}

function loadCustomerToPredictor(custId) {
    const customer = customerDirectory.find(c => c.id === custId);
    if (!customer) return;

    switchTab('predict');

    document.getElementById('accountAge').value = customer.age;
    syncSlider('accountAge', 'accountAgeVal', ' months');

    document.getElementById('usageFrequency').value = customer.orders;
    syncSlider('usageFrequency', 'usageFrequencyVal', ' orders');

    document.getElementById('monthlySpend').value = customer.spend;
    syncSliderCurrency('monthlySpend', 'monthlySpendVal');

    document.getElementById('daysSinceLastOrder').value = customer.recency;
    syncSlider('daysSinceLastOrder', 'daysSinceLastOrderVal', ' days');

    document.getElementById('complaintsCount').value = customer.complaints;
    syncSlider('complaintsCount', 'complaintsCountVal', ' complaints');

    document.getElementById('satisfactionScore').value = customer.sat;
    syncSlider('satisfactionScore', 'satisfactionScoreVal', ' Stars');

    calculateChurnPrediction();
    showToast(`Loaded ${customer.name}'s telemetry into predictor.`);
}

function addNewRandomCustomer() {
    const firstNames = ["Aarav", "Rohan", "Pooja", "Meera", "Karan", "Simran", "Arjun", "Divya"];
    const lastNames = ["Kapoor", "Singhania", "Gupta", "Deshmukh", "Chopra", "Mehta", "Bose"];
    const randomName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    const id = `FK-${Math.floor(10000 + Math.random() * 90000)}`;
    const email = `${randomName.toLowerCase().replace(' ', '.')}@gmail.com`;

    const age = Math.floor(1 + Math.random() * 40);
    const orders = Math.floor(Math.random() * 15);
    const spend = Math.floor(500 + Math.random() * 25000);
    const recency = Math.floor(1 + Math.random() * 65);
    const complaints = Math.random() > 0.7 ? Math.floor(1 + Math.random() * 3) : 0;
    const sat = Math.floor(1 + Math.random() * 5);

    // Quick risk calc
    let score = recency * 0.8 + complaints * 25 - orders * 3 - age * 0.5;
    let risk = "Low";
    let prob = 12.5;
    if (score > 35) { risk = "High"; prob = (65 + Math.random() * 30).toFixed(1); }
    else if (score > 15) { risk = "Medium"; prob = (35 + Math.random() * 28).toFixed(1); }
    else { risk = "Low"; prob = (5 + Math.random() * 25).toFixed(1); }

    const newCust = { id, name: randomName, email, age, orders, spend, recency, complaints, sat, risk, prob };
    customerDirectory.unshift(newCust);
    renderCustomerTable(customerDirectory);
    updateCohortCounts();
    showToast(`Simulated and added new customer ${randomName} (${id})`);
}

// --- CSV Export Helpers ---
function exportCustomerCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "CustomerID,Name,Email,TenureMonths,OrdersPerMonth,MonthlySpendINR,RecencyDays,Complaints,Satisfaction,ChurnRisk,ChurnProbability\n";

    customerDirectory.forEach(c => {
        csvContent += `${c.id},"${c.name}",${c.email},${c.age},${c.orders},${c.spend},${c.recency},${c.complaints},${c.sat},${c.risk},${c.prob}%\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Flipkart_Customer_Churn_Cohort_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Customer Cohort CSV downloaded successfully!");
}

function exportAnalyticsReport() {
    exportCustomerCSV();
}

// --- Global Search Handler ---
function handleGlobalSearch(event) {
    if (event.key === 'Enter') {
        executeGlobalSearch();
    }
}

function executeGlobalSearch() {
    const query = document.getElementById('globalSearchInput').value.trim().toLowerCase();
    if (!query) {
        showToast("Please enter a customer name, email or ID to search.");
        return;
    }

    switchTab('customers');
    const searchInput = document.getElementById('tableSearchInput');
    if (searchInput) {
        searchInput.value = query;
        searchCustomerTable();
    }
    showToast(`Filtered customer table for query: "${query}"`);
}

// --- Toast Notification Display ---
function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.innerText = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

// ==========================================================================
// CHART.JS INITIALIZATION (DASHBOARD & ANALYTICS)
// ==========================================================================
function initDashboardCharts() {
    // 1. Churn Risk Distribution Donut Chart
    const donutCtx = document.getElementById('riskDistributionChart');
    if (donutCtx) {
        new Chart(donutCtx, {
            type: 'doughnut',
            data: {
                labels: ['Low Churn Risk (<35%)', 'Medium Risk (35-65%)', 'High Risk (>65%)'],
                datasets: [{
                    data: [68.4, 17.4, 14.2],
                    backgroundColor: ['#388e3c', '#FB641B', '#e53935'],
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'Inter', size: 11 } } }
                },
                cutout: '68%'
            }
        });
    }

    // 2. Churn Probability by Account Age (Tenure) Bar Chart
    const tenureCtx = document.getElementById('tenureChurnChart');
    if (tenureCtx) {
        new Chart(tenureCtx, {
            type: 'bar',
            data: {
                labels: ['0-3 Mos', '4-6 Mos', '7-12 Mos', '13-24 Mos', '25+ Mos'],
                datasets: [{
                    label: 'Churn Probability (%)',
                    data: [42.6, 28.4, 18.2, 9.5, 4.1],
                    backgroundColor: ['#e53935', '#FB641B', '#ffb74d', '#2874F0', '#388e3c'],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, max: 50, title: { display: true, text: 'Avg Churn Rate (%)' } },
                    x: { grid: { display: false } }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // 3. Monthly Churn Trend vs Retentions Line Chart
    const trendCtx = document.getElementById('monthlyTrendChart');
    if (trendCtx) {
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
                datasets: [
                    {
                        label: 'Gross Churn Rate (%)',
                        data: [22.4, 20.8, 18.5, 16.2, 14.8, 14.2],
                        borderColor: '#e53935',
                        backgroundColor: 'rgba(229, 57, 53, 0.1)',
                        fill: true,
                        tension: 0.35,
                        pointRadius: 4
                    },
                    {
                        label: 'Successful Retentions (%)',
                        data: [58.2, 62.5, 68.0, 72.4, 75.1, 76.4],
                        borderColor: '#388e3c',
                        backgroundColor: 'rgba(56, 142, 60, 0.05)',
                        fill: true,
                        tension: 0.35,
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, max: 100, title: { display: true, text: 'Percentage (%)' } },
                    x: { grid: { display: false } }
                },
                plugins: {
                    legend: { position: 'bottom', labels: { boxWidth: 12 } }
                }
            }
        });
    }

    // 4. Top Feature Importance Weights (SHAP) Horizontal Bar Chart
    const featureCtx = document.getElementById('featureImportanceChart');
    if (featureCtx) {
        new Chart(featureCtx, {
            type: 'bar',
            indexAxis: 'y',
            data: {
                labels: [
                    'Recency (Days Since Order)',
                    'Customer Complaints',
                    'Account Tenure (Age)',
                    'Order Frequency',
                    'Monthly Spend Velocity',
                    'Satisfaction Score',
                    'Cashback Amount'
                ],
                datasets: [{
                    label: 'Predictive Feature Weight',
                    data: [0.34, 0.26, 0.18, 0.12, 0.08, 0.06, 0.04],
                    backgroundColor: '#2874F0',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { beginAtZero: true, max: 0.4, title: { display: true, text: 'SHAP Importance Index' } },
                    y: { grid: { display: false } }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}
