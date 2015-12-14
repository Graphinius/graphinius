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
		
		it('should automatically report all degree values as zero upon instantiations', () => {
			var node = new $N.BaseNode(id, label);
			expect(node.inDegree()).to.equal(0);
			expect(node.outDegree()).to.equal(0);
			expect(node.degree()).to.equal(0);
		});
	});
	
	
	describe('Node FEATURE vector tests', () => {
		var feats = {name: 'Bernie', age: 36, future: 'Billionaire'};
		var node = new $N.BaseNode(id, label, feats);
			
		it('should correctly set default features to an empty hash object', () => {
			expect(node.getFeatures()).to.be.an.instanceof(Object);
			expect(Object.keys(node.getFeatures()).length).to.equal(3);
		});
		
		it('should correctly set features to specified object', () => {
			expect(node.getFeatures()).to.be.an.instanceof(Object);
			expect(Object.keys(node.getFeatures()).length).to.equal(3);
			expect(node.getFeatures()['name']).to.equal('Bernie');
		});
		
		it('should throw an error when trying to retrieve an unset feature', () => {
			expect(node.getFeature.bind(node, 'nokey')).to.throw("Cannot retrieve non-existing feature.");
		});
		
		it('should correctly retrieve a set feature', () => {
			expect(node.getFeature('future')).to.equal('Billionaire');			
		});
		
		it('should allow to set new feature', () => {
			expect(Object.keys(node.getFeatures()).length).to.equal(3);
			node.setFeature('founder', 'Lemontiger');
			expect(Object.keys(node.getFeatures()).length).to.equal(4);
			expect(node.getFeature('founder')).to.equal('Lemontiger');			
		});
		
		it('should automatically overwrite an existing feature upon renewed setting', () => {
			node.setFeatures(feats);
			expect(Object.keys(node.getFeatures()).length).to.equal(3);
			node.setFeature('future', 'Bazillionaire');
			expect(Object.keys(node.getFeatures()).length).to.equal(3);
			expect(node.getFeature('future')).to.equal('Bazillionaire');	
		});
		
		it('should throw an error upon trying to delete an unset feature', () => {
			expect(node.deleteFeature.bind(node, 'nokey')).to.throw("Cannot delete non-existing feature.");
		});
		
		it('should duly eradicate a given feature', () => {
			expect(Object.keys(node.getFeatures()).length).to.equal(3);
			expect(node.deleteFeature('age')).to.equal(36);
			expect(Object.keys(node.getFeatures()).length).to.equal(2);
		});
		
		it('should allow to replace the whole feature vector', () => {
			var feats = {name: 'Bernie', age: '36', future: 'Billionaire'};
			var node = new $N.BaseNode(id, label, feats);
			expect(Object.keys(node.getFeatures()).length).to.equal(3);
			node.setFeatures({});
			expect(Object.keys(node.getFeatures()).length).to.equal(0);	
		});
		
		it('should allow to clear the whole feature vector', () => {
			var feats = {name: 'Bernie', age: '36', future: 'Billionaire'};
			var node = new $N.BaseNode(id, label, feats);
			expect(Object.keys(node.getFeatures()).length).to.equal(3);
			node.clearFeatures();
			expect(Object.keys(node.getFeatures()).length).to.equal(0);			
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
			
			
			it('Should correctly add an outgoing edge', () => {
				node_a.clearEdges();
				var edge = new $E.BaseEdge(e_id, e_label, node_a, node_b, {
					directed: true
				});
				var in_deg_a 	= node_a.inDegree(),
						out_deg_a = node_a.outDegree(),
						dir_deg_a = node_a.degree();
						
				node_a.addEdge(edge);
				expect(node_a.getEdge(edge._id)).to.equal(edge);	
				
				expect(node_a.inDegree()).to.equal(in_deg_a);
				expect(node_a.outDegree()).to.equal(out_deg_a + 1);
				expect(node_a.degree()).to.equal(dir_deg_a);
			});
			
			
			it('Should correctly add an incoming edge', () => {
				node_a.clearEdges();
				var edge = new $E.BaseEdge(e_id, e_label, node_b, node_a, {
					directed: true
				});
				var in_deg_a 	= node_a.inDegree(),
						out_deg_a = node_a.outDegree(),
						dir_deg_a = node_a.degree();
						
				node_a.addEdge(edge);
				expect(node_a.getEdge(edge._id)).to.equal(edge);
	
				expect(node_a.inDegree()).to.equal(in_deg_a + 1);
				expect(node_a.outDegree()).to.equal(out_deg_a);
				expect(node_a.degree()).to.equal(dir_deg_a);
			});		
			
		});
		
	
		
		describe('Node single edge queries', () => {
			
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
		describe('a little more comples scenario...', () => {
			var n_a = new $N.BaseNode(1, "A"),
					n_b = new $N.BaseNode(2, "B"),
					n_c = new $N.BaseNode(3, "C"),
					n_d = new $N.BaseNode(4, "D"),
					e_1 = new $E.BaseEdge(1, "u_ab", n_a, n_b),
					e_2 = new $E.BaseEdge(2, "u_ac", n_a, n_c),
					e_3 = new $E.BaseEdge(3, "d_aa", n_a, n_a, {directed: true}),
					e_4 = new $E.BaseEdge(4, "d_ab", n_a, n_b, {directed: true}),
					e_5 = new $E.BaseEdge(5, "d_ad", n_a, n_d, {directed: true}),
					e_6 = new $E.BaseEdge(6, "d_ca", n_c, n_a, {directed: true}),
					e_7 = new $E.BaseEdge(7, "d_da", n_d, n_a, {directed: true});
			n_a.addEdge(e_1);
			n_a.addEdge(e_2);
			n_a.addEdge(e_3);
			n_a.addEdge(e_4);
			n_a.addEdge(e_5);
			n_a.addEdge(e_6);
			n_a.addEdge(e_7);
			
			describe('degrees and retrieval', () => {
				
				it('should correctly have computed the degree structure', () => {
					expect(n_a.degree()).to.equal(2);
					expect(n_a.outDegree()).to.equal(3);
					expect(n_a.inDegree()).to.equal(2);
				});		
				
				it('should correctly retrieve undirected edges', () => {
					var unds = n_a.undEdges();
					expect(Object.keys(unds).length).to.equal(2);
					expect(unds[1]).to.equal(e_1);
					expect(unds[2]).to.equal(e_2);
				});
				
				it('should correctly retrieve outgoing edges', () => {
					var outs = n_a.outEdges();
					expect(Object.keys(outs).length).to.equal(3);
					expect(outs[3]).to.equal(e_3);
					expect(outs[4]).to.equal(e_4);
					expect(outs[5]).to.equal(e_5);
				});
				
				it('should correctly retrieve incoming edges', () => {
					var ins = n_a.inEdges();
					expect(Object.keys(ins).length).to.equal(2);
					expect(ins[6]).to.equal(e_6);
					expect(ins[7]).to.equal(e_7);
				});
				
			});
			
			
			describe('deletion of single edges by type', () => {
				
				it('should find nodes c and d as previous nodes', () => {
					var prevs = n_a.prevNodes();
					expect(prevs).to.be.an.instanceof(Array);
					expect(prevs.length).to.equal(2);
					expect(prevs).not.to.contain(n_a);
					expect(prevs).to.contain(n_c);
					expect(prevs).to.contain(n_d);		
				});

				it('should find nodes a, b and d as next nodes', () => {
					var nexts = n_a.nextNodes();
					expect(nexts).to.be.an.instanceof(Array);
					expect(nexts.length).to.equal(3);
					expect(nexts).not.to.contain(n_c);
					expect(nexts).to.contain(n_a);
					expect(nexts).to.contain(n_b);
					expect(nexts).to.contain(n_d);	
				});
				
				it('should find nodes b and c as connected (undirected) nodes', () => {
					var conns = n_a.connNodes();
					expect(conns).to.be.an.instanceof(Array);
					expect(conns.length).to.equal(2);
					expect(conns).not.to.contain(n_a);
					expect(conns).to.contain(n_b);
					expect(conns).to.contain(n_c);	
				});
			});			
			
			
			describe('deletion of single edges by type', () => {
			
				it('should throw an Error when trying to delete non-connected edge', () => {
					var edginot = new $E.BaseEdge(9999, "Unconnected", n_b, n_c);
					expect(n_a.removeEdge.bind(n_a, edginot)).to.throw("Cannot remove unconnected edge.");
				});
				
				it('should correctly delete an undirected edge by reference', () => {
					n_a.removeEdge(e_1);
					var unds = n_a.undEdges();
					expect(Object.keys(unds).length).to.equal(1);
					expect(unds[1]).to.be.undefined;
					expect(unds[2]).to.equal(e_2);
				});
				
				it('should correctly delete an undirected edge by ID', () => {
					var edge = n_a.removeEdgeID(e_2._id);
					expect(edge).to.be.an.instanceof($E.BaseEdge);
					var unds = n_a.undEdges();
					expect(Object.keys(unds).length).to.equal(0);
				});
				
				it('should correctly delete an outgoing edge by reference', () => {
					n_a.removeEdge(e_3);
					var outs = n_a.outEdges();
					expect(Object.keys(outs).length).to.equal(2);
					expect(outs[3]).to.be.undefined;
					expect(outs[4]).to.equal(e_4);
					expect(outs[5]).to.equal(e_5);
				});
				
				it('should correctly delete an outgoing edge by ID', () => {
					var edge = n_a.removeEdgeID(e_5._id);
					expect(edge).to.be.an.instanceof($E.BaseEdge);
					var outs = n_a.outEdges();
					expect(Object.keys(outs).length).to.equal(1);
					expect(outs[4]).to.equal(e_4);
					expect(outs[5]).to.be.undefined;
				});
				
				it('should correctly delete an incoming edge by reference', () => {
					n_a.removeEdge(e_6);
					var ins = n_a.inEdges();
					expect(Object.keys(ins).length).to.equal(1);
					expect(ins[6]).to.be.undefined;
					expect(ins[7]).to.equal(e_7);
				});
				
				it('should correctly delete an incoming edge by ID', () => {
					var edge = n_a.removeEdgeID(e_7._id);
					expect(edge).to.be.an.instanceof($E.BaseEdge);
					var ins = n_a.inEdges();
					expect(Object.keys(ins).length).to.equal(0);
					expect(ins[7]).to.be.undefined;
				});
			
			});
			
		});		
		
		
		describe('Node edge clearing', () => {
			
			it('should clear all edges and set degrees back to zero', () => {
				// reinstantiate node in order to 'clear' object
				node_a = new $N.BaseNode(id, label);
				var edge1 = new $E.BaseEdge(1, "One", node_a, node_b, {
					directed: false
				});
				var edge2 = new $E.BaseEdge(2, "Two", node_a, node_b, {
					directed: true
				});
				var edge3 = new $E.BaseEdge(3, "Three", node_b, node_a, {
					directed: true
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