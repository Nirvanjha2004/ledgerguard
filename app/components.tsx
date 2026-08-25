import React, { useState, useEffect } from "react";

type Step = { id:string, type:"reasoning"|"tool"|"sandbox"|"approval"|"done", text:string, detail?:string };

export function AgentSteps({ steps }: { steps: Step[] }) {
  return (
    <div className="space-y-2">
      {steps.map(s => (
        <div key={s.id} className={`p-3 rounded border-l-4 ${s.type==="approval"?"border-red-500 bg-red-50":"border-blue-500 bg-slate-50"}`}>
          <div className="font-mono text-xs opacity-60">{s.type.toUpperCase()}</div>
          <div className="text-sm">{s.text}</div>
          {s.detail && <pre className="text-xs bg-black text-green-400 p-2 mt-1 overflow-auto">{s.detail}</pre>}
        </div>
      ))}
    </div>
  );
}

export function ApprovalGate({ total, count, onApprove, onReject }: { total:number, count:number, onApprove:()=>void, onReject:()=>void }) {
  return (
    <div className="border-2 border-red-500 rounded-lg p-4 bg-red-50 animate-pulse">
      <div className="text-xs font-bold text-red-600">■ HOLDING FOR YOUR APPROVAL — Licence required</div>
      <div className="text-2xl font-bold">Refund ${ (total/100).toFixed(2) } for {count} customers?</div>
      <div className="text-xs opacity-60">Irreversible • Stripe refunds.create + Ledger UPDATE • Idempotency key per row</div>
      <div className="flex gap-2 mt-3">
        <button onClick={onApprove} className="bg-green-600 text-white px-6 py-2 rounded font-bold">✓ Approved — Execute</button>
        <button onClick={onReject} className="bg-white border px-6 py-2 rounded">Reject</button>
      </div>
    </div>
  );
}

export function LedgerDiff({ rows }: { rows:any[] }) {
  return (
    <table className="w-full text-sm">
      <thead><tr><th>PI</th><th>Stripe</th><th>Ledger</th><th>Amount</th><th>Action</th></tr></thead>
      <tbody>
        {rows.map(r=>(
          <tr key={r.stripe_pi} className={r.reason.includes("expired")?"opacity-50":""}>
            <td className="font-mono">{r.stripe_pi}</td><td>{r.stripe_status}</td><td>{r.ledger_status}</td><td>${(r.amount_cents/100).toFixed(2)}</td><td>{r.reason}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
