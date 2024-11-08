import { NonEmptyRound, Round } from "./icons";

export type GlobalSettings = {
  isShootMode: boolean | undefined;
  rounds: Record<
    `col-${number}-row-${number}`,
    { state: Round; lastNonEmptyRound: NonEmptyRound | undefined } | undefined
  >;
};
