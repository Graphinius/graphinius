/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';

var expect = chai.expect;


describe('Trivial test suite', () => {
	
	it('Should be true', () => {
		expect(true).to.equal(true);
	});
	
	it('Should be false', () => {
		expect(false).not.to.equal(true);
	});
	
	it('Should be blahoo', () => {
		expect('blahoo').not.to.equal('bla');
	});
	
});


describe('Basic node operations', () => {
	it('should correclty instantiate a node with id and label', () => {
		var node = new $N.BaseNode(1, 'new_label');
		expect(node._id).to.equal(1);
		expect(node._label).to.equal('new_label');
	})
});