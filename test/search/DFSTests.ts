/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/input/JSONInput';
import * as $DFS from '../../src/search/DFS';

var expect 	= chai.expect;
var Node 		= $N.BaseNode;
var Edge 		= $E.BaseEdge;
var Graph 	= $G.BaseGraph;
var JSON_IN	= $I.JSONInput;


describe('Basic GRAPH SEARCH Tests - Depth first search -', () => {
	
	var json 					: $I.IJSONInput,
			input_file		: string,
			graph					: $G.IGraph,
			stats					: $G.GraphStats,
			// vis_result		: {[id: string] : $DFS.DFS_Result_Entry},
			// dfs_result		: {[id: string] : $DFS.DFS_Result_Entry},
			callbacks			: $DFS.DFS_Callbacks;
	
	
	describe('testing callback execution', () => {
		
		it('should properly execute the different callback stages', () => {
			
		});
		
	});
	
	// describe('testing DFS visit on small test graph', () => {
		
	// 	it('should correctly instantiate the search graph', () => {
	// 		json = new JSON_IN();
	// 		input_file = "./test/input/test_data/search_graph.json";
	// 		graph = json.readFromJSONFile(input_file);
	// 		stats = graph.getStats();
	// 		expect(stats.nr_nodes).to.equal(7);
	// 		expect(stats.nr_dir_edges).to.equal(7);
	// 		expect(stats.nr_und_edges).to.equal(2);
	// 	})
				
	// 	it('should correctly compute distances from node A', () => {
	// 		var root = graph.getNodeById('A');
			
	// 		var result = {};
	// 		var count = 0;
	// 		var counter = function() { return count++; };			
	// 		callbacks = {
	// 			init_dfs_visit : [],
	// 			node_unmarked  : []
	// 		};
			
	// 		var initDFSVisit = function( context ) {
	// 			console.dir(context);
	// 			result[context.current_root.getID()] = {
	// 				parent 	: context.current_root
	// 			};
	// 		};
	// 		callbacks.init_dfs_visit.push(initDFSVisit);
						
	// 		var setResultEntry = function( context ) {
	// 			result[context.current.getID()] = {
	// 				parent 	: context.stack_entry.parent,
	// 				counter : counter()
	// 			};
	// 		};
	// 		callbacks.node_unmarked.push(setResultEntry);			
			
	// 		$DFS.DFSVisit(graph, root, callbacks);
						
	// 		expect(Object.keys(result).length).to.equal(6);
			
	// 		// console.dir(visit_res);
			
	// 		// undirected before directed...
	// 		// shall we sort those nodes by id first??
	// 		expect(result['A'].counter).to.equal(0);
	// 		expect(result['B'].counter).to.equal(5);
	// 		expect(result['C'].counter).to.equal(4);
	// 		expect(result['D'].counter).to.equal(1);
	// 		expect(result['E'].counter).to.equal(2);
	// 		expect(result['F'].counter).to.equal(3);
			
	// 		expect(result['A'].parent).to.equal(root);
	// 		expect(result['B'].parent).to.equal(root);
	// 		expect(result['C'].parent).to.equal(root);
	// 		expect(result['D'].parent).to.equal(root);
	// 		expect(result['E'].parent).to.equal(graph.getNodeById('D'));
	// 		expect(result['F'].parent).to.equal(graph.getNodeById('E'));
	// 	});
		
		
	// 	it('should correctly compute distances from node D', () => {
	// 		var root = graph.getNodeById('D');
			
	// 		var counter = 0;
	// 		callbacks = {
	// 			counter : function() { return counter++; }
	// 		};
	// 		vis_result = {};
	// 		$DFS.DFSVisit(graph, root, vis_result, callbacks);
						
	// 		expect(Object.keys(vis_result).length).to.equal(6);
			
	// 		expect(vis_result['A'].counter).to.equal(1);
	// 		expect(vis_result['B'].counter).to.equal(4);
	// 		expect(vis_result['C'].counter).to.equal(3);
	// 		expect(vis_result['D'].counter).to.equal(0);
	// 		expect(vis_result['E'].counter).to.equal(5);
	// 		expect(vis_result['F'].counter).to.equal(2);
			
	// 		expect(vis_result['A'].parent).to.equal(root);
	// 		expect(vis_result['B'].parent).to.equal(graph.getNodeById('A'));
	// 		expect(vis_result['C'].parent).to.equal(graph.getNodeById('A'));
	// 		expect(vis_result['D'].parent).to.equal(root);
	// 		expect(vis_result['E'].parent).to.equal(root);
	// 		expect(vis_result['F'].parent).to.equal(graph.getNodeById('A'));
	// 	});
		
		
	// 	it('should correctly compute distances from node E', () => {
	// 		var root = graph.getNodeById('E');
			
	// 		var counter = 0;
	// 		callbacks = {
	// 			counter : function() { return counter++; }
	// 		};
	// 		vis_result = {};
	// 		$DFS.DFSVisit(graph, root, vis_result, callbacks);
						
	// 		expect(Object.keys(vis_result).length).to.equal(2);			
	// 		expect(vis_result['E'].counter).to.equal(0);
	// 		expect(vis_result['F'].counter).to.equal(1);
			
	// 		expect(vis_result['E'].parent).to.equal(root);
	// 		expect(vis_result['F'].parent).to.equal(root);
	// 	});
		
		
	// 	it('should correctly compute distances from node G', () => {
	// 		var root = graph.getNodeById('G');
			
	// 		var counter = 0;
	// 		callbacks = {
	// 			counter : function() { return counter++; }
	// 		};
	// 		vis_result = {};
			
	// 		$DFS.DFSVisit(graph, root, vis_result, callbacks);
			
	// 		expect(Object.keys(vis_result).length).to.equal(1);			
	// 		expect(vis_result['G'].counter).to.equal(0);			
	// 		expect(vis_result['G'].parent).to.equal(root);
	// 	});
		
	// });
	
	
	
	// describe('testing DFS on small test graph (including unconnected component)', () => {
		
	// 	it('should not leave any nodes with a counter of -1 (unvisited)', () => {
	// 		var counter = 0;
	// 		dfs_result = {};
	// 		callbacks = {
	// 			counter : function() { return counter++; },
	// 			init : function(nodes : {[id:string] : $N.IBaseNode}) {
	// 				for ( var node_id in nodes ) {
	// 					dfs_result[node_id] = {
	// 						parent: null,
	// 						counter: -1
	// 					}
	// 				}
	// 			}
	// 		};
				
	// 		$DFS.DFS(graph, dfs_result, callbacks);
			
	// 		expect(Object.keys(dfs_result).length).to.equal(7);
	// 		expect(counter).to.equal(7);
	// 		for ( var node_id in dfs_result ) {
	// 			expect(dfs_result[node_id].counter).not.to.equal(-1);
	// 		}
	// 	});
		
		
	// 	it('should not leave any nodes without a parent (even if self)', () => {
	// 		var counter = 0;
	// 		dfs_result = {};
	// 		callbacks = {
	// 			counter : function() { return counter++; },
	// 			init : function(nodes : {[id:string] : $N.IBaseNode}) {
	// 				for ( var node_id in nodes ) {
	// 					dfs_result[node_id] = {
	// 						parent: null,
	// 						counter: -1
	// 					}
	// 				}
	// 			}
	// 		};
			
	// 		$DFS.DFS(graph, dfs_result, callbacks);
			
	// 		expect(Object.keys(dfs_result).length).to.equal(7);
	// 		expect(counter).to.equal(7);
	// 		for ( var node_id in dfs_result ) {
	// 			expect(dfs_result[node_id].parent).not.to.be.null;
	// 		}
	// 	});
		
	});
	
});