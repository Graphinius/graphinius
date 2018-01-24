/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $J from '../../src/io/input/JSONInput';
import * as $D from '../../src/search/Dijkstra';
import * as $PFS from '../../src/search/PFS';
import * as $BH from '../../src/datastructs/binaryHeap';
import * as sinon from 'sinon';
import * as $C from '../../src/io/input/CSVInput';
import * as $BF from '../../src/search/BellmanFord';
import * as $N from '../../src/core/Nodes';
import * as $JO from '../../src/search/Johnsons';
import * as $FW from '../../src/search/FloydWarshall';
import { Johnsons, PFSforAllSources, addExtraNandE } from '../../src/search/Johnsons';
import * as sinonChai from 'sinon-chai';


chai.use(sinonChai);
let expect = chai.expect;

let JSON_IN = $J.JSONInput;
let CSV_IN = $C.CSVInput;



//paths to the graphs
let search_graph = "./test/test_data/search_graph_multiple_SPs.json",
    bf_graph_file = "./test/test_data/bellman_ford.json",
    bf_graph_neg_cycle_file = "./test/test_data/negative_cycle.json",
    bernd_graph = "./test/test_data/bernd_ares_pos.json",
    intermediate = "./test/test_data/bernd_ares_intermediate_pos.json",
    social_graph = "./test/test_data/social_network_edges.csv";

describe('Johnsons APSP TEST -', () => {

    //initialize graph objects
    let graph_search: $G.IGraph,
        graph_BF: $G.IGraph,
        graph_NC: $G.IGraph,
        graph_bernd: $G.IGraph,
        graph_midsize: $G.IGraph,
        graph_social: $G.IGraph;

    before(() => {
        //creating the spies
        var BFDSpy = sinon.spy($BF.BellmanFordDict),
            extraNSpy = sinon.spy($JO.addExtraNandE),
            reWeighSpy = sinon.spy($JO.reWeighGraph),
            PFSinJohnsonsSpy = sinon.spy($JO.PFSforAllSources);

        let json: $J.IJSONInput = new $J.JSONInput(true, false, true),
            csv: $C.ICSVInput = new CSV_IN(' ', false, false);
        //read in the graph objects from file
        graph_search = json.readFromJSONFile(search_graph),
            graph_BF = json.readFromJSONFile(bf_graph_file),
            graph_NC = json.readFromJSONFile(bf_graph_neg_cycle_file),
            graph_bernd = json.readFromJSONFile(bernd_graph),
            graph_midsize = json.readFromJSONFile(intermediate),
            graph_social = csv.readFromEdgeListFile(social_graph);

        //these are not working, 
        //they give the same error message which is given in the DijkstraTest
        /* $BF.BellmanFordDict = BFDSpy;
         $JO.addExtraNandE = extraNSpy;
         $JO.reWeighGraph = reWeighSpy;
         $JO.PFSforAllSources = PFSinJohnsonsSpy;*/
    });

    //status: works fine.
    it('Johnsons and FW should give the very same dists result', () => {
        //I will change this chapter later to check if J and FW give the exactly same results
        //on a small all-positive graph (graph_search)

        let resultJ = $JO.Johnsons(graph_search);
        // console.log("Johnsons results");
        //console.log(resultJ[0]);
        //console.log(resultJ[1]);

        let resultFW = $FW.FloydWarshallAPSP(graph_search);
        //console.log("FW results");
        //console.log(resultFW[0]);
        //console.log(resultFW[1]);
        expect(resultJ[0]).to.deep.equal(resultFW[0]);
    });

    //status: not yet working
    it.only('next result of FW could be transformed to the one the Johnsons gives', () =>{
        let resultJ = $JO.Johnsons(graph_search);
        console.log("Johnsons next: ");
        console.log(resultJ[1]);
        let resultFW = $FW.FloydWarshallAPSP(graph_search);
        console.log("FW next before transformation :");
        console.log(resultFW[1]);
        console.log("the same, transformed: ");
        console.log($FW.changeNextToDirectParents(resultFW[1], graph_search));
    });

    //status: works fine.
    //no need to skip this as default, this does not take that long
    it('on midsize graphs, runtime of Johnsons should be faster than Floyd-Warshall', () => {
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

    //skipped as default because it takes very long. Activate only when you really want to see it. 
    //status: reports a fail because the FW timeouts, but it still reports the values, Johnsons is cca 2.5x faster.
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
        expect($JO.Johnsons.bind($JO.Johnsons, graph_NC)).to.throw(
            "The graph contains a negative edge, thus it can not be processed");
        expect($JO.Johnsons.bind($JO.Johnsons, graph_BF)).to.not.throw(
            "The graph contains a negative edge, thus it can not be processed");
        expect($JO.Johnsons.bind($JO.Johnsons, graph_search)).to.not.throw(
            "The graph contains a negative edge, thus it can not be processed");
    });


    //I coded out this part with the spies, they are causing build errors!
    /*
    //status: the call of PFS is not detected!!! - therefore it fails
    it.skip('all-positive graph should go directly to PFS, without calling functions of the longer way', () => {
        Johnsons(graph_search);
        expect(BFDSpy).to.have.not.been.called;
        expect(extraNSpy).to.have.not.been.called;
        expect(reWeighSpy).to.have.not.been.called;
        expect(PFSinJohnsonsSpy).to.have.been.calledOnce;
        //why does this fail??? It should be called once!
    });

    //status: fails, spies are not detecting the call
    it.skip('graphs with negative edges should go through the longer way', () => {
        Johnsons(graph_BF);
        expect(BFDSpy).to.have.been.calledOnce;
        expect(extraNSpy).to.have.been.calledOnce;
        expect(reWeighSpy).to.have.been.calledOnce;
        expect(PFSinJohnsonsSpy).to.have.been.calledOnce;
        //why does this fail??? they should be called!
    });*/

    //status: works fine.
    it('function addextraNandE should function correctly', () => {
        var extraNode: $N.BaseNode = new $N.BaseNode("extraNode");
        //need to clone to be able to make a comparison, but works without cloning, too. I checked. 
        let graph_extra = graph_search.clone();
        graph_extra = $JO.addExtraNandE(graph_extra, extraNode);
        expect(graph_search.nrNodes()).to.equal((graph_extra.nrNodes()) - 1);
        expect(graph_extra.nrDirEdges() + graph_extra.nrUndEdges()).to.equal(graph_search.nrDirEdges() + graph_search.nrUndEdges() + graph_search.nrNodes());
    });

    //status: works fine.
    it('function reweighGraph should function correctly', () => {
        expect(graph_BF.hasNegativeEdge()).to.equal(true);
        var extraNode: $N.BaseNode = new $N.BaseNode("extraNode");
        graph_BF = $JO.addExtraNandE(graph_BF, extraNode);
        let BFresult = $BF.BellmanFordDict(graph_BF, extraNode);
        graph_BF = $JO.reWeighGraph(graph_BF, BFresult.distances, extraNode);
        //now it should have no negtive edge any more
        expect(graph_BF.hasNegativeEdge()).to.equal(false);
    });

    //status: it runs without error, Johnsons gives the expected results
    //FW gives different dists - this is normal. However it gives very strange results for the parents - not normal.
    it('debugging corner :)', () => {
        //careful! If FW is run after the Johnsons, it goes with the re-weighed graph!
        console.log("results of FW:");
        let FWresultBFgraph = $FW.FloydWarshallAPSP(graph_BF);
        console.log(FWresultBFgraph[0]);
        console.log(FWresultBFgraph[1]);

        let JresultBFgraph = $JO.Johnsons(graph_BF);
        console.log("results of Johnsons");
        console.log(JresultBFgraph[0]);
        console.log(JresultBFgraph[1]);

        /*var extraNode: $N.BaseNode = new $N.BaseNode("extraNode");
        graph_BF = $JO.addExtraNandE(graph_BF, extraNode);
        let BFresult = $BF.BellmanFordDict(graph_BF, extraNode);
        graph_BF = $JO.reWeighGraph(graph_BF, BFresult.distances, extraNode);
        console.log(graph_BF.getDirEdgesArray());*/

    });








});

