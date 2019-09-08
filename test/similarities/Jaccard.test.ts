import {DIR} from '../../src/core/interfaces';
import {Similarity} from '../../src/similarities/interfaces';
import {sim, simSource, simPairwise, simSort,  knnNodeArray, viaSharedPrefs} from "../../src/similarities/SimilarityCommons";
import {simFuncs} from '../../src/similarities/SetSimilarities';
import {TypedGraph} from '../../src/core/typed/TypedGraph';
import {JSONInput} from '../../src/io/input/JSONInput';
import {JSON_SIM_PATH} from "../config/test_paths";


describe('JACCARD base similarity tests', () => {

	const
		a = [1, 2, 3],
		b = [1, 2, 4, 5],
		c = [],
		d = [],
		SUPER_SIZE = 1e5;
	let i = SUPER_SIZE;
	// Asymmetric split...
	while (i-- >= SUPER_SIZE / 3) d.push(i);
	while (i--) c.push(i);
	let
		s_a = new Set(a),
		s_b = new Set(b),
		s_c = new Set(c),
		s_d = new Set(d),
		t_ai = new Uint32Array(a),
		t_bi = new Uint32Array(b),
		t_ci = new Uint32Array(c),
		t_di = new Uint32Array(d);


		it('should compute jaccard between two simple SETS', () => {
			const jexp: Similarity = {isect: 2, sim: 0.4};
			expect(sim(simFuncs.jaccard, s_a, s_b)).toEqual(jexp);
		});


		it('should compute jaccard between two LARGE sets', () => {
			const jexp: Similarity = {isect: 0, sim: 0};
			expect(sim(simFuncs.jaccard, s_c, s_d)).toEqual(jexp);
		});


		// it('should compute jaccard between two simple TypedArraysI32', () => {
		// 	const jexp: Similarity = {isect: 2, sim: 0.4};
		// 	expect(jaccardI32(t_ai, t_bi)).toEqual(jexp);
		// });


		// it('should compute jaccard between two LARGE TypedArraysI32', () => {
		// 	const jexp: Similarity = {isect: 0, sim: 0};
		// 	expect(jaccardI32(t_ci, t_di)).toEqual(jexp);
		// });
	
});


/**
 * @description similarities on neo4j sample graph (jaccard)
 */
describe('JACCARD tests on neo4j sample graph', () => {
	
	const
	gFile = JSON_SIM_PATH + '/cuisine.json',
	g = new JSONInput().readFromJSONFile(gFile, new TypedGraph('CuisineSimilarities')) as TypedGraph,
	// expanse = new TheExpanse(g),
	arya = g.n('Arya'),
	karin = g.n('Karin');


	/**
	 * Cuisine preference similarity of Karin & Arya
	 *
	 * MATCH (p1:Person {name: 'Karin'})-[:LIKES]->(cuisine1)
		 WITH p1, collect(id(cuisine1)) AS p1Cuisine
		 MATCH (p2:Person {name: "Arya"})-[:LIKES]->(cuisine2)
		 WITH p1, p1Cuisine, p2, collect(id(cuisine2)) AS p2Cuisine
		 RETURN
	 		p1.name AS from,
		 	p2.name AS to,
		 	algo.similarity.jaccard(p1Cuisine, p2Cuisine) AS similarity
	 */
	it('should compute the correct culinary similarity of Karin & Arya', () => {
		const kc = g.outs(karin, 'LIKES');
		const ac = g.outs(arya, 'LIKES');
		const jexp: Similarity = {isect: 2, sim: 0.66667};
		const jres = sim(simFuncs.jaccard, kc, ac);
		expect(jres).toEqual(jexp);
	});


	it('should compute the correct culinary similarities for Karin', () => {
		const jexp = [
      { from: 'Karin', to: 'Arya', isect: 2, sim: 0.66667 },
      { from: 'Karin', to: 'Michael', isect: 1, sim: 0.25 },
      { from: 'Karin', to: 'Zhen', isect: 0, sim: 0 },
      { from: 'Karin', to: 'Praveena', isect: 0, sim: 0 }
    ];
		const start = karin.label;
		const allSets = {};
		g.getNodesT('Person').forEach(n => {
			allSets[n.label] = g.expand(n, DIR.out, 'LIKES');
		});
		const jres = simSource(simFuncs.jaccard, start, allSets);
		// console.log(jres);
		expect(jres).toEqual(jexp);
	});


	it('should compute the pairwise culinary similarity', () => {
		const jexp = [
      { from: 'Michael', to: 'Zhen', isect: 2, sim: 0.66667 },
      { from: 'Karin', to: 'Arya', isect: 2, sim: 0.66667 },
      { from: 'Praveena', to: 'Zhen', isect: 1, sim: 0.33333 },
      { from: 'Michael', to: 'Praveena', isect: 1, sim: 0.25 },
      { from: 'Arya', to: 'Praveena', isect: 1, sim: 0.25 },
      { from: 'Karin', to: 'Michael', isect: 1, sim: 0.25 },
      { from: 'Arya', to: 'Michael', isect: 1, sim: 0.2 },
      { from: 'Arya', to: 'Zhen', isect: 0, sim: 0 },
      { from: 'Karin', to: 'Zhen', isect: 0, sim: 0 },
      { from: 'Karin', to: 'Praveena', isect: 0, sim: 0 }
		];
		const allSets = {};
		g.getNodesT('Person').forEach(n => {
			allSets[n.label] = g.expand(n, DIR.out, 'LIKES');
		});
		const jres = simPairwise(simFuncs.jaccard, allSets);

		expect(jres.length).toBe(10);
		expect(jres).toEqual(jexp);
	});


	it('should compute the top-K per node', () => {
		const topKExp = [
      { from: 'Zhen', to: 'Michael', isect: 2, sim: 0.66667 },
      { from: 'Michael', to: 'Zhen', isect: 2, sim: 0.66667 },
      { from: 'Arya', to: 'Karin', isect: 2, sim: 0.66667 },
      { from: 'Karin', to: 'Arya', isect: 2, sim: 0.66667 },
      { from: 'Praveena', to: 'Zhen', isect: 1, sim: 0.33333 }
    ];
		const allSets = {};
		g.getNodesT('Person').forEach(n => {
			allSets[n.label] = g.expand(n, DIR.out, 'LIKES');
		});
		const topK = knnNodeArray(simFuncs.jaccard, allSets, {knn: 1, dup: true});
		// console.log(topK);
		expect(topK).toEqual(topKExp);
	});


	/**
	// compute categories for recipes
	MATCH (recipe:Recipe)-[:TYPE]->(cuisine)
	WITH {item:id(recipe), categories: collect(id(cuisine))} as data
	WITH collect(data) AS recipeCuisines

	// compute categories for people
	MATCH (person:Person)-[:LIKES]->(cuisine)
	WITH recipeCuisines, {item:id(person), categories: collect(id(cuisine))} as data
	WITH recipeCuisines, collect(data) AS personCuisines

	// create sourceIds and targetIds lists
	WITH recipeCuisines, personCuisines,
			[value in recipeCuisines | value.item] AS sourceIds,
			[value in personCuisines | value.item] AS targetIds

	CALL algo.similarity.jaccard.stream(recipeCuisines + personCuisines, {sourceIds: sourceIds, targetIds: targetIds})
	YIELD item1, item2, similarity
	WITH algo.getNodeById(item1) AS from, algo.getNodeById(item2) AS to, similarity
	RETURN from.title AS from, to.name AS to, similarity
	ORDER BY similarity DESC
	LIMIT 10
	*
	* @todo think about making it it's own method...
 	*/
	it('should find similarities between recipes and people depending on shared cuisine', () => {
		const simExp = [
			{ from: 'Peri Peri Naan', to: 'Praveena', isect: 2, sim: 1 },
			{ from: 'Shrimp Bolognese', to: 'Michael', isect: 2, sim: 0.66667 },
			{	from: 'Saltimbocca alla roman', to: 'Michael', isect: 2, sim: 0.66667	},
			{ from: 'Shrimp Bolognese', to: 'Zhen', isect: 1, sim: 0.33333 },
			{ from: 'Shrimp Bolognese', to: 'Praveena', isect: 1, sim: 0.33333 },
			{ from: 'Shrimp Bolognese', to: 'Karin', isect: 1, sim: 0.33333 },
			{	from: 'Saltimbocca alla roman',	to: 'Zhen',	isect: 1,	sim: 0.33333},
			{	from: 'Saltimbocca alla roman',	to: 'Karin', isect: 1,	sim: 0.33333 },
			{ from: 'Peri Peri Naan', to: 'Zhen', isect: 1, sim: 0.33333 },
			{ from: 'Shrimp Bolognese', to: 'Arya', isect: 1, sim: 0.25 },
			{ from: 'Saltimbocca alla roman', to: 'Arya', isect: 1, sim: 0.25 },
			{ from: 'Peri Peri Naan', to: 'Michael', isect: 1, sim: 0.25 },
			{ from: 'Peri Peri Naan', to: 'Arya', isect: 1, sim: 0.25 }
		];
		
		const tic = process.hrtime()[1];
		const sims = viaSharedPrefs(g, simFuncs.jaccard, {
			t1: 'Recipe',
			t2: 'Person',
			d1: DIR.out,
			d2: DIR.out,
			e1: 'Type',
			e2: 'Likes'
		});
		const toc = process.hrtime()[1];
		
		// console.log(sims);
		console.log(`Computing Jaccard similarity based on shared preferences took ${toc-tic} nanos.`);

		expect(sims).toEqual(simExp);
	});


	/**
	 * 
	MATCH (person:Person)-[:LIKES]->(cuisine)
	WITH {item:id(person), name: person.name, categories: collect(id(cuisine))} as data
	WITH collect(data) AS personCuisines

	// create sourceIds list containing ids for Praveena and Arya
	WITH personCuisines,
			[value in personCuisines WHERE value.name IN ["Praveena", "Arya"] | value.item ] AS sourceIds

	CALL algo.similarity.jaccard.stream(personCuisines, {sourceIds: sourceIds, topK: 1})
	YIELD item1, item2, similarity
	WITH algo.getNodeById(item1) AS from, algo.getNodeById(item2) AS to, similarity
	RETURN from.name AS from, to.name AS to, similarity
	ORDER BY similarity DESC
	 *
	 * @description similarity between subsets 
	 */
	it('should find the most similar Person to Karin & Arya', () => {
		const allSets = {};
		g.getNodesT('Person').forEach(n => {
			allSets[n.label] = g.expand(n, DIR.out, 'LIKES');
		});
		console.log(simSource(simFuncs.jaccard, 'Karin', allSets, {knn: 1})[0]);
		console.log(simSource(simFuncs.jaccard, 'Arya', allSets, {knn: 1})[0]);
	});


	/**
	 * let's say (French, Lebanese) vs. (Italian, Portuguese)
	 */
	it.todo('should compute group similarity');
	
});
