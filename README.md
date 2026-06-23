# 7-remarkable-identities-3 🧠 [Asian Mode - Ultimate Edition]

An ultimate-tier interactive quiz web application designed to push algebraic thinking to its absolute limits ("Asian Mode"). Version 3 completely abandons static text parsing, introducing a custom, lightweight **Mini Algebraic Engine** built from scratch in pure JavaScript to compute, expand, distribute, and simplify complex 2nd and 3rd-degree polynomials on the fly.

🌐 **Live Demo:** [https://xn--msiu-goa8b.vn/github/7-remarkable-identities-3/](https://xn--msiu-goa8b.vn/github/7-remarkable-identities-3/)

---

## ✨ Ultimate Features (What's New in V3?)

- 🔥 **Complex Mix-Match Templates:** Questions are styled after elite mathematical olympiad structures. The system algorithmically blends multiple identities together or introduces external high-degree free terms (e.g., Cauchy's sum/difference of cubes, advanced factoring, hidden expansions).
- 🧮 **Built-in Mini Algebraic Engine:** Polynomials are fully decoupled from strings and stored as smart Object data structures (`{ "ExpX,ExpY": Coefficient }`). The core mathematical engine executes pure algebraic operations natively:
  - `polyAdd(p1, p2)`: Combines like-terms seamlessly.
  - `polySub(p1, p2)`: Performs polynomial subtraction arithmetic.
  - `polyMul(p1, p2)`: Evaluates FOIL/distributive distribution while compounding exponents.
  - `polyPow(p, n)`: Raises binomials to any arbitrary power (perfectly processing 2nd and 3rd degrees).
- 🧼 **Zero-Dependency Absolute Reduction:** The backend engine automatically evaluates the right-hand side (RHS) to form questions. If middle terms cancel out to `0` (e.g., $+6xy$ and $-6xy$), they instantly vanish. Leading or hidden coefficients of `1` are cleanly truncated (displaying `x²` instead of `1.x²`) according to strict textbook notations.
- 📐 **Diverse Variables & 3rd-Degree Mastery:** To maximize visual complexity, variables are dynamically swapped among pools of $(x, y)$, $(a, b)$, and $(u, v)$, layered with clean `<sup>3</sup>` HTML tags.
- 📊 **Real-time Performance Tracker:** Keeps a live score of your current run, displaying correct answers against total attempts along with your real-time accuracy rate (`%`).

---

## 📁 Technical Breakdown

The core system relies heavily on 3 clean, decoupled files:
- `index.html`: Workspace structuring utilizing designated HTML tags for pristine mathematical rendering.
- `style.css`: Modern minimalist aesthetic with smooth color feedback states (green/red) for rapid validation.
- `script.js`: **The Ultimate Upgrade.** Houses the core Polynomial Dictionary Engine and 8 high-difficulty math templates.

---

## 🚀 Getting Started Locally

Run this application instantly under any local environment with zero dependencies. No NodeJS, no bundling compilers, and no external CDN mathematical libraries (such as Math.js or Algebrite) required:

1. **Clone this repository:**
   ```bash
   git clone [https://github.com/lemasieu/7-remarkable-identities-3.git](https://github.com/lemasieu/7-remarkable-identities-3.git)
   ```
2. **Navigate into the project directory:**
   ```bash
   cd 7-remarkable-identities-3
   ```
3. **Launch the application**
Simply double-click the `index.html` file to open and run it instantly in any modern web browser.

## 🛠️ Deployment / Git Push Guide
If you want to initialize Git locally and push the source code to your GitHub repository `lemasieu/7-remarkable-identities-3`, execute the following commands in your terminal:
   ```bash
# Initialize local git profile
git init

# Stage all updated file structures
git add .

# Commit with a clear scope
git commit -m "Initial commit: Deploy 7 Remarkable Identities V2 with coefficient reduction"

# Enforce default branch naming convention
git branch -M main

# Link to the secondary repository
git remote add origin [https://github.com/lemasieu/7-remarkable-identities-3.git](https://github.com/lemasieu/7-remarkable-identities-3.git)

# Push upstream to GitHub
git push -u origin main
   ```

## 📝 License
This project is licensed under the terms of the MIT License. You are completely free to use, modify, and distribute it.
Created by Gemini with my idea.
