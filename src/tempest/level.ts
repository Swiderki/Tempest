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
  constructor(levelId: number, options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/level${levelId}.obj`, options);
    this.game = game;
    this.loadMesh().then(() => {
      for (let i = 0; i < this.getMesh().length; i++) {
        this.setLineColor(i, "blue");
      }
    });
  }
  override Start(): void {
    this.game.numberOfSides = this.game.level.vertecies.length / 2;
    this.game.player.setPlayerPosition();
  }
  updateColorOnPlayer() {
    for (let i = 0; i < this.getMesh().length; i++) {
      this.setLineColor(i, "blue");
    }
    this.setLineColor(Math.floor(this.game.currentLevelSide) + this.game.numberOfSides, "yellow");
    this.setLineColor(((Math.floor(this.game.currentLevelSide) + 1) % this.game.numberOfSides) + this.game.numberOfSides, "yellow");
  }
}
