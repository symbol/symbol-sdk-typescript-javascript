module.exports = {
  plugins: {
      "postcss-import": {},
      "autoprefixer": {},
      "postcss-pxtorem": {
          "rootValue": 256,
          "propList": ["outline"],
          "selectorBlackList": ["mint-"]
      }
  }
}
