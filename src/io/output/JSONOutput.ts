import fs = require('fs');

import * as $N from '../../core/base/BaseNode';
import * as $E from '../../core/base/BaseEdge';
import * as $G from '../../core/base/BaseGraph';
import { labelKeys } from '../interfaces';
import {BaseEdge} from "../../core/base/BaseEdge";


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
			name: graph.label,
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
				[labelKeys.edges]: []
			};
			/**
			 * only add label if not identical to ID
			 */
			if ( node.getID() !== node.getLabel() ) {
				node_struct[labelKeys.label] = node.getLabel();
			}

			/* -------------------------------------- */
			/*					 UNDIRECTED edges							*/
			/* -------------------------------------- */
			und_edges = node.undEdges();
			for (let edge_key in und_edges) {
				edge = und_edges[edge_key];
				let endPoints = edge.getNodes();

				let edgeStruct = {
					[labelKeys.e_to]: endPoints.a.getID() === node.getID() ? endPoints.b.getID() : endPoints.a.getID(),
					[labelKeys.e_dir]: edge.isDirected() ? 1 : 0,
					[labelKeys.e_weight]: JSONOutput.handleEdgeWeight(edge),
				};
				if ( edge.getID() !== edge.getLabel() ) {
					edgeStruct[labelKeys.e_label] = edge.getLabel();
				}
				if ( BaseEdge.isTyped(edge) ) {
					edgeStruct[labelKeys.e_type] = edge.type;
				}
				node_struct[labelKeys.edges].push(edgeStruct);
			}


			/* -------------------------------------- */
			/*						DIRECTED edges							*/
			/* -------------------------------------- */
			dir_edges = node.outEdges();
			for (let edge_key in dir_edges) {
				edge = dir_edges[edge_key];
				let endPoints = edge.getNodes();

				let edgeStruct = {
					[labelKeys.e_to]: endPoints.b.getID(),
					[labelKeys.e_dir]: edge.isDirected() ? 1 : 0,
					[labelKeys.e_weight]: JSONOutput.handleEdgeWeight(edge),
				};
				if ( edge.getID() !== edge.getLabel() ) {
					edgeStruct[labelKeys.e_label] = edge.getLabel();
				}
				if ( BaseEdge.isTyped(edge) ) {
					edgeStruct[labelKeys.e_type] = edge.type;
				}
				node_struct[labelKeys.edges].push(edgeStruct);
			}

			// Features
			node_struct[labelKeys.features] = node.getFeatures();

			// Coords (shall we really?)
			if ((coords = node.getFeature(labelKeys.coords)) != null) {
				node_struct[labelKeys.coords] = coords;
			}
		}

		return JSON.stringify(result);
	}


	static handleEdgeWeight(edge: $E.IBaseEdge): string | number {
		if ( !edge.isWeighted() ) {
			return undefined;
		}

		switch ( edge.getWeight() ) {
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