import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`✅ User service running on http://localhost:${PORT}`);
});
