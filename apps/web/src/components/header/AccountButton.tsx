import { getSession } from "@/lib/server/get-session"
import { User } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export const AccountButton = async () => {
	const session = await getSession();

	if (!session?.user ) {
		return (
			<Button asChild size={"lg"}>
					<Link href="/login">Join the fun</Link>
			</Button>
		)
	}
	
	return (
			<Button>
				<Link href="/account" className="flex items-center gap-2">
					<User /> { session.user.name ?? session.user.email }
				</Link>
			</Button>
		)
}