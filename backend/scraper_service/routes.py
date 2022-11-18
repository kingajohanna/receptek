from fastapi import APIRouter, Request, status, Header
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
import sys, os
sys.path.append(os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'receptek_scraper')))
from recipe_scrapers import scrape_me
from models import URL, RecipeModel
import logging
import utils
import asyncio
import models

router = APIRouter()

#TODO add user to document if recipe exists
@router.post('/add/')
async def create_recipe(req: Request,  url: URL, x_user: str | None = Header(default=None, convert_underscores=True)):
    #logging.info(x_user)
    (doc_db, doc_parsed) = await asyncio.gather(req.app.db['recipes'].find_one({'canonical_url': url.url}), scrape_me(url.url))
    if doc_db is None:
        recipe_model = jsonable_encoder(utils.convert_scraper_to_model(doc_parsed, x_user))
        recipe_created = await req.app.db['recipes'].insert_one(recipe_model)
        #logging.info(recipe_model)
        return JSONResponse(status_code=status.HTTP_201_CREATED, content=recipe_created.inserted_id)
    elif x_user not in doc_db['user_id']:
        update_model = models.RecipeUpdate(doc_db['user_id'].append(x_user))
        result = await req.app.db['recipes'].update_one({'_id': doc_db['_id']}, {'$set': {'user_id': update_model}})
        if result.modified_count == 0:
            logging.warning(f"Could not add user to recipe with {doc_db['_id']}")
            return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content='Could not update user')
    return JSONResponse(status_code=status.HTTP_200_OK, content=doc_db['_id'])

@router.get('/get/{user_id}/')
async def read_recipes(req: Request, user_id: str):
    recipes = await req.app.db['recipes'].find({'user_id': [user_id]}).to_list(None)
    return JSONResponse(status_code=status.HTTP_200_OK, content= recipes)
