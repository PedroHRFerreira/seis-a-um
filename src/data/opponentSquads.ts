import { IOpponent, IPlayer, Position } from "@/types/game";
import { clamp } from "@/utils/format";

const positions: Position[] = ["GK", "RB", "CB", "CB", "LB", "DM", "CM", "AM", "RW", "LW", "ST"];
const overallOffsets = [-2, -3, -1, -1, -3, -2, 0, 1, 1, 1, 2];

const squadNames: Record<string, string[]> = {
  AME: ["Matheus Cavichioli", "Patric", "Éder", "Ricardo Silva", "João Paulo", "Juninho", "Alê", "Matheusinho", "Adyson", "Felipe Azevedo", "Wellington Paulista"],
  ATH: ["Jefferson", "Patric", "Nathan", "Rafael Lima", "Douglas Pelé", "Wallisson", "Rômulo", "David Braga", "Ingro", "Sassá", "Jonathas"],
  BAH: ["Ronaldo", "Nino Paraíba", "Lucas Fonseca", "Juninho", "Matheus Bahia", "Gregore", "Daniel", "Rodriguinho", "Rossi", "Gilberto", "Élber"],
  BET: ["Glaycon", "Marcelinho", "Gabriel Fraga", "Pedrão", "Robertinho", "Jajá", "João Pedro", "Vitinho", "Rafael Grampola", "Erick Salles", "Daniel Amorim"],
  BOC: ["Córdoba", "Ibarra", "Bermúdez", "Traverso", "Matellán", "Serna", "Battaglia", "Riquelme", "Delgado", "Guillermo Barros Schelotto", "Palermo"],
  BOT: ["Jefferson", "Alessandro", "Antônio Carlos", "Fábio Ferreira", "Cortês", "Marcelo Mattos", "Renato", "Seedorf", "Loco Abreu", "Tiquinho Soares", "Jairzinho"],
  CAP: ["Santos", "Jonathan", "Thiago Heleno", "Pedro Henrique", "Renan Lodi", "Bruno Guimarães", "Lucho González", "Nikão", "Marcelo Cirino", "Pablo", "Fernandinho"],
  CEA: ["João Ricardo", "Samuel Xavier", "Luiz Otávio", "Messias", "Bruno Pacheco", "Richardson", "Vina", "Ricardinho", "Lima", "Cléber", "Magno Alves"],
  COL: ["Claudio Bravo", "Lizardo Garrido", "Elías Figueroa", "Julio Barroso", "Gabriel Suazo", "Arturo Vidal", "Esteban Pavez", "Jorge Valdivia", "Carlos Caszely", "Lucas Barrios", "Esteban Paredes"],
  COR: ["Cássio", "Alessandro", "Chicão", "Paulo André", "Fábio Santos", "Ralf", "Paulinho", "Danilo", "Jorge Henrique", "Emerson Sheik", "Guerrero"],
  CRU: ["Raul Plassmann", "Nelinho", "Morais", "Darci Menezes", "Vanderlei", "Zé Carlos", "Piazza", "Dirceu Lopes", "Joãozinho", "Roberto Batata", "Palhinha"],
  DEM: ["Glaycon", "Rafael Estevam", "Carlão", "Luiz Fernando", "Thiago Costa", "Gabriel Davis", "Wesley", "João Vitor", "Paulinho", "Hiago", "Rafael Tanque"],
  FLA: ["Diego Alves", "Rafinha", "Rodrigo Caio", "Pablo Marí", "Filipe Luís", "Willian Arão", "Gerson", "Arrascaeta", "Everton Ribeiro", "Bruno Henrique", "Gabigol"],
  FLU: ["Fábio", "Samuel Xavier", "Nino", "Felipe Melo", "Marcelo", "André", "Martinelli", "Ganso", "Jhon Arias", "Keno", "Cano"],
  FOR: ["Marcelo Boeck", "Tinga", "Quintero", "Titi", "Bruno Melo", "Felipe", "Juninho", "Lucas Crispim", "Yago Pikachu", "Romarinho", "Wellington Paulista"],
  GOI: ["Harlei", "Vítor", "Ernando", "Rafael Tolói", "Julio César", "Amaral", "Thiago Mendes", "Ramon", "Iarley", "Fernandão", "Dimba"],
  GRE: ["Danrlei", "Arce", "Adilson Batista", "Rivarola", "Roger", "Dinho", "Goiano", "Arílson", "Paulo Nunes", "Carlos Miguel", "Jardel"],
  IDV: ["Librado Azcona", "Anthony Landázuri", "Luis Segovia", "Richard Schunke", "Beder Caicedo", "Cristian Pellerano", "Dixon Arroyo", "Junior Sornoza", "Jhoanner Chávez", "Lautaro Díaz", "Michael Estrada"],
  INT: ["Clemer", "Ceará", "Índio", "Fabiano Eller", "Rubens Cardoso", "Edinho", "Wellington Monteiro", "Alex", "Fernandão", "Iarley", "Rafael Sóbis"],
  ITA: ["Rafael", "Igor", "Gustavo", "Leandro", "Lucas", "Marcos Vinícius", "João Vitor", "Daniel", "Matheus", "Bruno", "Paulo Henrique"],
  JUV: ["Michel Alves", "Jucemar", "Índio", "Naldo", "Mineiro", "Lauro", "Marcelinho", "Lauro", "Itaqui", "Mendes", "Zezinho"],
  LDU: ["José Cevallos", "Néicer Reasco", "Jairo Campos", "Norberto Araujo", "Paúl Ambrosi", "Patricio Urrutia", "Enrique Vera", "Edison Méndez", "Damián Manso", "Claudio Bieler", "Agustín Delgado"],
  MAN: ["Jonathan", "Derlan", "Luis Fernando", "Márcio Passos", "Renan Luís", "Gustavo Ermel", "Rossini", "Hamilton", "Jack Chan", "Vanilson", "Matheus Oliveira"],
  NAC: ["Rodolfo Rodríguez", "José Moreira", "Hugo De León", "Daniel Enríquez", "Washington González", "Arsenio Luzardo", "Ruben Sosa", "Santiago Ostolaza", "Waldemar Victorino", "Antonio Alzamendi", "Sebastián Abreu"],
  NAL: ["René Higuita", "Gildardo Gómez", "Andrés Escobar", "Luis Carlos Perea", "Felipe Aguilar", "Alexis García", "Leonel Álvarez", "Macnelly Torres", "Víctor Aristizábal", "Faustino Asprilla", "Juan Pablo Ángel"],
  OLI: ["Ever Almeida", "Francisco Arce", "Carlos Gamarra", "Celso Ayala", "Aureliano Torres", "Julio César Enciso", "Richard Ortiz", "Roque Santa Cruz", "Derlis González", "Néstor Camacho", "José Cardozo"],
  PAL: ["Weverton", "Marcos Rocha", "Gustavo Gómez", "Luan", "Piquerez", "Danilo", "Zé Rafael", "Raphael Veiga", "Dudu", "Rony", "Deyverson"],
  PEN: ["Fernando Álvez", "Pablo Bengoechea", "Diego Aguirre", "Nelson Gutiérrez", "José Perdomo", "Obdulio Varela", "Antonio Pacheco", "Ruben Paz", "Fernando Morena", "Alberto Spencer", "Pedro Rocha"],
  POU: ["Cairo", "Denis", "Léo Fortunato", "Carciano", "Mário Henrique", "Alemão", "Gustavo", "Andrezinho", "Paulo Henrique", "Patrick", "Wellington"],
  RBB: ["Cleiton", "Aderlan", "Léo Ortiz", "Natan", "Luan Cândido", "Jadsom", "Raul", "Lucas Evangelista", "Artur", "Helinho", "Ytalo"],
  REM: ["Vinícius", "Levy", "Mimica", "Fredson", "Marlon", "Dedeco", "Eduardo Ramos", "Ratinho", "Fábio Oliveira", "Kiros", "Zé Carlos"],
  RIV: ["Armani", "Montiel", "Maidana", "Pinola", "Casco", "Ponzio", "Enzo Pérez", "Palacios", "Quintero", "Pratto", "Borré"],
  SAN: ["Gilmar", "Lima", "Mauro Ramos", "Calvet", "Dalmo", "Zito", "Mengálvio", "Dorval", "Coutinho", "Pepe", "Pelé"],
  SAO: ["Zetti", "Cafu", "Ronaldao", "Adilson", "Ronaldo Luís", "Pintado", "Toninho Cerezo", "Raí", "Müller", "Elivélton", "Palhinha"],
  SPT: ["Magrão", "Patric", "Durval", "Ronaldo Alves", "Sander", "Rithely", "Marcão", "Diego Souza", "Marlone", "André", "Carlinhos Bala"],
  TOM: ["Felipe Garcia", "David", "Matheus Lopes", "Roger Carvalho", "Manoel", "Ibson", "Pierre", "Juan", "Daniel Amorim", "Rubens", "Keké"],
  UBE: ["Rafael Roballo", "Marcelinho", "Rodrigo Sam", "Luanderson", "Cesinha", "João Paulo", "Wallace", "Ingro", "Ewerton Maradona", "Jonathan Reis", "Kesley"],
  VAS: ["Carlos Germano", "Vágner", "Odvan", "Mauro Galvão", "Felipe", "Nasa", "Juninho Pernambucano", "Ramon", "Donizete", "Edmundo", "Luizão"],
  VIT: ["Dida", "Nadson", "Alex Alves", "Ramon Menezes", "Leandro Domingues", "Vanderson", "Uéslei", "Bebeto Campos", "Elkeson", "David", "Dinei"]
};

function slug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function secondaryPositions(position: Position): Position[] {
  const map: Record<Position, Position[]> = {
    GK: [],
    RB: ["RWB", "CB"],
    CB: ["RB", "LB", "DM"],
    LB: ["LWB", "CB"],
    RWB: ["RB", "RM"],
    LWB: ["LB", "LM"],
    DM: ["CM", "CB"],
    CM: ["DM", "AM", "RM", "LM"],
    AM: ["CM", "SS", "LW", "RW"],
    RM: ["RWB", "RW", "CM"],
    LM: ["LWB", "LW", "CM"],
    RW: ["RM", "LW", "ST"],
    LW: ["LM", "RW", "ST"],
    SS: ["AM", "ST"],
    ST: ["SS", "LW", "RW"]
  };

  return map[position];
}

function attributesFor(position: Position, overall: number) {
  const profiles: Record<Position, [number, number, number, number, number, number]> = {
    GK: [-18, -28, -8, -10, 6, 4],
    RB: [4, -8, 0, -1, 4, 2],
    CB: [-9, -14, -5, -8, 9, 7],
    LB: [4, -8, 0, -1, 4, 2],
    RWB: [6, -4, 2, 2, 2, 2],
    LWB: [6, -4, 2, 2, 2, 2],
    DM: [-3, -8, 4, -2, 8, 6],
    CM: [0, -2, 7, 5, 1, 3],
    AM: [2, 5, 8, 8, -8, -1],
    RM: [6, 1, 5, 7, -4, 0],
    LM: [6, 1, 5, 7, -4, 0],
    RW: [8, 7, 4, 8, -9, 0],
    LW: [8, 7, 4, 8, -9, 0],
    SS: [5, 8, 6, 8, -10, 0],
    ST: [4, 10, 0, 4, -12, 5]
  };
  const [pace, shooting, passing, dribbling, defending, physical] = profiles[position];

  return {
    pace: clamp(overall + pace, 35, 99),
    shooting: clamp(overall + shooting, 30, 99),
    passing: clamp(overall + passing, 30, 99),
    dribbling: clamp(overall + dribbling, 30, 99),
    defending: clamp(overall + defending, 25, 99),
    physical: clamp(overall + physical, 35, 99)
  };
}

export function getOpponentSquad(opponent: IOpponent): IPlayer[] {
  const names = squadNames[opponent.shortName] ?? squadNames.FLA;

  return names.slice(0, 11).map((name, index) => {
    const position = positions[index] ?? "CM";
    const overall = clamp(opponent.strength + (overallOffsets[index] ?? 0), 45, 99);

    return {
      id: `${opponent.id}-${slug(name)}`,
      name,
      position,
      secondaryPositions: secondaryPositions(position),
      overall,
      legendaryTeamId: opponent.id,
      ...attributesFor(position, overall)
    };
  });
}
