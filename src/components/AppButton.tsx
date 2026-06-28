import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { theme } from "@/theme/theme";

interface IAppButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  style?: ViewStyle;
}

export function AppButton({ label, onPress, variant = "primary", disabled, style }: IAppButtonProps) {
  const lightLabel = variant === "primary" || variant === "danger";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style
      ]}
    >
      <Text style={[styles.label, lightLabel && styles.lightLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderWidth: 1
  },
  primary: {
    backgroundColor: theme.colors.neon,
    borderColor: theme.colors.neon
  },
  secondary: {
    backgroundColor: theme.colors.surfaceStrong,
    borderColor: theme.colors.line
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: theme.colors.line
  },
  danger: {
    backgroundColor: theme.colors.danger,
    borderColor: theme.colors.danger
  },
  label: {
    color: theme.colors.text,
    fontFamily: theme.typography.label.fontFamily,
    fontWeight: "800",
    fontSize: theme.typography.label.fontSize,
    lineHeight: theme.typography.label.lineHeight,
    letterSpacing: theme.typography.label.letterSpacing,
    textTransform: "uppercase"
  },
  lightLabel: {
    color: theme.colors.white
  },
  disabled: {
    opacity: 0.4
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9
  }
});
