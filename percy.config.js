module.exports = {
  version: 2,
  snapshot: {
    widths: [1280, 375], // Desktop and mobile viewports
    minHeight: 1024,
    percyCSS: `
      .secret-data { visibility: hidden; }
      [data-percy-hide] { visibility: hidden; }
    `
  },
  upload: {
    files: 'cypress/screenshots/**/*.png'
  }
}; 