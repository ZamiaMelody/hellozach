const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = 100;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.size = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#0ea5e9' : '#d946ef';
        this.alpha = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Connect particles
    for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - distance / 1500})`;
                ctx.lineWidth = 1;
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

initParticles();
animate();

// Navigation Logic
const menuSection = document.getElementById('menu-section');
const sections = document.querySelectorAll('section');
const menuBtns = document.querySelectorAll('.menu-btn');
const backBtns = document.querySelectorAll('.back-btn');

function showSection(sectionId) {
    sections.forEach(sec => {
        sec.classList.remove('active-section');
        sec.classList.add('hidden-section');
    });
    const target = document.getElementById(sectionId);
    target.classList.remove('hidden-section');
    target.classList.add('active-section');
}

menuBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        showSection(targetId);
        if (targetId === 'date-section') updateDate();
    });
});

backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        showSection('menu-section');
    });
});

// Fun Button Interaction
const btn = document.getElementById('fun-btn');
btn.addEventListener('click', () => {
    // Burst effect
    for (let i = 0; i < 20; i++) {
        const p = new Particle();
        p.x = width / 2;
        p.y = height / 2;
        p.vx = (Math.random() - 0.5) * 15;
        p.vy = (Math.random() - 0.5) * 15;
        p.size = Math.random() * 4 + 2;
        particles.push(p);
    }

    // Change button text temporarily
    const originalText = btn.innerText;
    const funTexts = ["Woohoo!", "Awesome!", "Let's Go!", "Zach Rocks!"];
    btn.innerText = funTexts[Math.floor(Math.random() * funTexts.length)];

    setTimeout(() => {
        btn.innerText = originalText;
    }, 1000);
});

// Calculator Logic
const calcDisplay = document.getElementById('calc-display');
const calcBtns = document.querySelectorAll('.calc-btn');
let calcValue = '0';
let previousValue = null;
let operator = null;
let waitingForSecondValue = false;

function updateDisplay() {
    calcDisplay.value = calcValue;
}

function handleNumber(num) {
    if (waitingForSecondValue) {
        calcValue = num;
        waitingForSecondValue = false;
    } else {
        calcValue = calcValue === '0' ? num : calcValue + num;
    }
}

function handleOperator(nextOperator) {
    const value = parseFloat(calcValue);

    if (operator && waitingForSecondValue) {
        operator = nextOperator;
        return;
    }

    if (previousValue === null) {
        previousValue = value;
    } else if (operator) {
        const result = calculate(previousValue, value, operator);
        calcValue = String(result);
        previousValue = result;
    }

    waitingForSecondValue = true;
    operator = nextOperator;
}

function calculate(first, second, op) {
    if (op === '+') return first + second;
    if (op === '-') return first - second;
    if (op === '*') return first * second;
    if (op === '/') return first / second;
    return second;
}

function handleDecimal() {
    if (!calcValue.includes('.')) {
        calcValue += '.';
    }
}

calcBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains('operator')) {
            const action = btn.getAttribute('data-action');
            if (action === 'clear') {
                calcValue = '0';
                previousValue = null;
                operator = null;
                waitingForSecondValue = false;
            } else if (action === 'delete') {
                calcValue = calcValue.length > 1 ? calcValue.slice(0, -1) : '0';
            } else if (action === '=') {
                handleOperator(operator); // Trigger calculation
                operator = null; // Reset operator after equals
                previousValue = null; // Reset previous value
                waitingForSecondValue = true; // Ready for new calculation
            } else {
                handleOperator(action);
            }
        } else {
            const num = btn.getAttribute('data-num');
            if (num === '.') {
                handleDecimal();
            } else {
                handleNumber(num);
            }
        }
        updateDisplay();
    });
});

// Date Logic
function updateDate() {
    const now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

    document.getElementById('date-display').innerText = now.toLocaleDateString('en-US', dateOptions);
    document.getElementById('time-display').innerText = now.toLocaleTimeString('en-US', timeOptions);
}

// Update time every second if date section is active
setInterval(() => {
    if (document.getElementById('date-section').classList.contains('active-section')) {
        updateDate();
    }
}, 1000);

// Mouse interaction
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Slight parallax for particles near mouse
    particles.forEach(p => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
            p.vx += dx * 0.0001;
            p.vy += dy * 0.0001;
        }
    });
});

// Blackjack Logic
const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];
let playerHand = [];
let dealerHand = [];
let gameActive = false;
let playerBalance = 1000;
let currentBet = 0;

const dealerHandEl = document.getElementById('dealer-hand');
const playerHandEl = document.getElementById('player-hand');
const dealerScoreEl = document.getElementById('dealer-score');
const playerScoreEl = document.getElementById('player-score');
const bjMessageEl = document.getElementById('bj-message');

// Controls
const bettingControls = document.getElementById('betting-controls');
const playControls = document.getElementById('play-controls');
const newGameBtn = document.getElementById('bj-new-game');
const hitBtn = document.getElementById('bj-hit');
const standBtn = document.getElementById('bj-stand');
const dealBtn = document.getElementById('btn-deal');
const clearBetBtn = document.getElementById('btn-clear-bet');
const balanceDisplay = document.getElementById('balance-display');
const betDisplay = document.getElementById('bet-display');
const chipBtns = document.querySelectorAll('.chip');

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function getCardValue(card) {
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    if (card.value === 'A') return 11;
    return parseInt(card.value);
}

function calculateScore(hand) {
    let score = 0;
    let aces = 0;

    for (let card of hand) {
        score += getCardValue(card);
        if (card.value === 'A') aces++;
    }

    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
}

function createCardEl(card, hidden = false) {
    const el = document.createElement('div');
    el.className = `card ${['♥', '♦'].includes(card.suit) ? 'red' : ''} ${hidden ? 'hidden' : ''}`;

    if (!hidden) {
        el.innerHTML = `
            <div class="value">${card.value}</div>
            <div class="suit">${card.suit}</div>
            <div class="value bottom">${card.value}</div>
        `;
    }

    return el;
}

function updateUI(showDealer = false) {
    dealerHandEl.innerHTML = '';
    playerHandEl.innerHTML = '';

    dealerHand.forEach((card, index) => {
        dealerHandEl.appendChild(createCardEl(card, index === 0 && !showDealer));
    });

    playerHand.forEach(card => {
        playerHandEl.appendChild(createCardEl(card));
    });

    playerScoreEl.innerText = calculateScore(playerHand);

    if (showDealer) {
        dealerScoreEl.innerText = calculateScore(dealerHand);
    } else {
        dealerScoreEl.innerText = '?';
    }
}

function updateBettingDisplay() {
    balanceDisplay.innerText = `$${playerBalance}`;
    betDisplay.innerText = `$${currentBet}`;
    dealBtn.disabled = currentBet === 0;
}

function handleChipClick(e) {
    if (gameActive) return;
    const value = parseInt(e.target.getAttribute('data-value'));
    if (playerBalance >= value) {
        playerBalance -= value;
        currentBet += value;
        updateBettingDisplay();
    }
}

function clearBet() {
    if (gameActive) return;
    playerBalance += currentBet;
    currentBet = 0;
    updateBettingDisplay();
}

function startRound() {
    if (currentBet === 0) return;

    createDeck();
    shuffleDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    gameActive = true;

    // UI Updates
    bettingControls.classList.add('hidden');
    playControls.classList.remove('hidden');
    newGameBtn.classList.add('hidden');
    bjMessageEl.innerText = "Your turn";

    updateUI();

    // Check for Blackjack immediately
    if (calculateScore(playerHand) === 21) {
        // Check if dealer also has blackjack
        if (calculateScore(dealerHand) === 21) {
            endGame("Push (Both have Blackjack)!", 1); // 1:1 payout (return bet)
        } else {
            endGame("Blackjack! You Win!", 2.6); // 8:5 payout (bet + 1.6*bet)
        }
    }
}

function hit() {
    if (!gameActive) return;
    playerHand.push(deck.pop());
    updateUI();

    if (calculateScore(playerHand) > 21) {
        endGame("Bust! You Lose.", 0);
    }
}

function stand() {
    if (!gameActive) return;

    let dealerScore = calculateScore(dealerHand);
    while (dealerScore < 17) {
        dealerHand.push(deck.pop());
        dealerScore = calculateScore(dealerHand);
    }

    updateUI(true); // Show dealer card

    const playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand); // Update after loop

    if (dealerScore > 21) {
        endGame("Dealer Busts! You Win!", 2);
    } else if (dealerScore > playerScore) {
        endGame("Dealer Wins!", 0);
    } else if (dealerScore < playerScore) {
        endGame("You Win!", 2);
    } else {
        endGame("Push (Tie)!", 1);
    }
}

function endGame(message, payoutMultiplier) {
    gameActive = false;
    bjMessageEl.innerText = message;

    // Calculate Payout
    // payoutMultiplier: 0 = loss, 1 = push (return bet), 2 = win (1:1), 2.6 = blackjack (8:5)
    // Note: We already deducted bet from balance.
    // So if we win 1:1, we get back bet * 2.
    // If we push, we get back bet * 1.
    // If we lose, we get back 0.

    const winnings = Math.floor(currentBet * payoutMultiplier);
    playerBalance += winnings;
    currentBet = 0;

    updateBettingDisplay();

    playControls.classList.add('hidden');
    newGameBtn.classList.remove('hidden');
    updateUI(true);
}

function resetGame() {
    // Reset for new betting round
    playerHand = [];
    dealerHand = [];
    dealerHandEl.innerHTML = '';
    playerHandEl.innerHTML = '';
    dealerScoreEl.innerText = '';
    playerScoreEl.innerText = '';
    bjMessageEl.innerText = "Place your bet";

    bettingControls.classList.remove('hidden');
    newGameBtn.classList.add('hidden');

    updateBettingDisplay();
}

// Event Listeners
chipBtns.forEach(btn => btn.addEventListener('click', handleChipClick));
clearBetBtn.addEventListener('click', clearBet);
dealBtn.addEventListener('click', startRound);
hitBtn.addEventListener('click', hit);
standBtn.addEventListener('click', stand);
newGameBtn.addEventListener('click', resetGame);

// Initial Setup
updateBettingDisplay();

// Claire Roast Logic
const claireBtn = document.getElementById('claire-btn');
const claireInsult = document.getElementById('claire-insult');

const insults = [
    "You're so short you need a ladder to pick up a dime.",
    "Can you hear me? Oh wait, you're deaf.",
    "Nice glasses, can you see the haters yet?",
    "Go touch grass! Oh wait, you don't know what that is.",
    "1v1 me in real life? You'd lag out.",
    "I'd explain it to you, but I don't have any crayons.",
    "You're the reason they put instructions on shampoo bottles.",
    "If you were any shorter, you'd be a pixel.",
    "Your aim is so bad you missed the floor when you fell."
];

claireBtn.addEventListener('click', () => {
    // Fire particles
    for (let i = 0; i < 50; i++) {
        const p = new Particle();
        p.x = width / 2;
        p.y = height / 2;
        p.vx = (Math.random() - 0.5) * 20;
        p.vy = (Math.random() - 0.5) * 20;
        p.size = Math.random() * 5 + 2;
        p.color = Math.random() > 0.5 ? '#ef4444' : '#f97316'; // Red/Orange fire
        particles.push(p);
    }

    // Pick random insult
    const insult = insults[Math.floor(Math.random() * insults.length)];

    // Animate text
    claireInsult.style.transform = "scale(0.5)";
    claireInsult.style.opacity = "0";

    setTimeout(() => {
        claireInsult.innerText = insult;
        claireInsult.style.transform = "scale(1.1)";
        claireInsult.style.opacity = "1";
        setTimeout(() => {
            claireInsult.style.transform = "scale(1)";
        }, 200);
    }, 100);
});
