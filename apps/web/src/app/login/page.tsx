import { LogInForm, SignUpForm } from "@/components";
import { Info } from "lucide-react";

export default function Login() {
  return (
    <div className="py-10">
      <div className="flex gap-4 border-2 p-4 rounded-lg">
        <div className="w-1/2">
          <p className="font-semibold tracking-wide">Log in</p>
          <LogInForm />
        </div>
        <div className="w-1/2">
          <p className="font-semibold tracking-wide mb-2">Sign up</p>
          
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
      </div>
    </div>
  );
}