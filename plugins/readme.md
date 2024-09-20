webpack的插件可以是一个函数或者类。两种最简webpack插件如下：

```javascript
// 函数插件
function FunPlugin(compiler) {
  // environment 是webpack中compiler的其中一个钩子
  // tap是向钩子上注册事件
  // FunPluginName 是插件名称
  // 名称后面是回调函数，根据不同的钩子，回调函数的入参可能有所不同
  compiler.hooks.environment.tap('FunPluginName', () => {

  })
}

// 类插件
class ClassPlugin {
  // 必须实现此方法，此方法是类插件的挂载入口
  apply(compiler) {
    compiler.hooks.environment.tap('ClassPlugin', () => {

    })
  }
}
```  

在webpack中，函数插件、类插件两种形态对于实现功能来说没有区别。  
从源码上来看，两种类型的插件不同仅仅是挂载方式的区别

```javascript
    // 4、注册所有插件。函数与类组件仅仅只是挂载方式的区别
if (Array.isArray(options.plugins)) {
  for (const plugin of options.plugins) {
    // webpack的插件可以是一个函数或者实例对象，两种不同形式的插件仅仅是挂载方式的不同
    if (typeof plugin === "function") {
      /** @type {WebpackPluginFunction} */
      (plugin).call(compiler, compiler);
    } else if (plugin) {
      // webpack 的插件在设置的时，类似 new Plugin()，因此此处是一个实例对象
      plugin.apply(compiler);
    }
  }
}
```
