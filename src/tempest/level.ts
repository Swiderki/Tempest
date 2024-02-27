import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";

export default class Level extends PhysicalGameObject {
  // struktura wszystkich levelów powinna wyglądać tak:
  // punkty są poukładane zgodnie z wskazówkami zegara
  // najpierw te przy ekranie póżniej te z tyłu
  // linie:
  // najpierw łaczące z przodu
  // później łączące punkty z przodu z tymi z tyłu
  // i na końcu z tyłu
  game: MyGame;
  lopped: boolean = true;
  numberOfSides: number = 0;
  numberOfPoints: number = 0;
  levelId: number = 0;
  colors: Array<string> = ["blue", "orange", "cyan", "red", "yellow", "black", "black", "black"];
  constructor(levelId: number, options: PhysicalObjectInitialConfig, game: MyGame) {
    const nonLopped = [8, 9, 10, 13];
    //super(`obj/level${(levelId-1)%3+1}.obj`, options);
    super(`obj/level${(levelId-1)%16+1}.obj`, options);
    this.game = game;
    if (nonLopped.includes(levelId)) {
      this.lopped = false;
    }
    this.levelId = levelId;
    this.loadMesh().then(() => {
      for (let i = 0; i < this.getMesh().length; i++) {
        this.setLineColor(i, this.colors[Math.floor((this.levelId-1)/16)]);
      }
      this.numberOfSides = (this.game.level.getMesh().length - this.game.level.vertecies.length / 2) / 2;
      this.numberOfPoints = this.game.level.vertecies.length / 2;
      this.isShining = true;
    });
  }
  override Start(): void {
    this.game.player.setPlayerPosition();
  }
  updateColorOnPlayer() {
    let currSide = Math.floor(this.game.currentLevelSide);
    for (let i = 0; i < this.getMesh().length; i++) {
      this.setLineColor(i, this.colors[Math.floor((this.levelId-1)/16)]);
    }
    if (!this.lopped) {
      currSide--;
    }
    this.setLineColor(currSide + this.numberOfPoints, "yellow");
    this.setLineColor(((currSide + 1) % this.numberOfPoints) + this.numberOfPoints, "yellow");
  }
}
