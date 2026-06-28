import AsyncStorage from "@react-native-async-storage/async-storage";
import { createPlayerStates } from "@/game/playerState";
import { ISeasonState, IUserTeam } from "@/types/game";

const SAVE_KEY = "@seis-a-um/current-season";
let memorySeason: ISeasonState | undefined;

function normalizeUserTeam(userTeam: IUserTeam): IUserTeam {
  const starters = (userTeam.starters?.length ?? 0) > 0 ? userTeam.starters : userTeam.players ?? [];
  const bench = userTeam.bench ?? [];

  return {
    ...userTeam,
    formationMentality: userTeam.formationMentality ?? "balanced",
    starters,
    bench,
    players: starters,
    playerStates: createPlayerStates([...starters, ...bench], userTeam.playerStates ?? {})
  };
}

function normalizeSeason(season: ISeasonState): ISeasonState {
  return {
    ...season,
    userTeam: normalizeUserTeam(season.userTeam)
  };
}

export async function saveSeason(season: ISeasonState) {
  memorySeason = normalizeSeason(season);

  try {
    await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(memorySeason));
  } catch (error) {
    console.warn("Não foi possível salvar no armazenamento nativo. O progresso ficará apenas na memória nesta sessão.", error);
  }
}

export async function loadSeason() {
  let raw: string | null = null;

  try {
    raw = await AsyncStorage.getItem(SAVE_KEY);
  } catch (error) {
    console.warn("Não foi possível acessar o armazenamento nativo. Iniciando sem save local.", error);
    return memorySeason;
  }

  if (!raw) {
    return memorySeason;
  }

  try {
    memorySeason = normalizeSeason(JSON.parse(raw) as ISeasonState);
    return memorySeason;
  } catch {
    await clearSeason();
    return undefined;
  }
}

export async function clearSeason() {
  memorySeason = undefined;

  try {
    await AsyncStorage.removeItem(SAVE_KEY);
  } catch (error) {
    console.warn("Não foi possível limpar o armazenamento nativo.", error);
  }
}
