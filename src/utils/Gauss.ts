/**
 * This file was taken from https://github.com/itsravenous/gaussian-elimination
 * Authors: itsravenous, seckwei
 * Licence: GPL-3.0
 *
 * Small changes were made to comply with typescript
 */

let abs = Math.abs;

function array_fill(i, n, v) {
	let a = [];
	for (; i < n; i++) {
		a.push(v);
	}
	return a;
}

/**
 * Gaussian elimination
 * @param  A[] matrix
 * @param  x[] vector
 * @return x[] solution vector
 */
function gauss(A: any[], x: any[]) {

	let i, k, j;

	// Just make a single matrix
	for (i = 0; i < A.length; i++) {
		A[i].push(x[i]);
	}
	let n = A.length;

	for (i = 0; i < n; i++) {
		// Search for maximum in this column
		let maxEl = abs(A[i][i]),
			maxRow = i;
		for (k = i + 1; k < n; k++) {
			if (abs(A[k][i]) > maxEl) {
				maxEl = abs(A[k][i]);
				maxRow = k;
			}
		}


		// Swap maximum row with current row (column by column)
		for (k = i; k < n + 1; k++) {
			let tmp = A[maxRow][k];
			A[maxRow][k] = A[i][k];
			A[i][k] = tmp;
		}

		// Make all rows below this one 0 in current column
		for (k = i + 1; k < n; k++) {
			let c = -A[k][i] / A[i][i];
			for (j = i; j < n + 1; j++) {
				if (i === j) {
					A[k][j] = 0;
				} else {
					A[k][j] += c * A[i][j];
				}
			}
		}
	}
	// Solve equation Ax=b for an upper triangular matrix A
	x = array_fill(0, n, 0);
	for (i = n - 1; i > -1; i--) {
		x[i] = A[i][n] / A[i][i];
		for (k = i - 1; k > -1; k--) {
			A[k][n] -= A[k][i] * x[i];
		}
	}

	return x;
}

export {
	gauss
};