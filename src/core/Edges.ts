import * as Nodes from "./Nodes";

/**
 * Edges are the most basic components in graphinius.
 * They control no other elements below them, but hold
 * references to the nodes they are connecting...
 * @param 
 */
interface IBaseEdge {
	// Public properties
	_id			:	string;
	_label	: string;
	
	// DIRECTION Methods
	isDirected()						: boolean;
	getDirection()					: boolean; // Exception if not directed
	setDirection(d:boolean)	: void; // Exception if not directed
	
	// WEIGHT Methods
	isWeighted()						: boolean;
	getWeight()							: number; // Exception if not weighted
	setWeight(w:number) 		: void; // Exception if not weighted

	/**
	 * An edge should either be directed or not, weighted or not.
	 * Changing those properties on live edges is not allowed,
	 * rather delete the edge and construct a new one altogether 
	 */ 
	// setDirected(d:boolean)	: void;
	// setWeighted(w:boolean)	: void;
}

interface EdgeConstructorOptions {
	directed?		: boolean;
	direction? 	: boolean;
	weighted?		: boolean;
	weight?			: number;	
}

class BaseEdge implements IBaseEdge {
	protected _directed		: boolean;
	protected _direction	: boolean;
	protected _weighted 	: boolean;
	protected _weight			: number;
	
	constructor (public _id, public _label,
							protected _node_a:Nodes.IBaseNode, 
							protected _node_b:Nodes.IBaseNode, 
							options?: EdgeConstructorOptions) 
	{
		options = options || {};
		this._directed = options.directed || false;
		// HAHA - if we do this like above, it will never accept 'false'...
		this._direction = typeof(options.direction) === 'undefined' ? true : options.direction;
		this._weighted = options.weighted || false;
		this._weight = options.weight || 0;
	}
	
	isDirected () : boolean {
		return this._directed;
	}
	
	getDirection() : boolean {
		if ( !this._directed ) {
			throw new Error("Undirected edge cannot be queried for direction.");
		}
		return this._direction;
	}
	
	setDirection(d:boolean)	: void {
		if ( !this._directed ) {
			throw new Error("Direction cannot be set on undirected edge.");
		}
		this._direction = d;
	}
	
	isWeighted () : boolean {
		return this._weighted;
	}
	
	getWeight() : number {
		if ( !this._weighted) {
			throw new Error("Unweighted edge cannot be queried for weight.");
		}
		return this._weight;
	}
	
	setWeight(w:number) : void {
		if ( !this._weighted ) {
			throw new Error("Cannot set weight on unweighted edge.");
		}
		this._weight = w;
	}
	
}

export { IBaseEdge, BaseEdge };