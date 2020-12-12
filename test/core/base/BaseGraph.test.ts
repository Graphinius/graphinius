import { GraphMode, GraphStats, MinAdjacencyListDict, MinAdjacencyListArray, NextArray } from '../../../src/core/interfaces';
import * as $N from '../../../src/core/base/BaseNode';
import * as $E from '../../../src/core/base/BaseEdge';
import * as $G from '../../../src/core/base/BaseGraph';
import { TypedGraph } from "../../../src/core/typed/TypedGraph";
import { DegreeDistribution, DegreeCentrality } from '../../../src/centralities/Degree';
import { DFS } from '../../../src/traversal/DFS';
import { CSVInput, ICSVInConfig } from '../../../src/io/input/CSVInput';
import { JSONInput } from '../../../src/io/input/JSONInput';
import { CSV_DATA_PATH, JSON_DATA_PATH } from '../../config/test_paths';

import { Logger } from '../../../src/utils/Logger'
const logger = new Logger();

const degCent = new DegreeCentrality();

const Node = $N.BaseNode;
const Edge = $E.BaseEdge;
const Graph = $G.BaseGraph;

// let social_net_config: ICSVInConfig = {
// 	separator: ' ',
// 	explicit_direction: false,
// 	direction_mode: false
// };

const small_graph_file = `${JSON_DATA_PATH}/small_graph.json`,
	search_graph_file = `${JSON_DATA_PATH}/search_graph.json`,
	neg_cycle_multi_component_file = `${JSON_DATA_PATH}/negative_cycle_multi_component.json`,
	SMALL_GRAPH_NR_NODES = 4,
	SMALL_GRAPH_NR_UND_EDGES = 2,
	SMALL_GRAPH_NR_DIR_EDGES = 5;


describe('GRAPH TESTS: ', () => {
	let graph: $G.IGraph,
		clone_graph: $G.IGraph,
		node_a: $N.IBaseNode,
		node_b: $N.IBaseNode,
		edge_ab: $E.IBaseEdge,
		edge_2: $E.IBaseEdge,
		stats: GraphStats,
		csv: CSVInput = new CSVInput();


	describe('Basic graph instantiation - ', () => {

		beforeEach(() => {
			graph = new Graph('Test graph');
			clone_graph = new Graph('Clone graph');
			expect(graph).toBeInstanceOf($G.BaseGraph);
			expect(graph.nrNodes()).toBe(0);
			expect(graph.nrDirEdges()).toBe(0);
			expect(graph.nrUndEdges()).toBe(0);
		});


		test(
			'should correctly instantiate a graph with GraphMode INIT (no edges added)',
			() => {
				graph = new Graph('Test graph');
				expect(graph.getMode()).toBe(GraphMode.INIT);
			}
		);


		test('should get mode via getter', () => {
			graph = new Graph('Test graph');
			expect(graph.mode).toBe(GraphMode.INIT);
		}
		);


		test('should get stats either via getStats() or stats getter', () => {
			expect(graph.getStats()).toEqual(graph.stats);
		});


		it('should report a BaseGraph to be NOT typed', function () {
			expect($G.BaseGraph.isTyped(graph)).toBe(false);
		});


		it('should report a TypedGraph to be TYPED', function () {
			expect($G.BaseGraph.isTyped(new TypedGraph('typeee'))).toBe(true);
		});



		describe('adding nodes and edges -', () => {

			test('should correctly add a node', () => {
				stats = graph.getStats();
				expect(stats.nr_nodes).toBe(0);
				const addNode = new $N.BaseNode('A');
				expect(graph.addNode(addNode)).toBe(addNode);
				stats = graph.getStats();
				expect(stats.nr_nodes).toBe(1);
			});

			test('should correctly add a node by ID', () => {
				stats = graph.getStats();
				expect(stats.nr_nodes).toBe(0);
				expect(graph.addNodeByID('A')).toBeInstanceOf(Node);
				stats = graph.getStats();
				expect(stats.nr_nodes).toBe(1);
			});

			test('should refuse to add a node with same ID as existing node', () => {
				stats = graph.getStats();
				expect(stats.nr_nodes).toBe(0);
				const addNode = new $N.BaseNode('A');
				expect(graph.addNode(addNode)).toBe(addNode);
				expect(graph.addNode.bind(graph, addNode)).toThrowError("Won't add node with duplicate ID.");
				stats = graph.getStats();
				expect(stats.nr_nodes).toBe(1);
			});

			test('should refuse to add a node by ID with same ID as existing node', () => {
				stats = graph.getStats();
				expect(stats.nr_nodes).toBe(0);
				expect(graph.addNodeByID('A')).toBeInstanceOf(Node);
				expect(graph.addNodeByID.bind(graph, 'A')).toThrowError("Won't add node with duplicate ID.");
				stats = graph.getStats();
				expect(stats.nr_nodes).toBe(1);
			});

			test('nid is alias to getNodeByID', () => {
				graph.addNodeByID('A');
				expect(graph.n('A')).toEqual(graph.getNodeById('A'));
			});

			test(
				'should correctly clone and add a node from another graph without adding its edges',
				() => {
					let n_a = graph.addNodeByID("A");
					let n_b = graph.addNodeByID("B");
					let e_1 = graph.addEdgeByID("1", n_a, n_b);
					expect(graph.getEdgeById("1")).toBeDefined();
					expect(n_a.getEdge("1")).toBeDefined();
					expect(n_b.getEdge("1")).toBeDefined();
					clone_graph.addNode(n_a.clone());
					clone_graph.addNode(n_b.clone());
					expect(clone_graph.getEdgeById.bind(clone_graph, "1")).toThrowError("cannot retrieve edge with non-existing ID.");
					expect(Object.keys(clone_graph.getNodeById("A").allEdges())).toHaveLength(0);
					expect(Object.keys(clone_graph.getNodeById("B").allEdges())).toHaveLength(0);
				}
			);

			test(
				'should refuse to add an edge if one of the nodes does not exist in the graph',
				() => {
					node_a = new $N.BaseNode("floating_node_a");
					node_b = graph.addNodeByID("B_in_graph");
					expect(graph.addEdgeByID.bind(graph, "edge_to_nirvana", node_a, node_b)).toThrowError("can only add edge between two nodes existing in graph");
				}
			);

			test(
				'should refuse to add an edge if one of the nodes does not exist in the graph',
				() => {
					node_b = new $N.BaseNode("floating_node_b");
					node_a = graph.addNodeByID("A_in_graph");
					expect(graph.addEdgeByID.bind(graph, "edge_to_nirvana", node_a, node_b)).toThrowError("can only add edge between two nodes existing in graph");
				}
			);

			test(
				'should refuse to add an edge if one of the nodes does not exist in the graph',
				() => {
					node_a = new $N.BaseNode("floating_node_a");
					node_b = new $N.BaseNode("floating_node_b");
					expect(graph.addEdgeByID.bind(graph, "edge_to_nirvana", node_a, node_b)).toThrowError("can only add edge between two nodes existing in graph");
				}
			);

			/**
			 * edge has to be undirected
			 * node_a has in_degree 0, out_degree 0, degree 1
			 * node_b has in_degree 0, out_degree 0, degree 1
			 * graph has 2 nodes, 1 undirected edge
			 * graph is in UNDIRECTED _mode
			 */
			test('should correctly add an undirected edge between two nodes', () => {
				node_a = graph.addNodeByID('A');
				node_b = graph.addNodeByID('B');
				edge_ab = graph.addEdgeByID('und_a_b', node_a, node_b); // undirected edge
				expect(edge_ab.isDirected()).toBe(false);
				expect(node_a.in_deg).toBe(0);
				expect(node_a.out_deg).toBe(0);
				expect(node_a.deg).toBe(1);
				expect(node_b.in_deg).toBe(0);
				expect(node_b.out_deg).toBe(0);
				expect(node_b.deg).toBe(1);
				stats = graph.getStats();
				expect(stats.nr_nodes).toBe(2);
				expect(stats.nr_dir_edges).toBe(0);
				expect(stats.nr_und_edges).toBe(1);
				expect(graph.getMode()).toBe(GraphMode.UNDIRECTED);
			});


			/**
			 * edge has to be directed
			 * node_a has in_degree 0, out_degree 1, degree 1
			 * node_b has in_degree 1, out_degree 0, degree 1
			 * graph has 2 nodes, 1 undirected edge, 1 directed edge
			 * graph is in DIRECTED _mode
			 */
			test('should correctly add a directed edge between two nodes', () => {
				graph = new Graph('Test graph');
				node_a = graph.addNodeByID('A');
				node_b = graph.addNodeByID('B');
				edge_ab = graph.addEdgeByID('dir_a_b', node_a, node_b, { directed: true });
				expect(edge_ab.isDirected()).toBe(true);
				expect(node_a.in_deg).toBe(0);
				expect(node_a.out_deg).toBe(1);
				expect(node_a.deg).toBe(0);
				expect(node_b.in_deg).toBe(1);
				expect(node_b.out_deg).toBe(0);
				expect(node_b.deg).toBe(0);
				stats = graph.getStats();
				expect(stats.nr_nodes).toBe(2);
				expect(stats.nr_dir_edges).toBe(1);
				expect(stats.nr_und_edges).toBe(0);
				expect(graph.getMode()).toBe(GraphMode.DIRECTED);
			});


			/**
			 * edge has to be undirected and a loop
			 * node_a has in_degree 0, out_degree 0, degree 1
			 * graph has 1 node, 1 undirected edge
			 * graph is in UNDIRECTED _mode
			 */
			test('should correctly add an undirected loop', () => {
				graph = new Graph('Test graph');
				node_a = graph.addNodeByID('A');
				edge_ab = graph.addEdgeByID('und_a_a', node_a, node_a, { directed: false });
				expect(edge_ab.isDirected()).toBe(false);
				expect(node_a.in_deg).toBe(0);
				expect(node_a.out_deg).toBe(0);
				expect(node_a.deg).toBe(1);
				stats = graph.getStats();
				expect(stats.nr_nodes).toBe(1);
				expect(stats.nr_dir_edges).toBe(0);
				expect(stats.nr_und_edges).toBe(1);
				expect(graph.getMode()).toBe(GraphMode.UNDIRECTED);
			});


			/**
			 * edge has to be directed and a loop
			 * node_a has in_degree 1, out_degree 1, degree 0
			 * graph has 1 node, 1 directed edge
			 * graph is in DIRECTED _mode
			 */
			test('should correctly add a directed loop', () => {
				graph = new Graph('Test graph');
				node_a = graph.addNodeByID('A');
				edge_ab = graph.addEdgeByID('und_a_a', node_a, node_a, { directed: true });
				expect(edge_ab.isDirected()).toBe(true);
				expect(node_a.in_deg).toBe(1);
				expect(node_a.out_deg).toBe(1);
				expect(node_a.deg).toBe(0);
				stats = graph.getStats();
				expect(stats.nr_nodes).toBe(1);
				expect(stats.nr_dir_edges).toBe(1);
				expect(stats.nr_und_edges).toBe(0);
				expect(graph.getMode()).toBe(GraphMode.DIRECTED);
			});


			test('should refuse to add an edge if node A does not exist', () => {
				graph = new Graph('Test graph');
				expect(graph.addEdgeByNodeIDs.bind(graph, 'dontaddme', 'A', 'B')).toThrowError('Cannot add edge. Node A does not exist');
			});


			test('should refuse to add an edge if node B does not exist', () => {
				graph = new Graph('Test graph');
				node_a = graph.addNodeByID('A');
				expect(graph.addEdgeByNodeIDs.bind(graph, 'dontaddme', 'A', 'B')).toThrowError('Cannot add edge. Node B does not exist');
			});


			test('should correctly add an edge to existing nodes specified by ID', () => {
				graph = new Graph('Test graph');
				node_a = graph.addNodeByID('A');
				node_b = graph.addNodeByID('B');
				let edge = graph.addEdgeByNodeIDs("Edgy", "A", "B");
				expect(edge).not.toBeUndefined();
				expect(edge).toBeInstanceOf($E.BaseEdge);
				expect(edge.getNodes().a).toBe(node_a);
				expect(edge.getNodes().b).toBe(node_b);
			});


			test(
				'should check if given node IDs are just coincidentally present in the graph but point to invalid node objects',
				() => {
					node_a = graph.addNodeByID('A');
					node_b = graph.addNodeByID('B');
					edge_ab = graph.addEdgeByID('1', node_a, node_b);
					let new_node_a = clone_graph.addNodeByID('A');
					let new_node_b = clone_graph.addNodeByID('B');
					expect(clone_graph.addEdge.bind(clone_graph, edge_ab)).toThrowError("can only add edge between two nodes existing in graph");
				}
			);


			test(
				'should check if just one (A) of the given node IDs is just coincidentally present in the graph but points to an invalid node object',
				() => {
					node_a = graph.addNodeByID('A');
					node_b = graph.addNodeByID('B');
					edge_ab = graph.addEdgeByID('1', node_a, node_b);
					clone_graph.addNode(node_a.clone());
					let new_node_b = clone_graph.addNodeByID('B');
					expect(clone_graph.addEdge.bind(clone_graph, edge_ab)).toThrowError("can only add edge between two nodes existing in graph");
				}
			);


			test(
				'should check if just one (B) of the given node IDs is just coincidentally present in the graph but points to an invalid node object',
				() => {
					node_a = graph.addNodeByID('A');
					node_b = graph.addNodeByID('B');
					edge_ab = graph.addEdgeByID('1', node_a, node_b);
					let new_node_a = clone_graph.addNodeByID('A');
					clone_graph.addNode(node_b.clone());
					expect(clone_graph.addEdge.bind(clone_graph, edge_ab)).toThrowError("can only add edge between two nodes existing in graph");
				}
			);


			/**
			 * MIXED MODE GRAPH
			 * edge_1 is undirected and goes from a to b
			 * edge_2 is directed and a loop from b to b
			 * node_a has in_degree 0, out_degree 0, degree 1
			 * node_b has in_degree 1, out_degree 1, degree 1
			 * graph has 2 node, 1 directed edge, 1 undirected edge
			 * graph is in MIXED _mode
			 */
			test('should correctly instantiate a mixed graph', () => {
				graph = new Graph('Test graph');
				node_a = graph.addNodeByID('A');
				node_b = graph.addNodeByID('B');
				edge_ab = graph.addEdgeByID('und_a_b', node_a, node_b, { directed: false });
				expect(edge_ab.isDirected()).toBe(false);
				edge_2 = graph.addEdgeByID('dir_b_b', node_b, node_b, { directed: true });
				expect(edge_2.isDirected()).toBe(true);
				expect(node_a.in_deg).toBe(0);
				expect(node_a.out_deg).toBe(0);
				expect(node_a.deg).toBe(1);
				expect(node_b.in_deg).toBe(1);
				expect(node_b.out_deg).toBe(1);
				expect(node_b.deg).toBe(1);
				stats = graph.getStats();
				expect(stats.nr_nodes).toBe(2);
				expect(stats.nr_dir_edges).toBe(1);
				expect(stats.nr_und_edges).toBe(1);
				expect(graph.getMode()).toBe(GraphMode.MIXED);
			});

		});

	});


	/**
	 * @todo check graph traveral algorithms on loose end edges !!!
	 * @todo maybe split those tests for graph edges, loose edges and out edges
	 */
	describe('finding nodes and edges by ID and Label', () => {

		const graph = new $G.BaseGraph("nodeEdgeIDLabelHasGetTestGraph");
		const node_a = graph.addNodeByID("A");
		const node_b = graph.addNodeByID("B");
		const node_c = new $N.BaseNode("C");
		const node_d = new $N.BaseNode("D");
		const edge_abu = graph.addEdgeByID("edge_ab", node_a, node_b);
		const edge_bad = graph.addEdgeByID("edge_bad", node_b, node_a, { directed: true });
		const loose_edge = new $E.BaseEdge("loosey", node_a, node_c);
		const out_edge = new $E.BaseEdge("outty", node_d, node_c);

		beforeAll(() => {

		});


		test('should report the existence of a node by ID', () => {
			expect(graph.hasNodeID("IDontExistInGraph")).toBe(false);
			expect(graph.hasNodeID(node_a.getID())).toBe(true);
		});


		test(
			'should return undefined when trying to retrieve a non-existing node by ID',
			() => {
				expect(graph.getNodeById("idontexist")).toBeUndefined();
			}
		);


		test('should return a node by existing ID', () => {
			expect(graph.getNodeById(node_a.getID())).toBe(node_a);
			expect(graph.getNodeById(node_b.getID())).toBe(node_b);
		});


		test('should report the number of nodes currently in the graph', () => {
			expect(graph.nrNodes()).toBe(2);
		});


		test('should report the existence of an edge by ID', () => {
			expect(graph.hasEdgeID("IdontExist")).toBe(false);
			expect(graph.hasEdgeID(loose_edge.getID())).toBe(false);
			expect(graph.hasEdgeID(out_edge.getID())).toBe(false);
			expect(graph.hasEdgeID(edge_abu.getID())).toBe(true);
			expect(graph.hasEdgeID(edge_bad.getID())).toBe(true);
		});


		test(
			'should throw an error upon trying to retrieve a non-existing edge by ID',
			() => {
				expect(graph.getEdgeById.bind(graph, undefined)).toThrowError("cannot retrieve edge with non-existing ID.");
				expect(graph.getEdgeById.bind(graph, loose_edge.getID())).toThrowError("cannot retrieve edge with non-existing ID.");
				expect(graph.getEdgeById.bind(graph, out_edge.getID())).toThrowError("cannot retrieve edge with non-existing ID.");
			}
		);


		test('should return an edge by ID', () => {
			expect(graph.getEdgeById(edge_abu.getID())).toBe(edge_abu);
		});


		test(
			'should report the number of directed edges currently in the graph',
			() => {
				expect(graph.nrDirEdges()).toBe(1);
			}
		);


		test('should report the number of edges currently in the graph', () => {
			expect(graph.nrUndEdges()).toBe(1);
		});


		test('should give you a random node currently existing in the graph', () => {
			let rand_node = graph.getRandomNode();
			expect(rand_node).toBeInstanceOf(Node);
			expect(graph.hasNodeID(rand_node.getID())).toBe(true);
		});


		test(
			'should give you a random directed edge currently existing in the graph',
			() => {
				let rand_dir_edge = graph.getRandomDirEdge();
				expect(rand_dir_edge.isDirected()).toBe(true);
				expect(rand_dir_edge).toBeInstanceOf(Edge);
				expect(graph.hasEdgeID(rand_dir_edge.getID())).toBe(true);
			}
		);


		test(
			'should give you a random undirected edge currently existing in the graph',
			() => {
				let rand_und_edge = graph.getRandomUndEdge();
				expect(rand_und_edge.isDirected()).toBe(false);
				expect(rand_und_edge).toBeInstanceOf(Edge);
				expect(graph.hasEdgeID(rand_und_edge.getID())).toBe(true);
			}
		);


		/**
		 * @todo We're just checking for 1st edge right now - what about multiple edges?
		 *
		 */
		test(
			'should throw an error retrieving an edge by Node IDs if node_a does not exist',
			() => {
				expect(graph.getDirEdgeByNodeIDs.bind(graph, undefined, node_b.getID())).toThrowError("Cannot find edge. Node A does not exist (in graph).");
			}
		);


		test(
			'should throw an error retrieving an edge by Node IDs if node_b does not exist',
			() => {
				expect(graph.getDirEdgeByNodeIDs.bind(graph, node_b.getID(), undefined)).toThrowError("Cannot find edge. Node B does not exist (in graph).");
			}
		);


		test(
			'should throw an error retrieving a non-existing edge between two valid graph nodes',
			() => {
				const node_extra = graph.addNodeByID("extraaaaaa");
				expect(graph.getDirEdgeByNodeIDs.bind(graph, node_a.getID(), node_extra.getID())).toThrowError(
					`Cannot find edge. There is no edge between Node ${node_a.getID()} and ${node_extra.getID()}.`
				);
			}
		);


		test('should correctly return the UNdirected A->B edge', () => {
			expect(graph.getUndEdgeByNodeIDs(node_a.getID(), node_b.getID())).toBe(edge_abu);
		});


		test('should correctly return the UNdirected B->A edge', () => {
			expect(graph.getUndEdgeByNodeIDs(node_b.getID(), node_a.getID())).toBe(edge_abu);
		});


		test('should correctly return the directed B->A edge', () => {
			expect(graph.getDirEdgeByNodeIDs(node_b.getID(), node_a.getID())).toBe(edge_bad);
		});

	});


	describe('A little more complex scenario with 4 nodes and 7 edges, mixed _mode', () => {

		let graph,
			n_a, n_b, n_c, n_d, node_vana,
			e_1, e_2, e_3, e_4, e_5, e_6, e_7;

		beforeEach(() => {
			graph = new Graph('Edge and node deletion test graph');
			n_a = graph.addNodeByID('A');
			n_b = graph.addNodeByID('B');
			n_c = graph.addNodeByID('C');
			n_d = graph.addNodeByID('D');
			e_1 = graph.addEdgeByID('1', n_a, n_b);
			e_2 = graph.addEdgeByID('2', n_a, n_c);
			e_3 = graph.addEdgeByID('3', n_a, n_a, { directed: true });
			e_4 = graph.addEdgeByID('4', n_a, n_b, { directed: true });
			e_5 = graph.addEdgeByID('5', n_a, n_d, { directed: true });
			e_6 = graph.addEdgeByID('6', n_c, n_a, { directed: true });
			e_7 = graph.addEdgeByID('7', n_d, n_a, { directed: true });

			node_vana = new Node("42", { label: 'IAmNotInGraph' });

			expect(graph.nrNodes()).toBe(4);
			expect(graph.nrDirEdges()).toBe(5);
			expect(graph.nrUndEdges()).toBe(2);
			expect(graph.getMode()).toBe(GraphMode.MIXED);
		});


		test('should return the nodes list', () => {
			let nodes = graph.getNodes();
			expect(Object.keys(nodes).length).toBe(4);
			expect(nodes[n_a.getID()]).toBe(n_a);
			expect(nodes[n_b.getID()]).toBe(n_b);
			expect(nodes[n_c.getID()]).toBe(n_c);
			expect(nodes[n_d.getID()]).toBe(n_d);
		});


		test('should return the Dict of undirected edges', () => {
			let edges = graph.getUndEdges();
			expect(Object.keys(edges).length).toBe(2);
			expect(edges[e_1.getID()]).toBe(e_1);
			expect(edges[e_2.getID()]).toBe(e_2);
		});


		test('should return the Dict of directed edges', () => {
			let edges = graph.getDirEdges();
			expect(Object.keys(edges).length).toBe(5);
			expect(edges[e_3.getID()]).toBe(e_3);
			expect(edges[e_4.getID()]).toBe(e_4);
			expect(edges[e_5.getID()]).toBe(e_5);
			expect(edges[e_6.getID()]).toBe(e_6);
			expect(edges[e_7.getID()]).toBe(e_7);
		});


		test('should return the Array of undirected edges', () => {
			let edges = graph.getUndEdgesArray();
			expect(edges.length).toBe(2);
			expect(edges).toEqual(expect.arrayContaining([e_1]));
			expect(edges).toEqual(expect.arrayContaining([e_2]));
		});


		test('should return the Array of directed edges', () => {
			let edges = graph.getDirEdgesArray();
			expect(edges.length).toBe(5);
			expect(edges).toEqual(expect.arrayContaining([e_3]));
			expect(edges).toEqual(expect.arrayContaining([e_4]));
			expect(edges).toEqual(expect.arrayContaining([e_5]));
			expect(edges).toEqual(expect.arrayContaining([e_6]));
			expect(edges).toEqual(expect.arrayContaining([e_7]));
		});


		test('should return the correct graph density w.r.t. directed edges', () => {
			const stats: GraphStats = graph.getStats();
			expect(stats.density_dir).toBe(5 / 12);
		});


		test('should return the correct graph density w.r.t. UNdirected edges', () => {
			const stats: GraphStats = graph.getStats();
			expect(stats.density_und).toBe(4 / 12);
		});


		test('should output the correct degree distribution', () => {
			let deg_dist: DegreeDistribution = degCent.degreeDistribution(graph);
			expect(deg_dist.und).toEqual(new Uint32Array([1, 2, 1, 0, 0, 0, 0, 0, 0]));
			expect(deg_dist.in).toEqual(new Uint32Array([1, 2, 0, 1, 0, 0, 0, 0, 0]));
			expect(deg_dist.out).toEqual(new Uint32Array([1, 2, 0, 1, 0, 0, 0, 0, 0]));
			expect(deg_dist.dir).toEqual(new Uint32Array([0, 2, 1, 0, 0, 0, 1, 0, 0]));
			expect(deg_dist.all).toEqual(new Uint32Array([0, 0, 3, 0, 0, 0, 0, 0, 1]));
		});


		test('should throw an error when trying to remove a non-existing edge', () => {
			let loose_edge = new Edge('IdontExistInGraph', n_a, n_b);
			expect(graph.deleteEdge.bind(graph, loose_edge)).toThrowError('cannot remove non-existing edge.');
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
		test(
			'should remove an existing undirected edge, updating graph and node stats',
			() => {
				let graph_nr_nodes = graph.nrNodes(),
					graph_nr_dir_edges = graph.nrDirEdges(),
					graph_nr_und_edges = graph.nrUndEdges(),
					n_a_deg = n_a.deg,
					n_a_in_deg = n_a.in_deg,
					n_a_out_deg = n_a.out_deg,
					n_b_deg = n_b.deg,
					n_b_in_deg = n_b.in_deg,
					n_b_out_deg = n_b.out_deg;

				graph.deleteEdge(e_1);

				expect(graph.nrNodes()).toBe(graph_nr_nodes);
				expect(graph.nrDirEdges()).toBe(graph_nr_dir_edges);
				expect(graph.nrUndEdges()).toBe(graph_nr_und_edges - 1);
				expect(n_a.deg).toBe(n_a_deg - 1);
				expect(n_a.out_deg).toBe(n_a_out_deg);
				expect(n_a.in_deg).toBe(n_a_in_deg);
				expect(n_b.deg).toBe(n_b_deg - 1);
				expect(n_b.out_deg).toBe(n_b_out_deg);
				expect(n_b.in_deg).toBe(n_b_in_deg);
				expect(graph.getMode()).toBe(GraphMode.MIXED);
			}
		);


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
		test(
			'should remove an existing directed edge, updating graph and node stats',
			() => {
				let graph_nr_nodes = graph.nrNodes(),
					graph_nr_dir_edges = graph.nrDirEdges(),
					graph_nr_und_edges = graph.nrUndEdges(),
					n_a_deg = n_a.deg,
					n_a_in_deg = n_a.in_deg,
					n_a_out_deg = n_a.out_deg,
					n_b_deg = n_b.deg,
					n_b_in_deg = n_b.in_deg,
					n_b_out_deg = n_b.out_deg;

				graph.deleteEdge(e_4);

				expect(graph.nrNodes()).toBe(graph_nr_nodes);
				expect(graph.nrDirEdges()).toBe(graph_nr_dir_edges - 1);
				expect(graph.nrUndEdges()).toBe(graph_nr_und_edges);
				expect(n_a.out_deg).toBe(n_a_out_deg - 1);
				expect(n_a.in_deg).toBe(n_a_in_deg);
				expect(n_a.deg).toBe(n_a_deg);
				expect(n_b.out_deg).toBe(n_b_out_deg);
				expect(n_b.in_deg).toBe(n_b_in_deg - 1);
				expect(n_b.deg).toBe(n_b_deg);
				expect(graph.getMode()).toBe(GraphMode.MIXED);
			}
		);


		/**
		 * delete ALL UNDIRECTED edges
		 * e_1 + e_2 deleted
		 * we trust node degrees as per earlier examples
		 * graph still has 4 nodes
		 * graph has same number of directed edges
		 * graph has 0 undirected edges
		 * graph is now in DIRECTED _mode
		 */
		test(
			'should remove ALL undirected edges, bringing the graph into DIRECTED _mode',
			() => {
				let graph_nr_dir_edges = graph.nrDirEdges();

				graph.deleteEdge(e_1);
				graph.deleteEdge(e_2);

				expect(graph.nrDirEdges()).toBe(graph_nr_dir_edges);
				expect(graph.nrUndEdges()).toBe(0);
				expect(graph.getMode()).toBe(GraphMode.DIRECTED);
			}
		);


		/**
		 * delete ALL DIRECTED edges
		 * e_3 - e_7 deleted
		 * we trust node stats as per earlier examples
		 * graph has same number of undirected edges
		 * graph has 0 directed edges
		 * graph is now in UNDIRECTED _mode
		 */
		test(
			'should remove ALL directed edges, bringing the graph into UNDIRECTED _mode',
			() => {
				let graph_nr_und_edges = graph.nrUndEdges();

				graph.deleteEdge(e_3);
				graph.deleteEdge(e_4);
				graph.deleteEdge(e_5);
				graph.deleteEdge(e_6);
				graph.deleteEdge(e_7);

				expect(graph.nrUndEdges()).toBe(graph_nr_und_edges);
				expect(graph.nrDirEdges()).toBe(0);
				expect(graph.getMode()).toBe(GraphMode.UNDIRECTED);
			}
		);


		/**
		 * delete ALL edges
		 * e_1 - e_7 deleted
		 * we trust node stats as per earlier examples
		 * graph has 0 undirected edges
		 * graph has 0 directed edges
		 * graph is now in INIT _mode
		 */
		test(
			'should remove ALL directed edges, bringing the graph into UNDIRECTED _mode',
			() => {
				graph.deleteEdge(e_1);
				graph.deleteEdge(e_2);
				graph.deleteEdge(e_3);
				graph.deleteEdge(e_4);
				graph.deleteEdge(e_5);
				graph.deleteEdge(e_6);
				graph.deleteEdge(e_7);

				expect(graph.nrUndEdges()).toBe(0);
				expect(graph.nrDirEdges()).toBe(0);
				expect(graph.getMode()).toBe(GraphMode.INIT);
			}
		);



		/**
		 * Node deletion of un-added node
		 */
		test('should throw an error when trying to remove an a foreign node', () => {
			expect(graph.deleteNode.bind(graph, node_vana)).toThrowError('Cannot remove a foreign node.');
		});


		/**
		 * Node deletion WITHOUT edges
		 */
		test('should simply delete an unconnected node', () => {
			let node = graph.addNodeByID('IAmInGraph');
			let nr_nodes = graph.nrNodes();
			graph.deleteNode(node);
			expect(graph.nrNodes()).toBe(nr_nodes - 1);
		});


		/**
		 * Node outgoing edge deletion on NODE_VANA
		 */
		test(
			'should throw an error when trying to delete outgoing edges of a foreign node',
			() => {
				expect(graph.deleteOutEdgesOf.bind(graph, node_vana)).toThrowError('Cowardly refusing to delete edges of a foreign node.');
			}
		);


		/**
		 * Node edge deletion => outgoing edges
		 */
		test('should correctly delete all outgoing edges of a node', () => {
			graph.deleteOutEdgesOf(n_a);
			expect(n_a.out_deg).toBe(0);
			expect(n_a.in_deg).toBe(2);
			expect(n_b.in_deg).toBe(0);
			expect(n_d.in_deg).toBe(0);
			expect(graph.nrDirEdges()).toBe(2);
			expect(graph.getMode()).toBe(GraphMode.MIXED);
		});


		/**
		 * Node incoming edge deletion on NODE_VANA
		 */
		test(
			'should throw an error when trying to delete incoming edges of a foreign node',
			() => {
				expect(graph.deleteInEdgesOf.bind(graph, node_vana)).toThrowError('Cowardly refusing to delete edges of a foreign node.');
			}
		);


		/**
		 * Node edge deletion => incoming edges
		 */
		test('should correctly delete all incoming edges of a node', () => {
			graph.deleteInEdgesOf(n_a);
			expect(n_a.in_deg).toBe(0);
			expect(n_a.out_deg).toBe(2);
			expect(n_c.out_deg).toBe(0);
			expect(n_d.out_deg).toBe(0);
			expect(graph.nrDirEdges()).toBe(2);
			expect(graph.getMode()).toBe(GraphMode.MIXED);
		});


		/**
		 * Node directed edge deletion on NODE_VANA
		 */
		test(
			'should throw an error when trying to delete directed edges of a foreign node',
			() => {
				expect(graph.deleteDirEdgesOf.bind(graph, node_vana)).toThrowError('Cowardly refusing to delete edges of a foreign node.');
			}
		);


		/**
		 * Node edge deletion => directed edges
		 */
		test('should correctly delete all directed edges of a node', () => {
			graph.deleteDirEdgesOf(n_a);
			expect(n_a.in_deg).toBe(0);
			expect(n_a.out_deg).toBe(0);
			expect(n_b.in_deg).toBe(0);
			expect(n_c.out_deg).toBe(0);
			expect(n_d.in_deg).toBe(0);
			expect(n_d.out_deg).toBe(0);
			expect(graph.nrDirEdges()).toBe(0);
			expect(graph.nrUndEdges()).toBe(2);
			expect(graph.getMode()).toBe(GraphMode.UNDIRECTED);
		});


		/**
		 * Node undirected edge deletion on NODE_VANA
		 */
		test(
			'should throw an error when trying to delete undirected edges of a foreign node',
			() => {
				expect(graph.deleteUndEdgesOf.bind(graph, node_vana)).toThrowError('Cowardly refusing to delete edges of a foreign node.');
			}
		);


		/**
		 * Node edge deletion => undirected edges
		 */
		test('should correctly delete all undirected edges of a node', () => {
			graph.deleteUndEdgesOf(n_a);
			expect(n_a.deg).toBe(0);
			expect(n_b.deg).toBe(0);
			expect(n_c.deg).toBe(0);
			expect(graph.nrUndEdges()).toBe(0);
			expect(graph.nrDirEdges()).toBe(5);
			expect(graph.getMode()).toBe(GraphMode.DIRECTED);
		});


		/**
		 * Node ALL edge deletion on NODE_VANA
		 */
		test(
			'should throw an error when trying to delete all edges of a foreign node',
			() => {
				expect(graph.deleteAllEdgesOf.bind(graph, node_vana)).toThrowError('Cowardly refusing to delete edges of a foreign node.');
			}
		);


		/**
		 * Node edge deletion => all edges
		 */
		test('should correctly delete all edges of a node', () => {
			graph.deleteAllEdgesOf(n_a);
			expect(graph.nrDirEdges()).toBe(0);
			expect(graph.nrUndEdges()).toBe(0);
			expect(graph.getMode()).toBe(GraphMode.INIT);
		});


		/**
		 * Node deletion WITH edges
		 * Delete C node -> only 2 edges, 1 undirected and 1 directed
		 * A node should have 1 less undirected and 1 less incoming
		 * graph should still be in mixed _mode
		 */
		test('should correctly delete a node including edges, test case 1', () => {
			graph.deleteNode(n_c);
			expect(n_a.deg).toBe(1);
			expect(n_a.in_deg).toBe(2);
			expect(graph.nrNodes()).toBe(3);
			expect(graph.nrDirEdges()).toBe(4);
			expect(graph.nrUndEdges()).toBe(1);
			expect(graph.getMode()).toBe(GraphMode.MIXED);
		});


		/**
		 * Node deletion WITH edges
		 * Delete A node -> connected to ALL edges
		 * graph and all remaining nodes should be left without edges
		 * graph should be in INIT _mode...
		 */
		test('should correctly delete a node including edges, test case 2', () => {
			graph.deleteNode(n_a);
			expect(graph.nrDirEdges()).toBe(0);
			expect(graph.nrUndEdges()).toBe(0);
			expect(graph.nrNodes()).toBe(3);
			expect(graph.getMode()).toBe(GraphMode.INIT);
		});

	});


	describe('Clearing ALL (un)directed edges from a graph', () => {
		let test_graph_file = `${CSV_DATA_PATH}/small_graph_adj_list_def_sep.csv`;

		test('should delete all directed edges from a graph', () => {
			graph = csv.readFromAdjacencyListFile(test_graph_file);
			expect(graph.nrDirEdges()).toBe(5);
			expect(graph.nrUndEdges()).toBe(2);
			graph.clearAllDirEdges();
			expect(graph.nrDirEdges()).toBe(0);
			expect(graph.nrUndEdges()).toBe(2);
		});

		test('should delete all undirected edges from a graph', () => {
			graph = csv.readFromAdjacencyListFile(test_graph_file);
			expect(graph.nrDirEdges()).toBe(5);
			expect(graph.nrUndEdges()).toBe(2);
			graph.clearAllUndEdges();
			expect(graph.nrDirEdges()).toBe(5);
			expect(graph.nrUndEdges()).toBe(0);
		});

		test('should delete ALL edges from a graph', () => {
			graph = csv.readFromAdjacencyListFile(test_graph_file);
			expect(graph.nrDirEdges()).toBe(5);
			expect(graph.nrUndEdges()).toBe(2);
			graph.clearAllEdges();
			expect(graph.nrDirEdges()).toBe(0);
			expect(graph.nrUndEdges()).toBe(0);
		});

	});


	describe('Graph cloning - ', () => {

		let clone_graph: $G.IGraph = null;
		let json_in: JSONInput;

		beforeEach(() => {
			expect(clone_graph).toBeNull();
		});

		afterEach(() => {
			clone_graph = null;
		});


		test('should successfully clone an empty graph', () => {
			const label = 'attackOfTheCloneGraph';
			graph = new $G.BaseGraph(label);
			clone_graph = graph.cloneStructure();
			expect(clone_graph.label).toBe(label);
			expect(clone_graph.nrNodes()).toBe(0);
			expect(clone_graph.nrUndEdges()).toBe(0);
			expect(clone_graph.nrDirEdges()).toBe(0);
			expect(clone_graph.getMode()).toBe(GraphMode.INIT);
			expect(clone_graph.getNodes()).toEqual({});
			expect(clone_graph.getUndEdges()).toEqual({});
			expect(clone_graph.getDirEdges()).toEqual({});
		});


		test(
			'should successfully clone an graph with a node plus nested feature vector',
			() => {
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
				clone_graph = graph.cloneStructure();
				expect(clone_graph.label).toBe(graph.label);
				expect(clone_graph.nrNodes()).toBe(1);
				expect(clone_graph.nrUndEdges()).toBe(0);
				expect(clone_graph.nrDirEdges()).toBe(0);
				expect(clone_graph.getMode()).toBe(GraphMode.INIT);
				expect(clone_graph.getNodeById("A")).toEqual(n_a);
			}
		);


		test(
			'should successfully clone an graph with two nodes and one undirected edge',
			() => {
				graph = new $G.BaseGraph("two_node_graph");
				let n_a = graph.addNodeByID("A");
				let n_b = graph.addNodeByID("B");
				let edgy = graph.addEdgeByID("edgy", n_a, n_b, { directed: false });

				clone_graph = graph.cloneStructure();
				expect(clone_graph.label).toBe(graph.label);
				expect(clone_graph.nrNodes()).toBe(2);
				expect(clone_graph.nrUndEdges()).toBe(1);
				expect(clone_graph.nrDirEdges()).toBe(0);
				expect(clone_graph.getMode()).toBe(GraphMode.UNDIRECTED);
			}
		);


		test(
			'should successfully clone an graph with two nodes and one directed edge',
			() => {
				graph = new $G.BaseGraph("two_node_graph");
				let n_a = graph.addNodeByID("A");
				let n_b = graph.addNodeByID("B");
				let edgy = graph.addEdgeByID("edgy", n_a, n_b, { directed: true });

				clone_graph = graph.cloneStructure();
				expect(clone_graph.label).toBe(graph.label);
				expect(clone_graph.nrNodes()).toBe(2);
				expect(clone_graph.nrUndEdges()).toBe(0);
				expect(clone_graph.nrDirEdges()).toBe(1);
				expect(clone_graph.getMode()).toBe(GraphMode.DIRECTED);
			}
		);


		/**
		 * The toy graph example
		 */
		test(
			'should successfully clone a toy graph in explicit mode including weights',
			() => {
				json_in = new JSONInput({ explicit_direction: true, directed: false, weighted: true });
				graph = json_in.readFromJSONFile(small_graph_file);
				let deg_dist_all = degCent.degreeDistribution(graph).all;
				clone_graph = graph.cloneStructure();
				let clone_deg_dist_all = degCent.degreeDistribution(clone_graph).all;
				expect(clone_graph.nrNodes()).toBe(SMALL_GRAPH_NR_NODES);
				expect(clone_graph.nrUndEdges()).toBe(SMALL_GRAPH_NR_UND_EDGES);
				expect(clone_graph.nrDirEdges()).toBe(SMALL_GRAPH_NR_DIR_EDGES);
				expect(clone_deg_dist_all).toEqual(deg_dist_all);
				expect(clone_graph).toEqual(graph);
			}
		);

	});


	describe('negative cycle checks - ', () => {

		let graph: $G.IGraph,
			graph_bernd: $G.IGraph,
			graph_negcycle_multicomp: $G.IGraph,
			json: JSONInput,
			n_a: $N.IBaseNode,
			n_b: $N.IBaseNode,
			n_c: $N.IBaseNode,
			e_1: $E.IBaseEdge,
			e_2: $E.IBaseEdge,
			e_3: $E.IBaseEdge,
			e_4: $E.IBaseEdge,
			e_5: $E.IBaseEdge,
			e_6: $E.IBaseEdge;

		let isWeightedSpy_e1,
			isWeightedSpy_e5;


		beforeEach(() => {
			json = new JSONInput({ explicit_direction: true, directed: false, weighted: true });
			graph = new $G.BaseGraph("positive weight graph");
			graph_negcycle_multicomp = json.readFromJSONFile(neg_cycle_multi_component_file);
			n_a = graph.addNodeByID("A");
			n_b = graph.addNodeByID("B");
			n_c = graph.addNodeByID("C");
			e_1 = graph.addEdgeByID("1", n_a, n_b, { directed: true, weighted: true, weight: 1 });
			e_2 = graph.addEdgeByID("2", n_b, n_c, { directed: true, weighted: true, weight: 2 });
			e_3 = graph.addEdgeByID("3", n_c, n_a, { directed: true, weighted: true, weight: 3 });
			e_4 = graph.addEdgeByID("4", n_a, n_c, { directed: false, weighted: true, weight: 42 });
			e_5 = graph.addEdgeByID("5", n_a, n_b, { directed: false, weighted: false });
			e_6 = graph.addEdgeByID("6", n_a, n_c, { directed: true, weighted: false });

			isWeightedSpy_e1 = jest.spyOn(e_1, 'isWeighted');
			isWeightedSpy_e5 = jest.spyOn(e_5, 'isWeighted');
		});


		afterEach(() => {
			/** This is used to restore the original isWeighted function
				*@todo figure out if necessary...
				*/
			jest.restoreAllMocks();
		});


		test(
			'should have called isWeighted on e_1 and e_6 once each and returned true and false, respectively',
			() => {
				graph.hasNegativeEdge();
				expect(isWeightedSpy_e1).toHaveBeenCalledTimes(1);
				expect(isWeightedSpy_e1).toHaveReturnedWith(true);
				expect(isWeightedSpy_e5).toHaveBeenCalledTimes(1);
				expect(isWeightedSpy_e5).toHaveReturnedWith(false);
			}
		);


		test(
			'should correclty detect a graph with solely positive edges via hasNegativeEdge method',
			() => {
				expect(graph.hasNegativeEdge()).toBe(false);
			}
		);


		test('should correclty detect a graph with a negative UNdirected edge', () => {
			e_4.setWeight(-42);
			expect(graph.hasNegativeEdge()).toBe(true);
		});


		test('should correclty detect a graph with a negative directed edge', () => {
			e_1.setWeight(-42);
			expect(graph.hasNegativeEdge()).toBe(true);
		});


		test(
			'should correclty detect a graph with solely positive edges via hasNegativeCycle method',
			() => {
				expect(graph.hasNegativeCycles(n_a)).toBe(false);
			}
		);


		test(
			'should correctly detect a graph with negative edges but no negative cycle',
			() => {
				e_2.setWeight(-2);
				expect(graph.hasNegativeCycles(n_a)).toBe(false);
			}
		);


		test('should correctly detect a graph with negative cycle', () => {
			e_2.setWeight(-5);
			expect(graph.hasNegativeCycles(n_a)).toBe(true);
		});


		test(
			'should correctly detect a negative undirected edge as negative cycle',
			() => {
				e_2.setWeight(5);
				graph.addEdgeByID("Negative Undie", n_a, n_b, { weighted: true, weight: -1 });
				expect(graph.hasNegativeCycles()).toBe(true);
			}
		);


		test('negative cycle multi-component graph should have 2 components', () => {
			expect(DFS(graph_negcycle_multicomp, graph_negcycle_multicomp.getNodeById("S")).length).toBe(2);
		});


		test(
			'should correctly detect a negative cycle in a multi-component graph',
			() => {
				expect(graph_negcycle_multicomp.hasNegativeCycles(graph_negcycle_multicomp.getNodeById("S"))).toBe(true);
			}
		);

	});


	describe.skip("Graph PROJECTIONS - ", () => {

		const jsonReader = new JSONInput();

		describe('empty and trivial graphs - ', () => {

			beforeEach(() => {
				graph = new $G.BaseGraph("emptinius");
				expect(graph).toBeDefined();
				expect(graph.getMode()).toBe(GraphMode.INIT);
				expect(graph.nrNodes()).toBe(0);
				expect(graph.nrDirEdges()).toBe(0);
				expect(graph.nrUndEdges()).toBe(0);
			});


			test('should throw an error if we hand it an empty graph', () => {
				// graph is emptinius...
				expect(graph.toDirectedGraph.bind(graph)).toThrowError("Cowardly refusing to re-interpret an empty graph.");
			});


			test(
				'should return the same directed graph if all edges were directed before',
				() => {
					let digraph_file = "./test/data/search_graph_pfs.json";
					let json = new JSONInput({ explicit_direction: true, directed: true, weighted: false });
					let digraph = json.readFromJSONFile(digraph_file);
					expect(digraph).toBeDefined();
					expect(digraph.nrNodes()).toBe(6);
					expect(digraph.nrDirEdges()).toBe(9);
					expect(digraph.nrUndEdges()).toBe(0);
					expect(digraph.toDirectedGraph()).toBe(digraph);
				}
			);


			test(
				'should return a copy of the same directed graph if all edges were directed before',
				() => {
					let digraph_file = "./test/data/search_graph_pfs.json";
					let json = new JSONInput({ explicit_direction: true, directed: true, weighted: false });
					let digraph = json.readFromJSONFile(digraph_file);
					expect(digraph).toBeDefined();
					expect(digraph.nrNodes()).toBe(6);
					expect(digraph.nrDirEdges()).toBe(9);
					expect(digraph.nrUndEdges()).toBe(0);

					let res_graph = digraph.toDirectedGraph(true);
					expect(res_graph).not.toBe(digraph); // refs
					expect(res_graph).toEqual(digraph); // content
				}
			);


			test.skip('should return the same UNdirected graph if all edges were UNdirected before', () => {

			}
			);


			// test('should return a directed graph when all edges were UNdirected before', () => {

			// });


			test.skip('should return an UNdirected graph when all edges were directed before', () => {

			}
			);

		});


		describe('MIXED graph', () => {

			beforeEach(() => {
				graph = jsonReader.readFromJSONFile(small_graph_file);
				expect(graph).toBeDefined();
				expect(graph.getMode()).toBe(GraphMode.MIXED);
				expect(graph.nrNodes()).toBe(4);
				expect(graph.nrDirEdges()).toBe(5);
				expect(graph.nrUndEdges()).toBe(2);
			});


			test.skip("should correctly project all directed edges as UNdirected", () => {

			});


			test.skip("should correctly project all UNdirected edges as directed", () => {

			});

		});

	});


	describe('testing node histogram sets - ', () => {

		let g: $G.IGraph = null;
		const json = new JSONInput();

		beforeAll(() => {
			g = json.readFromJSONFile(search_graph_file);
			logger.log(g.stats);
		});


		/* degrees 0-2 */
		it('should show the correct IN-histogram for the small graph', () => {
			expect(g.inHist).toEqual([
				new Set([g.n('G')]),
				new Set([g.n('A'), g.n('B'), g.n('C'), g.n('D'), g.n('E'),]),
				new Set([g.n('F')])
			]);
		});


		/* degrees 0-3 */
		it('should show the correct OUT-histogram for the small graph', () => {
			expect(g.outHist).toEqual([
				new Set([g.n('B'), g.n('F'), g.n('G')]),
				new Set([g.n('C'), g.n('E')]),
				new Set([g.n('D')]),
				new Set([g.n('A')])
			]);
		});


		/* degrees 0-1 */
		it('should show the correct CONN-histogram for the small graph', () => {
			expect(g.connHist).toEqual([
				new Set([g.n('B'), g.n('E'), g.n('F'), g.n('G'),]),
				new Set([g.n('A'), g.n('C'), g.n('D')])
			]);
		});

	});

});
