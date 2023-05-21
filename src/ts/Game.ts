import { SaveMatrix, Miner } from "./Miner";
import { BaseComponent } from "./components/BaseComponent";
import { Cell } from "./Cell";
import { InformationPanel } from "./gameInformation/InformationPanel";
import { Observable } from "./behavioral/Observable";
import { Scoreboard } from "./gameInformation/Scoreboard";
import { Mode, Settings } from "./Settings";
import { BackgroundAudio } from "./Audio/BackgroundAudio";
import { EffectsAudio } from "./Audio/EffectsAudio";
import { Controls } from "./controls/Controls";
import { localStorageManager } from "./LocalStorageManager";

export class Game extends BaseComponent {
  public readonly settings: Settings;
  public readonly informationPanel: InformationPanel;
  public readonly scoreboard: Scoreboard;
  public readonly backgroundMusic: BackgroundAudio;
  public readonly effectsAudio: EffectsAudio;
  public readonly controls: Controls;
  public miner: Miner;
  public bombs: Cell[] = [];
  public cellsLeft: number;
  public bombsLeft: Observable<number> = new Observable(0);
  public missedFlags: Cell[] = [];
  public clicks: Observable<number> = new Observable(0);
  public isStarted: boolean;

  constructor(parent: HTMLElement) {
    super({ parent, className: "game" });
    this.settings = new Settings();
    const defaultValues = {
      cellsLeft: this.getCellsLeft(),
      bombsLeft: 0,
      isStarted: false,
      clicks: 0,
    };
    const save = localStorageManager.getItem("gameState", defaultValues);
    this.cellsLeft = save.cellsLeft;
    this.bombsLeft = new Observable(save.bombsLeft);
    this.clicks = new Observable(save.clicks);
    this.isStarted = save.isStarted;
    this.controls = new Controls({
      parent: document.body,
      ostCallback: (value): void => {
        this.settings.ostVolume.notify(value);
      },
      effectsCallback: (value): void => {
        this.settings.effectsVolume.notify(value);
      },
      ostValue: String(this.settings.ostVolume.getValue()),
      effectsValue: String(this.settings.effectsVolume.getValue()),
      mode: this.settings.getMode(),
      lightMode: this.settings.getLightMode(),
      reset: (): void => {
        this.restart();
      },
      numberOfBombs: this.settings.getBombs(),
    });
    this.controls.bombsControler.subscribe("changeBombs", (value: number) => {
      this.settings.setBombs(value);
    });
    this.controls.modeController.subscribe("changeMode", (value: Mode) => {
      this.settings.setMode(value);
    });
    this.controls.lightModeButton.subscribe("setLightMode", () => {
      this.settings.setLightMode();
    });
    this.backgroundMusic = new BackgroundAudio();
    this.settings.ostVolume.subscribe((value) => {
      this.backgroundMusic.changeVolume(value);
    });
    this.effectsAudio = new EffectsAudio();
    this.settings.effectsVolume.subscribe((value) => {
      this.effectsAudio.changeVolume(value);
    });
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
      mode: this.settings.getMode(),
      isStarted: this.isStarted,
    });
    this.miner.cells.forEach((row) =>
      row.forEach((cell) => {
        this.subscribeCell(cell);
      })
    );
    this.miner.subscribe("plantBombs", this.addBomb.bind(this));
    this.scoreboard = new Scoreboard(this.element);
    this.decisionToStart();
    this.setHardStyle(this.settings.getMode());
  }

  private decisionToStart(): void {
    if (this.isStarted) {
      this.continue();
    }
    if (!this.isStarted) {
      this.miner.addEvent("click", this.gameStart);
    }
  }

  private gameStart = (e: Event): void => {
    if (e.target instanceof HTMLButtonElement) {
      const index = Number(e.target.className.split(" ")[1]);
      const i = Math.floor(index / this.miner.size);
      const j = index % this.miner.size;
      const element = this.miner.cells[i][j];
      if (!element.state.isFlaged && !element.state.podVoprosikom) {
        this.miner.startGame(element, i, j);
        this.miner.removeEvent("click", this.gameStart);
        this.informationPanel.start();
        this.backgroundMusic.start();
        this.isStarted = true;
        this.win();
      }
    }
  };

  private continue(): void {
    this.informationPanel.start();
    this.backgroundMusic.start();
  }

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

  private endGame(): void {
    const time = this.informationPanel.end();
    this.scoreboard.createScoreList({
      bombs: this.bombsLeft.getValue() + this.missedFlags.length,
      time,
      mode: this.settings.getMode(),
    });
    this.miner.cells.forEach((row) =>
      row.forEach((cell) => cell.removeListeners())
    );
    this.isStarted = false;
  }

  private lose(cell: Cell): void {
    this.bombs.forEach((bomb) => {
      if (bomb !== cell && !bomb.state.isFlaged) {
        bomb.openBombAutomaticly();
      }
    });
    this.missedFlags.forEach((flag) => flag.openFlagAutomaticly());
    this.endGame();
    this.backgroundMusic.loose();
  }

  private win(): void {
    if (this.cellsLeft === 0 && this.missedFlags.length === 0) {
      this.bombs.forEach((bomb) => {
        if (!bomb.state.isFlaged) {
          bomb.hoistFlag();
        }
      });
      this.endGame();
      this.backgroundMusic.win();
    }
  }

  private subscribeCell(cell: Cell): void {
    cell.subscribe("minus", () => {
      this.minusCell();
    });
    cell.subscribe("loose", (element: Cell) => {
      this.lose(element);
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

  private getCellsLeft(): number {
    switch (this.settings.getMode()) {
      case "easy":
        return 100;

      case "medium":
        return 225;

      case "hard":
        return 625;

      default:
        return 100;
    }
  }

  private restart(): void {
    this.isStarted = false;
    this.cellsLeft = this.getCellsLeft();
    this.bombs = [];
    this.bombsLeft.notify(0);
    this.missedFlags = [];
    this.clicks.notify(0);
    this.informationPanel.reset();
    this.miner.destroy();
    this.miner = new Miner({
      parent: this.element,
      numberOfBombs: this.settings.getBombs(),
      mode: this.settings.getMode(),
      isStarted: this.isStarted,
    });
    this.miner.addEvent("click", this.gameStart);
    this.miner.subscribe("plantBombs", this.addBomb.bind(this));
    this.miner.cells.forEach((row) =>
      row.forEach((cell) => {
        this.subscribeCell(cell);
      })
    );
    this.setHardStyle(this.settings.getMode());
  }

  private setHardStyle(value: Mode): void {
    if (value === "hard") {
      this.addClass("hard");
      this.miner.addClass("hard");
    } else {
      this.removeClass("hard");
      this.miner.removeClass("hard");
    }
  }

  public toLocalStorage(): void {
    const gameState = {
      cellsLeft: this.cellsLeft,
      bombsLeft: this.bombsLeft.getValue(),
      clicks: this.clicks.getValue(),
      isStarted: this.isStarted,
    };
    localStorageManager.setItem("gameState", gameState);
    this.settings.toLocalStorage();
    this.informationPanel.toLocalStorage();
    this.scoreboard.toLocalStorage();
    this.miner.toLocalStorage();
  }
}
