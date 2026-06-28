import { ILegendaryTeam, IPlayer, Position, TeamTier } from "@/types/game";
import { clamp } from "@/utils/format";

interface ITeamSeed {
  club: string;
  year: number;
  yearLabel?: string;
  country: string;
  continent: string;
  baseOverall: number;
  tier?: TeamTier;
  players: string[];
}

const defaultPositions: Position[] = ["GK", "RB", "CB", "CB", "LB", "DM", "CM", "AM", "RW", "LW", "ST"];
const slotOverallOffset = [-2, -3, -1, -1, -3, -2, 0, 1, 1, 1, 2];

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

function playersFor(teamId: string, baseOverall: number, names: string[], minOverall = 70): IPlayer[] {
  return names.map((name, index) => {
    const position = defaultPositions[index] ?? "CM";
    const overall = clamp(baseOverall + (slotOverallOffset[index] ?? 0), minOverall, 99);

    return {
      id: `${teamId}-${slug(name)}`,
      name,
      position,
      secondaryPositions: secondaryPositions(position),
      overall,
      legendaryTeamId: teamId,
      ...attributesFor(position, overall)
    };
  });
}

const seeds: ITeamSeed[] = [
  {
    club: "Real Madrid",
    year: 1959,
    country: "Espanha",
    continent: "Europa",
    baseOverall: 96,
    players: ["Juan Alonso", "Marquitos", "José Santamaría", "Santisteban", "Lesmes", "Zárraga", "Gento", "Rial", "Kopa", "Di Stéfano", "Puskás"]
  },
  {
    club: "Real Madrid",
    year: 1960,
    country: "Espanha",
    continent: "Europa",
    baseOverall: 97,
    players: ["Domínguez", "Marquitos", "José Santamaría", "Pachín", "Casado", "Zárraga", "Del Sol", "Canario", "Gento", "Di Stéfano", "Puskás"]
  },
  {
    club: "Real Madrid",
    year: 2002,
    country: "Espanha",
    continent: "Europa",
    baseOverall: 94,
    players: ["Casillas", "Salgado", "Hierro", "Helguera", "Roberto Carlos", "Makelele", "Figo", "Zidane", "Raúl", "Guti", "Morientes"]
  },
  {
    club: "Real Madrid",
    year: 2014,
    country: "Espanha",
    continent: "Europa",
    baseOverall: 94,
    players: ["Casillas", "Carvajal", "Pepe", "Sergio Ramos", "Marcelo", "Xabi Alonso", "Modrić", "Di María", "Bale", "Cristiano Ronaldo", "Benzema"]
  },
  {
    club: "Real Madrid",
    year: 2017,
    country: "Espanha",
    continent: "Europa",
    baseOverall: 95,
    players: ["Keylor Navas", "Carvajal", "Varane", "Sergio Ramos", "Marcelo", "Casemiro", "Kroos", "Modrić", "Isco", "Cristiano Ronaldo", "Benzema"]
  },
  {
    club: "Barcelona",
    year: 1992,
    country: "Espanha",
    continent: "Europa",
    baseOverall: 94,
    players: ["Zubizarreta", "Ferrer", "Koeman", "Nando", "Juan Carlos", "Guardiola", "Bakero", "Laudrup", "Eusebio", "Stoichkov", "Salinas"]
  },
  {
    club: "Barcelona",
    year: 2009,
    country: "Espanha",
    continent: "Europa",
    baseOverall: 96,
    players: ["Valdés", "Dani Alves", "Piqué", "Puyol", "Abidal", "Busquets", "Xavi", "Iniesta", "Messi", "Henry", "Eto'o"]
  },
  {
    club: "Barcelona",
    year: 2011,
    country: "Espanha",
    continent: "Europa",
    baseOverall: 97,
    players: ["Valdés", "Dani Alves", "Piqué", "Puyol", "Abidal", "Busquets", "Xavi", "Iniesta", "Pedro", "Villa", "Messi"]
  },
  {
    club: "Barcelona",
    year: 2015,
    country: "Espanha",
    continent: "Europa",
    baseOverall: 96,
    players: ["Bravo", "Dani Alves", "Piqué", "Mascherano", "Jordi Alba", "Busquets", "Rakitić", "Iniesta", "Messi", "Neymar", "Suárez"]
  },
  {
    club: "Santos",
    year: 1962,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 97,
    players: ["Gilmar", "Lima", "Mauro Ramos", "Calvet", "Dalmo", "Zito", "Mengálvio", "Dorval", "Coutinho", "Pepe", "Pelé"]
  },
  {
    club: "Santos",
    year: 1963,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 96,
    players: ["Gilmar", "Lima", "Mauro Ramos", "Haroldo", "Dalmo", "Zito", "Mengálvio", "Dorval", "Coutinho", "Pepe", "Pelé"]
  },
  {
    club: "Flamengo",
    year: 1981,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 94,
    players: ["Raul", "Leandro", "Mozer", "Marinho", "Júnior", "Andrade", "Adílio", "Zico", "Tita", "Lico", "Nunes"]
  },
  {
    club: "Flamengo",
    year: 2019,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 92,
    players: ["Diego Alves", "Rafinha", "Rodrigo Caio", "Pablo Marí", "Filipe Luís", "Willian Arão", "Gerson", "Arrascaeta", "Everton Ribeiro", "Bruno Henrique", "Gabigol"]
  },
  {
    club: "São Paulo",
    year: 1992,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 93,
    players: ["Zetti", "Cafu", "Ronaldao", "Adilson", "Ronaldo Luís", "Pintado", "Toninho Cerezo", "Raí", "Müller", "Elivélton", "Palhinha"]
  },
  {
    club: "São Paulo",
    year: 1993,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 93,
    players: ["Zetti", "Cafu", "Valber", "Ronaldao", "André Luiz", "Dinho", "Doriva", "Toninho Cerezo", "Leonardo", "Müller", "Palhinha"]
  },
  {
    club: "Palmeiras",
    year: 1999,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 91,
    players: ["Marcos", "Arce", "Roque Júnior", "Júnior Baiano", "Júnior", "César Sampaio", "Galeano", "Alex", "Zinho", "Paulo Nunes", "Oséas"]
  },
  {
    club: "Palmeiras",
    year: 2020,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 89,
    players: ["Weverton", "Marcos Rocha", "Gustavo Gómez", "Luan", "Matías Viña", "Felipe Melo", "Danilo", "Raphael Veiga", "Rony", "Gustavo Scarpa", "Luiz Adriano"]
  },
  {
    club: "Palmeiras",
    year: 2021,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 90,
    players: ["Weverton", "Marcos Rocha", "Gustavo Gómez", "Luan", "Piquerez", "Danilo", "Zé Rafael", "Raphael Veiga", "Dudu", "Rony", "Deyverson"]
  },
  {
    club: "Corinthians",
    year: 2012,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 91,
    players: ["Cássio", "Alessandro", "Chicão", "Paulo André", "Fábio Santos", "Ralf", "Paulinho", "Danilo", "Jorge Henrique", "Emerson Sheik", "Guerrero"]
  },
  {
    club: "Internacional",
    year: 2006,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 90,
    players: ["Clemer", "Ceará", "Índio", "Fabiano Eller", "Rubens Cardoso", "Edinho", "Wellington Monteiro", "Alex", "Fernandão", "Iarley", "Rafael Sóbis"]
  },
  {
    club: "Grêmio",
    year: 1983,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 90,
    players: ["Mazaropi", "Eurico", "Baidek", "De León", "Paulo Roberto", "China", "Osvaldo", "Renato Portaluppi", "Tarciso", "Caio", "César"]
  },
  {
    club: "Grêmio",
    year: 1995,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 91,
    players: ["Danrlei", "Arce", "Adilson Batista", "Rivarola", "Roger", "Dinho", "Goiano", "Arílson", "Paulo Nunes", "Carlos Miguel", "Jardel"]
  },
  {
    club: "Cruzeiro",
    year: 1976,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 92,
    players: ["Raul Plassmann", "Nelinho", "Morais", "Darci Menezes", "Vanderlei", "Zé Carlos", "Piazza", "Dirceu Lopes", "Joãozinho", "Roberto Batata", "Palhinha"]
  },
  {
    club: "Cruzeiro",
    year: 2003,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 91,
    players: ["Gomes", "Maicon", "Cris", "Luisão", "Leandro", "Maldonado", "Recife", "Alex", "Aristizábal", "Deivid", "Mota"]
  },
  {
    club: "Atlético Mineiro",
    year: 2013,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 90,
    players: ["Victor", "Marcos Rocha", "Leonardo Silva", "Réver", "Junior Cesar", "Pierre", "Leandro Donizete", "Ronaldinho", "Bernard", "Diego Tardelli", "Jô"]
  },
  {
    club: "Vasco da Gama",
    year: 1998,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 91,
    players: ["Carlos Germano", "Vágner", "Odvan", "Mauro Galvão", "Felipe", "Nasa", "Juninho Pernambucano", "Ramon", "Donizete", "Edmundo", "Luizão"]
  },
  {
    club: "Botafogo",
    year: 1968,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 91,
    players: ["Ubirajara", "Moreira", "Leônidas", "Valtencir", "Paulo Henrique", "Gérson", "Carlos Roberto", "Rogério", "Roberto Miranda", "Paulo César Caju", "Jairzinho"]
  },
  {
    club: "Fluminense",
    year: 2023,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 90,
    players: ["Fábio", "Samuel Xavier", "Nino", "Felipe Melo", "Marcelo", "André", "Martinelli", "Ganso", "Jhon Arias", "Keno", "Cano"]
  },
  {
    club: "Boca Juniors",
    year: 1978,
    country: "Argentina",
    continent: "América do Sul",
    baseOverall: 90,
    players: ["Gatti", "Pernía", "Mouzo", "Sá", "Bordón", "Suñé", "Ribolzi", "Zanabria", "Mastrángelo", "Felman", "Salinas"]
  },
  {
    club: "Boca Juniors",
    year: 2000,
    country: "Argentina",
    continent: "América do Sul",
    baseOverall: 92,
    players: ["Córdoba", "Ibarra", "Bermúdez", "Traverso", "Matellán", "Serna", "Battaglia", "Riquelme", "Delgado", "Guillermo Barros Schelotto", "Palermo"]
  },
  {
    club: "Boca Juniors",
    year: 2003,
    country: "Argentina",
    continent: "América do Sul",
    baseOverall: 91,
    players: ["Abbondanzieri", "Ibarra", "Schiavi", "Burdisso", "Clemente Rodríguez", "Cascini", "Battaglia", "Cagna", "Tévez", "Guillermo Barros Schelotto", "Delgado"]
  },
  {
    club: "River Plate",
    year: 1986,
    country: "Argentina",
    continent: "América do Sul",
    baseOverall: 90,
    players: ["Pumpido", "Gordillo", "Ruggeri", "Montenegro", "Enrique", "Gallego", "Alfaro", "Alonso", "Francescoli", "Alzamendi", "Funes"]
  },
  {
    club: "River Plate",
    year: 1996,
    country: "Argentina",
    continent: "América do Sul",
    baseOverall: 92,
    players: ["Burgos", "Hernán Díaz", "Celso Ayala", "Berizzo", "Sorin", "Astrada", "Almeyda", "Ortega", "Francescoli", "Salas", "Crespo"]
  },
  {
    club: "River Plate",
    year: 2018,
    country: "Argentina",
    continent: "América do Sul",
    baseOverall: 90,
    players: ["Armani", "Montiel", "Maidana", "Pinola", "Casco", "Ponzio", "Enzo Pérez", "Palacios", "Quintero", "Pratto", "Borré"]
  },
  {
    club: "Independiente",
    year: 1974,
    country: "Argentina",
    continent: "América do Sul",
    baseOverall: 91,
    players: ["Santoro", "Commisso", "Pavoni", "López", "Sá", "Raimondo", "Semenewicz", "Bochini", "Bertoni", "Maglioni", "Balbuena"]
  },
  {
    club: "Racing Club",
    year: 1967,
    country: "Argentina",
    continent: "América do Sul",
    baseOverall: 90,
    players: ["Cejas", "Perfumo", "Basile", "Chabay", "Rulli", "Martín", "Díaz", "Cardoso", "Rodríguez", "Maschio", "Cárdenas"]
  },
  {
    club: "Peñarol",
    year: 1961,
    country: "Uruguai",
    continent: "América do Sul",
    baseOverall: 92,
    players: ["Maidana", "Troche", "William Martínez", "Matosas", "Gonçalves", "Néstor Gonçalves", "Cubilla", "Spencer", "Joya", "Sasía", "Borges"]
  },
  {
    club: "Nacional",
    year: 1988,
    country: "Uruguai",
    continent: "América do Sul",
    baseOverall: 89,
    players: ["Seré", "Ostolaza", "De León", "Revélez", "Pintos Saldanha", "Perdomo", "Lemos", "Castro", "Vargas", "Sosa", "Aguilera"]
  },
  {
    club: "Ajax",
    year: 1971,
    country: "Holanda",
    continent: "Europa",
    baseOverall: 94,
    players: ["Stuy", "Suurbier", "Hulshoff", "Vasović", "Krol", "Neeskens", "Haan", "Mühren", "Swart", "Keizer", "Cruyff"]
  },
  {
    club: "Ajax",
    year: 1972,
    country: "Holanda",
    continent: "Europa",
    baseOverall: 95,
    players: ["Stuy", "Suurbier", "Blankenburg", "Hulshoff", "Krol", "Neeskens", "Haan", "Mühren", "Swart", "Keizer", "Cruyff"]
  },
  {
    club: "Ajax",
    year: 1973,
    country: "Holanda",
    continent: "Europa",
    baseOverall: 95,
    players: ["Stuy", "Suurbier", "Blankenburg", "Hulshoff", "Krol", "Neeskens", "Haan", "Mühren", "Rep", "Keizer", "Cruyff"]
  },
  {
    club: "Ajax",
    year: 1995,
    country: "Holanda",
    continent: "Europa",
    baseOverall: 92,
    players: ["Van der Sar", "Reiziger", "Blind", "Frank de Boer", "Bogarde", "Rijkaard", "Seedorf", "Davids", "Finidi George", "Overmars", "Kluivert"]
  },
  {
    club: "AC Milan",
    year: 1989,
    country: "Itália",
    continent: "Europa",
    baseOverall: 96,
    players: ["Galli", "Tassotti", "Baresi", "Costacurta", "Maldini", "Ancelotti", "Rijkaard", "Donadoni", "Gullit", "Evani", "Van Basten"]
  },
  {
    club: "AC Milan",
    year: 1994,
    country: "Itália",
    continent: "Europa",
    baseOverall: 95,
    players: ["Rossi", "Tassotti", "Baresi", "Costacurta", "Maldini", "Albertini", "Desailly", "Donadoni", "Boban", "Savićević", "Massaro"]
  },
  {
    club: "AC Milan",
    year: 2007,
    country: "Itália",
    continent: "Europa",
    baseOverall: 93,
    players: ["Dida", "Oddo", "Nesta", "Maldini", "Jankulovski", "Gattuso", "Pirlo", "Seedorf", "Kaká", "Gilardino", "Inzaghi"]
  },
  {
    club: "Inter de Milão",
    year: 1965,
    country: "Itália",
    continent: "Europa",
    baseOverall: 94,
    players: ["Sarti", "Burgnich", "Facchetti", "Guarneri", "Picchi", "Bedin", "Jair", "Mazzola", "Corso", "Domenghini", "Luis Suárez"]
  },
  {
    club: "Inter de Milão",
    year: 2010,
    country: "Itália",
    continent: "Europa",
    baseOverall: 93,
    players: ["Júlio César", "Maicon", "Lúcio", "Samuel", "Chivu", "Cambiasso", "Zanetti", "Sneijder", "Eto'o", "Pandev", "Milito"]
  },
  {
    club: "Juventus",
    year: 1985,
    country: "Itália",
    continent: "Europa",
    baseOverall: 93,
    players: ["Tacconi", "Favero", "Scirea", "Brio", "Cabrini", "Tardelli", "Bonini", "Platini", "Boniek", "Briaschi", "Paolo Rossi"]
  },
  {
    club: "Juventus",
    year: 1996,
    country: "Itália",
    continent: "Europa",
    baseOverall: 92,
    players: ["Peruzzi", "Torricelli", "Ferrara", "Vierchowod", "Pessotto", "Conte", "Deschamps", "Paulo Sousa", "Del Piero", "Ravanelli", "Vialli"]
  },
  {
    club: "Napoli",
    year: 1987,
    country: "Itália",
    continent: "Europa",
    baseOverall: 92,
    players: ["Garella", "Ferrara", "Bruscolotti", "Renica", "Francini", "Bagni", "De Napoli", "Romano", "Maradona", "Carnevale", "Giordano"]
  },
  {
    club: "Napoli",
    year: 1990,
    country: "Itália",
    continent: "Europa",
    baseOverall: 92,
    players: ["Giuliani", "Ferrara", "Baroni", "Francini", "Corradini", "Alemão", "De Napoli", "Fusi", "Maradona", "Carnevale", "Careca"]
  },
  {
    club: "Bayern de Munique",
    year: 1974,
    country: "Alemanha",
    continent: "Europa",
    baseOverall: 95,
    players: ["Maier", "Hansen", "Beckenbauer", "Schwarzenbeck", "Breitner", "Roth", "Zobel", "Kapellmann", "Hoeneß", "Torstensson", "Gerd Müller"]
  },
  {
    club: "Bayern de Munique",
    year: 1975,
    country: "Alemanha",
    continent: "Europa",
    baseOverall: 94,
    players: ["Maier", "Hansen", "Beckenbauer", "Schwarzenbeck", "Dürnberger", "Roth", "Zobel", "Kapellmann", "Hoeneß", "Torstensson", "Gerd Müller"]
  },
  {
    club: "Bayern de Munique",
    year: 1976,
    country: "Alemanha",
    continent: "Europa",
    baseOverall: 94,
    players: ["Maier", "Horsmann", "Beckenbauer", "Schwarzenbeck", "Dürnberger", "Roth", "Zobel", "Kapellmann", "Hoeneß", "Rummenigge", "Gerd Müller"]
  },
  {
    club: "Bayern de Munique",
    year: 2013,
    country: "Alemanha",
    continent: "Europa",
    baseOverall: 94,
    players: ["Neuer", "Lahm", "Boateng", "Dante", "Alaba", "Schweinsteiger", "Javi Martínez", "Kroos", "Robben", "Ribéry", "Mandžukić"]
  },
  {
    club: "Bayern de Munique",
    year: 2020,
    country: "Alemanha",
    continent: "Europa",
    baseOverall: 95,
    players: ["Neuer", "Kimmich", "Boateng", "Alaba", "Davies", "Thiago", "Goretzka", "Müller", "Gnabry", "Coman", "Lewandowski"]
  },
  {
    club: "Borussia Dortmund",
    year: 1997,
    country: "Alemanha",
    continent: "Europa",
    baseOverall: 91,
    players: ["Klos", "Reuter", "Kohler", "Sammer", "Heinrich", "Lambert", "Paulo Sousa", "Möller", "Ricken", "Chapuisat", "Riedle"]
  },
  {
    club: "Hamburgo",
    year: 1983,
    country: "Alemanha",
    continent: "Europa",
    baseOverall: 90,
    players: ["Stein", "Kaltz", "Jakobs", "Hieronymus", "Wehmeyer", "Rolff", "Magath", "Milewski", "Bastrup", "Von Heesen", "Hrubesch"]
  },
  {
    club: "Manchester United",
    year: 1968,
    country: "Inglaterra",
    continent: "Europa",
    baseOverall: 93,
    players: ["Stepney", "Brennan", "Foulkes", "Stiles", "Dunne", "Crerand", "Charlton", "Aston", "Best", "Law", "Kidd"]
  },
  {
    club: "Manchester United",
    year: 1999,
    country: "Inglaterra",
    continent: "Europa",
    baseOverall: 93,
    players: ["Schmeichel", "Gary Neville", "Stam", "Johnsen", "Irwin", "Keane", "Scholes", "Beckham", "Giggs", "Yorke", "Cole"]
  },
  {
    club: "Manchester United",
    year: 2008,
    country: "Inglaterra",
    continent: "Europa",
    baseOverall: 94,
    players: ["Van der Sar", "Wes Brown", "Ferdinand", "Vidić", "Evra", "Carrick", "Scholes", "Hargreaves", "Cristiano Ronaldo", "Rooney", "Tévez"]
  },
  {
    club: "Liverpool",
    year: 1978,
    country: "Inglaterra",
    continent: "Europa",
    baseOverall: 92,
    players: ["Clemence", "Neal", "Thompson", "Hansen", "Kennedy", "Souness", "McDermott", "Case", "Heighway", "Dalglish", "Fairclough"]
  },
  {
    club: "Liverpool",
    year: 1984,
    country: "Inglaterra",
    continent: "Europa",
    baseOverall: 93,
    players: ["Grobbelaar", "Neal", "Hansen", "Lawrenson", "Alan Kennedy", "Souness", "Whelan", "Lee", "Johnston", "Dalglish", "Rush"]
  },
  {
    club: "Liverpool",
    year: 2019,
    country: "Inglaterra",
    continent: "Europa",
    baseOverall: 94,
    players: ["Alisson", "Alexander-Arnold", "Van Dijk", "Matip", "Robertson", "Fabinho", "Henderson", "Wijnaldum", "Salah", "Mané", "Firmino"]
  },
  {
    club: "Manchester City",
    year: 2023,
    country: "Inglaterra",
    continent: "Europa",
    baseOverall: 95,
    players: ["Ederson", "Walker", "Rúben Dias", "Stones", "Aké", "Rodri", "Gündogan", "De Bruyne", "Bernardo Silva", "Grealish", "Haaland"]
  },
  {
    club: "Arsenal",
    year: 2004,
    country: "Inglaterra",
    continent: "Europa",
    baseOverall: 94,
    players: ["Lehmann", "Lauren", "Campbell", "Touré", "Ashley Cole", "Gilberto Silva", "Vieira", "Pires", "Ljungberg", "Bergkamp", "Henry"]
  },
  {
    club: "Chelsea",
    year: 2012,
    country: "Inglaterra",
    continent: "Europa",
    baseOverall: 91,
    players: ["Čech", "Ivanović", "Cahill", "Terry", "Ashley Cole", "Mikel", "Lampard", "Ramires", "Mata", "Torres", "Drogba"]
  },
  {
    club: "Chelsea",
    year: 2021,
    country: "Inglaterra",
    continent: "Europa",
    baseOverall: 92,
    players: ["Mendy", "Azpilicueta", "Thiago Silva", "Rüdiger", "Chilwell", "Kanté", "Jorginho", "Mount", "Havertz", "Pulisic", "Werner"]
  },
  {
    club: "Nottingham Forest",
    year: 1980,
    country: "Inglaterra",
    continent: "Europa",
    baseOverall: 90,
    players: ["Shilton", "Anderson", "Burns", "Lloyd", "Clark", "McGovern", "O'Neill", "Bowyer", "Robertson", "Francis", "Birtles"]
  },
  {
    club: "Aston Villa",
    year: 1982,
    country: "Inglaterra",
    continent: "Europa",
    baseOverall: 89,
    players: ["Rimmer", "Swain", "Evans", "McNaught", "Williams", "Bremner", "Cowans", "Mortimer", "Morley", "Shaw", "Withe"]
  },
  {
    club: "Celtic",
    year: 1967,
    country: "Escócia",
    continent: "Europa",
    baseOverall: 91,
    players: ["Simpson", "Craig", "McNeill", "Clark", "Gemmell", "Murdoch", "Auld", "Johnstone", "Chalmers", "Lennox", "Wallace"]
  },
  {
    club: "Benfica",
    year: 1962,
    country: "Portugal",
    continent: "Europa",
    baseOverall: 94,
    players: ["Costa Pereira", "Cavém", "Germano", "Cruz", "Ângelo", "Coluna", "Santana", "Simões", "José Augusto", "Águas", "Eusébio"]
  },
  {
    club: "Porto",
    year: 1987,
    country: "Portugal",
    continent: "Europa",
    baseOverall: 90,
    players: ["Młynarczyk", "João Pinto", "Celso", "Eduardo Luís", "Inácio", "Jaime Magalhães", "André", "Frasco", "Madjer", "Gomes", "Futre"]
  },
  {
    club: "Porto",
    year: 2004,
    country: "Portugal",
    continent: "Europa",
    baseOverall: 91,
    players: ["Vítor Baía", "Paulo Ferreira", "Ricardo Carvalho", "Jorge Costa", "Nuno Valente", "Costinha", "Maniche", "Deco", "Carlos Alberto", "Derlei", "Benni McCarthy"]
  },
  {
    club: "Sporting",
    year: 2002,
    country: "Portugal",
    continent: "Europa",
    baseOverall: 88,
    players: ["Nélson", "Quiroga", "Beto", "Phil Babb", "Rui Jorge", "Paulo Bento", "Pedro Barbosa", "João Pinto", "Sá Pinto", "Niculae", "Jardel"]
  },
  {
    club: "PSV Eindhoven",
    year: 1988,
    country: "Holanda",
    continent: "Europa",
    baseOverall: 90,
    players: ["Van Breukelen", "Gerets", "Koeman", "Nielsen", "Heintze", "Lerby", "Van Aerle", "Vanenburg", "Gillhaus", "Ellerman", "Kieft"]
  },
  {
    club: "Feyenoord",
    year: 1970,
    country: "Holanda",
    continent: "Europa",
    baseOverall: 90,
    players: ["Treijtel", "Romeijn", "Laseroms", "Israel", "Van Duivenbode", "Jansen", "Hasil", "Wery", "Moulijn", "Van Hanegem", "Kindvall"]
  },
  {
    club: "Olympique de Marseille",
    year: 1993,
    country: "França",
    continent: "Europa",
    baseOverall: 91,
    players: ["Barthez", "Angloma", "Boli", "Desailly", "Di Meco", "Deschamps", "Sauzée", "Eydelie", "Abedi Pelé", "Völler", "Bokšić"]
  },
  {
    club: "Paris Saint-Germain",
    year: 2020,
    country: "França",
    continent: "Europa",
    baseOverall: 92,
    players: ["Navas", "Kehrer", "Thiago Silva", "Kimpembe", "Bernat", "Marquinhos", "Verratti", "Di María", "Mbappé", "Neymar", "Icardi"]
  },
  {
    club: "Lyon",
    year: 2006,
    country: "França",
    continent: "Europa",
    baseOverall: 90,
    players: ["Coupet", "Réveillère", "Cris", "Caçapa", "Abidal", "Diarra", "Juninho", "Tiago", "Govou", "Malouda", "Fred"]
  },
  {
    club: "Atlético de Madrid",
    year: 2014,
    country: "Espanha",
    continent: "Europa",
    baseOverall: 91,
    players: ["Courtois", "Juanfran", "Miranda", "Godín", "Filipe Luís", "Gabi", "Tiago", "Koke", "Arda Turan", "David Villa", "Diego Costa"]
  },
  {
    club: "Valencia",
    year: 2004,
    country: "Espanha",
    continent: "Europa",
    baseOverall: 90,
    players: ["Cañizares", "Curro Torres", "Ayala", "Marchena", "Carboni", "Albelda", "Baraja", "Aimar", "Rufete", "Vicente", "Mista"]
  },
  {
    club: "Sevilla",
    year: 2020,
    country: "Espanha",
    continent: "Europa",
    baseOverall: 89,
    players: ["Bono", "Jesús Navas", "Diego Carlos", "Koundé", "Reguilón", "Fernando", "Joan Jordán", "Banega", "Ocampos", "Suso", "De Jong"]
  },
  {
    club: "Villarreal",
    year: 2021,
    country: "Espanha",
    continent: "Europa",
    baseOverall: 89,
    players: ["Rulli", "Foyth", "Albiol", "Pau Torres", "Pedraza", "Capoue", "Parejo", "Trigueros", "Gerard Moreno", "Bacca", "Alcácer"]
  },
  {
    club: "Deportivo La Coruña",
    year: 2000,
    country: "Espanha",
    continent: "Europa",
    baseOverall: 90,
    players: ["Songo'o", "Manuel Pablo", "Naybet", "Donato", "Romero", "Mauro Silva", "Flávio Conceição", "Djalminha", "Víctor", "Fran", "Makaay"]
  },
  {
    club: "Parma",
    year: 1999,
    country: "Itália",
    continent: "Europa",
    baseOverall: 91,
    players: ["Buffon", "Thuram", "Cannavaro", "Sensini", "Benarrivo", "Dino Baggio", "Verón", "Boghossian", "Chiesa", "Asprilla", "Crespo"]
  },
  {
    club: "Lazio",
    year: 2000,
    country: "Itália",
    continent: "Europa",
    baseOverall: 91,
    players: ["Marchegiani", "Pancaro", "Nesta", "Mihajlović", "Favalli", "Simeone", "Verón", "Nedvěd", "Stanković", "Salas", "Inzaghi"]
  },
  {
    club: "Roma",
    year: 2001,
    country: "Itália",
    continent: "Europa",
    baseOverall: 90,
    players: ["Antonioli", "Cafu", "Samuel", "Aldair", "Candela", "Emerson", "Tommasi", "Assunção", "Totti", "Montella", "Batistuta"]
  },
  {
    club: "Galatasaray",
    year: 2000,
    country: "Turquia",
    continent: "Europa",
    baseOverall: 89,
    players: ["Taffarel", "Capone", "Bülent Korkmaz", "Popescu", "Ergün Penbe", "Suat Kaya", "Okan Buruk", "Hagi", "Arif Erdem", "Hasan Şaş", "Hakan Şükür"]
  },
  {
    club: "Fenerbahçe",
    year: 2008,
    country: "Turquia",
    continent: "Europa",
    baseOverall: 88,
    players: ["Volkan Demirel", "Gökhan Gönül", "Lugano", "Edu Dracena", "Roberto Carlos", "Aurelio", "Selçuk Şahin", "Alex de Souza", "Deivid", "Kazim-Richards", "Semih Şentürk"]
  },
  {
    club: "Steaua Bucareste",
    year: 1986,
    country: "Romênia",
    continent: "Europa",
    baseOverall: 89,
    players: ["Duckadam", "Iovan", "Bumbescu", "Belodedici", "Bărbulescu", "Bălan", "Stoica", "Bölöni", "Lăcătuș", "Pițurcă", "Balint"]
  },
  {
    club: "Estrela Vermelha",
    year: 1991,
    country: "Sérvia",
    continent: "Europa",
    baseOverall: 91,
    players: ["Stojanović", "Najdoski", "Belodedici", "Marović", "Radinović", "Mihajlović", "Jugović", "Prosinečki", "Savićević", "Binić", "Pančev"]
  },
  {
    club: "Dynamo Kyiv",
    year: 1986,
    country: "Ucrânia",
    continent: "Europa",
    baseOverall: 90,
    players: ["Chanov", "Bessonov", "Kuznetsov", "Baltacha", "Demyanenko", "Rats", "Yakovenko", "Zavarov", "Yevtushenko", "Blokhin", "Belanov"]
  },
  {
    club: "Shakhtar Donetsk",
    year: 2009,
    country: "Ucrânia",
    continent: "Europa",
    baseOverall: 88,
    players: ["Pyatov", "Srna", "Kucher", "Chygrynskiy", "Răzvan Raț", "Hübschman", "Fernandinho", "Jádson", "Willian", "Ilsinho", "Luiz Adriano"]
  },
  {
    club: "Al Ahly",
    year: 2021,
    country: "Egito",
    continent: "África",
    baseOverall: 87,
    players: ["El Shenawy", "Mohamed Hany", "Badr Benoun", "Ayman Ashraf", "Ali Maaloul", "Amr El Solia", "Hamdi Fathi", "Afsha", "Hussein El Shahat", "Taher Mohamed", "Mohamed Sherif"]
  },
  {
    club: "Raja Casablanca",
    year: 1999,
    country: "Marrocos",
    continent: "África",
    baseOverall: 86,
    players: ["Mustapha Chadili", "Abdellatif Jrindou", "Talal El Karkouri", "Abdelilah Fahmi", "Abdellatif Beggar", "Youssef Safri", "Jamal Sellami", "Salaheddine Bassir", "Mustapha Moustawdae", "Bouchaib El Moubarki", "Abdellatif Nazir"]
  },
  {
    club: "Monterrey",
    year: 2019,
    country: "México",
    continent: "América do Norte",
    baseOverall: 87,
    players: ["Barovero", "Stefan Medina", "Nicolás Sánchez", "César Montes", "Leonel Vangioni", "Celso Ortiz", "Carlos Rodríguez", "Rodolfo Pizarro", "Dorlan Pabón", "Vincent Janssen", "Rogelio Funes Mori"]
  },
  {
    club: "América",
    year: 2015,
    country: "México",
    continent: "América do Norte",
    baseOverall: 87,
    players: ["Moisés Muñoz", "Paul Aguilar", "Pablo Aguilar", "Paolo Goltz", "Miguel Samudio", "Osvaldo Martínez", "Rubens Sambueza", "Michael Arroyo", "Darwin Quintero", "Darío Benedetto", "Oribe Peralta"]
  },
  {
    club: "Tigres UANL",
    year: 2020,
    country: "México",
    continent: "América do Norte",
    baseOverall: 88,
    players: ["Nahuel Guzmán", "Luis Rodríguez", "Hugo Ayala", "Carlos Salcedo", "Jesús Dueñas", "Rafael Carioca", "Guido Pizarro", "Javier Aquino", "Luis Quiñones", "Eduardo Vargas", "André-Pierre Gignac"]
  },
  {
    club: "Kashima Antlers",
    year: 2018,
    country: "Japão",
    continent: "Ásia",
    baseOverall: 86,
    players: ["Sun-tae Kwon", "Atsuto Uchida", "Gen Shoji", "Jung Seung-hyun", "Shuto Yamamoto", "Leo Silva", "Ryota Nagaki", "Shoma Doi", "Serginho", "Mu Kanazaki", "Yuma Suzuki"]
  }
];

const worstCampaignSeeds: ITeamSeed[] = [
  {
    club: "Derby County",
    year: 2007,
    yearLabel: "2007-08",
    country: "Inglaterra",
    continent: "Europa",
    baseOverall: 62,
    tier: "worst-campaign",
    players: ["Stephen Bywater", "Tyrone Mears", "Dean Leacock", "Darren Moore", "Jay McEveley", "Robbie Savage", "Stephen Pearson", "Giles Barnes", "Craig Fagan", "Robert Earnshaw", "Kenny Miller"]
  },
  {
    club: "Tasmania Berlin",
    year: 1965,
    yearLabel: "1965-66",
    country: "Alemanha",
    continent: "Europa",
    baseOverall: 55,
    tier: "worst-campaign",
    players: ["Heinz Rohloff", "Hans-Gunter Becker", "Wolfgang Neumann", "Horst Szymaniak", "Helmut Senger", "Jurgen Papies", "Peter Engler", "Wolfgang Seeger", "Heinz Fischer", "Jurgen Sundermann", "Wulf-Ingo Usbeck"]
  },
  {
    club: "Loughgall FC",
    year: 1986,
    yearLabel: "1986-87",
    country: "Irlanda do Norte",
    continent: "Europa",
    baseOverall: 56,
    tier: "worst-campaign",
    players: ["Alan Ritchie", "Stephen McBride", "Paul McKee", "David Frazer", "Brian Adair", "Noel McKeown", "Gary McKinstry", "Colin Malone", "Mark Haughey", "Ian McDonald", "Philip Hughes"]
  },
  {
    club: "Íbis Sport Club",
    year: 1980,
    yearLabel: "1980-84",
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 55,
    tier: "worst-campaign",
    players: ["Mauro Shampoo", "Zé do Carmo", "Luizinho", "Djalma", "Fernando", "Biu", "Nena", "Givanildo", "Miltinho", "Marcelo", "Edvaldo"]
  },
  {
    club: "América de Cali",
    year: 2011,
    country: "Colômbia",
    continent: "América do Sul",
    baseOverall: 64,
    tier: "worst-campaign",
    players: ["Diego Restrepo", "Jersson González", "Andrés Cadavid", "John Lozano", "Iván Vélez", "Jhon Viáfara", "Avilés Hurtado", "Jorge Artigas", "Paulo César Arango", "Jairo Castillo", "Duván Zapata"]
  },
  {
    club: "Anzhi Makhachkala",
    year: 2018,
    country: "Rússia",
    continent: "Europa",
    baseOverall: 59,
    tier: "worst-campaign",
    players: ["Yuri Dyupin", "Vladimir Poluyakhtov", "Ivan Novoseltsev", "Pavel Kaloshin", "Andrey Yeshchenko", "Adlan Katsaev", "Guram Tetrashvili", "Kamil Zakirov", "Islamnur Abdulavov", "Andres Ponce", "Pavel Dolgov"]
  },
  {
    club: "Sunderland",
    year: 2005,
    yearLabel: "2005-06",
    country: "Inglaterra",
    continent: "Europa",
    baseOverall: 60,
    tier: "worst-campaign",
    players: ["Kelvin Davis", "Nyron Nosworthy", "Gary Breen", "Stephen Caldwell", "Julio Arca", "Dean Whitehead", "Tommy Miller", "Liam Lawrence", "Anthony Le Tallec", "Jon Stead", "Kevin Kyle"]
  },
  {
    club: "Sunderland",
    year: 2002,
    yearLabel: "2002-03",
    country: "Inglaterra",
    continent: "Europa",
    baseOverall: 61,
    tier: "worst-campaign",
    players: ["Thomas Sorensen", "Stephen Wright", "Jody Craddock", "Joachim Bjorklund", "Michael Gray", "Gavin McCann", "Claudio Reyna", "Kevin Kilbane", "Julio Arca", "Tore Andre Flo", "Kevin Phillips"]
  },
  {
    club: "Aston Villa",
    year: 2015,
    yearLabel: "2015-16",
    country: "Inglaterra",
    continent: "Europa",
    baseOverall: 63,
    tier: "worst-campaign",
    players: ["Brad Guzan", "Alan Hutton", "Joleon Lescott", "Micah Richards", "Aly Cissokho", "Idrissa Gueye", "Ashley Westwood", "Jordan Veretout", "Scott Sinclair", "Jordan Ayew", "Rudy Gestede"]
  },
  {
    club: "Sheffield United",
    year: 2023,
    yearLabel: "2023-24",
    country: "Inglaterra",
    continent: "Europa",
    baseOverall: 62,
    tier: "worst-campaign",
    players: ["Wes Foderingham", "George Baldock", "Anel Ahmedhodzic", "Auston Trusty", "Jack Robinson", "Jayden Bogle", "Oliver Norwood", "Vinicius Souza", "James McAtee", "Cameron Archer", "Oliver McBurnie"]
  },
  {
    club: "Portsmouth",
    year: 2009,
    yearLabel: "2009-10",
    country: "Inglaterra",
    continent: "Europa",
    baseOverall: 63,
    tier: "worst-campaign",
    players: ["David James", "Steve Finnan", "Younes Kaboul", "Marc Wilson", "Nadir Belhadj", "Aaron Mokoena", "Papa Bouba Diop", "Kevin-Prince Boateng", "Jamie O'Hara", "Frederic Piquionne", "Aruna Dindane"]
  },
  {
    club: "Pescara",
    year: 2016,
    yearLabel: "2016-17",
    country: "Itália",
    continent: "Europa",
    baseOverall: 60,
    tier: "worst-campaign",
    players: ["Albano Bizzarri", "Francesco Zampano", "Hugo Campagnaro", "Cristiano Biraghi", "Andrea Coda", "Ledian Memushaj", "Ahmad Benali", "Valerio Verre", "Gianluca Caprari", "Jean-Christophe Bahebeck", "Alberto Gilardino"]
  },
  {
    club: "Benevento",
    year: 2017,
    yearLabel: "2017-18",
    country: "Itália",
    continent: "Europa",
    baseOverall: 59,
    tier: "worst-campaign",
    players: ["Vid Belec", "Gaetano Letizia", "Berat Djimsiti", "Fabio Lucioni", "Gianluca Di Chiara", "Danilo Cataldi", "Nicolas Viola", "Raman Chibsah", "Amato Ciciretti", "Massimo Coda", "Pietro Iemmello"]
  },
  {
    club: "Brescia",
    year: 1994,
    yearLabel: "1994-95",
    country: "Itália",
    continent: "Europa",
    baseOverall: 58,
    tier: "worst-campaign",
    players: ["Nello Cusin", "Stefano Bonometti", "Daniele Zoratto", "Giovanni Galli", "Marco Schenardi", "Gheorghe Hagi", "Dario Hubner", "Maurizio Neri", "Adelmo Paris", "Lamberto Piovanelli", "Mircea Lucescu"]
  },
  {
    club: "Córdoba CF",
    year: 2014,
    yearLabel: "2014-15",
    country: "Espanha",
    continent: "Europa",
    baseOverall: 59,
    tier: "worst-campaign",
    players: ["Juan Carlos", "Aleksandar Pantic", "Íñigo López", "Crespo", "Pinillos", "Luso", "Abel Gómez", "Fede Cartabia", "Fidel", "Florin Andone", "Nabil Ghilas"]
  },
  {
    club: "Sporting Gijón",
    year: 1997,
    yearLabel: "1997-98",
    country: "Espanha",
    continent: "Europa",
    baseOverall: 56,
    tier: "worst-campaign",
    players: ["Juan Carlos Ablanedo", "Tomás", "Luis Sierra", "Manolo", "Sergio Sánchez", "Pedro Riesco", "David Cano", "Juanele", "Cherenkov", "Mikhail Kavelashvili", "Lediakhov"]
  },
  {
    club: "Tenerife",
    year: 2021,
    yearLabel: "2021-22",
    country: "Espanha",
    continent: "Europa",
    baseOverall: 65,
    tier: "worst-campaign",
    players: ["Juan Soriano", "Jeremy Mellot", "José León", "Nikola Sipcic", "Álex Muñoz", "Aitor Sanz", "Álex Corredera", "Borja Garcés", "Samuel Shashoua", "Elady Zorrilla", "Enric Gallego"]
  },
  {
    club: "Grenoble Foot 38",
    year: 2009,
    yearLabel: "2009-10",
    country: "França",
    continent: "Europa",
    baseOverall: 58,
    tier: "worst-campaign",
    players: ["Ronny Le Crom", "Walid Regragui", "Milorad Pekovic", "David Jemmali", "Robin", "Laurent Batlles", "Sofiane Feghouli", "Diego", "Daniel Moreira", "Nassim Akrour", "Danijel Ljuboja"]
  },
  {
    club: "Arles-Avignon",
    year: 2010,
    yearLabel: "2010-11",
    country: "França",
    continent: "Europa",
    baseOverall: 57,
    tier: "worst-campaign",
    players: ["Cyrille Merville", "Sebastien Piocelle", "Alaixys Romao", "Bakary Soro", "Camel Meriem", "Kamel Ghilas", "Yann Kermorgant", "Angel Marcos", "Franck Dja Djedje", "Andre Ayew", "Angelos Charisteas"]
  },
  {
    club: "Troyes",
    year: 2015,
    yearLabel: "2015-16",
    country: "França",
    continent: "Europa",
    baseOverall: 58,
    tier: "worst-campaign",
    players: ["Paul Bernardoni", "Chris Mavinga", "Mouhamadou Dabo", "Matthieu Saunier", "Karim Azamoum", "Benjamin Nivet", "Fabien Camus", "Stephane Darbion", "Thiago Xavier", "Corentin Jean", "Brayan Perea"]
  },
  {
    club: "FC Schaffhausen",
    year: 2006,
    yearLabel: "2006-07",
    country: "Suíça",
    continent: "Europa",
    baseOverall: 57,
    tier: "worst-campaign",
    players: ["Marcel Herzog", "Raphael Wicky", "David Sesa", "Marco Thrier", "Orhan Mustafi", "Fabio Coltorti", "Stephan Andrist", "Luca Denicolà", "Murat Ural", "Carlos Varela", "Sanel Kuljic"]
  },
  {
    club: "Admira Wacker",
    year: 2017,
    yearLabel: "2017-18",
    country: "Áustria",
    continent: "Europa",
    baseOverall: 58,
    tier: "worst-campaign",
    players: ["Andreas Leitner", "Fabio Strauss", "Lukas Grozurek", "Markus Wostry", "Daniel Toth", "Maximilian Sax", "Dominik Starkl", "Stephan Zwierschitz", "Wilhelm Vorsager", "Sasa Kalajdzic", "Patrick Schmidt"]
  },
  {
    club: "Rotor Volgograd",
    year: 2020,
    yearLabel: "2020-21",
    country: "Rússia",
    continent: "Europa",
    baseOverall: 57,
    tier: "worst-campaign",
    players: ["Josip Condric", "Oleg Kozhemyakin", "Solomon Kverkvelia", "Cedric Gogoua", "Danil Stepanov", "Oleg Aleynik", "Zuriko Davitashvili", "Kamil Mullin", "Flamarion", "Andres Ponce", "Ilya Zhigulev"]
  },
  {
    club: "Pro Vercelli",
    year: 2017,
    yearLabel: "2017-18",
    country: "Itália",
    continent: "Europa",
    baseOverall: 57,
    tier: "worst-campaign",
    players: ["Carlo Pinsoglio", "Filippo Berra", "Elia Legati", "Umberto Germano", "Carlo Mammarella", "Giuseppe Vives", "Luca Castiglia", "Alessandro Polidori", "Reginaldo", "Claudio Morra", "Mattia Bani"]
  },
  {
    club: "Chacarita Juniors",
    year: 2017,
    yearLabel: "2017-18",
    country: "Argentina",
    continent: "América do Sul",
    baseOverall: 57,
    tier: "worst-campaign",
    players: ["Pedro Fernández", "Germán Ré", "Federico Rosso", "Juan Cruz González", "Matías Rodríguez", "Miguel Mellado", "Gonzalo Bazán", "Joaquín Ibáñez", "Nicolás Oroz", "Mauro Matos", "Rodrigo Salinas"]
  },
  {
    club: "Quilmes",
    year: 2016,
    yearLabel: "2016-17",
    country: "Argentina",
    continent: "América do Sul",
    baseOverall: 56,
    tier: "worst-campaign",
    players: ["César Rigamonti", "Alan Alegre", "Lucas Suárez", "Matías Orihuela", "Federico Andrada", "Gastón Bottino", "Santiago Romero", "Nicolás Da Campo", "Braian Lluy", "Facundo Diz", "Francisco Ilarregui"]
  },
  {
    club: "Unión Magdalena",
    year: 2019,
    country: "Colômbia",
    continent: "América do Sul",
    baseOverall: 56,
    tier: "worst-campaign",
    players: ["Horacio Ramírez", "Yulián Gómez", "Edisson Restrepo", "David Ferreira", "Jhonier Viveros", "Juan Pereira", "Luis Carlos Arias", "Roberto Hinojosa", "Ricardo Márquez", "Luis Arias", "Ruyery Blanco"]
  },
  {
    club: "Jaguares de Chiapas",
    year: 2017,
    country: "México",
    continent: "América do Norte",
    baseOverall: 57,
    tier: "worst-campaign",
    players: ["Óscar Jiménez", "Julián Velázquez", "Jonathan Fabbro", "Bruno Pires", "Felix Araujo", "Edgar Dueñas", "Luis Miño", "Christian Bermúdez", "Avilés Hurtado", "Silvio Romero", "Javier Orozco"]
  },
  {
    club: "Veracruz",
    year: 2019,
    country: "México",
    continent: "América do Norte",
    baseOverall: 55,
    tier: "worst-campaign",
    players: ["Sebastián Jurado", "Carlos Gutiérrez", "Leobardo López", "Fabricio Silva", "Rodrigo López", "Bryan Carrasco", "Kazim-Richards", "Ángel Reyna", "Abraham González", "Diego Chávez", "Cristian Menéndez"]
  },
  {
    club: "Dorados de Sinaloa",
    year: 2006,
    country: "México",
    continent: "América do Norte",
    baseOverall: 57,
    tier: "worst-campaign",
    players: ["Cristian Campestrini", "Jorge Campos", "Hugo Colace", "Andrés Orozco", "Diego Mejía", "Ariel González", "Sebastián Abreu", "Pep Guardiola", "Roberto Nurse", "Cuauhtémoc Blanco", "Jared Borgetti"]
  },
  {
    club: "Atlético Bucaramanga",
    year: 2008,
    country: "Colômbia",
    continent: "América do Sul",
    baseOverall: 56,
    tier: "worst-campaign",
    players: ["Leonardo Castellanos", "Luis Delgado", "Javier Flórez", "Gerardo Bedoya", "Sherman Cárdenas", "Jhon Pérez", "Orlando Ballesteros", "Harrison Otálvaro", "Néstor Salazar", "Edwin Aguilar", "Milton Rodríguez"]
  },
  {
    club: "Santa Cruz",
    year: 2006,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 56,
    tier: "worst-campaign",
    players: ["Tiago Cardoso", "Carlinhos", "Valença", "Leandro Camilo", "Adilson", "Rosembrick", "Nildo", "Adriano", "Kuki", "Reinaldo Aleluia", "Carlinhos Bala"]
  },
  {
    club: "América-RN",
    year: 2007,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 55,
    tier: "worst-campaign",
    players: ["Renê", "Marcos Tamandaré", "Róbson", "Márcio Alemão", "Marcelo Sá", "Ralf", "Souza", "Netinho", "Paulo Isidoro", "Geovane", "Somália"]
  },
  {
    club: "Paraná Clube",
    year: 2018,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 55,
    tier: "worst-campaign",
    players: ["Richard", "Junior", "Rayan", "René Santos", "Mansur", "Jhonny Lucas", "Alex Santana", "Carlos Eduardo", "Silvinho", "Rodolfo", "Thiago Santos"]
  },
  {
    club: "Joinville",
    year: 2015,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 56,
    tier: "worst-campaign",
    players: ["Agenor", "Mário Sérgio", "Bruno Aguiar", "Rafael", "Diego", "Anselmo", "Kadu", "Marcelo Costa", "Marion", "Edigar Junio", "Kempes"]
  },
  {
    club: "Náutico",
    year: 2013,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 55,
    tier: "worst-campaign",
    players: ["Gideão", "Auremir", "Jean Rolt", "William Alves", "Eltinho", "Derley", "Martinez", "Hugo", "Maikon Leite", "Rogério", "Olivera"]
  },
  {
    club: "Chapecoense",
    year: 2021,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 55,
    tier: "worst-campaign",
    players: ["Keiller", "Matheus Ribeiro", "Jordan", "Derlan", "Busanello", "Moisés Ribeiro", "Anderson Leite", "Lima", "Mike", "Perotti", "Anselmo Ramon"]
  },
  {
    club: "Portuguesa",
    year: 2013,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 57,
    tier: "worst-campaign",
    players: ["Lauro", "Luis Ricardo", "Valdomiro", "Moisés Moura", "Rogério", "Ferdinando", "Souza", "Moisés", "Diogo", "Henrique", "Gilberto"]
  },
  {
    club: "Oeste",
    year: 2020,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 55,
    tier: "worst-campaign",
    players: ["Caíque França", "Cicinho", "Kanu", "Maurício", "Rael", "Betinho", "Mazinho", "Bruno Lopes", "Pedrinho", "Kalil", "Fábio"]
  },
  {
    club: "São Caetano",
    year: 2014,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 55,
    tier: "worst-campaign",
    players: ["Fábio", "Samuel Xavier", "Eli Sabiá", "Domingos", "Bruno Recife", "Moradei", "Eder", "Aílton", "Danielzinho", "Jobson", "Wagner Carioca"]
  },
  {
    club: "Guarani",
    year: 2010,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 56,
    tier: "worst-campaign",
    players: ["Douglas", "Apodi", "Aílson", "Fabão", "Márcio Careca", "Renan", "Baiano", "Vitor Júnior", "Mazola", "Roger", "Ricardo Xavier"]
  },
  {
    club: "Ipatinga",
    year: 2008,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 55,
    tier: "worst-campaign",
    players: ["Fred", "Mariano", "Léo Oliveira", "Márcio Santos", "Anderson Pico", "Leandro Salino", "Xavier", "Walter Minhoca", "Kléber", "Adeílson", "Luís Mário"]
  },
  {
    club: "CRB",
    year: 2012,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 55,
    tier: "worst-campaign",
    players: ["Tiago", "Paulo Sérgio", "Ednei", "Leandro", "Gleidson", "Geovani", "Marcelo Maciel", "Wanderley", "Aloísio Chulapa", "Denílson", "Schwenck"]
  },
  {
    club: "ABC",
    year: 2023,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 55,
    tier: "worst-campaign",
    players: ["Simão", "Gedeílson", "Richardson", "Afonso", "Romário", "Walfrido", "Daniel", "Maycon Douglas", "Fábio Lima", "Felipe Garcia", "Paulo Sérgio"]
  },
  {
    club: "Villa Nova-MG",
    year: 2022,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 55,
    tier: "worst-campaign",
    players: ["Georgemy", "Paulo Henrique", "Rafael Caldeira", "Caique", "Alyson", "Dudu", "Gabriel Davis", "Wellington", "Elias", "Pedrinho", "Henrique"]
  },
  {
    club: "Juventus-SP",
    year: 2007,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 55,
    tier: "worst-campaign",
    players: ["Maurício", "Marquinhos", "Alexandre", "Gustavo", "André", "Marcelo", "Adãozinho", "Rincón", "Lelo", "Alex Afonso", "Tuta"]
  },
  {
    club: "América-RJ",
    year: 2011,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 55,
    tier: "worst-campaign",
    players: ["Luis Henrique", "Bruno Carvalho", "Ciro", "Luiz Alberto", "Gilson", "Bruno Reis", "Marcos Denner", "Felipe Adão", "Alexandro", "Sorato", "Tuta"]
  },
  {
    club: "Ferroviária",
    year: 1996,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 55,
    tier: "worst-campaign",
    players: ["Mauro", "Edson Boaro", "André Luís", "Marcelo", "Toninho", "Pintado", "Válber", "Jorginho", "Tiba", "Washington", "Careca"]
  },
  {
    club: "Treze",
    year: 2019,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 55,
    tier: "worst-campaign",
    players: ["Mauro Iguatu", "Marcelinho", "Ítalo", "Nilson Júnior", "Silva", "Robson", "Vanger", "Marcelinho Paraíba", "Caxito", "Eduardo", "Neto Baiano"]
  },
  {
    club: "Íbis Sport Club",
    year: 2021,
    country: "Brasil",
    continent: "América do Sul",
    baseOverall: 55,
    tier: "worst-campaign",
    players: ["Bruno", "Wesley", "Rafael", "Danilo", "Júnior", "Doda", "Kássio", "Wellington", "Lucas", "Beto", "Mauro Shampoo"]
  }
];

const allSeeds = [...seeds, ...worstCampaignSeeds];

export const legendaryTeams: ILegendaryTeam[] = allSeeds.map((seed) => {
  const id = `${slug(seed.club)}-${slug(String(seed.yearLabel ?? seed.year))}`;
  const tier = seed.tier ?? "legendary";

  return {
    id,
    club: seed.club,
    year: seed.year,
    yearLabel: seed.yearLabel,
    country: seed.country,
    continent: seed.continent,
    baseOverall: seed.baseOverall,
    tier,
    players: playersFor(id, seed.baseOverall, seed.players, tier === "worst-campaign" ? 50 : 70)
  };
});
