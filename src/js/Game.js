import { Miner } from "./Miner.js";
import { BaseComponent } from "./components/BaseComponent.js";
import { InformationPanel } from "./gameInformation/InformationPanel.js";
import { Observable } from "./behavioral/Observable.js";
import { Scoreboard } from "./gameInformation/Scoreboard.js";
import { Settings } from "./Settings.js";
import { BackgroundAudio } from "./Audio/BackgroundAudio.js";
import { EffectsAudio } from "./Audio/EffectsAudio.js";
import { Controls } from "./controls/Controls.js";
import { localStorageManager } from "./LocalStorageManager.js";
import { Modal } from "./Modal.js";
export class Game extends BaseComponent {
  constructor(parent) {
    super({ parent });
    this.bombsLeft = new Observable(0);
    this.clicks = new Observable(0);
    this.gameStart = (e) => {
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
        }
      }
    };
    this.settings = new Settings();
    const defaultValues = {
      cellsLeft: this.getCellsLeft(),
      bombsLeft: 0,
      isStarted: false,
      clicks: 0,
      className: `game ${this.settings.getMode()}`,
      bombs: [],
      missedFlags: [],
    };
    const save = localStorageManager.getItem("gameState", defaultValues);
    this.element.className = save.className;
    this.isStarted = save.isStarted;
    this.cellsLeft = this.isStarted ? save.cellsLeft : defaultValues.cellsLeft;
    this.bombsLeft = this.isStarted
      ? new Observable(save.bombsLeft)
      : new Observable(defaultValues.bombsLeft);
    this.clicks = this.isStarted
      ? new Observable(save.clicks)
      : new Observable(defaultValues.clicks);
    this.bombs = this.isStarted ? save.bombs : defaultValues.bombs;
    this.missedFlags = this.isStarted
      ? save.missedFlags
      : defaultValues.missedFlags;
    this.controls = new Controls({
      parent: document.body,
      ostCallback: (value) => {
        this.settings.ostVolume.notify(value);
      },
      effectsCallback: (value) => {
        this.settings.effectsVolume.notify(value);
      },
      ostValue: String(this.settings.ostVolume.getValue()),
      effectsValue: String(this.settings.effectsVolume.getValue()),
      mode: this.settings.getMode(),
      lightMode: this.settings.getLightMode(),
      reset: () => {
        this.restart();
      },
      numberOfBombs: this.settings.getBombs(),
    });
    this.subscribeControls();
    this.backgroundMusic = new BackgroundAudio();
    this.settings.ostVolume.subscribe((value) => {
      this.backgroundMusic.changeVolume(value);
    });
    this.effectsAudio = new EffectsAudio();
    this.settings.effectsVolume.subscribe((value) => {
      this.effectsAudio.changeVolume(value);
    });
    this.informationPanel = new InformationPanel(this.element, this.isStarted);
    this.subscribeInformationPanel();
    this.miner = new Miner({
      parent: this.element,
      numberOfBombs: this.settings.getBombs(),
      mode: this.settings.getMode(),
      className: `miner ${this.settings.getMode()}`,
      isStarted: this.isStarted,
      callback: (coordinates) => {
        this.addBomb(coordinates);
      },
    });
    this.miner.cells.forEach((row) =>
      row.forEach((cell) => {
        this.subscribeCell(cell);
      })
    );
    this.miner.subscribe("plantBombs", this.addBomb.bind(this));
    this.scoreboard = new Scoreboard(this.element);
    this.decisionToStart();
  }
  decisionToStart() {
    if (this.isStarted) {
      this.continue();
    }
    if (!this.isStarted) {
      this.miner.addEvent("click", this.gameStart);
    }
  }
  continue() {
    this.informationPanel.start();
    const musicStart = (e) => {
      this.backgroundMusic.start();
      this.miner.removeEvent("click", musicStart);
      this.miner.removeEvent("contextmenu", musicStart);
    };
    this.miner.addEvent("click", musicStart);
    this.miner.addEvent("contextmenu", musicStart);
  }
  addBomb(coordinates) {
    this.bombs.push(coordinates);
    this.plusBombsLeft();
    this.minusCell();
  }
  minusCell() {
    this.cellsLeft -= 1;
  }
  addMissedFlag(coordinates) {
    if (!this.miner.cells[coordinates.i][coordinates.j].state.isBomb) {
      this.missedFlags.push(coordinates);
    }
  }
  removeMissedFlag(coordinates) {
    if (!this.miner.cells[coordinates.i][coordinates.j].state.isBomb) {
      this.missedFlags = this.missedFlags.filter(
        (element) => element.i !== coordinates.i && element.j !== coordinates.j
      );
    }
  }
  minusBombsLeft() {
    this.bombsLeft.notify((value) => value - 1);
  }
  plusBombsLeft() {
    this.bombsLeft.notify((value) => value + 1);
  }
  addFlag(coordinates) {
    this.minusBombsLeft();
    this.addMissedFlag(coordinates);
  }
  removeFlag(coordinates) {
    this.plusBombsLeft();
    this.removeMissedFlag(coordinates);
  }
  endGame() {
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
  lose(cell) {
    this.bombs.forEach((bomb) => {
      if (
        bomb.i !== cell.i &&
        bomb.j !== cell.j &&
        !this.miner.cells[bomb.i][bomb.j].state.isFlaged
      ) {
        this.miner.cells[bomb.i][bomb.j].openBombAutomaticly();
      }
    });
    this.missedFlags.forEach((flag) =>
      this.miner.cells[flag.i][flag.j].openFlagAutomaticly()
    );
    this.endGame();
    this.backgroundMusic.lose();
    this.openModalWindow("Игра ОКОНЧЕНА! ТЫ ПРОГИРАЛ! Попробуй ещё раз!");
  }
  win() {
    if (this.cellsLeft === 0 && this.missedFlags.length === 0) {
      this.bombs.forEach((bomb) => {
        if (!this.miner.cells[bomb.i][bomb.j].state.isFlaged) {
          this.miner.cells[bomb.i][bomb.j].hoistFlag();
        }
      });
      this.endGame();
      this.backgroundMusic.win();
      this.openModalWindow(
        `Ты разминировал поле за ${this.informationPanel.getTime()} и ${this.clicks.getValue()} ходов! ` +
          "Теперь жители могут спать спокойно!"
      );
    }
  }
  subscribeCell(cell) {
    cell.subscribe("minus", () => {
      this.minusCell();
    });
    cell.subscribe("loose", (element) => {
      this.lose(element);
    });
    cell.subscribe("addFlag", (coordinates) => {
      this.addFlag(coordinates);
    });
    cell.subscribe("removeFlag", () => {
      this.removeFlag({ i: cell.row, j: cell.column });
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
  getCellsLeft() {
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
  restart() {
    this.element.className = `game ${this.settings.getMode()}`;
    this.isStarted = false;
    this.cellsLeft = this.getCellsLeft();
    this.bombs = [];
    this.missedFlags = [];
    this.clicks.notify(0);
    this.informationPanel.reset();
    this.bombsLeft.notify(0);
    this.miner.destroy();
    this.backgroundMusic.stop();
    this.miner = new Miner({
      parent: this.element,
      numberOfBombs: this.settings.getBombs(),
      mode: this.settings.getMode(),
      className: `miner ${this.settings.getMode()}`,
      isStarted: this.isStarted,
      callback: (coordinates) => {
        this.addBomb(coordinates);
      },
    });
    this.miner.addEvent("click", this.gameStart);
    this.miner.subscribe("plantBombs", this.addBomb.bind(this));
    this.miner.cells.forEach((row) =>
      row.forEach((cell) => {
        this.subscribeCell(cell);
      })
    );
  }
  toLocalStorage() {
    const gameState = {
      bombs: this.bombs,
      className: this.getClassName(),
      cellsLeft: this.cellsLeft,
      bombsLeft: this.bombsLeft.getValue(),
      clicks: this.clicks.getValue(),
      isStarted: this.isStarted,
      missedFlags: this.missedFlags,
    };
    localStorageManager.setItem("gameState", gameState);
    this.settings.toLocalStorage();
    this.informationPanel.toLocalStorage();
    this.scoreboard.toLocalStorage();
    this.controls.toLocalStorage();
    this.miner.toLocalStorage();
  }
  subscribeInformationPanel() {
    this.clicks.subscribe((value) => {
      this.informationPanel.plusClick(value);
    });
    this.bombsLeft.subscribe((value) => {
      this.informationPanel.setBombsCount(value);
    });
  }
  subscribeControls() {
    this.controls.bombsControler.subscribe("changeBombs", (value) => {
      this.settings.setBombs(value);
    });
    this.controls.modeController.subscribe("changeMode", (value) => {
      this.settings.setMode(value);
    });
    this.controls.lightModeButton.subscribe("setLightMode", () => {
      this.settings.setLightMode();
    });
  }
  openModalWindow(text) {
    const modal = new Modal({
      text,
      callback: () => {
        this.restart();
      },
    });
  }
}
