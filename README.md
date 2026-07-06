
### Data Flow
1. User types question in frontend
2. Frontend sends request to backend API
3. Backend generates SQL using Gemini AI (or fallback)
4. Backend executes SQL on user's database
5. Results returned to frontend
6. Results displayed in beautiful table

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.8+ | Core language |
| FastAPI | 0.104.1 | Web framework |
| Uvicorn | 0.24.0 | ASGI server |
| PostgreSQL | 14+ | Production database |
| asyncpg | 0.29.0 | PostgreSQL driver |
| Google Gemini AI | latest | SQL generation |
| JWT | 3.3.0 | Authentication |
| WebSocket | - | Real-time updates |
| OpenPyXL | 3.1.2 | Excel export |
| python-dotenv | 1.0.0 | Environment variables |
| passlib | 1.7.4 | Password hashing |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Framework |
| Vite | 4.5.0 | Build tool |
| Axios | 1.6.0 | HTTP client |
| React Router | 6.20.0 | Routing |
| WebSocket API | - | Real-time updates |
| CSS3 | - | Styling |

### Deployment & Infrastructure
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Neon | PostgreSQL database |
| GitHub | Version control |

---

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- PostgreSQL database (or Neon account)
- Google Gemini API key (optional - fallback works without)

### Step 1: Clone Repository

```bash
git clone https://github.com/Nayaka-M/sqlagent.git
cd sql-query-agent-python


https://sql-query-agent-n0odzocg9-nayakamicheal-1161s-projects.vercel.app/
