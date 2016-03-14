/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/input/JSONInput';
import * as $BFS from '../../src/search/BFS';

var expect 	= chai.expect;
var Node 		= $N.BaseNode;
var Edge 		= $E.BaseEdge;
var Graph 	= $G.BaseGraph;
var JSON_IN	= $I.JSONInput;

var search_graph = "./test/input/test_data/search_graph.json";



describe('Basic GRAPH SEARCH Tests - Breadth first search - ', () => {
	
	var json 					: $I.IJSONInput,
			input_file		: string,
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


	});

	
	
	describe('BFS on small test graph - ', () => {


		it('should refuse to traverse an empty graph', () => {
			var empty_graph = new $G.BaseGraph("iamempty"),
					root = graph.getRandomNode();
			expect($BFS.BFS.bind($BFS.BFS, empty_graph, root)).to.throw("Cowardly refusing to traverse graph without edges.");
		});


		it('should refuse to traverse a graph with mode set to INIT', () => {
			var root = graph.getRandomNode(),
					config = $BFS.prepareBFSStandardConfig();
			config.dir_mode = $G.GraphMode.INIT;
			expect($BFS.BFS.bind($BFS.BFS, graph, root, config)).to.throw("Cannot traverse a graph with dir_mode set to INIT.");
		});


		describe('computing distances in UNDIRECTED mode - ', () => {

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


		describe('computing distances in DIRECTED mode - ', () => {

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


		describe('computing distances in MIXED mode - ', () => {

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
		
		
		describe('computing distance weights in MIXED mode - ', () => {

			it('should correctly compute weights from node A', () => {				
				json._weighted_mode = true;
				var graph = json.readFromJSONFile(search_graph),
						root = graph.getNodeById('A'),
						config = $BFS.prepareBFSStandardConfig(),
						weights = {},
						nodes = graph.getNodes();
					
				for( var node_idx in nodes ) {
					weights[node_idx] = Number.POSITIVE_INFINITY;
				}
				weights[root.getID()] = 0;
						
				var setWeightDistance = ( context: $BFS.BFS_Scope ) => {
					weights[context.next_node.getID()] = weights[context.current.getID()] + context.next_edge.getWeight();
				}
				config.callbacks.node_unmarked.push(setWeightDistance);
										
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).to.equal(7);
				expect(weights['A']).to.equal(0);
				expect(weights['B']).to.equal(4);
				expect(weights['C']).to.equal(2);
				expect(weights['D']).to.equal(7);
				expect(weights['E']).to.equal(12);
				expect(weights['F']).to.equal(8);
				expect(weights['G']).to.equal(Number.POSITIVE_INFINITY);				
			});
			
			
			it('should correctly compute weights from node C', () => {				
				json._weighted_mode = true;
				var graph = json.readFromJSONFile(search_graph),
						root = graph.getNodeById('C'),
						config = $BFS.prepareBFSStandardConfig(),
						weights = {},
						nodes = graph.getNodes();
					
				for( var node_idx in nodes ) {
					weights[node_idx] = Number.POSITIVE_INFINITY;
				}
				weights[root.getID()] = 0;
						
				var setWeightDistance = ( context: $BFS.BFS_Scope ) => {
					weights[context.next_node.getID()] = weights[context.current.getID()] + context.next_edge.getWeight();
				}
				config.callbacks.node_unmarked.push(setWeightDistance);
										
				bfs_res = $BFS.BFS(graph, root, config);

				expect(Object.keys(bfs_res).length).to.equal(7);
				expect(weights['A']).to.equal(3);
				expect(weights['B']).to.equal(7);
				expect(weights['C']).to.equal(0);
				expect(weights['D']).to.equal(10);
				expect(weights['E']).to.equal(15);
				expect(weights['F']).to.equal(11);
				expect(weights['G']).to.equal(Number.POSITIVE_INFINITY);				
			});
			
		});
		
		/**
		 * Do we need weight tests for undirected or directed mode??
		 * Probably not, as we have already tested correct DFS
		 * graph traversal extensively above...
		 */
		
	});
	
});