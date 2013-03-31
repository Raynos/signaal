var accumulate = require("./accumulate")

/*  A StateSignal is a signal that does not represent a stateful
        primitive source of information but instead is some form
        of custom accumulation of state by some logic.

    Think of it as a little state machine that is allowed to
        transitition state in reaction to other signals

    ```js
    var transform = require("signaal/transform")
    var extend = require("xtend")

    var flower = StateSignal()
        .listen(sunshine, function (flower, shine) {
            return extend(flower, { shines: flower.shines++ })
        })
        .listen(rain, function (flower, water) {
            return extend(flower, { roots: flower.roots++ })
        })
        .initial({ shines: 0, roots: 0 })

    var view = transform(flower, function (flower) {
        return "" +
            "<div>" +
                "<span> Roots : " + flower.roots + " </span>" +
                "<span> Shines : " + flower.shines + " </span>" +
            "</div>"
    })

    view(function (html) {
        console.log(html)
    })
    ```

*/

module.exports = StateSignal

/*  StateSignal :: [(Signal<T>, T -> A)] -> {
        initial: A -> Signal<A>,
        listen: DuplexSignal<X> -> (X -> A) -> StateSignal<A>
    }
*/
function StateSignal(tuples) {
    tuples = tuples || []

    return {
        initial: function initial(initialState) {
            return accumulate(tuples, initialState)
        },
        listen: function listen(source, lambda) {
            return StateSignal(tuples.concat([[source, lambda]]))
        }
    }
}
