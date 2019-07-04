module.exports = {
  plugins: {
      "postcss-import": {},
      "autoprefixer": {},
      "postcss-pxtorem": {
          "rootValue": 64,
          "propList": ["*"],
          "selectorBlackList": ["mint-"]
      }
  }
}
