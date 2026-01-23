"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { LogInForm } from "./LogInForm"
import { SignUpForm } from "./SignUpForm"

export default function UserModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Log in</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs defaultValue="logIn">
          <TabsList>
            <TabsTrigger value="logIn">Log in</TabsTrigger>
            <TabsTrigger value="signUp">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="logIn">
            <DialogHeader>
              <DialogTitle>Log in</DialogTitle>
            </DialogHeader>
            <LogInForm />
          </TabsContent>
          <TabsContent value="signUp">
            <DialogHeader>
              <DialogTitle>Sign up</DialogTitle>
            </DialogHeader>
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
