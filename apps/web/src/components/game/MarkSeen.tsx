"use client"

import { apiFetch } from "@/lib/api"
import { useEffect } from "react"

export const MarkSeen = ({ gameId } : { gameId: string }) => {
	useEffect(() => {
		apiFetch(`/games/${gameId}/seen`, {
			method: "PATCH"
		})
	}, [])

	return null;
}