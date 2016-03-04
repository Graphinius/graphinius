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
			search_res		: {[id: string] : $BFS.BFSResult};
	
	
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
			search_res = $BFS.BFS(graph, root);
						
			expect(Object.keys(search_res).length).to.equal(7);
			
			// undirected before directed...
			// shall we sort those nodes by id first?? 
			// nope......
			expect(search_res['A'].counter).to.equal(0);
			expect(search_res['B'].counter).to.equal(1);
			expect(search_res['C'].counter).to.equal(2);
			expect(search_res['D'].counter).to.equal(4);
			expect(search_res['E'].counter).to.equal(5);
			expect(search_res['F'].counter).to.equal(3);
			expect(search_res['G'].counter).to.equal(-1);
			
			expect(search_res['A'].distance).to.equal(0);
			expect(search_res['A'].parent).to.equal(root);
			expect(search_res['B'].distance).to.equal(1);
			expect(search_res['B'].parent).to.equal(root);
			expect(search_res['C'].distance).to.equal(1);
			expect(search_res['C'].parent).to.equal(root);
			expect(search_res['D'].distance).to.equal(1);
			expect(search_res['D'].parent).to.equal(root);
			expect(search_res['E'].distance).to.equal(2);
			expect(search_res['E'].parent).to.equal(graph.getNodeById('D'));
			expect(search_res['F'].distance).to.equal(1);
			expect(search_res['F'].parent).to.equal(root);
			expect(search_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['G'].parent).to.equal(null);
		});
		
		it('should correctly compute distances from node D', () => {
			var root = graph.getNodeById('D');
			search_res = $BFS.BFS(graph, root);
			
			expect(Object.keys(search_res).length).to.equal(7);
			
			expect(search_res['A'].counter).to.equal(2);
			expect(search_res['B'].counter).to.equal(4);
			expect(search_res['C'].counter).to.equal(5);
			expect(search_res['D'].counter).to.equal(0);
			expect(search_res['E'].counter).to.equal(1);
			expect(search_res['F'].counter).to.equal(3);
			expect(search_res['G'].counter).to.equal(-1);
			
			expect(search_res['A'].distance).to.equal(1);
			expect(search_res['A'].parent).to.equal(root);
			expect(search_res['B'].distance).to.equal(2);
			expect(search_res['B'].parent).to.equal(graph.getNodeById('A'));
			expect(search_res['C'].distance).to.equal(2);
			expect(search_res['C'].parent).to.equal(graph.getNodeById('A'));
			expect(search_res['D'].distance).to.equal(0);
			expect(search_res['D'].parent).to.equal(root);
			expect(search_res['E'].distance).to.equal(1);
			expect(search_res['E'].parent).to.equal(root);
			expect(search_res['F'].distance).to.equal(2);
			expect(search_res['F'].parent).to.equal(graph.getNodeById('E'));
			expect(search_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['G'].parent).to.equal(null);
		});
		
		it('should correctly compute distances from node E', () => {
			var root = graph.getNodeById('E');
			search_res = $BFS.BFS(graph, root);
			
			expect(Object.keys(search_res).length).to.equal(7);
			
			expect(search_res['A'].counter).to.equal(-1);
			expect(search_res['B'].counter).to.equal(-1);
			expect(search_res['C'].counter).to.equal(-1);
			expect(search_res['D'].counter).to.equal(-1);
			expect(search_res['E'].counter).to.equal(0);
			expect(search_res['F'].counter).to.equal(1);
			expect(search_res['G'].counter).to.equal(-1);
			
			expect(search_res['A'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['A'].parent).to.equal(null);
			expect(search_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['B'].parent).to.equal(null);
			expect(search_res['C'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['C'].parent).to.equal(null);
			expect(search_res['D'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['D'].parent).to.equal(null);
			expect(search_res['E'].distance).to.equal(0);
			expect(search_res['E'].parent).to.equal(root);
			expect(search_res['F'].distance).to.equal(1);
			expect(search_res['F'].parent).to.equal(root);
			expect(search_res['G'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['G'].parent).to.equal(null);
		});
		
		it('should correctly compute distances from node G', () => {
			var root = graph.getNodeById('G');
			search_res = $BFS.BFS(graph, root);
			
			expect(Object.keys(search_res).length).to.equal(7);
			
			expect(search_res['A'].counter).to.equal(-1);
			expect(search_res['B'].counter).to.equal(-1);
			expect(search_res['C'].counter).to.equal(-1);
			expect(search_res['D'].counter).to.equal(-1);
			expect(search_res['E'].counter).to.equal(-1);
			expect(search_res['F'].counter).to.equal(-1);
			expect(search_res['G'].counter).to.equal(0);
			
			expect(search_res['A'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['A'].parent).to.equal(null);
			expect(search_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['B'].parent).to.equal(null);
			expect(search_res['C'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['C'].parent).to.equal(null);
			expect(search_res['D'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['D'].parent).to.equal(null);
			expect(search_res['E'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['E'].parent).to.equal(null);
			expect(search_res['F'].distance).to.equal(Number.POSITIVE_INFINITY);
			expect(search_res['F'].parent).to.equal(null);
			expect(search_res['G'].distance).to.equal(0);
			expect(search_res['G'].parent).to.equal(root);
		});
		
	});
	
});