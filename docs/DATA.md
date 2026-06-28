# Dados Offline

O arquivo `src/data/legendaryTeams.ts` contem os 100 times lendarios. Cada time tem 11 jogadores reais do periodo historico.

Os atributos não são copiados de FIFA/EA. Eles são estimativas internas do jogo, derivadas por:

- força base do time;
- posição do jogador;
- encaixe na formação escolhida.

## Como alterar um time

1. Abra `src/data/legendaryTeams.ts`.
2. Edite o bloco dentro de `seeds`.
3. Mantenha exatamente 11 nomes.
4. Rode:

```bash
pnpm test
pnpm typecheck
```

## Como alterar competicoes

Os adversários ficam em `src/data/competitions.ts`.
Para ajustar dificuldade de um adversário, altere o campo `strength`.
