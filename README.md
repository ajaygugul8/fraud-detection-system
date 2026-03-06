# 🛡️ AI Fraud Detection System

> Real-time financial transaction fraud detection powered by XGBoost ML, Redis, FastAPI and React.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-ai--frauddetection.netlify.app-brightgreen)](https://ai-frauddetection.netlify.app)
[![API](https://img.shields.io/badge/API-fraud--api--7p8o.onrender.com-blue)](https://fraud-api-7p8o.onrender.com)
[![API Docs](https://img.shields.io/badge/API%20Docs-Swagger%20UI-orange)](https://fraud-api-7p8o.onrender.com/docs)

---

## 🔗 Live Links

| Service | URL |
|---|---|
| 🌐 Frontend Dashboard | https://ai-frauddetection.netlify.app |
| ⚡ Backend API | https://fraud-api-7p8o.onrender.com |
| 📄 API Documentation | https://fraud-api-7p8o.onrender.com/docs |

---

## 📌 What It Does

This system analyzes every financial transaction in real-time and:

- ✅ Scores each transaction using a trained **XGBoost ML model** (AUC: 0.9781)
- ✅ Detects suspicious patterns using **Redis velocity checks**
- ✅ Sends **live fraud alerts** to the dashboard via WebSockets
- ✅ Stores all transactions and alerts in **PostgreSQL**
- ✅ Protects routes with **Firebase Authentication**

---

## 🚀 How It Works

```
User submits transaction (React Dashboard)
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
        └─► Redis Pub/Sub            → broadcast alert via WebSocket
                  └── React Dashboard shows live 🚨 alert instantly
```

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite | Dashboard UI |
| Styling | Tailwind CSS | Styling |
| State | Zustand | Global state |
| Charts | Recharts | Fraud visualizations |
| Backend | FastAPI (Python) | REST API + WebSockets |
| Server | Uvicorn | ASGI server |
| ORM | SQLAlchemy + Alembic | Database models + migrations |
| Database | PostgreSQL | Store transactions, users, alerts |
| Cache | Redis | Velocity checks + score cache + Pub/Sub |
| ML Model | XGBoost | Fraud prediction (AUC: 0.9781) |
| Auth | Firebase Auth | User authentication |
| Backend Host | Render | Cloud hosting |
| Frontend Host | Netlify | CDN + auto-deploy |

---

## 🤖 ML Model Performance

| Metric | Value |
|---|---|
| Algorithm | XGBoost Classifier |
| Dataset | Kaggle Credit Card Fraud (284,807 transactions) |
| Fraud cases | 492 (0.17%) |
| Imbalance handling | scale_pos_weight = 577.9 |
| **AUC Score** | **0.9781** |
| Inference time | ~2ms per transaction |

---

## 📁 Project Structure

```
fraud-detection-system/
├── frontend/                        # React App (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Live fraud monitoring
│   │   │   ├── Transactions.jsx     # All transactions
│   │   │   ├── Alerts.jsx           # Fraud alerts
│   │   │   └── Login.jsx            # Firebase auth
│   │   ├── hooks/
│   │   │   └── useFraudAlerts.js    # WebSocket real-time hook
│   │   ├── services/
│   │   │   ├── api.js               # Axios API calls
│   │   │   └── firebase.js          # Firebase setup
│   │   └── store/
│   │       └── useStore.js          # Zustand global state
│
├── backend/                         # FastAPI App
│   ├── app/
│   │   ├── api/routes/
│   │   │   ├── transactions.py      # Transaction endpoints
│   │   │   ├── alerts.py            # Alert endpoints
│   │   │   ├── auth.py              # Auth routes
│   │   │   └── ws.py                # WebSocket endpoint
│   │   ├── core/
│   │   │   ├── config.py            # Settings
│   │   │   ├── security.py          # Firebase token verification
│   │   │   └── redis_client.py      # Redis client
│   │   ├── models/                  # SQLAlchemy models
│   │   ├── schemas/                 # Pydantic schemas
│   │   ├── services/
│   │   │   ├── fraud_engine.py      # XGBoost + Redis cache
│   │   │   ├── velocity_check.py    # Redis velocity rules
│   │   │   └── alert_publisher.py   # Redis Pub/Sub
│   │   └── main.py
│   └── requirements.txt
│
└── ml_training/                     # Model training
    ├── train.py                     # XGBoost training script
    └── data/                        # Kaggle dataset
```

---

## ⚙️ Local Development Setup

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | 18+ |
| Python | 3.11+ |
| PostgreSQL | 15 |
| Redis | 7+ |

### Step 1 — Clone Repository

```bash
git clone https://github.com/ajaygugul8/fraud-detection-system.git
cd fraud-detection-system
```

### Step 2 — Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 3 — Create `backend/.env`

```env
DATABASE_URL=postgresql://fraud_user:yourpassword@localhost/fraud_db
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ALLOWED_ORIGINS=["http://localhost:5173"]
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

### Step 4 — Run Migrations

```bash
alembic upgrade head
```

### Step 5 — Start Backend

```bash
uvicorn app.main:app --reload --port 8000
```

### Step 6 — Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Step 7 — Create `frontend/.env`

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

---

## 🧪 Test the API

Visit [https://fraud-api-7p8o.onrender.com/docs](https://fraud-api-7p8o.onrender.com/docs) and try:

```json
POST /api/transactions
{
  "amount": 9500.00,
  "merchant": "Unknown Store",
  "location": "unknown",
  "device_id": "device-001"
}
```

Expected response:
```json
{
  "id": "uuid-here",
  "amount": "9500.00",
  "fraud_score": 0.9234,
  "is_fraud": true,
  "status": "flagged"
}
```

---

## 🔐 Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create project → Enable **Email/Password** authentication (optional)
3. Enable **Google** authentication (required for Google login)
4. Add your Netlify domain to **Authorized Domains**
5. Copy config to `frontend/.env`
6. Download service account key → place in `backend/`

---

## 🔄 Fraud Detection Rules (Redis Velocity)

| Rule | Threshold | Window |
|---|---|---|
| Rapid transactions | > 5 transactions | 60 seconds |
| High frequency | > 20 transactions | 1 hour |
| High volume | > $5,000 spent | 1 hour |

---

## 👨‍💻 Developer

**Guguloth Ajay Kumar**
- GitHub: [@ajaygugul8](https://github.com/ajaygugul8)
- Project: [fraud-detection-system](https://github.com/ajaygugul8/fraud-detection-system)

---

## 📄 License

MIT License — feel free to use this project for learning and building.