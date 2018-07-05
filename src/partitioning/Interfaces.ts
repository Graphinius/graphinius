import { IBaseNode } from '../core/Nodes';

export interface GraphPartitioning {
  partitions: {[key:string]: Partition};
  nodePartMap: {[key:string]: string};
  nodeFrontMap: {[key:string]: boolean};
  // intraEdges: {[key:string]: IBaseEdge};
  // interEdges: {[key:string]: IBaseEdge};
  cut_cost: number;
}


export interface Partition {
  nodes: {[key:string]: IBaseNode};
}