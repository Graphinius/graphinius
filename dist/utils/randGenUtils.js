"use strict";
/**
 * Taken from https://github.com/robbrit/randgen
 * and slightly modified to give TS completion
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Generate a random Base36  UID of length 24
 */
function randBase36String() {
    return (Math.random() + 1).toString(36).substr(2, 24);
}
exports.randBase36String = randBase36String;
/*jslint indent: 2, plusplus: true, sloppy: true */
// Generate uniformly distributed random numbers
// Gives a random number on the interval [min, max).
// If discrete is true, the number will be an integer.
function runif(min, max, discrete) {
    if (min === undefined) {
        min = 0;
    }
    if (max === undefined) {
        max = 1;
    }
    if (discrete === undefined) {
        discrete = false;
    }
    if (discrete) {
        return Math.floor(runif(min, max, false));
    }
    return Math.random() * (max - min) + min;
}
exports.runif = runif;
// Generate normally-distributed random nubmers
// Algorithm adapted from:
// http://c-faq.com/lib/gaussian.html
function rnorm(mean, stdev) {
    this.v2 = null;
    var u1, u2, v1, v2, s;
    if (mean === undefined) {
        mean = 0.0;
    }
    if (stdev === undefined) {
        stdev = 1.0;
    }
    if (this.v2 === null) {
        do {
            u1 = Math.random();
            u2 = Math.random();
            v1 = 2 * u1 - 1;
            v2 = 2 * u2 - 1;
            s = v1 * v1 + v2 * v2;
        } while (s === 0 || s >= 1);
        this.v2 = v2 * Math.sqrt(-2 * Math.log(s) / s);
        return stdev * v1 * Math.sqrt(-2 * Math.log(s) / s) + mean;
    }
    v2 = this.v2;
    this.v2 = null;
    return stdev * v2 + mean;
}
exports.rnorm = rnorm;
// rnorm.v2 = null;
// Generate Chi-square distributed random numbers
function rchisq(degreesOfFreedom) {
    if (degreesOfFreedom === undefined) {
        degreesOfFreedom = 1;
    }
    var i, z, sum = 0.0;
    for (i = 0; i < degreesOfFreedom; i++) {
        z = rnorm();
        sum += z * z;
    }
    return sum;
}
exports.rchisq = rchisq;
// Generate Poisson distributed random numbers
function rpoisson(lambda) {
    if (lambda === undefined) {
        lambda = 1;
    }
    var l = Math.exp(-lambda), k = 0, p = 1.0;
    do {
        k++;
        p *= Math.random();
    } while (p > l);
    return k - 1;
}
exports.rpoisson = rpoisson;
// Generate Cauchy distributed random numbers
function rcauchy(loc, scale) {
    if (loc === undefined) {
        loc = 0.0;
    }
    if (scale === undefined) {
        scale = 1.0;
    }
    var n2, n1 = rnorm();
    do {
        n2 = rnorm();
    } while (n2 === 0.0);
    return loc + scale * n1 / n2;
}
exports.rcauchy = rcauchy;
// Bernoulli distribution: gives 1 with probability p
function rbernoulli(p) {
    return Math.random() < p ? 1 : 0;
}
exports.rbernoulli = rbernoulli;
// Vectorize a random generator
function vectorize(generator) {
    return function () {
        var n, result, i, args;
        args = [].slice.call(arguments);
        n = args.shift();
        result = [];
        for (i = 0; i < n; i++) {
            result.push(generator.apply(this, args));
        }
        return result;
    };
}
// Generate a histogram from a list of numbers
function histogram(data, binCount) {
    binCount = binCount || 10;
    var bins, i, scaled, max = Math.max.apply(this, data), min = Math.min.apply(this, data);
    // edge case: max == min
    if (max === min) {
        return [data.length];
    }
    bins = [];
    // zero each bin
    for (i = 0; i < binCount; i++) {
        bins.push(0);
    }
    for (i = 0; i < data.length; i++) {
        // scale it to be between 0 and 1
        scaled = (data[i] - min) / (max - min);
        // scale it up to the histogram size
        scaled *= binCount;
        // drop it in a bin
        scaled = Math.floor(scaled);
        // edge case: the max
        if (scaled === binCount) {
            scaled--;
        }
        bins[scaled]++;
    }
    return bins;
}
exports.histogram = histogram;
/**
 * Get a random element from a list
 */
function rlist(list) {
    return list[runif(0, list.length, true)];
}
exports.rlist = rlist;
var rvunif = vectorize(runif);
exports.rvunif = rvunif;
var rvnorm = vectorize(rnorm);
exports.rvnorm = rvnorm;
var rvchisq = vectorize(rchisq);
exports.rvchisq = rvchisq;
var rvpoisson = vectorize(rpoisson);
exports.rvpoisson = rvpoisson;
var rvcauchy = vectorize(rcauchy);
exports.rvcauchy = rvcauchy;
var rvbernoulli = vectorize(rbernoulli);
exports.rvbernoulli = rvbernoulli;
var rvlist = vectorize(rlist);
exports.rvlist = rvlist;
