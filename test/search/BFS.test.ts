import * as $N from '../../src/core/Nodes';
import * as $G from '../../src/core/Graph';
import {JSONInput} from '../../src/io/input/JSONInput';
import * as $BFS from '../../src/search/BFS';
import * as $CB from '../../src/utils/CallbackUtils';


let search_graph = "./test/test_data/search_graph.json";

// let json_in_config: IJSONInConfig = {
// 	explicit_direction: true,
// 	directed: false,
// 	weighted: true
// };


describe('Basic GRAPH SEARCH Tests - Breadth first search - ', () => {

	let json: JSONInput,
		graph: $G.IGraph,
		stats: $G.GraphStats,
		bfs_res: { [id: string]: $BFS.BFS_ResultEntry };


	test('should correctly instantiate the search graph', () => {
		json = new JSONInput();
		graph = json.readFromJSONFile(search_graph);
		stats = graph.getStats();
		expect(stats.nr_nodes).toBe(7);
		expect(stats.nr_dir_edges).toBe(7);
		expect(stats.nr_und_edges).toBe(2);
	});


	/**
	 * 
	 */
	describe('should properly execute the different callback stages', () => {

		beforeEach(() => {
			graph = json.readFromJSONFile(search_graph);
		});

		test('should execute the BFS INIT callbacks', () => {
			let root = graph.getNodeById('A'),
				config = $BFS.prepareBFSStandardConfig();

			let bfsInitTestCallback = function () {
				config.messages['test_message'] = "BFS INIT callback executed.";
			};
			config.callbacks.init_bfs.push(bfsInitTestCallback);
			$BFS.BFS(graph, root, config);
			expect(config.messages['test_message']).toBe("BFS INIT callback executed.");
		});


		test('should execute the NODE UNMARKED callbacks', () => {
			let root = graph.getNodeById('A'),
				config = $BFS.prepareBFSStandardConfig();

			let bfsNodeUnmarkedTestCallback = function () {
				config.messages['test_message'] = "NODE UNMARKED callback executed.";
			};
			config.callbacks.node_unmarked.push(bfsNodeUnmarkedTestCallback);
			$BFS.BFS(graph, root, config);
			expect(config.messages['test_message']).toBe("NODE UNMARKED callback executed.");
		});


		test('should execute the NODE MARKED callbacks', () => {
			let root = graph.getNodeById('A'),
				config = $BFS.prepareBFSStandardConfig();

			let bfsNodeMarkedTestCallback = function () {
				config.messages['test_message'] = "NODE MARKED callback executed.";
			};
			config.callbacks.node_marked.push(bfsNodeMarkedTestCallback);
			$BFS.BFS(graph, root, config);
			expect(config.messages['test_message']).toBe("NODE MARKED callback executed.");
		});


		test('should execute the SORT NODES callback', () => {
			let root = graph.getNodeById('A'),
				config = $BFS.prepareBFSStandardConfig();

			config.callbacks.sort_nodes = function () {
				config.messages['test_message'] = "SORT NODES callback executed.";
			};
			$BFS.BFS(graph, root, config);
			expect(config.messages['test_message']).toBe("SORT NODES callback executed.");
		});


		/**
		 * @todo spies created and tore down within function...?
		 */
		test('should not execute any callback at all', () => {
			let execCBSpy = jest.spyOn($CB, 'execCallbacks');

			let root = graph.getNodeById('A'),
				config = $BFS.prepareBFSStandardConfig();

			// set config.callbacks to emtpy object
			config.callbacks = {};

			// manually initialize distance object
			for (let key in graph.getNodes()) {
				config.result[key] = {
					distance: Number.POSITIVE_INFINITY,
					parent: null,
					counter: -1
				};
			}
			$BFS.BFS(graph, root, config);

			/**
			 * since jest.spyOn calles the spied method initially, 
			 * we cannot check for not.toHaveBeenCalled... 
			 * strangely, Times(0) works as expected ( Times(1) fails... )
			 */
			expect(execCBSpy).toHaveBeenCalledTimes(0);
		});

	});


	describe('BFS on small search graph - ', () => {

		test('should refuse to traverse an empty graph', () => {
			let empty_graph = new $G.BaseGraph("iamempty"),
				root = graph.getRandomNode();
			expect($BFS.BFS.bind($BFS.BFS, empty_graph, root)).toThrowError("Cowardly refusing to traverse graph without edges.");
		});


		test('should refuse to traverse a graph with _mode set to INIT', () => {
			let root = graph.getRandomNode(),
				config = $BFS.prepareBFSStandardConfig();
			config.dir_mode = $G.GraphMode.INIT;
			expect($BFS.BFS.bind($BFS.BFS, graph, root, config)).toThrowError("Cannot traverse a graph with dir_mode set to INIT.");
		});


		test(
			'should never expand a node when DIR mode is set to a meaningless value',
			() => {
				let root = graph.getNodeById('A'),
					config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = 9999;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).toBe(7);

				expect(bfs_res['A'].counter).toBe(0);
				expect(bfs_res['B'].counter).toBe(-1);
				expect(bfs_res['C'].counter).toBe(-1);
				expect(bfs_res['D'].counter).toBe(-1);
				expect(bfs_res['E'].counter).toBe(-1);
				expect(bfs_res['F'].counter).toBe(-1);
				expect(bfs_res['G'].counter).toBe(-1);

				expect(bfs_res['A'].distance).toBe(0);
				expect(bfs_res['A'].parent).toBe(root);
				expect(bfs_res['B'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).toBe(null);
				expect(bfs_res['C'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].parent).toBe(null);
				expect(bfs_res['D'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['D'].parent).toBe(null);
				expect(bfs_res['E'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).toBe(null);
				expect(bfs_res['F'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['F'].parent).toBe(null);
				expect(bfs_res['G'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).toBe(null);
			}
		);


		describe('computing distances in UNDIRECTED _mode - ', () => {

			test('should correctly compute distances from node A', () => {
				let root = graph.getNodeById('A'),
					config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = $G.GraphMode.UNDIRECTED;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).toBe(7);

				expect(bfs_res['A'].counter).toBe(0);
				expect(bfs_res['B'].counter).toBe(-1);
				expect(bfs_res['C'].counter).toBe(-1);
				expect(bfs_res['D'].counter).toBe(1);
				expect(bfs_res['E'].counter).toBe(-1);
				expect(bfs_res['F'].counter).toBe(-1);
				expect(bfs_res['G'].counter).toBe(-1);

				expect(bfs_res['A'].distance).toBe(0);
				expect(bfs_res['A'].parent).toBe(root);
				expect(bfs_res['B'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).toBe(null);
				expect(bfs_res['C'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].parent).toBe(null);
				expect(bfs_res['D'].distance).toBe(1);
				expect(bfs_res['D'].parent).toBe(root);
				expect(bfs_res['E'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).toBe(null);
				expect(bfs_res['F'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['F'].parent).toBe(null);
				expect(bfs_res['G'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).toBe(null);
			});


			test('should correctly compute distances from node C', () => {
				let root = graph.getNodeById('C'),
					config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = $G.GraphMode.UNDIRECTED;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).toBe(7);

				expect(bfs_res['A'].counter).toBe(-1);
				expect(bfs_res['B'].counter).toBe(-1);
				expect(bfs_res['C'].counter).toBe(0);
				expect(bfs_res['D'].counter).toBe(-1);
				expect(bfs_res['E'].counter).toBe(-1);
				expect(bfs_res['F'].counter).toBe(-1);
				expect(bfs_res['G'].counter).toBe(-1);

				expect(bfs_res['A'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['A'].parent).toBe(null);
				expect(bfs_res['B'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).toBe(null);
				expect(bfs_res['C'].distance).toBe(0);
				expect(bfs_res['C'].parent).toBe(root);
				expect(bfs_res['D'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['D'].parent).toBe(null);
				expect(bfs_res['E'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).toBe(null);
				expect(bfs_res['F'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['F'].parent).toBe(null);
				expect(bfs_res['G'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).toBe(null);
			});


			test('should correctly compute distances from node D', () => {
				let root = graph.getNodeById('D'),
					config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = $G.GraphMode.UNDIRECTED;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).toBe(7);

				expect(bfs_res['A'].counter).toBe(1);
				expect(bfs_res['B'].counter).toBe(-1);
				expect(bfs_res['C'].counter).toBe(-1);
				expect(bfs_res['D'].counter).toBe(0);
				expect(bfs_res['E'].counter).toBe(-1);
				expect(bfs_res['F'].counter).toBe(-1);
				expect(bfs_res['G'].counter).toBe(-1);

				expect(bfs_res['A'].distance).toBe(1);
				expect(bfs_res['A'].parent).toBe(root);
				expect(bfs_res['B'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).toBe(null);
				expect(bfs_res['C'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].parent).toBe(null);
				expect(bfs_res['D'].distance).toBe(0);
				expect(bfs_res['D'].parent).toBe(root);
				expect(bfs_res['E'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).toBe(null);
				expect(bfs_res['F'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['F'].parent).toBe(null);
				expect(bfs_res['G'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).toBe(null);
			});


			test('should correctly compute distances from node G', () => {
				let root = graph.getNodeById('G'),
					config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = $G.GraphMode.UNDIRECTED;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).toBe(7);

				expect(bfs_res['A'].counter).toBe(-1);
				expect(bfs_res['B'].counter).toBe(-1);
				expect(bfs_res['C'].counter).toBe(-1);
				expect(bfs_res['D'].counter).toBe(-1);
				expect(bfs_res['E'].counter).toBe(-1);
				expect(bfs_res['F'].counter).toBe(-1);
				expect(bfs_res['G'].counter).toBe(0);

				expect(bfs_res['A'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['A'].parent).toBe(null);
				expect(bfs_res['B'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).toBe(null);
				expect(bfs_res['C'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].parent).toBe(null);
				expect(bfs_res['D'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['D'].parent).toBe(null);
				expect(bfs_res['E'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).toBe(null);
				expect(bfs_res['F'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['F'].parent).toBe(null);
				expect(bfs_res['G'].distance).toBe(0);
				expect(bfs_res['G'].parent).toBe(root);
			});

		});


		describe('computing distances in DIRECTED _mode - ', () => {

			test('should correctly compute distances from node A', () => {
				let root = graph.getNodeById('A'),
					config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = $G.GraphMode.DIRECTED;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).toBe(7);

				expect(bfs_res['A'].counter).toBe(0);
				expect(bfs_res['B'].counter).toBe(1);
				expect(bfs_res['C'].counter).toBe(2);
				expect(bfs_res['D'].counter).toBe(-1);
				expect(bfs_res['E'].counter).toBe(-1);
				expect(bfs_res['F'].counter).toBe(3);
				expect(bfs_res['G'].counter).toBe(-1);

				expect(bfs_res['A'].distance).toBe(0);
				expect(bfs_res['A'].parent).toBe(root);
				expect(bfs_res['B'].distance).toBe(1);
				expect(bfs_res['B'].parent).toBe(root);
				expect(bfs_res['C'].distance).toBe(1);
				expect(bfs_res['C'].parent).toBe(root);
				expect(bfs_res['D'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['D'].parent).toBe(null);
				expect(bfs_res['E'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).toBe(null);
				expect(bfs_res['F'].distance).toBe(1);
				expect(bfs_res['F'].parent).toBe(root);
				expect(bfs_res['G'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).toBe(null);
			});


			test('should correctly compute distances from node D', () => {
				let root = graph.getNodeById('D'),
					config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = $G.GraphMode.DIRECTED;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).toBe(7);

				expect(bfs_res['A'].counter).toBe(-1);
				expect(bfs_res['B'].counter).toBe(-1);
				expect(bfs_res['C'].counter).toBe(-1);
				expect(bfs_res['D'].counter).toBe(0);
				expect(bfs_res['E'].counter).toBe(1);
				expect(bfs_res['F'].counter).toBe(2);
				expect(bfs_res['G'].counter).toBe(-1);

				expect(bfs_res['A'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['A'].parent).toBe(null);
				expect(bfs_res['B'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).toBe(null);
				expect(bfs_res['C'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].parent).toBe(null);
				expect(bfs_res['D'].distance).toBe(0);
				expect(bfs_res['D'].parent).toBe(root);
				expect(bfs_res['E'].distance).toBe(1);
				expect(bfs_res['E'].parent).toBe(root);
				expect(bfs_res['F'].distance).toBe(2);
				expect(bfs_res['F'].parent).toBe(graph.getNodeById('E'));
				expect(bfs_res['G'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).toBe(null);
			});


			test('should correctly compute distances from node C', () => {
				let root = graph.getNodeById('C'),
					config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = $G.GraphMode.DIRECTED;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).toBe(7);

				expect(bfs_res['A'].counter).toBe(1);
				expect(bfs_res['B'].counter).toBe(2);
				expect(bfs_res['C'].counter).toBe(0);
				expect(bfs_res['D'].counter).toBe(-1);
				expect(bfs_res['E'].counter).toBe(-1);
				expect(bfs_res['F'].counter).toBe(3);
				expect(bfs_res['G'].counter).toBe(-1);

				expect(bfs_res['A'].distance).toBe(1);
				expect(bfs_res['A'].parent).toBe(root);
				expect(bfs_res['B'].distance).toBe(2);
				expect(bfs_res['B'].parent).toBe(graph.getNodeById('A'));
				expect(bfs_res['C'].distance).toBe(0);
				expect(bfs_res['C'].parent).toBe(root);
				expect(bfs_res['D'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['D'].parent).toBe(null);
				expect(bfs_res['E'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).toBe(null);
				expect(bfs_res['F'].distance).toBe(2);
				expect(bfs_res['F'].parent).toBe(graph.getNodeById('A'));
				expect(bfs_res['G'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).toBe(null);
			});


			test('should correctly compute distances from node G', () => {
				let root = graph.getNodeById('G'),
					config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = $G.GraphMode.DIRECTED;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).toBe(7);

				expect(bfs_res['A'].counter).toBe(-1);
				expect(bfs_res['B'].counter).toBe(-1);
				expect(bfs_res['C'].counter).toBe(-1);
				expect(bfs_res['D'].counter).toBe(-1);
				expect(bfs_res['E'].counter).toBe(-1);
				expect(bfs_res['F'].counter).toBe(-1);
				expect(bfs_res['G'].counter).toBe(0);

				expect(bfs_res['A'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['A'].parent).toBe(null);
				expect(bfs_res['B'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).toBe(null);
				expect(bfs_res['C'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].parent).toBe(null);
				expect(bfs_res['D'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['D'].parent).toBe(null);
				expect(bfs_res['E'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).toBe(null);
				expect(bfs_res['F'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['F'].parent).toBe(null);
				expect(bfs_res['G'].distance).toBe(0);
				expect(bfs_res['G'].parent).toBe(root);
			});

		});


		describe('computing distances in MIXED _mode - ', () => {

			test('should correctly compute distances from node A', () => {
				let root = graph.getNodeById('A');
				bfs_res = $BFS.BFS(graph, root);

				expect(Object.keys(bfs_res).length).toBe(7);

				// undirected before directed...
				// shall we sort those nodes by id first??
				// nope......
				expect(bfs_res['A'].counter).toBe(0);
				expect(bfs_res['B'].counter).toBe(1);
				expect(bfs_res['C'].counter).toBe(2);
				expect(bfs_res['D'].counter).toBe(4);
				expect(bfs_res['E'].counter).toBe(5);
				expect(bfs_res['F'].counter).toBe(3);
				expect(bfs_res['G'].counter).toBe(-1);

				expect(bfs_res['A'].distance).toBe(0);
				expect(bfs_res['A'].parent).toBe(root);
				expect(bfs_res['B'].distance).toBe(1);
				expect(bfs_res['B'].parent).toBe(root);
				expect(bfs_res['C'].distance).toBe(1);
				expect(bfs_res['C'].parent).toBe(root);
				expect(bfs_res['D'].distance).toBe(1);
				expect(bfs_res['D'].parent).toBe(root);
				expect(bfs_res['E'].distance).toBe(2);
				expect(bfs_res['E'].parent).toBe(graph.getNodeById('D'));
				expect(bfs_res['F'].distance).toBe(1);
				expect(bfs_res['F'].parent).toBe(root);
				expect(bfs_res['G'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).toBe(null);
			});

			test('should correctly compute distances from node D', () => {
				let root = graph.getNodeById('D');
				bfs_res = $BFS.BFS(graph, root);

				expect(Object.keys(bfs_res).length).toBe(7);

				expect(bfs_res['A'].counter).toBe(2);
				expect(bfs_res['B'].counter).toBe(4);
				expect(bfs_res['C'].counter).toBe(5);
				expect(bfs_res['D'].counter).toBe(0);
				expect(bfs_res['E'].counter).toBe(1);
				expect(bfs_res['F'].counter).toBe(3);
				expect(bfs_res['G'].counter).toBe(-1);

				expect(bfs_res['A'].distance).toBe(1);
				expect(bfs_res['A'].parent).toBe(root);
				expect(bfs_res['B'].distance).toBe(2);
				expect(bfs_res['B'].parent).toBe(graph.getNodeById('A'));
				expect(bfs_res['C'].distance).toBe(2);
				expect(bfs_res['C'].parent).toBe(graph.getNodeById('A'));
				expect(bfs_res['D'].distance).toBe(0);
				expect(bfs_res['D'].parent).toBe(root);
				expect(bfs_res['E'].distance).toBe(1);
				expect(bfs_res['E'].parent).toBe(root);
				expect(bfs_res['F'].distance).toBe(2);
				expect(bfs_res['F'].parent).toBe(graph.getNodeById('E'));
				expect(bfs_res['G'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).toBe(null);
			});

			test('should correctly compute distances from node E', () => {
				let root = graph.getNodeById('E');
				bfs_res = $BFS.BFS(graph, root);

				expect(Object.keys(bfs_res).length).toBe(7);

				expect(bfs_res['A'].counter).toBe(-1);
				expect(bfs_res['B'].counter).toBe(-1);
				expect(bfs_res['C'].counter).toBe(-1);
				expect(bfs_res['D'].counter).toBe(-1);
				expect(bfs_res['E'].counter).toBe(0);
				expect(bfs_res['F'].counter).toBe(1);
				expect(bfs_res['G'].counter).toBe(-1);

				expect(bfs_res['A'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['A'].parent).toBe(null);
				expect(bfs_res['B'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).toBe(null);
				expect(bfs_res['C'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].parent).toBe(null);
				expect(bfs_res['D'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['D'].parent).toBe(null);
				expect(bfs_res['E'].distance).toBe(0);
				expect(bfs_res['E'].parent).toBe(root);
				expect(bfs_res['F'].distance).toBe(1);
				expect(bfs_res['F'].parent).toBe(root);
				expect(bfs_res['G'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).toBe(null);
			});

			test('should correctly compute distances from node G', () => {
				let root = graph.getNodeById('G');
				bfs_res = $BFS.BFS(graph, root);

				expect(Object.keys(bfs_res).length).toBe(7);

				expect(bfs_res['A'].counter).toBe(-1);
				expect(bfs_res['B'].counter).toBe(-1);
				expect(bfs_res['C'].counter).toBe(-1);
				expect(bfs_res['D'].counter).toBe(-1);
				expect(bfs_res['E'].counter).toBe(-1);
				expect(bfs_res['F'].counter).toBe(-1);
				expect(bfs_res['G'].counter).toBe(0);

				expect(bfs_res['A'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['A'].parent).toBe(null);
				expect(bfs_res['B'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).toBe(null);
				expect(bfs_res['C'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].parent).toBe(null);
				expect(bfs_res['D'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['D'].parent).toBe(null);
				expect(bfs_res['E'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).toBe(null);
				expect(bfs_res['F'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['F'].parent).toBe(null);
				expect(bfs_res['G'].distance).toBe(0);
				expect(bfs_res['G'].parent).toBe(root);
			});

		});


		describe('computing distance weight_dists in MIXED _mode - ', () => {

			test('should correctly compute weight_dists from node A', () => {
				json._config.weighted = true;
				let graph = json.readFromJSONFile(search_graph),
					root = graph.getNodeById('A'),
					config = $BFS.prepareBFSStandardConfig(),
					weight_dists = {},
					nodes = graph.getNodes();

				for (let node_idx in nodes) {
					weight_dists[node_idx] = Number.POSITIVE_INFINITY;
				}
				weight_dists[root.getID()] = 0;
				config.callbacks.node_unmarked.push(setWeightCostsBFS(weight_dists));

				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).toBe(7);
				expect(weight_dists['A']).toBe(0);
				expect(weight_dists['B']).toBe(4);
				expect(weight_dists['C']).toBe(2);
				expect(weight_dists['D']).toBe(7);
				expect(weight_dists['E']).toBe(12);
				expect(weight_dists['F']).toBe(8);
				expect(weight_dists['G']).toBe(Number.POSITIVE_INFINITY);
			});


			test('should correctly compute weight_dists from node C', () => {
				json._config.weighted = true;
				let graph = json.readFromJSONFile(search_graph),
					root = graph.getNodeById('C'),
					config = $BFS.prepareBFSStandardConfig(),
					weight_dists = {},
					nodes = graph.getNodes();

				for (let node_idx in nodes) {
					weight_dists[node_idx] = Number.POSITIVE_INFINITY;
				}
				weight_dists[root.getID()] = 0;
				config.callbacks.node_unmarked.push(setWeightCostsBFS(weight_dists));

				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).toBe(7);
				expect(weight_dists['A']).toBe(3);
				expect(weight_dists['B']).toBe(7);
				expect(weight_dists['C']).toBe(0);
				expect(weight_dists['D']).toBe(10);
				expect(weight_dists['E']).toBe(15);
				expect(weight_dists['F']).toBe(11);
				expect(weight_dists['G']).toBe(Number.POSITIVE_INFINITY);
			});

		});

		/**
		 * Do we need weight tests for undirected or directed _mode??
		 * Probably not, as we have already tested correct DFS
		 * graph traversal extensively above...
		 */

	});


	/**
	 * Sorted BFS on small search graph PFS JSON
	 * 
	 * Running four tests on function sorting by weight_dists ascending,
	 * then four more tests on sorting by weight_dists descending
	 */
	describe('PFS_BFS graph traversal tests with edge weight ascending sort - ', () => {

		let search_graph_pfs = "./test/test_data/search_graph_pfs.json",
			json = new JSONInput({explicit_direction: true, directed: true, weighted: true}),
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
					config = $BFS.prepareBFSStandardConfig();

				config.callbacks.sort_nodes = ascSortBFS;
				let bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).toBe(6);

				expect(bfs_res['A'].counter).toBe(0);
				expect(bfs_res['B'].counter).toBe(2);
				expect(bfs_res['C'].counter).toBe(3);
				expect(bfs_res['D'].counter).toBe(1);
				expect(bfs_res['E'].counter).toBe(4);
				expect(bfs_res['F'].counter).toBe(5);

				expect(bfs_res['A'].distance).toBe(0);
				expect(bfs_res['B'].distance).toBe(1);
				expect(bfs_res['C'].distance).toBe(1);
				expect(bfs_res['D'].distance).toBe(1);
				expect(bfs_res['E'].distance).toBe(2);
				expect(bfs_res['F'].distance).toBe(2);

				expect(bfs_res['A'].parent).toBe(root);
				expect(bfs_res['B'].parent).toBe(root);
				expect(bfs_res['C'].parent).toBe(root);
				expect(bfs_res['D'].parent).toBe(root);
				expect(bfs_res['E'].parent).toBe(graph.getNodeById('D'));
				expect(bfs_res['F'].parent).toBe(graph.getNodeById('B'));
			}
		);


		test(
			'Should traverse search graph in correct order, ascending, root is D',
			() => {
				let root = graph.getNodeById('D'),
					config = $BFS.prepareBFSStandardConfig();

				config.callbacks.sort_nodes = ascSortBFS;
				let bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).toBe(6);

				expect(bfs_res['A'].counter).toBe(-1);
				expect(bfs_res['B'].counter).toBe(-1);
				expect(bfs_res['C'].counter).toBe(1);
				expect(bfs_res['D'].counter).toBe(0);
				expect(bfs_res['E'].counter).toBe(2);
				expect(bfs_res['F'].counter).toBe(-1);

				expect(bfs_res['A'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].distance).toBe(1);
				expect(bfs_res['D'].distance).toBe(0);
				expect(bfs_res['E'].distance).toBe(1);
				expect(bfs_res['F'].distance).toBe(Number.POSITIVE_INFINITY);

				expect(bfs_res['A'].parent).toBe(null);
				expect(bfs_res['B'].parent).toBe(null);
				expect(bfs_res['C'].parent).toBe(root);
				expect(bfs_res['D'].parent).toBe(root);
				expect(bfs_res['E'].parent).toBe(graph.getNodeById('D'));
				expect(bfs_res['F'].parent).toBe(null);
			}
		);


		test(
			'Should traverse search graph in correct order, DEscending, root is A',
			() => {
				let root = graph.getNodeById('A'),
					config = $BFS.prepareBFSStandardConfig();

				config.callbacks.sort_nodes = descSortBFS;
				let bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).toBe(6);

				expect(bfs_res['A'].counter).toBe(0);
				expect(bfs_res['B'].counter).toBe(2);
				expect(bfs_res['C'].counter).toBe(1);
				expect(bfs_res['D'].counter).toBe(3);
				expect(bfs_res['E'].counter).toBe(4);
				expect(bfs_res['F'].counter).toBe(5);

				expect(bfs_res['A'].distance).toBe(0);
				expect(bfs_res['B'].distance).toBe(1);
				expect(bfs_res['C'].distance).toBe(1);
				expect(bfs_res['D'].distance).toBe(1);
				expect(bfs_res['E'].distance).toBe(2);
				expect(bfs_res['F'].distance).toBe(2);

				expect(bfs_res['A'].parent).toBe(root);
				expect(bfs_res['B'].parent).toBe(root);
				expect(bfs_res['C'].parent).toBe(root);
				expect(bfs_res['D'].parent).toBe(root);
				expect(bfs_res['E'].parent).toBe(graph.getNodeById('C'));
				expect(bfs_res['F'].parent).toBe(graph.getNodeById('B'));
			}
		);


		test(
			'Should traverse search graph in correct order, DEscending, root is D',
			() => {
				let root = graph.getNodeById('D'),
					config = $BFS.prepareBFSStandardConfig();

				config.callbacks.sort_nodes = descSortBFS;
				let bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).toBe(6);

				expect(bfs_res['A'].counter).toBe(-1);
				expect(bfs_res['B'].counter).toBe(-1);
				expect(bfs_res['C'].counter).toBe(2);
				expect(bfs_res['D'].counter).toBe(0);
				expect(bfs_res['E'].counter).toBe(1);
				expect(bfs_res['F'].counter).toBe(-1);

				expect(bfs_res['A'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].distance).toBe(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].distance).toBe(1);
				expect(bfs_res['D'].distance).toBe(0);
				expect(bfs_res['E'].distance).toBe(1);
				expect(bfs_res['F'].distance).toBe(Number.POSITIVE_INFINITY);

				expect(bfs_res['A'].parent).toBe(null);
				expect(bfs_res['B'].parent).toBe(null);
				expect(bfs_res['C'].parent).toBe(root);
				expect(bfs_res['D'].parent).toBe(root);
				expect(bfs_res['E'].parent).toBe(graph.getNodeById('D'));
				expect(bfs_res['F'].parent).toBe(null);
			}
		);


		/**
		 * NOW WITH weight_dists...
		 */
		test(
			'Should correctly compute weight distance with ascending sort function, root is A',
			() => {
				let root = graph.getNodeById('A'),
					config = $BFS.prepareBFSStandardConfig(),
					weight_dists = {},
					nodes = graph.getNodes();

				for (let node_id in nodes) {
					weight_dists[node_id] = Number.POSITIVE_INFINITY;
				}
				weight_dists[root.getID()] = 0;
				config.callbacks.sort_nodes = ascSortBFS;
				config.callbacks.node_unmarked.push(setWeightCostsBFS(weight_dists));
				let bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).toBe(6);

				expect(weight_dists['A']).toBe(0);
				expect(weight_dists['B']).toBe(3);
				expect(weight_dists['C']).toBe(4);
				expect(weight_dists['D']).toBe(1);
				expect(weight_dists['E']).toBe(18);
				expect(weight_dists['F']).toBe(4);
			}
		);


		test(
			'Should correctly compute weight distance with ascending sort function, root is B',
			() => {
				let root = graph.getNodeById('B'),
					config = $BFS.prepareBFSStandardConfig(),
					weight_dists = {},
					nodes = graph.getNodes();

				for (let node_id in nodes) {
					weight_dists[node_id] = Number.POSITIVE_INFINITY;
				}
				weight_dists[root.getID()] = 0;
				config.callbacks.sort_nodes = ascSortBFS;
				config.callbacks.node_unmarked.push(setWeightCostsBFS(weight_dists));
				let bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).toBe(6);

				expect(weight_dists['A']).toBe(Number.POSITIVE_INFINITY);
				expect(weight_dists['B']).toBe(0);
				expect(weight_dists['C']).toBe(2);
				expect(weight_dists['D']).toBe(Number.POSITIVE_INFINITY);
				expect(weight_dists['E']).toBe(6);
				expect(weight_dists['F']).toBe(1);
			}
		);


		test(
			'Should correctly compute weight distance with DEscending sort function, root is A',
			() => {
				let root = graph.getNodeById('A'),
					config = $BFS.prepareBFSStandardConfig(),
					weight_dists = {},
					nodes = graph.getNodes();

				for (let node_id in nodes) {
					weight_dists[node_id] = Number.POSITIVE_INFINITY;
				}
				weight_dists[root.getID()] = 0;
				config.callbacks.sort_nodes = descSortBFS;
				config.callbacks.node_unmarked.push(setWeightCostsBFS(weight_dists));
				let bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).toBe(6);

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
					config = $BFS.prepareBFSStandardConfig(),
					weight_dists = {},
					nodes = graph.getNodes();

				for (let node_id in nodes) {
					weight_dists[node_id] = Number.POSITIVE_INFINITY;
				}
				weight_dists[root.getID()] = 0;
				config.callbacks.sort_nodes = descSortBFS;
				config.callbacks.node_unmarked.push(setWeightCostsBFS(weight_dists));
				let bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).toBe(6);

				expect(weight_dists['A']).toBe(Number.POSITIVE_INFINITY);
				expect(weight_dists['B']).toBe(0);
				expect(weight_dists['C']).toBe(2);
				expect(weight_dists['D']).toBe(Number.POSITIVE_INFINITY);
				expect(weight_dists['E']).toBe(3);
				expect(weight_dists['F']).toBe(1);
			}
		);

	});

});

let ascSortBFS = (context: $BFS.BFS_Scope) => {
	return context.adj_nodes.sort((a: $N.NeighborEntry, b: $N.NeighborEntry) => {
		return a.edge.getWeight() - b.edge.getWeight();
	});
};

let descSortBFS = (context: $BFS.BFS_Scope) => {
	return context.adj_nodes.sort((a: $N.NeighborEntry, b: $N.NeighborEntry) => {
		return b.edge.getWeight() - a.edge.getWeight();
	});
};

let setWeightCostsBFS = (weight_dists) => {
	return (context: $BFS.BFS_Scope) => {
		weight_dists[context.next_node.getID()] = weight_dists[context.current.getID()] + context.next_edge.getWeight();
	}
};