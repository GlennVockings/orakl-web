import { TableCell, TableRow } from "./ui/table"
import { Medal } from "lucide-react"
import { Minus } from "lucide-react"
import { ChevronUp } from "lucide-react"
import { ChevronsUp } from "lucide-react"
import { ChevronDown } from "lucide-react"
import { ChevronsDown } from "lucide-react"


export const LeaderboardRow = ({ pos, name, budget, prevPos }: { pos: number, name: string, budget: number, prevPos: number}) => {
	const renderIcon = (position: number, prevPosition: number) => {
		if ((prevPosition - position) < -1) { // 4 - 3 = -1
			return (
				<TableCell><ChevronsDown color="#FF0000" /></TableCell>
			)
		} else if ((prevPosition - position) < 0) {
			return (
				<TableCell><ChevronDown color="#FF0000" /></TableCell>
			)
		} else if ((prevPosition - position) > 1) {
			return (
				<TableCell><ChevronsUp color="#3aa813" /></TableCell>
			)
		} else if ((prevPosition - position) > 0) {
			return (
				<TableCell><ChevronUp color="#3aa813" /></TableCell>
			)
		} else {
			return (
				<TableCell><Minus color="#a1a813" /></TableCell>
			)
		}
	}
	return (
		<TableRow className={ name === "User 2" ? "bg-primary/10" : ""}>
			{renderIcon(pos, prevPos)}
			<TableCell>{ pos }</TableCell>
			<TableCell>{ name }</TableCell>
			<TableCell>{ budget }</TableCell>
		</TableRow>
	)
}