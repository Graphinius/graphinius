/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $CSV from '../../src/io/input/CSVInput';

var expect = chai.expect;
var Node = $N.BaseNode;
var Edge = $E.BaseEdge;
var Graph = $G.BaseGraph;


describe('GRAPH TESTS: ', () => {
	var graph 	: $G.IGraph,
			node_a 	: $N.IBaseNode,
			node_b 	: $N.IBaseNode,
			edge_1	: $E.IBaseEdge,
			edge_2	: $E.IBaseEdge,
			stats		: $G.GraphStats,
			csv			: $CSV.CSVInput = new $CSV.CSVInput();
	
	describe('Basic graph instantiation and _mode handling', () => {
	
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
		 * graph is in UNDIRECTED _mode
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
		 * graph is in DIRECTED _mode
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
		 * graph is in UNDIRECTED _mode
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
		 * graph is in DIRECTED _mode
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
		 * Adding edge by Node IDs
		 * Node A does not exist
		 */
		it('should refuse to add an edge if node A does not exist', () => {
			graph = new Graph('Test graph');
			expect(graph.addEdgeByNodeIDs.bind(graph, 'dontaddme', 'A', 'B')).to.throw('Cannot add edge. Node A does not exist');
		});
		
		
		/**
		 * Adding edge by Node IDs
		 * Node B does not exist
		 */
		it('should refuse to add an edge if node B does not exist', () => {
			graph = new Graph('Test graph');
			node_a = graph.addNode('A');
			expect(graph.addEdgeByNodeIDs.bind(graph, 'dontaddme', 'A', 'B')).to.throw('Cannot add edge. Node B does not exist');
		});
		
		
		/**
		 * Adding edge by Node IDs
		 * Both nodes exist
		 */
		it('should correctly add an edge to existing nodes specified by ID', () => {
			graph = new Graph('Test graph');
			node_a = graph.addNode('A');
			node_b = graph.addNode('B');
			var edge = graph.addEdgeByNodeIDs("Edgy", "A", "B");
			expect(edge).not.to.be.undefined;
			expect(edge).to.be.instanceof($E.BaseEdge);
			expect(edge.getNodes().a).to.equal(node_a);
			expect(edge.getNodes().b).to.equal(node_b);
		});
		
		
		/**
		 * MIXED MODE GRAPH
		 * edge_1 is undirected and goes from a to b
		 * edge_2 is directed and a loop from b to b
		 * node_a has in_degree 0, out_degree 0, degree 1
		 * node_b has in_degree 1, out_degree 1, degree 1
		 * graph has 2 node, 1 directed edge, 1 undirected edge
		 * graph is in MIXED _mode
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
			expect(graph.hasNodeID("IDontExistInGraph")).to.be.false;
			expect(graph.hasNodeID(node_a.getID())).to.be.true;
		});
		
		
		it('should report the existence of a node by Label', () => {
			expect(graph.hasNodeLabel("donotexist")).to.be.false;
			expect(graph.hasNodeLabel(node_a.getLabel())).to.be.true;
		});
		
		
		it('should return undefined when trying to retrieve a non-existing node by ID', () => {
			expect(graph.getNodeById("idontexist")).to.be.undefined;
		});
		
		
		it('should return undefined when trying to retrieve a non-existing node by Label', () => {
			expect(graph.getNodeByLabel("idontexist")).to.be.undefined;
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
			expect(graph.hasEdgeID("IdontExist")).to.be.false;
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
		
		
	describe('A little more complex scenario with 4 nodes and 7 edges, mixed _mode', () => {
		
		var graph,
				n_a, n_b, n_c, n_d, node_vana,
				e_1, e_2, e_3, e_4, e_5, e_6, e_7;
		
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
			
			node_vana = new Node(42, {label: 'IAmNotInGraph'});
			
			expect(graph.nrNodes()).to.equal(4);
			// expect(graph.nrEdges()).to.equal(7);
			expect(graph.nrDirEdges()).to.equal(5);
			expect(graph.nrUndEdges()).to.equal(2);
			expect(graph.getMode()).to.equal($G.GraphMode.MIXED);
		});
		
		
		it('should return the nodes list', () => {
			var nodes = graph.getNodes();
			expect(Object.keys(nodes).length).to.equal(4);
			expect(nodes[n_a.getID()]).to.equal(n_a);
			expect(nodes[n_b.getID()]).to.equal(n_b);
			expect(nodes[n_c.getID()]).to.equal(n_c);
			expect(nodes[n_d.getID()]).to.equal(n_d);
		});
		
		
		it('should return the list of undirected edges', () => {
			var edges = graph.getUndEdges();
			expect(Object.keys(edges).length).to.equal(2);
			expect(edges[e_1.getID()]).to.equal(e_1);
			expect(edges[e_2.getID()]).to.equal(e_2);
		});
		
		
		it('should return the list of directed edges', () => {
			var edges = graph.getDirEdges();
			expect(Object.keys(edges).length).to.equal(5);
			expect(edges[e_3.getID()]).to.equal(e_3);
			expect(edges[e_4.getID()]).to.equal(e_4);
			expect(edges[e_5.getID()]).to.equal(e_5);
			expect(edges[e_6.getID()]).to.equal(e_6);
			expect(edges[e_7.getID()]).to.equal(e_7);
		});
		
		
		it('should output the correct degree distribution', () => {
			var deg_dist : $G.DegreeDistribution = graph.degreeDistribution();
			expect(deg_dist.und).to.deep.equal(new Uint16Array([1, 2, 1, 0, 0, 0, 0, 0, 0]));
			expect(deg_dist.in).to.deep.equal( new Uint16Array([1, 2, 0, 1, 0, 0, 0, 0, 0]));
			expect(deg_dist.out).to.deep.equal(new Uint16Array([1, 2, 0, 1, 0, 0, 0, 0, 0]));
			expect(deg_dist.dir).to.deep.equal(new Uint16Array([0, 2, 1, 0, 0, 0, 1, 0, 0]));
			expect(deg_dist.all).to.deep.equal(new Uint16Array([0, 0, 3, 0, 0, 0, 0, 0, 1]));
		});
		
		
		it('should throw an error when trying to remove a non-existing edge', () => {
			var loose_edge = new Edge('IdontExistInGraph', n_a, n_b);
			expect(graph.deleteEdge.bind(graph, loose_edge)).to.throw('cannot remove non-existing edge.');
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
		 * graph is still in MIXED _mode
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
			
			graph.deleteEdge(e_1);
			
			expect(graph.nrNodes()).to.equal(graph_nr_nodes);
			expect(graph.nrDirEdges()).to.equal(graph_nr_dir_edges);
			expect(graph.nrUndEdges()).to.equal(graph_nr_und_edges - 1);
			expect(n_a.degree()).to.equal(n_a_deg - 1);
			expect(n_a.outDegree()).to.equal(n_a_out_deg);
			expect(n_a.inDegree()).to.equal(n_a_in_deg);
			expect(n_b.degree()).to.equal(n_b_deg - 1);
			expect(n_b.outDegree()).to.equal(n_b_out_deg);
			expect(n_b.inDegree()).to.equal(n_b_in_deg);
			expect(graph.getMode()).to.equal($G.GraphMode.MIXED);
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
		 * graph is still in MIXED _mode
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
			
			graph.deleteEdge(e_4);
			
			expect(graph.nrNodes()).to.equal(graph_nr_nodes);
			expect(graph.nrDirEdges()).to.equal(graph_nr_dir_edges - 1);
			expect(graph.nrUndEdges()).to.equal(graph_nr_und_edges);
			expect(n_a.outDegree()).to.equal(n_a_out_deg - 1);
			expect(n_a.inDegree()).to.equal(n_a_in_deg);
			expect(n_a.degree()).to.equal(n_a_deg);
			expect(n_b.outDegree()).to.equal(n_b_out_deg);
			expect(n_b.inDegree()).to.equal(n_b_in_deg - 1);			
			expect(n_b.degree()).to.equal(n_b_deg);
			expect(graph.getMode()).to.equal($G.GraphMode.MIXED);
		});

		
		/**
		 * delete ALL UNDIRECTED edges
		 * e_1 + e_2 deleted
		 * we trust node degrees as per earlier examples
		 * graph still has 4 nodes
		 * graph has same number of directed edges
		 * graph has 0 undirected edges
		 * graph is now in DIRECTED _mode
		 */
		it('should remove ALL undirected edges, bringing the graph into DIRECTED _mode', () => {
			var graph_nr_dir_edges = graph.nrDirEdges(),
				graph_nr_und_edges = graph.nrUndEdges();
			
			graph.deleteEdge(e_1);
			graph.deleteEdge(e_2);
			
			expect(graph.nrDirEdges()).to.equal(graph_nr_dir_edges);
			expect(graph.nrUndEdges()).to.equal(0);
			expect(graph.getMode()).to.equal($G.GraphMode.DIRECTED);
		});
		
		
		/**
		 * delete ALL DIRECTED edges
		 * e_3 - e_7 deleted
		 * we trust node stats as per earlier examples
		 * graph has same number of undirected edges
		 * graph has 0 directed edges
		 * graph is now in UNDIRECTED _mode
		 */
		it('should remove ALL directed edges, bringing the graph into UNDIRECTED _mode', () => {
			var	graph_nr_dir_edges = graph.nrDirEdges(),
					graph_nr_und_edges = graph.nrUndEdges();
			
			graph.deleteEdge(e_3);
			graph.deleteEdge(e_4);
			graph.deleteEdge(e_5);
			graph.deleteEdge(e_6);
			graph.deleteEdge(e_7);
			
			expect(graph.nrUndEdges()).to.equal(graph_nr_und_edges);
			expect(graph.nrDirEdges()).to.equal(0);
			expect(graph.getMode()).to.equal($G.GraphMode.UNDIRECTED);
		});
		
		
		/**
		 * delete ALL edges
		 * e_1 - e_7 deleted
		 * we trust node stats as per earlier examples
		 * graph has 0 undirected edges
		 * graph has 0 directed edges
		 * graph is now in INIT _mode
		 */
		it('should remove ALL directed edges, bringing the graph into UNDIRECTED _mode', () => {
			var	graph_nr_dir_edges = graph.nrDirEdges(),
					graph_nr_und_edges = graph.nrUndEdges();
			
			graph.deleteEdge(e_1);
			graph.deleteEdge(e_2);
			graph.deleteEdge(e_3);
			graph.deleteEdge(e_4);
			graph.deleteEdge(e_5);
			graph.deleteEdge(e_6);
			graph.deleteEdge(e_7);
			
			expect(graph.nrUndEdges()).to.equal(0);
			expect(graph.nrDirEdges()).to.equal(0);
			expect(graph.getMode()).to.equal($G.GraphMode.INIT);
		});
		
		
	
		/**
		 * Node deletion of un-added node
		 */
		it('should throw an error when trying to remove an un-added node', () => {
			expect(graph.deleteNode.bind(graph, node_vana)).to.throw('Cannot remove un-added node.');
		});
		
		
		/**
		 * Node deletion WITHOUT edges
		 */
		it('should simply delete an unconnected node', () => {
			var node = graph.addNode('IAmInGraph');
			var nr_nodes = graph.nrNodes();
			graph.deleteNode(node);
			expect(graph.nrNodes()).to.equal(nr_nodes - 1);
		});
		
		
		/**
		 * Node outgoing edge deletion on NODE_VANA
		 */
		it('should throw an error when trying to delete outgoing edges of an un-added node', () => {
			expect(graph.deleteOutEdgesOf.bind(graph, node_vana)).to.throw('Cowardly refusing to delete edges of un-added node.');
		});
		
		
		/**
		 * Node edge deletion => outgoing edges
		 */
		it('should correctly delete all outgoing edges of a node', () => {
			graph.deleteOutEdgesOf(n_a);
			expect(n_a.outDegree()).to.equal(0);
			expect(n_a.inDegree()).to.equal(2);
			expect(n_b.inDegree()).to.equal(0);
			expect(n_d.inDegree()).to.equal(0);
			expect(graph.nrDirEdges()).to.equal(2);
			expect(graph.getMode()).to.equal($G.GraphMode.MIXED);		
		});
		
		
		/**
		 * Node incoming edge deletion on NODE_VANA
		 */
		it('should throw an error when trying to delete incoming edges of an un-added node', () => {
			expect(graph.deleteInEdgesOf.bind(graph, node_vana)).to.throw('Cowardly refusing to delete edges of un-added node.');
		});
		
		
		/**
		 * Node edge deletion => incoming edges
		 */
		it('should correctly delete all incoming edges of a node', () => {
			graph.deleteInEdgesOf(n_a);
			expect(n_a.inDegree()).to.equal(0);
			expect(n_a.outDegree()).to.equal(2);
			expect(n_c.outDegree()).to.equal(0);
			expect(n_d.outDegree()).to.equal(0);
			expect(graph.nrDirEdges()).to.equal(2);
			expect(graph.getMode()).to.equal($G.GraphMode.MIXED);			
		});
		
		
		/**
		 * Node directed edge deletion on NODE_VANA
		 */
		it('should throw an error when trying to delete directed edges of an un-added node', () => {
			expect(graph.deleteDirEdgesOf.bind(graph, node_vana)).to.throw('Cowardly refusing to delete edges of un-added node.');
		});
		
		
		/**
		 * Node edge deletion => directed edges
		 */
		it('should correctly delete all directed edges of a node', () => {
			graph.deleteDirEdgesOf(n_a);
			expect(n_a.inDegree()).to.equal(0);
			expect(n_a.outDegree()).to.equal(0);
			expect(n_b.inDegree()).to.equal(0);
			expect(n_c.outDegree()).to.equal(0);
			expect(n_d.inDegree()).to.equal(0);
			expect(n_d.outDegree()).to.equal(0);
			expect(graph.nrDirEdges()).to.equal(0);
			expect(graph.nrUndEdges()).to.equal(2);
			expect(graph.getMode()).to.equal($G.GraphMode.UNDIRECTED);		
		});
		
		
		/**
		 * Node undirected edge deletion on NODE_VANA
		 */
		it('should throw an error when trying to delete undirected edges of an un-added node', () => {
			expect(graph.deleteUndEdgesOf.bind(graph, node_vana)).to.throw('Cowardly refusing to delete edges of un-added node.');
		});
		
		
		/**
		 * Node edge deletion => undirected edges
		 */
		it('should correctly delete all undirected edges of a node', () => {
			graph.deleteUndEdgesOf(n_a);
			expect(n_a.degree()).to.equal(0);
			expect(n_b.degree()).to.equal(0);
			expect(n_c.degree()).to.equal(0);
			expect(graph.nrUndEdges()).to.equal(0);
			expect(graph.nrDirEdges()).to.equal(5);
			expect(graph.getMode()).to.equal($G.GraphMode.DIRECTED);
		});
		
		
		/**
		 * Node ALL edge deletion on NODE_VANA
		 */
		it('should throw an error when trying to delete all edges of an un-added node', () => {
			expect(graph.deleteAllEdgesOf.bind(graph, node_vana)).to.throw('Cowardly refusing to delete edges of un-added node.');
		});
		
		
		/**
		 * Node edge deletion => all edges
		 */
		it('should correctly delete all edges of a node', () => {
			graph.deleteAllEdgesOf(n_a);
			expect(graph.nrDirEdges()).to.equal(0);
			expect(graph.nrUndEdges()).to.equal(0);
			expect(graph.getMode()).to.equal($G.GraphMode.INIT);
		});
		
		
		/**
		 * Node deletion WITH edges
		 * Delete C node -> only 2 edges, 1 undirected and 1 directed
		 * A node should have 1 less undirected and 1 less incoming
		 * graph should still be in mixed _mode
		 */
		it('should correctly delete a node including edges, test case 1', () => {
			graph.deleteNode(n_c);
			expect(n_a.degree()).to.equal(1);
			expect(n_a.inDegree()).to.equal(2);
			expect(graph.nrNodes()).to.equal(3);
			expect(graph.nrDirEdges()).to.equal(4);
			expect(graph.nrUndEdges()).to.equal(1);
			expect(graph.getMode()).to.equal($G.GraphMode.MIXED);
		});
		
		
		/**
		 * Node deletion WITH edges
		 * Delete A node -> connected to ALL edges
		 * graph and all remaining nodes should be left without edges
		 * graph should be in INIT _mode...
		 */
		it('should correctly delete a node including edges, test case 2', () => {
			graph.deleteNode(n_a);			
			expect(graph.nrDirEdges()).to.equal(0);
			expect(graph.nrUndEdges()).to.equal(0);
			expect(graph.nrNodes()).to.equal(3);
			expect(graph.getMode()).to.equal($G.GraphMode.INIT);
		});
		
	});
	
	
	describe('Clearing ALL (un)directed edges from a graph', () => {
		var test_graph_file = "./test/test_data/small_graph_adj_list_def_sep.csv";
			
		it('should delete all directed edges from a graph', () => {
			graph = csv.readFromAdjacencyListFile(test_graph_file);
			expect(graph.nrDirEdges()).to.equal(5);
			expect(graph.nrUndEdges()).to.equal(2);
			graph.clearAllDirEdges();
			expect(graph.nrDirEdges()).to.equal(0);
			expect(graph.nrUndEdges()).to.equal(2);			
		});
		
		it('should delete all undirected edges from a graph', () => {
			graph = csv.readFromAdjacencyListFile(test_graph_file);
			expect(graph.nrDirEdges()).to.equal(5);
			expect(graph.nrUndEdges()).to.equal(2);
			graph.clearAllUndEdges();
			expect(graph.nrDirEdges()).to.equal(5);
			expect(graph.nrUndEdges()).to.equal(0);			
		});
		
		it('should delete ALL edges from a graph', () => {
			graph = csv.readFromAdjacencyListFile(test_graph_file);
			expect(graph.nrDirEdges()).to.equal(5);
			expect(graph.nrUndEdges()).to.equal(2);
			graph.clearAllEdges();
			expect(graph.nrDirEdges()).to.equal(0);
			expect(graph.nrUndEdges()).to.equal(0);			
		});
		
	});
	
	
	/**
	 * We don't know how to test RANDOM generation of something yet,
	 * so we fall back to simply test differences in the degree distribution
	 * This is a VERY WEAK test however, for even the addition or
	 * deletion of a single edge would lead to the same result...
	 * TODO figure out how to test this properly
	 * PLUS - how to test for runtime ???
	 */
	describe('Randomly generate edges in a graph (create a random graph)', () => {
		var test_graph_file = "./test/test_data/small_graph_adj_list_def_sep.csv",
				probability : number,
				min	: number,
				max : number,
				deg_dist : $G.DegreeDistribution;
				
		describe('Random edge generation via probability', () => {
				
			it('should throw an error if probability is smaller 0', () => {
				probability = -1;
				graph = csv.readFromAdjacencyListFile(test_graph_file);
				deg_dist = graph.degreeDistribution();
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				expect(graph.createRandomEdgesProb.bind(graph, probability, true)).to.throw('Probability out of range');
			});
			
			it('should throw an error if probability is greater 1', () => {
				probability = 2;
				graph = csv.readFromAdjacencyListFile(test_graph_file);
				deg_dist = graph.degreeDistribution();
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				expect(graph.createRandomEdgesProb.bind(graph, probability, true)).to.throw('Probability out of range');
			});
			
			it('DIRECTED - should randomly generate directed edges', () => {
				probability = 0.5;
				graph = csv.readFromAdjacencyListFile(test_graph_file);
				deg_dist = graph.degreeDistribution();
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				graph.createRandomEdgesProb(probability, true);
				expect(graph.nrDirEdges()).not.to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				expect(graph.degreeDistribution()).not.to.deep.equal(deg_dist);
			});
			
			it('UNDIRECTED - should randomly generate UNdirected edges', () => {
				probability = 0.5;
				graph = csv.readFromAdjacencyListFile(test_graph_file);
				deg_dist = graph.degreeDistribution();
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				graph.createRandomEdgesProb(probability, false);
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).not.to.equal(0);		
				expect(graph.degreeDistribution()).not.to.deep.equal(deg_dist);
			});
			
			it('UNDIRECTED - should default to UNdirected edges if no direction is provided', () => {
				probability = 0.5;
				graph = csv.readFromAdjacencyListFile(test_graph_file);
				deg_dist = graph.degreeDistribution();
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				graph.createRandomEdgesProb(probability);
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).not.to.equal(0);		
				expect(graph.degreeDistribution()).not.to.deep.equal(deg_dist);
			});
		
		});
				
		
		/**
		 * Although we clearly specify min / max in this case,
		 * we can still not test for specific node degree (ranges),
		 * except for the general fact that a nodes degree
		 * should be in the range [0, max+n-1], as
		 * all n-1 other nodes might have an edge to that node
		 */
		describe('Random edge generation via min / max #edges per node', () => {
				
			it('should throw an error if min is smaller 0', () => {
				min = -1;
				max = 10;
				graph = csv.readFromAdjacencyListFile(test_graph_file);
				deg_dist = graph.degreeDistribution();
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				expect(graph.createRandomEdgesSpan.bind(graph, min, max)).to.throw('Minimum degree cannot be negative.');
			});
			
			
			it('should throw an error if max is greater (n-1)', () => {
				min = 0;
				max = 4;
				graph = csv.readFromAdjacencyListFile(test_graph_file);
				deg_dist = graph.degreeDistribution();
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				expect(graph.createRandomEdgesSpan.bind(graph, min, max)).to.throw('Maximum degree exceeds number of reachable nodes.');
			});

			
			it('DIRECTED - should randomly generate directed edges', () => {
				min = 1;
				max = 3;
				graph = csv.readFromAdjacencyListFile(test_graph_file);
				deg_dist = graph.degreeDistribution();
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				graph.createRandomEdgesSpan(min, max, true);
				expect(graph.nrDirEdges()).not.to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				expect(graph.degreeDistribution()).not.to.deep.equal(deg_dist);
			});
			
			
			it('UNDIRECTED - should randomly generate UNdirected edges', () => {
				min = 1;
				max = 3;
				graph = csv.readFromAdjacencyListFile(test_graph_file);
				deg_dist = graph.degreeDistribution();
				graph.clearAllEdges();
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);		
				graph.createRandomEdgesSpan(min, max, false);
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).not.to.equal(0);		
				expect(graph.degreeDistribution()).not.to.deep.equal(deg_dist);
			});
		
		});
		
	});
	
});