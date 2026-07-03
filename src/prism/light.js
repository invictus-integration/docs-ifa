// Night Owl light -- token colors replaced with the Invictus site palette.
// CSS variable source noted next to each color for traceability.
// All colors verified >= 4.5:1 contrast on #f4f7f8 (WCAG AA).

const theme = {
  plain: {
    color: "#1c1e21",        // --inv-diagram-text
    backgroundColor: "#f4f7f8", // --ifm-color-secondary-lightest area
  },
  styles: [
    {
      types: ["changed"],
      style: {
        color: "#1d4fa8",    // navy blue -- 7.1:1
        fontStyle: "italic",
      },
    },
    {
      types: ["deleted"],
      style: {
        color: "#b12828",    // dark red -- 6.1:1
        fontStyle: "italic",
      },
    },
    {
      types: ["inserted", "attr-name"],
      style: {
        color: "#1a6b35",    // forest green -- 6.1:1
        fontStyle: "italic",
      },
    },
    {
      types: ["comment"],
      style: {
        color: "#636a6b",    // teal-gray muted -- 5.1:1
        fontStyle: "italic",
      },
    },
    {
      types: ["string", "url"],
      style: {
        color: "#1a6b35",    // forest green -- 6.1:1 (distinct from teal keywords)
      },
    },
    {
      types: ["builtin", "char", "constant"],
      style: {
        color: "#065b68",    // --ifm-color-primary-light -- 7.1:1
      },
    },
    {
      types: ["variable"],
      style: {
        color: "#b12828",    // dark red -- 6.1:1
      },
    },
    {
      types: ["number"],
      style: {
        color: "#934304",    // --ifm-color-warning-darkest -- 6.3:1
      },
    },
    {
      // manually added so punctuations are not italicised
      types: ["punctuation"],
      style: {
        color: "#013c46",    // --ifm-color-primary-dark -- 10.5:1
      },
    },
    {
      types: ["function", "selector", "doctype"],
      style: {
        color: "#065b68",    // --ifm-color-primary-light -- 7.1:1
        fontStyle: "italic",
      },
    },
    {
      types: ["class-name"],
      style: {
        color: "#934304",    // --ifm-color-warning-darkest -- 6.3:1
      },
    },
    {
      types: ["tag"],
      style: {
        color: "#014550",    // --ifm-color-primary -- 9.9:1
      },
    },
    {
      types: ["operator", "property", "keyword", "namespace"],
      style: {
        color: "#014550",    // --ifm-color-primary -- 9.9:1
      },
    },
    {
      types: ["boolean"],
      style: {
        color: "#934304",    // --ifm-color-warning-darkest -- 6.3:1
      },
    },
  ],
};

module.exports = theme;