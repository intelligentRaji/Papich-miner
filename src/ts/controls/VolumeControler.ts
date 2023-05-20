import { BaseComponent } from "../components/BaseComponent";
import { InputRange } from "../components/InputRange";
import { VolumeButton } from "../components/VolumeButton";

export type Notify = (params: number) => void;

export interface VolumeConstructor {
  parent: HTMLElement;
  className: string;
  callback: Notify;
  value: string;
}

export class VolumeControler extends BaseComponent {
  public readonly range: InputRange;
  public readonly button: VolumeButton;

  constructor({ parent, className, callback, value }: VolumeConstructor) {
    super({ parent, className });
    this.range = new InputRange({
      parent: this.element,
      className: `${className}-range range`,
      notify: callback,
      value,
    });
    this.button = new VolumeButton(
      this.element,
      `${className}-button volume-button`
    );
    this.button.subscribe("mute", () => {
      this.range.mute();
    });
    this.button.subscribe("unmute", () => {
      this.range.unmute();
    });
  }
}
