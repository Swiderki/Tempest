import { Engine, Camera, Scene, GUI, GUIText, Icon } from "drake-engine";
import _default from "drake-engine";
import Player from "./tempest/player";
import Level from "./tempest/level";
import Bullet from "./tempest/bullet";
import Flipper from "./tempest/flipper";
import Spiker from "./tempest/spiker";
import Tanker from "./tempest/tanker";
import SpikerTrace from "./tempest/spikerTrace";
import EnemyBullet from "./tempest/enemyBullet";
import Fuseball from "./tempest/fuseball";
import Particle from "./tempest/particle";

const canvas = document.getElementById("game") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");
const blasterBullet = new Audio("sounds/blasterBullet.mp3");

export const debugMode: boolean = true;

export class MyGame extends Engine {
  //GUI
  gui: GUI;
  scoreText: GUIText;
  bestScoreText: GUIText;
  levelText: GUIText;
  icons: Icon[] = [];
  iconsID: number[] = [];
  // Objects
  player: Player;
  level: Level;
  bullets: Bullet[] = [];
  flippers: Flipper[] = [];
  spikers: Spiker[] = [];
  tankers: Tanker[] = [];
  fuseballs: Fuseball[] = [];
  spikerTraces: SpikerTrace[] = [];
  enemyBullets: EnemyBullet[] = [];
  particles: Particle[] = [];
  // Scene
  mainScene: Scene = new Scene();

  // Level
  currentLevel: number = 1;
  currentLevelSide: number = 0.5;
  playerLevelNumber: number = 0;
  enemiesInGame: number = 3;
  normallySpawned: number = 0;
  maxNormallySpawned: number = 3;

  //Lifes
  lifes: number = 3;
  nextLife: number = 10000;
  lastSpawned: number = Date.now();
  spawnDelta: number = 5000;


  //keyboroard events
  keysPressed = new Set();

  // Enemys data
  flipperLastSpawn: number = 0;
  isInHyperspace = false
  movementSpeed: number = 1;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.scoreText = new GUIText("0", 50, "Arial", "green", 100);
    this.bestScoreText = new GUIText("0", 30, "Arial", "green", 200);
    this.levelText = new GUIText("1", 25, "Arial", "blue", 300);
    this.icons = [new Icon("m 10 0 l 10 4 l -4 6 l 2 -5 l -8 -1 l -8 1 l 2 5 l -4 -6 z", 1500, 1500, { x: 200, y: 60 }, "yellow"), new Icon("m 10 0 l 10 4 l -4 6 l 2 -5 l -8 -1 l -8 1 l 2 5 l -4 -6 z", 1500, 1500, { x: 230, y: 60 }, "yellow"), new Icon("m 10 0 l 10 4 l -4 6 l 2 -5 l -8 -1 l -8 1 l 2 5 l -4 -6 z", 1500, 1500, { x: 260, y: 60 }, "yellow")];

    this.gui = new GUI(this.getCanvas, this.getCanvas.getContext("2d")!);

    this.player = new Player({ position: [0, 0, 0], size: [1, 1, 1] }, this);
    // level object must be at position [0,0,0]
    this.level = new Level(this.currentLevel, { position: [0, 0, 0], size: [1, 1, 1] }, this);
  }

  override Start(): void {
    this.setResolution(1280, 720);
    const camera = new Camera(60, 0.1, 1000, [0, 0, -25], [0, 0, 1]);

    this.mainScene.setMainCamera(camera, this.width, this.height);
    const mainSceneId = this.addScene(this.mainScene);
    this.setCurrentScene(mainSceneId);
    this.initializeGUI();

    this.mainScene.addGameObject(this.player);
    this.mainScene.addGameObject(this.level);
    this.mainScene._started = true;
    this.addEventListeners();
  }

  initializeGUI() {
    // Assuming GUI and GUIText are similar to the Asteroids game
    const x = this.mainScene.addGUI(this.gui);
    this.gui.addElement(this.scoreText);
    this.gui.addElement(this.bestScoreText);
    this.gui.addElement(this.levelText);
    this.levelText.position = { x: this.getCanvas.width / 2 - this.levelText.width / 2, y: 40 };

    this.bestScoreText.position = { x: this.getCanvas.width / 2 - this.bestScoreText.width / 2, y: 10 };

    this.scoreText.position = { x: 200, y: 10 };
    this.iconsID[0] = this.gui.addElement(this.icons[0]);
    this.iconsID[1] = this.gui.addElement(this.icons[1]);
    this.iconsID[2] = this.gui.addElement(this.icons[2]);

    this.currentScene.setCurrentGUI(x);
    // Add more GUI elements as needed
  }

  updateScore(newScore: number) {
    this.scoreText.text = `${Number(this.scoreText.text) + newScore}`;
    this.addLife();
    // Update the GUI element to display the new score
  }

  updateBestScore(newScore: number) {
    this.bestScoreText.text = `${Number(this.bestScoreText.text) + newScore}`;
    this.bestScoreText.position = { x: this.getCanvas.width / 2 - this.bestScoreText.width / 2, y: 10 };

    // Update the GUI element to display the new best score
  }

  updateLevel(newLevel: number) {
    this.levelText.text = `${newLevel}`;
    // Update the GUI element to display the new level
  }

  deleteLife() {
    return;
    const id = this.iconsID.pop();
    this.gui.removeElement(id!);
    this.icons.pop();
    this.lifes--;
  }

  addLife() {
    if (this.lifes < 3 && this.nextLife < Number(this.scoreText.text)) {
      console.log("dodano życie");
      this.icons.push(new Icon("m 10 0 l 10 4 l -4 6 l 2 -5 l -8 -1 l -8 1 l 2 5 l -4 -6 z", 1500, 1500, { x: 200 + this.icons.length * 30, y: 60 }, "yellow"));
      this.iconsID.push(this.gui.addElement(this.icons[this.icons.length - 1]));
      this.lifes++;
      this.nextLife += 10000;
    }
  }

  addEventListeners() {
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
    document.addEventListener("keyup", (e) => this.handleKeyUp(e));
  }

  handleKeyDown(e: KeyboardEvent) {
    this.keysPressed.add(e.key);
    this.handleKeyboardEvents();
  }

  handleKeyUp(e: KeyboardEvent) {
    this.keysPressed.delete(e.key);
    this.handleKeyboardEvents();
  }

  handleKeyboardEvents() {
    if (!this.mainCamera) return;
    if (this.keysPressed.has("a")) {
      this.movePlayer(this.movementSpeed);
    }
    if (this.keysPressed.has("d")) {
      this.movePlayer(this.movementSpeed * -1);
    }
    if (this.keysPressed.has("w")) {
      // Spiker.createSpiker(this);
      Fuseball.createFuseball(this);
    }
    if (this.keysPressed.has("k")) {
      this.shoot();
      // Tanker.createTanker(this);
    }
    if (this.keysPressed.has("l")) {
      this.superZapper();
    }
    // zmiana levelów do testów
    if (this.keysPressed.has("q")) {
      this.previousLevel();
    }
    if (this.keysPressed.has("e")) {
      this.nextLevel();
    }
    if (this.keysPressed.has("r")) {
      Flipper.createFlipper(this, { x: 0, y: 0, z: 0 }, -1);
    }
  }

  movePlayer(speed: number) {
    let isEdge = false;
    if (!this.level.lopped) {
      if (this.currentLevelSide + speed > this.level.numberOfSides) {
        isEdge = true;
      }
      if (this.currentLevelSide + speed < 0) {
        isEdge = true;
      }
    }
    if (!isEdge) {
      this.currentLevelSide = this.currentLevelSide + speed;
      this.currentLevelSide = Math.floor(this.currentLevelSide * 20) / 20;
      if (this.currentLevelSide < 0) {
        this.currentLevelSide += this.level.numberOfSides;
      }

      this.currentLevelSide = this.currentLevelSide % this.level.numberOfSides;

      this.player.setPlayerPosition();
    }
  }

  // to też można
  previousLevel() {
    this.currentLevel--;
    this.currentScene!.removeGameObject(this.level.id);
    this.level = new Level(this.currentLevel, { position: [0, 0, 0], size: [1, 1, 1] }, this);
    this.mainScene.addGameObject(this.level);
  }

  nextLevel() {
    this.currentLevel++;
    this.spikerTraces.forEach((trace) => {
      this.currentScene.removeGameObject(trace.id)
    })
    this.spikerTraces = []

    this.currentScene!.removeGameObject(this.level.id);
    this.level = new Level(this.currentLevel, { position: [0, 0, 0], size: [1, 1, 1] }, this);
    this.mainScene.addGameObject(this.level);
  }

  override Update(): void {
    const currentTime = Date.now();
    if (currentTime - this.flipperLastSpawn > 1000) {
      this.flipperLastSpawn = currentTime;
    }

    if (Date.now() - this.lastSpawned > this.spawnDelta && this.normallySpawned < this.maxNormallySpawned && !this.isInHyperspace) {

      const entityTypes = ["Tanker", "Spiker", "Fuseball", "Flipper"];
      const randomType = entityTypes[Math.floor(Math.random() * entityTypes.length)];

      switch (randomType) {
        case "Tanker":
          Tanker.createTanker(this);
          break;
        case "Spiker":
          Spiker.createSpiker(this);
          break;
        case "Fuseball":
          Fuseball.createFuseball(this);
          break;
        case "Flipper":
          Flipper.createFlipper(this, { x: 0, y: 0, z: 0 }, -1);
          break;
      }

      this.lastSpawned = Date.now();
      this.normallySpawned++;
    }
    if (this.player.position.z >= 80) {
      this.isInHyperspace = false

      this.player.setPosition(0, 0, 0)
      this.player.setPlayerPosition()
      this.mainCamera?.move(0, 0, -this.mainCamera.position.z - 25)
      this.nextLevel();

      this.playerLevelNumber++;
      this.enemiesInGame = 3 + this.playerLevelNumber;
      this.maxNormallySpawned = 3 + this.playerLevelNumber;
      this.normallySpawned = 0;
      if (this.spawnDelta - 300 > 600) this.spawnDelta -= 300;
      this.lastSpawned = Date.now();
      this.levelText.text = String(Number(this.levelText.text) + 1)
    }
    if (this.enemiesInGame == 0) {
      console.log("next level");
      this.isInHyperspace = true

    }

    if (this.isInHyperspace) {
      this.hyperSpace(this.deltaTime)
    }
  }

  hyperSpace(delta: number) {
    this.player.move(0, 0, 10 * delta)
    this.mainCamera?.move(0, 0, 10 * delta)
  }

  shoot() {
    // to też by trzeb przenieść
    blasterBullet.volume = 0.1;
    blasterBullet.play();
    const bullet = new Bullet({ position: [(this.player.vertecies[2].x + this.player.vertecies[3].x) / 2, (this.player.vertecies[2].y + this.player.vertecies[3].y) / 2, 0], size: [1, 1, 1] }, this);
    this.bullets.push(bullet);
    this.currentScene.addGameObject(bullet);
  }

  superZapper() {
    this.level.vertecies.forEach((_) => {
      for (let i = 0; i < this.level.getMesh().length; i++) {
        this.level.setLineColor(i, "yellow");
      }
    });
    setTimeout(() => {
      this.level.vertecies.forEach((_) => {
        for (let i = 0; i < this.level.getMesh().length; i++) {
          this.level.setLineColor(i, "blue");
        }
      });
      for (const tanker of this.tankers) {
        this.currentScene.removeGameObject(tanker.id);
        this.updateScore(100);
      }
      this.tankers = [];
      for (const spiker of this.spikers) {
        this.currentScene.removeGameObject(spiker.id);
        this.updateScore(50);
      }
      this.spikers = [];
      for (const flipper of this.flippers) {
        this.currentScene.removeGameObject(flipper.id);
        this.updateScore(150);
      }
      this.flippers = [];
      for (const fuseball of this.fuseballs) {
        this.currentScene.removeGameObject(fuseball.id);
        if (fuseball.position.z > 30) {
          this.updateScore(250);
        } else if (fuseball.position.z > 10) {
          this.updateScore(500);
        } else {
          this.updateScore(750);
        }
      }
      this.fuseballs = [];
      for (const bullet of this.enemyBullets) {
        this.currentScene.removeGameObject(bullet.id);
      }
      this.enemyBullets = [];

      this.level.updateColorOnPlayer();
    }, 200);
  }
}

const game = new MyGame(canvas);
game.run();
