import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppButton } from "@/components/AppButton";
import { FormationPreview } from "@/components/FormationPreview";
import { PlayerCard } from "@/components/PlayerCard";
import { ScreenShell } from "@/components/ScreenShell";
import { StatBar } from "@/components/StatBar";
import { formations } from "@/data/formations";
import { playStyles } from "@/data/playStyles";
import { getPlayerState, swapStarterWithBench } from "@/game/playerState";
import { calculateTeamStrength, effectivePlayerOverall } from "@/game/teamStrength";
import { theme } from "@/theme/theme";
import { IUserTeam } from "@/types/game";
import { difficultyLabel, positionLabel } from "@/utils/format";

interface ISquadScreenProps {
  userTeam: IUserTeam;
  seasonStarted?: boolean;
  onUpdateTeam: (userTeam: IUserTeam) => void;
  onBackToDraft: () => void;
  onStartSeason: () => void;
}

export function SquadScreen({ userTeam, seasonStarted = false, onUpdateTeam, onBackToDraft, onStartSeason }: ISquadScreenProps) {
  const [selectedStarterIndex, setSelectedStarterIndex] = useState<number | undefined>();
  const [selectedBenchIndex, setSelectedBenchIndex] = useState<number | undefined>();
  const formation = formations.find((item) => item.id === userTeam.formationId) ?? formations[0];
  const playStyle = playStyles.find((item) => item.id === userTeam.playStyleId) ?? playStyles[0];
  const strength = calculateTeamStrength(userTeam, formation, playStyle);
  const suspendedStarters = userTeam.starters.filter((player) => getPlayerState(userTeam, player.id).suspended);

  function substitute() {
    if (selectedStarterIndex === undefined || selectedBenchIndex === undefined) {
      return;
    }

    onUpdateTeam(swapStarterWithBench(userTeam, selectedStarterIndex, selectedBenchIndex));
    setSelectedStarterIndex(undefined);
    setSelectedBenchIndex(undefined);
  }

  return (
    <ScreenShell
      title={userTeam.name}
      subtitle={`${formation.name} | ${playStyle.name} | ${difficultyLabel(userTeam.difficulty)}`}
      footer={
        <View style={styles.footer}>
          <AppButton label={seasonStarted ? "Temporada" : "Draft"} onPress={onBackToDraft} variant="ghost" style={styles.footerButton} />
          <AppButton label={seasonStarted ? "Voltar" : "Começar temporada"} onPress={onStartSeason} style={styles.footerButton} />
        </View>
      }
    >
      <View style={styles.statsCard}>
        <View style={styles.overallBox}>
          <Text style={styles.overall}>{strength.overall}</Text>
          <Text style={styles.overallLabel}>GERAL</Text>
        </View>
        <View style={styles.bars}>
          <StatBar label="Ataque" value={strength.attack} />
          <StatBar label="Meio" value={strength.midfield} />
          <StatBar label="Defesa" value={strength.defense} />
          <StatBar label="Goleiro" value={strength.goalkeeper} />
        </View>
      </View>

      {suspendedStarters.length > 0 ? (
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>Atenção</Text>
          <Text style={styles.warningText}>
            {suspendedStarters.map((player) => player.name).join(", ")} não pode jogar a próxima partida. Toque no titular e em um reserva para trocar.
          </Text>
        </View>
      ) : null}

      <FormationPreview formation={formation} players={userTeam.starters} playStyle={playStyle} mentality={userTeam.formationMentality} title="Meu time" />

      <View style={styles.section}>
        <Text style={styles.lineTitle}>Titulares</Text>
        {userTeam.starters.map((player, index) => {
          const slot = formation.slots[index];
          const state = getPlayerState(userTeam, player.id);
          const effectiveOverall = effectivePlayerOverall(player, slot.position, state.stamina);
          const selected = selectedStarterIndex === index;

          return (
            <Pressable key={`${slot.id}-${player.id}`} onPress={() => setSelectedStarterIndex(index)} style={[styles.selectable, selected && styles.selected]}>
              <PlayerCard
                player={{ ...player, overall: effectiveOverall }}
                detail={`${positionLabel(slot.position)} | fôlego ${state.stamina}%${state.suspended ? " | suspenso" : ""}`}
              />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.lineTitle}>Reservas</Text>
          <AppButton
            label="Trocar"
            onPress={substitute}
            disabled={selectedStarterIndex === undefined || selectedBenchIndex === undefined}
            variant="secondary"
            style={styles.swapButton}
          />
        </View>
        {userTeam.bench.map((player, index) => {
          const state = getPlayerState(userTeam, player.id);
          const selected = selectedBenchIndex === index;

          return (
            <Pressable key={player.id} onPress={() => setSelectedBenchIndex(index)} style={[styles.selectable, selected && styles.selected]}>
              <PlayerCard player={player} detail={`${positionLabel(player.position)} | fôlego ${state.stamina}%`} />
            </Pressable>
          );
        })}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    flexDirection: "row",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.neon,
    backgroundColor: theme.colors.surface
  },
  overallBox: {
    width: 90,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.black,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.lime
  },
  overall: {
    color: theme.colors.lime,
    fontFamily: theme.typography.display.fontFamily,
    fontSize: 44,
    lineHeight: 50,
    fontWeight: "400"
  },
  overallLabel: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 11,
    fontWeight: "900"
  },
  bars: {
    flex: 1,
    gap: theme.spacing.sm
  },
  section: {
    gap: theme.spacing.sm
  },
  sectionHeader: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md
  },
  lineTitle: {
    color: theme.colors.text,
    fontFamily: theme.typography.headlineMobile.fontFamily,
    fontWeight: "900",
    fontSize: 18
  },
  selectable: {
    borderWidth: 1,
    borderColor: "transparent"
  },
  selected: {
    borderColor: theme.colors.lime
  },
  swapButton: {
    minWidth: 110
  },
  warningCard: {
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.dangerSoft,
    backgroundColor: theme.colors.cardElevated
  },
  warningTitle: {
    color: theme.colors.dangerSoft,
    fontFamily: theme.typography.label.fontFamily,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  warningText: {
    color: theme.colors.text,
    fontFamily: theme.typography.bodySmall.fontFamily,
    lineHeight: 20
  },
  footer: {
    flexDirection: "row",
    gap: theme.spacing.md
  },
  footerButton: {
    flex: 1
  }
});
