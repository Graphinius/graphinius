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
    n8_kl_file = "./test/test_data/partitioning/8n_kl_graph_unweighted.json",
    n3_missing_partition_file = "./test/test_data/partitioning/n3_missing_parts.json", 
    n3_3partitions_file = "./test/test_data/partitioning/n3_3partitions.json";



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


  describe('initialization tests - ', () => {


    it('should not accept a graph without explicit initial node partitioning (in non-shuffle mode)', () => {
      let n3_missing_parts_graph = json.readFromJSONFile( n3_missing_partition_file );
      let badInput = () => {
        return new KLPartitioning( n3_missing_parts_graph );
      }
      expect(badInput).to.throw('no node feature "partition" encountered - you need to set initShuffle to true');
    });


    it('should not accept a graph with >2 initial partitions (in non-shuffle mode)', () => {
      let n3_3parts_graph = json.readFromJSONFile( n3_3partitions_file );
      let badInput = () => {
        return new KLPartitioning( n3_3parts_graph );
      }
      expect(badInput).to.throw("KL partitioning works on 2 initial partitions only.");
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

      expect(kl_part._costs.maxGain.gain).to.equal(Number.NEGATIVE_INFINITY);
    });


    it('should correctly compute the internal and external cost for each node', () => {
      kl_part = new KLPartitioning(n8_kl_graph);
      let costs = kl_part._costs;
      expect(costs.external["1"]).to.equal(2);
      expect(costs.internal["1"]).to.equal(1);
      expect(costs.external["2"]).to.equal(2);
      expect(costs.internal["2"]).to.equal(1);
      expect(costs.external["3"]).to.equal(3);
      expect(costs.internal["3"]).to.equal(1);
      expect(costs.external["4"]).to.equal(2);
      expect(costs.internal["4"]).to.equal(1);
      expect(costs.external["5"]).to.equal(2);
      expect(costs.internal["5"]).to.equal(1);
      expect(costs.external["6"]).to.equal(3);
      expect(costs.internal["6"]).to.equal(1);
      expect(costs.external["7"]).to.equal(2);
      expect(costs.internal["7"]).to.equal(1);
      expect(costs.external["8"]).to.equal(2);
      expect(costs.internal["8"]).to.equal(1);

      expect(kl_part._partitioning.cut_cost).to.equal(9);
      // expect(costs.maxGain.gain).to.equal(0);
    });

  });

});
