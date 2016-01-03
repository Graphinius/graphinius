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
			search_res		: {[id: string] : $DFS.DFS_Result};
	
	
	describe('DFS on small test graph', () => {
		
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
			search_res = $DFS.DFS(graph, root);
						
			expect(Object.keys(search_res).length).to.equal(7);
			
			// console.dir(search_res);
			
			// undirected before directed...
			// shall we sort those nodes by id first?? 
			// nope......			
			expect(search_res['A'].counter).to.equal(0);
			expect(search_res['B'].counter).to.equal(5);
			expect(search_res['C'].counter).to.equal(4);
			expect(search_res['D'].counter).to.equal(1);
			expect(search_res['E'].counter).to.equal(2);
			expect(search_res['F'].counter).to.equal(3);
			expect(search_res['G'].counter).to.equal(-1);
			
			expect(search_res['A'].parent).to.equal(root);
			expect(search_res['B'].parent).to.equal(root);
			expect(search_res['C'].parent).to.equal(root);
			expect(search_res['D'].parent).to.equal(root);
			expect(search_res['E'].parent).to.equal(graph.getNodeById('D'));
			expect(search_res['F'].parent).to.equal(graph.getNodeById('E'));
			expect(search_res['G'].parent).to.equal(null);
		});
		
		
		it('should correctly compute distances from node D', () => {
			var root = graph.getNodeById('D');
			search_res = $DFS.DFS(graph, root);
						
			expect(Object.keys(search_res).length).to.equal(7);
			
			expect(search_res['A'].counter).to.equal(1);
			expect(search_res['B'].counter).to.equal(4);
			expect(search_res['C'].counter).to.equal(3);
			expect(search_res['D'].counter).to.equal(0);
			expect(search_res['E'].counter).to.equal(5);
			expect(search_res['F'].counter).to.equal(2);
			expect(search_res['G'].counter).to.equal(-1);
			
			expect(search_res['A'].parent).to.equal(root);
			expect(search_res['B'].parent).to.equal(graph.getNodeById('A'));
			expect(search_res['C'].parent).to.equal(graph.getNodeById('A'));
			expect(search_res['D'].parent).to.equal(root);
			expect(search_res['E'].parent).to.equal(root);
			expect(search_res['F'].parent).to.equal(graph.getNodeById('A'));
			expect(search_res['G'].parent).to.equal(null);
		});
		
		it('should correctly compute distances from node E', () => {
			var root = graph.getNodeById('E');
			search_res = $DFS.DFS(graph, root);
						
			expect(Object.keys(search_res).length).to.equal(7);
			
			expect(search_res['A'].counter).to.equal(-1);
			expect(search_res['B'].counter).to.equal(-1);
			expect(search_res['C'].counter).to.equal(-1);
			expect(search_res['D'].counter).to.equal(-1);
			expect(search_res['E'].counter).to.equal(0);
			expect(search_res['F'].counter).to.equal(1);
			expect(search_res['G'].counter).to.equal(-1);
			
			expect(search_res['A'].parent).to.equal(null);
			expect(search_res['B'].parent).to.equal(null);
			expect(search_res['C'].parent).to.equal(null);
			expect(search_res['D'].parent).to.equal(null);
			expect(search_res['E'].parent).to.equal(root);
			expect(search_res['F'].parent).to.equal(root);
			expect(search_res['G'].parent).to.equal(null);
		});
		
		it('should correctly compute distances from node G', () => {
			var root = graph.getNodeById('G');
			search_res = $DFS.DFS(graph, root);
						
			expect(Object.keys(search_res).length).to.equal(7);
			
			expect(search_res['A'].counter).to.equal(-1);
			expect(search_res['B'].counter).to.equal(-1);
			expect(search_res['C'].counter).to.equal(-1);
			expect(search_res['D'].counter).to.equal(-1);
			expect(search_res['E'].counter).to.equal(-1);
			expect(search_res['F'].counter).to.equal(-1);
			expect(search_res['G'].counter).to.equal(0);
			
			expect(search_res['A'].parent).to.equal(null);
			expect(search_res['B'].parent).to.equal(null);
			expect(search_res['C'].parent).to.equal(null);
			expect(search_res['D'].parent).to.equal(null);
			expect(search_res['E'].parent).to.equal(null);
			expect(search_res['F'].parent).to.equal(null);
			expect(search_res['G'].parent).to.equal(root);
		});
		
	});
	
});