from fastapi import FastAPI
import configparser
import motor.motor_asyncio
import routes
import logging

config = configparser.ConfigParser()
config.read('./config.ini')

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = motor.motor_asyncio.AsyncIOMotorClient(config['DATABASE']['conn_string'])
    app.db = app.mongodb_client[config['DATABASE']['db_name']]

@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()

app.include_router(routes.router, tags=['recipe'], prefix='/recipe')