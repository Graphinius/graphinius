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

describe('Johnsons ASPS TEST -', () => {

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
        csv	: $C.ICSVInput = new CSV_IN(' ',false,false);
        //read in the graph objects from file
        graph_search = json.readFromJSONFile(search_graph),
            graph_BF = json.readFromJSONFile(bf_graph_file),
            graph_NC = json.readFromJSONFile(bf_graph_neg_cycle_file),
            graph_bernd = json.readFromJSONFile(bernd_graph),
            graph_midsize = json.readFromJSONFile(intermediate),
            graph_social= csv.readFromEdgeListFile(social_graph);

        //these give the same error message which is given in the DijkstraTest
        $BF.BellmanFordDict = BFDSpy;
        $JO.addExtraNandE = extraNSpy;
        $JO.reWeighGraph = reWeighSpy;
        $JO.PFSforAllSources = PFSinJohnsonsSpy;
    });

    it.only('temporary part, used for testing/debugging', () => {
        let resultJ= $JO.Johnsons(graph_search);
        console.log("Johnsons results");
        console.log(resultJ[0]);
        console.log(resultJ[1]);

        let resultFW= $FW.FloydWarshallAPSP(graph_search);
        console.log("FW results");
        console.log(resultFW[0]);
        console.log(resultFW[1]);
    

        /*let startF = +new Date();
        $FW.FloydWarshallAPSP(graph_social);
        let endF = +new Date();

       let startJ = +new Date();
        $JO.Johnsons(graph_social);
        let endJ = +new Date();

        console.log("Johnsons runtime" + (endJ - startJ));
        //console.log("FW runtime: " + (endF - startF));*/

    });

    //@Bernd: in case you have time, some of the test below fail
    //next week I try to figure out why, but it may be useful if you have a look at them too
    it('should refuse to compute Johnsons on empty graph', () => {
        var empty_graph = new $G.BaseGraph("iamempty");
        expect($JO.Johnsons.bind($JO.Johnsons, empty_graph)).to.throw(
            "Cowardly refusing to traverse graph without edges.");
    });

    it('should correctly recognize graphs with/without negative edges', () => {
        expect(graph_search.hasNegativeEdge()).to.equal(false);
        expect(graph_BF.hasNegativeEdge()).to.equal(true);
        expect(graph_NC.hasNegativeEdge()).to.equal(true);
    });

    /*it('all-positive graph should go directly to PFS, without calling functions of the longer way', () => {
        Johnsons(graph_search);
        expect(BFDSpy).to.have.not.been.called;
        expect(extraNSpy).to.have.not.been.called;
        expect(reWeighSpy).to.have.not.been.called;
        expect(PFSinJohnsonsSpy).to.have.been.calledOnce;
        //why does this fail??? It should be called once!
    });

    it('graphs with negative edges should go through the longer way', () => {
        //I have checked, the BF for this graph gives really true -> the problem is not with the function
        //there is some problem in my code
        Johnsons(graph_BF);
        expect(BFDSpy).to.have.been.calledOnce;
        expect(extraNSpy).to.have.been.calledOnce;
        expect(reWeighSpy).to.have.been.calledOnce;
        expect(PFSinJohnsonsSpy).to.have.been.calledOnce;
        //why does this fail??? they should be called!
    });

    it('function addextraNandE should function correctly', () => {
        var extraNode: $N.BaseNode = new $N.BaseNode("extraNode");
        let graph_extra = graph_search.clone();
        graph_extra = addExtraNandE(graph_extra, extraNode);
        expect(graph_search.nrNodes()).to.equal((graph_extra.nrNodes()) - 1);
        expect(graph_extra.nrDirEdges() + graph_extra.nrUndEdges()).to.equal(graph_search.nrDirEdges() + graph_search.nrUndEdges() + graph_search.nrNodes() + 1);
    });

    it('function reweighGraph should function correctly', () => {
        let graph_reWeighed = graph_BF.clone();
        var extraNode: $N.BaseNode = new $N.BaseNode("extraNode");
        graph_reWeighed = addExtraNandE(graph_reWeighed, extraNode);
        let BFresult = $BF.BellmanFordDict(graph_BF, extraNode);
        graph_reWeighed = $JO.reWeighGraph(graph_reWeighed, BFresult.distances);
        expect(graph_reWeighed.hasNegativeEdge()).to.equal(false);

    });

    it('graph with negative cycle should throw an error message', () => {
        expect($JO.Johnsons.bind($JO.Johnsons, graph_NC)).to.throw(
            "The graph contains a negative edge, thus it can not be processed");
    });*/



});

