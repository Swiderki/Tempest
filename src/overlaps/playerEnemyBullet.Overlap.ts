import { Overlap } from "drake-engine";
import { MyGame } from "../main";
import Player from "../tempest/player";
import EnemyBullet from "../tempest/enemyBullet";

export class PlayerEnemyBulletOverlap extends Overlap {
  private game: MyGame;
  private collised: boolean = false;
  private enemyBullet: EnemyBullet;
  private player: Player;
  constructor(obj1: EnemyBullet, obj2: Player, game: MyGame) {
    super(obj1, obj2);
    this.game = game;
    this.enemyBullet = obj1;
    this.player = obj2;
  }

  override onOverlap(): void {
    if (!this.game.currentScene) return;
    this.game.currentScene.removeGameObject(this.enemyBullet.id);
    this.game.enemyBullets = this.game.enemyBullets.filter((bullet) => bullet.id !== this.enemyBullet.id);
    // this.game.currentScene.removeOverlap(this.id);
    this.game.deleteLife()
  }
}