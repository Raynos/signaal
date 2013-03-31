var isDuplex = {}

/* A DuplexSignal is a signal you can piggyback off.

    You don't listen to the signal for a change in value and then
        have some foreign side-effect. Instead you simply take the
        value in the signal and return a new value.

    A DuplexSignal is meant to make it easy to chain multiple
        transformations of signals together

    In fact all it does is change the listening semantics to
        return a new signal instead of returning a remove / cleanup
        function.

    ```js
    function textState(inputElem) {
        return DuplexSignal(events(inputElem, "change"))
            (function (ev) {
                return ev.target.value
            })
    }
    ```

    ```js
    var h = require("graphics/element/h")

    function View(model) {
        return DuplexSignal(model)(function (model) {
            h("div", [
                h("h1", model.title),
                h("input", { value: model.title })
            ])
        })
    }
    ```
*/

function DuplexSignal(source) {
    // to reduce the cost of calling `DuplexSignal` on signals
    // that are already duplex
    if (source._isDuplex) {
        return source
    }

    function duplex(lambda) {
        if (!lambda) {
            return source()
        }

        // a DuplexSignal returns a DuplexSignal when you give
        // it a callback. When you ask that signal for it's value
        // it will just ask the source and wrap the value through
        // the lambda
        return DuplexSignal(function signal(callback) {
            if (!callback) {
                return lambda(source())
            }

            // source is a SignalSource in this case so it returns
            // a remove function that we just pass back up
            // when we get a message from the source we just
            // pass it through the lambda and pass it up!
            return source(function listener(value) {
                callback(lambda(value))
            })
        })
    }

    duplex._isDuplex = isDuplex

    return duplex
}
