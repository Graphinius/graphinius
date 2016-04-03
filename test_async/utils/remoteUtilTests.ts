/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as $RU from '../../src/utils/remoteUtils';

var expect = chai.expect;
var REMOTE_HOST = "http://berndmalle.com/graphinius-demo/test_data/json/";
var small_graph_url = REMOTE_HOST + "small_graph.json";

describe('Retrieve remote file tests - ', () => {
	
	it('should throw an error if the handed callback is not a function', (done) => {
		var cb = undefined;
		expect($RU.retrieveRemoteFile.bind($RU, small_graph_url, cb)).to.throw('Provided callback is not a function.');
		done();
	});
	
	
	it('should throw an error if the handed callback is not a function', (done) => {
		var cb = function(graphString) {			
			var graph = JSON.parse(graphString);
			expect(graph.name).to.equal("Small graph test scenario");
			expect(graph.nodes).to.equal(4);
			expect(graph.edges).to.equal(7);
			done();
		};
		$RU.retrieveRemoteFile(small_graph_url, cb);
	});
	
});