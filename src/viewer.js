import React from "react";
import defaultsDeep from "lodash/fp/defaultsDeep";
import {DataSet} from "vis-data/peer/esm/vis-data"
import {Network} from "vis-network/peer/esm/vis-network";
import VizNetworkUtils from "./graph-utils";


export default class GraphCanvas extends React.Component {
    vizNetworkUtils = new VizNetworkUtils();

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
            edges: this.vizNetworkUtils.generateEdgeConfig(),
            nodes: {
                shape: "circle",
                size: 14
            },
            groups: this.vizNetworkUtils.node_groups,
            height: "calc(100vh - 100px)"
        };
    }

    static defaultProps = {
        containerId: "graph-container",
        connector: null,
        options: null
    }

    constructor(props) {
        super(props);
        this.container = React.createRef();
    }

    initNetwork() {
        // merge user provided options with our default ones
        let options = defaultsDeep(this.getDefaultOptions(), this.props.options);
        const {current} = this.container;
        this.network = new Network(
            current,
            {
                edges: this.edges,
                nodes: this.nodes
            },
            options
        );
    }

    updateNetwork(newOptions) {
        // const existingOptions =
        this.network.setOptions(newOptions)
    }

    updateGraphData(nodes, edges) {
        if (nodes) {
            this.nodes.add(nodes);
        }
        if (edges) {
            this.edges.add(edges);
        }
    }

    componentDidMount() {
        console.log("this.connector", this.props.connector)

        const initData = this.props.connector.query();
        const nodesPrepared = this.vizNetworkUtils.prepareNodes(initData.nodes);
        const edgesPrepared = this.vizNetworkUtils.prepareEdges(initData.edges);

        this.edges = new DataSet(edgesPrepared)
        this.nodes = new DataSet(nodesPrepared)
        this.initNetwork();
        // setTimeout(() => this.updateGraphData(
        //     this.vizNetworkUtils.prepareNodes(this.props.connector.query2())
        // ), 3000)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.query !== prevProps.query) {
            if (this.props.query === "query2") {
                this.updateGraphData(
                    this.vizNetworkUtils.prepareNodes(this.props.connector.query2())
                )
            } else if (this.props.query === "query3") {
                this.updateGraphData(
                    this.vizNetworkUtils.prepareNodes(this.props.connector.query3())
                )
            } else if (this.props.query === "query1") {
                alert("already updated");
            }
            const fitOption = {
                nodes: this.nodes.getIds() //nodes is type of vis.DataSet contains all the nodes
            }
            this.network.fit(fitOption);

            const centerOptions = {
                position: {
                    x: this.network.getViewPosition().x,
                    y: this.network.getViewPosition().y
                },
            }
            this.network.moveTo(centerOptions);
        }
    }


    render() {
        console.log("this.props.query", this.props.query);
        const {style} = this.props;
        return React.createElement(
            "div",
            {
                id: this.props.containerId,
                ref: this.container,
                style
            },
            this.props.containerId
        );
    }
}
