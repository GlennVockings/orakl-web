import { Button } from "@/components/ui/button";
import { Selection } from "@/lib/types";

export const SelectionForm = ({ selections } : { selections: Selection[] }) => {
	return (
		<div className="flex flex-col">
			{
				selections.map((selection) => {
					return (
						<Button key={selection.id} size={"lg"} className="flex justify-between" variant={"outline"}>
							<p>{ selection.label }</p>
							<p>{ selection.decimalOdds }</p>
						</Button>
					)
				})
			}
		</div>
	)
}

export default SelectionForm;