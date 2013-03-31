var SignalSource = require("./source")

// transform :: Signal<A> -> (A -> B) -> Signal<B>
function transform(signal, lambda) {
    return SignalSource(function generator(broadcast) {
        signal(function listener(value) {
            broadcast(lambda(value))
        })
    }, signal())
}
