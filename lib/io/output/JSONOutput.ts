import * as fs from 'fs';

import * as $N from '../../core/base/BaseNode';
import * as $E from '../../core/base/BaseEdge';
import * as $G from '../../core/base/BaseGraph';

import {labelKeys} from '../interfaces';
import {BaseEdge} from "../../core/base/BaseEdge";
import {BaseNode} from "../../core/base/BaseNode";
import {TypedGraph} from "../../core/typed/TypedGraph";
import {BaseGraph} from "../../core/base/BaseGraph";


export interface IJSONOutput {
	writeToJSONFile(filepath: string, graph: $G.IGraph): void;

	writeToJSONString(graph: $G.IGraph): string;
}


export interface TypeLUT {
	nodes: { [key: string]: string };
	edges: { [key: string]: string };
}

const startChar: number = 64;


class JSONOutput implements IJSONOutput {

	// constructor() {}

	constructTypeRLUT(g: TypedGraph): [TypeLUT, TypeLUT] {
		let nchar = startChar;
		let echar = startChar;
		const lut: TypeLUT = {
			nodes: {},
			edges: {}
		};
		const rlut: TypeLUT = {
			nodes: {},
			edges: {}
		};

		const ntypes = g.nodeTypes();
		for (let t of ntypes) {
			lut.nodes[t] = String.fromCharCode(nchar);
			rlut.nodes[String.fromCharCode(nchar++)] = t;
		}
		const etypes = g.edgeTypes();
		for ( let t of etypes ) {
			lut.edges[t] = String.fromCharCode(echar);
			rlut.edges[String.fromCharCode(echar++)] = t;
		}
		return [lut, rlut];
	}


	writeToJSONFile(filepath: string, graph: $G.IGraph): void {
		if (typeof window !== 'undefined' && window !== null) {
			throw new Error('cannot write to File inside of Browser');
		}
		fs.writeFileSync(filepath, this.writeToJSONString(graph));
	}


	writeToJSONString(graph: $G.IGraph): string {
		let lut: TypeLUT = null;
		let rlt: TypeLUT = null;

		let nodes: { [key: string]: $N.IBaseNode },
			node: $N.IBaseNode,
			node_struct,
			und_edges: { [key: string]: $E.IBaseEdge } | {},
			dir_edges: { [key: string]: $E.IBaseEdge } | {},
			edge: $E.IBaseEdge,
			coords;

		let result = {
			name: graph.label,
			nodes: graph.nrNodes(),
			dir_e: graph.nrDirEdges(),
			und_e: graph.nrUndEdges(),
			data: {}
		};

		if ( BaseGraph.isTyped(graph) ) {
			[lut, rlt] = this.constructTypeRLUT(graph);
		}
		if ( rlt ) {
			result['typeRLT'] = rlt;
		}

		// Go through all nodes 
		nodes = graph.getNodes();
		for (let node_key in nodes) {
			node = nodes[node_key];
			node_struct = result.data[node.getID()] = {
				[labelKeys.edges]: []
			};
			if (node.getID() !== node.getLabel()) {
				node_struct[labelKeys.n_label] = node.label;
			}
			if (BaseNode.isTyped(node)) {
				node_struct[labelKeys.n_type] = lut && lut.nodes[node.type];
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
					[labelKeys.e_weight]: JSONOutput.handleEdgeWeight(edge)
				};
				if ( Object.keys(edge.getFeatures()).length ) {
					edgeStruct[labelKeys.e_features] = JSON.stringify(edge.getFeatures())
				}
				if (edge.getID() !== edge.getLabel()) {
					edgeStruct[labelKeys.e_label] = edge.getLabel();
				}
				if (BaseEdge.isTyped(edge)) {
					edgeStruct[labelKeys.e_type] = lut && lut.edges[edge.type];
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
					[labelKeys.e_weight]: JSONOutput.handleEdgeWeight(edge)
				};
				if ( Object.keys(edge.getFeatures()).length ) {
					edgeStruct[labelKeys.e_features] = JSON.stringify(edge.getFeatures())
				}
				if (edge.getID() !== edge.getLabel()) {
					edgeStruct[labelKeys.e_label] = edge.getLabel();
				}
				if (BaseEdge.isTyped(edge)) {
					edgeStruct[labelKeys.e_type] = lut && lut.edges[edge.type];
				}
				node_struct[labelKeys.edges].push(edgeStruct);
			}

			// Features
			node_struct[labelKeys.n_features] = node.getFeatures();

			// Coords (shall we really?)
			if ((coords = node.getFeature(labelKeys.coords)) != null) {
				node_struct[labelKeys.coords] = coords;
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

export {JSONOutput}