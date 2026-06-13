"""
Unified soccer data fetcher.
Priority: football-data.org (free tier) → API-Football → cached fallback.
"""
import httpx, os, asyncio
from datetime import date, timedelta
from typing import Optional

FD_BASE   = "https://api.football-data.org/v4"
APIF_BASE = "https://v3.football.api-sports.io"

def _fd_headers():
    key = os.getenv("FOOTBALL_DATA_API_KEY", "")
    return {"X-Auth-Token": key} if key else {}

def _apif_headers():
    key = os.getenv("API_FOOTBALL_KEY", "")
    return {"x-apisports-key": key} if key else {}

def _norm_match_fd(m: dict) -> dict:
    """Normalize a football-data.org match object."""
    ht = m.get("homeTeam", {})
    at = m.get("awayTeam", {})
    score = m.get("score", {})
    ft = score.get("fullTime", {})
    status = m.get("status", "SCHEDULED")
    return {
        "id":    str(m.get("id", "")),
        "home":  {"name": ht.get("shortName") or ht.get("name",""), "abbr": ht.get("tla","")},
        "away":  {"name": at.get("shortName") or at.get("name",""), "abbr": at.get("tla","")},
        "score": {"home": ft.get("home"), "away": ft.get("away")} if ft.get("home") is not None else None,
        "time":  m.get("utcDate","")[:16].replace("T"," ") + " UTC",
        "status": _map_status_fd(status),
        "stage": m.get("stage",""),
        "matchday": m.get("matchday"),
    }

def _map_status_fd(s: str) -> str:
    return {"FINISHED":"final","IN_PLAY":"live","PAUSED":"live",
            "SCHEDULED":"scheduled","POSTPONED":"postponed"}.get(s, s.lower())

def _norm_match_apif(m: dict) -> dict:
    """Normalize an API-Football match object."""
    fix = m.get("fixture", {})
    teams = m.get("teams", {})
    goals = m.get("goals", {})
    status = fix.get("status", {}).get("short", "NS")
    return {
        "id":    str(fix.get("id","")),
        "home":  {"name": teams.get("home",{}).get("name",""), "abbr": teams.get("home",{}).get("name","")[:3].upper()},
        "away":  {"name": teams.get("away",{}).get("name",""), "abbr": teams.get("away",{}).get("name","")[:3].upper()},
        "score": {"home": goals.get("home"), "away": goals.get("away")} if goals.get("home") is not None else None,
        "time":  fix.get("date","")[:16].replace("T"," ") + " UTC",
        "status": _map_status_apif(status),
        "stage": m.get("league",{}).get("round",""),
    }

def _map_status_apif(s: str) -> str:
    return {"FT":"final","1H":"live","2H":"live","HT":"live",
            "ET":"live","P":"live","NS":"scheduled","PST":"postponed"}.get(s, "scheduled")

async def fetch_by_fd_code(fd_code: str, limit: int = 20) -> list:
    """Fetch recent + upcoming matches from football-data.org."""
    today = date.today()
    date_from = (today - timedelta(days=3)).isoformat()
    date_to   = (today + timedelta(days=7)).isoformat()
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            resp = await client.get(
                f"{FD_BASE}/competitions/{fd_code}/matches",
                params={"dateFrom": date_from, "dateTo": date_to},
                headers=_fd_headers(),
            )
            if resp.status_code == 200:
                matches = resp.json().get("matches", [])[:limit]
                return [_norm_match_fd(m) for m in matches]
            if resp.status_code == 429:
                return []  # rate limited — caller uses cache
    except Exception:
        pass
    return []

async def fetch_by_apif_id(apif_id: int, season: Optional[int] = None, limit: int = 20) -> list:
    """Fetch matches from API-Football."""
    if not os.getenv("API_FOOTBALL_KEY"):
        return []
    today = date.today()
    params: dict = {
        "league": apif_id,
        "season": season or today.year,
        "from":   (today - timedelta(days=3)).isoformat(),
        "to":     (today + timedelta(days=7)).isoformat(),
    }
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            resp = await client.get(
                f"{APIF_BASE}/fixtures",
                params=params,
                headers=_apif_headers(),
            )
            if resp.status_code == 200:
                fixtures = resp.json().get("response", [])[:limit]
                return [_norm_match_apif(f) for f in fixtures]
    except Exception:
        pass
    return []

async def fetch_competition(comp: dict) -> list:
    """Try fd_code first, fall back to apif_id."""
    if comp.get("fd_code"):
        matches = await fetch_by_fd_code(comp["fd_code"])
        if matches:
            return matches
    if comp.get("apif_id"):
        return await fetch_by_apif_id(comp["apif_id"])
    return []

async def fetch_competitions_parallel(comps: list) -> dict:
    """Fetch multiple competitions concurrently. Returns {comp_id: [matches]}."""
    tasks = {c["id"]: fetch_competition(c) for c in comps}
    results = await asyncio.gather(*tasks.values(), return_exceptions=True)
    return {
        comp_id: (res if isinstance(res, list) else [])
        for comp_id, res in zip(tasks.keys(), results)
    }
