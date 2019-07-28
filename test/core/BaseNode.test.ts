import * as $N from '../../src/core/BaseNode';
import * as $E from '../../src/core/BaseEdge';
import { JSONInput, IJSONInConfig } from '../../src/io/input/JSONInput';

let Edge = $E.BaseEdge;

var small_graph_file = "./test/test_data/small_graph.json",
	json_in = new JSONInput({explicit_direction: false, directed: false, weighted: false}),
	small_graph = json_in.readFromJSONFile(small_graph_file);

/**
 * TODO Test
 */
function collectNodesFromNeighbors(neighbors: Array<$N.NeighborEntry>): Array<$N.IBaseNode> {
	var nodes: Array<$N.IBaseNode> = [];
	for (var n_idx in neighbors) {
		nodes.push(neighbors[n_idx].node);
	}
	return nodes;
}


describe('==== NODE TESTS ====', () => {
	var id = "New Node";

	describe('Basic node instantiation', () => {
		test('should correclty instantiate a node with id', () => {
			var node = new $N.BaseNode(id);
			expect(node.getID()).toBe(id);
		});

		test('should set default label to ID', () => {
			var node = new $N.BaseNode(id);
			expect(node.getLabel()).toBe(id);
		});

		test('should correclty instantiate a node with label', () => {
			var label = "New Label";
			var node = new $N.BaseNode(id, { label: label });
			expect(node.getLabel()).toBe(label);
		});

		test('should allow setting new label', () => {
			var label = "New Label";
			var node = new $N.BaseNode(id, { label: label });
			expect(node.getLabel()).toBe(label);
			node.setLabel("Even newer");
			expect(node.getLabel()).toBe("Even newer");
		});

		test(
			'should automatically report all degree values as zero upon instantiations',
			() => {
				var node = new $N.BaseNode(id);
				expect(node.inDegree()).toBe(0);
				expect(node.outDegree()).toBe(0);
				expect(node.degree()).toBe(0);
			}
		);
	});


	describe('Node FEATURE vector tests', () => {
		var feats = { name: 'Bernie', age: 36, future: 'Billionaire' };
		var node = new $N.BaseNode(id, feats);

		test('should correctly set default features to an empty hash object', () => {
			expect(node.getFeatures()).toBeInstanceOf(Object);
			expect(Object.keys(node.getFeatures()).length).toBe(3);
		});

		test('should correctly set features to specified object', () => {
			expect(node.getFeatures()).toBeInstanceOf(Object);
			expect(Object.keys(node.getFeatures()).length).toBe(3);
			expect(node.getFeatures()['name']).toBe('Bernie');
		});

		// it('should throw an error when trying to retrieve a non-set feature', () => {
		// 	expect(node.getFeature.bind(node, 'nokey')).to.throw("Cannot retrieve non-existing feature.");
		// });

		test('should correctly retrieve a set feature', () => {
			expect(node.getFeature('future')).toBe('Billionaire');
		});

		test('should allow to set new feature', () => {
			expect(Object.keys(node.getFeatures()).length).toBe(3);
			node.setFeature('founder', 'Lemontiger');
			expect(Object.keys(node.getFeatures()).length).toBe(4);
			expect(node.getFeature('founder')).toBe('Lemontiger');
		});

		test(
			'should automatically overwrite an existing feature upon renewed setting',
			() => {
				node.setFeatures(feats);
				expect(Object.keys(node.getFeatures()).length).toBe(3);
				node.setFeature('future', 'Bazillionaire');
				expect(Object.keys(node.getFeatures()).length).toBe(3);
				expect(node.getFeature('future')).toBe('Bazillionaire');
			}
		);

		// it('should throw an error upon trying to delete an unset feature', () => {
		// 	expect(node.deleteFeature.bind(node, 'nokey')).to.throw("Cannot delete non-existing feature.");
		// });

		test('should duly eradicate a given feature', () => {
			expect(Object.keys(node.getFeatures()).length).toBe(3);
			expect(node.deleteFeature('age')).toBe(36);
			expect(Object.keys(node.getFeatures()).length).toBe(2);
		});

		test('should allow to replace the whole feature vector', () => {
			var feats = { name: 'Bernie', age: '36', future: 'Billionaire' };
			var node = new $N.BaseNode(id, feats);
			expect(Object.keys(node.getFeatures()).length).toBe(3);
			node.setFeatures({});
			expect(Object.keys(node.getFeatures()).length).toBe(0);
		});

		test('should allow to clear the whole feature vector', () => {
			var feats = { name: 'Bernie', age: '36', future: 'Billionaire' };
			var node = new $N.BaseNode(id, feats);
			expect(Object.keys(node.getFeatures()).length).toBe(3);
			node.clearFeatures();
			expect(Object.keys(node.getFeatures()).length).toBe(0);
		});
	});


	describe('Node edge addition / query / removal tests - ', () => {
		var node_a = new $N.BaseNode(id),
			node_b = new $N.BaseNode(id),
			e_id = "Edgy";


		describe('Node edge addition tests', () => {

			test('should throw an error if we add an unrelated edge', () => {
				var node_c = new $N.BaseNode('9999', { label: 'Not connected to node_a' });
				var edge = new $E.BaseEdge(e_id, node_b, node_c);

				expect(node_a.addEdge.bind(node_a, edge)).toThrowError("Cannot add edge that does not connect to this node");
			});

			test(
				'should throw an error if we try to add an unidrected edge more than once',
				() => {
					var edge = new $E.BaseEdge(e_id, node_a, node_b, {
						directed: false
					});

					/**
					 * Adding the same undirected edge twice is not necessary, even in the
					 * case the edge is a loop.
					 * This case should be handled by the graph class correctly, so we need
					 * to throw an error in case the graph class is wrongly implemented.
					 */
					node_a.addEdge(edge);
					// here we should get an exception for duplicate undirected edge
					expect(node_a.addEdge.bind(node_a, edge)).toThrowError("Cannot add same undirected edge multiple times.");
				}
			);

			test(
				'should not throw an error if we try to connect the same edge (ID) as incoming and outgoing (the node then belongs to its own prevs and nexts)..',
				() => {
					var edge = new $E.BaseEdge(e_id, node_a, node_a, {
						directed: true
					});
					var in_deg = node_a.inDegree();
					var out_deg = node_a.outDegree();
					expect(node_a.addEdge.bind(node_a, edge)).not.toThrowError("Cannot add same undirected edge multiple times.");
					expect(node_a.addEdge.bind(node_a, edge)).not.toThrowError("Cannot add same undirected edge multiple times.");
					expect(node_a.inDegree()).toBe(in_deg + 1);
					expect(node_a.outDegree()).toBe(out_deg + 1);
				}
			);


			/**
			 * A LOT has is to be expected here...
			 * 1. an edge should have been added
			 * 2. in degree should still be 0
			 * 3. out degree should still be 0
			 * 4. dir degree should still be 0
			 * 5. und degree should be 1
			 * 6. all degree should be 1
			 * We only test on ONE node per case,
			 * as the graph class will encapsulte
			 * adding edges to both nodes on its level.
			 */
			test('should correctly add an undirected edge and recompute degrees', () => {
				// Clear up the node first..
				node_a.clearEdges();
				var edge = new $E.BaseEdge(e_id, node_a, node_b, {
					directed: false
				});
				var in_deg_a = node_a.inDegree(),
					out_deg_a = node_a.outDegree(),
					dir_deg_a = node_a.degree();

				node_a.addEdge(edge);

				expect(node_a.inDegree()).toBe(in_deg_a);
				expect(node_a.outDegree()).toBe(out_deg_a);
				expect(node_a.degree()).toBe(dir_deg_a + 1);
			});


			test('should correctly add an outgoing edge and recompute degrees', () => {
				node_a.clearEdges();
				var edge = new $E.BaseEdge(e_id, node_a, node_b, {
					directed: true
				});
				var in_deg_a = node_a.inDegree(),
					out_deg_a = node_a.outDegree(),
					dir_deg_a = node_a.degree();

				node_a.addEdge(edge);
				expect(node_a.getEdge(edge.getID())).toBe(edge);

				expect(node_a.inDegree()).toBe(in_deg_a);
				expect(node_a.outDegree()).toBe(out_deg_a + 1);
				expect(node_a.degree()).toBe(dir_deg_a);
			});


			test('should correctly add an incoming edge and recompute degrees', () => {
				node_a.clearEdges();
				var edge = new $E.BaseEdge(e_id, node_b, node_a, {
					directed: true
				});
				var in_deg_a = node_a.inDegree(),
					out_deg_a = node_a.outDegree(),
					dir_deg_a = node_a.degree();

				node_a.addEdge(edge);
				expect(node_a.getEdge(edge.getID())).toBe(edge);

				expect(node_a.inDegree()).toBe(in_deg_a + 1);
				expect(node_a.outDegree()).toBe(out_deg_a);
				expect(node_a.degree()).toBe(dir_deg_a);
			});

		});


		describe('Node single edge queries', () => {

			test('should assert that an added edge is connected by reference', () => {
				node_a.clearEdges();
				var edge = new $E.BaseEdge(e_id, node_a, node_b, {
					directed: false
				});
				node_a.addEdge(edge);
				expect(node_a.hasEdge(edge)).toBe(true);
			});

			test('should assert that an added edge is connected by ID', () => {
				node_a.clearEdges();
				var edge = new $E.BaseEdge(e_id, node_a, node_b, {
					directed: false
				});
				node_a.addEdge(edge);
				expect(node_a.hasEdgeID(edge.getID())).toBe(true);
			});

			test('should assert that non-existing edge is not connected by ID', () => {
				node_a.clearEdges();
				expect(node_a.hasEdgeID("Idontexist")).toBe(false);
			});

			test(
				'should throw an error upon trying to retrieve a non-existing edge',
				() => {
					node_a.clearEdges();
					expect(node_a.getEdge.bind(node_a, "Idontexist")).toThrowError("Cannot retrieve non-existing edge.");
				}
			);

			test('should correctly retrieve exising edge by ID', () => {
				node_a.clearEdges();
				var edge = new $E.BaseEdge(e_id, node_a, node_b, {
					directed: false
				});
				node_a.addEdge(edge);
				expect(node_a.getEdge(edge.getID())).toBe(edge);
			});

		});


		/**
			* for the next few tests, we will always pass the same structure
			* 4 nodes -> a, b, c, d
			* 2 undirected edges: a -> b, a -> c
			* 3 outgoing edges: a -> a, a -> b, a -> d
			* 2 incoming edges: c -> a, d -> a
			* we instantiate the whole thing in the outer describe block and
			* then check if the different types of Edges were correctly set
			* by the node class.
			* Moreover, we will also test the implementations of the
			* prevNodes(), nextNodes() and undNodes() methods
			*/
		describe('a little more complex scenario - ', () => {

			var n_a = new $N.BaseNode("A", { label: "A" }),
				n_b = new $N.BaseNode("B", { label: "B" }),
				n_c = new $N.BaseNode("C", { label: "C" }),
				n_d = new $N.BaseNode("D", { label: "D" }),
				e_1 = new $E.BaseEdge("1", n_a, n_b, { label: "u_ab" }),
				e_2 = new $E.BaseEdge("2", n_a, n_c, { label: "u_ac" }),
				e_3 = new $E.BaseEdge("3", n_a, n_a, { label: "d_aa", directed: true }),
				e_4 = new $E.BaseEdge("4", n_a, n_b, { label: "d_ab", directed: true }),
				e_5 = new $E.BaseEdge("5", n_a, n_d, { label: "d_ad", directed: true }),
				e_6 = new $E.BaseEdge("6", n_c, n_a, { label: "d_ca", directed: true }),
				e_7 = new $E.BaseEdge("7", n_d, n_a, { label: "d_da", directed: true });
			n_a.addEdge(e_1);
			n_a.addEdge(e_2);
			n_a.addEdge(e_3);
			n_a.addEdge(e_4);
			n_a.addEdge(e_5);
			n_a.addEdge(e_6);
			n_a.addEdge(e_7);
			n_b.addEdge(e_1);
			n_b.addEdge(e_4);


			describe('degrees and retrieval', () => {

				test('should correctly have computed the degree structure', () => {
					expect(n_a.degree()).toBe(2);
					expect(n_a.outDegree()).toBe(3);
					expect(n_a.inDegree()).toBe(3);
				});

				test('should correctly retrieve undirected edges', () => {
					var unds = n_a.undEdges();
					expect(Object.keys(unds).length).toBe(2);
					expect(unds[1]).toBe(e_1);
					expect(unds[2]).toBe(e_2);
				});

				test('should correctly retrieve outgoing edges', () => {
					var outs = n_a.outEdges();
					expect(Object.keys(outs).length).toBe(3);
					expect(outs[3]).toBe(e_3);
					expect(outs[4]).toBe(e_4);
					expect(outs[5]).toBe(e_5);
				});

				test('should correctly retrieve incoming edges', () => {
					var ins = n_a.inEdges();
					expect(Object.keys(ins).length).toBe(3);
					expect(ins[3]).toBe(e_3);
					expect(ins[6]).toBe(e_6);
					expect(ins[7]).toBe(e_7);
				});

				test('should correctly retrieve all directed edges', () => {
					var dirs = n_a.dirEdges();
					expect(Object.keys(dirs).length).toBe(5);
					expect(dirs[3]).toBe(e_3);
					expect(dirs[4]).toBe(e_4);
					expect(dirs[5]).toBe(e_5);
					expect(dirs[6]).toBe(e_6);
					expect(dirs[7]).toBe(e_7);
				});

				test('should correctly retrieve ALL edges', () => {
					var alls = n_a.allEdges();
					expect(Object.keys(alls).length).toBe(7);
					expect(alls[1]).toBe(e_1);
					expect(alls[2]).toBe(e_2);
					expect(alls[3]).toBe(e_3);
					expect(alls[4]).toBe(e_4);
					expect(alls[5]).toBe(e_5);
					expect(alls[6]).toBe(e_6);
					expect(alls[7]).toBe(e_7);
				});

			});


			describe('previous, next, connected and adjacent nodes', () => {

				test('should find nodes c and d as previous nodes', () => {
					var prevs = collectNodesFromNeighbors(n_a.prevNodes());
					expect(prevs).toBeInstanceOf(Array);
					expect(prevs.length).toBe(3);
					expect(prevs).toContain(n_a);
					expect(prevs).toContain(n_c);
					expect(prevs).toContain(n_d);
				});

				test('should find nodes a, b and d as next nodes', () => {
					var nexts = collectNodesFromNeighbors(n_a.nextNodes());
					expect(nexts).toBeInstanceOf(Array);
					expect(nexts.length).toBe(3);
					expect(nexts).not.toContain(n_c);
					expect(nexts).toContain(n_a);
					expect(nexts).toContain(n_b);
					expect(nexts).toContain(n_d);
				});

				test('should find nodes b and c as connected (undirected) nodes', () => {
					var conns = collectNodesFromNeighbors(n_a.connNodes());
					expect(conns).toBeInstanceOf(Array);
					expect(conns.length).toBe(2);
					expect(conns).not.toContain(n_a);
					expect(conns).toContain(n_b);
					expect(conns).toContain(n_c);
				});

				test('should find nodes a, b, c and d as adjacent (reachable) nodes', () => {
					var adjs = collectNodesFromNeighbors(n_a.reachNodes((ne) => { return ne.node.getID() }));
					expect(adjs).toBeInstanceOf(Array);
					expect(adjs.length).toBe(4);
					expect(adjs).toContain(n_a);
					expect(adjs).toContain(n_b);
					expect(adjs).toContain(n_c);
					expect(adjs).toContain(n_d);
				});

				test('should find node a as undirected neighbor node from node b', () => {
					var conns = collectNodesFromNeighbors(n_b.connNodes());
					expect(conns).toBeInstanceOf(Array);
					expect(conns.length).toBe(1);
					expect(conns).toContain(n_a);
					expect(conns).not.toContain(n_b);
					expect(conns).not.toContain(n_c);
					expect(conns).not.toContain(n_d);
				});

				test('should find node a as directed previous neighbor from node b', () => {
					var prevs = collectNodesFromNeighbors(n_b.prevNodes());
					expect(prevs).toBeInstanceOf(Array);
					expect(prevs.length).toBe(1);
					expect(prevs).toContain(n_a);
					expect(prevs).not.toContain(n_b);
					expect(prevs).not.toContain(n_c);
					expect(prevs).not.toContain(n_d);
				});
			});


			describe('deletion of single edges by type', () => {

				var n_a, n_b, n_c, n_d,
					e_1, e_2, e_3, e_4, e_5, e_6, e_7, e_8;

				beforeEach( () => {
					n_a = new $N.BaseNode("A", { label: "A" }),
						n_b = new $N.BaseNode("B", { label: "B" }),
						n_c = new $N.BaseNode("C", { label: "C" }),
						n_d = new $N.BaseNode("D", { label: "D" }),
						e_1 = new $E.BaseEdge("1", n_a, n_b, { label: "u_ab" }),
						e_2 = new $E.BaseEdge("2", n_a, n_c, { label: "u_ac" }),
						e_3 = new $E.BaseEdge("3", n_a, n_a, { label: "d_aa", directed: true }),
						e_4 = new $E.BaseEdge("4", n_a, n_b, { label: "d_ab", directed: true }),
						e_5 = new $E.BaseEdge("5", n_a, n_d, { label: "d_ad", directed: true }),
						e_6 = new $E.BaseEdge("6", n_c, n_a, { label: "d_ca", directed: true }),
						e_7 = new $E.BaseEdge("7", n_d, n_a, { label: "d_da", directed: true }),
						e_8 = new $E.BaseEdge("8", n_a, n_a, { label: "d_da" });
					n_a.addEdge(e_1);
					n_a.addEdge(e_2);
					n_a.addEdge(e_3);
					n_a.addEdge(e_4);
					n_a.addEdge(e_5);
					n_a.addEdge(e_6);
					n_a.addEdge(e_7);
					n_a.addEdge(e_8);
				}
				);


				test('should throw an error upon trying to remove an unconnected edge', () => {
					expect(n_a.removeEdgeID.bind(n_a, 'menotexists')).toThrowError('Cannot remove unconnected edge.');
				});


				test('should confirm our expectations about node degrees in this example',
					() => {
						expect(Object.keys(n_a.inEdges()).length).toBe(3);
						expect(Object.keys(n_a.outEdges()).length).toBe(3);
						expect(Object.keys(n_a.undEdges()).length).toBe(3);
					}
				);


				test('should throw an Error when trying to delete non-connected edge', () => {
					var edginot = new $E.BaseEdge("Unconnected", n_b, n_c);
					expect(n_a.removeEdge.bind(n_a, edginot)).toThrowError("Cannot remove unconnected edge.");
				});


				test('should correctly delete an undirected edge by reference', () => {
					n_a.removeEdge(e_1);
					var unds = n_a.undEdges();
					expect(Object.keys(unds).length).toBe(2);
					expect(unds[1]).toBeUndefined();
					expect(unds[2]).toBe(e_2);
					expect(unds[8]).toBe(e_8);
				});


				test('should correctly delete an undirected edge by ID', () => {
					n_a.removeEdgeID(e_2.getID());
					var unds = n_a.undEdges();
					expect(Object.keys(unds).length).toBe(2);
					expect(unds[1]).toBe(e_1);
					expect(unds[2]).toBeUndefined();
					expect(unds[8]).toBe(e_8);
				});


				test(
					'should correctly delete an undirected loop edge by reference',
					() => {
						n_a.removeEdge(e_8);
						var unds = n_a.undEdges();
						expect(Object.keys(unds).length).toBe(2);
						expect(unds[1]).toBe(e_1);
						expect(unds[2]).toBe(e_2);
						expect(unds[8]).toBeUndefined();
					}
				);


				test('should correctly delete a directed loop edge by reference', () => {
					n_a.removeEdge(e_3);
					var outs = n_a.outEdges();
					expect(Object.keys(outs).length).toBe(2);
					expect(outs[3]).toBeUndefined();
					expect(outs[4]).toBe(e_4);
					expect(outs[5]).toBe(e_5);
				});


				test('should correctly delete an outgoing edge by reference', () => {
					n_a.removeEdge(e_5);
					var outs = n_a.outEdges();
					expect(Object.keys(outs).length).toBe(2);
					expect(outs[3]).toBe(e_3);
					expect(outs[4]).toBe(e_4);
					expect(outs[5]).toBeUndefined();
				});


				test('should correctly delete an outgoing edge by ID', () => {
					n_a.removeEdgeID(e_5.getID());
					var outs = n_a.outEdges();
					expect(Object.keys(outs).length).toBe(2);
					expect(outs[3]).toBe(e_3);
					expect(outs[4]).toBe(e_4);
					expect(outs[5]).toBeUndefined();
				});


				test('should correctly delete an incoming edge by reference', () => {
					n_a.removeEdge(e_6);
					var ins = n_a.inEdges();
					expect(Object.keys(ins).length).toBe(2);
					expect(ins[3]).toBe(e_3);
					expect(ins[6]).toBeUndefined();
					expect(ins[7]).toBe(e_7);
				});


				test('should correctly delete an incoming edge by ID', () => {
					n_a.removeEdgeID(e_7.getID());
					var ins = n_a.inEdges();
					expect(Object.keys(ins).length).toBe(2);
					expect(ins[3]).toBe(e_3);
					expect(ins[6]).toBe(e_6);
					expect(ins[7]).toBeUndefined();
				});

			});

		});


		describe('Node edge clearing', () => {
			var node_a,
				edge_1,
				edge_2,
				edge_3;


			beforeEach( () => {
				node_a = new $N.BaseNode(id);
				edge_1 = new $E.BaseEdge("1", node_a, node_b, {
					directed: false
				});
				edge_2 = new $E.BaseEdge("2", node_a, node_b, {
					directed: true
				});
				edge_3 = new $E.BaseEdge("3", node_b, node_a, {
					directed: true
				});
				node_a.addEdge(edge_1);
				node_a.addEdge(edge_2);
				node_a.addEdge(edge_3);
				expect(node_a.inDegree()).toBe(1);
				expect(node_a.outDegree()).toBe(1);
				expect(node_a.degree()).toBe(1);
			});


			test(
				'should clear all outgoing edges and update degrees accordingly',
				() => {
					node_a.clearOutEdges();
					expect(node_a.inDegree()).toBe(1);
					expect(node_a.outDegree()).toBe(0);
					expect(node_a.degree()).toBe(1);
				}
			);


			test('should clear all incoming edges and update degrees accordingly', () => {
				node_a.clearInEdges();
				expect(node_a.inDegree()).toBe(0);
				expect(node_a.outDegree()).toBe(1);
				expect(node_a.degree()).toBe(1);
			});


			test(
				'should clear all undirected edges and update degrees accordingly',
				() => {
					node_a.clearUndEdges();
					expect(node_a.inDegree()).toBe(1);
					expect(node_a.outDegree()).toBe(1);
					expect(node_a.degree()).toBe(0);
				}
			);


			test('should clear all edges and set degrees back to zero', () => {
				node_a.clearEdges();
				expect(node_a.inDegree()).toBe(0);
				expect(node_a.outDegree()).toBe(0);
				expect(node_a.degree()).toBe(0);
			});

		});

	});


	/**
	 * In cloning a node, we do not want to immediately clone it's edges
	 * since those will need to be handed the new nodes's reference
	 * later in it's cloning stage.. so we 
	 * 	- ignore edges for now..?
	 *  - put placeholders in their pace for now..?
	 * 	- so the degree of a cloned node will all be zero?
	 */
	describe("Node CLONE tests", () => {

		let node: $N.IBaseNode = null;
		let clone_node: $N.IBaseNode = null;


		beforeEach(() => {
			expect(node).toBeNull();
			expect(clone_node).toBeNull();
		});


		afterEach(() => {
			expect(clone_node.getID()).toBe(node.getID());
			expect(clone_node.getLabel()).toBe(node.getLabel());
			expect(clone_node.inDegree()).toBe(0);
			expect(clone_node.outDegree()).toBe(0);
			expect(clone_node.degree()).toBe(0);
			expect(clone_node.inEdges()).toEqual({});
			expect(clone_node.outEdges()).toEqual({});
			expect(clone_node.allEdges()).toEqual({});

			node = null;
			clone_node = null;
		});


		test('should return a new node upon cloning', () => {
			node = new $N.BaseNode("A");
			clone_node = node.clone();
			expect(clone_node).not.toBeUndefined();
			expect(clone_node).not.toBeNull();
			expect(clone_node).toBeInstanceOf($N.BaseNode);
		});


		test('should ignore undirected edges upon cloning', () => {
			node = new $N.BaseNode("A");
			node.addEdge(new $E.BaseEdge("someEdge", node, new $N.BaseNode("B")));
			clone_node = node.clone();
			expect(clone_node.degree()).toBe(0);
		});


		test('should ignore undirected edges upon cloning', () => {
			node = new $N.BaseNode("A");
			node.addEdge(new $E.BaseEdge("someEdge", node, new $N.BaseNode("B"), { directed: true }));
			clone_node = node.clone();
			expect(clone_node.outDegree()).toBe(0);
		});


		test('should ignore undirected edges upon cloning', () => {
			node = new $N.BaseNode("A");
			node.addEdge(new $E.BaseEdge("someEdge", new $N.BaseNode("B"), node, { directed: true }));
			clone_node = node.clone();
			expect(clone_node.inDegree()).toBe(0);
		});


		test('should correctly clone features of a defined node', () => {
			node = small_graph.getNodeById("A");
			clone_node = node.clone();
			expect(clone_node.getFeatures()).toEqual(node.getFeatures());
		});


		test('should ignore references to edges in node features', () => {
			node = small_graph.getNodeById("A");
			let other_node = new $N.BaseNode("B");
			let edge = new $E.BaseEdge("someEdge", node, other_node);
			node.addEdge(edge);
			node.setFeature('edge-case', edge);
			clone_node = node.clone();
			expect(clone_node.getFeatures()).not.toEqual(node.getFeatures());
		});


		test('should ignore references to other nodes in node features', () => {
			node = small_graph.getNodeById("A");
			let other_node = new $N.BaseNode("B");
			node.setFeature('nirvana-node', node);
			clone_node = node.clone();
			expect(clone_node.getFeatures()).not.toEqual(node.getFeatures());
		});

	});

});
