# Seis a Um

App mobile offline de simulação de temporada com times lendários do futebol.

## Como rodar

```bash
pnpm install
pnpm start
```

Depois, abra no celular pelo Expo Go ou rode via cabo:

```bash
pnpm android
```

## Estrutura

- `src/data`: dados locais de times, formações, estilos e adversários.
- `src/game`: motor puro de draft, força do time e simulação.
- `src/screens`: telas do app.
- `src/components`: pecas visuais reutilizaveis.
- `src/storage`: save local no aparelho.
- `src/theme`: tema dark/neon.
- `docs`: documentacao para entender e alterar o projeto.
