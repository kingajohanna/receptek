from fastapi import APIRouter, Request, status, Header, Body, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
import sys, os
sys.path.append(os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'receptek_scraper')))
from recipe_scrapers import scrape_me
from models.models import URL, RecipeUpdate
import logging
import utils.utils as utils
from pymongo import ReturnDocument


router = APIRouter()

#TODO add user to document if recipe exists
@router.post('/add/')
async def create_recipe(req: Request,  url: URL, x_user: str | None = Header(default=None, convert_underscores=True)):
    #logging.info(x_user)
    doc_parsed = await scrape_me(url.url)
    recipe_model = jsonable_encoder(utils.convert_scraper_to_model(doc_parsed, x_user))
    recipe_created = await req.app.db['recipes'].insert_one(recipe_model)
    #logging.info(recipe_model)
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=recipe_created.inserted_id)

@router.delete('/del/{recipe_id}/')
async def del_recipe(req: Request, recipe_id: str, x_user: str | None = Header(default=None, convert_underscores=True)):
    del_doc = await req.app.db['recipes'].delete_one({'_id': recipe_id, 'user_id': x_user})
    if del_doc.deleted_count == 0:
        raise HTTPException(status_code=404, detail='could not delete recipe, it may be already missing')
    else:
        return JSONResponse(status_code=status.HTTP_200_OK, content={'data': 'recipe deleted'})

@router.put('/fav/{recipe_id}/')
async def add_favorite(req: Request, recipe_id: str, x_user: str | None = Header(default=None, convert_underscores=True)):
    fav_doc = await req.app.db['recipes'].update_one({'_id': recipe_id, 'user_id': x_user}, [{'$set': {'is_favorite': {'$not': "$is_favorite"}}}])
    if fav_doc is None:
        raise HTTPException(status_code=400, detail='cannot find recipe with specified ID')
    else:
        return JSONResponse(status_code=status.HTTP_200_OK, content={'data': 'recipe updated'})

@router.get('/get/{user_id}/')
async def read_recipes(req: Request, user_id: str):
    recipes = await req.app.db['recipes'].find({'user_id': user_id}).to_list(None)
    return JSONResponse(status_code=status.HTTP_200_OK, content=recipes)

@router.get('/get/{user_id}/favorite/')
async def read_fav_recipes(req: Request, user_id: str):
    recipes = await req.app.db['recipes'].find({'user_id': user_id, 'is_favorite': True}).to_list(None)
    return JSONResponse(status_code=status.HTTP_200_OK, content=recipes)

@router.put('/edit/{recipe_id}/')
async def edit_recipes(req: Request, recipe_id: str, recipe_update: RecipeUpdate = Body(...), x_user: str | None = Header(default=None, convert_underscores=True)):
    recipe = {k: v for k, v in recipe_update.dict().items() if v is not None}
    if len(recipe) > 0: 
        if 'totalTime' in recipe:
            recipe = utils.fill_recipe_speed(recipe)
        update_doc = await req.app.db['recipes'].find_one_and_update({'_id': recipe_id, 'user_id': x_user}, {'$set': recipe}, return_document=ReturnDocument.AFTER)
    if update_doc is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    else:
        return JSONResponse(status_code=status.HTTP_200_OK, content=update_doc)