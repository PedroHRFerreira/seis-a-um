import { Difficulty } from "@/types/game";

export function normalizeDifficulty(difficulty: Difficulty | "hard" | undefined): Difficulty {
  return difficulty === "challenger" ? "challenger" : "normal";
}
