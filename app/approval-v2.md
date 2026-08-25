// UI polish: approval gate now shows per-row checkboxes + audit log streaming
export const ApprovalGateV2 = `
- Per-row Approve/Reject (not just bulk)
- Shows idempotency_key per row
- Streams audit log via SSE from TrueForge session
- Session survives refresh (SQLite WAL)
`;
