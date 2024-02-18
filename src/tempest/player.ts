import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
export default class Player extends PhysicalGameObject {
    constructor(options: PhysicalObjectInitialConfig) {
        super("src/tempest/obj/player.obj", options);
        // Inicjalizacja specyficznych dla Playera właściwości
        
    }
    override Start(): void {
        console.log(this.getMesh());

    }


}
