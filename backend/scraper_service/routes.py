from fastapi import APIRouter, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
import sys, os
sys.path.append(os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'receptek_scraper')))
from recipe_scrapers import scrape_me
from models import URL, RecipeModel
import logging
import utils

router = APIRouter()

@router.post('/add/')
async def read_root(req: Request, url: URL):
    value = await scrape_me(url.url)
    recipe_model = jsonable_encoder(utils.convert_scraper_to_model(value))
    recipe_created = await req.app.db['recipes'].insert_one(recipe_model)
    #logging.info(recipe_model)
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=recipe_created.inserted_id)

