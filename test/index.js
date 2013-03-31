var test = require("tape")

var signaal = require("../index")

test("signaal is a function", function (assert) {
    assert.equal(typeof signaal, "function")
    assert.end()
})
