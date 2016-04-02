var chai = require('chai');
var $G = require('../../index.js').$G;

var expect = chai.expect;

var BASE_URL = 'http://berndmalle.com/graphinius-demo/test_data/json/';


describe('loading graph from remote URL - ', function() {

  it('should correctly instantiate the small sample graph from URL', function(done) {

    var cb = function(graph, err) {
      expect(graph.nrNodes()).to.equal(4);
      expect(graph.nrDirEdges()).to.equal(0);
      expect(graph.nrUndEdges()).to.equal(4);
      expect(graph.getMode()).to.equal($G.core.GraphMode.UNDIRECTED);
      done();
    };

    var json      = new $G.input.JsonInput(false, false, false),
        input_url = BASE_URL + 'small_graph.json',
        graph     = json.readFromJSONURL(input_url, cb);
  });


  it('should correctly instantiate a real sized graph from URL', function(done) {
    var REAL_GRAPH_NR_NODES = 6204,
        REAL_GRAPH_NR_EDGES = 18550;

    var cb = function(graph, err) {
      expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
      expect(graph.nrDirEdges()).to.equal(REAL_GRAPH_NR_EDGES);
      expect(graph.nrUndEdges()).to.equal(0);
      expect(graph.getMode()).to.equal($G.core.GraphMode.DIRECTED);
      done();
    };

    var json      = new $G.input.JsonInput(false, true, false),
        input_url = BASE_URL + 'real_graph.json',
        graph     = json.readFromJSONURL(input_url, cb);
  });

});