import defaultsDeep from "lodash/fp/defaultsDeep";
import {DataSet} from "vis-data/peer/esm/vis-data"
import {Network} from "vis-network/peer/esm/vis-network";


export default class VizNetworkUtils {
    node_groups = {};
    edge_groups = {};

    defaultEdgeConfig = {
        smooth: false,
        physics: false,
        color: "#efefef",
        width: 0.75,
        arrows: {
            to: {
                enabled: true,
                scaleFactor: 1
            }
        }
    }

    defaultNodeConfig = {
        borderWidth: 1,
        borderWidthSelected: 1,
        shape: "circle",
        physics: true,
        size: 14,
        font: {
            size: 6,
            color: "white"
            // bold: true
        }
    }

    getDefaultOptions() {
        return {
            autoResize: true,
            layout: {
                hierarchical: false
            },
            physics: {
                stabilization: false,
                enabled: true
            },
            edges: this.generateEdgeConfig(),
            nodes: {
                shape: "circle",
                size: 14
            },
            groups: this.node_groups,
            height: "calc(100vh - 100px)"
        };
    }


    initNetwork(networkOptions, container) {
        // merge user provided options with our default ones
        let options = defaultsDeep(this.getDefaultOptions(), networkOptions);
        const {current} = container;
        this.network = new Network(
            current,
            {
                edges: this.edges,
                nodes: this.nodes
            },
            options
        );
    }


    // getColorBasedOnText(groupName) {
    //     return;
    // }

    generateEdgeConfig(groupName, edgeShape) {
        return this.defaultEdgeConfig;
    }

    generateNodeConfig(groupName, nodeShape) {
        let config = this.defaultNodeConfig;
        if (nodeShape) {
            config.shape = nodeShape;
        }
        // config.color = {
        //     border: "#2B7CE9",
        //     background: "#97C2FC",
        //     highlight: {
        //         border: "#2B7CE9",
        //         background: "#D2E5FF"
        //     },
        //     hover: {
        //         border: "#2B7CE9",
        //         background: "#D2E5FF"
        //     }
        // };
        return config;
    }

    stringify(value) {
        return value.toString();
    }

    generatorNodeGroups(groupName) {
        if (groupName in this.node_groups) {
        } else {
            this.node_groups[groupName] = this.generateNodeConfig(groupName);
        }
    }

    generatorEdgeGroups(groupName) {
        if (groupName in this.edge_groups) {
        } else {
            this.edge_groups[groupName] = this.generateEdgeConfig(groupName);
        }
    }

    _prepareNode(vertexData, labelPropertyKey) {
        const groupName = vertexData.label;
        vertexData.label = labelPropertyKey
            ? this.stringify(vertexData[labelPropertyKey])
            : this.stringify(vertexData.id);
        vertexData.group = groupName;
        this.generatorNodeGroups(groupName);
        return vertexData;
    }

    _prepareEdge(edgeData, labelPropertyKey) {
        const groupName = edgeData.label;
        edgeData.label = labelPropertyKey
            ? this.stringify(edgeData[labelPropertyKey])
            : this.stringify(edgeData.id);
        edgeData.group = groupName;
        this.generatorEdgeGroups(groupName);
        return edgeData;
    }

    prepareNodes(verticesData) {
        let nodesPrepared = [];
        verticesData.forEach((node) => {
            nodesPrepared.push(this._prepareNode(node));
        });
        return nodesPrepared;
    }

    prepareEdges(edgesData) {
        let edgesPrepared = [];
        edgesData.forEach((edge) => {
            edgesPrepared.push(this._prepareEdge(edge));
        });
        return edgesPrepared;
    }

    updateNetwork(newOptions) {
        // const existingOptions =
        this.network.setOptions(newOptions)
    }

    updateData(nodes, edges) {
        if (nodes) {
            const nodesPrepared = this.prepareNodes(nodes);
            this.nodes.add(nodesPrepared);
        }
        if (edges) {
            const edgesPrepared = this.prepareEdges(edges);
            this.edges.add(edgesPrepared);
        }
    }


    // centerCanvas(network, nodes) {
    //     const fitOption = {
    //         nodes: nodes.getIds() //nodes is type of vis.DataSet contains all the nodes
    //     }
    //     network.fit(fitOption);
    //
    //     const centerOptions = {
    //         position: {
    //             x: this.network.getViewPosition().x,
    //             y: this.network.getViewPosition().y
    //         },
    //     }
    //     network.moveTo(centerOptions);
    //
    // }

    // getTextColor() {}
    // getBgColor() {}
    isLoaded = false;

    setIsLoaded(status){
        this.isLoaded = status;
    }

    constructor(networkOptions, container) {

        this.edges = new DataSet([]);
        this.nodes = new DataSet([]);
        this.initNetwork(networkOptions, container);
        // this.isLoaded = true;
    }
}
