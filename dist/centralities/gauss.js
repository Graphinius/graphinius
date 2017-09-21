"use strict";
var abs = Math.abs;
function array_fill(i, n, v) {
    var a = [];
    for (; i < n; i++) {
        a.push(v);
    }
    return a;
}
function gauss(A, x) {
    var i, k, j;
    for (i = 0; i < A.length; i++) {
        A[i].push(x[i]);
    }
    var n = A.length;
    for (i = 0; i < n; i++) {
        var maxEl = abs(A[i][i]), maxRow = i;
        for (k = i + 1; k < n; k++) {
            if (abs(A[k][i]) > maxEl) {
                maxEl = abs(A[k][i]);
                maxRow = k;
            }
        }
        for (k = i; k < n + 1; k++) {
            var tmp = A[maxRow][k];
            A[maxRow][k] = A[i][k];
            A[i][k] = tmp;
        }
        for (k = i + 1; k < n; k++) {
            var c = -A[k][i] / A[i][i];
            for (j = i; j < n + 1; j++) {
                if (i === j) {
                    A[k][j] = 0;
                }
                else {
                    A[k][j] += c * A[i][j];
                }
            }
        }
    }
    x = array_fill(0, n, 0);
    for (i = n - 1; i > -1; i--) {
        x[i] = A[i][n] / A[i][i];
        for (k = i - 1; k > -1; k--) {
            A[k][n] -= A[k][i] * x[i];
        }
    }
    return x;
}
exports.gauss = gauss;
