/**
 * @todo 2020-12-12: What is this thing doing !?
 */
import { TypedEdge, ITypedEdge } from "@/core/typed/TypedEdge";
import { TypedNode, ITypedNode } from "@/core/typed/TypedNode";
import { TypedGraph } from "@/core/typed/TypedGraph";
import { setSimFuncs } from "@/similarities/SetSimilarities";
import * as $I from "@/similarities/interfaces";
import { knnNodeArray } from "@/similarities/SimilarityCommons";

interface SubSetConfig extends $I.SortCutFuncs {
  rtype: string; // name of edge TYPE to use
  knn?: number;
  cutoff?: number;
}

class TheAugments {
  constructor(private _g: TypedGraph) {}

  /**
   * @todo implement
   */
  addSubsetRelationship(algo: Function, sets: $I.SetOfSets, cfg: SubSetConfig): Set<ITypedEdge> {
    const edgeSet = new Set<ITypedEdge>();
    let edge: ITypedEdge;
    const g = this._g;

    const sims = knnNodeArray(algo, sets, { knn: cfg.knn || 1, cutoff: cfg.cutoff || 0 });

    sims.forEach(e => {
      if (sets[e.from].size <= sets[e.to].size) {
        edge = g.addEdgeByID("ontheedge", g.n(e.from), g.n(e.to), { directed: true, type: cfg.rtype });
      } else {
        edge = g.addEdgeByID("ontheedge", g.n(e.to), g.n(e.from), { directed: true, type: cfg.rtype });
      }
      edgeSet.add(edge);
    });
    return edgeSet;
  }
}

export { TheAugments };
