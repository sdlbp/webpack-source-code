function hookoptions(compiler) {
  compiler.hooks.environment.tap('hookoptions', () => {
    // TODO 如何打印一个js对象，让所有内容都展开。比如：数组、函数
    // console.log('lbp 3 ', compiler.options.toString())
  })
}

module.exports = {
  hookoptions
}
