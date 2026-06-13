"""
Player data service.
Priority: API-Football player endpoint → football-data.org → NBA/MLB APIs → mock
All responses normalized to the StatSphere PlayerProfile schema.
"""
import httpx, os
from typing import Optional
from datetime import date

APIF_BASE = "https://v3.football.api-sports.io"
NBA_BASE  = "https://api.balldontlie.io/v1"
MLB_BASE  = "https://statsapi.mlb.com/api/v1"

def _apif_headers():
    key = os.getenv("API_FOOTBALL_KEY", "")
    return {"x-apisports-key": key} if key else {}

def _nba_headers():
    key = os.getenv("NBA_API_KEY", "")
    return {"Authorization": key} if key else {}

# ── Normalizers ────────────────────────────────────────────────────────────────

def _norm_soccer_player(p: dict, stats: list) -> dict:
    info = p.get("player", {})
    team_info = p.get("statistics", [{}])[0] if p.get("statistics") else {}
    team = team_info.get("team", {})
    league = team_info.get("league", {})
    games = team_info.get("games", {})
    goals = team_info.get("goals", {})
    passes = team_info.get("passes", {})
    tackles = team_info.get("tackles", {})
    shots = team_info.get("shots", {})
    dribbles = team_info.get("dribbles", {})
    cards = team_info.get("cards", {})

    return {
        "id": str(info.get("id", "")),
        "sport": "soccer",
        "name": info.get("name", ""),
        "firstname": info.get("firstname", ""),
        "lastname": info.get("lastname", ""),
        "photo": info.get("photo", ""),
        "age": info.get("age"),
        "dob": info.get("birth", {}).get("date"),
        "nationality": info.get("nationality", ""),
        "birth_place": info.get("birth", {}).get("place", ""),
        "birth_country": info.get("birth", {}).get("country", ""),
        "height": info.get("height", ""),
        "weight": info.get("weight", ""),
        "injured": info.get("injured", False),
        "position": games.get("position", ""),
        "team": {
            "id": team.get("id"),
            "name": team.get("name", ""),
            "logo": team.get("logo", ""),
        },
        "league": {
            "id": league.get("id"),
            "name": league.get("name", ""),
            "country": league.get("country", ""),
            "logo": league.get("logo", ""),
            "season": league.get("season"),
        },
        "current_season": {
            "appearances": games.get("appearences"),
            "lineups": games.get("lineups"),
            "minutes": games.get("minutes"),
            "rating": games.get("rating"),
            "goals": goals.get("total"),
            "assists": goals.get("assists"),
            "shots_total": shots.get("total"),
            "shots_on": shots.get("on"),
            "passes_total": passes.get("total"),
            "passes_key": passes.get("key"),
            "passes_accuracy": passes.get("accuracy"),
            "tackles_total": tackles.get("total"),
            "interceptions": tackles.get("interceptions"),
            "dribbles_success": dribbles.get("success"),
            "yellow_cards": cards.get("yellow"),
            "red_cards": cards.get("red"),
        },
        "status": "injured" if info.get("injured") else "active",
    }

def _norm_nba_player(p: dict, season_avg: dict) -> dict:
    return {
        "id": str(p.get("id", "")),
        "sport": "basketball",
        "name": f"{p.get('first_name','')} {p.get('last_name','')}",
        "firstname": p.get("first_name", ""),
        "lastname": p.get("last_name", ""),
        "photo": "",
        "age": None,
        "dob": None,
        "nationality": "USA",
        "birth_place": "",
        "birth_country": "USA",
        "height": p.get("height", ""),
        "weight": p.get("weight", ""),
        "injured": False,
        "position": p.get("position", ""),
        "team": {
            "id": p.get("team", {}).get("id"),
            "name": p.get("team", {}).get("full_name", ""),
            "logo": "",
        },
        "league": {"name": "NBA", "country": "USA", "season": 2025},
        "current_season": {
            "appearances": season_avg.get("games_played"),
            "minutes": None,
            "goals": None,
            "assists": season_avg.get("ast"),
            "pts": season_avg.get("pts"),
            "reb": season_avg.get("reb"),
            "stl": season_avg.get("stl"),
            "blk": season_avg.get("blk"),
            "fg_pct": season_avg.get("fg_pct"),
            "fg3_pct": season_avg.get("fg3_pct"),
            "ft_pct": season_avg.get("ft_pct"),
            "turnover": season_avg.get("turnover"),
        },
        "status": "active",
    }

# ── Fetchers ───────────────────────────────────────────────────────────────────

async def fetch_soccer_player(player_id: int, season: Optional[int] = None) -> Optional[dict]:
    if not os.getenv("API_FOOTBALL_KEY"):
        return None
    s = season or date.today().year
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            resp = await client.get(
                f"{APIF_BASE}/players",
                params={"id": player_id, "season": s},
                headers=_apif_headers(),
            )
            if resp.status_code == 200:
                data = resp.json().get("response", [])
                if data:
                    return _norm_soccer_player(data[0], [])
    except Exception:
        pass
    return None

async def fetch_soccer_player_fixtures(player_id: int, season: int, limit: int = 20) -> list:
    if not os.getenv("API_FOOTBALL_KEY"):
        return []
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            resp = await client.get(
                f"{APIF_BASE}/fixtures",
                params={"player": player_id, "season": season, "last": limit},
                headers=_apif_headers(),
            )
            if resp.status_code == 200:
                return resp.json().get("response", [])
    except Exception:
        pass
    return []

async def search_soccer_players(name: str) -> list:
    if not os.getenv("API_FOOTBALL_KEY"):
        return []
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            resp = await client.get(
                f"{APIF_BASE}/players",
                params={"search": name, "season": date.today().year},
                headers=_apif_headers(),
            )
            if resp.status_code == 200:
                results = resp.json().get("response", [])[:10]
                return [_norm_soccer_player(r, []) for r in results]
    except Exception:
        pass
    return []

async def fetch_nba_player(player_id: int) -> Optional[dict]:
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            p_resp = await client.get(
                f"{NBA_BASE}/players/{player_id}",
                headers=_nba_headers(),
            )
            s_resp = await client.get(
                f"{NBA_BASE}/season_averages",
                params={"season": 2024, "player_ids[]": player_id},
                headers=_nba_headers(),
            )
            if p_resp.status_code == 200:
                player = p_resp.json().get("data", {})
                avg = s_resp.json().get("data", [{}])[0] if s_resp.status_code == 200 else {}
                return _norm_nba_player(player, avg)
    except Exception:
        pass
    return None

async def search_nba_players(name: str) -> list:
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            resp = await client.get(
                f"{NBA_BASE}/players",
                params={"search": name, "per_page": 10},
                headers=_nba_headers(),
            )
            if resp.status_code == 200:
                return [_norm_nba_player(p, {}) for p in resp.json().get("data", [])]
    except Exception:
        pass
    return []

# ── Mock data for demo ──────────────────────────────────────────────────────────

MOCK_PLAYERS = {
    "demo_mbappe": {
        "id": "demo_mbappe", "sport": "soccer",
        "name": "Kylian Mbappé", "firstname": "Kylian", "lastname": "Mbappé",
        "photo": "https://media.api-sports.io/football/players/278.png",
        "age": 26, "dob": "1998-12-20",
        "nationality": "French", "birth_place": "Paris", "birth_country": "France",
        "height": "178 cm", "weight": "73 kg", "injured": False,
        "position": "Forward",
        "team": {"id": 541, "name": "Real Madrid", "logo": "https://media.api-sports.io/football/teams/541.png"},
        "league": {"name": "La Liga", "country": "Spain", "logo": "", "season": 2025},
        "current_season": {
            "appearances": 32, "lineups": 30, "minutes": 2654, "rating": "8.2",
            "goals": 28, "assists": 9, "shots_total": 98, "shots_on": 61,
            "passes_total": 870, "passes_key": 52, "passes_accuracy": 81,
            "tackles_total": 18, "interceptions": 8, "dribbles_success": 67,
            "yellow_cards": 3, "red_cards": 0,
        },
        "status": "active",
        "contract": {"start": "2024-07-01", "end": "2029-06-30", "salary": "Undisclosed"},
        "dominant_foot": "Right",
        "market_value": "€180M",
        "social": {"twitter": "KMbappe", "instagram": "k.mbappe"},
        "career": [
            {
                "team": "Real Madrid", "logo": "https://media.api-sports.io/football/teams/541.png",
                "league": "La Liga", "country": "Spain",
                "from": "2024", "to": "Present", "role": "Starter",
                "appearances": 32, "goals": 28, "assists": 9,
                "trophies": [],
                "awards": [],
            },
            {
                "team": "Paris Saint-Germain", "logo": "https://media.api-sports.io/football/teams/85.png",
                "league": "Ligue 1", "country": "France",
                "from": "2017", "to": "2024", "role": "Starter",
                "appearances": 308, "goals": 256, "assists": 108,
                "trophies": [
                    {"name": "Ligue 1", "year": "2018"}, {"name": "Ligue 1", "year": "2019"},
                    {"name": "Ligue 1", "year": "2020"}, {"name": "Ligue 1", "year": "2022"},
                    {"name": "Ligue 1", "year": "2023"}, {"name": "Ligue 1", "year": "2024"},
                ],
                "awards": [
                    {"name": "Ligue 1 Top Scorer", "year": "2019"},
                    {"name": "Ligue 1 Top Scorer", "year": "2021"},
                    {"name": "Ligue 1 Player of the Year", "year": "2023"},
                ],
            },
            {
                "team": "AS Monaco", "logo": "https://media.api-sports.io/football/teams/91.png",
                "league": "Ligue 1", "country": "France",
                "from": "2015", "to": "2017", "role": "Starter",
                "appearances": 60, "goals": 27, "assists": 14,
                "trophies": [{"name": "Ligue 1", "year": "2017"}],
                "awards": [{"name": "Ligue 1 Young Player of the Year", "year": "2017"}],
            },
        ],
        "international": {
            "country": "France", "flag": "🇫🇷",
            "caps": 91, "goals": 48,
            "tournaments": [
                {"name": "FIFA World Cup", "year": "2018", "host": "Russia", "result": "Winner", "goals": 4, "assists": 2, "awards": ["Best Young Player"]},
                {"name": "UEFA EURO", "year": "2020", "host": "Europe", "result": "Round of 16", "goals": 0, "assists": 1, "awards": []},
                {"name": "FIFA World Cup", "year": "2022", "host": "Qatar", "result": "Runner-up", "goals": 8, "assists": 2, "awards": ["Golden Boot"]},
                {"name": "UEFA EURO", "year": "2024", "host": "Germany", "result": "Semi-finals", "goals": 3, "assists": 0, "awards": []},
            ],
        },
        "recent_matches": [
            {"date":"2026-05-31","competition":"La Liga","home":"Real Madrid","away":"Sevilla","score":"4-1","result":"W","started":True,"minutes":82,"goals":2,"assists":1,"rating":"9.1"},
            {"date":"2026-05-25","competition":"La Liga","home":"Atletico Madrid","away":"Real Madrid","score":"1-2","result":"W","started":True,"minutes":90,"goals":1,"assists":0,"rating":"8.3"},
            {"date":"2026-05-18","competition":"La Liga","home":"Real Madrid","away":"Valencia","score":"3-0","result":"W","started":True,"minutes":75,"goals":1,"assists":2,"rating":"8.7"},
            {"date":"2026-05-11","competition":"La Liga","home":"Barcelona","away":"Real Madrid","score":"2-3","result":"W","started":True,"minutes":90,"goals":2,"assists":0,"rating":"9.2"},
            {"date":"2026-05-04","competition":"La Liga","home":"Real Madrid","away":"Rayo","score":"2-0","result":"W","started":True,"minutes":68,"goals":0,"assists":1,"rating":"7.5"},
        ],
        "news": [
            {"headline":"Mbappé scores brace as Real Madrid cruise to title","source":"ESPN","date":"2026-06-01","excerpt":"Kylian Mbappé netted twice in the second half to seal Real Madrid's Liga title on the final day of the season.","tag":"Match Report","url":"#"},
            {"headline":"Mbappé named La Liga Player of the Season","source":"AS","date":"2026-05-28","excerpt":"The French forward capped an outstanding debut season in Spain by claiming the league's top individual honor.","tag":"Award","url":"#"},
            {"headline":"Real Madrid planning Mbappé contract extension talks","source":"Fabrizio Romano","date":"2026-05-20","excerpt":"Real Madrid are expected to open talks over a new contract with Mbappé, whose current deal runs until 2029.","tag":"Contract","url":"#","rumor":True,"confidence":"Reliable"},
            {"headline":"France name Mbappé captain for World Cup 2026","source":"L'Equipe","date":"2026-05-15","excerpt":"Didier Deschamps confirmed Kylian Mbappé will captain France at this summer's World Cup on home soil.","tag":"International","url":"#"},
        ],
    },
    "demo_wembanyama": {
        "id": "demo_wembanyama", "sport": "basketball",
        "name": "Victor Wembanyama", "firstname": "Victor", "lastname": "Wembanyama",
        "photo": "", "age": 22, "dob": "2004-01-04",
        "nationality": "French", "birth_place": "Le Chesnay", "birth_country": "France",
        "height": "7'4\"", "weight": "229 lbs", "injured": False,
        "position": "C / PF",
        "team": {"id": 29, "name": "San Antonio Spurs", "logo": ""},
        "league": {"name": "NBA", "country": "USA", "season": 2025},
        "current_season": {
            "appearances": 68, "minutes": 32.1,
            "pts": 28.4, "reb": 10.6, "assists": 3.8,
            "stl": 1.4, "blk": 3.9,
            "fg_pct": 0.489, "fg3_pct": 0.371, "ft_pct": 0.821,
            "turnover": 2.7,
        },
        "status": "active",
        "contract": {"start": "2023-07-01", "end": "2027-06-30", "salary": "$55.2M / yr (2026–27)"},
        "dominant_foot": None,
        "market_value": None,
        "career": [
            {"team": "San Antonio Spurs", "logo": "", "league": "NBA", "country": "USA",
             "from": "2023", "to": "Present", "role": "Starter", "appearances": 136, "pts": 23.5, "reb": 9.8,
             "trophies": [{"name": "NBA Western Conference Champions", "year": "2026"}],
             "awards": [{"name": "NBA Rookie of the Year", "year": "2024"}, {"name": "NBA All-Star", "year": "2025"}, {"name": "NBA All-Star", "year": "2026"}]},
        ],
        "international": {
            "country": "France", "flag": "🇫🇷", "caps": 24, "goals": None,
            "tournaments": [
                {"name": "FIBA World Cup", "year": "2023", "host": "Philippines", "result": "Bronze medal", "pts": 19.8, "reb": 9.1, "awards": []},
                {"name": "Paris Olympics", "year": "2024", "host": "France", "result": "Silver medal", "pts": 22.5, "reb": 9.3, "awards": ["All-Tournament Team"]},
            ],
        },
        "recent_matches": [
            {"date":"2026-06-10","competition":"NBA Finals","home":"New York Knicks","away":"San Antonio Spurs","score":"107-106","result":"L","started":True,"minutes":41,"pts":31,"reb":12,"ast":4,"blk":4,"rating":"Elite"},
            {"date":"2026-06-08","competition":"NBA Finals","home":"New York Knicks","away":"San Antonio Spurs","score":"111-115","result":"W","started":True,"minutes":38,"pts":38,"reb":8,"ast":3,"blk":5,"rating":"Elite"},
            {"date":"2026-06-05","competition":"NBA Finals","home":"San Antonio Spurs","away":"New York Knicks","score":"104-105","result":"L","started":True,"minutes":40,"pts":29,"reb":11,"ast":5,"blk":3,"rating":"Elite"},
            {"date":"2026-06-03","competition":"NBA Finals","home":"San Antonio Spurs","away":"New York Knicks","score":"95-105","result":"L","started":True,"minutes":37,"pts":22,"reb":9,"ast":2,"blk":2,"rating":"Good"},
        ],
        "news": [
            {"headline":"Wembanyama drops 38 in Game 3 but Spurs fall short","source":"ESPN","date":"2026-06-09","excerpt":"Victor Wembanyama was unstoppable in Game 3 but the Knicks' Jalen Brunson countered with 35 of his own.","tag":"Match Report","url":"#"},
            {"headline":"'He's the best player in the world' — Popovich on Wembanyama","source":"The Athletic","date":"2026-06-07","excerpt":"Gregg Popovich heaped praise on his 22-year-old star ahead of Game 3 of the NBA Finals.","tag":"Interview","url":"#"},
            {"headline":"Wembanyama injury scare in Game 2 practice","source":"ESPN","date":"2026-06-07","excerpt":"Wembanyama left practice early with a minor ankle complaint but was declared fit for Game 3.","tag":"Injury","url":"#","rumor":False},
        ],
    },
}

def get_mock_player(player_id: str) -> Optional[dict]:
    return MOCK_PLAYERS.get(player_id)

def list_mock_players() -> list:
    return [{"id": p["id"], "name": p["name"], "sport": p["sport"], "team": p["team"]["name"], "photo": p.get("photo","")}
            for p in MOCK_PLAYERS.values()]
