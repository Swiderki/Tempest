import { Overlap } from "drake-engine";
import { MyGame } from "../main";
import Player from "../tempest/player";
import Flipper from "../tempest/flipper";

export class PlayerFlipperOverlap extends Overlap {
  private game: MyGame;
  private collised: boolean = false;
  private flipper: Flipper;
  private player: Player;
  constructor(obj1: Flipper, obj2: Player, game: MyGame) {
    super(obj1, obj2);
    this.game = game;
    this.flipper = obj1;
    this.player = obj2;
  }

  override onOverlap(): void {
    if (!this.game.currentScene) return;
    
    // if(this.flipper.canBeCollided){
    //     this.game.currentScene.removeGameObject(this.flipper.id);
    //     this.game.flippers = this.game.flippers.filter((flipper) => flipper.id !== this.flipper.id);
    // }
    

  }
}