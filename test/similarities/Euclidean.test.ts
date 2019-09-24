import {simFuncs} from '../../src/similarities/ScoreSimilarities';
import {
	sim,
	simSource,
	simPairwise,
	simSubsets,
	knnNodeArray,
	getBsNotInA,
	simSort, cutFuncs, knnNodeDict
} from '../../src/similarities/SimilarityCommons';
import {TheAugments} from '../../src/perturbation/TheAugments';
import {TypedGraph} from '../../src/core/typed/TypedGraph';
import {JSONInput} from '../../src/io/input/JSONInput';
import {JSON_SIM_PATH} from "../config/test_paths";


describe('EUCLIDEAN base similarity tests', () => {

	const
		a = [3, 8, 7, 5, 2, 9],
		b = [10, 8, 6, 6, 4, 5],
		c = [],
		d = [],
		SUPER_SIZE = 1e5;
	let i = 0;
	for (let i = 0; i < SUPER_SIZE; i++) {
		c.push(i);
		d.push(i);
	}

	it('should throw upon passing vectors of different size', () => {
		expect(simFuncs.euclidean.bind(simFuncs.euclidean, [1], [])).toThrowError('Vectors must be of same size');
	});


	it('should compute EUCLIDEAN between two short vectors', () => {
		expect(simFuncs.euclidean(a, b)).toEqual({sim: 8.4261});
	});


	it('should compute EUCLIDEAN between two LARGE vectors', () => {
		expect(simFuncs.euclidean(c, d)).toEqual({sim: 0});
	});

});


/**
 * @description similarities on neo4j sample graph
 */
describe('EUCLIDEAN tests on neo4j sample graph', () => {

	const
		gFile = JSON_SIM_PATH + '/cuisineCosine.json',
		likes = 'LIKES';

	let
		g: TypedGraph,
		zhen,
		praveena;


	beforeEach(() => {
		g = new JSONInput({weighted: true}).readFromJSONFile(gFile, new TypedGraph('CosineCuisineSimilarities')) as TypedGraph;
		zhen = g.n('Zhen');
		praveena = g.n('Praveena');
	});


	it('should compute similarity between Zhen and Praveena', () => {
		const exp = {sim: 6.7082};
		const a = zhen.outs(likes);
		const b = praveena.outs(likes);
		const eres = sim(simFuncs.euclideanSets, a, b);
		// console.log(eres);
		expect(eres).toEqual(exp);
	});


	it('should compute sims from a source', () => {
		const exp = [
			{from: 'Zhen', to: 'Arya', sim: 0},
			{from: 'Zhen', to: 'Karin', sim: 0},
			{from: 'Zhen', to: 'Michael', sim: 3.6056},
			{from: 'Zhen', to: 'Praveena', sim: 6.7082}
		];
		const start = zhen.label;
		const allSets = {};
		g.getNodesT('Person').forEach(n => {
			allSets[n.label] = n.outs('LIKES');
		});
		const eres = simSource(simFuncs.euclideanSets, start, allSets, {
			// cutoff: 1e-6,
			cutFunc: cutFuncs.below,
			sort: simSort.asc
		});
		// console.log(eres);
		expect(eres).toEqual(exp);
	});


	it('should compute pairwise', () => {
		const exp = [
			{from: 'Arya', to: 'Zhen', sim: 0},
			{from: 'Karin', to: 'Zhen', sim: 0},
			{from: 'Karin', to: 'Praveena', sim: 3},
			{from: 'Michael', to: 'Zhen', sim: 3.6056},
			{from: 'Michael', to: 'Praveena', sim: 4},
			{from: 'Karin', to: 'Arya', sim: 4.3589},
			{from: 'Arya', to: 'Michael', sim: 5},
			{from: 'Praveena', to: 'Zhen', sim: 6.7082},
			{from: 'Karin', to: 'Michael', sim: 7},
			{from: 'Arya', to: 'Praveena', sim: 8}
		];
		const allSets = {};
		g.getNodesT('Person').forEach(n => {
			allSets[n.label] = n.outs('LIKES');
		});
		const eres = simPairwise(simFuncs.euclideanSets, allSets, {sort: simSort.asc});
		// console.log(eres);
		expect(eres).toEqual(exp);
	});


	it('should compute pairwise with CUTOff', () => {
		const exp = [
			{from: 'Arya', to: 'Zhen', sim: 0},
			{from: 'Karin', to: 'Zhen', sim: 0},
			{from: 'Karin', to: 'Praveena', sim: 3},
			{from: 'Michael', to: 'Zhen', sim: 3.6056},
			{from: 'Michael', to: 'Praveena', sim: 4}
		];
		const allSets = {};
		g.getNodesT('Person').forEach(n => {
			allSets[n.label] = n.outs('LIKES');
		});
		const eres = simPairwise(simFuncs.euclideanSets, allSets, {
			sort: simSort.asc,
			cutoff: 4,
			cutFunc: cutFuncs.below
		});
		// console.log(eres);
		expect(eres).toEqual(exp);
	});


	it('should compute knn Array', () => {
		const exp = [
			{from: 'Zhen', to: 'Arya', sim: 0},
			{from: 'Arya', to: 'Zhen', sim: 0},
			{from: 'Karin', to: 'Zhen', sim: 0},
			{from: 'Praveena', to: 'Karin', sim: 3},
			{from: 'Michael', to: 'Zhen', sim: 3.6056}
		];
		const allSets = {};
		g.getNodesT('Person').forEach(n => {
			allSets[n.label] = n.outs('LIKES');
		});
		const eres = knnNodeArray(simFuncs.euclideanSets, allSets, {
			sort: simSort.asc,
			knn: 1,
			dup: true
		});
		// console.log(eres);
		expect(eres).toEqual(exp);
	});


	it('should compute knn Dict', () => {
		const exp = {
			Zhen: [{to: 'Arya', sim: 0}],
			Praveena: [{to: 'Karin', sim: 3}],
			Michael: [{to: 'Zhen', sim: 3.6056}],
			Arya: [{to: 'Zhen', sim: 0}],
			Karin: [{to: 'Zhen', sim: 0}]
		};
		const allSets = {};
		g.getNodesT('Person').forEach(n => {
			allSets[n.label] = n.outs('LIKES');
		});
		const eres = knnNodeDict(simFuncs.euclideanSets, allSets, {
			sort: simSort.asc,
			knn: 1,
			dup: true
		});
		// console.log(eres);
		expect(eres).toEqual(exp);
	});


	it('should correctly compute similarities between two subsets WITH KNN', () => {
		const exp = [
			{from: 'Arya', to: 'Zhen', sim: 0},
			{from: 'Praveena', to: 'Karin', sim: 3}
		];
		const allSets = {};
		g.getNodesT('Person').forEach(n => {
			allSets[n.label] = n.outs('LIKES');
		});
		const subSet = {
			Praveena: g.n('Praveena').outs('LIKES'),
			Arya: g.n('Arya').outs('LIKES'),
		};
		const eres = simSubsets(simFuncs.euclideanSets, subSet, allSets, {knn: 1, sort: simSort.asc});
		// console.log(eres);
		expect(eres).toEqual(exp);
	});


	it('should store an additional edge for each most similar user', () => {
		const augment = new TheAugments(g);
		const relName = 'SIMILAR';
		const oldDirEdges = g.nrDirEdges();

		const allSets = {};
		g.getNodesT('Person').forEach(n => {
			allSets[n.label] = n.outs('LIKES');
		});
		const newEdges = augment.addSubsetRelationship(simFuncs.euclideanSets, allSets, {
			rtype: relName, knn: 1
		});
		expect(g.nrDirEdges()).toBe(oldDirEdges + newEdges.size);
	});


	/**
	 * @todo write when k-expander implemented
	 * @todo we need a subset-expander in TypedGraph...
	 */
	it.todo('should recommend Cuisines to Praveena that users most similar to her like (but she does not know yet');

});