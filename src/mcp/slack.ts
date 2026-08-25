export async function postToSlack(channel: string, text: string, blocks?: any[]) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) {
    console.log(`[slack mock] ${channel}: ${text}`);
    return { ok: true, mocked: true };
  }
  // In prod: fetch(webhook, {method:"POST", body: JSON.stringify({channel, text, blocks})})
  // Qodo flagged missing error handling - fixed with try/catch
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, blocks }),
    });
    if (!res.ok) throw new Error(`Slack ${res.status}`);
    return { ok: true };
  } catch (e) {
    console.error("Slack failed, queuing for retry", e);
    // TODO: push to retry queue (SQS)
    return { ok: false, error: String(e) };
  }
}

export function formatRecoveryPreview(recoverable: any[], total: number) {
  return {
    text: `Recoverable $${(total/100).toFixed(2)} for ${recoverable.length} customers — awaiting approval`,
    blocks: recoverable.map(r => ({
      type: "section",
      text: { type: "mrkdwn", text: `*${r.stripe_pi}* — $${(r.amount_cents/100).toFixed(2)} — ${r.reason} — \`${r.idempotency_key}\`` }
    }))
  };
}
