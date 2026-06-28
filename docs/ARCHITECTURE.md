# Arquitetura

O app foi criado em Expo React Native com TypeScript e não possui back-end. Tudo que o jogo precisa fica empacotado no próprio aplicativo.

## Pastas principais

- `src/AppRoot.tsx`: navegacao simples por estado.
- `src/screens`: telas completas do fluxo.
- `src/components`: componentes visuais pequenos.
- `src/data`: dados offline.
- `src/game`: motor puro da simulação.
- `src/storage`: save local com AsyncStorage.
- `src/theme`: tema dark/neon.

## Regra de simplicidade

Se uma regra altera resultado de jogo, coloque em `src/game`.
Se um dado e fixo, coloque em `src/data`.
Se a mudanca e visual, mexa em `src/screens`, `src/components` ou `src/theme`.
