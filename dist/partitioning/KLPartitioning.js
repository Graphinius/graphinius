"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KCut_1 = require("./KCut");
const binaryHeap_1 = require("../datastructs/binaryHeap");
const logger_1 = require("../utils/logger");
const logger = new logger_1.Logger();
const DEFAULT_WEIGHT = 1;
;
;
;
class KLPartitioning {
    constructor(_graph, config) {
        this._graph = _graph;
        this._config = config || {
            initShuffle: false,
            directed: false,
            weighted: false
        };
        this._bestPartitioning = 1;
        this._currentPartitioning = 1;
        this._partitionings = new Map();
        this._gainsHash = new Map();
        this._costs = {
            internal: {},
            external: {},
        };
        this._open_sets = {
            partition_a: new Map(),
            partition_b: new Map()
        };
        this._adjList = this._graph.adjListDict();
        this._keys = Object.keys(this._graph.getNodes());
        this.initPartitioning(this._config.initShuffle);
        let nr_parts = this._partitionings.get(this._currentPartitioning).partitions.size;
        if (nr_parts !== 2) {
            throw new Error(`KL partitioning works on 2 initial partitions only, got ${nr_parts}.`);
        }
        this.initCosts();
        this.initGainsHeap();
    }
    initPartitioning(initShuffle) {
        if (initShuffle) {
            this._partitionings.set(this._currentPartitioning, new KCut_1.KCut(this._graph).cut(2, true));
            let part_it = this._partitionings.get(this._currentPartitioning).partitions.values();
            part_it.next().value.nodes.forEach(node => {
                this._open_sets.partition_a.set(node.getID(), true);
            });
            part_it.next().value.nodes.forEach(node => {
                this._open_sets.partition_b.set(node.getID(), true);
            });
        }
        else {
            let partitioning = {
                partitions: new Map(),
                nodePartMap: new Map(),
                cut_cost: 0
            };
            this._partitionings.set(this._currentPartitioning, partitioning);
            for (let key of this._keys) {
                let node = this._graph.getNodeById(key);
                let node_part = node.getFeature('partition');
                if (node_part == null) {
                    throw new Error('no node feature "partition" encountered - you need to set initShuffle to true');
                }
                else {
                    partitioning.nodePartMap.set(key, node_part);
                    if (!partitioning.partitions.get(node_part)) {
                        partitioning.partitions.set(node_part, {
                            nodes: new Map()
                        });
                    }
                    partitioning.partitions.get(node_part).nodes.set(key, node);
                }
                if (node_part === 1) {
                    this._open_sets.partition_a.set(key, true);
                }
                else {
                    this._open_sets.partition_b.set(key, true);
                }
            }
        }
    }
    initCosts() {
        let partitioning = this._partitionings.get(this._currentPartitioning), nodePartMap = partitioning.nodePartMap;
        for (let source of Object.keys(this._graph.getNodes())) {
            this._costs.external[source] = 0;
            this._costs.internal[source] = 0;
            Object.keys(this._adjList[source]).forEach(target => {
                logger.write(`[${nodePartMap.get(source)}, ${nodePartMap.get(target)}]`);
                let edge_weight = this._config.weighted ? this._adjList[source][target] : DEFAULT_WEIGHT;
                if (nodePartMap.get(source) === nodePartMap.get(target)) {
                    logger.write('\u2713' + ' ', logger_1.LogColors.FgGreen, true);
                    this._costs.internal[source] += edge_weight;
                }
                else {
                    logger.write('\u2717' + ' ', logger_1.LogColors.FgRed, true);
                    this._costs.external[source] += edge_weight;
                    partitioning.cut_cost += edge_weight;
                }
            });
            logger.log('');
        }
        partitioning.cut_cost /= 2;
    }
    initGainsHeap() {
        let partitioning = this._partitionings.get(this._currentPartitioning), partition_iterator = partitioning.partitions.values(), first_partition = partition_iterator.next().value, second_partition = partition_iterator.next().value;
        let evalID = (obj) => obj.id, evalPriority = (obj) => obj.gain;
        this._gainsHeap = new binaryHeap_1.BinaryHeap(binaryHeap_1.BinaryHeapMode.MAX, evalPriority, evalID);
        first_partition.nodes.forEach(source => {
            let source_id = source.getID();
            second_partition.nodes.forEach(target => {
                let target_id = target.getID();
                let edge_weight = 0;
                let adj_weight = parseFloat(this._adjList[source_id][target_id]);
                if (!isNaN(adj_weight)) {
                    edge_weight = this._config.weighted ? adj_weight : DEFAULT_WEIGHT;
                }
                let pair_gain = this._costs.external[source_id] - this._costs.internal[source_id] + this._costs.external[target_id] - this._costs.internal[target_id] - 2 * edge_weight;
                let gain_entry = {
                    id: `${source_id}_${target_id}`,
                    source: source,
                    target: target,
                    gain: pair_gain
                };
                this._gainsHeap.insert(gain_entry);
                this._gainsHash.set(gain_entry.id, gain_entry);
            });
        });
    }
    performIteration() {
        let ge = this.doSwapAndDropLockedConnections();
        this.updateCosts(ge);
        this._currentPartitioning++;
    }
    updateCosts(swap_ge) {
        this._gainsHash.forEach((k, v) => {
            logger.log(k.id);
        });
        let partitioning = this._partitionings.get(this._currentPartitioning);
        partitioning.cut_cost -= swap_ge.gain;
        let partition_iterator = partitioning.partitions.keys(), first_partition = partition_iterator.next().value, second_partition = partition_iterator.next().value;
        [swap_ge.source, swap_ge.target].forEach(source => {
            let influencer = source.getID();
            source.allNeighbors().forEach(ne => {
                let source_id = ne.node.getID();
                logger.log(`Cost update for node ${source_id}`);
                let gain_id;
                if (partitioning.nodePartMap.get(influencer) === first_partition) {
                    gain_id = `${influencer}_${source_id}`;
                }
                else {
                    gain_id = `${source_id}_${influencer}`;
                }
            });
        });
    }
    doSwapAndDropLockedConnections() {
        let gain_entry = this._gainsHeap.pop(), source_id = gain_entry.id.split('_')[0], target_id = gain_entry.id.split('_')[1];
        this._gainsHash.delete(gain_entry.id);
        let partitioning = this._partitionings.get(this._currentPartitioning), partition_iterator = partitioning.partitions.values(), first_partition = partition_iterator.next().value.nodes, second_partition = partition_iterator.next().value.nodes;
        logger.log(`Swapping node pair (${source_id}, ${target_id})`);
        first_partition.delete(source_id);
        first_partition.set(target_id, gain_entry.target);
        second_partition.delete(target_id);
        second_partition.set(source_id, gain_entry.source);
        second_partition.forEach(target => {
            let target_id = target.getID();
            this.removeGainsEntry(`${source_id}_${target_id}`);
        });
        first_partition.forEach(source => {
            let source_id = source.getID();
            this.removeGainsEntry(`${source_id}_${target_id}`);
        });
        return gain_entry;
    }
    removeGainsEntry(heap_id) {
        if (this._gainsHash.has(heap_id)) {
            this._gainsHeap.remove(this._gainsHash.get(heap_id));
            this._gainsHash.delete(heap_id);
        }
    }
}
exports.KLPartitioning = KLPartitioning;
