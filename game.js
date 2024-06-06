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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game;
let coins;
let score = 0;
let scoreText;
let timer;
let timeLeft = 30;
let timerText;
let gameOver = false;
let restartButton;
let backButton;

function startGame() {
    game = new Phaser.Game(config);
}

function preload() {
    this.load.image('background', 'assets/background.png'); // Новый фон
    this.load.image('dog1', 'assets/1.png'); // Изображения собак
    this.load.image('dog2', 'assets/2.png');
    this.load.image('dog3', 'assets/3.png');
    this.load.image('dog4', 'assets/4.png');
    this.load.image('dog5', 'assets/5.png');
    this.load.image('dog6', 'assets/6.png');
}

function create() {
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
        delay: 300,  // Интервал появления новых монет
        callback: dropCoin,
        callbackScope: this,
        loop: true
    });

    this.scale.on('resize', resize, this);
    resize.call(this, { width: window.innerWidth, height: window.innerHeight });
}

function update() {
    if (timeLeft <= 0 && !gameOver) {
        this.physics.pause();
        timer.remove(false);
        endGame.call(this);
        gameOver = true;
    }
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

function endGame() {
    let bg = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000, 1.0);
    bg.setOrigin(0.5, 0.5);

    let resultText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, `Woooow!\nYour score - ${score}!\nCOOL!`, {
        fontSize: '32px',
        fill: '#fff',
        align: 'center'
    });
    resultText.setOrigin(0.5);

    restartButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Restart', {
        fontSize: '32px',
        fill: '#fff',
        align: 'center'
    });
    restartButton.setOrigin(0.5);
    restartButton.setInteractive();
    restartButton.on('pointerdown', function () {
        resetGame();
        this.scene.restart();
    }, this);

    backButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 100, 'Back', {
        fontSize: '32px',
        fill: '#fff',
        align: 'center'
    });
    backButton.setOrigin(0.5);
    backButton.setInteractive();
    backButton.on('pointerdown', function () {
        updateBalance(score);
        game.destroy(true);
        showMainMenu();
    });
}

function resetGame() {
    score = 0;
    timeLeft = 30;
    gameOver = false;
}

function resize(gameSize) {
    if (gameSize.width !== this.scale.width || gameSize.height !== this.scale.height) {
        this.scale.resize(gameSize.width, gameSize.height);
        this.cameras.resize(gameSize.width, gameSize.height);
    }
}
