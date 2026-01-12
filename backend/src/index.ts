import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

// Middlewares
app.use(cors({ origin: true }));
app.use(express.json());

// Load OpenAPI YAML
const openapiPath = path.join(process.cwd(), "src", "openapi.yaml");
const openapiRaw = fs.readFileSync(openapiPath, "utf8");
const openapiDoc = YAML.parse(openapiRaw);

// Routes
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDoc));

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📚 Swagger UI on http://localhost:${PORT}/docs`);
});
