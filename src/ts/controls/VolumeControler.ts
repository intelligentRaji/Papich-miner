import { BaseComponent } from "../components/BaseComponent";
import { InputRange } from "../components/InputRange";
import { VolumeButton } from "../components/VolumeButton";

export type Notify = (params: number) => void;

export interface VolumeConstructor {
  parent: HTMLElement;
  className: string;
  callback: Notify;
  value: string;
  type: string;
}

export class VolumeControler extends BaseComponent {
  public readonly range: InputRange;
  public readonly button: VolumeButton;

  constructor({ parent, className, callback, value, type }: VolumeConstructor) {
    super({ parent, className: `${className} volume` });
    this.button = new VolumeButton(
      this.element,
      `${className}-button volume-button`,
      type
    );
    this.range = new InputRange({
      parent: this.element,
      className: `${className}-range range`,
      notify: callback,
      value,
    });
    this.button.subscribe("mute", () => {
      this.range.mute();
    });
    this.button.subscribe("unmute", () => {
      this.range.unmute();
    });
  }

  public toLocalStorage(): void {
    this.range.toLocalStorage();
    this.button.toLocalStorage();
  }
}
