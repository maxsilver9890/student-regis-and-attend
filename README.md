# 📌 Registration API – Student Embedding Service

This service handles **student registration** by accepting a student’s  **name and image** , generating an  **embedding via an external ML service** , and storing the result in  **PostgreSQL using pgvector** .

---

## 🧠 High-Level Overview

**Responsibilities of this service:**

* Accept `name + image` from client
* Send image to embedding service
* Receive embedding vector
* Store student name + embedding in PostgreSQL
* Return a unique `studentId`

**What this service does NOT do:**

* Generate embeddings itself
* Run ML models
* Store raw images

---

## 🏗️ Architecture Overview

<pre class="overflow-visible! px-0!" data-start="1095" data-end="1473"><div class="relative w-full my-4"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border corner-superellipse/1.1 border-token-border-light bg-token-bg-elevated-secondary rounded-3xl"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="pointer-events-none absolute inset-x-px top-6 bottom-6"><div class="sticky z-1!"><div class="bg-token-bg-elevated-secondary sticky"></div></div></div><div class="corner-superellipse/1.1 rounded-3xl bg-token-bg-elevated-secondary"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span>Client (Postman / Frontend)</span><br/><span>        |</span><br/><span>        |  POST /api/register</span><br/><span>        |  (name + image)</span><br/><span>        v</span><br/><span>Registration API (Node.js + Express)</span><br/><span>        |</span><br/><span>        |  POST image</span><br/><span>        v</span><br/><span>Embedding Service (External / ML Team)</span><br/><span>        |</span><br/><span>        |  embedding: number[512]</span><br/><span>        v</span><br/><span>Registration API</span><br/><span>        |</span><br/><span>        |  INSERT (name, embedding)</span><br/><span>        v</span><br/><span>PostgreSQL + pgvector</span></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

---

## 📁 Project Structure

<pre class="overflow-visible! px-0!" data-start="1505" data-end="1911"><div class="relative w-full my-4"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border corner-superellipse/1.1 border-token-border-light bg-token-bg-elevated-secondary rounded-3xl"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="pointer-events-none absolute inset-x-px top-6 bottom-6"><div class="sticky z-1!"><div class="bg-token-bg-elevated-secondary sticky"></div></div></div><div class="corner-superellipse/1.1 rounded-3xl bg-token-bg-elevated-secondary"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span>registration-api/</span><br/><span>├── src/</span><br/><span>│   ├── index.ts              # App entry point</span><br/><span>│   ├── register.ts           # POST /register route</span><br/><span>│   ├── db.ts                 # PostgreSQL connection</span><br/><span>│   ├── embeddingClient.ts    # Calls embedding service</span><br/><span>│   └── types.ts              # Shared TypeScript types</span><br/><span>│</span><br/><span>├── .env                      # Environment variables</span><br/><span>├── package.json</span><br/><span>├── tsconfig.json</span><br/><span>└── README.md</span></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

---

## 🔌 External Dependency – Embedding Service

This service depends on an **external embedding service** built by another team.

### Contract with Embedding Service

**Endpoint**

<pre class="overflow-visible! px-0!" data-start="2097" data-end="2129"><div class="relative w-full my-4"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border corner-superellipse/1.1 border-token-border-light bg-token-bg-elevated-secondary rounded-3xl"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="pointer-events-none absolute inset-x-px top-6 bottom-6"><div class="sticky z-1!"><div class="bg-token-bg-elevated-secondary sticky"></div></div></div><div class="corner-superellipse/1.1 rounded-3xl bg-token-bg-elevated-secondary"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span>POST /generate-embedding</span></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

**Request**

* Content-Type: `multipart/form-data`
* Field:
  * `image` → image file

**Response**

<pre class="overflow-visible! px-0!" data-start="2229" data-end="2286"><div class="relative w-full my-4"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border corner-superellipse/1.1 border-token-border-light bg-token-bg-elevated-secondary rounded-3xl"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="pointer-events-none absolute inset-x-px top-6 bottom-6"><div class="sticky z-1!"><div class="bg-token-bg-elevated-secondary sticky"></div></div></div><div class="corner-superellipse/1.1 rounded-3xl bg-token-bg-elevated-secondary"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span>{</span><br/><span>  "embedding": [</span><span class="ͼq">0.0123</span><span>, </span><span class="ͼq">-0.44</span><span>, </span><span class="ͼq">0.98</span><span>, ...]</span><br/><span>}</span></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

### Requirements

* `embedding` must be a `number[]`
* Length must be **exactly 512**
* No stringification or nesting

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

<pre class="overflow-visible! px-0!" data-start="2483" data-end="2660"><div class="relative w-full my-4"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border corner-superellipse/1.1 border-token-border-light bg-token-bg-elevated-secondary rounded-3xl"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="pointer-events-none absolute inset-x-px top-6 bottom-6"><div class="sticky z-1!"><div class="bg-token-bg-elevated-secondary sticky"></div></div></div><div class="corner-superellipse/1.1 rounded-3xl bg-token-bg-elevated-secondary"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span>PORT=3000</span><br/><span>DB_HOST=localhost</span><br/><span>DB_PORT=5432</span><br/><span>DB_USER=postgres</span><br/><span>DB_PASSWORD=your_password</span><br/><span>DB_NAME=student_db</span><br/><br/><span>EMBEDDING_SERVICE_URL=http://localhost:5000/generate-embedding</span></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

> During team testing, `localhost` may be replaced with the embedding service’s IP address.

---

## 🗄️ Database Setup (PostgreSQL + pgvector)

### Enable pgvector

<pre class="overflow-visible! px-0!" data-start="2827" data-end="2876"><div class="relative w-full my-4"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border corner-superellipse/1.1 border-token-border-light bg-token-bg-elevated-secondary rounded-3xl"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="pointer-events-none absolute inset-x-px top-6 bottom-6"><div class="sticky z-1!"><div class="bg-token-bg-elevated-secondary sticky"></div></div></div><div class="corner-superellipse/1.1 rounded-3xl bg-token-bg-elevated-secondary"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span class="ͼn">CREATE</span><span> EXTENSION </span><span class="ͼn">IF</span><span></span><span class="ͼn">NOT</span><span></span><span class="ͼn">EXISTS</span><span> vector;</span></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

### Students Table

<pre class="overflow-visible! px-0!" data-start="2897" data-end="3064"><div class="relative w-full my-4"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border corner-superellipse/1.1 border-token-border-light bg-token-bg-elevated-secondary rounded-3xl"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="pointer-events-none absolute inset-x-px top-6 bottom-6"><div class="sticky z-1!"><div class="bg-token-bg-elevated-secondary sticky"></div></div></div><div class="corner-superellipse/1.1 rounded-3xl bg-token-bg-elevated-secondary"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span class="ͼn">CREATE</span><span></span><span class="ͼn">TABLE</span><span> students (</span><br/><span>  id SERIAL </span><span class="ͼn">PRIMARY</span><span></span><span class="ͼn">KEY</span><span>,</span><br/><span>  name TEXT </span><span class="ͼn">NOT</span><span></span><span class="ͼq">NULL</span><span>,</span><br/><span>  embedding VECTOR(</span><span class="ͼq">512</span><span>) </span><span class="ͼn">NOT</span><span></span><span class="ͼq">NULL</span><span>,</span><br/><span>  created_at </span><span class="ͼt">TIMESTAMP</span><span></span><span class="ͼn">DEFAULT</span><span></span><span class="ͼn">CURRENT_TIMESTAMP</span><br/><span>);</span></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

> `VECTOR(512)` enforces fixed-dimensional embeddings for reliable similarity search.

---

## 🚀 Running the Service

### Install dependencies

<pre class="overflow-visible! px-0!" data-start="3210" data-end="3233"><div class="relative w-full my-4"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border corner-superellipse/1.1 border-token-border-light bg-token-bg-elevated-secondary rounded-3xl"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="pointer-events-none absolute inset-x-px top-6 bottom-6"><div class="sticky z-1!"><div class="bg-token-bg-elevated-secondary sticky"></div></div></div><div class="corner-superellipse/1.1 rounded-3xl bg-token-bg-elevated-secondary"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span class="ͼs">npm</span><span> install</span></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

### Start development server

<pre class="overflow-visible! px-0!" data-start="3264" data-end="3287"><div class="relative w-full my-4"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border corner-superellipse/1.1 border-token-border-light bg-token-bg-elevated-secondary rounded-3xl"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="pointer-events-none absolute inset-x-px top-6 bottom-6"><div class="sticky z-1!"><div class="bg-token-bg-elevated-secondary sticky"></div></div></div><div class="corner-superellipse/1.1 rounded-3xl bg-token-bg-elevated-secondary"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span class="ͼs">npm</span><span> run dev</span></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

Server will start at:

<pre class="overflow-visible! px-0!" data-start="3311" data-end="3340"><div class="relative w-full my-4"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border corner-superellipse/1.1 border-token-border-light bg-token-bg-elevated-secondary rounded-3xl"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="pointer-events-none absolute inset-x-px top-6 bottom-6"><div class="sticky z-1!"><div class="bg-token-bg-elevated-secondary sticky"></div></div></div><div class="corner-superellipse/1.1 rounded-3xl bg-token-bg-elevated-secondary"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span>http://localhost:3000</span></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

---

## 📡 API Endpoints

### Health Check

<pre class="overflow-visible! px-0!" data-start="3385" data-end="3410"><div class="relative w-full my-4"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border corner-superellipse/1.1 border-token-border-light bg-token-bg-elevated-secondary rounded-3xl"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="pointer-events-none absolute inset-x-px top-6 bottom-6"><div class="sticky z-1!"><div class="bg-token-bg-elevated-secondary sticky"></div></div></div><div class="corner-superellipse/1.1 rounded-3xl bg-token-bg-elevated-secondary"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span>GET /</span><br/><span>GET /health</span></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

Response:

<pre class="overflow-visible! px-0!" data-start="3422" data-end="3452"><div class="relative w-full my-4"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border corner-superellipse/1.1 border-token-border-light bg-token-bg-elevated-secondary rounded-3xl"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="pointer-events-none absolute inset-x-px top-6 bottom-6"><div class="sticky z-1!"><div class="bg-token-bg-elevated-secondary sticky"></div></div></div><div class="corner-superellipse/1.1 rounded-3xl bg-token-bg-elevated-secondary"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span>{ "status": </span><span class="ͼr">"ok"</span><span> }</span></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

---

### Register Student

<pre class="overflow-visible! px-0!" data-start="3481" data-end="3507"><div class="relative w-full my-4"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border corner-superellipse/1.1 border-token-border-light bg-token-bg-elevated-secondary rounded-3xl"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="pointer-events-none absolute inset-x-px top-6 bottom-6"><div class="sticky z-1!"><div class="bg-token-bg-elevated-secondary sticky"></div></div></div><div class="corner-superellipse/1.1 rounded-3xl bg-token-bg-elevated-secondary"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span>POST /api/register</span></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

#### Request (multipart/form-data)

| Key   | Type | Description   |
| ----- | ---- | ------------- |
| name  | Text | Student name  |
| image | File | Student image |

#### Example Response

<pre class="overflow-visible! px-0!" data-start="3691" data-end="3743"><div class="relative w-full my-4"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border corner-superellipse/1.1 border-token-border-light bg-token-bg-elevated-secondary rounded-3xl"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="pointer-events-none absolute inset-x-px top-6 bottom-6"><div class="sticky z-1!"><div class="bg-token-bg-elevated-secondary sticky"></div></div></div><div class="corner-superellipse/1.1 rounded-3xl bg-token-bg-elevated-secondary"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span>{</span><br/><span>  "success": </span><span class="ͼq">true</span><span>,</span><br/><span>  "studentId": </span><span class="ͼq">12</span><br/><span>}</span></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

---

## 🧪 Testing with Postman

1. Method: **POST**
2. URL:

<pre class="overflow-visible! px-0!" data-start="3806" data-end="3848"><div class="relative w-full my-4"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border corner-superellipse/1.1 border-token-border-light bg-token-bg-elevated-secondary rounded-3xl"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="pointer-events-none absolute inset-x-px top-6 bottom-6"><div class="sticky z-1!"><div class="bg-token-bg-elevated-secondary sticky"></div></div></div><div class="corner-superellipse/1.1 rounded-3xl bg-token-bg-elevated-secondary"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span>http://localhost:3000/api/register</span></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

3. Body → `form-data`
   * `name` → Text
   * `image` → File

If successful:

* Response returns `studentId`
* Row is created in `students` table

---

## 🧠 Important Implementation Notes

### Why embeddings are not sent by the client

* Client sends **raw input only**
* Server derives embeddings via ML service
* Keeps frontend simple and secure

---

### Why embeddings are converted before DB insert

* Node.js arrays serialize to `{}` (Postgres array format)
* pgvector requires `[1,2,3]` format
* Embeddings are converted to pgvector literal before insert

---

## 🔜 Upcoming Work

* Attendance API (face matching using stored embeddings)
* Similarity search using pgvector operators
* Indexing for faster search
* Hasura integration for GraphQL exposure

---

## ✅ Current Status

* ✔ Registration API implemented
* ✔ Embedding service integrated
* ✔ pgvector storage working
* ✔ Ready for attendance feature expansion

---

## 👥 Team Ownership

* **Registration API & DB** : Backend Team
* **Embedding Service** : ML Team

Both services communicate strictly via the defined API contract.

---
