import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FormationPreview } from "@/components/FormationPreview";
import { PlayerCard } from "@/components/PlayerCard";
import { ScreenShell } from "@/components/ScreenShell";
import { AppButton } from "@/components/AppButton";
import { formations } from "@/data/formations";
import { getDraftTeam } from "@/game/draft";
import { filledSlots, playerCanEnterFormation } from "@/game/lineup";
import { theme } from "@/theme/theme";
import { FormationMentality, IPlayer } from "@/types/game";
import { positionLabel } from "@/utils/format";

interface IDraftScreenProps {
  teamName: string;
  formationId: string;
  mentality: FormationMentality;
  selectedPlayers: Array<IPlayer | undefined>;
  benchPlayers: IPlayer[];
  onPick: (player: IPlayer) => void;
  onBack: () => void;
}

export function DraftScreen({ teamName, formationId, mentality, selectedPlayers, benchPlayers, onPick, onBack }: IDraftScreenProps) {
  const [rerollsUsed, setRerollsUsed] = useState(0);
  const formation = useMemo(() => formations.find((item) => item.id === formationId) ?? formations[0], [formationId]);
  const starterCount = filledSlots(selectedPlayers);
  const pickIndex = starterCount + benchPlayers.length;
  const startersComplete = starterCount >= formation.slots.length;
  const draftComplete = startersComplete && benchPlayers.length >= 5;
  const filledPlayers = selectedPlayers.filter((player): player is IPlayer => Boolean(player));
  const selectedPlayerIds = [...filledPlayers, ...benchPlayers].map((player) => player.id);
  const selectedTeamIds = [...filledPlayers, ...benchPlayers].map((player) => player.legendaryTeamId);
  const draftTeam = useMemo(
    () => getDraftTeam(`${teamName}-${formation.id}`, pickIndex, rerollsUsed, selectedTeamIds),
    [formation.id, pickIndex, rerollsUsed, selectedTeamIds, teamName]
  );
  const remainingRerolls = Math.max(0, 3 - rerollsUsed);

  if (draftComplete) {
    return (
      <ScreenShell title="Draft completo" subtitle="Seu elenco está fechado com titulares e reservas." footer={<AppButton label="Voltar" onPress={onBack} />}>
        <Text style={styles.empty}>Escalação pronta.</Text>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      title="Draft"
      subtitle={
        startersComplete
          ? `${teamName} | reservas | escolha 1 jogador do time sorteado (${benchPlayers.length + 1}/5).`
          : `${teamName} | ${formation.name} | escolha 1 jogador do time sorteado (${starterCount + 1}/11).`
      }
      footer={<AppButton label="Voltar" onPress={onBack} variant="ghost" />}
    >
      <View style={styles.progress}>
        <View style={[styles.progressFill, { width: `${(pickIndex / 16) * 100}%` }]} />
      </View>

      <FormationPreview formation={formation} players={selectedPlayers} mentality={mentality} title="Sua formação" />

      <View style={styles.teamCard}>
        <View style={styles.teamHeader}>
          <View style={styles.teamCopy}>
            <Text style={styles.teamKicker}>Time sorteado</Text>
            <Text style={styles.teamTitle}>{draftTeam.club} {draftTeam.yearLabel ?? draftTeam.year}</Text>
            <Text style={styles.teamMeta}>{draftTeam.country} | overall base {draftTeam.baseOverall}</Text>
          </View>
          <AppButton
            label={`Giros (${remainingRerolls})`}
            onPress={() => setRerollsUsed((current) => current + 1)}
            disabled={remainingRerolls === 0}
            variant="secondary"
            style={styles.spinButton}
          />
        </View>
      </View>

      {draftTeam.players.map((player) => {
        const disabled =
          selectedPlayerIds.includes(player.id) || (!startersComplete && !playerCanEnterFormation(formation, selectedPlayers, player));

        return (
          <Pressable
            key={player.id}
            disabled={disabled}
            onPress={() => {
              onPick(player);
            }}
            style={[styles.option, disabled && styles.optionDisabled]}
          >
            <PlayerCard
              player={player}
              detail={
                disabled
                  ? startersComplete
                    ? "Jogador já escolhido"
                    : "Posição indisponível na formação"
                  : `${draftTeam.club} ${draftTeam.yearLabel ?? draftTeam.year} | toque para escolher`
              }
            />
          </Pressable>
        );
      })}

      <View style={styles.disabledPositions}>
        <Text style={styles.sectionTitle}>Posições preenchidas</Text>
        <View style={styles.positionsGrid}>
          {formation.slots.map((slot, index) => (
            <View key={slot.id} style={[styles.positionBadge, selectedPlayers[index] && styles.positionBadgeFilled]}>
              <Text style={styles.positionBadgeText}>{positionLabel(slot.position)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.picks}>
        <Text style={styles.sectionTitle}>Já escolhidos</Text>
        {pickIndex === 0 ? <Text style={styles.empty}>Nenhum jogador escolhido ainda.</Text> : null}
        {selectedPlayers.map((player, index) => player ? (
          <Text key={player.id} style={styles.pickLine}>
            {index + 1}. {player.name} - {positionLabel(player.position)} {player.overall}
          </Text>
        ) : null)}
        {benchPlayers.map((player, index) => (
          <Text key={player.id} style={styles.pickLine}>
            R{index + 1}. {player.name} - {positionLabel(player.position)} {player.overall}
          </Text>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  progress: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: theme.colors.line
  },
  progressFill: {
    height: 8,
    backgroundColor: theme.colors.lime
  },
  teamCard: {
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.neon,
    backgroundColor: theme.colors.surface
  },
  teamHeader: {
    flexDirection: "row",
    gap: theme.spacing.md,
    alignItems: "center"
  },
  teamCopy: {
    flex: 1,
    gap: theme.spacing.xs
  },
  teamKicker: {
    color: theme.colors.lime,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: theme.typography.label.fontSize,
    fontWeight: "900"
  },
  teamTitle: {
    color: theme.colors.text,
    fontFamily: theme.typography.headlineMobile.fontFamily,
    fontSize: theme.typography.headlineMobile.fontSize,
    lineHeight: theme.typography.headlineMobile.lineHeight,
    letterSpacing: theme.typography.headlineMobile.letterSpacing,
    fontWeight: "400",
    textTransform: "uppercase"
  },
  teamMeta: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.bodySmall.fontFamily
  },
  spinButton: {
    minWidth: 108
  },
  option: {
    borderRadius: theme.radius.md
  },
  optionDisabled: {
    opacity: 0.36
  },
  disabledPositions: {
    gap: theme.spacing.sm
  },
  positionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm
  },
  positionBadge: {
    minWidth: 52,
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.card
  },
  positionBadgeFilled: {
    borderColor: theme.colors.lime,
    backgroundColor: theme.colors.surfaceStrong
  },
  positionBadgeText: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 11,
    fontWeight: "900"
  },
  picks: {
    gap: theme.spacing.xs,
    paddingTop: theme.spacing.md
  },
  sectionTitle: {
    color: theme.colors.text,
    fontFamily: theme.typography.label.fontFamily,
    fontWeight: "900",
    fontSize: 16
  },
  pickLine: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.bodySmall.fontFamily,
    lineHeight: 20
  },
  empty: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.bodySmall.fontFamily,
    lineHeight: 20
  }
});
