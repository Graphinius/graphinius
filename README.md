# Changelog

0.8.5 - gulp updated to 4.0, re-worked gulpfile.js, webpack now only producing minified version (production settings)

# Graphinius JS
Generic graph (analysis) library in Typescript

## Running tests

In order to run the tests, you need an external "Simd-Handler" - any object that implements a certain interface, which currently is:
```js
export interface NumericHandler {
	tensor2d: Function;
	matMul: Function;
}
```

The best way to achieve this for now is to install a respective module globally, e.g.
```bash
npm i -g @tensorflow/tfjs-node
```

and then link it locally via
```bash
npm link @tensorflow/tfjs-node
```


## Generate Documentation

```bash
typedoc
```
just execute the command in a bash within the root folder - the configuration in *tsconfig.js* should automatically be loaded

## Demo

GraphiniusJS is integrated in our current [GraphiniusVIS Demo Site.](http://berndmalle.com/GraphiniusVis)

Execute the following lines of code in succession to arrive at a simple degree distribution:

![Simple Degree Distribution][degDist]

Then reproduce the code given below to visualize a first graph:

![First graph visualization][graphInREPL]

You can execute a BFS algorithm starting at a random node, then explore the resulting data structure by following this example:

![BFS Color Map][colorBFSREPL]

In the above code, the BFS coloring does not necessarily correspond to the BFS result computed in line 3. Colors run from green (start node) to red (most distant node).

You can configure the JSON graph loader for directed mode first:

```javascript
// ignore explicit direction as specified by file content
jsonReader._explicit_direction = false;
// interpret all edges as directed instead
jsonReader._direction = true;
```

Then execute the following lines of code to obtain a (random) DFS segmentation:

![DFS Color Map][colorDFSREPL]


[degDist]:https://raw.githubusercontent.com/cassinius/MSCThesisGraphinius/master/figures/deg_dist.png

[graphInREPL]:https://raw.githubusercontent.com/cassinius/MSCThesisGraphinius/master/figures/loadingGraphInREPL.png

[colorBFSREPL]:https://raw.githubusercontent.com/cassinius/MSCThesisGraphinius/master/figures/colorBFSREPL.png

[colorDFSREPL]:https://raw.githubusercontent.com/cassinius/MSCThesisGraphinius/master/figures/colorDFSREPL.png


# NOTES

### *DUPLICATES*

 @describe we check for duplicate edges on a graph level, but not on a node level
 - when systematically (batch) instantiationg from an input source, our input classes check for duplicate edges
 - when programmatically building a graph manually, the graph class will reject duplicates, whereas the node classes used internally will not -> don't use <node>.addEdge...() manually!


# Graphinius WASM/WASI project description (OpenTeams)

Using networkx but having to port your solution for production? Doing graph-based ML but the pipeline is deep and brittle, therefore not suited for quick prototyping? Don't want to write 50k lines of C++ to roll out your own features? Graphinius is the vision of a modular graph infrastructure consisting of sovereign components compiled to WASM/WASI with thin wrappers to make them usable in multiple other runtimes incl. Rust, Python, Ruby & JS / Node.js. It will therefore be possible to plug its modules into existing Python infrastructure for ML / prototyping, Web applications for demos & light applications, as well as production-type platforms (since WASM can run at near-native speeds). We'll start with sparse matrices & basic graph algorithms on top of them written in Rust, focusing on parallelization &  vectorization. First milestone: A drop-in replacement for basic networkx functionality with superior performance & memory usage (using their own test suite in python ;-)
