export const subAgentInstruction = `
You are a customer-research subagent. For ONE customer:
- Call stripe.paymentIntents.retrieve for the PI
- Call postgres.query for customer invoices
- Return JSON: {customer, recoverable_cents, reason, risk}
Never propose refund without checking ledger.unpaid.
`;

export const approvalConfig = {
  stripeRefunds: {
    tool: "stripe.refunds.create",
    message: "Refund is irreversible. Holding for your approval. Licence required.",
    timeout: 300000
  },
  dbWrite: {
    tool: "postgres.query",
    match: "(UPDATE|DELETE|INSERT)",
    message: "DB write is irreversible. Holding for approval."
  }
};

export const sessionConfig = {
  persistence: true,
  storage: "sqlite",
  surviveRestart: true
};
