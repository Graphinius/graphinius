/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/io/input/JSONInput';
import * as $BFS from '../../src/search/BFS';
import * as $CB from '../../src/utils/callbackUtils';

import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

chai.use(sinonChai);
var expect 	= chai.expect;
var JSON_IN	= $I.JSONInput;

var search_graph = "./test/test_data/search_graph.json";


describe('Basic GRAPH SEARCH Tests - Breadth first search - ', () => {
	
	var json 					: $I.IJSONInput,
			graph					: $G.IGraph,
			stats					: $G.GraphStats,
			bfs_res		: {[id: string] : $BFS.BFS_ResultEntry};


	it('should correctly instantiate the search graph', () => {
		json = new JSON_IN();
		graph = json.readFromJSONFile(search_graph);
		stats = graph.getStats();
		expect(stats.nr_nodes).to.equal(7);
		expect(stats.nr_dir_edges).to.equal(7);
		expect(stats.nr_und_edges).to.equal(2);
	});


	/**
	 * HUGE TODO:
	 * Make sure the callbacks are not only executed, but
	 * executed at the right stage of the code
	 * Don't know how yet...
	 * probably by dividing the messages object into separate
	 * CB-stage related nested objects (messages.init_bfs etc.)
	 * and only handing them to the callback as distinct
	 * message parameter to use...
	 */
	describe('should properly execute the different callback stages', () => {

		beforeEach(() => {
			graph = json.readFromJSONFile(search_graph);
		});

		it('should execute the BFS INIT callbacks', () => {
			var root = graph.getNodeById('A'),
					config = $BFS.prepareBFSStandardConfig();

			var bfsInitTestCallback = function() {
				config.messages['test_message'] = "BFS INIT callback executed.";
			};
			config.callbacks.init_bfs.push(bfsInitTestCallback);
			var result = $BFS.BFS(graph, root, config);
			expect(config.messages['test_message']).to.equal("BFS INIT callback executed.");
		});


		it('should execute the NODE UNMARKED callbacks', () => {
			var root = graph.getNodeById('A'),
					config = $BFS.prepareBFSStandardConfig();

			var bfsNodeUnmarkedTestCallback = function() {
				config.messages['test_message'] = "NODE UNMARKED callback executed.";
			};
			config.callbacks.node_unmarked.push(bfsNodeUnmarkedTestCallback);
			var result = $BFS.BFS(graph, root, config);
			expect(config.messages['test_message']).to.equal("NODE UNMARKED callback executed.");
		});


		it('should execute the NODE MARKED callbacks', () => {
			var root = graph.getNodeById('A'),
					config = $BFS.prepareBFSStandardConfig();

			var bfsNodeMarkedTestCallback = function() {
				config.messages['test_message'] = "NODE MARKED callback executed.";
			};
			config.callbacks.node_marked.push(bfsNodeMarkedTestCallback);
			var result = $BFS.BFS(graph, root, config);
			expect(config.messages['test_message']).to.equal("NODE MARKED callback executed.");
		});


		it('should execute the SORT NODES callback', () => {
			var root = graph.getNodeById('A'),
					config = $BFS.prepareBFSStandardConfig();

			var bfsSortNodesTestCallback = function() {
				config.messages['test_message'] = "SORT NODES callback executed.";
			};
			config.callbacks.sort_nodes = bfsSortNodesTestCallback;
			var result = $BFS.BFS(graph, root, config);
			expect(config.messages['test_message']).to.equal("SORT NODES callback executed.");
		});
		
		
		it('should not execute any callback at all', () => {
			// prepare Spy...
			var execCBSpy = sinon.spy($CB.execCallbacks);
			var origExecCB = $CB.execCallbacks;
			$CB.execCallbacks = execCBSpy;
			
			// execute test
			var root = graph.getNodeById('A'),
					config = $BFS.prepareBFSStandardConfig();
			// set config.callbacks to emtpy object
			config.callbacks = {};
			// manually initialize distance object
			for (var key in graph.getNodes()) {
            config.result[key] = {
                distance: Number.POSITIVE_INFINITY,
                parent: null,
                counter: -1
            };
        }
			var bfs_res = $BFS.BFS(graph, root, config);
			
			expect(execCBSpy).to.have.not.been.called;
			// restore original function
			$CB.execCallbacks = origExecCB;
		});

	});

	
	
	describe('BFS on small search graph - ', () => {


		it('should refuse to traverse an empty graph', () => {
			var empty_graph = new $G.BaseGraph("iamempty"),
					root = graph.getRandomNode();
			expect($BFS.BFS.bind($BFS.BFS, empty_graph, root)).to.throw("Cowardly refusing to traverse graph without edges.");
		});


		it('should refuse to traverse a graph with _mode set to INIT', () => {
			var root = graph.getRandomNode(),
					config = $BFS.prepareBFSStandardConfig();
			config.dir_mode = $G.GraphMode.INIT;
			expect($BFS.BFS.bind($BFS.BFS, graph, root, config)).to.throw("Cannot traverse a graph with dir_mode set to INIT.");
		});
		
		
		it('should never expand a node when DIR mode is set to a meaningless value', () => {
			var root = graph.getNodeById('A'),
					config = $BFS.prepareBFSStandardConfig();

			config.dir_mode = 9999;
			bfs_res = $BFS.BFS(graph, root, config);

			expect(Object.keys(bfs_res).length).to.equal(7);

			expect(bfs_res['A'].counter).to.equal(0);
			expect(bfs_res['B'].counter).to.equal(-1);
			expect(bfs_res['C'].counter).to.equal(-1);
			expect(bfs_res['D'].counter).to.equal(-1);
			expect(bfs_res['E'].counter).to.equal(-1);
			expect(bfs_res['F'].counter).to.equal(-1);
			expect(bfs_res['G'].counter).to.equal(-1);

			expect(bfs_res['A'].distance).to.equal(0);
			expect(bfs_res['A'].parent).to.equal(root);
			expect(bfs_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(bfs_res['B'].parent).to.equal(null);
			expect(bfs_res['C'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(bfs_res['C'].parent).to.equal(null);
			expect(bfs_res['D'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(bfs_res['D'].parent).to.equal(null);
			expect(bfs_res['E'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(bfs_res['E'].parent).to.equal(null);
			expect(bfs_res['F'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(bfs_res['F'].parent).to.equal(null);
			expect(bfs_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(bfs_res['G'].parent).to.equal(null);
		});		


		describe('computing distances in UNDIRECTED _mode - ', () => {

			it('should correctly compute distances from node A', () => {
				var root = graph.getNodeById('A'),
					config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = $G.GraphMode.UNDIRECTED;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).to.equal(7);

				expect(bfs_res['A'].counter).to.equal(0);
				expect(bfs_res['B'].counter).to.equal(-1);
				expect(bfs_res['C'].counter).to.equal(-1);
				expect(bfs_res['D'].counter).to.equal(1);
				expect(bfs_res['E'].counter).to.equal(-1);
				expect(bfs_res['F'].counter).to.equal(-1);
				expect(bfs_res['G'].counter).to.equal(-1);

				expect(bfs_res['A'].distance).to.equal(0);
				expect(bfs_res['A'].parent).to.equal(root);
				expect(bfs_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).to.equal(null);
				expect(bfs_res['C'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].parent).to.equal(null);
				expect(bfs_res['D'].distance).to.equal(1);
				expect(bfs_res['D'].parent).to.equal(root);
				expect(bfs_res['E'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).to.equal(null);
				expect(bfs_res['F'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['F'].parent).to.equal(null);
				expect(bfs_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).to.equal(null);
			});


			it('should correctly compute distances from node C', () => {
				var root = graph.getNodeById('C'),
					config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = $G.GraphMode.UNDIRECTED;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).to.equal(7);

				expect(bfs_res['A'].counter).to.equal(-1);
				expect(bfs_res['B'].counter).to.equal(-1);
				expect(bfs_res['C'].counter).to.equal(0);
				expect(bfs_res['D'].counter).to.equal(-1);
				expect(bfs_res['E'].counter).to.equal(-1);
				expect(bfs_res['F'].counter).to.equal(-1);
				expect(bfs_res['G'].counter).to.equal(-1);

				expect(bfs_res['A'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['A'].parent).to.equal(null);
				expect(bfs_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).to.equal(null);
				expect(bfs_res['C'].distance).to.equal(0);
				expect(bfs_res['C'].parent).to.equal(root);
				expect(bfs_res['D'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['D'].parent).to.equal(null);
				expect(bfs_res['E'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).to.equal(null);
				expect(bfs_res['F'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['F'].parent).to.equal(null);
				expect(bfs_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).to.equal(null);
			});


			it('should correctly compute distances from node D', () => {
				var root = graph.getNodeById('D'),
					config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = $G.GraphMode.UNDIRECTED;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).to.equal(7);

				expect(bfs_res['A'].counter).to.equal(1);
				expect(bfs_res['B'].counter).to.equal(-1);
				expect(bfs_res['C'].counter).to.equal(-1);
				expect(bfs_res['D'].counter).to.equal(0);
				expect(bfs_res['E'].counter).to.equal(-1);
				expect(bfs_res['F'].counter).to.equal(-1);
				expect(bfs_res['G'].counter).to.equal(-1);

				expect(bfs_res['A'].distance).to.equal(1);
				expect(bfs_res['A'].parent).to.equal(root);
				expect(bfs_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).to.equal(null);
				expect(bfs_res['C'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].parent).to.equal(null);
				expect(bfs_res['D'].distance).to.equal(0);
				expect(bfs_res['D'].parent).to.equal(root);
				expect(bfs_res['E'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).to.equal(null);
				expect(bfs_res['F'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['F'].parent).to.equal(null);
				expect(bfs_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).to.equal(null);
			});


			it('should correctly compute distances from node G', () => {
				var root = graph.getNodeById('G'),
					config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = $G.GraphMode.UNDIRECTED;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).to.equal(7);

				expect(bfs_res['A'].counter).to.equal(-1);
				expect(bfs_res['B'].counter).to.equal(-1);
				expect(bfs_res['C'].counter).to.equal(-1);
				expect(bfs_res['D'].counter).to.equal(-1);
				expect(bfs_res['E'].counter).to.equal(-1);
				expect(bfs_res['F'].counter).to.equal(-1);
				expect(bfs_res['G'].counter).to.equal(0);

				expect(bfs_res['A'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['A'].parent).to.equal(null);
				expect(bfs_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).to.equal(null);
				expect(bfs_res['C'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].parent).to.equal(null);
				expect(bfs_res['D'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['D'].parent).to.equal(null);
				expect(bfs_res['E'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).to.equal(null);
				expect(bfs_res['F'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['F'].parent).to.equal(null);
				expect(bfs_res['G'].distance).to.equal(0);
				expect(bfs_res['G'].parent).to.equal(root);
			});

		});


		describe('computing distances in DIRECTED _mode - ', () => {

			it('should correctly compute distances from node A', () => {
				var root = graph.getNodeById('A'),
						config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = $G.GraphMode.DIRECTED;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).to.equal(7);

				expect(bfs_res['A'].counter).to.equal(0);
				expect(bfs_res['B'].counter).to.equal(1);
				expect(bfs_res['C'].counter).to.equal(2);
				expect(bfs_res['D'].counter).to.equal(-1);
				expect(bfs_res['E'].counter).to.equal(-1);
				expect(bfs_res['F'].counter).to.equal(3);
				expect(bfs_res['G'].counter).to.equal(-1);

				expect(bfs_res['A'].distance).to.equal(0);
				expect(bfs_res['A'].parent).to.equal(root);
				expect(bfs_res['B'].distance).to.equal(1);
				expect(bfs_res['B'].parent).to.equal(root);
				expect(bfs_res['C'].distance).to.equal(1);
				expect(bfs_res['C'].parent).to.equal(root);
				expect(bfs_res['D'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['D'].parent).to.equal(null);
				expect(bfs_res['E'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).to.equal(null);
				expect(bfs_res['F'].distance).to.equal(1);
				expect(bfs_res['F'].parent).to.equal(root);
				expect(bfs_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).to.equal(null);
			});


			it('should correctly compute distances from node D', () => {
				var root = graph.getNodeById('D'),
					config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = $G.GraphMode.DIRECTED;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).to.equal(7);

				expect(bfs_res['A'].counter).to.equal(-1);
				expect(bfs_res['B'].counter).to.equal(-1);
				expect(bfs_res['C'].counter).to.equal(-1);
				expect(bfs_res['D'].counter).to.equal(0);
				expect(bfs_res['E'].counter).to.equal(1);
				expect(bfs_res['F'].counter).to.equal(2);
				expect(bfs_res['G'].counter).to.equal(-1);

				expect(bfs_res['A'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['A'].parent).to.equal(null);
				expect(bfs_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).to.equal(null);
				expect(bfs_res['C'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].parent).to.equal(null);
				expect(bfs_res['D'].distance).to.equal(0);
				expect(bfs_res['D'].parent).to.equal(root);
				expect(bfs_res['E'].distance).to.equal(1);
				expect(bfs_res['E'].parent).to.equal(root);
				expect(bfs_res['F'].distance).to.equal(2);
				expect(bfs_res['F'].parent).to.equal(graph.getNodeById('E'));
				expect(bfs_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).to.equal(null);
			});


			it('should correctly compute distances from node C', () => {
				var root = graph.getNodeById('C'),
					config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = $G.GraphMode.DIRECTED;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).to.equal(7);

				expect(bfs_res['A'].counter).to.equal(1);
				expect(bfs_res['B'].counter).to.equal(2);
				expect(bfs_res['C'].counter).to.equal(0);
				expect(bfs_res['D'].counter).to.equal(-1);
				expect(bfs_res['E'].counter).to.equal(-1);
				expect(bfs_res['F'].counter).to.equal(3);
				expect(bfs_res['G'].counter).to.equal(-1);

				expect(bfs_res['A'].distance).to.equal(1);
				expect(bfs_res['A'].parent).to.equal(root);
				expect(bfs_res['B'].distance).to.equal(2);
				expect(bfs_res['B'].parent).to.equal(graph.getNodeById('A'));
				expect(bfs_res['C'].distance).to.equal(0);
				expect(bfs_res['C'].parent).to.equal(root);
				expect(bfs_res['D'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['D'].parent).to.equal(null);
				expect(bfs_res['E'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).to.equal(null);
				expect(bfs_res['F'].distance).to.equal(2);
				expect(bfs_res['F'].parent).to.equal(graph.getNodeById('A'));
				expect(bfs_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).to.equal(null);
			});


			it('should correctly compute distances from node G', () => {
				var root = graph.getNodeById('G'),
					config = $BFS.prepareBFSStandardConfig();

				config.dir_mode = $G.GraphMode.DIRECTED;
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).to.equal(7);

				expect(bfs_res['A'].counter).to.equal(-1);
				expect(bfs_res['B'].counter).to.equal(-1);
				expect(bfs_res['C'].counter).to.equal(-1);
				expect(bfs_res['D'].counter).to.equal(-1);
				expect(bfs_res['E'].counter).to.equal(-1);
				expect(bfs_res['F'].counter).to.equal(-1);
				expect(bfs_res['G'].counter).to.equal(0);

				expect(bfs_res['A'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['A'].parent).to.equal(null);
				expect(bfs_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).to.equal(null);
				expect(bfs_res['C'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].parent).to.equal(null);
				expect(bfs_res['D'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['D'].parent).to.equal(null);
				expect(bfs_res['E'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).to.equal(null);
				expect(bfs_res['F'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['F'].parent).to.equal(null);
				expect(bfs_res['G'].distance).to.equal(0);
				expect(bfs_res['G'].parent).to.equal(root);
			});

		});


		describe('computing distances in MIXED _mode - ', () => {

			it('should correctly compute distances from node A', () => {
				var root = graph.getNodeById('A');
				bfs_res = $BFS.BFS(graph, root);

				expect(Object.keys(bfs_res).length).to.equal(7);

				// undirected before directed...
				// shall we sort those nodes by id first??
				// nope......
				expect(bfs_res['A'].counter).to.equal(0);
				expect(bfs_res['B'].counter).to.equal(1);
				expect(bfs_res['C'].counter).to.equal(2);
				expect(bfs_res['D'].counter).to.equal(4);
				expect(bfs_res['E'].counter).to.equal(5);
				expect(bfs_res['F'].counter).to.equal(3);
				expect(bfs_res['G'].counter).to.equal(-1);

				expect(bfs_res['A'].distance).to.equal(0);
				expect(bfs_res['A'].parent).to.equal(root);
				expect(bfs_res['B'].distance).to.equal(1);
				expect(bfs_res['B'].parent).to.equal(root);
				expect(bfs_res['C'].distance).to.equal(1);
				expect(bfs_res['C'].parent).to.equal(root);
				expect(bfs_res['D'].distance).to.equal(1);
				expect(bfs_res['D'].parent).to.equal(root);
				expect(bfs_res['E'].distance).to.equal(2);
				expect(bfs_res['E'].parent).to.equal(graph.getNodeById('D'));
				expect(bfs_res['F'].distance).to.equal(1);
				expect(bfs_res['F'].parent).to.equal(root);
				expect(bfs_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).to.equal(null);
			});

			it('should correctly compute distances from node D', () => {
				var root = graph.getNodeById('D');
				bfs_res = $BFS.BFS(graph, root);

				expect(Object.keys(bfs_res).length).to.equal(7);

				expect(bfs_res['A'].counter).to.equal(2);
				expect(bfs_res['B'].counter).to.equal(4);
				expect(bfs_res['C'].counter).to.equal(5);
				expect(bfs_res['D'].counter).to.equal(0);
				expect(bfs_res['E'].counter).to.equal(1);
				expect(bfs_res['F'].counter).to.equal(3);
				expect(bfs_res['G'].counter).to.equal(-1);

				expect(bfs_res['A'].distance).to.equal(1);
				expect(bfs_res['A'].parent).to.equal(root);
				expect(bfs_res['B'].distance).to.equal(2);
				expect(bfs_res['B'].parent).to.equal(graph.getNodeById('A'));
				expect(bfs_res['C'].distance).to.equal(2);
				expect(bfs_res['C'].parent).to.equal(graph.getNodeById('A'));
				expect(bfs_res['D'].distance).to.equal(0);
				expect(bfs_res['D'].parent).to.equal(root);
				expect(bfs_res['E'].distance).to.equal(1);
				expect(bfs_res['E'].parent).to.equal(root);
				expect(bfs_res['F'].distance).to.equal(2);
				expect(bfs_res['F'].parent).to.equal(graph.getNodeById('E'));
				expect(bfs_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).to.equal(null);
			});

			it('should correctly compute distances from node E', () => {
				var root = graph.getNodeById('E');
				bfs_res = $BFS.BFS(graph, root);

				expect(Object.keys(bfs_res).length).to.equal(7);

				expect(bfs_res['A'].counter).to.equal(-1);
				expect(bfs_res['B'].counter).to.equal(-1);
				expect(bfs_res['C'].counter).to.equal(-1);
				expect(bfs_res['D'].counter).to.equal(-1);
				expect(bfs_res['E'].counter).to.equal(0);
				expect(bfs_res['F'].counter).to.equal(1);
				expect(bfs_res['G'].counter).to.equal(-1);

				expect(bfs_res['A'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['A'].parent).to.equal(null);
				expect(bfs_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).to.equal(null);
				expect(bfs_res['C'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].parent).to.equal(null);
				expect(bfs_res['D'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['D'].parent).to.equal(null);
				expect(bfs_res['E'].distance).to.equal(0);
				expect(bfs_res['E'].parent).to.equal(root);
				expect(bfs_res['F'].distance).to.equal(1);
				expect(bfs_res['F'].parent).to.equal(root);
				expect(bfs_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['G'].parent).to.equal(null);
			});

			it('should correctly compute distances from node G', () => {
				var root = graph.getNodeById('G');
				bfs_res = $BFS.BFS(graph, root);

				expect(Object.keys(bfs_res).length).to.equal(7);

				expect(bfs_res['A'].counter).to.equal(-1);
				expect(bfs_res['B'].counter).to.equal(-1);
				expect(bfs_res['C'].counter).to.equal(-1);
				expect(bfs_res['D'].counter).to.equal(-1);
				expect(bfs_res['E'].counter).to.equal(-1);
				expect(bfs_res['F'].counter).to.equal(-1);
				expect(bfs_res['G'].counter).to.equal(0);

				expect(bfs_res['A'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['A'].parent).to.equal(null);
				expect(bfs_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['B'].parent).to.equal(null);
				expect(bfs_res['C'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['C'].parent).to.equal(null);
				expect(bfs_res['D'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['D'].parent).to.equal(null);
				expect(bfs_res['E'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['E'].parent).to.equal(null);
				expect(bfs_res['F'].distance).to.equal(Number.POSITIVE_INFINITY);
				expect(bfs_res['F'].parent).to.equal(null);
				expect(bfs_res['G'].distance).to.equal(0);
				expect(bfs_res['G'].parent).to.equal(root);
			});

		});
		
		
		describe('computing distance weight_dists in MIXED _mode - ', () => {

			it('should correctly compute weight_dists from node A', () => {				
				json._weighted_mode = true;
				var graph = json.readFromJSONFile(search_graph),
						root = graph.getNodeById('A'),
						config = $BFS.prepareBFSStandardConfig(),
						weight_dists = {},
						nodes = graph.getNodes();
					
				for( var node_idx in nodes ) {
					weight_dists[node_idx] = Number.POSITIVE_INFINITY;
				}
				weight_dists[root.getID()] = 0;
				config.callbacks.node_unmarked.push(setWeightCostsBFS(weight_dists));
										
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).to.equal(7);
				expect(weight_dists['A']).to.equal(0);
				expect(weight_dists['B']).to.equal(4);
				expect(weight_dists['C']).to.equal(2);
				expect(weight_dists['D']).to.equal(7);
				expect(weight_dists['E']).to.equal(12);
				expect(weight_dists['F']).to.equal(8);
				expect(weight_dists['G']).to.equal(Number.POSITIVE_INFINITY);
			});
			
			
			it('should correctly compute weight_dists from node C', () => {				
				json._weighted_mode = true;
				var graph = json.readFromJSONFile(search_graph),
						root = graph.getNodeById('C'),
						config = $BFS.prepareBFSStandardConfig(),
						weight_dists = {},
						nodes = graph.getNodes();
					
				for( var node_idx in nodes ) {
					weight_dists[node_idx] = Number.POSITIVE_INFINITY;
				}
				weight_dists[root.getID()] = 0;
				config.callbacks.node_unmarked.push(setWeightCostsBFS(weight_dists));
										
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).to.equal(7);
				expect(weight_dists['A']).to.equal(3);
				expect(weight_dists['B']).to.equal(7);
				expect(weight_dists['C']).to.equal(0);
				expect(weight_dists['D']).to.equal(10);
				expect(weight_dists['E']).to.equal(15);
				expect(weight_dists['F']).to.equal(11);
				expect(weight_dists['G']).to.equal(Number.POSITIVE_INFINITY);				
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

		var search_graph_pfs = "./test/test_data/search_graph_pfs.json",
				json = new $I.JSONInput(true, true, true),
				graph = json.readFromJSONFile(search_graph_pfs);

		beforeEach(() => {
			expect(graph.nrNodes()).to.equal(6);
			expect(graph.nrDirEdges()).to.equal(9);
			expect(graph.nrUndEdges()).to.equal(0);
		});
		
		
		it('Should traverse search graph in correct order, ascending, root is A', () => {
			var root = graph.getNodeById('A'),
					config = $BFS.prepareBFSStandardConfig();

			config.callbacks.sort_nodes = ascSortBFS;
			var bfs_res = $BFS.BFS(graph, root, config);

			expect(Object.keys(bfs_res).length).to.equal(6);

			expect(bfs_res['A'].counter).to.equal(0);
			expect(bfs_res['B'].counter).to.equal(2);
			expect(bfs_res['C'].counter).to.equal(3);
			expect(bfs_res['D'].counter).to.equal(1);
			expect(bfs_res['E'].counter).to.equal(4);
			expect(bfs_res['F'].counter).to.equal(5);

			expect(bfs_res['A'].distance).to.equal(0);
			expect(bfs_res['B'].distance).to.equal(1);
			expect(bfs_res['C'].distance).to.equal(1);
			expect(bfs_res['D'].distance).to.equal(1);
			expect(bfs_res['E'].distance).to.equal(2);
			expect(bfs_res['F'].distance).to.equal(2);

			expect(bfs_res['A'].parent).to.equal(root);
			expect(bfs_res['B'].parent).to.equal(root);
			expect(bfs_res['C'].parent).to.equal(root);
			expect(bfs_res['D'].parent).to.equal(root);
			expect(bfs_res['E'].parent).to.equal(graph.getNodeById('D'));
			expect(bfs_res['F'].parent).to.equal(graph.getNodeById('B'));
		});


		it('Should traverse search graph in correct order, ascending, root is D', () => {
			var root = graph.getNodeById('D'),
				config = $BFS.prepareBFSStandardConfig();

			config.callbacks.sort_nodes = ascSortBFS;
			var bfs_res = $BFS.BFS(graph, root, config);

			expect(Object.keys(bfs_res).length).to.equal(6);

			expect(bfs_res['A'].counter).to.equal(-1);
			expect(bfs_res['B'].counter).to.equal(-1);
			expect(bfs_res['C'].counter).to.equal(1);
			expect(bfs_res['D'].counter).to.equal(0);
			expect(bfs_res['E'].counter).to.equal(2);
			expect(bfs_res['F'].counter).to.equal(-1);

			expect(bfs_res['A'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(bfs_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(bfs_res['C'].distance).to.equal(1);
			expect(bfs_res['D'].distance).to.equal(0);
			expect(bfs_res['E'].distance).to.equal(1);
			expect(bfs_res['F'].distance).to.equal(Number.POSITIVE_INFINITY);

			expect(bfs_res['A'].parent).to.equal(null);
			expect(bfs_res['B'].parent).to.equal(null);
			expect(bfs_res['C'].parent).to.equal(root);
			expect(bfs_res['D'].parent).to.equal(root);
			expect(bfs_res['E'].parent).to.equal(graph.getNodeById('D'));
			expect(bfs_res['F'].parent).to.equal(null);
		});


		it('Should traverse search graph in correct order, DEscending, root is A', () => {
			var root = graph.getNodeById('A'),
				config = $BFS.prepareBFSStandardConfig();

			config.callbacks.sort_nodes = descSortBFS;
			var bfs_res = $BFS.BFS(graph, root, config);

			expect(Object.keys(bfs_res).length).to.equal(6);

			expect(bfs_res['A'].counter).to.equal(0);
			expect(bfs_res['B'].counter).to.equal(2);
			expect(bfs_res['C'].counter).to.equal(1);
			expect(bfs_res['D'].counter).to.equal(3);
			expect(bfs_res['E'].counter).to.equal(4);
			expect(bfs_res['F'].counter).to.equal(5);

			expect(bfs_res['A'].distance).to.equal(0);
			expect(bfs_res['B'].distance).to.equal(1);
			expect(bfs_res['C'].distance).to.equal(1);
			expect(bfs_res['D'].distance).to.equal(1);
			expect(bfs_res['E'].distance).to.equal(2);
			expect(bfs_res['F'].distance).to.equal(2);

			expect(bfs_res['A'].parent).to.equal(root);
			expect(bfs_res['B'].parent).to.equal(root);
			expect(bfs_res['C'].parent).to.equal(root);
			expect(bfs_res['D'].parent).to.equal(root);
			expect(bfs_res['E'].parent).to.equal(graph.getNodeById('C'));
			expect(bfs_res['F'].parent).to.equal(graph.getNodeById('B'));
		});


		it('Should traverse search graph in correct order, DEscending, root is D', () => {
			var root = graph.getNodeById('D'),
				config = $BFS.prepareBFSStandardConfig();

			config.callbacks.sort_nodes = descSortBFS;
			var bfs_res = $BFS.BFS(graph, root, config);

			expect(Object.keys(bfs_res).length).to.equal(6);

			expect(bfs_res['A'].counter).to.equal(-1);
			expect(bfs_res['B'].counter).to.equal(-1);
			expect(bfs_res['C'].counter).to.equal(2);
			expect(bfs_res['D'].counter).to.equal(0);
			expect(bfs_res['E'].counter).to.equal(1);
			expect(bfs_res['F'].counter).to.equal(-1);

			expect(bfs_res['A'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(bfs_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(bfs_res['C'].distance).to.equal(1);
			expect(bfs_res['D'].distance).to.equal(0);
			expect(bfs_res['E'].distance).to.equal(1);
			expect(bfs_res['F'].distance).to.equal(Number.POSITIVE_INFINITY);

			expect(bfs_res['A'].parent).to.equal(null);
			expect(bfs_res['B'].parent).to.equal(null);
			expect(bfs_res['C'].parent).to.equal(root);
			expect(bfs_res['D'].parent).to.equal(root);
			expect(bfs_res['E'].parent).to.equal(graph.getNodeById('D'));
			expect(bfs_res['F'].parent).to.equal(null);
		});


		/**
		 * NOW WITH weight_dists...
		 */
		it('Should correctly compute weight distance with ascending sort function, root is A', () => {
			var root = graph.getNodeById('A'),
				config = $BFS.prepareBFSStandardConfig(),
				weight_dists = {},
				nodes = graph.getNodes();

			for ( var node_id in nodes ) {
				weight_dists[node_id] = Number.POSITIVE_INFINITY;
			}
			weight_dists[root.getID()] = 0;
			config.callbacks.sort_nodes = ascSortBFS;
			config.callbacks.node_unmarked.push(setWeightCostsBFS(weight_dists));
			var bfs_res = $BFS.BFS(graph, root, config);

			expect(Object.keys(bfs_res).length).to.equal(6);

			expect(weight_dists['A']).to.equal(0);
			expect(weight_dists['B']).to.equal(3);
			expect(weight_dists['C']).to.equal(4);
			expect(weight_dists['D']).to.equal(1);
			expect(weight_dists['E']).to.equal(18);
			expect(weight_dists['F']).to.equal(4);
		});


		it('Should correctly compute weight distance with ascending sort function, root is B', () => {
			var root = graph.getNodeById('B'),
				config = $BFS.prepareBFSStandardConfig(),
				weight_dists = {},
				nodes = graph.getNodes();

			for ( var node_id in nodes ) {
				weight_dists[node_id] = Number.POSITIVE_INFINITY;
			}
			weight_dists[root.getID()] = 0;
			config.callbacks.sort_nodes = ascSortBFS;
			config.callbacks.node_unmarked.push(setWeightCostsBFS(weight_dists));
			var bfs_res = $BFS.BFS(graph, root, config);

			expect(Object.keys(bfs_res).length).to.equal(6);

			expect(weight_dists['A']).to.equal(Number.POSITIVE_INFINITY);
			expect(weight_dists['B']).to.equal(0);
			expect(weight_dists['C']).to.equal(2);
			expect(weight_dists['D']).to.equal(Number.POSITIVE_INFINITY);
			expect(weight_dists['E']).to.equal(6);
			expect(weight_dists['F']).to.equal(1);
		});


		it('Should correctly compute weight distance with DEscending sort function, root is A', () => {
			var root = graph.getNodeById('A'),
				config = $BFS.prepareBFSStandardConfig(),
				weight_dists = {},
				nodes = graph.getNodes();

			for ( var node_id in nodes ) {
				weight_dists[node_id] = Number.POSITIVE_INFINITY;
			}
			weight_dists[root.getID()] = 0;
			config.callbacks.sort_nodes = descSortBFS;
			config.callbacks.node_unmarked.push(setWeightCostsBFS(weight_dists));
			var bfs_res = $BFS.BFS(graph, root, config);

			expect(Object.keys(bfs_res).length).to.equal(6);

			expect(weight_dists['A']).to.equal(0);
			expect(weight_dists['B']).to.equal(3);
			expect(weight_dists['C']).to.equal(4);
			expect(weight_dists['D']).to.equal(1);
			expect(weight_dists['E']).to.equal(5);
			expect(weight_dists['F']).to.equal(4);
		});


		it('Should correctly compute weight distance with DEscending sort function, root is B', () => {
			var root = graph.getNodeById('B'),
				config = $BFS.prepareBFSStandardConfig(),
				weight_dists = {},
				nodes = graph.getNodes();

			for ( var node_id in nodes ) {
				weight_dists[node_id] = Number.POSITIVE_INFINITY;
			}
			weight_dists[root.getID()] = 0;
			config.callbacks.sort_nodes = descSortBFS;
			config.callbacks.node_unmarked.push(setWeightCostsBFS(weight_dists));
			var bfs_res = $BFS.BFS(graph, root, config);

			expect(Object.keys(bfs_res).length).to.equal(6);

			expect(weight_dists['A']).to.equal(Number.POSITIVE_INFINITY);
			expect(weight_dists['B']).to.equal(0);
			expect(weight_dists['C']).to.equal(2);
			expect(weight_dists['D']).to.equal(Number.POSITIVE_INFINITY);
			expect(weight_dists['E']).to.equal(3);
			expect(weight_dists['F']).to.equal(1);
		});

	});
	
});

var ascSortBFS = (context: $BFS.BFS_Scope) => {
	return context.adj_nodes.sort((a: $N.NeighborEntry, b: $N.NeighborEntry) => {
		return a.edge.getWeight() - b.edge.getWeight();
	});
};

var descSortBFS = (context: $BFS.BFS_Scope) => {
	return context.adj_nodes.sort((a: $N.NeighborEntry, b: $N.NeighborEntry) => {
		return b.edge.getWeight() - a.edge.getWeight();
	});
};

var setWeightCostsBFS = (weight_dists ) => {
	return (context: $BFS.BFS_Scope) => {
		weight_dists[context.next_node.getID()] = weight_dists[context.current.getID()] + context.next_edge.getWeight();
	}
};