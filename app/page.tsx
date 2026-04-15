import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Process } from "@/components/process"
import { CaseStudies } from "@/components/case-studies"
import { Benefits } from "@/components/benefits"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar />
      <Hero />
      <Services />
      <Process />
      <CaseStudies />
      <Benefits />
      <CTA />
      <Footer />
    </main>
  )
}
