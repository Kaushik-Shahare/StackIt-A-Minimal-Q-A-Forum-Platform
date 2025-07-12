# StackIt - A Minimal Q&A Forum Platform

StackIt is a minimal question-and-answer platform that supports collaborative learning and structured knowledge sharing. It's designed to be simple, user-friendly, and focused on the core experience of asking and answering questions within a community.

## Features

### User Roles
- **Guest**: View all questions and answers
- **User**: Register, log in, post questions/answers, vote
- **Admin**: Moderate content

### Core Features
1. **Ask Question**
   - Title – Short and descriptive
   - Description – Written using a rich text editor
   - Tags – Multi-select input (e.g., React, JWT)

2. **Rich Text Editor Features**
   - Bold, Italic, Strikethrough
   - Numbered lists, Bullet points
   - Emoji insertion
   - Hyperlink insertion (URL)
   - Image upload
   - Text alignment – Left, Center, Right

3. **Answering Questions**
   - Users can post answers to any question
   - Answers can be formatted using the same rich text editor
   - Only logged-in users can post answers

4. **Voting & Accepting Answers**
   - Users can upvote or downvote answers
   - Question owners can mark one answer as accepted

5. **Tagging**
   - Questions must include relevant tags

6. **Notification System**
   - A notification icon (bell) appears in the top navigation bar
   - Users are notified when:
     - Someone answers their question
     - Someone comments on their answer
     - Someone mentions them using @username
   - The icon shows the number of unread notifications
   - Clicking the icon opens a dropdown with recent notifications

## Installation and Setup

### Prerequisites
- Python 3.10 or higher
- pip (Python package installer)

### Setup Instructions
1. Clone the repository
   ```
   git clone <repository-url>
   cd StackIt
   ```

2. Create a virtual environment
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables
   Create a `.env` file in the project root directory with the following variables:
   ```
   SECRET_KEY=your_secret_key
   DEBUG=True
   SITE_URL=http://localhost:8000
   ```

5. Run database migrations
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Create a superuser
   ```
   python manage.py createsuperuser
   ```

7. Run the development server
   ```
   python manage.py runserver
   ```

8. Access the application at `http://localhost:8000`
   - Admin panel: `http://localhost:8000/admin`
   - API endpoints: `http://localhost:8000/api/`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login and get JWT tokens
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Questions
- `GET /api/forum/questions/` - List all questions
- `POST /api/forum/questions/` - Create a new question
- `GET /api/forum/questions/{slug}/` - Get question details
- `PUT /api/forum/questions/{slug}/` - Update a question
- `DELETE /api/forum/questions/{slug}/` - Delete a question
- `POST /api/forum/questions/{slug}/upvote/` - Upvote a question
- `POST /api/forum/questions/{slug}/downvote/` - Downvote a question

### Answers
- `GET /api/forum/questions/{slug}/answers/` - List answers for a question
- `POST /api/forum/questions/{slug}/answers/` - Post an answer to a question
- `PUT /api/forum/questions/{slug}/answers/{id}/` - Update an answer
- `DELETE /api/forum/questions/{slug}/answers/{id}/` - Delete an answer
- `POST /api/forum/questions/{slug}/answers/{id}/accept/` - Accept an answer
- `POST /api/forum/questions/{slug}/answers/{id}/upvote/` - Upvote an answer
- `POST /api/forum/questions/{slug}/answers/{id}/downvote/` - Downvote an answer

### Comments
- `GET /api/forum/questions/{slug}/answers/{id}/comments/` - List comments for an answer
- `POST /api/forum/questions/{slug}/answers/{id}/comments/` - Post a comment on an answer
- `PUT /api/forum/questions/{slug}/answers/{id}/comments/{comment_id}/` - Update a comment
- `DELETE /api/forum/questions/{slug}/answers/{id}/comments/{comment_id}/` - Delete a comment

### Tags
- `GET /api/forum/tags/` - List all tags
- `GET /api/forum/tags/{slug}/` - Get tag details

### Notifications
- `GET /api/forum/notifications/` - List user notifications
- `GET /api/forum/notifications/unread_count/` - Get unread notification count
- `POST /api/forum/notifications/{id}/mark_as_read/` - Mark notification as read
- `POST /api/forum/notifications/mark_all_as_read/` - Mark all notifications as read

## Technologies Used
- **Backend**: Django, Django REST Framework
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: SQLite (development), PostgreSQL (production)
- **Storage**: Cloudinary (for media files)

## License
[MIT License](LICENSE)
