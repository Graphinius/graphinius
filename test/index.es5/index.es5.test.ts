const path = require('path');
const index = require(path.join(__dirname, '../../index.js'));


describe('Checking index.js structure - ', () => {

  const
    base = index.core.base,
    typed = index.core.typed;

  let
    node_a,
    node_b,
    edge,
    graph;

  beforeEach(() => {
    node_a = null;
    node_b = null;
    edge = null;
    graph = null;
  });


  describe('checking core...', () => {

    it('checks for the existence of the core object', () => {
      expect(typeof base).toBe("object");
    });


    it('core should contain GraphMode', () => {
      let GM = index.core.GraphMode;
      expect(GM.INIT).toBe(0);
      expect(GM.DIRECTED).toBe(1);
      expect(GM.UNDIRECTED).toBe(2);
      expect(GM.MIXED).toBe(3);
    });


    it('core should contain DIR(ection)', () => {
      let DIR = index.core.DIR;
      expect(DIR.in).toBe('ins');
      expect(DIR.out).toBe('outs');
      expect(DIR.und).toBe('unds');
    });


    /**
     * @todo only test one of the API methods !?
     */
    it('core should contain BaseNodes', () => {
      expect(typeof base.BaseNode).toBe("function");
      node_a = new base.BaseNode("A");
      // only Nodes have degree(s)
      expect(typeof node_a.inDegree).toBe("function");
    });


    it('core should contain BaseEdges', () => {
      expect(typeof base.BaseEdge).toBe("function");
      node_a = new base.BaseNode("A");
      node_b = new base.BaseNode("B");
      edge = new base.BaseEdge("edgy", node_a, node_b);
      // only Edges can be directed
      expect(typeof edge.isDirected).toBe("function");
    });


    it('core should contain BaseGraphs', () => {
      expect(typeof base.BaseGraph).toBe("function");
      graph = new base.BaseGraph("Graphinius Maximus");
      // only graphs can give you random nodes
      expect(typeof graph.getRandomNode).toBe("function");
    });


    it('core should contain TypedNodes', () => {
      expect(typeof typed.TypedNode).toBe("function");
      node_a = new typed.TypedNode("A", {type: "blahoo"});
      // only Typed Nodes have type
      expect(node_a.type).toBe("blahoo");
    });


    it('core should contain TypedEdges', () => {
      expect(typeof typed.TypedEdge).toBe("function");
      node_a = new typed.TypedNode("A", {type: "Person"});
      node_b = new typed.TypedNode("B", {type: "Person"});
      edge = new typed.TypedEdge("edgy", node_a, node_b, {type: "HATELOVE"});
      // only Typed Edges have type
      expect(edge.type).toBe("HATELOVE");
    });


    it('core should contain TypedGraphs', () => {
      expect(typeof typed.TypedGraph).toBe("function");
      graph = new typed.TypedGraph("Graphinius Maximus Typicus");
      // only Typed Graphs give you nodeTypes & edgeTypes
      expect(typeof graph.nodeTypes).toBe("function");
      expect(typeof graph.edgeTypes).toBe("function");
    });


    it('core should contain ComputeGraph', () => {
      expect(typeof index.core.compute.ComputeGraph).toBe("function");
    });


    it('compute graph should contain list / matrix methods', () => {
      graph = new base.BaseGraph("fodder for compute graph");
      const cg = new index.core.compute.ComputeGraph(graph);

      expect(typeof cg.adjListW).toBe("function");
      expect(typeof cg.adjMatrix).toBe("function");
      expect(typeof cg.adjMatrixW).toBe("function");
      expect(typeof cg.nextArray).toBe("function");
    });


    it('compute graph should contain list / matrix methods', () => {
      graph = new base.BaseGraph("fodder for compute graph");
      const cg = new index.core.compute.ComputeGraph(graph);

      expect(typeof cg.triadCount).toBe("function");
      expect(typeof cg.triangleCount).toBe("function");
      expect(typeof cg.transitivity).toBe("function");
    });

  });


  /**
   * @todo check & standardize general centrality signatures
   */
  describe('checking centralities...', () => {
    
    it('checks for the existence of the centralities object', () => {
      expect(typeof index.centralities).toBe("object");
    });


    it('centralities should contain Betweenness Centrality', () => {
      const bet = index.centralities.Betweenness;
      expect(typeof bet).toBe("function");
      // Once it is a class...
      // expect(new bet()).toBeDefined;
      // expect(typeof new deg().getCentralityMap).toBe("function");
    });


    it('centralities should contain Brandes Centrality', () => {
      const brand = index.centralities.Brandes;
      expect(typeof brand).toBe("function");
      // Once it is a class...
      expect(typeof new brand().computeWeighted).toBe("function");
      expect(typeof new brand().computeUnweighted).toBe("function");
      expect(typeof new brand().computePFSbased).toBe("function");
    });


    it('centralities should contain Closeness Centrality', () => {
      const close = index.centralities.Closeness;
      expect(typeof close).toBe("function");
      expect(typeof new close().getCentralityMap).toBe("function");
      expect(typeof new close().getCentralityMapFW).toBe("function");
    });


    it('centralities should contain Degree Centrality', () => {
      const deg = index.centralities.Degree;
      expect(typeof deg).toBe("function");
      expect(typeof new deg().getCentralityMap).toBe("function");
    });


    it('centralities should contain Pagerank Centrality', () => {
      const Pagerank = index.centralities.Pagerank;
      expect(typeof Pagerank).toBe("function");
      graph = new base.BaseGraph('PR');
      const pr = new Pagerank(graph);
      expect(typeof pr.computePR).toBe("function");
    });

  });


  describe('checking IO - Input...', () => {

    it('checks for the existence of the input object', () => {
      expect(typeof index.input).toBe("object");
    });


    it('should have CSVInput class', () => {
      const CSVIn = index.input.CSVInput;
      expect(typeof CSVIn).toBe("function");
      const csvin = new CSVIn();
      expect(typeof csvin.readFromAdjacencyListFile).toBe("function");
      expect(typeof csvin.readFromAdjacencyList).toBe("function");
      expect(typeof csvin.readFromAdjacencyListURL).toBe("function");
      expect(typeof csvin.readFromEdgeListFile).toBe("function");
      expect(typeof csvin.readFromEdgeList).toBe("function");
      expect(typeof csvin.readFromEdgeListURL).toBe("function");
    });


    it('should have JSONInput class', () => {
      const JSONIn = index.input.JSONInput;
      expect(typeof JSONIn).toBe("function");
      const jsonin = new JSONIn();
      expect(typeof jsonin.readFromJSONFile).toBe("function");
      expect(typeof jsonin.readFromJSON).toBe("function");
      expect(typeof jsonin.readFromJSONURL).toBe("function");
    });

  });


  describe('checking IO - Output...', () => {

    it('checks for the existence of the output object', () => {
      expect(typeof index.output).toBe("object");
    });


    it('should have CSVOutput class', () => {
      const CSVOut = index.output.CSVOutput;
      expect(typeof CSVOut).toBe("function");
      const csvout = new CSVOut();
      expect(typeof csvout.writeToAdjacencyListFile).toBe("function");
      expect(typeof csvout.writeToAdjacencyList).toBe("function");
      expect(typeof csvout.writeToEdgeListFile).toBe("function");
      expect(typeof csvout.writeToEdgeList).toBe("function");
    });

    
    it('should have JSONOutput class', () => {
      const JSONOut = index.output.JSONOutput;
      expect(typeof JSONOut).toBe("function");
      const jsonOut = new JSONOut();
      expect(typeof jsonOut.writeToJSONFile).toBe("function");
      expect(typeof jsonOut.writeToJSONString).toBe("function");
    });

  });


  describe('checking Search...', () => {

    it('checks for the existence of the search object', () => {
      expect(typeof index.search).toBe("object");
    });


    it('should have Breath-First-Search methods', () => {
      const BFS = index.search.BFS;
      expect(typeof BFS).toBe("object");
      expect(typeof BFS.BFS).toBe("function");
      expect(typeof BFS.prepareBFSStandardConfig).toBe("function");
    });


    it('should have Depth-First-Search methods', () => {
      const DFS = index.search.DFS;
      expect(typeof DFS).toBe("object");
      expect(typeof DFS.DFS).toBe("function");
      expect(typeof DFS.DFSVisit).toBe("function");
      expect(typeof DFS.prepareDFSStandardConfig).toBe("function");
      expect(typeof DFS.prepareDFSVisitStandardConfig).toBe("function");
    });


    it('should have Priority-First-Search methods', () => {
      const PFS = index.search.PFS;
      expect(typeof PFS).toBe("object");
      expect(typeof PFS.PFS).toBe("function");
      expect(typeof PFS.preparePFSStandardConfig).toBe("function");
    });


    /**
     * @todo make class out of it !
     */
    it('should have Dijkstra methods', () => {
      const Dijkstra = index.search.Dijkstra;
      expect(typeof Dijkstra).toBe("object");
      expect(typeof Dijkstra.Dijkstra).toBe("function");
    });


    /**
     * @todo make class out of it !
     */
    it('should have Bellman-Ford methods', () => {
      const BellmanFord = index.search.BellmanFord;
      expect(typeof BellmanFord).toBe("object");
      expect(typeof BellmanFord.BellmanFordDict).toBe("function");
      expect(typeof BellmanFord.BellmanFordArray).toBe("function");
    });


    /**
     * @todo make class out of it !
     */
    it('should have Floyd-Warshall methods', () => {
      const FloydWarshall = index.search.FloydWarshall;
      expect(typeof FloydWarshall).toBe("object");
      expect(typeof FloydWarshall.FloydWarshallArray).toBe("function");
      expect(typeof FloydWarshall.FloydWarshallAPSP).toBe("function");
    });


    /**
     * @description only Johnsons algorithm should be exported top-level here...
     * @todo make class out of it !
     */
    it('should have Johnsons methods', () => {
      const Johnsons = index.search.Johnsons;
      expect(typeof Johnsons).toBe("object");
      expect(typeof Johnsons.Johnsons).toBe("function");
    });

  });


  describe('checking Similarities...', () => {

    const similarities = index.similarities;
    const commons = index.similarities.Commons;
    const sets = index.similarities.Sets;
    const score = index.similarities.Score;


    it('checks for the existence of the commons object', () => {
      expect(typeof similarities).toBe("object");
      expect(typeof commons).toBe("object");
    });


    it('should have the sim method', () => {
      expect(typeof commons.sim).toBe("function");
    });


    it('should have the simSource method', () => {
      expect(typeof commons.simSource).toBe("function");
    });


    it('should have the simPairwise method', () => {
      expect(typeof commons.simPairwise).toBe("function");
    });


    it('should have the simSubsets method', () => {
      expect(typeof commons.simSubsets).toBe("function");
    });


    it('should have the simGroups method', () => {
      expect(typeof commons.simGroups).toBe("function");
    });


    it('should have the knnNodeArray method', () => {
      expect(typeof commons.knnNodeArray).toBe("function");
    });


    it('should have the knnNodeDict method', () => {
      expect(typeof commons.knnNodeDict).toBe("function");
    });


    it('should have the viaSharedPrefs method', () => {
      expect(typeof commons.viaSharedPrefs).toBe("function");
    });


    it('should have the getBsNotInA method', () => {
      expect(typeof commons.getBsNotInA).toBe("function");
    });


    it('checks for the existence of the sets object', () => {
      expect(typeof sets).toBe("object");
    });


    it('should have the jaccard method', () => {
      expect(typeof sets.simFuncs.jaccard).toBe("function");
    });


    it('should have the overlap method', () => {
      expect(typeof sets.simFuncs.overlap).toBe("function");
    });


    it('checks for the existence of the scores object', () => {
      expect(typeof score).toBe("object");
    });


    it('should have the cosine method', () => {
      expect(typeof score.simFuncs.cosine).toBe("function");
    });


    it('should have the cosineSets method', () => {
      expect(typeof score.simFuncs.cosineSets).toBe("function");
    });


    it('should have the euclidean method', () => {
      expect(typeof score.simFuncs.euclidean).toBe("function");
    });


    it('should have the euclideanSets method', () => {
      expect(typeof score.simFuncs.euclideanSets).toBe("function");
    });


    it('should have the pearson method', () => {
      expect(typeof score.simFuncs.pearson).toBe("function");
    });


    it('should have the pearsonSets method', () => {
      expect(typeof score.simFuncs.pearsonSets).toBe("function");
    });

  });


  describe('checking Utils...', () => {

    it('checks for the existence of the utils object', () => {
      expect(typeof index.utils).toBe("object");
    });


    it('should have Struct Utils', () => {
      const StructUtils = index.utils.Struct;
      expect(typeof StructUtils).toBe("object");
      expect(typeof StructUtils.clone).toBe("function");
      expect(typeof StructUtils.shuffleArray).toBe("function");
      expect(typeof StructUtils.mergeArrays).toBe("function");
      expect(typeof StructUtils.mergeObjects).toBe("function");
      expect(typeof StructUtils.findKey).toBe("function");
      expect(typeof StructUtils.mergeOrderedArraysNoDups).toBe("function");
    });


    it('should have Remote Utils', () => {
      const Remote = index.utils.Remote;
      expect(typeof Remote).toBe("object");
      expect(typeof Remote.retrieveRemoteFile).toBe("function");
      expect(typeof Remote.checkNodeEnvironment).toBe("function");
    });


    it('should have Callback Utils', () => {
      const Callback = index.utils.Callback;
      expect(typeof Callback).toBe("object");
      expect(typeof Callback.execCallbacks).toBe("function");
    });

  });


  describe('checking Data Structures...', () => {

    it('checks for the existence of the datastructs object', () => {
      expect(typeof index.datastructs).toBe("object");
    });


    it('should have BinaryHeap methods', () => {
      const BH = index.datastructs.BinaryHeap;
      expect(typeof BH).toBe("function");
      const bh = new BH();
      expect(typeof bh).toBe("object");
      expect(typeof bh.peek).toBe("function");
      expect(typeof bh.pop).toBe("function");      
      expect(typeof bh.find).toBe("function");
      expect(typeof bh.insert).toBe("function");
      expect(typeof bh.remove).toBe("function");
    });

  });


  describe('checking Perturbation class(es)', () => {

    it('checks for the existence of the perturbation object', () => {
      expect(typeof index.perturbation).toBe("object");
    });


    it('should have Simple Perturber', () => {
      const SP = index.perturbation.SimplePerturber;
      expect(SP).toBeDefined;
      expect(typeof SP).toBe("function");
      const sp = new SP();
      expect(typeof sp).toBe("object");
      expect(typeof sp.deleteNodesPercentage).toBe("function");
      expect(typeof sp.deleteUndEdgesPercentage).toBe("function");
      expect(typeof sp.deleteDirEdgesPercentage).toBe("function");
      expect(typeof sp.deleteNodesAmount).toBe("function");
      expect(typeof sp.deleteUndEdgesAmount).toBe("function");
      expect(typeof sp.deleteDirEdgesAmount).toBe("function");
      expect(typeof sp.addNodesPercentage).toBe("function");
      expect(typeof sp.addUndEdgesPercentage).toBe("function");
      expect(typeof sp.addDirEdgesPercentage).toBe("function");
      expect(typeof sp.addNodesAmount).toBe("function");
      expect(typeof sp.addEdgesAmount).toBe("function");
    });

  });


  describe('checking graph Generators', () => {

    it('checks for the existence of the generators object', () => {
      expect(typeof index.generators).toBe("object");
    });


    it('should have Kronecker generator', () => {
      const KROL = index.generators.Kronecker;
      expect(KROL).toBeDefined;
      expect(typeof KROL).toBe("function");
      const krol = new KROL();
      expect(typeof krol).toBe("object");
      expect(typeof krol.prepareKROLStandardConfig).toBe("function");
      expect(typeof krol.generate).toBe("function");
    });

  });

});
