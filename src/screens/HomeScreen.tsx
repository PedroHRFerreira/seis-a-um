import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { AppButton } from "@/components/AppButton";
import { theme } from "@/theme/theme";
import { ISeasonState } from "@/types/game";

const cover = require("../../assets/images/cover.png");

interface IHomeScreenProps {
  savedSeason?: ISeasonState;
  onStart: () => void;
  onContinue: () => void;
}

export function HomeScreen({ savedSeason, onStart, onContinue }: IHomeScreenProps) {
  return (
    <ImageBackground source={cover} resizeMode="cover" style={styles.background} imageStyle={styles.image}>
      <View style={styles.overlay}>
        <View style={styles.titleBlock}>
          <Text style={styles.kicker}>FUTEBOL LENDÁRIO</Text>
          <Text style={styles.title}>Seis a Um</Text>
          <Text style={styles.subtitle}>Monte seu time, jogue a temporada 2026 e busque o Mundial.</Text>
        </View>
        <View style={styles.actions}>
          {savedSeason ? (
            <AppButton label={`Continuar ${savedSeason.userTeam.name}`} onPress={onContinue} />
          ) : null}
          <AppButton label="Novo jogo" onPress={onStart} variant={savedSeason ? "secondary" : "primary"} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  image: {
    width: "100%",
    height: "100%"
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 88,
    paddingBottom: theme.spacing.xxl,
    backgroundColor: "rgba(2, 4, 3, 0.38)"
  },
  titleBlock: {
    gap: theme.spacing.sm
  },
  kicker: {
    color: theme.colors.lime,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: theme.typography.label.fontSize,
    fontWeight: "900",
    letterSpacing: theme.typography.label.letterSpacing
  },
  title: {
    color: theme.colors.text,
    fontFamily: theme.typography.display.fontFamily,
    fontSize: 54,
    lineHeight: 60,
    letterSpacing: theme.typography.display.letterSpacing,
    fontWeight: "400",
    textTransform: "uppercase"
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.body.fontFamily,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    maxWidth: 300
  },
  actions: {
    gap: theme.spacing.md
  }
});
