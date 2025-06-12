import express from "express";
import proxy from "express-http-proxy";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("🔥 Unhandled error in gateway:", err);
    res.status(500).json({ error: "Gateway internal error" });
  }
);

app.use((req, res, next) => {
  console.log(`[Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(
  "/api/auth",
  proxy(process.env.AUTH_SERVICE_URL || "http://auth-service:4001", {
    proxyReqPathResolver: (req) => req.originalUrl,

    proxyReqBodyDecorator: (body, req) => {
      return body;
    },

    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      return {
        ...proxyReqOpts,
        headers: {
          ...proxyReqOpts.headers,
          "Content-Type": "application/json",
        },
      };
    },

    proxyErrorHandler: (err, res, next) => {
      console.log("❌ Proxy to auth-service failed:", err.message);
      res
        .status(500)
        .json({ error: "Auth serviceasndasdkjsdjklasd unavailable" });
    },
  })
);

// Proxy to User Service
app.use(
  "/api/users",
  proxy(process.env.USER_SERVICE_URL || "http://user-service:4002", {
    proxyReqPathResolver: (req) => req.originalUrl,
    proxyErrorHandler: (err, res, next) => {
      console.error("❌ Proxy to user-service failed:", err.message);
      res.status(500).json({ error: "User service unavailable" });
    },
  })
);

app.listen(PORT, () => {
  console.log(`✅ Gateway listening on port ${PORT}`);
});
