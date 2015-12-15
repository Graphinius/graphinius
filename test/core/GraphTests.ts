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
	var graph 	: $G.BaseGraph,
			node_a 	: $N.IBaseNode,
			node_b 	: $N.IBaseNode,
			edge_1	: $E.IBaseEdge,
			edge_2	: $E.IBaseEdge,
			stats		: $G.GraphStats;
	
	describe('Basic graph instantiation and mode handling', () => {
	
		it('should correctly instantiate a graph with GraphMode INIT (no edges added)', () => {
			graph = new Graph('Test graph');
			expect(graph.getMode()).to.equal($G.GraphMode.INIT);
		});
		
		it('should correctly add a node', () => {
			stats = graph.getStats();
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
		it('should correctly add an undirected edge between two nodes', () => {
			node_b = graph.addNode('B');
			edge_1 = graph.addEdge('und_a_b', node_a, node_b); // undirected edge	
			expect(edge_1.isDirected()).to.be.false;
			expect(node_a.inDegree()).to.equal(0);
			expect(node_a.outDegree()).to.equal(0);
			expect(node_a.degree()).to.equal(1);
			expect(node_b.inDegree()).to.equal(0);
			expect(node_b.outDegree()).to.equal(0);
			expect(node_b.degree()).to.equal(1);
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(2);
			expect(stats.nr_dir_edges).to.equal(0);
			expect(stats.nr_und_edges).to.equal(1);
			expect(graph.getMode()).to.equal($G.GraphMode.UNDIRECTED);
		});
		
		
		/**
		 * edge has to be directed
		 * node_a has in_degree 0, out_degree 1, degree 1
		 * node_b has in_degree 1, out_degree 0, degree 1
		 * graph has 2 nodes, 1 undirected edge, 1 directed edge
		 * graph is in DIRECTED mode
		 */
		it('should correctly add a directed edge between two nodes', () => {
			graph = new Graph('Test graph');
			node_a = graph.addNode('A');
			node_b = graph.addNode('B');
			edge_1 = graph.addEdge('dir_a_b', node_a, node_b, {directed: true});
			expect(edge_1.isDirected()).to.be.true;
			expect(node_a.inDegree()).to.equal(0);
			expect(node_a.outDegree()).to.equal(1);
			expect(node_a.degree()).to.equal(0);
			expect(node_b.inDegree()).to.equal(1);
			expect(node_b.outDegree()).to.equal(0);
			expect(node_b.degree()).to.equal(0);
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(2);
			expect(stats.nr_dir_edges).to.equal(1);
			expect(stats.nr_und_edges).to.equal(0);
			expect(graph.getMode()).to.equal($G.GraphMode.DIRECTED);
		});
		
		
		/**
		 * edge has to be undirected and a loop
		 * node_a has in_degree 0, out_degree 0, degree 1
		 * graph has 1 node, 1 undirected edge
		 * graph is in UNDIRECTED mode
		 */
		it('should correctly add an undirected loop', () => {
			graph = new Graph('Test graph');
			node_a = graph.addNode('A');
			edge_1 = graph.addEdge('und_a_a', node_a, node_a, {directed: false});
			expect(edge_1.isDirected()).to.be.false;
			expect(node_a.inDegree()).to.equal(0);
			expect(node_a.outDegree()).to.equal(0);
			expect(node_a.degree()).to.equal(1);
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(1);
			expect(stats.nr_dir_edges).to.equal(0);
			expect(stats.nr_und_edges).to.equal(1);
			expect(graph.getMode()).to.equal($G.GraphMode.UNDIRECTED);
		});
		
		
		/**
		 * edge has to be directed and a loop
		 * node_a has in_degree 1, out_degree 1, degree 0
		 * graph has 1 node, 1 directed edge
		 * graph is in DIRECTED mode
		 */
		it('should correctly add a directed loop', () => {
			graph = new Graph('Test graph');
			node_a = graph.addNode('A');
			edge_1 = graph.addEdge('und_a_a', node_a, node_a, {directed: true});
			expect(edge_1.isDirected()).to.be.true;
			expect(node_a.inDegree()).to.equal(1);
			expect(node_a.outDegree()).to.equal(1);
			expect(node_a.degree()).to.equal(0);
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(1);
			expect(stats.nr_dir_edges).to.equal(1);
			expect(stats.nr_und_edges).to.equal(0);
			expect(graph.getMode()).to.equal($G.GraphMode.DIRECTED);
		});
		
		
		/**
		 * MIXED MODE GRAPH
		 * edge_1 is undirected and goes from a to b
		 * edge_2 is directed and a loop from b to b
		 * node_a has in_degree 0, out_degree 0, degree 1
		 * node_b has in_degree 1, out_degree 1, degree 1
		 * graph has 2 node, 1 directed edge, 1 undirected edge
		 * graph is in MIXED mode
		 */
		it('should correctly instantiate a mixed graph', () => {
			graph = new Graph('Test graph');
			node_a = graph.addNode('A');
			node_b = graph.addNode('B');
			edge_1 = graph.addEdge('und_a_b', node_a, node_b, {directed: false});
			expect(edge_1.isDirected()).to.be.false;
			edge_2 = graph.addEdge('dir_b_b', node_b, node_b, {directed: true});
			expect(edge_2.isDirected()).to.be.true;
			expect(node_a.inDegree()).to.equal(0);
			expect(node_a.outDegree()).to.equal(0);
			expect(node_a.degree()).to.equal(1);
			expect(node_b.inDegree()).to.equal(1);
			expect(node_b.outDegree()).to.equal(1);
			expect(node_b.degree()).to.equal(1);
			stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(2);
			expect(stats.nr_dir_edges).to.equal(1);
			expect(stats.nr_und_edges).to.equal(1);
			expect(graph.getMode()).to.equal($G.GraphMode.MIXED);
		});
		
		
		it('should report the existence of a node by ID', () => {
			expect(graph.hasNodeID(Number.NaN)).to.be.false;
			expect(graph.hasNodeID(99999)).to.be.false;
			expect(graph.hasNodeID(node_a.getID())).to.be.true;
		});
		
		
		it('should report the existence of a node by Label', () => {
			expect(graph.hasNodeLabel("donotexist")).to.be.false;
			expect(graph.hasNodeLabel(node_a.getLabel())).to.be.true;
		});
		
		
		it('should throw an error upon trying to retrieve a non-existing node by ID', () => {
			expect(graph.getNodeById.bind(graph, Number.NaN)).to.throw("cannot retrieve node with non-existing ID.");
		});
		
		
		it('should throw an error upon trying to retrieve a non-existing node by Label', () => {
			expect(graph.getNodeByLabel.bind(graph, "donotexist")).to.throw("cannot retrieve node with non-existing Label.");
		});
		
		
		it('should return a node by existing ID', () => {
			expect(graph.getNodeById(node_a.getID())).to.equal(node_a);
		});
		
		
		it('should return a node by existing Label', () => {
			expect(graph.getNodeByLabel(node_a.getLabel())).to.equal(node_a);
		});
		
		
		/**
		 * For all edge HAS? and GET tests:
		 * edge_1 is UNDIRECTED
		 * edge_2 is DIRECTED
		 */
		it('should report the existence of an edge by ID', () => {
			expect(graph.hasEdgeID(Number.NaN)).to.be.false;
			expect(graph.hasEdgeID(99999)).to.be.false;
			expect(edge_1.isDirected()).to.be.false;
			expect(graph.hasEdgeID(edge_1.getID())).to.be.true;
			expect(edge_2.isDirected()).to.be.true;
			expect(graph.hasEdgeID(edge_2.getID())).to.be.true;	
		});
		
		
		it('should report the existence of an edge by Label', () => {
			expect(graph.hasEdgeLabel("menonexistant")).to.be.false;
			expect(edge_1.isDirected()).to.be.false;
			expect(graph.hasEdgeLabel(edge_1.getLabel())).to.be.true;
			expect(edge_2.isDirected()).to.be.true;
			expect(graph.hasEdgeLabel(edge_2.getLabel())).to.be.true;	
		});
		
		
		it('should throw an error upon trying to retrieve a non-existing edge by ID', () => {
			expect(graph.getEdgeById.bind(graph, Number.NaN)).to.throw("cannot retrieve edge with non-existing ID.");
		});
		
		
		it('should throw an error upon trying to retrieve a non-existing edge by Label', () => {
			expect(graph.getEdgeByLabel.bind(graph, "menonexistant")).to.throw("cannot retrieve edge with non-existing Label.");
		});
			
		
		it('should return an edge by ID', () => {
			expect(graph.getEdgeById(edge_1.getID())).to.equal(edge_1);
			expect(graph.getEdgeById(edge_2.getID())).to.equal(edge_2);
		});
		
		
		it('should return an edge by Label', () => {
			expect(graph.getEdgeByLabel(edge_1.getLabel())).to.equal(edge_1);
			expect(graph.getEdgeByLabel(edge_2.getLabel())).to.equal(edge_2);
		});		
		
		
		/**
		 * DELETE directed edge => UNDIRECTED graph
		 * edge_a is undirected
		 * node_a has in_degree 0, out_degree 0, degree 1
		 * node_b has in_degree 0, out_degree 0, degree 1
		 * graph has 2 node, 1 undirected edge
		 * graph is in UNDIRECTED mode
		 */
		it('should delete an existing directed edge, changing the graph back to UNDIRECTED mode', () => {
			
		});
		
		
		/**
		 * DELETE undirected edge => DIRECTED graph
		 * edge_1 is directed
		 * node_a has in_degree 1, out_degree 0, degree 0
		 * node_b has in_degree 0, out_degree 1, degree 0
		 * graph has 2 node, 1 directed edge
		 * graph is in DIRECTED mode
		 */
		it('should delete an existing undirected edge, changing the graph back to DIRECTED mode', () => {
			
		});
		
		
		/**
		 * Node deletion WITHOUT edges
		 */
		it('should correctly delete an unconnected node', () => {
			
		});
		
		
		/**
		 * Node deletion WITH edges
		 */
		it('should throw an error when trying to delete a connected node', () => {
			
		});
		
		
		/**
		 * Node edge deletion => outgoing edges
		 */
		it('should allow to delete all outgoing edges of a node', () => {
			
		});
		
		
		/**
		 * Node edge deletion => incoming edges
		 */
		it('should allow to delete all incoming edges of a node', () => {
			
		});
		
		
		/**
		 * Node edge deletion => undirected edges
		 */
		it('should allow to delete all undirected edges of a node', () => {
			
		});
		
		
		/**
		 * Node edge deletion => all edges
		 */
		it('should allow to completely disconnect a node', () => {
			
		});
		
		
		//==========================================================
		/**
		 * Compacting edges
		 */
		it('should combine the above functionality to do edge compaction', () => {
			
		});
		
		
	});
	
});