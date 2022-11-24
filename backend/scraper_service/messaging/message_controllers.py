from typing import Any
import json
import logging

async def removeUserRecipes(DB: Any, message: str):
    userId = json.loads(message)
    await DB['recipes'].delete_many({'user_id': userId['userid']})
    logging.debug('deleted docs')
    
    
