/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const EntryDependency = require("./dependencies/EntryDependency");
// 入口的实际处理插件
/** @typedef {import("./Compiler")} Compiler */
/** @typedef {import("./Entrypoint").EntryOptions} EntryOptions */

class EntryPlugin {
	/**
	 * An entry plugin which will handle creation of the EntryDependency
	 * @param {string} context context path
	 * @param {string} entry entry path
	 * @param {EntryOptions | string=} options entry options (passing a string is deprecated)
	 */
	constructor(context, entry, options) {
		this.context = context;
		this.entry = entry;
		this.options = options || "";
	}

	/**
	 * Apply the plugin
	 * @param {Compiler} compiler the compiler instance
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.compilation.tap(
			"EntryPlugin",
			(compilation, { normalModuleFactory }) => {
				compilation.dependencyFactories.set(
					EntryDependency,
					normalModuleFactory
				);
			}
		);

		const { entry, options, context } = this;
		// 处理入口的依赖
		/**
		 * {
		 * _parentModule: undefined,
		 * _parentDependenciesBlock: undefined,
		 * _parentDependenciesBlockIndex: -1,
		 * weak: false,
		 * optional: false,
		 * _locSL: 0,
		 * _locSC: 0,
		 * _locEL: 0,
		 * _locEC: 0,
		 * _locI: undefined,
		 * _locN: 'main',
		 * _loc: { name: 'main' },
		 * request: './src/index.js',
		 * userRequest: './src/index.js',
		 * range: undefined,
		 * assertions: undefined,
		 * _context: undefined
		 * }
		 */
		const dep = EntryPlugin.createDependency(entry, options);
		// console.log("lbp 44 apply", dep);
		compiler.hooks.make.tapAsync("EntryPlugin", (compilation, callback) => {
			compilation.addEntry(context, dep, options, err => {
				callback(err);
			});
		});
	}

	/**
	 * @param {string} entry entry request
	 * @param {EntryOptions | string} options entry options (passing string is deprecated)
	 * @returns {EntryDependency} the dependency
	 */
	static createDependency(entry, options) {
		const dep = new EntryDependency(entry);
		// TODO webpack 6 remove string option
		dep.loc = {
			name:
				typeof options === "object"
					? /** @type {string} */ (options.name)
					: options
		};
		return dep;
	}
}

module.exports = EntryPlugin;
