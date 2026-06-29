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
  isFinal = false,
  metadata: Pick<ISeasonMatch, "stage" | "knockoutKey" | "knockoutLeg"> = {}
): ISeasonMatch {
  return {
    id: `${competitionId}-${index + 1}-${opponent.id}`,
    competitionId,
    competitionName: competitionNames[competitionId],
    round,
    opponent,
    isElimination,
    isFinal,
    ...metadata
  };
}

function buildMineiro() {
  const groupMatches = mineiroOpponents
    .slice(0, 8)
    .map((opponent, index) => match("mineiro", `Primeira fase ${index + 1}`, opponent, index, false, false, { stage: "group" }));
  const semiOpponent = mineiroOpponents[8];
  const semi = [
    match("mineiro", "Semifinal ida", semiOpponent, 8, false, false, { stage: "knockout", knockoutKey: "semifinal", knockoutLeg: "first" }),
    match("mineiro", "Semifinal volta", semiOpponent, 9, true, false, { stage: "knockout", knockoutKey: "semifinal", knockoutLeg: "second" })
  ];
  const final = match("mineiro", "Final", mineiroOpponents[10], 10, true, true, {
    stage: "knockout",
    knockoutKey: "final",
    knockoutLeg: "single"
  });

  return [...groupMatches, ...semi, final];
}

function buildBrasileirao() {
  return [...brasileiraoOpponents, ...brasileiraoOpponents]
    .slice(0, 38)
    .map((opponent, index) => match("brasileirao", `Rodada ${index + 1}`, opponent, index, false, false, { stage: "league" }));
}

function buildCopaDoBrasil() {
  return [
    match("copaDoBrasil", "1ª fase", copaDoBrasilOpponents[0], 0, true, false, { stage: "knockout", knockoutKey: "primeira", knockoutLeg: "single" }),
    match("copaDoBrasil", "2ª fase", copaDoBrasilOpponents[1], 1, true, false, { stage: "knockout", knockoutKey: "segunda", knockoutLeg: "single" }),
    match("copaDoBrasil", "3ª fase", copaDoBrasilOpponents[2], 2, true, false, { stage: "knockout", knockoutKey: "terceira", knockoutLeg: "single" }),
    match("copaDoBrasil", "4ª fase", copaDoBrasilOpponents[3], 3, true, false, { stage: "knockout", knockoutKey: "quarta", knockoutLeg: "single" }),
    match("copaDoBrasil", "5ª fase ida", copaDoBrasilOpponents[4], 4, false, false, { stage: "knockout", knockoutKey: "quinta", knockoutLeg: "first" }),
    match("copaDoBrasil", "5ª fase volta", copaDoBrasilOpponents[4], 5, true, false, { stage: "knockout", knockoutKey: "quinta", knockoutLeg: "second" }),
    match("copaDoBrasil", "Oitavas ida", copaDoBrasilOpponents[5], 6, false, false, { stage: "knockout", knockoutKey: "oitavas", knockoutLeg: "first" }),
    match("copaDoBrasil", "Oitavas volta", copaDoBrasilOpponents[5], 7, true, false, { stage: "knockout", knockoutKey: "oitavas", knockoutLeg: "second" }),
    match("copaDoBrasil", "Quartas ida", copaDoBrasilOpponents[6], 8, false, false, { stage: "knockout", knockoutKey: "quartas", knockoutLeg: "first" }),
    match("copaDoBrasil", "Quartas volta", copaDoBrasilOpponents[6], 9, true, false, { stage: "knockout", knockoutKey: "quartas", knockoutLeg: "second" }),
    match("copaDoBrasil", "Semifinal ida", copaDoBrasilOpponents[7], 10, false, false, { stage: "knockout", knockoutKey: "semifinal", knockoutLeg: "first" }),
    match("copaDoBrasil", "Semifinal volta", copaDoBrasilOpponents[7], 11, true, false, { stage: "knockout", knockoutKey: "semifinal", knockoutLeg: "second" }),
    match("copaDoBrasil", "Final", copaDoBrasilOpponents[8], 12, true, true, { stage: "knockout", knockoutKey: "final", knockoutLeg: "single" })
  ];
}

function buildLibertadores() {
  const group = libertadoresOpponents
    .slice(0, 6)
    .map((opponent, index) => match("libertadores", `Grupo ${index + 1}`, opponent, index, false, false, { stage: "group" }));
  const knockouts = [
    match("libertadores", "Oitavas ida", libertadoresOpponents[6], 6, false, false, {
      stage: "knockout",
      knockoutKey: "oitavas",
      knockoutLeg: "first"
    }),
    match("libertadores", "Oitavas volta", libertadoresOpponents[6], 7, true, false, {
      stage: "knockout",
      knockoutKey: "oitavas",
      knockoutLeg: "second"
    }),
    match("libertadores", "Quartas ida", libertadoresOpponents[7], 8, false, false, {
      stage: "knockout",
      knockoutKey: "quartas",
      knockoutLeg: "first"
    }),
    match("libertadores", "Quartas volta", libertadoresOpponents[7], 9, true, false, {
      stage: "knockout",
      knockoutKey: "quartas",
      knockoutLeg: "second"
    }),
    match("libertadores", "Semifinal ida", libertadoresOpponents[8], 10, false, false, {
      stage: "knockout",
      knockoutKey: "semifinal",
      knockoutLeg: "first"
    }),
    match("libertadores", "Semifinal volta", libertadoresOpponents[8], 11, true, false, {
      stage: "knockout",
      knockoutKey: "semifinal",
      knockoutLeg: "second"
    }),
    match("libertadores", "Final", libertadoresOpponents[9], 12, true, true, {
      stage: "knockout",
      knockoutKey: "final",
      knockoutLeg: "single"
    })
  ];

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

function goalDifference(row: Pick<IStandingRow, "goalsFor" | "goalsAgainst">) {
  return row.goalsFor - row.goalsAgainst;
}

function compareStandingRows(a: IStandingRow, b: IStandingRow) {
  if (b.points !== a.points) {
    return b.points - a.points;
  }

  if (b.wins !== a.wins) {
    return b.wins - a.wins;
  }

  if (goalDifference(b) !== goalDifference(a)) {
    return goalDifference(b) - goalDifference(a);
  }

  return b.goalsFor - a.goalsFor;
}

function addTrophy(trophies: CompetitionId[], competitionId: CompetitionId) {
  return trophies.includes(competitionId) ? trophies : [...trophies, competitionId];
}

function markChampion(records: Record<CompetitionId, ICompetitionRecord>, competitionId: CompetitionId) {
  return {
    ...records,
    [competitionId]: {
      ...records[competitionId],
      champion: true
    }
  };
}

function markEliminated(records: Record<CompetitionId, ICompetitionRecord>, competitionId: CompetitionId) {
  return {
    ...records,
    [competitionId]: {
      ...records[competitionId],
      eliminated: true
    }
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

function competitionComplete(matches: ISeasonMatch[], competitionId: CompetitionId) {
  return !matches.some((matchItem) => matchItem.competitionId === competitionId && !matchItem.result && !matchItem.skipped);
}

function competitionPosition(season: ISeasonState, competitionId: CompetitionId) {
  const competition = getCompetitionStates(season).find((item) => item.id === competitionId);
  const index = competition?.standings.findIndex((row) => row.isUser) ?? -1;

  return index >= 0 ? index + 1 : 1;
}

function playedStageMatches(matches: ISeasonMatch[], competitionId: CompetitionId, stage: ISeasonMatch["stage"]) {
  return matches.filter((matchItem) => matchItem.competitionId === competitionId && matchItem.stage === stage && matchItem.result).length;
}

function decideGroupStage(
  season: ISeasonState,
  records: Record<CompetitionId, ICompetitionRecord>,
  matches: ISeasonMatch[],
  playedMatch: ISeasonMatch,
  matchIndex: number
) {
  if (playedMatch.stage !== "group") {
    return { records, matches };
  }

  const qualifyingPositions: Partial<Record<CompetitionId, number>> = {
    mineiro: 4,
    libertadores: 2
  };
  const requiredMatches: Partial<Record<CompetitionId, number>> = {
    mineiro: 8,
    libertadores: 6
  };
  const required = requiredMatches[playedMatch.competitionId];
  const cutoff = qualifyingPositions[playedMatch.competitionId];

  if (!required || !cutoff || playedStageMatches(matches, playedMatch.competitionId, "group") < required) {
    return { records, matches };
  }

  const position = competitionPosition({ ...season, records, matches }, playedMatch.competitionId);

  if (position <= cutoff) {
    return { records, matches };
  }

  return {
    records: markEliminated(records, playedMatch.competitionId),
    matches: skipFutureMatches(matches, playedMatch.competitionId, matchIndex)
  };
}

function phaseMatches(matches: ISeasonMatch[], playedMatch: ISeasonMatch) {
  return matches.filter(
    (matchItem) =>
      matchItem.competitionId === playedMatch.competitionId &&
      matchItem.knockoutKey &&
      matchItem.knockoutKey === playedMatch.knockoutKey &&
      matchItem.result
  );
}

function userAdvancedInKnockout(matches: ISeasonMatch[], playedMatch: ISeasonMatch, result: IMatchResult) {
  if (playedMatch.knockoutLeg === "first") {
    return undefined;
  }

  if (playedMatch.knockoutLeg === "single" || !playedMatch.knockoutKey) {
    return result.userGoals > result.opponentGoals;
  }

  const aggregate = phaseMatches(matches, playedMatch).reduce(
    (total, matchItem) => ({
      userGoals: total.userGoals + (matchItem.result?.userGoals ?? 0),
      opponentGoals: total.opponentGoals + (matchItem.result?.opponentGoals ?? 0)
    }),
    { userGoals: 0, opponentGoals: 0 }
  );

  if (aggregate.userGoals !== aggregate.opponentGoals) {
    return aggregate.userGoals > aggregate.opponentGoals;
  }

  return result.userGoals >= result.opponentGoals;
}

function decideKnockout(
  records: Record<CompetitionId, ICompetitionRecord>,
  trophies: CompetitionId[],
  matches: ISeasonMatch[],
  playedMatch: ISeasonMatch,
  matchIndex: number,
  result: IMatchResult
) {
  if (playedMatch.stage !== "knockout" && !playedMatch.isElimination) {
    return { records, trophies, matches };
  }

  const advanced = userAdvancedInKnockout(matches, playedMatch, result);

  if (advanced === undefined) {
    return { records, trophies, matches };
  }

  if (advanced && playedMatch.isFinal) {
    return {
      records: markChampion(records, playedMatch.competitionId),
      trophies: addTrophy(trophies, playedMatch.competitionId),
      matches
    };
  }

  if (!advanced) {
    return {
      records: markEliminated(records, playedMatch.competitionId),
      trophies,
      matches: skipFutureMatches(matches, playedMatch.competitionId, matchIndex)
    };
  }

  return { records, trophies, matches };
}

function decideBrasileiraoTitle(
  season: ISeasonState,
  records: Record<CompetitionId, ICompetitionRecord>,
  trophies: CompetitionId[],
  matches: ISeasonMatch[]
) {
  if (!competitionComplete(matches, "brasileirao") || records.brasileirao.champion || records.brasileirao.eliminated) {
    return { records, trophies };
  }

  const position = competitionPosition({ ...season, records, trophies, matches }, "brasileirao");

  if (position !== 1) {
    return { records, trophies };
  }

  return {
    records: markChampion(records, "brasileirao"),
    trophies: addTrophy(trophies, "brasileirao")
  };
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
  let records = {
    ...season.records,
    [playedMatch.competitionId]: recordResult(season.records[playedMatch.competitionId], result)
  };
  let trophies = [...season.trophies];
  let matches = season.matches.map((matchItem) => (matchItem.id === matchId ? { ...matchItem, result } : matchItem));

  const groupDecision = decideGroupStage(season, records, matches, playedMatch, matchIndex);
  records = groupDecision.records;
  matches = groupDecision.matches;

  const knockoutDecision = decideKnockout(records, trophies, matches, playedMatch, matchIndex, result);
  records = knockoutDecision.records;
  trophies = knockoutDecision.trophies;
  matches = knockoutDecision.matches;

  const brasileiraoDecision = decideBrasileiraoTitle(season, records, trophies, matches);
  records = brasileiraoDecision.records;
  trophies = brasileiraoDecision.trophies;

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
    const standings = [userRow, ...fakeStandingRows(competitionId, record.played, season.id)].sort(compareStandingRows);

    return {
      id: competitionId,
      name: competitionNames[competitionId],
      record,
      standings
    };
  });
}
