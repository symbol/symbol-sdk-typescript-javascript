
module.exports = {
    plugins: {
        "postcss-import": {},
        "autoprefixer": {},
        "postcss-pxtorem": {
            "rootValue": 100,
            "propList": ["*"],
            "selectorBlackList": ["mint-"],
        }
    }
}