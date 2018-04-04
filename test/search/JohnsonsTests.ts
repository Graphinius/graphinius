/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $J from '../../src/io/input/JSONInput';
import * as $D from '../../src/search/Dijkstra';
import * as $PFS from '../../src/search/PFS';
import * as $BH from '../../src/datastructs/binaryHeap';
import * as $C from '../../src/io/input/CSVInput';
import * as $BF from '../../src/search/BellmanFord';
import * as $N from '../../src/core/Nodes';
import * as $JO from '../../src/search/Johnsons';
import * as $FW from '../../src/search/FloydWarshall';
import * as $SU from '../../src/utils/structUtils';
import * as $BE from '../../src/centralities/Betweenness';
import * as sinonChai from 'sinon-chai';
import * as sinon from 'sinon';


chai.use(sinonChai);
const expect = chai.expect,
    json: $J.IJSONInput = new $J.JSONInput(true, false, true),
    csv: $C.ICSVInput = new $C.CSVInput(' ', false, false),
    search_graph = "./test/test_data/search_graph_multiple_SPs.json",
    bf_graph_file = "./test/test_data/bellman_ford.json",
    graph_search: $G.IGraph = json.readFromJSONFile(search_graph),
    graph_BF: $G.IGraph = json.readFromJSONFile(bf_graph_file);


//spy stuff
let BFDSpy,
    extraNSpy,
    preparePFSSpy,
    PFSinJohnsonsSpy;

//can I have more than one describe sections in a test file?
describe('Spy section Johnsons', () => {

    let sandbox = sinon.sandbox.create();

    beforeEach(() => {
        BFDSpy = sandbox.spy($BF, "BellmanFordDict");
        extraNSpy = sandbox.spy($JO, "addExtraNandE");
        preparePFSSpy = sandbox.spy($PFS, "preparePFSStandardConfig");
        PFSinJohnsonsSpy = sandbox.spy($JO, "PFSforAllSources");
    });

    afterEach(() => {
        sandbox.restore();
    });


    // it('debugging - positive graph in Johnsons', () => {
    //     $JO.Johnsons(graph_search);
    //     console.log(BFDSpy.callCount);
    //     //here this is normal not to be called (positive graph)
    //     console.log(extraNSpy.callCount);
    //     console.log(preparePFSSpy.callCount);
    //     console.log(PFSinJohnsonsSpy.callCount);
    //     // expect(BFDSpy).to.have.not.been.called;
    //     // expect(extraNSpy).to.have.not.been.called;
    //     // expect(reWeighSpy).to.have.not.been.called;
    //     //expect(PFSinJohnsonsSpy).to.have.been.calledOnce;
    // });

    // it('debugging - negative graph in Johnsons', () => {
    //     $JO.Johnsons(graph_BF);
    //     console.log(BFDSpy.callCount);
    //     console.log(extraNSpy.callCount);
    //     console.log(preparePFSSpy.callCount);
    //     console.log(PFSinJohnsonsSpy.callCount);
    // });

    // it('debugging', () => {
    //     $PFS.PFS(graph_search, graph_search.getRandomNode());
    //     console.log(BFDSpy.callCount);
    //     console.log(extraNSpy.callCount);
    //     console.log(preparePFSSpy.callCount);
    //     console.log(PFSinJohnsonsSpy.callCount);
    // });

});

//this part is fine when tested
describe('Johnsons APSP TEST -', () => {

    //paths to the graphs
    let bf_graph_neg_cycle_file = "./test/test_data/negative_cycle.json",
        bernd_graph = "./test/test_data/bernd_ares_pos.json",
        intermediate = "./test/test_data/bernd_ares_intermediate_pos.json",
        social_graph = "./test/test_data/social_network_edges.csv";

    //initialize graph objects
    let graph_NC: $G.IGraph,
        graph_bernd: $G.IGraph,
        graph_midsize: $G.IGraph,
        graph_social: $G.IGraph;


    beforeEach(() => {
        //read in the graph objects from file
        graph_NC = json.readFromJSONFile(bf_graph_neg_cycle_file),
        graph_bernd = json.readFromJSONFile(bernd_graph),
        graph_midsize = json.readFromJSONFile(intermediate),
        graph_social = csv.readFromEdgeListFile(social_graph);
    });


    //status: works fine.
    it('Johnsons and FW should give the very same dists result', () => {
        //next results will be the same only if the FW next is transformed, see next unit below
        let resultJ = $JO.Johnsons(graph_search);
        // console.log("Johnsons results");
        // console.log(resultJ[0]);
        // console.log(resultJ[1]);

        let resultFW = $FW.FloydWarshallAPSP(graph_search);
        // console.log("FW results");
        // console.log(resultFW[0]);
        // console.log(resultFW[1]);
        expect(resultJ[0]).to.deep.equal(resultFW[0]);
    });


    //now I leave it as it is to show, later the console logs can be deleted or outcommented
    it('next result of FW could be transformed to the one the Johnsons gives', () => {
        //the order of algorithms does not make a difference here, but be careful with negative graphs!
        
        let resultFW = $FW.FloydWarshallAPSP(graph_search);
        // console.log("FW next before transformation :");
        // console.log(resultFW[1]);
        // console.log("the same, transformed: ");
        // console.log($FW.changeNextToDirectParents(resultFW[1]));

        let resultJ = $JO.Johnsons(graph_search);
        // console.log("Johnsons next: ");
        // console.log(resultJ[1]);
        expect(resultJ[1]).to.deep.equal($FW.changeNextToDirectParents(resultFW[1]));

        //caution: the Johnsons re-weighs the negative graphs!
        //if you run it on the graph without cloning or re-reading the graph, all following tests will be flawed
        let resultFWB = $FW.FloydWarshallAPSP(graph_BF);
        // console.log("FW next before transformation :");
        // console.log(resultFWB[1]);
        // console.log("the same, transformed: ");
        // console.log($FW.changeNextToDirectParents(resultFWB[1]));

        let graph_BF1 = graph_BF.clone();
        let resultJB = $JO.Johnsons(graph_BF1);
        // console.log("Johnsons next: ");
        // console.log(resultJB[1]);
        expect(resultJB[1]).to.deep.equal($FW.changeNextToDirectParents(resultFWB[1]));
    });

    //Screwed! Since I made some small fix to the FW, this is screwed!!! FW is faster!
    /**
     * Performance comparisons should be extracted out, especially when spies are used on some functions involved, since spying drastically impairs performance
     */
    it.skip('on midsize graphs, runtime of Johnsons should be faster than Floyd-Warshall', () => {
        let startF = +new Date();
        $FW.FloydWarshallAPSP(graph_midsize);
        let endF = +new Date();
        //runtimes are always in ms
        let runtimeF = endF - startF;

        let startJ = +new Date();
        $JO.Johnsons(graph_midsize);
        let endJ = +new Date();
        let runtimeJ = endJ - startJ;

        expect(runtimeF).to.be.above(runtimeJ);
        console.log("On the midsize graph, Johnsons was " + runtimeF / runtimeJ + " times faster than FW." +
            "runtime Johnsons: " + runtimeJ + " ms, runtime FW: " + runtimeF + " ms.");
    });

    //Screwed! Since I made some small fix to the FW, this is screwed!!! FW is faster!
    //skipped as default because it takes very long. Activate only when you really want to see it. 
    it.skip('on large all-positive graphs, runtime of Johnsons should be faster than Floyd-Warshall', () => {
        let startF = +new Date();
        $FW.FloydWarshallAPSP(graph_social);
        let endF = +new Date();
        //runtimes are always in ms
        let runtimeF = endF - startF;

        let startJ = +new Date();
        $JO.Johnsons(graph_social);
        let endJ = +new Date();
        let runtimeJ = endJ - startJ;

        expect(runtimeF).to.be.above(runtimeJ);
        console.log("On the social graph, Johnsons was " + runtimeF / runtimeJ + " times faster than FW." +
            "runtime Johnsons: " + runtimeJ + " ms, runtime FW: " + runtimeF + " ms.");
    });

    //status: works fine.
    it('should refuse to compute Johnsons on empty graph', () => {
        var empty_graph = new $G.BaseGraph("iamempty");
        expect($JO.Johnsons.bind($JO.Johnsons, empty_graph)).to.throw(
            "Cowardly refusing to traverse graph without edges.");
    });

    //status: works fine.
    it('should correctly recognize graphs with/without negative edges', () => {
        expect(graph_search.hasNegativeEdge()).to.equal(false);
        expect(graph_BF.hasNegativeEdge()).to.equal(true);
        expect(graph_NC.hasNegativeEdge()).to.equal(true);
    });

    //status: works fine. 
    it('graph with negative cycle should throw an error message, but only then', () => {
        let graph_BF2 = graph_BF.clone();
        expect($JO.Johnsons.bind($JO.Johnsons, graph_NC)).to.throw(
            "The graph contains a negative cycle, thus it can not be processed");
        expect($JO.Johnsons.bind($JO.Johnsons, graph_BF2)).to.not.throw();
        expect($JO.Johnsons.bind($JO.Johnsons, graph_search)).to.not.throw();
    });

    //status: works fine.
    it('function addextraNandE should function correctly', () => {
        var extraNode: $N.BaseNode = new $N.BaseNode("extraNode");
        //need to clone to be able to make a comparison, but works without cloning, too. I checked. 
        let graph_extra = graph_search.clone();
        graph_extra = $JO.addExtraNandE(graph_extra, extraNode);
        expect(graph_search.nrNodes()).to.equal((graph_extra.nrNodes()) - 1);
        expect(graph_extra.nrDirEdges() + graph_extra.nrUndEdges()).to.equal(graph_search.nrDirEdges() + graph_search.nrUndEdges() + graph_search.nrNodes());
    });

    //status: works fine
    it('function reweighGraph should function correctly', () => {
        expect(graph_BF.hasNegativeEdge()).to.equal(true);
        let graph_BF3 = graph_BF.clone();
        var extraNode: $N.BaseNode = new $N.BaseNode("extraNode");
        graph_BF3 = $JO.addExtraNandE(graph_BF3, extraNode);
        let BFresult = $BF.BellmanFordDict(graph_BF3, extraNode);
        graph_BF3 = $JO.reWeighGraph(graph_BF3, BFresult.distances, extraNode);
        //now it should have no negtive edge any more
        expect(graph_BF3.hasNegativeEdge()).to.equal(false);
    });

});

