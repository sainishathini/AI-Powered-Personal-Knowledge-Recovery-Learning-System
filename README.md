# 🧠 MemoryMap — AI-Powered Personal Knowledge Recovery & Learning System

> **“Your learning is scattered. Your knowledge doesn't have to be.”**

MemoryMap is a competition-ready personal AI knowledge recovery system built for students and researchers. It converts fragmented learning materials (**Google Drive folders**, **PDFs**, **PPTs**, **Images via OCR**, **Video Lectures**, **YouTube URLs**, and **Quick Notes**) into an interactive knowledge map, allowing users to ask *"Where did I learn this?"* and instantly retrieve exact multi-source citations, timestamp markers, slide/page locations, and prerequisite connections.

---

## ❓ Problem Statement

Students learn from numerous scattered sources such as Google Drive folders, PDFs, slides, handwritten whiteboards, YouTube videos, and lecture recordings. Later, they remember a concept but forget **WHERE** they learned it. Searching manually across dozens of files and video timelines wastes time and creates fragmented knowledge.

---

## 💡 Proposed Solution

MemoryMap creates a single, searchable personal knowledge space from all learning inputs:
1. **Multi-Source Ingestion**: Connect Google Drive, upload local files (PDF, PPT, Word, JPG, MP4), paste YouTube URLs, or create quick text notes.
2. **AI Concept Extraction**: Common knowledge analyzer extracts concepts, definitions, keywords, and summaries across formats.
3. **Topology Mapping**: Automatically discovers relationships between concepts (e.g., `Java → Collections → HashSet → Duplicate Removal`).
4. **Natural Language Knowledge Recovery**: Query *"Where did I learn about HashSet?"* to receive exact multi-source citations (`Java Collections.pdf — Page 12`, `My HashSet Notes`, `YouTube — 18:42`, `DSA_Notes.jpg OCR`).
5. **Learning Gaps Diagnostic**: Visual coverage breakdown (e.g. `HashMap — 75%`) with suggested gap-filling study materials.

---

## 🌟 Key Features

1. **🔗 Google Drive Knowledge Ingestion**
   - Connect Google Drive folders with minimal `drive.readonly` permissions.
   - Diff-based incremental sync: processes new/modified files, skips unchanged files, and supports instant disconnect.

2. **📤 Multi-Source Format Support**
   - **Documents**: PDF page & heading parser, PPT slide reader, Word/TXT parser.
   - **Images**: OCR text extraction for whiteboard diagrams and handwritten notes.
   - **Video Files**: Timestamped transcript parsing for recorded lectures (`.mp4`).
   - **YouTube**: Caption extraction and timestamp navigation (`05:30`, `18:42`, `26:40`).
   - **Quick Notes**: Instant text note & markdown revision journal indexing.

3. **🎯 Restructured Dashboard & ADD KNOWLEDGE Grid**
   - 3-card ingestion suite for Google Drive, Local File Upload, and YouTube/Note URL processing.
   - Live metrics summary: 24 Resources, 146 Concepts, 38 Connections, 7 Learning Gaps.

4. **🔍 "Ask My Knowledge" Multi-Source Citation Engine**
   - Natural language search with origin traceability (`📄 PDF Page`, `📝 Note`, `▶️ YouTube Timestamp`, `🖼️ Image OCR`).

5. **🌐 Interactive Visual Knowledge Map**
   - SVG network graph with source-coded node tags, category filters, and node inspector drawer.

6. **📊 Learning Gap & Mastery Diagnostic**
   - Coverage progress bars, mastered vs missing topic breakdown, and targeted gap-filling resource recommendations.

7. **📚 Resource Library Filter Tabs**
   - Filter materials by `ALL`, `Google Drive`, `Documents`, `Images`, `Videos`, `YouTube`, and `Notes`.

---

## 🏗️ System Architecture

```
  PDF / PPT / Word ──────┐
  Image (OCR) ───────────┤
  Video (.mp4) ──────────┤
  YouTube Captions ──────┼──► Common Knowledge Analyzer (aiService.js)
  Notes / Text ──────────┤
  Google Drive ──────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │   Personal Knowledge Store     │
        └────────────────┬───────────────┘
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
┌──────────────┐                 ┌─────────────────┐
│ KnowledgeMap │                 │ Ask My Knowledge│
└──────────────┘                 └─────────────────┘
```

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide React Icons.
- **Backend**: Node.js, Express.js, Multer, PDF-Parse.
- **Database**: In-Memory Store & MongoDB Mongoose models (`Resource`, `Concept`, `LearningGap`).
- **AI Engine**: Dual-Mode AI Service (`aiService.js`) with LLM integration & Heuristic local fallback.

---

## 🔑 Environment Configuration & Setup Guide

See [GOOGLE_DRIVE_SETUP.md](GOOGLE_DRIVE_SETUP.md) for full Google Cloud OAuth 2.0 instructions.

Create a `.env` file in `server/`:
```env
PORT=5000
MONGODB_URI=

# Optional LLM Key (Gemini / OpenAI). Fallback heuristic mode active if empty.
GEMINI_API_KEY=
OPENAI_API_KEY=

# Google Drive OAuth 2.0 Credentials (Optional for Demo Mode)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

---

## 🚀 How to Run

1. **Start Backend Server**:
   ```bash
   cd server
   npm install
   npm start
   ```
   *Runs on `http://localhost:5000`*

2. **Start Frontend Application**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   *Runs on `http://localhost:3000`*

---

## 🏆 Demo Mode & Standalone Operation

MemoryMap operates out of the box in **Demo Mode**:
- Pre-populated with multi-source sample materials (`Java Collections.pdf`, `DSA_Notes.jpg`, `DSA_Lecture.mp4`, `Java Collections Explained`, `My HashSet Notes`, `DBMS Normalization.pptx`).
- No external AI API key or Google credentials required for evaluation.
- All features (Knowledge Map, Ask Engine, Concept Explorer, Learning Gaps) run offline safely.
