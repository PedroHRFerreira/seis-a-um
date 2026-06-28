import { ReactNode } from "react";
import { Platform, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme/theme";

interface IScreenShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function ScreenShell({ title, subtitle, children, footer }: IScreenShellProps) {
  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md
  },
  title: {
    color: theme.colors.text,
    fontFamily: theme.typography.headline.fontFamily,
    fontSize: theme.typography.headline.fontSize,
    lineHeight: theme.typography.headline.lineHeight,
    letterSpacing: theme.typography.headline.letterSpacing,
    fontWeight: "400",
    textTransform: "uppercase"
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.bodySmall.fontFamily,
    fontSize: theme.typography.bodySmall.fontSize,
    lineHeight: theme.typography.bodySmall.lineHeight,
    marginTop: theme.spacing.sm
  },
  content: {
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopColor: theme.colors.line,
    borderTopWidth: 1,
    backgroundColor: theme.colors.surface
  }
});
