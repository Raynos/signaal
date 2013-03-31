var SignalSource = require("./source")

module.exports = merge

// merge :: [Signal<A>] -> Signal<A>
function merge(signals) {
    var value = signals[0]

    return SignalSource(function generator(broadcast) {
        signals.forEach(function forward(signal) {
            signal(broadcast)
        })
    }, signals[0]())
}
