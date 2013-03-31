var SignalSource = require("./source")

module.exports = foldp

// foldp :: Signal<A> -> (X -> A -> X) -> X -> Signal<X>
function foldp(signal, lambda, initialValue) {
    var state = initialValue

    return SignalSource(function generator(broadcast) {
        return signal(function listener(value) {
            state = lambda(state, value)
            broadcast(state)
        })
    }, initialValue)
}
