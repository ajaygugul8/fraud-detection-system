# 🛡️ Real-Time Fraud Detection System

A full-stack, production-grade fraud detection system that analyzes financial transactions in real-time using XGBoost ML, Redis velocity checks, WebSocket live alerts, and a React dashboard.

---

## 🚀 Live Demo

| Service | URL |
|---|---|
| Frontend | `https://your-app.netlify.app` |
| Backend API | `https://fraud-api.onrender.com` |
| API Docs | `https://fraud-api.onrender.com/docs` |

---

## 🧠 How It Works

Every transaction goes through this pipeline:

```
User submits transaction (React)
        │
        ▼
FastAPI receives POST /api/transactions
        │
        ├─► Redis Velocity Check     → too many txns in 60s? too much $ in 1hr?
        │
        ├─► Redis Cache Lookup       → score cached? return instantly
        │         └── Cache Miss ──► XGBoost Inference → cache result 5 min
        │
        ├─► Combine ML + Velocity    → final fraud score
        │
        ├─► Save to PostgreSQL       → persist transaction + score
        │
        └─► Redis Pub/Sub            → broadcast alert to all WebSocket clients
                  └── React Dashboard shows live 🚨 alert instantly
```

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite | Dashboard UI |
| Styling | Tailwind CSS | Styling |
| State | Zustand | Global state management |
| HTTP | Axios + React Query | API calls |
| Charts | Recharts | Fraud visualizations |
| Backend | FastAPI (Python) | REST API + WebSockets |
| Server | Uvicorn | ASGI server |
| ORM | SQLAlchemy + Alembic | Database models + migrations |
| Database | PostgreSQL | Store transactions, users, alerts |
| Cache | Redis | Velocity checks + fraud score cache + Pub/Sub |
| ML Model | XGBoost | Fraud prediction (AUC: 0.9781) |
| Auth | Firebase Auth | User authentication |
| Backend Host | Render | Cloud hosting |
| Frontend Host | Netlify | CDN + auto-deploy |
| CI/CD | GitHub Actions | Automated test + deploy pipeline |

---

## 📁 Project Structure

```
fraud-detection-system/
├── frontend/                        # React App (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   ├── TransactionTable/
│   │   │   ├── AlertPanel/
│   │   │   └── Charts/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Main dashboard with KPIs + live alerts
│   │   │   ├── Transactions.jsx     # All transactions table
│   │   │   ├── Alerts.jsx           # Fraud alerts review
│   │   │   └── Login.jsx            # Firebase auth login
│   │   ├── hooks/
│   │   │   └── useFraudAlerts.js    # WebSocket real-time hook
│   │   ├── services/
│   │   │   ├── api.js               # Axios API calls
│   │   │   └── firebase.js          # Firebase auth setup
│   │   └── store/
│   │       └── useStore.js          # Zustand global state
│   ├── .env                         # Frontend environment variables
│   └── package.json
│
├── backend/                         # FastAPI App
│   ├── app/
│   │   ├── api/routes/
│   │   │   ├── transactions.py      # POST/GET transactions
│   │   │   ├── alerts.py            # GET fraud alerts
│   │   │   ├── auth.py              # Auth routes
│   │   │   └── ws.py                # WebSocket endpoint
│   │   ├── core/
│   │   │   ├── config.py            # Environment settings
│   │   │   ├── security.py          # Firebase token verification
│   │   │   └── redis_client.py      # Redis async client
│   │   ├── models/
│   │   │   ├── user.py              # SQLAlchemy User model
│   │   │   ├── transaction.py       # SQLAlchemy Transaction model
│   │   │   └── alert.py             # SQLAlchemy FraudAlert model
│   │   ├── schemas/
│   │   │   └── transaction.py       # Pydantic request/response schemas
│   │   ├── services/
│   │   │   ├── fraud_engine.py      # XGBoost inference + Redis cache
│   │   │   ├── velocity_check.py    # Redis velocity rules
│   │   │   └── alert_publisher.py   # Redis Pub/Sub publisher
│   │   ├── db/
│   │   │   ├── base.py              # SQLAlchemy Base
│   │   │   └── session.py           # DB session + get_db()
│   │   └── main.py                  # FastAPI app entry point
│   ├── alembic/                     # Database migrations
│   ├── tests/                       # pytest tests
│   ├── requirements.txt
│   └── .env                         # Backend environment variables
│
├── ml_training/                     # Offline model training
│   ├── data/                        # Kaggle dataset (gitignored)
│   ├── train.py                     # XGBoost training script
│   └── evaluate.py
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml                # GitHub Actions pipeline
├── render.yaml                      # Render deployment config
└── .gitignore
```

---

## ⚙️ Local Development Setup

### Prerequisites

Make sure these are installed on your machine:

| Tool | Version | Download |
|---|---|---|
| Node.js | 18+ | nodejs.org |
| Python | 3.11+ | python.org |
| PostgreSQL | 15+ | postgresql.org |
| Redis | 7+ | redis.io |
| Git | Latest | git-scm.com |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/fraud-detection-system.git
cd fraud-detection-system
```

---

### Step 2 — PostgreSQL Setup

```bash
# Open PostgreSQL shell
psql -U postgres

# Run these commands inside psql
CREATE DATABASE fraud_db;
CREATE USER fraud_user WITH PASSWORD 'yourpassword123';
GRANT ALL PRIVILEGES ON DATABASE fraud_db TO fraud_user;
\q
```

---

### Step 3 — Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your actual values (see Environment Variables section)
```

---

### Step 4 — Run Database Migrations

```bash
# From backend/ folder with venv activated
alembic upgrade head

# Verify tables created
psql -U fraud_user -d fraud_db -c "\dt"
# Should show: users, transactions, fraud_alerts, alembic_version
```

---

### Step 5 — Train the XGBoost Model

```bash
cd ml_training

# Download dataset from Kaggle
# First setup kaggle CLI: https://kaggle.com/settings → API → Download kaggle.json
mkdir -p ~/.kaggle
mv ~/Downloads/kaggle.json ~/.kaggle/kaggle.json
chmod 600 ~/.kaggle/kaggle.json

# Download and extract dataset
mkdir -p data
cd data
kaggle datasets download -d mlg-ulb/creditcardfraud
unzip creditcardfraud.zip
cd ..

# Install ML dependencies
pip install xgboost scikit-learn pandas numpy

# Train the model (takes ~2-3 minutes)
python3 train.py

# Expected output:
# AUC Score: 0.9781
# ✅ Model saved to ../backend/app/ml/model.pkl
```

---

### Step 6 — Start Redis

```bash
# Mac
brew services start redis

# Ubuntu/WSL
sudo service redis-server start

# Verify
redis-cli ping   # Should output: PONG
```

---

### Step 7 — Start Backend Server

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Should show:
# ✅ XGBoost model loaded
# INFO: Uvicorn running on http://127.0.0.1:8000
```

API docs available at: `http://localhost:8000/docs`

---

### Step 8 — Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your Firebase config values

# Start dev server
npm run dev
# Running at: http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend — `backend/.env`

```env
DATABASE_URL=postgresql://fraud_user:yourpassword123@localhost/fraud_db
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-64-char-random-secret-key
ALGORITHM=HS256
ALLOWED_ORIGINS=["http://localhost:5173"]
FIREBASE_PROJECT_ID=your-firebase-project-id
```

Generate a SECRET_KEY:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

---

## 🔑 Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project: `fraud-detection-system`
3. Go to **Authentication** → **Get started** → Enable **Email/Password**
4. Go to **Project Settings** → **General** → **Your apps** → Register Web app → copy config into `frontend/.env`
5. Go to **Project Settings** → **Service Accounts** → **Generate new private key** → rename to `firebase-service-account.json` → place in `backend/` folder

> ⚠️ Never commit `firebase-service-account.json` to GitHub — it's already in `.gitignore`

---

## 🧪 Testing the API

With the backend running, open `http://localhost:8000/docs` and test:

**Create a high-risk transaction:**
```json
POST /api/transactions
{
  "amount": 9500.00,
  "merchant": "Unknown Store",
  "location": "unknown",
  "device_id": "device-001"
}
```

**Expected response:**
```json
{
  "id": "uuid-here",
  "amount": "9500.00",
  "fraud_score": 0.9234,
  "is_fraud": true,
  "status": "flagged",
  "timestamp": "2026-03-03T..."
}
```

---

## ☁️ Deployment

### Backend → Render

1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Create **PostgreSQL** instance → name: `fraud-db`
3. Create **Redis** instance → name: `fraud-redis`
4. Create **Web Service** → connect your GitHub repo
5. Set build command: `pip install -r requirements.txt`
6. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
7. Add all environment variables from `backend/.env`

### Frontend → Netlify

1. Go to [netlify.com](https://netlify.com) → Sign up with GitHub
2. **Add new site** → Import from Git → select repo
3. Base directory: `frontend`
4. Build command: `npm run build`
5. Publish directory: `frontend/dist`
6. Add all `VITE_` environment variables
7. Set `VITE_API_URL` to your Render backend URL

---

## 🔄 CI/CD Pipeline

Every push to `main` automatically:

1. ✅ Runs backend tests (pytest)
2. ✅ Builds frontend (npm run build)
3. 🚀 Deploys backend to Render
4. 🚀 Deploys frontend to Netlify

Required GitHub Secrets (Settings → Secrets → Actions):

| Secret | Where to get it |
|---|---|
| `RENDER_DEPLOY_HOOK_URL` | Render → Service → Settings → Deploy Hook |
| `NETLIFY_AUTH_TOKEN` | Netlify → User Settings → Personal Access Tokens |
| `NETLIFY_SITE_ID` | Netlify → Site Settings → General → Site ID |

---

## 🤖 ML Model Details

| Property | Value |
|---|---|
| Algorithm | XGBoost Classifier |
| Dataset | Kaggle Credit Card Fraud (284,807 transactions) |
| Fraud cases | 492 (0.17%) — extreme class imbalance |
| Imbalance handling | `scale_pos_weight = 577.9` |
| AUC Score | **0.9781** |
| Inference time | ~2ms per transaction |
| Cache TTL | 5 minutes (Redis) |

### Fraud Detection Rules (Redis Velocity)

| Rule | Threshold | Window |
|---|---|---|
| Rapid transactions | > 5 transactions | 60 seconds |
| High frequency | > 20 transactions | 1 hour |
| High volume amount | > $5,000 spent | 1 hour |

---

## 📊 Database Schema

```
users
  id, email, hashed_password, role, firebase_uid, created_at

transactions
  id, user_id, amount, merchant, location, device_id,
  timestamp, fraud_score, is_fraud, status

fraud_alerts
  id, transaction_id, reason, confidence,
  reviewed_by, review_status, created_at
```

---

## 🛠️ Running Tests

```bash
cd backend
source venv/bin/activate
pytest tests/ -v
```

---

## 📦 Key Dependencies

### Backend
```
fastapi, uvicorn, sqlalchemy, alembic, psycopg2-binary,
redis[asyncio], xgboost, scikit-learn, firebase-admin,
pydantic-settings, python-jose, passlib
```

### Frontend
```
react, react-router-dom, axios, zustand, recharts,
@tanstack/react-query, firebase, tailwindcss, lucide-react
```

---

## 👨‍💻 Author

**Guguloth Ajaykumar**
- GitHub: [@ajaygugul8](https://github.com/ajaygugul8)
