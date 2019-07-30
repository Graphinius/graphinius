import fs = require('fs');

import * as $N from '../../core/BaseNode';
import * as $E from '../../core/BaseEdge';
import * as $G from '../../core/BaseGraph';
import { abbs } from '../interfaces';


export interface IJSONOutput {
	writeToJSONFile(filepath: string, graph: $G.IGraph): void;
	writeToJSONString(graph: $G.IGraph): string;
}



/**
 * @description we can leave this out, since we just write ALL
 * 							information into the file, but then select the
 * 							ones we want during Input
 */
// export interface IJSONInConfig {
// 	explicit_direction?: boolean;
// 	directed?: boolean; // true => directed
// 	weighted?: boolean;
// }


class JSONOutput implements IJSONOutput {

	constructor() { }

	writeToJSONFile(filepath: string, graph: $G.IGraph): void {
		if (typeof window !== 'undefined' && window !== null) {
			throw new Error('cannot write to File inside of Browser');
		}

		fs.writeFileSync(filepath, this.writeToJSONString(graph));
	}


	writeToJSONString(graph: $G.IGraph): string {

		let nodes			: { [key: string]: $N.IBaseNode },
			node				: $N.IBaseNode,
			node_struct,
			und_edges		: { [key: string]: $E.IBaseEdge } | {},
			dir_edges		: { [key: string]: $E.IBaseEdge } | {},
			edge				: $E.IBaseEdge,
			coords;

		let result = {
			name: graph._label,
			nodes: graph.nrNodes(),
			dir_e: graph.nrDirEdges(),
			und_e: graph.nrUndEdges(),
			data: {}
		};

		// Go through all nodes 
		nodes = graph.getNodes();
		for (let node_key in nodes) {
			node = nodes[node_key];
			node_struct = result.data[node.getID()] = {
				[abbs.label]: node.getLabel(),
				[abbs.edges]: []
			};

			// UNdirected Edges
			und_edges = node.undEdges();
			for (let edge_key in und_edges) {
				edge = und_edges[edge_key];
				let connected_nodes = edge.getNodes();

				node_struct[abbs.edges].push({
					[abbs.e_to]: connected_nodes.a.getID() === node.getID() ? connected_nodes.b.getID() : connected_nodes.a.getID(),
					[abbs.e_dir]: edge.isDirected(),
					[abbs.e_weight]: edge.isWeighted() ? edge.getWeight() : undefined
				});
			}

			// Directed Edges
			dir_edges = node.outEdges();
			for (let edge_key in dir_edges) {
				edge = dir_edges[edge_key];
				let connected_nodes = edge.getNodes();

				node_struct[abbs.edges].push({
					[abbs.e_to]: connected_nodes.b.getID(),
					[abbs.e_dir]: edge.isDirected(),
					[abbs.e_weight]: JSONOutput.handleEdgeWeight(edge)
				});
			}

			// Features
			node_struct[abbs.features] = node.getFeatures();

			// Coords (shall we really?)
			if ((coords = node.getFeature(abbs.coords)) != null) {
				node_struct[abbs.coords] = coords;
			}
		}

		return JSON.stringify(result);
	}


	static handleEdgeWeight(edge: $E.IBaseEdge): string | number {
		if (!edge.isWeighted()) {
			return undefined;
		}

		switch (edge.getWeight()) {
			case Number.POSITIVE_INFINITY:
				return 'Infinity';
			case Number.NEGATIVE_INFINITY:
				return '-Infinity';
			case Number.MAX_VALUE:
				return 'MAX';
			case Number.MIN_VALUE:
				return 'MIN';
			default:
				return edge.getWeight();
		}

	}
}

export { JSONOutput }