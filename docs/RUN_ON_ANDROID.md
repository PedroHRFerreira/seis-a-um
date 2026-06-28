# Rodar no Android

## Pelo Expo Go

```bash
pnpm install
pnpm start
```

Abra o Expo Go no celular e leia o QR code.

## Via cabo USB

1. Ative o modo desenvolvedor no Android.
2. Ative depuracao USB.
3. Conecte o celular no Mac.
4. Rode:

```bash
pnpm android
```

## Gerar APK depois

Quando quiser gerar APK local ou pela EAS:

```bash
npx eas build -p android --profile preview
```

Este app não depende de back-end. O save fica no aparelho.
