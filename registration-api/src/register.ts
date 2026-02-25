console.log("REGISTER API HIT", new Date().toISOString());
import express from "express";
import multer from "multer";
import { getRegistrationEmbedding } from "./embeddingClient";
import { pool } from "./db";

const router = express.Router();

// store image in memory (not disk)
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /register
 * Input: image (file), name (string)
 * Output: studentId
 */
router.post(
  "/register",
  upload.single("image"),
  async (req, res) => {
    try {
      const { name } = req.body;
      const image = req.file;

      if (!name || !image) {
        return res.status(400).json({
          error: "name and image are required",
        });
      }

      // 1️⃣ Get embedding
      const embeddingArray = await getRegistrationEmbedding(
        image.buffer,
        image.mimetype
      );

      // 2️⃣ Convert to pgvector literal
      const embedding = `[${embeddingArray.join(",")}]`;

      // 3️⃣ Insert ONCE
      const result = await pool.query(
        `
        INSERT INTO students (name, embedding)
        VALUES ($1, $2)
        RETURNING id
        `,
        [name, embedding]
      );

      // 4️⃣ Respond
      return res.status(201).json({
        success: true,
        studentId: result.rows[0].id,
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
        error: "Registration failed",
      });
    }
  }
);
export default router;