import { IBaseNode } from "@/core/base/BaseNode";

export interface GraphPartitioning {
  partitions: Map<number, Partition>;
  nodePartMap: Map<string, number>;
  cut_cost: number;
}

export interface Partition {
  nodes: Map<string, IBaseNode>;
}
