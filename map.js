var SignalSource = require("./source")

module.exports = map

// map :: Signal<A> -> (A -> B) -> Signal<B>
function map(signal, lambda) {
    return SignalSource(function generator(broadcast) {
        signal(function listener(value) {
            broadcast(lambda(value))
        })
    }, lambda(signal()))
}
