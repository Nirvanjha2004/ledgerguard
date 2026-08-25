import { describe, it, expect } from "vitest";
import fs from "fs";
describe("harness", () => {
  it("agent.json has required harness fields", () => {
    const agent = JSON.parse(fs.readFileSync("agent.json","utf8"));
    expect(agent.mcpServers.stripe).toBeDefined();
    expect(agent.mcpServers.postgres).toBeDefined();
    expect(agent.sandbox.enabled).toBe(true);
    expect(agent.approvals.required.length).toBeGreaterThan(0);
    expect(agent.subagents.enabled).toBe(true);
    expect(agent.session.persistence).toBe(true);
  });
  it("skills loaded", () => {
    expect(fs.existsSync("skills/finance-refund-policy.md")).toBe(true);
  });
});
