import { Button } from "./ui/button"

export const Footer = () => {
	return (
		<footer className="mt-24 border-t pt-10 pb-6 max-w-6xl mx-auto flex flex-col gap-4 px-4">
			<div className="flex items-center justify-between font-[Space_Grotesk] uppercase">
				<div>
					<p>Got an improvement?</p>
					<p className="text-primary">Let me know</p>
				</div>
				<Button>
					Contact me
				</Button>
			</div>
			<div className="flex justify-between text-xs text-muted-foreground">
				<p>© {new Date().getFullYear()} Faux Stakes</p>
				<p>Built for trash talk, not transactions</p>
			</div>
		</footer>
	)
}
