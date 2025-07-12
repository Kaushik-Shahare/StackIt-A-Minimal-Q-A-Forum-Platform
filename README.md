# 🧠 StackIt – A Minimal Q&A Platform

StackIt is a fully functional, community-driven question-and-answer platform designed for structured knowledge sharing and collaborative learning. This project is now **complete** and production-ready.

---

## 🚀 Project Completion Report

### Overview
StackIt provides a seamless Q&A experience inspired by platforms like Stack Overflow, with a modern UI, robust backend, and a feature-rich editor. The platform supports user authentication, real-time notifications, advanced moderation tools, and a highly interactive frontend.

---

## 📁 Project Structure

```
StackIt-A-Minimal-Q-A-Forum-Platform/
├── client/      # Frontend: Next.js, JavaScript, Tailwind CSS, TipTap
├── StackIt/     # Backend: Django REST API
└── README.md
```

---

## ⚙️ Technologies Used

- **Frontend:** Next.js, JavaScript, Tailwind CSS, TipTap, Heroicons, Lucide
- **Backend:** Django, Django REST Framework
- **Database:** SQLite (dev), PostgreSQL (prod-ready)
- **Other:** JWT Authentication, RESTful API, WebSockets (for notifications)

---

## 👥 User Features
- **Ask Questions:**
  - Title (short and descriptive)
  - Multi-tag input
  - Rich description using **TipTap**
- **View & Filter Questions:**
  - Browse all questions
  - Filter by tags
- **Answer Questions:**
  - Rich text editor for answers
- **Voting:**
  - Upvote/downvote answers
- **Accept Answer:**
  - Mark an answer as the best solution
- **Notifications:**
  - When someone answers your question
  - When someone comments on your answer
  - When you are mentioned via `@username`
- **Authentication:**
  - Register, login, logout, password reset
  - Only authenticated users can ask, answer, vote, or comment

---

## 🛠 Rich Text Editor (TipTap)
- Bold, Italic, Strikethrough
- Bullet and Numbered Lists
- Emojis
- Hyperlink insertion
- Image upload
- Text alignment (Left, Center, Right)

---

## 🛡 Admin Features
- Reject inappropriate questions
- Ban users (with confirmation modal)
- Monitor all question statuses (Pending, Accepted, Cancelled)
- Send platform-wide messages
- Download activity & feedback reports (mock)

---

## 🔐 Authentication
- JWT-based authentication (backend)
- Frontend session managed via localStorage
- Secure endpoints for all user actions

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

## 🖥 Backend Setup

Located in the `StackIt/` folder.

```bash
cd StackIt
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

API available at: [http://localhost:8000/api/](http://localhost:8000/api/)

---

## 🔐 Authentication

| Action            | Method | Endpoint                         | Auth Required | Description                      |
|-------------------|--------|----------------------------------|---------------|----------------------------------|
| Register          | POST   | `/api/auth/register/`           | ❌ No         | Register a new user              |
| Login             | POST   | `/api/auth/login/`              | ❌ No         | Login and retrieve tokens        |
| Logout            | POST   | `/api/auth/logout/`             | ✅ Yes        | Logout user                      |
| Forgot Password   | POST   | `/api/auth/forgot-password/`    | ❌ No         | Send reset link to user email    |

---

## 👤 Profile Management

| Action           | Method | Endpoint               | Auth Required | Description            |
|------------------|--------|------------------------|---------------|------------------------|
| Get Profile      | GET    | `/api/auth/profile/`   | ✅ Yes        | Get logged-in user info |
| Update Profile   | PUT    | `/api/auth/profile/`   | ✅ Yes        | Update user details     |

---

## ❓ Questions

| Action               | Method | Endpoint                               | Auth Required | Description                               |
|----------------------|--------|----------------------------------------|---------------|-------------------------------------------|
| List Questions       | GET    | `/api/forum/questions/`                | ❌ No         | Fetch all questions                       |
| Create Question      | POST   | `/api/forum/questions/`                | ✅ Yes        | Post a new question                        |
| Get Question Detail  | GET    | `/api/forum/questions/:slug/`          | ❌ No         | Get question by slug                       |
| Update Question      | PUT    | `/api/forum/questions/:slug/`          | ✅ Yes        | Update question (owner only)              |
| Delete Question      | DELETE | `/api/forum/questions/:slug/`          | ✅ Yes        | Delete question (owner/admin only)        |
| Upvote Question      | POST   | `/api/forum/questions/:slug/upvote/`   | ✅ Yes        | Toggle upvote                              |
| Downvote Question    | POST   | `/api/forum/questions/:slug/downvote/` | ✅ Yes        | Toggle downvote                            |

---

## 💬 Answers

| Action               | Method | Endpoint                                                   | Auth Required | Description                                |
|----------------------|--------|------------------------------------------------------------|---------------|--------------------------------------------|
| List Answers         | GET    | `/api/forum/questions/:question_slug/answers/`            | ❌ No         | Get answers for a question                 |
| Post Answer          | POST   | `/api/forum/questions/:question_slug/answers/`            | ✅ Yes        | Submit a new answer                         |
| Update Answer        | PUT    | `/api/forum/questions/:question_slug/answers/:id/`        | ✅ Yes        | Edit an answer (owner only)                |
| Delete Answer        | DELETE | `/api/forum/questions/:question_slug/answers/:id/`        | ✅ Yes        | Remove an answer (owner/admin only)        |
| Accept Answer        | POST   | `/api/forum/questions/:question_slug/answers/:id/accept/` | ✅ Yes        | Mark answer as accepted (question owner)   |
| Upvote Answer        | POST   | `/api/forum/questions/answers/{{answer_id}}/upvote/`      | ✅ Yes        | Toggle upvote on answer                    |
| Downvote Answer      | POST   | `/api/forum/questions/:question_slug/answers/:id/downvote/` | ✅ Yes      | Toggle downvote on answer                  |

---

## 💭 Comments

| Action            | Method | Endpoint                                                                 | Auth Required | Description                                  |
|-------------------|--------|--------------------------------------------------------------------------|---------------|----------------------------------------------|
| List Comments     | GET    | `/api/forum/questions/:question_slug/answers/:answer_id/comments/`      | ❌ No         | Get comments for an answer                   |
| Post Comment      | POST   | `/api/forum/questions/:question_slug/answers/:answer_id/comments/`      | ✅ Yes        | Add comment to an answer                     |
| Update Comment    | PUT    | `/api/forum/questions/:question_slug/answers/:answer_id/comments/:id/`  | ✅ Yes        | Edit comment (owner only)                    |
| Delete Comment    | DELETE | `/api/forum/questions/:question_slug/answers/:answer_id/comments/:id/`  | ✅ Yes        | Remove comment (owner/admin only)           |

---

## 🏷️ Tags

| Action           | Method | Endpoint                          | Auth Required | Description                    |
|------------------|--------|-----------------------------------|---------------|--------------------------------|
| List Tags        | GET    | `/api/forum/tags/`                | ❌ No         | Get all tags with usage count  |
| Tag Detail       | GET    | `/api/forum/tags/:slug/`          | ❌ No         | Get tag by slug                |
| Create Tag       | POST   | `/api/forum/tags/`                | ✅ Yes (Admin) | Add a new tag                  |

---

## 🔔 Notifications

| Action                    | Method | Endpoint                                               | Auth Required | Description                       |
|---------------------------|--------|--------------------------------------------------------|---------------|-----------------------------------|
| List Notifications        | GET    | `/api/forum/notifications/`                            | ✅ Yes        | Retrieve user's notifications     |
| Unread Notification Count | GET    | `/api/forum/notifications/unread_count/`              | ✅ Yes        | Count unread notifications        |
| Mark Notification Read    | POST   | `/api/forum/notifications/:id/mark_as_read/`          | ✅ Yes        | Mark a single notification read   |
| Mark All Read             | POST   | `/api/forum/notifications/mark_all_as_read/`          | ✅ Yes        | Mark all notifications as read    |

---

## 🔧 Notes

- `:slug`, `:id`, `:question_slug`, and `:answer_id` are dynamic route parameters.
- Use Bearer token authentication (`Authorization: Bearer {{token}}`) where required.
- All requests/response bodies are JSON.

---

## 🧪 Postman Usage

To test these endpoints:
1. Import the `StackIt Copy.postman_collection.json` into Postman.
2. Set the environment variable `base_url` to your backend server URL.
3. Register or login to obtain a JWT token and set it as `token` in the environment.

---



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

Developed by @Scharfcsh @Kaushik_shahare @Golu-kumar @Aarya_Gupta

Contributions, forks, and ideas are welcome.

---
