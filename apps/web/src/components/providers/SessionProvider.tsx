"use client";
import React, { createContext, useContext, useState } from "react";

const SessionCtx = createContext<any>(null);

export function SessionProvider({ initialSession, children }: any) {
  const [session, setSession] = useState(initialSession);
  return <SessionCtx.Provider value={{ session, setSession }}>{children}</SessionCtx.Provider>;
}

export function useSessionCtx() {
  return useContext(SessionCtx);
}