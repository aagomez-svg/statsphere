from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import anthropic, os
from services.cache import get_cache, set_cache
import hashlib, json

router = APIRouter()

class PreviewRequest(BaseModel):
    sport: str
    context: str

SPORT_PROMPTS = {
    "nba": "You are a sharp NBA analyst. Write a 2-3 sentence game preview for tonight's matchup based on the series data provided. Focus on key storylines, momentum, and one stat that will matter most.",
    "nhl": "You are a sharp NHL analyst. Write a 2-3 sentence Stanley Cup Final game preview based on the series data. Focus on goaltending, special teams, or momentum shift.",
    "mlb": "You are an MLB analyst. Write 2-3 sentences highlighting the most interesting game or pitching matchup based on today's schedule.",
    "worldcup": "You are a soccer analyst. Write a 2-3 sentence World Cup preview highlighting the most compelling match or national team storyline.",
    "nfl": "You are an NFL analyst. Write 2-3 sentences about what to watch for in the upcoming NFL preseason and who has the most to prove.",
}

@router.post("/preview")
async def generate_preview(req: PreviewRequest):
    cache_key = hashlib.md5(f"{req.sport}:{req.context}".encode()).hexdigest()
    cached = get_cache("ai", cache_key)
    if cached:
        return cached

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY not set")

    client = anthropic.Anthropic(api_key=api_key)
    system = SPORT_PROMPTS.get(req.sport, "You are a sports analyst. Write a 2-3 sentence preview.")

    try:
        message = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=200,
            system=system,
            messages=[{
                "role": "user",
                "content": f"Here is the current series/game data:\n{req.context}\n\nGenerate a concise, insightful game preview."
            }]
        )
        insight = message.content[0].text
        result = {"insight": insight}
        set_cache("ai", cache_key, result)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
