import { PhysicalGameObject, Vec3DTuple } from "drake-engine";
import { MyGame } from "../main";

export class PlayerParticle1 extends PhysicalGameObject {
    game: MyGame;
    constructor(position: Vec3DTuple, game: MyGame, size?: Vec3DTuple) {
        super(`obj/wreck1.obj`, {
            position,
            size,
            rotation: [0, 0, 0],
        });
        this.velocity = {
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 0.5) * 4,
            z: 0,
        };
        this.isShining = true;
        this.game = game;
    }
    override Start(): void {
        const color: string = ["yellow", "red", "orange"][Math.floor(Math.random() * 3)];
        for (let j = 0; j < 3; j++) this.setLineColor(j, color);
        setTimeout(() => this.game.currentScene!.removeGameObject(this.id), Math.random() * 500 + 500);
    }
}
