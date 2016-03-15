/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/input/JSONInput';
import * as $BFS from '../../src/search/BFS';
import * as $DFS from '../../src/search/DFS';
import * as $PFS from '../../src/search/PFS';

var expect = chai.expect,
    json   : $I.IJSONInput = new $I.JSONInput(true, false, true),
    search_graph = "./test/input/test_data/search_graph_pfs.json",
    graph : $G.IGraph = json.readFromJSONFile(search_graph);


describe('PFS TESTS - ', () => {

  beforeEach(() => {
    expect(graph).not.to.be.undefined;
    expect(graph.nrNodes()).to.equal(6);
    expect(graph.nrUndEdges()).to.equal(0);
    expect(graph.nrDirEdges()).to.equal(9);
  });


});