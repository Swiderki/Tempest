import { Overlap } from "drake-engine";
import { MyGame } from "../main";
import Player from "../tempest/player";
import Fuseball from "../tempest/fuseball";
const blasterExplosionSound = new Audio("sounds/blasterExplosion.mp3");

export class PlayerFuseballOverlap extends Overlap {
  private game: MyGame;
  private collised: boolean = false;
  private fuseball: Fuseball;
  private player: Player;
  constructor(obj1: Fuseball, obj2: Player, game: MyGame) {
    super(obj1, obj2);
    this.game = game;
    this.fuseball = obj1;
    this.player = obj2;
  }

  override onOverlap(): void {
    if (!this.game.currentScene) return;
    if (this.collised) return;
    this.collised = true;
    this.game.lifeLostType = "fuseball";
    // console.log("fuseball hit player");
    for (let i = 0; i < this.player.getMesh().length; i++) {
      this.player.setLineColor(i, "transparent");
    }
    this.game.spawnParticles([this.player.position.x, this.player.position.y, this.player.position.z], 3);

    this.game.currentScene.removeGameObject(this.fuseball.id);
    this.game.fuseballs = this.game.fuseballs.filter((fuseball) => fuseball.id !== this.fuseball.id);
    blasterExplosionSound.play();
    this.game.deleteLife();

    this.game.enemiesInGame--;
  }
}
