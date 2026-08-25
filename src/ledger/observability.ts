export function logRecovery(action: string, meta: any) {
  const entry = { ts: new Date().toISOString(), action, ...meta, traceId: `tr_${Date.now()}` };
  console.log(JSON.stringify(entry));
  // In prod: send to OpenTelemetry / Datadog
  return entry;
}
