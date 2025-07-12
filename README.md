# 🧠 StackIt – A Minimal Q&A Platform

StackIt is a minimal, community-driven question-and-answer platform designed for structured knowledge sharing and collaborative learning.

---

## 📁 Project Structure

```
stackit/
├── frontend/    # Frontend: Next.js, JavaScript, Tailwind CSS, TipTap
├── backend/     # Backend: REST API (to be implemented)
└── README.md
```

---

## ⚙️ Technologies Used

- Next.js  
- JavaScript  
- Tailwind CSS  
- TipTap  
- Heroicons / Lucide  
- Express.js or any backend framework  
- MongoDB / PostgreSQL (optional)

---

## ✨ Features

### 🧑‍💻 User Features

- Ask questions with title, tags, and rich text description
- Answer questions using rich formatting
- Upvote/downvote answers
- Mark one answer as accepted
- Tag filtering
- Notification system for:
  - New answers to your question
  - Comments on your answer
  - Mentions using `@username`

### ✍️ Rich Text Editor (TipTap)

Supports:
- Bold, Italic, Strikethrough
- Numbered & bullet lists
- Hyperlink insertion
- Image upload
- Emoji picker
- Text alignment: left, center, right

### 🛡 Admin Features

- Ban users
- Reject inappropriate questions
- View/manage pending/accepted/cancelled questions
- Send platform-wide announcements
- Download activity & feedback reports (mock)

---

## 🔐 Authentication (Frontend Only)

- Simulated via `localStorage`
- Only logged-in users can:
  - Ask a question
  - Post an answer
  - Vote or accept an answer
  - View notifications

---

## 📦 Frontend Setup

Located in the `frontend/` folder.

```bash
cd frontend
npm install
npm run dev
```

Access the app at: [http://localhost:3000](http://localhost:3000)

---

## 📡 Backend API Routes (To Be Implemented)

The following routes should be implemented in the `backend/` directory:

```http
POST   /api/questions                 # Submit a new question
GET    /api/questions                 # Get all questions
GET    /api/questions/:id            # Get question details
POST   /api/questions/:id/answers    # Post an answer
POST   /api/answers/:id/vote         # Upvote/downvote answer
POST   /api/questions/:id/accept     # Accept an answer
GET    /api/notifications            # Fetch notifications
POST   /api/notifications/read       # Mark as read
POST   /api/admin/ban-user           # Ban user
POST   /api/admin/reject-question    # Reject question
GET    /api/admin/reports            # Download reports
POST   /api/admin/message            # Send platform-wide message
```

---

## 🖼 Mockup / Design Reference

[🔗 Excalidraw Mockup](https://app.excalidraw.com/l/65VNwvy7c4X/9mhEahV0MQgN)

---

## ✅ To-Do

- [ ] Connect frontend to real backend
- [ ] Implement user authentication
- [ ] Add pagination and tag-based filters
- [ ] Create unit/integration tests
- [ ] Improve accessibility (a11y)
- [ ] Add dark mode

---

## 🧑‍💻 Author

Developed by [Your Name]  
Contributions, forks, and ideas are welcome.

---