import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $CSV from '../../src/io/input/CSVInput';
import * as $JSON from '../../src/io/input/JSONInput';
import * as $CC from '../../src/centralities/Closeness';

const SN_GRAPH_NODES = 1034,
      SN_GRAPH_EDGES = 53498 / 2; // edges are specified in directed fashion

let expect = chai.expect,
    csv : $CSV.ICSVInput = new $CSV.CSVInput(" ", false, false),
    json   : $JSON.IJSONInput = new $JSON.JSONInput(true, false, true),
    sn_graph_file = "./test/test_data/social_network_edges.csv",
    sn_graph_file_300 = "./test/test_data/social_network_edges_300.csv",
    deg_cent_graph = "./test/test_data/search_graph_pfs_extended.json",
    und_unw_graph = "./test/test_data/undirected_unweighted_6nodes.csv",
    graph : $G.IGraph = json.readFromJSONFile(deg_cent_graph),
    graph_und_unw : $G.IGraph = csv.readFromEdgeListFile(und_unw_graph),
    closeness_mapFW,
    CC = new $CC.closenessCentrality();


describe("Closeness Centrality Tests", () => {

    test('should return a map of nodes of length 6', () => {
        let ccfw = CC.getCentralityMapFW(graph);
        expect( Object.keys( ccfw ).length ).toBe(6);
        let cc = CC.getCentralityMap(graph);
        expect( Object.keys( cc ).length ).toBe(6);
    });

    test('Testing on single node graph', () => {
        let graph_1: $G.IGraph = json.readFromJSONFile("./test/test_data/centralities_equal_score_1.json");

        expect(CC.getCentralityMap.bind(CC.getCentralityMap, graph_1)).toThrowError("Cowardly refusing to traverse graph without edges.");

        let CCFW = new $CC.closenessCentrality();
        expect(CCFW.getCentralityMapFW.bind(CC.getCentralityMapFW, graph_1)).toThrowError("Cowardly refusing to traverse graph without edges.");

        //This results in an empty map because there are no edges in the graph
        //expect( Object.keys( closeness_map ).length ).to.equal(0);
    });


    test(
        'should return the correct closeness map, PFS on weighted directed graph',
        () => {
            let expected_closeness_map = {
                "A": 0.07692307692307693,
                "B": 0.08333333333333333,
                "C": 0.08333333333333333,
                "D": 0.041666666666666664,
                "E": 0.041666666666666664,
                "F": 0.045454545454545456

            };
            let closeness_map = CC.getCentralityMap(graph);
            expect( closeness_map ).toEqual(expected_closeness_map);
        }
    );

    test(
        'should return the correct closenesses, FW on weighted directed graph',
        () => {
            let expected_closeness_map = [
                0.07692307692307693,
                0.08333333333333333,
                0.08333333333333333,
                0.041666666666666664,
                0.045454545454545456,
                0.041666666666666664
            ];
            let CCFW = new $CC.closenessCentrality();
            let closeness_map = CCFW.getCentralityMapFW(graph);
            expect( closeness_map ).toEqual(expected_closeness_map);
        }
    );

    test(
        'should return the correct closeness map, PFS/FW on unweighted undirected graph, for normal and FW with next',
        () => {
            let expected_closeness_map = {
                "1": 0.14285714285714285,   //1/7
                "2": 0.16666666666666666,   //1/6
                "3": 0.2,                   //1/5
                "4": 0.14285714285714285,
                "5": 0.16666666666666666,
                "6": 0.14285714285714285

            };
            let CCFW = new $CC.closenessCentrality();
            let closeness_map_FW = CCFW.getCentralityMapFW(graph_und_unw);
            let closeness_map = CC.getCentralityMap(graph_und_unw);


            let ctr = 0;
            for(let key in closeness_map){
                //console.log("["+key+"]"+closeness_map[key]+" " +closeness_map_FW[ctr]+"["+ctr+"]");
                expect(closeness_map[key]).toBe(closeness_map_FW[ctr]);
                ctr++;
            }
            expect( closeness_map ).toEqual(expected_closeness_map);
        }
    );

    test(
        'should return the same centrality score for each node. Tested on graphs with 2, 3 and 6 nodes respectively.',
        () => {
            let CCFW = new $CC.closenessCentrality();
            let graph_2 = csv.readFromEdgeListFile("./test/test_data/centralities_equal_score_2.csv");
            let graph_3 = csv.readFromEdgeListFile("./test/test_data/centralities_equal_score_3.csv");
            let graph_6 = csv.readFromEdgeListFile("./test/test_data/centralities_equal_score_6.csv");
            checkScoresEqual(graph_2,CC.getCentralityMap( graph_2 ));
            checkScoresEqual(graph_3,CC.getCentralityMap( graph_3 ));
            checkScoresEqual(graph_6,CC.getCentralityMap( graph_6 ));
            //checkScoresEqual(graph_2,CCFW.getCentralityMapFW( graph_2 ));
            //checkScoresEqual(graph_3,CCFW.getCentralityMapFW( graph_3 ));
            //checkScoresEqual(graph_6,CCFW.getCentralityMapFW( graph_6 ));
        }
    );



    /**
     * Performance measurement
     * 
     * TODO: Outsource to it's own performance test suite
     */

    test(
        'should run the closeness centrality on a 300 nodes social network, FW',
        () => {
            let sn_graph = csv.readFromEdgeListFile(sn_graph_file_300);

            let CCFW = new $CC.closenessCentrality();
            closeness_mapFW = CCFW.getCentralityMapFW(sn_graph);
        }
    );

    test(
        'should run the closeness centrality on a 300 nodes social network, should be same as FW',
        () => {
            let sn_graph = csv.readFromEdgeListFile(sn_graph_file_300);

            let CCFW = new $CC.closenessCentrality();

            let d = +new Date();
            closeness_mapFW = CCFW.getCentralityMapFW(sn_graph);
            let e = +new Date();
            //console.log(closeness_mapFW);
            console.log("Closeness with FW took " + (e-d) + "ms to finish");
            d = +new Date();
            let cc = CC.getCentralityMap(sn_graph);
            e = +new Date();
            //console.log(cc);
            console.log("Closeness with PFS took " + (e-d) + "ms to finish");
            let ctr = 0;
            for(let key in cc){
                //console.log("["+key+"]"+cc[key]+" " +closeness_mapFW[ctr]+"["+ctr+"]");
                expect(cc[key]).toBe(closeness_mapFW[ctr]);
                ctr++;
            }
        }
    );

    test.skip(
        'should run the closeness centrality on a ~1k nodes social network, should be same as FW',
        () => {
            let sn_graph = csv.readFromEdgeListFile(sn_graph_file);

            let CCFW = new $CC.closenessCentrality();

            let d = +new Date();
            closeness_mapFW = CCFW.getCentralityMapFW(sn_graph);
            let e = +new Date();
            //console.log(closeness_mapFW);
            console.log("Closeness with FW took " + (e-d) + "ms to finish");
            d = +new Date();
            let cc = CC.getCentralityMap(sn_graph);
            e = +new Date();
            //console.log(cc);
            console.log("Closeness with PFS took " + (e-d) + "ms to finish");
            let ctr = 0;
            for(let key in cc){
                //console.log("["+key+"]"+cc[key]+" " +closeness_mapFW[ctr]+"["+ctr+"]");
                expect(cc[key]).toBe(closeness_mapFW[ctr]);
                ctr++;
            }
        }
    );

});


function checkScoresEqual(graph, closeness) {
    let last = closeness[graph.getRandomNode().getID()];
    for(let key in graph.getNodes()) {
        expect(closeness[key]).toBe(last);
        last = closeness[key];
    }
}