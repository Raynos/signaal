var SignalSource = require("./source")

module.exports = transform

// transform :: Signal<A> -> (A -> B) -> Signal<B>
function transform(signal, lambda) {
    return SignalSource(function generator(broadcast) {
        signal(function listener(value) {
            broadcast(lambda(value))
        })
    }, lambda(signal()))
}
