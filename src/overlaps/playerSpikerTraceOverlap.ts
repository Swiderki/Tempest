import { Overlap } from "drake-engine";
import { MyGame } from "../main";
import Player from "../tempest/player";
import SpikerTrace from "../tempest/spikerTrace";

export class playerSpikerTraceOverlap extends Overlap {
  private game: MyGame;
  private collised: boolean = false;
  private spikerTrace: SpikerTrace;
  private player: Player;
  constructor(obj1: SpikerTrace, obj2: Player, game: MyGame) {
    super(obj1, obj2);
    this.game = game;
    this.spikerTrace = obj1;
    this.player = obj2;
  }

  override onOverlap(): void {
    if (!this.game.currentScene) return;
    if (this.collised) return;
    if (this.game.lifeLostType === "flipper") return;
    this.collised = true;
    this.game.lifeLostType = "spikerTrace";
    this.game.spawnParticles([this.player.position.x, this.player.position.y, this.player.position.z], 3);
    this.game.deleteLife();
    this.collised = false;
  }
}
