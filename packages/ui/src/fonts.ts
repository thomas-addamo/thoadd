import localFont from "next/font/local";
import { Instrument_Serif } from "next/font/google";

export const clash = localFont({
  src: [
    { path: "../fonts/ClashDisplay-Light.otf", weight: "300" },
    { path: "../fonts/ClashDisplay-Regular.otf", weight: "400" },
    { path: "../fonts/ClashDisplay-Medium.otf", weight: "500" },
  ],
  variable: "--font-clash",
  display: "swap",
});

export const general = localFont({
  src: [
    { path: "../fonts/GeneralSans-Regular.otf", weight: "400" },
    { path: "../fonts/GeneralSans-Medium.otf", weight: "500" },
  ],
  variable: "--font-general",
  display: "swap",
});

export const instrument = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const fontVariables = `${clash.variable} ${general.variable} ${instrument.variable}`;
