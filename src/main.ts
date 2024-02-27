import { Engine, Camera, Scene, GUI, GUIText, Icon, Button, PhysicalGameObject, QuaternionUtils } from "drake-engine";
import { StartButton } from "./startButton";
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
import { GUILevelObject } from "./tempest/GUILevelObject";

const canvas = document.getElementById("game") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");
const blasterBullet = new Audio("sounds/blasterBullet.mp3");
const music = new Audio("sounds/tempestTheme.mp3");
music.loop = true;

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
  waitingForNextLevel: boolean = false;

  //Lifes
  lifes: number = 3;
  nextLife: number = 10000;
  lastSpawned: number = Date.now();
  spawnDelta: number = 5000;

  // Enemys data
  flipperLastSpawn: number = 0;
  isInHyperspace = false;
  movementSpeed: number = 1;

  //keyboroard events
  keysPressed = new Set();

  //GUI SCENE
  GUIScene: number | null = null;
  startButton: Button | null = null;
  guiDecorationQuaternion: QuaternionUtils.Quaternion = { x: 0, y: 0, z: 0, w: 1 };
  // Mechanism
  gameStarted: boolean = false;
  gameAlreadyEnded: boolean = false;
  gameEndedText: GUIText | null = null;
  finalScore: GUIText | null = null;

  lifeLost: boolean = false;
  lifeLostType: "flipper" | "bullet" | "spikerTrace" | "fuseball" | null = null;
  unpauseText: GUIText | null = new GUIText("3", 240, "monospace", "white", 500);

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.scoreText = new GUIText("0", 50, "monospace", "green", 100);
    this.bestScoreText = new GUIText("0", 30, "monospace", "green", 200);
    this.levelText = new GUIText("1", 25, "monospace", "blue", 300);
    this.icons = [new Icon("m 10 0 l 10 4 l -4 6 l 2 -5 l -8 -1 l -8 1 l 2 5 l -4 -6 z", 1500, 1500, { x: 200, y: 60 }, "yellow"), new Icon("m 10 0 l 10 4 l -4 6 l 2 -5 l -8 -1 l -8 1 l 2 5 l -4 -6 z", 1500, 1500, { x: 230, y: 60 }, "yellow"), new Icon("m 10 0 l 10 4 l -4 6 l 2 -5 l -8 -1 l -8 1 l 2 5 l -4 -6 z", 1500, 1500, { x: 260, y: 60 }, "yellow")];

    this.gui = new GUI(this.getCanvas, this.getCanvas.getContext("2d")!);

    this.player = new Player({ position: [0, 0, 0], size: [1, 1, 1] }, this);
    // level object must be at position [0,0,0]
    this.level = new Level(this.currentLevel, { position: [0, 0, 0], size: [1, 1, 1] }, this);
  }

  resetGame() {
    this.scoreText.text = "0";

    while (this.iconsID.length > 0) {
      const id = this.iconsID.pop();
      this.gui.removeElement(id!);
      this.icons.pop();
    }

    this.lifes = 3;
    for (let i = 0; i < this.lifes; i++) {
      this.icons.push(new Icon("m 10 0 l 10 4 l -4 6 l 2 -5 l -8 -1 l -8 1 l 2 5 l -4 -6 z", 1500, 1500, { x: 200 + this.icons.length * 30, y: 60 }, "yellow"));
      this.iconsID.push(this.gui.addElement(this.icons[this.icons.length - 1]));
      this.nextLife += 10000;
    }

    this.currentLevel = 1;
    this.currentLevelSide = 0.5;
    this.playerLevelNumber = 0;
    this.enemiesInGame = 3;
    this.normallySpawned = 0;
    this.maxNormallySpawned = 3;
    this.waitingForNextLevel = false;

    this.nextLife = 10000;
    this.lastSpawned = Date.now();
    this.spawnDelta = 5000;

    this.flipperLastSpawn = 0;
    this.isInHyperspace = false;
    this.movementSpeed = 1;

    this.tankers.forEach((el) => this.mainScene.removeGameObject(el.id));
    this.spikers.forEach((el) => this.mainScene.removeGameObject(el.id));
    this.flippers.forEach((el) => this.mainScene.removeGameObject(el.id));
    this.fuseballs.forEach((el) => this.mainScene.removeGameObject(el.id));
    this.spikerTraces.forEach((el) => this.mainScene.removeGameObject(el.id));
    this.bullets.forEach((el) => this.mainScene.removeGameObject(el.id));
    this.enemyBullets.forEach((el) => this.mainScene.removeGameObject(el.id));

    this.tankers = [];
    this.spikers = [];
    this.flippers = [];
    this.fuseballs = [];
    this.spikerTraces = [];
    this.bullets = [];
    this.enemyBullets = [];

    this.currentLevel++;

    this.mainScene.removeGameObject(this.level.id);
    this.level = new Level(1, { position: [0, 0, 0], size: [1, 1, 1] }, this);
    this.mainScene.addGameObject(this.level);

    this.levelText.text = "1";

    this.player.position.x = 0;
    this.player.position.z = 0;
    this.player.position.y = 0;

    this.mainScene.overlaps.forEach((el, key) => {
      this.mainScene.overlaps.delete(key);
    });
  }

  initializeGUIScene(camera: Camera): Scene {
    const GUIScene = new Scene();
    GUIScene.setMainCamera(camera, this.width, this.height);

    const g1 = new GUILevelObject(9);

    GUIScene.addGameObject(g1);

    const GUISceneGUI = new GUI(this.getCanvas, this.getCanvas.getContext("2d")!);
    this.configureStartScreenGUIElements(GUISceneGUI);

    const GUISceneGUIID = GUIScene.addGUI(GUISceneGUI);
    GUIScene.setCurrentGUI(GUISceneGUIID);

    this.GUIScene = this.addScene(GUIScene);
    return GUIScene;
  }

  configureStartScreenGUIElements(GUISceneGUI: GUI): void {
    const t1 = new GUIText("Tempest", 70, "monospace", "#fff", 700);
    const t2 = new GUIText("Made by Świderki", 16, "monospace", "#fff", 700);
    const t3 = new StartButton(this);

    // Positioning logic
    t1.position.x = (this.width - t1.width) / 2;
    t1.position.y = this.height / 2 - 100;
    t2.position.x = (this.width - t1.width) / 2;
    t3.position.x = (this.width - t1.width) / 2;
    t3.position.y = t1.position.y + t1.height + 15 + t2.height + 30;
    t2.position.y = t1.position.y + t1.height + 15;

    // Padding and styling for the start button
    t3.padding.bottom = 30;
    t3.padding.top = 30;
    t3.padding.right = 90;
    t3.padding.left = 90;

    this.startButton = t3;

    // Add elements to GUI
    GUISceneGUI.addElement(t1);
    GUISceneGUI.addElement(t2);
    GUISceneGUI.addElement(t3);
  }

  override Start(): void {
    this.setResolution(1280, 720);
    const camera = new Camera(60, 0.1, 1000, [0, 0, -25], [0, 0, 1]);

    this.mainScene.setMainCamera(camera, this.width, this.height);
    const mainSceneId = this.addScene(this.mainScene);
    this.setCurrentScene(mainSceneId);
    this.initializeGUI();
    this.initializeGUIScene(camera);
    this.setCurrentScene(this.GUIScene!);

    this.mainScene.addGameObject(this.level);
    this.mainScene._started = true;
    this.addEventListeners();
    this.canvas.addEventListener("mousemove", (ev: MouseEvent) => {
      if (!this.startButton!.isCoordInElement(ev.offsetX, ev.offsetY)) {
        this.startButton!.color = "#fff";
        this.startButton!.border.bottom.color = "#fff";
        this.startButton!.border.left.color = "#fff";
        this.startButton!.border.right.color = "#fff";
        this.startButton!.border.top.color = "#fff";
      }
    });
  }

  switchScene() {
    music.play();
    this.setCurrentScene(this.mainScene.id);
    this.mainScene.addGameObject(this.player);
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
    if (!this.gameStarted) return;
    if (this.lifes <= 1) {
      this.runLoose();
      this.gameStarted = false;
      return;
    } else {
      this.lifeLost = true;
    }

    const id = this.iconsID.pop();
    this.gui.removeElement(id!);
    this.icons.pop();
    this.lifes--;

    if (this.lifes <= 0) {
      this.runLoose();
      this.gameStarted = false;
      return;
    }
  }

  runLoose() {
    this.mainScene.removeGameObject(this.player.id);

    const g = this.scenes.get(this.GUIScene!)!.currentGUI!;
    if (!this.gameAlreadyEnded) {
      this.gameEndedText = new GUIText("You lost!", 40, "monospace", "red", 700);
      this.finalScore = new GUIText("Your score was:" + this.scoreText.text, 20, "monospace", "white", 700);
      g.addElement(this.gameEndedText!);
      g.addElement(this.finalScore!);
    }

    this.gameEndedText!.text = "You lost!";
    this.finalScore!.text = "Your score was:" + this.scoreText.text;
    this.gameEndedText!.color = "red";
    this.gameEndedText!.position.y = 20;
    this.gameEndedText!.position.x = this.canvas.width / 2 - this.gameEndedText!.width / 2;
    this.finalScore!.position.y = this.gameEndedText!.position.y + 40;
    this.finalScore!.position.x = this.canvas.width / 2 - this.finalScore!.width / 2;

    this.gameAlreadyEnded = true;

    setTimeout(() => {
      this.setCurrentScene(this.GUIScene!);
      this.resetGame();
    }, 1000);
  }

  runWin() {
    const g = this.scenes.get(this.GUIScene!)!.currentGUI!;
    if (!this.gameAlreadyEnded) {
      this.gameEndedText = new GUIText("You won!", 40, "monospace", "green", 700);
      this.finalScore = new GUIText("Your score was:" + this.scoreText.text, 20, "monospace", "white", 700);
      g.addElement(this.gameEndedText!);
      g.addElement(this.finalScore!);
    }

    this.gameEndedText!.text = "You won!";
    this.finalScore!.text = "Your score was:" + this.scoreText.text;
    this.gameEndedText!.color = "green";
    this.gameEndedText!.position.y = 20;
    this.gameEndedText!.position.x = this.canvas.width / 2 - this.gameEndedText!.width / 2;
    this.finalScore!.position.y = this.gameEndedText!.position.y + 40;
    this.finalScore!.position.x = this.canvas.width / 2 - this.finalScore!.width / 2;

    this.gameAlreadyEnded = true;

    setTimeout(() => {
      this.setCurrentScene(this.GUIScene!);
      this.resetGame();
    }, 1000);
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
      if (!this.gameStarted) return;
      this.movePlayer(this.movementSpeed);
    }

    if (this.keysPressed.has("d")) {
      if (!this.gameStarted) return;
      this.movePlayer(this.movementSpeed * -1);
    }

    if (this.keysPressed.has("k")) {
      if (!this.gameStarted) return;
      this.shoot();
      // Tanker.createTanker(this);
    }

    /* ###### IMPORTANT ###### */
    // Commented code elements were used for manual testing.
    // We decided to leave them in the code to better outline our strategy.

    if (this.keysPressed.has("w")) {
      // Spiker.createSpiker(this);
      Fuseball.createFuseball(this);
    }
    if (this.keysPressed.has("l")) {
      this.superZapper();
    }
    //zmiana levelów do testów
    if (this.keysPressed.has("q")) {
      this.previousLevel();
    }
    if (this.keysPressed.has("e")) {
      this.nextLevel();
    }
    if (this.keysPressed.has("r")) {
      Flipper.createFlipper(this, { x: 0, y: 0, z: 0 }, -1);
    }
    if (this.keysPressed.has("t")) {
      Tanker.createTanker(this);
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
    if (this.currentLevel >= 99) {
      this.runWin();
      return;
    }

    this.currentLevel++;
    this.spikerTraces.forEach((trace) => {
      this.currentScene.removeGameObject(trace.id);
    });
    this.spikerTraces = [];

    this.currentScene!.removeGameObject(this.level.id);
    this.level = new Level(this.currentLevel, { position: [0, 0, 0], size: [1, 1, 1] }, this);
    this.mainScene.addGameObject(this.level);
  }

  enemiesSpawnControll() {
    const currentTime = Date.now();
    if (currentTime - this.flipperLastSpawn > 1000) {
      if (!this.gameStarted) return;
      this.flipperLastSpawn = currentTime;
    }

    if (Date.now() - this.lastSpawned > this.spawnDelta && this.normallySpawned < this.maxNormallySpawned && !this.isInHyperspace) {
      if (!this.gameStarted) return;
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
  }

  override Update(): void {
    console.log(this.enemiesInGame);
    if (this.lifeLost) {
      this.lifeLostFunction();
      return;
    }

    this.enemiesSpawnControll();

    if (this.player.position.z >= 80 && this.enemiesInGame == 0) {
      this.player.setPosition(0, 0, 0);
      this.player.setPlayerPosition();
      this.nextLevel();

      this.playerLevelNumber++;
      this.enemiesInGame = 3 + this.playerLevelNumber;
      this.maxNormallySpawned = 3 + this.playerLevelNumber;
      this.normallySpawned = 0;
      if (this.spawnDelta - 500 >= 1000) this.spawnDelta -= 500;
      this.lastSpawned = Date.now();
      this.levelText.text = String(Number(this.levelText.text) + 1);
    }

    if (this.enemiesInGame == 0 && !this.isInHyperspace) {
      console.log("next level");
      this.isInHyperspace = true;
    }

    if (this.isInHyperspace) {
      this.hyperSpace(this.deltaTime);
    }
  }

  lifeLostFunction() {
    console.log(this.lifeLostType);
    if (this.lifeLostType == "bullet") {
      const z = this.currentScene.currentGUI!.addElement(this.unpauseText!);
      this.unpauseText!.text = "3";
      this.unpauseText!.position = { x: this.width / 2 - this.unpauseText!.width / 2, y: this.height / 2 - this.unpauseText!.height / 2 };
      setTimeout(() => {
        this.unpauseText!.text = "2";
      }, 1000);
      setTimeout(() => {
        this.unpauseText!.text = "1";
      }, 2000);
      setTimeout(() => {
        this.currentScene.currentGUI!.removeElement(z);
        this.lifeLost = false;
      }, 3000);
      this.lifeLostType = null;
    } else if (this.lifeLostType == "fuseball") {
      console.log("ASDDSA");
      const z = this.currentScene.currentGUI!.addElement(this.unpauseText!);
      this.unpauseText!.text = "3";
      this.unpauseText!.position = { x: this.width / 2 - this.unpauseText!.width / 2, y: this.height / 2 - this.unpauseText!.height / 2 };
      setTimeout(() => {
        this.unpauseText!.text = "2";
      }, 1000);
      setTimeout(() => {
        this.unpauseText!.text = "1";
      }, 2000);
      setTimeout(() => {
        this.currentScene.currentGUI!.removeElement(z);
        this.lifeLost = false;
      }, 3000);
      this.lifeLostType = null;
    } else if (this.lifeLostType == "spikerTrace") {
      if (this.currentScene.mainCamera!.position.z > -25) {
        this.player.move(0, 0, -this.player.position.z);
        this.currentScene.mainCamera!.move(0, 0, -30 * this.deltaTime);
        if (this.currentScene.mainCamera!.position.z < -25) {
          this.currentScene.mainCamera!.move(0, 0, -this.currentScene.mainCamera!.position.z - 25);
        }
      } else {
        const z = this.currentScene.currentGUI!.addElement(this.unpauseText!);
        this.unpauseText!.text = "3";
        this.unpauseText!.position = { x: this.width / 2 - this.unpauseText!.width / 2, y: this.height / 2 - this.unpauseText!.height / 2 };
        setTimeout(() => {
          this.unpauseText!.text = "2";
        }, 1000);
        setTimeout(() => {
          this.unpauseText!.text = "1";
        }, 2000);
        setTimeout(() => {
          this.currentScene.currentGUI!.removeElement(z);
          this.lifeLost = false;
          this.lifeLostType = null;
        }, 3000);
        this.lifeLostType = null;
      }
    } else if (this.lifeLostType == "flipper") {
      if (this.player.position.z < 80) {
        this.player.move(0, 0, 30 * this.deltaTime);
        this.flippers
          .filter((flipper) => flipper.killedPlayer == true)
          .forEach((flipper) => {
            flipper.move(0, 0, 30 * this.deltaTime);
          });
      } else {
        const z = this.currentScene.currentGUI!.addElement(this.unpauseText!);
        console.log(z);
        this.unpauseText!.text = "3";
        this.unpauseText!.position = { x: this.width / 2 - this.unpauseText!.width / 2, y: this.height / 2 - this.unpauseText!.height / 2 };
        setTimeout(() => {
          this.unpauseText!.text = "2";
        }, 1000);
        setTimeout(() => {
          this.unpauseText!.text = "1";
        }, 2000);
        setTimeout(() => {
          this.currentScene.currentGUI!.removeElement(z);
          this.lifeLost = false;
          this.player.move(0, 0, -this.player.position.z);
          this.lifeLostType = null;
          this.flippers
            .filter((flipper) => flipper.killedPlayer == true)
            .forEach((flipper) => {
              this.currentScene.removeGameObject(flipper.id);
              this.enemiesInGame--;
            });
          this.flippers
            .filter((flipper) => flipper.position.z <= 0)
            .forEach((flipper) => {
              this.currentScene.removeGameObject(flipper.id);
              this.enemiesInGame--;
            });
        }, 3000);
        this.lifeLostType = null;
      }
    }
  }

  hyperSpace(delta: number) {
    if (this.player.position.z < 80 && !this.waitingForNextLevel) {
      this.player.move(0, 0, 30 * delta);
      this.mainCamera?.move(0, 0, 30 * delta);
    } else {
      this.mainCamera?.move(0, 0, 60 * delta);
    }

    if (this.player.position.z > 80 && this.mainCamera!.position.z > 0) {
      this.mainCamera?.move(0, 0, -190);
      this.waitingForNextLevel = true;
    }
    if (this.mainCamera!.position.z < -23 && this.mainCamera!.position.z > -27 && this.waitingForNextLevel) {
      this.mainCamera?.move(0, 0, -this.mainCamera.position.z - 25);
      this.isInHyperspace = false;
      this.waitingForNextLevel = false;
    }
  }

  shoot() {
    // to też by trzeb przenieść
    blasterBullet.volume = 0.1;
    blasterBullet.play();
    const bullet = new Bullet({ position: [(this.player.vertecies[2].x + this.player.vertecies[3].x) / 2, (this.player.vertecies[2].y + this.player.vertecies[3].y) / 2, this.player.position.z], size: [1, 1, 1] }, this);
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

      for (const spiker of this.spikers) {
        this.currentScene.removeGameObject(spiker.id);
        this.updateScore(50);
        this.enemiesInGame--;
      }
      this.spikers = [];
      for (const flipper of this.flippers) {
        this.currentScene.removeGameObject(flipper.id);
        this.updateScore(150);
        this.enemiesInGame--;
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
        this.enemiesInGame--;
      }
      for (const tanker of this.tankers) {
        this.currentScene.removeGameObject(tanker.id);
        this.updateScore(100);
        tanker.deployFlippers();
        this.enemiesInGame--;
      }
      this.tankers = [];
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
