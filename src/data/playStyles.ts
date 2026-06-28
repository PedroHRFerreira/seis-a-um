import { IPlayStyle } from "@/types/game";

export const playStyles: IPlayStyle[] = [
  {
    id: "posse-compactacao",
    name: "Posse de bola",
    description: "Passe curto, paciência e linhas próximas.",
    attackBonus: 1,
    midfieldBonus: 5,
    defenseBonus: 2,
    tempoBonus: -1
  },
  {
    id: "pressao-alta",
    name: "Pressão alta",
    description: "Rouba a bola perto da área rival e acelera finalizações.",
    attackBonus: 4,
    midfieldBonus: 2,
    defenseBonus: -1,
    tempoBonus: 4
  },
  {
    id: "contra-ataque",
    name: "Contra-ataques rápidos",
    description: "Bloco baixo, transição veloz e ataques em poucos passes.",
    attackBonus: 3,
    midfieldBonus: -1,
    defenseBonus: 3,
    tempoBonus: 5
  }
];
