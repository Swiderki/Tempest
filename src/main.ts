import { Engine, Camera, Scene } from "drake-engine";
import _default from "drake-engine";
import Player from "./tempest/player";
import Level from "./tempest/level";

const canvas = document.getElementById("game") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

class MyGame extends Engine {
  player: Player;
  level: Level;
  currentLevelSide: number = 0.5;
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.player = new Player({ position: [0, 0, 0], size: [0.1, 0.1, 0.1] });
    this.level = new Level(1, { position: [0, 0, 0], size: [0.1, 0.1, 0.1] });
  }

  handleCameraMove(e: KeyboardEvent) {
    if (!this.mainCamera) return;
    if (e.key === "d") {
      this.currentLevelSide = this.currentLevelSide + 1;
      this.currentLevelSide = this.currentLevelSide % (this.level.vertecies.length / 2);
      this.setPlayerPosition();
    }
    if (e.key === "a") {
      // nie działa jechanie w lewo, trzeba matmy użyć aby działało ale mi się nie chce
      this.currentLevelSide = this.currentLevelSide - 1;
      this.currentLevelSide = this.currentLevelSide % (this.level.vertecies.length / 2);
      this.setPlayerPosition();
    }
  }

  override Start(): void {
    this.setResolution(1280, 720);
    const camera = new Camera(60, 0.1, 1000, [0, 0, -25], [0, 0, 1]);
    const mainScene = new Scene();

    mainScene.setMainCamera(camera, this.width, this.height);
    const mainSceneId = this.addScene(mainScene);
    this.setCurrentScene(mainSceneId);

    mainScene.addGameObject(this.player);
    mainScene.addGameObject(this.level);
    mainScene.started = true;

    document.addEventListener("keydown", this.handleCameraMove.bind(this));
  }

  override Update(): void {}

  setPlayerPosition() {
    console.log(this.currentLevelSide);

    console.log(this.player.vertecies);
    this.player.vertecies[2] = this.level.vertecies[Math.floor(this.currentLevelSide)];
    this.player.vertecies[2].z = 0;
    this.player.vertecies[3] = this.level.vertecies[Math.floor(this.currentLevelSide) + 1];
    this.player.vertecies[3].z = 0;
  }
}

const game = new MyGame(canvas);
game.run();
