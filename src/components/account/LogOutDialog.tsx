"use client"

import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";

export const LogOutDialog = () => {
	const router = useRouter();

	async function logout() {
		await authClient.signOut();

		router.push("/");
		router.refresh();
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>
					Log out
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you sure?</DialogTitle>
				</DialogHeader>
				<div className="flex gap-4">
					<Button onClick={logout}>
						Confirm
					</Button>
					<DialogClose asChild>
						<Button type="button">
							Cancel
						</Button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	)
}