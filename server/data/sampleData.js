// Pre-loaded rich sample domains for instant presentation demo

const WORKSPACES = {
  aiml: {
    id: 'aiml',
    name: 'Artificial Intelligence & Deep Learning',
    description: 'Lecture slides, research papers, and lab notes covering Neural Networks, Optimization, and Transformers.',
    materials: [
      {
        id: 'doc-1',
        title: 'Java Collections.pdf',
        type: 'PDF',
        course: 'CS201 - Data Structures & Algorithms',
        author: 'Prof. J. Gosling',
        dateAdded: '2026-02-14',
        pageCount: 24,
        size: '2.8 MB',
        conceptsCount: 12,
        connectionsCount: 5,
        mainTopics: ['ArrayList', 'HashSet', 'HashMap', 'Collections', 'Duplicate Removal'],
        status: 'Indexed & Mapped',
        content: `Java Collections Framework:
Section 1: ArrayList resizable arrays.
Section 2: HashSet unique element sets.
Section 3: HashMap key-value pairs.
Section 4: Duplicate removal algorithms.`
      },
      {
        id: 'doc-2',
        title: 'Deep_Learning_Lecture_04_Optimization.pdf',
        type: 'PDF',
        course: 'CS701 - Deep Learning',
        author: 'Prof. A. Vance',
        dateAdded: '2026-02-14',
        pageCount: 42,
        size: '3.4 MB',
        conceptsCount: 15,
        connectionsCount: 8,
        mainTopics: ['Vanishing Gradient', 'Exploding Gradient', 'ResNet Skips', 'BPTT'],
        status: 'Indexed & Mapped',
        content: `Chapter 4: Optimization in Deep Neural Networks.
Section 4.1: Vanishing Gradient Problem in deep architectures.
Section 4.2: Exploding Gradients & Gradient Clipping.
Section 4.3: Residual Connections (ResNets) solve vanishing gradients by adding identity skip connections f(x) + x.`
      },
      {
        id: 'doc-3',
        title: 'Transformers_Self_Attention_Guide.pptx',
        type: 'PPT',
        course: 'CS705 - Natural Language Processing',
        author: 'Dr. M. Chen',
        dateAdded: '2026-03-01',
        pageCount: 28,
        size: '5.1 MB',
        conceptsCount: 10,
        connectionsCount: 6,
        mainTopics: ['Scaled Dot-Product', 'Multi-Head Attention', 'Positional Encoding'],
        status: 'Indexed & Mapped',
        content: `Slide 8: Scaled Dot-Product Attention Softmax((Q * K^T) / sqrt(d_k)) * V.
Slide 18: Positional Encoding sinusoidal functions.`
      },
      {
        id: 'doc-4',
        title: 'Data Structures Notes.md',
        type: 'Notes',
        course: 'CS201 - Data Structures',
        author: 'Student Journal',
        dateAdded: '2026-03-10',
        pageCount: 15,
        size: '420 KB',
        conceptsCount: 8,
        connectionsCount: 4,
        mainTopics: ['Recursion', 'Binary Trees', 'Graph Traversal', 'Stacks'],
        status: 'Indexed & Mapped',
        content: `Notes on Recursion and Tree Traversals:
- Base cases prevent infinite call stack overflows.
- Binary Tree Inorder, Preorder, and Postorder traversals.`
      }
    ],

    concepts: [
      {
        id: 'c-hashset',
        title: 'HashSet',
        category: 'Java Collections',
        definition: 'Stores unique elements in Java backed by a hashtable. Prevents duplicates and provides constant time O(1) performance for basic operations.',
        learnedFrom: [
          { doc: 'Java Collections.pdf', location: 'Page 12' },
          { doc: 'Java Practice Notes.md', location: 'Section 4' }
        ],
        sourceDocId: 'doc-1',
        sourceDocTitle: 'Java Collections.pdf',
        location: 'Page 12',
        snippet: 'HashSet implements Set interface, backed by hash table. Guarantees no duplicate elements.',
        confidence: 0.98,
        mastery: 90,
        statusLevel: 'Intermediate',
        prerequisites: ['Set Interface', 'Hashing'],
        connectedConcepts: ['ArrayList', 'HashMap', 'Set', 'Duplicate Removal']
      },
      {
        id: 'c-hashmap',
        title: 'HashMap',
        category: 'Java Collections',
        definition: 'Hash table based implementation of Map interface, storing key-value pairs.',
        learnedFrom: [
          { doc: 'Java Collections.pdf', location: 'Page 15' }
        ],
        sourceDocId: 'doc-1',
        sourceDocTitle: 'Java Collections.pdf',
        location: 'Page 15',
        snippet: 'HashMap maps unique keys to values with average O(1) retrieval.',
        confidence: 0.97,
        mastery: 75,
        statusLevel: 'Intermediate',
        prerequisites: ['Map Interface', 'HashCode'],
        connectedConcepts: ['HashSet', 'ArrayList', 'Collision Handling']
      },
      {
        id: 'c-arraylist',
        title: 'ArrayList',
        category: 'Java Collections',
        definition: 'Resizable-array implementation of the List interface.',
        learnedFrom: [
          { doc: 'Java Collections.pdf', location: 'Page 3' }
        ],
        sourceDocId: 'doc-1',
        sourceDocTitle: 'Java Collections.pdf',
        location: 'Page 3',
        snippet: 'ArrayList provides fast random index retrieval.',
        confidence: 0.99,
        mastery: 95,
        statusLevel: 'Mastered',
        prerequisites: ['List Interface', 'Arrays'],
        connectedConcepts: ['HashSet', 'LinkedList', 'Collections']
      },
      {
        id: 'c-1',
        title: 'Vanishing Gradient Problem',
        category: 'Optimization & Training',
        definition: 'Occurs in deep architectures when gradients become exponentially small as they propagate backwards during backprop.',
        learnedFrom: [
          { doc: 'Deep_Learning_Lecture_04_Optimization.pdf', location: 'Section 4.1 (Page 14)' }
        ],
        sourceDocId: 'doc-2',
        sourceDocTitle: 'Deep_Learning_Lecture_04_Optimization.pdf',
        location: 'Section 4.1 (Page 14)',
        snippet: 'Vanishing Gradient Problem occurs when gradients shrink exponentially.',
        confidence: 0.98,
        mastery: 85,
        statusLevel: 'Intermediate',
        prerequisites: ['Backpropagation', 'Chain Rule'],
        connectedConcepts: ['Residual Connections', 'Gradient Clipping']
      }
    ],

    gaps: [
      {
        id: 'gap-hashmap',
        concept: 'HashMap',
        progress: 75,
        covered: ['Basic usage', 'Key-value pairs', 'put() / get()'],
        missing: ['Collision handling', 'Hashing mechanism'],
        suggestedNext: 'Hashing & Collision Handling',
        recommendedDoc: 'Java Collections.pdf (Page 16)'
      },
      {
        id: 'gap-positional',
        concept: 'Positional Encodings',
        progress: 40,
        covered: ['Query/Key matrices', 'Word Embeddings'],
        missing: ['Sinusoidal frequency scaling', 'Relative distance vectors'],
        suggestedNext: 'Sinusoidal Frequency Scaling',
        recommendedDoc: 'Transformers_Self_Attention_Guide.pptx (Slide 18)'
      },
      {
        id: 'gap-relu',
        concept: 'Dying ReLU',
        progress: 55,
        covered: ['Positive max(0, x) activation', 'Zero output'],
        missing: ['Gradient backprop zeroing', 'Leaky ReLU alpha slope'],
        suggestedNext: 'Leaky ReLU Alpha Slope Adjustment',
        recommendedDoc: 'Neural_Network_Architectures_Handwritten_Notes.md (Page 3)'
      }
    ],

    recentRecoveredMemory: [
      { concept: 'HashSet', recoveredFrom: 'Java Collections.pdf', timestamp: '10 mins ago' },
      { concept: 'Recursion', recoveredFrom: 'Data Structures Notes.md', timestamp: '45 mins ago' },
      { concept: 'Normalization', recoveredFrom: 'DBMS PPT.pptx', timestamp: '2 hours ago' },
      { concept: 'Vanishing Gradients', recoveredFrom: 'Deep_Learning_Lecture_04_Optimization.pdf', timestamp: 'Yesterday' }
    ],

    recentSearches: [
      { query: 'Where did I learn about Vanishing Gradients?', timestamp: '12 mins ago', match: 'Deep_Learning_Lecture_04_Optimization.pdf', confidence: '98%' },
      { query: 'HashSet duplicate removal', timestamp: '1 hour ago', match: 'Java Collections.pdf', confidence: '99%' }
    ],

    suggestedTopics: [
      { title: 'Hashing & Collision Handling', category: 'Java Collections', reason: 'Feature E Learning Gap (75% Progress)', action: 'Learn Next' },
      { title: 'Sinusoidal Frequency Scaling', category: 'Attention Mechanisms', reason: 'Critical Gap Identified (40% Progress)', action: 'Learn Next' }
    ],

    quizzes: [
      {
        id: 'q-1',
        question: 'Which method in HashSet guarantees constant time lookup of unique elements?',
        options: [
          'contains() using hashCode() and equals()',
          'get(index) positional access',
          'binarySearch() tree traversal',
          'sort() iteration'
        ],
        correctAnswer: 0,
        explanation: 'HashSet uses underlying HashMap hashing mechanism to check contains() in O(1) average time.'
      }
    ]
  }
};

module.exports = { WORKSPACES };
