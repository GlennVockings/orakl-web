import { Market, MarketStatus, Selection, SelectionStatus } from "@/lib/types";
import { MakeBet } from "./MakeBet";
import { Crown } from "lucide-react";

export const SelectionForm = ({ selections, market, gameId } : { selections: Selection[], market: Market, gameId: string }) => {
	return (
		<div className="flex flex-col gap-1">
			{
				selections.map((selection) => {
					if (market.status !== MarketStatus.OPEN) {
						return (
							<div key={selection.id} className="flex items-center justify-between h-10 rounded-sm px-4 shadow-xs border-2 border-accent">
								<div className="flex gap-3">
									{ selection.status === SelectionStatus.WINNER ? (<Crown color="#FFBF00" />) : (<div className="w-6"></div>)}
									<p>{ selection.label ? selection.label : selection.team?.name }</p>
								</div>
								<p>{ selection.decimalOdds }</p>
							</div>
						)
					}

					return (
						<MakeBet key={selection.id} market={market} selection={selection} gameId={gameId} />
					)
				})
			}
		</div>
	)
}

export default SelectionForm;