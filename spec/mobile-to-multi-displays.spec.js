// To run tests, run these commands from the project root:
// 1. `npm install`
// 2. `npm test`

/* global describe, it, expect */

var postcss = require("postcss");
var mobileToMultiDisplays = require("..");

describe("mobile-to-multi-displays", function() {
  it("should work on the readme example", function() {
    var input = ".root-class { width: 100%; } .class { position: fixed; width: 100%; } .class2 { width: 100vw; height: 30px; }";
    var output = ".root-class { width: 100%; } .class { position: fixed; width: 100%; } .class2 { width: 100vw; height: 30px; } @media (min-width: 600px) and (min-height: 640px) { .root-class { max-width: 600px !important; } .class { width: 600px; } .class2 { height: 24.000px; width: 600px; } } @media ((min-width: 600px) and (max-height: 640px)) or ((max-width: 600px) and (orientation: landscape)) { .root-class { max-width: 425px !important; } .class { width: 425px; } .class2 { height: 17.000px; width: 425px; } } @media (min-width: 600px) or ((orientation: landscape) and (max-width: 600)) { .root-class { margin-left: auto !important; margin-right: auto !important; } .class { margin-left: auto !important; margin-right: auto !important; left: 0 !important; right: 0 !important; } }";
    var processed = postcss(mobileToMultiDisplays()).process(input).css;
    expect(processed).toBe(output);
  });

  it("should convert px to desktop and landscape radio px", function() {
    var input = ".rule { width: 375px; } .l{}";
    var output = ".rule { width: 375px; } .l{} @media (min-width: 600px) and (min-height: 640px) { .rule { width: 300.000px; } } @media ((min-width: 600px) and (max-height: 640px)) or ((max-width: 600px) and (orientation: landscape)) { .rule { width: 212.500px; } }";
    var processed = postcss(mobileToMultiDisplays()).process(input).css;
    expect(processed).toBe(output);
  });

  it("should ignore duplicate rules and props", function() {
    var input = ".rule { width: 500px; } .rule { width: 375px; width: 250px; }";
    var output = ".rule { width: 500px; } .rule { width: 375px; width: 250px; } @media (min-width: 600px) and (min-height: 640px) { .rule { width: 200.000px; } } @media ((min-width: 600px) and (max-height: 640px)) or ((max-width: 600px) and (orientation: landscape)) { .rule { width: 141.667px; } }";
    var processed = postcss(mobileToMultiDisplays()).process(input).css;
    expect(processed).toBe(output);
  });

  it("should handle < 1 values", function() {
    var input = ".rule { left: -750px; } .l{}";
    var output = ".rule { left: -750px; } .l{} @media (min-width: 600px) and (min-height: 640px) { .rule { left: -600.000px; } } @media ((min-width: 600px) and (max-height: 640px)) or ((max-width: 600px) and (orientation: landscape)) { .rule { left: -425.000px; } }"
    var processed = postcss(mobileToMultiDisplays()).process(input).css;
    expect(processed).toBe(output);
  });

  it("should handle values without a leading 0", function() {
    var input = ".rule { left: .750px; top: -.750px; right: .px; } .l{}";
    var output = ".rule { left: .750px; top: -.750px; right: .px; } .l{} @media (min-width: 600px) and (min-height: 640px) { .rule { left: 0.600px; top: -0.600px; } } @media ((min-width: 600px) and (max-height: 640px)) or ((max-width: 600px) and (orientation: landscape)) { .rule { left: 0.425px; top: -0.425px; } }";
    var processed = postcss(mobileToMultiDisplays()).process(input).css;
    expect(processed).toBe(output);
  });

  it("ignore input media queries", function() {
    var input = "@media (min-width: 600px) and (min-height: 640px) { .root-class { width: 100vw; } .class { width: 66px; }}";
    var output = "@media (min-width: 600px) and (min-height: 640px) { .root-class { width: 100vw; } .class { width: 66px; }}";
    var processed = postcss(mobileToMultiDisplays()).process(input).css;
    expect(processed).toBe(output);
  });
});