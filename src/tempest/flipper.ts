import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";
import { FlipperBulletOverlap } from "../overlaps/flipperBulletOverlap";
import { PlayerFlipperOverlap } from "../overlaps/playerFlipperOverlap";
import EnemyBullet from "./enemyBullet";


export default class Fipper extends PhysicalGameObject {
  game: MyGame;
  currentLevelSide: number = 0;
  depth: number = 0;
  lastShootTime: number = Date.now();
  animationSpeed: number = 30;
  timeBetweenAnimations: number = 300;
  isMoving: boolean = false;
  side: number = 0;
  lastTimeMoved = Date.now();
  canBeCollided = true;
  constructor(options: PhysicalObjectInitialConfig, game: MyGame,closestVertexId?: number) {
    super(`obj/flipper.obj`, options);
    this.game = game;
    this.autoupdateBoxCollider = true;
    this.side = closestVertexId || -1;
    this.loadMesh().then(() => {
      for (let i = 0; i < this.getMesh().length; i++) {
        this.setLineColor(i, "red");
      }
      this.currentLevelSide = Math.round(Math.random() * this.game.level.numberOfPoints * 10) / 10;
      if(this.position.z == 0) this.depth = 80;
      else this.depth = this.position.z 
      this.setFlipperPosition();
    });
  }
  override Start(): void {
    this.showBoxcollider = true;
    this.game.bullets.forEach((bullet) => {
      const ov = new FlipperBulletOverlap(bullet, this, this.game);
      this.game.currentScene.addOverlap(ov);
    });
    const ov = new PlayerFlipperOverlap(this, this.game.player, this.game);
    this.game.currentScene.addOverlap(ov);
  }

  override updatePhysics(deltaTime: number): void {

    const time = Date.now();
    if (this.position.z <= 0 && time - this.lastTimeMoved > 2000) {
      this.moveTowardsPlayer();
      this.lastTimeMoved = time;
    }else if(this.position.z > 0){
      this.depth += -30*deltaTime;
      this.setFlipperPosition();
    }
    this.updateFlipperPosition();


    if (this.lastShootTime < time - 2000) {
      this.lastShootTime = time;
      EnemyBullet.createEnemyBullet(this.game, this.position);
    }
  }

  updateFlipperPosition() {
    
    
    this.generateBoxCollider();
    this.boxCollider![1].z = this.position.z + 2;
    this.position.x = (this.boxCollider![0].x + this.boxCollider![1].x) / 2;
    this.position.y = (this.boxCollider![0].y + this.boxCollider![1].y) / 2;
    this.position.z = this.depth;
  }

  moveTowardsPlayer(): void {
    let targetSide = this.game.currentLevelSide;
    let direction = 0;
    if (this.side != targetSide) {
      let clockwiseDistance = (targetSide - this.side + this.game.level.numberOfPoints) % this.game.level.numberOfPoints;
      let counterClockwiseDistance = (this.side - targetSide + this.game.level.numberOfPoints) % this.game.level.numberOfPoints;
  
      direction = clockwiseDistance <= counterClockwiseDistance ? 1 : -1;
    }
  
    if (direction == 1) {
      if (this.side + 1 > this.game.level.numberOfPoints) {
        this.side = 0;        
      }else{
        this.side += direction;

      }

      this.moveRight(); 

    } else if (direction == -1) {
      if (this.side - 1 ==0) {
        this.side = this.game.level.numberOfPoints ;
      }else{
        this.side += direction;

      }

      this.moveLeft(); 

    }
  }
  
  static createFlipper(game: MyGame, position: { x: number; y: number; z: number }, closestVertexId: number) {
    if (game.currentScene == null) {
      throw new Error("Main scene must be set first.");
    }
    const flipper = new Fipper({ position: [position.x, position.y, position.z], size: [1, 1, 1] }, game, closestVertexId);
    game.currentScene.addGameObject(flipper);
    game.flippers.push(flipper);
  }
  setFlipperPosition() {
    if(this.side == -1){
    this.side = Math.floor(this.currentLevelSide);
  }
  this.currentLevelSide = this.side;

    this.vertecies[0].x = this.game.level.vertecies[this.side].x * 0.95 * 0.5 + this.game.level.vertecies[(this.side + 1) % this.game.level.numberOfPoints].x * 0.95 * 0.5;
    this.vertecies[0].y = this.game.level.vertecies[this.side].y * 0.95 * 0.5 + this.game.level.vertecies[(this.side + 1) % this.game.level.numberOfPoints].y * 0.95 * 0.5;
    this.vertecies[0].z = this.depth;
    this.vertecies[5].x = this.game.level.vertecies[this.side].x;
    this.vertecies[5].y = this.game.level.vertecies[this.side].y;
    this.vertecies[5].z = this.depth;
    this.vertecies[6].x = this.game.level.vertecies[(this.side + 1) % this.game.level.numberOfPoints].x;
    this.vertecies[6].y = this.game.level.vertecies[(this.side + 1) % this.game.level.numberOfPoints].y;
    this.vertecies[6].z = this.depth;
    this.vertecies[1].x = (this.game.level.vertecies[this.side].x * 0.9 + this.game.level.vertecies[(this.side + 1) % this.game.level.numberOfPoints].x * 0.1) * 0.9;
    this.vertecies[1].y = (this.game.level.vertecies[this.side].y * 0.9 + this.game.level.vertecies[(this.side + 1) % this.game.level.numberOfPoints].y * 0.1) * 0.9;
    this.vertecies[1].z = this.depth;
    this.vertecies[2].x = (this.game.level.vertecies[this.side].x * 0.1 + this.game.level.vertecies[(this.side + 1) % this.game.level.numberOfPoints].x * 0.9) * 0.9;
    this.vertecies[2].y = (this.game.level.vertecies[this.side].y * 0.1 + this.game.level.vertecies[(this.side + 1) % this.game.level.numberOfPoints].y * 0.9) * 0.9;
    this.vertecies[2].z = this.depth;
    this.vertecies[3].x = (this.game.level.vertecies[this.side].x * 0.8 + this.game.level.vertecies[(this.side + 1) % this.game.level.numberOfPoints].x * 0.2) * 0.95;
    this.vertecies[3].y = (this.game.level.vertecies[this.side].y * 0.8 + this.game.level.vertecies[(this.side + 1) % this.game.level.numberOfPoints].y * 0.2) * 0.95;
    this.vertecies[3].z = this.depth;
    this.vertecies[4].x = (this.game.level.vertecies[this.side].x * 0.2 + this.game.level.vertecies[(this.side + 1) % this.game.level.numberOfPoints].x * 0.8) * 0.95;
    this.vertecies[4].y = (this.game.level.vertecies[this.side].y * 0.2 + this.game.level.vertecies[(this.side + 1) % this.game.level.numberOfPoints].y * 0.8) * 0.95;
    this.vertecies[4].z = this.depth;
  }
  moveRight() {
    const side = Math.floor(this.currentLevelSide);
    setTimeout(() => {
      this.canBeCollided = false;
      this.setToHalfTheRight();
      setTimeout(() => {
        this.setToTheRight();
        this.currentLevelSide++;
        this.currentLevelSide = this.currentLevelSide % this.game.level.numberOfPoints;
        setTimeout(() => {
          this.setToTheLeft();
          setTimeout(() => {
            this.setToHalfTheLeft();
            setTimeout(() => {

              this.setFlipperPosition();
              setTimeout(() => {
                this.canBeCollided = true;

                if(this.side%16 == this.game.currentLevelSide - 0.5 && this.position.z <= 0){
                  this.game.currentScene.removeGameObject(this.id);
                  this.game.flippers = this.game.flippers.filter((flipper) => flipper.id !== this.id);
                }              }, 50);
            }, this.animationSpeed);
          }, this.animationSpeed);
        }, this.animationSpeed);
      }, this.animationSpeed);
    }, this.animationSpeed);
  }

  moveLeft() {
    const side = Math.floor(this.currentLevelSide);
    setTimeout(() => {
      this.setToHalfTheLeft();
      this.canBeCollided = false;

      setTimeout(() => {
        this.setToTheLeft();
        this.currentLevelSide--;
        this.currentLevelSide = this.currentLevelSide % this.game.level.numberOfPoints;
        setTimeout(() => {
          this.setToTheRight();
          setTimeout(() => {
            this.setToHalfTheRight();
            setTimeout(() => {

              this.setFlipperPosition();
              setTimeout(() => {
                this.canBeCollided = true;

                if(this.side%16 == this.game.currentLevelSide - 0.5 && this.position.z <= 0){
                  this.game.currentScene.removeGameObject(this.id);
                  this.game.flippers = this.game.flippers.filter((flipper) => flipper.id !== this.id);
                }              }, 50);
            }, this.animationSpeed);
          }, this.animationSpeed);
        }, this.animationSpeed);
      }, this.animationSpeed);
    }, this.animationSpeed);
  }

  setToTheRight() {
    
    const side = Math.floor(this.currentLevelSide);
    this.vertecies[0].x = (this.game.level.vertecies[side].x * 0.1 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.9) * 0.8;
    this.vertecies[0].y = (this.game.level.vertecies[side].y * 0.1 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.9) * 0.8;
    this.vertecies[5].x = this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.6;
    this.vertecies[5].y = this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.6;
    this.vertecies[6].x = this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x;
    this.vertecies[6].y = this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y;
    this.vertecies[1].x = (this.game.level.vertecies[side].x * 0.2 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.8) * 0.65;
    this.vertecies[1].y = (this.game.level.vertecies[side].y * 0.2 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.8) * 0.65;
    this.vertecies[2].x = (this.game.level.vertecies[side].x * 0.2 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.8) * 0.95;
    this.vertecies[2].y = (this.game.level.vertecies[side].y * 0.2 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.8) * 0.95;
    this.vertecies[3].x = (this.game.level.vertecies[side].x * 0.1 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.9) * 0.7;
    this.vertecies[3].y = (this.game.level.vertecies[side].y * 0.1 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.9) * 0.7;
    this.vertecies[4].x = (this.game.level.vertecies[side].x * 0.1 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.9) * 0.9;
    this.vertecies[4].y = (this.game.level.vertecies[side].y * 0.1 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.9) * 0.9;
    this.updateFlipperPosition();

  }
  setToHalfTheRight() {
    const side = Math.floor(this.currentLevelSide);
    this.vertecies[0].x = (this.game.level.vertecies[side].x * 0.35 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.65) * 0.85;
    this.vertecies[0].y = (this.game.level.vertecies[side].y * 0.35 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.65) * 0.85;
    this.vertecies[5].x = (this.game.level.vertecies[side].x * 0.8 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.2) * 0.85;
    this.vertecies[5].y = (this.game.level.vertecies[side].y * 0.8 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.2) * 0.85;
    this.vertecies[6].x = this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x;
    this.vertecies[6].y = this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y;
    this.vertecies[1].x = (this.game.level.vertecies[side].x * 0.7 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.3) * 0.75;
    this.vertecies[1].y = (this.game.level.vertecies[side].y * 0.7 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.3) * 0.75;
    this.vertecies[2].x = this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.85;
    this.vertecies[2].y = this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.85;
    this.vertecies[3].x = (this.game.level.vertecies[side].x * 0.6 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.4) * 0.82;
    this.vertecies[3].y = (this.game.level.vertecies[side].y * 0.6 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.4) * 0.82;
    this.vertecies[4].x = (this.game.level.vertecies[side].x * 0.1 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.9) * 0.9;
    this.vertecies[4].y = (this.game.level.vertecies[side].y * 0.1 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.9) * 0.9;
    this.updateFlipperPosition();

  }
  setToTheLeft() {
    const side = Math.floor(this.currentLevelSide);
    this.vertecies[0].x = (this.game.level.vertecies[side].x * 0.9 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.1) * 0.8;
    this.vertecies[0].y = (this.game.level.vertecies[side].y * 0.9 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.1) * 0.8;
    this.vertecies[5].x = this.game.level.vertecies[side].x * 0.6;
    this.vertecies[5].y = this.game.level.vertecies[side].y * 0.6;
    this.vertecies[6].x = this.game.level.vertecies[side].x;
    this.vertecies[6].y = this.game.level.vertecies[side].y;
    this.vertecies[1].x = (this.game.level.vertecies[side].x * 0.8 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.2) * 0.65;
    this.vertecies[1].y = (this.game.level.vertecies[side].y * 0.8 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.2) * 0.65;
    this.vertecies[2].x = (this.game.level.vertecies[side].x * 0.8 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.2) * 0.95;
    this.vertecies[2].y = (this.game.level.vertecies[side].y * 0.8 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.2) * 0.95;
    this.vertecies[3].x = (this.game.level.vertecies[side].x * 0.9 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.1) * 0.7;
    this.vertecies[3].y = (this.game.level.vertecies[side].y * 0.9 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.1) * 0.7;
    this.vertecies[4].x = (this.game.level.vertecies[side].x * 0.9 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.1) * 0.9;
    this.vertecies[4].y = (this.game.level.vertecies[side].y * 0.9 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.1) * 0.9;
    this.updateFlipperPosition();

  }
  setToHalfTheLeft() {
    const side = Math.floor(this.currentLevelSide);
    this.vertecies[0].x = (this.game.level.vertecies[side].x * 0.65 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.35) * 0.85;
    this.vertecies[0].y = (this.game.level.vertecies[side].y * 0.65 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.35) * 0.85;
    this.vertecies[5].x = (this.game.level.vertecies[side].x * 0.2 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.8) * 0.85;
    this.vertecies[5].y = (this.game.level.vertecies[side].y * 0.2 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.8) * 0.85;
    this.vertecies[6].x = this.game.level.vertecies[side].x;
    this.vertecies[6].y = this.game.level.vertecies[side].y;
    this.vertecies[1].x = (this.game.level.vertecies[side].x * 0.3 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.7) * 0.75;
    this.vertecies[1].y = (this.game.level.vertecies[side].y * 0.3 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.7) * 0.75;
    this.vertecies[2].x = this.game.level.vertecies[side].x * 0.85;
    this.vertecies[2].y = this.game.level.vertecies[side].y * 0.85;
    this.vertecies[3].x = (this.game.level.vertecies[side].x * 0.4 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.6) * 0.82;
    this.vertecies[3].y = (this.game.level.vertecies[side].y * 0.4 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.6) * 0.82;
    this.vertecies[4].x = (this.game.level.vertecies[side].x * 0.9 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.1) * 0.9;
    this.vertecies[4].y = (this.game.level.vertecies[side].y * 0.9 + this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.1) * 0.9;
    this.updateFlipperPosition();

  }


}

