import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/users", userRoutes);

const PORT = process.env.USER_SERVICE_PORT || 4002;
app.listen(PORT, () => {
  console.log(`✅ User service running on http://localhost:${PORT}`);
});
