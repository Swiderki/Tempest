import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame, debugMode } from "../main";
import { PlayerPowerUpOverlap } from "../overlaps/playerPowerUpOverlap";
import { PowerUpBulletOverlap } from "../overlaps/powerUpBulletOverlap";
const enemyBulletSound = new Audio("sounds/enemyBullet.mp3");

export default class PowerUp extends PhysicalGameObject {
    game: MyGame;
    lastShootTime: number = 900;
    typeArr = ["powerAmmo", "powerLife", "powerZapper"]
    type: string;
    constructor(options: PhysicalObjectInitialConfig, game: MyGame) {
        const tab = ["powerAmmo", "powerLife", "powerZapper"]
        super(`obj/${tab[game.currentLevel % 3]}.obj`, options);
        this.type = this.typeArr[game.currentLevel % 3];
        this.game = game;
        if (!options.position) {
            this.setPosition(0, 0, 0);
        }
        this.velocity.z = -20;
        this.autoupdateBoxCollider = true;
    }

    override Start(): void {
        for (let i = 0; i < this.getMesh().length; i++) {
            this.setLineColor(i, "yellow");
        }
        this.generateBoxCollider();
        this.showBoxcollider = debugMode;

        // Random position
        if (this.position.x == 0 && this.position.y == 0 && this.position.z == 0) {
            const randomRange = this.game.level.vertecies.length / 2 - 1;
            const randomIndex = Math.floor(Math.random() * randomRange);
            const randomVertex1 = this.game.level.vertecies[randomIndex];
            const randomVertex2 = this.game.level.vertecies[randomIndex + 1];
            const middle = { x: (randomVertex1.x + randomVertex2.x) / 2, y: (randomVertex1.y + randomVertex2.y) / 2, z: 80 };
            this.move(middle.x, middle.y, 80);
        }

        const ov = new PlayerPowerUpOverlap(this, this.game.player, this.game);
        this.game.currentScene.addOverlap(ov);
        
        this.game.bullets.forEach((bullet) => {
            const ov = new PowerUpBulletOverlap(this, bullet, this.game);
            this.game.currentScene.addOverlap(ov);
        })
    }

    override updatePhysics(deltaTime: number): void {
        if (this.game.lifeLost) return

        super.updatePhysics(deltaTime);

        // Fixing box collider
        this.boxCollider![0].z = this.position.z - 2;

        if (this.position.z < -2) {
            this.game.currentScene.removeGameObject(this.id);
            this.game.powerUps = this.game.powerUps.filter(el => el.id !== this.id)
        }
    }

    static createPowerUp(game: MyGame) {
        if (!game.currentScene) {
            throw new Error("Main scene must be set first.");
        }
        const powerUp = new PowerUp({ position: [0, 0, 0], size: [0.7, 0.7, 0.7] }, game);
        game.currentScene.addGameObject(powerUp);
        game.powerUps.push(powerUp);
    }
}
