import {
  brasileiraoOpponents,
  competitionNames,
  copaDoBrasilOpponents,
  libertadoresOpponents,
  mineiroOpponents,
  mundialOpponents
} from "@/data/competitions";
import { applyMatchRuntime } from "@/game/playerState";
import { simulateMatch } from "@/game/simulation";
import {
  CompetitionId,
  ICompetitionRecord,
  ICompetitionState,
  IMatchResult,
  IOpponent,
  ISeasonMatch,
  ISeasonState,
  IStandingRow,
  IUserTeam
} from "@/types/game";
import { clamp } from "@/utils/format";
import { createSeededRandom } from "@/game/random";

function emptyRecord(competitionId: CompetitionId): ICompetitionRecord {
  return {
    competitionId,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    eliminated: false,
    champion: false
  };
}

function allRecords(): Record<CompetitionId, ICompetitionRecord> {
  return {
    mineiro: emptyRecord("mineiro"),
    brasileirao: emptyRecord("brasileirao"),
    copaDoBrasil: emptyRecord("copaDoBrasil"),
    libertadores: emptyRecord("libertadores"),
    mundial: emptyRecord("mundial")
  };
}

function match(
  competitionId: CompetitionId,
  round: string,
  opponent: IOpponent,
  index: number,
  isElimination = false,
  isFinal = false
): ISeasonMatch {
  return {
    id: `${competitionId}-${index + 1}-${opponent.id}`,
    competitionId,
    competitionName: competitionNames[competitionId],
    round,
    opponent,
    isElimination,
    isFinal
  };
}

function buildMineiro() {
  const groupMatches = mineiroOpponents.slice(0, 8).map((opponent, index) => match("mineiro", `Primeira fase ${index + 1}`, opponent, index));
  const semiOpponent = mineiroOpponents[8];
  const semi = [
    match("mineiro", "Semifinal ida", semiOpponent, 8),
    match("mineiro", "Semifinal volta", semiOpponent, 9, true)
  ];
  const final = match("mineiro", "Final", mineiroOpponents[10], 10, true, true);

  return [...groupMatches, ...semi, final];
}

function buildBrasileirao() {
  return [...brasileiraoOpponents, ...brasileiraoOpponents]
    .slice(0, 38)
    .map((opponent, index) => match("brasileirao", `Rodada ${index + 1}`, opponent, index));
}

function buildCopaDoBrasil() {
  return [
    match("copaDoBrasil", "1ª fase", copaDoBrasilOpponents[0], 0, true),
    match("copaDoBrasil", "2ª fase", copaDoBrasilOpponents[1], 1, true),
    match("copaDoBrasil", "3ª fase", copaDoBrasilOpponents[2], 2, true),
    match("copaDoBrasil", "Oitavas ida", copaDoBrasilOpponents[3], 3),
    match("copaDoBrasil", "Oitavas volta", copaDoBrasilOpponents[3], 4, true),
    match("copaDoBrasil", "Quartas ida", copaDoBrasilOpponents[4], 5),
    match("copaDoBrasil", "Quartas volta", copaDoBrasilOpponents[4], 6, true),
    match("copaDoBrasil", "Semifinal ida", copaDoBrasilOpponents[5], 7),
    match("copaDoBrasil", "Semifinal volta", copaDoBrasilOpponents[5], 8, true),
    match("copaDoBrasil", "Final", copaDoBrasilOpponents[7], 9, true, true)
  ];
}

function buildLibertadores() {
  const group = libertadoresOpponents.slice(0, 6).map((opponent, index) => match("libertadores", `Grupo ${index + 1}`, opponent, index));
  const knockouts = ["Oitavas", "Quartas", "Semifinal", "Final"].map((round, index) =>
    match("libertadores", round, libertadoresOpponents[(index + 6) % libertadoresOpponents.length], index + 6, true, round === "Final")
  );

  return [...group, ...knockouts];
}

function buildMundial(startIndex: number) {
  return ["Quartas", "Semifinal", "Final"].map((round, index) =>
    match("mundial", round, mundialOpponents[index + 1], startIndex + index, true, round === "Final")
  );
}

export function createInitialSeason(userTeam: IUserTeam, seed = Date.now().toString()): ISeasonState {
  const now = new Date().toISOString();

  return {
    id: `season-${seed}`,
    userTeam,
    currentMatchIndex: 0,
    matches: [...buildMineiro(), ...buildBrasileirao(), ...buildCopaDoBrasil(), ...buildLibertadores()],
    records: allRecords(),
    trophies: [],
    finished: false,
    createdAt: now,
    updatedAt: now
  };
}

export function getNextMatch(season: ISeasonState) {
  return season.matches.find((matchItem, index) => index >= season.currentMatchIndex && !matchItem.result && !matchItem.skipped && !matchItem.locked);
}

function recordResult(record: ICompetitionRecord, result: IMatchResult): ICompetitionRecord {
  const wins = result.userGoals > result.opponentGoals ? 1 : 0;
  const draws = result.userGoals === result.opponentGoals ? 1 : 0;
  const losses = result.userGoals < result.opponentGoals ? 1 : 0;

  return {
    ...record,
    played: record.played + 1,
    wins: record.wins + wins,
    draws: record.draws + draws,
    losses: record.losses + losses,
    goalsFor: record.goalsFor + result.userGoals,
    goalsAgainst: record.goalsAgainst + result.opponentGoals
  };
}

function skipFutureMatches(matches: ISeasonMatch[], competitionId: CompetitionId, fromIndex: number) {
  return matches.map((matchItem, index) => {
    if (index > fromIndex && matchItem.competitionId === competitionId && !matchItem.result) {
      return { ...matchItem, skipped: true };
    }

    return matchItem;
  });
}

function maybeUnlockMundial(season: ISeasonState) {
  const hasMundial = season.matches.some((matchItem) => matchItem.competitionId === "mundial");

  if (hasMundial || !season.trophies.includes("libertadores")) {
    return season;
  }

  return {
    ...season,
    matches: [...season.matches, ...buildMundial(season.matches.length)],
    currentMatchIndex: season.matches.length,
    finished: false
  };
}

export function applyMatchResult(season: ISeasonState, matchId: string, result: IMatchResult): ISeasonState {
  const matchIndex = season.matches.findIndex((matchItem) => matchItem.id === matchId);

  if (matchIndex < 0) {
    return season;
  }

  const playedMatch = season.matches[matchIndex];
  const userWon = result.userGoals > result.opponentGoals;
  let records = {
    ...season.records,
    [playedMatch.competitionId]: recordResult(season.records[playedMatch.competitionId], result)
  };
  let trophies = [...season.trophies];
  let matches = season.matches.map((matchItem) => (matchItem.id === matchId ? { ...matchItem, result } : matchItem));

  if (playedMatch.isFinal && userWon) {
    records = {
      ...records,
      [playedMatch.competitionId]: {
        ...records[playedMatch.competitionId],
        champion: true
      }
    };
    trophies = trophies.includes(playedMatch.competitionId) ? trophies : [...trophies, playedMatch.competitionId];
  }

  if (playedMatch.isElimination && !userWon) {
    records = {
      ...records,
      [playedMatch.competitionId]: {
        ...records[playedMatch.competitionId],
        eliminated: true
      }
    };
    matches = skipFutureMatches(matches, playedMatch.competitionId, matchIndex);
  }

  const nextIndex = matches.findIndex((matchItem, index) => index > matchIndex && !matchItem.result && !matchItem.skipped && !matchItem.locked);
  const userTeam = applyMatchRuntime(season.userTeam, result);
  const updated: ISeasonState = {
    ...season,
    userTeam,
    matches,
    records,
    trophies,
    currentMatchIndex: nextIndex >= 0 ? nextIndex : matches.length,
    finished: nextIndex < 0,
    updatedAt: new Date().toISOString()
  };

  return maybeUnlockMundial(updated);
}

export function simulateNextMatch(season: ISeasonState, seed = Date.now().toString()) {
  const next = getNextMatch(season);

  if (!next) {
    return { season: { ...season, finished: true }, result: undefined };
  }

  const result = simulateMatch(season, next, seed);
  return {
    season: applyMatchResult(season, next.id, result),
    result
  };
}

export function simulateUntilEnd(season: ISeasonState, seed = "finish-season") {
  let current = season;
  let guard = 0;

  while (!current.finished && guard < 80) {
    current = simulateNextMatch(current, `${seed}-${guard}`).season;
    guard += 1;
  }

  return {
    ...current,
    finished: true,
    updatedAt: new Date().toISOString()
  };
}

function opponentsFor(competitionId: CompetitionId) {
  const opponents: Record<CompetitionId, IOpponent[]> = {
    mineiro: mineiroOpponents,
    brasileirao: brasileiraoOpponents,
    copaDoBrasil: copaDoBrasilOpponents,
    libertadores: libertadoresOpponents,
    mundial: mundialOpponents
  };

  return opponents[competitionId];
}

function fakeStandingRows(competitionId: CompetitionId, played: number, seed: string): IStandingRow[] {
  const random = createSeededRandom(`${competitionId}-${played}-${seed}`);

  return opponentsFor(competitionId)
    .map((opponent) => {
      const localPlayed = Math.max(played, random.int(2, Math.max(3, played + 2)));
      const points = clamp(Math.round((opponent.strength - 62) * 0.85 + random.int(-4, 7)), 0, localPlayed * 3);
      const wins = Math.min(localPlayed, Math.floor(points / 3));
      const draws = Math.min(localPlayed - wins, points - wins * 3);
      const losses = Math.max(0, localPlayed - wins - draws);
      const goalsFor = wins * 2 + draws + random.int(0, 8);
      const goalsAgainst = losses * 2 + draws + random.int(0, 6);

      return {
        name: opponent.name,
        played: localPlayed,
        points,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst,
        strength: opponent.strength
      };
    });
}

export function getCompetitionStates(season: ISeasonState): ICompetitionState[] {
  return (Object.keys(season.records) as CompetitionId[]).map((competitionId) => {
    const record = season.records[competitionId];
    const userRow: IStandingRow = {
      name: season.userTeam.name,
      played: record.played,
      points: record.wins * 3 + record.draws,
      wins: record.wins,
      draws: record.draws,
      losses: record.losses,
      goalsFor: record.goalsFor,
      goalsAgainst: record.goalsAgainst,
      strength: 0,
      isUser: true
    };
    const standings = [userRow, ...fakeStandingRows(competitionId, record.played, season.id)].sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      return b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst);
    });

    return {
      id: competitionId,
      name: competitionNames[competitionId],
      record,
      standings
    };
  });
}
