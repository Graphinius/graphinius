const PRECISION = 5;

export const scoreSimFuncs = {
  cosine,
  cosineSets,
  euclidean,
  euclideanSets,
  pearson,
  pearsonSets,
};

/*----------------------------------*/
/*			SET SIMILARITY MEASURES			*/

/*----------------------------------*/

function euclidean(a: number[], b: number[]) {
  if (a.length !== b.length) {
    throw new Error("Vectors must be of same size");
  }
  const at = a.length < 1e4 ? a : new Float32Array(a);
  const bt = b.length < 1e4 ? b : new Float32Array(b);

  let sum = 0,
    diff = 0;
  for (let i = 0; i < at.length; i++) {
    diff = at[i] - bt[i];
    sum += diff * diff;
  }
  let sim = +Math.sqrt(sum).toPrecision(PRECISION);
  // console.log(sim);
  return { sim };
}

/**
 *
 * @param a
 * @param b
 */
function cosine(a: number[], b: number[]) {
  if (a.length !== b.length) {
    throw new Error("Vectors must be of same size");
  }
  const fa1 = new Float32Array(a);
  const fa2 = new Float32Array(b);
  let numerator = 0;
  for (let i = 0; i < fa1.length; i++) {
    numerator += fa1[i] * fa2[i];
  }
  let dena = 0,
    denb = 0;
  for (let i = 0; i < fa1.length; i++) {
    dena += fa1[i] * fa1[i];
    denb += fa2[i] * fa2[i];
  }
  dena = Math.sqrt(dena);
  denb = Math.sqrt(denb);
  return { sim: +(numerator / (dena * denb)).toPrecision(PRECISION) };
}

/**
 *
 * @param a scores of user A for common targets
 * @param b scores of user B for common targets
 * @param a_mean avg rating for user a across ALL their ratings
 * @param b_mean avg rating for user b across ALL their ratings
 */
function pearson(a: number[], b: number[], a_mean?: number, b_mean?: number) {
  if (a.length !== b.length) {
    throw new Error("Vectors must be of same size");
  }
  let sum_a = 0,
    sum_b = 0,
    mean_a = a_mean || 0,
    mean_b = b_mean || 0,
    numerator = 0,
    diff_a_sq = 0,
    diff_b_sq = 0,
    denominator,
    a_diff,
    b_diff,
    sim;

  if (!a_mean || !b_mean) {
    for (let i = 0; i < a.length; i++) {
      sum_a += a[i];
      sum_b += b[i];
    }
    mean_a = sum_a / a.length;
    mean_b = sum_b / b.length;
  }

  for (let i = 0; i < a.length; i++) {
    a_diff = a[i] - mean_a;
    b_diff = b[i] - mean_b;
    numerator += a_diff * b_diff;
    diff_a_sq += a_diff * a_diff;
    diff_b_sq += b_diff * b_diff;
  }
  denominator = Math.sqrt(diff_a_sq) * Math.sqrt(diff_b_sq);
  sim = +(numerator / denominator).toPrecision(PRECISION);
  return { sim };
}

/**
 * @description first extract
 * @param a
 * @param b
 */
function cosineSets(a: Set<string>, b: Set<string>) {
  const [aa, ba] = extractCommonTargetScores(a, b);
  if (!aa.length || !ba.length) {
    return { sim: 0 };
  }
  return cosine(aa, ba);
}

function euclideanSets(a: Set<string>, b: Set<string>) {
  const [aa, ba] = extractCommonTargetScores(a, b);
  if (!aa.length || !ba.length) {
    return { sim: 0 };
  }
  return euclidean(aa, ba);
}

/**
 *
 * @param a
 * @param b
 */
function pearsonSets(a: Set<string>, b: Set<string>) {
  const [aa, ba, a_mean, b_mean] = extractCommonTargetScores(a, b);

  // console.log(aa, ba);

  if (!aa.length || !ba.length) {
    return { sim: 0 };
  }
  return pearson(aa, ba, a_mean, b_mean);
}

/**
 * @description this method implicitly ensures that sets given to cosine
 *              are always of the same length
 * @param a
 * @param b
 */
function extractCommonTargetScores(
  a: Set<string>,
  b: Set<string>
): [number[], number[], number, number] {
  // we need to extract the target IDs first
  let a_id = new Set(),
    b_id = new Set();
  for (let e of a) a_id.add(e.split("#")[0]);
  for (let e of b) b_id.add(e.split("#")[0]);

  // now we collect the scores for common targets (in the same order)
  let score,
    a_map = new Map(),
    b_map = new Map(),
    a_vec = [],
    b_vec = [],
    earr,
    a_mean = 0,
    b_mean = 0;
  for (let e of a) {
    earr = e.split("#"); // we can assume 0 is the target...
    score = +earr[earr.length - 1];
    a_mean += score;
    if (b_id.has(earr[0])) {
      a_map.set(earr[0], score);
    }
  }
  for (let e of b) {
    const earr = e.split("#");
    score = +earr[earr.length - 1];
    b_mean += score;
    if (a_id.has(earr[0])) {
      b_map.set(earr[0], score);
    }
  }

  // Maps preserve the order in which items were entered
  // console.log(a_map, b_map);
  let a_keys = Array.from(a_map.keys()).sort();
  for (let key of a_keys) {
    a_vec.push(a_map.get(key));
  }
  let b_keys = Array.from(b_map.keys()).sort();
  for (let key of b_keys) {
    b_vec.push(b_map.get(key));
  }

  return [a_vec, b_vec, a_mean / a.size, b_mean / b.size];
}
