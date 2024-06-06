let balance = loadBalance();
let score = 0;
let timeLeft = 30;
let gameOver = false;
let timer;
let coins;

const config = {
    type: Phaser.AUTO,
    width: '100%',
    height: '100%',
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [MenuScene, GameScene]
};

let game = new Phaser.Game(config);

function preloadMenu() {
    this.load.image('background', 'assets/background.png');
}

function createMenu() {
    this.cameras.main.setBackgroundColor('#000000');

    const title = this.add.text(this.scale.width / 2, 50, 'BadParentsApp', { fontSize: '32px', fill: '#FFFFFF' });
    title.setOrigin(0.5, 0.5);

    const balanceText = this.add.text(this.scale.width / 2, 150, `Balance = ${balance} $BP`, { fontSize: '24px', fill: '#FFFFFF' });
    balanceText.setOrigin(0.5, 0.5);

    const playButton = this.add.text(this.scale.width / 2, 250, 'Play Catcher Game', { fontSize: '24px', fill: '#00FF00', backgroundColor: '#000' });
    playButton.setOrigin(0.5, 0.5);
    playButton.setInteractive();
    playButton.on('pointerdown', () => {
        resetGame(); // Сброс состояния перед началом игры
        this.scene.start('GameScene');
    });

    this.events.on('resume', (scene, data) => {
        if (data) {
            balance = data.balance;
            balanceText.setText(`Balance = ${balance} $BP`);
        }
    });
}

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        preloadMenu.call(this);
    }

    create() {
        createMenu.call(this);
    }
}

function preloadGame() {
    this.load.image('background', 'assets/background.png');
    this.load.image('dog1', 'assets/1.png');
    this.load.image('dog2', 'assets/2.png');
    this.load.image('dog3', 'assets/3.png');
    this.load.image('dog4', 'assets/4.png');
    this.load.image('dog5', 'assets/5.png');
    this.load.image('dog6', 'assets/6.png');
}

function createGame() {
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'background').setDisplaySize(this.scale.width, this.scale.height);

    coins = this.physics.add.group();

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#00ff00' });
    timerText = this.add.text(16, 48, 'Time: 30s', { fontSize: '32px', fill: '#00ff00' });

    this.input.on('pointerdown', function (pointer) {
        let x = pointer.x;
        let y = pointer.y;
        coins.children.iterate(function (child) {
            if (child.getBounds().contains(x, y)) {
                child.disableBody(true, true);
                score += 1;
                scoreText.setText('Score: ' + score);
            }
        });
    });

    timer = this.time.addEvent({
        delay: 1000,
        callback: onEvent,
        callbackScope: this,
        loop: true
    });

    this.time.addEvent({
        delay: 300,
        callback: dropCoin,
        callbackScope: this,
        loop: true
    });

    this.scale.on('resize', resize, this);
    resize.call(this, { width: window.innerWidth, height: window.innerHeight });
}

function updateGame() {
    if (timeLeft <= 0 && !gameOver) {
        this.physics.pause();
        timer.remove(false);
        endGame.call(this);
        gameOver = true;
    }
}

function endGame() {
    let bg = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000, 1.0);
    bg.setOrigin(0.5, 0.5);

    let resultText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, `Woooow!\nYour score - ${score}!\nCOOL!`, {
        fontSize: '32px',
        fill: '#fff',
        align: 'center'
    });
    resultText.setOrigin(0.5);

    let restartButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Restart', {
        fontSize: '32px',
        fill: '#fff',
        align: 'center'
    });
    restartButton.setOrigin(0.5);
    restartButton.setInteractive();

    restartButton.on('pointerdown', () => {
        resetGame();
        this.scene.restart();
    });

    let backButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 100, 'Back', {
        fontSize: '32px',
        fill: '#fff',
        align: 'center'
    });
    backButton.setOrigin(0.5);
    backButton.setInteractive();

    backButton.on('pointerdown', () => {
        balance += score;
        saveBalance(balance);
        resetGame();  // Сброс состояния игры при возврате в главное меню
        this.scene.stop('GameScene');
        this.scene.start('MenuScene', { balance: balance });
    });
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        preloadGame.call(this);
    }

    create() {
        createGame.call(this);
    }

    update() {
        updateGame.call(this);
    }
}

function resetGame() {
    score = 0;
    timeLeft = 30;
    gameOver = false;
    if (timer) {
        timer.remove(false);
    }
}

function resize(gameSize) {
    if (gameSize.width !== this.scale.width || gameSize.height !== this.scale.height) {
        this.scale.resize(gameSize.width, gameSize.height);
        this.cameras.resize(gameSize.width, gameSize.height);
    }
}

function saveBalance(balance) {
    localStorage.setItem('balance', balance);
}

function loadBalance() {
    let savedBalance = localStorage.getItem('balance');
    return savedBalance ? parseInt(savedBalance) : 0;
}

function onEvent() {
    if (timeLeft > 0) {
        timeLeft -= 1;
        timerText.setText('Time: ' + timeLeft + 's');
    } else if (timeLeft === 0) {
        endGame.call(this);
    }
}

function dropCoin() {
    if (timeLeft > 0) {
        let x = Phaser.Math.Between(0, this.scale.width);
        let y = Phaser.Math.Between(-50, -10);  // Начальная позиция немного выше экрана
        let coinImage = Phaser.Math.RND.pick(['dog1', 'dog2', 'dog3', 'dog4', 'dog5', 'dog6']); // Выбор случайного изображения
        let coin = coins.create(x, y, coinImage);
        coin.setScale(0.25);  // Уменьшаем размер монеты в 4 раза
        coin.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        coin.setVelocity(0, 200);  // Убираем горизонтальное движение, оставляем только вертикальное
    }
}
