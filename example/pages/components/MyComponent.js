"use strict";
exports.__esModule = true;
var mod_ts_1 = require("../../../mod.ts");
var MyComponent = function (_a, _b) {
    var a = _a.a, b = _a.b;
    var c = _b.c, d = _b.d, setState = _b.setState;
    console.log("LAS PROPS QUE LLEGAN", a, b);
    console.log("EL STATE QUE LLEGA", c, d);
    var onClick = function (e) {
        e.preventDefault();
        console.log("CLICK!");
        // setState({ c: Math.random(), d: "Random" });
    };
    return (mod_ts_1.React.createElement(mod_ts_1.React.Fragment, null,
        mod_ts_1.React.createElement("p", null, "hello"),
        mod_ts_1.React.createElement("p", null, c),
        mod_ts_1.React.createElement("button", { onClick: onClick }, "Click me")));
};
var initialState = { c: 0, d: "Hello" };
exports["default"] = mod_ts_1.createComponent(MyComponent, initialState);
