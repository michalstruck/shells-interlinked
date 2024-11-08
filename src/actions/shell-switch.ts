import streamDeck, {
  action,
  KeyDownEvent,
  SingletonAction,
  Target,
  WillAppearEvent,
} from "@elgato/streamdeck";
import { NonEmptyRound, Round, RoundIconMap } from "../icons";
import { GlobalSettings } from "../types.global";

const defaultRound = "empty" as const;

const getIcon = (icon: Round) => RoundIconMap[icon];

const resolveNextIcon = (
  currentRound: Round,
  isShootMode: boolean,
  lastNonEmptyRound: "live" | "blank" | undefined
): Round => {
  if (isShootMode) {
    if (currentRound === "live" || currentRound === "blank") {
      return "empty";
    }

    return lastNonEmptyRound ?? defaultRound;
  }

  if (currentRound === "live") {
    return "blank";
  }

  return "live";
};

// new action button
// when active switch live/blank to empty
// when active switch empty to last known live/blank
// when not active, cycle through live/blank
@action({ UUID: "com.michalstruck.shells-interlinked.shell-switch" })
export class ShellSwitch extends SingletonAction<{}> {
  override async onWillAppear(ev: WillAppearEvent<{}>): Promise<void> {
    await streamDeck.settings.setGlobalSettings({});

    const icon = getIcon(defaultRound);
    return ev.action.setImage(icon);
  }

  override async onKeyDown(ev: KeyDownEvent<{}>): Promise<void> {
    if (
      ev.action.coordinates?.column === undefined ||
      ev.action.coordinates?.row === undefined
    ) {
      streamDeck.logger.info({
        origin: "modifier",
        ...ev.action,
      });
      return;
    }

    const roundSettingsKey =
      `col-${ev.action.coordinates.column}-row-${ev.action.coordinates.row}` as const;
    const globalSettings =
      await streamDeck.settings.getGlobalSettings<GlobalSettings>();

    const isShootMode = Boolean(globalSettings.isShootMode);
    let round =
      globalSettings.rounds?.[roundSettingsKey] ??
      ({} as { state: Round; lastNonEmptyRound: NonEmptyRound | undefined });

    const lastNonEmptyRound = round.lastNonEmptyRound;

    const currentRound = round.state ?? defaultRound;

    streamDeck.logger.debug({
      round,
    });

    let newGlobalSettings = {
      rounds: {
        ...globalSettings.rounds,
        [roundSettingsKey]: {
          state: resolveNextIcon(currentRound, isShootMode, lastNonEmptyRound),
          lastNonEmptyRound:
            currentRound === "empty" ? lastNonEmptyRound : currentRound,
        },
      },
      isShootMode,
    } as GlobalSettings;

    const icon = getIcon(newGlobalSettings.rounds[roundSettingsKey]!.state);

    await ev.action.setImage(icon, {});

    await streamDeck.settings.setGlobalSettings<GlobalSettings>(
      newGlobalSettings
    );

    streamDeck.logger.info({
      origin: "shell-switch",
      roundSettingsKey,
      globalSettings,
      newGlobalSettings,
    });
  }
}
