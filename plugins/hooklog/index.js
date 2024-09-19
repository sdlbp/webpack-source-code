function hooklog (compiler) {
  let index = 1;
  // 打包过程并不是所有的hook都会被触发
  for (const hook of Object.keys(compiler.hooks)) {
    compiler.hooks[hook].tap('hook log', () => {
      // console.log(`${index} hook ${hook}`)
      console.log(`${hook}`)
      index += 1;
    })
  }
}

module.exports = {
  hooklog
}
