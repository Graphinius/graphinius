/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';

var expect = chai.expect;
var Node = $N.BaseNode;
var Edge = $E.BaseEdge;
var Graph = $G.BaseGraph;


describe('GRAPH TESTS: ', () => {
	var graph : $G.BaseGraph,
			node_a : $N.IBaseNode,
			node_b : $N.IBaseNode;
	
	describe('Basic graph instantiation and mode handling', () => {
	
		it('should correctly instantiate a graph with GraphMode INIT (no edges added)', () => {
			graph = new Graph('Test graph');
			expect(graph.getMode()).to.equal($G.GraphMode.INIT);
		});
		
		it('should correctly add a node', () => {
			var stats : $G.GraphStats = graph.getStats();
			expect(stats.nr_nodes).to.equal(0);
			node_a = graph.addNode('A');
			expect(node_a).to.be.an.instanceof(Node);
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(1);
		});
		
		
		/**
		 * edge has to be undirected
		 * node_a has in_degree 0, out_degree 0, degree 1
		 * node_b has in_degree 0, out_degree 0, degree 1
		 * graph has 2 nodes, 1 undirected edge
		 * graph is in UNDIRECTED mode
		 */
		it('should correctly add an edge between two nodes', () => {
			var node_b = graph.addNode('B');
			var edge = graph.addUndEdge('1', node_a, node_b); // undirected edge	
			expect(edge.isDirected()).to.be.false;
			expect(node_a.inDegree()).to.equal(0);
			expect(node_a.outDegree()).to.equal(0);
			expect(node_a.degree()).to.equal(1);
			expect(node_b.inDegree()).to.equal(0);
			expect(node_b.outDegree()).to.equal(0);
			expect(node_b.degree()).to.equal(1);
			var stats : $G.GraphStats = graph.getStats();
			expect(stats.nr_nodes).to.equal(2);
			expect(stats.nr_dir_edges).to.equal(0);
			expect(stats.nr_und_edges).to.equal(1);
			expect(graph.getMode()).to.equal($G.GraphMode.UNDIRECTED);
		});
		
		
		/**
		 * edge has to be undirected
		 * node_a has in_degree 0, out_degree 0, degree 1
		 * node_b has in_degree 0, out_degree 0, degree 1
		 * graph has 2 nodes, 1 undirected edge
		 * graph is in UNDIRECTED mode
		 */
		// it('should correctly add an edge between two nodes', () => {
		// 	var edge = graph.addDirEdge('2', node_b, node_b); // undirected edge	
		// 	expect(edge.isDirected()).to.be.false;
		// 	expect(node_a.inDegree()).to.equal(0);
		// 	expect(node_a.outDegree()).to.equal(0);
		// 	expect(node_a.degree()).to.equal(1);
		// 	expect(node_b.inDegree()).to.equal(0);
		// 	expect(node_b.outDegree()).to.equal(0);
		// 	expect(node_b.degree()).to.equal(1);
		// 	var stats : $G.GraphStats = graph.getStats();
		// 	expect(stats.nr_nodes).to.equal(2);
		// 	expect(stats.nr_dir_edges).to.equal(0);
		// 	expect(stats.nr_und_edges).to.equal(1);
		// 	expect(graph.getMode()).to.equal($G.GraphMode.UNDIRECTED);
		// });
				
		
	});
	
});