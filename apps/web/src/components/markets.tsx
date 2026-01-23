'use client';
import { useEffect, useState } from 'react';
import { getMarkets, placeBet } from '@/lib/api';
import { io } from 'socket.io-client';
import { Button } from '@/components/ui/button';

export default function Markets() {
  const [events, setEvents] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [stake, setStake] = useState(10);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getMarkets();
      setEvents(data);
      setLoading(false);
    })();
  }, []);

  // connect WS and join rooms for all markets present
  useEffect(() => {
    if (!events.length) return;
    const socket = io(process.env.NEXT_PUBLIC_API_WS!, { transports: ['websocket'] });
    events.forEach((ev) => ev.markets.forEach((m: any) => {
      socket.emit('join', { room: `market:${m.id}` });
    }));
    socket.on('bet:created', (payload) => {
      // simple toast/log:
      console.log('Realtime bet created:', payload);
    });
    return () => socket.disconnect();
  }, [events]);

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Markets</h1>
      <label className="flex items-center gap-2">
        Stake:
        <input className="border p-1" type="number" value={stake} onChange={e=>setStake(Number(e.target.value))} />
      </label>
      {events.map((ev) => (
        <div key={ev.id} className="border rounded p-4">
          <h2 className="text-xl font-semibold">{ev.name}</h2>
          {ev.markets.map((m: any) => (
            <div key={m.id} className="mt-3">
              <div className="font-medium">{m.name}</div>
              <div className="flex gap-3 mt-2">
                {m.selections.map((s: any) => (
                  <Button
                    key={s.id}
                    className="border rounded px-3 py-1 hover:bg-gray-50"
                    onClick={async () => {
                      await placeBet({ userEmail: 'bob@example.com', selectionId: s.id, stake });
                      alert('Bet placed! (check console for realtime event)');
                    }}
                  >
                    {s.label} @ {s.decimalOdds}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
