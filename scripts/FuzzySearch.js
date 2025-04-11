
export const Fuse = require('fuse.js');

export const fuseOptions = {
	// isCaseSensitive: false,
	// includeScore: false,
	// ignoreDiacritics: false,
	// shouldSort: true,
	// includeMatches: false,
	// findAllMatches: false,
	 minMatchCharLength: 2,
	// location: 0,
	// threshold: 0.6,
	// distance: 100,
	// useExtendedSearch: false,
	// ignoreLocation: false,
	// ignoreFieldNorm: false,
	// fieldNormWeight: 1,
	keys: [
		"name"
	]
};

export const fuse = new Fuse(list, fuseOptions);

// Change the pattern
export const searchPattern = ""

return fuse.search(searchPattern)