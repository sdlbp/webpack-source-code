/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Ivan Kopeykin @vankop
*/

"use strict";

const { cssExportConvention } = require("../util/conventions");
const makeSerializable = require("../util/makeSerializable");
const NullDependency = require("./NullDependency");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("../../declarations/WebpackOptions").CssGeneratorExportsConvention} CssGeneratorExportsConvention */
/** @typedef {import("../CssModule")} CssModule */
/** @typedef {import("../Dependency")} Dependency */
/** @typedef {import("../Dependency").ExportsSpec} ExportsSpec */
/** @typedef {import("../Dependency").UpdateHashContext} UpdateHashContext */
/** @typedef {import("../DependencyTemplate").CssDependencyTemplateContext} DependencyTemplateContext */
/** @typedef {import("../ModuleGraph")} ModuleGraph */
/** @typedef {import("../css/CssExportsGenerator")} CssExportsGenerator */
/** @typedef {import("../css/CssGenerator")} CssGenerator */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectDeserializerContext} ObjectDeserializerContext */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectSerializerContext} ObjectSerializerContext */
/** @typedef {import("../util/Hash")} Hash */

class CssExportDependency extends NullDependency {
	/**
	 * @param {string} name name
	 * @param {string} value value
	 */
	constructor(name, value) {
		super();
		this.name = name;
		this.value = value;
	}

	get type() {
		return "css :export";
	}

	/**
	 * @param {string} name export name
	 * @param {CssGeneratorExportsConvention} convention convention of the export name
	 * @returns {string[]} convention results
	 */
	getExportsConventionNames(name, convention) {
		if (this._conventionNames) {
			return this._conventionNames;
		}
		this._conventionNames = cssExportConvention(name, convention);
		return this._conventionNames;
	}

	/**
	 * Returns the exported names
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {ExportsSpec | undefined} export names
	 */
	getExports(moduleGraph) {
		const module = /** @type {CssModule} */ (moduleGraph.getParentModule(this));
		const convention =
			/** @type {CssGenerator | CssExportsGenerator} */
			(module.generator).convention;
		const names = this.getExportsConventionNames(this.name, convention);
		return {
			exports: names.map(name => ({
				name,
				canMangle: true
			})),
			dependencies: undefined
		};
	}

	/**
	 * Update the hash
	 * @param {Hash} hash hash to be updated
	 * @param {UpdateHashContext} context context
	 * @returns {void}
	 */
	updateHash(hash, { chunkGraph }) {
		const module = /** @type {CssModule} */ (
			chunkGraph.moduleGraph.getParentModule(this)
		);
		const generator =
			/** @type {CssGenerator | CssExportsGenerator} */
			(module.generator);
		const names = this.getExportsConventionNames(
			this.name,
			generator.convention
		);
		hash.update("exportsConvention");
		hash.update(JSON.stringify(names));
	}

	/**
	 * @param {ObjectSerializerContext} context context
	 */
	serialize(context) {
		const { write } = context;
		write(this.name);
		write(this.value);
		super.serialize(context);
	}

	/**
	 * @param {ObjectDeserializerContext} context context
	 */
	deserialize(context) {
		const { read } = context;
		this.name = read();
		this.value = read();
		super.deserialize(context);
	}
}

CssExportDependency.Template = class CssExportDependencyTemplate extends (
	NullDependency.Template
) {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(
		dependency,
		source,
		{ cssExportsData, module: m, runtime, moduleGraph }
	) {
		const dep = /** @type {CssExportDependency} */ (dependency);
		const module = /** @type {CssModule} */ (m);
		const convention = /** @type {CssGenerator | CssExportsGenerator} */ (
			module.generator
		).convention;
		const names = dep.getExportsConventionNames(dep.name, convention);
		const usedNames = /** @type {string[]} */ (
			names
				.map(name =>
					moduleGraph.getExportInfo(module, name).getUsedName(name, runtime)
				)
				.filter(Boolean)
		);
		if (usedNames.length === 0) return;

		for (const used of usedNames) {
			cssExportsData.exports.set(used, dep.value);
		}
	}
};

makeSerializable(
	CssExportDependency,
	"webpack/lib/dependencies/CssExportDependency"
);

module.exports = CssExportDependency;
