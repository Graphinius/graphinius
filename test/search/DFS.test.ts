import {GraphMode, GraphStats, MinAdjacencyListDict} from '../../src/core/interfaces';
import * as $N from '../../src/core/base/BaseNode';
import * as $G from '../../src/core/base/BaseGraph';
import {JSONInput, IJSONInConfig} from '../../src/io/input/JSONInput';
import * as $DFS from '../../src/search/DFS';
import {JSON_DATA_PATH} from '../config/config';

let search_graph = `${JSON_DATA_PATH}/search_graph.json`;


describe('Basic GRAPH SEARCH Tests - Depth first search -', () => {

	let jsonReader = new JSONInput(),
		graph: $G.IGraph = jsonReader.readFromJSONFile(search_graph),
		stats: GraphStats = graph.getStats();


	describe('testing config preparation functions - ', () => {

		let prepForDFSSpy,
			prepForDFSVisitSpy;

		/**
		 * @todo extract out mock / spy tests
		 */
		beforeEach(() => {
			prepForDFSSpy = jest.spyOn($DFS, 'prepareDFSStandardConfig');
			prepForDFSVisitSpy = jest.spyOn($DFS, 'prepareDFSVisitStandardConfig');
		});


		afterEach(() => {
			jest.restoreAllMocks();
		});


		test(
			'preprareDFSVisitStandardConfig should correctly instantiate a DFSConfig object',
			() => {
				let config = $DFS.prepareDFSVisitStandardConfig();

				expect(prepForDFSVisitSpy).toHaveBeenCalledTimes(1);

				expect(config.dir_mode).not.toBeUndefined();
				expect(config.dir_mode).toBe(GraphMode.MIXED);

				expect(config.visit_result).not.toBeUndefined();
				expect(config.visit_result).toEqual({});

				expect(config.callbacks).not.toBeUndefined();

				let idv = config.callbacks.init_dfs_visit;
				expect(idv).toBeDefined;
				expect(Array.isArray(idv)).toBe(true);
				for (let cb in idv) {
					expect(idv[cb] instanceof Function).toBe(true);
				}

				let nu = config.callbacks.node_unmarked;
				expect(nu).toBeDefined;
				expect(Array.isArray(nu)).toBe(true);
				for (let cb in nu) {
					expect(nu[cb] instanceof Function).toBe(true);
				}
			}
		);


		/**
		 * @todo we need to replace imported functions with members of an
		 * instantiated object to make the spies actually call one another
		 * instead of the original functions inside the other module ...
		 * @todo this is only possible if we make classes out of B/D/PFS
		 * -> make it so!
		 */
		test.skip(
			'calling preprareDFSStandardConfig should also call prepareDFSVisitStandardConfig',
			() => {
				let config = $DFS.prepareDFSStandardConfig();
				expect(prepForDFSSpy).toHaveBeenCalledTimes(1);
				expect(prepForDFSVisitSpy).toHaveBeenCalledTimes(1);
			}
		);


		test(
			'preprareDFSStandardConfig should correctly instantiate a DFSConfig object',
			() => {
				let config = $DFS.prepareDFSStandardConfig();
				expect(config.dir_mode).toBeDefined;
				expect(config.dir_mode).toBe(GraphMode.MIXED);

				expect(config.visit_result).toBeDefined;
				expect(config.visit_result).toEqual({});
				expect(config.callbacks).toBeDefined;

				let idf = config.callbacks.init_dfs;
				expect(idf).toBeDefined;
				expect(Array.isArray(idf)).toBe(true);
				for (let cb in idf) {
					expect(idf[cb] instanceof Function).toBe(true);
				}
			}
		);

	});


	describe('testing callback execution', () => {

		test('should correctly instantiate the search graph', () => {
			expect(stats.nr_nodes).toBe(7);
			expect(stats.nr_dir_edges).toBe(7);
			expect(stats.nr_und_edges).toBe(2);
		});

		/**
		 * @todo HUGELY IMPORTANT
		 * Make sure the callbacks are not only executed, but
		 * executed at the right stage of the code
		 * Don't know how yet...
		 */
		describe('should properly execute the different callback stages', () => {

			test('should execute the DFS VISIT INIT callbacks', () => {
				let root = graph.getNodeById('A'),
					config: $DFS.DFS_Config = {
						visit_result: {},
						dfs_visit_marked: {},
						messages: {},
						callbacks: {
							init_dfs_visit: []
						},
						dir_mode: GraphMode.MIXED
					};

				let dfsVisitInitTestCallback = function () {
					config.messages['test_message'] = "DFS VISIT INIT callback executed.";
				};
				config.callbacks.init_dfs_visit.push(dfsVisitInitTestCallback);
				$DFS.DFSVisit(graph, root, config);
				expect(config.messages['test_message']).toBe("DFS VISIT INIT callback executed.");
			});


			test('should execute the DFS VISIT NODE POPPED callbacks', () => {
				let root = graph.getNodeById('A'),
					config: $DFS.DFS_Config = {
						visit_result: {},
						dfs_visit_marked: {},
						messages: {},
						callbacks: {
							node_popped: []
						},
						dir_mode: GraphMode.MIXED
					};

				let dfsVisitNodePoppedTestCallback = function () {
					config.messages['test_message'] = "DFS VISIT NODE POPPED callback executed.";
				};
				config.callbacks.node_popped.push(dfsVisitNodePoppedTestCallback);
				$DFS.DFSVisit(graph, root, config);
				expect(config.messages['test_message']).toBe("DFS VISIT NODE POPPED callback executed.");
			});


			test('should execute the DFS VISIT NODE MARKED callbacks', () => {
				let root = graph.getNodeById('A'),
					config: $DFS.DFS_Config = {
						visit_result: {},
						dfs_visit_marked: {},
						messages: {},
						callbacks: {
							node_marked: []
						},
						dir_mode: GraphMode.MIXED
					};

				let dfsVisitNodeMarkedTestCallback = function () {
					config.messages['test_message'] = "DFS VISIT NODE MARKED callback executed.";
				};
				config.callbacks.node_marked.push(dfsVisitNodeMarkedTestCallback);
				$DFS.DFSVisit(graph, root, config);
				expect(config.messages['test_message']).toBe("DFS VISIT NODE MARKED callback executed.");
			});


			test('should execute the DFS VISIT NODE UNMARKED callbacks', () => {
				let root = graph.getNodeById('A'),
					config: $DFS.DFS_Config = {
						visit_result: {},
						dfs_visit_marked: {},
						messages: {},
						callbacks: {
							node_unmarked: []
						},
						dir_mode: GraphMode.MIXED
					};

				let dfsVisitNodeUnMarkedTestCallback = function () {
					config.messages['test_message'] = "DFS VISIT NODE UNMARKED callback executed.";
				};
				config.callbacks.node_unmarked.push(dfsVisitNodeUnMarkedTestCallback);
				$DFS.DFSVisit(graph, root, config);
				expect(config.messages['test_message']).toBe("DFS VISIT NODE UNMARKED callback executed.");
			});


			test('should execute the DFS VISIT SORT NODES callbacks', () => {
				let root = graph.getNodeById('A'),
					config: $DFS.DFS_Config = {
						visit_result: {},
						dfs_visit_marked: {},
						messages: {},
						callbacks: {
							sort_nodes: null
						},
						dir_mode: GraphMode.MIXED
					};

				config.callbacks.sort_nodes = () => {
					config.messages['test_message'] = "DFS VISIT SORT NODES callback executed.";
				};
				$DFS.DFSVisit(graph, root, config);
				expect(config.messages['test_message']).toBe("DFS VISIT SORT NODES callback executed.");
			});


			test('should execute the DFS VISIT ADJ NODES PUSHED callbacks', () => {
				let root = graph.getNodeById('A'),
					config: $DFS.DFS_Config = {
						visit_result: {},
						dfs_visit_marked: {},
						messages: {},
						callbacks: {
							adj_nodes_pushed: []
						},
						dir_mode: GraphMode.MIXED
					};

				let dfsVisitAdjNodesPushedTestCallback = function () {
					config.messages['test_message'] = "DFS VISIT ADJ NODES PUSHED callback executed.";
				};
				config.callbacks.adj_nodes_pushed.push(dfsVisitAdjNodesPushedTestCallback);
				$DFS.DFSVisit(graph, root, config);
				expect(config.messages['test_message']).toBe("DFS VISIT ADJ NODES PUSHED callback executed.");
			});


			test('should execute the DFS INIT callbacks', () => {
				let root = graph.getNodeById('A'),
					config: $DFS.DFS_Config = {
						visit_result: {},
						dfs_visit_marked: {},
						messages: {},
						callbacks: {
							init_dfs: []
						},
						dir_mode: GraphMode.MIXED
					};

				let dfsInitTestCallback = function () {
					config.messages['test_message'] = "DFS INIT callback executed.";
				};
				config.callbacks.init_dfs.push(dfsInitTestCallback);

				$DFS.DFS(graph, root, config);
				expect(config.messages['test_message']).toBe("DFS INIT callback executed.");
			});

		});

	});


	describe('testing DFS visit - empty graph and invalid dir_mode - ', () => {

		test(
			'DFSVisit should throw an error upon trying to traverse an empty graph (INIT)',
			() => {
				let root = graph.getNodeById('A'),
					empty_graph = new $G.BaseGraph("iamemptygraph");

				expect($DFS.DFSVisit.bind($DFS.DFSVisit, empty_graph, root)).toThrowError('Cowardly refusing to traverse graph without edges.');
			}
		);


		test(
			'DFSVisit should throw an error upon trying to traverse a graph with dir_mode set to INIT',
			() => {
				let root = graph.getNodeById('A'),
					config: $DFS.DFS_Config = {
						visit_result: {},
						dfs_visit_marked: {},
						callbacks: {},
						dir_mode: GraphMode.INIT
					};

				expect($DFS.DFSVisit.bind($DFS.DFSVisit, graph, root, config)).toThrowError('Cannot traverse a graph with dir_mode set to INIT.');
			}
		);


		test(
			'DFS should throw an error upon trying to traverse a blank graph (INIT)',
			() => {
				let root = graph.getNodeById('A'),
					empty_graph = new $G.BaseGraph("iamemptygraph");

				expect($DFS.DFS.bind($DFS.DFS, empty_graph)).toThrowError('Cowardly refusing to traverse graph without edges.');
			}
		);


		test(
			'DFS should throw an error upon trying to traverse a graph with dir_mode set to INIT',
			() => {
				let root = graph.getNodeById('A'),
					config: $DFS.DFS_Config = {
						visit_result: {},
						dfs_visit_marked: {},
						callbacks: {},
						dir_mode: GraphMode.INIT
					};

				expect($DFS.DFS.bind($DFS.DFS, graph, root, config)).toThrowError('Cannot traverse a graph with dir_mode set to INIT.');
			}
		);

	});


	describe('testing DFS visit on small search graph, DIRECTED MODE', () => {

		test('should correctly compute lookup distance from node A', () => {
			let root = graph.getNodeById('A'),
				config = $DFS.prepareDFSVisitStandardConfig();
			config.dir_mode = GraphMode.DIRECTED;
			let result = $DFS.DFSVisit(graph, root, config);

			expect(Object.keys(result).length).toBe(4);

			expect(result['D']).toBeUndefined();
			expect(result['E']).toBeUndefined();
			expect(result['G']).toBeUndefined();

			expect(result['A'].counter).toBe(0);
			expect(result['B'].counter).toBe(3);
			expect(result['C'].counter).toBe(2);
			expect(result['F'].counter).toBe(1);

			expect(result['A'].parent).toBe(root);
			expect(result['B'].parent).toBe(root);
			expect(result['C'].parent).toBe(root);
			expect(result['F'].parent).toBe(root);
		});


		test('should correctly compute lookup distance from node D', () => {
			let root = graph.getNodeById('D'),
				config = $DFS.prepareDFSVisitStandardConfig();
			config.dir_mode = GraphMode.DIRECTED;
			let result = $DFS.DFSVisit(graph, root, config);

			expect(Object.keys(result).length).toBe(3);

			expect(result['A']).toBeUndefined();
			expect(result['B']).toBeUndefined();
			expect(result['C']).toBeUndefined();
			expect(result['G']).toBeUndefined();

			expect(result['D'].counter).toBe(0);
			expect(result['E'].counter).toBe(1);
			expect(result['F'].counter).toBe(2);

			expect(result['D'].parent).toBe(root);
			expect(result['E'].parent).toBe(root);
			expect(result['F'].parent).toBe(graph.getNodeById('E'));
		});


		test('should correctly compute lookup distance from node G', () => {
			let root = graph.getNodeById('G'),
				config = $DFS.prepareDFSVisitStandardConfig();
			config.dir_mode = GraphMode.DIRECTED;
			let result = $DFS.DFSVisit(graph, root, config);

			expect(Object.keys(result).length).toBe(1);

			expect(result['A']).toBeUndefined();
			expect(result['B']).toBeUndefined();
			expect(result['C']).toBeUndefined();
			expect(result['D']).toBeUndefined();
			expect(result['E']).toBeUndefined();
			expect(result['F']).toBeUndefined();

			expect(result['G'].counter).toBe(0);
			expect(result['G'].parent).toBe(root);
		});

	});


	describe('testing DFS visit on small search graph, UNDIRECTED MODE', () => {

		test('should correctly compute lookup distance from node A', () => {
			let root = graph.getNodeById('A'),
				config = $DFS.prepareDFSVisitStandardConfig();
			config.dir_mode = GraphMode.UNDIRECTED;
			let result = $DFS.DFSVisit(graph, root, config);

			expect(Object.keys(result).length).toBe(2);

			expect(result['B']).toBeUndefined();
			expect(result['C']).toBeUndefined();
			expect(result['E']).toBeUndefined();
			expect(result['F']).toBeUndefined();
			expect(result['G']).toBeUndefined();

			expect(result['A'].counter).toBe(0);
			expect(result['D'].counter).toBe(1);

			expect(result['A'].parent).toBe(root);
			expect(result['D'].parent).toBe(root);
		});


		test('should correctly compute lookup distance from node D', () => {
			let root = graph.getNodeById('D'),
				config = $DFS.prepareDFSVisitStandardConfig();
			config.dir_mode = GraphMode.UNDIRECTED;
			let result = $DFS.DFSVisit(graph, root, config);

			expect(Object.keys(result).length).toBe(2);

			expect(result['B']).toBeUndefined();
			expect(result['C']).toBeUndefined();
			expect(result['E']).toBeUndefined();
			expect(result['F']).toBeUndefined();
			expect(result['G']).toBeUndefined();

			expect(result['A'].counter).toBe(1);
			expect(result['D'].counter).toBe(0);

			expect(result['A'].parent).toBe(root);
			expect(result['D'].parent).toBe(root);
		});

		/**
		 * Because of our graph, this currently yields the same
		 * result as our test case in DIRECTED _mode...
		 */
		test('should correctly compute lookup distance from node G', () => {
			let root = graph.getNodeById('G'),
				config = $DFS.prepareDFSVisitStandardConfig();
			config.dir_mode = GraphMode.UNDIRECTED;
			let result = $DFS.DFSVisit(graph, root, config);

			expect(Object.keys(result).length).toBe(1);

			expect(result['A']).toBeUndefined();
			expect(result['B']).toBeUndefined();
			expect(result['C']).toBeUndefined();
			expect(result['D']).toBeUndefined();
			expect(result['E']).toBeUndefined();
			expect(result['F']).toBeUndefined();

			expect(result['G'].counter).toBe(0);

			expect(result['G'].parent).toBe(root);
		});
	});


	describe('testing DFS visit on small search graph, MIXED MODE', () => {

		test('should correctly compute lookup distance from node A', () => {
			let root = graph.getNodeById('A'),
				result = $DFS.DFSVisit(graph, root);

			expect(Object.keys(result).length).toBe(6);

			// undirected before directed...
			// shall we sort those nodes by id first??
			expect(result['A'].counter).toBe(0);
			expect(result['B'].counter).toBe(5);
			expect(result['C'].counter).toBe(4);
			expect(result['D'].counter).toBe(1);
			expect(result['E'].counter).toBe(2);
			expect(result['F'].counter).toBe(3);

			expect(result['A'].parent).toBe(root);
			expect(result['B'].parent).toBe(root);
			expect(result['C'].parent).toBe(root);
			expect(result['D'].parent).toBe(root);
			expect(result['E'].parent).toBe(graph.getNodeById('D'));
			expect(result['F'].parent).toBe(graph.getNodeById('E'));
		});


		test('should correctly compute lookup distance from node D', () => {
			let root = graph.getNodeById('D'),
				result = $DFS.DFSVisit(graph, root);

			expect(Object.keys(result).length).toBe(6);

			expect(result['A'].counter).toBe(1);
			expect(result['B'].counter).toBe(4);
			expect(result['C'].counter).toBe(3);
			expect(result['D'].counter).toBe(0);
			expect(result['E'].counter).toBe(5);
			expect(result['F'].counter).toBe(2);

			expect(result['A'].parent).toBe(root);
			expect(result['B'].parent).toBe(graph.getNodeById('A'));
			expect(result['C'].parent).toBe(graph.getNodeById('A'));
			expect(result['D'].parent).toBe(root);
			expect(result['E'].parent).toBe(root);
			expect(result['F'].parent).toBe(graph.getNodeById('A'));
		});


		test('should correctly compute lookup distance from node E', () => {
			let root = graph.getNodeById('E'),
				result = $DFS.DFSVisit(graph, root);

			expect(Object.keys(result).length).toBe(2);
			expect(result['E'].counter).toBe(0);
			expect(result['F'].counter).toBe(1);

			expect(result['E'].parent).toBe(root);
			expect(result['F'].parent).toBe(root);
		});


		test('should correctly compute lookup distance from node G', () => {
			let root = graph.getNodeById('G'),
				config = $DFS.prepareDFSVisitStandardConfig(),
				result = $DFS.DFSVisit(graph, root, config);

			expect(Object.keys(result).length).toBe(1);
			expect(result['G'].counter).toBe(0);
			expect(result['G'].parent).toBe(root);
		});

	});


	describe('testing DFS on small search graph (including unconnected component)', () => {

		/**
		 * GraphMode enum holds 0-init (no edges),
		 * 1-directed, 2-undirected, 3-mixed
		 *
		 * TODO - WRITE TESTS FOR SPECIFIC VERTICES AND THEN
		 * CHECK RESULTS ACCORDINGLY...
		 */
		[1, 2, 3].forEach((i) => {

			test('should not leave any nodes with a counter of -1 (unvisited)', () => {
				let root = graph.getNodeById('A'),
					config = $DFS.prepareDFSStandardConfig();

				config.dir_mode = i;
				let dfs_result = $DFS.DFS(graph, root, config);

				let nr_nodes_visited = 0;
				for (let seg_idx in dfs_result) {
					nr_nodes_visited += Object.keys(dfs_result[seg_idx]).length;
				}
				expect(nr_nodes_visited).toBe(7);
			});


			test('should not leave any nodes without a parent (even if self)', () => {
				let root = graph.getNodeById('A'),
					config = $DFS.prepareDFSStandardConfig();

				config.dir_mode = i;
				let dfs_result = $DFS.DFS(graph, root, config);

				for (let seg_idx in dfs_result) {
					for (let node_key in dfs_result[seg_idx]) {
						let node = dfs_result[seg_idx][node_key];
						expect(node.parent).not.toBeNull();
					}
				}
			});

		});

		describe('lookup DFS distance calculations - DIRECTED Mode - ', () => {

			test('should correctly compute lookup distance from node A', () => {
				let root = graph.getNodeById('A'),
					config = $DFS.prepareDFSStandardConfig();

				config.dir_mode = GraphMode.DIRECTED;
				let dfs_result = $DFS.DFS(graph, root, config);

				expect(dfs_result.length).toBe(3);

				let seg_0 = dfs_result[0];
				expect(Object.keys(seg_0).length).toBe(4);
				expect(seg_0['A'].counter).toBe(0);
				expect(seg_0['F'].counter).toBe(1);
				expect(seg_0['C'].counter).toBe(2);
				expect(seg_0['B'].counter).toBe(3);
				expect(seg_0['A'].parent).toBe(graph.getNodeById('A'));
				expect(seg_0['F'].parent).toBe(graph.getNodeById('A'));
				expect(seg_0['C'].parent).toBe(graph.getNodeById('A'));
				expect(seg_0['B'].parent).toBe(graph.getNodeById('A'));

				let seg_1 = dfs_result[1];
				expect(Object.keys(seg_1).length).toBe(2);
				expect(seg_1['D'].counter).toBe(4);
				expect(seg_1['E'].counter).toBe(5);
				expect(seg_1['D'].parent).toBe(graph.getNodeById('D'));
				expect(seg_1['E'].parent).toBe(graph.getNodeById('D'));

				let seg_2 = dfs_result[2];
				expect(Object.keys(seg_2).length).toBe(1);
				expect(seg_2['G'].counter).toBe(6);
				expect(seg_2['G'].parent).toBe(graph.getNodeById('G'));

			});


			test('should correctly compute lookup distance from node D', () => {
				let root = graph.getNodeById('D'),
					config = $DFS.prepareDFSStandardConfig();

				config.dir_mode = GraphMode.DIRECTED;
				let dfs_result = $DFS.DFS(graph, root, config);

				expect(dfs_result.length).toBe(3);

				let seg_0 = dfs_result[0];
				expect(Object.keys(seg_0).length).toBe(3);
				expect(seg_0['D'].counter).toBe(0);
				expect(seg_0['E'].counter).toBe(1);
				expect(seg_0['F'].counter).toBe(2);
				expect(seg_0['D'].parent).toBe(graph.getNodeById('D'));
				expect(seg_0['E'].parent).toBe(graph.getNodeById('D'));
				expect(seg_0['F'].parent).toBe(graph.getNodeById('E'));

				let seg_1 = dfs_result[1];
				expect(Object.keys(seg_1).length).toBe(3);
				expect(seg_1['A'].counter).toBe(3);
				expect(seg_1['C'].counter).toBe(4);
				expect(seg_1['B'].counter).toBe(5);
				expect(seg_1['A'].parent).toBe(graph.getNodeById('A'));
				expect(seg_1['C'].parent).toBe(graph.getNodeById('A'));
				expect(seg_1['B'].parent).toBe(graph.getNodeById('A'));

				let seg_2 = dfs_result[2];
				expect(Object.keys(seg_2).length).toBe(1);
				expect(seg_2['G'].counter).toBe(6);
				expect(seg_2['G'].parent).toBe(graph.getNodeById('G'));

			});

		});


		describe('lookup DFS distance calculations - UNDIRECTED Mode - ', () => {

			test('should correctly compute lookup distance from node A', () => {
				let root = graph.getNodeById('A'),
					config = $DFS.prepareDFSStandardConfig();

				config.dir_mode = GraphMode.UNDIRECTED;
				let dfs_result = $DFS.DFS(graph, root, config);

				expect(dfs_result.length).toBe(6);

				let seg_0 = dfs_result[0];
				expect(Object.keys(seg_0).length).toBe(2);
				expect(seg_0['A'].counter).toBe(0);
				expect(seg_0['D'].counter).toBe(1);
				expect(seg_0['A'].parent).toBe(graph.getNodeById('A'));
				expect(seg_0['D'].parent).toBe(graph.getNodeById('A'));

				let seg_1 = dfs_result[1];
				expect(Object.keys(seg_1).length).toBe(1);
				expect(seg_1['B'].counter).toBe(2);
				expect(seg_1['B'].parent).toBe(graph.getNodeById('B'));

				let seg_2 = dfs_result[2];
				expect(Object.keys(seg_2).length).toBe(1);
				expect(seg_2['C'].counter).toBe(3);
				expect(seg_2['C'].parent).toBe(graph.getNodeById('C'));

				let seg_3 = dfs_result[3];
				expect(Object.keys(seg_3).length).toBe(1);
				expect(seg_3['F'].counter).toBe(4);
				expect(seg_3['F'].parent).toBe(graph.getNodeById('F'));

				let seg_4 = dfs_result[4];
				expect(Object.keys(seg_4).length).toBe(1);
				expect(seg_4['E'].counter).toBe(5);
				expect(seg_4['E'].parent).toBe(graph.getNodeById('E'));

				let seg_5 = dfs_result[5];
				expect(Object.keys(seg_5).length).toBe(1);
				expect(seg_5['G'].counter).toBe(6);
				expect(seg_5['G'].parent).toBe(graph.getNodeById('G'));

			});

		});


		describe('lookup DFS distance calculations - MIXED Mode - ', () => {

			test('should correctly compute lookup distance from node D', () => {
				let root = graph.getNodeById('D'),
					dfs_result = $DFS.DFS(graph, root);

				expect(dfs_result.length).toBe(2);

				let seg_0 = dfs_result[0];
				expect(Object.keys(seg_0).length).toBe(6);
				expect(seg_0['D'].counter).toBe(0);
				expect(seg_0['A'].counter).toBe(1);
				expect(seg_0['F'].counter).toBe(2);
				expect(seg_0['C'].counter).toBe(3);
				expect(seg_0['B'].counter).toBe(4);
				expect(seg_0['E'].counter).toBe(5);
				expect(seg_0['D'].parent).toBe(graph.getNodeById('D'));
				expect(seg_0['A'].parent).toBe(graph.getNodeById('D'));
				expect(seg_0['F'].parent).toBe(graph.getNodeById('A'));
				expect(seg_0['C'].parent).toBe(graph.getNodeById('A'));
				expect(seg_0['B'].parent).toBe(graph.getNodeById('A'));
				expect(seg_0['E'].parent).toBe(graph.getNodeById('D'));

				let seg_1 = dfs_result[1];
				expect(Object.keys(seg_1).length).toBe(1);
				expect(seg_1['G'].counter).toBe(6);
				expect(seg_1['G'].parent).toBe(graph.getNodeById('G'));

			});

		});

	});


	describe('lookup DFS distance calculations - WEIGHTED EDGES - ', () => {

		test(
			'should correctly compute lookup distance from node D - MIXED Mode',
			() => {
				jsonReader._config.weighted = true;
				let graph = jsonReader.readFromJSONFile(search_graph),
					root = graph.getNodeById('D'),
					config = $DFS.prepareDFSStandardConfig();

				let weight_dists = {};
				config.callbacks.node_unmarked.push(setWeightCostsDFS(weight_dists));
				$DFS.DFS(graph, root, config);

				expect(weight_dists['A']).toBe(7);
				expect(weight_dists['B']).toBe(11);
				expect(weight_dists['C']).toBe(9);
				expect(weight_dists['D']).toBe(0);
				expect(weight_dists['E']).toBe(5);
				expect(weight_dists['F']).toBe(15);
				expect(weight_dists['G']).toBe(0);
			}
		);


		test(
			'should correctly compute lookup distance from node A - DIRECTED Mode',
			() => {
				jsonReader._config.weighted = true;
				let graph = jsonReader.readFromJSONFile(search_graph),
					root = graph.getNodeById('A'),
					config = $DFS.prepareDFSStandardConfig();

				config.dir_mode = GraphMode.DIRECTED;
				let weight_dists = {};
				config.callbacks.node_unmarked.push(setWeightCostsDFS(weight_dists));
				$DFS.DFS(graph, root, config);

				expect(weight_dists['A']).toBe(0);
				expect(weight_dists['B']).toBe(4);
				expect(weight_dists['C']).toBe(2);
				expect(weight_dists['D']).toBe(0);
				expect(weight_dists['E']).toBe(5);
				expect(weight_dists['F']).toBe(8);
				expect(weight_dists['G']).toBe(0);
			}
		);


		test(
			'should correctly compute lookup distance from node A - UNDIRECTED Mode',
			() => {
				jsonReader._config.weighted = true;
				let graph = jsonReader.readFromJSONFile(search_graph),
					root = graph.getNodeById('A'),
					config = $DFS.prepareDFSStandardConfig();

				config.dir_mode = GraphMode.UNDIRECTED;
				let weight_dists = {};
				config.callbacks.node_unmarked.push(setWeightCostsDFS(weight_dists));
				$DFS.DFS(graph, root, config);

				expect(weight_dists['A']).toBe(0);
				expect(weight_dists['B']).toBe(0);
				expect(weight_dists['C']).toBe(0);
				expect(weight_dists['D']).toBe(7);
				expect(weight_dists['E']).toBe(0);
				expect(weight_dists['F']).toBe(0);
				expect(weight_dists['G']).toBe(0);
			}
		);

	});


	/**
	 * Sorted DFS on small search graph PFS JSON
	 * Only using DFSVisit, as multiple visits have already
	 * been tested extensively.
	 *
	 * Our sort function must be implemented so that it
	 * produces the reverse of the desired order, since
	 * this is the way our objects are popped from the stack...
	 *
	 * Running four tests on function sorting by weights ascending,
	 * then four more tests on sorting by weights descending
	 */
	describe('PFS_DFS graph traversal tests with edge weight ascending sort - ', () => {

		let search_graph_pfs = `${JSON_DATA_PATH}/search_graph_pfs.json`,
			json = new JSONInput({explicit_direction: true, weighted: true, directed: true}),
			graph = json.readFromJSONFile(search_graph_pfs);

		beforeEach(() => {
			expect(graph.nrNodes()).toBe(6);
			expect(graph.nrDirEdges()).toBe(9);
			expect(graph.nrUndEdges()).toBe(0);
		});


		test(
			'Should traverse search graph in correct order, ascending, root is A',
			() => {
				let root = graph.getNodeById('A'),
					config = $DFS.prepareDFSVisitStandardConfig();

				config.callbacks.sort_nodes = ascSortDFS;
				let dfs_res = $DFS.DFSVisit(graph, root, config);

				expect(Object.keys(dfs_res).length).toBe(6);

				expect(dfs_res['A'].counter).toBe(0);
				expect(dfs_res['B'].counter).toBe(4);
				expect(dfs_res['C'].counter).toBe(2);
				expect(dfs_res['D'].counter).toBe(1);
				expect(dfs_res['E'].counter).toBe(3);
				expect(dfs_res['F'].counter).toBe(5);

				expect(dfs_res['A'].parent).toBe(root);
				expect(dfs_res['B'].parent).toBe(root);
				expect(dfs_res['C'].parent).toBe(graph.getNodeById('D'));
				expect(dfs_res['D'].parent).toBe(root);
				expect(dfs_res['E'].parent).toBe(graph.getNodeById('C'));
				expect(dfs_res['F'].parent).toBe(graph.getNodeById('B'));
			}
		);


		test(
			'Should traverse search graph in correct order, ascending, root is B',
			() => {
				let root = graph.getNodeById('B'),
					config = $DFS.prepareDFSVisitStandardConfig();

				config.callbacks.sort_nodes = ascSortDFS;
				let dfs_res = $DFS.DFSVisit(graph, root, config);

				expect(Object.keys(dfs_res).length).toBe(4);

				expect(dfs_res['B'].counter).toBe(0);
				expect(dfs_res['C'].counter).toBe(3);
				expect(dfs_res['E'].counter).toBe(2);
				expect(dfs_res['F'].counter).toBe(1);

				expect(dfs_res['B'].parent).toBe(root);
				expect(dfs_res['C'].parent).toBe(root);
				expect(dfs_res['E'].parent).toBe(graph.getNodeById('F'));
				expect(dfs_res['F'].parent).toBe(root);
			}
		);


		test(
			'Should traverse search graph in correct order, DEscending, root is A',
			() => {
				let root = graph.getNodeById('A'),
					config = $DFS.prepareDFSVisitStandardConfig();

				config.callbacks.sort_nodes = descSortDFS;
				let dfs_res = $DFS.DFSVisit(graph, root, config);

				expect(Object.keys(dfs_res).length).toBe(6);

				expect(dfs_res['A'].counter).toBe(0);
				expect(dfs_res['B'].counter).toBe(3);
				expect(dfs_res['C'].counter).toBe(1);
				expect(dfs_res['D'].counter).toBe(5);
				expect(dfs_res['E'].counter).toBe(2);
				expect(dfs_res['F'].counter).toBe(4);

				expect(dfs_res['A'].parent).toBe(root);
				expect(dfs_res['B'].parent).toBe(root);
				expect(dfs_res['C'].parent).toBe(root);
				expect(dfs_res['D'].parent).toBe(root);
				expect(dfs_res['E'].parent).toBe(graph.getNodeById('C'));
				expect(dfs_res['F'].parent).toBe(graph.getNodeById('B'));
			}
		);


		test(
			'Should traverse search graph in correct order, DEscending, root is B',
			() => {
				let root = graph.getNodeById('B'),
					config = $DFS.prepareDFSVisitStandardConfig();

				config.callbacks.sort_nodes = descSortDFS;
				let dfs_res = $DFS.DFSVisit(graph, root, config);

				expect(Object.keys(dfs_res).length).toBe(4);

				expect(dfs_res['B'].counter).toBe(0);
				expect(dfs_res['C'].counter).toBe(1);
				expect(dfs_res['E'].counter).toBe(2);
				expect(dfs_res['F'].counter).toBe(3);

				expect(dfs_res['B'].parent).toBe(root);
				expect(dfs_res['C'].parent).toBe(root);
				expect(dfs_res['E'].parent).toBe(graph.getNodeById('C'));
				expect(dfs_res['F'].parent).toBe(root);
			}
		);


		/**
		 * NOW WITH WEIGHTS...
		 */
		test(
			'Should correctly compute weight distance with ascending sort function, root is A',
			() => {
				let root = graph.getNodeById('A'),
					config = $DFS.prepareDFSStandardConfig(),
					weight_dists = {};

				config.callbacks.sort_nodes = ascSortDFS;
				weight_dists[root.getID()] = 0;
				config.callbacks.node_unmarked.push(setWeightCostsDFS(weight_dists));
				$DFS.DFS(graph, root, config);

				expect(weight_dists['A']).toBe(0);
				expect(weight_dists['B']).toBe(3);
				expect(weight_dists['C']).toBe(7);
				expect(weight_dists['D']).toBe(1);
				expect(weight_dists['E']).toBe(8);
				expect(weight_dists['F']).toBe(4);
			}
		);


		test(
			'Should correctly compute weight distance with ascending sort function, root is B',
			() => {
				let root = graph.getNodeById('B'),
					config = $DFS.prepareDFSStandardConfig(),
					weight_dists = {};

				config.callbacks.sort_nodes = ascSortDFS;
				weight_dists[root.getID()] = 0;
				config.callbacks.node_unmarked.push(setWeightCostsDFS(weight_dists));
				$DFS.DFS(graph, root, config);

				expect(weight_dists['B']).toBe(0);
				expect(weight_dists['C']).toBe(2);
				expect(weight_dists['E']).toBe(6);
				expect(weight_dists['F']).toBe(1);
			}
		);


		test(
			'Should correctly compute weight distance with DEscending sort function, root is A',
			() => {
				let root = graph.getNodeById('A'),
					config = $DFS.prepareDFSStandardConfig(),
					weight_dists = {};

				config.callbacks.sort_nodes = descSortDFS;
				weight_dists[root.getID()] = 0;
				config.callbacks.node_unmarked.push(setWeightCostsDFS(weight_dists));
				$DFS.DFS(graph, root, config);

				expect(weight_dists['A']).toBe(0);
				expect(weight_dists['B']).toBe(3);
				expect(weight_dists['C']).toBe(4);
				expect(weight_dists['D']).toBe(1);
				expect(weight_dists['E']).toBe(5);
				expect(weight_dists['F']).toBe(4);
			}
		);


		test(
			'Should correctly compute weight distance with DEscending sort function, root is B',
			() => {
				let root = graph.getNodeById('B'),
					config = $DFS.prepareDFSStandardConfig(),
					weight_dists = {};

				config.callbacks.sort_nodes = descSortDFS;
				weight_dists[root.getID()] = 0;
				config.callbacks.node_unmarked.push(setWeightCostsDFS(weight_dists));
				$DFS.DFS(graph, root, config);

				expect(weight_dists['B']).toBe(0);
				expect(weight_dists['C']).toBe(2);
				expect(weight_dists['E']).toBe(3);
				expect(weight_dists['F']).toBe(1);
			}
		);

	});

});

let ascSortDFS = (context: $DFS.DFSVisit_Scope) => {
	return context.adj_nodes.sort((a: $N.NeighborEntry, b: $N.NeighborEntry) => {
		return b.edge.getWeight() - a.edge.getWeight();
	});
};

let descSortDFS = (context: $DFS.DFSVisit_Scope) => {
	return context.adj_nodes.sort((a: $N.NeighborEntry, b: $N.NeighborEntry) => {
		return a.edge.getWeight() - b.edge.getWeight();
	});
};

let setWeightCostsDFS = (weight_dists) => {
	return (context: $DFS.DFSVisit_Scope) => {
		let parent = context.stack_entry.parent;
		let parent_accumulated_weight = isNaN(weight_dists[parent.getID()]) ? 0 : weight_dists[parent.getID()];
		weight_dists[context.current.getID()] = parent_accumulated_weight + context.stack_entry.weight;
	}
};