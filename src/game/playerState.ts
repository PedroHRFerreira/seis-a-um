import { IMatchResult, IPlayer, IPlayerRuntimeState, IUserTeam } from "@/types/game";
import { clamp } from "@/utils/format";

const freshState: IPlayerRuntimeState = {
  stamina: 100,
  yellowCards: 0,
  redCard: false,
  suspended: false,
  suspensionMatches: 0
};

export function getTeamPlayers(userTeam: IUserTeam) {
  const starters = userTeam.starters ?? [];
  const bench = userTeam.bench ?? [];

  if (starters.length > 0 || bench.length > 0) {
    return [...starters, ...bench];
  }

  return userTeam.players ?? [];
}

export function createPlayerStates(players: IPlayer[], current?: Record<string, IPlayerRuntimeState>) {
  return players.reduce<Record<string, IPlayerRuntimeState>>((states, player) => {
    states[player.id] = current?.[player.id] ?? { ...freshState };
    return states;
  }, {});
}

export function getPlayerState(userTeam: IUserTeam, playerId: string) {
  return userTeam.playerStates[playerId] ?? freshState;
}

export function withUpdatedUserTeamPlayers(userTeam: IUserTeam, starters: IPlayer[], bench: IPlayer[]): IUserTeam {
  return {
    ...userTeam,
    starters,
    bench,
    players: starters,
    playerStates: createPlayerStates([...starters, ...bench], userTeam.playerStates)
  };
}

export function swapStarterWithBench(userTeam: IUserTeam, starterIndex: number, benchIndex: number): IUserTeam {
  const nextStarters = [...userTeam.starters];
  const nextBench = [...userTeam.bench];
  const starter = nextStarters[starterIndex];
  const reserve = nextBench[benchIndex];

  if (!starter || !reserve) {
    return userTeam;
  }

  nextStarters[starterIndex] = reserve;
  nextBench[benchIndex] = starter;

  return withUpdatedUserTeamPlayers(userTeam, nextStarters, nextBench);
}

export function applyMatchRuntime(userTeam: IUserTeam, result: IMatchResult): IUserTeam {
  const redPlayerIds = result.events
    .filter((event) => event.team === "user" && (event.type === "secondYellow" || event.type === "redCard") && event.playerId)
    .map((event) => event.playerId as string);
  const redSet = new Set(redPlayerIds);
  const starterIds = new Set(userTeam.starters.map((player) => player.id));
  const benchIds = new Set(userTeam.bench.map((player) => player.id));
  const nextStates = createPlayerStates(getTeamPlayers(userTeam), userTeam.playerStates);

  Object.entries(nextStates).forEach(([playerId, state]) => {
    const wasStarter = starterIds.has(playerId);
    const recovery = benchIds.has(playerId) ? 10 : 0;
    const fatigue = wasStarter ? 13 : 0;
    const suspensionMatches = Math.max(0, state.suspensionMatches - 1);

    nextStates[playerId] = {
      ...state,
      stamina: clamp(state.stamina - fatigue + recovery, 35, 100),
      yellowCards: 0,
      redCard: redSet.has(playerId),
      suspended: suspensionMatches > 0,
      suspensionMatches
    };
  });

  redSet.forEach((playerId) => {
    const state = nextStates[playerId] ?? { ...freshState };
    nextStates[playerId] = {
      ...state,
      yellowCards: 0,
      redCard: true,
      suspended: true,
      suspensionMatches: 1
    };
  });

  return {
    ...userTeam,
    playerStates: nextStates
  };
}
