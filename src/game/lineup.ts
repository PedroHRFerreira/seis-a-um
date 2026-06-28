import { IFormation, IPlayer } from "@/types/game";
import { positionFit } from "@/game/teamStrength";

export type DraftLineup = Array<IPlayer | undefined>;

export function filledSlots(lineup: DraftLineup) {
  return lineup.filter(Boolean).length;
}

export function isLineupComplete(lineup: DraftLineup, formation: IFormation) {
  return formation.slots.every((_, index) => Boolean(lineup[index]));
}

export function findOpenSlotIndexForPlayer(formation: IFormation, lineup: DraftLineup, player: IPlayer) {
  const rankedSlots = formation.slots
    .map((slot, index) => ({
      index,
      fit: lineup[index] ? 0 : positionFit(slot.position, player)
    }))
    .filter((slot) => slot.fit >= 0.84)
    .sort((a, b) => b.fit - a.fit);

  return rankedSlots[0]?.index;
}

export function playerCanEnterFormation(formation: IFormation, lineup: DraftLineup, player: IPlayer) {
  return findOpenSlotIndexForPlayer(formation, lineup, player) !== undefined;
}
