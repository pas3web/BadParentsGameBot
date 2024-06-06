let balance = 0;

document.addEventListener('DOMContentLoaded', (event) => {
    const gameContainer = document.getElementById('game-container');
    const mainMenu = document.createElement('div');
    mainMenu.id = 'main-menu';
    mainMenu.classList.add('active');

    const title = document.createElement('h1');
    title.textContent = 'BadParentsApp';

    const balanceText = document.createElement('p');
    balanceText.id = 'balance-text';
    balanceText.textContent = `Balance = ${balance} $BP`;

    const playButton = document.createElement('button');
    playButton.textContent = 'Play Catcher Game';
    playButton.addEventListener('click', () => {
        mainMenu.classList.remove('active');
        gameContainer.classList.add('active');
        startGame();
    });

    mainMenu.appendChild(title);
    mainMenu.appendChild(balanceText);
    mainMenu.appendChild(playButton);
    gameContainer.appendChild(mainMenu);
});

function updateBalance(points) {
    balance += points;
    const balanceText = document.getElementById('balance-text');
    balanceText.textContent = `Balance = ${balance} $BP`;
}

function showMainMenu() {
    const gameContainer = document.getElementById('game-container');
    const mainMenu = document.getElementById('main-menu');
    mainMenu.classList.add('active');
    gameContainer.classList.remove('active');
}
