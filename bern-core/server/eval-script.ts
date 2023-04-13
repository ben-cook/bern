import React from "react";
import ReactDOM from "react-dom";

const modules = new Map<string, any>([
  ["react", React],
  ["react-dom", ReactDOM],
]);

/**
 * IMPORTANT: This module is compiled *without* `use strict`
 * so that when we `eval` a dependency below, we don't enforce
 * `use strict` implicitly.
 *
 * Otherwise, modules like `d3` get `eval`d and forced into
 * `use strict` where they don't work (at least in current versions)
 *
 * To see the compilation details, look at `gulpfile.js` and the
 * usage of `babel-plugin-transform-remove-strict-mode`.
 */

interface Module {
  exports: {
    default?: any;
  };
}

export const evalScript = (script: any): Module["exports"] => {
  const module = { exports: {} };
  const require = function (path: any) {
    // eslint-disable-line no-unused-vars
    return modules.get(path);
  };
  // don't use Function() here since it changes source locations
  eval(script); // eslint-disable-line no-eval
  return module.exports;
};
