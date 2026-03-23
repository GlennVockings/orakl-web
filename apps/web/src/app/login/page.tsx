import { LogInForm, SignUpForm } from "@/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";

export default function Login() {
  return (
    <div className="my-10">
      <div className="flex gap-4 bg-card shadow-xl p-4 rounded-lg">
        <Tabs defaultValue="login" className="w-full">
          <TabsList>
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LogInForm />
          </TabsContent>
          <TabsContent value="signup">
            <div>
              <div className="mt-1 rounded-lg border bg-muted px-4 py-3 text-sm text-muted-foreground">
                <div className="flex gap-1">
                  <Info className="h-4 w-4 mt-0.5" />
                  <p>
                    <strong>Important:</strong> Sign up has been disabled until full realease.
                  </p>
                </div>
              </div>
              
              <SignUpForm />
            </div>
          </TabsContent>
        </Tabs>
        
      </div>
    </div>
  );
}