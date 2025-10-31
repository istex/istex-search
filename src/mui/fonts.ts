import { Inter, Montserrat, Open_Sans as OpenSans } from "next/font/google";

export const montserrat = Montserrat({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-montserrat",
});

export const openSans = OpenSans({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-open-sans",
});

export const inter = Inter({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});
