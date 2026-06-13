from fastapi import APIRouter
import httpx
from services.cache import get_cache, set_cache

router = APIRouter()
NHL_BASE = "https://api-web.nhle.com/v1"

@router.get("/")
async def get_nhl():
    cached = get_cache("nhl", "data")
    if cached:
        return cached

    result = {
        "series": {
            "label": "Stanley Cup Final 2026",
            "team1": "CAR", "name1": "Carolina Hurricanes",    "wins1": 3,
            "team2": "VGK", "name2": "Vegas Golden Knights",   "wins2": 2,
            "nextGame": {
                "label": "Game 6 · Tomorrow",
                "time": "5:00 PM PDT · Vegas",
                "prob": {"t1": 51, "t2": 49},
            }
        },
        "games_label": "Series games",
        "games": [
            {"id":"h1","title":"Game 1 · Final","away":{"name":"CAR","abbr":"CAR"},"home":{"name":"VGK","abbr":"VGK"},"score":{"away":4,"home":5},"time":"Jun 2 · Carolina","status":"final"},
            {"id":"h2","title":"Game 2 · Final","away":{"name":"VGK","abbr":"VGK"},"home":{"name":"CAR","abbr":"CAR"},"score":{"away":3,"home":4},"time":"Jun 4 · Carolina","status":"final"},
            {"id":"h3","title":"Game 3 · Final","away":{"name":"CAR","abbr":"CAR"},"home":{"name":"VGK","abbr":"VGK"},"score":{"away":4,"home":5},"time":"Jun 6 · Vegas","status":"final"},
            {"id":"h4","title":"Game 4 · Final","away":{"name":"CAR","abbr":"CAR"},"home":{"name":"VGK","abbr":"VGK"},"score":{"away":5,"home":3},"time":"Jun 9 · Vegas","status":"final"},
            {"id":"h5","title":"Game 5 · Final","away":{"name":"VGK","abbr":"VGK"},"home":{"name":"CAR","abbr":"CAR"},"score":{"away":2,"home":4},"time":"Jun 11 · Carolina","status":"final"},
            {"id":"h6","title":"Game 6 · Tomorrow","away":{"name":"CAR","abbr":"CAR"},"home":{"name":"VGK","abbr":"VGK"},"score":None,"time":"5:00 PM PDT","status":"scheduled","highlight":True,
             "win_probability":{"away":51,"home":49}},
        ]
    }

    set_cache("nhl", "data", result)
    return result
