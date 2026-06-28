import { CompetitionId, Difficulty, Position } from "@/types/game";

export function clamp(value: number, min = 1, max = 99) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function percent(value: number) {
  return `${clamp(value, 0, 100)}%`;
}

export function difficultyLabel(difficulty: Difficulty) {
  return difficulty === "challenger" ? "Desafiador" : "Difícil";
}

export function positionLabel(position: Position) {
  const labels: Record<Position, string> = {
    GK: "GOL",
    RB: "LD",
    CB: "ZAG",
    LB: "LE",
    RWB: "ALA D",
    LWB: "ALA E",
    DM: "VOL",
    CM: "MC",
    AM: "MEI",
    RM: "MD",
    LM: "ME",
    RW: "PD",
    LW: "PE",
    SS: "SA",
    ST: "ATA"
  };

  return labels[position];
}

export function competitionLabel(id: CompetitionId) {
  const labels: Record<CompetitionId, string> = {
    mineiro: "Mineiro Módulo I",
    brasileirao: "Brasileirão 2026",
    copaDoBrasil: "Copa do Brasil 2026",
    libertadores: "Libertadores 2026",
    mundial: "Mundial"
  };

  return labels[id];
}

export function resultLabel(userGoals: number, opponentGoals: number) {
  if (userGoals > opponentGoals) {
    return "Vitória";
  }

  if (userGoals < opponentGoals) {
    return "Derrota";
  }

  return "Empate";
}
