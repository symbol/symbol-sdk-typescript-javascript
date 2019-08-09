module.exports = {
  plugins: {
      "postcss-import": {},
      "autoprefixer": {},
      "postcss-pxtorem": {
          "rootValue": 100,
          "propList": ["*",'!font-size'],
          "selectorBlackList": ["mint-"],
          // "minPixelValue": 15
      }
  }
}
