//dependencies
import express from "express";
import dotenv from "dotenv";

//project imports
import userRoutes from "./routes/userRoutes";
import { setupMessaging } from './setup/setupMessaging';
import { consumeUserCreated } from './consumers/consumeUserCreated';

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 4002;

app.listen(PORT, async () => {
  console.log(`✅ User service running on http://localhost:${PORT}`);

  try {
    await setupMessaging();
    await consumeUserCreated();
    console.log("📥 Listening for user.created events...");
  } catch (err) {
    console.error("❌ Failed to start messaging:", err);
    process.exit(1);
  }
});
