import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme/theme";
import { IPlayer } from "@/types/game";
import { positionLabel } from "@/utils/format";

interface IPlayerCardProps {
  player: IPlayer;
  detail?: string;
}

export function PlayerCard({ player, detail }: IPlayerCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.rating}>
        <Text style={styles.ratingText}>{player.overall}</Text>
        <Text style={styles.position}>{positionLabel(player.position)}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{player.name}</Text>
        {detail ? <Text style={styles.detail} numberOfLines={1}>{detail}</Text> : null}
        <View style={styles.stats}>
          <Text style={styles.stat}>RIT {player.pace}</Text>
          <Text style={styles.stat}>FIN {player.shooting}</Text>
          <Text style={styles.stat}>PAS {player.passing}</Text>
          <Text style={styles.stat}>DEF {player.defending}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.card
  },
  rating: {
    width: 58,
    height: 68,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceStrong,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.neon
  },
  ratingText: {
    color: theme.colors.lime,
    fontFamily: theme.typography.headlineMobile.fontFamily,
    fontSize: 24,
    fontWeight: "400"
  },
  position: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 11,
    fontWeight: "800"
  },
  body: {
    flex: 1,
    justifyContent: "center",
    gap: theme.spacing.xs
  },
  name: {
    color: theme.colors.text,
    fontFamily: theme.typography.bodySmall.fontFamily,
    fontSize: 14,
    fontWeight: "800"
  },
  detail: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.bodySmall.fontFamily,
    fontSize: 12
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm
  },
  stat: {
    color: theme.colors.textDim,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 11,
    fontWeight: "700"
  }
});
