import { describe, expect, it } from "vitest";
import { formations } from "@/data/formations";
import { legendaryTeams } from "@/data/legendaryTeams";
import { getDraftOptions, getDraftTeam } from "@/game/draft";
import { findOpenSlotIndexForPlayer } from "@/game/lineup";
import { applyMatchRuntime, createPlayerStates, swapStarterWithBench } from "@/game/playerState";
import { applyMatchResult, createInitialSeason, getCompetitionStates, getNextMatch, simulateNextMatch, simulateUntilEnd } from "@/game/season";
import { getSeasonSummaries } from "@/game/seasonSummary";
import { applyCardToDiscipline, simulateMatch } from "@/game/simulation";
import { calculateTeamStrength, effectivePlayerOverall } from "@/game/teamStrength";
import { ICompetitionState, IMatchResult, IPlayer, IUserTeam } from "@/types/game";

function draftTeam(seed: string): IUserTeam {
  const formation = formations[0];
  const starters: IPlayer[] = [];
  const bench: IPlayer[] = [];
  const selectedIds = new Set<string>();
  const selectedTeamIds: string[] = [];

  formation.slots.forEach((slot, index) => {
    const options = getDraftOptions(slot.position, index, seed, [...selectedIds]);
    const player = options[0].player;
    starters.push(player);
    selectedIds.add(player.id);
    selectedTeamIds.push(player.legendaryTeamId);
  });

  for (let index = 0; index < 5; index += 1) {
    const team = getDraftTeam(seed, formation.slots.length + index, 0, selectedTeamIds);
    const player = team.players.find((candidate) => !selectedIds.has(candidate.id)) ?? team.players[0];
    bench.push(player);
    selectedIds.add(player.id);
    selectedTeamIds.push(player.legendaryTeamId);
  }

  return {
    name: "Teste FC",
    difficulty: "hard",
    formationId: formation.id,
    playStyleId: "pressao-alta",
    formationMentality: "balanced",
    starters,
    bench,
    players: starters,
    playerStates: createPlayerStates([...starters, ...bench])
  };
}

function resultFor(match: ReturnType<typeof createInitialSeason>["matches"][number], userGoals: number, opponentGoals: number): IMatchResult {
  return {
    id: `${match.id}-manual-result`,
    userTeamName: "Teste FC",
    opponentName: match.opponent.name,
    competitionId: match.competitionId,
    competitionName: match.competitionName,
    round: match.round,
    userGoals,
    opponentGoals,
    events: [],
    userStrength: {
      attack: 90,
      midfield: 90,
      defense: 90,
      goalkeeper: 90,
      overall: 90
    },
    opponentStrength: match.opponent.strength,
    userRedCards: 0,
    opponentRedCards: 0,
    playedAt: "2026-06-27T00:00:00.000Z"
  };
}

describe("offline game engine", () => {
  it("ships 150 teams with 11 players each", () => {
    expect(legendaryTeams).toHaveLength(150);
    expect(legendaryTeams.every((team) => team.players.length === 11)).toBe(true);
    expect(legendaryTeams.filter((team) => team.tier === "worst-campaign")).toHaveLength(50);
  });

  it("creates draft options for different positions", () => {
    expect(getDraftOptions("ST", 0, "seed", [])).toHaveLength(3);
    expect(getDraftOptions("RWB", 1, "seed", [])).toHaveLength(3);
    expect(getDraftOptions("GK", 2, "seed", [])).toHaveLength(3);
  });

  it("rolls a team and places one compatible player into an open formation slot", () => {
    const formation = formations.find((item) => item.id === "4-2-2-2") ?? formations[0];
    const draftTeam = getDraftTeam("free-draft", 0, 0);
    const player = draftTeam.players.find((candidate) => findOpenSlotIndexForPlayer(formation, [], candidate) !== undefined);

    expect(draftTeam.players).toHaveLength(11);
    expect(player).toBeDefined();
    expect(findOpenSlotIndexForPlayer(formation, [], player!)).toBeGreaterThanOrEqual(0);
  });

  it("calculates fifa-like team strength numbers", () => {
    const userTeam = draftTeam("strength");
    const strength = calculateTeamStrength(userTeam);

    expect(strength.overall).toBeGreaterThan(80);
    expect(strength.attack).toBeGreaterThan(75);
    expect(strength.defense).toBeGreaterThan(65);
  });

  it("drafts 11 starters and 5 reserves", () => {
    const userTeam = draftTeam("sixteen");

    expect(userTeam.starters).toHaveLength(11);
    expect(userTeam.bench).toHaveLength(5);
    expect(Object.keys(userTeam.playerStates)).toHaveLength(16);
  });

  it("swaps a starter with a reserve and recalculates position fit", () => {
    const userTeam = draftTeam("swap");
    const swapped = swapStarterWithBench(userTeam, 0, 0);

    expect(swapped.starters[0].id).toBe(userTeam.bench[0].id);
    expect(swapped.bench[0].id).toBe(userTeam.starters[0].id);
    expect(calculateTeamStrength(swapped).overall).toBeLessThanOrEqual(99);
  });

  it("penalizes players out of position and with low stamina", () => {
    const userTeam = draftTeam("penalty");
    const goalkeeper = userTeam.starters[0];
    const outOfPosition = effectivePlayerOverall(goalkeeper, "ST", 100);
    const tired = effectivePlayerOverall(goalkeeper, "GK", 45);

    expect(outOfPosition).toBeLessThan(goalkeeper.overall * 0.8);
    expect(tired).toBeLessThan(goalkeeper.overall);
  });

  it("turns two yellow cards into a red card", () => {
    const first = applyCardToDiscipline(0);
    const second = applyCardToDiscipline(first.yellowCards);

    expect(first.eventType).toBe("yellowCard");
    expect(second.eventType).toBe("secondYellow");
    expect(second.redCard).toBe(true);
  });

  it("suspends a red-carded player for the next match", () => {
    const userTeam = draftTeam("red-card");
    const strength = calculateTeamStrength(userTeam);
    const result: IMatchResult = {
      id: "red-card-result",
      userTeamName: userTeam.name,
      opponentName: "Adversário",
      competitionId: "mineiro",
      competitionName: "Mineiro Módulo I",
      round: "Teste",
      userGoals: 0,
      opponentGoals: 0,
      events: [
        {
          minute: 62,
          type: "redCard",
          team: "user",
          playerId: userTeam.starters[0].id,
          playerName: userTeam.starters[0].name,
          description: "vermelho"
        }
      ],
      userStrength: strength,
      opponentStrength: 70,
      userRedCards: 1,
      opponentRedCards: 0,
      playedAt: "2026-06-27T00:00:00.000Z"
    };
    const suspended = applyMatchRuntime(userTeam, result);
    const served = applyMatchRuntime(suspended, { ...result, id: "served-result", events: [], userRedCards: 0 });

    expect(suspended.playerStates[userTeam.starters[0].id].suspended).toBe(true);
    expect(served.playerStates[userTeam.starters[0].id].suspended).toBe(false);
  });

  it("keeps starters, reserves and runtime state in the season save shape", () => {
    const userTeam = draftTeam("persist");
    const season = createInitialSeason(userTeam, "persist-seed");

    expect(season.userTeam.starters).toHaveLength(11);
    expect(season.userTeam.bench).toHaveLength(5);
    expect(Object.keys(season.userTeam.playerStates)).toHaveLength(16);
  });

  it("builds the 2026 competition formats", () => {
    const userTeam = draftTeam("formats");
    const season = createInitialSeason(userTeam, "formats-seed");
    const mineiro = season.matches.filter((match) => match.competitionId === "mineiro");
    const copaDoBrasil = season.matches.filter((match) => match.competitionId === "copaDoBrasil");
    const libertadores = season.matches.filter((match) => match.competitionId === "libertadores");

    expect(mineiro.filter((match) => match.stage === "group")).toHaveLength(8);
    expect(mineiro.map((match) => match.round)).toEqual([
      "Primeira fase 1",
      "Primeira fase 2",
      "Primeira fase 3",
      "Primeira fase 4",
      "Primeira fase 5",
      "Primeira fase 6",
      "Primeira fase 7",
      "Primeira fase 8",
      "Semifinal ida",
      "Semifinal volta",
      "Final"
    ]);
    expect(copaDoBrasil.map((match) => match.knockoutKey).filter((key, index, keys) => key && keys.indexOf(key) === index)).toHaveLength(9);
    expect(copaDoBrasil.filter((match) => match.knockoutLeg === "single")).toHaveLength(5);
    expect(libertadores.filter((match) => match.stage === "group")).toHaveLength(6);
    expect(libertadores.filter((match) => match.knockoutLeg === "first")).toHaveLength(3);
    expect(libertadores.at(-1)?.round).toBe("Final");
    expect(libertadores.at(-1)?.knockoutLeg).toBe("single");
  });

  it("adds Brasileirao to trophies only when the user finishes first", () => {
    const championTeam = draftTeam("brasileirao-champion");
    let championSeason = createInitialSeason(championTeam, "brasileirao-champion-seed");

    championSeason.matches
      .filter((match) => match.competitionId === "brasileirao")
      .forEach((match) => {
        championSeason = applyMatchResult(championSeason, match.id, resultFor(match, 4, 0));
      });

    expect(championSeason.records.brasileirao.champion).toBe(true);
    expect(championSeason.trophies).toContain("brasileirao");

    const runnerUpTeam = draftTeam("brasileirao-runner-up");
    let runnerUpSeason = createInitialSeason(runnerUpTeam, "brasileirao-runner-up-seed");

    runnerUpSeason.matches
      .filter((match) => match.competitionId === "brasileirao")
      .forEach((match) => {
        runnerUpSeason = applyMatchResult(runnerUpSeason, match.id, resultFor(match, 0, 2));
      });

    expect(runnerUpSeason.records.brasileirao.champion).toBe(false);
    expect(runnerUpSeason.trophies).not.toContain("brasileirao");
  });

  it("awards Copa do Brasil only after the final", () => {
    const userTeam = draftTeam("copa-title");
    let season = createInitialSeason(userTeam, "copa-title-seed");
    const copaMatches = season.matches.filter((match) => match.competitionId === "copaDoBrasil");

    copaMatches.slice(0, -1).forEach((match) => {
      season = applyMatchResult(season, match.id, resultFor(match, 2, 0));
      expect(season.trophies).not.toContain("copaDoBrasil");
    });

    const final = copaMatches.at(-1)!;
    season = applyMatchResult(season, final.id, resultFor(final, 1, 0));

    expect(season.records.copaDoBrasil.champion).toBe(true);
    expect(season.trophies).toContain("copaDoBrasil");
  });

  it("resolves two-legged knockout phases by aggregate", () => {
    const userTeam = draftTeam("aggregate");
    let season = createInitialSeason(userTeam, "aggregate-seed");
    const [firstLeg, secondLeg] = season.matches.filter((match) => match.competitionId === "copaDoBrasil" && match.knockoutKey === "quinta");

    season = applyMatchResult(season, firstLeg.id, resultFor(firstLeg, 0, 2));
    season = applyMatchResult(season, secondLeg.id, resultFor(secondLeg, 1, 0));

    expect(season.records.copaDoBrasil.eliminated).toBe(true);
    expect(season.matches.find((match) => match.competitionId === "copaDoBrasil" && match.round === "Oitavas ida")?.skipped).toBe(true);
  });

  it("simulates knockout draws with a penalty winner", () => {
    const userTeam = draftTeam("shootout");
    const season = createInitialSeason(userTeam, "shootout-seed");
    const knockout = season.matches.find((match) => match.competitionId === "copaDoBrasil" && match.round === "1ª fase")!;
    const draws = Array.from({ length: 40 }, (_, index) => simulateMatch(season, knockout, `shootout-${index}`)).filter(
      (result) => result.events.some((event) => event.description.includes("pênaltis"))
    );

    expect(draws.length).toBeGreaterThan(0);
    expect(draws.every((result) => result.userGoals !== result.opponentGoals)).toBe(true);
  });

  it("simulates matches deterministically with a seed", () => {
    const userTeam = draftTeam("season");
    const seasonA = createInitialSeason(userTeam, "same-seed");
    const seasonB = createInitialSeason(userTeam, "same-seed");
    const resultA = simulateNextMatch(seasonA, "match-seed").result;
    const resultB = simulateNextMatch(seasonB, "match-seed").result;

    expect(resultA?.userGoals).toBe(resultB?.userGoals);
    expect(resultA?.opponentGoals).toBe(resultB?.opponentGoals);
    expect(resultA?.opponentName).toBe(resultB?.opponentName);
  });

  it("uses player names for opponent goals", () => {
    const userTeam = draftTeam("opponent-scorer");
    const season = createInitialSeason(userTeam, "opponent-scorer-seed");
    const match = getNextMatch(season)!;
    const result = Array.from({ length: 60 }, (_, index) => simulateMatch(season, match, `goal-${index}`)).find((candidate) =>
      candidate.events.some((event) => event.team === "opponent" && event.type === "goal")
    );
    const opponentGoal = result?.events.find((event) => event.team === "opponent" && event.type === "goal");

    expect(opponentGoal).toBeDefined();
    expect(opponentGoal?.description.toLowerCase()).not.toContain("camisa");
    expect(opponentGoal?.playerName).toBeTruthy();
  });

  it("can jump to the end of the season", () => {
    const userTeam = draftTeam("finish");
    const season = createInitialSeason(userTeam, "finish-seed");
    const finished = simulateUntilEnd(season, "finish-now");

    expect(finished.finished).toBe(true);
    expect(finished.matches.some((match) => match.result)).toBe(true);
  });

  it("builds final summaries with Brasileirao position and tables", () => {
    const userTeam = draftTeam("summary");
    const season = createInitialSeason(userTeam, "summary-seed");
    const finished = simulateUntilEnd(season, "summary-now");
    const summaries = getSeasonSummaries(finished, getCompetitionStates(finished));
    const brasileirao = summaries.find((summary) => summary.competitionId === "brasileirao");

    expect(brasileirao?.userPosition).toBeGreaterThan(0);
    expect(brasileirao?.headline).toMatch(/colocado|Campeão brasileiro/);
    expect(brasileirao?.table).toHaveLength(20);
    expect(summaries.every((summary) => summary.table.some((row) => row.isUser))).toBe(true);
  });

  it("names the Brasileirao leader as champion in the final summary", () => {
    const userTeam = draftTeam("champion-summary");
    const season = createInitialSeason(userTeam, "champion-summary-seed");
    const brasileiraoState: ICompetitionState = {
      id: "brasileirao",
      name: "Brasileirão 2026",
      record: {
        competitionId: "brasileirao",
        played: 38,
        wins: 25,
        draws: 8,
        losses: 5,
        goalsFor: 72,
        goalsAgainst: 31,
        eliminated: false,
        champion: false
      },
      standings: [
        {
          name: userTeam.name,
          played: 38,
          points: 83,
          wins: 25,
          draws: 8,
          losses: 5,
          goalsFor: 72,
          goalsAgainst: 31,
          strength: 0,
          isUser: true
        },
        {
          name: "Flamengo 2026",
          played: 38,
          points: 80,
          wins: 24,
          draws: 8,
          losses: 6,
          goalsFor: 68,
          goalsAgainst: 34,
          strength: 90
        }
      ]
    };
    const [summary] = getSeasonSummaries(season, [brasileiraoState]);

    expect(summary.headline).toBe("Campeão brasileiro");
  });
});
