/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';

var expect = chai.expect;
var Node = $N.BaseNode;
var Edge = $E.BaseEdge;


describe('==== EDGE TESTS ====', () => {
	var id = 1,
			label = 'New_Edge',
			node_a = new Node(1, 'Node_A'),
			node_b = new Node(2, 'Node_B');
		
	
	describe('Basic Edge Tests', () => {
				
		it('Should correctly set _id', () => {					
			var edge = new Edge(id, label, node_a, node_b);
			expect(edge._id).to.equal(id);	
		});
		
		it('Should correctly set _label', () => {					
			var edge = new Edge(id, label, node_a, node_b);
			expect(edge._label).to.equal(label);			
		});
				
	});
	
	
	describe('Direction Edge Tests', () => {
		
		it('Should correctly set default _directed to false', () => {
			var edge = new Edge(id, label, node_a, node_b);
			expect(edge.isDirected()).to.equal(false);
		});
		
		it('Should correctly set _directed to false', () => {
			var opts = {directed: false};
			var edge = new Edge(id, label, node_a, node_b, opts);
			expect(edge.isDirected()).to.equal(false);
		});
		
		it('Should correctly set _directed to true', () => {
			var opts = {directed: true};
			var edge = new Edge(id, label, node_a, node_b, opts);
			expect(edge.isDirected()).to.equal(true);
		});
		
		
		
		it('Should throw an exception when asking direction if undirected', () => {
			var edge = new Edge(id, label, node_a, node_b);
			try {
				var dir = edge.getDirection();
				expect(edge.isDirected()).to.equal(false);
			} catch (e) {
				
			}
		});
		
	});
	
	
	describe('Weight Edge Tests', () => {
		
		it('Should correctly set default _weighted to false', () => {
			var edge = new Edge(id, label, node_a, node_b);
			expect(edge.isWeighted()).to.equal(false);
		});	
		
	});
});
