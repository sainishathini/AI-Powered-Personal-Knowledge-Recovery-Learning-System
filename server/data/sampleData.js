// Pre-loaded rich sample domains for instant presentation demo

const WORKSPACES = {
  aiml: {
    id: 'aiml',
    name: 'Artificial Intelligence & Deep Learning',
    description: 'Lecture slides, research papers, and lab notes covering Neural Networks, Optimization, and Transformers.',
    materials: [
      {
        id: 'doc-1',
        title: 'Deep_Learning_Lecture_04_Optimization.pdf',
        type: 'PDF',
        course: 'CS701 - Deep Learning',
        author: 'Prof. A. Vance',
        dateAdded: '2026-02-14',
        pageCount: 42,
        size: '3.4 MB',
        content: `Chapter 4: Optimization in Deep Neural Networks.
Section 4.1: Gradient Descent & Stochastic Variants. Standard gradient descent computes parameters by moving in the negative direction of the gradient. However, in deep architectures, Vanishing Gradient Problem occurs when gradients shrink exponentially as they propagate backward through multiple layers.
Section 4.2: Exploding Gradients & Gradient Clipping. When weights are initialized too high or continuous multiplications occur, gradients explode into Infinity/NaN. Gradient clipping thresholds upper bound norm of gradients.
Section 4.3: Backpropagation through Time (BPTT). Unrolling Recurrent Neural Networks across temporal steps yields long computational graphs. Residual Connections (ResNets) solve vanishing gradients by adding identity skip connections f(x) + x, letting gradients flow directly during backprop.`
      },
      {
        id: 'doc-2',
        title: 'Transformers_Self_Attention_Guide.pptx',
        type: 'PPT',
        course: 'CS705 - Natural Language Processing',
        author: 'Dr. M. Chen',
        dateAdded: '2026-03-01',
        pageCount: 28,
        size: '5.1 MB',
        content: `Slide 1: Introduction to Attention Mechanisms. Traditional RNNs suffer from sequential bottlenecking.
Slide 8: Scaled Dot-Product Attention. Query (Q), Key (K), Value (V) matrices. Formula: Softmax((Q * K^T) / sqrt(d_k)) * V.
Slide 12: Multi-Head Attention. Allows model to jointly attend to information from different representation subspaces at different positions.
Slide 18: Positional Encoding. Since Transformers process all tokens simultaneously without recurrence, sinusoidal positional encodings add order information to input embeddings.
Slide 22: Transformer Encoder-Decoder Architecture. Self-attention layers compute pairwise interactions across all input tokens in O(N^2) complexity.`
      },
      {
        id: 'doc-3',
        title: 'Neural_Network_Architectures_Handwritten_Notes.md',
        type: 'Notes',
        course: 'CS701 - Deep Learning',
        author: 'Student Journal',
        dateAdded: '2026-03-10',
        pageCount: 15,
        size: '420 KB',
        content: `Notes on CNNs and Vision Transformers:
- Convolutional layers extract local spatial features using shared kernel weights (translation invariance).
- Activation Functions: ReLU (Rectified Linear Unit) max(0, x) prevents vanishing gradients for positive inputs, but causes 'Dying ReLU' when neurons get stuck negative. Leaky ReLU solves this by adding a small slope 0.01x.
- Softmax Function converts raw logit scores into normalized probability distributions summing to 1. Used in final classification layers.
- Cross-Entropy Loss measures divergence between predicted probability distribution and true one-hot vector label.`
      },
      {
        id: 'doc-4',
        title: 'https://arxiv.org/abs/1706.03762_Attention_Is_All_You_Need',
        type: 'Web',
        course: 'Research Literature',
        author: 'Vaswani et al.',
        dateAdded: '2026-01-20',
        pageCount: 11,
        size: 'Link',
        content: `Abstract & Core Findings: We propose the Transformer, a network architecture based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.
Section 3.2: Multi-Head Attention allows the model to attend to information from different representation subspaces.
Section 3.5: Positional Encoding is added to the input embeddings at the bottoms of the encoder and decoder stacks.`
      }
    ],

    concepts: [
      {
        id: 'c-1',
        title: 'Vanishing Gradient Problem',
        category: 'Optimization & Training',
        definition: 'Occurs in deep architectures when gradients become exponentially small as they propagate backwards during backprop, preventing early layers from updating weights.',
        sourceDocId: 'doc-1',
        sourceDocTitle: 'Deep_Learning_Lecture_04_Optimization.pdf',
        location: 'Section 4.1 (Page 14)',
        snippet: 'However, in deep architectures, Vanishing Gradient Problem occurs when gradients shrink exponentially as they propagate backward through multiple layers.',
        confidence: 0.98,
        mastery: 85,
        prerequisites: ['Backpropagation', 'Chain Rule'],
        connectedConcepts: ['Residual Connections', 'Gradient Clipping', 'Leaky ReLU']
      },
      {
        id: 'c-2',
        title: 'Residual Connections (Skip Connections)',
        category: 'Architecture Patterns',
        definition: 'Shortcut pathways that add the input directly to the output of a block f(x) + x, providing an unimpeded highway for gradient flow during backprop.',
        sourceDocId: 'doc-1',
        sourceDocTitle: 'Deep_Learning_Lecture_04_Optimization.pdf',
        location: 'Section 4.3 (Page 29)',
        snippet: 'Residual Connections (ResNets) solve vanishing gradients by adding identity skip connections f(x) + x, letting gradients flow directly during backprop.',
        confidence: 0.96,
        mastery: 92,
        prerequisites: ['Vanishing Gradient Problem'],
        connectedConcepts: ['Transformer Encoder-Decoder']
      },
      {
        id: 'c-3',
        title: 'Scaled Dot-Product Attention',
        category: 'Attention Mechanisms',
        definition: 'Attention calculation using Query, Key, and Value matrices scaled by the square root of key dimension d_k to prevent extreme softmax values.',
        sourceDocId: 'doc-2',
        sourceDocTitle: 'Transformers_Self_Attention_Guide.pptx',
        location: 'Slide 8',
        snippet: 'Scaled Dot-Product Attention. Query (Q), Key (K), Value (V) matrices. Formula: Softmax((Q * K^T) / sqrt(d_k)) * V.',
        confidence: 0.99,
        mastery: 70,
        prerequisites: ['Matrix Multiplication', 'Softmax Function'],
        connectedConcepts: ['Multi-Head Attention', 'Positional Encoding']
      },
      {
        id: 'c-4',
        title: 'Multi-Head Attention',
        category: 'Attention Mechanisms',
        definition: 'Extension of attention that projects queries, keys, and values h times into lower-dimensional subspaces to capture diverse contextual relations.',
        sourceDocId: 'doc-2',
        sourceDocTitle: 'Transformers_Self_Attention_Guide.pptx',
        location: 'Slide 12',
        snippet: 'Multi-Head Attention allows model to jointly attend to information from different representation subspaces at different positions.',
        confidence: 0.95,
        mastery: 65,
        prerequisites: ['Scaled Dot-Product Attention'],
        connectedConcepts: ['Transformer Encoder-Decoder']
      },
      {
        id: 'c-5',
        title: 'Positional Encoding',
        category: 'Transformer Components',
        definition: 'Sinusoidal functions or learned vectors added to input embeddings to convey sequence order in non-recurrent architectures.',
        sourceDocId: 'doc-2',
        sourceDocTitle: 'Transformers_Self_Attention_Guide.pptx',
        location: 'Slide 18',
        snippet: 'Since Transformers process all tokens simultaneously without recurrence, sinusoidal positional encodings add order information.',
        confidence: 0.94,
        mastery: 40,
        prerequisites: ['Word Embeddings'],
        connectedConcepts: ['Multi-Head Attention']
      },
      {
        id: 'c-6',
        title: 'Softmax Function',
        category: 'Activation Functions',
        definition: 'Mathematical function that normalizes a vector of raw logit real numbers into a valid probability distribution summing to 1.',
        sourceDocId: 'doc-3',
        sourceDocTitle: 'Neural_Network_Architectures_Handwritten_Notes.md',
        location: 'Page 5',
        snippet: 'Softmax Function converts raw logit scores into normalized probability distributions summing to 1.',
        confidence: 0.99,
        mastery: 95,
        prerequisites: ['Exponentiation'],
        connectedConcepts: ['Cross-Entropy Loss', 'Scaled Dot-Product Attention']
      },
      {
        id: 'c-7',
        title: 'Gradient Clipping',
        category: 'Optimization & Training',
        definition: 'A technique to prevent exploding gradients by clamping gradient values or capping their norm to a pre-defined maximum threshold.',
        sourceDocId: 'doc-1',
        sourceDocTitle: 'Deep_Learning_Lecture_04_Optimization.pdf',
        location: 'Section 4.2 (Page 21)',
        snippet: 'When weights are initialized too high or continuous multiplications occur, gradients explode into Infinity/NaN. Gradient clipping thresholds upper bound norm of gradients.',
        confidence: 0.93,
        mastery: 78,
        prerequisites: ['Vanishing Gradient Problem'],
        connectedConcepts: ['Optimizer Adam']
      },
      {
        id: 'c-8',
        title: 'Dying ReLU Problem',
        category: 'Activation Functions',
        definition: 'Scenario where neurons become inactive and permanently output zero for all inputs because large negative gradients zeroed out weight updates.',
        sourceDocId: 'doc-3',
        sourceDocTitle: 'Neural_Network_Architectures_Handwritten_Notes.md',
        location: 'Page 3',
        snippet: 'ReLU max(0, x) prevents vanishing gradients for positive inputs, but causes Dying ReLU when neurons get stuck negative. Leaky ReLU solves this.',
        confidence: 0.91,
        mastery: 45,
        prerequisites: ['Softmax Function'],
        connectedConcepts: ['Vanishing Gradient Problem']
      }
    ],

    relationships: [
      { source: 'c-1', target: 'c-2', type: 'SOLVED_BY', label: 'Solved by skip connections' },
      { source: 'c-1', target: 'c-7', type: 'RELATED_TO', label: 'Counterpart optimization hazard' },
      { source: 'c-6', target: 'c-3', type: 'PREREQUISITE_OF', label: 'Used in attention weighting' },
      { source: 'c-3', target: 'c-4', type: 'PART_OF', label: 'Component of Multi-Head' },
      { source: 'c-5', target: 'c-4', type: 'COMBINED_WITH', label: 'Injected into transformer inputs' },
      { source: 'c-8', target: 'c-1', type: 'RELATED_TO', label: 'Activation gradient decay' }
    ],

    gaps: [
      {
        id: 'gap-1',
        topic: 'Positional Encoding & Temporal Dynamics',
        status: 'CRITICAL_GAP',
        mastery: 40,
        description: 'Low recall on why sinusoidal encodings are added to query matrices before self-attention.',
        missingPrerequisite: 'Word Embeddings & Vector Spaces',
        recommendedDoc: 'Transformers_Self_Attention_Guide.pptx (Slide 18)',
        suggestedAction: 'Review how sine and cosine functions create fixed relative distance vectors.'
      },
      {
        id: 'gap-2',
        topic: 'Dying ReLU vs Leaky ReLU',
        status: 'WEAK_CONNECTION',
        mastery: 45,
        description: 'Missing link between dying ReLU zero-gradients and backprop gradient vanishing.',
        missingPrerequisite: 'Gradient Derivatives',
        recommendedDoc: 'Neural_Network_Architectures_Handwritten_Notes.md (Page 3)',
        suggestedAction: 'Study derivative of ReLU for x < 0 vs Leaky ReLU alpha coefficient.'
      }
    ],

    quizzes: [
      {
        id: 'q-1',
        question: 'Where in your learning materials did you first study how Residual Connections mitigate vanishing gradients?',
        options: [
          'Transformers_Self_Attention_Guide.pptx (Slide 12)',
          'Deep_Learning_Lecture_04_Optimization.pdf (Section 4.3)',
          'Neural_Network_Architectures_Handwritten_Notes.md (Page 3)',
          'arXiv Attention Paper (Section 3.5)'
        ],
        correctAnswer: 1,
        explanation: 'Deep_Learning_Lecture_04_Optimization.pdf Section 4.3 explains identity skip connections f(x) + x.'
      },
      {
        id: 'q-2',
        question: 'What operation scales Query and Key dot-products in Scaled Dot-Product Attention?',
        options: [
          'Division by the square root of key dimension sqrt(d_k)',
          'Multiplication by learning rate alpha',
          'Softmax thresholding at 0.5',
          'L2 Norm normalization'
        ],
        correctAnswer: 0,
        explanation: 'Formula Softmax((Q * K^T) / sqrt(d_k)) * V divides by sqrt(d_k) to prevent vanishing gradients in softmax.'
      }
    ]
  },

  cs_systems: {
    id: 'cs_systems',
    name: 'Computer Systems & Data Structures',
    description: 'Operating Systems, Distributed Systems, B-Trees, CAP Theorem, and Memory Management.',
    materials: [
      {
        id: 'doc-10',
        title: 'Distributed_Systems_Lecture_08_CAP_Theorem.pdf',
        type: 'PDF',
        course: 'CS402 - Distributed Computing',
        author: 'Prof. R. Kumar',
        dateAdded: '2026-01-15',
        pageCount: 34,
        size: '2.8 MB',
        content: `Section 2: The CAP Theorem (Brewer\'s Theorem). In a network partition, a distributed data store can satisfy at most TWO of the following guarantees:
Consistency (every read receives the most recent write or an error), Availability (every non-failing node returns a non-error response), Partition Tolerance (system operates despite arbitrary network packet drops).
Section 3: PACELC Theorem extends CAP by stating if there is a Partition (P), how does system trade off Availability (A) and Consistency (C); Else (E), how does it trade off Latency (L) and Consistency (C).`
      },
      {
        id: 'doc-11',
        title: 'Virtual_Memory_Paging_TLB_Notes.docx',
        type: 'Notes',
        course: 'CS301 - Operating Systems',
        author: 'Lab Guide',
        dateAdded: '2026-02-02',
        pageCount: 18,
        size: '640 KB',
        content: `Page Tables & Translation Lookaside Buffer (TLB):
Virtual addresses are mapped to physical memory frame addresses via Multi-Level Page Tables.
TLB is a fast hardware associative cache that stores recent virtual-to-physical address translations.
TLB Hit: Address translation found instantly in hardware cache in ~1 cycle.
TLB Miss: Address translation requires walking the page table tree in RAM, causing memory latency overhead.`
      }
    ],

    concepts: [
      {
        id: 'c-10',
        title: 'CAP Theorem (Brewer\'s Theorem)',
        category: 'Distributed Systems',
        definition: 'States that any distributed data store can simultaneously provide at most two of three guarantees: Consistency, Availability, and Partition Tolerance.',
        sourceDocId: 'doc-10',
        sourceDocTitle: 'Distributed_Systems_Lecture_08_CAP_Theorem.pdf',
        location: 'Section 2 (Page 7)',
        snippet: 'In a network partition, a distributed data store can satisfy at most TWO of the following guarantees: Consistency, Availability, Partition Tolerance.',
        confidence: 0.99,
        mastery: 90,
        prerequisites: ['Network Partition', 'Replication'],
        connectedConcepts: ['PACELC Theorem', 'Eventual Consistency']
      },
      {
        id: 'c-11',
        title: 'Translation Lookaside Buffer (TLB)',
        category: 'Memory Management',
        definition: 'High-speed hardware associative cache that stores recent virtual-to-physical memory page address mappings to bypass full page table walks.',
        sourceDocId: 'doc-11',
        sourceDocTitle: 'Virtual_Memory_Paging_TLB_Notes.docx',
        location: 'Page 4',
        snippet: 'TLB is a fast hardware associative cache that stores recent virtual-to-physical address translations. TLB Hit occurs in ~1 cycle.',
        confidence: 0.97,
        mastery: 82,
        prerequisites: ['Virtual Memory', 'Paging'],
        connectedConcepts: ['Multi-Level Page Tables', 'Cache Miss Penalty']
      }
    ],

    relationships: [
      { source: 'c-10', target: 'c-11', type: 'CONCEPTUAL_PARALLEL', label: 'Hardware vs Network Caching' }
    ],

    gaps: [
      {
        id: 'gap-10',
        topic: 'PACELC Theorem Extensions',
        status: 'WEAK_CONNECTION',
        mastery: 50,
        description: 'Need to review latency vs consistency tradeoffs during normal non-partition operating states.',
        missingPrerequisite: 'Strict Serializability',
        recommendedDoc: 'Distributed_Systems_Lecture_08_CAP_Theorem.pdf (Section 3)',
        suggestedAction: 'Compare Cassandra AP system vs MongoDB CP system configuration.'
      }
    ],

    quizzes: [
      {
        id: 'q-10',
        question: 'Which document contains the formal definition of TLB Miss penalty vs Page Table Walk?',
        options: [
          'Virtual_Memory_Paging_TLB_Notes.docx (Page 4)',
          'Distributed_Systems_Lecture_08_CAP_Theorem.pdf (Section 2)',
          'OS_Kernel_Architecture.pdf (Page 12)',
          'Compiler_Design_AST.pptx (Slide 5)'
        ],
        correctAnswer: 0,
        explanation: 'Virtual_Memory_Paging_TLB_Notes.docx explains TLB cache lookup versus multi-level RAM page table walk.'
      }
    ]
  }
};

module.exports = { WORKSPACES };
