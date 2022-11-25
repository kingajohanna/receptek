import aio_pika
import asyncio
import logging
from typing import Any
import messaging.message_controllers as mc
import utils.circuit_breaker as cb
import signal
import asyncio
import functools
import time



async def on_message(message: aio_pika.abc.AbstractIncomingMessage, DB: Any) -> None:
    json_str = message.body.decode()
    await mc.removeUserRecipes(DB, json_str)

def connect_decorator(conn_string, loop):
    async def inner():
        return await aio_pika.connect_robust(conn_string, loop=loop)
    return inner

async def main(loop, conn_string: str, queue_name: str, DB: Any):

    kill_event = asyncio.Event()                                                                    
                                                                                                    
    async def shutdown():                                                            
        kill_event.set()                                                                            
                                                                                                    
    asyncio.get_running_loop().add_signal_handler(                                                  
        signal.SIGINT, functools.partial(asyncio.create_task, shutdown())                           
    )
    circuit_b = cb.CircuitBreaker(timeInterval=1, maxFailures=10, minSuccesses=3, maxOpenEnters=2)
    connection = await circuit_b.connect_retry(connect_decorator(conn_string, loop), retries=20,timeout=0.5)
    #connection = await aio_pika.connect_robust(conn_string, loop=loop)
    async with connection:
        channel = await connection.channel(publisher_confirms=False)
        queue: aio_pika.abc.AbstractQueue = await channel.declare_queue(
            queue_name,
            durable=False,
            exclusive=False,
            auto_delete=True,
        )
        await queue.consume(functools.partial(on_message, DB=DB))
        await kill_event.wait()
    logging.debug('exiting') 


# async def main(loop, conn_string: str, queue_name: str, DB: Any):
#     # Connect with the givien parameters is also valiable.
#     # aio_pika.connect_robust(host="host", login="login", password="password")
#     # You can only choose one option to create a connection, url or kw-based params.
#     connection = await aio_pika.connect_robust(conn_string, loop=loop)
#     async with connection:

#         # Creating channel
#         channel: aio_pika.abc.AbstractChannel = await connection.channel()

#         # Declaring queue
#         queue: aio_pika.abc.AbstractQueue = await channel.declare_queue(
#             queue_name,
#             durable=False,
#             exclusive=False,
#             auto_delete=True,
#         )

#         async with queue.iterator() as queue_iter:
#             # Cancel consuming after __aexit__
#             async for message in queue_iter:
#                 async with message.process():
#                     await on_message(message, DB)
#                     if queue.name in message.body.decode():
#                         break


        