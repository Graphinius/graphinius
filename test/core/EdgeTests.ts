/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';

var expect = chai.expect;
var Node = $N.BaseNode;
var Edge = $E.BaseEdge;


describe('==== EDGE TESTS ====', () => {
	var id = 'New Edge',
			label = 'New Edge',
			node_a = new Node(1),
			node_b = new Node(2);
					
	
	describe('A basic edge instantiation', () => {				
		it('should correctly set _id', () => {					
			var edge = new Edge(id, node_a, node_b);
			expect(edge.getID()).to.equal(id);	
		});
		
		it('should correctly set _label upon instantiation', () => {
			var edge = new Edge(id, node_a, node_b, {label: label});
			expect(edge.getLabel()).to.equal(label);
		});
		
		it('should correctly set _label upon renewed setting', () => {
			var edge = new Edge(id, node_a, node_b, {label: label});
			expect(edge.getLabel()).to.equal(label);
			edge.setLabel('new Label');
			expect(edge.getLabel()).to.equal('new Label');
		});
	});
	
	
	describe('Direction Edge Tests: ', () => {		
		// Constructor + isDirected()
		describe('Constructor + isDirected', () => {
			it('should correctly set default _directed to false', () => {
				var edge = new Edge(id, node_a, node_b);
				expect(edge.isDirected()).to.equal(false);
			});
			
			[true, false].forEach(function(val) {
				it('should correctly set _directed to specified value', () => {
					var opts = {directed: val};
					var edge = new Edge(id, node_a, node_b, opts);
					expect(edge.isDirected()).to.equal(val);					
				});
			});
		});
		
	});
	
	/**
   * Right now, we are making a difference between
   * weighted and unweighted edges. An unweighted edge will
   * return undefined when queried for its weight, whereas
   * a weighted edge with unspecified weight defaults to w=1
   */
	describe('Weight Edge Tests', () => {
		
    
		describe('Constructor + isWeighted', () => {
			it('should correctly set default _directed to false', () => {
				var edge = new Edge(id, node_a, node_b);
				expect(edge.isWeighted()).to.equal(false);
			});
			
			[true, false].forEach(function(val) {
				it('should correctly set _directed to specified value', () => {
					var opts = {weighted: val};
					var edge = new Edge(id, node_a, node_b, opts);
					expect(edge.isWeighted()).to.equal(val);					
				});
			});
		});
		
    
		describe('getWeight()', () => {
			it('should throw an exception when querying weight if unweighted', () => {
				var edge = new Edge(id, node_a, node_b);
				expect(edge.isWeighted()).to.equal(false);
        expect(edge.getWeight()).to.be.undefined;
			});
			
			it('should correctly set default weight to 1', () => {
				var opts = {weighted: true};
				var edge = new Edge(id, node_a, node_b, opts);
				expect(edge.isWeighted()).to.equal(true);					
				expect(edge.getWeight()).to.equal(1);					
			});
			
			it('should correctly report weight if set & specified', () => {
				var opts = {weighted: true, weight: 42};
				var edge = new Edge(id, node_a, node_b, opts);
				expect(edge.isWeighted()).to.equal(true);					
				expect(edge.getWeight()).to.equal(42);					
			});
		});
    
    
		describe('setWeight()', () => {
			it('Should throw an error on trying to set a weight if unweighted', () => {
				var opts = {weighted: false};
				var edge = new Edge(id, node_a, node_b, opts);
				expect(edge.isWeighted()).to.equal(false);
				expect(edge.setWeight.bind(edge, 42)).to.throw("Cannot set weight on unweighted edge.");
			});
			
			it('Should correctly set weight to a specified value', () => {	
				var opts = {weighted: true};
				var edge = new Edge(id, node_a, node_b, opts);
				expect(edge.isWeighted()).to.equal(true);
				expect(edge.getWeight()).to.equal(1);			
				edge.setWeight(42);
				expect(edge.getWeight()).to.equal(42);
			});
		});		
	});
	
	
	describe('Node Edge Tests: ', () => {
		
		[true, false].forEach(function(direction) {
			it('all edges should properly return the two connected nodes', () => {
				var opts = {directed: direction};
				var edge = new Edge(id, node_a, node_b, opts);
				expect(edge.isDirected()).to.equal(direction);
				var nodes = edge.getNodes();
				expect(nodes).to.be.an.instanceof(Object);			
				expect(nodes.a).to.be.an.instanceof(Node);
				expect(nodes.b).to.be.an.instanceof(Node);
				expect(nodes.a).to.equal(node_a);
				expect(nodes.b).to.equal(node_b);
			});
		});
				
	});
});
