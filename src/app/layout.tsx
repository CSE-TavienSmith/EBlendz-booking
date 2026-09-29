import type { Metadata} from "next";
import { Anton, Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Each font gets a CSS variable name we can use in globals.css.
const anton = Anton ({ variable: "--font-anton", weight: "400", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eblendz | Book a Cut",
  description: "Sharp lines, clean fades. Book a cut with Eblendz.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
