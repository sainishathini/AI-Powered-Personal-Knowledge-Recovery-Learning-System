# 🧠 MemoryMap — AI-Powered Personal Knowledge Recovery & Learning System

> **“You remember the concept. We find the knowledge.”**

MemoryMap is a competition-ready personal AI knowledge recovery system built for students and researchers. It converts fragmented learning materials (PDFs, PPTs, handwritten notes, web links) into an interactive knowledge map, allowing users to ask *"Where did I learn this?"* and instantly retrieve exact document citations, section locations, direct text snippets, and prerequisite connections.

---

## 🌟 Key Features & Competition Demonstration Highlights

1. **🔍 Knowledge Recovery Engine ("Where did I learn this?")**
   - Natural language search query matching against concepts.
   - Shows exact source file, format badge, section/page number, and confidence match percentage.
   - Highlights the exact excerpt sentence from the document.
   - Displays prerequisite knowledge and connected graph concepts.

2. **🌐 Interactive Personal Knowledge Map**
   - Visual network of connected learning materials (cyan nodes) and extracted concepts (purple nodes).
   - Category filtering (Optimization, Attention Mechanisms, Operating Systems, Memory Management).
   - Live search node filter.
   - Click any node to open the **Node Inspector Drawer**.

3. **📚 Study Materials Library & AI Ingestion**
   - Upload new learning materials or raw text.
   - Includes real-time AI Extraction progress bar (*Parsing Text → Extracting Concepts → Mapping Edges*).
   - Built-in **Quick Demo Presets** (Deep Learning GANs Notes, Distributed Systems Raft Paper) for instant presentation without typing.

4. **🎯 Learning Gap & Mastery Diagnostic**
   - Category recall mastery distribution chart powered by **Recharts**.
   - Critical gap alerts highlighting unlinked prerequisites.
   - Interactive **AI Verification Quizzes** with instant option feedback and explanations.

5. **⚡ AI Revision Flashcards**
   - Auto-generated concept cards with interactive flip animation.
   - Self-assessment mastery toggles and recall score counters.

6. **⚡ Dual-Mode Fail-Safe Architecture (Presentation Ready)**
   - **Database**: Runs in MongoDB Atlas or automatically falls back to an in-memory memory store.
   - **AI Layer**: Supports live LLM API keys (`GEMINI_API_KEY` / `OPENAI_API_KEY`) or falls back to an offline Heuristic NLP Extraction & Recovery Engine. **Guaranteed 0% downtime during presentation.**

---

## 🚀 Quick Start & How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- NPM (v9 or higher)

### Step 1: Clone & Environment Setup
Copy `.env.example` to `.env` in the `server` directory (Optional: add Gemini/OpenAI API key or leave blank for Presentation Mode):
```bash
cp server/.env.example server/.env
```

### Step 2: Run Backend Server
In terminal 1:
```bash
cd server
node index.js
```
*Server will start at `http://localhost:5000`*

### Step 3: Run Frontend Client
In terminal 2:
```bash
cd client
npm run dev
```
*Frontend will start at `http://localhost:3000` (or `http://localhost:5173`)*

---

## 📊 Demo Guide for Judges

1. Open `http://localhost:3000`.
2. **Knowledge Recovery Tab**: Click any of the pre-loaded demo chips (e.g. *"Where did I learn about Vanishing Gradients?"* or *"Where was TLB Miss penalty discussed?"*).
3. Observe the exact document attribution, section anchor, excerpt, and connected concepts.
4. **Knowledge Map Tab**: Explore the visual node network, filter by category, and click nodes to open the Node Inspector Drawer.
5. **Ingest Material**: Click **"Ingest Material"** in the top header and select **"Load GANs Deep Learning Notes"** to demonstrate real-time concept extraction.
6. **Gap Analysis Tab**: Review the Recharts mastery analytics and answer a verification quiz question.
7. **Revision Flashcards**: Flip cards to test memory retention.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide React Icons, Recharts, SVG Graph Canvas Engine.
- **Backend**: Node.js, Express.js, Multer.
- **Database Layer**: In-Memory Store & MongoDB Mongoose integration.
- **AI Engine**: Gemini / OpenAI LLM API integration with Heuristic Local NLP Fallback.
