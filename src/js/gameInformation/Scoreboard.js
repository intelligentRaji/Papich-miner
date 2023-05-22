import { Score } from "./Score";
import { BaseComponent } from "../components/BaseComponent";
import { localStorageManager } from "../LocalStorageManager";
export class Scoreboard extends BaseComponent {
    constructor(parent) {
        super({ parent, className: "scoreboard" });
        this.cache = new Map();
        this.scoresArray = localStorageManager.getItem("scoreboard", []);
        this.scoreboardInfrmation = new BaseComponent({
            parent: this.element,
            className: "scoreboard-information",
        });
        this.bombs = new BaseComponent({
            tag: "span",
            className: "scoreboard-bombs",
            parent: this.scoreboardInfrmation.element,
            text: "Бомбы",
        });
        this.time = new BaseComponent({
            tag: "span",
            className: "scoreboard-time",
            parent: this.scoreboardInfrmation.element,
            text: "Время",
        });
        this.mode = new BaseComponent({
            tag: "span",
            className: "scoreboard-mode",
            parent: this.scoreboardInfrmation.element,
            text: "Сложность",
        });
        this.scores = new BaseComponent({
            className: "scoreboard-scores",
            parent: this.element,
        });
        this.createScoreList();
    }
    removeOldScore() {
        if (this.scoresArray.length > 10) {
            this.cache.delete(this.scoresArray[0]);
            this.scoresArray.shift();
        }
    }
    destroyAllScores() {
        [...this.cache.values()].forEach((score) => {
            score.destroy();
        });
    }
    addScore(obj) {
        this.scoresArray.push(obj);
    }
    getSortedScores() {
        return this.scoresArray.slice().sort((a, b) => {
            if (a.bombs < b.bombs) {
                return -1;
            }
            if (a.bombs > b.bombs) {
                return 1;
            }
            const difficulty = {
                hard: 2,
                medium: 1,
                easy: 0,
            };
            if (difficulty[a.mode] > difficulty[b.mode]) {
                return -1;
            }
            if (difficulty[a.mode] < difficulty[b.mode]) {
                return 1;
            }
            const aTime = a.time.replace(":", "");
            const bTime = b.time.replace(":", "");
            if (Number(aTime) < Number(bTime)) {
                return -1;
            }
            if (Number(aTime) > Number(bTime)) {
                return 1;
            }
            return 0;
        });
    }
    getDifficultyName(mode) {
        switch (mode) {
            case "easy":
                return "СЛОЖНЫЙ";
            case "medium":
                return "РЕЗИДЕНТ ГЛОБУС 4";
            case "hard":
                return "9 КЛАСС";
            default:
                return "";
        }
    }
    createScoreList(obj) {
        if (obj) {
            this.addScore(obj);
            this.destroyAllScores();
            this.removeOldScore();
        }
        const sortedArray = this.getSortedScores();
        sortedArray.forEach((item) => {
            const cachedElement = this.cache.get(item);
            if (cachedElement !== undefined) {
                this.scores.element.append(cachedElement.element);
            }
            if (cachedElement === undefined) {
                const element = new Score({
                    parent: this.scores.element,
                    bombs: item.bombs,
                    time: item.time,
                    mode: this.getDifficultyName(item.mode),
                });
                this.cache.set(item, element);
            }
        });
    }
    toLocalStorage() {
        localStorageManager.setItem("scoreboard", this.scoresArray);
    }
}
