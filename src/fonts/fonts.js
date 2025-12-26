import localFont from "next/font/local";

const satoshi = localFont({
  src: "./Satoshi-Variable.ttf",
  preload: false,
});
const hanken = localFont({
    src: "./HankenGrotesk-VariableFont_wght.ttf",
    preload: false,
});

const clash = localFont({
    src: "./ClashDisplay-Variable.ttf",
    preload: false,
});

export const fonts = { satoshi, hanken, clash };