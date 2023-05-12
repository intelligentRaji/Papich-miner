export class AudioComponent {
  protected readonly element: HTMLAudioElement;

  constructor() {
    this.element = new Audio();
  }

  protected play(): void {
    this.element.play();
  }

  protected setSrc(path: string): void {
    this.element.src = path;
  }

  protected setVolume(number: number): void {
    this.element.volume = number / 100;
  }
}
