import * as chai from 'chai';
import {Logger} from '../../src/utils/logger';
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

const logger = new Logger();

chai.use(sinonChai);
const expect = chai.expect,
    json: $J.IJSONInput = new $J.JSONInput(true, false, true),
    csv: $C.ICSVInput = new $C.CSVInput(' ', false, false),
    search_graph = "./test/test_data/search_graph_multiple_SPs.json",
    bf_graph_file = "./test/test_data/bellman_ford.json",
    graph_search: $G.IGraph = json.readFromJSONFile(search_graph),
    graph_BF: $G.IGraph = json.readFromJSONFile(bf_graph_file);

let BFDSpy,
    extraNSpy,
    preparePFSSpy,
    PFSinJohnsonsSpy;


/*
describe('Spy section Johnsons', () => {

    let sandbox = sinon.createSandbox();

    beforeEach(() => {
        BFDSpy = sandbox.spy($BF, "BellmanFordDict");
        extraNSpy = sandbox.spy($JO, "addExtraNandE");
        preparePFSSpy = sandbox.spy($PFS, "preparePFSStandardConfig");
        PFSinJohnsonsSpy = sandbox.spy($JO, "PFSFromAllNodes");
    });

    afterEach(() => {
        sandbox.restore();
    });

});
*/

describe('Johnsons APSP TEST -', () => {

    let bf_graph_neg_cycle_file = "./test/test_data/negative_cycle.json",
        bernd_graph = "./test/test_data/bernd_ares_pos.json",
        intermediate = "./test/test_data/bernd_ares_intermediate_pos.json",
        social_graph = "./test/test_data/social_network_edges_1K.csv";

    let graph_NC: $G.IGraph,
        graph_bernd: $G.IGraph,
        graph_midsize: $G.IGraph,
        graph_social: $G.IGraph;


    beforeEach(() => {
        graph_NC = json.readFromJSONFile(bf_graph_neg_cycle_file),
        graph_bernd = json.readFromJSONFile(bernd_graph),
        graph_midsize = json.readFromJSONFile(intermediate),
        graph_social = csv.readFromEdgeListFile(social_graph);
    });


    it('Johnsons and FW should give the very same dists result', () => {
        // next results will be the same only if the FW next is transformed, see next unit below
        let resultJ = $JO.Johnsons(graph_search);
        logger.log("Johnsons results");
        logger.log(resultJ[0]);
        logger.log(resultJ[1]);

        let resultFW = $FW.FloydWarshallAPSP(graph_search);
        logger.log("FW results");
        logger.log(resultFW[0]);
        logger.log(resultFW[1]);
        expect(resultJ[0]).to.deep.equal(resultFW[0]);
    });


    it('next result of FW could be transformed to the one the Johnsons gives', () => {
        //the order of algorithms does not make a difference here, but be careful with negative graphs!
        
        let resultFW = $FW.FloydWarshallAPSP(graph_search);
        logger.log("FW next before transformation :");
        logger.log(resultFW[1]);
        logger.log("the same, transformed: ");
        logger.log($FW.changeNextToDirectParents(resultFW[1]));

        let resultJ = $JO.Johnsons(graph_search);
        logger.log("Johnsons next: ");
        logger.log(resultJ[1]);
        expect(resultJ[1]).to.deep.equal($FW.changeNextToDirectParents(resultFW[1]));
    });
    

    it('next result of FW on a negative-edge graph could be transformed to the one the Johnsons gives', () => {
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

    /**
     * @todo outsource to the performance test suite, once established...
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
        logger.log("On the midsize graph, Johnsons was " + runtimeF / runtimeJ + " times faster than FW." +
            "runtime Johnsons: " + runtimeJ + " ms, runtime FW: " + runtimeF + " ms.");
    });

    /**
     * @todo outsource to the performance test suite, once established...
     */
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
        logger.log("On the social graph, Johnsons was " + runtimeF / runtimeJ + " times faster than FW." +
            "runtime Johnsons: " + runtimeJ + " ms, runtime FW: " + runtimeF + " ms.");
    });

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

    it('graph with negative cycle should throw an error message, but only then', () => {
        let graph_BF2 = graph_BF.clone();
        expect($JO.Johnsons.bind($JO.Johnsons, graph_NC)).to.throw(
            "The graph contains a negative cycle, thus it can not be processed");
        expect($JO.Johnsons.bind($JO.Johnsons, graph_BF2)).to.not.throw();
        expect($JO.Johnsons.bind($JO.Johnsons, graph_search)).to.not.throw();
    });

    it('function addextraNandE should function correctly', () => {
        var extraNode: $N.BaseNode = new $N.BaseNode("extraNode");
        //need to clone to be able to make a comparison, but works without cloning, too. I checked. 
        let graph_extra = graph_search.clone();
        graph_extra = $JO.addExtraNandE(graph_extra, extraNode);
        expect(graph_search.nrNodes()).to.equal((graph_extra.nrNodes()) - 1);
        expect(graph_extra.nrDirEdges() + graph_extra.nrUndEdges()).to.equal(graph_search.nrDirEdges() + graph_search.nrUndEdges() + graph_search.nrNodes());
    });

    it('function reweighGraph should function correctly', () => {
        expect(graph_BF.hasNegativeEdge()).to.equal(true);
        let graph_BF3 = graph_BF.clone();
        var extraNode: $N.BaseNode = new $N.BaseNode("extraNode");
        graph_BF3 = $JO.addExtraNandE(graph_BF3, extraNode);
        let BFresult = $BF.BellmanFordDict(graph_BF3, extraNode);
        graph_BF3 = $JO.reWeighGraph(graph_BF3, BFresult.distances, extraNode);
        expect(graph_BF3.hasNegativeEdge()).to.equal(false);
    });

});

