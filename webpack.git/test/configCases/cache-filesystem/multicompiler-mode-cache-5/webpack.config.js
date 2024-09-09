"use strict";

// no cache names

/** @type {import("../../../../").Configuration} */
module.exports = [
	{
		mode: "production",
		entry: "./index",
		cache: {
			type: "filesystem",
			name: "default"
		}
	},
	{
		mode: "production",
		entry: "./index",
		cache: {
			type: "filesystem"
		}
	}
];
