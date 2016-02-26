/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/input/JSONInput';
import * as $DFS from '../../src/search/DFS';

var expect 	= chai.expect;
var Node 	  = $N.BaseNode;
var Edge 	  = $E.BaseEdge;
var Graph 	= $G.BaseGraph;
var JSON_IN	= $I.JSONInput;

var search_graph = "./test/input/test_data/search_graph.json";


describe('Basic GRAPH SEARCH Tests - Depth first search -', () => {
	
	var json 					: $I.IJSONInput,
			input_file		: string,
			graph					: $G.IGraph,
			stats					: $G.GraphStats,
			callbacks			: $DFS.DFS_Callbacks;
	
	
	describe('testing callback execution', () => {
		
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
		 */
		describe('should properly execute the different callback stages', () => {
			
			/**
			 * TODO: outSource execCallbacks function to utility module
			 */
			it('should execute an array of callback functions', () => {
				var scope = {
					msg_a: "",
					msg_b: ""
				}
				var funcArray = [];
				funcArray.push( function( context ) {
					context["msg_a"] = "Hello from func A.";
				});
				funcArray.push( function( context ) {
					context["msg_b"] = "Hello from func B.";
				});
				$DFS.execCallbacks(funcArray, scope);
				expect(scope.msg_a).to.equal("Hello from func A.");
				expect(scope.msg_b).to.equal("Hello from func B.");				
			});
			
			
			it('should execute the DFS VISIT INIT callbacks', () => {
				var root = graph.getNodeById('A'),
						result = {},
						count = 0;
				
				callbacks = {
					init_dfs_visit : []
				};
				var dfsVisitInitTestCallback = function() {
					result['test_message'] = "DFS VISIT INIT callback executed.";
				};
				callbacks.init_dfs_visit.push(dfsVisitInitTestCallback);
				$DFS.DFSVisit(graph, root, callbacks);
				expect(result['test_message']).to.equal("DFS VISIT INIT callback executed.");
			});
			
			
			it('should execute the DFS VISIT NODE POPPED callbacks', () => {
				var root = graph.getNodeById('A'),
						result = {},
						count = 0;
				
				callbacks = {
					node_popped : []
				};
				var dfsVisitNodePoppedTestCallback = function() {
					result['test_message'] = "DFS VISIT NODE POPPED callback executed.";
				};
				callbacks.node_popped.push(dfsVisitNodePoppedTestCallback);
				$DFS.DFSVisit(graph, root, callbacks);
				expect(result['test_message']).to.equal("DFS VISIT NODE POPPED callback executed.");
			});
			
			
			it('should execute the DFS VISIT NODE MARKED callbacks', () => {
				var root = graph.getNodeById('A'),
						result = {},
						count = 0;
				
				callbacks = {
					node_marked : []
				};
				var dfsVisitNodeMarkedTestCallback = function() {
					result['test_message'] = "DFS VISIT NODE MARKED callback executed.";
				};
				callbacks.node_marked.push(dfsVisitNodeMarkedTestCallback);
				$DFS.DFSVisit(graph, root, callbacks);
				expect(result['test_message']).to.equal("DFS VISIT NODE MARKED callback executed.");
			});
			
			
			it('should execute the DFS VISIT NODE UNMARKED callbacks', () => {
				var root = graph.getNodeById('A'),
						result = {},
						count = 0;
				
				callbacks = {
					node_unmarked : []
				};
				var dfsVisitNodeUnMarkedTestCallback = function() {
					result['test_message'] = "DFS VISIT NODE UNMARKED callback executed.";
				};
				callbacks.node_unmarked.push(dfsVisitNodeUnMarkedTestCallback);
				$DFS.DFSVisit(graph, root, callbacks);
				expect(result['test_message']).to.equal("DFS VISIT NODE UNMARKED callback executed.");
			});
			
			
			it('should execute the DFS VISIT ADJ NODES PUSHED callbacks', () => {
				var root = graph.getNodeById('A'),
						result = {},
						count = 0;
				
				callbacks = {
					adj_nodes_pushed : []
				};
				var dfsVisitAdjNodesPushedTestCallback = function() {
					result['test_message'] = "DFS VISIT ADJ NODES PUSHED callback executed.";
				};
				callbacks.adj_nodes_pushed.push(dfsVisitAdjNodesPushedTestCallback);
				$DFS.DFSVisit(graph, root, callbacks);
				expect(result['test_message']).to.equal("DFS VISIT ADJ NODES PUSHED callback executed.");
			});
			
			
			it('should execute the DFS INIT callbacks', () => {
				var result = {},
						count = 0;
				
				callbacks = {
					init_dfs : []
				};
				var dfsInitTestCallback = function() {
					result['test_message'] = "DFS INIT callback executed.";
				};
				callbacks.init_dfs.push(dfsInitTestCallback);
				$DFS.DFS(graph, callbacks);
				expect(result['test_message']).to.equal("DFS INIT callback executed.");
			});
			
		});
		
	});
	
	describe('testing DFS visit on small test graph, INIT MODE', () => {
		
		it('should throw an error upon trying to traverse a blank graph (INIT)', () => {
			var root = graph.getNodeById('A'),
					result = {},
					count = 0;
										
			callbacks = {};
			$DFS.prepareStandardDFSVisitCBs(result, callbacks, count);
			
			expect($DFS.DFSVisit.bind($DFS.DFSVisit, graph, root, callbacks, $G.GraphMode.INIT)).to.throw('Cowardly refusing to traverse graph without edges.');
		});
		
	});
	
	
	describe('testing DFS visit on small test graph, DIRECTED MODE', () => {
				
		it('should correctly compute distances from node A', () => {
			var root = graph.getNodeById('A'),
					result = {},
					count = 0;
										
			callbacks = {};
			$DFS.prepareStandardDFSVisitCBs(result, callbacks, count);			
			$DFS.DFSVisit(graph, root, callbacks, $G.GraphMode.DIRECTED);
						
			expect(Object.keys(result).length).to.equal(4);
			
			expect(result['D']).to.be.undefined;
			expect(result['E']).to.be.undefined;
			expect(result['G']).to.be.undefined;
			
			expect(result['A'].counter).to.equal(0);
			expect(result['B'].counter).to.equal(3);
			expect(result['C'].counter).to.equal(2);
			expect(result['F'].counter).to.equal(1);
			
			expect(result['A'].parent).to.equal(root);
			expect(result['B'].parent).to.equal(root);
			expect(result['C'].parent).to.equal(root);
			expect(result['F'].parent).to.equal(root);
		});
		
		
		it('should correctly compute distances from node D', () => {
			var root = graph.getNodeById('D'),
					result = {},
					count = 0;
										
			callbacks = {};
			$DFS.prepareStandardDFSVisitCBs(result, callbacks, count);			
			$DFS.DFSVisit(graph, root, callbacks, $G.GraphMode.DIRECTED);
						
			expect(Object.keys(result).length).to.equal(3);
			
			expect(result['A']).to.be.undefined;
			expect(result['B']).to.be.undefined;
			expect(result['C']).to.be.undefined;
			expect(result['G']).to.be.undefined;
			
			expect(result['D'].counter).to.equal(0);
			expect(result['E'].counter).to.equal(1);
			expect(result['F'].counter).to.equal(2);
			
			expect(result['D'].parent).to.equal(root);
			expect(result['E'].parent).to.equal(root);
			expect(result['F'].parent).to.equal(graph.getNodeById('E'));
		});
		
		
		it('should correctly compute distances from node G', () => {
			var root = graph.getNodeById('G'),
					result = {},
					count = 0;
										
			callbacks = {};
			$DFS.prepareStandardDFSVisitCBs(result, callbacks, count);			
			$DFS.DFSVisit(graph, root, callbacks, $G.GraphMode.DIRECTED);
						
			expect(Object.keys(result).length).to.equal(1);
			
			expect(result['A']).to.be.undefined;
			expect(result['B']).to.be.undefined;
			expect(result['C']).to.be.undefined;
			expect(result['D']).to.be.undefined;
			expect(result['E']).to.be.undefined;
			expect(result['F']).to.be.undefined;
			
			expect(result['G'].counter).to.equal(0);
			
			expect(result['G'].parent).to.equal(root);
		});
		
	});
	
	
	describe('testing DFS visit on small test graph, UNDIRECTED MODE', () => {
				
		it('should correctly compute distances from node A', () => {
			var root = graph.getNodeById('A'),
					result = {},
					count = 0;
										
			callbacks = {};
			$DFS.prepareStandardDFSVisitCBs(result, callbacks, count);			
			$DFS.DFSVisit(graph, root, callbacks, $G.GraphMode.UNDIRECTED);
						
			expect(Object.keys(result).length).to.equal(2);
			
			expect(result['B']).to.be.undefined;
			expect(result['C']).to.be.undefined;
			expect(result['E']).to.be.undefined;
			expect(result['F']).to.be.undefined;
			expect(result['G']).to.be.undefined;
			
			expect(result['A'].counter).to.equal(0);
			expect(result['D'].counter).to.equal(1);
			
			expect(result['A'].parent).to.equal(root);
			expect(result['D'].parent).to.equal(root);
		});
		
		
		it('should correctly compute distances from node D', () => {
			var root = graph.getNodeById('D'),
					result = {},
					count = 0;
										
			callbacks = {};
			$DFS.prepareStandardDFSVisitCBs(result, callbacks, count);			
			$DFS.DFSVisit(graph, root, callbacks, $G.GraphMode.UNDIRECTED);
						
			expect(Object.keys(result).length).to.equal(2);
			
			expect(result['B']).to.be.undefined;
			expect(result['C']).to.be.undefined;
			expect(result['E']).to.be.undefined;
			expect(result['F']).to.be.undefined;
			expect(result['G']).to.be.undefined;
			
			expect(result['A'].counter).to.equal(1);
			expect(result['D'].counter).to.equal(0);
			
			expect(result['A'].parent).to.equal(root);
			expect(result['D'].parent).to.equal(root);
		});
		
		
		it('should correctly compute distances from node G', () => {
			var root = graph.getNodeById('G'),
					result = {},
					count = 0;
										
			callbacks = {};
			$DFS.prepareStandardDFSVisitCBs(result, callbacks, count);			
			$DFS.DFSVisit(graph, root, callbacks, $G.GraphMode.UNDIRECTED);
						
			expect(Object.keys(result).length).to.equal(1);
			
			expect(result['A']).to.be.undefined;
			expect(result['B']).to.be.undefined;
			expect(result['C']).to.be.undefined;
			expect(result['D']).to.be.undefined;
			expect(result['E']).to.be.undefined;
			expect(result['F']).to.be.undefined;
			
			expect(result['G'].counter).to.equal(0);
			
			expect(result['G'].parent).to.equal(root);
		});
		
	});
	
	
	describe('testing DFS visit on small test graph, MIXED MODE', () => {
				
		it('should correctly compute distances from node A', () => {
			var root = graph.getNodeById('A'),
					result = {},
					count = 0;
										
			callbacks = {};
			$DFS.prepareStandardDFSVisitCBs(result, callbacks, count);			
			$DFS.DFSVisit(graph, root, callbacks);
						
			expect(Object.keys(result).length).to.equal(6);
			
			// console.dir(visit_res);
			
			// undirected before directed...
			// shall we sort those nodes by id first??
			expect(result['A'].counter).to.equal(0);
			expect(result['B'].counter).to.equal(5);
			expect(result['C'].counter).to.equal(4);
			expect(result['D'].counter).to.equal(1);
			expect(result['E'].counter).to.equal(2);
			expect(result['F'].counter).to.equal(3);
			
			expect(result['A'].parent).to.equal(root);
			expect(result['B'].parent).to.equal(root);
			expect(result['C'].parent).to.equal(root);
			expect(result['D'].parent).to.equal(root);
			expect(result['E'].parent).to.equal(graph.getNodeById('D'));
			expect(result['F'].parent).to.equal(graph.getNodeById('E'));
		});
		
		
		it('should correctly compute distances from node D', () => {
			var root = graph.getNodeById('D'),
					result = {},
					count = 0;
										
			callbacks = {};			
			$DFS.prepareStandardDFSVisitCBs(result, callbacks, count);			
			$DFS.DFSVisit(graph, root, callbacks);
						
			expect(Object.keys(result).length).to.equal(6);
			
			expect(result['A'].counter).to.equal(1);
			expect(result['B'].counter).to.equal(4);
			expect(result['C'].counter).to.equal(3);
			expect(result['D'].counter).to.equal(0);
			expect(result['E'].counter).to.equal(5);
			expect(result['F'].counter).to.equal(2);
			
			expect(result['A'].parent).to.equal(root);
			expect(result['B'].parent).to.equal(graph.getNodeById('A'));
			expect(result['C'].parent).to.equal(graph.getNodeById('A'));
			expect(result['D'].parent).to.equal(root);
			expect(result['E'].parent).to.equal(root);
			expect(result['F'].parent).to.equal(graph.getNodeById('A'));
		});
		
		
		it('should correctly compute distances from node E', () => {
			var root = graph.getNodeById('E'),
					result = {},
					count = 0;
										
			callbacks = {};			
			$DFS.prepareStandardDFSVisitCBs(result, callbacks, count);			
			$DFS.DFSVisit(graph, root, callbacks);
						
			expect(Object.keys(result).length).to.equal(2);			
			expect(result['E'].counter).to.equal(0);
			expect(result['F'].counter).to.equal(1);
			
			expect(result['E'].parent).to.equal(root);
			expect(result['F'].parent).to.equal(root);
		});
		
		
		it('should correctly compute distances from node G', () => {
			var root = graph.getNodeById('G'),
					result = {},
					count = 0;
										
			callbacks = {};
			
			$DFS.prepareStandardDFSVisitCBs(result, callbacks, count);
			
			$DFS.DFSVisit(graph, root, callbacks);
			
			expect(Object.keys(result).length).to.equal(1);			
			expect(result['G'].counter).to.equal(0);			
			expect(result['G'].parent).to.equal(root);
		});
		
	});
	
	
	describe('testing DFS on small test graph (including unconnected component)', () => {
		
		it('should throw an error upon trying to traverse a blank graph (INIT)', () => {
			var result = {},
					count = 0;
										
			callbacks = {};
			$DFS.prepareStandardDFSCBs(result, callbacks, count);				
			
			expect($DFS.DFS.bind($DFS.DFS, graph, callbacks, $G.GraphMode.INIT)).to.throw('Cowardly refusing to traverse graph without edges.');
		});
		
		
		/**
		 * $G.GraphMode enum holds 0-init (no edges), 1-directed, 
		 * 2-undirected, 3-mixed
		 */		
		for ( var i = 1; i < 4; i++ ) {
			
			it('should not leave any nodes with a counter of -1 (unvisited)', () => {
				var result = {},
						count = 0;
								
				callbacks = {};			
				$DFS.prepareStandardDFSCBs(result, callbacks, count);				
				$DFS.DFS(graph, callbacks, i);
				
				expect(Object.keys(result).length).to.equal(7);
				// checking that all the counters have been increased
				// and are therefore at 7 also
				for ( var node_id in result ) {
					expect(result[node_id].counter).not.to.equal(-1);
				}
			});
			
			
			it('should not leave any nodes without a parent (even if self)', () => {
				var result = {},
						count = 0;
						
				callbacks = {};
				$DFS.prepareStandardDFSCBs(result, callbacks, count);				
				$DFS.DFS(graph, callbacks, i);
				
				expect(Object.keys(result).length).to.equal(7);
				for ( var node_id in result ) {
					expect(result[node_id].parent).not.to.be.null;
				}
			});
		
		}
		
	});	
	

	
	
	
		
});
