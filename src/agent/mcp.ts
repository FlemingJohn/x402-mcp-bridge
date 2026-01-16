import axios from "axios";

const MCP_URL = "http://localhost:4020/api/mcp";

/**
 * Calls the local MCP server with the specified tool and parameters.
 */
export const callMcpTool = async (toolName: string, params: any) => {
    try {
        const response = await axios.post(MCP_URL, {
            tool: toolName,
            params: params
        });
        return response.data;
    } catch (error: any) {
        return { error: error.message };
    }
};
