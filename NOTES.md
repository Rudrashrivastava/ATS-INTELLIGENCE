# 📝 Development Notes: ATS Neural Analyzer

These notes serve as a deep-dive guide into the logic and architectural decisions made during the development of this project.

## 1. The "Cybernetic" UI Philosophy
- **Scroll-Free Experience**: We implemented a global CSS rule to hide scrollbars while maintaining scrolling functionality. This mimics a native "Iron Man HUD" or "Neural Link" interface.
- **Glassmorphism**: Heavy use of `backdrop-filter: blur()`, `linear-gradient` borders, and `rgba` backgrounds to create depth without clutter.

## 2. The AI Scoring Logic (ATSScoreService.java)
- **JSON Enforcement**: We moved away from fragile string parsing. The system now forces the AI to return a strict JSON schema. If the AI adds markdown blocks (```json), we have a custom cleaner that strips them before parsing.
- **Role Extraction**: The `marketSearchQuery` field is a critical "meta-extraction" step. It tells the AI: "Don't just score, tell me in 2 words what this person's market identity is."

## 3. Security & API Proxy Pattern
- **Why a Proxy?**: We never call OpenWebNinja or RapidAPI directly from the browser.
- **JobProxyController**: This acts as a security gate. It holds the secret API keys on the server and injects them into requests. It also handles **User-Agent Spoofing** to ensure the external APIs don't block our requests.
- **URL Encoding**: We implemented `URLEncoder` to handle job titles with spaces (e.g., "Junior Java Developer") so the URL never breaks.

## 4. Persistence & User State
- **History Mapping**: We created the `AnalysisResult` entity to bridge the gap between "Transient Scan" and "Persistent History."
- **One-to-Many**: Each `User` has a `List<AnalysisResult>`, allowing the Dashboard to show personalized data.

## 5. Potential Scaling Roadmaps
- **Multi-Model Fallback**: We could add logic to switch to OpenAI if Mistral is down.
- **Interactive Recharts**: The `categoryScores` (Format, Keywords, etc.) are ready to be connected to a Radar Chart or Bar Chart in the dashboard.
- **Email Notifications**: Integration for "Job Alerts" when the `marketSearchQuery` matches new listings in the background.

## 6. Known "API Secrets"
- **OpenWebNinja**: We switched from `company-jobs` to `job-search` for broader results.
- **Fallback Mode**: The frontend has a built-in "High-Fidelity Placeholder" system. If the external APIs fail (502), the app gracefully shows simulated jobs so the user experience never feels broken.

---
**Technical Lead Memo**
*Version: 1.0.1 (Cyber-Node Edition)*
