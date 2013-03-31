/* Monads?

*/

/* A Signal is a very simple representation

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

*/
function Signal(generator) {
    var currentState, listeners = []

    generator(function (value) {
        currentState = value
        listeners.forEach(function (f) { f(currentState) })
    })

    return function signal(callback) {
        if (!callback) {
            return currentState
        }

        listeners.push(callback)

        return function remove() {
            for (var i = 0; i < listeners.length; i++) {
                if (listeners[i] === callback) {
                    return listeners.splice(i, 1)
                }
            }
        }
    }
}
