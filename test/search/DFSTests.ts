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
			visit_res			: {[id: string] : $DFS.DFS_Result_Entry},
			dfs_result		: {[id: string] : $DFS.DFS_Result_Entry},
			callbacks			: $DFS.DFS_Callbacks;
	
	
	describe('testing DFS visit on small test graph', () => {
		
		it('should correctly instantiate the search graph', () => {
			json = new JSON_IN();
			input_file = "./test/input/test_data/search_graph.json";
			graph = json.readFromJSONFile(input_file);
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(7);
			expect(stats.nr_dir_edges).to.equal(7);
			expect(stats.nr_und_edges).to.equal(2);
		})
				
		it('should correctly compute distances from node A', () => {
			var root = graph.getNodeById('A');
			var counter = 0;
			callbacks = {
				counter : function() { return counter++; }
			};
			visit_res = {};
			$DFS.DFSVisit(graph, root, visit_res, callbacks);
						
			expect(Object.keys(visit_res).length).to.equal(6);
			
			// console.dir(visit_res);
			
			// undirected before directed...
			// shall we sort those nodes by id first??
			expect(visit_res['A'].counter).to.equal(0);
			expect(visit_res['B'].counter).to.equal(5);
			expect(visit_res['C'].counter).to.equal(4);
			expect(visit_res['D'].counter).to.equal(1);
			expect(visit_res['E'].counter).to.equal(2);
			expect(visit_res['F'].counter).to.equal(3);
			
			expect(visit_res['A'].parent).to.equal(root);
			expect(visit_res['B'].parent).to.equal(root);
			expect(visit_res['C'].parent).to.equal(root);
			expect(visit_res['D'].parent).to.equal(root);
			expect(visit_res['E'].parent).to.equal(graph.getNodeById('D'));
			expect(visit_res['F'].parent).to.equal(graph.getNodeById('E'));
		});
		
		
		it('should correctly compute distances from node D', () => {
			var root = graph.getNodeById('D');
			
			var counter = 0;
			callbacks = {
				counter : function() { return counter++; }
			};
			visit_res = {};
			$DFS.DFSVisit(graph, root, visit_res, callbacks);
						
			expect(Object.keys(visit_res).length).to.equal(6);
			
			expect(visit_res['A'].counter).to.equal(1);
			expect(visit_res['B'].counter).to.equal(4);
			expect(visit_res['C'].counter).to.equal(3);
			expect(visit_res['D'].counter).to.equal(0);
			expect(visit_res['E'].counter).to.equal(5);
			expect(visit_res['F'].counter).to.equal(2);
			
			expect(visit_res['A'].parent).to.equal(root);
			expect(visit_res['B'].parent).to.equal(graph.getNodeById('A'));
			expect(visit_res['C'].parent).to.equal(graph.getNodeById('A'));
			expect(visit_res['D'].parent).to.equal(root);
			expect(visit_res['E'].parent).to.equal(root);
			expect(visit_res['F'].parent).to.equal(graph.getNodeById('A'));
		});
		
		
		it('should correctly compute distances from node E', () => {
			var root = graph.getNodeById('E');
			
			var counter = 0;
			callbacks = {
				counter : function() { return counter++; }
			};
			visit_res = {};
			$DFS.DFSVisit(graph, root, visit_res, callbacks);
						
			expect(Object.keys(visit_res).length).to.equal(2);			
			expect(visit_res['E'].counter).to.equal(0);
			expect(visit_res['F'].counter).to.equal(1);
			
			expect(visit_res['E'].parent).to.equal(root);
			expect(visit_res['F'].parent).to.equal(root);
		});
		
		
		it('should correctly compute distances from node G', () => {
			var root = graph.getNodeById('G');
			
			var counter = 0;
			callbacks = {
				counter : function() { return counter++; }
			};
			visit_res = {};
			
			$DFS.DFSVisit(graph, root, visit_res, callbacks);
			
			expect(Object.keys(visit_res).length).to.equal(1);			
			expect(visit_res['G'].counter).to.equal(0);			
			expect(visit_res['G'].parent).to.equal(root);
		});
		
	});
	
	
	
	describe('testing DFS on small test graph (including unconnected component)', () => {
		
		it('should not leave any nodes with a counter of -1 (unvisited)', () => {
			var counter = 0;
			dfs_result = {};
			callbacks = {
				counter : function() { return counter++; },
				init : function(nodes : {[id:string] : $N.IBaseNode}) {
					for ( var node_id in nodes ) {
						dfs_result[node_id] = {
							parent: null,
							counter: -1
						}
					}
				}
			};
				
			$DFS.DFS(graph, dfs_result, callbacks);
			
			expect(Object.keys(dfs_result).length).to.equal(7);
			expect(counter).to.equal(7);
			for ( var node_id in dfs_result ) {
				expect(dfs_result[node_id].counter).not.to.equal(-1);
			}
		});
		
		
		it('should not leave any nodes without a parent (even if self)', () => {
			var counter = 0;
			dfs_result = {};
			callbacks = {
				counter : function() { return counter++; },
				init : function(nodes : {[id:string] : $N.IBaseNode}) {
					for ( var node_id in nodes ) {
						dfs_result[node_id] = {
							parent: null,
							counter: -1
						}
					}
				}
			};
			
			$DFS.DFS(graph, dfs_result, callbacks);
			
			expect(Object.keys(dfs_result).length).to.equal(7);
			expect(counter).to.equal(7);
			for ( var node_id in dfs_result ) {
				expect(dfs_result[node_id].parent).not.to.be.null;
			}
		});
		
	});
	
});