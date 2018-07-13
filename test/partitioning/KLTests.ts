/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $JSON from '../../src/io/input/JSONInput';
import { GraphPartitioning, Partition } from '../../src/partitioning/Interfaces';
import { KLPartitioning, KL_Config, GainEntry } from '../../src/partitioning/KLPartitioning';

import { Logger } from '../../src/utils/logger';
const logger = new Logger();


const expect = chai.expect,
    json : $JSON.JSONInput = new $JSON.JSONInput(false, false, true), // undirected, weighted
    n8_kl_file = "./test/test_data/partitioning/8n_kl_graph_unweighted.json",
    n3_missing_partition_file = "./test/test_data/partitioning/n3_missing_parts.json", 
    n3_3partitions_file = "./test/test_data/partitioning/n3_3partitions.json";



describe.only("Kernighan-Lin graph partitioning tests - ", () => {

	let n8_kl_graph : $G.IGraph,
      kl_part: KLPartitioning,
      config: KL_Config,
			partitioning : GraphPartitioning;


	beforeEach( () => {
    config = {
      initShuffle: false,
      directed: false,
      weighted: false
    };
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
      };
      expect(badInput).to.throw('no node feature "partition" encountered - you need to set initShuffle to true');
    });


    it('should not accept a graph with !== 2 initial partitions (in non-shuffle mode)', () => {
      let n3_3parts_graph = json.readFromJSONFile( n3_3partitions_file );
      let badInput = () => {
        return new KLPartitioning( n3_3parts_graph );
      };
      expect(badInput).to.throw("KL partitioning works on 2 initial partitions only");
    });


    it('should automatically get 2 initial partitions in SHUFFLE mode', () => {
      config.initShuffle = true;
      let goodInit = () => {
        return new KLPartitioning( n8_kl_graph, config );
      };
      expect(goodInit).not.to.throw("KL partitioning works on 2 initial partitions only");
    });


    it('should construct data structures of correct length, no shuffle', () => {
      kl_part = new KLPartitioning( n8_kl_graph );
      let init_partitioning = kl_part._partitionings.get(kl_part._currentPartitioning);
      expect(init_partitioning.nodePartMap.size).to.equal(8);
      expect(init_partitioning.partitions.size).to.equal(2);
      expect(init_partitioning.partitions.get(1).nodes.size).to.equal(4);
      expect(init_partitioning.partitions.get(2).nodes.size).to.equal(4);
      expect(Object.keys(kl_part._costs.internal).length).to.equal(8);
      expect(Object.keys(kl_part._costs.external).length).to.equal(8);
      expect(kl_part._open_sets.partition_a.size).to.equal(4);
      expect(kl_part._open_sets.partition_b.size).to.equal(4);
    });


    // For loop in order to evade 'random' errors
    // for ( let i = 0; i < 1000; i++ ) {
    it('should construct data structures of correct length, SHUFFLE MODE', () => {
      config.initShuffle = true;
      kl_part = new KLPartitioning( n8_kl_graph, config );
      let init_partitioning = kl_part._partitionings.get(kl_part._currentPartitioning);
      expect(init_partitioning.nodePartMap.size).to.equal(8);
      expect(init_partitioning.partitions.size).to.equal(2);
      expect(init_partitioning.partitions.get(1).nodes.size).to.equal(4);
      expect(init_partitioning.partitions.get(2).nodes.size).to.equal(4);
      expect(Object.keys(kl_part._costs.internal).length).to.equal(8);
      expect(Object.keys(kl_part._costs.external).length).to.equal(8);
      expect(kl_part._open_sets.partition_a.size).to.equal(4);
      expect(kl_part._open_sets.partition_b.size).to.equal(4);
    });
    // }


    it('should correctly initialize the partitioning', () => {
      kl_part = new KLPartitioning( n8_kl_graph );
      let init_partitioning = kl_part._partitionings.get(kl_part._currentPartitioning);

      expect(init_partitioning.nodePartMap.get("1")).to.equal(1);
      expect(init_partitioning.nodePartMap.get("2")).to.equal(1);
      expect(init_partitioning.nodePartMap.get("3")).to.equal(1);
      expect(init_partitioning.nodePartMap.get("4")).to.equal(1);
      expect(init_partitioning.nodePartMap.get("5")).to.equal(2);
      expect(init_partitioning.nodePartMap.get("6")).to.equal(2);
      expect(init_partitioning.nodePartMap.get("7")).to.equal(2);
      expect(init_partitioning.nodePartMap.get("8")).to.equal(2);

      expect(init_partitioning.partitions.get(1).nodes.has("1")).to.be.true;
      expect(init_partitioning.partitions.get(1).nodes.has("2")).to.be.true;
      expect(init_partitioning.partitions.get(1).nodes.has("3")).to.be.true;
      expect(init_partitioning.partitions.get(1).nodes.has("4")).to.be.true;
      expect(init_partitioning.partitions.get(2).nodes.has("5")).to.be.true;
      expect(init_partitioning.partitions.get(2).nodes.has("6")).to.be.true;
      expect(init_partitioning.partitions.get(2).nodes.has("7")).to.be.true;
      expect(init_partitioning.partitions.get(2).nodes.has("8")).to.be.true;
    });


    it('should correctly compute the internal and external cost for each node, UNweighted mode', () => {
      kl_part = new KLPartitioning( n8_kl_graph );
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
      expect(kl_part._partitionings.get(kl_part._currentPartitioning).cut_cost).to.equal(9);
    });


    it('should correctly compute the internal and external cost for each node, WEIGHTED mode', () => {
      config.weighted = true;
      kl_part = new KLPartitioning( n8_kl_graph, config );
      
      let costs = kl_part._costs;
      expect(costs.external["1"]).to.equal(19);
      expect(costs.internal["1"]).to.equal(3);
      expect(costs.external["2"]).to.equal(4);
      expect(costs.internal["2"]).to.equal(3);
      expect(costs.external["3"]).to.equal(8);
      expect(costs.internal["3"]).to.equal(11);
      expect(costs.external["4"]).to.equal(7);
      expect(costs.internal["4"]).to.equal(11);
      expect(costs.external["5"]).to.equal(9);
      expect(costs.internal["5"]).to.equal(1);
      expect(costs.external["6"]).to.equal(15);
      expect(costs.internal["6"]).to.equal(1);
      expect(costs.external["7"]).to.equal(9);
      expect(costs.internal["7"]).to.equal(1);
      expect(costs.external["8"]).to.equal(5);
      expect(costs.internal["8"]).to.equal(1);
      expect(kl_part._partitionings.get(kl_part._currentPartitioning).cut_cost).to.equal(38);
    });


    it('should correctly compute the correct gains of a first iteration', () => {      
      kl_part = new KLPartitioning(n8_kl_graph);
      
      logger.log('Order of nodes in graph: (take Map for absolute certainty)');
      logger.log(Object.keys(n8_kl_graph.getNodes()));
      let part_it = kl_part._partitionings.get(kl_part._currentPartitioning).partitions.values();
      logger.log('Order of partition 1:');
      logger.log(part_it.next().value.nodes.keys());
      logger.log('Order of partition 2:');
      logger.log(part_it.next().value.nodes.keys());

      let heap = kl_part._gainsHeap;
      expect(heap.getArray().length).to.equal(16);
      
      /**
       * We only check for correct priority, since heap
       * operations do not necessarily preserve input order
       * or same-priority elements (???)
       */
      expect(heap.pop().gain).to.equal(3);
      expect(heap.pop().gain).to.equal(3);
      expect(heap.pop().gain).to.equal(2);
      expect(heap.pop().gain).to.equal(2);
      expect(heap.pop().gain).to.equal(2);
      expect(heap.pop().gain).to.equal(2);
      expect(heap.pop().gain).to.equal(2);
      expect(heap.pop().gain).to.equal(2);      
      expect(heap.pop().gain).to.equal(1);
      expect(heap.pop().gain).to.equal(1);
      expect(heap.pop().gain).to.equal(1);
      expect(heap.pop().gain).to.equal(1);
      expect(heap.pop().gain).to.equal(0);
      expect(heap.pop().gain).to.equal(0);
      expect(heap.pop().gain).to.equal(0);
      expect(heap.pop().gain).to.equal(0);
    });


    it('should correctly compute the correct gains of a first iteration, WEIGHTED MODE', () => {
      config.weighted = true;     
      kl_part = new KLPartitioning(n8_kl_graph, config);
      
      logger.log('Order of nodes in graph: (take Map for absolute certainty)');
      logger.log(Object.keys(n8_kl_graph.getNodes()));
      let part_it = kl_part._partitionings.get(kl_part._currentPartitioning).partitions.values();
      logger.log('Order of partition 1:');
      logger.log(part_it.next().value.nodes.keys());
      logger.log('Order of partition 2:');
      logger.log(part_it.next().value.nodes.keys());

      let heap = kl_part._gainsHeap;
      expect(heap.getArray().length).to.equal(16);
      
      /**
       * We only check for correct priority, since heap
       * operations do not necessarily preserve input order
       * or same-priority elements (???)
       */
      expect(heap.pop().gain).to.equal(24);
      expect(heap.pop().gain).to.equal(20);
      expect(heap.pop().gain).to.equal(11);
      expect(heap.pop().gain).to.equal(10);
      expect(heap.pop().gain).to.equal(10);
      expect(heap.pop().gain).to.equal(9);
      expect(heap.pop().gain).to.equal(9);
      expect(heap.pop().gain).to.equal(6);      
      expect(heap.pop().gain).to.equal(5);
      expect(heap.pop().gain).to.equal(5);
      expect(heap.pop().gain).to.equal(5);
      expect(heap.pop().gain).to.equal(4);
      expect(heap.pop().gain).to.equal(-1);
      expect(heap.pop().gain).to.equal(-2);
      expect(heap.pop().gain).to.equal(-7);
      expect(heap.pop().gain).to.equal(-8);
    });


    it('should correctly perform an optimal swap and eliminate locked connections from heap', () => {      
      kl_part = new KLPartitioning(n8_kl_graph);
      kl_part.doSwapAndDropLockedConnections();
      let heap = kl_part._gainsHeap;
      expect(heap.getArray().length).to.equal(9);
    });


    it('should correctly perform an optimal swap and update costs accordingly', () => {      
      kl_part = new KLPartitioning(n8_kl_graph);
      let ge = kl_part.doSwapAndDropLockedConnections();
      kl_part.updateCosts(ge);
      expect(kl_part._partitionings.get(kl_part._currentPartitioning).cut_cost).to.equal(6);
      
      let heap = kl_part._gainsHeap;
      expect(heap.getArray().length).to.equal(9);

      /**
       * These are heap entries before cost updates;
       * Will be the same as before in NON-weighted mode...
       */
      expect(heap.pop().gain).to.equal(3);
      expect(heap.pop().gain).to.equal(2);
      expect(heap.pop().gain).to.equal(2);
      expect(heap.pop().gain).to.equal(2);
      expect(heap.pop().gain).to.equal(2);
      expect(heap.pop().gain).to.equal(1);
      expect(heap.pop().gain).to.equal(1);
      expect(heap.pop().gain).to.equal(0);
      expect(heap.pop().gain).to.equal(0);
    });


    it('should correctly swap and eliminate locked connections from heap, WEIGHTED mode', () => {      
      config.weighted = true;
      kl_part = new KLPartitioning( n8_kl_graph, config );
      let ge = kl_part.doSwapAndDropLockedConnections();
      kl_part.updateCosts(ge);
      expect(kl_part._partitionings.get(kl_part._currentPartitioning).cut_cost).to.equal(14);

      let heap = kl_part._gainsHeap;
      expect(heap.getArray().length).to.equal(9);

      /**
       * Heap entries after cost update
       */
      expect(heap.pop().gain).to.equal(11);
      expect(heap.pop().gain).to.equal(10);
      expect(heap.pop().gain).to.equal(9);     
      expect(heap.pop().gain).to.equal(5);
      expect(heap.pop().gain).to.equal(5);
      expect(heap.pop().gain).to.equal(5);
      expect(heap.pop().gain).to.equal(4);
      expect(heap.pop().gain).to.equal(-2);
      expect(heap.pop().gain).to.equal(-7);
    });

  });

});
