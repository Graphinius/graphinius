import * as $G from "@/core/base/BaseGraph";
import { JSONInput, IJSONInConfig } from "@/io/input/JSONInput";
import { GraphPartitioning, Partition } from "@/partitioning/interfaces";
import { KLPartitioning, KL_Config, GainEntry } from "@/partitioning/KLPartitioning";
import { Logger } from "@/utils/Logger";

import { JSON_PART_PATH } from "_/config/test_paths";

const logger = new Logger();

const json = new JSONInput({ explicit_direction: false, directed: false, weighted: true }),
  n8_kl_file = `${JSON_PART_PATH}/8n_kl_graph_unweighted.json`,
  n3_missing_partition_file = `${JSON_PART_PATH}/n3_missing_parts.json`,
  n3_3partitions_file = `${JSON_PART_PATH}/n3_3partitions.json`;

/**
 *
 */
describe("Kernighan-Lin graph partitioning tests - ", () => {
  let n8_kl_graph: $G.IGraph, kl_part: KLPartitioning, config: KL_Config, partitioning: GraphPartitioning;

  beforeEach(() => {
    config = {
      initShuffle: false,
      directed: false,
      weighted: false,
    };
    n8_kl_graph = json.readFromJSONFile(n8_kl_file);
    expect(n8_kl_graph.nrNodes()).toBe(8);
    expect(n8_kl_graph.nrDirEdges()).toBe(0);
    expect(n8_kl_graph.nrUndEdges()).toBe(13);
  });

  describe("initialization tests - ", () => {
    it("should not accept a graph without explicit initial node partitioning (in non-shuffle mode)", () => {
      let n3_missing_parts_graph = json.readFromJSONFile(n3_missing_partition_file);
      let badInput = () => {
        return new KLPartitioning(n3_missing_parts_graph);
      };
      expect(badInput).toThrow('no node feature "partition" encountered - you need to set initShuffle to true');
    });

    it("should not accept a graph with !== 2 initial partitions (in non-shuffle mode)", () => {
      let n3_3parts_graph = json.readFromJSONFile(n3_3partitions_file);
      let badInput = () => {
        return new KLPartitioning(n3_3parts_graph);
      };
      expect(badInput).toThrow("KL partitioning works on 2 initial partitions only");
    });

    it("should automatically get 2 initial partitions in SHUFFLE mode", () => {
      config.initShuffle = true;
      let goodInit = () => {
        return new KLPartitioning(n8_kl_graph, config);
      };
      expect(goodInit).not.toThrow("KL partitioning works on 2 initial partitions only");
    });

    it("should construct data structures of correct length, no shuffle", () => {
      kl_part = new KLPartitioning(n8_kl_graph);
      let init_partitioning = kl_part._partitionings.get(kl_part._currentPartitioning);
      expect(init_partitioning.nodePartMap.size).toBe(8);
      expect(init_partitioning.partitions.size).toBe(2);
      expect(init_partitioning.partitions.get(1).nodes.size).toBe(4);
      expect(init_partitioning.partitions.get(2).nodes.size).toBe(4);
      expect(Object.keys(kl_part._costs.internal).length).toBe(8);
      expect(Object.keys(kl_part._costs.external).length).toBe(8);
      expect(kl_part._open_sets.partition_a.size).toBe(4);
      expect(kl_part._open_sets.partition_b.size).toBe(4);
    });

    // For loop in order to evade 'random' errors
    // for ( let i = 0; i < 1000; i++ ) {
    it("should construct data structures of correct length, SHUFFLE MODE", () => {
      config.initShuffle = true;
      kl_part = new KLPartitioning(n8_kl_graph, config);
      let init_partitioning = kl_part._partitionings.get(kl_part._currentPartitioning);
      expect(init_partitioning.nodePartMap.size).toBe(8);
      expect(init_partitioning.partitions.size).toBe(2);
      expect(init_partitioning.partitions.get(1).nodes.size).toBe(4);
      expect(init_partitioning.partitions.get(2).nodes.size).toBe(4);
      expect(Object.keys(kl_part._costs.internal).length).toBe(8);
      expect(Object.keys(kl_part._costs.external).length).toBe(8);
      expect(kl_part._open_sets.partition_a.size).toBe(4);
      expect(kl_part._open_sets.partition_b.size).toBe(4);
    });
    // }

    it("should correctly initialize the partitioning", () => {
      kl_part = new KLPartitioning(n8_kl_graph);
      let init_partitioning = kl_part._partitionings.get(kl_part._currentPartitioning);

      expect(init_partitioning.nodePartMap.get("1")).toBe(1);
      expect(init_partitioning.nodePartMap.get("2")).toBe(1);
      expect(init_partitioning.nodePartMap.get("3")).toBe(1);
      expect(init_partitioning.nodePartMap.get("4")).toBe(1);
      expect(init_partitioning.nodePartMap.get("5")).toBe(2);
      expect(init_partitioning.nodePartMap.get("6")).toBe(2);
      expect(init_partitioning.nodePartMap.get("7")).toBe(2);
      expect(init_partitioning.nodePartMap.get("8")).toBe(2);

      expect(init_partitioning.partitions.get(1).nodes.has("1")).toBe(true);
      expect(init_partitioning.partitions.get(1).nodes.has("2")).toBe(true);
      expect(init_partitioning.partitions.get(1).nodes.has("3")).toBe(true);
      expect(init_partitioning.partitions.get(1).nodes.has("4")).toBe(true);
      expect(init_partitioning.partitions.get(2).nodes.has("5")).toBe(true);
      expect(init_partitioning.partitions.get(2).nodes.has("6")).toBe(true);
      expect(init_partitioning.partitions.get(2).nodes.has("7")).toBe(true);
      expect(init_partitioning.partitions.get(2).nodes.has("8")).toBe(true);
    });

    it("should correctly compute the internal and external cost for each node, UNweighted mode", () => {
      kl_part = new KLPartitioning(n8_kl_graph);
      let costs = kl_part._costs;
      expect(costs.external["1"]).toBe(2);
      expect(costs.internal["1"]).toBe(1);
      expect(costs.external["2"]).toBe(2);
      expect(costs.internal["2"]).toBe(1);
      expect(costs.external["3"]).toBe(3);
      expect(costs.internal["3"]).toBe(1);
      expect(costs.external["4"]).toBe(2);
      expect(costs.internal["4"]).toBe(1);
      expect(costs.external["5"]).toBe(2);
      expect(costs.internal["5"]).toBe(1);
      expect(costs.external["6"]).toBe(3);
      expect(costs.internal["6"]).toBe(1);
      expect(costs.external["7"]).toBe(2);
      expect(costs.internal["7"]).toBe(1);
      expect(costs.external["8"]).toBe(2);
      expect(costs.internal["8"]).toBe(1);
      expect(kl_part._partitionings.get(kl_part._currentPartitioning).cut_cost).toBe(9);
    });

    it("should correctly compute the internal and external cost for each node, WEIGHTED mode", () => {
      config.weighted = true;
      kl_part = new KLPartitioning(n8_kl_graph, config);

      let costs = kl_part._costs;
      expect(costs.external["1"]).toBe(19);
      expect(costs.internal["1"]).toBe(3);
      expect(costs.external["2"]).toBe(4);
      expect(costs.internal["2"]).toBe(3);
      expect(costs.external["3"]).toBe(8);
      expect(costs.internal["3"]).toBe(11);
      expect(costs.external["4"]).toBe(7);
      expect(costs.internal["4"]).toBe(11);
      expect(costs.external["5"]).toBe(9);
      expect(costs.internal["5"]).toBe(1);
      expect(costs.external["6"]).toBe(15);
      expect(costs.internal["6"]).toBe(1);
      expect(costs.external["7"]).toBe(9);
      expect(costs.internal["7"]).toBe(1);
      expect(costs.external["8"]).toBe(5);
      expect(costs.internal["8"]).toBe(1);
      expect(kl_part._partitionings.get(kl_part._currentPartitioning).cut_cost).toBe(38);
    });

    it("should correctly compute the correct gains of a first iteration", () => {
      kl_part = new KLPartitioning(n8_kl_graph);

      logger.log("Order of nodes in graph: (take Map for absolute certainty)");
      logger.log(Object.keys(n8_kl_graph.getNodes()));
      let part_it = kl_part._partitionings.get(kl_part._currentPartitioning).partitions.values();
      logger.log("Order of partition 1:");
      logger.log(part_it.next().value.nodes.keys());
      logger.log("Order of partition 2:");
      logger.log(part_it.next().value.nodes.keys());

      let heap = kl_part._gainsHeap;
      expect(heap.getArray().length).toBe(16);

      /**
       * We only check for correct priority, since heap
       * operations do not necessarily preserve input order
       * or same-priority elements (???)
       */
      expect(heap.pop().gain).toBe(3);
      expect(heap.pop().gain).toBe(3);
      expect(heap.pop().gain).toBe(2);
      expect(heap.pop().gain).toBe(2);
      expect(heap.pop().gain).toBe(2);
      expect(heap.pop().gain).toBe(2);
      expect(heap.pop().gain).toBe(2);
      expect(heap.pop().gain).toBe(2);
      expect(heap.pop().gain).toBe(1);
      expect(heap.pop().gain).toBe(1);
      expect(heap.pop().gain).toBe(1);
      expect(heap.pop().gain).toBe(1);
      expect(heap.pop().gain).toBe(0);
      expect(heap.pop().gain).toBe(0);
      expect(heap.pop().gain).toBe(0);
      expect(heap.pop().gain).toBe(0);
    });

    it("should correctly compute the correct gains of a first iteration, WEIGHTED MODE", () => {
      config.weighted = true;
      kl_part = new KLPartitioning(n8_kl_graph, config);

      logger.log("Order of nodes in graph: (take Map for absolute certainty)");
      logger.log(Object.keys(n8_kl_graph.getNodes()));
      let part_it = kl_part._partitionings.get(kl_part._currentPartitioning).partitions.values();
      logger.log("Order of partition 1:");
      logger.log(part_it.next().value.nodes.keys());
      logger.log("Order of partition 2:");
      logger.log(part_it.next().value.nodes.keys());

      let heap = kl_part._gainsHeap;
      expect(heap.getArray().length).toBe(16);

      /**
       * We only check for correct priority, since heap
       * operations do not necessarily preserve input order
       * or same-priority elements (???)
       */
      expect(heap.pop().gain).toBe(24);
      expect(heap.pop().gain).toBe(20);
      expect(heap.pop().gain).toBe(11);
      expect(heap.pop().gain).toBe(10);
      expect(heap.pop().gain).toBe(10);
      expect(heap.pop().gain).toBe(9);
      expect(heap.pop().gain).toBe(9);
      expect(heap.pop().gain).toBe(6);
      expect(heap.pop().gain).toBe(5);
      expect(heap.pop().gain).toBe(5);
      expect(heap.pop().gain).toBe(5);
      expect(heap.pop().gain).toBe(4);
      expect(heap.pop().gain).toBe(-1);
      expect(heap.pop().gain).toBe(-2);
      expect(heap.pop().gain).toBe(-7);
      expect(heap.pop().gain).toBe(-8);
    });
  });

  describe("Kernighan-Lin tests for one iteration of the algorithm - ", () => {
    it("should correctly perform an optimal swap and eliminate locked connections from heap", () => {
      kl_part = new KLPartitioning(n8_kl_graph);
      kl_part.doSwapAndDropLockedConnections();
      let heap = kl_part._gainsHeap;
      expect(heap.getArray().length).toBe(9);
    });

    it("should correctly perform an optimal swap and update costs accordingly", () => {
      kl_part = new KLPartitioning(n8_kl_graph);
      let ge = kl_part.doSwapAndDropLockedConnections();
      kl_part.updateCosts(ge);
      expect(kl_part._partitionings.get(kl_part._currentPartitioning).cut_cost).toBe(6);

      let heap = kl_part._gainsHeap;
      expect(heap.getArray().length).toBe(9);

      /**
       * These are heap entries before cost updates;
       * Will be the same as before in NON-weighted mode...
       */
      expect(heap.pop().gain).toBe(3);
      expect(heap.pop().gain).toBe(2);
      expect(heap.pop().gain).toBe(2);
      expect(heap.pop().gain).toBe(2);
      expect(heap.pop().gain).toBe(2);
      expect(heap.pop().gain).toBe(1);
      expect(heap.pop().gain).toBe(1);
      expect(heap.pop().gain).toBe(0);
      expect(heap.pop().gain).toBe(0);
    });

    it("should correctly swap and eliminate locked connections from heap, WEIGHTED mode", () => {
      config.weighted = true;
      kl_part = new KLPartitioning(n8_kl_graph, config);
      let ge = kl_part.doSwapAndDropLockedConnections();
      kl_part.updateCosts(ge);
      expect(kl_part._partitionings.get(kl_part._currentPartitioning).cut_cost).toBe(14);

      let heap = kl_part._gainsHeap;
      expect(heap.getArray().length).toBe(9);

      /**
       * Heap entries after cost update
       */
      expect(heap.pop().gain).toBe(11);
      expect(heap.pop().gain).toBe(10);
      expect(heap.pop().gain).toBe(9);
      expect(heap.pop().gain).toBe(5);
      expect(heap.pop().gain).toBe(5);
      expect(heap.pop().gain).toBe(5);
      expect(heap.pop().gain).toBe(4);
      expect(heap.pop().gain).toBe(-2);
      expect(heap.pop().gain).toBe(-7);
    });
  });
});
