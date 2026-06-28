import { DimensionValue, StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme/theme";
import { clamp, percent } from "@/utils/format";

interface IStatBarProps {
  label: string;
  value: number;
}

export function StatBar({ label, value }: IStatBarProps) {
  const width = percent(value) as DimensionValue;

  return (
    <View style={styles.wrapper}>
      <View style={styles.top}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{clamp(value)}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.spacing.xs
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  label: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 12,
    fontWeight: "700"
  },
  value: {
    color: theme.colors.lime,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 13,
    fontWeight: "900"
  },
  track: {
    height: 7,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: theme.colors.line
  },
  fill: {
    height: 7,
    backgroundColor: theme.colors.neon
  }
});
