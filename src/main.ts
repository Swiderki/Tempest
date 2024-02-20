import { Engine, Camera, Scene } from "drake-engine";
import _default from "drake-engine";
import Player from "./tempest/player";
import Level from "./tempest/level";
import Bullet from "./tempest/bullet";
import Flipper from "./tempest/flipper";


const canvas = document.getElementById("game") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

export class MyGame extends Engine {
  // Objects
  player: Player;
  level: Level;
  bullets: Bullet[] = [];
  flippers: Flipper[] = [];

  // Scene
  mainScene: Scene = new Scene();

  // Level
  currentLevel: number = 1;
  currentLevelSide: number = 0.5;

  //keyboroard events
  keysPressed = new Set();

  // Enemys data
  flipperLastSpawn: number = 0;


  movementSpeed: number = 0.1;
  numberOfSides: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.player = new Player({ position: [0, 0, 0], size: [1, 1, 1] });
    // level object must be at position [0,0,0]
    this.level = new Level(this.currentLevel, { position: [0, 0, 0], size: [1, 1, 1] });
  }
  countSides() {
    this.numberOfSides = this.level.vertecies.length / 2;
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
      // countSides ma się wykonywac po wczytaniu levelu, a nie tutaj - usunąć i dać do level.ts
      this.countSides();
      this.currentLevelSide = this.currentLevelSide + this.movementSpeed;
      this.currentLevelSide = this.currentLevelSide % this.numberOfSides;
      this.currentLevelSide = Math.floor(this.currentLevelSide * 20) / 20;
      this.setPlayerPosition();
    }
    if (this.keysPressed.has("d")) {
      // countSides ma się wykonywac po wczytaniu levelu, a nie tutaj - usunąć i dać do level.ts
      this.countSides();
      this.currentLevelSide = this.currentLevelSide - this.movementSpeed;
      this.currentLevelSide = Math.floor(this.currentLevelSide * 20) / 20;
      if (this.currentLevelSide < 0) {
        this.currentLevelSide += this.numberOfSides;
      }

      this.setPlayerPosition();
    }
    if (this.keysPressed.has("k")) {
      this.shoot();
      Flipper.initialize(this);

    }
    // zmiana levelów do testów
    if (this.keysPressed.has("q")) {
      this.currentLevel--;
      this.currentScene!.removeGameObject(this.level.id);
      this.level = new Level(this.currentLevel, { position: [0, 0, 0], size: [1, 1, 1] });
      this.mainScene.addGameObject(this.level);
      this.setPlayerPosition();

    }
    if (this.keysPressed.has("e")) {
      this.currentLevel++;
      this.currentScene!.removeGameObject(this.level.id);
      this.level = new Level(this.currentLevel, { position: [0, 0, 0], size: [1, 1, 1] });
      this.mainScene.addGameObject(this.level);
      this.setPlayerPosition();
    }
  }
  override Start(): void {
    this.setResolution(1280, 720);
    const camera = new Camera(60, 0.1, 1000, [0, 0, -25], [0, 0, 1]);

    this.mainScene.setMainCamera(camera, this.width, this.height);
    const mainSceneId = this.addScene(this.mainScene);
    this.setCurrentScene(mainSceneId);

    this.mainScene.addGameObject(this.player);
    this.mainScene.addGameObject(this.level);
    this.mainScene.started = true;
    this.addEventListeners();
  }
  override Update(): void {
    const currentTime = Date.now();
    if(currentTime - this.flipperLastSpawn > 1000){
      this.flipperLastSpawn = currentTime;
    }

  }

  setPlayerPosition() {
    // trzeba przenieść do klasy player żeby tu było czyściej
    console.log(this.currentLevelSide);

    console.log(this.player.vertecies);
    const levelShift = Math.floor((this.currentLevelSide % 1) * 10) / 10;
    console.log(levelShift);

    this.player.vertecies[0].x = this.level.vertecies[Math.floor(this.currentLevelSide)].x * 1.2 * (1 - levelShift) + this.level.vertecies[(Math.floor(this.currentLevelSide) + 1) % this.numberOfSides].x * 1.2 * levelShift;
    this.player.vertecies[0].y = this.level.vertecies[Math.floor(this.currentLevelSide)].y * 1.2 * (1 - levelShift) + this.level.vertecies[(Math.floor(this.currentLevelSide) + 1) % this.numberOfSides].y * 1.2 * levelShift;
    this.player.vertecies[0].z = 0;
    this.player.vertecies[1].x = this.level.vertecies[Math.floor(this.currentLevelSide)].x * 1.1 * (1 - levelShift) + this.level.vertecies[(Math.floor(this.currentLevelSide) + 1) % this.numberOfSides].x * 1.1 * levelShift;
    this.player.vertecies[1].y = this.level.vertecies[Math.floor(this.currentLevelSide)].y * 1.1 * (1 - levelShift) + this.level.vertecies[(Math.floor(this.currentLevelSide) + 1) % this.numberOfSides].y * 1.1 * levelShift;
    this.player.vertecies[1].z = 0;
    this.player.vertecies[2] = this.level.vertecies[Math.floor(this.currentLevelSide)];
    this.player.vertecies[2].z = 0;
    this.player.vertecies[3] = this.level.vertecies[(Math.floor(this.currentLevelSide) + 1) % this.numberOfSides] ;
    this.player.vertecies[3].z = 0;
    this.player.vertecies[4].x = (this.level.vertecies[Math.floor(this.currentLevelSide)].x * 0.7 + this.level.vertecies[(Math.floor(this.currentLevelSide) + 1) % this.numberOfSides].x * 0.3) * 0.9;
    this.player.vertecies[4].y = (this.level.vertecies[Math.floor(this.currentLevelSide)].y * 0.7 + this.level.vertecies[(Math.floor(this.currentLevelSide) + 1) % this.numberOfSides].y * 0.3) * 0.9;
    this.player.vertecies[4].z = 0;
    this.player.vertecies[5].x = (this.level.vertecies[Math.floor(this.currentLevelSide)].x * 0.3 + this.level.vertecies[(Math.floor(this.currentLevelSide) + 1) % this.numberOfSides].x * 0.7) * 0.9;
    this.player.vertecies[5].y = (this.level.vertecies[Math.floor(this.currentLevelSide)].y * 0.3 + this.level.vertecies[(Math.floor(this.currentLevelSide) + 1) % this.numberOfSides].y * 0.7) * 0.9;
    this.player.vertecies[5].z = 0;
    console.log(this.level.vertecies);
  }

  shoot() {
    // to też by trzeb przenieść
    const bullet = new Bullet({ position: [(this.player.vertecies[4].x + this.player.vertecies[5].x) / 2, (this.player.vertecies[4].y + this.player.vertecies[5].y) / 2, 0], size: [1, 1, 1] }, this);
    this.bullets.push(bullet);
    this.currentScene.addGameObject(bullet);
    console.log(bullet);
  }
}

const game = new MyGame(canvas);
game.run();
