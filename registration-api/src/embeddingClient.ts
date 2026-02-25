import axios from "axios";
import FormData from "form-data";

const REGISTER_EMBEDDING_URL = process.env.EMBEDDING_SERVICE_URL as string;
const ATTENDANCE_EMBEDDING_URL = process.env.EMBEDDING_ATTENDANCE_URL as string;

if (!REGISTER_EMBEDDING_URL) {
  throw new Error("EMBEDDING_REGISTER_URL not defined");
}

if (!ATTENDANCE_EMBEDDING_URL) {
  throw new Error("EMBEDDING_ATTENDANCE_URL not defined");
}

/**
 * REGISTRATION: expects exactly one face
 */
export async function getRegistrationEmbedding(
  imageBuffer: Buffer,
  mimeType: string
): Promise<number[]> {
  const formData = new FormData();
  formData.append("image", imageBuffer, {
    contentType: mimeType,
    filename: "image",
  });

  const response = await axios.post(
    REGISTER_EMBEDDING_URL,
    formData,
    {
      headers: formData.getHeaders(),
      timeout: 10000,
    }
  );
  // for logging only. remove later
  console.log(
  "ML registration raw response:",
  JSON.stringify(response.data, null, 2)
  );

  const data = response.data;

// ✅ Case 1: registration-style response
if (Array.isArray(data?.embedding)) {
  return data.embedding;
}

// ✅ Case 2: attendance-style response (future-safe)
if (Array.isArray(data?.faces) && data.faces.length > 0) {
  return data.faces[0].embedding;
}

throw new Error("No valid embedding returned for registration");
}

/**
 * ATTENDANCE: expects multiple faces
 */
export async function getAttendanceEmbeddings(
  imageBuffer: Buffer,
  mimeType: string
): Promise<number[][]> {
  const formData = new FormData();
  formData.append("image", imageBuffer, {
    contentType: mimeType,
    filename: "image",
  });

  const response = await axios.post(
    ATTENDANCE_EMBEDDING_URL,
    formData,
    {
      headers: formData.getHeaders(),
      timeout: 10000,
    }
  );
  // for logging only. remove later
  console.log(
  "ML registration raw response:",
  JSON.stringify(response.data, null, 2)
  );

  const faces = response.data?.faces;

  if (!Array.isArray(faces)) {
    throw new Error("Invalid attendance embedding response");
  }

  return faces.map((face: any) => face.embedding);
}