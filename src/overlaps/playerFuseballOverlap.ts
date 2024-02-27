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
    console.log("ASDDSA")
    // console.log(this.flipper.canBeCollided)
    // if(this.flipper.canBeCollided){
    //     this.game.currentScene.removeGameObject(this.flipper.id);
    //     this.game.flippers = this.game.flippers.filter((flipper) => flipper.id !== this.flipper.id);
    // }
    this.game.currentScene.removeGameObject(this.fuseball.id);
    this.game.fuseballs = this.game.fuseballs.filter((fuseball) => fuseball.id !== this.fuseball.id); 
    blasterExplosionSound.play();
    this.game.deleteLife()

    this.game.enemiesInGame--;
  }
}