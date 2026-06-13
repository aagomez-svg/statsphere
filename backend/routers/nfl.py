from fastapi import APIRouter
from services.cache import get_cache, set_cache

router = APIRouter()

@router.get("/")
async def get_nfl():
    cached = get_cache("nfl", "data")
    if cached:
        return cached

    result = {
        "super_bowl": {
            "winner": "SEA", "winner_name": "Seattle Seahawks", "winner_score": 29,
            "loser":  "NE",  "loser_name":  "New England Patriots", "loser_score": 13,
        },
        "preseason": [
            {"id":"p0","title":"Hall of Fame Game","away":{"name":"ARI","abbr":"ARI"},"home":{"name":"CAR","abbr":"CAR"},"score":None,"time":"Aug 6 · Canton, OH","status":"scheduled","highlight":True},
            {"id":"p1","away":{"name":"CIN","abbr":"CIN"},"home":{"name":"DET","abbr":"DET"},"score":None,"time":"Aug 13","status":"scheduled"},
            {"id":"p2","away":{"name":"PIT","abbr":"PIT"},"home":{"name":"GB","abbr":"GB"},"score":None,"time":"Aug 13","status":"scheduled"},
            {"id":"p3","away":{"name":"NE","abbr":"NE"},"home":{"name":"IND","abbr":"IND"},"score":None,"time":"Aug 13","status":"scheduled"},
            {"id":"p4","away":{"name":"LAC","abbr":"LAC"},"home":{"name":"HOU","abbr":"HOU"},"score":None,"time":"Aug 13","status":"scheduled"},
            {"id":"p5","away":{"name":"TEN","abbr":"TEN"},"home":{"name":"SF","abbr":"SF"},"score":None,"time":"Aug 13","status":"scheduled"},
            {"id":"p6","away":{"name":"MIA","abbr":"MIA"},"home":{"name":"WAS","abbr":"WAS"},"score":None,"time":"Aug 14","status":"scheduled"},
            {"id":"p7","away":{"name":"TB","abbr":"TB"},"home":{"name":"NYJ","abbr":"NYJ"},"score":None,"time":"Aug 14","status":"scheduled"},
            {"id":"p8","away":{"name":"LA","abbr":"LA"},"home":{"name":"KC","abbr":"KC"},"score":None,"time":"Aug 15","status":"scheduled"},
            {"id":"p9","away":{"name":"MIN","abbr":"MIN"},"home":{"name":"NYG","abbr":"NYG"},"score":None,"time":"Aug 15","status":"scheduled"},
        ]
    }

    set_cache("nfl", "data", result)
    return result
