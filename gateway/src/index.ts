import * as express from "express";
import * as proxy from "express-http-proxy";
import * as cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(
  "/api/auth",
  proxy(process.env.AUTH_SERVICE_URL || "http://localhost:4000", {
    proxyReqPathResolver: (req) => {
      return req.originalUrl;
    },
  })
);

app.use(
  "/api/users",
  proxy(process.env.USER_SERVICE_URL || "http://localhost:4001", {
    proxyReqPathResolver: (req) => {
      return req.originalUrl;
    },
  })
);

app.get("/", (req, res) => {
  res.send("Gateway is running");
});

app.listen(PORT, () => {
  console.log(`✅ Gateway listening on port ${PORT}`);
});
