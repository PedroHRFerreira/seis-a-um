import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "@/components/AppButton";
import { ScreenShell } from "@/components/ScreenShell";
import { getNextMatch, simulateNextMatch } from "@/game/season";
import { theme } from "@/theme/theme";
import { IMatchResult, ISeasonState, MatchSpeed } from "@/types/game";
import { clamp, resultLabel } from "@/utils/format";

interface IMatchScreenProps {
  season: ISeasonState;
  speed: MatchSpeed;
  onComplete: (season: ISeasonState) => void;
}

export function MatchScreen({ season, speed, onComplete }: IMatchScreenProps) {
  const nextMatch = getNextMatch(season);
  const simulation = useMemo(() => (nextMatch ? simulateNextMatch(season, `${speed}-${Date.now()}`) : undefined), [nextMatch, season, speed]);
  const result = simulation?.result;
  const [visibleEvents, setVisibleEvents] = useState(0);
  const [done, setDone] = useState(false);
  const liveEvents = result?.events.slice(0, visibleEvents) ?? [];
  const liveUserGoals = liveEvents.filter((event) => event.type === "goal" && event.team === "user").length;
  const liveOpponentGoals = liveEvents.filter((event) => event.type === "goal" && event.team === "opponent").length;
  const stats = result ? liveMatchStats(result, liveEvents.length > 0 ? liveEvents : result.events) : undefined;

  useEffect(() => {
    if (!result) {
      setDone(true);
      return undefined;
    }

    const interval = setInterval(
      () => {
        setVisibleEvents((current) => {
          if (current >= result.events.length) {
            setDone(true);
            clearInterval(interval);
            return current;
          }

          return current + 1;
        });
      },
      speed === "fast" ? 260 : 850
    );

    return () => clearInterval(interval);
  }, [result, speed]);

  if (!nextMatch || !result || !simulation) {
    return (
      <ScreenShell title="Partida" subtitle="Nenhum jogo pendente." footer={<AppButton label="Voltar" onPress={() => onComplete(season)} />}>
        <Text style={styles.muted}>Temporada sem jogos pendentes.</Text>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      title={nextMatch.competitionName}
      subtitle={`${nextMatch.round} | ${nextMatch.opponent.name}`}
      footer={
        <AppButton
          label={done ? "Continuar temporada" : "Jogo em andamento"}
          disabled={!done}
          onPress={() => onComplete(simulation.season)}
        />
      }
    >
      <View style={styles.scoreCard}>
        <Text style={[styles.teamName, styles.userTeamName]}>{season.userTeam.name}</Text>
        <Text style={styles.score}>{liveUserGoals} x {liveOpponentGoals}</Text>
        <Text style={[styles.teamName, styles.opponentTeamName]}>{nextMatch.opponent.name}</Text>
        <Text style={styles.result}>{done ? resultLabel(result.userGoals, result.opponentGoals) : "Ao vivo"}</Text>
      </View>

      {stats ? (
        <View style={styles.statsCard}>
          <MatchStat label="Posse" userValue={`${stats.userPossession}%`} opponentValue={`${stats.opponentPossession}%`} />
          <MatchStat label="Finalizações" userValue={String(stats.userShots)} opponentValue={String(stats.opponentShots)} />
          <MatchStat label="Cartões" userValue={String(stats.userCards)} opponentValue={String(stats.opponentCards)} />
        </View>
      ) : null}

      <View style={styles.events}>
        {liveEvents.length === 0 ? <Text style={styles.waiting}>A bola vai rolar...</Text> : null}
        {liveEvents.map((event, index) => (
          <View
            key={`${event.minute}-${event.description}-${index}`}
            style={[
              styles.eventLine,
              event.team === "user" ? styles.userEventLine : styles.opponentEventLine,
              event.type === "goal" && (event.team === "user" ? styles.userGoalLine : styles.opponentGoalLine),
              isCardEvent(event.type) && styles.cardLine
            ]}
          >
            <Text style={[styles.minute, event.team === "user" ? styles.userMinute : styles.opponentMinute]}>{event.minute}'</Text>
            <View style={styles.eventCopy}>
              <Text style={[styles.eventSide, event.team === "user" ? styles.userEventSide : styles.opponentEventSide]}>
                {event.team === "user" ? "Seu time" : "Adversário"}
              </Text>
              <Text style={styles.eventText}>{event.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}

function liveMatchStats(result: IMatchResult, events: IMatchResult["events"]) {
  const userPossession = clamp(50 + (result.userStrength.midfield - result.opponentStrength) / 3, 35, 65);
  const userShots = events.filter((event) => event.team === "user" && ["goal", "chance", "save"].includes(event.type)).length;
  const opponentShots = events.filter((event) => event.team === "opponent" && ["goal", "chance", "save"].includes(event.type)).length;
  const userCards = events.filter((event) => event.team === "user" && isCardEvent(event.type)).length;
  const opponentCards = events.filter((event) => event.team === "opponent" && isCardEvent(event.type)).length;

  return {
    userPossession,
    opponentPossession: 100 - userPossession,
    userShots,
    opponentShots,
    userCards,
    opponentCards
  };
}

function MatchStat({ label, userValue, opponentValue }: { label: string; userValue: string; opponentValue: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.userStat}>{userValue}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.opponentStat}>{opponentValue}</Text>
    </View>
  );
}

function isCardEvent(type: string) {
  return type === "yellowCard" || type === "secondYellow" || type === "redCard" || type === "card";
}

const styles = StyleSheet.create({
  scoreCard: {
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.neon
  },
  teamName: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.label.fontFamily,
    fontWeight: "900",
    textAlign: "center"
  },
  userTeamName: {
    color: theme.colors.lime
  },
  opponentTeamName: {
    color: theme.colors.amber
  },
  score: {
    color: theme.colors.text,
    fontFamily: theme.typography.display.fontFamily,
    fontSize: 54,
    lineHeight: 60,
    fontWeight: "400"
  },
  result: {
    color: theme.colors.lime,
    fontFamily: theme.typography.label.fontFamily,
    fontWeight: "900"
  },
  statsCard: {
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.card
  },
  statRow: {
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md
  },
  statLabel: {
    flex: 1,
    color: theme.colors.textMuted,
    fontFamily: theme.typography.label.fontFamily,
    fontWeight: "900",
    textAlign: "center",
    textTransform: "uppercase"
  },
  userStat: {
    width: 72,
    color: theme.colors.lime,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "left"
  },
  opponentStat: {
    width: 72,
    color: theme.colors.amber,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "right"
  },
  events: {
    gap: theme.spacing.sm
  },
  waiting: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.bodySmall.fontFamily,
    textAlign: "center",
    fontWeight: "800",
    padding: theme.spacing.md
  },
  eventLine: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.card
  },
  userEventLine: {
    borderColor: "rgba(161, 212, 148, 0.32)"
  },
  opponentEventLine: {
    borderColor: "rgba(255, 180, 168, 0.32)"
  },
  userGoalLine: {
    borderColor: theme.colors.neon,
    backgroundColor: theme.colors.surfaceStrong
  },
  opponentGoalLine: {
    borderColor: theme.colors.dangerSoft,
    backgroundColor: "rgba(206, 3, 1, 0.18)"
  },
  cardLine: {
    borderColor: theme.colors.amber,
    backgroundColor: theme.colors.cardElevated
  },
  minute: {
    width: 34,
    color: theme.colors.lime,
    fontFamily: theme.typography.label.fontFamily,
    fontWeight: "900"
  },
  userMinute: {
    color: theme.colors.lime
  },
  opponentMinute: {
    color: theme.colors.amber
  },
  eventCopy: {
    flex: 1,
    gap: 2
  },
  eventSide: {
    color: theme.colors.text,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 12,
    fontWeight: "900"
  },
  userEventSide: {
    color: theme.colors.lime
  },
  opponentEventSide: {
    color: theme.colors.amber
  },
  eventText: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.bodySmall.fontFamily,
    lineHeight: 20
  },
  muted: {
    color: theme.colors.textMuted
  }
});
