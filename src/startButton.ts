import { Button } from "drake-engine";
import { MyGame } from "./main";

export class StartButton extends Button {
    game: MyGame;
    constructor(game: MyGame) {
        super("Start", 35, "monospace", "#fff");
        this.game = game;
    }

    override onHover(): void {
        const color = "lime";
        this.color = color;
        this.border.bottom.color = color;
        this.border.top.color = color;
        this.border.left.color = color;
        this.border.right.color = color;
    }

    override onClick(): void {
        this.game.switchScene()
        this.game.gameStarted = true;
        this.game.lastSpawned = Date.now();
    }
}