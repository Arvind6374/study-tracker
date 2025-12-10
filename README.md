
# 📘 Study Tracker

A simple and elegant web app to track your daily study sessions.  
Built with **React + Vite**, deployed using **GitHub Actions (CI/CD)** to **GitHub Pages**.

---

## 🚀 Live Demo

👉 **https://arvind6374.github.io/study-tracker/**

---

## 📸 Screenshots

### 🖥 Main Dashboard
![Study Tracker Screenshot](./screenshot.png)

*(Add your screenshot into repo as `screenshot.png`)*

---

## ✨ Features

- ➕ Add new study sessions  
- ⏱ Track duration, subject, date & notes  
- ✔ Mark sessions as completed / Undo  
- 🔍 Filter sessions: All / Completed / Pending  
- 💾 LocalStorage persistence (coming soon)  
- 🎨 Dark UI with clean layout  
- 🚀 Automatic deployment using GitHub Actions  

---

## 🛠 Tech Stack

**Frontend**
- React  
- Vite  
- CSS  

**Tools / DevOps**
- Git & GitHub  
- GitHub Actions (CI/CD)  
- GitHub Pages Deployment  
- Node.js  

---

## 📦 Installation & Setup

```bash
git clone https://github.com/Arvind6374/study-tracker
cd study-tracker
npm install
npm run dev
````

---

## 📂 Project Structure

```
study-tracker/
 ├── src/
 │    ├── App.jsx
 │    ├── App.css
 │    ├── main.jsx
 │    ├── assets/
 │    └── components/   (future)
 ├── public/
 ├── .github/workflows/deploy.yml
 ├── package.json
 ├── vite.config.js
 └── README.md
```

---

## 🚀 Deployment (CI/CD)

This project uses **GitHub Actions** to automatically:

1. Install dependencies
2. Build the project
3. Upload build artifacts
4. Deploy to GitHub Pages

Workflow file:

```
.github/workflows/deploy.yml
```

Every push to `main` automatically updates the live website.

---

## 📌 Future Improvements

* Add charts for study analytics
* Add LocalStorage persistence
* Add edit/delete session functionality
* Add multiple subjects dashboard
* Add authentication (Firebase / Supabase)

---

## 🤝 Contributing

Feel free to fork the repo and submit a PR!

---

## 📜 License

MIT License.

