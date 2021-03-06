var foldp = require("./foldp")
var merge = require("./merge")
var map = require("./map")

module.exports = accumulate

// accumulate :: [(DuplexSignal<T>, T -> A)] -> A -> Signal<A>
function accumulate(list, initialState) {
    var signals = list.map(function toSignalOfFunctions(tuple) {
        var signal = tuple[0]
        var lambda = tuple[1]

        return map(signal, function toTransition(value) {
            return function transition(state) {
                return lambda(state, value)
            }
        })
    })

    return foldp(merge(signals), function accumulation(state, fn) {
        return fn(state)
    }, initialState)
}
