import * as $G from '../../src/core/base/BaseGraph';
import {DegreeDistribution, DegreeCentrality} from '../../src/centralities/Degree';
import {JSONInput, IJSONInConfig} from '../../src/io/input/JSONInput';
import {CSVInput, ICSVInConfig} from '../../src/io/input/CSVInput';
import {SimplePerturber, NodeDegreeConfiguration} from '../../src/perturbation/SimplePerturbations';
import {CSV_DATA_PATH, JSON_DATA_PATH} from '../config/config';
import {Logger} from "../../src/utils/Logger";

const logger = new Logger();

const degCent = new DegreeCentrality();

const
	G_NR_NODES = 75,
	G_NR_EDGES = 209,
	test_graph = `${JSON_DATA_PATH}/bernd_ares.json`;

let
	graph: $G.IGraph,
	json: JSONInput,
	stats: $G.GraphStats,
	deg_config: NodeDegreeConfiguration,
	PT: SimplePerturber;

const
	MAX_ADD_NODES = 100,
	MAX_ADD_EDGES = 300,
	MAX_DEG_PROB = 0.002;


/**
 * @todo introduce spies & check for methods called
 * depending on the degree configuration obj's state
 */
describe('GRAPH PERTURBATION TESTS: - ', () => {

	describe('UNDIRECTED Graph - ', () => {

		beforeEach(() => {
			json = new JSONInput();
			graph = json.readFromJSONFile(test_graph);
			PT = new SimplePerturber(graph);
			stats = graph.stats;
			expect(graph.nrNodes()).toBe(G_NR_NODES);
			expect(graph.nrUndEdges()).toBe(G_NR_EDGES);
			expect(graph.nrDirEdges()).toBe(0);
		});


		describe('Randomly ADD different amounts / percentages of NODES - ', () => {

			test('should refuse to add a negative AMOUNT of nodes', () => {
				expect(() => PT.randomlyAddNodesAmount(-1))
					.toThrowError('Cowardly refusing to add a negative amount of nodes');
			});


			test('should refuse to add a negative PERCENTAGE of nodes', () => {
				expect(() => PT.randomlyAddNodesPercentage(-1))
					.toThrowError('Cowardly refusing to add a negative amount of nodes');
			});


			test('should add a specified amount of nodes', () => {
				let nr_nodes_to_be_added = Math.floor(Math.random() * G_NR_NODES);
				PT.randomlyAddNodesAmount(nr_nodes_to_be_added);
				expect(graph.nrNodes()).toBe(G_NR_NODES + nr_nodes_to_be_added);
				expect(graph.nrUndEdges()).toBe(G_NR_EDGES);
			});


			test(`should add some random percentage of nodes`, () => {
				let p = Math.floor(Math.random() * 100);
				PT.randomlyAddNodesPercentage(p);
				expect(graph.nrNodes()).toBe(G_NR_NODES + Math.ceil(G_NR_NODES * p / 100));
				expect(graph.nrUndEdges()).toBe(G_NR_EDGES);
			});


			test('should reject a negative node degree as invalid', () => {
				let nr_nodes_to_be_added = Math.floor(Math.random() * G_NR_NODES);
				deg_config = {und_degree: -3};

				expect(PT.randomlyAddNodesAmount.bind(PT, nr_nodes_to_be_added, deg_config)).toThrowError("Minimum degree cannot be negative.");
				expect(graph.nrNodes()).toBe(G_NR_NODES + nr_nodes_to_be_added);
				expect(graph.nrUndEdges()).toBe(G_NR_EDGES);
			});


			test('should reject a node degree greater than the amount of nodes', () => {
				let nr_nodes_to_be_added = Math.floor(Math.random() * G_NR_NODES);
				let one_too_many = G_NR_NODES + nr_nodes_to_be_added + 1;
				deg_config = {und_degree: one_too_many};

				expect(PT.randomlyAddNodesAmount.bind(PT, nr_nodes_to_be_added, deg_config)).toThrowError("Maximum degree exceeds number of reachable nodes.");
				expect(graph.nrNodes()).toBe(G_NR_NODES + nr_nodes_to_be_added);
				expect(graph.nrUndEdges()).toBe(G_NR_EDGES);
			});


			test(
				'should add a specified amount of nodes with a regular degree of undirected edges',
				() => {
					let nr_nodes_to_be_added = Math.floor(Math.random() * G_NR_NODES);
					deg_config = {und_degree: 3};

					PT.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
					expect(graph.nrNodes()).toBe(G_NR_NODES + nr_nodes_to_be_added);
					expect(graph.nrUndEdges()).toBe(G_NR_EDGES + deg_config.und_degree * nr_nodes_to_be_added);
				}
			);


			test(
				'should ignore a span of UNdirected edges to add when a specific degree is given',
				() => {
					let nr_nodes_to_be_added = Math.floor(Math.random() * G_NR_NODES);
					deg_config = {und_degree: 3, min_und_degree: 2, max_und_degree: 5};

					PT.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
					expect(graph.nrNodes()).toBe(G_NR_NODES + nr_nodes_to_be_added);
					expect(graph.nrUndEdges()).toBe(G_NR_EDGES + deg_config.und_degree * nr_nodes_to_be_added);
				}
			);


			test(
				'should add an amount of nodes within a specified degree span of UNdirected edges',
				() => {
					let nr_nodes_to_be_added = Math.floor(Math.random() * G_NR_NODES);
					deg_config = {min_und_degree: 3, max_und_degree: 5};

					PT.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
					expect(graph.nrNodes()).toBe(G_NR_NODES + nr_nodes_to_be_added);
					expect(graph.nrUndEdges()).toBeGreaterThanOrEqual(G_NR_EDGES + deg_config.min_und_degree * nr_nodes_to_be_added);
					expect(graph.nrUndEdges()).toBeLessThanOrEqual(G_NR_EDGES + deg_config.max_und_degree * nr_nodes_to_be_added);
				}
			);


			test(
				'should add a specified amount of nodes with a regular degree of directed edges',
				() => {
					let nr_nodes_to_be_added = Math.floor(Math.random() * G_NR_NODES);
					deg_config = {dir_degree: 3};

					PT.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
					expect(graph.nrNodes()).toBe(G_NR_NODES + nr_nodes_to_be_added);
					expect(graph.nrDirEdges()).toBe(deg_config.dir_degree * nr_nodes_to_be_added);
				}
			);


			test(
				'should ignore a span of directed edges to add when a specific degree is given',
				() => {
					let nr_nodes_to_be_added = Math.floor(Math.random() * G_NR_NODES);
					deg_config = {dir_degree: 3, min_dir_degree: 2, max_dir_degree: 5};

					PT.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
					expect(graph.nrNodes()).toBe(G_NR_NODES + nr_nodes_to_be_added);
					expect(graph.nrDirEdges()).toBe(deg_config.dir_degree * nr_nodes_to_be_added);
				}
			);


			test(
				'should add an amount of nodes within a specified degree span of directed edges',
				() => {
					let nr_nodes_to_be_added = Math.floor(Math.random() * G_NR_NODES);
					deg_config = {min_dir_degree: 2, max_dir_degree: 5};

					PT.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
					expect(graph.nrNodes()).toBe(G_NR_NODES + nr_nodes_to_be_added);
					expect(graph.nrDirEdges()).toBeGreaterThanOrEqual(deg_config.min_dir_degree * nr_nodes_to_be_added);
					expect(graph.nrDirEdges()).toBeLessThanOrEqual(deg_config.max_dir_degree * nr_nodes_to_be_added);
				}
			);


			test(
				'should ignore directed edge probabilities when a specific degree of directed edges is given',
				() => {
					let nr_nodes_to_be_added = Math.floor(Math.random() * G_NR_NODES);
					deg_config = {dir_degree: 3, probability_dir: MAX_DEG_PROB};

					PT.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
					expect(graph.nrNodes()).toBe(G_NR_NODES + nr_nodes_to_be_added);
					expect(graph.nrDirEdges()).toBe(deg_config.dir_degree * nr_nodes_to_be_added);
				}
			);


			test(
				'should ignore directed edge probabilities when a degree span of directed edges is given',
				() => {
					let nr_nodes_to_be_added = Math.floor(Math.random() * G_NR_NODES);
					deg_config = {min_dir_degree: 2, max_dir_degree: 5, probability_dir: MAX_DEG_PROB};

					PT.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
					expect(graph.nrNodes()).toBe(G_NR_NODES + nr_nodes_to_be_added);
					expect(graph.nrDirEdges()).toBeGreaterThanOrEqual(deg_config.min_dir_degree * nr_nodes_to_be_added);
					expect(graph.nrDirEdges()).toBeLessThanOrEqual(deg_config.max_dir_degree * nr_nodes_to_be_added);
				}
			);


			test(
				'should ignore directed edge probabilities when a specific degree of UNdirected edges is given',
				() => {
					let nr_nodes_to_be_added = Math.floor(Math.random() * G_NR_NODES);
					deg_config = {und_degree: 3, probability_dir: MAX_DEG_PROB};

					PT.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
					expect(graph.nrNodes()).toBe(G_NR_NODES + nr_nodes_to_be_added);
					expect(graph.nrUndEdges()).toBe(G_NR_EDGES + deg_config.und_degree * nr_nodes_to_be_added);
				}
			);


			test(
				'should ignore directed edge probabilities when a degree span of UNdirected edges is given',
				() => {
					let nr_nodes_to_be_added = Math.floor(Math.random() * G_NR_NODES);
					deg_config = {min_und_degree: 2, max_und_degree: 5, probability_dir: MAX_DEG_PROB};

					PT.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
					expect(graph.nrNodes()).toBe(G_NR_NODES + nr_nodes_to_be_added);
					expect(graph.nrUndEdges()).toBeGreaterThanOrEqual(G_NR_EDGES + deg_config.min_und_degree * nr_nodes_to_be_added);
					expect(graph.nrUndEdges()).toBeLessThanOrEqual(G_NR_EDGES + deg_config.max_und_degree * nr_nodes_to_be_added);
				}
			);


			/**
			 * @description measure the lower / upper bounds of newly created edges
			 * ------------------------------------------------------
			 * - we have a new amount of nodes -> [new]
			 * - we have the amount of nodes in graph -> [old]+[new]
			 * - probability of edge addition -> probability_dir
			 * - edge is not added if
			 * ------------------------------------------------------
			 * - minimum # of new combiantions -> 0
			 * - maximum # of new combinations -> [new]*[new]*[old]*probability_dir
			 */
			test('should create DIRECTED edges according to a given probability', () => {
				const nrAddNodes = Math.floor(Math.random() * MAX_ADD_NODES);
				deg_config = {probability_dir: MAX_DEG_PROB};
				const nrOldNodes = graph.nrNodes();

				PT.randomlyAddNodesAmount(nrAddNodes, deg_config);
				expect(graph.nrNodes()).toBe(G_NR_NODES + nrAddNodes);
				expect(graph.nrDirEdges()).toBeGreaterThanOrEqual(graph.nrDirEdges());
				expect(graph.nrDirEdges()).toBeLessThanOrEqual(graph.nrDirEdges() + nrOldNodes * graph.nrNodes() * MAX_DEG_PROB);
			});

			test('should create UNdirected edges according to a given probability', () => {
				const nrAddNodes = Math.floor(Math.random() * MAX_ADD_NODES);
				deg_config = {probability_und: MAX_DEG_PROB};
				const nrOldNodes = graph.nrNodes();

				PT.randomlyAddNodesAmount(nrAddNodes, deg_config);
				expect(graph.nrNodes()).toBe(G_NR_NODES + nrAddNodes);
				expect(graph.nrUndEdges()).toBeGreaterThanOrEqual(graph.nrUndEdges());
				expect(graph.nrUndEdges()).toBeLessThanOrEqual(graph.nrUndEdges() + nrOldNodes * graph.nrNodes() * MAX_DEG_PROB);
			});



			test(
				'should ignore UNdirected edge probabilities when a specific degree of directed edges is given',
				() => {
					let nr_nodes_to_be_added = Math.floor(Math.random() * G_NR_NODES);
					deg_config = {dir_degree: 3, probability_und: MAX_DEG_PROB};

					PT.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
					expect(graph.nrNodes()).toBe(G_NR_NODES + nr_nodes_to_be_added);
					expect(graph.nrDirEdges()).toBe(deg_config.dir_degree * nr_nodes_to_be_added);
				}
			);


			test(
				'should ignore UNdirected edge probabilities when a degree span of directed edges is given',
				() => {
					let nr_nodes_to_be_added = Math.floor(Math.random() * G_NR_NODES);
					deg_config = {min_dir_degree: 2, max_dir_degree: 5, probability_und: MAX_DEG_PROB};

					PT.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
					expect(graph.nrNodes()).toBe(G_NR_NODES + nr_nodes_to_be_added);
					expect(graph.nrDirEdges()).toBeGreaterThanOrEqual(deg_config.min_dir_degree * nr_nodes_to_be_added);
					expect(graph.nrDirEdges()).toBeLessThanOrEqual(deg_config.max_dir_degree * nr_nodes_to_be_added);
				}
			);


			test(
				'should ignore UNdirected edge probabilities when a specific degree of UNdirected edges is given',
				() => {
					let nr_nodes_to_be_added = Math.floor(Math.random() * G_NR_NODES);
					deg_config = {und_degree: 3, probability_und: MAX_DEG_PROB};

					PT.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
					expect(graph.nrNodes()).toBe(G_NR_NODES + nr_nodes_to_be_added);
					expect(graph.nrUndEdges()).toBe(G_NR_EDGES + deg_config.und_degree * nr_nodes_to_be_added);
				}
			);


			test(
				'should ignore UNdirected edge probabilities when a degree span of UNdirected edges is given',
				() => {
					let nr_nodes_to_be_added = Math.floor(Math.random() * G_NR_NODES);
					deg_config = {min_und_degree: 2, max_und_degree: 5, probability_und: MAX_DEG_PROB};

					PT.randomlyAddNodesAmount(nr_nodes_to_be_added, deg_config);
					expect(graph.nrNodes()).toBe(G_NR_NODES + nr_nodes_to_be_added);
					expect(graph.nrUndEdges()).toBeGreaterThanOrEqual(G_NR_EDGES + deg_config.min_und_degree * nr_nodes_to_be_added);
					expect(graph.nrUndEdges()).toBeLessThanOrEqual(G_NR_EDGES + deg_config.max_und_degree * nr_nodes_to_be_added);
				}
			);

		});


		describe('Randomly adding different amounts / percentages of UNDIRECTED edges', () => {

			test('should refuse to add a negative amount of UNdirected edges', () => {
				expect(() => PT.randomlyAddEdgesAmount(-1, {directed: false})).toThrowError('Cowardly refusing to add a non-positive amount of edges');
			});


			test('should refuse to add a negative percentage of UNdirected edges', () => {
				expect(() => PT.randomlyAddUndEdgesPercentage(-1)).toThrowError('Cowardly refusing to add a non-positive amount of edges');
			});


			test('should add a specified amount of UNdirected edges', () => {
				let nr_und_edges_to_be_added = Math.floor(Math.random() * MAX_ADD_EDGES) || 1;
				PT.randomlyAddEdgesAmount(nr_und_edges_to_be_added, {directed: false});
				expect(graph.nrNodes()).toBe(G_NR_NODES);
				expect(graph.nrUndEdges()).toBe(G_NR_EDGES + nr_und_edges_to_be_added);
				expect(graph.nrDirEdges()).toBe(0);
			});


			test('should add a specified percentage of UNdirected edges', () => {
				let percentage_und_edges_to_be_added = Math.random() * 100;
				PT.randomlyAddUndEdgesPercentage(percentage_und_edges_to_be_added);
				expect(graph.nrNodes()).toBe(G_NR_NODES);
				expect(graph.nrUndEdges()).toBe(
					G_NR_EDGES + Math.ceil(G_NR_EDGES * percentage_und_edges_to_be_added / 100)
				);
				expect(graph.nrDirEdges()).toBe(0);
			});

		});



		/**
		 * @todo enhance by node types
		 */

		describe('Randomly DELETE different amounts / percentages of NODES - ', () => {

			test('should refuse to delete a negative AMOUNT of nodes', () => {
				expect(() => PT.randomlyDeleteNodesAmount(-1))
					.toThrowError('Cowardly refusing to remove a negative amount of nodes');
			});


			test('should refuse to delete a negative PERCENTAGE of nodes', () => {
				expect(() => PT.randomlyDeleteNodesPercentage(-1))
					.toThrowError('Cowardly refusing to remove a negative amount of nodes');
			});


			test(
				'should simply delete all nodes when passing an amount greater than the number of existing nodes',
				() => {
					PT.randomlyDeleteNodesAmount(graph.nrNodes() + 1);
					expect(graph.nrUndEdges()).toBe(0);
					expect(graph.nrNodes()).toBe(0);
				}
			);


			test(
				'should simply delete all nodes when passing a percentage greater than 100%',
				() => {
					PT.randomlyDeleteNodesPercentage(101);
					expect(graph.nrUndEdges()).toBe(0);
					expect(graph.nrNodes()).toBe(0);
				}
			);


			test('should delete a specified amount of nodes', () => {
				let nr_nodes_to_be_deleted = Math.floor(Math.random() * G_NR_NODES);
				PT.randomlyDeleteNodesAmount(nr_nodes_to_be_deleted);
				expect(graph.nrNodes()).toBe(G_NR_NODES - nr_nodes_to_be_deleted);
			});


			test(`should delete some random percentage of all nodes`, () => {
				let p = Math.floor(Math.random() * 100);
				PT.randomlyDeleteNodesPercentage(p);
				expect(graph.nrNodes()).toBe(G_NR_NODES - Math.ceil(G_NR_NODES * p / 100));
			});

		});


		/**
		 * TODO: enhance by edge types
		 */
		describe('Randomly delete different amounts / percentages of UNDIRECTED Edges - ', () => {

			test('should refuse to delete a negative amount of edges', () => {
				expect(PT.randomlyDeleteUndEdgesAmount.bind(PT, -1)).toThrowError('Cowardly refusing to remove a negative amount of edges');
			});


			test('should refuse to delete a negative percentage of edges', () => {
				expect(PT.randomlyDeleteUndEdgesPercentage.bind(PT, -1)).toThrowError('Cowardly refusing to remove a negative amount of edges');
			});


			test(
				'should simply delete all edges when passing an amount greater than the number of existing edges',
				() => {
					PT.randomlyDeleteUndEdgesAmount(10e6);
					expect(graph.nrUndEdges()).toBe(0);
					expect(graph.nrNodes()).toBe(G_NR_NODES);
				}
			);


			test(
				'should simply delete all edges when passing a percentage greater than 100%',
				() => {
					PT.randomlyDeleteUndEdgesPercentage(101);
					expect(graph.nrUndEdges()).toBe(0);
					expect(graph.nrNodes()).toBe(G_NR_NODES);
				}
			);


			test('should delete a specified amount of edges', () => {
				let nr_edges_to_be_deleted = Math.floor(Math.random() * G_NR_EDGES);
				PT.randomlyDeleteUndEdgesAmount(nr_edges_to_be_deleted);
				expect(graph.nrUndEdges()).toBe(G_NR_EDGES - nr_edges_to_be_deleted);
				expect(graph.nrNodes()).toBe(G_NR_NODES);
			});


			test(`should delete a random percentage of all edges`, () => {
				let p = Math.floor(Math.random() * 100);
				PT.randomlyDeleteUndEdgesPercentage(p);
				expect(graph.nrUndEdges()).toBe(G_NR_EDGES - Math.ceil(G_NR_EDGES * p / 100));
				expect(graph.nrNodes()).toBe(G_NR_NODES);
			});
		});


		describe.skip('Adding different percentages of UNDIRECTED Edges - ', () => {

		});

	});


	describe('DIRECTED Graph - ', () => {

		beforeEach(() => {
			json = new JSONInput({explicit_direction: false, directed: true, weighted: false});
			graph = json.readFromJSONFile(test_graph);
			PT = new SimplePerturber(graph);
			stats = graph.getStats();
			expect(graph.nrNodes()).toBe(G_NR_NODES);
			expect(graph.nrUndEdges()).toBe(0);
			expect(graph.nrDirEdges()).toBe(G_NR_EDGES);
		});
		/**
		 * TODO: enhance by edge types
		 */
		describe('Randomly deleting different amounts / percentages of DIRECTED edges - ', () => {

			test('should refuse to delete a negative amount of edges', () => {
				expect(PT.randomlyDeleteDirEdgesAmount.bind(PT, -1)).toThrowError('Cowardly refusing to remove a negative amount of edges');
			});


			test('should refuse to delete a negative percentage of edges', () => {
				expect(PT.randomlyDeleteDirEdgesPercentage.bind(PT, -1)).toThrowError('Cowardly refusing to remove a negative amount of edges');
			});


			test(
				'should simply delete all edges when passing an amount greater than the number of existing edges',
				() => {
					PT.randomlyDeleteDirEdgesAmount(10e6);
					expect(graph.nrDirEdges()).toBe(0);
					expect(graph.nrNodes()).toBe(G_NR_NODES);
				}
			);


			test(
				'should simply delete all edges when passing a percentage greater than 100%',
				() => {
					PT.randomlyDeleteDirEdgesPercentage(101);
					expect(graph.nrDirEdges()).toBe(0);
					expect(graph.nrNodes()).toBe(G_NR_NODES);
				}
			);


			test('should delete a specified amount of edges', () => {
				let nr_edges_to_be_deleted = Math.floor(Math.random() * G_NR_EDGES);
				PT.randomlyDeleteDirEdgesAmount(nr_edges_to_be_deleted);
				expect(graph.nrDirEdges()).toBe(G_NR_EDGES - nr_edges_to_be_deleted);
				expect(graph.nrNodes()).toBe(G_NR_NODES);
			});


			test(`should delete a certain percentage of all edges`, () => {
				let p = Math.floor(Math.random() * 100);
				PT.randomlyDeleteDirEdgesPercentage(p);
				expect(graph.nrDirEdges()).toBe(G_NR_EDGES - Math.ceil(G_NR_EDGES * p / 100));
				expect(graph.nrNodes()).toBe(G_NR_NODES);
			});

		});


		describe('Randomly adding different amounts / percentages of DIRECTED edges', () => {

			test('should refuse to add a negative amount of directed edges', () => {
				expect(PT.randomlyAddEdgesAmount.bind(PT, -1, {directed: true})).toThrowError('Cowardly refusing to add a non-positive amount of edges');
			});


			test(
				'should refuse to add a negative percentage of directed edges to an empty graph',
				() => {
					graph = new $G.BaseGraph("empty graph");
					expect(PT.randomlyAddDirEdgesPercentage.bind(PT, -1, {directed: true})).toThrowError('Cowardly refusing to add a non-positive amount of edges');
				}
			);


			test('should refuse to add a negative percentage of directed edges', () => {
				expect(PT.randomlyAddDirEdgesPercentage.bind(PT, -1)).toThrowError('Cowardly refusing to add a non-positive amount of edges');
			});


			test('should add a specified amount of directed edges', () => {
				let nr_dir_edges_to_be_added = Math.floor(Math.random() * MAX_ADD_EDGES) || 1;
				PT.randomlyAddEdgesAmount(nr_dir_edges_to_be_added, {directed: true});
				expect(graph.nrNodes()).toBe(G_NR_NODES);
				expect(graph.nrDirEdges()).toBe(G_NR_EDGES + nr_dir_edges_to_be_added);
				expect(graph.nrUndEdges()).toBe(0);
			});


			test('should add a specified percentage of directed edges', () => {
				let percentage_dir_edges_to_be_added = Math.random() * 100;
				PT.randomlyAddDirEdgesPercentage(percentage_dir_edges_to_be_added);
				expect(graph.nrNodes()).toBe(G_NR_NODES);
				expect(graph.nrDirEdges()).toBe(
					G_NR_EDGES + Math.ceil(G_NR_EDGES * percentage_dir_edges_to_be_added / 100)
				);
				expect(graph.nrUndEdges()).toBe(0);
			});

		});

	});


	/**
	 * We don't know how to test RANDOM generation of something yet,
	 * so we fall back to simply test differences in the degree distribution
	 * This is a VERY WEAK test however, for even the addition or
	 * deletion of a single edge would lead to the same result...
	 * TODO figure out how to test this properly
	 * PLUS - how to test for runtime ???
	 */
	describe('Randomly generate edges in an existing graph (create a random graph)', () => {
		let test_graph_file = `${CSV_DATA_PATH}/small_graph_adj_list_def_sep.csv`,
			probability: number,
			min: number,
			max: number,
			deg_dist: DegreeDistribution,
			graph: $G.IGraph,
			perturber: SimplePerturber,
			csv: CSVInput = new CSVInput();


		beforeEach(() => {
			graph = csv.readFromAdjacencyListFile(test_graph_file);
			perturber = new SimplePerturber(graph);
		});


		describe('Random edge generation via probability', () => {

			test('should throw an error if probability is smaller 0', () => {
				probability = -1;
				deg_dist = degCent.degreeDistribution(graph);
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).toBe(0);
				expect(graph.nrUndEdges()).toBe(0);
				expect(perturber.createRandomEdgesProb.bind(graph, probability, true)).toThrowError('Probability out of range');
			});


			test('should throw an error if probability is greater 1', () => {
				probability = 2;
				deg_dist = degCent.degreeDistribution(graph);
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).toBe(0);
				expect(graph.nrUndEdges()).toBe(0);
				expect(perturber.createRandomEdgesProb.bind(graph, probability, true)).toThrowError('Probability out of range');
			});


			test('DIRECTED - should randomly generate directed edges', () => {
				probability = 0.5;
				deg_dist = degCent.degreeDistribution(graph);
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).toBe(0);
				expect(graph.nrUndEdges()).toBe(0);
				perturber.createRandomEdgesProb(probability, true);
				expect(graph.nrDirEdges()).not.toBe(0);
				expect(graph.nrUndEdges()).toBe(0);
				expect(degCent.degreeDistribution(graph)).not.toEqual(deg_dist);
			});


			test('UNDIRECTED - should randomly generate UNdirected edges', () => {
				probability = 0.5;
				deg_dist = degCent.degreeDistribution(graph);
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).toBe(0);
				expect(graph.nrUndEdges()).toBe(0);
				perturber.createRandomEdgesProb(probability, false);
				expect(graph.nrDirEdges()).toBe(0);
				expect(graph.nrUndEdges()).not.toBe(0);
				expect(degCent.degreeDistribution(graph)).not.toEqual(deg_dist);
			});


			test(
				'UNDIRECTED - should default to UNdirected edges if no direction is provided',
				() => {
					probability = 0.5;
					deg_dist = degCent.degreeDistribution(graph);
					graph.clearAllEdges();
					expect(graph.nrDirEdges()).toBe(0);
					expect(graph.nrUndEdges()).toBe(0);
					perturber.createRandomEdgesProb(probability);
					expect(graph.nrDirEdges()).toBe(0);
					expect(graph.nrUndEdges()).not.toBe(0);
					expect(degCent.degreeDistribution(graph)).not.toEqual(deg_dist);
				}
			);

		});


		/**
		 * Although we clearly specify min / max in this case,
		 * we can still not test for specific node degree (ranges),
		 * except for the general fact that a nodes degree
		 * should be in the range [0, max+n-1], as
		 * all n-1 other nodes might have an edge to that node
		 */
		describe('Random edge generation via min / max #edges per node', () => {

			test('should throw an error if min is smaller 0', () => {
				min = -1;
				max = 10;
				deg_dist = degCent.degreeDistribution(graph);
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).toBe(0);
				expect(graph.nrUndEdges()).toBe(0);
				expect(perturber.createRandomEdgesSpan.bind(perturber, min, max)).toThrowError('Minimum degree cannot be negative.');
			});


			test('should throw an error if max is greater (n-1)', () => {
				min = 0;
				max = 4;
				deg_dist = degCent.degreeDistribution(graph);
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).toBe(0);
				expect(graph.nrUndEdges()).toBe(0);
				expect(perturber.createRandomEdgesSpan.bind(perturber, min, max)).toThrowError('Maximum degree exceeds number of reachable nodes.');
			});


			test('should throw an error if max is greater (n-1)', () => {
				min = 4;
				max = 2;
				deg_dist = degCent.degreeDistribution(graph);
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).toBe(0);
				expect(graph.nrUndEdges()).toBe(0);
				expect(perturber.createRandomEdgesSpan.bind(perturber, min, max)).toThrowError('Minimum degree cannot exceed maximum degree.');
			});


			test('DIRECTED - should randomly generate directed edges', () => {
				min = 1;
				max = 3;
				deg_dist = degCent.degreeDistribution(graph);
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).toBe(0);
				expect(graph.nrUndEdges()).toBe(0);
				perturber.createRandomEdgesSpan(min, max, true);
				expect(graph.nrDirEdges()).not.toBe(0);
				expect(graph.nrUndEdges()).toBe(0);
				expect(degCent.degreeDistribution(graph)).not.toEqual(deg_dist);
			});


			test('UNDIRECTED - should randomly generate UNdirected edges', () => {
				min = 1;
				max = 3;
				deg_dist = degCent.degreeDistribution(graph);
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).toBe(0);
				expect(graph.nrUndEdges()).toBe(0);
				perturber.createRandomEdgesSpan(min, max, false);
				expect(graph.nrDirEdges()).toBe(0);
				expect(graph.nrUndEdges()).not.toBe(0);
				expect(degCent.degreeDistribution(graph)).not.toEqual(deg_dist);
			});

		});

	});

});