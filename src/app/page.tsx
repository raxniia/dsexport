"use client";
import { LangProvider } from "@/components/LangProvider";
import { NewsTicker } from "@/components/NewsTicker";
import { Bulletin } from "@/components/Bulletin";
import { Hero, Journey, Marquee, Nav, ProductBand } from "@/components/Top";
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
        <Network />
        <Journey />
        <Bulletin />
        <Services />
        <About />
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
