import React from "react";
import VizNetworkUtils from "./graph-utils";


export default class GraphCanvas extends React.Component {

    static defaultProps = {
        containerId: "graph-container",
        connector: null,
        options: null
    }

    constructor(props) {
        super(props);
        this.container = React.createRef();
    }

    componentDidMount() {
        console.log("this.connector", this.props.connector)
        this.vizNetworkUtils = new VizNetworkUtils(null, this.container);
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
                this.vizNetworkUtils.updateData(this.props.connector.query2());
            } else if (this.props.query === "query3") {
                this.vizNetworkUtils.updateData(this.props.connector.query3());
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
