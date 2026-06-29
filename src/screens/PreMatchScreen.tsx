import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "@/components/AppButton";
import { ScreenShell } from "@/components/ScreenShell";
import { getOpponentSquad } from "@/data/opponentSquads";
import { getNextMatch } from "@/game/season";
import { calculateTeamStrength } from "@/game/teamStrength";
import { theme } from "@/theme/theme";
import { CompetitionId, IPlayer, ISeasonState } from "@/types/game";
import { positionLabel } from "@/utils/format";

interface IPreMatchScreenProps {
  season: ISeasonState;
  competitionId: CompetitionId;
  onBack: () => void;
  onStartMatch: () => void;
}

export function PreMatchScreen({ season, competitionId, onBack, onStartMatch }: IPreMatchScreenProps) {
  const nextMatch = getNextMatch(season, competitionId);

  if (!nextMatch) {
    return (
      <ScreenShell title="Pré-jogo" subtitle="Nenhum jogo disponível." footer={<AppButton label="Voltar" onPress={onBack} />}>
        <Text style={styles.muted}>Essa competição não tem partida liberada agora.</Text>
      </ScreenShell>
    );
  }

  const userStrength = calculateTeamStrength(season.userTeam);
  const opponentSquad = getOpponentSquad(nextMatch.opponent);
  const opponentOverall = Math.round(opponentSquad.reduce((sum, player) => sum + player.overall, 0) / opponentSquad.length);

  return (
    <ScreenShell
      title="Pré-jogo"
      subtitle={`${nextMatch.competitionName} | ${nextMatch.round}`}
      footer={
        <View style={styles.footer}>
          <AppButton label="Voltar" onPress={onBack} variant="ghost" style={styles.footerButton} />
          <AppButton label="Jogar partida" onPress={onStartMatch} style={styles.footerButton} />
        </View>
      }
    >
      <View style={styles.matchCard}>
        <View style={styles.teamHeader}>
          <Text style={styles.sideLabel}>Seu time</Text>
          <Text style={styles.teamName}>{season.userTeam.name}</Text>
          <Text style={styles.overall}>OVR {userStrength.overall}</Text>
        </View>
        <Text style={styles.versus}>x</Text>
        <View style={[styles.teamHeader, styles.opponentHeader]}>
          <Text style={styles.sideLabel}>Adversário</Text>
          <Text style={styles.teamName}>{nextMatch.opponent.name}</Text>
          <Text style={styles.overall}>OVR {opponentOverall}</Text>
        </View>
      </View>

      <SquadSection title="Titulares" subtitle={season.userTeam.name} players={season.userTeam.starters} accent="user" />
      <SquadSection title="Reservas" subtitle="Opções no banco" players={season.userTeam.bench} accent="bench" />
      <SquadSection title="Provável adversário" subtitle={nextMatch.opponent.name} players={opponentSquad} accent="opponent" />
    </ScreenShell>
  );
}

function SquadSection({ title, subtitle, players, accent }: { title: string; subtitle: string; players: IPlayer[]; accent: "user" | "bench" | "opponent" }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        </View>
        <Text style={styles.count}>{players.length}</Text>
      </View>
      <View style={styles.playerList}>
        {players.map((player) => (
          <PlayerLine key={player.id} player={player} accent={accent} />
        ))}
      </View>
    </View>
  );
}

function PlayerLine({ player, accent }: { player: IPlayer; accent: "user" | "bench" | "opponent" }) {
  return (
    <View style={styles.playerLine}>
      <View style={[styles.rating, accent === "opponent" ? styles.opponentRating : accent === "bench" ? styles.benchRating : styles.userRating]}>
        <Text style={styles.ratingText}>{player.overall}</Text>
        <Text style={styles.position}>{positionLabel(player.position)}</Text>
      </View>
      <View style={styles.playerCopy}>
        <Text style={styles.playerName} numberOfLines={1}>{player.name}</Text>
        <Text style={styles.playerStats} numberOfLines={1}>
          RIT {player.pace} | FIN {player.shooting} | PAS {player.passing} | DEF {player.defending}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  muted: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.bodySmall.fontFamily
  },
  matchCard: {
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.neon,
    backgroundColor: theme.colors.surface
  },
  teamHeader: {
    gap: theme.spacing.xs
  },
  opponentHeader: {
    alignItems: "flex-end"
  },
  sideLabel: {
    color: theme.colors.textDim,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  teamName: {
    color: theme.colors.text,
    fontFamily: theme.typography.headlineMobile.fontFamily,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "400",
    textTransform: "uppercase"
  },
  overall: {
    color: theme.colors.lime,
    fontFamily: theme.typography.label.fontFamily,
    fontWeight: "900"
  },
  versus: {
    color: theme.colors.amber,
    fontFamily: theme.typography.display.fontFamily,
    fontSize: 34,
    lineHeight: 38,
    textAlign: "center"
  },
  section: {
    gap: theme.spacing.sm
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md
  },
  sectionTitle: {
    color: theme.colors.text,
    fontFamily: theme.typography.headlineMobile.fontFamily,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "400",
    textTransform: "uppercase"
  },
  sectionSubtitle: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.bodySmall.fontFamily,
    fontSize: 12
  },
  count: {
    minWidth: 32,
    color: theme.colors.black,
    backgroundColor: theme.colors.lime,
    fontFamily: theme.typography.label.fontFamily,
    fontWeight: "900",
    textAlign: "center",
    paddingVertical: theme.spacing.xs
  },
  playerList: {
    gap: theme.spacing.sm
  },
  playerLine: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.card
  },
  rating: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1
  },
  userRating: {
    borderColor: theme.colors.lime,
    backgroundColor: theme.colors.surfaceStrong
  },
  benchRating: {
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surface
  },
  opponentRating: {
    borderColor: theme.colors.amber,
    backgroundColor: theme.colors.surfaceStrong
  },
  ratingText: {
    color: theme.colors.text,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 16,
    fontWeight: "900"
  },
  position: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 10,
    fontWeight: "900"
  },
  playerCopy: {
    flex: 1,
    gap: theme.spacing.xs
  },
  playerName: {
    color: theme.colors.text,
    fontFamily: theme.typography.bodySmall.fontFamily,
    fontWeight: "900"
  },
  playerStats: {
    color: theme.colors.textDim,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 10,
    fontWeight: "800"
  },
  footer: {
    flexDirection: "row",
    gap: theme.spacing.md
  },
  footerButton: {
    flex: 1
  }
});
