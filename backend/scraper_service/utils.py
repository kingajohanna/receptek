import models
from typing import Any

def convert_scraper_to_model(scraper: Any, user_id: str) -> models.RecipeModel:
    scraper_methods = {'host':scraper.host, 'canonical_url': scraper.canonical_url, 'title':scraper.title,
    'category':scraper.category, 'totalTime':scraper.total_time, 'cookTime':scraper.cook_time, 
    'prepTime':scraper.prep_time, 'yields':scraper.yields, 'image':scraper.image, 'nutrients':scraper.nutrients,
    'language':scraper.language, 'ingredients':scraper.ingredients, 'instructions':scraper.instructions_list,
    'ratings':scraper.ratings, 'author':scraper.author, 'cuisine':scraper.cuisine, 'description':scraper.description,
    'reviews':scraper.reviews, 'siteName':scraper.site_name}
    scraper_dict = {'user_id': [user_id]}
    for k, v in scraper_methods.items():
        try:
            scraper_dict[k] = v()
        except NotImplementedError:
            scraper_dict[k] = None
    return models.RecipeModel.parse_obj(scraper_dict)
