"use client";
import {
  Primitive
} from "./chunk-MT7GTPWR.js";
import "./chunk-QEBC6UMA.js";
import {
  require_jsx_runtime
} from "./chunk-NX324PME.js";
import "./chunk-ECWOLUX3.js";
import {
  require_react
} from "./chunk-Z4L4S4OG.js";
import {
  __toESM
} from "./chunk-WOOG5QLI.js";

// node_modules/@radix-ui/react-label/dist/index.mjs
var React = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var NAME = "Label";
var Label = React.forwardRef((props, forwardedRef) => {
  return (0, import_jsx_runtime.jsx)(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        var _a;
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        (_a = props.onMouseDown) == null ? void 0 : _a.call(props, event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label.displayName = NAME;
var Root = Label;
export {
  Label,
  Root
};
//# sourceMappingURL=@radix-ui_react-label.js.map
