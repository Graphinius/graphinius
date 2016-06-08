/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/io/input/JSONInput';
import * as $C from '../../test/io/input/common';

var expect 	= chai.expect;
var Node 		= $N.BaseNode;
var Edge 		= $E.BaseEdge;
var Graph 	= $G.BaseGraph;
var JSON_IN	= $I.JSONInput;


describe('ASYNC GRAPH JSON INPUT TESTS', () => {
	
	var json 					: $I.IJSONInput,
			remote_file		: string,
			graph					: $G.IGraph,
			stats					: $G.GraphStats,
			REMOTE_HOST = "http://berndmalle.com/graphinius-demo/test_data/json/";

	var REAL_GRAPH_NR_NODES = 6204,
			REAL_GRAPH_NR_EDGES = 18550;
	
	describe('Small test graph', () => {
				
		it('should correctly generate our small example graph from a remotely fetched JSON file with explicitly encoded edge directions', (done) => {
			json = new JSON_IN();
			remote_file = REMOTE_HOST + "small_graph.json";
			json.readFromJSONURL(remote_file, function(graph, err) {
				$C.checkSmallGraphStats(graph);
				done();
			});
		});
		
		
		it('should correctly generate our small example graph from a remotely fetched JSON file with direction _mode set to undirected', (done) => {
			json = new JSON_IN();
			json._explicit_direction = false;
			json._direction = false; // undirected graph
			remote_file = REMOTE_HOST + "small_graph.json";
			json.readFromJSONURL(remote_file, function(graph, err) {
				expect(graph.nrNodes()).to.equal(4);
				expect(graph.nrDirEdges()).to.equal(0);
				expect(graph.nrUndEdges()).to.equal(4);
				expect(graph.getMode()).to.equal($G.GraphMode.UNDIRECTED);
				done();
			});
		});
		
		
		it('should correctly generate our small example graph from a remotely fetched JSON file with direction _mode set to undirected', (done) => {
			json = new JSON_IN();
			json._explicit_direction = false;
			json._direction = true; // undirected graph
			remote_file = REMOTE_HOST + "small_graph.json";
			json.readFromJSONURL(remote_file, function(graph, err) {
				expect(graph.nrNodes()).to.equal(4);
				expect(graph.nrDirEdges()).to.equal(7);
				expect(graph.nrUndEdges()).to.equal(0);
				expect(graph.getMode()).to.equal($G.GraphMode.DIRECTED);
				done();
			});
		});
		
	});
	
	
	describe('Real graph from JSON', () => {
		
		/**
		 * Edge list, but with a REAL graph now
		 * graph should have 5937 undirected nodes.
		 */ 
		it('should construct a real sized graph from a remotely fetched edge list with edges set to undirected', (done) => {
			json = new JSON_IN();
			remote_file = REMOTE_HOST + "real_graph.json";
			json.readFromJSONURL(remote_file, function(graph, err) {
				stats = graph.getStats();
				expect(stats.nr_nodes).to.equal(REAL_GRAPH_NR_NODES);
				expect(stats.nr_dir_edges).to.equal(0);
				expect(stats.nr_und_edges).to.equal(REAL_GRAPH_NR_EDGES);
				expect(stats.mode).to.equal($G.GraphMode.UNDIRECTED);
				done();
			});
		});
	
	});
	
	
	
	describe('Loading graphs in simulated browser environment', () => {		
		// Mocking the XHR object
		var mock = require('xhr-mock');
		var jsDomCleanup = null,
        mocked = false;
		
		// URL to replace with path
		var small_graph_url = REMOTE_HOST + "small_graph.json";
		var small_graph_path = 'test/test_data/small_graph.json';
		
		beforeEach(() => {		
			// Injecting browser globals into our Node environment
			jsDomCleanup = require('jsdom-global')();
			
			// Access to local filesystem for mocking service
			var fs = require('fs');
			var json = fs.readFileSync(small_graph_path).toString();
		
			//replace the real XHR object with the mock XHR object
			mock.setup();
			
			// Mocking Browser GET request to test server
			mock.get(small_graph_url, function(req, res) {
        mocked = true;
				return res
					.status(200)
					.header('Content-Type', 'application/json')
					.body(
						json
					)
				;
			});
		});
		
		
		afterEach(() => {
			mock.teardown();
			jsDomCleanup();
      mocked = false;
		});
		
		
		it('should throw an error when trying to read a file in the browser environment', () => {
			json = new JSON_IN();
			json._explicit_direction = true;
      json._weighted_mode = false;
			expect(json.readFromJSONFile.bind(json, small_graph_path)).to.throw('Cannot read file in browser environment.');
		});
		
				
		it('should correctly generate our small example graph from a remotely fetched JSON file with explicitly encoded edge directions', (done) => {
			json = new JSON_IN();
			json.readFromJSONURL(small_graph_url, function(graph, err) {
				$C.checkSmallGraphStats(graph);
        expect(mocked).to.be.true;
				done();
			});
		});
		
	});
			
});