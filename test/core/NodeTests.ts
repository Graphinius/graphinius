/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';

var expect = chai.expect;
var Edge = $E.BaseEdge;



describe('==== NODE TESTS ====', () => {
	var id = 42;
	var label = "New Node"

	describe('Basic node instantiation', () => {
		it('should correclty instantiate a node with id', () => {
			var node = new $N.BaseNode(id, label);
			expect(node._id).to.equal(id);
		});
		
		it('should correclty instantiate a node with label', () => {
			var node = new $N.BaseNode(id, label);
			expect(node._label).to.equal(label);
		});
	});
	
	
	describe('Node optional instantiation parameter tests', () => {
		it('should correctly set default untyped features to an empty array', () => {
			var node = new $N.BaseNode(id, label);
			expect(node.getUntypedFeatures()).to.be.an.instanceof(Object);
			expect(Object.keys(node.getUntypedFeatures()).length).to.equal(0);
		});
		
		it('should correctly set untyped features to specified array', () => {
			var u_feat = {name: 'Bernie'};
			var node = new $N.BaseNode(id, label, u_feat);
			expect(node.getUntypedFeatures()).to.be.an.instanceof(Object);
			expect(Object.keys(node.getUntypedFeatures()).length).to.equal(1);
			expect(node.getUntypedFeatures()).to.equal(u_feat);
			expect(node.getUntypedFeatures()['name']).to.equal('Bernie');
		});
	});
	
	
	describe('Node default degrees', () => {
		it('should automatically report all degree values as zero upon instantiations', () => {
			var node = new $N.BaseNode(id, label);
			expect(node.inDegree()).to.equal(0);
			expect(node.outDegree()).to.equal(0);
			expect(node.degree()).to.equal(0);
		});
	});
	
	
	describe('Node edge addition / query / removal tests', () => {
		var node_a = new $N.BaseNode(id, label),
				node_b = new $N.BaseNode(id, label),
				e_id = 55,
				e_label = "Edgy";
		
		
		describe('Node edge addition tests', () => {
		
			it('Should throw an error if we add an unrelated edge', () => {
				var node_c = new $N.BaseNode(9999, 'Not connected to node_a');
				var edge = new $E.BaseEdge(e_id, e_label, node_b, node_c);
				
				expect(node_a.addEdge.bind(node_a, edge)).to.throw("Cannot add edge that does not connect to this node");
			});
			
			it('Should throw an error if we try to add an edge more than once', () => {
				var edge = new $E.BaseEdge(e_id, e_label, node_a, node_b, {
					directed: false
				});
										
				node_a.addEdge(edge);
				// here we should get an exception for duplicate edges
				expect(node_a.addEdge.bind(node_a, edge)).to.throw("Cannot add same edge multiple times.");
				
				node_b.addEdge(edge);
				// here we should get an exception for duplicate edges
				expect(node_b.addEdge.bind(node_b, edge)).to.throw("Cannot add same edge multiple times.");
			});
						
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
			it('Should correctly compute degrees on adding an undirected edge', () => {
				// Clear up the node first..
				node_a.clearEdges();
				var edge = new $E.BaseEdge(e_id, e_label, node_a, node_b, {
					directed: false
				});
				var in_deg_a 	= node_a.inDegree(),
						out_deg_a = node_a.outDegree(),
						dir_deg_a = node_a.degree();
						
				node_a.addEdge(edge);
				
				expect(node_a.inDegree()).to.equal(in_deg_a);
				expect(node_a.outDegree()).to.equal(out_deg_a);
				expect(node_a.degree()).to.equal(dir_deg_a + 1);
			});
			
			
			it('Should correctly compute degrees on adding an outgoing edge', () => {
				node_a.clearEdges();
				var edge = new $E.BaseEdge(e_id, e_label, node_a, node_b, {
					directed: true,
					direction: true // node_a -> node_b
				});
				var in_deg_a 	= node_a.inDegree(),
						out_deg_a = node_a.outDegree(),
						dir_deg_a = node_a.degree();
						
				node_a.addEdge(edge);				
				
				expect(node_a.inDegree()).to.equal(in_deg_a);
				expect(node_a.outDegree()).to.equal(out_deg_a + 1);
				expect(node_a.degree()).to.equal(dir_deg_a);
			});
			
			
			it('Should correctly compute degrees on adding an incoming edge', () => {
				node_a.clearEdges();
				var edge = new $E.BaseEdge(e_id, e_label, node_a, node_b, {
					directed: true,
					direction: false // node_b -> node_a
				});
				var in_deg_a 	= node_a.inDegree(),
						out_deg_a = node_a.outDegree(),
						dir_deg_a = node_a.degree();
				node_a.addEdge(edge);
	
				expect(node_a.inDegree()).to.equal(in_deg_a + 1);
				expect(node_a.outDegree()).to.equal(out_deg_a);
				expect(node_a.degree()).to.equal(dir_deg_a);
			});		
			
		});
		
		
		
		describe('Node edge queries', () => {
			
			it('should assert that an added edge is connected by reference', () => {
				node_a.clearEdges();
				var edge = new $E.BaseEdge(e_id, e_label, node_a, node_b, {
					directed: false
				});						
				node_a.addEdge(edge);				
				expect(node_a.hasEdge(edge)).to.be.true;
			});
			
			it('should assert that an added edge is connected by ID', () => {
				node_a.clearEdges();
				var edge = new $E.BaseEdge(e_id, e_label, node_a, node_b, {
					directed: false
				});						
				node_a.addEdge(edge);
				expect(node_a.hasEdgeID(edge._id)).to.be.true;
			});
			
			it('should assert that non-existing edge is not connected by ID', () => {
				node_a.clearEdges();
				expect(node_a.hasEdgeID(9999)).to.be.false;
			});
			
			it('should throw an error upon trying to retrieve a non-existing edge', () => {
				node_a.clearEdges();
				expect(node_a.getEdge.bind(node_a, 9999)).to.throw("Cannot retrieve non-existing edge.");
			});
			
			it('should correctly retrieve exising edge by ID', () => {
				node_a.clearEdges();
				var edge = new $E.BaseEdge(e_id, e_label, node_a, node_b, {
					directed: false
				});						
				node_a.addEdge(edge);
				expect(node_a.getEdge(edge._id)).to.equal(edge);
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
			// describe('getting edges according to their type', () => {
			// 	var n_a = new $N.BaseNode(1, "A"),
			// 			n_b = new $N.BaseNode(2, "B"),
			// 			n_c = new $N.BaseNode(3, "C"),
			// 			n_d = new $N.BaseNode(4, "D"),
			// 			e_1 = new $E.BaseEdge(1, "u_ab", n_a, n_b),
			// 			e_2 = new $E.BaseEdge(2, "u_ac", n_a, n_c),
			// 			e_3 = new $E.BaseEdge(3, "o_ab", n_a, n_a),
			// 			e_4 = new $E.BaseEdge(4, "o_ab", n_a, n_b),
			// 			e_5 = new $E.BaseEdge(5, "o_ab", n_a, n_d),
			// 			e_6 = new $E.BaseEdge(6, "i_ab", n_a, n_c),
			// 			e_7 = new $E.BaseEdge(7, "i_ab", n_a, n_b);
				
			// 	it('should correctly retrieve outgoing edges', () => {
					
			// 	});
			// });		
			
		});
		
		
		describe('Node edge removal', () => {
			
			it('should clear all edges and set degrees back to zero', () => {
				// reinstantiate node in order to 'clear' object
				node_a = new $N.BaseNode(id, label);
				var edge1 = new $E.BaseEdge(1, "One", node_a, node_b, {
					directed: false
				});
				var edge2 = new $E.BaseEdge(2, "Two", node_a, node_b, {
					directed: true
				});
				var edge3 = new $E.BaseEdge(3, "Three", node_a, node_b, {
					directed: true,
					direction: false
				});
				node_a.addEdge(edge1);
				node_a.addEdge(edge2);
				node_a.addEdge(edge3);
				
				expect(node_a.inDegree()).to.equal(1);
				expect(node_a.outDegree()).to.equal(1);
				expect(node_a.degree()).to.equal(1);
								
				node_a.clearEdges();
				expect(node_a.inDegree()).to.equal(0);
				expect(node_a.outDegree()).to.equal(0);
				expect(node_a.degree()).to.equal(0);
			});
			
			
		});
		
	});

});