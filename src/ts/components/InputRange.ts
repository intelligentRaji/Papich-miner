import { localStorageManager } from "../LocalStorageManager";
import { BaseComponent } from "./BaseComponent";

type Notify = (params: number) => void;

interface IRange {
  parent: HTMLElement;
  className: string;
  notify: Notify;
  value: string;
}

export class InputRange extends BaseComponent<HTMLInputElement> {
  private isMuted: boolean;
  private valueBeforeMuted!: string;
  private notify: Notify;

  constructor({ parent, className, notify, value }: IRange) {
    super({ tag: "input", parent, className, type: "range" });
    this.notify = notify;
    this.element.addEventListener("input", () => {
      notify(Number(this.getValue()));
    });
    this.setValue(value);
    this.valueBeforeMuted = localStorageManager.getItem(
      `valueBeforeMuted${this.getClassName()}`,
      this.getValue()
    );
    this.isMuted = localStorageManager.getItem(
      `isMuted${this.getClassName()}`,
      false
    );
  }

  public setValue(value: string): void {
    this.element.value = value;
    this.notify(Number(this.getValue()));
  }

  public getValue(): string {
    return this.element.value;
  }

  public mute(): void {
    this.isMuted = true;
    this.valueBeforeMuted = this.getValue();
    this.setValue("0");
    this.notify(0);
  }

  public unmute(): void {
    this.isMuted = false;
    this.setValue(this.valueBeforeMuted);
  }

  public toLocalStorage(): void {
    localStorageManager.setItem(
      `valueBeforeMuted${this.getClassName()}`,
      this.valueBeforeMuted
    );
    localStorageManager.setItem(`isMuted${this.getClassName()}`, this.isMuted);
  }
}
