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
	
	
	describe('BFS on small test graph', () => {
		
		it('should correctly instantiate the search graph', () => {
			json = new JSON_IN();
			graph = json.readFromJSONFile(search_graph);
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(7);
			expect(stats.nr_dir_edges).to.equal(7);
			expect(stats.nr_und_edges).to.equal(2);
		});
				
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
	
});