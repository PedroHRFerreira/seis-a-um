import { getPlayStyle } from "@/game/teamStrength";
import { createSeededRandom } from "@/game/random";
import { getPlayerState } from "@/game/playerState";
import { calculateTeamStrength, opponentDifficultyBonus } from "@/game/teamStrength";
import { IMatchEvent, IMatchResult, IPlayer, ISeasonMatch, ISeasonState } from "@/types/game";
import { clamp } from "@/utils/format";

function goalChance(attack: number, defense: number) {
  return Math.max(0.08, Math.min(0.42, 0.19 + (attack - defense) / 180));
}

function buildGoalEvent(minute: number, team: "user" | "opponent", scorer: string, teamName: string): IMatchEvent {
  return {
    minute,
    type: "goal",
    team,
    playerName: scorer,
    description: `${teamName}: gol de ${scorer}`
  };
}

const opponentScorers: Record<string, string[]> = {
  FLA: ["Pedro", "Arrascaeta", "Bruno Henrique", "Luiz Araújo"],
  PAL: ["Rony", "Raphael Veiga", "Flaco López", "Dudu"],
  BOT: ["Tiquinho Soares", "Savarino", "Luiz Henrique", "Jeffinho"],
  SAO: ["Luciano", "Calleri", "Lucas Moura", "Ferreira"],
  COR: ["Yuri Alberto", "Memphis Depay", "Rodrigo Garro", "Romero"],
  INT: ["Alan Patrick", "Borré", "Wanderson", "Valencia"],
  GRE: ["Cristaldo", "Diego Costa", "Soteldo", "Pavón"],
  FLU: ["Cano", "Jhon Arias", "Keno", "Ganso"],
  CAM: ["Hulk", "Paulinho", "Gustavo Scarpa", "Deyverson"],
  CRU: ["Matheus Pereira", "Kaio Jorge", "Lautaro Díaz", "Gabriel Veron"],
  BOC: ["Merentiel", "Cavani", "Zenón", "Langoni"],
  RIV: ["Borja", "Colidio", "Nacho Fernández", "Echeverri"],
  RMA: ["Cristiano Ronaldo", "Benzema", "Bale", "Isco"],
  BAR: ["Messi", "Villa", "Pedro", "Xavi"],
  SAN: ["Pelé", "Coutinho", "Pepe", "Dorval"],
  MIL: ["Van Basten", "Gullit", "Donadoni", "Rijkaard"],
  BAY: ["Lewandowski", "Müller", "Gnabry", "Coman"],
  MCI: ["Haaland", "De Bruyne", "Foden", "Bernardo Silva"]
};

const fallbackOpponentScorers = ["Rafael Lima", "Bruno Duarte", "Lucas Mendes", "Matheus Oliveira", "Felipe Andrade", "João Pedro"];

function opponentScorerName(shortName: string, random: ReturnType<typeof createSeededRandom>) {
  return random.pick(opponentScorers[shortName] ?? fallbackOpponentScorers);
}

export function applyCardToDiscipline(currentYellowCards: number, directRed = false) {
  if (directRed) {
    return {
      yellowCards: currentYellowCards,
      redCard: true,
      eventType: "redCard" as const
    };
  }

  const yellowCards = currentYellowCards + 1;

  return {
    yellowCards,
    redCard: yellowCards >= 2,
    eventType: yellowCards >= 2 ? ("secondYellow" as const) : ("yellowCard" as const)
  };
}

function buildCardEvent(
  minute: number,
  team: "user" | "opponent",
  playerName: string,
  eventType: "yellowCard" | "secondYellow" | "redCard",
  playerId?: string
): IMatchEvent {
  const labels = {
    yellowCard: "cartão amarelo",
    secondYellow: "segundo amarelo e expulsão",
    redCard: "cartão vermelho"
  };

  return {
    minute,
    type: eventType,
    team,
    playerId,
    playerName,
    description: `${playerName} recebe ${labels[eventType]}`
  };
}

function buildUserCardEvents(random: ReturnType<typeof createSeededRandom>, players: IPlayer[]) {
  const events: IMatchEvent[] = [];
  const yellowCards = new Map<string, number>();

  if (players.length === 0) {
    return events;
  }

  const attempts = random.next() < 0.66 ? random.int(1, 3) : 0;

  for (let index = 0; index < attempts; index += 1) {
    const directRed = random.next() < 0.12;
    const alreadyBooked = players.filter((player) => (yellowCards.get(player.id) ?? 0) === 1);
    const player = random.next() < 0.24 && alreadyBooked.length > 0 ? random.pick(alreadyBooked) : random.pick(players);
    const applied = applyCardToDiscipline(yellowCards.get(player.id) ?? 0, directRed);
    yellowCards.set(player.id, applied.yellowCards);
    events.push(buildCardEvent(random.int(12, 86), "user", player.name, applied.eventType, player.id));
  }

  return events;
}

function buildOpponentCardEvents(random: ReturnType<typeof createSeededRandom>) {
  const events: IMatchEvent[] = [];
  const yellowCards = new Map<string, number>();
  const attempts = random.next() < 0.62 ? random.int(1, 3) : 0;

  for (let index = 0; index < attempts; index += 1) {
    const directRed = random.next() < 0.1;
    const booked = [...yellowCards.entries()].filter(([, cards]) => cards === 1).map(([name]) => name);
    const playerName = random.next() < 0.22 && booked.length > 0 ? random.pick(booked) : `camisa ${random.int(2, 11)}`;
    const applied = applyCardToDiscipline(yellowCards.get(playerName) ?? 0, directRed);
    yellowCards.set(playerName, applied.yellowCards);
    events.push(buildCardEvent(random.int(12, 86), "opponent", playerName, applied.eventType));
  }

  return events;
}

export function simulateMatch(season: ISeasonState, match: ISeasonMatch, seed: string): IMatchResult {
  const random = createSeededRandom(`${season.id}-${match.id}-${seed}`);
  const userStrength = calculateTeamStrength(season.userTeam);
  const playStyle = getPlayStyle(season.userTeam.playStyleId);
  const activePlayers = ((season.userTeam.starters?.length ?? 0) > 0 ? season.userTeam.starters : season.userTeam.players ?? []).filter(
    (player) => !getPlayerState(season.userTeam, player.id).suspended
  );
  const cardEvents = [...buildUserCardEvents(random, activePlayers), ...buildOpponentCardEvents(random)];
  const userRedCards = cardEvents.filter((event) => event.team === "user" && (event.type === "secondYellow" || event.type === "redCard")).length;
  const opponentRedCards = cardEvents.filter((event) => event.team === "opponent" && (event.type === "secondYellow" || event.type === "redCard")).length;
  const opponentStrength = clamp(
    match.opponent.strength + opponentDifficultyBonus(season.userTeam.difficulty) + random.int(-2, 2),
    50,
    99
  );
  const userRedPenalty = userRedCards * 7;
  const opponentRedPenalty = opponentRedCards * 7;
  const userAttack = clamp(userStrength.attack + playStyle.tempoBonus - userRedPenalty, 1, 99);
  const userDefenseWall = clamp((userStrength.defense + userStrength.goalkeeper) / 2 - userRedPenalty, 1, 99);
  const opponentAttack = clamp(opponentStrength + random.int(-4, 4) - opponentRedPenalty, 1, 99);
  const opponentDefense = clamp(opponentStrength + random.int(-3, 3) - opponentRedPenalty, 1, 99);
  const events: IMatchEvent[] = [
    {
      minute: 0,
      type: "tactical",
      team: "user",
      description: `${season.userTeam.name} inicia em ${getPlayStyle(season.userTeam.playStyleId).name}`
    },
    ...cardEvents
  ];
  let userGoals = 0;
  let opponentGoals = 0;
  const userChances = 5 + random.int(0, 5);
  const opponentChances = 4 + random.int(0, 5);
  const userScorers = activePlayers
    .filter((player) => ["ST", "SS", "LW", "RW", "AM"].includes(player.position))
    .sort((a, b) => b.shooting - a.shooting)
    .slice(0, 6);

  for (let index = 0; index < userChances; index += 1) {
    const minute = random.int(8, 89);

    if (random.next() < goalChance(userAttack, opponentDefense)) {
      const scorer = random.pick(userScorers.length > 0 ? userScorers : activePlayers);
      userGoals += 1;
      events.push(buildGoalEvent(minute, "user", scorer.name, season.userTeam.name));
    } else if (random.next() < 0.35) {
      events.push({
        minute,
        type: random.next() > 0.5 ? "chance" : "save",
        team: "user",
        description: `${season.userTeam.name} cria perigo contra ${match.opponent.shortName}`
      });
    }
  }

  for (let index = 0; index < opponentChances; index += 1) {
    const minute = random.int(8, 89);

    if (random.next() < goalChance(opponentAttack, userDefenseWall)) {
      opponentGoals += 1;
      events.push(buildGoalEvent(minute, "opponent", opponentScorerName(match.opponent.shortName, random), match.opponent.name));
    } else if (random.next() < 0.3) {
      events.push({
        minute,
        type: random.next() > 0.5 ? "chance" : "save",
        team: "opponent",
        description: `${match.opponent.name} responde e exige defesa`
      });
    }
  }

  if (match.isElimination && userGoals === opponentGoals) {
    const userWinsShootout = random.next() > (season.userTeam.difficulty === "challenger" ? 0.56 : 0.48);

    if (userWinsShootout) {
      userGoals += 1;
      events.push({
        minute: 90,
        type: "goal",
        team: "user",
        description: `${season.userTeam.name} decide a eliminatória nos pênaltis`
      });
    } else {
      opponentGoals += 1;
      events.push({
        minute: 90,
        type: "goal",
        team: "opponent",
        description: `${match.opponent.name} decide a eliminatória nos pênaltis`
      });
    }
  }

  return {
    id: `${match.id}-result`,
    userTeamName: season.userTeam.name,
    opponentName: match.opponent.name,
    competitionId: match.competitionId,
    competitionName: match.competitionName,
    round: match.round,
    userGoals,
    opponentGoals,
    events: events.sort((a, b) => a.minute - b.minute),
    userStrength,
    opponentStrength,
    userRedCards,
    opponentRedCards,
    playedAt: new Date().toISOString()
  };
}
