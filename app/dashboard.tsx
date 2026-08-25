import { AgentSteps, ApprovalGate, LedgerDiff } from "./components";
import { useState } from "react";

export default function Dashboard() {
  const [steps, setSteps] = useState([
    {id:"1", type:"tool", text:"stripe.paymentIntents.list → 12 failed", detail:"12 PIs, $3,240 at risk"},
    {id:"2", type:"tool", text:"postgres.query → 12 invoices"},
    {id:"3", type:"sandbox", text:"sandbox.run(reconcile.py)", detail:"recoverable:6 $1,840 | non-recoverable:6 expired"},
    {id:"4", type:"tool", text:"subagents x3 researching high-value customers..."},
  ] as any);
  const [approved, setApproved] = useState(false);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex justify-between">
        <h1 className="text-2xl font-bold">LedgerGuard — $3,240 at risk</h1>
        <span className="text-xs border px-2 py-1 rounded">Stripe ✓ Postgres ✓ Slack ✓ TrueForge ✓</span>
      </header>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2"><AgentSteps steps={steps} /></div>
        <div><ApprovalGate total={184000} count={6} onApprove={()=>setApproved(true)} onReject={()=>{}} /></div>
      </div>
      <LedgerDiff rows={[
        {stripe_pi:"pi_1Cus001", stripe_status:"failed:card_declined", ledger_status:"unpaid", amount_cents:4900, reason:"card_declined"},
        {stripe_pi:"pi_1Cus007_exp", stripe_status:"failed:expired_card", ledger_status:"failed", amount_cents:4900, reason:"expired_card - do not retry"},
      ]} />
      {approved && <div className="p-3 bg-green-100 border border-green-500 rounded">✓ Approved by you · 6 refunds created · ledger updated · Slack posted · session logged</div>}
      <footer className="text-xs opacity-50">Session persists across reconnect • npx @truefoundry/trueforge • Qodo reviewed PR #2</footer>
    </div>
  );
}
