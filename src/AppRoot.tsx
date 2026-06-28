import { useEffect, useMemo, useState } from "react";
import { Anton_400Regular } from "@expo-google-fonts/anton/400Regular";
import { JetBrainsMono_400Regular } from "@expo-google-fonts/jetbrains-mono/400Regular";
import { JetBrainsMono_700Bold } from "@expo-google-fonts/jetbrains-mono/700Bold";
import { useFonts } from "expo-font";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { formations } from "@/data/formations";
import { DraftLineup, findOpenSlotIndexForPlayer, isLineupComplete } from "@/game/lineup";
import { createPlayerStates } from "@/game/playerState";
import { createInitialSeason, simulateUntilEnd } from "@/game/season";
import { clearSeason, loadSeason, saveSeason } from "@/storage/saveStorage";
import { theme } from "@/theme/theme";
import { Difficulty, FormationMentality, IPlayer, ISeasonState, IUserTeam, MatchSpeed } from "@/types/game";
import { DraftScreen } from "@/screens/DraftScreen";
import { HomeScreen } from "@/screens/HomeScreen";
import { MatchScreen } from "@/screens/MatchScreen";
import { SeasonScreen } from "@/screens/SeasonScreen";
import { SetupScreen } from "@/screens/SetupScreen";
import { SquadScreen } from "@/screens/SquadScreen";
import { SummaryScreen } from "@/screens/SummaryScreen";

type Route = "home" | "setup" | "draft" | "squad" | "season" | "match" | "summary";

interface ISetupState {
  name: string;
  difficulty: Difficulty;
  formationId: string;
  playStyleId: string;
  formationMentality: FormationMentality;
}

export function AppRoot() {
  const [fontsLoaded] = useFonts({
    Anton_400Regular,
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold
  });
  const [route, setRoute] = useState<Route>("home");
  const [loading, setLoading] = useState(true);
  const [savedSeason, setSavedSeason] = useState<ISeasonState | undefined>();
  const [season, setSeason] = useState<ISeasonState | undefined>();
  const [setup, setSetup] = useState<ISetupState | undefined>();
  const [selectedPlayers, setSelectedPlayers] = useState<DraftLineup>([]);
  const [benchPlayers, setBenchPlayers] = useState<IPlayer[]>([]);
  const [matchSpeed, setMatchSpeed] = useState<MatchSpeed>("normal");

  useEffect(() => {
    loadSeason()
      .then((loadedSeason) => {
        setSavedSeason(loadedSeason);
      })
      .finally(() => setLoading(false));
  }, []);

  const userTeam = useMemo<IUserTeam | undefined>(() => {
    if (!setup) {
      return undefined;
    }

    const formation = formations.find((item) => item.id === setup.formationId) ?? formations[0];

    if (!isLineupComplete(selectedPlayers, formation) || benchPlayers.length < 5) {
      return undefined;
    }

    const starters = selectedPlayers.filter(Boolean) as IPlayer[];
    const bench = benchPlayers.slice(0, 5);

    return {
      name: setup.name,
      difficulty: setup.difficulty,
      formationId: setup.formationId,
      playStyleId: setup.playStyleId,
      formationMentality: setup.formationMentality,
      starters,
      bench,
      players: starters,
      playerStates: createPlayerStates([...starters, ...bench])
    };
  }, [benchPlayers, selectedPlayers, setup]);

  async function resetEverything() {
    await clearSeason();
    setSavedSeason(undefined);
    setSeason(undefined);
    setSetup(undefined);
    setSelectedPlayers([]);
    setBenchPlayers([]);
    setRoute("home");
  }

  function startNewGame() {
    setSetup(undefined);
    setSelectedPlayers([]);
    setBenchPlayers([]);
    setSeason(undefined);
    setRoute("setup");
  }

  function continueSeason() {
    if (!savedSeason) {
      return;
    }

    setSeason(savedSeason);
    setRoute(savedSeason.finished ? "summary" : "season");
  }

  function completeSetup(nextSetup: ISetupState) {
    setSetup(nextSetup);
    setSelectedPlayers([]);
    setBenchPlayers([]);
    setRoute("draft");
  }

  function pickPlayer(player: IPlayer) {
    if (!setup) {
      return;
    }

    const formation = formations.find((item) => item.id === setup.formationId) ?? formations[0];
    const startersComplete = isLineupComplete(selectedPlayers, formation);

    if (startersComplete) {
      if (benchPlayers.length >= 5 || benchPlayers.some((benchPlayer) => benchPlayer.id === player.id)) {
        return;
      }

      const nextBench = [...benchPlayers, player];
      setBenchPlayers(nextBench);

      if (nextBench.length >= 5) {
        setRoute("squad");
      }

      return;
    }

    const slotIndex = findOpenSlotIndexForPlayer(formation, selectedPlayers, player);
    if (slotIndex === undefined) {
      return;
    }

    const nextPlayers = [...selectedPlayers];
    nextPlayers[slotIndex] = player;
    setSelectedPlayers(nextPlayers);
  }

  async function startSeason() {
    if (!userTeam || userTeam.starters.length !== 11 || userTeam.bench.length !== 5) {
      return;
    }

    const nextSeason = createInitialSeason(userTeam, `${userTeam.name}-${Date.now()}`);
    setSeason(nextSeason);
    setSavedSeason(nextSeason);
    await saveSeason(nextSeason);
    setRoute("season");
  }

  async function updateUserTeam(nextUserTeam: IUserTeam) {
    setSelectedPlayers(nextUserTeam.starters);
    setBenchPlayers(nextUserTeam.bench);

    if (season) {
      const nextSeason = {
        ...season,
        userTeam: nextUserTeam,
        updatedAt: new Date().toISOString()
      };
      setSeason(nextSeason);
      setSavedSeason(nextSeason);
      await saveSeason(nextSeason);
    }
  }

  async function play(speed: MatchSpeed) {
    if (!season) {
      return;
    }

    if (speed === "finish") {
      const finishedSeason = simulateUntilEnd(season, `${season.id}-finish`);
      setSeason(finishedSeason);
      setSavedSeason(finishedSeason);
      await saveSeason(finishedSeason);
      setRoute("summary");
      return;
    }

    setMatchSpeed(speed);
    setRoute("match");
  }

  async function completeMatch(nextSeason: ISeasonState) {
    setSeason(nextSeason);
    setSavedSeason(nextSeason);
    await saveSeason(nextSeason);
    setRoute(nextSeason.finished ? "summary" : "season");
  }

  if (loading || !fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={theme.colors.neon} />
        <Text style={styles.loadingText}>Carregando</Text>
      </View>
    );
  }

  if (route === "setup") {
    return <SetupScreen onBack={() => setRoute("home")} onComplete={completeSetup} />;
  }

  if (route === "draft" && setup) {
    return (
      <DraftScreen
        teamName={setup.name}
        formationId={setup.formationId}
        mentality={setup.formationMentality}
        selectedPlayers={selectedPlayers}
        benchPlayers={benchPlayers}
        onPick={pickPlayer}
        onBack={() => setRoute("setup")}
      />
    );
  }

  if (route === "squad") {
    const squadTeam = season?.userTeam ?? userTeam;

    if (squadTeam) {
      return (
        <SquadScreen
          userTeam={squadTeam}
          seasonStarted={Boolean(season)}
          onUpdateTeam={updateUserTeam}
          onBackToDraft={() => setRoute(season ? "season" : "draft")}
          onStartSeason={season ? () => setRoute("season") : startSeason}
        />
      );
    }
  }

  if (route === "season" && season) {
    return <SeasonScreen season={season} onManageTeam={() => setRoute("squad")} onPlay={play} onSummary={() => setRoute("summary")} onReset={resetEverything} />;
  }

  if (route === "match" && season) {
    return <MatchScreen season={season} speed={matchSpeed} onComplete={completeMatch} />;
  }

  if (route === "summary" && season) {
    return <SummaryScreen season={season} onBack={() => setRoute("season")} onRestart={resetEverything} />;
  }

  return <HomeScreen savedSeason={savedSeason} onStart={startNewGame} onContinue={continueSeason} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background
  },
  loadingText: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.label.fontFamily,
    fontWeight: "800"
  }
});
