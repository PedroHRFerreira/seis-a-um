import { CompetitionId, IOpponent } from "@/types/game";

export const competitionNames: Record<CompetitionId, string> = {
  mineiro: "Mineiro Módulo I 2026",
  brasileirao: "Brasileirão 2026",
  copaDoBrasil: "Copa do Brasil 2026",
  libertadores: "Libertadores 2026",
  mundial: "Mundial de Clubes"
};

export const mineiroOpponents: IOpponent[] = [
  { id: "cruzeiro-2026", name: "Cruzeiro 2026", shortName: "CRU", country: "Brasil", strength: 88 },
  { id: "atletico-mg-2026", name: "Atletico Mineiro 2026", shortName: "CAM", country: "Brasil", strength: 88 },
  { id: "america-mg-2026", name: "America Mineiro 2026", shortName: "AME", country: "Brasil", strength: 82 },
  { id: "athletic-2026", name: "Athletic Club 2026", shortName: "ATH", country: "Brasil", strength: 78 },
  { id: "pouso-alegre-2026", name: "Pouso Alegre 2026", shortName: "POU", country: "Brasil", strength: 74 },
  { id: "democrata-2026", name: "Democrata GV 2026", shortName: "DEM", country: "Brasil", strength: 73 },
  { id: "uberlandia-2026", name: "Uberlandia 2026", shortName: "UBE", country: "Brasil", strength: 74 },
  { id: "itaguara-2026", name: "Itaguara 2026", shortName: "ITA", country: "Brasil", strength: 71 },
  { id: "tombense-2026", name: "Tombense 2026", shortName: "TOM", country: "Brasil", strength: 77 },
  { id: "betim-2026", name: "Betim 2026", shortName: "BET", country: "Brasil", strength: 75 },
  { id: "patrocinense-2026", name: "Patrocinense 2026", shortName: "CAP", country: "Brasil", strength: 72 }
];

export const brasileiraoOpponents: IOpponent[] = [
  { id: "flamengo-2026", name: "Flamengo 2026", shortName: "FLA", country: "Brasil", strength: 90 },
  { id: "palmeiras-2026", name: "Palmeiras 2026", shortName: "PAL", country: "Brasil", strength: 90 },
  { id: "botafogo-2026", name: "Botafogo 2026", shortName: "BOT", country: "Brasil", strength: 87 },
  { id: "sao-paulo-2026", name: "Sao Paulo 2026", shortName: "SAO", country: "Brasil", strength: 86 },
  { id: "corinthians-2026", name: "Corinthians 2026", shortName: "COR", country: "Brasil", strength: 85 },
  { id: "internacional-2026", name: "Internacional 2026", shortName: "INT", country: "Brasil", strength: 84 },
  { id: "gremio-2026", name: "Gremio 2026", shortName: "GRE", country: "Brasil", strength: 84 },
  { id: "fluminense-2026", name: "Fluminense 2026", shortName: "FLU", country: "Brasil", strength: 85 },
  { id: "vasco-2026", name: "Vasco 2026", shortName: "VAS", country: "Brasil", strength: 82 },
  { id: "santos-2026", name: "Santos 2026", shortName: "SAN", country: "Brasil", strength: 82 },
  { id: "bahia-2026", name: "Bahia 2026", shortName: "BAH", country: "Brasil", strength: 83 },
  { id: "fortaleza-2026", name: "Fortaleza 2026", shortName: "FOR", country: "Brasil", strength: 82 },
  { id: "bragantino-2026", name: "Bragantino 2026", shortName: "RBB", country: "Brasil", strength: 81 },
  { id: "athletico-pr-2026", name: "Athletico PR 2026", shortName: "CAP", country: "Brasil", strength: 83 },
  { id: "cruzeiro-br-2026", name: "Cruzeiro 2026", shortName: "CRU", country: "Brasil", strength: 86 },
  { id: "atletico-mg-br-2026", name: "Atletico Mineiro 2026", shortName: "CAM", country: "Brasil", strength: 87 },
  { id: "vitoria-2026", name: "Vitória 2026", shortName: "VIT", country: "Brasil", strength: 79 },
  { id: "juventude-2026", name: "Juventude 2026", shortName: "JUV", country: "Brasil", strength: 78 },
  { id: "ceara-2026", name: "Ceara 2026", shortName: "CEA", country: "Brasil", strength: 79 }
];

export const copaDoBrasilOpponents: IOpponent[] = [
  { id: "manaus-2026", name: "Manaus 2026", shortName: "MAN", country: "Brasil", strength: 70 },
  { id: "remo-2026", name: "Remo 2026", shortName: "REM", country: "Brasil", strength: 74 },
  { id: "sport-2026", name: "Sport 2026", shortName: "SPT", country: "Brasil", strength: 80 },
  { id: "goias-2026", name: "Goias 2026", shortName: "GOI", country: "Brasil", strength: 81 },
  { id: "fortaleza-cdb-2026", name: "Fortaleza 2026", shortName: "FOR", country: "Brasil", strength: 83 },
  { id: "corinthians-cdb-2026", name: "Corinthians 2026", shortName: "COR", country: "Brasil", strength: 85 },
  { id: "palmeiras-cdb-2026", name: "Palmeiras 2026", shortName: "PAL", country: "Brasil", strength: 90 },
  { id: "flamengo-cdb-2026", name: "Flamengo 2026", shortName: "FLA", country: "Brasil", strength: 90 }
];

export const libertadoresOpponents: IOpponent[] = [
  { id: "boca-2026", name: "Boca Juniors 2026", shortName: "BOC", country: "Argentina", strength: 88 },
  { id: "river-2026", name: "River Plate 2026", shortName: "RIV", country: "Argentina", strength: 89 },
  { id: "penarol-2026", name: "Penarol 2026", shortName: "PEN", country: "Uruguai", strength: 82 },
  { id: "nacional-2026", name: "Nacional 2026", shortName: "NAC", country: "Uruguai", strength: 82 },
  { id: "colo-colo-2026", name: "Colo-Colo 2026", shortName: "COL", country: "Chile", strength: 81 },
  { id: "olimpia-2026", name: "Olimpia 2026", shortName: "OLI", country: "Paraguai", strength: 81 },
  { id: "liga-quito-2026", name: "LDU Quito 2026", shortName: "LDU", country: "Equador", strength: 82 },
  { id: "independiente-del-valle-2026", name: "Independiente del Valle 2026", shortName: "IDV", country: "Equador", strength: 83 },
  { id: "atletico-nacional-2026", name: "Atletico Nacional 2026", shortName: "NAL", country: "Colombia", strength: 82 }
];

export const mundialOpponents: IOpponent[] = [
  { id: "real-madrid-2017-world", name: "Real Madrid 2017", shortName: "RMA", country: "Espanha", strength: 95 },
  { id: "barcelona-2011-world", name: "Barcelona 2011", shortName: "BAR", country: "Espanha", strength: 97 },
  { id: "santos-1962-world", name: "Santos 1962", shortName: "SAN", country: "Brasil", strength: 97 },
  { id: "milan-1989-world", name: "AC Milan 1989", shortName: "MIL", country: "Italia", strength: 96 },
  { id: "bayern-2020-world", name: "Bayern de Munique 2020", shortName: "BAY", country: "Alemanha", strength: 95 },
  { id: "man-city-2023-world", name: "Manchester City 2023", shortName: "MCI", country: "Inglaterra", strength: 95 }
];
