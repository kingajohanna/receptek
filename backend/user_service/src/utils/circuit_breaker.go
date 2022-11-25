package utils

import (
	"errors"
	"time"
)

type ReachedMaxOpenError struct {
	msg string
}

func (e *ReachedMaxOpenError) Error() string { return e.msg }

type CircuitBreakerState int

const (
	closed CircuitBreakerState = iota
	open
	half_open
)

type CircuitBreaker struct {
	failures      int
	successes     int
	openEnters    int
	TimeInterval  time.Duration
	lastOpenStart time.Time
	MaxFailures   int
	MinSuccesses  int
	MaxOpenEnters int
	state         CircuitBreakerState
}

func (cb *CircuitBreaker) BeforeRequest() bool {
	if cb.state == open {
		if time.Since(cb.lastOpenStart) > cb.TimeInterval {
			cb.state = half_open
			return true
		}
		return false
	}
	return true
}

func (cb *CircuitBreaker) Execute(f func() (any, error)) (any, error) {
	if cb.BeforeRequest() {
		res, err := f()
		err = cb.afterRequest(err)
		return res, err
	}
	return nil, errors.New("cannot connect")
}

func (cb *CircuitBreaker) ConnectRetry(f func() (any, error), retries int, timeout time.Duration) (any, error) {
	for i := 0; i <= retries; i++ {
		res, err := cb.Execute(f)
		if errors.Is(err, &ReachedMaxOpenError{}) {
			return nil, err
		} else if err != nil {
			time.Sleep(timeout)
		} else {
			return res, err
		}
	}
	return nil, errors.New("cannot connect")
}

func (cb *CircuitBreaker) swithToOpen() error {
	cb.state = open
	cb.lastOpenStart = time.Now()
	cb.openEnters += 1
	if cb.openEnters > cb.MaxOpenEnters {
		return &ReachedMaxOpenError{"max open reached"}
	}
	return errors.New("cannot connect")
}

func (cb *CircuitBreaker) switchToClosed() {
	cb.state = closed
	cb.failures = 0
	cb.openEnters = 0
}

func (cb *CircuitBreaker) afterRequest(err error) error {
	if err != nil {
		switch cb.state {
		case closed:
			cb.failures += 1
			if cb.failures >= cb.MaxFailures {
				return cb.swithToOpen()
			}
			return errors.New("cannot connect")
		case half_open:
			return cb.swithToOpen()
		}
	} else {
		switch cb.state {
		case closed:
			cb.failures = 0
		case half_open:
			cb.successes += 1
			if cb.successes >= cb.MinSuccesses {
				cb.switchToClosed()
			}
		}
		return nil
	}
	return errors.New("invalid state")
}
