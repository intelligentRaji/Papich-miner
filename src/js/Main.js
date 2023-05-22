import { Game } from "./Game";
import { BaseComponent } from "./components/BaseComponent";
export class Main extends BaseComponent {
    constructor() {
        super({ tag: "main", className: "main", parent: document.body });
        this.game = new Game(this.element);
        window.addEventListener("beforeunload", () => {
            this.game.toLocalStorage();
        });
    }
}
