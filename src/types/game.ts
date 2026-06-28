export type Position =
  | "GK"
  | "RB"
  | "CB"
  | "LB"
  | "RWB"
  | "LWB"
  | "DM"
  | "CM"
  | "AM"
  | "RM"
  | "LM"
  | "RW"
  | "LW"
  | "SS"
  | "ST";

export type Difficulty = "hard" | "challenger";

export type MatchSpeed = "normal" | "fast" | "finish";

export type FormationMentality = "offensive" | "balanced" | "defensive";

export type TeamTier = "legendary" | "worst-campaign";

export type CompetitionId =
  | "mineiro"
  | "brasileirao"
  | "copaDoBrasil"
  | "libertadores"
  | "mundial";

export interface IPlayerAttributes {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface IPlayer extends IPlayerAttributes {
  id: string;
  name: string;
  position: Position;
  secondaryPositions: Position[];
  overall: number;
  legendaryTeamId: string;
}

export interface IPlayerRuntimeState {
  stamina: number;
  yellowCards: number;
  redCard: boolean;
  suspended: boolean;
  suspensionMatches: number;
}

export interface ILegendaryTeam {
  id: string;
  club: string;
  year: number;
  yearLabel?: string;
  country: string;
  continent: string;
  baseOverall: number;
  tier?: TeamTier;
  players: IPlayer[];
}

export interface IFormationSlot {
  id: string;
  label: string;
  position: Position;
  line: "gk" | "defense" | "midfield" | "attack";
}

export interface IFormation {
  id: string;
  name: string;
  style: string;
  bestFor: string;
  slots: IFormationSlot[];
}

export interface IPlayStyle {
  id: string;
  name: string;
  description: string;
  attackBonus: number;
  midfieldBonus: number;
  defenseBonus: number;
  tempoBonus: number;
}

export interface IUserTeam {
  name: string;
  difficulty: Difficulty;
  formationId: string;
  playStyleId: string;
  formationMentality: FormationMentality;
  starters: IPlayer[];
  bench: IPlayer[];
  playerStates: Record<string, IPlayerRuntimeState>;
  players?: IPlayer[];
}

export interface ITeamStrength {
  attack: number;
  midfield: number;
  defense: number;
  goalkeeper: number;
  overall: number;
}

export interface IDraftOption {
  team: ILegendaryTeam;
  player: IPlayer;
  fit: number;
}

export interface IOpponent {
  id: string;
  name: string;
  shortName: string;
  country: string;
  strength: number;
}

export interface IMatchEvent {
  minute: number;
  type: "goal" | "chance" | "card" | "yellowCard" | "secondYellow" | "redCard" | "save" | "tactical";
  team: "user" | "opponent";
  description: string;
  playerId?: string;
  playerName?: string;
}

export interface IMatchResult {
  id: string;
  userTeamName: string;
  opponentName: string;
  competitionId: CompetitionId;
  competitionName: string;
  round: string;
  userGoals: number;
  opponentGoals: number;
  events: IMatchEvent[];
  userStrength: ITeamStrength;
  opponentStrength: number;
  userRedCards: number;
  opponentRedCards: number;
  playedAt: string;
}

export interface ISeasonMatch {
  id: string;
  competitionId: CompetitionId;
  competitionName: string;
  round: string;
  opponent: IOpponent;
  isElimination: boolean;
  isFinal: boolean;
  locked?: boolean;
  result?: IMatchResult;
  skipped?: boolean;
}

export interface ICompetitionRecord {
  competitionId: CompetitionId;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  eliminated: boolean;
  champion: boolean;
}

export interface IStandingRow {
  name: string;
  played: number;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  strength: number;
  isUser?: boolean;
}

export interface ICompetitionState {
  id: CompetitionId;
  name: string;
  record: ICompetitionRecord;
  standings: IStandingRow[];
}

export interface ISeasonState {
  id: string;
  userTeam: IUserTeam;
  currentMatchIndex: number;
  matches: ISeasonMatch[];
  records: Record<CompetitionId, ICompetitionRecord>;
  trophies: CompetitionId[];
  finished: boolean;
  createdAt: string;
  updatedAt: string;
}
