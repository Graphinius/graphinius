import * as $N from '../../../src/core/base/BaseNode';
import * as $E from '../../../src/core/base/BaseEdge';

const Node = $N.BaseNode;
const Edge = $E.BaseEdge;


describe('==== EDGE TESTS ====', () => {
	var id = 'New Edge',
			label = 'New Edge',
			node_a = new Node("A"),
			node_b = new Node("B");


	describe('A basic edge instantiation', () => {

		/**
		 * An edge without nodes does not make any sense, HOWEVER:
		 * the edge itself does not check if any of the nodes it connects 
		 * are part of a graph - this is the job of the BaseGraph class!
		 */
		test('should refuse to instantiate an edge without two existing nodes', () => {
			var badCtr = function() { return new Edge("free-float", null, null) };
			expect(badCtr).toThrowError("cannot instantiate edge without two valid node objects");
		});

		test('should refuse to instantiate an edge without two existing nodes', () => {
			var badCtr = function() { return new Edge("free-float", new Node("A"), null) };
			expect(badCtr).toThrowError("cannot instantiate edge without two valid node objects");
		});

		test('should refuse to instantiate an edge without two existing nodes', () => {
			var badCtr = function() { return new Edge("free-float", null, new Node("A") ) };
			expect(badCtr).toThrowError("cannot instantiate edge without two valid node objects");
		});

		test('should correctly set _id', () => {
			var edge = new Edge(id, node_a, node_b);
			expect(edge.getID()).toBe(id);
		});
		
		test('should correctly set _label upon instantiation', () => {
			var edge = new Edge(id, node_a, node_b, {label: label});
			expect(edge.getLabel()).toBe(label);
		});
		
		test('should correctly set _label upon renewed setting', () => {
			var edge = new Edge(id, node_a, node_b, {label: label});
			expect(edge.getLabel()).toBe(label);
			edge.setLabel('new Label');
			expect(edge.getLabel()).toBe('new Label');
		});
		
	});
	
	
	describe('Direction Edge Tests: ', () => {		
		// Constructor + isDirected()
		describe('Constructor + isDirected', () => {
			test('should correctly set default _directed to false', () => {
				var edge = new Edge(id, node_a, node_b);
				expect(edge.isDirected()).toBe(false);
			});
			
			[true, false].forEach(function(val) {
				test('should correctly set _directed to specified value', () => {
					var opts = {directed: val};
					var edge = new Edge(id, node_a, node_b, opts);
					expect(edge.isDirected()).toBe(val);					
				});
			});
		});
		
	});
	
	/**
   * Right now, we are making a difference between
   * weighted and unweighted edges. An unweighted edge will
   * return undefined when queried for its weight, whereas
   * a weighted edge with unspecified weight defaults to w=1
   */
	describe('Weight Edge Tests', () => {		
    
		describe('Constructor + isWeighted', () => {
			test('should correctly set default _directed to false', () => {
				var edge = new Edge(id, node_a, node_b);
				expect(edge.isWeighted()).toBe(false);
			});
			
			[true, false].forEach(function(val) {
				test('should correctly set _directed to specified value', () => {
					var opts = {weighted: val};
					var edge = new Edge(id, node_a, node_b, opts);
					expect(edge.isWeighted()).toBe(val);					
				});
			});
		});
		
    
		describe('getWeight()', () => {
			test('should throw an exception when querying weight if unweighted', () => {
				var edge = new Edge(id, node_a, node_b);
				expect(edge.isWeighted()).toBe(false);
        expect(edge.getWeight()).toBeUndefined();
			});
			
			test('should correctly set default weight to 1', () => {
				var opts = {weighted: true};
				var edge = new Edge(id, node_a, node_b, opts);
				expect(edge.isWeighted()).toBe(true);					
				expect(edge.getWeight()).toBe(1);					
			});
			
			test('should correctly report weight if set & specified', () => {
				var opts = {weighted: true, weight: 42};
				var edge = new Edge(id, node_a, node_b, opts);
				expect(edge.isWeighted()).toBe(true);					
				expect(edge.getWeight()).toBe(42);					
			});
		});
    
    
		describe('setWeight()', () => {
			test('Should throw an error on trying to set a weight if unweighted', () => {
				var opts = {weighted: false};
				var edge = new Edge(id, node_a, node_b, opts);
				expect(edge.isWeighted()).toBe(false);
				expect(edge.setWeight.bind(edge, 42)).toThrowError("Cannot set weight on unweighted edge.");
			});
			
			test('Should correctly set weight to a specified value', () => {	
				var opts = {weighted: true};
				var edge = new Edge(id, node_a, node_b, opts);
				expect(edge.isWeighted()).toBe(true);
				expect(edge.getWeight()).toBe(1);			
				edge.setWeight(42);
				expect(edge.getWeight()).toBe(42);
			});
		});		
	});
	
	
	describe('Node Edge Tests: ', () => {
		
		[true, false].forEach(function(direction) {
			test('all edges should properly return the two connected nodes', () => {
				var opts = {directed: direction};
				var edge = new Edge(id, node_a, node_b, opts);
				expect(edge.isDirected()).toBe(direction);
				var nodes = edge.getNodes();
				expect(nodes).toBeInstanceOf(Object);			
				expect(nodes.a).toBeInstanceOf(Node);
				expect(nodes.b).toBeInstanceOf(Node);
				expect(nodes.a).toBe(node_a);
				expect(nodes.b).toBe(node_b);
			});
		});
				
	});


	/**
	 * As far as all cloning tests are concerned,
	 * the edge class is not responsible for connecting
	 * to the "correct" nodes, so in itself it does NOT
	 * check if the provided nodes
	 */
	describe('Edge CLONE Tests - ', () => {

		let node_a = new $N.BaseNode("A");
		let node_b = new $N.BaseNode("B");
		let edge : $E.IBaseEdge = null;
		let clone_edge : $E.IBaseEdge = null;


		beforeEach(() => {
			expect(edge).toBeNull();
			expect(clone_edge).toBeNull();
		});


		afterEach(() => {
			edge = null;
			clone_edge = null;
		});


		test('should refuse to clone if new node A is invalid', () => {
			edge = new $E.BaseEdge("default", node_a, node_b);
			expect(edge.clone.bind(edge, null, node_b)).toThrowError("refusing to clone edge if any new node is invalid");
		});


		test('should refuse to clone if new node B is invalid', () => {
			edge = new $E.BaseEdge("default", node_a, node_b);
			expect(edge.clone.bind(edge, node_a, null)).toThrowError("refusing to clone edge if any new node is invalid");
		});


		test('should refuse to clone if both nodes are invalid', () => {
			edge = new $E.BaseEdge("default", node_a, node_b);
			expect(edge.clone.bind(edge, null, null)).toThrowError("refusing to clone edge if any new node is invalid");
		});


		test('should clone a default edge with correct config options', () => {
			edge = new $E.BaseEdge("default", node_a, node_b);
			clone_edge = edge.clone(node_a, node_b);
			expect(clone_edge.getID()).toBe(edge.getID());
			expect(clone_edge.getLabel()).toBe(edge.getLabel());
			expect(clone_edge.isDirected()).toBe(edge.isDirected());
			expect(clone_edge.isWeighted()).toBe(edge.isWeighted());
			expect(clone_edge.getWeight()).toBe(edge.getWeight());
		});


		test('should clone a default edge with correct config options', () => {
			edge = new $E.BaseEdge("default", node_a, node_b, {
				directed: true,
				weighted: true,
				weight: -77,
				label: "different_from_ID"
			});
			clone_edge = edge.clone(node_a, node_b);
			expect(clone_edge.getID()).toBe(edge.getID());
			expect(clone_edge.getLabel()).toBe(edge.getLabel());
			expect(clone_edge.isDirected()).toBe(edge.isDirected());
			expect(clone_edge.isWeighted()).toBe(edge.isWeighted());
			expect(clone_edge.getWeight()).toBe(edge.getWeight());
		});

	});

});
