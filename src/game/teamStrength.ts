import { formations } from "@/data/formations";
import { playStyles } from "@/data/playStyles";
import { getPlayerState } from "@/game/playerState";
import { IFormation, IPlayStyle, IPlayer, ITeamStrength, IUserTeam, Position } from "@/types/game";
import { clamp } from "@/utils/format";

const compatible: Record<Position, Position[]> = {
  GK: ["GK"],
  RB: ["RB", "RWB", "CB"],
  CB: ["CB", "RB", "LB", "DM"],
  LB: ["LB", "LWB", "CB"],
  RWB: ["RWB", "RB", "RM"],
  LWB: ["LWB", "LB", "LM"],
  DM: ["DM", "CM", "CB"],
  CM: ["CM", "DM", "AM", "RM", "LM"],
  AM: ["AM", "CM", "SS", "RW", "LW"],
  RM: ["RM", "RWB", "RW", "CM"],
  LM: ["LM", "LWB", "LW", "CM"],
  RW: ["RW", "RM", "LW", "ST"],
  LW: ["LW", "LM", "RW", "ST"],
  SS: ["SS", "AM", "ST"],
  ST: ["ST", "SS", "RW", "LW"]
};

export function getFormation(formationId: string) {
  return formations.find((formation) => formation.id === formationId) ?? formations[0];
}

export function getPlayStyle(playStyleId: string) {
  return playStyles.find((style) => style.id === playStyleId) ?? playStyles[0];
}

export function positionFit(slotPosition: Position, player: IPlayer) {
  if (slotPosition === player.position) {
    return 1;
  }

  if (player.secondaryPositions.includes(slotPosition)) {
    return 0.94;
  }

  if (compatible[slotPosition].includes(player.position)) {
    return 0.88;
  }

  return 0.72;
}

export function staminaMultiplier(stamina = 100) {
  if (stamina >= 88) {
    return 1;
  }

  if (stamina >= 70) {
    return 0.97;
  }

  if (stamina >= 55) {
    return 0.93;
  }

  return 0.88;
}

export function effectivePlayerOverall(player: IPlayer, slotPosition: Position, stamina = 100) {
  return clamp(player.overall * positionFit(slotPosition, player) * staminaMultiplier(stamina), 1, 99);
}

function average(values: number[]) {
  if (values.length === 0) {
    return 70;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function calculateTeamStrength(
  userTeam: IUserTeam,
  formation: IFormation = getFormation(userTeam.formationId),
  playStyle: IPlayStyle = getPlayStyle(userTeam.playStyleId)
): ITeamStrength {
  const starters = (userTeam.starters?.length ?? 0) > 0 ? userTeam.starters : userTeam.players ?? [];
  const lineScores = {
    goalkeeper: [] as number[],
    defense: [] as number[],
    midfield: [] as number[],
    attack: [] as number[]
  };

  starters.forEach((player, index) => {
    const slot = formation.slots[index] ?? formation.slots[formation.slots.length - 1];
    const state = getPlayerState(userTeam, player.id);
    const suspensionPenalty = state.suspended ? 0.65 : 1;
    const score = effectivePlayerOverall(player, slot.position, state.stamina) * suspensionPenalty;

    if (slot.line === "gk") {
      lineScores.goalkeeper.push(score);
      return;
    }

    lineScores[slot.line].push(score);
  });

  const mentality = userTeam.formationMentality ?? "balanced";
  const mentalityAttack = mentality === "offensive" ? 3 : mentality === "defensive" ? -1 : 0;
  const mentalityDefense = mentality === "defensive" ? 3 : mentality === "offensive" ? -1 : 0;
  const mentalityMidfield = mentality === "offensive" ? 1 : mentality === "defensive" ? 1 : 0;
  const goalkeeper = clamp(average(lineScores.goalkeeper), 1, 99);
  const defense = clamp(average(lineScores.defense) + playStyle.defenseBonus + mentalityDefense, 1, 99);
  const midfield = clamp(average(lineScores.midfield) + playStyle.midfieldBonus + mentalityMidfield, 1, 99);
  const attack = clamp(average(lineScores.attack) + playStyle.attackBonus + mentalityAttack, 1, 99);
  const overall = clamp(goalkeeper * 0.16 + defense * 0.28 + midfield * 0.3 + attack * 0.26, 1, 99);

  return {
    attack,
    midfield,
    defense,
    goalkeeper,
    overall
  };
}

export function opponentDifficultyBonus(difficulty: IUserTeam["difficulty"]) {
  return difficulty === "challenger" ? 5 : 2;
}
