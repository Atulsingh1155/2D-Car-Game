const config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 700,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let car;
let cursors;
let road;
let obstacles;
let score = 0;
let scoreText;
let gameActive = true;
let pauseText;
let youLostText;
let music;

function preload() {
    this.load.image('car', 'images/pcar11.png');
    this.load.image('road', 'images/road.jpg');
    this.load.image('obstacle', 'images/barrier.png');
    this.load.audio('backgroundMusic', 'audio/background.mp3');
}

function create() {
    road = this.add.tileSprite(190, 350, 550, 700, 'road');
    
    car = this.physics.add.sprite(200, 500, 'car');
    car.setCollideWorldBounds(true);
    car.setScale(0.5);

    cursors = this.input.keyboard.createCursorKeys();

    obstacles = this.physics.add.group();

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    pauseText = this.add.text(200, 300, 'PAUSED', { fontSize: '32px', fill: '#fff' });
    pauseText.setOrigin(0.5);
    pauseText.visible = false;

    this.physics.add.collider(car, obstacles, gameOver, null, this);

    this.time.addEvent({
        delay: 2000,
        callback: addObstacle,
        callbackScope: this,
        loop: true
    });

    this.input.keyboard.on('keydown-P', togglePause, this);

    // Play background music
    music = this.sound.add('backgroundMusic'); // Create audio object
    music.setLoop(true); // Loop the audio
    music.play(); // Play the audio
}

function update() {
    if (!gameActive) return;

    road.tilePositionY -= 5;

    if (cursors.left.isDown) {
        car.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        car.setVelocityX(160);
    } else {
        car.setVelocityX(0);
    }

    score += 1;
    scoreText.setText('Score: ' + score);

    obstacles.children.entries.forEach((obstacle) => {
        if (obstacle.y > 600) {
            obstacle.destroy();
        }
    });
}

function addObstacle() {
    if (!gameActive) return;

    const x = Phaser.Math.Between(50, 350);
    const obstacle = obstacles.create(x, 0, 'obstacle');
    obstacle.setScale(0.5);
    obstacle.setVelocityY(200);
}

function gameOver() {
    if (!gameActive) return; // Prevent multiple calls

    gameActive = false;
    this.physics.pause();
    car.setTint(0xff0000);

    youLostText = this.add.text(200, 300, 'TRY AGAIN BRO💀', { 
        fontSize: '40px', 
        fill: '#ff0000',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
    });
    youLostText.setOrigin(0.5);

    // Stop the music on game over
    music.stop();
    console.log('Game Over called, You Lost text should be visible');
}

function togglePause() {
    if (gameActive) {
        if (this.physics.world.isPaused) {
            this.physics.resume();
            pauseText.visible = false;
            music.resume(); // Resume music
        } else {
            this.physics.pause();
            pauseText.visible = true;
            music.pause(); // Pause music
        }
    }
}
