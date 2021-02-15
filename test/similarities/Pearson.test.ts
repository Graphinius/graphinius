import { scoreSimFuncs as simFuncs } from "@/similarities/ScoreSimilarities";
import { sim, simSource, simPairwise, simSubsets, knnNodeArray } from "../../lib/similarities/SimilarityCommons";
import { TheAugments } from "@/perturbation/TheAugments";
import { TypedGraph } from "@/core/typed/TypedGraph";
import { JSONInput } from "@/io/input/JSONInput";

import { JSON_SIM_PATH } from "_/config/test_paths";

/**
 * 
 */
describe("PEARSON base similarity tests", () => {
  const a = [5, 8, 7, 5, 4, 9],
    b = [7, 8, 6, 6, 4, 5],
    c = [],
    d = [],
    e = [],
    SUPER_SIZE = 1e5;
  for (let i = 0; i < SUPER_SIZE; i++) {
    c.push(i);
    d.push(i);
  }
  for (let i = SUPER_SIZE; i; i--) {
    e.push(i);
  }

  it("should throw upon passing vectors of different size", () => {
    expect(simFuncs.pearson.bind(simFuncs.pearson, [1], [])).toThrowError("Vectors must be of same size");
  });

  it("should compute PEARSON between two short vectors", () => {
    expect(simFuncs.pearson(a, b)).toEqual({ sim: 0.28768 });
  });

  it("should compute PEARSON between two LARGE vectors", () => {
    expect(simFuncs.pearson(c, d)).toEqual({ sim: 1 });
  });

  it("should compute PEARSON between two LARGE vectors", () => {
    expect(simFuncs.pearson(c, e)).toEqual({ sim: -1 });
  });
});

/**
 * @description similarities on neo4j sample graph
 */
describe("PEARSON tests on neo4j sample graph", () => {
  const gFile = JSON_SIM_PATH + "/movies.json",
    rated = "RATED";

  let g: TypedGraph, zhen, praveena, michael, arya, karin;

  beforeEach(() => {
    g = new JSONInput({ weighted: true }).readFromJSONFile(
      gFile,
      new TypedGraph("CosineCuisineSimilarities")
    ) as TypedGraph;
    zhen = g.n("Zhen");
    praveena = g.n("Praveena");
    michael = g.n("Michael");
    arya = g.n("Arya");
    karin = g.n("Karin");
  });

  it("should compute similarity between Arya and Karin", () => {
    const pxp = { sim: 0.81947 };
    const a = arya.outs(rated);
    const b = karin.outs(rated);
    const pears = sim(simFuncs.pearsonSets, a, b);
    // console.log(pears);
    expect(pears).toEqual(pxp);
  });

  it("should compute PEARSON from a source", () => {
    const pxp = [
      { from: "Arya", to: "Karin", sim: 0.81947 },
      { from: "Arya", to: "Zhen", sim: 0.48395 },
      { from: "Arya", to: "Praveena", sim: 0.092623 },
      { from: "Arya", to: "Michael", sim: -0.9552 },
    ];
    const start = arya.label;
    const allSets = {};
    g.getNodesT("Person").forEach(n => {
      allSets[n.label] = n.outs(rated);
    });
    const pears = simSource(simFuncs.pearsonSets, start, allSets);
    // console.log(pears);
    expect(pears).toEqual(pxp);
  });

  it("should compute PEARSON from a source", () => {
    const pxp = [
      { from: "Praveena", to: "Zhen", sim: 0.88659 },
      { from: "Karin", to: "Zhen", sim: 0.83205 },
      { from: "Karin", to: "Arya", sim: 0.81947 },
      { from: "Arya", to: "Zhen", sim: 0.48395 },
      { from: "Karin", to: "Praveena", sim: 0.44721 },
      { from: "Arya", to: "Praveena", sim: 0.092623 },
      { from: "Michael", to: "Praveena", sim: -0.78849 },
      { from: "Michael", to: "Zhen", sim: -0.90914 },
      { from: "Arya", to: "Michael", sim: -0.9552 },
      { from: "Karin", to: "Michael", sim: -0.98639 },
    ];
    const allSets = {};
    g.getNodesT("Person").forEach(n => {
      allSets[n.label] = n.outs(rated);
    });
    const pears = simPairwise(simFuncs.pearsonSets, allSets);
    // console.log(pears);
    expect(pears).toEqual(pxp);
  });

  it("pearson should work with a cutoff", () => {
    const pxp = [
      { from: "Praveena", to: "Zhen", sim: 0.88659 },
      { from: "Karin", to: "Zhen", sim: 0.83205 },
      { from: "Karin", to: "Arya", sim: 0.81947 },
      { from: "Arya", to: "Zhen", sim: 0.48395 },
      { from: "Karin", to: "Praveena", sim: 0.44721 },
    ];
    const allSets = {};
    g.getNodesT("Person").forEach(n => {
      allSets[n.label] = n.outs(rated);
    });
    const pears = simPairwise(simFuncs.pearsonSets, allSets, { cutoff: 0.1 });
    // console.log(pears);
    expect(pears).toEqual(pxp);
  });

  it("top knn with a cutoff", () => {
    const pxp = [
      { from: "Zhen", to: "Praveena", sim: 0.88659 },
      { from: "Praveena", to: "Zhen", sim: 0.88659 },
      { from: "Karin", to: "Zhen", sim: 0.83205 },
      { from: "Arya", to: "Karin", sim: 0.81947 },
    ];
    const allSets = {};
    g.getNodesT("Person").forEach(n => {
      allSets[n.label] = n.outs(rated);
    });
    const pears = knnNodeArray(simFuncs.pearsonSets, allSets, { knn: 1, cutoff: 0.1, dup: true });
    // console.log(pears);
    expect(pears).toEqual(pxp);
  });

  it("top knn per user -> store relationship in the graph", () => {
    const augment = new TheAugments(g);
    const relName = "SIMILAR";
    const oldDirEdges = g.nrDirEdges();

    const allSets = {};
    g.getNodesT("Person").forEach(n => {
      allSets[n.label] = n.outs(rated);
    });
    const newEdges = augment.addSubsetRelationship(simFuncs.pearsonSets, allSets, {
      rtype: relName,
      knn: 1,
      cutoff: -3,
    });
    // expect(g.nrDirEdges()).toBe(oldDirEdges + 5);
    expect(g.nrDirEdges()).toBe(oldDirEdges + newEdges.size);
  });

  it("should correctly compute similarities between two subsets WITH KNN", () => {
    const pxp = [
      { from: "Praveena", to: "Zhen", sim: 0.88659 },
      { from: "Arya", to: "Karin", sim: 0.81947 },
    ];
    const allSets = {};
    g.getNodesT("Person").forEach(n => {
      allSets[n.label] = n.outs(rated);
    });
    const subSet = {
      Praveena: g.n("Praveena").outs(rated),
      Arya: g.n("Arya").outs(rated),
    };
    const pears = simSubsets(simFuncs.pearsonSets, subSet, allSets, { knn: 1 });
    // console.log(pears);
    expect(pears).toEqual(pxp);
  });

  /**
	 MATCH (p:Person {name: "Praveena"})-[:SIMILAR]->(other),
	 (other)-[r:RATED]->(movie)
	 WHERE not((p)-[:RATED]->(movie)) and r.score >= 8
	 RETURN movie.name AS movie
	 */
  it.todo("should make a tiny recommendation");
});
