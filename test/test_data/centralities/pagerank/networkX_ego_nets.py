import networkx as nx
from networkx import pagerank, pagerank_numpy, pagerank_scipy
import time, json, os

output_folder = 'comparison_selected'

'''
!!! EGO !!!
'''

# ego_path = os.path.join(os.getcwd(), '../../ego_networks/')
ego_path = '../../ego_networks/'
ego_output_path = './comparison_ego_graphs/'
# print(ego_path)

files = []
# r=root, d=directories, f = files
for r, d, f in os.walk(ego_path):
    for file in f:
        if '.csv' in file:
            files.append(os.path.join(r, file))

for f in files:
  for algo in [pagerank, pagerank_numpy, pagerank_scipy]:
    # print(f)
    # print(algo)

    ego_graph = nx.read_edgelist(f, create_using=nx.DiGraph())
    tic = time.time()
    pr = algo(ego_graph, alpha=0.85)
    toc = time.time()
    duration = (toc-tic)*1000
    print("PageRank on graph with |V|=" + str(len(ego_graph.nodes)) + " and |E|=" + str(len(ego_graph.edges)) + " by " + algo.__name__ )
    file = open(ego_output_path + algo.__name__ + '_ego_network_v' + str(len(ego_graph.nodes)) + '_e_' + str(len(ego_graph.edges)) + '.json', 'w')
    file.write( json.dumps(pr) )
    file.close
