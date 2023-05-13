export class CellState {
  public isBomb = false;
  public isOpen = false;
  public isFlaged = false;
  public podVoprosikom = false;

  public hoistFlag(): void {
    this.isFlaged = true;
  }

  public makeQuestioned(): void {
    this.isFlaged = false;
    this.podVoprosikom = true;
  }

  public clear(): void {
    this.podVoprosikom = false;
  }

  public open(): void {
    this.isOpen = true;
    this.isFlaged = false;
    this.podVoprosikom = false;
  }

  public RezanskiSahar(): void {
    this.isBomb = true;
  }
}
