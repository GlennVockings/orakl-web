import { CardScene } from "@/components/cards/CardScene";
import { LoginForm } from "@/components/forms/LoginForm";
import { SignUpForm } from "@/components/forms/SignUpForm";
import { KnowledgeVoid } from "@/components/KnowledgeVoid/KnowledgeVoid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  return (
    <KnowledgeVoid
      vanishingPoint={{
        x: 0.7,
        y: 0.75,
      }}
      mobileVanishingX={0.5}
    >
      <CardScene contentClassName="max-w-[1100px]">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/45">
              Orakl
            </p>

            <h1 className="max-w-[700px] text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl sm:leading-[1.05] lg:text-[56px]">
              Enter Orakl.
            </h1>

            <p className="max-w-[560px] text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
              Sign in to continue, or create an account to start playing.
            </p>
          </div>

          <div className="hidden lg:grid lg:gap-6 lg:grid-cols-2">
            <LoginForm />
            <SignUpForm />
          </div>

          <div className="lg:hidden">
            <Tabs defaultValue="login">
              <TabsList>
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="signup">
                <SignUpForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardScene>
    </KnowledgeVoid>
  );
}
