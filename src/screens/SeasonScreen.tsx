import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "@/components/AppButton";
import { ScreenShell } from "@/components/ScreenShell";
import { getCompetitionStates, getNextMatch } from "@/game/season";
import { theme } from "@/theme/theme";
import { ISeasonState, MatchSpeed } from "@/types/game";
import { competitionLabel } from "@/utils/format";

interface ISeasonScreenProps {
  season: ISeasonState;
  onManageTeam: () => void;
  onPlay: (speed: MatchSpeed) => void;
  onSummary: () => void;
  onReset: () => void;
}

export function SeasonScreen({ season, onManageTeam, onPlay, onSummary, onReset }: ISeasonScreenProps) {
  const nextMatch = getNextMatch(season);
  const competitionStates = getCompetitionStates(season);

  return (
    <ScreenShell
      title="Temporada"
      subtitle={`${season.userTeam.name} | ${season.matches.filter((match) => match.result).length}/${season.matches.length} jogos`}
      footer={
        season.finished ? (
          <AppButton label="Ver resumo final" onPress={onSummary} />
        ) : (
          <View style={styles.footer}>
            <AppButton label="Jogar" onPress={() => onPlay("normal")} style={styles.footerButton} />
            <AppButton label="Rápido" onPress={() => onPlay("fast")} variant="secondary" style={styles.footerButton} />
            <AppButton label="Final" onPress={() => onPlay("finish")} variant="ghost" style={styles.footerButton} />
          </View>
        )
      }
    >
      <AppButton label="Meu time" onPress={onManageTeam} variant="secondary" />

      <View style={styles.nextCard}>
        <Text style={styles.kicker}>Próximo jogo</Text>
        {nextMatch ? (
          <>
            <Text style={styles.nextTitle}>{nextMatch.opponent.name}</Text>
            <Text style={styles.nextMeta}>{nextMatch.competitionName} | {nextMatch.round}</Text>
            <Text style={styles.startHint}>Toque em Jogar para começar a partida.</Text>
          </>
        ) : (
          <Text style={styles.nextMeta}>Temporada encerrada.</Text>
        )}
      </View>

      {season.trophies.length > 0 ? (
        <View style={styles.trophyCard}>
          <Text style={styles.kicker}>Títulos</Text>
          <Text style={styles.trophyText}>{season.trophies.map(competitionLabel).join(" | ")}</Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Campanha</Text>
        {competitionStates.map((competition) => (
          <View key={competition.id} style={styles.competitionCard}>
            <View style={styles.competitionHeader}>
              <Text style={styles.competitionTitle}>{competition.name}</Text>
              <Text style={styles.status}>
                {competition.record.champion ? "Campeão" : competition.record.eliminated ? "Eliminado" : "Em disputa"}
              </Text>
            </View>
            <Text style={styles.record}>
              {competition.record.played}J {competition.record.wins}V {competition.record.draws}E {competition.record.losses}D |
              {" "}{competition.record.goalsFor} a favor / {competition.record.goalsAgainst} contra
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Calendário</Text>
        {season.matches.slice(Math.max(0, season.currentMatchIndex - 2), season.currentMatchIndex + 5).map((match) => (
          <View key={match.id} style={styles.matchLine}>
            <View style={styles.matchText}>
              <Text style={styles.matchRound}>{match.round}</Text>
              <Text style={styles.matchOpponent}>{match.opponent.name}</Text>
            </View>
            <Text style={styles.matchResult}>
              {match.skipped ? "fora" : match.result ? `${match.result.userGoals} x ${match.result.opponentGoals}` : "próx."}
            </Text>
          </View>
        ))}
      </View>

      <AppButton label="Apagar save" onPress={onReset} variant="danger" />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  nextCard: {
    gap: theme.spacing.sm,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.neon,
    backgroundColor: theme.colors.surface
  },
  kicker: {
    color: theme.colors.lime,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 12,
    fontWeight: "900"
  },
  nextTitle: {
    color: theme.colors.text,
    fontFamily: theme.typography.headlineMobile.fontFamily,
    fontSize: theme.typography.headlineMobile.fontSize,
    lineHeight: theme.typography.headlineMobile.lineHeight,
    letterSpacing: theme.typography.headlineMobile.letterSpacing,
    fontWeight: "400",
    textTransform: "uppercase"
  },
  nextMeta: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.bodySmall.fontFamily,
    lineHeight: 20
  },
  startHint: {
    color: theme.colors.text,
    fontFamily: theme.typography.label.fontFamily,
    fontWeight: "900",
    lineHeight: 20
  },
  trophyCard: {
    gap: theme.spacing.xs,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.cardElevated,
    borderWidth: 1,
    borderColor: theme.colors.lime
  },
  trophyText: {
    color: theme.colors.text,
    fontFamily: theme.typography.label.fontFamily,
    fontWeight: "900"
  },
  section: {
    gap: theme.spacing.sm
  },
  sectionTitle: {
    color: theme.colors.text,
    fontFamily: theme.typography.headlineMobile.fontFamily,
    fontWeight: "900",
    fontSize: 18
  },
  competitionCard: {
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.card
  },
  competitionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.md
  },
  competitionTitle: {
    flex: 1,
    color: theme.colors.text,
    fontFamily: theme.typography.label.fontFamily,
    fontWeight: "900"
  },
  status: {
    color: theme.colors.neon,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 12,
    fontWeight: "900"
  },
  record: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.bodySmall.fontFamily,
    fontSize: 12
  },
  matchLine: {
    minHeight: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.line,
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md
  },
  matchText: {
    flex: 1
  },
  matchRound: {
    color: theme.colors.textDim,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 11,
    fontWeight: "800"
  },
  matchOpponent: {
    color: theme.colors.text,
    fontFamily: theme.typography.bodySmall.fontFamily,
    fontWeight: "800"
  },
  matchResult: {
    color: theme.colors.neon,
    fontFamily: theme.typography.label.fontFamily,
    fontWeight: "900"
  },
  footer: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  footerButton: {
    flex: 1
  }
});
