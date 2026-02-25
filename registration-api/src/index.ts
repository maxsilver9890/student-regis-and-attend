import dotenv from "dotenv";
dotenv.config();
import express from "express";
import registerRouter from "./register";
import attendanceRouter from "./attendance";

const app = express();
const PORT = process.env.PORT || 3000;

// health routes
app.get("/", (_, res) => {
  res.json({ status: "API running" });
});

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/api", registerRouter);
app.use("/api", attendanceRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Test query block
// import { pool } from "./db";

// (async () => {
//   try {
//     const res = await pool.query("SELECT 1");
//     console.log("🟢 DB test query successful:", res.rows);
//   } catch (err) {
//     console.error("🔴 DB test failed", err);
//   }
// })();