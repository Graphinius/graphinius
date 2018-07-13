/// <reference path="../../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as $RU from '../../../src/utils/remoteUtils';

var expect = chai.expect;

const REMOTE_HOST = "raw.githubusercontent.com";
const REMOTE_PATH = "/cassinius/graphinius-demo/master/test_data/json/";
const SMALL_GRAPH_NAME = "small_graph";
const JSON_EXTENSION = ".json";


describe('Retrieve remote file tests - ', () => {

	let config : $RU.RequestConfig = {
		remote_host: REMOTE_HOST,
		remote_path: REMOTE_PATH,
		file_name: SMALL_GRAPH_NAME + JSON_EXTENSION
	}
	
	it('should throw an error if the handed callback is not a function', (done) => {
		var cb = undefined;
		expect($RU.retrieveRemoteFile.bind($RU, config, cb)).to.throw('Provided callback is not a function.');
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
		$RU.retrieveRemoteFile(config, cb);
	});
	
});