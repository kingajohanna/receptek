from fastapi import FastAPI
from pydantic import BaseModel
import sys, os
sys.path.append(os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'receptek_scraper')))
from recipe_scrapers import scrape_me

class URL(BaseModel):
    url: str

app = FastAPI()

@app.post('/recipe/add/')
async def read_root(url: URL):
    value = await scrape_me(url.url)
    return value.title()