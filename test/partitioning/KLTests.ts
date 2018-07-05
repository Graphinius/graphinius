/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $JSON from '../../src/io/input/JSONInput';
import { GraphPartitioning, Partition } from '../../src/partitioning/Interfaces';
import { KLPartitioning } from '../../src/partitioning/KLPartitioning';

import { Logger } from '../../src/utils/logger';
const logger = new Logger();


const expect = chai.expect,
    json : $JSON.JSONInput = new $JSON.JSONInput(false, false, false),
		n8_kl_file = "./test/test_data/partitioning/8n_kl_graph_unweighted.json";



describe.only("Kernighan-Lin graph partitioning tests - ", () => {

	let n8_kl_graph : $G.IGraph,
			kl_part: KLPartitioning,
			partitioning : GraphPartitioning;


	beforeEach( () => {
    n8_kl_graph = json.readFromJSONFile( n8_kl_file );
    expect( n8_kl_graph.nrNodes() ).to.equal(8);
    expect( n8_kl_graph.nrDirEdges() ).to.equal(0);
    expect( n8_kl_graph.nrUndEdges() ).to.equal(13);
  });


  it('should correctly initialize the partitioning', () => {
    kl_part = new KLPartitioning(n8_kl_graph);
    let init_partitioning = kl_part._partitioning;
    expect(Object.keys(init_partitioning.nodePartMap).length).to.equal(8);
    expect(init_partitioning.nodePartMap["1"]).to.equal(1);
    expect(init_partitioning.nodePartMap["2"]).to.equal(1);
    expect(init_partitioning.nodePartMap["3"]).to.equal(1);
    expect(init_partitioning.nodePartMap["4"]).to.equal(1);
    expect(init_partitioning.nodePartMap["5"]).to.equal(2);
    expect(init_partitioning.nodePartMap["6"]).to.equal(2);
    expect(init_partitioning.nodePartMap["7"]).to.equal(2);
    expect(init_partitioning.nodePartMap["8"]).to.equal(2);

    expect(Object.keys(init_partitioning.partitions).length).to.equal(2);
    // console.log(Object.keys(init_partitioning.partitions["1"].nodes));
    // console.log(Object.keys(init_partitioning.partitions["2"].nodes));
    expect(Object.keys(init_partitioning.partitions["1"].nodes).length).to.equal(4);
    expect(Object.keys(init_partitioning.partitions["2"].nodes).length).to.equal(4);
    expect(Object.keys(init_partitioning.partitions["1"].nodes)).to.contain("1");
    expect(Object.keys(init_partitioning.partitions["1"].nodes)).to.contain("2");
    expect(Object.keys(init_partitioning.partitions["1"].nodes)).to.contain("3");
    expect(Object.keys(init_partitioning.partitions["1"].nodes)).to.contain("4");
    expect(Object.keys(init_partitioning.partitions["2"].nodes)).to.contain("5");
    expect(Object.keys(init_partitioning.partitions["2"].nodes)).to.contain("6");
    expect(Object.keys(init_partitioning.partitions["2"].nodes)).to.contain("7");
    expect(Object.keys(init_partitioning.partitions["2"].nodes)).to.contain("8");
  });


  it.skip('should correctly compute the internal and external cost for each node', () => {
    kl_part = new KLPartitioning(n8_kl_graph);
    // let init_partitioning = kl_part._partitioning;
  });

});
