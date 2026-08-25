import { useEffect, useState } from "react";

export function useTrueForgeSession(sessionId: string) {
  const [status, setStatus] = useState("connecting");
  const [steps, setSteps] = useState<any[]>([]);
  
  useEffect(() => {
    // TrueForge SSE: /api/v1/sessions/:id/stream
    const es = new EventSource(`/api/v1/sessions/${sessionId}/stream`);
    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "step") setSteps(s => [...s, data.step]);
      if (data.type === "approval_required") setStatus("approval_required");
      if (data.type === "done") setStatus("done");
    };
    es.onerror = () => setStatus("reconnecting");
    return () => es.close();
  }, [sessionId]);

  return { status, steps };
}
