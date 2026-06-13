from cachetools import TTLCache

CACHES = {
    "nba":         TTLCache(maxsize=50,  ttl=60),
    "nhl":         TTLCache(maxsize=50,  ttl=60),
    "mlb":         TTLCache(maxsize=50,  ttl=60),
    "nfl":         TTLCache(maxsize=50,  ttl=3600),
    "worldcup":    TTLCache(maxsize=50,  ttl=30),
    "soccer":      TTLCache(maxsize=200, ttl=120),
    "soccer_live": TTLCache(maxsize=100, ttl=30),
    "players":     TTLCache(maxsize=500, ttl=300),
    "ai":          TTLCache(maxsize=200, ttl=300),
}

def get_cache(namespace: str, key: str):
    return CACHES.get(namespace, {}).get(key)

def set_cache(namespace: str, key: str, value):
    if namespace in CACHES:
        CACHES[namespace][key] = value
