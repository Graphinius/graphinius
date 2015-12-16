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
		
	});
		
	
	describe('finding nodes and edges by ID and Label', () => {
		
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
			expect(graph.getNodeById(node_b.getID())).to.equal(node_b);
		});
		
		
		it('should return a node by existing Label', () => {
			expect(graph.getNodeByLabel(node_a.getLabel())).to.equal(node_a);
			expect(graph.getNodeByLabel(node_b.getLabel())).to.equal(node_b);
		});
		
		
		it('should report the number of nodes currently in the graph', () => {
			expect(graph.nrNodes()).to.equal(2);
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
		
		
		it('should report the number of directed edges currently in the graph', () => {
			expect(graph.nrDirEdges()).to.equal(1);
		});
		
		
		it('should report the number of edges currently in the graph', () => {
			expect(graph.nrUndEdges()).to.equal(1);
		});
		
		
		// it('should report the number of edges currently in the graph', () => {
		// 	expect(graph.nrEdges()).to.equal(2);
		// });
		
		
		it('should give you a random node currently existing in the graph', () => {
			var rand_node = graph.getRandomNode();
			expect(rand_node).to.be.an.instanceof(Node);
			expect(graph.hasNodeID(rand_node.getID())).to.be.true;
		});
		
		
		it('should give you a random directed edge currently existing in the graph', () => {
			var rand_dir_edge = graph.getRandomDirEdge();
			expect(rand_dir_edge.isDirected()).to.be.true;
			expect(rand_dir_edge).to.be.an.instanceof(Edge);
			expect(graph.hasEdgeID(rand_dir_edge.getID())).to.be.true;
		});
		
		
		it('should give you a random undirected edge currently existing in the graph', () => {
			var rand_und_edge = graph.getRandomUndEdge();
			expect(rand_und_edge.isDirected()).to.be.false;
			expect(rand_und_edge).to.be.an.instanceof(Edge);
			expect(graph.hasEdgeID(rand_und_edge.getID())).to.be.true;
		});		
		
	});
		
		
	describe('edge and node deletion scenarios', () => {
		
		var graph,
				n_a,
				n_b,
				n_c,
				n_d,
				e_1,
				e_2,
				e_3,
				e_4,
				e_5,
				e_6,
				e_7;
		
		beforeEach('instantiate a 4-node and 7-edge scenario', () => {
			graph = new Graph('Edge and node deletion test graph');
			n_a = graph.addNode('A');
			n_b = graph.addNode('B');
			n_c = graph.addNode('C');
			n_d = graph.addNode('D');
			e_1 = graph.addEdge('1', n_a, n_b);
			e_2 = graph.addEdge('2', n_a, n_c);
			e_3 = graph.addEdge('3', n_a, n_a, {directed: true});
			e_4 = graph.addEdge('4', n_a, n_b, {directed: true});
			e_5 = graph.addEdge('5', n_a, n_d, {directed: true});
			e_6 = graph.addEdge('6', n_c, n_a, {directed: true});
			e_7 = graph.addEdge('7', n_d, n_a, {directed: true});
			
			expect(graph.nrNodes()).to.equal(4);
			// expect(graph.nrEdges()).to.equal(7);
			expect(graph.nrDirEdges()).to.equal(5);
			expect(graph.nrUndEdges()).to.equal(2);
			expect(graph.getMode()).to.equal($G.GraphMode.MIXED);
		});
		
		
		it('should throw an error when trying to remove a non-existing edge', () => {
			var loose_edge = new Edge(Number.MAX_VALUE, 'BLAHOO', n_a, n_b);
			expect(graph.removeEdge.bind(graph, loose_edge)).to.throw('cannot remove non-existing edge.');
		});
		
		
		/**
		 * delete UNDIRECTED edge
		 * e_1 is deleted
		 * n_a has degree of one less than before
		 * n_a inDegree and outDegree stay the same
		 * n_b has degree of one less than before
		 * n_b inDegree and outDegree stay the same
		 * graph still has 4 nodes
		 * graph has same number of directed edges
		 * graph has one less undirected edge
		 */
		it('should remove an existing undirected edge, updating graph and node stats', () => {
			var graph_nr_nodes = graph.nrNodes(),
				graph_nr_dir_edges = graph.nrDirEdges(),
				graph_nr_und_edges = graph.nrUndEdges(),
				n_a_deg = n_a.degree(),
				n_a_in_deg = n_a.inDegree(),
				n_a_out_deg = n_a.outDegree(),
				n_b_deg = n_b.degree(),
				n_b_in_deg = n_b.inDegree(),
				n_b_out_deg = n_b.outDegree();
			
			graph.removeEdge(e_1);
			
			expect(graph.nrNodes()).to.equal(graph_nr_nodes);
			expect(graph.nrDirEdges()).to.equal(graph_nr_dir_edges);
			expect(graph.nrUndEdges()).to.equal(graph_nr_und_edges - 1);
			expect(n_a.degree()).to.equal(n_a_deg - 1);
			expect(n_a.outDegree()).to.equal(n_a_out_deg);
			expect(n_a.inDegree()).to.equal(n_a_in_deg);
			expect(n_b.degree()).to.equal(n_b_deg - 1);
			expect(n_b.outDegree()).to.equal(n_b_out_deg);
			expect(n_b.inDegree()).to.equal(n_b_in_deg);	
		});
		
		
		/**
		 * delete DIRECTED edge
		 * e_4 (A->B) is deleted
		 * n_a has outDegree of one less than before
		 * n_a inDegree and degree stay the same
		 * n_b has inDegree of one less than before
		 * n_b outDegree and degree stay the same
		 * graph still has 4 nodes
		 * graph has same number of undirected edges
		 * graph has one less directed edge
		 */
		it('should remove an existing directed edge, updating graph and node stats', () => {
			var graph_nr_nodes = graph.nrNodes(),
				graph_nr_dir_edges = graph.nrDirEdges(),
				graph_nr_und_edges = graph.nrUndEdges(),
				n_a_deg = n_a.degree(),
				n_a_in_deg = n_a.inDegree(),
				n_a_out_deg = n_a.outDegree(),
				n_b_deg = n_b.degree(),
				n_b_in_deg = n_b.inDegree(),
				n_b_out_deg = n_b.outDegree();
			
			graph.removeEdge(e_4);
			
			expect(graph.nrNodes()).to.equal(graph_nr_nodes);
			expect(graph.nrDirEdges()).to.equal(graph_nr_dir_edges - 1);
			expect(graph.nrUndEdges()).to.equal(graph_nr_und_edges);
			expect(n_a.outDegree()).to.equal(n_a_out_deg - 1);
			expect(n_a.inDegree()).to.equal(n_a_in_deg);
			expect(n_a.degree()).to.equal(n_a_deg);
			expect(n_b.outDegree()).to.equal(n_b_out_deg);
			expect(n_b.inDegree()).to.equal(n_b_in_deg - 1);			
			expect(n_b.degree()).to.equal(n_b_deg);
		});

		
		
		/**
		 * Node deletion of non-existing node
		 */
		it('should throw an error when trying to remove a non-existing node', () => {
			
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
		// it('should combine the above functionality to do edge compaction', () => {
			
		// });
		
	});
	
});