/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/io/input/JSONInput';
import * as $PFS from '../../src/search/PFS';
import * as $BH from '../../src/datastructs/binaryHeap';


var expect = chai.expect,
    json   : $I.IJSONInput = new $I.JSONInput(true, false, true),
    search_graph = "./test/test_data/search_graph_pfs_extended.json",
    graph : $G.IGraph = json.readFromJSONFile(search_graph);


describe('PFS TESTS - ', () => {

  beforeEach(() => {
    expect(graph).not.to.be.undefined;
    expect(graph.nrNodes()).to.equal(6);
    expect(graph.nrUndEdges()).to.equal(2);
    expect(graph.nrDirEdges()).to.equal(12);
  });
  
  
  it('should call PFS in the background - ', () => {



  });

});