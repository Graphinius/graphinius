import * as $G from '../../src/core/Graph';
import * as $I from '../../src/io/input/JSONInput';
import * as $Dijkstra from '../../src/search/Dijkstra';
import * as $PFS from '../../src/search/PFS';
import * as $BH from '../../src/datastructs/binaryHeap';

const json   : $I.IJSONInput = new $I.JSONInput(true, false, true),
    search_graph = "./test/test_data/search_graph_pfs_extended.json",
    graph : $G.IGraph = json.readFromJSONFile(search_graph);

// let PFSSpy,
//     PFSPrepareConfigSpy;

/**
 * come up with more tests
 */
describe('Dijkstra TESTS - ', () => {

  // let sandbox = sinon.createSandbox();

  beforeAll(() => {
    expect(graph).not.toBeUndefined();
    expect(graph.nrNodes()).toBe(6);
    expect(graph.nrUndEdges()).toBe(2);
    expect(graph.nrDirEdges()).toBe(12);
  });

  beforeEach(() => {
    // PFSSpy = sandbox.spy($PFS, "PFS");
    // PFSPrepareConfigSpy = sandbox.spy($PFS, "preparePFSStandardConfig");
  });

  afterEach(() => {
    // sandbox.restore();
  })
  
  
  test('should call PFS in the background - ', () => {
    $Dijkstra.Dijkstra(graph, graph.getRandomNode());
    // expect(PFSSpy).to.have.been.calledOnce;
    // expect(PFSPrepareConfigSpy).to.have.been.calledOnce;
   /* console.log(PFSSpy.callCount);
    console.log(PFSPrepareConfigSpy.callCount);*/
  });

});
