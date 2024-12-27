const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./index.html", "./app.js", "./forecast.js"],
  safelist: {
    standard: [/^bg-/, /^text-/, /^btn-/],
    deep: [/^dropdown/, /^modal/],
  },
  defaultExtractor: (content) => {
    const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
    const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
    return broadMatches.concat(innerMatches);
  },
});

module.exports = {
  plugins: [require("postcss-preset-env")(), purgecss],
};
