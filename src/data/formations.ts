import { IFormation, IFormationSlot, Position } from "@/types/game";

function slot(id: string, label: string, position: Position, line: IFormationSlot["line"]): IFormationSlot {
  return { id, label, position, line };
}

const gk = slot("gk", "GOL", "GK", "gk");

export const formations: IFormation[] = [
  {
    id: "4-3-3",
    name: "4-3-3",
    style: "Equilibrada e ofensiva",
    bestFor: "Posse de bola, pressao alta",
    slots: [
      gk,
      slot("rb", "LD", "RB", "defense"),
      slot("cb1", "ZAG", "CB", "defense"),
      slot("cb2", "ZAG", "CB", "defense"),
      slot("lb", "LE", "LB", "defense"),
      slot("cm1", "MC", "CM", "midfield"),
      slot("cm2", "MC", "CM", "midfield"),
      slot("am", "MEI", "AM", "midfield"),
      slot("rw", "PD", "RW", "attack"),
      slot("lw", "PE", "LW", "attack"),
      slot("st", "ATA", "ST", "attack")
    ]
  },
  {
    id: "4-2-3-1",
    name: "4-2-3-1",
    style: "Muito equilibrada",
    bestFor: "Ataque e defesa consistentes",
    slots: [
      gk,
      slot("rb", "LD", "RB", "defense"),
      slot("cb1", "ZAG", "CB", "defense"),
      slot("cb2", "ZAG", "CB", "defense"),
      slot("lb", "LE", "LB", "defense"),
      slot("dm1", "VOL", "DM", "midfield"),
      slot("dm2", "VOL", "DM", "midfield"),
      slot("am", "MEI", "AM", "midfield"),
      slot("rw", "PD", "RW", "attack"),
      slot("lw", "PE", "LW", "attack"),
      slot("st", "ATA", "ST", "attack")
    ]
  },
  {
    id: "4-4-2",
    name: "4-4-2",
    style: "Classica",
    bestFor: "Jogo direto e cruzamentos",
    slots: [
      gk,
      slot("rb", "LD", "RB", "defense"),
      slot("cb1", "ZAG", "CB", "defense"),
      slot("cb2", "ZAG", "CB", "defense"),
      slot("lb", "LE", "LB", "defense"),
      slot("rm", "MD", "RM", "midfield"),
      slot("cm1", "MC", "CM", "midfield"),
      slot("cm2", "MC", "CM", "midfield"),
      slot("lm", "ME", "LM", "midfield"),
      slot("st1", "ATA", "ST", "attack"),
      slot("st2", "ATA", "ST", "attack")
    ]
  },
  {
    id: "3-5-2",
    name: "3-5-2",
    style: "Controle do meio-campo",
    bestFor: "Alas ofensivos e dois atacantes",
    slots: [
      gk,
      slot("cb1", "ZAG", "CB", "defense"),
      slot("cb2", "ZAG", "CB", "defense"),
      slot("cb3", "ZAG", "CB", "defense"),
      slot("rwb", "ALA D", "RWB", "midfield"),
      slot("dm", "VOL", "DM", "midfield"),
      slot("cm", "MC", "CM", "midfield"),
      slot("lwb", "ALA E", "LWB", "midfield"),
      slot("am", "MEI", "AM", "midfield"),
      slot("st1", "ATA", "ST", "attack"),
      slot("st2", "ATA", "ST", "attack")
    ]
  },
  {
    id: "3-4-3",
    name: "3-4-3",
    style: "Muito ofensiva",
    bestFor: "Pressão alta e amplitude",
    slots: [
      gk,
      slot("cb1", "ZAG", "CB", "defense"),
      slot("cb2", "ZAG", "CB", "defense"),
      slot("cb3", "ZAG", "CB", "defense"),
      slot("rm", "MD", "RM", "midfield"),
      slot("cm1", "MC", "CM", "midfield"),
      slot("cm2", "MC", "CM", "midfield"),
      slot("lm", "ME", "LM", "midfield"),
      slot("rw", "PD", "RW", "attack"),
      slot("lw", "PE", "LW", "attack"),
      slot("st", "ATA", "ST", "attack")
    ]
  },
  {
    id: "5-3-2",
    name: "5-3-2",
    style: "Defensiva",
    bestFor: "Contra-ataques rápidos",
    slots: [
      gk,
      slot("rwb", "ALA D", "RWB", "defense"),
      slot("cb1", "ZAG", "CB", "defense"),
      slot("cb2", "ZAG", "CB", "defense"),
      slot("cb3", "ZAG", "CB", "defense"),
      slot("lwb", "ALA E", "LWB", "defense"),
      slot("dm", "VOL", "DM", "midfield"),
      slot("cm", "MC", "CM", "midfield"),
      slot("am", "MEI", "AM", "midfield"),
      slot("st1", "ATA", "ST", "attack"),
      slot("st2", "ATA", "ST", "attack")
    ]
  },
  {
    id: "5-4-1",
    name: "5-4-1",
    style: "Muito defensiva",
    bestFor: "Fechar espaços",
    slots: [
      gk,
      slot("rwb", "ALA D", "RWB", "defense"),
      slot("cb1", "ZAG", "CB", "defense"),
      slot("cb2", "ZAG", "CB", "defense"),
      slot("cb3", "ZAG", "CB", "defense"),
      slot("lwb", "ALA E", "LWB", "defense"),
      slot("rm", "MD", "RM", "midfield"),
      slot("cm1", "MC", "CM", "midfield"),
      slot("cm2", "MC", "CM", "midfield"),
      slot("lm", "ME", "LM", "midfield"),
      slot("st", "ATA", "ST", "attack")
    ]
  },
  {
    id: "4-1-2-1-2",
    name: "4-1-2-1-2",
    style: "Posse e triangulações",
    bestFor: "Jogo pelo centro",
    slots: [
      gk,
      slot("rb", "LD", "RB", "defense"),
      slot("cb1", "ZAG", "CB", "defense"),
      slot("cb2", "ZAG", "CB", "defense"),
      slot("lb", "LE", "LB", "defense"),
      slot("dm", "VOL", "DM", "midfield"),
      slot("cm1", "MC", "CM", "midfield"),
      slot("cm2", "MC", "CM", "midfield"),
      slot("am", "MEI", "AM", "midfield"),
      slot("st1", "ATA", "ST", "attack"),
      slot("st2", "ATA", "ST", "attack")
    ]
  },
  {
    id: "4-3-1-2",
    name: "4-3-1-2",
    style: "Criatividade",
    bestFor: "Meia-armador classico",
    slots: [
      gk,
      slot("rb", "LD", "RB", "defense"),
      slot("cb1", "ZAG", "CB", "defense"),
      slot("cb2", "ZAG", "CB", "defense"),
      slot("lb", "LE", "LB", "defense"),
      slot("cm1", "MC", "CM", "midfield"),
      slot("cm2", "MC", "CM", "midfield"),
      slot("cm3", "MC", "CM", "midfield"),
      slot("am", "MEI", "AM", "midfield"),
      slot("st1", "ATA", "ST", "attack"),
      slot("st2", "ATA", "ST", "attack")
    ]
  },
  {
    id: "4-5-1",
    name: "4-5-1",
    style: "Controle do meio",
    bestFor: "Posse de bola e compactação",
    slots: [
      gk,
      slot("rb", "LD", "RB", "defense"),
      slot("cb1", "ZAG", "CB", "defense"),
      slot("cb2", "ZAG", "CB", "defense"),
      slot("lb", "LE", "LB", "defense"),
      slot("rm", "MD", "RM", "midfield"),
      slot("cm1", "MC", "CM", "midfield"),
      slot("cm2", "MC", "CM", "midfield"),
      slot("cm3", "MC", "CM", "midfield"),
      slot("lm", "ME", "LM", "midfield"),
      slot("st", "ATA", "ST", "attack")
    ]
  },
  {
    id: "4-1-4-1",
    name: "4-1-4-1",
    style: "Pressão e equilíbrio",
    bestFor: "Marcacao intensa",
    slots: [
      gk,
      slot("rb", "LD", "RB", "defense"),
      slot("cb1", "ZAG", "CB", "defense"),
      slot("cb2", "ZAG", "CB", "defense"),
      slot("lb", "LE", "LB", "defense"),
      slot("dm", "VOL", "DM", "midfield"),
      slot("rm", "MD", "RM", "midfield"),
      slot("cm1", "MC", "CM", "midfield"),
      slot("cm2", "MC", "CM", "midfield"),
      slot("lm", "ME", "LM", "midfield"),
      slot("st", "ATA", "ST", "attack")
    ]
  },
  {
    id: "3-4-1-2",
    name: "3-4-1-2",
    style: "Criativa",
    bestFor: "Dois atacantes com camisa 10",
    slots: [
      gk,
      slot("cb1", "ZAG", "CB", "defense"),
      slot("cb2", "ZAG", "CB", "defense"),
      slot("cb3", "ZAG", "CB", "defense"),
      slot("rm", "MD", "RM", "midfield"),
      slot("cm1", "MC", "CM", "midfield"),
      slot("cm2", "MC", "CM", "midfield"),
      slot("lm", "ME", "LM", "midfield"),
      slot("am", "MEI", "AM", "midfield"),
      slot("st1", "ATA", "ST", "attack"),
      slot("st2", "ATA", "ST", "attack")
    ]
  },
  {
    id: "3-4-2-1",
    name: "3-4-2-1",
    style: "Moderna",
    bestFor: "Dois meias ofensivos atrás do centroavante",
    slots: [
      gk,
      slot("cb1", "ZAG", "CB", "defense"),
      slot("cb2", "ZAG", "CB", "defense"),
      slot("cb3", "ZAG", "CB", "defense"),
      slot("rm", "MD", "RM", "midfield"),
      slot("cm1", "MC", "CM", "midfield"),
      slot("cm2", "MC", "CM", "midfield"),
      slot("lm", "ME", "LM", "midfield"),
      slot("am1", "MEI", "AM", "attack"),
      slot("am2", "MEI", "AM", "attack"),
      slot("st", "ATA", "ST", "attack")
    ]
  },
  {
    id: "4-2-2-2",
    name: "4-2-2-2",
    style: "Vertical",
    bestFor: "Ataques rápidos e compactos",
    slots: [
      gk,
      slot("rb", "LD", "RB", "defense"),
      slot("cb1", "ZAG", "CB", "defense"),
      slot("cb2", "ZAG", "CB", "defense"),
      slot("lb", "LE", "LB", "defense"),
      slot("dm1", "VOL", "DM", "midfield"),
      slot("dm2", "VOL", "DM", "midfield"),
      slot("am1", "MEI", "AM", "midfield"),
      slot("am2", "MEI", "AM", "midfield"),
      slot("st1", "ATA", "ST", "attack"),
      slot("st2", "ATA", "ST", "attack")
    ]
  }
];
