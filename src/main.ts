import { Engine, Camera, Scene } from "drake-engine";
import _default from "drake-engine";
import Player from "./tempest/player";
import Level from "./tempest/level";

const canvas = document.getElementById("game") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

class MyGame extends Engine {
  player: Player;
  level: Level;
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.player = new Player({ position: [0, 0, 0], size: [0.1, 0.1, 0.1] });
    this.level = new Level(1, { position: [0, 0, 0], size: [0.1, 0.1, 0.1] });
  }

  handleCameraMove(e: KeyboardEvent) {
    if (!this.mainCamera) return;
    if (e.key === "w") this.mainCamera.move(0, 1, 0);
    if (e.key === "s") this.mainCamera.move(0, -1, 0);
    if (e.key === "a") this.mainCamera.move(-1, 0, 0);
    if (e.key === "d") this.mainCamera.move(1, 0, 0);
  }

  override Start(): void {
    this.setResolution(1280, 720);
    const camera = new Camera(60, 0.1, 1000, [10, 5, -15], [0, 0, 1]);
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
}

const game = new MyGame(canvas);
game.run();
