module.exports = {
  plugins: {
      "postcss-import": {},
      "autoprefixer": {},
      "postcss-pxtorem": {
          "rootValue": 100,
          // "propList": ["*",'!font-size'],
          "propList": ["*"],
          "selectorBlackList": ["mint-"],
          // "minPixelValue": 15
      }
  }
}
