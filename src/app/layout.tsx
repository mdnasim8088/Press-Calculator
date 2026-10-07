import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_Arabic, Noto_Sans_Bengali, Orbitron, Rajdhani } from "next/font/google";
import { BottomNav } from "@/components/layout/BottomNav";
import { ClientBoot } from "@/components/layout/ClientBoot";
import { IconRail } from "@/components/layout/IconRail";
import { Particles } from "@/components/layout/Particles";
import "./globals.css";

const orbitron = Orbitron({ variable: "--font-orbitron", subsets: ["latin"], weight: ["600", "700", "800"] });
const rajdhani = Rajdhani({ variable: "--font-rajdhani", subsets: ["latin"], weight: ["500", "600", "700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });
// Help-text scripts: used automatically as fallbacks for Bangla and Arabic characters.
const bengali = Noto_Sans_Bengali({ variable: "--font-bengali", subsets: ["bengali"], weight: ["400", "600"] });
const arabic = Noto_Sans_Arabic({ variable: "--font-arabic", subsets: ["arabic"], weight: ["400", "600"] });

export const metadata: Metadata = {
  title: { default: "Press Calculator", template: "%s · Press Calculator" },
  description: "Calculator for printing, stickers, cutter stickers, banners and vinyl: area, sheets, material and price.",
  applicationName: "Press Calculator",
  appleWebApp: { capable: true, title: "Press Calc", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${rajdhani.variable} ${inter.variable} ${jetbrains.variable} ${bengali.variable} ${arabic.variable} h-full antialiased`}
    >
      <body className="relative isolate min-h-full">
        <Particles />
        <IconRail />
        <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-24 sm:px-6 md:pb-10 md:pl-26 lg:pl-28">
          {children}
        </main>
        <BottomNav />
        <ClientBoot />
      </body>
    </html>
  );
}
