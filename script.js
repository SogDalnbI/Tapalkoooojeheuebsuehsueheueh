let balance = localStorage.getItem('balance') ? parseInt(localStorage.getItem('balance')) : 0;
let clickValue = localStorage.getItem('clickValue') ? parseInt(localStorage.getItem('clickValue')) : 1;
let upgradeCost = localStorage.getItem('upgradeCost') ? parseInt(localStorage.getItem('upgradeCost')) : 50;
let energy = localStorage.getItem('energy') ? parseFloat(localStorage.getItem('energy')) : 1500;
let lastVisit = localStorage.getItem('lastVisit') ? parseInt(localStorage.getItem('lastVisit')) : Date.now();

const circle = document.getElementById('circle');
const balanceAmount = document.getElementById('balance-amount');
const energyBar = document.getElementById('energy');
const upgradeBtn = document.getElementById('upgrade-btn');

// Восстановление энергии за время отсутствия
const now = Date.now();
const timeElapsed = Math.floor((now - lastVisit) / 1000);
energy = Math.min(1500, energy + 0.5 * timeElapsed);
localStorage.setItem('energy', energy);
localStorage.setItem('lastVisit', now);

window.onload = function() {
    updateCircleImage();
    balanceAmount.innerText = balance;
    updateEnergyBar();
    upgradeBtn.innerText = `Upgrade Click (Cost: ${upgradeCost})`;
};

circle.addEventListener('touchstart', (event) => {
    event.preventDefault();
    if (energy > 0) {
        for (let i = 0; i < event.touches.length; i++) {
            increaseBalance(event.touches[i].clientX, event.touches[i].clientY);
        }
    }
});

upgradeBtn.addEventListener('click', () => {
    if (balance >= upgradeCost) {
        balance -= upgradeCost;
        clickValue += 1;
        const multiplier = Math.random() * (2.0 - 1.6) + 1.6; // Рандомный множитель от 1.6 до 2.0
        upgradeCost = Math.floor(upgradeCost * multiplier);
        upgradeBtn.innerText = `Upgrade Click (Cost: ${upgradeCost})`;
        localStorage.setItem('balance', balance);
        localStorage.setItem('clickValue', clickValue);
        localStorage.setItem('upgradeCost', upgradeCost);
        balanceAmount.innerText = balance;
    }
});

function increaseBalance(x, y) {
    balance += clickValue;
    balanceAmount.innerText = balance;
    localStorage.setItem('balance', balance);

    energy -= 1;
    updateEnergyBar();
    
    showPlusOne(x, y);
    updateCircleImage();
}

function showPlusOne(x, y) {
    const plusOne = document.createElement('div');
    plusOne.id = 'plus-one';
    plusOne.style.left = `${x}px`;
    plusOne.style.top = `${y}px`;
    plusOne.innerText = `+${clickValue}`;
    document.body.appendChild(plusOne);
    
    plusOne.addEventListener('animationend', () => {
        plusOne.remove();
    });
}

function updateCircleImage() {
    if (balance >= 3000) {
        circle.style.backgroundImage = "url('am2.png')";
    } else if (balance >= 500) {
        circle.style.backgroundImage = "url('am1.png')";
    } else {
        circle.style.backgroundImage = "url('am.png')";
    }
}

function updateEnergyBar() {
    const energyPercentage = (energy / 1500) * 100;
    energyBar.style.width = `${energyPercentage}%`;
    if (energy === 0) {
        energyBar.style.backgroundColor = 'gray';
    } else {
        energyBar.style.backgroundColor = 'yellow';
    }
}

function showEnergyIncrease() {
    const x = energyBar.offsetLeft + energyBar.offsetWidth;
    const y = energyBar.offsetTop - 20; // Отображаем чуть выше энергии

    const plusEnergy = document.createElement('div');
    plusEnergy.id = 'plus-one';
    plusEnergy.style.left = `${x}px`;
    plusEnergy.style.top = `${y}px`;
    plusEnergy.innerText = '+0.5';
    document.body.appendChild(plusEnergy);

    plusEnergy.addEventListener('animationend', () => {
        plusEnergy.remove();
    });
}

setInterval(() => {
    if (energy < 1500) {
        energy += 0.5;
        if (energy > 1500) {
            energy = 1500;
        }
        updateEnergyBar();
        showEnergyIncrease();
        localStorage.setItem('energy', energy);
    }
    localStorage.setItem('lastVisit', Date.now());
}, 1000);