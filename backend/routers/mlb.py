from fastapi import APIRouter
import httpx
from datetime import date
from services.cache import get_cache, set_cache

router = APIRouter()
MLB_BASE = "https://statsapi.mlb.com/api/v1"

@router.get("/")
async def get_mlb():
    cached = get_cache("mlb", "data")
    if cached:
        return cached

    today = date.today().isoformat()
    yesterday = date.fromordinal(date.today().toordinal() - 1).isoformat()
    sections = []

    async with httpx.AsyncClient(timeout=10) as client:
        for label, dt in [("Yesterday's results", yesterday), ("Today's schedule", today)]:
            try:
                resp = await client.get(f"{MLB_BASE}/schedule", params={
                    "sportId": 1,
                    "date": dt,
                    "hydrate": "team,linescore",
                })
                data = resp.json()
                games_raw = []
                for date_block in data.get("dates", []):
                    for g in date_block.get("games", []):
                        status = g.get("status", {}).get("abstractGameState", "")
                        home_team = g["teams"]["home"]["team"]["abbreviation"]
                        away_team = g["teams"]["away"]["team"]["abbreviation"]
                        home_score = g["teams"]["home"].get("score")
                        away_score = g["teams"]["away"].get("score")
                        game_time = g.get("gameDate", "")
                        games_raw.append({
                            "id": str(g["gamePk"]),
                            "home": {"name": home_team, "abbr": home_team},
                            "away": {"name": away_team, "abbr": away_team},
                            "score": {"home": home_score, "away": away_score} if home_score is not None else None,
                            "time": game_time[11:16] + " UTC" if game_time else "",
                            "status": "final" if status == "Final" else "scheduled",
                        })
                sections.append({"label": label, "games": games_raw})
            except Exception:
                sections.append({"label": label, "games": []})

    result = {"sections": sections}
    set_cache("mlb", "data", result)
    return result
