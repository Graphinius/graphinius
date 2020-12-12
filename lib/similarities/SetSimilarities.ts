import * as $I from './interfaces';

/*----------------------------------*/
/*							CONSTS							*/
/*----------------------------------*/

export const setSimFuncs = {
	jaccard,
	overlap
};

const PRECISION = 5;


/*----------------------------------*/
/*			SET SIMILARITY MEASURES			*/
/*----------------------------------*/


/**
 * @param a set A
 * @param b set B
 */
function jaccard(a: Set<any>, b: Set<any>) : $I.Similarity {
	const ui = unionIntersect(a, b);
	return {
		isect: ui.isectSize,
		sim: +(ui.isectSize / ui.unionSize).toPrecision(PRECISION)
	}
}


/**
 * @description commonly used to detect sub/super relationships
 * @param a 
 * @param b 
 */
function overlap(a: Set<any>, b: Set<any>) : $I.Similarity {
	const ui = unionIntersect(a, b);
	return {
		isect: ui.isectSize,
		sim: +(ui.isectSize / Math.min(a.size, b.size)).toPrecision(PRECISION)
	}
}


function unionIntersect(a: Set<any>, b: Set<any>) {
	const unionSize = new Set([...Array.from(a), ...Array.from(b)]).size;
	const isectSize = a.size + b.size - unionSize;
	return {unionSize, isectSize};
}

