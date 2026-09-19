# 🧠 MemoryMap — AI-Powered Personal Knowledge Recovery & Learning System

> **“You remember the concept. We find the knowledge.”**

MemoryMap is a competition-ready personal AI knowledge recovery system built for students and researchers. It converts fragmented learning materials (PDFs, PPTs, handwritten notes, web links) into an interactive knowledge map, allowing users to ask *"Where did I learn this?"* and instantly retrieve exact document citations, section/page locations, direct text snippets, and prerequisite connections.

---

## ❓ Problem Statement

Students learn from numerous sources such as PDFs, PPTs, lecture notes, websites, and research papers. Later, they often remember a concept but forget **WHERE** they learned it. Searching manually through dozens of multi-page files wastes valuable study time and creates fragmented, disconnected knowledge.

---

## 💡 Proposed Solution

MemoryMap creates a unified, searchable personal knowledge space from the user's learning materials:
1. **Material Ingestion**: Upload multi-format learning materials (PDF, PPT, Text, Web URL).
2. **AI Concept Extraction**: Automatically extracts concepts, definitions, summary, and keywords.
3. **Topology Mapping**: Automatically discovers relationships between concepts (e.g., `Java → Collections → HashSet → Duplicate Removal`).
4. **Natural Language Knowledge Recovery**: Enter natural language queries like *"Where did I learn about HashSet?"* to receive exact document citations, page numbers, and quotes.

---

## 🌟 Key Features

1. **🔐 Demo Authentication Interface**
   - Demo login modal with 1-click credentials (`demo@memorymap.com` / `demo123`).
   - Clean JWT token simulation for authentication routes (`/api/auth/login`, `/api/auth/register`).

2. **📊 Comprehensive SaaS Dashboard**
   - Total Metrics Widgets: 24 Resources, 146 Concepts, 38 Connections, 7 Learning Gaps.
   - Recently Recovered Knowledgefeed with instant document citations.
   - Suggested Learning Topics & Recent Search History.

3. **📥 Add Knowledge & Real-Time Processing Pipeline**
   - Multi-format ingestion: Upload PDF, PPT/PPTX, Notes, Paste Text, or Web URL.
   - 5-Step visual processing pipeline (*Uploading → Extracting Content → Identifying Concepts → Finding Relationships → Adding to MemoryMap*).
   - Post-ingestion summary showing extracted concepts, keywords, and related concepts.

4. **🔍 Natural Language Search & Knowledge Recovery ("Ask My Knowledge")**
   - Direct natural language Q&A engine with guaranteed demo queries (*"Where did I learn about HashSet?"*, *"What did I learn about Java Collections?"*, etc.).
   - Returns primary concept card, origin citation (`Java Collections.pdf — Page 12`), direct text excerpt, confidence score, and prerequisite chips.

5. **🌐 Interactive SVG Knowledge Graph Map**
   - Visual network of connected learning materials (cyan nodes) and extracted concepts (purple nodes).
   - Category filtering (Java Architecture, Java Collections, Data Structures, DBMS, Algorithms).
   - Live search node filter & interactive Node Inspector Drawer.

6. **🎯 Learning Gap & Mastery Diagnostic**
   - Concept progress cards (`HashMap` 75% complete: `✓ Basic usage`, `✓ Key-value pairs`, `⚠ Collision handling`, `⚠ Hashing mechanism`).
   - Actionable **"Learn Next"** CTA buttons.
   - Interactive AI Verification Quizzes with instant explanation feedback.

7. **📚 Knowledge Resource Library & Concept Explorer**
   - Filterable cards displaying document format, page count, concept count, and connections.
   - Search for specific concepts like `HashSet` to view description, source location, and related concept links.

---

## 🏗️ System Architecture

```
[ User Input (PDF / Notes / Search Query) ]
                   │
                   ▼
  ┌─────────────────────────────────┐
  │  Vite React SaaS UI (Port 3000) │
  └────────────────┬────────────────┘
                   │ REST API
                   ▼
  ┌─────────────────────────────────┐
  │  Express Node Server (Port 5000)│
  └───────┬─────────────────┬───────┘
          │                 │
          ▼                 ▼
 ┌────────────────┐ ┌───────────────────────────┐
 │ MongoDB Models │ │ Dual-Mode AI Engine       │
 │ - User         │ │ - Live LLM (Gemini/OpenAI)│
 │ - Resource     │ │ - Heuristic NLP Fallback  │
 │ - Concept      │ └───────────────────────────┘
 │ - Relation     │
 │ - LearningGap  │
 └────────────────┘
```

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide React Icons, Recharts.
- **Backend**: Node.js, Express.js, Multer, PDF-Parse.
- **Database**: Mongoose (MongoDB) + In-Memory Fallback Store.
- **AI Engine**: Dual-Mode AI Service (`aiService.js`) with LLM integration & Heuristic local fallback.

---

## 🚀 Installation & How to Run

### Prerequisites
- Node.js (v18 or higher)
- NPM (v9 or higher)

### Environment Setup
Create a `.env` file in `server/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/memorymap
# Optional: add your AI API key or leave empty for Heuristic Presentation Fallback
GEMINI_API_KEY=
OPENAI_API_KEY=
```

### Running the Backend
```bash
cd server
npm install
node index.js
```
*Server runs at `http://localhost:5000`*

### Running the Frontend
```bash
cd client
npm install
npm run dev
```
*Frontend runs at `http://localhost:3000`*

---

## 🔑 Demo Credentials

- **Email**: `demo@memorymap.com`
- **Password**: `demo123`

---

## 🎯 5-Step Competition Presentation Demo Flow

1. **Step 1 — Dashboard Overview**: Open `http://localhost:3000`. Highlight the 146 Concepts stored and 24 Resources.
2. **Step 2 — Knowledge Recovery Query**: Navigate to **Ask My Knowledge** and ask *"Where did I learn about HashSet?"*.
3. **Step 3 — Origin Citation**: Point out the result: `Found in Java Collections.pdf — Page 12` with text excerpt and connected concepts.
4. **Step 4 — Visual Knowledge Map**: Click **"Knowledge Map"** to display the interactive graph topology (`Java → Collections → HashSet → Duplicate Removal`).
5. **Step 5 — Learning Gap Analysis**: Open **Learning Gaps** page to show `HashMap` at 75% progress with missing topics (`Collision handling`, `Hashing mechanism`) and click **"Learn Next"**.

---

## 🔮 Future Scope

- OCR integration for handwritten lecture notes and whiteboard photos.
- Cross-user collaborative knowledge graph sharing for study groups.
- Vector database semantic search (FAISS / Pinecone) for multi-gigabyte textbook indexing.
- Mobile application with offline knowledge graph syncing.
