/** "agent-01", "agent-02", … */
export const agentName = (index) => `agent-${String(index + 1).padStart(2, "0")}`;
