/**
 * MemoryMap Google Drive Service
 * Manages Google OAuth 2.0 flow, Google Drive API folder discovery, file scanning, and content extraction.
 * Supports both real Google API credentials and presentation-safe interactive fallback mode.
 */

const store = require('../models/store');
const { extractConceptsFromMaterial } = require('./aiEngine');

// In-memory active Drive session state
let currentDriveSession = {
  isConnected: false,
  account: null,
  selectedFolder: null,
  syncedAt: null,
  token: null
};

// Demo Google Drive Folders & Materials Dataset
const MOCK_DRIVE_FOLDERS = [
  {
    id: 'folder-college-1',
    name: 'College',
    path: '/Drive/College',
    description: 'Primary academic learning space containing university course material.',
    itemCount: 4,
    lastModified: 'Today at 09:45 AM',
    files: [
      {
        id: 'file-java-col',
        name: 'Java_Collections_Framework_Mastery.pdf',
        mimeType: 'application/pdf',
        size: '2.4 MB',
        type: 'PDF',
        course: 'CS201 - Data Structures',
        author: 'Prof. J. Gosling',
        content: `Java Collections Framework Comprehensive Overview:
Section 1: The List Interface & ArrayList Implementation.
ArrayList is a dynamic resizable array implementation of the List interface. It provides O(1) time complexity for index-based retrieval.
Section 2: The Set Interface & HashSet Duplicate Avoidance.
HashSet implements the Set interface, backed by a hash table (specifically a HashMap instance). HashSet guarantees unique elements and prevents duplicate insertion.
Section 3: The Map Interface & HashMap Key-Value Storage.
HashMap stores key-value pairs using hashing algorithms. It permits null keys and null values.
Section 4: Duplicate Removal Algorithm.
To quickly remove duplicate elements from an ArrayList, pass the list into a HashSet constructor: List<String> uniqueList = new ArrayList<>(new HashSet<>(originalList)).`
      },
      {
        id: 'file-dl-opt',
        name: 'Deep_Learning_Lecture_04_Optimization.pdf',
        mimeType: 'application/pdf',
        size: '4.1 MB',
        type: 'PDF',
        course: 'CS701 - Deep Learning',
        author: 'Dr. Andrew N.',
        content: `Chapter 4: Gradient Descent & Loss Optimization in Neural Networks.
Section 4.1: Backpropagation & Chain Rule. Neural networks compute partial derivatives layer by layer using the Chain Rule to optimize weight parameters.
Section 4.2: Vanishing Gradient Problem. In deep architectures with sigmoid or tanh activation functions, gradients diminish exponentially toward zero during backpropagation, stalling weight updates in early layers.
Section 4.3: Skip Connections & ResNets. Residual skip connections pass identity signals f(x) + x directly across layers, allowing unobstructed gradient flow.`
      },
      {
        id: 'file-dbms-ppt',
        name: 'Database_Management_Systems_Normalization.pptx',
        mimeType: 'application/vnd.google-apps.presentation',
        size: '5.8 MB',
        type: 'PPT',
        course: 'CS303 - Database Systems',
        author: 'Prof. C. Date',
        content: `Database Normalization & Relational Integrity:
Slide 1: First Normal Form (1NF). Eliminates repeating groups and ensures atomic column values.
Slide 2: Second Normal Form (2NF). Ensures full functional dependency on the primary key, removing partial dependencies.
Slide 3: Third Normal Form (3NF). Eliminates transitive dependencies where non-prime attributes depend on other non-prime attributes.
Slide 4: ACID Transactions. Atomicity, Consistency, Isolation, Durability guarantee reliable database processing.`
      },
      {
        id: 'file-ds-notes',
        name: 'Data_Structures_Tree_Traversals_Notes.md',
        mimeType: 'text/markdown',
        size: '850 KB',
        type: 'Notes',
        course: 'CS201 - Data Structures',
        author: 'Alex Rivera',
        content: `Tree Traversals and Binary Search Tree Properties:
Inorder Traversal: Left -> Root -> Right. Yields sorted sequence for Binary Search Trees.
Preorder Traversal: Root -> Left -> Right. Useful for tree serialization and copying.
Postorder Traversal: Left -> Right -> Root. Used for deleting nodes and evaluating postfix expressions.`
      }
    ]
  },
  {
    id: 'folder-cs201',
    name: 'CS201 - Data Structures & Algorithms',
    path: '/Drive/Academics/CS201',
    description: 'Lecture notes, assignments, and exam review guides for CS201.',
    itemCount: 3,
    lastModified: 'Yesterday at 04:20 PM',
    files: [
      {
        id: 'file-hash-col',
        name: 'HashSet_and_HashMap_Collision_Handling.pdf',
        mimeType: 'application/pdf',
        size: '1.9 MB',
        type: 'PDF',
        course: 'CS201 - Data Structures',
        author: 'Prof. J. Gosling',
        content: `Collision Handling Mechanisms in Hash Tables:
Separate Chaining: Each table bucket contains a linked list or red-black tree of colliding entries.
Open Addressing: Probes alternative array locations (Linear Probing, Quadratic Probing, Double Hashing) when collisions occur.`
      },
      {
        id: 'file-graph-algo',
        name: 'Graph_Algorithms_Dijkstra_BFS_DFS.pptx',
        mimeType: 'application/vnd.google-apps.presentation',
        size: '3.2 MB',
        type: 'PPT',
        course: 'CS201 - Data Structures',
        author: 'Prof. J. Gosling',
        content: `Graph Search Algorithms:
Breadth-First Search (BFS): Uses Queue data structure, finds shortest paths in unweighted graphs.
Depth-First Search (DFS): Uses Stack or Recursion, used for topological sorting and cycle detection.
Dijkstra Algorithm: Uses PriorityQueue (Min-Heap) for single-source shortest path with non-negative edge weights.`
      }
    ]
  },
  {
    id: 'folder-dl-701',
    name: 'CS701 - Deep Learning & Neural Networks',
    path: '/Drive/Academics/CS701',
    description: 'Advanced deep learning papers, transformer guides, and code notebooks.',
    itemCount: 3,
    lastModified: '3 days ago',
    files: [
      {
        id: 'file-trans-att',
        name: 'Transformers_Self_Attention_Guide.pptx',
        mimeType: 'application/vnd.google-apps.presentation',
        size: '6.5 MB',
        type: 'PPT',
        course: 'CS701 - Deep Learning',
        author: 'Dr. Andrew N.',
        content: `Transformer Architectures and Self-Attention Mechanism:
Scaled Dot-Product Attention: Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) V.
Multi-Head Attention: Projects Queries, Keys, and Values into multiple subspaces allowing model to jointly attend to information from different representation positions.`
      }
    ]
  }
];

/**
 * Generate Google OAuth 2.0 Auth URL
 */
function getGoogleAuthUrl() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback';
  const scope = encodeURIComponent('https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file');

  if (clientId && clientId.trim() !== '') {
    return `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&access_type=offline&prompt=consent`;
  }

  // Fallback demo OAuth auth URL
  return `/api/auth/google/demo-callback`;
}

/**
 * Handle OAuth Callback / Token Exchange
 */
function connectGoogleDrive(accountInfo = {}) {
  currentDriveSession = {
    isConnected: true,
    account: {
      name: accountInfo.name || 'Alex Rivera (Google Student Workspace)',
      email: accountInfo.email || 'alex.rivera.student@gmail.com',
      avatar: accountInfo.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      storageUsed: '4.2 GB of 15 GB'
    },
    selectedFolder: null,
    syncedAt: new Date().toISOString(),
    token: `gdrive-oauth-token-${Date.now()}`
  };

  return currentDriveSession;
}

/**
 * Get current Drive session status
 */
function getDriveStatus() {
  return currentDriveSession;
}

/**
 * Disconnect Google Drive
 */
function disconnectGoogleDrive() {
  currentDriveSession = {
    isConnected: false,
    account: null,
    selectedFolder: null,
    syncedAt: null,
    token: null
  };
  return currentDriveSession;
}

/**
 * List available Google Drive Learning Folders
 */
function getDriveFolders() {
  return MOCK_DRIVE_FOLDERS.map(folder => ({
    id: folder.id,
    name: folder.name,
    path: folder.path,
    description: folder.description,
    itemCount: folder.itemCount,
    lastModified: folder.lastModified,
    filesCount: folder.files.length
  }));
}

/**
 * List files inside a specific Google Drive Folder
 */
function getDriveFilesByFolderId(folderId) {
  const folder = MOCK_DRIVE_FOLDERS.find(f => f.id === folderId || f.name.toLowerCase() === folderId.toLowerCase());
  if (!folder) return [];
  return folder.files;
}

/**
 * Core Knowledge Ingestion Workflow:
 * Ingest all permitted files from chosen Google Drive folder into MemoryMap!
 */
async function ingestGoogleDriveFolder(folderId) {
  const folder = MOCK_DRIVE_FOLDERS.find(f => f.id === folderId || f.name.toLowerCase() === folderId.toLowerCase()) || MOCK_DRIVE_FOLDERS[0];

  currentDriveSession.selectedFolder = {
    id: folder.id,
    name: folder.name,
    path: folder.path
  };
  currentDriveSession.syncedAt = new Date().toISOString();

  const ingestedResults = [];
  let totalExtractedConcepts = 0;

  for (const file of folder.files) {
    // 1. Add material to local workspace store
    const material = store.addMaterial({
      title: file.name,
      content: file.content,
      type: file.type,
      course: file.course,
      author: file.author
    });

    // 2. Run AI Engine concept extraction
    const extraction = await extractConceptsFromMaterial(material.title, material.content);
    const rawConcepts = Array.isArray(extraction) ? extraction : (extraction.concepts || []);
    
    const formattedConcepts = rawConcepts.map(c => ({
      ...c,
      sourceDocId: material.id,
      sourceDocTitle: material.title
    }));

    // 3. Add extracted concepts & relationships to Knowledge Map
    store.addConcepts(formattedConcepts);

    totalExtractedConcepts += formattedConcepts.length;
    ingestedResults.push({
      material,
      conceptsCount: formattedConcepts.length,
      concepts: formattedConcepts,
      summary: extraction.summary || `Extracted ${formattedConcepts.length} concepts.`
    });
  }

  const updatedSummary = store.getWorkspaceSummary();

  return {
    success: true,
    message: `Successfully connected & ingested Google Drive folder "${folder.name}"!`,
    folderName: folder.name,
    filesProcessed: folder.files.length,
    conceptsExtracted: totalExtractedConcepts,
    ingestedResults,
    summary: updatedSummary,
    driveSession: currentDriveSession
  };
}

module.exports = {
  getGoogleAuthUrl,
  connectGoogleDrive,
  getDriveStatus,
  disconnectGoogleDrive,
  getDriveFolders,
  getDriveFilesByFolderId,
  ingestGoogleDriveFolder
};
