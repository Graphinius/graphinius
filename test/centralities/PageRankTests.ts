/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/io/input/JSONInput';
import * as $PRG from '../../src/centralities/PageRankGaussian';
import * as $PRRW from '../../src/centralities/PageRankRandomWalk';
import * as $CSV from '../../src/io/input/CSVInput';
import * as $IC from '../../src/centralities/ICentrality';


var expect = chai.expect,
    csv : $CSV.ICSVInput = new $CSV.CSVInput(" ", false, false),
    json   : $I.IJSONInput = new $I.JSONInput(true, false, true),
    deg_cent_graph = "./test/test_data/search_graph_pfs_extended.json",
    sn_graph_file = "./test/test_data/social_network_edges.csv",
    graph : $G.IGraph = json.readFromJSONFile(deg_cent_graph),
    PRCRW: $IC.ICentrality = new $PRRW.pageRankCentrality(),
    PRCG: $IC.ICentrality = new $PRG.pageRankDetCentrality();


describe("PageRank Centrality Tests", () => {

    it('should return correct betweenness map', () => {
        let prd = PRCG.getCentralityMap(graph);
        expect( prd ).to.deep.equal(
            [ 0.1332312404287902,
            0.18376722817764174,
            0.17457886676875956,
            0.2787136294027564,
            0.18376722817764166,
            0.045941807044410435 ]
        );
    });


    it('should calculate similar values for random walk and gaussian', () => {
        let prd  = PRCG.getCentralityMap(graph);
        //console.log("GAUSS:"+JSON.stringify(prd));
        let prrw = PRCRW.getCentralityMap(graph);
        //console.log("RANDOM:"+JSON.stringify(prrw));
        checkPageRanks(graph, prd, prrw, 0.5);
    });

    it.skip('should calculate the PR for a large graph', () => {
        let sn_graph = csv.readFromEdgeListFile(sn_graph_file);
        let pdc = PRCG.getCentralityMap( sn_graph );
        expect(pdc).to.equal({});
    });


});

function checkPageRanks(graph, gauss, rand_walk, threshold) {
    let ctr = 0;
    for(let key in graph.getNodes()) {
        //console.log(gauss[ctr]+" rw:"+rand_walk[key]+" " + posMin(gauss[ctr],rand_walk[key])+ " "+key);
        expect(posMin(gauss[ctr],rand_walk[key])<threshold).to.equal(true);
        ctr++;
    }
}

function posMin(a:number,b:number):number{
    if(a > b)
        return a-b;
    else return b-a;
}