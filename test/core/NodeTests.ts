/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';

var expect = chai.expect;
var Edge = $E.BaseEdge;
var Degree = $N.DegreeType;



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

});