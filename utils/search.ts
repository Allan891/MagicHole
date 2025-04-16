
import Fuse from 'fuse.js'
// export const Fuse = require('fuse.js');

export const fuseOptions = {
	// isCaseSensitive: false,
	// includeScore: false,
	// ignoreDiacritics: false,
	 shouldSort: false,
	// includeMatches: false,
	// findAllMatches: false,
	 minMatchCharLength: 0,
	// location: 0,
	// threshold: 0.6,
	// distance: 100,
	// useExtendedSearch: false,
	ignoreLocation: true,
	// ignoreFieldNorm: false,
	// fieldNormWeight: 1,
	keys: [
		"name"
	]
};

export const search = (list,searchPattern) => {
	const fuse = new Fuse(list, fuseOptions);
return fuse.search(searchPattern)
}
