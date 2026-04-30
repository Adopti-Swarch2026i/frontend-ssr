"use client";
import Link from "next/link";
import {
  PawPrint,
  Search,
  Heart,
  Home,
  Users,
  ClipboardList,
  MessageCircle,
  Filter,
  HeartHandshake,
  Moon,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SplineScene } from "@/components/effects/spline-scene";
import { Spotlight } from "@/components/effects/spotlight";
import { GifPlaceholder } from "@/components/ui/GifPlaceholder";
import { useInView } from "@/hooks/useInView";
import { ROUTES } from "@/config/routes";
import LandingHeader from "./LandingHeader";
import { cn } from "@/lib/utils";

function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
    >
      {children}
    </div>
  );
}

const stats = [
  { icon: Search, value: "342", label: "Mascotas Perdidas" },
  { icon: Heart, value: "287", label: "Mascotas Encontradas" },
  { icon: Home, value: "156", label: "Reunidas con sus familias" },
  { icon: Users, value: "1,200+", label: "Miembros de la comunidad" },
];

const features = [
  {
    icon: ClipboardList,
    title: "Reportar Perdidos y Encontrados",
    description:
      "Crea reportes detallados con fotos, ubicacion y descripcion para ayudar a encontrar a tu mascota.",
  },
  {
    icon: MessageCircle,
    title: "Chat en Tiempo Real",
    description:
      "Comunicate directamente con personas que hayan visto o encontrado a tu mascota.",
  },
  {
    icon: Filter,
    title: "Busqueda Avanzada",
    description:
      "Filtra por especie, ciudad, estado y mas para encontrar rapidamente lo que buscas.",
  },
  {
    icon: HeartHandshake,
    title: "Seguimiento de Reunificacion",
    description:
      "Lleva un seguimiento del estado de tu mascota hasta que vuelva a casa sana y salva.",
  },
  {
    icon: Users,
    title: "Comunidad Activa",
    description:
      "Una red de personas comprometidas con el bienestar animal que se ayudan mutuamente.",
  },
  {
    icon: Moon,
    title: "Modo Oscuro",
    description:
      "Navega comodamente de dia o de noche con nuestro tema claro y oscuro.",
  },
];

const steps = [
  {
    number: "1",
    title: "Reporta",
    description:
      "Sube la informacion y fotos de tu mascota perdida o encontrada en minutos.",
  },
  {
    number: "2",
    title: "Conecta",
    description:
      "Chatea con personas que puedan tener informacion sobre tu mascota.",
  },
  {
    number: "3",
    title: "Reune",
    description:
      "Sigue el estado del reporte hasta lograr la reunificacion.",
  },
];

const testimonials = [
  {
    name: "Maria Garcia",
    text: "Gracias a Adopti encontre a mi gatita Luna en solo 3 dias. La comunidad fue increible.",
    initial: "M",
  },
  {
    name: "Carlos Rodriguez",
    text: "Encontre un perrito perdido y gracias al chat pude contactar a su familia rapidamente.",
    initial: "C",
  },
  {
    name: "Ana Martinez",
    text: "La plataforma es muy facil de usar. Reporte a mi perro y recibi ayuda de toda la ciudad.",
    initial: "A",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />

      {/* Hero — 3D Interactive */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background paw-bg-pattern" />
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="hsl(152 45% 48% / 0.15)"
        />

        <div className="container relative py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left content */}
            <div className="space-y-6 relative z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground animate-fade-in-up leading-tight">
                Ayudamos a reunir mascotas con sus familias
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg animate-fade-in-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
                Adopti es la plataforma comunitaria donde puedes reportar
                mascotas perdidas, encontrar animales y conectar con personas que
                quieren ayudar.
              </p>
              <div className="flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
                <Button size="lg" asChild className="gap-2">
                  <Link href={ROUTES.LOGIN}>
                    Reportar Mascota
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href={ROUTES.LOGIN}>Explorar Reportes</Link>
                </Button>
              </div>
              <div className="flex gap-6 pt-2 animate-fade-in-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
                <div className="flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">500+ Reunidos</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium">1,000+ Reportes</span>
                </div>
              </div>
            </div>

            {/* Right — 3D scene */}
            <figure className="relative h-[350px] md:h-[450px]">
              <SplineScene
                scene="https://prod.spline.design/a6X8xKJqX2WPq0Er/scene.splinecode"
                className="w-full h-full scale-[2.2]"
                style={{ transformOrigin: "center 60%" }}
              />
            </figure>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 bg-card">
        <div className="container py-12">
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="text-center space-y-2"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features */}
      <section id="funciones" className="py-20 md:py-28">
        <div className="container">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Que ofrecemos
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Todo lo que necesitas para encontrar a tu mascota o ayudar a otros
              a reunirse con las suyas.
            </p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.title}>
                <Card
                  className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/50"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="como-funciona"
        className="py-20 md:py-28 bg-secondary/30 paw-bg-pattern"
      >
        <div className="container">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Como Funciona
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tres simples pasos para reunir a tu mascota con tu familia.
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {steps.map((step, i) => (
                <AnimatedSection key={step.number}>
                  <div
                    className="flex gap-4 items-start"
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-1">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
            <AnimatedSection>
              <GifPlaceholder
                label="GIF del proceso"
                aspectRatio="video"
                className="max-w-lg mx-auto"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Community / Testimonials */}
      <section id="comunidad" className="py-20 md:py-28">
        <div className="container">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Una comunidad que se preocupa
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Historias reales de familias que se reunieron con sus mascotas
              gracias a Adopti.
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {testimonials.map((t) => (
              <AnimatedSection key={t.name}>
                <Card className="h-full border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
                        {t.initial}
                      </div>
                      <span className="font-medium">{t.name}</span>
                    </div>
                    <p className="text-muted-foreground text-sm italic">
                      &ldquo;{t.text}&rdquo;
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection>
            <GifPlaceholder
              label="GIF de la comunidad"
              aspectRatio="video"
              className="max-w-2xl mx-auto"
            />
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-primary/5 paw-bg-pattern relative overflow-hidden">
        <div className="absolute top-8 left-8 opacity-20">
          <PawPrint className="h-16 w-16 text-primary animate-bounce-gentle" />
        </div>
        <div className="absolute bottom-8 right-8 opacity-20">
          <PawPrint className="h-12 w-12 text-accent animate-bounce-gentle delay-300" />
        </div>
        <div className="container relative text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cada mascota merece volver a casa
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Unete a nuestra comunidad y ayuda a reunir familias con sus
              mascotas. Juntos hacemos la diferencia.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="gap-2">
                <Link href={ROUTES.LOGIN}>
                  Comenzar Ahora
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card py-12">
        <div className="container">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <Link href="/"
                className="flex items-center gap-2 font-bold text-lg text-primary"
              >
                <PawPrint className="h-6 w-6" />
                Adopti
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                La plataforma comunitaria para reunir mascotas perdidas con sus
                familias.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Navegacion</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#funciones" className="hover:text-foreground transition-colors">
                    Funciones
                  </a>
                </li>
                <li>
                  <a href="#como-funciona" className="hover:text-foreground transition-colors">
                    Como Funciona
                  </a>
                </li>
                <li>
                  <a href="#comunidad" className="hover:text-foreground transition-colors">
                    Comunidad
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Acceso</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href={ROUTES.LOGIN} className="hover:text-foreground transition-colors">
                    Iniciar sesión
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              Hecho con amor por la comunidad animalista
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
