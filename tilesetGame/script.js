let config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  zoom: 1,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);
let player;
let cursors;
let speed = 100;

function preload() {
  this.load.image("tiles", "assets/tilesets/colored_packed.png");
  this.load.spritesheet("hero", "assets/sprites/monochrome_tilemap_transparent_packed.png", { frameWidth: 16, frameHeight: 16 });
  this.load.tilemapTiledJSON("map", "assets/tilesets/map.json");
  this.load.audio("mainMusic", "assets/sound/SeeingDouble.wav");
  // this.load.audio("deathMusic", "assets/sound/DragAndDreadTheme_Loopable.wav")
}

function create() {
  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers("hero", { frames: [240, 245, 260, 265, 280, 285, 300, 305] }),
    frameRate: 5,
    repeat: -1
  });

  this.anims.create({
    key: "run",
    frames: this.anims.generateFrameNumbers("hero", { frames: [241, 261, 262, 263, 284, 304] }),
    frameRate: 11,
    repeat: -1
  })

  // this.anims.create({
  //   key: "death",
  //   frames: this.anims.generateFrameNumbers("hero", { frames: [246, 266, 286, 306, 326, 346] }),
  //   frameRate: 11,
  //   repeat: 0
  // })

  // this.anims.create({
  //   key: 'enemy',
  //   frames: this.anims.generateFrameNumbers("hero", { start: 340, end: 344 }),
  //   frameRate: 6,
  //   repeat: -1
  // });

  let myMap = this.make.tilemap({ key: "map" });
  let myTileset = myMap.addTilesetImage("colored_packed", "tiles");
  let groundLayer = myMap.createLayer("ground", myTileset, 0, 0);
  let worldLayer = myMap.createLayer("world", myTileset, 0, 0);
  worldLayer.setCollisionByProperty({ collides: true });

  groundLayer.setDepth(1);
  worldLayer.setDepth(2);
  
  let x = Phaser.Math.Between(0, myMap.widthInPixels);
  let y = Phaser.Math.Between(0, myMap.heightInPixels);

  player = this.physics.add.sprite(x, y, "hero");
  player.setCollideWorldBounds(true);
  player.setDepth(3);

  this.physics.add.collider(player, worldLayer);
  
  let myCamera = this.cameras.main;
  myCamera.startFollow(player);
  myCamera.setBounds(0, 0, myMap.widthInPixels, myMap.heightInPixels);
  this.cameras.main.setZoom(1.25);

  cursors = this.input.keyboard.createCursorKeys();

  bgMusic = this.sound.add("mainMusic", { loop: true });
  bgMusic.play();
}


function update() {
  let dx = 0;
  let dy = 0;

  if (cursors.left.isDown) {
    dx = -1;
    player.flipX = true;
  } else if (cursors.right.isDown) {
    dx = 1;
    player.flipX = false;
  }

  if (cursors.up.isDown) {
    dy = -1;
  } else if (cursors.down.isDown) {
    dy = 1;
  }

  let isMoving = (dx !== 0 || dy !== 0);

  if (isMoving) {
    player.anims.play("run", true);
  } else {
    player.anims.play("idle", true);
  }

  player.setVelocity(dx * speed, dy * speed);
}