import { Engine, Camera, Scene } from "drake-engine";
import _default from "drake-engine";
import Player from "./tempest/player";
import Level from "./tempest/level";
import Bullet from "./tempest/bullet";
import Flipper from "./tempest/flipper";
import Spiker from "./tempest/spiker";
import Tanker from "./tempest/tanker";
import SpikerTrace from "./tempest/spikerTrace";
import EnemyBullet from "./tempest/enemyBullet";

const canvas = document.getElementById("game") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

export class MyGame extends Engine {
  // Objects
  player: Player;
  level: Level;
  bullets: Bullet[] = [];
  flippers: Flipper[] = [];
  spikers: Spiker[] = [];
  tankers: Tanker[] = [];
  spikerTraces: SpikerTrace[] = [];
  enemyBullets: EnemyBullet[] = [];

  // Scene
  mainScene: Scene = new Scene();

  // Level
  currentLevel: number = 1;
  currentLevelSide: number = 0.5;

  //keyboroard events
  keysPressed = new Set();

  // Enemys data
  flipperLastSpawn: number = 0;

  movementSpeed: number = 1;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

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

    this.mainScene.addGameObject(this.player);
    this.mainScene.addGameObject(this.level);
    this.mainScene._started = true;
    this.addEventListeners();
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
      Spiker.createSpiker(this);
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
      Flipper.createFlipper(this, { x: 0, y: 0, z: 0 });
    }
  }

  movePlayer(speed: number) {
    let isEdge = false;
    if (!this.level.lopped) {
      if (this.currentLevelSide + speed > this.level.numberOfSides) {
        console.log("kraniec");
        isEdge = true;
      }
      if (this.currentLevelSide + speed < 0) {
        console.log("kraniec");
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
    this.currentScene!.removeGameObject(this.level.id);
    this.level = new Level(this.currentLevel, { position: [0, 0, 0], size: [1, 1, 1] }, this);
    this.mainScene.addGameObject(this.level);
  }

  override Update(): void {
    const currentTime = Date.now();
    if (currentTime - this.flipperLastSpawn > 1000) {
      this.flipperLastSpawn = currentTime;
    }
  }

  shoot() {
    // to też by trzeb przenieść
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
      }
      this.tankers = [];
      for (const spiker of this.spikers) {
        this.currentScene.removeGameObject(spiker.id);
      }
      this.spikers = [];
      for (const flipper of this.flippers) {
        this.currentScene.removeGameObject(flipper.id);
      }
      this.flippers = [];
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
