/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';

var expect = chai.expect;
var Edge = $E.BaseEdge;
var Degree = $N.EdgeType;



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
			expect(node.getUntypedFeatures()).to.be.an.instanceof(Array);
			expect(node.getUntypedFeatures().length).to.equal(0);
		});
		
		it('should correctly set untyped features to specified array', () => {
			var untyped = [{name: 'Bernie'}];
			var node = new $N.BaseNode(id, label, untyped);
			expect(node.getUntypedFeatures()).to.be.an.instanceof(Array);
			expect(node.getUntypedFeatures().length).to.equal(1);
			expect(node.getUntypedFeatures()).to.equal(untyped);
		});
	});
	
	
	describe('Node default degrees', () => {
		it('should automatically report all degree values as zero upon instantiations', () => {
			var node = new $N.BaseNode(id, label);
			expect(node.degree(Degree.IN)).to.equal(0);
			expect(node.degree(Degree.OUT)).to.equal(0);
			expect(node.degree(Degree.DIRECTED)).to.equal(0);
			expect(node.degree(Degree.UNDIRECTED)).to.equal(0);
			expect(node.degree(Degree.ALL)).to.equal(0);
		});
	});
	
	
	describe('Node edge addition / removal / degree tests', () => {
		var node_a = new $N.BaseNode(id, label),
				node_b = new $N.BaseNode(id, label),
				e_id = 55,
				e_label = "Edgy";
		
		
		describe('Node edge addition tests', () => {
		
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
			* adding edges to both nodes later...
			*/
			it('Should correctly add an undirected edge', () => {
				var und_edge = new $E.BaseEdge(e_id, e_label, node_a, node_b, {
					directed: false,
					weighted: false
				});
				var in_deg_a 	= node_a.degree(Degree.IN),
						out_deg_a = node_a.degree(Degree.OUT),
						dir_deg_a = node_a.degree(Degree.DIRECTED),
						und_deg_a = node_a.degree(Degree.UNDIRECTED),
						all_deg_a = node_a.degree(Degree.ALL);
						
				node_a.addEdge(und_edge);
	
				expect(node_a.degree(Degree.IN)).to.equal(in_deg_a);
				expect(node_a.degree(Degree.OUT)).to.equal(out_deg_a);
				expect(node_a.degree(Degree.DIRECTED)).to.equal(dir_deg_a);
				expect(node_a.degree(Degree.UNDIRECTED)).to.equal(und_deg_a + 1);
				expect(node_a.degree(Degree.ALL)).to.equal(all_deg_a + 1);
			});
			
			
			it('Should throw an error if we try to add an edge more than once', () => {
				var und_edge = new $E.BaseEdge(e_id, e_label, node_a, node_b, {
					directed: false,
					weighted: false
				});
						
				node_a.addEdge(und_edge);
				
				// degrees after first edge addition
				var in_deg_a 	= node_a.degree(Degree.IN),
						out_deg_a = node_a.degree(Degree.OUT),
						dir_deg_a = node_a.degree(Degree.DIRECTED),
						und_deg_a = node_a.degree(Degree.UNDIRECTED),
						all_deg_a = node_a.degree(Degree.ALL);
						
				// here we should get an exception for duplicate edges
				expect(node_a.addEdge.bind(node_a, und_edge)).to.throw("Cannot attach same edge multiple times.");
				expect(node_a.degree(Degree.IN)).to.equal(in_deg_a);
				expect(node_a.degree(Degree.OUT)).to.equal(out_deg_a);
				expect(node_a.degree(Degree.DIRECTED)).to.equal(dir_deg_a);
				expect(node_a.degree(Degree.UNDIRECTED)).to.equal(und_deg_a);
				expect(node_a.degree(Degree.ALL)).to.equal(all_deg_a);
			});
			
		});
		
	});

});