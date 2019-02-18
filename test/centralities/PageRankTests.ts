import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/io/input/JSONInput';
import * as $PRG from '../../src/centralities/PageRankGaussian';
import * as $PRRW from '../../src/centralities/PageRankRandomWalk';
import * as $CSV from '../../src/io/input/CSVInput';


var expect = chai.expect,
    csv : $CSV.ICSVInput = new $CSV.CSVInput(" ", false, false),
    json   : $I.IJSONInput = new $I.JSONInput(true, false, true),
    deg_cent_graph = "./test/test_data/search_graph_pfs_extended.json",
    sn_graph_file = "./test/test_data/social_network_edges.csv",
    graph_unweighted_undirected = "./test/test_data/network_undirected_unweighted.csv",
    graph : $G.IGraph = json.readFromJSONFile(deg_cent_graph),
    graph_und_unw = csv.readFromEdgeListFile(graph_unweighted_undirected),
    PRCRW = new $PRRW.pageRankCentrality(),
    PRCG  = new $PRG.pageRankDetCentrality();


describe("PageRank Centrality Tests", () => {

    test('should return correct betweenness map', () => {
        let prd = PRCG.getCentralityMap(graph);
        expect( prd ).toEqual([ 0.1332312404287902,
        0.18376722817764174,
        0.17457886676875956,
        0.2787136294027564,
        0.18376722817764166,
        0.045941807044410435 ]);
    });


    test('should calculate similar values for random walk and gaussian', () => {
        let prd  = PRCG.getCentralityMap(graph);
        //console.log("GAUSS:"+JSON.stringify(prd));
        let prrw = PRCRW.getCentralityMap(graph);
        //console.log("RANDOM:"+JSON.stringify(prrw));
        checkPageRanks(graph, prd, prrw, 0.5);
    });

    test(
        'should calculate similar values for random walk and gaussian on undirected unweighted graph',
        () => {
            let prd  = PRCG.getCentralityMap(graph_und_unw);
            //console.log("GAUSS:"+JSON.stringify(prd));
            let prrw = PRCRW.getCentralityMap(graph_und_unw);
            //console.log("RANDOM:"+JSON.stringify(prrw));
            //checkPageRanks(graph, prd, prrw, 0.5); //TODO:: order matrix
        }
    );

    test(
        'should return the same centrality score for each node. Tested on graphs with 2, 3 and 6 nodes respectively.',
        () => {
            let graph_2 = csv.readFromEdgeListFile("./test/test_data/centralities_equal_score_2.csv");
            let graph_3 = csv.readFromEdgeListFile("./test/test_data/centralities_equal_score_3.csv");
            let graph_6 = csv.readFromEdgeListFile("./test/test_data/centralities_equal_score_6.csv");
            checkScoresEqual(graph_2,PRCG.getCentralityMap( graph_2 ));
            checkScoresEqual(graph_3,PRCG.getCentralityMap( graph_3 ));
            checkScoresEqual(graph_6,PRCG.getCentralityMap( graph_6 ));
        }
    );


    test('should stop random walk after short time', () => {
        let prrw = PRCRW.getCentralityMap(graph_und_unw, true, 0.10, 0.8);

        for(let key in prrw){
            expect(prrw[key]).toBeLessThan(0.3);
        }
    });

    test(
        'should not stop random walk with convergence criteria but with iterations',
        () => {
            let prrw = PRCRW.getCentralityMap(graph_und_unw, true, 0.10, 0.0000000000001,2);

            for(let key in prrw){
                expect(prrw[key]).toBeLessThan(0.2);
            }
        }
    );

    test.skip('should calculate the PR for a large graph', () => {
        let sn_graph = csv.readFromEdgeListFile(sn_graph_file);
        let pdc = PRCG.getCentralityMap( sn_graph );
        expect(pdc).toBe({});
    });


});

function checkScoresEqual(graph,gauss){
    let threshold = 0.00000001;
    let last = gauss[0];
    let ctr = 0;
    for(let key in graph.getNodes()) {
        expect(gauss[ctr]).to.be.closeTo(1/graph.nrNodes(),threshold);
        expect(gauss[ctr]).to.be.closeTo(last,threshold);
        last = gauss[ctr];
        ctr++;
    }
}

function checkPageRanks(graph, gauss, rand_walk, threshold) {
    let ctr = 0;
    for(let key in graph.getNodes()) {
        //console.log(gauss[ctr]+" rw:"+rand_walk[key]+" " + posMin(gauss[ctr],rand_walk[key])+ " "+key);
        expect(posMin(gauss[ctr],rand_walk[key])<threshold).toBe(true);
        ctr++;
    }
}

function posMin(a:number,b:number):number{
    if(a > b)
        return a-b;
    else return b-a;
}