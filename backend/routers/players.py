"""
Player profile router.

GET  /api/players/search?q=&sport=       search players
GET  /api/players/featured               curated list for homepage
GET  /api/players/{id}                   full profile
GET  /api/players/{id}/matches?season=   match log
GET  /api/players/{id}/stats?season=     season stats
GET  /api/players/{id}/news              news & rumors
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from services.player_data import (
    fetch_soccer_player, fetch_soccer_player_fixtures,
    search_soccer_players, fetch_nba_player, search_nba_players,
    get_mock_player, list_mock_players, MOCK_PLAYERS,
)
from services.cache import get_cache, set_cache

router = APIRouter()

# ── Search ────────────────────────────────────────────────────────────────────
@router.get("/search")
async def search_players(
    q: str = Query(..., min_length=2),
    sport: Optional[str] = Query(None),
):
    cache_key = f"search_{sport}_{q}"
    cached = get_cache("players", cache_key)
    if cached:
        return cached

    results = []

    # Always include matching mock players first (instant)
    ql = q.lower()
    for p in list_mock_players():
        if ql in p["name"].lower() or ql in p["team"].lower():
            results.append({**p, "source": "demo"})

    # Then real APIs
    if not sport or sport == "soccer":
        real = await search_soccer_players(q)
        results += [{"id": f"soccer_{p['id']}", "name": p["name"], "sport": "soccer",
                     "team": p["team"]["name"], "photo": p["photo"], "source": "live"} for p in real]

    if not sport or sport == "basketball":
        real = await search_nba_players(q)
        results += [{"id": f"nba_{p['id']}", "name": p["name"], "sport": "basketball",
                     "team": p["team"]["name"], "photo": p["photo"], "source": "live"} for p in real]

    result = {"query": q, "results": results[:20]}
    set_cache("players", cache_key, result)
    return result

# ── Featured players ──────────────────────────────────────────────────────────
@router.get("/featured")
async def get_featured():
    return {"players": list_mock_players()}

# ── Full profile ──────────────────────────────────────────────────────────────
@router.get("/{player_id}")
async def get_player(player_id: str):
    cached = get_cache("players", player_id)
    if cached:
        return cached

    # Demo players
    mock = get_mock_player(player_id)
    if mock:
        set_cache("players", player_id, mock)
        return mock

    # Live: soccer_{apif_id}
    if player_id.startswith("soccer_"):
        apif_id = int(player_id.replace("soccer_", ""))
        data = await fetch_soccer_player(apif_id)
        if data:
            set_cache("players", player_id, data)
            return data

    # Live: nba_{balldontlie_id}
    if player_id.startswith("nba_"):
        nba_id = int(player_id.replace("nba_", ""))
        data = await fetch_nba_player(nba_id)
        if data:
            set_cache("players", player_id, data)
            return data

    raise HTTPException(status_code=404, detail=f"Player '{player_id}' not found.")

# ── Match log ─────────────────────────────────────────────────────────────────
@router.get("/{player_id}/matches")
async def get_player_matches(player_id: str, season: Optional[int] = None):
    mock = get_mock_player(player_id)
    if mock:
        return {"matches": mock.get("recent_matches", []), "player_id": player_id}

    if player_id.startswith("soccer_"):
        apif_id = int(player_id.replace("soccer_", ""))
        s = season or 2025
        cache_key = f"matches_{player_id}_{s}"
        cached = get_cache("players", cache_key)
        if cached:
            return cached
        fixtures = await fetch_soccer_player_fixtures(apif_id, s)
        result = {"matches": fixtures, "player_id": player_id, "season": s}
        set_cache("players", cache_key, result)
        return result

    return {"matches": [], "player_id": player_id}

# ── Stats ─────────────────────────────────────────────────────────────────────
@router.get("/{player_id}/stats")
async def get_player_stats(player_id: str, season: Optional[int] = None):
    mock = get_mock_player(player_id)
    if mock:
        return {
            "player_id": player_id,
            "sport": mock.get("sport"),
            "season": season or 2025,
            "current_season": mock.get("current_season", {}),
        }
    player = await get_player(player_id)
    return {
        "player_id": player_id,
        "sport": player.get("sport"),
        "season": season or 2025,
        "current_season": player.get("current_season", {}),
    }

# ── News ──────────────────────────────────────────────────────────────────────
@router.get("/{player_id}/news")
async def get_player_news(player_id: str):
    mock = get_mock_player(player_id)
    if mock:
        return {"news": mock.get("news", []), "player_id": player_id}
    return {"news": [], "player_id": player_id}
