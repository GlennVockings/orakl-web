"use client"

import { apiFetch } from "@/lib/api";
import { Market } from "@/lib/types";
import useSWR from "swr";
import { Badge } from "../../ui/badge";
import SelectionForm from "./SelectionForm";

const fetcher = (gameId: string) =>
	apiFetch<Market[]>(`/games/${gameId}/markets`, {
		method: "GET",
	})

export const Markets = ({ gameId } : { gameId: string }) => {
	const { data: markets, error, isLoading } = useSWR(
    ["markets", gameId],
    ([, id]) => fetcher(id),
    {
      revalidateOnFocus: false,
    }
  );

  if (isLoading) {
    return <div className="p-2">Loading markets...</div>;
  }

  if (error) {
    return <div className="p-2">Failed to load markets.</div>;
  }

	console.log(markets)

	if (markets && markets?.length < 1) {
		return (
			<div>
				<p className="font-[Space_Grotesk] uppercase text-lg">Markets</p>
				<div className="bg-muted border-2 border-accent p-4">
					<div className="flex justify-end">
						{/* <Badge variant={"open"}>open</Badge> */}
						{/* <Badge variant={"closed"}>closed</Badge> */}
						<Badge variant={"settled"}>settled</Badge>
					</div>
					<div>
						<p className="font-[Space_Grotesk] uppercase text-2xl">Will they win?</p>
						<SelectionForm selections={[]} />
					</div>
				</div>
			</div>
		)
	}

	return (
		<div>
			{
				markets?.map((market) => (
					<div key={market.id}>
						<p>{ market.name }</p>
					</div>
				))
			}
		</div>
	)
}

export default Markets;