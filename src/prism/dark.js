// Night Owl dark -- token colors replaced with the Invictus site palette.
// CSS variable source noted next to each color for traceability.
// Background matches --ifm-color-gray-900 (#171923) for seamless page blending.
// All colors verified >= 4.5:1 contrast on #171923 (WCAG AA).

const theme = {
  plain: {
    color: "#d6deeb",           // Night Owl near-white
    backgroundColor: "#171923", // --ifm-color-gray-900 (actual dark page bg)
  },
  styles: [
    {
      types: ["changed"],
      style: {
        color: "#93c5fd",        // light blue -- 9.7:1
        fontStyle: "italic",
      },
    },
    {
      types: ["deleted"],
      style: {
        color: "#f87171",        // soft red -- 6.3:1
        fontStyle: "italic",
      },
    },
    {
      types: ["inserted", "attr-name"],
      style: {
        color: "rgb(173, 219, 103)", // Night Owl lime green -- 10.6:1
        fontStyle: "italic",
      },
    },
    {
      types: ["comment"],
      style: {
        color: "#7f94a0",        // muted teal-gray -- 5.5:1
        fontStyle: "italic",
      },
    },
    {
      types: ["string", "url"],
      style: {
        color: "rgb(173, 219, 103)", // Night Owl lime green -- 10.6:1
      },
    },
    {
      types: ["variable"],
      style: {
        color: "#d6deeb",        // plain near-white
      },
    },
    {
      types: ["number"],
      style: {
        color: "#ffb84b",        // --ifm-color-warning-light -- 9.9:1
      },
    },
    {
      types: ["builtin", "char", "constant", "function"],
      style: {
        color: "#36b1c5",        // --ifm-link-color (dark) -- 6.6:1
      },
    },
    {
      // manually added so punctuations are not italicised
      types: ["punctuation"],
      style: {
        color: "rgb(199, 146, 234)", // Night Owl purple -- 7.3:1
      },
    },
    {
      types: ["selector", "doctype"],
      style: {
        color: "rgb(199, 146, 234)", // Night Owl purple -- 7.3:1
        fontStyle: "italic",
      },
    },
    {
      types: ["class-name"],
      style: {
        color: "#ffb84b",        // --ifm-color-warning-light -- 9.9:1
      },
    },
    {
      types: ["tag", "operator", "keyword"],
      style: {
        color: "#4fcadf",        // --ifm-link-hover-color (dark) -- 8.5:1
      },
    },
    {
      types: ["boolean"],
      style: {
        color: "#ffb84b",        // --ifm-color-warning-light -- 9.9:1
      },
    },
    {
      types: ["property"],
      style: {
        color: "#36b1c5",        // --ifm-link-color (dark) -- 6.6:1
      },
    },
    {
      types: ["namespace"],
      style: {
        color: "#a0dde5",        // --inv-diagram-header-subtitle -- 11.3:1
      },
    },
  ],
};

module.exports = theme;