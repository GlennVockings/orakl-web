import { NewLookMarket } from "./NewLookMarket"
import { Teams } from "./Teams"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Bets } from "./Bets"

export const MainContent = () => {
	return (
		<div className="flex flex-col gap-3">
			<Tabs defaultValue="market">
				<TabsList>
					<TabsTrigger value="market">Market</TabsTrigger>
					<TabsTrigger value="team">Teams</TabsTrigger>
					<TabsTrigger value="bets">Bets</TabsTrigger>
				</TabsList>
				<TabsContent value="team">
					<Teams />
				</TabsContent>
				<TabsContent value="market">
					<NewLookMarket />
				</TabsContent>
				<TabsContent value="bets">
					<Bets />
				</TabsContent>
			</Tabs>
		</div>
	)
}