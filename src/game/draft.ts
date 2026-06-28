import { legendaryTeams } from "@/data/legendaryTeams";
import { IDraftOption, ILegendaryTeam, IPlayer, Position } from "@/types/game";
import { createSeededRandom } from "@/game/random";
import { positionFit } from "@/game/teamStrength";

function bestPlayerForPosition(players: IPlayer[], position: Position, selectedPlayerIds: string[]) {
  return players
    .filter((player) => !selectedPlayerIds.includes(player.id))
    .map((player) => ({
      player,
      fit: positionFit(position, player)
    }))
    .filter((option) => option.fit >= 0.84)
    .sort((a, b) => b.player.overall * b.fit - a.player.overall * a.fit)[0];
}

export function getDraftOptions(position: Position, roundIndex: number, seed: string, selectedPlayerIds: string[]): IDraftOption[] {
  const random = createSeededRandom(`${seed}-${position}-${roundIndex}-${selectedPlayerIds.join("|")}`);
  const teams = random.shuffle(legendaryTeams);
  const options: IDraftOption[] = [];

  for (const team of teams) {
    const candidate = bestPlayerForPosition(team.players, position, selectedPlayerIds);

    if (!candidate) {
      continue;
    }

    options.push({
      team,
      player: candidate.player,
      fit: candidate.fit
    });

    if (options.length === 3) {
      return options;
    }
  }

  return options;
}

export function getDraftTeam(seed: string, pickIndex: number, rerollIndex: number, selectedTeamIds: string[] = []): ILegendaryTeam {
  const random = createSeededRandom(`${seed}-team-${pickIndex}-${rerollIndex}-${selectedTeamIds.join("|")}`);
  const teams = random.shuffle(legendaryTeams).filter((team) => !selectedTeamIds.includes(team.id));

  return teams[0] ?? random.pick(legendaryTeams);
}
