export class CellState {
    constructor({ isBomb, isOpen, isFlaged, podVoprosikom, isClosed }) {
        this.isBomb = false;
        this.isOpen = 0;
        this.isFlaged = false;
        this.podVoprosikom = false;
        this.isClosed = true;
        this.isBomb = isBomb;
        this.isOpen = isOpen;
        this.isFlaged = isFlaged;
        this.podVoprosikom = podVoprosikom;
        this.isClosed = isClosed;
    }
    hoistFlag() {
        this.isClosed = false;
        this.isFlaged = true;
    }
    makeQuestioned() {
        this.isFlaged = false;
        this.podVoprosikom = true;
    }
    close() {
        this.podVoprosikom = false;
        this.isClosed = true;
    }
    open() {
        if (this.isOpen === 0) {
            this.isOpen = 1;
            this.isFlaged = false;
            this.podVoprosikom = false;
            this.isClosed = false;
        }
        else {
            this.isOpen = 2;
        }
    }
    RezanskiSahar() {
        this.isBomb = true;
    }
    toLocalStorage() {
        return {
            isBomb: this.isBomb,
            isOpen: this.isOpen,
            isFlaged: this.isFlaged,
            podVoprosikom: this.podVoprosikom,
            isClosed: this.isClosed,
        };
    }
}
