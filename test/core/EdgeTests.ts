/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';

var expect = chai.expect;
var Node = $N.BaseNode;
var Edge = $E.BaseEdge;

/**
	* Not testing cases 
	* 1) undirected -> wrong direction
	* 2) unweighted -> wrong direction
	* ... as getters won't work anyways... 
	*/ 
describe('==== EDGE TESTS ====', () => {
	var id = 1,
			label = 'New_Edge',
			node_a = new Node(1, 'Node_A'),
			node_b = new Node(2, 'Node_B');
					
	
	describe('A basic edge instantiation', () => {				
		it('should correctly set _id', () => {					
			var edge = new Edge(id, label, node_a, node_b);
			expect(edge._id).to.equal(id);	
		});
		
		it('should correctly set _label', () => {					
			var edge = new Edge(id, label, node_a, node_b);
			expect(edge._label).to.equal(label);			
		});				
	});
	
	
	describe('Direction Edge Tests: ', () => {		
		// Constructor + isDirected()
		describe('Constructor + isDirected', () => {
			it('should correctly set default _directed to false', () => {
				var edge = new Edge(id, label, node_a, node_b);
				expect(edge.isDirected()).to.equal(false);
			});
			
			[true, false].forEach(function(val) {
				it('should correctly set _directed to specified value', () => {
					var opts = {directed: val};
					var edge = new Edge(id, label, node_a, node_b, opts);
					expect(edge.isDirected()).to.equal(val);					
				});
			});
		});		
		
		// getDirection()
		describe('getDirection()', () => {
			it('should throw an exception when querying direction if undirected', () => {
				var edge = new Edge(id, label, node_a, node_b);
				expect(edge.isDirected()).to.equal(false);
				expect(edge.getDirection.bind(edge)).to.throw("Undirected edge cannot be queried for direction.");
			});
			
			it('should correctly set default direction to true', () => {
				var opts = {directed: true};
				var edge = new Edge(id, label, node_a, node_b, opts);
				expect(edge.isDirected()).to.equal(true);					
				expect(edge.getDirection()).to.equal(true);					
			});
			
			[true, false].forEach(function(val) {
				it('should correctly report direction if set & specified to ' + val, () => {
					var opts = {directed: true, direction: val};
					var edge = new Edge(id, label, node_a, node_b, opts);
					expect(edge.isDirected()).to.equal(true);					
					expect(edge.getDirection()).to.equal(val);					
				});
			});
		});		
		
		// setDirection()
		describe('setDirection()', () => {
			it('Should throw an error on trying to set new direction if undirected', () => {
				var opts = {directed: false};
				var edge = new Edge(id, label, node_a, node_b, opts);
				expect(edge.isDirected()).to.equal(false);
				expect(edge.setDirection.bind(edge, true)).to.throw("Direction cannot be set on undirected edge.");
			});
			
			[true, false].forEach(function(val) {
				it('Should correctly set direction to the specified value: ' + val, () => {	
					var opts = {directed: true, direction: false};
					var edge = new Edge(id, label, node_a, node_b, opts);
					expect(edge.isDirected()).to.equal(true);
					expect(edge.getDirection()).to.equal(false);			
					edge.setDirection(val);
					expect(edge.getDirection()).to.equal(val);
				});
			});		
		});		
	});
	
	
	describe('Weight Edge Tests', () => {
		
		// Constructor + isWeighted()
		describe('Constructor + isWeighted', () => {
			it('should correctly set default _directed to false', () => {
				var edge = new Edge(id, label, node_a, node_b);
				expect(edge.isWeighted()).to.equal(false);
			});
			
			[true, false].forEach(function(val) {
				it('should correctly set _directed to specified value', () => {
					var opts = {weighted: val};
					var edge = new Edge(id, label, node_a, node_b, opts);
					expect(edge.isWeighted()).to.equal(val);					
				});
			});
		});		
		
		// getWeight()
		describe('getWeight()', () => {
			it('should throw an exception when querying weight if unweighted', () => {
				var edge = new Edge(id, label, node_a, node_b);
				expect(edge.isWeighted()).to.equal(false);
				expect(edge.getWeight.bind(edge)).to.throw("Unweighted edge cannot be queried for weight.");
			});
			
			it('should correctly set default weight to 0', () => {
				var opts = {weighted: true};
				var edge = new Edge(id, label, node_a, node_b, opts);
				expect(edge.isWeighted()).to.equal(true);					
				expect(edge.getWeight()).to.equal(0);					
			});
			
			it('should correctly report weight if set & specified', () => {
				var opts = {weighted: true, weight: 42};
				var edge = new Edge(id, label, node_a, node_b, opts);
				expect(edge.isWeighted()).to.equal(true);					
				expect(edge.getWeight()).to.equal(42);					
			});
		});
		
		// setWeight()
		describe('setWeight()', () => {
			it('Should throw an error on trying to set a weight if unweighted', () => {
				var opts = {weighted: false};
				var edge = new Edge(id, label, node_a, node_b, opts);
				expect(edge.isWeighted()).to.equal(false);
				expect(edge.setWeight.bind(edge, 42)).to.throw("Cannot set weight on unweighted edge.");
			});
			
			it('Should correctly set weight to a specified value', () => {	
				var opts = {weighted: true};
				var edge = new Edge(id, label, node_a, node_b, opts);
				expect(edge.isWeighted()).to.equal(true);
				expect(edge.getWeight()).to.equal(0);			
				edge.setWeight(42);
				expect(edge.getWeight()).to.equal(42);
			});
		});		
	});
	
	
	describe('Node Edge Tests: ', () => {
		
		[true, false].forEach(function(direction) {
			it('all edges should properly return the two connected nodes', () => {
				var opts = {directed: direction};
				var edge = new Edge(id, label, node_a, node_b, opts);
				expect(edge.isDirected()).to.equal(direction);
				var nodes = edge.getNodes();
				expect(nodes).to.be.an.instanceof(Array);			
				expect(nodes[0]).to.be.an.instanceof(Node);
				expect(nodes[1]).to.be.an.instanceof(Node);
				expect(nodes[0]).to.equal(node_a);
				expect(nodes[1]).to.equal(node_b);
			});
		});
		
		it('undirected edge should throw error on invoking fromNode()', () => {
			var opts = {directed: false};
			var edge = new Edge(id, label, node_a, node_b, opts);
			expect(edge.isDirected()).to.equal(false);
			expect(edge.fromNode.bind(edge)).to.throw("Undirected edge has no from node.");
		});
		
		it('undirected edge should throw error on invoking toNode()', () => {
			var opts = {directed: false};
			var edge = new Edge(id, label, node_a, node_b, opts);
			expect(edge.isDirected()).to.equal(false);
			expect(edge.toNode.bind(edge)).to.throw("Undirected edge has no from node.");
		});
		
		it('forward directed edge should return node_a as fromNode()', () => {
			var opts = {directed: true, direction: true};
			var edge = new Edge(id, label, node_a, node_b, opts);
			expect(edge.isDirected()).to.equal(true);
			expect(edge.getDirection()).to.equal(true);
			var from = edge.fromNode();
			expect(from).to.be.an.instanceof(Node);
			expect(from).to.equal(node_a);
		});
		
		it('reverse directed edge should return node_b as fromNode()', () => {
			var opts = {directed: true, direction: false};
			var edge = new Edge(id, label, node_a, node_b, opts);
			expect(edge.isDirected()).to.equal(true);
			expect(edge.getDirection()).to.equal(false);
			var from = edge.fromNode();
			expect(from).to.be.an.instanceof(Node);
			expect(from).to.equal(node_b);
		});
		
		it('forward directed edge should return node_b as toNode()', () => {
			var opts = {directed: true, direction: true};
			var edge = new Edge(id, label, node_a, node_b, opts);
			expect(edge.isDirected()).to.equal(true);
			expect(edge.getDirection()).to.equal(true);
			var from = edge.toNode();
			expect(from).to.be.an.instanceof(Node);
			expect(from).to.equal(node_b);
		});
		
		it('reverse directed edge should return node_a as toNode()', () => {
			var opts = {directed: true, direction: false};
			var edge = new Edge(id, label, node_a, node_b, opts);
			expect(edge.isDirected()).to.equal(true);
			expect(edge.getDirection()).to.equal(false);
			var from = edge.toNode();
			expect(from).to.be.an.instanceof(Node);
			expect(from).to.equal(node_a);
		});		
			
	});
});
