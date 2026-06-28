import { CompetitionId, ICompetitionState, ISeasonMatch, ISeasonState, IStandingRow } from "@/types/game";

export interface ICompetitionSummary {
  competitionId: CompetitionId;
  title: string;
  headline: string;
  detail: string;
  userPosition: number;
  groupName?: string;
  table: IStandingRow[];
}

const groupNames: Partial<Record<CompetitionId, string>> = {
  mineiro: "Grupo A",
  libertadores: "Grupo B",
  mundial: "Chave dos Campeões"
};

function ordinal(value: number) {
  return `${value}º`;
}

function userPosition(standings: IStandingRow[]) {
  return Math.max(1, standings.findIndex((row) => row.isUser) + 1);
}

function firstLostElimination(matches: ISeasonMatch[], competitionId: CompetitionId) {
  return matches.find(
    (match) =>
      match.competitionId === competitionId &&
      match.isElimination &&
      match.result &&
      match.result.userGoals < match.result.opponentGoals
  );
}

function lastPlayedRound(matches: ISeasonMatch[], competitionId: CompetitionId) {
  return [...matches].reverse().find((match) => match.competitionId === competitionId && match.result)?.round;
}

function firstSkippedRound(matches: ISeasonMatch[], competitionId: CompetitionId) {
  return matches.find((match) => match.competitionId === competitionId && match.skipped)?.round;
}

function statusForCompetition(season: ISeasonState, competition: ICompetitionState, position: number) {
  const record = competition.record;
  const lostElimination = firstLostElimination(season.matches, competition.id);
  const skippedRound = firstSkippedRound(season.matches, competition.id);
  const lastRound = lastPlayedRound(season.matches, competition.id);
  const groupName = groupNames[competition.id];

  if (record.champion) {
    return {
      headline: "Campeão",
      detail: `Título confirmado após ${record.played} jogo(s).`
    };
  }

  if (competition.id === "brasileirao") {
    if (position === 1) {
      return {
        headline: "Campeão brasileiro",
        detail: `${record.played} rodada(s), ${record.wins} vitória(s), ${record.draws} empate(s) e ${record.losses} derrota(s).`
      };
    }

    return {
      headline: `${ordinal(position)} colocado`,
      detail: `${record.played} rodada(s), ${record.wins} vitória(s), ${record.draws} empate(s) e ${record.losses} derrota(s).`
    };
  }

  if (lostElimination) {
    return {
      headline: `Eliminado em ${lostElimination.round}`,
      detail: `Caiu contra ${lostElimination.opponent.name} por ${lostElimination.result?.userGoals} x ${lostElimination.result?.opponentGoals}.`
    };
  }

  if (record.eliminated && skippedRound) {
    return {
      headline: `Eliminado antes de ${skippedRound}`,
      detail: `Campanha encerrada em ${lastRound ?? "fase anterior"}.`
    };
  }

  if (groupName && record.played > 0 && !lastRound?.includes("Final") && position > 2) {
    return {
      headline: `Eliminado na fase de grupos`,
      detail: `${groupName}, ${ordinal(position)} colocado.`
    };
  }

  if (record.played === 0) {
    return {
      headline: "Não disputado",
      detail: competition.id === "mundial" ? "Mundial bloqueado porque a Libertadores não foi vencida." : "Sem jogos disputados."
    };
  }

  return {
    headline: "Campanha encerrada",
    detail: lastRound ? `Última partida em ${lastRound}.` : "Sem fase final registrada."
  };
}

export function getSeasonSummaries(season: ISeasonState, competitionStates: ICompetitionState[]): ICompetitionSummary[] {
  return competitionStates.map((competition) => {
    const position = userPosition(competition.standings);
    const status = statusForCompetition(season, competition, position);
    const groupName = groupNames[competition.id];

    return {
      competitionId: competition.id,
      title: competition.name,
      headline: status.headline,
      detail: status.detail,
      userPosition: position,
      groupName,
      table: competition.standings
    };
  });
}
