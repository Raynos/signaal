# signaal

[![build status][1]][2] [![dependency status][3]][4]

[![browser support][5]][6]

A representation of values over time

## Example

```js
var extend = require("xtend")

var map = require("../map")
var Signal = require("../state")
var Source = require("../source")

var sunshine = Source(function (broadcast) {
    setInterval(broadcast, 1000)
})

var rain = Source(function (broadcast) {
    setInterval(broadcast, 3000)
})

var flower = Signal()
    .listen(sunshine, function (flower, shine) {
        return extend(flower, { shines: ++flower.shines })
    })
    .listen(rain, function (flower, water) {
        return extend(flower, { roots: ++flower.roots })
    })
    .initial({ shines: 0, roots: 0 })

var view = map(flower, function (flower) {
    return "" +
        "<div>" +
            "<span> Roots : " + flower.roots + " </span>" +
            "<span> Shines : " + flower.shines + " </span>" +
        "</div>"
})

var elem = document.createElement("div")
elem.innerHTML = view()
view(function (html) {
    elem.innerHTML = html
})
elem // =>

```

## Installation

`npm install signaal`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://secure.travis-ci.org/Raynos/signaal.png
  [2]: https://travis-ci.org/Raynos/signaal
  [3]: https://david-dm.org/Raynos/signaal.png
  [4]: https://david-dm.org/Raynos/signaal
  [5]: https://ci.testling.com/Raynos/signaal.png
  [6]: https://ci.testling.com/Raynos/signaal
