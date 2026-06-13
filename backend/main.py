from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import nba, nhl, mlb, nfl, worldcup, ai_preview, soccer, players

app = FastAPI(
    title="StatSphere API",
    description="Live sports data, AI-powered game previews, and player profiles",
    version="0.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(nba.router,        prefix="/api/nba",      tags=["NBA"])
app.include_router(nhl.router,        prefix="/api/nhl",      tags=["NHL"])
app.include_router(mlb.router,        prefix="/api/mlb",      tags=["MLB"])
app.include_router(nfl.router,        prefix="/api/nfl",      tags=["NFL"])
app.include_router(worldcup.router,   prefix="/api/worldcup", tags=["World Cup"])
app.include_router(soccer.router,     prefix="/api/soccer",   tags=["Soccer"])
app.include_router(players.router,    prefix="/api/players",  tags=["Players"])
app.include_router(ai_preview.router, prefix="/api/ai",       tags=["AI"])

@app.get("/health")
def health():
    return {"status": "ok", "version": "0.3.0"}
