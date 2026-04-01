export interface Tool {
  execute: (params: unknown) => Promise<unknown>;
}

export async function executeTool(name: string, tool: Tool, params: unknown) {
  try {
    return await tool.execute(params);
  } catch (err) {
    console.error("TOOL_ERROR", name, err);
    throw err;
  }
}
