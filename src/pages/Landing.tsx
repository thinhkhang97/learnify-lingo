import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Gamepad, BookOpen, Brain, Rocket, Check, ArrowRight } from "lucide-react";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
const Landing = () => {
  return <div className="min-h-screen">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in">
                Learn New Words <span className="text-primary">Effectively</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl animate-slide-up animate-delay-100">
                Build your vocabulary through interactive games, personalized tracking, and smart learning techniques.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up animate-delay-200">
                <Link to="/app/dashboard">
                  <Button size="lg" className="gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/app/games">
                  <Button size="lg" variant="outline" className="gap-2">
                    Try Games <Gamepad className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 animate-fade-in animate-delay-300">
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary to-purple-500 opacity-50 blur"></div>
                <div className="relative bg-card rounded-xl overflow-hidden shadow-xl">
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Features Designed for Learning</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to expand your vocabulary and master new words.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={BookOpen} title="Vocabulary Management" description="Save, organize, and review words you want to learn." delay={100} />
            <FeatureCard icon={Gamepad} title="Interactive Games" description="Learn through play with our engaging word games." delay={200} />
            <FeatureCard icon={Brain} title="Smart Review" description="Algorithms that help you review when you need it most." delay={300} />
            <FeatureCard icon={Rocket} title="Track Progress" description="See your improvement with detailed statistics." delay={400} />
            <FeatureCard icon={Check} title="Daily Challenges" description="Build a learning habit with daily word challenges." delay={500} />
            <FeatureCard icon={GraduationCap} title="Learn Your Way" description="Personalized learning paths based on your needs." delay={600} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-20 px-4 rounded-t-3xl">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold animate-fade-in">Ready to Expand Your Vocabulary?</h2>
          <p className="text-xl text-muted-foreground animate-slide-up animate-delay-100">
            Start learning new words today in a fun and effective way.
          </p>
          <div className="animate-slide-up animate-delay-200">
            <Link to="/app/dashboard">
              <Button size="lg" className="gap-2">
                Get Started Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>;
};

// Feature card component
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay = 0
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}) => {
  return <Card className={`hover-scale animate-slide-up animate-delay-${delay}`}>
      <CardContent className="pt-6">
        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>;
};
export default Landing;