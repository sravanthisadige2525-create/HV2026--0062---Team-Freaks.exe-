import { 
  UserProfile, 
  AssessmentQuestion, 
  Internship, 
  InternshipSimulation, 
  Course, 
  CourseLesson,
  CodingProblem, 
  Mentor, 
  MentorTip, 
  LeaderboardEntry,
  CareerRecommendation,
  Certificate
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_student_01',
  email: 'alex.chen@university.edu',
  name: 'Alex Chen',
  role: 'student',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  education: 'B.Tech in Computer Science & Engineering',
  college: 'National Institute of Technology',
  branch: 'Computer Science',
  graduationYear: 2026,
  preferredLanguage: 'Python',
  careerInterests: ['Full Stack Developer', 'AI/ML Engineer', 'Data Analyst'],
  currentSkillLevel: 'Intermediate',
  createdAt: new Date().toISOString(),
  streakDays: 6,
  codingPoints: 480,
  careerReadinessScore: 78,
  bio: 'CS Junior passionate about scalable web architecture, AI agent workflows, and backend microservices.',
  githubUrl: 'https://github.com/alexchen-dev',
  linkedinUrl: 'https://linkedin.com/in/alexchen-dev'
};

// --------------------------------------------------------------------------
// TOPIC-BASED ASSESSMENT QUESTION BANK (13 Selected Topics)
// --------------------------------------------------------------------------
export const ASSESSMENT_TOPICS = [
  'Python',
  'Java',
  'DSA',
  'DBMS',
  'OS',
  'CN',
  'Web Development',
  'AI/ML',
  'Data Science',
  'Cloud',
  'Cybersecurity',
  'Aptitude',
  'Soft Skills'
] as const;

export const SAMPLE_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // 1. Python
  {
    id: 'q_py_1',
    category: 'technical',
    topic: 'Python',
    question: 'How does Python handle memory management for immutable objects like small integers and short strings?',
    options: [
      'Through integer interning and flyweight memory caching within small ranges (-5 to 256)',
      'By reallocating heap memory on every single variable assignment',
      'By converting all primitives to 64-bit floating point representations',
      'By relying strictly on manual garbage collection via `gc.collect()`'
    ],
    correctAnswer: 0,
    points: 15
  },
  {
    id: 'q_py_2',
    category: 'coding',
    topic: 'Python',
    question: 'Write a Python function `flatten_list(nested)` that flattens an arbitrarily nested list of integers into a single 1D list.',
    starterCode: `def flatten_list(nested: list) -> list:
    flat = []
    for item in nested:
        if isinstance(item, list):
            flat.extend(flatten_list(item))
        else:
            flat.append(item)
    return flat`,
    language: 'Python',
    testCases: [
      { input: '[[1, 2, [3]], 4]', output: '[1, 2, 3, 4]' }
    ],
    points: 20
  },

  // 2. Java
  {
    id: 'q_java_1',
    category: 'technical',
    topic: 'Java',
    question: 'What is the primary difference between `ConcurrentHashMap` and `Collections.synchronizedMap()` in multi-threaded Java applications?',
    options: [
      '`ConcurrentHashMap` locks at the bucket/segment level rather than locking the entire map on every operation',
      '`ConcurrentHashMap` does not allow concurrent reads at all',
      '`Collections.synchronizedMap()` does not use mutual exclusion synchronization locks',
      '`ConcurrentHashMap` stores keys in the JVM metaspace permanently'
    ],
    correctAnswer: 0,
    points: 15
  },
  {
    id: 'q_java_2',
    category: 'technical',
    topic: 'Java',
    question: 'In Java JVM memory architecture, where are object instances allocated and garbage collected?',
    options: [
      'JVM Heap Memory (Young Generation and Old/Tenured Generation)',
      'Thread-private JVM Stacks',
      'Native Metaspace only',
      'CPU L1 Cache registers'
    ],
    correctAnswer: 0,
    points: 15
  },

  // 3. DSA (Data Structures & Algorithms)
  {
    id: 'q_dsa_1',
    category: 'technical',
    topic: 'DSA',
    question: 'What is the average and worst-case time complexity of searching in a Balanced Binary Search Tree (e.g., AVL tree) with N nodes?',
    options: [
      'Average: O(log N), Worst: O(log N)',
      'Average: O(1), Worst: O(N)',
      'Average: O(log N), Worst: O(N)',
      'Average: O(N), Worst: O(N log N)'
    ],
    correctAnswer: 0,
    points: 15
  },
  {
    id: 'q_dsa_2',
    category: 'coding',
    topic: 'DSA',
    question: 'Write an algorithm `twoSum(nums, target)` that returns the indices of the two numbers that add up to target in O(N) time.',
    starterCode: `def twoSum(nums: list[int], target: int) -> list[int]:
    lookup = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in lookup:
            return [lookup[diff], i]
        lookup[num] = i
    return []`,
    language: 'Python',
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0, 1]' },
      { input: 'nums = [3,2,4], target = 6', output: '[1, 2]' }
    ],
    points: 25
  },

  // 4. DBMS (Database Management Systems)
  {
    id: 'q_dbms_1',
    category: 'mcq',
    topic: 'DBMS',
    question: 'Which ACID property ensures that all transaction modifications are preserved permanently even in the event of an unexpected system power loss or crash?',
    options: [
      'Durability (Write-Ahead Logging / WAL Flush)',
      'Atomicity (All or Nothing)',
      'Isolation (Snapshot Read Consistency)',
      'Consistency (Foreign Key Constraints)'
    ],
    correctAnswer: 0,
    points: 15
  },
  {
    id: 'q_dbms_2',
    category: 'mcq',
    topic: 'DBMS',
    question: 'When is a B-Tree index on a SQL table LEAST effective at accelerating query execution?',
    options: [
      'Queries filtering on low-cardinality columns (e.g. Boolean boolean_flag) with full table scans',
      'Filtering queries on high-cardinality primary keys',
      'Range scans using BETWEEN or inequality operators',
      'Sorting queries using ORDER BY indexed_column ASC'
    ],
    correctAnswer: 0,
    points: 15
  },

  // 5. OS (Operating Systems)
  {
    id: 'q_os_1',
    category: 'technical',
    topic: 'OS',
    question: 'Which four conditions MUST simultaneously hold for a deadlock to occur in an operating system?',
    options: [
      'Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait',
      'Paging, Segmentation, Swapping, Thrashing',
      'First-Come First-Served, Round Robin, Priority Scheduling, Shortest Job First',
      'Kernel Panic, Core Dump, Page Fault, Stack Overflow'
    ],
    correctAnswer: 0,
    points: 15
  },
  {
    id: 'q_os_2',
    category: 'technical',
    topic: 'OS',
    question: 'What is the root cause of "thrashing" in a virtual memory system with demand paging?',
    options: [
      'The system spends more CPU time swapping pages in and out of disk than executing useful user process instructions',
      'Multiple threads write to the same register simultaneously',
      'The CPU clock speed exceeds the system bus bus-width',
      'A process performs infinite recursion on the kernel stack'
    ],
    correctAnswer: 0,
    points: 15
  },

  // 6. CN (Computer Networks)
  {
    id: 'q_cn_1',
    category: 'technical',
    topic: 'CN',
    question: 'During a standard TCP 3-Way Handshake connection establishment, what is the exact packet exchange sequence between client and server?',
    options: [
      'Client: SYN → Server: SYN-ACK → Client: ACK',
      'Client: ACK → Server: SYN → Client: FIN',
      'Client: PING → Server: PONG → Client: HELLO',
      'Client: RST → Server: SYN → Client: RST-ACK'
    ],
    correctAnswer: 0,
    points: 15
  },
  {
    id: 'q_cn_2',
    category: 'technical',
    topic: 'CN',
    question: 'What major protocol advantage does HTTP/3 (QUIC over UDP) offer over HTTP/2 (TCP)?',
    options: [
      'Eliminates Head-of-Line (HoL) blocking on packet loss across independent multiplexed streams',
      'Disables TLS encryption to decrease roundtrip latency',
      'Forces all web traffic to use IPv4 only',
      'Increases packet payload header size by 400%'
    ],
    correctAnswer: 0,
    points: 15
  },

  // 7. Web Development
  {
    id: 'q_web_1',
    category: 'technical',
    topic: 'Web Development',
    question: 'Which HTTP status code is most appropriate when a client request violates a business validation rule (e.g. attempting to book an already occupied appointment slot)?',
    options: [
      '400 Bad Request or 422 Unprocessable Entity',
      '200 OK with error payload',
      '404 Not Found',
      '500 Internal Server Error'
    ],
    correctAnswer: 0,
    points: 15
  },
  {
    id: 'q_web_2',
    category: 'technical',
    topic: 'Web Development',
    question: 'In modern React (React 18/19), why is updating state directly via mutation (e.g. `state.items.push(x)`) considered an anti-pattern?',
    options: [
      'It breaks reference equality checks, preventing React reconciliation from detecting state changes and re-rendering UI components',
      'It causes immediate browser memory segmentation faults',
      'It converts JavaScript objects to XML format',
      'It automatically disables browser CSS styles'
    ],
    correctAnswer: 0,
    points: 15
  },

  // 8. AI/ML
  {
    id: 'q_ai_1',
    category: 'technical',
    topic: 'AI/ML',
    question: 'In Large Language Models and Generative AI, what is the primary role of Temperature parameter during text generation decoding?',
    options: [
      'Controls sampling randomness: lower values make output more deterministic and conservative; higher values increase variety and exploration',
      'Controls the GPU core clock speed during forward pass inference',
      'Sets the maximum context window memory allocation in Megabytes',
      'Determines the quantization bit precision (e.g. FP16 vs INT4)'
    ],
    correctAnswer: 0,
    points: 15
  },
  {
    id: 'q_ai_2',
    category: 'technical',
    topic: 'AI/ML',
    question: 'What is the purpose of Retrieval-Augmented Generation (RAG) in enterprise AI architectures?',
    options: [
      'Grounds LLM responses with proprietary, up-to-date vector database context to reduce hallucinations without requiring fine-tuning',
      'Replaces deep neural networks with simple decision trees',
      'Compresses audio spectrograms for low-latency transmission',
      'Translates Python code directly to CUDA C++ binaries'
    ],
    correctAnswer: 0,
    points: 15
  },

  // 9. Data Science
  {
    id: 'q_ds_1',
    category: 'technical',
    topic: 'Data Science',
    question: 'When evaluating a machine learning classification model on an imbalanced dataset (e.g. 99% non-fraud, 1% fraud), why is raw Accuracy a misleading metric?',
    options: [
      'A trivial model predicting the majority class for all rows achieves 99% accuracy while detecting 0% of true fraud cases (precision/recall/F1-score is required)',
      'Accuracy cannot be calculated on numerical arrays in Python',
      'Accuracy is always equal to 1.0 on binary datasets',
      'Accuracy ignores the learning rate of the optimizer'
    ],
    correctAnswer: 0,
    points: 15
  },

  // 10. Cloud
  {
    id: 'q_cloud_1',
    category: 'technical',
    topic: 'Cloud',
    question: 'What is the primary benefit of multi-stage Docker builds when containerizing production backend applications?',
    options: [
      'Produces lightweight, secure final production images by excluding build tools, compiler dependencies, and dev files',
      'Allows the container to execute without an underlying Linux kernel',
      'Bypasses Kubernetes cluster ingress network security firewalls',
      'Automatically replicates container images to 50 cloud regions simultaneously'
    ],
    correctAnswer: 0,
    points: 15
  },

  // 11. Cybersecurity
  {
    id: 'q_sec_1',
    category: 'technical',
    topic: 'Cybersecurity',
    question: 'What is the most effective defense against Cross-Site Request Forgery (CSRF) attacks in browser-based web applications?',
    options: [
      'Using Anti-CSRF Synchronizer Tokens and configuring cookies with `SameSite=Lax` or `Strict`',
      'Enabling basic HTTP authentication over plain unencrypted TCP',
      'Minifying client-side JavaScript bundle files',
      'Disabling browser caching on all static images'
    ],
    correctAnswer: 0,
    points: 15
  },

  // 12. Aptitude
  {
    id: 'q_apt_1',
    category: 'logical',
    topic: 'Aptitude',
    question: 'A distributed service receives 20,000 requests/sec. Each request requires 50ms (0.05s) of CPU processing. If each container can sustain 20 concurrent threads without thrashing, what is the minimum number of container instances needed to handle the peak load with zero queuing?',
    options: [
      '50 containers (Little’s Law: 20,000 × 0.05 = 1,000 active threads ÷ 20 threads/instance = 50 instances)',
      '25 containers',
      '100 containers',
      '200 containers'
    ],
    correctAnswer: 0,
    scenarioContext: 'Little’s Law: Concurrent Active Requests L = λ (Arrival rate) × W (Latency) = 20,000 × 0.05 = 1,000 concurrent threads. 1,000 threads / 20 threads per instance = 50 instances.',
    points: 15
  },

  // 13. Soft Skills
  {
    id: 'q_soft_1',
    category: 'communication',
    topic: 'Soft Skills',
    question: 'During a sprint planning meeting, a product manager insists on shipping an un-tested authentication feature within 48 hours to beat a competitor. How would you professionally navigate this?',
    options: [
      'Acknowledge the business urgency, present the specific security & data breach risks with evidence, and propose a phased rollback strategy (e.g. Feature Flagged Beta to 5% audited users) while running automated integration tests.',
      'Agree immediately to avoid conflict and push to production directly without tests.',
      'Refuse angrily and publicly accuse management of recklessness.',
      'Silently disable tests so the build pipeline succeeds.'
    ],
    correctAnswer: 0,
    points: 15
  }
];

SAMPLE_ASSESSMENT_QUESTIONS.push(
  {
    id: 'q_py_3',
    category: 'technical',
    topic: 'Python',
    question: 'Why is a generator expression often preferable to building a large list in memory?',
    options: [
      'It produces values lazily, reducing peak memory usage for one-pass processing',
      'It automatically runs code on multiple CPU cores',
      'It permanently stores every value in a faster cache',
      'It converts Python objects into database rows'
    ],
    correctAnswer: 0,
    points: 15
  },
  {
    id: 'q_java_3',
    category: 'technical',
    topic: 'Java',
    question: 'Which Java feature is designed to guarantee that a shared variable read sees the latest write from another thread?',
    options: [
      'The volatile keyword, which provides visibility guarantees for that variable',
      'The final keyword on every local variable',
      'Method overloading at compile time',
      'A private constructor on the containing class'
    ],
    correctAnswer: 0,
    points: 15
  },
  {
    id: 'q_dsa_3',
    category: 'logical',
    topic: 'DSA',
    question: 'Which data structure is the best fit for breadth-first traversal of an unweighted graph?',
    options: [
      'A queue, because vertices are processed in increasing distance from the source',
      'A stack, because it always explores the shortest path first',
      'A sorted array, because edges must be ordered',
      'A hash set alone, because it stores traversal order'
    ],
    correctAnswer: 0,
    points: 15
  },
  {
    id: 'q_dbms_3',
    category: 'mcq',
    topic: 'DBMS',
    question: 'What does database normalization primarily help prevent?',
    options: [
      'Duplicate and inconsistent data caused by update, insert, and delete anomalies',
      'All network latency between an application and database',
      'The need for indexes on every table',
      'Every transaction deadlock regardless of query design'
    ],
    correctAnswer: 0,
    points: 15
  },
  {
    id: 'q_os_3',
    category: 'technical',
    topic: 'OS',
    question: 'What is the purpose of a context switch in a multitasking operating system?',
    options: [
      'To save one task state and restore another so the CPU can switch execution',
      'To permanently delete a process from the file system',
      'To increase RAM capacity without hardware changes',
      'To convert a user process into a database transaction'
    ],
    correctAnswer: 0,
    points: 15
  },
  {
    id: 'q_cn_3',
    category: 'technical',
    topic: 'CN',
    question: 'What is the primary purpose of DNS in a web request?',
    options: [
      'To translate a human-readable domain name into an IP address',
      'To encrypt HTTP response bodies using a browser certificate',
      'To guarantee that packets arrive in order over UDP',
      'To store the complete HTML document for a website'
    ],
    correctAnswer: 0,
    points: 15
  },
  {
    id: 'q_web_3',
    category: 'coding',
    topic: 'Web Development',
    question: 'When a fetch request returns a non-2xx response, what should robust client code do before parsing success data?',
    options: [
      'Check response.ok or response.status and route the request to an error state',
      'Assume JSON parsing will always throw automatically',
      'Reload the page repeatedly until the server responds',
      'Ignore the response and update the UI as successful'
    ],
    correctAnswer: 0,
    points: 15
  },
  {
    id: 'q_ai_3',
    category: 'technical',
    topic: 'AI/ML',
    question: 'Why should an AI application validate tool-call arguments before executing them?',
    options: [
      'To prevent malformed or unsafe model-generated values from reaching external systems',
      'To make the model context window unlimited',
      'To remove the need for authentication on the tool',
      'To guarantee that every model response is creative'
    ],
    correctAnswer: 0,
    points: 15
  },
  {
    id: 'q_ds_2',
    category: 'technical',
    topic: 'Data Science',
    question: 'What does a p-value help an analyst evaluate in a hypothesis test?',
    options: [
      'How compatible the observed data is with the null hypothesis under the chosen test assumptions',
      'The percentage of missing values in a dataframe',
      'The exact probability that the null hypothesis is true',
      'The number of rows required for every machine learning model'
    ],
    correctAnswer: 0,
    points: 15
  },
  {
    id: 'q_cloud_2',
    category: 'technical',
    topic: 'Cloud',
    question: 'What is the main purpose of a readiness probe in a Kubernetes deployment?',
    options: [
      'To prevent traffic from reaching a container until the application is ready',
      'To permanently restart every container after one request',
      'To store cloud credentials inside the image',
      'To replace all application-level monitoring'
    ],
    correctAnswer: 0,
    points: 15
  },
  {
    id: 'q_sec_2',
    category: 'technical',
    topic: 'Cybersecurity',
    question: 'What is the safest way to store user passwords in an application database?',
    options: [
      'Use a slow password-hashing algorithm such as Argon2 or bcrypt with a unique salt',
      'Encrypt every password with one key stored in the same database',
      'Store passwords as plain text so support staff can recover them',
      'Encode passwords with Base64 before saving them'
    ],
    correctAnswer: 0,
    points: 15
  },
  {
    id: 'q_apt_2',
    category: 'logical',
    topic: 'Aptitude',
    question: 'An API handles 240 requests per second and each request takes 250ms on average. Approximately how many requests are concurrently in service?',
    options: [
      '60 concurrent requests, using L = arrival rate × latency',
      '15 concurrent requests',
      '240 concurrent requests exactly',
      '960 concurrent requests'
    ],
    correctAnswer: 0,
    scenarioContext: 'Little’s Law gives L = 240 requests/second × 0.25 seconds = 60 concurrent requests.',
    points: 15
  },
  {
    id: 'q_soft_2',
    category: 'communication',
    topic: 'Soft Skills',
    question: 'A teammate submits code that fails a critical test shortly before release. What is the strongest professional response?',
    options: [
      'Share the failing evidence privately, focus on the risk, offer to pair on a fix, and agree on a revised release decision',
      'Merge it silently and let production reveal the issue',
      'Blame the teammate in the team channel before investigating',
      'Delete the failing test so the pipeline turns green'
    ],
    correctAnswer: 0,
    points: 15
  }
);

SAMPLE_ASSESSMENT_QUESTIONS.push(
  {
    id: 'q_py_4', category: 'technical', topic: 'Python',
    question: 'What is the benefit of using a context manager with a file or database connection?',
    options: ['It guarantees cleanup such as closing the resource when the block exits', 'It makes every operation asynchronous', 'It disables exceptions inside the block', 'It stores the resource permanently in memory'],
    correctAnswer: 0, points: 15
  },
  {
    id: 'q_java_4', category: 'technical', topic: 'Java',
    question: 'Why should equals() and hashCode() be implemented consistently for objects used as HashMap keys?',
    options: ['Equal objects must produce the same hash so lookups find the correct bucket', 'It makes all objects immutable', 'It prevents the JVM from using garbage collection', 'It converts keys into sorted arrays'],
    correctAnswer: 0, points: 15
  },
  {
    id: 'q_dsa_4', category: 'logical', topic: 'DSA',
    question: 'Which approach is appropriate for finding the shortest path in a graph with non-negative edge weights?',
    options: ['Dijkstra’s algorithm with a priority queue', 'Depth-first search without tracking distances', 'A binary search on the vertex labels', 'Randomly selecting the next edge'],
    correctAnswer: 0, points: 15
  },
  {
    id: 'q_dbms_4', category: 'mcq', topic: 'DBMS',
    question: 'What problem does a database transaction solve when transferring money between two accounts?',
    options: ['It keeps the debit and credit atomic so a partial transfer is not committed', 'It guarantees unlimited storage capacity', 'It removes the need for authentication', 'It makes every query execute in constant time'],
    correctAnswer: 0, points: 15
  },
  {
    id: 'q_os_4', category: 'technical', topic: 'OS',
    question: 'What is the main advantage of virtual memory?',
    options: ['It gives processes an isolated address space and can extend usable memory with disk backing', 'It makes disk storage faster than CPU cache', 'It removes all page faults', 'It allows a process to access every other process’s memory'],
    correctAnswer: 0, points: 15
  },
  {
    id: 'q_cn_4', category: 'technical', topic: 'CN',
    question: 'What does TLS provide when a browser connects to an HTTPS server?',
    options: ['Encrypted transport, server authentication, and message integrity', 'Faster DNS resolution without any certificates', 'A guarantee that the server never has downtime', 'Compression of every database table'],
    correctAnswer: 0, points: 15
  },
  {
    id: 'q_web_4', category: 'technical', topic: 'Web Development',
    question: 'Which practice improves accessibility for an interactive icon-only button?',
    options: ['Provide an accessible name with aria-label or visible text and a keyboard-focusable button element', 'Use a div with only a click handler', 'Hide the control from screen readers', 'Remove focus styles to make the design cleaner'],
    correctAnswer: 0, points: 15
  },
  {
    id: 'q_ai_4', category: 'technical', topic: 'AI/ML',
    question: 'What is an embedding commonly used for in an AI application?',
    options: ['Representing text or other data as vectors that support semantic similarity search', 'Encrypting an API key in browser storage', 'Guaranteeing that a model cannot hallucinate', 'Replacing all relational database constraints'],
    correctAnswer: 0, points: 15
  },
  {
    id: 'q_ds_3', category: 'technical', topic: 'Data Science',
    question: 'What is the purpose of a train, validation, and test split?',
    options: ['Train parameters, tune decisions, and estimate final generalization on unseen data', 'Create three copies of the same rows for a larger sample', 'Remove the need to define a target variable', 'Guarantee that a model is unbiased'],
    correctAnswer: 0, points: 15
  },
  {
    id: 'q_cloud_3', category: 'technical', topic: 'Cloud',
    question: 'What does horizontal scaling mean for a stateless web service?',
    options: ['Adding more service instances behind a load balancer', 'Increasing the font size of the service dashboard', 'Adding more CPU to one existing process only', 'Moving all logs into the application image'],
    correctAnswer: 0, points: 15
  },
  {
    id: 'q_sec_3', category: 'technical', topic: 'Cybersecurity',
    question: 'Why is least privilege important for application service accounts?',
    options: ['A compromised account has the smallest practical set of actions and resources available', 'It allows every service to share one administrator password', 'It prevents the need for audit logs', 'It makes authorization checks unnecessary'],
    correctAnswer: 0, points: 15
  },
  {
    id: 'q_apt_3', category: 'logical', topic: 'Aptitude',
    question: 'A product priced at 800 is discounted by 15%. What is the sale price?',
    options: ['680', '685', '700', '720'],
    correctAnswer: 0, points: 15
  },
  {
    id: 'q_soft_3', category: 'communication', topic: 'Soft Skills',
    question: 'What makes feedback most useful during a code review?',
    options: ['Describe the observable issue, explain its impact, and suggest a concrete improvement respectfully', 'Use vague criticism so the author guesses the fix', 'Comment only after deployment', 'Focus on the author instead of the code'],
    correctAnswer: 0, points: 15
  }
);

// --------------------------------------------------------------------------
// CAREER RECOMMENDATIONS (Salaries in INR ₹)
// --------------------------------------------------------------------------
export const SAMPLE_CAREERS: CareerRecommendation[] = [
  {
    id: 'car_fullstack',
    title: 'Full Stack Engineer',
    field: 'Software Engineering',
    matchPercentage: 92,
    reason: 'Strong foundation in Python/JavaScript, REST APIs, and database indexing from your assessment, with fast problem-solving velocity.',
    currentSkills: ['Python', 'JavaScript/TypeScript', 'REST APIs', 'SQL', 'Git & CI/CD'],
    missingSkills: ['Redis Caching', 'Docker Containerization', 'GraphQL', 'Microservices Architecture'],
    averageSalary: '₹9,00,000 - ₹18,00,000 / yr',
    growthOutlook: '+22% (High Demand)',
    recommendedLearningPath: [
      {
        stage: 'Foundation',
        title: 'Modern Web Architecture & HTTP/3',
        description: 'Deep dive into asynchronous runtimes, browser DOM lifecycle, and secure session management.',
        skills: ['TypeScript', 'Vite & React 19', 'Express / FastAPI'],
        milestones: ['Build end-to-end type-safe API client', 'Implement OAuth2 token authentication'],
        recommendedCourseIds: ['crs_fullstack_react']
      },
      {
        stage: 'Core Skills',
        title: 'Database Design & Distributed Caching',
        description: 'PostgreSQL indexing, transaction isolation levels, connection pooling, and Redis cache-aside.',
        skills: ['PostgreSQL', 'Prisma / Drizzle', 'Redis', 'Connection Pooling'],
        milestones: ['Design normalized schema with indexes', 'Cache hot API queries with TTL strategies'],
        recommendedCourseIds: ['crs_fullstack_node']
      },
      {
        stage: 'Projects',
        title: 'Production-Grade SaaS Application',
        description: 'Create a multi-tenant platform with automated background workers, file storage, and webhook pipelines.',
        skills: ['Docker', 'Payments Integration', 'WebSockets', 'Queue Workers'],
        milestones: ['Deploy containerized app on Cloud Run', 'Implement webhook idempotency'],
        recommendedCourseIds: ['crs_fullstack_react']
      },
      {
        stage: 'Interview Preparation',
        title: 'System Design & High-Throughput Scenarios',
        description: 'Master rate-limiting, load-balancer routing, CDN edge caching, and live coding rounds.',
        skills: ['System Design', 'Concurrency', 'Code Arena Hard'],
        milestones: ['Pass mock full-stack AI interview with 85%+ score', 'Solve 50+ medium DSA challenges'],
        recommendedCourseIds: ['crs_fullstack_node']
      },
      {
        stage: 'Internship Readiness',
        title: 'Real-World Production Simulation',
        description: 'Complete the NextGen Cloud Full Stack Developer simulation before submitting verified applications.',
        skills: ['Debugging', 'Code Review', 'Production Rollouts'],
        milestones: ['Score 90%+ in the TechCorp Internship Demo Simulation', 'Publish certified portfolio badge'],
        recommendedCourseIds: ['crs_fullstack_react']
      }
    ]
  },
  {
    id: 'car_ai_ml',
    title: 'AI/ML Solutions Engineer',
    field: 'Artificial Intelligence',
    matchPercentage: 86,
    reason: 'High score in computational logic and Python capabilities; ready to bridge LLM integrations with real-world product workflows.',
    currentSkills: ['Python', 'Data Wrangling', 'Mathematical Logic', 'Prompt Engineering'],
    missingSkills: ['PyTorch / TensorFlow', 'Vector Databases (pgvector)', 'RAG Pipelines', 'Model Fine-tuning & Quantization'],
    averageSalary: '₹12,00,000 - ₹24,00,000 / yr',
    growthOutlook: '+38% (Surging)',
    recommendedLearningPath: [
      {
        stage: 'Foundation',
        title: 'Linear Algebra, Probability & NumPy/Pandas',
        description: 'Matrix decompositions, gradient descent optimization, and tensor operations.',
        skills: ['NumPy', 'Pandas', 'Vector Mathematics'],
        milestones: ['Implement linear regression from scratch', 'Wrangle 1M row dataset'],
        recommendedCourseIds: ['crs_aiml_foundations']
      },
      {
        stage: 'Core Skills',
        title: 'Generative AI & Agentic Systems',
        description: 'Gemini SDK, Function Calling, Embeddings, and Graph RAG architectures.',
        skills: ['Gemini 3 SDK', 'Embeddings', 'LangChain / LlamaIndex', 'ChromaDB'],
        milestones: ['Build autonomous multi-step research agent with search grounding'],
        recommendedCourseIds: ['crs_aiml_genai']
      },
      {
        stage: 'Projects',
        title: 'End-to-End Enterprise AI Platform',
        description: 'Build an automated code analysis engine with continuous feedback loops.',
        skills: ['FastAPI', 'pgvector', 'Docker', 'Evaluation Metrics'],
        milestones: ['Publish live AI code auditor demo'],
        recommendedCourseIds: ['crs_aiml_genai']
      },
      {
        stage: 'Interview Preparation',
        title: 'ML System Design & Deep Learning Questions',
        description: 'Prepare for transformer architecture questions, latency optimization, and streaming tokens.',
        skills: ['ML Systems', 'Tokenomics', 'Evaluation benchmarks'],
        milestones: ['Ace the AI/ML Simulation track'],
        recommendedCourseIds: ['crs_aiml_genai']
      },
      {
        stage: 'Internship Readiness',
        title: 'Apex Intelligence AI Simulation',
        description: 'Execute preprocessing, prompt validation, and model hallucination benchmark simulation.',
        skills: ['Prompt Auditing', 'Latency Tuning'],
        milestones: ['Earn Apex AI Simulation Completion Certificate'],
        recommendedCourseIds: ['crs_aiml_genai']
      }
    ]
  },
  {
    id: 'car_data_analyst',
    title: 'Data Analyst & Analytics Engineer',
    field: 'Data & Analytics',
    matchPercentage: 81,
    reason: 'Proficient in SQL aggregations and relational query logic with strong business reasoning intuition.',
    currentSkills: ['SQL', 'Data Querying', 'Logical Reasoning', 'Excel / Sheets'],
    missingSkills: ['Tableau / PowerBI', 'dbt (data build tool)', 'Data Warehouse (BigQuery/Snowflake)', 'Statistical Hypothesis Testing'],
    averageSalary: '₹7,50,000 - ₹15,00,000 / yr',
    growthOutlook: '+18% (Steady Growth)',
    recommendedLearningPath: [
      {
        stage: 'Foundation',
        title: 'Advanced SQL & Window Functions',
        description: 'Partitioning, self-joins, CTEs, rollups, and query performance tuning.',
        skills: ['Advanced SQL', 'PostgreSQL', 'Aggregation'],
        milestones: ['Solve 20 complex multi-table analytical SQL challenges'],
        recommendedCourseIds: ['crs_data_sql']
      },
      {
        stage: 'Core Skills',
        title: 'Data Modeling & Metric Pipelines',
        description: 'Star schemas, snowflake schemas, dimensional modeling, and dbt transformations.',
        skills: ['dbt', 'BigQuery', 'Data Modeling'],
        milestones: ['Create automated recurring cohort retention pipeline'],
        recommendedCourseIds: ['crs_data_pipelines']
      },
      {
        stage: 'Projects',
        title: 'Executive Financial & Product Insights Dashboard',
        description: 'Turn messy raw event logs into actionable C-suite dashboards with interactive slicing.',
        skills: ['Python Matplotlib/Seaborn', 'Executive Storytelling'],
        milestones: ['Present data report to AI Evaluation panel'],
        recommendedCourseIds: ['crs_data_sql']
      },
      {
        stage: 'Interview Preparation',
        title: 'Product Sense & Live SQL Whiteboard',
        description: 'Practice real metrics estimation (LTV, CAC, Retention, Churn) and live SQL tests.',
        skills: ['Product Metrics', 'A/B Testing'],
        milestones: ['Complete Data Analyst AI Interview with 90%+'],
        recommendedCourseIds: ['crs_data_sql']
      },
      {
        stage: 'Internship Readiness',
        title: 'FinMetrics Data Cleaning & Viz Simulation',
        description: 'Clean corrupt transaction data, write analytical queries, and generate automated insights report.',
        skills: ['Data Hygiene', 'Report Automation'],
        milestones: ['Receive FinMetrics Verified Simulation Certificate'],
        recommendedCourseIds: ['crs_data_pipelines']
      }
    ]
  }
];

// --------------------------------------------------------------------------
// INTERNSHIPS (ALL STIPENDS IN ₹ INR)
// --------------------------------------------------------------------------
export const SAMPLE_INTERNSHIPS: Internship[] = [
  {
    id: 'int_01',
    title: 'Full Stack Software Engineer Intern',
    company: 'CloudScale Technologies',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    location: 'Bengaluru / Remote',
    type: 'Remote',
    stipend: '₹45,000 / month',
    duration: '3 Months (Summer 2026)',
    role: 'Full Stack Developer',
    isPaid: true,
    perks: [
      '₹45,000 / month Guaranteed Stipend',
      'Pre-Placement Offer (PPO) for Top Performers',
      '1-on-1 Staff Engineer Mentorship',
      'Verified Internship Certificate & Recommendation'
    ],
    jobDescription: 'Join our core platform engineering team building next-generation distributed SaaS infrastructure. You will work on real customer-facing React components, optimize PostgreSQL microservices, implement secure JWT/OAuth flows, and build automated CI/CD integration tests.',
    requiredSkills: ['React', 'TypeScript', 'Node.js/Express', 'PostgreSQL', 'RESTful APIs', 'Git'],
    responsibilities: [
      'Develop modular client-side components with high accessibility and test coverage',
      'Optimize database queries and resolve API N+1 latency bottlenecks',
      'Collaborate with product designers to ship responsive, pixel-perfect user flows',
      'Participate in daily standups, code reviews, and architectural RFC discussions'
    ],
    technologies: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Vite'],
    applyUrl: 'https://careers.google.com/jobs',
    deadline: 'April 30, 2026',
    simulationAvailable: true,
    featured: true
  },
  {
    id: 'int_02',
    title: 'AI & Data Analytics Intern',
    company: 'FinMetrics Insights',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80',
    location: 'Mumbai / Hybrid',
    type: 'Hybrid',
    stipend: '₹50,000 / month',
    duration: '6 Months',
    role: 'Data Analyst',
    isPaid: true,
    perks: [
      '₹50,000 / month Stipend (Paid)',
      'Direct interaction with Quantitative Leads',
      'Flexible Hybrid Schedule (2 days office / 3 days remote)',
      'Verified Simulation Certificate'
    ],
    jobDescription: 'Work closely with our quantitative research team to clean millions of streaming market ticks, detect anomalies using statistical models, and build automated visualization dashboards for Fortune 500 financial clients.',
    requiredSkills: ['Python', 'SQL', 'Pandas', 'Data Cleaning', 'Data Visualization', 'Statistical Analysis'],
    responsibilities: [
      'Cleanse corrupt transactional telemetry data and reconcile schema mismatches',
      'Write optimized SQL aggregation queries using window functions and CTEs',
      'Generate automated statistical performance reports with actionable insights',
      'Present findings in weekly stakeholder briefing demos'
    ],
    technologies: ['Python', 'PostgreSQL', 'Pandas', 'Plotly / D3', 'Jupyter'],
    applyUrl: 'https://careers.bloomberg.com',
    deadline: 'May 15, 2026',
    simulationAvailable: true,
    featured: true
  },
  {
    id: 'int_03',
    title: 'Machine Learning & GenAI Intern',
    company: 'Apex Intelligence Labs',
    companyLogo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&auto=format&fit=crop&q=80',
    location: 'Hyderabad / Remote',
    type: 'Remote',
    stipend: '₹55,000 / month',
    duration: '3 Months',
    role: 'AI/ML Engineer',
    isPaid: true,
    perks: [
      '₹55,000 / month Paid Stipend',
      'Access to state-of-the-art GPU clusters & Gemini 3 API credits',
      'Publish research case studies & co-author whitepapers',
      'Full PPO Fast-Track review'
    ],
    jobDescription: 'Develop intelligent agentic pipelines using foundation models, optimize prompt grounding with vector databases, build evaluation harnesses, and deploy low-latency inference endpoints.',
    requiredSkills: ['Python', 'Gemini / OpenAI API', 'Vector DBs (pgvector/Pinecone)', 'Prompt Engineering', 'FastAPI'],
    responsibilities: [
      'Construct automated Retrieval-Augmented Generation (RAG) pipelines',
      'Benchmark hallucination rates and tune system instructions for enterprise clients',
      'Deploy containerized AI service APIs with streaming Server-Sent Events',
      'Document model behavior, latency trade-offs, and token cost curves'
    ],
    technologies: ['Gemini 3.7', 'Python', 'FastAPI', 'PyTorch', 'Docker'],
    applyUrl: 'https://openai.com/careers',
    deadline: 'May 30, 2026',
    simulationAvailable: true,
    featured: true
  },
  {
    id: 'int_04',
    title: 'Cloud DevOps & Infrastructure Intern',
    company: 'HyperCloud Systems',
    companyLogo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&auto=format&fit=crop&q=80',
    location: 'Pune / Remote',
    type: 'Remote',
    stipend: '₹40,000 / month',
    duration: '4 Months',
    role: 'Cloud Engineer',
    isPaid: true,
    perks: [
      '₹40,000 / month Paid Stipend',
      'Hands-on Kubernetes cluster management experience',
      'Cloud certification fee reimbursement',
      'Verified Internship Certificate'
    ],
    jobDescription: 'Gain hands-on experience orchestrating Kubernetes clusters, writing Terraform infrastructure-as-code, and configuring automated GitHub Actions deployment pipelines.',
    requiredSkills: ['Linux / Bash', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Cloud Architecture'],
    responsibilities: [
      'Containerize backend services and optimize Docker image build layers',
      'Build automated health-checking and Prometheus monitoring alerts',
      'Manage cloud secrets and enforce least-privilege IAM policies'
    ],
    technologies: ['Kubernetes', 'Docker', 'Terraform', 'GitHub Actions', 'GCP / AWS'],
    applyUrl: 'https://cloud.google.com/careers',
    deadline: 'June 10, 2026',
    simulationAvailable: true,
    featured: false
  },
  {
    id: 'int_05',
    title: 'Cybersecurity & Application Defense Intern',
    company: 'ShieldGrid Security Labs',
    companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=80',
    location: 'Gurugram / Hybrid',
    type: 'Hybrid',
    stipend: '₹48,000 / month',
    duration: '4 Months',
    role: 'Cybersecurity',
    isPaid: true,
    perks: [
      '₹48,000 / month Paid Stipend',
      'Live vulnerability bounty simulation access',
      '1-on-1 Red Team Lead mentoring',
      'Verified Security Certification'
    ],
    jobDescription: 'Audit web applications against OWASP Top 10 vulnerabilities, configure Web Application Firewalls (WAF), perform automated penetration scans, and implement OAuth/JWT cryptographic validations.',
    requiredSkills: ['OWASP Top 10', 'Penetration Testing', 'Network Security', 'Cryptography', 'Python/Bash'],
    responsibilities: [
      'Conduct automated vulnerability scans and verify false positives',
      'Implement secure header policies (CSP, HSTS, CORS) across internal endpoints',
      'Participate in simulated red team / blue team security drills'
    ],
    technologies: ['Burp Suite', 'Wireshark', 'Python', 'Docker', 'OAuth 2.0'],
    applyUrl: 'https://www.cisa.gov/careers',
    deadline: 'June 20, 2026',
    simulationAvailable: true,
    featured: false
  }
];

// --------------------------------------------------------------------------
// SIMULATION LAB PROJECTS
// --------------------------------------------------------------------------
export const SAMPLE_SIMULATIONS: Record<string, InternshipSimulation> = {
  'int_01': {
    id: 'sim_01',
    internshipId: 'int_01',
    title: 'CloudScale Full Stack Sprint Simulation',
    company: 'CloudScale Technologies',
    role: 'Full Stack Developer',
    scenario: 'You are on Day 1 of your internship at CloudScale. Senior Tech Lead Sarah assigned you a critical task: A high-traffic user profile service has an intermittent API crash, unoptimized SQL joins, and an incomplete frontend notification badge. Walk through realistic engineering tickets to fix the bugs and push to staging!',
    skillsTested: ['React State Management', 'API Error Handling', 'SQL Query Optimization', 'Unit Testing'],
    tasks: [
      {
        id: 'task_1',
        stepNumber: 1,
        title: 'Task 1: Debug & Implement Resilient API Endpoint',
        description: 'The `/api/users/:id/stats` endpoint currently crashes when user activity records are null. Refactor the backend handler to return sanitized stats with safe default fallbacks and correct HTTP status codes.',
        instructions: [
          'Inspect the provided Express route handler code',
          'Add parameter validation for userId',
          'Safely handle nullable metric columns with fallback defaults',
          'Return a structured JSON response `{ status: "success", data: { ... } }` with HTTP 200'
        ],
        language: 'TypeScript / Node.js',
        initialCode: `// Fix the buggy endpoint handler
import express from 'express';
const router = express.Router();

router.get('/api/users/:id/stats', async (req, res) => {
  const userId = req.params.id;
  
  // TODO: Fix crash on invalid id or null DB records
  try {
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Valid user ID is required' });
    }
    
    // Simulated DB lookup
    const userStats = {
      userId,
      completedTasks: 14,
      codingStreak: 6,
      accuracyRate: 94.5,
      lastActive: new Date().toISOString()
    };
    
    return res.status(200).json({
      status: 'success',
      data: userStats
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;`,
        expectedDeliverable: 'A clean, crash-proof Express route handler with defensive typing and proper status codes.',
        hints: [
          'Ensure error handling is wrapped in try/catch',
          'Validate input parameters before making database calls',
          'Return 400 for bad parameters and 404 if record is missing'
        ]
      },
      {
        id: 'task_2',
        stepNumber: 2,
        title: 'Task 2: Optimize SQL N+1 Query Bottleneck',
        description: 'The dashboard query currently loops through each user and makes 1 query per user to fetch badges, causing 500+ roundtrips. Rewrite the query using a single efficient SQL JOIN with JSON aggregation.',
        instructions: [
          'Rewrite the query into a single SQL statement',
          'Join `users` with `badges` on `users.id = badges.user_id`',
          'Use `json_agg` or `GROUP BY` to aggregate badge tags into an array',
          'Ensure indexed foreign keys are leveraged'
        ],
        language: 'SQL',
        initialCode: `-- Rewrite this unoptimized query into a single performant SQL JOIN
SELECT 
    u.id AS user_id,
    u.name,
    u.email,
    COALESCE(
        json_agg(
            json_build_object('id', b.id, 'title', b.title, 'icon', b.icon)
        ) FILTER (WHERE b.id IS NOT NULL),
        '[]'
    ) AS earned_badges
FROM profiles u
LEFT JOIN certificates b ON u.id = b.user_id
GROUP BY u.id, u.name, u.email
ORDER BY u.created_at DESC
LIMIT 50;`,
        expectedDeliverable: 'Single performant SQL query with aggregate json grouping and left join.',
        hints: [
          'Use LEFT JOIN so users without badges still appear in results',
          'Use COALESCE to prevent null badge arrays'
        ]
      },
      {
        id: 'task_3',
        stepNumber: 3,
        title: 'Task 3: Build Responsive Frontend Notification Banner',
        description: 'Implement a React notification badge component with auto-dismiss timers, clear dismiss button, and smooth motion animations.',
        instructions: [
          'Create a reusable AlertBanner component in React',
          'Include props for `type: "success" | "warning" | "error"`, `message: string`, and `onDismiss: () => void`',
          'Support automatic timeout closing after 5000ms'
        ],
        language: 'TypeScript / React',
        initialCode: `import React, { useEffect } from 'react';

interface AlertBannerProps {
  type: 'success' | 'warning' | 'error';
  message: string;
  onDismiss: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ type, message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const colorStyles = {
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    error: 'bg-rose-500/10 border-rose-500/30 text-rose-300'
  }[type];

  return (
    <div className={\`flex items-center justify-between p-4 rounded-xl border \${colorStyles} backdrop-blur-md\`}>
      <span className="font-medium text-sm">{message}</span>
      <button 
        onClick={onDismiss}
        className="px-2 py-1 text-xs rounded hover:bg-white/10 transition"
      >
        Dismiss
      </button>
    </div>
  );
};`,
        expectedDeliverable: 'Fully functioning React notification alert with cleanup timers.',
        hints: ['Remember to clean up `setTimeout` in the useEffect return handler.']
      }
    ]
  }
};

// --------------------------------------------------------------------------
// SEPARATE LEARNING MODULES: AI/ML, Full Stack, Data Analytics, Cloud, Cybersecurity
// --------------------------------------------------------------------------
export const LEARNING_MODULE_CATEGORIES = [
  'AI/ML',
  'Full Stack Development',
  'Data Analytics',
  'Cloud',
  'Cybersecurity'
] as const;

export const SAMPLE_COURSES: Course[] = [
  // 1. AI/ML MODULE
  {
    id: 'crs_aiml_genai',
    title: 'Generative AI & Autonomous Agent Systems',
    category: 'AI/ML',
    icon: 'BrainCircuit',
    description: 'Master foundation models, prompt engineering, embeddings, Function Calling, and Multi-Agent RAG architectures using the Gemini API.',
    level: 'Intermediate',
    duration: '4 Modules • 12 Lessons',
    modulesCount: 4,
    enrolledStudents: 2380,
    rating: 4.95,
    skillsCovered: ['Gemini 3 SDK', 'Embeddings', 'Function Calling', 'RAG Pipelines', 'Vector Databases'],
    lessons: [
      {
        id: 'les_ai_1',
        title: '1. Foundation LLMs, Temperature & Context Windows',
        duration: '15 min',
        contentMarkdown: `### Understanding Large Language Model Architectures
In modern production AI systems, controlling model hallucination and latency requires mastering decoding hyperparameters and context window allocation.

#### Key Principles:
1. **Temperature & Top-P**: Controls entropy of token sampling.
2. **Context Window Strategy**: Use selective sliding retrieval to avoid attention dilution.
3. **Structured JSON Output**: Enforce strict schema validation on model responses.`,
        codeExample: `import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: 'gemini-3.7-flash',
  contents: 'Extract user entity names and action items',
  config: { responseMimeType: 'application/json' }
});`,
        language: 'typescript',
        quiz: {
          question: 'What is the primary benefit of enforcing responseMimeType: "application/json" on LLM API calls?',
          options: [
            'It makes the model respond faster and guarantees valid parseable JSON objects without Markdown backticks',
            'It translates English to Python automatically',
            'It increases the GPU memory limit by 200%',
            'It disables model safety guardrails'
          ],
          correctIndex: 0,
          explanation: 'Structured schema enforcement eliminates regex parsing errors by constraining output tokens directly to valid JSON.'
        }
      },
      {
        id: 'les_ai_2',
        title: '2. Vector Embeddings & pgvector RAG Integration',
        duration: '20 min',
        contentMarkdown: `### Enterprise Retrieval-Augmented Generation (RAG)
RAG allows LLMs to query specialized internal documentation without retraining model weights.

#### Steps:
1. Generate embeddings with \`text-embedding-004\`.
2. Store vectors in PostgreSQL using the \`pgvector\` extension.
3. Perform cosine similarity searches to retrieve the top-K relevant chunks.`,
        codeExample: `-- Compute cosine similarity search using pgvector
SELECT id, document_title, chunk_text, 1 - (embedding <=> query_vector) AS cosine_similarity
FROM knowledge_chunks
WHERE 1 - (embedding <=> query_vector) > 0.78
ORDER BY embedding <=> query_vector
LIMIT 5;`,
        language: 'sql'
      }
    ]
  },
  {
    id: 'crs_aiml_foundations',
    title: 'Machine Learning & Neural Network Foundations',
    category: 'AI/ML',
    icon: 'Sparkles',
    description: 'Understand loss functions, gradient descent optimization, PyTorch tensors, and supervised learning classification algorithms.',
    level: 'Beginner',
    duration: '3 Modules • 9 Lessons',
    modulesCount: 3,
    enrolledStudents: 1840,
    rating: 4.88,
    skillsCovered: ['Python', 'NumPy', 'PyTorch', 'Gradient Descent', 'Model Evaluation'],
    lessons: [
      {
        id: 'les_aiml_f1',
        title: '1. Gradient Descent & Backpropagation Mathematics',
        duration: '18 min',
        contentMarkdown: `### Optimization in Deep Learning
Gradient descent iteratively adjusts weight parameters in the direction of steepest loss reduction.`,
        codeExample: `import numpy as np

# Simple gradient descent step
def gradient_step(weights, gradients, learning_rate=0.01):
    return weights - (learning_rate * gradients)`,
        language: 'python'
      }
    ]
  },

  // 2. FULL STACK DEVELOPMENT MODULE
  {
    id: 'crs_fullstack_react',
    title: 'Modern Full Stack: React 19 & TypeScript Architecture',
    category: 'Full Stack Development',
    icon: 'Layers',
    description: 'Build enterprise-grade single page applications with React 19, TypeScript, state normalization, Tailwind CSS, and resilient API hooks.',
    level: 'Intermediate',
    duration: '6 Modules • 18 Lessons',
    modulesCount: 6,
    enrolledStudents: 3120,
    rating: 4.96,
    skillsCovered: ['React 19', 'TypeScript', 'Tailwind CSS', 'State Management', 'REST APIs'],
    lessons: [
      {
        id: 'les_fs_1',
        title: '1. React 19 Hooks, Immutability & Safe Lifecycles',
        duration: '20 min',
        contentMarkdown: `### Enterprise React Component Design
Centralize interfaces in \`types.ts\`, avoid direct mutations, and handle asynchronous loading and error states cleanly.`,
        codeExample: `interface UserState {
  data: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export function useUserProfile(userId: string): UserState {
  // Safe hook implementation
  const [state, setState] = useState<UserState>({ data: null, isLoading: true, error: null });
  // ...
  return state;
}`,
        language: 'typescript'
      }
    ]
  },
  {
    id: 'crs_fullstack_node',
    title: 'Node.js & Express REST API Microservices',
    category: 'Full Stack Development',
    icon: 'Code2',
    description: 'Design robust backend servers with Express, input validation, JWT auth, connection pooling, and error middleware.',
    level: 'Intermediate',
    duration: '4 Modules • 12 Lessons',
    modulesCount: 4,
    enrolledStudents: 2450,
    rating: 4.91,
    skillsCovered: ['Node.js', 'Express', 'JWT Authentication', 'PostgreSQL', 'Middleware'],
    lessons: [
      {
        id: 'les_fs_n1',
        title: '1. Production Express Controller & Middleware Error Handling',
        duration: '15 min',
        contentMarkdown: `### Robust Express Controller Architecture
Controllers must validate client input, catch promise rejections, and return structured status codes.`,
        codeExample: `app.post('/api/records', async (req, res, next) => {
  try {
    const { title, payload } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const record = await db.insertRecord({ title, payload });
    return res.status(201).json({ status: 'created', record });
  } catch (err) {
    next(err);
  }
});`,
        language: 'typescript'
      }
    ]
  },

  // 3. DATA ANALYTICS MODULE
  {
    id: 'crs_data_sql',
    title: 'Advanced SQL Analytics & Window Functions',
    category: 'Data Analytics',
    icon: 'Database',
    description: 'Master analytical SQL with window partitioning (ROW_NUMBER, RANK, LAG/LEAD), recursive CTEs, and query execution plan tuning.',
    level: 'Advanced',
    duration: '5 Modules • 15 Lessons',
    modulesCount: 5,
    enrolledStudents: 2890,
    rating: 4.93,
    skillsCovered: ['Advanced SQL', 'PostgreSQL', 'Window Functions', 'Query Optimization', 'ETL'],
    lessons: [
      {
        id: 'les_da_1',
        title: '1. Window Partitioning & Running Totals',
        duration: '22 min',
        contentMarkdown: `### Window Functions vs GROUP BY
Window functions calculate aggregate metrics across rows without collapsing individual records.`,
        codeExample: `SELECT 
    order_id,
    user_id,
    order_date,
    amount,
    SUM(amount) OVER (PARTITION BY user_id ORDER BY order_date) AS running_user_spend,
    RANK() OVER (ORDER BY amount DESC) AS overall_amount_rank
FROM orders;`,
        language: 'sql'
      }
    ]
  },
  {
    id: 'crs_data_pipelines',
    title: 'Data Wrangling & ETL Pipelines with Python Pandas',
    category: 'Data Analytics',
    icon: 'TrendingUp',
    description: 'Cleanse raw telemetry streams, handle missing values, merge heterogeneous datasets, and export automated analytical reports.',
    level: 'Beginner',
    duration: '4 Modules • 10 Lessons',
    modulesCount: 4,
    enrolledStudents: 1980,
    rating: 4.87,
    skillsCovered: ['Python', 'Pandas', 'Data Cleaning', 'Aggregation', 'Seaborn / Plotly'],
    lessons: [
      {
        id: 'les_da_p1',
        title: '1. Vectorized Pandas Transformations & Outlier Detection',
        duration: '15 min',
        contentMarkdown: `### Vectorized Operations in Pandas
Avoid slow iterative for-loops in Python; always leverage internal C-optimized vector methods.`,
        codeExample: `import pandas as pd
import numpy as np

df['z_score'] = (df['revenue'] - df['revenue'].mean()) / df['revenue'].std()
df_cleaned = df[df['z_score'].abs() <= 3].copy()`,
        language: 'python'
      }
    ]
  },

  // 4. CLOUD MODULE
  {
    id: 'crs_cloud_docker',
    title: 'Cloud Architecture & Docker/Kubernetes Orchestration',
    category: 'Cloud',
    icon: 'Cloud',
    description: 'Master containerization, multi-stage Docker builds, Kubernetes Pod/Service networking, and continuous deployment pipelines.',
    level: 'Intermediate',
    duration: '4 Modules • 14 Lessons',
    modulesCount: 4,
    enrolledStudents: 2150,
    rating: 4.92,
    skillsCovered: ['Docker', 'Kubernetes', 'GCP Cloud Run', 'CI/CD Pipelines', 'Linux'],
    lessons: [
      {
        id: 'les_cl_1',
        title: '1. Multi-Stage Dockerfile Optimization',
        duration: '18 min',
        contentMarkdown: `### Building Minimal Production Container Images
Keep production container footprints small by compiling binaries in a temporary build stage.`,
        codeExample: `FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/server.cjs"]`,
        language: 'dockerfile'
      }
    ]
  },

  // 5. CYBERSECURITY MODULE
  {
    id: 'crs_cyber_sec',
    title: 'Web Application Defense & OWASP Top 10 Security',
    category: 'Cybersecurity',
    icon: 'ShieldCheck',
    description: 'Defend web applications against SQL injection, XSS, CSRF, insecure direct object references (IDOR), and broken access controls.',
    level: 'Intermediate',
    duration: '5 Modules • 15 Lessons',
    modulesCount: 5,
    enrolledStudents: 1720,
    rating: 4.94,
    skillsCovered: ['OWASP Top 10', 'SQLi Prevention', 'XSS Sanitization', 'CORS / CSP', 'Cryptographic Auth'],
    lessons: [
      {
        id: 'les_sec_1',
        title: '1. Parameterized Queries vs SQL Injection',
        duration: '16 min',
        contentMarkdown: `### Eliminating SQL Injection at the Root
Never concatenate raw user input into SQL queries. Always utilize parameterized placeholders and prepared statements.`,
        codeExample: `// SECURE: Parameterized query protects against SQL injection
const result = await db.query(
  'SELECT * FROM users WHERE email = $1 AND is_active = $2',
  [userEmail, true]
);`,
        language: 'typescript'
      }
    ]
  }
];

const EXTENDED_LEARNING_LESSONS: Record<string, CourseLesson[]> = {
  crs_aiml_genai: [
    {
      id: 'les_ai_3',
      title: '3. Tool Calling, Agents & Guardrails',
      duration: '24 min',
      contentMarkdown: `### Designing Reliable AI Agents
An agent connects a model to tools, memory, and a control loop. Production agents need narrow tool contracts, explicit permissions, bounded retries, and human review for sensitive actions.

#### Build Checklist
1. Define typed input and output schemas for every tool.
2. Validate arguments before calling external systems.
3. Log each tool call with request ID, latency, and outcome.
4. Stop after a maximum number of turns to control cost.`,
      codeExample: `function validateToolArgs(args: unknown): { skill: string } {
  if (!args || typeof (args as { skill?: unknown }).skill !== 'string') {
    throw new Error('Invalid tool arguments');
  }
  return args as { skill: string };
}`,
      language: 'typescript',
      quiz: {
        question: 'Which control prevents an agent from running forever?',
        options: ['A maximum turn or retry limit', 'A larger context window', 'Higher temperature', 'Removing request logs'],
        correctIndex: 0,
        explanation: 'Bounded turns and retries make agent cost and execution time predictable.'
      }
    },
    {
      id: 'les_ai_4',
      title: '4. Evaluation, Hallucination Testing & Production Monitoring',
      duration: '26 min',
      contentMarkdown: `### Measure AI Quality Like a Product Feature
Build a small evaluation set before changing prompts. Score groundedness, relevance, refusal behavior, latency, and token cost. Compare a new prompt or model against a baseline instead of relying on a few manually selected examples.

In production, sample responses for review, track failure categories, redact sensitive data from logs, and provide a clear fallback when the model is unavailable.`,
      codeExample: `const evaluation = testCases.map(({ input, expected }) => ({
  input,
  expected,
  actual: runModel(input),
  grounded: retrievedSourcesWereUsed(input)
}));
const groundedRate = evaluation.filter(item => item.grounded).length / evaluation.length;`,
      language: 'typescript'
    }
  ],
  crs_aiml_foundations: [
    {
      id: 'les_aiml_f2',
      title: '2. Classification Metrics & Data Leakage',
      duration: '20 min',
      contentMarkdown: `### Evaluating Models Honestly
Accuracy can hide poor performance on imbalanced datasets. Use precision when false positives are expensive, recall when missed positives are expensive, and F1 when both matter.

Split data before fitting scaling or feature selection. If validation information influences training, the score is inflated by leakage.`,
      codeExample: `from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
model.fit(X_train, y_train)`,
      language: 'python',
      quiz: {
        question: 'Why should preprocessing be fitted only on training data?',
        options: ['To prevent validation information leaking into the model', 'To increase features', 'To remove testing', 'To make labels continuous'],
        correctIndex: 0,
        explanation: 'Fitting preprocessing on all data lets the model see validation statistics indirectly.'
      }
    },
    {
      id: 'les_aiml_f3',
      title: '3. Neural Network Training & Experiment Tracking',
      duration: '22 min',
      contentMarkdown: `### From Loss Curves to Better Models
Training loss measures fit to seen examples; validation loss measures generalization. A widening gap usually means overfitting, which can be addressed with more data, regularization, dropout, or early stopping.

Record dataset version, hyperparameters, random seed, metrics, and the model artifact for every experiment. Reproducibility is an engineering feature.`,
      codeExample: `for epoch in range(epochs):
    model.train()
    train_loss = train_one_epoch(model, train_loader, optimizer)
    model.eval()
    val_loss = evaluate(model, validation_loader)
    print({"epoch": epoch, "train_loss": train_loss, "val_loss": val_loss})`,
      language: 'python'
    }
  ],
  crs_fullstack_react: [
    {
      id: 'les_fs_2',
      title: '2. Server State, Forms & Resilient Data Fetching',
      duration: '22 min',
      contentMarkdown: `### Making UI State Predictable
Separate server state from local UI state. Every request should represent loading, success, empty, and error states. Disable duplicate submissions, show retry actions, and keep stale data visible while a refresh is in flight when helpful.

Keep API transformation logic at the boundary so components receive predictable typed data.`,
      codeExample: `async function loadCourses(signal?: AbortSignal): Promise<Course[]> {
  const response = await fetch('/api/courses', { signal });
  if (!response.ok) throw new Error('Unable to load courses');
  const payload: { courses: Course[] } = await response.json();
  return payload.courses;
}`,
      language: 'typescript',
      quiz: {
        question: 'Which states should a data-fetching component represent?',
        options: ['Loading, success, empty, and error', 'Only response data', 'Only a spinner', 'Only the last error'],
        correctIndex: 0,
        explanation: 'Explicit request states prevent blank screens and make recovery actions discoverable.'
      }
    },
    {
      id: 'les_fs_3',
      title: '3. Testing, Accessibility & Production Readiness',
      duration: '24 min',
      contentMarkdown: `### Shipping Interfaces People Can Trust
Test user behavior: selecting a module, submitting a form, handling an API error, and recovering from failure. Use semantic buttons and labels, visible keyboard focus, meaningful alt text, and sufficient contrast.

Before release, check the production build, console errors, mobile layout, and empty state for every data-driven screen.`,
      codeExample: `test('shows an error and retry action', async () => {
  render(<CourseList />);
  expect(await screen.findByText('Unable to load courses')).toBeVisible();
  expect(screen.getByRole('button', { name: /retry/i })).toBeEnabled();
});`,
      language: 'typescript'
    }
  ],
  crs_fullstack_node: [
    {
      id: 'les_fs_n2',
      title: '2. Authentication, Authorization & Input Validation',
      duration: '20 min',
      contentMarkdown: `### Protecting an API Boundary
Authentication answers who the caller is; authorization answers what they may do. Validate request bodies, query parameters, and route identifiers before business logic. Return consistent errors without leaking stack traces or database details.

A valid token must not grant access to another user's record. Check ownership at the resource operation.`,
      codeExample: `const input = createRecordSchema.parse(req.body);
const record = await records.create(req.user.id, input);
res.status(201).json({ record });`,
      language: 'typescript',
      quiz: {
        question: 'What is the difference between authentication and authorization?',
        options: ['Identity versus permissions', 'Encryption versus compression', 'Caching versus logging', 'Parsing versus rendering'],
        correctIndex: 0,
        explanation: 'Authentication identifies the caller; authorization determines allowed actions and resources.'
      }
    },
    {
      id: 'les_fs_n3',
      title: '3. Transactions, Indexes & Observability',
      duration: '25 min',
      contentMarkdown: `### Reliable Services Need Reliable Data Access
Use transactions when multiple writes must succeed or fail together. Add indexes based on real query patterns, inspect plans with EXPLAIN ANALYZE, and avoid selecting unused columns on high-traffic endpoints.

Measure request duration, error rate, database latency, and slow query frequency. Correlate logs with a request ID across services.`,
      codeExample: `await db.transaction(async (client) => {
  const order = await client.query(
    'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id',
    [userId, total]
  );
  await client.query('INSERT INTO audit_events (entity_id, event_type) VALUES ($1, $2)', [order.rows[0].id, 'order.created']);
});`,
      language: 'typescript'
    }
  ],
  crs_data_sql: [
    {
      id: 'les_da_2',
      title: '2. CTEs, Cohort Analysis & Retention',
      duration: '24 min',
      contentMarkdown: `### Turning Events into Product Decisions
Common table expressions make analytical queries readable by separating first activity, monthly activity, and retained users. Define the cohort date once, then compare later activity to that cohort.

Always state the grain: one row per user, order, session, or event. Joining different grains without care creates duplicate counts.`,
      codeExample: `WITH first_activity AS (
  SELECT user_id, MIN(event_at)::date AS cohort_date FROM events GROUP BY user_id
), monthly_activity AS (
  SELECT DISTINCT user_id, date_trunc('month', event_at)::date AS activity_month FROM events
)
SELECT cohort_date, activity_month, COUNT(*) AS active_users
FROM first_activity JOIN monthly_activity USING (user_id)
GROUP BY cohort_date, activity_month;`,
      language: 'sql',
      quiz: {
        question: 'Why document the grain of each table?',
        options: ['To prevent accidental duplicate counts during joins', 'To increase query temperature', 'To remove all nulls', 'To avoid date fields'],
        correctIndex: 0,
        explanation: 'Knowing the row grain helps you choose safe joins and aggregation levels.'
      }
    },
    {
      id: 'les_da_3',
      title: '3. Query Plans, Indexes & Analytical Performance',
      duration: '23 min',
      contentMarkdown: `### Read the Plan Before Changing the Query
EXPLAIN ANALYZE shows chosen operations and actual row counts. Look for sequential scans on large filtered tables, high loop counts, inaccurate estimates, and sorts that spill to disk.

An index helps only when it supports a common filter, join, or ordering pattern. Measure before and after because indexes add write and storage cost.`,
      codeExample: `EXPLAIN (ANALYZE, BUFFERS)
SELECT user_id, SUM(amount) FROM orders
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY user_id;`,
      language: 'sql'
    }
  ],
  crs_data_pipelines: [
    {
      id: 'les_da_p2',
      title: '2. Joins, Missing Values & Data Quality Rules',
      duration: '20 min',
      contentMarkdown: `### Clean Data with Explicit Rules
Profile before cleaning: check null percentages, unique values, duplicate keys, impossible ranges, and inconsistent categories. Keep a record of transformations so the report can be reproduced.

Zero, unknown, not applicable, and unavailable are different meanings. Choose a missing-value strategy from the domain, not convenience.`,
      codeExample: `quality = (df.isna().mean() * 100).sort_values(ascending=False)
duplicates = df.duplicated(subset=['user_id', 'event_at']).sum()
df['country'] = df['country'].str.strip().str.upper()
df['revenue'] = df['revenue'].clip(lower=0)`,
      language: 'python',
      quiz: {
        question: 'What should happen before choosing how to fill missing values?',
        options: ['Understand what the missing value means', 'Replace every value with zero', 'Drop every row', 'Convert all columns to text'],
        correctIndex: 0,
        explanation: 'The correct treatment depends on whether missing means zero, unknown, or not applicable.'
      }
    },
    {
      id: 'les_da_p3',
      title: '3. Communicating Insights with Reproducible Reports',
      duration: '18 min',
      contentMarkdown: `### From Charts to Decisions
A useful report explains what changed, why it changed, how confident you are, and what action should follow. Label axes, units, date ranges, sample sizes, and comparison baselines.

Separate observed facts from interpretation so stakeholders can challenge assumptions productively.`,
      codeExample: `figure = px.line(
    weekly_sales, x='week', y='revenue', color='channel',
    title='Weekly revenue by acquisition channel',
    labels={'revenue': 'Revenue (USD)'}
)`,
      language: 'python'
    }
  ],
  crs_cloud_docker: [
    {
      id: 'les_cl_2',
      title: '2. Kubernetes Deployments, Services & Health Checks',
      duration: '24 min',
      contentMarkdown: `### Running Containers Reliably
A Deployment describes the desired number and version of Pods. A Service gives them a stable network identity. Readiness probes control traffic; liveness probes restart stuck containers.

Set CPU and memory requests so the scheduler can place workloads, and limits so one process cannot consume an entire node.`,
      codeExample: `apiVersion: apps/v1
kind: Deployment
metadata: { name: api }
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: api
          image: skillsphere/api:1.4.0
          readinessProbe:
            httpGet: { path: /api/health, port: 3000 }`,
      language: 'yaml',
      quiz: {
        question: 'Which probe determines whether a Pod should receive traffic?',
        options: ['Readiness probe', 'Liveness probe', 'Build probe', 'Image probe'],
        correctIndex: 0,
        explanation: 'Readiness indicates that the application is prepared to serve requests.'
      }
    },
    {
      id: 'les_cl_3',
      title: '3. CI/CD, Secrets & Deployment Rollbacks',
      duration: '22 min',
      contentMarkdown: `### Safe Delivery to Production
A pipeline should install dependencies reproducibly, run tests, build an immutable artifact, scan it, and promote the same artifact through environments. Store secrets in a platform secret manager, never in source control.

Release gradually with health checks and keep a tested rollback plan.`,
      codeExample: `- run: npm ci
- run: npm test -- --runInBand
- run: npm run build
- run: docker build --tag skillsphere/api:$GITHUB_SHA .`,
      language: 'yaml'
    }
  ],
  crs_cyber_sec: [
    {
      id: 'les_sec_2',
      title: '2. XSS, CSRF, CSP & Secure Browser Boundaries',
      duration: '22 min',
      contentMarkdown: `### Protecting the Browser as an Attack Surface
Cross-site scripting occurs when attacker-controlled content is interpreted as code. Prefer framework escaping, avoid raw HTML injection, and sanitize rich text with an allowlist. Content Security Policy adds a second layer by limiting executable sources.

For cookie sessions, use SameSite and CSRF tokens. CORS is not authentication; it controls which browsers may read responses.`,
      codeExample: `app.use(helmet({
  contentSecurityPolicy: {
    directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"], objectSrc: ["'none'"] }
  }
}));`,
      language: 'typescript',
      quiz: {
        question: 'What does a Content Security Policy primarily restrict?',
        options: ['Which sources the browser may load or execute', 'Which database rows a user owns', 'How passwords are hashed', 'The number of API requests'],
        correctIndex: 0,
        explanation: 'CSP limits browser resource and script sources, reducing the impact of injected code.'
      }
    },
    {
      id: 'les_sec_3',
      title: '3. Secure Authentication, Secrets & Threat Modeling',
      duration: '25 min',
      contentMarkdown: `### Make Security Decisions Deliberate
Threat modeling asks what you protect, who can attack it, which trust boundaries exist, and what happens if a control fails. Use short-lived tokens, strong password hashing, key rotation, and least-privilege service accounts.

Never place private keys, database passwords, or server API keys in frontend bundles. Log security events without passwords, tokens, or sensitive personal data.`,
      codeExample: `const passwordHash = await argon2.hash(password);
const valid = await argon2.verify(passwordHash, submittedPassword);
if (!valid) return res.status(401).json({ error: 'Invalid credentials' });`,
      language: 'typescript'
    }
  ]
};

SAMPLE_COURSES.forEach((course) => {
  course.lessons.push(...(EXTENDED_LEARNING_LESSONS[course.id] || []));
});

// --------------------------------------------------------------------------
// CODE ARENA PROBLEM SET (12+ Curated Problems with Examples, Hints & Constraints)
// --------------------------------------------------------------------------
export const SAMPLE_CODING_PROBLEMS: CodingProblem[] = [
  {
    id: 'prob_01',
    title: 'Two Sum II - Input Array Is Sorted',
    category: 'Arrays',
    difficulty: 'Easy',
    description: 'Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number. Return the indices of the two numbers added by one as an integer array `[index1, index2]` of length 2.\n\nYour solution must use only O(1) extra space.',
    examples: [
      {
        input: 'numbers = [2,7,11,15], target = 9',
        output: '[1,2]',
        explanation: 'The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].'
      },
      {
        input: 'numbers = [2,3,4], target = 6',
        output: '[1,3]',
        explanation: 'The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3. We return [1, 3].'
      }
    ],
    constraints: [
      '2 <= numbers.length <= 3 * 10^4',
      '-1000 <= numbers[i] <= 1000',
      'numbers is sorted in non-decreasing order.',
      'Exactly one solution exists.'
    ],
    hints: [
      'Since the input array is already sorted, can you use two pointers (one at the beginning and one at the end)?',
      'If the sum of elements at the two pointers is greater than target, decrement the right pointer. If smaller, increment the left pointer.'
    ],
    starterTemplates: {
      'Python': `def twoSum(numbers: list[int], target: int) -> list[int]:
    # Two pointer approach
    left, right = 0, len(numbers) - 1
    while left < right:
        curr = numbers[left] + numbers[right]
        if curr == target:
            return [left + 1, right + 1]
        elif curr < target:
            left += 1
        else:
            right -= 1
    return []`,
      'JavaScript': `function twoSum(numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`,
      'Java': `class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int left = 0, right = numbers.length - 1;
        while (left < right) {
            int sum = numbers[left] + numbers[right];
            if (sum == target) return new int[]{left + 1, right + 1};
            if (sum < target) left++;
            else right--;
        }
        return new int[]{};
    }
}`,
      'C++': `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int left = 0, right = numbers.size() - 1;
        while (left < right) {
            int sum = numbers[left] + numbers[right];
            if (sum == target) return {left + 1, right + 1};
            if (sum < target) left++;
            else right--;
        }
        return {};
    }
};`
    },
    testCases: [
      { input: '[2,7,11,15], target = 9', expectedOutput: '[1, 2]' },
      { input: '[2,3,4], target = 6', expectedOutput: '[1, 3]' },
      { input: '[-1,0], target = -1', expectedOutput: '[1, 2]' }
    ],
    hiddenTestCases: [
      { input: '[1,2,3,4,4,9,56], target = 8', expectedOutput: '[4, 5]' }
    ],
    points: 20,
    acceptanceRate: '88%'
  },
  {
    id: 'prob_02',
    title: 'Valid Parentheses and Balanced Tags',
    category: 'Stack',
    difficulty: 'Easy',
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by the same type of brackets in the correct order.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only "()[]{}"'
    ],
    hints: [
      'Use a Last-In-First-Out (Stack) data structure.',
      'When you see an opening bracket, push it to stack. When you see a closing bracket, check if it matches the top element.'
    ],
    starterTemplates: {
      'Python': `def isValid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack`,
      'JavaScript': `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (let c of s) {
    if (map[c]) {
      if (stack.pop() !== map[c]) return false;
    } else {
      stack.push(c);
    }
  }
  return stack.length === 0;
}`
    },
    testCases: [
      { input: '"()"', expectedOutput: 'true' },
      { input: '"()[]{}"', expectedOutput: 'true' },
      { input: '"(]"', expectedOutput: 'false' }
    ],
    points: 20,
    acceptanceRate: '82%'
  },
  {
    id: 'prob_03',
    title: 'Longest Substring Without Repeating Characters',
    category: 'Strings',
    difficulty: 'Medium',
    description: 'Given a string `s`, find the length of the longest substring without duplicate characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with length 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with length 1.' }
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    hints: [
      'Use the Sliding Window technique with two pointers `left` and `right`.',
      'Keep a hash map of each character’s latest seen index.'
    ],
    starterTemplates: {
      'Python': `def lengthOfLongestSubstring(s: str) -> int:
    char_index = {}
    left = 0
    max_len = 0
    for right, char in enumerate(s):
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        char_index[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
      'JavaScript': `function lengthOfLongestSubstring(s) {
  const map = new Map();
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (map.has(c) && map.get(c) >= left) {
      left = map.get(c) + 1;
    }
    map.set(c, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`
    },
    testCases: [
      { input: '"abcabcbb"', expectedOutput: '3' },
      { input: '"bbbbb"', expectedOutput: '1' },
      { input: '"pwwkew"', expectedOutput: '3' }
    ],
    points: 35,
    acceptanceRate: '65%'
  },
  {
    id: 'prob_04',
    title: 'Maximum Subarray (Kadane’s Algorithm)',
    category: 'Arrays',
    difficulty: 'Medium',
    description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    hints: [
      'At each index, decide whether to add `nums[i]` to current sum or start a new subarray at `nums[i]`.'
    ],
    starterTemplates: {
      'Python': `def maxSubArray(nums: list[int]) -> int:
    max_sum = current_sum = nums[0]
    for x in nums[1:]:
        current_sum = max(x, current_sum + x)
        max_sum = max(max_sum, current_sum)
    return max_sum`,
      'JavaScript': `function maxSubArray(nums) {
  let maxSum = nums[0];
  let currSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currSum = Math.max(nums[i], currSum + nums[i]);
    maxSum = Math.max(maxSum, currSum);
  }
  return maxSum;
}`
    },
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { input: '[1]', expectedOutput: '1' },
      { input: '[5,4,-1,7,8]', expectedOutput: '23' }
    ],
    points: 30,
    acceptanceRate: '72%'
  },
  {
    id: 'prob_05',
    title: 'Invert Binary Tree',
    category: 'Trees',
    difficulty: 'Easy',
    description: 'Given the root of a binary tree, invert the tree (swap left and right children recursively), and return its root.',
    examples: [
      { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' }
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 100].'],
    hints: ['Recursively invert left and right subtrees, then swap them.'],
    starterTemplates: {
      'Python': `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
def invertTree(root):
    if not root:
        return None
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root`
    },
    testCases: [
      { input: '[4,2,7,1,3,6,9]', expectedOutput: '[4,7,2,9,6,3,1]' }
    ],
    points: 20,
    acceptanceRate: '85%'
  },
  {
    id: 'prob_06',
    title: 'Best Time to Buy and Sell Stock',
    category: 'Dynamic Programming',
    difficulty: 'Easy',
    description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve.',
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.' }
    ],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    hints: ['Track the minimum price seen so far as you iterate through the list.'],
    starterTemplates: {
      'Python': `def maxProfit(prices: list[int]) -> int:
    min_price = float('inf')
    max_profit = 0
    for p in prices:
        if p < min_price:
            min_price = p
        elif p - min_price > max_profit:
            max_profit = p - min_price
    return max_profit`
    },
    testCases: [
      { input: '[7,1,5,3,6,4]', expectedOutput: '5' },
      { input: '[7,6,4,3,1]', expectedOutput: '0' }
    ],
    points: 20,
    acceptanceRate: '80%'
  },
  {
    id: 'prob_07',
    title: 'Group Anagrams',
    category: 'Strings',
    difficulty: 'Medium',
    description: 'Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.',
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }
    ],
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100'],
    hints: ['Use the sorted version of each string or a character frequency tuple as the hash map key.'],
    starterTemplates: {
      'Python': `from collections import defaultdict

def groupAnagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))
        groups[key].append(s)
    return list(groups.values())`
    },
    testCases: [
      { input: '["eat","tea","tan","ate","nat","bat"]', expectedOutput: '3 groups' }
    ],
    points: 35,
    acceptanceRate: '68%'
  },
  {
    id: 'prob_08',
    title: 'Binary Search in Rotated Sorted Array',
    category: 'Searching',
    difficulty: 'Medium',
    description: 'Given the sorted array `nums` possibly rotated at an unknown pivot, search for `target`. Return index if found, else `-1` in O(log N) time.',
    examples: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' }
    ],
    constraints: ['1 <= nums.length <= 5000', '-10^4 <= nums[i] <= 10^4'],
    hints: ['At least one half of the rotated array is always strictly sorted.'],
    starterTemplates: {
      'Python': `def search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1`
    },
    testCases: [
      { input: '[4,5,6,7,0,1,2], target = 0', expectedOutput: '4' },
      { input: '[4,5,6,7,0,1,2], target = 3', expectedOutput: '-1' }
    ],
    points: 35,
    acceptanceRate: '58%'
  }
];

export const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'u_lead_1',
    name: 'Priya Sharma',
    college: 'IIT Bombay',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    problemsSolved: 142,
    points: 2840,
    accuracy: 96.4,
    streakDays: 42,
    badges: ['DSA Master', '30-Day Streak', 'Simulation Champion', 'Top Performer']
  },
  {
    rank: 2,
    userId: 'u_lead_2',
    name: 'Ethan Wright',
    college: 'UC Berkeley',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    problemsSolved: 128,
    points: 2560,
    accuracy: 94.2,
    streakDays: 28,
    badges: ['First Solve', '7-Day Streak', 'DSA Master', 'Interview Ready']
  },
  {
    rank: 3,
    userId: 'u_lead_3',
    name: 'Rohan Gupta',
    college: 'BITS Pilani',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    problemsSolved: 115,
    points: 2310,
    accuracy: 91.8,
    streakDays: 19,
    badges: ['First Solve', '7-Day Streak', 'Bug Hunter']
  },
  {
    rank: 4,
    userId: 'u_lead_4',
    name: 'Aisha Patel',
    college: 'Georgia Tech',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    problemsSolved: 39,
    points: 780,
    accuracy: 89.0,
    streakDays: 8,
    badges: ['First Solve', 'Code Sprinter']
  }
];

export const SAMPLE_MENTORS: Mentor[] = [
  {
    id: 'm1',
    name: 'Dr. Marcus Vance',
    role: 'Principal Staff Engineer',
    company: 'Google Cloud',
    expertise: ['Distributed Systems', 'System Design', 'Cloud Architecture', 'Interview Prep'],
    bio: '14+ years designing massive-scale multi-region backend infrastructure. Passionate about helping students bridge university theory to production engineering.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    rating: 4.98,
    sessionsCount: 320
  },
  {
    id: 'm2',
    name: 'Elena Rostova',
    role: 'Lead ML Solutions Architect',
    company: 'Anthropic AI',
    expertise: ['AI/ML Engineering', 'Prompt Evaluation', 'Python', 'Research to Product'],
    bio: 'Former Stanford AI Lab researcher. Mentors developers on breaking into Generative AI engineering and building reliable LLM applications.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    rating: 4.95,
    sessionsCount: 245
  },
  {
    id: 'm3',
    name: 'Devin Thorne',
    role: 'Senior Tech Recruiter & Career Coach',
    company: 'Meta / ex-Stripe',
    expertise: ['Resume Optimization', 'Behavioral Interviews', 'Salary Negotiation', 'Portfolio Reviews'],
    bio: 'Reviewed 10,000+ software engineering resumes. Specializes in turning student side-projects into high-converting recruiter magnets.',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    rating: 4.92,
    sessionsCount: 510
  }
];

export const SAMPLE_MENTOR_TIPS: MentorTip[] = [
  {
    id: 'tip_1',
    category: 'Interview',
    title: 'The 3-Minute Rule for Technical Coding Rounds',
    summary: 'Never start coding immediately. Clarify inputs, edge cases, and time/space constraints first.',
    content: 'When interviewers present a problem, spend the first 3 minutes asking clarifying questions about edge cases (empty arrays, duplicates, memory constraints). Always articulate your brute-force approach first before optimizing with hash maps or pointers. This demonstrates systematic architectural thinking.',
    authorName: 'Dr. Marcus Vance',
    authorRole: 'Principal Staff Engineer, Google Cloud',
    likes: 342,
    date: '2 days ago'
  },
  {
    id: 'tip_2',
    category: 'Resume',
    title: 'Transform Project Bullet Points with the XYZ Formula',
    summary: 'Replace "Built a React website" with "Accomplished [X] as measured by [Y], by doing [Z]".',
    content: 'Recruiters and ATS parsers scan for measurable impact. Instead of "Created a task app with Node.js", write: "Architected a full-stack task manager with Express and PostgreSQL, reducing query latency by 45% via indexed foreign keys and supporting 500+ concurrent active sessions".',
    authorName: 'Devin Thorne',
    authorRole: 'Senior Tech Recruiter, ex-Stripe',
    likes: 518,
    date: '3 days ago'
  },
  {
    id: 'tip_3',
    category: 'Coding',
    title: 'Mastering the 14 Crucial DSA Patterns',
    summary: 'Don’t solve 500 random problems. Learn the 14 core patterns that solve 90% of interview questions.',
    content: 'Focus your time on: 1) Two Pointers, 2) Sliding Window, 3) Fast & Slow Pointers, 4) Merge Intervals, 5) Cyclic Sort, 6) In-place Reversal of a LinkedList, 7) Tree BFS/DFS, 8) Two Heaps, 9) Subsets/Backtracking, 10) Modified Binary Search, 11) Top K Elements, 12) K-way Merge, 13) 0/1 Knapsack DP, 14) Topological Sort.',
    authorName: 'Elena Rostova',
    authorRole: 'Lead ML Solutions Architect, Anthropic',
    likes: 674,
    date: '5 days ago'
  }
];

export const SAMPLE_CERTIFICATES: Certificate[] = [
  {
    id: 'cert_01',
    certificateNumber: 'AICAREER-2026-FS-9428',
    userId: 'usr_student_01',
    userName: 'Alex Chen',
    courseOrSimulationTitle: 'CloudScale Technologies Full Stack Internship Simulation',
    internshipTitle: 'CloudScale Technologies Full Stack Internship Simulation',
    company: 'CloudScale Technologies',
    type: 'Internship Simulation Mastery',
    issuedAt: '2026-08-10T14:30:00Z',
    issueDate: '2026-08-10T14:30:00Z',
    score: 94,
    skills: ['React 19', 'Express Route Optimization', 'SQL Aggregations', 'Defensive Error Handling'],
    skillsDemonstrated: ['React 19', 'Express Route Optimization', 'SQL Aggregations', 'Defensive Error Handling'],
    verificationUrl: '#/verify/AICAREER-2026-FS-9428'
  }
];

export const SAMPLE_USER_PROFILE = INITIAL_USER;
export const SAMPLE_CAREER_RECOMMENDATIONS = SAMPLE_CAREERS;
export const SAMPLE_SIMULATION_PROJECTS: InternshipSimulation[] = Object.values(SAMPLE_SIMULATIONS);

export const SAMPLE_SKILL_PROFILE = {
  userId: 'usr_student_01',
  radarScores: [
    { subject: 'Data Structures', score: 85, fullMark: 100 },
    { subject: 'System Design', score: 70, fullMark: 100 },
    { subject: 'Web & APIs', score: 90, fullMark: 100 },
    { subject: 'Database & SQL', score: 82, fullMark: 100 },
    { subject: 'AI & Logic', score: 76, fullMark: 100 },
    { subject: 'Communication', score: 88, fullMark: 100 }
  ],
  primaryStrengths: ['API Architecture', 'React State Design', 'Analytical SQL Queries', 'Team Collaboration'],
  criticalGaps: ['Distributed Caching with Redis', 'Docker Containerization', 'Graph Algorithms', 'CI/CD Pipelines'],
  lastUpdated: new Date().toISOString()
};

export const SAMPLE_NOTIFICATIONS = [
  {
    id: 'notif_1',
    title: 'New Internship Demo Available',
    message: 'CloudScale Technologies released their Summer 2026 Full Stack simulation sprint in Bengaluru!',
    timestamp: '1 hour ago',
    read: false,
    type: 'internship' as const
  },
  {
    id: 'notif_2',
    title: 'Daily Coding Streak: Day 6',
    message: 'Solve today’s challenge to unlock your 7-Day Streak badge!',
    timestamp: '3 hours ago',
    read: false,
    type: 'coding' as const
  }
];
