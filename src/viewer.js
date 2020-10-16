import React from "react";
import VizNetworkUtils from "./graph-utils";

// import RadialMenu from "./radial-menu";

class NodeMenu extends React.Component {

    static defaultProps = {
        vizNetworkUtils: null,
        connector: null,
        nodeData: null
    }

    constructor(props) {
        super(props);
        this.onClickFocus = this.onClickFocus.bind(this);
        this.onClickExpandInVertices = this.onClickExpandInVertices.bind(this);
        this.onClickExpandOutVertices = this.onClickExpandOutVertices.bind(this);

    }

    onClickFocus() {
        const selectedElem = this.getElement();
        alert("focus clicked: " + selectedElem.elementId);
    }

    onClickExpandInVertices() {
        const selectedElem = this.getElement();
        alert("expand inv clicked:" + selectedElem.elementId)
    }

    onClickExpandOutVertices() {
        const selectedElem = this.getElement();
        alert("expand outv clicked:" + selectedElem.elementId)
    }

    getElement() {
        let elementId = null;
        let dataType = null;
        if (this.props.nodeData) {
            if (this.props.nodeData.nodes && this.props.nodeData.nodes.length > 0) {
                elementId = this.props.nodeData.nodes[0];
                dataType = "node";
            } else if (this.props.nodeData.edges && this.props.nodeData.edges.length > 0) {
                elementId = this.props.nodeData.edges[0];
                dataType = "edge";
            } else if (this.props.nodeData.node) {
                elementId = this.props.nodeData.node;
                dataType = "node";
            } else if (this.props.nodeData.edge) {
                elementId = this.props.nodeData.edge;
                dataType = "edge";
            }
        }
        return {elementId: elementId, dataType: dataType}
    }

    render() {
        // const mySettings = {
        //     textColor: 'red', //define the color of the text on the buttons
        //     buttons: [
        //         {
        //             'text': '\uf053', 'action': () => {
        //                 this.onClickFocus.bind(this)
        //             }
        //         }, //create a button that goes back on history
        //         {
        //             'text': '\uf054', 'action': () => {
        //                 this.onClickExpandInVertices.bind(this)
        //             }
        //         }, //create a button tha goes forward on history
        //     ]
        // };


        const styles = {"position": "fixed"};
        // const radial = new RadialMenu(mySettings);
        if (this.props.nodeData && this.props.nodeData.nodes && this.props.nodeData.nodes.length > 0) {
            styles['left'] = this.props.nodeData.pointer.DOM.x + 10;
            styles['top'] = this.props.nodeData.pointer.DOM.y + 10;

            // radial.setPos( this.props.nodeData.pointer.DOM.x, this.props.nodeData.pointer.DOM.y);
            // radial.show();

            // styles['top'] = 0;
            return <div id={"NodeMenu"} style={styles}>
                <ul>
                    <li onClick={() => this.onClickFocus()}>Focus</li>
                    <li onClick={() => this.onClickExpandInVertices()}>Expand InV</li>
                    <li onClick={() => this.onClickExpandOutVertices()}>Expand outV</li>

                </ul>
            </div>
        } else {
            return <div></div>
        }

    }
}

class SelectedData extends React.Component {

    static defaultProps = {
        selectedElement: null,
        vizNetworkUtils: null
    }

    getElement() {
        let elementId = null;
        let dataType = null;
        if (this.props.selectedElement) {
            if (this.props.selectedElement.nodes && this.props.selectedElement.nodes.length > 0) {
                elementId = this.props.selectedElement.nodes[0];
                dataType = "node";
            } else if (this.props.selectedElement.edges && this.props.selectedElement.edges.length > 0) {
                elementId = this.props.selectedElement.edges[0];
                dataType = "edge";
            } else if (this.props.selectedElement.node) {
                elementId = this.props.selectedElement.node;
                dataType = "node";
            } else if (this.props.selectedElement.edge) {
                elementId = this.props.selectedElement.edge;
                dataType = "edge";
            }
        }
        return {elementId: elementId, dataType: dataType}
    }

    render() {
        if (this.props.selectedElement) {
            let selectedElem = this.getElement();
            let elementData = null;
            if (selectedElem.dataType === "node") {
                elementData = this.props.vizNetworkUtils.nodes.get(selectedElem.elementId);
            } else {
                elementData = this.props.vizNetworkUtils.edges.get(selectedElem.elementId);
            }

            return (
                <div>
                    <h2>Selected Data</h2>
                    {JSON.stringify(elementData)}
                    <hr/>
                </div>
            )
        } else {
            return (<div></div>)
        }
    }
}

export default class GraphCanvas extends React.Component {

    static defaultProps = {
        containerId: "graph-container",
        connector: null,
        options: null,
        networkOptions: {}
    }

    constructor(props) {
        super(props);
        this.container = React.createRef();
        this.state = {
            selectedData: null
        }
    }

    eventsListener(params) {
        this.setState({
            selectedData: params
        })
    }

    componentDidMount() {
        console.log("this.connector", this.props.connector)
        this.vizNetworkUtils = new VizNetworkUtils(this.props.networkOptions,
            this.container, this.eventsListener.bind(this));
        // this.vizNetworkUtils.setIsLoaded(true);

    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("componentDidUpdate");
        if (this.props.query !== prevProps.query) {
            if (this.props.query === "query1") {
                this.vizNetworkUtils.updateData(
                    this.props.connector.query().nodes,
                    this.props.connector.query().edges
                );
            } else if (this.props.query === "query2") {
                this.vizNetworkUtils.updateData(
                    this.props.connector.query2().nodes,
                    this.props.connector.query2().edges
                );
            } else if (this.props.query === "query3") {
                this.vizNetworkUtils.updateData(
                    this.props.connector.query3().nodes,
                    this.props.connector.query3().edges
                );
            } else if (this.props.query === "query1") {
                alert("already updated");
            }
        }
    }


    // shouldComponentUpdate(nextProps, nextState, nextContext) {
    //     return !this.vizNetworkUtils.isLoaded;
    // }


    render() {
        console.log("this.props.query", this.props.query);
        const {style} = this.props;
        const graphContainer = React.createElement(
            "div",
            {
                id: this.props.containerId,
                className: 'graph-canvas',
                ref: this.container,
                style
            },
            this.props.containerId
        );
        return <div>
            {graphContainer}
            <NodeMenu vizNetworkUtils={this.vizNetworkUtils}
                      connector={this.connector}
                      nodeData={this.state.selectedData}/>
            <SelectedData vizNetworkUtils={this.vizNetworkUtils}
                          selectedElement={this.state.selectedData}/>
            <hr/>
            <h5>SELECTED DATA</h5>
            {JSON.stringify(this.state.selectedData)}
        </div>
    }
}
