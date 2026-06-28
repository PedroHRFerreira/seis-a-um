import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "@/components/AppButton";
import { ScreenShell } from "@/components/ScreenShell";
import { getSeasonSummaries } from "@/game/seasonSummary";
import { getCompetitionStates } from "@/game/season";
import { theme } from "@/theme/theme";
import { ISeasonState, IStandingRow } from "@/types/game";
import { competitionLabel } from "@/utils/format";

interface ISummaryScreenProps {
  season: ISeasonState;
  onBack: () => void;
  onRestart: () => void;
}

export function SummaryScreen({ season, onBack, onRestart }: ISummaryScreenProps) {
  const competitionStates = getCompetitionStates(season);
  const summaries = getSeasonSummaries(season, competitionStates);
  const playedMatches = season.matches.filter((match) => match.result);

  return (
    <ScreenShell
      title="Resumo final"
      subtitle={`${season.userTeam.name} encerrou a temporada com ${season.trophies.length} titulo(s).`}
      footer={
        <View style={styles.footer}>
          <AppButton label="Temporada" onPress={onBack} variant="ghost" style={styles.footerButton} />
          <AppButton label="Novo jogo" onPress={onRestart} style={styles.footerButton} />
        </View>
      }
    >
      <View style={styles.hero}>
        <Text style={styles.heroNumber}>{season.trophies.length}</Text>
        <Text style={styles.heroLabel}>títulos</Text>
        <Text style={styles.trophies}>{season.trophies.length > 0 ? season.trophies.map(competitionLabel).join(" | ") : "Nenhum título nesta temporada"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Por competição</Text>
        {summaries.map((summary) => (
          <View key={summary.competitionId} style={styles.recordCard}>
            <Text style={styles.recordTitle}>{summary.title}</Text>
            <Text style={styles.status}>{summary.headline}</Text>
            <Text style={styles.recordText}>{summary.detail}</Text>
            {summary.groupName ? <Text style={styles.groupText}>{summary.groupName} | posição: {summary.userPosition}º</Text> : null}
            <Text style={styles.recordText}>
              {season.records[summary.competitionId].played}J {season.records[summary.competitionId].wins}V {season.records[summary.competitionId].draws}E{" "}
              {season.records[summary.competitionId].losses}D | {season.records[summary.competitionId].goalsFor} a favor /{" "}
              {season.records[summary.competitionId].goalsAgainst} contra
            </Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.tablePosition]}>#</Text>
                <Text style={[styles.tableCell, styles.tableClub]}>Time</Text>
                <Text style={styles.tableCell}>P</Text>
                <Text style={styles.tableCell}>J</Text>
                <Text style={styles.tableCell}>SG</Text>
              </View>
              {summary.table.map((row, index) => (
                <StandingLine key={`${summary.competitionId}-${row.name}`} row={row} index={index} />
              ))}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Últimos jogos</Text>
        {playedMatches.slice(-8).map((match) => (
          <View key={match.id} style={styles.matchLine}>
            <Text style={styles.matchName} numberOfLines={1}>{match.competitionName} | {match.opponent.name}</Text>
            <Text style={styles.matchScore}>{match.result?.userGoals} x {match.result?.opponentGoals}</Text>
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}

function StandingLine({ row, index }: { row: IStandingRow; index: number }) {
  const goalDifference = row.goalsFor - row.goalsAgainst;

  return (
    <View style={[styles.tableRow, row.isUser && styles.userTableRow]}>
      <Text style={[styles.tableCell, styles.tablePosition]}>{index + 1}</Text>
      <Text style={[styles.tableCell, styles.tableClub]} numberOfLines={1}>{row.name}</Text>
      <Text style={styles.tableCell}>{row.points}</Text>
      <Text style={styles.tableCell}>{row.played}</Text>
      <Text style={styles.tableCell}>{goalDifference >= 0 ? `+${goalDifference}` : goalDifference}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    gap: theme.spacing.xs,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.lime
  },
  heroNumber: {
    color: theme.colors.lime,
    fontFamily: theme.typography.display.fontFamily,
    fontSize: 58,
    fontWeight: "400"
  },
  heroLabel: {
    color: theme.colors.text,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 18,
    fontWeight: "900"
  },
  trophies: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.bodySmall.fontFamily,
    textAlign: "center",
    lineHeight: 20
  },
  section: {
    gap: theme.spacing.sm
  },
  sectionTitle: {
    color: theme.colors.text,
    fontFamily: theme.typography.headlineMobile.fontFamily,
    fontSize: 18,
    fontWeight: "900"
  },
  recordCard: {
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.card
  },
  recordTitle: {
    color: theme.colors.text,
    fontFamily: theme.typography.label.fontFamily,
    fontWeight: "900"
  },
  recordText: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.bodySmall.fontFamily
  },
  status: {
    color: theme.colors.neon,
    fontFamily: theme.typography.label.fontFamily,
    fontWeight: "900"
  },
  groupText: {
    color: theme.colors.lime,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 12,
    fontWeight: "900"
  },
  table: {
    gap: 2,
    paddingTop: theme.spacing.sm
  },
  tableHeader: {
    minHeight: 28,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.line
  },
  tableRow: {
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface
  },
  userTableRow: {
    backgroundColor: theme.colors.surfaceStrong,
    borderColor: theme.colors.lime,
    borderWidth: 1
  },
  tableCell: {
    width: 38,
    color: theme.colors.textMuted,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center"
  },
  tablePosition: {
    width: 30,
    color: theme.colors.lime
  },
  tableClub: {
    flex: 1,
    width: undefined,
    color: theme.colors.text,
    textAlign: "left"
  },
  matchLine: {
    flexDirection: "row",
    gap: theme.spacing.md,
    alignItems: "center",
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card
  },
  matchName: {
    flex: 1,
    color: theme.colors.textMuted,
    fontFamily: theme.typography.bodySmall.fontFamily,
    fontWeight: "700"
  },
  matchScore: {
    color: theme.colors.lime,
    fontFamily: theme.typography.label.fontFamily,
    fontWeight: "900"
  },
  footer: {
    flexDirection: "row",
    gap: theme.spacing.md
  },
  footerButton: {
    flex: 1
  }
});
