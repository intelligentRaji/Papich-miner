import { Miner } from "./Miner";
import { BaseComponent } from "./components/BaseComponent";
import { Cell } from "./Cell";
import { InformationPanel } from "./InformationPanel";
import { Observable } from "./Observable";
import { Scoreboard } from "./Scoreboard";
import { Settings } from "./Settings";
import { BackgroundAudio } from "./BackgroundAudio";
import { EffectsAudio } from "./EffectsAudio";

export class Game extends BaseComponent {
  public readonly settings: Settings;
  public readonly miner: Miner;
  public readonly informationPanel: InformationPanel;
  public readonly scoreboard: Scoreboard;
  public readonly backgroundMusic: BackgroundAudio;
  public readonly effectsAudio: EffectsAudio;
  public bombs!: Cell[];
  public cellsLeft = 225;
  public bombsLeft = new Observable(0);
  public missedFlags: Cell[] = [];
  public clicks = new Observable(0);

  constructor(parent: HTMLElement) {
    super({ parent, className: "game" });
    this.settings = new Settings();
    this.backgroundMusic = new BackgroundAudio();
    this.effectsAudio = new EffectsAudio();
    this.bombs = [];
    this.informationPanel = new InformationPanel(this.element);
    this.clicks.subscribe((value) => {
      this.informationPanel.plusClick(value);
    });
    this.bombsLeft.subscribe((value) => {
      this.informationPanel.setBombsCount(value);
    });
    this.miner = new Miner({
      parent: this.element,
      numberOfBombs: this.settings.getBombs(),
    });
    this.scoreboard = new Scoreboard(this.element);
    this.miner.addEvent("click", this.gameStart);
    this.miner.subscribe("plantBombs", this.addBomb.bind(this));
    this.miner.cells.forEach((row) =>
      row.forEach((cell) => {
        this.subscribeCell(cell);
      })
    );
  }

  private gameStart = (e: Event): void => {
    if (e.target instanceof HTMLButtonElement) {
      this.miner.startGame(e.target);
    }
    this.miner.removeEvent("click", this.gameStart);
    this.informationPanel.start();
    this.backgroundMusic.start();
    this.win();
  };

  public addBomb(cell: Cell): void {
    this.bombs.push(cell);
    this.bombsLeft.notify((value) => value + 1);
    this.minusCell();
  }

  public minusCell(): void {
    this.cellsLeft -= 1;
  }

  private addMissedFlag(cell: Cell): void {
    if (!cell.state.isBomb) {
      this.missedFlags.push(cell);
    }
  }

  private removeMissedFlag(cell: Cell): void {
    if (!cell.state.isBomb) {
      this.missedFlags = this.missedFlags.filter((element) => element !== cell);
    }
  }

  private minusBombsLeft(): void {
    this.bombsLeft.notify((value) => value - 1);
  }

  private plusBombsLeft(): void {
    this.bombsLeft.notify((value) => value + 1);
  }

  public addFlag(cell: Cell): void {
    this.minusBombsLeft();
    this.addMissedFlag(cell);
  }

  public removeFlag(cell: Cell): void {
    this.plusBombsLeft();
    this.removeMissedFlag(cell);
  }

  private endGame(cell: Cell): void {
    this.bombs.forEach((bomb) => {
      if (bomb !== cell && !bomb.state.isFlaged) {
        bomb.openBombAutomaticly();
      }
    });
    this.missedFlags.forEach((flag) => flag.openFlagAutomaticly());
    const time = this.informationPanel.end();
    this.scoreboard.createScoreList({
      bombs: this.bombsLeft.getValue() + this.missedFlags.length,
      time,
      mode: "medium",
    });
    this.backgroundMusic.end();
  }

  private win(): void {
    if (this.cellsLeft === 0 && this.missedFlags.length === 0) {
      this.bombs.forEach((bomb) => {
        if (!bomb.state.isFlaged) {
          bomb.hoistFlag();
        }
      });
      this.backgroundMusic.win();
    }
  }

  private subscribeCell(cell: Cell): void {
    cell.subscribe("minus", () => {
      this.minusCell();
    });
    cell.subscribe("endGame", (element: Cell) => {
      this.endGame(element);
    });
    cell.subscribe("addFlag", () => {
      this.addFlag(cell);
    });
    cell.subscribe("removeFlag", () => {
      this.removeFlag(cell);
    });
    cell.subscribe("addClick", () => {
      this.clicks.notify((value) => value + 1);
    });
    cell.subscribe("win", () => {
      this.win();
    });
    cell.subscribe("openAudio", () => {
      this.effectsAudio.action("common");
    });
    cell.subscribe("flagAudio", () => {
      this.effectsAudio.action("flag");
    });
  }
}
