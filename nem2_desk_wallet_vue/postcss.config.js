module.exports = {
  plugins: {
      "postcss-import": {},
      "autoprefixer": {},
      "postcss-pxtorem": {
          "rootValue": 128,
          "propList": ["*"],
          "selectorBlackList": ["mint-"]
      }
  }
}
