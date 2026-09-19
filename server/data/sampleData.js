// Pre-loaded realistic demo datasets for MemoryMap presentation demo

const WORKSPACES = {
  aiml: {
    id: 'aiml',
    name: 'Computer Science & AI Curriculum',
    description: 'Pre-indexed learning materials covering Java Collections, Data Structures, DBMS, and Deep Learning.',
    materials: [
      {
        id: 'doc-java-coll',
        title: 'Java Collections.pdf',
        type: 'PDF',
        course: 'CS201 - Data Structures & Algorithms',
        author: 'Prof. J. Gosling',
        dateAdded: '2026-02-14',
        pageCount: 24,
        size: '2.8 MB',
        conceptsCount: 12,
        connectionsCount: 5,
        mainTopics: ['Java', 'Collections', 'ArrayList', 'HashSet', 'HashMap', 'Duplicate Removal'],
        status: 'Indexed & Mapped',
        content: `Java Collections Framework Guide:
Section 1: Java & Collections Architecture. Java provides a unified collection hierarchy.
Section 2: ArrayList resizable arrays providing O(1) random index retrieval.
Section 3: HashSet unique element sets (Page 12). HashSet implements the Set interface, backed by a hash table. Guarantees no duplicate elements.
Section 4: HashMap key-value mappings storing key-value pairs using hash algorithms.
Section 5: Duplicate Removal techniques using HashSet constructor.`
      },
      {
        id: 'doc-ds-notes',
        title: 'Data Structures Notes.md',
        type: 'Notes',
        course: 'CS201 - Data Structures',
        author: 'Student Journal',
        dateAdded: '2026-03-01',
        pageCount: 18,
        size: '640 KB',
        conceptsCount: 8,
        connectionsCount: 4,
        mainTopics: ['Stack', 'Queue', 'Linked List', 'Tree', 'Recursion'],
        status: 'Indexed & Mapped',
        content: `Data Structures Core Notes:
- Stack: LIFO data structure with push and pop operations.
- Queue: FIFO data structure with enqueue and dequeue.
- Linked List: Node pointers with dynamic allocation.
- Tree: Hierarchical nodes with root and leaf child links.
- Recursion: Self-referential functions with base cases preventing call stack overflow.`
      },
      {
        id: 'doc-dbms-notes',
        title: 'DBMS Notes.pdf',
        type: 'PDF',
        course: 'CS302 - Database Systems',
        author: 'Dr. E. F. Codd',
        dateAdded: '2026-03-10',
        pageCount: 32,
        size: '3.1 MB',
        conceptsCount: 10,
        connectionsCount: 6,
        mainTopics: ['Database', 'SQL', 'Normalization', 'Primary Key', 'Foreign Key'],
        status: 'Indexed & Mapped',
        content: `Database Management Systems (DBMS):
Section 1: Database relational models and SQL query execution.
Section 2: Normalization 1NF, 2NF, 3NF, BCNF to eliminate data redundancy.
Section 3: Primary Key unique entity identification and Foreign Key relational constraints.`
      },
      {
        id: 'doc-dl-opt',
        title: 'Deep_Learning_Lecture_04_Optimization.pdf',
        type: 'PDF',
        course: 'CS701 - Deep Learning',
        author: 'Prof. A. Vance',
        dateAdded: '2026-02-10',
        pageCount: 42,
        size: '3.4 MB',
        conceptsCount: 15,
        connectionsCount: 8,
        mainTopics: ['Vanishing Gradient', 'Exploding Gradient', 'ResNet Skips', 'BPTT'],
        status: 'Indexed & Mapped',
        content: `Chapter 4: Optimization in Deep Neural Networks.
Section 4.1: Vanishing Gradient Problem in deep architectures.
Section 4.2: Exploding Gradients & Gradient Clipping.`
      }
    ],

    concepts: [
      {
        id: 'c-hashset',
        title: 'HashSet',
        category: 'Java Collections',
        definition: 'Stores unique elements in Java backed by a hashtable. Guarantees no duplicate elements.',
        learnedFrom: [
          { doc: 'Java Collections.pdf', location: 'Page 12' },
          { doc: 'Java Practice Notes.md', location: 'Section 4' }
        ],
        sourceDocId: 'doc-java-coll',
        sourceDocTitle: 'Java Collections.pdf',
        location: 'Page 12',
        snippet: 'HashSet implements Set interface, backed by hash table. Guarantees no duplicate elements.',
        confidence: 0.99,
        mastery: 90,
        statusLevel: 'Intermediate',
        prerequisites: ['Set Interface', 'Collections'],
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
        sourceDocId: 'doc-java-coll',
        sourceDocTitle: 'Java Collections.pdf',
        location: 'Page 15',
        snippet: 'HashMap stores key-value pairs using hashing algorithms.',
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
        sourceDocId: 'doc-java-coll',
        sourceDocTitle: 'Java Collections.pdf',
        location: 'Page 3',
        snippet: 'ArrayList provides fast O(1) random index retrieval.',
        confidence: 0.99,
        mastery: 95,
        statusLevel: 'Mastered',
        prerequisites: ['List Interface', 'Arrays'],
        connectedConcepts: ['HashSet', 'LinkedList', 'Collections']
      },
      {
        id: 'c-java',
        title: 'Java',
        category: 'Programming Languages',
        definition: 'Object-oriented programming language designed for platform independence.',
        learnedFrom: [{ doc: 'Java Collections.pdf', location: 'Page 1' }],
        sourceDocId: 'doc-java-coll',
        sourceDocTitle: 'Java Collections.pdf',
        location: 'Page 1',
        snippet: 'Java provides object-oriented execution on JVM.',
        confidence: 0.99,
        mastery: 98,
        statusLevel: 'Mastered',
        prerequisites: ['Object-Oriented Programming'],
        connectedConcepts: ['Collections', 'ArrayList', 'HashSet']
      },
      {
        id: 'c-collections',
        title: 'Collections',
        category: 'Java Architecture',
        definition: 'Unified framework for representing and manipulating collections of objects.',
        learnedFrom: [{ doc: 'Java Collections.pdf', location: 'Page 1' }],
        sourceDocId: 'doc-java-coll',
        sourceDocTitle: 'Java Collections.pdf',
        location: 'Page 1',
        snippet: 'Collections framework unifies data structures.',
        confidence: 0.98,
        mastery: 92,
        statusLevel: 'Mastered',
        prerequisites: ['Java'],
        connectedConcepts: ['ArrayList', 'HashSet', 'HashMap']
      },
      {
        id: 'c-dup-removal',
        title: 'Duplicate Removal',
        category: 'Algorithms',
        definition: 'Technique of passing a collection into HashSet to eliminate duplicate entries.',
        learnedFrom: [{ doc: 'Java Collections.pdf', location: 'Page 18' }],
        sourceDocId: 'doc-java-coll',
        sourceDocTitle: 'Java Collections.pdf',
        location: 'Page 18',
        snippet: 'Passing ArrayList to HashSet constructor removes duplicates in O(N).',
        confidence: 0.95,
        mastery: 80,
        statusLevel: 'Intermediate',
        prerequisites: ['HashSet'],
        connectedConcepts: ['Collections', 'ArrayList']
      },
      {
        id: 'c-stack',
        title: 'Stack',
        category: 'Data Structures',
        definition: 'LIFO (Last-In-First-Out) linear data structure.',
        learnedFrom: [{ doc: 'Data Structures Notes.md', location: 'Page 2' }],
        sourceDocId: 'doc-ds-notes',
        sourceDocTitle: 'Data Structures Notes.md',
        location: 'Page 2',
        snippet: 'Stack operates using push and pop functions.',
        confidence: 0.98,
        mastery: 92,
        statusLevel: 'Mastered',
        prerequisites: ['Arrays'],
        connectedConcepts: ['Queue', 'Recursion']
      },
      {
        id: 'c-recursion',
        title: 'Recursion',
        category: 'Algorithms',
        definition: 'Method where a function calls itself to solve smaller subproblems.',
        learnedFrom: [{ doc: 'Data Structures Notes.md', location: 'Page 10' }],
        sourceDocId: 'doc-ds-notes',
        sourceDocTitle: 'Data Structures Notes.md',
        location: 'Page 10',
        snippet: 'Recursion requires base cases to prevent stack overflow.',
        confidence: 0.97,
        mastery: 88,
        statusLevel: 'Intermediate',
        prerequisites: ['Stack'],
        connectedConcepts: ['Tree', 'Binary Search']
      },
      {
        id: 'c-norm',
        title: 'Normalization',
        category: 'Database Systems',
        definition: 'Process of structuring relational database schema to eliminate data redundancy.',
        learnedFrom: [{ doc: 'DBMS Notes.pdf', location: 'Page 14' }],
        sourceDocId: 'doc-dbms-notes',
        sourceDocTitle: 'DBMS Notes.pdf',
        location: 'Page 14',
        snippet: 'Normalization 1NF, 2NF, 3NF minimizes anomaly risks.',
        confidence: 0.98,
        mastery: 85,
        statusLevel: 'Intermediate',
        prerequisites: ['Database', 'SQL'],
        connectedConcepts: ['Primary Key', 'Foreign Key']
      }
    ],

    relationships: [
      { source: 'c-java', target: 'c-collections', type: 'INCLUDES', label: 'Includes' },
      { source: 'c-collections', target: 'c-arraylist', type: 'IMPLEMENTS', label: 'Implements' },
      { source: 'c-collections', target: 'c-hashset', type: 'IMPLEMENTS', label: 'Implements' },
      { source: 'c-collections', target: 'c-hashmap', type: 'IMPLEMENTS', label: 'Implements' },
      { source: 'c-hashset', target: 'c-dup-removal', type: 'ENABLES', label: 'Enables' },
      { source: 'c-stack', target: 'c-recursion', type: 'MODELS', label: 'Models' },
      { source: 'c-norm', target: 'c-dbms', type: 'OPTIMIZES', label: 'Optimizes' }
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
      }
    ],

    recentRecoveredMemory: [
      { concept: 'HashSet', recoveredFrom: 'Java Collections.pdf', timestamp: '10 mins ago' },
      { concept: 'Recursion', recoveredFrom: 'Data Structures Notes.md', timestamp: '45 mins ago' },
      { concept: 'Normalization', recoveredFrom: 'DBMS Notes.pdf', timestamp: '2 hours ago' },
      { concept: 'Vanishing Gradients', recoveredFrom: 'Deep_Learning_Lecture_04_Optimization.pdf', timestamp: 'Yesterday' }
    ],

    recentSearches: [
      { query: 'Where did I learn about HashSet?', timestamp: 'Just now', match: 'Java Collections.pdf (Page 12)', confidence: '99%' },
      { query: 'Where did I learn about Vanishing Gradients?', timestamp: '12 mins ago', match: 'Deep_Learning_Lecture_04_Optimization.pdf', confidence: '98%' }
    ],

    suggestedTopics: [
      { title: 'Hashing & Collision Handling', category: 'Java Collections', reason: 'Step 5 Presentation Gap (75% Progress)', action: 'Learn Next' }
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
