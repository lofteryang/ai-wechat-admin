module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "~@/styles/_variables.scss";
        `,
      },
      postcss: {
        postcssOptions: {
          plugins: [require('autoprefixer')],
        },
      },
    },
  },
}
