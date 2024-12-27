module.exports = {
  content: ['./index.html', './app.js', './forecast.js'],
  css: ['./node_modules/bootstrap/dist/css/bootstrap.css', './styles.css'],
  output: 'dist/styles.purged.css',
  safelist: {
    standard: [
      /^bg-/,
      /^text-/,
      /^d-/,
      /^align-/,
      /^justify-/,
      /^flex-/,
      /^col-/,
      /^row/,
      /^container/,
      /^p-/,
      /^m-/,
      /^gap-/,
      /^rounded-/,
      /^shadow/,
      /^form-/,
      /^fs-/,
      /^fw-/,
      /^h[1-6]/,
      /^min-vh-/
    ],
    deep: [/^modal/, /^carousel/],
    greedy: [/^nav/, /^btn/, /^form/]
  },
  variables: true,
  rejected: true
}
