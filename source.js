/*  A SignalSource is a very simple representation

    It represents a value over time. This value changes discretely

    This change mechanism is push based, i.e. when it changes
        everyone who cares can get's a message saying "this value"
        has changed.

    However since it's a representation of a value over time you
        can also pull or ask for the current value. Most default
        signals will just return you a constant value for the
        current state but some may compute the actual current
        state based upon time or actual external factors

    To represent this we should have a few simple rules.

    A signal is a function.

    When a signal is called with zero arguments we read it's
        value by "pull" mechanism. It's expected to return
        the current value in a blocking fashion.

    When a signal is called with a function we should treat it
        as an event listener. This means someone is trying to
        read the value by the "push" mechanism. It is now our
        responsibility as a signal to send him a message each
        time the value changes. The mechanism by which we send
        a message is to call the event listener with the value
        when it changes.

    For purposes of efficiency and memory usage when we listen
        to a signal by the "push" mechanism it returns a remove
        function which we can call later to stop listening to
        change messages on the signal.


    ```js
    function time(interval) {
        return SignalSource(function (broadcast) {
            setInterval(function () {
                broadcast(Date.now())
            }, interval)
        }, Date.now())
    }
    ```

    ```js
    // an Event doesn't have an initialState :/
    function events(element, type) {
        return SignalSource(function (broadcast) {
            element.addEventListener(type, function (ev) {
                broadcast(ev)
            })
        }, null)
    }
    ```

    ```js
    // the route events for the window have an initial state
    // where newURL === oldURL. This is weird :/
    function router(window) {
        return SignalSource(function (broadcast) {
            window.addEventListener("hashchange", function (ev) {
                broadcast({
                    hash: document.location.hash,
                    newURL: ev.newURL,
                    oldURL: ev.oldURL
                })
            })
        }, {
            hash: document.location.hash,
            newURL: document.location.href,
            oldURL: document.location.href
        })
    }
    ```

*/

module.exports = SignalSource

// SignalSource :: generator:(broadcast:(A -> void) -> void) -> A -> Signal<A>
function SignalSource(generator, initialState) {
    var currentState = initialState
    var listeners = []
    var started = false

    generator(broadcast)

    // the generator is passed the broadcast function which
    // it can use to broadcast a discrete change in state to
    // all those that have registered interest.
    function broadcast(value) {
        currentState = value
        listeners.forEach(function (f) { f(currentState) })
    }

    return function signal(listener) {
        // in the pull model we just return the state
        if (!listener) {
            return currentState
        }

        // in the push model we register your interest by putting
        // you in our listeners list
        listeners.push(listener)

        return function remove() {
            listeners.splice(listeners.indexOf(listener), 1)
        }
    }
}
