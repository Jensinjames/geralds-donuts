import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" to="/">
          <span className="font-bold">Sandbox</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/dashboard">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="#">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to the Sandbox
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Your development environment for testing and experimentation.
                </p>
              </div>
              <div className="space-x-4">
                <Link to="/dashboard">
                  <Button>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              {[
                {
                  title: "Real-time Updates",
                  description: "See your changes instantly with our real-time development environment."
                },
                {
                  title: "Secure Testing",
                  description: "Test your applications in a secure and isolated environment."
                },
                {
                  title: "Comprehensive Tools",
                  description: "Access all the tools you need for development and testing."
                }
              ].map((feature) => (
                <Card key={feature.title} className="flex flex-col items-center space-y-4 p-6">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Sandbox. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}