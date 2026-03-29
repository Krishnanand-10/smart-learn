# 🧠 Exam Brain 

> **A comprehensive, AI-powered exam preparation engine for students and self-learners.**

Exam Brain is a smart web application where students can upload their class notes, syllabi, or past papers and instantly receive structured study materials. Through an intuitive glassmorphic interface, the app generates interactive summaries, practice questions, visual mnemonics ("MemCodes"), and tracks your proficiency across different subjects over time.

---

## 🎯 Product Vision
To provide a seamless, stress-free environment where unstructured study materials are automatically transformed into an optimized, high-yield learning experience. Targeted heavily towards college/university students seeking better grades and faster retention.

## 🗂️ Core Modules

1. **Input Hub (`/input-hub`)**
   - Accept all student content in one centralized place.
   - Upload UI for PDFs, Images (handwritten notes), and Question Papers.
   - Raw text parsing interfaces and manual topic logging.

2. **Smart Summarizer (`/summarizer`)**
   - Converts messy notes into collapsible, structured summaries.
   - Intelligent bullet-point formatting with key terms highlighted in bold.
   - "Simplify further" options to break down complex topics.

3. **Question Generator (`/question-generator`)**
   - Simulated test environments based on previous year question papers.
   - Immediate feedback styling on answered questions along with detailed explanations.

4. **MemCode Generator ⭐ (`/memcode`)**
   - Extracts key points from long answers to generate memorable acronym shortcuts.
   - Saves MemCodes to a personal collection.
   - Feature to generate associative AI mind-maps or images for topics to assist visual learners.

5. **Weak Area Tracker (`/tracker`)**
   - Performance analytics and mock exam logging.
   - Topic-wise heatmap visualization (Red = Weak, Green = Strong).
   - "Focus Topics" dashboard that dictates exactly what you need to review before exam day.

---

## 💻 Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Vanilla CSS (Premium Dark Mode, Glassmorphism, CSS Animations)
- **Icons**: Lucide React

## 🚀 Getting Started

First, install the dependencies to ensure everything runs smoothly:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a Pull Request.