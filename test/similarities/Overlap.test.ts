import {DIR} from '../../src/core/interfaces';
import {Similarity} from '../../src/similarities/interfaces';
import {sim, simSource, simPairwise, simSubsets, knnNodeArray, knnNodeDict} from "../../src/similarities/SimilarityCommons";
import {simFuncs} from '../../src/similarities/SetSimilarities';
import {TypedGraph} from '../../src/core/typed/TypedGraph';
import {JSONInput} from '../../src/io/input/JSONInput';
import {TheAugments} from '../../src/perturbation/TheAugments';
import {JSON_SIM_PATH} from "../config/test_paths";


describe('OVERLAP base similarity tests', () => {

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
		s_d = new Set(d);


	it('should compute OVERLAP between two simple SETS', () => {
		const jexp: Similarity = {isect: 2, sim: 0.66667};
		expect(sim(simFuncs.overlap, s_a, s_b)).toEqual(jexp);
	});


	it('should compute OVERLAP between two LARGE sets', () => {
		const jexp: Similarity = {isect: 0, sim: 0};
		expect(sim(simFuncs.overlap, s_c, s_d)).toEqual(jexp);
	});

});


/**
 * @description similarities on neo4j sample graph (overlap -> books/genres)
 */
describe('OVERLAP tests on neo4j sample graph', () => {
	
	const
		gFile = JSON_SIM_PATH + '/books.json';
	
	let
		g: TypedGraph;
		// expanse = null;
		
		
	beforeEach(() => {
		g =  new JSONInput().readFromJSONFile(gFile, new TypedGraph('BooksGenreSimilarities')) as TypedGraph;
		// expanse = new TheExpanse(g);
	});


	it('should compute the overlap between two nodes', () => {
		const oexp = {isect: 1, sim: 0.5};
		const a = g.ins(g.n('fantasy'), 'HAS_GENRE');
		const b = g.ins(g.n('dystopia'), 'HAS_GENRE');
		const ores = sim(simFuncs.overlap, a, b);
		expect(ores).toEqual(oexp);
	});


	it('should compute the overlap from a source', () => {
		const oexp = [
      { from: 'classics', to: 'dystopia', isect: 2, sim: 1 },
      { from: 'classics', to: 'scienceFiction', isect: 3, sim: 0.75 },
      { from: 'classics', to: 'fantasy', isect: 2, sim: 0.66667 }
    ];
		const allSets = {};
		g.getNodesT('Genre').forEach(n => {
			allSets[n.label] = g.expand(n, DIR.in, 'HAS_GENRE').set;
    });
		const ores = simSource(simFuncs.overlap, 'classics', allSets);
		// console.log(ores);
		expect(ores).toEqual(oexp);
	});


  /**
   * 
  MATCH (book:Book)-[:HAS_GENRE]->(genre)
  WITH {item:id(genre), categories: collect(id(book))} as userData
  WITH collect(userData) as data
  CALL algo.similarity.overlap.stream(data)
  YIELD item1, item2, count1, count2, intersection, similarity
  RETURN algo.asNode(item1).name AS from, algo.asNode(item2).name AS to,
        count1, count2, intersection, similarity
  ORDER BY similarity DESC
   */
  it('should get OVERLAP pairwise similarities for genres', () => {
    const oexp = [
      { from: 'fantasy', to: 'scienceFiction', isect: 3, sim: 1 },
      { from: 'dystopia', to: 'scienceFiction', isect: 2, sim: 1 },
      { from: 'classics', to: 'dystopia', isect: 2, sim: 1 },
      { from: 'classics', to: 'scienceFiction', isect: 3, sim: 0.75 },
      { from: 'classics', to: 'fantasy', isect: 2, sim: 0.66667 },
      { from: 'dystopia', to: 'fantasy', isect: 1, sim: 0.5 }
    ];
    const allSets = {};
		g.getNodesT('Genre').forEach(n => {
			allSets[n.label] = g.expand(n, DIR.in, 'HAS_GENRE').set;
    });
    const ores = simPairwise(simFuncs.overlap, allSets);
    // console.log(ores);
    expect(ores).toEqual(oexp);
	});
	

	it('should work with cutoff', () => {
    const oexp = [
      { from: 'fantasy', to: 'scienceFiction', isect: 3, sim: 1 },
      { from: 'dystopia', to: 'scienceFiction', isect: 2, sim: 1 },
      { from: 'classics', to: 'dystopia', isect: 2, sim: 1 },
      { from: 'classics', to: 'scienceFiction', isect: 3, sim: 0.75 }
    ];
    const allSets = {};
		g.getNodesT('Genre').forEach(n => {
			allSets[n.label] = g.expand(n, DIR.in, 'HAS_GENRE').set;
    });
    const ores = simPairwise(simFuncs.overlap, allSets, {cutoff: 0.75});
    expect(ores).toEqual(oexp);
	});
	

	/**
	MATCH (book:Book)-[:HAS_GENRE]->(genre)
	WITH {item:id(genre), categories: collect(id(book))} as userData
	WITH collect(userData) as data
	CALL algo.similarity.overlap.stream(data, {topK: 2})
	YIELD item1, item2, count1, count2, intersection, similarity
	RETURN algo.asNode(item1).name AS from, algo.asNode(item2).name AS to,
				count1, count2, intersection, similarity
	ORDER BY from
	 */
	it('should give the top-2 NN for each genre, ARRAY version', () => {
		const oexp = [
      { from: 'scienceFiction', to: 'fantasy', isect: 3, sim: 1 },
      { from: 'scienceFiction', to: 'dystopia', isect: 2, sim: 1 },
      { from: 'dystopia', to: 'classics', isect: 2, sim: 1 },
      { from: 'classics', to: 'scienceFiction', isect: 3, sim: 0.75 },
      { from: 'fantasy', to: 'classics', isect: 2, sim: 0.66667 }
    ];
		const allSets = {};
		g.getNodesT('Genre').forEach(n => {
			allSets[n.label] = g.expand(n, DIR.in, 'HAS_GENRE').set;
    });
		const ores = knnNodeArray(simFuncs.overlap, allSets, {knn: 2});
		// console.log(ores);
    expect(ores).toEqual(oexp);
	});


	it('should give the top-2 NN for each genre, DICT version', () => {
		const oexp = {
      scienceFiction: [
        { to: 'fantasy', isect: 3, sim: 1 },
        { to: 'dystopia', isect: 2, sim: 1 }
      ],
      fantasy: [
        { to: 'scienceFiction', isect: 3, sim: 1 },
        { to: 'classics', isect: 2, sim: 0.66667 }
      ],
      dystopia: [
        { to: 'scienceFiction', isect: 2, sim: 1 },
        { to: 'classics', isect: 2, sim: 1 }
      ],
      classics: [
        { to: 'dystopia', isect: 2, sim: 1 },
        { to: 'scienceFiction', isect: 3, sim: 0.75 }
      ]
    };
		const allSets = {};
		g.getNodesT('Genre').forEach(n => {
			allSets[n.label] = g.expand(n, DIR.in, 'HAS_GENRE').set;
    });
		const ores = knnNodeDict(simFuncs.overlap, allSets, {knn: 2});
		// console.log(ores);
    expect(ores).toEqual(oexp);
	});


	it('kNN node should accept a cutoff, ARRAY version', () => {
		const oexp = [
      { from: 'scienceFiction', to: 'fantasy', isect: 3, sim: 1 },
      { from: 'scienceFiction', to: 'dystopia', isect: 2, sim: 1 },
      { from: 'dystopia', to: 'classics', isect: 2, sim: 1 },
      { from: 'scienceFiction', to: 'classics', isect: 3, sim: 0.75 }
    ];
		const allSets = {};
		g.getNodesT('Genre').forEach(n => {
			allSets[n.label] = g.expand(n, DIR.in, 'HAS_GENRE').set;
    });
		const ores = knnNodeArray(simFuncs.overlap, allSets, {knn: 4, cutoff: 0.7});
		// console.log(ores);
    expect(ores).toEqual(oexp);
	});


	it('kNN node should accept a cutoff, DICT version', () => {
		const oexp = {
      scienceFiction: [
        { to: 'fantasy', isect: 3, sim: 1 },
        { to: 'dystopia', isect: 2, sim: 1 },
        { to: 'classics', isect: 3, sim: 0.75 }
      ],
      fantasy: [ { to: 'scienceFiction', isect: 3, sim: 1 } ],
      dystopia: [
        { to: 'scienceFiction', isect: 2, sim: 1 },
        { to: 'classics', isect: 2, sim: 1 }
      ],
      classics: [
        { to: 'dystopia', isect: 2, sim: 1 },
        { to: 'scienceFiction', isect: 3, sim: 0.75 }
      ]
    };
		const allSets = {};
		g.getNodesT('Genre').forEach(n => {
			allSets[n.label] = g.expand(n, DIR.in, 'HAS_GENRE').set;
    });
		const ores = knnNodeDict(simFuncs.overlap, allSets, {knn: 4, cutoff: 0.7});
		// console.log(ores);
    expect(ores).toEqual(oexp);
	});


	/**
	MATCH (book:Book)-[:HAS_GENRE]->(genre)
	WITH {item:id(genre), categories: collect(id(book))} as userData
	WITH collect(userData) as data
	CALL algo.similarity.overlap(data, {topK: 2, similarityCutoff: 0.5, write:true})
	YIELD nodes, similarityPairs, write, writeRelationshipType, writeProperty, min, max, mean, stdDev, p25, p50, p75, p90, p95, p99, p999, p100
	RETURN nodes, similarityPairs, write, writeRelationshipType, writeProperty, min, max, mean, p95
	 */
	it('should add new edges based on kNN query', () => {
		const augment = new TheAugments(g);
		const relName = 'SUB_GENRE';
		const oldDirEdges = g.nrDirEdges();
		
		const allSets = {};
		g.getNodesT('Genre').forEach(n => {
			allSets[n.label] = g.expand(n, DIR.in, 'HAS_GENRE').set;
    });
		const newEdges = augment.addSubsetRelationship(simFuncs.overlap, allSets, {rtype: relName, knn: 2, cutoff: 0.5});
		expect(g.nrDirEdges()).toBe(oldDirEdges + newEdges.size);

		// console.log(g.n('fantasy').outs(relName));
		// console.log(g.n('scienceFiction').outs(relName));
	});


	/**
	 * @todo implement once we have expandK capabilities ;-)
	 * 
	 * fantasy -> scienceFiction
	 * fantasy -> classics
	 * fantasy -> scienceFiction -> classics
	 */
	it.todo('should compute hierarchies');


	it('should compute similarities between subsets', () => {
		const oexp = [
      { from: 'fahrenheit451', to: 'nineteen84', isect: 3, sim: 1 },
      { from: 'fahrenheit451', to: 'dune', isect: 3, sim: 1 },
      { from: 'hungerGames', to: 'dune', isect: 2, sim: 1 },
      { from: 'hungerGames', to: 'nineteen84', isect: 1, sim: 0.5 }
    ];
		const subSet1 = {}, subSet2 = {};
		subSet1['fahrenheit451'] = g.outs(g.n('fahrenheit451'), 'HAS_GENRE');
		subSet1['hungerGames'] = g.outs(g.n('hungerGames'), 'HAS_GENRE');
		subSet2['nineteen84'] = g.outs(g.n('nineteen84'), 'HAS_GENRE');
		subSet2['dune'] = g.outs(g.n('dune'), 'HAS_GENRE');
		const ores = simSubsets(simFuncs.overlap, subSet1, subSet2);
		// console.log(ores);
    expect(ores).toEqual(oexp);
	});


	/**
	 MATCH (b1:Book)-[:HAS_GENRE]->(genre1:Genre)
	 WHERE b1.title = 'Fahrenheit 451' or b1.title = 'The Hunger Games'
	 WITH collect(distinct b1.title) as b1, collect(distinct id(genre1)) AS b1Genres
	 MATCH (b2:Book {title: "Dune"})-[:HAS_GENRE]->(genre2:Genre)
	 WITH b1, b1Genres, b2, collect(id(genre2)) AS b2Genres
	 RETURN b1 AS from,
	 b2.title AS to,
	 algo.similarity.jaccard(b1Genres, b2Genres) AS similarity
	 */
	it('should compute group similarity', () => {
		const subSet1 = new Set([g.n('fahrenheit451'), g.n('hungerGames')]);
		const subSet2 = new Set([g.n('dune')]);
		const targetSet1 = g.expand(subSet1, DIR.out, 'HAS_GENRE').set;
		const targetSet2 = g.expand(subSet2, DIR.out, 'HAS_GENRE').set;
		const rover = sim(simFuncs.overlap, targetSet1, targetSet2);
		const jackl = sim(simFuncs.jaccard, targetSet1, targetSet2);

		// console.log(rover, jackl);
		expect(rover).toEqual({isect: 3, sim: 1.0});
		expect(jackl).toEqual({isect: 3, sim: 0.75});
	});

});
