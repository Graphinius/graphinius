import networkx as nx
from networkx import pagerank
import time
import json

''' 
Small graphs
'''

n3graph = nx.read_edgelist('../3node2SPs1direct.csv', create_using=nx.DiGraph())
n3res = pagerank(n3graph, alpha=0.85, personalization=None, dangling=None, max_iter=1000, tol=1e-4,nstart=None)
print("Pagerank, NO teleport set:")
print(n3res)

pValues = {'A': 1, 'B': 0, 'C': 0}
n3res = pagerank(n3graph, alpha=0.85, personalization=pValues, dangling=None, max_iter=1000, tol=1e-4,nstart=None)
print("Pagerank, teleport set {A}:")
print(n3res)

pValues = {'A': 0.5, 'B': 0.5, 'C': 0}
n3res = pagerank(n3graph, alpha=0.85, personalization=pValues, dangling=None, max_iter=1000, tol=1e-4,nstart=None)
print("Pagerank, teleport set {A, B}:")
print(n3res)