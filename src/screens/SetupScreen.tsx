import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { FormationPreview } from "@/components/FormationPreview";
import { ScreenShell } from "@/components/ScreenShell";
import { AppButton } from "@/components/AppButton";
import { formations } from "@/data/formations";
import { playStyles } from "@/data/playStyles";
import { theme } from "@/theme/theme";
import { Difficulty, FormationMentality } from "@/types/game";

interface ISetupScreenProps {
  onBack: () => void;
  onComplete: (setup: {
    name: string;
    difficulty: Difficulty;
    formationId: string;
    playStyleId: string;
    formationMentality: FormationMentality;
  }) => void;
}

export function SetupScreen({ onBack, onComplete }: ISetupScreenProps) {
  const [name, setName] = useState("Meu Time");
  const [difficulty, setDifficulty] = useState<Difficulty>("hard");
  const [formationId, setFormationId] = useState("4-1-2-1-2");
  const [playStyleId, setPlayStyleId] = useState(playStyles[0].id);
  const [formationMentality, setFormationMentality] = useState<FormationMentality>("balanced");
  const selectedFormation = useMemo(() => formations.find((formation) => formation.id === formationId) ?? formations[0], [formationId]);
  const selectedPlayStyle = useMemo(() => playStyles.find((style) => style.id === playStyleId) ?? playStyles[0], [playStyleId]);

  return (
      <ScreenShell
      title="Novo time"
      subtitle="Configure rápido e vá para o draft."
      footer={
        <View style={styles.footer}>
          <AppButton label="Voltar" onPress={onBack} variant="ghost" style={styles.footerButton} />
          <AppButton
            label="Ir para o draft"
            onPress={() => onComplete({ name: name.trim() || "Meu Time", difficulty, formationId, playStyleId, formationMentality })}
            style={styles.footerButton}
          />
        </View>
      }
    >
      <View style={styles.section}>
        <Text style={styles.label}>Nome do time</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Digite o nome"
          placeholderTextColor={theme.colors.textDim}
          style={styles.input}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Dificuldade</Text>
        <View style={styles.row}>
          <Chip label="Difícil" selected={difficulty === "hard"} onPress={() => setDifficulty("hard")} />
          <Chip label="Desafiador" selected={difficulty === "challenger"} onPress={() => setDifficulty("challenger")} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Formação</Text>
        <View style={styles.grid}>
          {formations.map((formation) => (
            <Chip key={formation.id} label={formation.name} selected={formation.id === formationId} onPress={() => setFormationId(formation.id)} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Mentalidade</Text>
        <View style={styles.grid}>
          <Chip label="Ofensivo" selected={formationMentality === "offensive"} onPress={() => setFormationMentality("offensive")} />
          <Chip label="Equilibrado" selected={formationMentality === "balanced"} onPress={() => setFormationMentality("balanced")} />
          <Chip label="Defensivo" selected={formationMentality === "defensive"} onPress={() => setFormationMentality("defensive")} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Estilo de jogo</Text>
        <View style={styles.grid}>
          {playStyles.map((style) => (
            <Chip key={style.id} label={style.name} selected={playStyleId === style.id} onPress={() => setPlayStyleId(style.id)} />
          ))}
        </View>
        <Text style={styles.helper}>{selectedPlayStyle.description}</Text>
      </View>

      <FormationPreview formation={selectedFormation} playStyle={selectedPlayStyle} mentality={formationMentality} title="Prévia da formação" />
    </ScreenShell>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipActive]}>
      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: theme.spacing.sm
  },
  label: {
    color: theme.colors.text,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: theme.typography.label.fontSize,
    lineHeight: theme.typography.label.lineHeight,
    letterSpacing: theme.typography.label.letterSpacing,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  input: {
    minHeight: 52,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    color: theme.colors.text,
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    fontFamily: theme.typography.body.fontFamily,
    fontSize: theme.typography.body.fontSize,
    fontWeight: "700"
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm
  },
  chip: {
    minHeight: 40,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.card
  },
  chipActive: {
    borderColor: theme.colors.neon,
    backgroundColor: theme.colors.surfaceStrong
  },
  chipText: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: theme.typography.label.fontSize,
    fontWeight: "800"
  },
  chipTextActive: {
    color: theme.colors.neon
  },
  helper: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.bodySmall.fontFamily,
    fontSize: theme.typography.bodySmall.fontSize,
    lineHeight: theme.typography.bodySmall.lineHeight
  },
  footer: {
    flexDirection: "row",
    gap: theme.spacing.md
  },
  footerButton: {
    flex: 1
  }
});
