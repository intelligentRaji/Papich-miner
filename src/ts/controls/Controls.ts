import { BombsControler } from "./BombsControler";
import { BaseComponent } from "../components/BaseComponent";
import { VolumeControler } from "./VolumeControler";
import { ModeController } from "./ModeController";
import { LightMode, Mode } from "../Settings";
import { LightModeButton } from "./LightModeButton";

export type Notify = (params: number) => void;

interface ContolsConstructor {
  parent: HTMLElement;
  ostCallback: Notify;
  effectsCallback: Notify;
  ostValue: string;
  effectsValue: string;
  mode: Mode;
  lightMode: LightMode;
  reset: () => void;
  numberOfBombs: number;
}

export class Controls extends BaseComponent {
  public readonly bombsControler: BombsControler;
  public readonly ostVolumeController: VolumeControler;
  public readonly effectsVolumeController: VolumeControler;
  public readonly modeController: ModeController;
  public readonly lightModeButton: LightModeButton;
  public readonly resetButton: BaseComponent;

  constructor({
    parent,
    ostCallback,
    effectsCallback,
    ostValue,
    effectsValue,
    mode,
    lightMode,
    reset,
    numberOfBombs,
  }: ContolsConstructor) {
    super({ parent, className: "controls" });
    this.bombsControler = new BombsControler({
      parent: this.element,
      reset,
      numberOfBombs,
    });
    this.ostVolumeController = new VolumeControler({
      parent: this.element,
      className: "ost-volume",
      callback: ostCallback,
      value: ostValue,
    });
    this.effectsVolumeController = new VolumeControler({
      parent: this.element,
      className: "ost-volume",
      callback: effectsCallback,
      value: effectsValue,
    });
    this.modeController = new ModeController({
      parent: this.element,
      mode,
      reset,
    });
    this.modeController.subscribe("changeBombs", (value: number) => {
      this.bombsControler.change(value);
    });
    this.lightModeButton = new LightModeButton(this.element, lightMode);
    this.resetButton = new BaseComponent({
      parent: this.element,
      tag: "button",
      text: "Начать заново",
      className: "reset-button",
    });
    this.resetButton.addEvent("click", reset);
  }

  public getBombs(): number {
    return this.bombsControler.getValue();
  }
}
