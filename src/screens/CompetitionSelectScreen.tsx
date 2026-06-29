import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "@/components/AppButton";
import { ScreenShell } from "@/components/ScreenShell";
import { competitionNames } from "@/data/competitions";
import { getCompetitionStates, getNextMatch, isCompetitionUnlocked } from "@/game/season";
import { theme } from "@/theme/theme";
import { CompetitionId, ICompetitionState, ISeasonState } from "@/types/game";

const competitionOrder: CompetitionId[] = ["mineiro", "brasileirao", "copaDoBrasil", "libertadores", "mundial"];

interface ICompetitionSelectScreenProps {
  season: ISeasonState;
  onBack: () => void;
  onPlayCompetition: (competitionId: CompetitionId) => void;
  onSkipCompetition: (competitionId: CompetitionId) => void;
}

export function CompetitionSelectScreen({ season, onBack, onPlayCompetition, onSkipCompetition }: ICompetitionSelectScreenProps) {
  const states = getCompetitionStates(season);

  return (
    <ScreenShell
      title="Competições"
      subtitle="Escolha onde jogar agora ou simule apenas uma competição."
      footer={<AppButton label="Voltar" onPress={onBack} variant="ghost" />}
    >
      {competitionOrder.map((competitionId) => {
        const competition = states.find((item) => item.id === competitionId);

        return competition ? (
          <CompetitionCard
            key={competitionId}
            competition={competition}
            season={season}
            onPlay={() => onPlayCompetition(competitionId)}
            onSkip={() => onSkipCompetition(competitionId)}
          />
        ) : null;
      })}
    </ScreenShell>
  );
}

function CompetitionCard({
  competition,
  season,
  onPlay,
  onSkip
}: {
  competition: ICompetitionState;
  season: ISeasonState;
  onPlay: () => void;
  onSkip: () => void;
}) {
  const unlocked = isCompetitionUnlocked(season, competition.id);
  const nextMatch = getNextMatch(season, competition.id);
  const status = statusLabel(competition, unlocked, Boolean(nextMatch));
  const detail = statusDetail(season, competition, unlocked, nextMatch?.round);

  return (
    <View style={[styles.card, !unlocked && styles.lockedCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.titleBlock}>
          <Text style={styles.kicker}>{status}</Text>
          <Text style={styles.title}>{competitionNames[competition.id]}</Text>
        </View>
        <Text style={[styles.badge, unlocked ? styles.openBadge : styles.lockedBadge]}>{unlocked ? "liberado" : "bloqueado"}</Text>
      </View>

      <Text style={styles.detail}>{detail}</Text>

      <View style={styles.recordRow}>
        <Stat label="J" value={competition.record.played} />
        <Stat label="V" value={competition.record.wins} />
        <Stat label="E" value={competition.record.draws} />
        <Stat label="D" value={competition.record.losses} />
        <Stat label="SG" value={competition.record.goalsFor - competition.record.goalsAgainst} />
      </View>

      <View style={styles.actions}>
        <AppButton label="Jogar próximo" onPress={onPlay} disabled={!unlocked || !nextMatch} style={styles.actionButton} />
        <AppButton label="Pular competição" onPress={onSkip} disabled={!unlocked || !nextMatch} variant="secondary" style={styles.actionButton} />
      </View>
    </View>
  );
}

function statusLabel(competition: ICompetitionState, unlocked: boolean, hasNextMatch: boolean) {
  if (!unlocked) {
    return "Acesso pendente";
  }

  if (competition.record.champion) {
    return "Campeão";
  }

  if (competition.record.eliminated) {
    return "Eliminado";
  }

  return hasNextMatch ? "Próximo desafio" : "Encerrado";
}

function statusDetail(season: ISeasonState, competition: ICompetitionState, unlocked: boolean, nextRound?: string) {
  if (!unlocked) {
    if (competition.id === "libertadores") {
      return "Libertadores libera com G-4 no Brasileirão ou título da Copa do Brasil.";
    }

    return "Mundial libera ao conquistar a Libertadores.";
  }

  if (nextRound) {
    const nextMatch = getNextMatch(season, competition.id);
    return `${nextRound} contra ${nextMatch?.opponent.name ?? "adversário definido"}.`;
  }

  if (competition.record.champion) {
    return "Troféu garantido nesta temporada.";
  }

  if (competition.record.eliminated) {
    return "Campanha encerrada nesta competição.";
  }

  return "Sem jogos pendentes.";
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.card
  },
  lockedCard: {
    opacity: 0.72
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.md
  },
  titleBlock: {
    flex: 1,
    gap: theme.spacing.xs
  },
  kicker: {
    color: theme.colors.lime,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: theme.colors.text,
    fontFamily: theme.typography.headlineMobile.fontFamily,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "400",
    textTransform: "uppercase"
  },
  badge: {
    minWidth: 84,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderWidth: 1,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center",
    textTransform: "uppercase"
  },
  openBadge: {
    color: theme.colors.black,
    borderColor: theme.colors.lime,
    backgroundColor: theme.colors.lime
  },
  lockedBadge: {
    color: theme.colors.textMuted,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceStrong
  },
  detail: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.bodySmall.fontFamily,
    lineHeight: 20
  },
  recordRow: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  stat: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surface
  },
  statValue: {
    color: theme.colors.text,
    fontFamily: theme.typography.label.fontFamily,
    fontWeight: "900"
  },
  statLabel: {
    color: theme.colors.textDim,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 10,
    fontWeight: "900"
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  actionButton: {
    flex: 1
  }
});
