from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
import configparser
import motor.motor_asyncio
import routes
import logging
import asyncio
import messaging.messaging as messaging

config = configparser.ConfigParser()
config.read('./config.ini')

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)

app = FastAPI()

@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = motor.motor_asyncio.AsyncIOMotorClient(config['DATABASE']['conn_string'])
    app.db = app.mongodb_client[config['DATABASE']['db_name']]
    asyncio.create_task(messaging.main(asyncio.get_running_loop(), config['RABBITMQ']['conn_string'], config['RABBITMQ']['queue'], app.db))

@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()

app.include_router(routes.router, tags=['recipe'], prefix='/recipe')

@app.get('/')
async def hello():
    return JSONResponse(status_code=status.HTTP_200_OK, content="hello")