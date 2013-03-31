var accumulate = require("./accumulate")

/*  A StateSignal is a signal that does not represent a stateful
        primitive source of information but instead is some form
        of custom accumulation of state by some logic.

    Think of it as a little state machine that is allowed to
        transitition state in reaction to other signals



*/

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
            return StateSignal(tuples.concat([source, lambda]))
        }
    }
}
