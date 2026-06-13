# StatSphere

Live sports intelligence platform — NBA, NHL, MLB, NFL, World Cup.

## Project structure

```
statsphere/
├── frontend/     React + Vite + Tailwind
└── backend/      Python FastAPI
```

## Quick start

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add your API keys
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

App runs at http://localhost:5173
API runs at http://localhost:8000

## API keys needed

| Key                  | Source                              | Cost        |
|----------------------|-------------------------------------|-------------|
| ANTHROPIC_API_KEY    | console.anthropic.com               | Pay per use |
| NBA_API_KEY          | balldontlie.io                      | Free tier   |
| WC_API_KEY           | football-data.org                   | Free tier   |
| NHL_API_KEY          | api-web.nhle.com (official, no key) | Free        |
| MLB_API_KEY          | statsapi.mlb.com (official, no key) | Free        |

## Deployment

- **Frontend** → Vercel: connect GitHub repo, set root dir to `frontend`
- **Backend** → Railway: connect repo, set root dir to `backend`, add env vars

## Roadmap

- [ ] Player stat cards with trend charts
- [ ] Push notifications for game starts
- [ ] Historical comparisons ("How does this series compare to 2019?")
- [ ] User accounts + favorite teams
- [ ] Mobile app (React Native)
