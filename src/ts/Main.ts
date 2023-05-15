import { Game } from "./Game";
import { BaseComponent } from "./components/BaseComponent";

export class Main extends BaseComponent {
  private readonly game: Game;

  constructor() {
    super({ tag: "main", className: "main", parent: document.body });
    this.game = new Game(this.element);
  }
}
