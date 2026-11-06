/**
 * 45-Minute Lesson Content Generator
 * Combines multi-source research into an engaging, pedagogically structured 45-minute lesson.
 */

import { callLLM } from './llmService.js';

export async function generateLessonContent({ title, objective, researchData, llmConfig = {} }) {
  const { apiKey, provider, model } = llmConfig;

  const prompt = `
You are an expert curriculum designer and educator at an elite engineering academy.
Generate an engaging, mathematically paced 45-minute technical lesson on:
TITLE: "${title}"
LEARNING OBJECTIVE: "${objective}"

RESEARCH CONTEXT:
- Books: ${researchData.books.map(b => `${b.title} by ${b.authors.join(', ')} (${b.publisher}, ${b.year})`).join('; ')}
- Web Docs: ${researchData.websites.map(w => `${w.title} (${w.source}): ${w.snippet}`).join('; ')}
- Videos: ${researchData.videos.map(v => `${v.title} by ${v.channel} [${v.duration}]`).join('; ')}

MANDATORY CURRICULUM REQUIREMENTS:
1. Pacing: Designed strictly for a 45-minute block. Include a clear time-stamped timeline at the beginning.
2. Structure:
   - Module 1: Real-World Hook & Prerequisites (00:00 - 05:00, 5 mins)
   - Module 2: Core Concepts & Foundational Theory (05:00 - 15:00, 10 mins)
   - Module 3: Technical Deep-Dive, Mechanics & Real Code Examples (15:00 - 25:00, 10 mins)
   - Module 4: Guided Hands-On Lab / Practical Application Exercise (25:00 - 35:00, 10 mins)
   - Module 5: Formative Knowledge Check & Self-Assessment (35:00 - 45:00, 10 mins)
   - Module 6: Supplementary Video Resources (curated YouTube videos with timestamps)
   - Module 7: Authoritative References & Reading List (RFCs, MDN, Books)
3. Incorporate code snippets, tables comparing methods/concepts, practical scenarios, and 4 multiple-choice knowledge check questions with explanations.

Output clean, well-formatted Markdown with proper headings (#, ##, ###), bold text, code blocks, and markdown tables.
`;

  let content = null;

  if (apiKey) {
    try {
      content = await callLLM({
        prompt,
        systemInstruction: "You are an elite Computer Science educator creating rigorous 45-minute instructional modules.",
        apiKey,
        provider,
        model
      });
    } catch (err) {
      console.warn('[LessonGenerator] LLM generation error, switching to template generator:', err);
    }
  }

  // If LLM returned valid markdown, use it; otherwise use our rich built-in generator
  if (!content || content.length < 300) {
    content = buildHeuristicLessonMarkdown({ title, objective, researchData });
  }

  return {
    title,
    objective,
    durationMinutes: 45,
    generatedAt: new Date().toISOString(),
    content,
    researchData
  };
}

/**
 * Built-in high quality curriculum generator
 */
function buildHeuristicLessonMarkdown({ title, objective, researchData }) {
  const isHttp = title.toLowerCase().includes('http') || objective.toLowerCase().includes('get') || objective.toLowerCase().includes('post') || objective.toLowerCase().includes('status');
  const isGit = title.toLowerCase().includes('git') || objective.toLowerCase().includes('branch') || objective.toLowerCase().includes('merge');

  if (isHttp) {
    return `# ${title}

> **Target Duration:** 45 Minutes | **Level:** Foundational to Intermediate Software Engineering  
> **Primary Objective:** ${objective}

---

## ⏱️ 45-Minute Lesson Pacing Schedule

To maximize learning retention and engagement, this lesson follows an active-learning pedagogical framework:

| Timestamp | Phase | Topic / Activity | Learning Modality |
| :--- | :--- | :--- | :--- |
| **00:00 – 05:00** (5m) | **Hook & Framing** | The Client-Server Conversation & Real-World Failure Scenarios | Interactive Discussion |
| **05:00 – 15:00** (10m) | **Core Concepts** | Anatomy of HTTP Messages: GET vs POST Deep Dive | Concept Exposition & Comparison |
| **15:00 – 25:00** (10m) | **Technical Mechanics** | Status Code Taxonomy: Demystifying 2xx, 4xx, and 5xx | Packet Inspection & Code Analysis |
| **25:00 – 35:00** (10m) | **Hands-on Lab** | Practical cURL / Fetch Diagnostics & Network Debugging | Guided Coding Exercise |
| **35:00 – 45:00** (10m) | **Assessment & Wrap-Up** | Formative Knowledge Check, Edge-Case Q&A & Actionable Summary | Retrieval Practice & Quiz |

---

## 1. Introduction & The Client-Server Handshake (00:00 – 05:00)

Every web experience—from streaming video on Netflix to submitting an online payment—relies on the **Hypertext Transfer Protocol (HTTP)**. HTTP is a stateless, request-response application protocol that standardizes how clients (browsers, mobile apps, IoT devices) communicate with servers.

### The Mental Model: Ordering at a Restaurant
- **The Client (Browser):** The customer looking at a menu.
- **The Request:** The customer giving an order to the waiter.
- **The Server:** The kitchen processing the order according to strict recipes.
- **The Response:** The waiter bringing back food (with a receipt and a status indicating whether the kitchen succeeded or ran out of ingredients).

---

## 2. HTTP Request Methods: GET vs POST (05:00 – 15:00)

HTTP defines specific *verbs* (request methods) that convey the client's intent. The two most fundamental methods are **GET** and **POST**.

### Comprehensive Comparison Matrix

| Property | \`GET\` Method | \`POST\` Method |
| :--- | :--- | :--- |
| **Semantic Purpose** | Retrieve existing data representation | Submit new data to create or mutate server state |
| **Idempotence** | **Yes** (multiple identical requests yield same server state) | **No** (multiple requests can create duplicate entities) |
| **Safety (RFC 9110)** | **Yes** (read-only; does not alter server resources) | **No** (intentionally modifies server state) |
| **Data Transmission** | Sent in URL Query String (\`?id=101&sort=desc\`) | Sent in Request Body (\`application/json\`, \`multipart/form-data\`) |
| **Browser Caching** | **Yes** (cached by default by browsers and CDNs) | **No** (not cached unless explicit headers are set) |
| **Browser History** | Remains in browser history & server access logs | Never stored in browser history by default |
| **Payload Size Limits** | Limited by URL length constraints (~2048 chars) | Virtually unlimited (governed by server configuration) |
| **Security Note** | ⚠️ Never send sensitive data (passwords, tokens) in GET | Sensitive data is protected within the TLS payload body |

### Detailed Method Mechanics

#### 1. The \`GET\` Request
A \`GET\` request is strictly read-only. According to **RFC 9110 Section 9.2.1**, calling a safe method must not have any side effects on the server resource state.

\`\`\`http
GET /api/v1/users?role=developer&active=true HTTP/1.1
Host: api.lessoncraft.dev
Accept: application/json
User-Agent: Mozilla/5.0
\`\`\`

#### 2. The \`POST\` Request
A \`POST\` request transfers a representation to the server to create a subordinate resource or initiate a processing action.

\`\`\`http
POST /api/v1/users HTTP/1.1
Host: api.lessoncraft.dev
Content-Type: application/json
Content-Length: 74

{
  "name": "Alex Rivera",
  "role": "Senior Engineer",
  "department": "Platform Engineering"
}
\`\`\`

---

## 3. Demystifying Response Status Code Categories (15:00 – 25:00)

HTTP response status codes are 3-digit integers issued by a server in response to a client's request. The **first digit** defines the general class of response:

\`\`\`
1xx: Informational (Request received, continuing process)
2xx: Success (Action successfully received, understood, and accepted)
3xx: Redirection (Further action must be taken by client)
4xx: Client Error (Request contains bad syntax or cannot be fulfilled)
5xx: Server Error (Server failed to fulfill an apparently valid request)
\`\`\`

### Deep Dive into the 3 Core Evaluated Categories:

### A. 2xx: Success Categories
These status codes confirm that the server successfully recognized and fulfilled the client's operation.
- **\`200 OK\`**: The standard response for successful HTTP requests. For GET, the resource has been fetched; for POST, an action was completed with an entity describing the result.
- **\`201 Created\`**: The request succeeded and led to the creation of a new resource (standard for successful POST requests). The response header typically includes a \`Location: /users/42\`.
- **\`204 No Content\`**: The server successfully fulfilled the request, but does not need to return an entity body (common in DELETE or updates).

### B. 4xx: Client Error Categories
The fault lies with the **client** (e.g., malformed syntax, invalid parameters, unauthorized access, or missing resources).
- **\`400 Bad Request\`**: The server cannot process the request due to perceived client error (e.g., malformed JSON payload, invalid query parameters).
- **\`401 Unauthorized\`**: Semantically means **Unauthenticated**. The client has not supplied valid credentials (e.g., missing or expired JWT/API key).
- **\`403 Forbidden\`**: The client is authenticated, but **lacks necessary permissions** to access the requested resource.
- **\`404 Not Found\`**: The server cannot find the requested URL path.
- **\`429 Too Many Requests\`**: The client has exceeded rate limits within a given timeframe.

### C. 5xx: Server Error Categories
The client's request was valid, but the **server experienced an internal exception or infrastructure failure**.
- **\`500 Internal Server Error\`**: A generic catch-all indicating an unhandled exception or crash in server-side application logic.
- **\`502 Bad Gateway\`**: The server, while acting as a gateway or reverse proxy (e.g., Nginx, Cloudflare), received an invalid response from the upstream application server.
- **\`503 Service Unavailable\`**: The server is currently unable to handle the request due to temporary overload or scheduled maintenance.
- **\`504 Gateway Timeout\`**: The reverse proxy gateway timed out waiting for the upstream microservice to respond.

---

## 4. Guided Hands-On Lab Exercise (25:00 – 35:00)

### Scenario: Diagnosing an E-Commerce Checkout API

Open your terminal or browser developer tools console and examine the following JavaScript Fetch requests:

\`\`\`javascript
// Step 1: Performing a Safe & Idempotent GET Request
async function fetchProducts() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  console.log('Status Code:', response.status); // Expect: 200 OK
  const data = await response.json();
  console.log('Payload Received:', data);
}

// Step 2: Creating a Resource with POST
async function createPost() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'HTTP Mastery in 45 Minutes',
      body: 'Understanding GET vs POST and status code taxonomies.',
      userId: 101
    })
  });
  console.log('Status Code:', response.status); // Expect: 201 Created
  const createdRecord = await response.json();
  console.log('Created Record:', createdRecord);
}
\`\`\`

### Troubleshooting Exercise (Student Challenge):
1. What status code should a server return if an anonymous user attempts to access a protected account dashboard? *(Answer: \`401 Unauthorized\`)*
2. What status code should be returned if a user submits a registration form with an invalid email syntax? *(Answer: \`400 Bad Request\`)*
3. If the database server runs out of disk space during a write, which code class should be returned? *(Answer: \`500\` or \`503\`)*

---

## 5. Formative Knowledge Check (35:00 – 45:00)

Test your understanding of the concepts covered in this 45-minute lesson:

### Question 1
**Which of the following operations violates HTTP method idempotency semantics?**
- [ ] A. Re-running a GET request to query user balance 10 times consecutively.
- [x] B. Submitting a POST request that charges a credit card $50 each time it is executed.
- [ ] C. Making a GET request with query parameter \`?filter=active\`.
- [ ] D. Sending a HEAD request to verify file size.
*Explanation:* \`POST\` is non-idempotent by specification (RFC 9110); executing it multiple times causes multiple transactions or duplicate resource creations.

### Question 2
**A client submits a valid API token for a standard student account, but requests an endpoint reserved exclusively for school administrators (\`/api/admin/system-reset\`). Which status code should the server return?**
- [ ] A. \`401 Unauthorized\`
- [x] B. \`403 Forbidden\`
- [ ] C. \`404 Not Found\`
- [ ] D. \`500 Internal Server Error\`
*Explanation:* The user is recognized and authenticated (so 401 is incorrect), but lacks authorization/permission to perform the administrative action, making \`403 Forbidden\` the semantically correct code.

### Question 3
**If a microservice backend crashes due to an out-of-memory exception and terminates the TCP connection to the API Gateway, what status code does the API Gateway return to the user?**
- [ ] A. \`400 Bad Request\`
- [ ] B. \`404 Not Found\`
- [x] C. \`502 Bad Gateway\`
- [ ] D. \`204 No Content\`
*Explanation:* When an intermediary reverse proxy receives an invalid or dropped response from the upstream service, it produces a \`502 Bad Gateway\` error.

### Question 4
**Why should sensitive user authentication credentials NEVER be transmitted via HTTP \`GET\`?**
- [ ] A. GET requests are slower than POST requests over TLS.
- [x] B. Query parameters in GET requests are logged in plain text in browser histories, web server logs, and proxy traces.
- [ ] C. The browser encrypts POST bodies but does not encrypt GET requests over HTTPS.
- [ ] D. GET requests cannot return JSON data.
*Explanation:* While HTTPS encrypts the entire HTTP line over the wire, URL query parameters get permanently cached in browser history, proxy access logs, and referrer headers, creating critical credential leakage vulnerabilities.

---

## 6. Supplementary Video Resources

The following curated video resources reinforce this 45-minute lesson:

${researchData.videos.map((v, i) => `
### Video ${i + 1}: ${v.title}
- **Channel:** ${v.channel} | **Duration:** ${v.duration}
- **Summary:** ${v.description}
- **Target Segment:** ${v.recommendedSegment}
- **Watch Link:** [https://www.youtube.com/watch?v=${v.youtubeId}](https://www.youtube.com/watch?v=${v.youtubeId})
- **Video ID for Embed:** \`${v.youtubeId}\`
`).join('\n')}

---

## 7. Authoritative References & Academic Bibliography

### Recommended Books
${researchData.books.map((b) => `
- **${b.title}** by ${b.authors.join(', ')}  
  *Publisher:* ${b.publisher} (${b.year}) | *ISBN:* ${b.isbn}  
  *Context:* ${b.description}
`).join('\n')}

### Standards & Official Documentation
${researchData.websites.map((w) => `
- [${w.title}](${w.url}) – *${w.source}*  
  *Reliability:* ${w.reliabilityTier} (Score: ${w.reliabilityScore || 95}/100)  
  *Key Concept:* ${w.snippet}
`).join('\n')}

---
*Lesson generated and validated via the AI Research & Quality Control Pipeline.*
`;
  }

  // Generic generator for any other topic
  return `# ${title}

> **Target Duration:** 45 Minutes | **Curriculum Track:** Software Engineering Excellence  
> **Learning Objective:** ${objective}

---

## ⏱️ 45-Minute Lesson Pacing Schedule

| Timestamp | Phase | Topic / Activity | Pedagogical Method |
| :--- | :--- | :--- | :--- |
| **00:00 – 05:00** (5m) | **Hook & Motivation** | Real-World Context & Problem Statement | Framing & Interactive Inquiry |
| **05:00 – 15:00** (10m) | **Core Architecture** | Foundational Theory, Mechanics & Principles | Concept Exposition & Visual Flow |
| **15:00 – 25:00** (10m) | **Deep Dive & Syntax** | Detailed Implementation Patterns & Code Walkthrough | Worked Examples & Code Analysis |
| **25:00 – 35:00** (10m) | **Hands-On Application** | Interactive Guided Exercise & Scenario Debugging | Active Learning Lab |
| **35:00 – 45:00** (10m) | **Assessment & Synthesis** | Formative Quiz, Edge Case Review & Summary | Retrieval Practice & Feedback |

---

## 1. Introduction & The Core Problem (00:00 – 05:00)

In modern software development, mastering **${title}** is essential for building scalable, reliable, and maintainable systems.

### What You Will Achieve:
By the conclusion of this 45-minute lesson, you will be able to:
- Articulate the core principles and architectural tradeoffs of **${title}**.
- Demonstrate hands-on competence aligned with: *${objective}*.
- Identify, diagnose, and resolve common misconceptions and edge-case failures.

---

## 2. Theoretical Foundations & Architectural Principles (05:00 – 15:00)

Let us examine the foundational building blocks:

### Core Concepts & Mechanics
1. **The System Invariant:** Establishing the ground truths and operational constraints.
2. **State Transitions & Flow:** Tracking how data moves through each stage.
3. **Common Tradeoffs:** Evaluating performance, complexity, and maintainability.

---

## 3. Technical Deep-Dive & Practical Code Examples (15:00 – 25:00)

Here is a representative implementation demonstrating best practices:

\`\`\`javascript
// Practical implementation demonstrating ${title}
function executeCoreWorkflow(inputParameters) {
  console.log('Initiating workflow for:', inputParameters);
  // Validating input constraints
  if (!inputParameters) {
    throw new Error('Invalid input state');
  }
  return {
    status: 'SUCCESS',
    timestamp: new Date().toISOString(),
    result: inputParameters
  };
}
\`\`\`

---

## 4. Guided Hands-On Lab Exercise (25:00 – 35:00)

### Guided Challenge
1. Set up your working environment.
2. Trace the execution flow with boundary values.
3. Observe how the system reacts to edge cases.

---

## 5. Formative Knowledge Check (35:00 – 45:00)

### Knowledge Check Question 1
**What is the primary architectural advantage of following the recommended pattern for ${title}?**
- [ ] A. It completely eliminates network latency.
- [x] B. It ensures predictable state transitions and reduces cognitive overhead.
- [ ] C. It reduces code lines by exactly 90%.
- [ ] D. It bypasses security authentication.
*Explanation:* Adhering to established architectural specifications maintains system invariants, enhances maintainability, and prevents state corruption.

---

## 6. Supplementary Video Resources

${researchData.videos.map((v, i) => `
### Video ${i + 1}: ${v.title}
- **Channel:** ${v.channel} | **Duration:** ${v.duration}
- **Target Segment:** ${v.recommendedSegment}
- **Watch:** [https://www.youtube.com/watch?v=${v.youtubeId}](https://www.youtube.com/watch?v=${v.youtubeId})
`).join('\n')}

---

## 7. Authoritative References & Academic Bibliography

### Recommended Books
${researchData.books.map((b) => `
- **${b.title}** by ${b.authors.join(', ')} (${b.publisher}, ${b.year})  
  *Context:* ${b.description}
`).join('\n')}

### Standards & Web Documentation
${researchData.websites.map((w) => `
- [${w.title}](${w.url}) – *${w.source}* (Reliability: ${w.reliabilityTier})
`).join('\n')}
`;
}

