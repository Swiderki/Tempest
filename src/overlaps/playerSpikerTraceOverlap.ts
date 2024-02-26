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
        console.log("AS");
        // this.game.currentScene.removeGameObject(this.spikerTrace.id);
        // this.game.spikerTraces = this.game.spikerTraces.filter(
        //   (trace) => trace.id !== this.spikerTrace.id
        // );

        this.game.deleteLife();
    }
}
