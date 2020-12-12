import { DIR } from '../../lib/core/interfaces';
import { simSource, simPairwise } from "../../lib/similarities/SimilarityCommons";
import { setSimFuncs as simFuncs } from '../../lib/similarities/SetSimilarities';
import { TypedGraph } from '../../lib/core/typed/TypedGraph';
import { JSONInput } from '../../lib/io/input/JSONInput';
import { JSON_SIM_PATH } from "../config/test_paths";


/**
 * @description similarities on neo4j sample graph (jaccard)
 * 
 * @todo Why is base using jaccard ??
 */
describe('Cutoff & knn similarity tests', () => {

	const
		gFile = JSON_SIM_PATH + '/cuisine.json',
		g = new JSONInput().readFromJSONFile(gFile, new TypedGraph('CuisineSimilarities')) as TypedGraph,
		// expanse = new TheExpanse(g),
		karin = g.n('Karin');


	it('simSource should consider c (cutoff) threshold', () => {
		const start = karin.label;
		const targets = {};
		g.getNodesT('Person').forEach(n => {
			targets[n.label] = g.expand(n, DIR.out, 'LIKES').set;
		});
		const jres = simSource(simFuncs.jaccard, start, targets, { cutoff: 0.3 });
		expect(jres.length).toBe(1);
	});


	it('simPairwise should consider c (cutoff) threshold', () => {
		const targets = {};
		g.getNodesT('Person').forEach(n => {
			targets[n.label] = g.expand(n, DIR.out, 'LIKES').set;
		});
		const jres = simPairwise(simFuncs.jaccard, targets, { cutoff: 0.3 });
		expect(jres.length).toBe(3);
	});


	it('simSource should consider knn factor', () => {
		const start = karin.label;
		const targets = {};
		g.getNodesT('Person').forEach(n => {
			targets[n.label] = g.expand(n, DIR.out, 'LIKES').set;
		});
		const jres = simSource(simFuncs.jaccard, start, targets, { knn: 3 });
		expect(jres.length).toBe(3);
	});


	it('simSource should consider min(knn, size(res))', () => {
		const start = karin.label;
		const targets = {};
		g.getNodesT('Person').forEach(n => {
			targets[n.label] = g.expand(n, DIR.out, 'LIKES').set;
		});
		const jres = simSource(simFuncs.jaccard, start, targets, { knn: 13 });
		expect(jres.length).toBe(4);
	});


	it('simPairwise should consider knn factor', () => {
		const targets = {};
		g.getNodesT('Person').forEach(n => {
			targets[n.label] = g.expand(n, DIR.out, 'LIKES').set;
		});
		const jres = simPairwise(simFuncs.jaccard, targets, { knn: 5 });
		expect(jres.length).toBe(5);
	});


	it('simPairwise should consider min(knn, size(res) factor', () => {
		const targets = {};
		g.getNodesT('Person').forEach(n => {
			targets[n.label] = g.expand(n, DIR.out, 'LIKES');
		});
		const jres = simPairwise(simFuncs.jaccard, targets, { knn: 15 });
		expect(jres.length).toBe(10);
	});


	it('simSource should return min(knn, #res(>cutoff)) results', () => {
		const start = karin.label;
		const targets = {};
		g.getNodesT('Person').forEach(n => {
			targets[n.label] = g.expand(n, DIR.out, 'LIKES').set;
		});
		const jres = simSource(simFuncs.jaccard, start, targets, { cutoff: 0.3, knn: 3 });
		expect(jres.length).toBe(1);
	});


	it('simPairwise should return min(knn, #res(>cutoff)) results', () => {
		const targets = {};
		g.getNodesT('Person').forEach(n => {
			targets[n.label] = g.expand(n, DIR.out, 'LIKES').set;
		});
		const jres = simPairwise(simFuncs.jaccard, targets, { cutoff: 0.3, knn: 5 });
		expect(jres.length).toBe(3);
	});


	/**
	 * Time measurement -> not necessary for test suite
	 */
	it('should compute the pairwise culinary similarity (Jaccard)', () => {
		let tic = process.hrtime()[1];
		const targets = {};
		g.getNodesT('Person').forEach(n => {
			targets[n.label] = g.expand(n, DIR.out, 'LIKES');
		});
		let toc = process.hrtime()[1];
		console.log(`Expansion on 5 nodes on mini DB took ${toc - tic} nanos.`);

		tic = process.hrtime()[1]; // +new Date;
		const jres = simPairwise(simFuncs.jaccard, targets);
		toc = process.hrtime()[1]; // +new Date;
		console.log(`All pairs Jaccard on mini DB took ${toc - tic} nanos.`);

		// tic = process.hrtime()[1];
		// expect(jres.length).toBe(10);
		// expect(jres).toEqual(jexp);
		// toc = process.hrtime()[1];
		// console.log(`Running Jest expect took ${toc-tic} nanos.`);
	});

});
