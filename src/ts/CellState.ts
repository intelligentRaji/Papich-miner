export interface IProps {
  isBomb: boolean;
  isOpen: number;
  isFlaged: boolean;
  podVoprosikom: boolean;
  isClosed: boolean;
}

export class CellState {
  public isBomb = false;
  public isOpen = 0;
  public isFlaged = false;
  public podVoprosikom = false;
  public isClosed = true;

  constructor({ isBomb, isOpen, isFlaged, podVoprosikom, isClosed }: IProps) {
    this.isBomb = isBomb;
    this.isOpen = isOpen;
    this.isFlaged = isFlaged;
    this.podVoprosikom = podVoprosikom;
    this.isClosed = isClosed;
  }

  public hoistFlag(): void {
    this.isClosed = false;
    this.isFlaged = true;
  }

  public makeQuestioned(): void {
    this.isFlaged = false;
    this.podVoprosikom = true;
  }

  public close(): void {
    this.podVoprosikom = false;
    this.isClosed = true;
  }

  public open(): void {
    if (this.isOpen === 0) {
      this.isOpen = 1;
      this.isFlaged = false;
      this.podVoprosikom = false;
      this.isClosed = false;
    } else {
      this.isOpen = 2;
    }
  }

  public RezanskiSahar(): void {
    this.isBomb = true;
  }

  public toLocalStorage(): IProps {
    return {
      isBomb: this.isBomb,
      isOpen: this.isOpen,
      isFlaged: this.isFlaged,
      podVoprosikom: this.podVoprosikom,
      isClosed: this.isClosed,
    };
  }
}
