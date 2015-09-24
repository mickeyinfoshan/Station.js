#Station.js

---

**Station.js** is a  for more complex architectures. Let's consider the architecture of an application as a directed graph, which including nodes and links. Everything in an application that process/store data is a node of the graph and the connections between them are links.
In **Station.js**, we consider a node as a data station and a link as communication between nodes.

#DataStation

---

DataStation is a core concept in Station.js. 

An undirectional application is like a tree(graph)	and a data station is like a node of the tree. A data station take the responsibility to receive data, process data, and then dispatch the processed data to the next.

Everything can be a data station. Models, views and controllers in MVC can be data stations. Dispatchers and stores in Flux can be data stations.

A data station can have several data sources. Sources can be 
added through 'addSource' method which will create a receiver 
waiting for data. 

A data station can have one or more data destinations. When a data station add an another data station as a data source, this data station will be a data destination of the other one.

A data station can have several handlers dealing with a certain data type respectively. When data comes, a data station will choose the corresponding handler to process the data. If there's no corresponding handler found, do nothing. If a handler returns a value, then the data station will dispatch the return value to all data destinations of it. Otherwise, nothing more to do. If the return value doesn't have '$type' attribute, the origin data type will add to it.

A single data station won't do anything for you!

---

***API***

	**addSource(DataStation source): void** Add a source to listen to. When the source
