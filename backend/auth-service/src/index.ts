import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Auth service running on http://localhost:${PORT}`);
});
