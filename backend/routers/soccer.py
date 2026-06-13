"""
Single unified soccer router powering every competition in StatSphere.

Endpoints:
  GET /api/soccer/nav             → grouped nav structure for frontend
  GET /api/soccer/{comp_id}       → matches + metadata for one competition
  GET /api/soccer/region/{region} → all comps in a region (e.g. "England")
  GET /api/soccer/search?q=       → search competition by name
"""
from fastapi import APIRouter, HTTPException, Query
from services.cache import get_cache, set_cache
from services.soccer_fetcher import fetch_competition, fetch_competitions_parallel
from routers.soccer_registry import COMPETITIONS, BY_ID, BY_REGION, NAV_GROUPS

router = APIRouter()

# ── Nav ───────────────────────────────────────────────────────────────────────
@router.get("/nav")
async def get_nav():
    """Return grouped navigation structure — no API calls, instant."""
    return {
        "groups": [
            {
                "label": g["label"],
                "competitions": [
                    {k: BY_ID[cid][k] for k in ("id","name","short","flag","tier","region")}
                    for cid in g["ids"] if cid in BY_ID
                ]
            }
            for g in NAV_GROUPS
        ],
        "total": len(COMPETITIONS),
    }

# ── Single competition ─────────────────────────────────────────────────────────
@router.get("/{comp_id}")
async def get_competition(comp_id: str):
    if comp_id not in BY_ID:
        raise HTTPException(status_code=404, detail=f"Competition '{comp_id}' not found.")

    cached = get_cache("soccer", comp_id)
    if cached:
        return cached

    comp = BY_ID[comp_id]
    matches = await fetch_competition(comp)

    # Split into live / recent / upcoming
    live     = [m for m in matches if m["status"] == "live"]
    recent   = [m for m in matches if m["status"] == "final"][-6:]
    upcoming = [m for m in matches if m["status"] == "scheduled"][:8]

    result = {
        "competition": {k: comp[k] for k in ("id","name","short","flag","tier","region")},
        "live":     live,
        "recent":   recent,
        "upcoming": upcoming,
        "all":      matches,
    }

    ttl_key = "soccer_live" if live else "soccer"
    set_cache(ttl_key if ttl_key in ("soccer","soccer_live") else "soccer", comp_id, result)
    return result

# ── Region bundle ──────────────────────────────────────────────────────────────
@router.get("/region/{region}")
async def get_region(region: str):
    comps = BY_REGION.get(region)
    if not comps:
        raise HTTPException(status_code=404, detail=f"Region '{region}' not found.")

    cache_key = f"region_{region}"
    cached = get_cache("soccer", cache_key)
    if cached:
        return cached

    data = await fetch_competitions_parallel(comps)
    result = {
        "region": region,
        "competitions": [
            {
                **{k: c[k] for k in ("id","name","short","flag","tier")},
                "matches": data.get(c["id"], [])
            }
            for c in comps
        ]
    }
    set_cache("soccer", cache_key, result)
    return result

# ── Search ────────────────────────────────────────────────────────────────────
@router.get("/search")
async def search(q: str = Query(..., min_length=2)):
    ql = q.lower()
    hits = [
        {k: c[k] for k in ("id","name","short","flag","tier","region")}
        for c in COMPETITIONS
        if ql in c["name"].lower() or ql in c["short"].lower() or ql in c["region"].lower()
    ]
    return {"query": q, "results": hits}
