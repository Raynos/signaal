var extend = require("xtend")

var transform = require("../transform")
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

var view = transform(flower, function (flower) {
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
