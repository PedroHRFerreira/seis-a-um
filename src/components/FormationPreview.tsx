import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme/theme";
import { FormationMentality, IFormation, IPlayStyle, IPlayer } from "@/types/game";
import { positionLabel } from "@/utils/format";

interface IFormationPreviewProps {
  formation: IFormation;
  players?: Array<IPlayer | undefined>;
  playStyle?: IPlayStyle;
  mentality?: FormationMentality;
  title?: string;
}

export function FormationPreview({ formation, players = [], playStyle, mentality = "balanced", title = "Campo" }: IFormationPreviewProps) {
  const slots = formation.slots.map((slot, index) => ({
    slot,
    player: players[index],
    point: pointForSlot(formation.slots, index, mentality)
  }));

  return (
    <View style={styles.wrapper}>
      <View style={styles.pitch}>
        <View style={styles.pitchBorder} />
        <View style={styles.centerLine} />
        <View style={styles.centerCircle} />
        <View style={styles.boxTop} />
        <View style={styles.boxBottom} />
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>{title.toUpperCase()}</Text>
          <Text style={styles.bannerSubtitle}>{formation.name}</Text>
        </View>

        {slots.map(({ slot, player, point }, index) => (
          <View key={`${slot.id}-${index}`} style={[styles.slotWrap, { left: `${point.x}%`, top: `${point.y}%` }]}>
            <View style={[styles.slot, point.compact && styles.slotCompact, player && styles.slotFilled]}>
              <Text style={styles.playerIcon}>{player ? String(player.overall) : "?"}</Text>
            </View>
            <View style={[styles.labelBox, player && styles.labelBoxFilled]}>
              <Text style={[styles.slotPosition, player && styles.slotPositionFilled]} numberOfLines={1}>
                {player ? shortName(player.name) : positionLabel(slot.position)}
              </Text>
            </View>
          </View>
        ))}
      </View>
      {playStyle ? (
        <View style={styles.impact}>
          <Text style={styles.impactTitle}>{playStyle.name}</Text>
          <Text style={styles.impactText}>
            ATA {signed(playStyle.attackBonus)} | MEI {signed(playStyle.midfieldBonus)} | DEF {signed(playStyle.defenseBonus)} | {mentalityLabel(mentality)}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function signed(value: number) {
  return value >= 0 ? `+${value}` : String(value);
}

function shortName(name: string) {
  const parts = name.split(" ").filter(Boolean);
  return parts[parts.length - 1] ?? name;
}

function mentalityLabel(mentality: FormationMentality) {
  const labels: Record<FormationMentality, string> = {
    offensive: "ofensivo",
    balanced: "equilibrado",
    defensive: "defensivo"
  };

  return labels[mentality];
}

function pointForSlot(slots: IFormation["slots"], index: number, mentality: FormationMentality) {
  const slot = slots[index];
  const sameLine = slots.filter((item) => item.line === slot.line);
  const lineIndex = slots.slice(0, index + 1).filter((item) => item.line === slot.line).length - 1;
  const x = xForLine(sameLine.length, lineIndex);
  const mentalityOffset: Record<FormationMentality, Record<IFormation["slots"][number]["line"], number>> = {
    offensive: { attack: -4, midfield: -6, defense: -4, gk: -1 },
    balanced: { attack: 0, midfield: 0, defense: 0, gk: 0 },
    defensive: { attack: 4, midfield: 6, defense: 6, gk: 1 }
  };
  const yByLine: Record<IFormation["slots"][number]["line"], number> = {
    attack: 18,
    midfield: 47,
    defense: 70,
    gk: 84
  };

  return {
    x,
    y: yByLine[slot.line] + mentalityOffset[mentality][slot.line],
    compact: sameLine.length >= 5
  };
}

function xForLine(total: number, index: number) {
  if (total === 1) {
    return 50;
  }

  if (total === 2) {
    return index === 0 ? 32 : 68;
  }

  if (total === 3) {
    return [24, 50, 76][index] ?? 50;
  }

  if (total === 4) {
    return [16, 39, 61, 84][index] ?? 50;
  }

  if (total === 5) {
    return [13, 32, 50, 68, 87][index] ?? 50;
  }

  return [10, 26, 42, 58, 74, 90][index] ?? 50;
}

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.card
  },
  pitch: {
    height: 570,
    position: "relative",
    overflow: "visible",
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.pitch
  },
  pitchBorder: {
    position: "absolute",
    left: 12,
    right: 12,
    top: 16,
    bottom: 16,
    borderWidth: 2,
    borderColor: "rgba(216, 222, 208, 0.32)"
  },
  centerLine: {
    position: "absolute",
    left: 12,
    right: 12,
    top: "50%",
    height: 2,
    backgroundColor: "rgba(216, 222, 208, 0.3)"
  },
  centerCircle: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    left: "50%",
    top: "50%",
    marginLeft: -75,
    marginTop: -75,
    borderWidth: 2,
    borderColor: "rgba(216, 222, 208, 0.24)"
  },
  boxTop: {
    position: "absolute",
    width: 210,
    height: 64,
    top: 16,
    left: "50%",
    marginLeft: -105,
    borderBottomWidth: 2,
    borderColor: "rgba(216, 222, 208, 0.3)"
  },
  boxBottom: {
    position: "absolute",
    width: 210,
    height: 64,
    bottom: 16,
    left: "50%",
    marginLeft: -105,
    borderTopWidth: 2,
    borderColor: "rgba(216, 222, 208, 0.3)"
  },
  banner: {
    position: "absolute",
    left: 12,
    right: 12,
    top: 16,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16, 19, 16, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(216, 222, 208, 0.22)"
  },
  bannerTitle: {
    color: theme.colors.text,
    fontFamily: theme.typography.headlineMobile.fontFamily,
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: theme.typography.headlineMobile.letterSpacing,
    textAlign: "center"
  },
  bannerSubtitle: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 11,
    fontWeight: "800"
  },
  slotWrap: {
    position: "absolute",
    width: 68,
    marginLeft: -34,
    alignItems: "center",
    gap: 4
  },
  slot: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(216, 222, 208, 0.68)",
    backgroundColor: "rgba(216, 222, 208, 0.12)"
  },
  slotCompact: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  slotFilled: {
    borderStyle: "solid",
    borderColor: theme.colors.neon,
    backgroundColor: "rgba(161, 70, 60, 0.8)"
  },
  playerIcon: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.headlineMobile.fontFamily,
    fontSize: 22,
    fontWeight: "900"
  },
  labelBox: {
    width: 72,
    minHeight: 28,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: "rgba(216, 222, 208, 0.2)"
  },
  labelBoxFilled: {
    backgroundColor: theme.colors.neon,
    borderColor: theme.colors.surface
  },
  slotPosition: {
    color: theme.colors.text,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 11,
    lineHeight: 13,
    textAlign: "center",
    fontWeight: "900"
  },
  slotPositionFilled: {
    color: theme.colors.black
  },
  impact: {
    gap: theme.spacing.xs,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface
  },
  impactTitle: {
    color: theme.colors.text,
    fontFamily: theme.typography.label.fontFamily,
    fontWeight: "900"
  },
  impactText: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.bodySmall.fontFamily,
    lineHeight: 19
  }
});
