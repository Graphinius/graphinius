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
import { Johnsons, PFSforAllSources, addExtraNandE } from '../../src/search/Johnsons';
import * as sinonChai from 'sinon-chai';


chai.use(sinonChai);
let expect = chai.expect;

let JSON_IN = $J.JSONInput;
let CSV_IN = $C.CSVInput;

//creating the spies
let BFDSpy = sinon.spy($BF.BellmanFordDict),
    extraNSpy = sinon.spy($JO.addExtraNandE),
    reWeighSpy = sinon.spy($JO.reWeighGraph),
    PFSinJohnsonsSpy = sinon.spy($JO.PFSforAllSources2);

//paths to the graphs
let search_graph = "./test/test_data/search_graph_multiple_SPs.json",
    bf_graph_file = "./test/test_data/bellman_ford.json",
    bf_graph_neg_cycle_file = "./test/test_data/negative_cycle.json";

describe.only('Johnsons ASPS TEST -', () => {

    //initialize graph objects
    let graph_search: $G.IGraph,
        graph_BF: $G.IGraph,
        graph_NC: $G.IGraph;

    before(() => {
        let json: $J.IJSONInput = new $J.JSONInput(true, false, true);
        //read in the graph objects from file
        graph_search = json.readFromJSONFile(search_graph),
            graph_BF = json.readFromJSONFile(bf_graph_file),
            graph_NC = json.readFromJSONFile(bf_graph_neg_cycle_file);

        //these give the same error message which is given in the DijkstraTest
        $BF.BellmanFordDict = BFDSpy;
        $JO.addExtraNandE = extraNSpy;
        $JO.reWeighGraph = reWeighSpy;
        $JO.PFSforAllSources2 = PFSinJohnsonsSpy;
    });

    it('temporary part, used for exploring', () => {
        //@ Bernd: if you run this one, it gives the results I calculated on paper for this graph
        //except that the order of the nodes is always abcdfe, instead of abcdef!
        console.log(Johnsons(graph_search)[1]);

        /*//in case you want to check the order of iteration, run this code
        let nodesDict=graph_search.getNodes();
        for (let key in nodesDict){
            console.log(key);*/

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

    it('all-positive graph should go directly to PFS, without calling functions of the longer way', () => {
        Johnsons(graph_search);
        expect(BFDSpy).to.have.not.been.called;
        expect(extraNSpy).to.have.not.been.called;
        expect(reWeighSpy).to.have.not.been.called;
        expect(PFSinJohnsonsSpy).to.have.been.calledOnce;
        //why does this fail??? It should be called once!
    });

    it('graphs with negative edges should go through the longer way', () => {
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
    });



});

