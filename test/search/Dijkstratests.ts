import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/io/input/JSONInput';
import * as $Dijkstra from '../../src/search/Dijkstra';
import * as $PFS from '../../src/search/PFS';
import * as $BH from '../../src/datastructs/binaryHeap';
import * as sinonChai from 'sinon-chai';
import * as sinon from 'sinon';
chai.use(sinonChai);

const expect = chai.expect,
    json   : $I.IJSONInput = new $I.JSONInput(true, false, true),
    search_graph = "./test/test_data/search_graph_pfs_extended.json",
    graph : $G.IGraph = json.readFromJSONFile(search_graph);

let PFSSpy,
    PFSPrepareConfigSpy;

/**
 * come up with more tests
 */
describe('Dijkstra TESTS - ', () => {

  let sandbox = sinon.createSandbox();

  before(() => {
    expect(graph).not.to.be.undefined;
    expect(graph.nrNodes()).to.equal(6);
    expect(graph.nrUndEdges()).to.equal(2);
    expect(graph.nrDirEdges()).to.equal(12);
  });

  beforeEach(() => {
    PFSSpy = sandbox.spy($PFS, "PFS");
    PFSPrepareConfigSpy = sandbox.spy($PFS, "preparePFSStandardConfig");
  });

  afterEach(() => {
    sandbox.restore();
  })
  
  
  it('should call PFS in the background - ', () => {
    $Dijkstra.Dijkstra(graph, graph.getRandomNode());
    expect(PFSSpy).to.have.been.calledOnce;
    expect(PFSPrepareConfigSpy).to.have.been.calledOnce;
   /* console.log(PFSSpy.callCount);
    console.log(PFSPrepareConfigSpy.callCount);*/
  });

});
