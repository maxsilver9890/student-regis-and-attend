import express from "express";
import multer from "multer";
import { pool } from "./db";
import { getAttendanceEmbeddings } from "./embeddingClient";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const MATCH_THRESHOLD = 0.4;

/**
 * POST /attendance
 * Input: image (file)
 * Output: list of present students
 */
router.post(
  "/attendance",
  upload.single("image"),
  async (req, res) => {
    try {
      const image = req.file;

      if (!image) {
        return res.status(400).json({ error: "image is required" });
      }

      // ✅ 1️⃣ Get embeddings from ML service
      const embeddings = await getAttendanceEmbeddings(
        image.buffer,
        image.mimetype
      );

      if (embeddings.length === 0) {
        return res.json({
          present_students: [],
          count: 0,
        });
      }

      // 2️⃣ Track matched students (avoid duplicates)
      const presentStudents = new Map<number, string>();

      // 3️⃣ Match each detected face
      for (const embeddingArray of embeddings) {
        if (embeddingArray.length !== 512) continue;

        const embedding = `[${embeddingArray.join(",")}]`;

        const result = await pool.query(
          `
          SELECT id, name, embedding <=> $1 AS distance
          FROM students
          ORDER BY distance
          LIMIT 1
          `,
          [embedding]
        );

        if (result.rows.length === 0) continue;

        const { id, name, distance } = result.rows[0];

        if (distance < MATCH_THRESHOLD) {
          presentStudents.set(id, name);
        }
      }

      const response = Array.from(presentStudents, ([id, name]) => ({
        id,
        name,
      }));

      return res.json({
        present_students: response,
        count: response.length,
      });
    } catch (error) {
      console.error("Attendance error:", error);
      return res.status(500).json({ error: "Attendance failed" });
    }
  }
);

export default router;