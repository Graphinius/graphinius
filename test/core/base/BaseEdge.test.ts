import { IBaseEdge, BaseEdge as Edge, EdgeFeatures } from "@/core/base/BaseEdge";
import { IBaseNode, BaseNode as Node } from "@/core/base/BaseNode";

/**
 *
 */
describe("==== EDGE TESTS ====", () => {
  let id = "New Edge",
    label = "New Edge",
    node_a = new Node("A"),
    node_b = new Node("B");

  describe("Basic edge instantiation", () => {
    /**
     * An edge without nodes does not make any sense, HOWEVER:
     * the edge itself does not check if any of the nodes it connects
     * are part of a graph - this is the job of the BaseGraph class!
     */
    test("should refuse to instantiate an edge without two existing nodes", () => {
      let badCtr = function () {
        return new Edge("free-float", null, null);
      };
      expect(badCtr).toThrowError("cannot instantiate edge without two valid node objects");
    });

    test("should refuse to instantiate an edge without two existing nodes", () => {
      let badCtr = function () {
        return new Edge("free-float", new Node("A"), null);
      };
      expect(badCtr).toThrowError("cannot instantiate edge without two valid node objects");
    });

    test("should refuse to instantiate an edge without two existing nodes", () => {
      let badCtr = function () {
        return new Edge("free-float", null, new Node("A"));
      };
      expect(badCtr).toThrowError("cannot instantiate edge without two valid node objects");
    });

    test("should correctly set _id", () => {
      let edge = new Edge(id, node_a, node_b);
      expect(edge.getID()).toBe(id);
    });

    test("should correctly set _label upon instantiation", () => {
      let edge = new Edge(id, node_a, node_b, { label: label });
      expect(edge.getLabel()).toBe(label);
    });

    test("should get id via getter", () => {
      let edge = new Edge(id, node_a, node_b);
      expect(edge.id).toBe(id);
    });

    test("should get label via getter", () => {
      let edge = new Edge(id, node_a, node_b, { label: label });
      expect(edge.label).toBe(label);
    });

    test("should correctly set _label upon renewed setting", () => {
      let edge = new Edge(id, node_a, node_b, { label: label });
      expect(edge.getLabel()).toBe(label);
      edge.setLabel("new Label");
      expect(edge.getLabel()).toBe("new Label");
    });
  });

  describe("Edge FEATURE vector tests", () => {
    let a: IBaseNode,
      b: IBaseNode,
      e: IBaseEdge,
      date: string,
      capital: number,
      singleFounder: boolean,
      features: EdgeFeatures;

    beforeAll(() => {
      a = new Node("Bernd");
      b = new Node("iNodis Corp.");
    });

    beforeEach(() => {
      date = "2019-06-03T06:00";
      capital = 1e4;
      singleFounder = true;
      features = { date, capital, singleFounder };
      e = new Edge("founded", a, b, { features });
    });

    test("should correctly set default features to an empty hash object", () => {
      expect(e.getFeatures()).toBeInstanceOf(Object);
      expect(Object.keys(e.getFeatures()).length).toBe(3);
    });

    test("should get features via getter", () => {
      expect(e.features).toBeInstanceOf(Object);
      expect(Object.keys(e.features).length).toBe(3);
    });

    test("should correctly set features to specified object", () => {
      expect(e.getFeatures()).toEqual(features);
    });

    it('should return "undefined" when retrieving a non-set feature', () => {
      expect(e.getFeature(null)).toBeUndefined;
    });

    test("should correctly retrieve a set feature", () => {
      expect(e.getFeature("date")).toBe(date);
    });

    test("should correctly retrieve a set feature via the shortcut method", () => {
      expect(e.f("date")).toBe(date);
    });

    test("should allow to set new feature", () => {
      expect(Object.keys(e.getFeatures()).length).toBe(3);
      e.setFeature("alsoFounded", "Lemontiger");
      expect(Object.keys(e.getFeatures()).length).toBe(4);
      expect(e.getFeature("alsoFounded")).toBe("Lemontiger");
    });

    test("should automatically overwrite an existing feature upon renewed setting", () => {
      e.setFeatures(features);
      expect(Object.keys(e.getFeatures()).length).toBe(3);
      e.setFeature("capital", 0);
      expect(Object.keys(e.getFeatures()).length).toBe(3);
      expect(e.getFeature("capital")).toBe(0);
    });

    it("should return undefined upon trying to delete an unset feature", () => {
      expect(e.deleteFeature("nokey")).toBeUndefined();
    });

    it("should return a given feature upon deletion", () => {
      expect(e.deleteFeature("date")).toBe(date);
    });

    it("should duly delete a given feature", () => {
      expect(Object.keys(e.getFeatures()).length).toBe(3);
      e.deleteFeature("date");
      expect(Object.keys(e.getFeatures()).length).toBe(2);
    });

    it("should allow to replace the whole feature vector", () => {
      let newFeatures = { zacheBastlei: "oh-yeah" };
      expect(Object.keys(e.getFeatures()).length).toBe(3);
      e.setFeatures(newFeatures);
      expect(Object.keys(e.getFeatures()).length).toBe(1);
      expect(e.getFeatures()).toEqual(newFeatures);
    });

    it("should allow to clear the whole feature vector", () => {
      expect(Object.keys(e.getFeatures()).length).toBe(3);
      e.clearFeatures();
      expect(Object.keys(e.getFeatures()).length).toBe(0);
      expect(e.getFeatures()).toEqual({});
    });
  });

  describe("Direction Edge Tests: ", () => {
    // Constructor + isDirected()
    describe("Constructor + isDirected", () => {
      test("should correctly set default _directed to false", () => {
        let edge = new Edge(id, node_a, node_b);
        expect(edge.isDirected()).toBe(false);
      });

      [true, false].forEach(function (val) {
        test("should correctly set _directed to specified value", () => {
          let opts = { directed: val };
          let edge = new Edge(id, node_a, node_b, opts);
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
  describe("Weight Edge Tests", () => {
    describe("Constructor + isWeighted", () => {
      test("should correctly set default _directed to false", () => {
        let edge = new Edge(id, node_a, node_b);
        expect(edge.isWeighted()).toBe(false);
      });

      [true, false].forEach(function (val) {
        test("should correctly set _directed to specified value", () => {
          let opts = { weighted: val };
          let edge = new Edge(id, node_a, node_b, opts);
          expect(edge.isWeighted()).toBe(val);
        });
      });
    });

    describe("getWeight()", () => {
      test("should throw an exception when querying weight if unweighted", () => {
        let edge = new Edge(id, node_a, node_b);
        expect(edge.isWeighted()).toBe(false);
        expect(edge.getWeight()).toBeUndefined();
      });

      test("should correctly set default weight to 1", () => {
        let opts = { weighted: true };
        let edge = new Edge(id, node_a, node_b, opts);
        expect(edge.isWeighted()).toBe(true);
        expect(edge.getWeight()).toBe(1);
      });

      test("should correctly report weight if set & specified", () => {
        let opts = { weighted: true, weight: 42 };
        let edge = new Edge(id, node_a, node_b, opts);
        expect(edge.isWeighted()).toBe(true);
        expect(edge.getWeight()).toBe(42);
      });
    });

    describe("setWeight()", () => {
      test("Should throw an error on trying to set a weight if unweighted", () => {
        let opts = { weighted: false };
        let edge = new Edge(id, node_a, node_b, opts);
        expect(edge.isWeighted()).toBe(false);
        expect(edge.setWeight.bind(edge, 42)).toThrowError("Cannot set weight on unweighted edge.");
      });

      test("Should correctly set weight to a specified value", () => {
        let opts = { weighted: true };
        let edge = new Edge(id, node_a, node_b, opts);
        expect(edge.isWeighted()).toBe(true);
        expect(edge.getWeight()).toBe(1);
        edge.setWeight(42);
        expect(edge.getWeight()).toBe(42);
      });
    });
  });

  describe("Node Edge Tests: ", () => {
    [true, false].forEach(function (direction) {
      test("all edges should properly return the two connected nodes", () => {
        let opts = { directed: direction };
        let edge = new Edge(id, node_a, node_b, opts);
        expect(edge.isDirected()).toBe(direction);
        let nodes = edge.getNodes();
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
  describe("Edge CLONE Tests - ", () => {
    let node_a = new Node("A");
    let node_b = new Node("B");
    let edge: IBaseEdge = null;
    let clone_edge: IBaseEdge = null;

    beforeEach(() => {
      expect(edge).toBeNull();
      expect(clone_edge).toBeNull();
    });

    afterEach(() => {
      edge = null;
      clone_edge = null;
    });

    test("should refuse to clone if new node A is invalid", () => {
      edge = new Edge("default", node_a, node_b);
      expect(edge.clone.bind(edge, null, node_b)).toThrowError("refusing to clone edge if any new node is invalid");
    });

    test("should refuse to clone if new node B is invalid", () => {
      edge = new Edge("default", node_a, node_b);
      expect(edge.clone.bind(edge, node_a, null)).toThrowError("refusing to clone edge if any new node is invalid");
    });

    test("should refuse to clone if both nodes are invalid", () => {
      edge = new Edge("default", node_a, node_b);
      expect(edge.clone.bind(edge, null, null)).toThrowError("refusing to clone edge if any new node is invalid");
    });

    test("should clone a default edge with correct config options", () => {
      edge = new Edge("default", node_a, node_b);
      clone_edge = edge.clone(node_a, node_b);
      expect(clone_edge.getID()).toBe(edge.getID());
      expect(clone_edge.getLabel()).toBe(edge.getLabel());
      expect(clone_edge.isDirected()).toBe(edge.isDirected());
      expect(clone_edge.isWeighted()).toBe(edge.isWeighted());
      expect(clone_edge.getWeight()).toBe(edge.getWeight());
    });

    test("should clone a default edge with correct config options", () => {
      edge = new Edge("default", node_a, node_b, {
        directed: true,
        weighted: true,
        weight: -77,
        label: "different_from_ID",
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
