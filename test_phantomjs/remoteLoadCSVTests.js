
var BASE_URL_CSV = 'http://berndmalle.com/graphinius-demo/test_data/csv/';


describe('loading graph from remote URL per CSV edge list - ', function() {

  it('should correctly instantiate the small sample graph from URL', function(done) {

    var cb = function(graph, err) {
      expect(graph.nrNodes()).to.equal(4);
      expect(graph.nrDirEdges()).to.equal(0);
      expect(graph.nrUndEdges()).to.equal(4);
      expect(graph.getMode()).to.equal($G.core.GraphMode.UNDIRECTED);
      done();
    };

    var csv = new $G.input.CsvInput();
    csv._explicit_direction = false;
		csv._direction_mode = false;
    var input_url = BASE_URL_CSV + 'small_graph_edge_list.csv';
    var graph = csv.readFromEdgeListURL(input_url, cb);
  });


  it('should correctly instantiate a real sized graph from URL', function(done) {
    var REAL_GRAPH_NR_NODES = 5937,
		    REAL_GRAPH_NR_EDGES = 17777;

    var cb = function(graph, err) {
      expect(graph.nrNodes()).to.equal(REAL_GRAPH_NR_NODES);
      expect(graph.nrDirEdges()).to.equal(REAL_GRAPH_NR_EDGES);
      expect(graph.nrUndEdges()).to.equal(0);
      expect(graph.getMode()).to.equal($G.core.GraphMode.DIRECTED);
      done();
    };

    var csv = new $G.input.CsvInput();
    csv._separator = " ";
    csv._explicit_direction = false;
		csv._direction_mode = true;
    var input_url = BASE_URL_CSV + 'real_graph_edge_list_no_dir.csv';
    var graph = csv.readFromEdgeListURL(input_url, cb);
  });

});
