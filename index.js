import express from "express";

const app = express();
app.use(express.json());

// ===== MCP METADATA =====
app.post("/mcp/tools/list", (req, res) => {
  res.json({
    tools: [
      {
        name: "start_now",
        description: "Riduce un compito a un'azione semplice da iniziare subito.",
        input_schema: {
          type: "object",
          properties: {
            task: {
              type: "string",
              description: "Cosa stai rimandando"
            }
          },
          required: ["task"]
        }
      }
    ]
  });
});

// ===== MCP TOOL EXECUTION =====
app.post("/mcp/tools/call", (req, res) => {
  const { name, arguments: args } = req.body;

  if (name === "start_now") {
    res.json({
      content: [
        {
          type: "text",
          text: `Non pensarci troppo.

Apri quello che ti serve e fai il PRIMO micro-passo per:
👉 ${args.task}

Solo 2 minuti. Adesso.`
        }
      ]
    });
    return;
  }

  res.status(400).json({ error: "Tool non riconosciuta" });
});

// ===== DOMAIN VERIFICATION =====
app.get("/.well-known/openai-verification.txt", (req, res) => {
  res.type("text/plain");
  res.send("TOKEN_VERRA_INSERITO_DOPO");
});

// ===== HEALTH CHECK =====
app.get("/", (req, res) => {
  res.send("Start Now MCP server is running.");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`MCP server listening on port ${port}`);
});



// ===== MCP HANDSHAKE =====
app.get("/.well-known/mcp.json", (req, res) => {
  res.json({
    name: "Start Now",
    description: "App anti-procrastinazione: svuota la testa e inizia subito.",
    version: "1.0.0",
    tools_endpoint: "/mcp/tools/list",
    call_endpoint: "/mcp/tools/call"
  });
});
