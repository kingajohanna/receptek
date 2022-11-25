import time
from enum import Enum
import asyncio
import logging

class ReachedMaxOpenException(Exception):
    msg = 'max open reached'

class CircuitBreakerState(Enum):
    CLOSED = 0
    OPEN = 1
    HALF_OPEN = 2


class CircuitBreaker:
    def __init__(self, timeInterval, maxFailures, minSuccesses, maxOpenEnters) -> None:
        self._failures = 0
        self._successes = 0
        self._openEnters = 0
        self.TimeInterval = timeInterval
        self._lastOpenStart = 0
        self.maxFailures = maxFailures
        self.minSuccesses = minSuccesses
        self.maxOpenEnters = maxOpenEnters
        self._state = CircuitBreakerState.CLOSED

    def _before_request(self) -> bool:
        if self._state == CircuitBreakerState.OPEN:
            if time.time() - self._lastOpenStart > self.TimeInterval:
                self._state = CircuitBreakerState.HALF_OPEN
                return True
            return False
        return True
    
    async def execute(self, f: callable) -> any:
        if self._before_request():
            try:
                res = await f()
                self._after_request(True)
                return res
            except Exception as e:
                self._after_request(False)
        raise ConnectionError('cannot connect')
    
    async def connect_retry(self, f: callable, retries: int, timeout: int) -> any:
        for _ in range(retries):
            try:
                return await self.execute(f)
            except ReachedMaxOpenException as err:
                raise ReachedMaxOpenException
            except Exception as e:
                await asyncio.sleep(timeout)
        raise ConnectionError('cannot connect')
    
    def _switch_to_open(self):
        self._state = CircuitBreakerState.OPEN
        self._lastOpenStart = time.time()
        self._openEnters += 1
        if self._openEnters > self.maxOpenEnters:
            raise ReachedMaxOpenException
        raise ConnectionError('cannot connect')
    
    def _switch_to_closed(self):
        self._state = CircuitBreakerState.CLOSED
        self._failures, self._openEnters = 0, 0

    def _after_request(self, is_error: bool):
        if not is_error:
            if self._state == CircuitBreakerState.CLOSED:
                self._failures += 1
                if self._failures >= self.maxFailures:
                    return self._switch_to_open()
                raise ConnectionError('cannot connect')
            else:
                return self._switch_to_open()
        else:
            if self._state == CircuitBreakerState.CLOSED:
                self._failures = 0
            else:
                self._successes += 1
                if self._successes >= self.minSuccesses:
                    self._switch_to_closed()

