/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $DFS from '../../src/search/DFS';
import * as $CSV from '../../src/io/input/CSVInput';
import * as $JSON from '../../src/io/input/JSONInput';


var expect = chai.expect;
var Node = $N.BaseNode;
var Edge = $E.BaseEdge;
var Graph = $G.BaseGraph;

const small_graph_file = "./test/test_data/small_graph.json",
			real_graph_file = "./test/test_data/real_graph.json",
			bernd_graph_file = "./test/test_data/BerndAres2016.json",
			neg_cycle_multi_component_file = "./test/test_data/negative_cycle_multi_component.json",
      SMALL_GRAPH_NR_NODES = 4,
      SMALL_GRAPH_NR_UND_EDGES = 2,
      SMALL_GRAPH_NR_DIR_EDGES = 5,
      REAL_GRAPH_NR_NODES = 6204,
      REAL_GRAPH_NR_EDGES = 18550;


describe('GRAPH TESTS: ', () => {
	let graph 			: $G.IGraph,
			clone_graph : $G.IGraph,
			node_a 			: $N.IBaseNode,
			node_b 			: $N.IBaseNode,
			edge_1			: $E.IBaseEdge,
			edge_2			: $E.IBaseEdge,
			stats				: $G.GraphStats,
			csv					: $CSV.CSVInput = new $CSV.CSVInput(),
			csv_sn			: $CSV.CSVInput = new $CSV.CSVInput(" ", false, false);
	

	describe('Basic graph operations - ', () => {

		beforeEach(() => {
			graph = new Graph('Test graph');
			clone_graph = new Graph('Clone graph');
			expect(graph).to.be.instanceOf($G.BaseGraph);
			expect(graph.nrNodes()).to.equal(0);
			expect(graph.nrDirEdges()).to.equal(0);
			expect(graph.nrUndEdges()).to.equal(0);
		});
	
		it('should correctly instantiate a graph with GraphMode INIT (no edges added)', () => {
			graph = new Graph('Test graph');
			expect(graph.getMode()).to.equal($G.GraphMode.INIT);
		});


		describe('adding nodes and edges', () => {

			it('should correctly add a node', () => {
				stats = graph.getStats();
				expect(stats.nr_nodes).to.equal(0);
				expect(graph.addNode(new $N.BaseNode('A'))).to.be.true;
				stats = graph.getStats();
				expect(stats.nr_nodes).to.equal(1);
			});
			
			it('should correctly add a node by ID', () => {
				stats = graph.getStats();
				expect(stats.nr_nodes).to.equal(0);
				node_a = graph.addNodeByID('A');
				expect(node_a).to.be.an.instanceof(Node);
				stats = graph.getStats();
				expect(stats.nr_nodes).to.equal(1);
			});

			it('should correctly clone and add a node from another graph without adding its edges', () => {
				let n_a = graph.addNodeByID("A");
				let n_b = graph.addNodeByID("B");
				let e_1 = graph.addEdgeByID("1", n_a, n_b);
				expect(graph.getEdgeById("1")).to.exist;
				expect(n_a.getEdge("1")).to.exist;
				expect(n_b.getEdge("1")).to.exist;
				clone_graph.cloneAndAddNode(n_a);
				clone_graph.cloneAndAddNode(n_b);
				expect(clone_graph.getEdgeById.bind(clone_graph, "1")).to.throw("cannot retrieve edge with non-existing ID.");
				expect(Object.keys(clone_graph.getNodeById("A").allEdges())).to.be.empty;
				expect(Object.keys(clone_graph.getNodeById("B").allEdges())).to.be.empty;
			});

			it('should refuse to add an edge if one of the nodes does not exist in the graph', () => {
				node_a = new $N.BaseNode("floating_node_a");
				node_b = graph.addNodeByID("B_in_graph");
				expect(graph.addEdgeByID.bind(graph, "edge_to_nirvana", node_a, node_b))
					.to.throw("can only add edge between two nodes existing in graph");
			});

			it('should refuse to add an edge if one of the nodes does not exist in the graph', () => {
				node_b = new $N.BaseNode("floating_node_b");
				node_a = graph.addNodeByID("A_in_graph");
				expect(graph.addEdgeByID.bind(graph, "edge_to_nirvana", node_a, node_b))
					.to.throw("can only add edge between two nodes existing in graph");
			});

			it('should refuse to add an edge if one of the nodes does not exist in the graph', () => {
				node_a = new $N.BaseNode("floating_node_a");
				node_b = new $N.BaseNode("floating_node_b");
				expect(graph.addEdgeByID.bind(graph, "edge_to_nirvana", node_a, node_b))
					.to.throw("can only add edge between two nodes existing in graph");
			});		
			
			/**
			 * edge has to be undirected
			 * node_a has in_degree 0, out_degree 0, degree 1
			 * node_b has in_degree 0, out_degree 0, degree 1
			 * graph has 2 nodes, 1 undirected edge
			 * graph is in UNDIRECTED _mode
			 */
			it('should correctly add an undirected edge between two nodes', () => {
				node_a = graph.addNodeByID('A');
				node_b = graph.addNodeByID('B');
				edge_1 = graph.addEdgeByID('und_a_b', node_a, node_b); // undirected edge	
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
				node_a = graph.addNodeByID('A');
				node_b = graph.addNodeByID('B');
				edge_1 = graph.addEdgeByID('dir_a_b', node_a, node_b, {directed: true});
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
				node_a = graph.addNodeByID('A');
				edge_1 = graph.addEdgeByID('und_a_a', node_a, node_a, {directed: false});
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
				node_a = graph.addNodeByID('A');
				edge_1 = graph.addEdgeByID('und_a_a', node_a, node_a, {directed: true});
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
			

			it('should refuse to add an edge if node A does not exist', () => {
				graph = new Graph('Test graph');
				expect(graph.addEdgeByNodeIDs.bind(graph, 'dontaddme', 'A', 'B')).to.throw('Cannot add edge. Node A does not exist');
			});
			
			
			it('should refuse to add an edge if node B does not exist', () => {
				graph = new Graph('Test graph');
				node_a = graph.addNodeByID('A');
				expect(graph.addEdgeByNodeIDs.bind(graph, 'dontaddme', 'A', 'B')).to.throw('Cannot add edge. Node B does not exist');
			});
			
			
			it('should correctly add an edge to existing nodes specified by ID', () => {
				graph = new Graph('Test graph');
				node_a = graph.addNodeByID('A');
				node_b = graph.addNodeByID('B');
				var edge = graph.addEdgeByNodeIDs("Edgy", "A", "B");
				expect(edge).not.to.be.undefined;
				expect(edge).to.be.instanceof($E.BaseEdge);
				expect(edge.getNodes().a).to.equal(node_a);
				expect(edge.getNodes().b).to.equal(node_b);
			});


			it('should check if given node IDs are just coincidentally present in the graph but point to invalid node objects', () => {
				node_a = graph.addNodeByID('A');
				node_b = graph.addNodeByID('B');
				edge_1 = graph.addEdgeByID('1', node_a, node_b);
				let new_node_a = clone_graph.addNodeByID('A');
				let new_node_b = clone_graph.addNodeByID('B');
				expect(clone_graph.addEdge.bind(clone_graph, edge_1)).to.throw("can only add edge between two nodes existing in graph");
			});


			it('should check if just one (A) of the given node IDs is just coincidentally present in the graph but points to an invalid node object', () => {
				node_a = graph.addNodeByID('A');
				node_b = graph.addNodeByID('B');
				edge_1 = graph.addEdgeByID('1', node_a, node_b);
				clone_graph.cloneAndAddNode(node_a);
				let new_node_b = clone_graph.addNodeByID('B');
				expect(clone_graph.addEdge.bind(clone_graph, edge_1)).to.throw("can only add edge between two nodes existing in graph");
			});


			it('should check if just one (B) of the given node IDs is just coincidentally present in the graph but points to an invalid node object', () => {
				node_a = graph.addNodeByID('A');
				node_b = graph.addNodeByID('B');
				edge_1 = graph.addEdgeByID('1', node_a, node_b);
				let new_node_a = clone_graph.addNodeByID('A');
				clone_graph.cloneAndAddNode(node_b);
				expect(clone_graph.addEdge.bind(clone_graph, edge_1)).to.throw("can only add edge between two nodes existing in graph");
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
				node_a = graph.addNodeByID('A');
				node_b = graph.addNodeByID('B');
				edge_1 = graph.addEdgeByID('und_a_b', node_a, node_b, {directed: false});
				expect(edge_1.isDirected()).to.be.false;
				edge_2 = graph.addEdgeByID('dir_b_b', node_b, node_b, {directed: true});
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
			n_a = graph.addNodeByID('A');
			n_b = graph.addNodeByID('B');
			n_c = graph.addNodeByID('C');
			n_d = graph.addNodeByID('D');
			e_1 = graph.addEdgeByID('1', n_a, n_b);
			e_2 = graph.addEdgeByID('2', n_a, n_c);
			e_3 = graph.addEdgeByID('3', n_a, n_a, {directed: true});
			e_4 = graph.addEdgeByID('4', n_a, n_b, {directed: true});
			e_5 = graph.addEdgeByID('5', n_a, n_d, {directed: true});
			e_6 = graph.addEdgeByID('6', n_c, n_a, {directed: true});
			e_7 = graph.addEdgeByID('7', n_d, n_a, {directed: true});
			
			node_vana = new Node("42", {label: 'IAmNotInGraph'});
			
			expect(graph.nrNodes()).to.equal(4);
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
		
		
		it('should return the Dict of undirected edges', () => {
			var edges = graph.getUndEdges();
			expect(Object.keys(edges).length).to.equal(2);
			expect(edges[e_1.getID()]).to.equal(e_1);
			expect(edges[e_2.getID()]).to.equal(e_2);
		});
		
		
		it('should return the Dict of directed edges', () => {
			var edges = graph.getDirEdges();
			expect(Object.keys(edges).length).to.equal(5);
			expect(edges[e_3.getID()]).to.equal(e_3);
			expect(edges[e_4.getID()]).to.equal(e_4);
			expect(edges[e_5.getID()]).to.equal(e_5);
			expect(edges[e_6.getID()]).to.equal(e_6);
			expect(edges[e_7.getID()]).to.equal(e_7);
		});


		it('should return the Array of undirected edges', () => {
			var edges = graph.getUndEdgesArray();
			expect(edges.length).to.equal(2);
			expect(edges).to.contain(e_1);
			expect(edges).to.contain(e_2);
		});
		
		
		it('should return the Array of directed edges', () => {
			var edges = graph.getDirEdgesArray();
			expect(edges.length).to.equal(5);
			expect(edges).to.contain(e_3);
			expect(edges).to.contain(e_4);
			expect(edges).to.contain(e_5);
			expect(edges).to.contain(e_6);
			expect(edges).to.contain(e_7);
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
			var node = graph.addNodeByID('IAmInGraph');
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


	describe('Graph cloning - ', () => {

		let clone_graph : $G.IGraph = null;
		let json_in : $JSON.IJSONInput;

		beforeEach(() => {
			expect(clone_graph).to.be.null;
		});

		afterEach(() => {
			clone_graph = null;
		});


		it('should successfully clone an empty graph', () => {
			graph = new $G.BaseGraph("empty graph");
			clone_graph = graph.clone();
			expect(clone_graph._label).to.equal(graph._label);
			expect(clone_graph.nrNodes()).to.equal(0);
			expect(clone_graph.nrUndEdges()).to.equal(0);
			expect(clone_graph.nrDirEdges()).to.equal(0);
			expect(clone_graph.getMode()).to.equal($G.GraphMode.INIT);
			expect(clone_graph.getNodes()).to.deep.equal({});
			expect(clone_graph.getUndEdges()).to.deep.equal({});
			expect(clone_graph.getDirEdges()).to.deep.equal({});
		});


		it('should successfully clone an graph with a node plus nested feature vector', () => {
			graph = new $G.BaseGraph("two_node_graph");
			let n_a = graph.addNodeByID("A");
			n_a.setFeatures({
				"bla": "hoo",
				"number": 42,
				"true": false,
				"array": [1, 2, 3, [4, 5]],
				"object": {
					"nested": true
				}
			});
			clone_graph = graph.clone();
			expect(clone_graph._label).to.equal(graph._label);
			expect(clone_graph.nrNodes()).to.equal(1);
			expect(clone_graph.nrUndEdges()).to.equal(0);
			expect(clone_graph.nrDirEdges()).to.equal(0);
			expect(clone_graph.getMode()).to.equal($G.GraphMode.INIT);
			expect(clone_graph.getNodeById("A")).to.deep.equal(n_a);
		});


		it('should successfully clone an graph with two nodes and one undirected edge', () => {
			graph = new $G.BaseGraph("two_node_graph");
			let n_a = graph.addNodeByID("A");
			let n_b = graph.addNodeByID("B");
			let edgy = graph.addEdgeByID("edgy", n_a, n_b, {directed: false});

			clone_graph = graph.clone();
			expect(clone_graph._label).to.equal(graph._label);
			expect(clone_graph.nrNodes()).to.equal(2);
			expect(clone_graph.nrUndEdges()).to.equal(1);
			expect(clone_graph.nrDirEdges()).to.equal(0);
			expect(clone_graph.getMode()).to.equal($G.GraphMode.UNDIRECTED);
		});


		it('should successfully clone an graph with two nodes and one directed edge', () => {
			graph = new $G.BaseGraph("two_node_graph");
			let n_a = graph.addNodeByID("A");
			let n_b = graph.addNodeByID("B");
			let edgy = graph.addEdgeByID("edgy", n_a, n_b, {directed: true});

			clone_graph = graph.clone();
			expect(clone_graph._label).to.equal(graph._label);
			expect(clone_graph.nrNodes()).to.equal(2);
			expect(clone_graph.nrUndEdges()).to.equal(0);
			expect(clone_graph.nrDirEdges()).to.equal(1);
			expect(clone_graph.getMode()).to.equal($G.GraphMode.DIRECTED);
		});


		/**
		 * The toy graph example
		 */
		it('should successfully clone a toy graph in explicit mode including weights', () => {
			json_in = new $JSON.JSONInput(true, false, true);
			graph = json_in.readFromJSONFile(small_graph_file);
			let deg_dist_all = graph.degreeDistribution().all;
			clone_graph = graph.clone();
			let clone_deg_dist_all = graph.degreeDistribution().all;
			expect(clone_graph.nrNodes()).to.equal(SMALL_GRAPH_NR_NODES);
			expect(clone_graph.nrUndEdges()).to.equal(SMALL_GRAPH_NR_UND_EDGES);
			expect(clone_graph.nrDirEdges()).to.equal(SMALL_GRAPH_NR_DIR_EDGES);
			expect(clone_deg_dist_all).to.deep.equal(deg_dist_all);
			expect(clone_graph).to.deep.equal(graph);
		});


		/**
		 * JUST FOR FUN - can also be removed - The REAL graph example
		 */
		it('should successfully clone a toy graph in explicit mode including weights', () => {
			json_in = new $JSON.JSONInput(false, false, true);
			graph = json_in.readFromJSONFile(real_graph_file);
			let deg_dist_all = graph.degreeDistribution().all;
			clone_graph = graph.clone();
			let clone_deg_dist_all = graph.degreeDistribution().all;

			expect(clone_graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
			expect(clone_graph.nrUndEdges()).to.equal(REAL_GRAPH_NR_EDGES);
			expect(clone_graph.nrDirEdges()).to.equal(0);
			expect(clone_deg_dist_all).to.deep.equal(deg_dist_all);
			// expect(clone_graph).to.deep.equal(graph);
		});

		/**
		 * Cloning only a part of the graph
		 */
		it('should successfully clone a part of a social network', () => {
			json_in = new $JSON.JSONInput(false, false, true);
			graph = csv_sn.readFromEdgeListFile("./test/test_data/social_network_edges.csv");

			clone_graph = graph.cloneSubGraph(graph.getNodeById("1374"), 300);

			expect(clone_graph.nrNodes()).to.equal(300);
			expect(clone_graph.nrUndEdges()).to.equal(4635); //TODO:: check number?
			expect(clone_graph.nrDirEdges()).to.equal(0);
		});
	});


	describe('Adjacency List / Hash Tests - ', () => {

		describe("Minimum Adjacency List generation Tests, DICT version - ", () => {

			let graph: $G.IGraph,
					adj_list: $G.MinAdjacencyListDict,
					expected_result: $G.MinAdjacencyListDict,
					jsonReader = new $JSON.JSONInput(true, false, true);


			it('should output an empty adjacency list for an empty graph', () => {
				graph = new $G.BaseGraph("emptinius");
				expected_result = {};
				expect(graph.adjListDict()).to.deep.equal(expected_result);
			});


			it('should produce a non-empty adj.list for the small example graph', () => {
				graph = jsonReader.readFromJSONFile(small_graph_file);
				adj_list = graph.adjListDict();
				expect(adj_list).not.to.be.undefined;
				expect(adj_list).not.to.deep.equal({});
			});


			it('should produce the correct adj.list without incoming edges', () => {
				graph = jsonReader.readFromJSONFile(small_graph_file);
				adj_list = graph.adjListDict(false);
				// console.dir(adj_list);
				expected_result = {
					'A': {'A': 7, 'B': 1, 'C': 0, 'D': -33},
					'B': {'A': 3},
					'C': {'A': 0},
					'D': {'A': 6}
				};
				expect(adj_list).to.deep.equal(expected_result);
			});


			it('should produce the correct adj.list including incoming edges', () => {
				graph = jsonReader.readFromJSONFile(small_graph_file);
				adj_list = graph.adjListDict(true);
				// console.dir(adj_list);
				expected_result = {
					'A': {'A': 7, 'B': 1, 'C': 0, 'D': -33},
					'B': {'A': 1},
					'C': {'A': 0},
					'D': {'A': -33}
				};
				expect(adj_list).to.deep.equal(expected_result);
			});


			it('should produce the correct adj.list including incoming edges & implicit self connection', () => {
				graph = jsonReader.readFromJSONFile(small_graph_file);
				adj_list = graph.adjListDict(true, true);
				// console.dir(adj_list);
				expected_result = {
					'A': {'A': 7, 'B': 1, 'C': 0, 'D': -33},
					'B': {'A': 1, 'B': 0},
					'C': {'A': 0, 'C': 0},
					'D': {'A': -33, 'D': 0}
				};
				expect(adj_list).to.deep.equal(expected_result);
			});


			/**
			 * In a state machine, the distance of a node to itself could
			 * be set to 1 because the state would have to transition to itself...
			 */
			it('should produce the correct adj.list with specific self-dist', () => {
				graph = jsonReader.readFromJSONFile(small_graph_file);
				adj_list = graph.adjListDict(true, true, 1);
				// console.dir(adj_list);
				expected_result = {
					'A': {'A': 1, 'B': 1, 'C': 0, 'D': -33},
					'B': {'A': 1, 'B': 1},
					'C': {'A': 0, 'C': 1},
					'D': {'A': -33, 'D': 1}
				};
				expect(adj_list).to.deep.equal(expected_result);
			});


			/**
			 * TODO include edge to self when 'include_self' is not set?
			 */

			it('should produce the correct adj.list considering default weights', () => {
				jsonReader = new $JSON.JSONInput(true, false, false);
				graph = jsonReader.readFromJSONFile(small_graph_file);
				adj_list = graph.adjListDict(true);
				
				expected_result = {
					'A': {'A': 1, 'B': 1, 'C': 1, 'D': 1},
					'B': {'A': 1},
					'C': {'A': 1},
					'D': {'A': 1}
				};
				expect(adj_list).to.deep.equal(expected_result);
			});


			it('should produce the correct adj.list considering default weights', () => {
				jsonReader = new $JSON.JSONInput(true, false, false);
				graph = jsonReader.readFromJSONFile(small_graph_file);
				adj_list = graph.adjListDict(true, true);
				
				expected_result = {
					'A': {'A': 1, 'B': 1, 'C': 1, 'D': 1},
					'B': {'A': 1, 'B': 0},
					'C': {'A': 1, 'C': 0},
					'D': {'A': 1, 'D': 0}
				};
				expect(adj_list).to.deep.equal(expected_result);
			});

		});


		/**
		 * TODO how to deal with negative loops?
		 */
		describe("Minimum Adjacency List generation Tests, ARRAY version", () => {

			let sn_300_graph_file = './test/test_data/social_network_edges_300.csv',graph: $G.IGraph,
					adj_list: $G.MinAdjacencyListArray,
					sn_300_graph: $G.IGraph,
					expected_result: $G.MinAdjacencyListArray,
					jsonReader = new $JSON.JSONInput(true, false, true),
					csvReader = new $CSV.CSVInput(' ', false, false),
					inf = Number.POSITIVE_INFINITY;


			it('should output an empty adjacency list for an empty graph', () => {
				graph = new $G.BaseGraph("emptinius");
				expected_result = [];
				expect(graph.adjListArray()).to.deep.equal(expected_result);
			});


			it('should produce a non-empty adj.list for the small example graph', () => {
				graph = jsonReader.readFromJSONFile(small_graph_file);
				adj_list = graph.adjListArray();
				expect(adj_list).to.exist;
				expect(adj_list).not.to.deep.equal([]);
			});


			it('should produce the correct adj.list without incoming edges', () => {
				graph = jsonReader.readFromJSONFile(small_graph_file);
				adj_list = graph.adjListArray();
				
				expected_result = [
					[0, 1, 0, -33],
					[3, 0, inf, inf],
					[0, inf, 0, inf],
					[6, inf, inf, 0]
				];
				expect(adj_list).to.deep.equal(expected_result);
			});


			it('should produce the correct adj.list including incoming edges', () => {
				graph = jsonReader.readFromJSONFile(small_graph_file);
				adj_list = graph.adjListArray(true);
				
				expected_result = [
					[0, 1, 0, -33],
					[1, 0, inf, inf],
					[0, inf, 0, inf],
					[-33, inf, inf, 0]
				];
				expect(adj_list).to.deep.equal(expected_result);
			});


			it('should produce the correct adj.list considering default weights', () => {
				jsonReader = new $JSON.JSONInput(true, false, false);
				graph = jsonReader.readFromJSONFile(small_graph_file);
				adj_list = graph.adjListArray(true);
				
				expected_result = [
					[0, 1, 1, 1],
					[1, 0, inf, inf],
					[1, inf, 0, inf],
					[1, inf, inf, 0]
				];
				expect(adj_list).to.deep.equal(expected_result);
			});


			it('performance test on next array including incoming edges for UNDIRECTED, UNWEIGHTED graph', () => {
				sn_300_graph = csvReader.readFromEdgeListFile(sn_300_graph_file);
				adj_list = sn_300_graph.adjListArray(true);
				expect(adj_list.length).to.equal(sn_300_graph.nrNodes());
				adj_list.forEach( adj_entry => expect(adj_entry.length).to.equal(sn_300_graph.nrNodes()));
			});

		});


		describe('Next array generation for FW etc.', () => {

			let search_graph_file = "./test/test_data/search_graph_multiple_SPs_positive.json",
					sn_300_graph_file = './test/test_data/social_network_edges_300.csv',
					graph: $G.IGraph,
					sn_300_graph: $G.IGraph,
					// TODO invent better name for next/adj_list
					next: $G.NextArray,
					expected_result: $G.MinAdjacencyListArray,
					csvReader = new $CSV.CSVInput(' ', false, false),
					jsonReader = new $JSON.JSONInput(true, false, true),
					inf = Number.POSITIVE_INFINITY;


			it('should output an empty next array for an empty graph', () => {
				graph = new $G.BaseGraph("emptinius");
				expected_result = [];
				expect(graph.adjListArray()).to.deep.equal(expected_result);
			});


			it('should produce a non-empty next array for the small example graph', () => {
				graph = jsonReader.readFromJSONFile(small_graph_file);
				next = graph.nextArray();
				expect(next).to.exist;
				expect(next).not.to.deep.equal([]);
			});


			it('should produce the correct next array without incoming edges', () => {
				graph = jsonReader.readFromJSONFile(search_graph_file);
				next = graph.nextArray();
				let expected_result = [
					[[0],[1],[2],[3],[null],[null]],
					[[0],[1],[2],[null],[4],[5]],
					[[0],[null],[2],[null],[4],[null]],
					[[null],[null],[2],[3],[4],[null]],
					[[null],[1],[null],[3],[4],[null]],
					[[null],[null],[2],[null],[4],[5]]]	;

				expect(next).to.deep.equal(expected_result);
			});


			it('should produce the correct next array including incoming edges', () => {
				graph = jsonReader.readFromJSONFile(search_graph_file);
				next = graph.nextArray(true);
				let expected_result = [
					[[0],[1],[2],[3],[null],[null]],
					[[0],[1],[2],[null],[4],[5]],
					[[0],[1],[2],[3],[4],[5]],
					[[0],[null],[2],[3],[4],[null]],
					[[null],[1],[2],[3],[4],[5]],
					[[null],[1],[2],[null],[4],[5]]];

				expect(next).to.deep.equal(expected_result);
			});


			it('performance test on next array including incoming edges for UNDIRECTED, UNWEIGHTED graph', () => {
				sn_300_graph = csvReader.readFromEdgeListFile(sn_300_graph_file);
				next = sn_300_graph.nextArray(true);
				// console.log(next);
			});

		});

	});
	

	describe('negative cycle checks - ', () => {

		let graph : $G.IGraph,
				graph_bernd: $G.IGraph,
				graph_negcycle_multicomp : $G.IGraph,
				json : $JSON.IJSONInput,
				n_a : $N.IBaseNode,
				n_b : $N.IBaseNode,
				n_c : $N.IBaseNode,
				e_1 : $E.IBaseEdge,
				e_2 : $E.IBaseEdge,
				e_3 : $E.IBaseEdge;


		before(() => {
			json = new $JSON.JSONInput(true, false, true);
			graph = new $G.BaseGraph("positive weight graph");
			graph_negcycle_multicomp = json.readFromJSONFile(neg_cycle_multi_component_file);
			n_a = graph.addNodeByID("A");
			n_b = graph.addNodeByID("B");
			n_c = graph.addNodeByID("C");
			e_1 = graph.addEdgeByID("1", n_a, n_b, {directed: true, weighted: true, weight: 1});
			e_2 = graph.addEdgeByID("2", n_b, n_c, {directed: true, weighted: true, weight: 2});
			e_3 = graph.addEdgeByID("3", n_c, n_a, {directed: true, weighted: true, weight: 3});
		});


		it('should correclty detect a graph with solely positive edges', () => {
			expect(graph.hasNegativeCycles(n_a)).to.be.false;
		});


		it('should correctly detect a graph with negative edges but no negative cycle', () => {
			e_2.setWeight(-2);
			expect(graph.hasNegativeCycles(n_a)).to.be.false;
		});


		it('should correctly detect a graph with negative cycle', () => {
			e_2.setWeight(-5);
			expect(graph.hasNegativeCycles(n_a)).to.be.true;
		});


		it('should correctly detect a negative undirected edge as negative cycle', () => {
			e_2.setWeight(5);
			graph.addEdgeByID("Negative Undie", n_a, n_b, {weighted: true, weight: -1});
			expect(graph.hasNegativeCycles()).to.be.true;
		});


		it('negative cycle multi-component graph should have 2 components', () => {
			expect($DFS.DFS(graph_negcycle_multicomp, graph_negcycle_multicomp.getNodeById("S")).length).to.equal(2);
		});


		it('should correctly detect a negative cycle in a multi-component graph', () => {
			expect(graph_negcycle_multicomp.hasNegativeCycles(graph_negcycle_multicomp.getNodeById("S"))).to.be.true;
		});


		it('performance test on bernd graph (1483 nodes), no negative cycles', () => {
			json = new $JSON.JSONInput(false, true, false);
			graph_bernd = json.readFromJSONFile(bernd_graph_file);
			let start_node = "1040";
			expect($DFS.DFS(graph_bernd, graph_bernd.getNodeById(start_node)).length).to.equal(5);
			expect(graph_bernd.hasNegativeCycles()).to.be.false;
		});


		it('performance test on bernd graph (1483 nodes), WITH negative cycles', () => {
			json = new $JSON.JSONInput(false, true, true);
			graph_bernd = json.readFromJSONFile(bernd_graph_file);
			let start_node = "1040";
			let edges = graph_bernd.getDirEdges();
			for (let edge_idx in edges) {
				edges[edge_idx].setWeight(-1);
			}
			expect($DFS.DFS(graph_bernd, graph_bernd.getNodeById(start_node)).length).to.equal(5);
			expect(graph_bernd.hasNegativeCycles()).to.be.true;
		});

	});


	describe("Edge re-interpretation - ", () => {

		const jsonReader = new $JSON.JSONInput();

		describe.only('empty and trivial graphs - ', () => {

			beforeEach(() => {
				graph = new $G.BaseGraph("emptinius");
				expect(graph).to.exist;
				expect(graph.getMode()).to.equal($G.GraphMode.INIT);
				expect(graph.nrNodes()).to.equal(0);
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(0);
			});


			it('should show Rita some basic expectations and what can go right / wrong ;)', () => {
				expect(false).to.be.true; // false
				expect(5).to.equal(5); // true
				expect({}).to.exist; //true
				let a = {}; let b = a; expect(a).to.equal(b); // true because refs are the same
				expect({}).to.equal({}) // false because objects have different addresses
				expect({a: true, b: "bla"}).to.deep.equal({a: true, b: "blahoo"}); // false
				expect({a: true, b: "bla"}).not.to.equal({a: true, b: "blahoo"}); // true because of different refs
				expect({a: true, b: "bla"}).not.to.deep.equal({a: true, b: "blahoo"}); // true because of different content
				expect(graph.toDirectedGraph.bind(graph)).to.throw("Cowardly refusing to re-interpret an empty graph.");
			});


			it('should throw an error if we hand it an empty graph', () => {
				// 'throws an error' behavior is not really a return value of the function
				expect(graph.toDirectedGraph.bind(graph)).to.throw("Cowardly refusing to re-interpret an empty graph.");
			});


			it('should return the same directed graph if all edges were directed before', () => {
				let digraph_file = "./test/test_data/search_graph_pfs.json";
				let json = new $JSON.JSONInput(true, true, false);
				let digraph = json.readFromJSONFile(digraph_file);
				expect(digraph).to.exist;
				expect(digraph.nrNodes()).to.equal(6);
				expect(digraph.nrDirEdges()).to.equal(9);
				expect(digraph.nrUndEdges()).to.equal(0);
				expect(digraph.toDirectedGraph()).to.equal(digraph);
			});


			it('should return a copy of the same directed graph if all edges were directed before', () => {
				let digraph_file = "./test/test_data/search_graph_pfs.json";
				let json = new $JSON.JSONInput(true, true, false);
				let digraph = json.readFromJSONFile(digraph_file);
				expect(digraph).to.exist;
				expect(digraph.nrNodes()).to.equal(6);
				expect(digraph.nrDirEdges()).to.equal(9);
				expect(digraph.nrUndEdges()).to.equal(0);

				let res_graph = digraph.toDirectedGraph(true);
				expect(res_graph).not.to.equal(digraph); // refs
				expect(res_graph).to.deep.equal(digraph); // content
			});


			// it('should return the same UNdirected graph if all edges were UNdirected before', () => {
				
			// });


			// it('should return a directed graph when all edges were UNdirected before', () => {

			// });


			// it('should return an UNdirected graph when all edges were directed before', () => {
				
			// });


		});


		describe('MIXED graph', () => {

			beforeEach(() => {
				graph = jsonReader.readFromJSONFile(small_graph_file);
				expect(graph).to.exist;
				expect(graph.getMode()).to.equal($G.GraphMode.MIXED);
				expect(graph.nrNodes()).to.equal(4);
				expect(graph.nrDirEdges()).to.equal(5);
				expect(graph.nrUndEdges()).to.equal(2);
			});


			it("should correctly re-interpret all directed edges as UNdirected", () => {
				
			});


			it("should correctly re-interpret all UNdirected edges as directed", () => {
				
			});

		});

	});

});
