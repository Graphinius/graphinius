import {simFuncs} from '../../src/similarities/ScoreSimilarities';
import {sim, simSource, simPairwise, simSubsets, knnNodeArray, getBsNotInA} from '../../src/similarities/SimilarityCommons';
import {TheAugments} from '../../src/perturbation/TheAugments';
import {TypedGraph} from '../../src/core/typed/TypedGraph';
import {JSONInput} from '../../src/io/input/JSONInput';
import {JSON_SIM_PATH} from "../config/test_paths";


describe('COSINE base similarity tests', () => {

	const
		a = [3,8,7,5,2,9],
		b = [10,8,6,6,4,5],
		c = [],
		d = [],
		SUPER_SIZE = 1e5;
	let i = 0;
	// Symmetric split...
  while (i++ < SUPER_SIZE / 2) c.push(i);
	while (i++ <= SUPER_SIZE) d.push(i);
  // console.log(c.length);
  // console.log(d.length);
  
    it('should throw upon passing vectors of different size', () => {
      expect(simFuncs.cosine.bind(simFuncs.cosine, [1], [])).toThrowError('Vectors must be of same size');
    });


		it('should compute COSINE between two short vectors', () => {
			expect(simFuncs.cosine(a, b)).toEqual({sim: 0.86389});
		});


		it('should compute COSINE between two LARGE vectors', () => {
			expect(simFuncs.cosine(c, d)).toEqual({sim: 0.94491});
    });


    it('PERFORMANCE - should compute a great amount of cosines between two short vectors', () => {
			const tic = +new Date;
			for ( let i = 0; i < SUPER_SIZE; i++ ) simFuncs.cosine(a,b);
			const toc = +new Date;
			console.log(`1e5 iterations of cosine on 5-dim vectors took ${toc - tic} ms.`);
		});
    
	});
	

/**
 * @description similarities on neo4j sample graph
 */
describe('COSINE tests on neo4j sample graph', () => {
	
	const
		gFile = JSON_SIM_PATH + '/cuisineCosine.json',
		g = new JSONInput({weighted: true}).readFromJSONFile(gFile, new TypedGraph('CosineCuisineSimilarities')) as TypedGraph,
		// expanse = new TheExpanse(g),
		likes = 'LIKES',
		michael = g.n('Michael'),
		arya = g.n('Arya');


		/**
		MATCH (p1:Person {name: 'Michael'})-[likes1:LIKES]->(cuisine)
		MATCH (p2:Person {name: "Arya"})-[likes2:LIKES]->(cuisine)
		RETURN p1.name AS from,
					p2.name AS to,
					algo.similarity.cosine(collect(likes1.score), collect(likes2.score)) AS similarity
		 */
	it('should compute COSINE between Michael and Arya', () => {
		const coexp = {sim: 0.97889};
		const a = michael.outs(likes);
		const b = arya.outs(likes);
		const cores = sim(simFuncs.cosineSets, a, b);
		// console.log(cores);
		expect(cores).toEqual(coexp);
	});


	/**
	MATCH (p1:Person {name: 'Michael'})-[likes1:LIKES]->(cuisine)
	MATCH (p2:Person)-[likes2:LIKES]->(cuisine) WHERE p2 <> p1
	RETURN p1.name AS from,
				p2.name AS to,
				algo.similarity.cosine(collect(likes1.score), collect(likes2.score)) AS similarity
	ORDER BY similarity DESC
	 */
	it('should compute COSINE from a source', () => {
		const cox = [
      { from: 'Michael', to: 'Arya', sim: 0.97889 },
      { from: 'Michael', to: 'Zhen', sim: 0.95423 },
      { from: 'Michael', to: 'Praveena', sim: 0.94299 },
      { from: 'Michael', to: 'Karin', sim: 0.84981 }
    ];
		const start = michael.label;
		const allSets = {};
		g.getNodesT('Person').forEach(n => {
			allSets[n.label] = n.outs('LIKES');
		});
		// console.log(allSets);
		const cores = simSource(simFuncs.cosineSets, start, allSets);
		// console.log(cores);
		expect(cores).toEqual(cox);
	});


	it('should compute pairwise COSINE similarity', () => {
		const cox = [
      { from: 'Karin', to: 'Praveena', sim: 1 },
      { from: 'Arya', to: 'Michael', sim: 0.97889 },
      { from: 'Karin', to: 'Arya', sim: 0.96109 },
      { from: 'Michael', to: 'Zhen', sim: 0.95423 },
      { from: 'Michael', to: 'Praveena', sim: 0.94299 },
      { from: 'Praveena', to: 'Zhen', sim: 0.91915 },
      { from: 'Karin', to: 'Michael', sim: 0.84981 },
      { from: 'Arya', to: 'Praveena', sim: 0.7194 },
      { from: 'Arya', to: 'Zhen', sim: 0 },
      { from: 'Karin', to: 'Zhen', sim: 0 }
    ];
		const allSets = {};
		g.getNodesT('Person').forEach(n => {
			allSets[n.label] = n.outs('LIKES');
		});
		const cores = simPairwise(simFuncs.cosineSets, allSets);
		// console.log(cores);
		expect(cores).toEqual(cox);
	});


	it('should compute pairwise COSINE similarity witn CUTOFF', () => {
		const allSets = {};
		g.getNodesT('Person').forEach(n => {
			allSets[n.label] = n.outs('LIKES');
		});
		const cores = simPairwise(simFuncs.cosineSets, allSets, {cutoff: 0.9});
		// console.log(cores);
		expect(cores.length).toBe(6);
	});


	it('should compute the top-K per node', () => {
		const topKExp = [
      { from: 'Praveena', to: 'Karin', sim: 1 },
      { from: 'Karin', to: 'Praveena', sim: 1 },
      { from: 'Michael', to: 'Arya', sim: 0.97889 },
      { from: 'Arya', to: 'Michael', sim: 0.97889 },
      { from: 'Zhen', to: 'Michael', sim: 0.95423 }
    ];
		const allSets = {};
		g.getNodesT('Person').forEach(n => {
			allSets[n.label] = n.outs('LIKES');
		});
		const topK = knnNodeArray(simFuncs.cosineSets, allSets, {knn: 1, dup: true});
		// console.log(topK);
		expect(topK).toEqual(topKExp);
	});


	it('should add new edges based on kNN query', () => {
		const augment = new TheAugments(g);
		const relName = 'SUB_GENRE';
		const oldDirEdges = g.nrDirEdges();
		
		const allSets = {};
		g.getNodesT('Person').forEach(n => {
			allSets[n.label] = n.outs('LIKES')
    });
		const newEdges = augment.addSubsetRelationship(simFuncs.cosineSets, allSets, {
			rtype: relName, knn: 2, cutoff: 0.5
		});
		expect(g.nrDirEdges()).toBe(oldDirEdges + newEdges.size);

		// console.log(g.n('fantasy').outs(relName));
		// console.log(g.n('scienceFiction').outs(relName));
	});


	/**
	MATCH (p:Person), (c:Cuisine)
	OPTIONAL MATCH (p)-[likes:LIKES]->(c)
	WITH {item:id(p), name: p.name, weights: collect(coalesce(likes.score, algo.NaN()))} as userData
	WITH collect(userData) as personCuisines

	// create sourceIds list containing ids for Praveena and Arya
	WITH personCuisines,
			[value in personCuisines WHERE value.name IN ["Praveena", "Arya"] | value.item ] AS sourceIds

	CALL algo.similarity.cosine.stream(personCuisines, {sourceIds: sourceIds, topK: 1})
	YIELD item1, item2, similarity
	WITH algo.getNodeById(item1) AS from, algo.getNodeById(item2) AS to, similarity
	RETURN from.name AS from, to.name AS to, similarity
	ORDER BY similarity DESC
	 */
	it('should correctly compute similarities between two subsets WITH KNN', () => {
		const cox = [
			{ from: 'Praveena', to: 'Karin', sim: 1 },
			{ from: 'Arya', to: 'Michael', sim: 0.97889 }
		];
		const allSets = {};
		g.getNodesT('Person').forEach(n => {
			allSets[n.label] = n.outs('LIKES');
		});
		const subSet = {
			Praveena: g.n('Praveena').outs('LIKES'),
			Arya: g.n('Arya').outs('LIKES'),
		};
		const cores = simSubsets(simFuncs.cosineSets, subSet, allSets, {knn: 1});
		// console.log(cores);
		expect(cores).toEqual(cox);
	});


	it('subset cosine withOUT kNN', () => {
		const cox = [
			{ from: 'Praveena', to: 'Karin', sim: 1 },
			{ from: 'Arya', to: 'Michael', sim: 0.97889 },
			{ from: 'Arya', to: 'Karin', sim: 0.96109 },
			{ from: 'Praveena', to: 'Michael', sim: 0.94299 },
			{ from: 'Praveena', to: 'Zhen', sim: 0.91915 },
			{ from: 'Praveena', to: 'Arya', sim: 0.7194 },
			{ from: 'Arya', to: 'Praveena', sim: 0.7194 },
			{ from: 'Arya', to: 'Zhen', sim: 0 }
		];
		const allSets = {};
		g.getNodesT('Person').forEach(n => {
			allSets[n.label] = n.outs('LIKES');
		});
		const subSet = {
			Praveena: g.n('Praveena').outs('LIKES'),
			Arya: g.n('Arya').outs('LIKES'),
		};
		// console.log(subSet);
		const cores = simSubsets(simFuncs.cosineSets, subSet, allSets);
		// console.log(cores);
		expect(cores).toEqual(cox);
	});


	/**
	 * @description Embeddings -> very important....
	 MATCH (c:Cuisine)
	 WITH {item:id(c), weights: c.embedding} as userData
	 WITH collect(userData) as data
	 CALL algo.similarity.cosine.stream(data, {skipValue: null})
	 YIELD item1, item2, count1, count2, similarity
	 RETURN algo.asNode(item1).name AS from, algo.asNode(item2).name AS to, similarity
	 ORDER BY similarity DESC
	 *
	 */
	it('should use embeddings to compute similarity', () => {
		const cox = [
			{ from: 'Portuguese', to: 'Lebanese', sim: 0.96711 },
			{ from: 'Lebanese', to: 'Indian', sim: 0.95904 },
			{ from: 'Portuguese', to: 'Italian', sim: 0.95824 },
			{ from: 'Mauritian', to: 'Indian', sim: 0.94643 },
			{ from: 'Indian', to: 'French', sim: 0.94145 },
			{ from: 'Mauritian', to: 'Portuguese', sim: 0.92092 },
			{ from: 'Mauritian', to: 'Lebanese', sim: 0.91925 },
			{ from: 'Lebanese', to: 'Italian', sim: 0.90729 },
			{ from: 'Portuguese', to: 'Indian', sim: 0.90302 },
			{ from: 'Mauritian', to: 'French', sim: 0.89135 },
			{ from: 'Lebanese', to: 'French', sim: 0.88538 },
			{ from: 'Portuguese', to: 'French', sim: 0.88528 },
			{ from: 'Italian', to: 'French', sim: 0.87784 },
			{ from: 'Mauritian', to: 'Italian', sim: 0.85388 },
			{ from: 'British', to: 'French', sim: 0.83846 },
			{ from: 'Indian', to: 'Italian', sim: 0.83715 },
			{ from: 'British', to: 'Indian', sim: 0.77173 },
			{ from: 'British', to: 'Lebanese', sim: 0.73931 },
			{ from: 'British', to: 'Portuguese', sim: 0.73871 },
			{ from: 'British', to: 'Mauritian', sim: 0.65023 },
			{ from: 'British', to: 'Italian', sim: 0.64292 }
		];
		const allSets = {};
		g.getNodesT('Cuisine').forEach(n => {
			allSets[n.label] = n.getFeature('embeddings');
		});
		const cores = simPairwise(simFuncs.cosine, allSets);
		// console.log(cores);
		expect(cores).toEqual(cox);
	});


	/**
	 MATCH (p:Person {name: "Praveena"})-[:SIMILAR]->(other),
	 (other)-[:LIKES]->(cuisine)
	 WHERE not((p)-[:LIKES]->(cuisine))
	 RETURN cuisine.name AS cuisine
	 */
	it('find cuisines liked by the most similar person to praveena, which she does not like / know yet', () => {
		// 1) find the top-K person for Praveena
		const praveena = g.n('Praveena');
		const start = praveena.label;
		const allSets = {};
		g.getNodesT('Person').forEach(n => {
			allSets[n.label] = n.outs('LIKES');
		});
		const mostSim = simSource(simFuncs.cosineSets, start, allSets, {knn: 1})[0];
		// console.log(mostSim); // Karin
		// 2) find the cuisines that Praveena & Karin likes
		const pCuis = g.outs(g.n(start), 'LIKES');
		const kCuis = g.outs(g.n(mostSim.to), 'LIKES');
		// 3) filter the cuisines that Karin likes, but Praveena has no opinion about
		let recommendations = getBsNotInA(pCuis, kCuis);
		// console.log(recommendations);
		expect(recommendations.size).toBe(2);
		expect(Array.from(recommendations).map(r => r.label).sort()).toEqual(['Italian', 'Lebanese'].sort());
		// recommendations.forEach(r => expect(['Italian', 'Lebanese']).toContain(r.label));
	});

});
