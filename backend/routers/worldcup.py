from fastapi import APIRouter
import httpx, os
from services.cache import get_cache, set_cache

router = APIRouter()
WC_BASE = "https://api.football-data.org/v4"

@router.get("/")
async def get_worldcup():
    cached = get_cache("worldcup", "data")
    if cached:
        return cached

    headers = {}
    if key := os.getenv("WC_API_KEY"):
        headers["X-Auth-Token"] = key

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(f"{WC_BASE}/competitions/WC/matches", params={
                "status": "SCHEDULED,LIVE,IN_PLAY,FINISHED",
            }, headers=headers)
            if resp.status_code == 200:
                matches = resp.json().get("matches", [])[:20]
                games = [{
                    "id": str(m["id"]),
                    "home": {"name": m["homeTeam"]["tla"] or m["homeTeam"]["name"], "abbr": m["homeTeam"]["tla"]},
                    "away": {"name": m["awayTeam"]["tla"] or m["awayTeam"]["name"], "abbr": m["awayTeam"]["tla"]},
                    "score": {
                        "home": m["score"]["fullTime"]["home"],
                        "away": m["score"]["fullTime"]["away"],
                    } if m["score"]["fullTime"]["home"] is not None else None,
                    "time": m.get("utcDate", "")[:10],
                    "status": m["status"].lower(),
                } for m in matches]
            else:
                games = []
    except Exception:
        games = []

    result = {
        "series": {
            "label": "2026 FIFA World Cup",
            "team1": "USA", "name1": "United States",  "wins1": 0,
            "team2": "MEX", "name2": "Mexico",          "wins2": 0,
        } if not games else None,
        "games_label": "Upcoming / Recent matches",
        "games": games or _fallback_wc_games(),
    }

    set_cache("worldcup", "data", result)
    return result

def _fallback_wc_games():
    return [
        {"id":"w1","home":{"name":"USA","abbr":"USA"},"away":{"name":"ENG","abbr":"ENG"},"score":None,"time":"Group stage","status":"scheduled"},
        {"id":"w2","home":{"name":"MEX","abbr":"MEX"},"away":{"name":"ARG","abbr":"ARG"},"score":None,"time":"Group stage","status":"scheduled"},
        {"id":"w3","home":{"name":"BRA","abbr":"BRA"},"away":{"name":"GER","abbr":"GER"},"score":None,"time":"Group stage","status":"scheduled"},
        {"id":"w4","home":{"name":"FRA","abbr":"FRA"},"away":{"name":"ESP","abbr":"ESP"},"score":None,"time":"Group stage","status":"scheduled"},
        {"id":"w5","home":{"name":"POR","abbr":"POR"},"away":{"name":"NED","abbr":"NED"},"score":None,"time":"Group stage","status":"scheduled"},
        {"id":"w6","home":{"name":"COL","abbr":"COL"},"away":{"name":"JAP","abbr":"JAP"},"score":None,"time":"Group stage","status":"scheduled"},
    ]
