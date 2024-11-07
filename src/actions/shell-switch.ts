import {
  action,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent,
} from "@elgato/streamdeck";
import { blank, empty, live } from "../icons";

const ValueIconMap = {
  live,
  blank,
  empty,
} as const;

type ValueIcon = keyof typeof ValueIconMap;

const defaultIcon = "empty" as const;

const getIcon = (icon: ValueIcon) => ValueIconMap[icon];

const resolveNextIcon = (currentIcon: ValueIcon) => {
  if (currentIcon === "empty") {
    return "live";
  }
  if (currentIcon === "live") {
    return "blank";
  }
  return "empty";
};

@action({ UUID: "com.michalstruck.shells-interlinked.shell-switch" })
export class ShellSwitch extends SingletonAction<ShellSwitchSettings> {
  override onWillAppear(
    ev: WillAppearEvent<ShellSwitchSettings>
  ): void | Promise<void> {
    const icon = getIcon(ev.payload.settings.currentIcon ?? defaultIcon);
    return ev.action.setImage(icon);
  }

  override async onKeyDown(
    ev: KeyDownEvent<ShellSwitchSettings>
  ): Promise<void> {
    const { settings } = ev.payload;

    const currentIcon = settings.currentIcon ?? defaultIcon;
    settings.currentIcon = resolveNextIcon(currentIcon);

    await ev.action.setSettings(settings);

    const icon = getIcon(settings.currentIcon);

    await ev.action.setImage(icon);
  }
}

/**
 * Settings for {@link ShellSwitch}.
 */
type ShellSwitchSettings = {
  currentIcon?: ValueIcon;
};
