import * as $N from "./BaseNode";
import { TypedEdge } from "../typed/TypedEdge";
import * as $SU from "@/utils/StructUtils";

export interface IConnectedNodes {
  a: $N.IBaseNode;
  b: $N.IBaseNode;
}

export type EdgeFeatures = { [k: string]: any };

/**
 * Edges are the most basic components in graphinius.
 * They control no other elements below them, but hold
 * references to the nodes they are connecting...
 * @param _id internal id, public
 * @param _label edge label, public
 */
export interface IBaseEdge {
  /**
   * Getters
   */
  readonly id: string;
  readonly label: string;
  readonly features: EdgeFeatures;

  getID(): string;
  getLabel(): string;
  setLabel(label: string): void;

  // FEATURES methods
  getFeatures(): EdgeFeatures;
  getFeature(key: string): any;
  f(key: string): any | undefined; // shortcut for getFeature
  setFeatures(features: EdgeFeatures): void;
  setFeature(key: string, value: any): void;
  deleteFeature(key: string): any;
  clearFeatures(): void;

  isDirected(): boolean;
  isWeighted(): boolean;
  getWeight(): number; // Exception if not weighted
  setWeight(w: number): void; // Exception if not weighted

  getNodes(): IConnectedNodes;

  clone(node_a: $N.BaseNode, node_b: $N.BaseNode): IBaseEdge;

  /**
   * An edge should either be directed or not, weighted or not.
   * Changing those properties on live edges is not allowed,
   * rather delete the edge and construct a new one altogether
   */
  // setDirected(d:boolean)	: void;
  // setWeighted(w:boolean)	: void;
}

export interface BaseEdgeConfig {
  directed?: boolean;
  weighted?: boolean;
  weight?: number;
  label?: string;
  features?: EdgeFeatures;
}

class BaseEdge implements IBaseEdge {
  protected _directed: boolean;
  protected _weighted: boolean;
  protected _weight: number;
  protected _label: string;
  protected _features: EdgeFeatures;

  constructor(
    protected _id: string,
    protected _node_a: $N.IBaseNode,
    protected _node_b: $N.IBaseNode,
    config?: BaseEdgeConfig
  ) {
    if (
      !(_node_a instanceof $N.BaseNode) ||
      !(_node_b instanceof $N.BaseNode)
    ) {
      throw new Error("cannot instantiate edge without two valid node objects");
    }

    config = config || {};
    this._directed = config.directed || false;
    this._weighted = config.weighted || false;
    // @NOTE isNaN and Number.isNaN confusion...
    this._weight = this._weighted
      ? isNaN(config.weight)
        ? 1
        : config.weight
      : undefined;
    this._label = config.label || this._id;
    this._features = config.features != null ? $SU.clone(config.features) : {};
  }

  get id(): string {
    return this._id;
  }

  get label(): string {
    return this._label;
  }

  get features(): EdgeFeatures {
    return this._features;
  }

  getID(): string {
    return this._id;
  }

  getLabel(): string {
    return this._label;
  }

  setLabel(label: string): void {
    this._label = label;
  }

  getFeatures(): { [k: string]: any } {
    return this._features;
  }

  getFeature(key: string): any | undefined {
    return this._features[key];
  }

  f(key: string): any | undefined {
    return this.getFeature(key);
  }

  setFeatures(features: { [k: string]: any }): void {
    this._features = $SU.clone(features);
  }

  setFeature(key: string, value: any): void {
    this._features[key] = value;
  }

  deleteFeature(key: string): any {
    let feat = this._features[key];
    delete this._features[key];
    return feat;
  }

  clearFeatures(): void {
    this._features = {};
  }

  isDirected(): boolean {
    return this._directed;
  }

  isWeighted(): boolean {
    return this._weighted;
  }

  getWeight(): number {
    return this._weight;
  }

  setWeight(w: number): void {
    if (!this._weighted) {
      throw new Error("Cannot set weight on unweighted edge.");
    }
    this._weight = w;
  }

  getNodes(): IConnectedNodes {
    return { a: this._node_a, b: this._node_b };
  }

  clone(new_node_a: $N.BaseNode, new_node_b: $N.BaseNode): BaseEdge {
    if (
      !(new_node_a instanceof $N.BaseNode) ||
      !(new_node_b instanceof $N.BaseNode)
    ) {
      throw new Error("refusing to clone edge if any new node is invalid");
    }

    return new BaseEdge(this._id, new_node_a, new_node_b, {
      directed: this._directed,
      weighted: this._weighted,
      weight: this._weight,
      label: this._label,
    });
  }

  static isTyped(arg: any): arg is TypedEdge {
    return !!arg.type;
  }
}

export { BaseEdge };
