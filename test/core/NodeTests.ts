/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';

var expect = chai.expect;
var Edge = $E.BaseEdge;


/**
 * TODO Test
 */
function collectNodesFromNeighbors(neighbors: Array<$N.NeighborEntry>) : Array<$N.IBaseNode> {
  var nodes : Array<$N.IBaseNode> = [];  
  for ( var n_idx in neighbors ) {
    nodes.push( neighbors[n_idx].node );
  }  
  return nodes;
}


describe('==== NODE TESTS ====', () => {
	var id = "New Node";

	describe('Basic node instantiation', () => {
		it('should correclty instantiate a node with id', () => {
			var node = new $N.BaseNode(id);
			expect(node.getID()).to.equal(id);
		});
		
		it('should set default label to ID', () => {
			var node = new $N.BaseNode(id);
			expect(node.getLabel()).to.equal(id);
		});
		
		it('should correclty instantiate a node with label', () => {
			var label = "New Label";
			var node = new $N.BaseNode(id, {label: label});
			expect(node.getLabel()).to.equal(label);
		});
		
		it('should allow setting new label', () => {
			var label = "New Label";
			var node = new $N.BaseNode(id, {label: label});
			expect(node.getLabel()).to.equal(label);
			node.setLabel("Even newer");
			expect(node.getLabel()).to.equal("Even newer");
		});
		
		it('should automatically report all degree values as zero upon instantiations', () => {
			var node = new $N.BaseNode(id);
			expect(node.inDegree()).to.equal(0);
			expect(node.outDegree()).to.equal(0);
			expect(node.degree()).to.equal(0);
		});
	});
	
	
	describe('Node FEATURE vector tests', () => {
		var feats = {name: 'Bernie', age: 36, future: 'Billionaire'};
		var node = new $N.BaseNode(id, feats);
			
		it('should correctly set default features to an empty hash object', () => {
			expect(node.getFeatures()).to.be.an.instanceof(Object);
			expect(Object.keys(node.getFeatures()).length).to.equal(3);
		});
		
		it('should correctly set features to specified object', () => {
			expect(node.getFeatures()).to.be.an.instanceof(Object);
			expect(Object.keys(node.getFeatures()).length).to.equal(3);
			expect(node.getFeatures()['name']).to.equal('Bernie');
		});
		
		// it('should throw an error when trying to retrieve a non-set feature', () => {
		// 	expect(node.getFeature.bind(node, 'nokey')).to.throw("Cannot retrieve non-existing feature.");
		// });
		
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
		
		// it('should throw an error upon trying to delete an unset feature', () => {
		// 	expect(node.deleteFeature.bind(node, 'nokey')).to.throw("Cannot delete non-existing feature.");
		// });
		
		it('should duly eradicate a given feature', () => {
			expect(Object.keys(node.getFeatures()).length).to.equal(3);
			expect(node.deleteFeature('age')).to.equal(36);
			expect(Object.keys(node.getFeatures()).length).to.equal(2);
		});
		
		it('should allow to replace the whole feature vector', () => {
			var feats = {name: 'Bernie', age: '36', future: 'Billionaire'};
			var node = new $N.BaseNode(id, feats);
			expect(Object.keys(node.getFeatures()).length).to.equal(3);
			node.setFeatures({});
			expect(Object.keys(node.getFeatures()).length).to.equal(0);	
		});
		
		it('should allow to clear the whole feature vector', () => {
			var feats = {name: 'Bernie', age: '36', future: 'Billionaire'};
			var node = new $N.BaseNode(id, feats);
			expect(Object.keys(node.getFeatures()).length).to.equal(3);
			node.clearFeatures();
			expect(Object.keys(node.getFeatures()).length).to.equal(0);			
		});
	});
	
	
	describe('Node edge addition / query / removal tests - ', () => {
		var node_a 	= new $N.BaseNode(id),
				node_b 	= new $N.BaseNode(id),
				e_id		= "Edgy";
		
		
		describe('Node edge addition tests', () => {
		
			it('should throw an error if we add an unrelated edge', () => {
				var node_c = new $N.BaseNode(9999, {label: 'Not connected to node_a'});
				var edge = new $E.BaseEdge(e_id, node_b, node_c);
				
				expect(node_a.addEdge.bind(node_a, edge)).to.throw("Cannot add edge that does not connect to this node");
			});
			
			it('should throw an error if we try to add an unidrected edge more than once', () => {
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
				expect(node_a.addEdge.bind(node_a, edge)).to.throw("Cannot add same undirected edge multiple times.");
			});
			
			it('should not throw an error if we try to connect the same edge (ID) as incoming and outgoing (the node then belongs to its own prevs and nexts)..', () => {
				var edge = new $E.BaseEdge(e_id, node_a, node_a, {
					directed: true
				});
				var in_deg = node_a.inDegree();
				var out_deg = node_a.outDegree();				
				expect(node_a.addEdge.bind(node_a, edge)).not.to.throw("Cannot add same undirected edge multiple times.");
				expect(node_a.addEdge.bind(node_a, edge)).not.to.throw("Cannot add same undirected edge multiple times.");
				expect(node_a.inDegree()).to.equal(in_deg + 1);
				expect(node_a.outDegree()).to.equal(out_deg + 1);
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
			it('should correctly add an undirected edge and recompute degrees', () => {
				// Clear up the node first..
				node_a.clearEdges();
				var edge = new $E.BaseEdge(e_id, node_a, node_b, {
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
			
			
			it('should correctly add an outgoing edge and recompute degrees', () => {
				node_a.clearEdges();
				var edge = new $E.BaseEdge(e_id, node_a, node_b, {
					directed: true
				});
				var in_deg_a 	= node_a.inDegree(),
						out_deg_a = node_a.outDegree(),
						dir_deg_a = node_a.degree();
						
				node_a.addEdge(edge);
				expect(node_a.getEdge(edge.getID())).to.equal(edge);	
				
				expect(node_a.inDegree()).to.equal(in_deg_a);
				expect(node_a.outDegree()).to.equal(out_deg_a + 1);
				expect(node_a.degree()).to.equal(dir_deg_a);
			});
			
			
			it('should correctly add an incoming edge and recompute degrees', () => {
				node_a.clearEdges();
				var edge = new $E.BaseEdge(e_id, node_b, node_a, {
					directed: true
				});
				var in_deg_a 	= node_a.inDegree(),
						out_deg_a = node_a.outDegree(),
						dir_deg_a = node_a.degree();
						
				node_a.addEdge(edge);
				expect(node_a.getEdge(edge.getID())).to.equal(edge);
	
				expect(node_a.inDegree()).to.equal(in_deg_a + 1);
				expect(node_a.outDegree()).to.equal(out_deg_a);
				expect(node_a.degree()).to.equal(dir_deg_a);
			});		
			
		});
			
		
		describe('Node single edge queries', () => {
			
			it('should assert that an added edge is connected by reference', () => {
				node_a.clearEdges();
				var edge = new $E.BaseEdge(e_id, node_a, node_b, {
					directed: false
				});						
				node_a.addEdge(edge);				
				expect(node_a.hasEdge(edge)).to.be.true;
			});
			
			it('should assert that an added edge is connected by ID', () => {
				node_a.clearEdges();
				var edge = new $E.BaseEdge(e_id, node_a, node_b, {
					directed: false
				});						
				node_a.addEdge(edge);
				expect(node_a.hasEdgeID(edge.getID())).to.be.true;
			});
			
			it('should assert that non-existing edge is not connected by ID', () => {
				node_a.clearEdges();
				expect(node_a.hasEdgeID("Idontexist")).to.be.false;
			});
			
			it('should throw an error upon trying to retrieve a non-existing edge', () => {
				node_a.clearEdges();
				expect(node_a.getEdge.bind(node_a, "Idontexist")).to.throw("Cannot retrieve non-existing edge.");
			});
			
			it('should correctly retrieve exising edge by ID', () => {
				node_a.clearEdges();
				var edge = new $E.BaseEdge(e_id, node_a, node_b, {
					directed: false
				});						
				node_a.addEdge(edge);
				expect(node_a.getEdge(edge.getID())).to.equal(edge);
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
			
			var n_a = new $N.BaseNode(1, {label: "A"}),
					n_b = new $N.BaseNode(2, {label: "B"}),
					n_c = new $N.BaseNode(3, {label: "C"}),
					n_d = new $N.BaseNode(4, {label: "D"}),
					e_1 = new $E.BaseEdge("1", n_a, n_b, {label: "u_ab"}),
					e_2 = new $E.BaseEdge("2", n_a, n_c, {label: "u_ac"}),
					e_3 = new $E.BaseEdge("3", n_a, n_a, {label: "d_aa", directed: true}),
					e_4 = new $E.BaseEdge("4", n_a, n_b, {label: "d_ab", directed: true}),
					e_5 = new $E.BaseEdge("5", n_a, n_d, {label: "d_ad", directed: true}),
					e_6 = new $E.BaseEdge("6", n_c, n_a, {label: "d_ca", directed: true}),
					e_7 = new $E.BaseEdge("7", n_d, n_a, {label: "d_da", directed: true});
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
						
				it('should correctly have computed the degree structure', () => {
					expect(n_a.degree()).to.equal(2);
					expect(n_a.outDegree()).to.equal(3);
					expect(n_a.inDegree()).to.equal(3);
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
					expect(Object.keys(ins).length).to.equal(3);
					expect(ins[3]).to.equal(e_3);
					expect(ins[6]).to.equal(e_6);
					expect(ins[7]).to.equal(e_7);
				});

				it('should correctly retrieve all directed edges', () => {
					var dirs = n_a.dirEdges();
					expect(Object.keys(dirs).length).to.equal(5);
					expect(dirs[3]).to.equal(e_3);
					expect(dirs[4]).to.equal(e_4);
					expect(dirs[5]).to.equal(e_5);
					expect(dirs[6]).to.equal(e_6);
					expect(dirs[7]).to.equal(e_7);
				});

				it('should correctly retrieve ALL edges', () => {
					var alls = n_a.allEdges();
					expect(Object.keys(alls).length).to.equal(7);
					expect(alls[1]).to.equal(e_1);
					expect(alls[2]).to.equal(e_2);
					expect(alls[3]).to.equal(e_3);
					expect(alls[4]).to.equal(e_4);
					expect(alls[5]).to.equal(e_5);
					expect(alls[6]).to.equal(e_6);
					expect(alls[7]).to.equal(e_7);
				});
								
			});			
			
			describe('previous, next, connected and adjacent nodes', () => {
				
				it('should find nodes c and d as previous nodes', () => {
					var prevs = collectNodesFromNeighbors(n_a.prevNodes());
					expect(prevs).to.be.an.instanceof(Array);
					expect(prevs.length).to.equal(3);
					expect(prevs).to.contain(n_a);
					expect(prevs).to.contain(n_c);
					expect(prevs).to.contain(n_d);		
				});

				it('should find nodes a, b and d as next nodes', () => {
					var nexts = collectNodesFromNeighbors(n_a.nextNodes());
					expect(nexts).to.be.an.instanceof(Array);
					expect(nexts.length).to.equal(3);
					expect(nexts).not.to.contain(n_c);
					expect(nexts).to.contain(n_a);
					expect(nexts).to.contain(n_b);
					expect(nexts).to.contain(n_d);	
				});
				
				it('should find nodes b and c as connected (undirected) nodes', () => {
					var conns = collectNodesFromNeighbors(n_a.connNodes());
					expect(conns).to.be.an.instanceof(Array);
					expect(conns.length).to.equal(2);
					expect(conns).not.to.contain(n_a);
					expect(conns).to.contain(n_b);
					expect(conns).to.contain(n_c);
				});
				
				it('should find nodes a, b, c and d as adjacent (reachable) nodes', () => {
					var adjs = collectNodesFromNeighbors(n_a.reachNodes((ne) => {return ne.node.getID()}));
					expect(adjs).to.be.an.instanceof(Array);
					expect(adjs.length).to.equal(4);
					expect(adjs).to.contain(n_a);
					expect(adjs).to.contain(n_b);
					expect(adjs).to.contain(n_c);	
					expect(adjs).to.contain(n_d);
				});
				
				it('should find node a as undirected neighbor node from node b', () => {
					var conns = collectNodesFromNeighbors(n_b.connNodes());
					expect(conns).to.be.an.instanceof(Array);
					expect(conns.length).to.equal(1);
					expect(conns).to.contain(n_a);
					expect(conns).not.to.contain(n_b);
					expect(conns).not.to.contain(n_c);	
					expect(conns).not.to.contain(n_d);
				});
				
				it('should find node a as directed previous neighbor from node b', () => {
					var prevs = collectNodesFromNeighbors(n_b.prevNodes());
					expect(prevs).to.be.an.instanceof(Array);
					expect(prevs.length).to.equal(1);
					expect(prevs).to.contain(n_a);
					expect(prevs).not.to.contain(n_b);
					expect(prevs).not.to.contain(n_c);	
					expect(prevs).not.to.contain(n_d);
				});
			});			
			
			
			describe('deletion of single edges by type', () => {
				
				var n_a, n_b, n_c, n_d, 
						e_1, e_2, e_3, e_4, e_5, e_6, e_7, e_8;
				
				beforeEach('reinstantiate the "more complex scenario" from above, plus one more loop', () => {
					n_a = new $N.BaseNode(1, {label: "A"}),
					n_b = new $N.BaseNode(2, {label: "B"}),
					n_c = new $N.BaseNode(3, {label: "C"}),
					n_d = new $N.BaseNode(4, {label: "D"}),
					e_1 = new $E.BaseEdge("1", n_a, n_b, {label: "u_ab"}),
					e_2 = new $E.BaseEdge("2", n_a, n_c, {label: "u_ac"}),
					e_3 = new $E.BaseEdge("3", n_a, n_a, {label: "d_aa", directed: true}),
					e_4 = new $E.BaseEdge("4", n_a, n_b, {label: "d_ab", directed: true}),
					e_5 = new $E.BaseEdge("5", n_a, n_d, {label: "d_ad", directed: true}),
					e_6 = new $E.BaseEdge("6", n_c, n_a, {label: "d_ca", directed: true}),
					e_7 = new $E.BaseEdge("7", n_d, n_a, {label: "d_da", directed: true}),
					e_8 = new $E.BaseEdge("8", n_a, n_a, {label: "d_da"});
					n_a.addEdge(e_1);
					n_a.addEdge(e_2);
					n_a.addEdge(e_3);
					n_a.addEdge(e_4);
					n_a.addEdge(e_5);
					n_a.addEdge(e_6);
					n_a.addEdge(e_7);
					n_a.addEdge(e_8);
				});
        
        
        it('should throw an error upon trying to remove an unconnected edge', () => {
          expect(n_a.removeEdgeID.bind(n_a, 'menotexists')).to.throw('Cannot remove unconnected edge.');
        });
				
				
				it('should confirm our expectations about node degrees in this example', () => {	
					expect(Object.keys(n_a.inEdges()).length).to.equal(3);		
					expect(Object.keys(n_a.outEdges()).length).to.equal(3);	
					expect(Object.keys(n_a.undEdges()).length).to.equal(3);
				});
				
			
				it('should throw an Error when trying to delete non-connected edge', () => {
					var edginot = new $E.BaseEdge("Unconnected", n_b, n_c);
					expect(n_a.removeEdge.bind(n_a, edginot)).to.throw("Cannot remove unconnected edge.");
				});
				
				
				it('should correctly delete an undirected edge by reference', () => {
					n_a.removeEdge(e_1);
					var unds = n_a.undEdges();
					expect(Object.keys(unds).length).to.equal(2);
					expect(unds[1]).to.be.undefined;
					expect(unds[2]).to.equal(e_2);
					expect(unds[8]).to.equal(e_8);
				});
				
				
				it('should correctly delete an undirected edge by ID', () => {
					n_a.removeEdgeID(e_2.getID());
					var unds = n_a.undEdges();
					expect(Object.keys(unds).length).to.equal(2);
					expect(unds[1]).to.equal(e_1);
					expect(unds[2]).to.be.undefined;
					expect(unds[8]).to.equal(e_8);
				});
				
				
				it('should correctly delete an undirected loop edge by reference', () => {					
					n_a.removeEdge(e_8);
					var unds = n_a.undEdges();
					expect(Object.keys(unds).length).to.equal(2);
					expect(unds[1]).to.equal(e_1);
					expect(unds[2]).to.equal(e_2);
					expect(unds[8]).to.be.undefined;
				});
				
				
				it('should correctly delete a directed loop edge by reference', () => {
					n_a.removeEdge(e_3);
					var outs = n_a.outEdges();
					expect(Object.keys(outs).length).to.equal(2);
					expect(outs[3]).to.be.undefined;
					expect(outs[4]).to.equal(e_4);
					expect(outs[5]).to.equal(e_5);
				});
				
					
				it('should correctly delete an outgoing edge by reference', () => {
					n_a.removeEdge(e_5);
					var outs = n_a.outEdges();
					expect(Object.keys(outs).length).to.equal(2);
					expect(outs[3]).to.equal(e_3);
					expect(outs[4]).to.equal(e_4);
					expect(outs[5]).to.be.undefined;
				});
				
				
				it('should correctly delete an outgoing edge by ID', () => {
					n_a.removeEdgeID(e_5.getID());
					var outs = n_a.outEdges();
					expect(Object.keys(outs).length).to.equal(2);
					expect(outs[3]).to.equal(e_3);
					expect(outs[4]).to.equal(e_4);
					expect(outs[5]).to.be.undefined;
				});
				
				
				it('should correctly delete an incoming edge by reference', () => {
					n_a.removeEdge(e_6);
					var ins = n_a.inEdges();
					expect(Object.keys(ins).length).to.equal(2);
					expect(ins[3]).to.equal(e_3);
					expect(ins[6]).to.be.undefined;
					expect(ins[7]).to.equal(e_7);
				});
				
				
				it('should correctly delete an incoming edge by ID', () => {
					n_a.removeEdgeID(e_7.getID());
					var ins = n_a.inEdges();
					expect(Object.keys(ins).length).to.equal(2);
					expect(ins[3]).to.equal(e_3);
					expect(ins[6]).to.equal(e_6);
					expect(ins[7]).to.be.undefined;
				});
			
			});
			
		});
		
		
		describe('Node edge clearing', () => {			
			var node_a,
					edge_1,
					edge_2,
					edge_3;
					
					
			beforeEach('should initialize settings', () => {
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
				expect(node_a.inDegree()).to.equal(1);
				expect(node_a.outDegree()).to.equal(1);
				expect(node_a.degree()).to.equal(1);			
			});
			
			
			it('should clear all outgoing edges and update degrees accordingly', () => {				
				node_a.clearOutEdges();
				expect(node_a.inDegree()).to.equal(1);
				expect(node_a.outDegree()).to.equal(0);
				expect(node_a.degree()).to.equal(1);				
			});
			
			
			it('should clear all incoming edges and update degrees accordingly', () => {
				node_a.clearInEdges();
				expect(node_a.inDegree()).to.equal(0);
				expect(node_a.outDegree()).to.equal(1);
				expect(node_a.degree()).to.equal(1);				
			});
			
			
			it('should clear all undirected edges and update degrees accordingly', () => {
				node_a.clearUndEdges();
				expect(node_a.inDegree()).to.equal(1);
				expect(node_a.outDegree()).to.equal(1);
				expect(node_a.degree()).to.equal(0);
			});
			
			
			it('should clear all edges and set degrees back to zero', () => {								
				node_a.clearEdges();
				expect(node_a.inDegree()).to.equal(0);
				expect(node_a.outDegree()).to.equal(0);
				expect(node_a.degree()).to.equal(0);
			});			
			
		});
		
	});

});