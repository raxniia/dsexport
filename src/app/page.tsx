"use client";
import { LangProvider } from "@/components/LangProvider";
import { NewsTicker } from "@/components/NewsTicker";
import { Bulletin } from "@/components/Bulletin";
import { Invest } from "@/components/Invest";
import { Events } from "@/components/Events";
import { FlagsBand, Hero, Journey, Marquee, Nav, ProductBand } from "@/components/Top";
import { About, Assistant, Hub, Services } from "@/components/Middle";
import { Booking, Contact, FloatingWA, Footer, Knowledge, Network, Tools, Updates } from "@/components/Bottom";

export default function Home() {
  return (
    <LangProvider>
      <Nav />
      <main>
        <Hero />
        <NewsTicker />
        <Marquee />
        <ProductBand />
        <FlagsBand />
        <Network />
        <Journey />
        <Bulletin />
        <Invest />
        <Services />
        <About />
        <Events />
        <Assistant />
        <Hub />
        <Tools />
        <Knowledge />
        <Updates />
        <Booking />
        <Contact />
      </main>
      <Footer />
      <FloatingWA />
    </LangProvider>
  );
}
