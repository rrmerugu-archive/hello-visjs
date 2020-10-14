import defaultsDeep from "lodash/fp/defaultsDeep";
import {DataSet} from "vis-data/peer/esm/vis-data"
import {Network} from "vis-network/peer/esm/vis-network";

const ColorHash = require('color-hash');

let colorHash = new ColorHash({hue: [{min: 90, max: 230}, {min: 90, max: 230}, {min: 90, max: 230}]});

function getColorForString(label) {
    return colorHash.hex(label);
}

export function LightenDarkenColor(col, amt) {

    let usePound = false;

    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }

    let num = parseInt(col, 16);

    let r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;


    let g = ((num >> 8) & 0xff) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;


    let b = (num & 0xff) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    return (usePound ? "#" : "") + ((r << 16) | (g << 8) | b).toString(16);

}

export default class VizNetworkUtils {

    networkOptions = {};

    defaultEdgeConfig = {
        smooth: {
            enabled: true,
            forceDirection: true,
            roundness: 0.6,
            type: "curvedCW"
        },
        physics: true,
        color: "#efefef",
        width: 0.75,
        arrows: {
            to: {
                enabled: true,
                scaleFactor: 1
            }
        }
    }
    //
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


    stabilizeGraph() {
        this.network.stabilize();
    }

    destroyGraph() {
        this.network.destroy();
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
                borderWidth: 2,
                borderWidthSelected: 1,
                shape: "circle",
                physics: true,
                size: 14,
                font: {
                    size: 6,
                    color: "white"
                    // bold: true
                }
            },
            height: "calc(100vh - 100px)"
        };
    }

    getInitOptions() {
        return defaultsDeep(this.getDefaultOptions(), this.networkOptions);
    }

    initNetwork(container) {
        // merge user provided options with our default ones
        let options = this.getInitOptions();
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

    generateEdgeConfig(groupName, edgeShape) {
        return this.defaultEdgeConfig;
    }

    getNodeColor(groupName) {
        const groupColor = getColorForString(groupName);
        return {
            border: LightenDarkenColor(groupColor, 50),
            background: groupColor,
            highlight: {
                border: groupColor,
                background: groupColor
            },
            hover: {
                border: groupColor,
                background: groupColor
            }
        };
    }

    stringify(value) {
        return value.toString();
    }

    _prepareNode(vertexData, labelPropertyKey) {
        const groupName = vertexData.label;
        vertexData.label = labelPropertyKey
            ? this.stringify(vertexData[labelPropertyKey])
            : this.stringify(vertexData.id);
        vertexData.group = groupName;
        vertexData.color = this.getNodeColor(groupName);
        // this.generateNodeGroups(groupName);
        return vertexData;
    }

    _prepareEdge(edgeData, labelPropertyKey) {
        const groupName = edgeData.label;
        edgeData.label = labelPropertyKey
            ? this.stringify(edgeData[labelPropertyKey])
            : this.stringify(edgeData.id);
        edgeData.group = groupName;
        // this.generatorEdgeGroups(groupName);
        return edgeData;
    }

    checkIfNodeExist(node) {
        return this.network.findNode(node.id).length !== 0;
    }

    checkIfEdgeExist(edge) {
        return !!this.edges.get(edge.id);
    }

    updateData(nodes, edges) {
        let nodesPrepared = [];
        let edgesPrepared = [];
        if (nodes) {
            nodes.forEach((node) => {
                const nodePrepared = this._prepareNode(node);
                if (!this.checkIfNodeExist(nodePrepared)) {
                    nodesPrepared.push(nodePrepared);
                }
            });
        }
        if (edges) {
            edges.forEach((edge) => {
                const edgePrepared = this._prepareEdge(edge);
                if (!this.checkIfEdgeExist(edgePrepared)) {
                    edgesPrepared.push(edgePrepared);
                }
            });
        }
        console.log("=====nodesPrepared", nodesPrepared);

        if (nodesPrepared.length > 0) {
            this.nodes.add(nodesPrepared);
        }
        if (edgesPrepared.length > 0) {
            this.edges.add(edgesPrepared);
        }
    }


    constructor(networkOptions, container) {
        this.networkOptions = networkOptions;
        this.edges = new DataSet([]);
        this.nodes = new DataSet([]);
        this.initNetwork(container);
        // this.isLoaded = true;
    }
}
