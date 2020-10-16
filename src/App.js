import React from 'react';
import './App.css';
import GraphCanvas from "./viewer";
// import {Network} from "vis-network";

// import "vis-network/styles/vis-network.css";

// class App extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {};
//     }
//
//     render() {
//         const instance = this;
//         if (instance.state.networkElement) {
//             // const nodes = new DataSet([{id: 'a'}, {id: 'b'}]);
//             // const edges = new DataSet([{from: 'a', to: 'b'}]);
//             const nodes = [{id: 'a'}, {id: 'b'}];
//             const edges = [{from: 'a', to: 'b'}];
//             const data = {nodes, edges};
//             const options = {height: "500px"}
//             new Network(instance.state.networkElement, data, options);
//         }
//
//         function refCallback(elem) {
//             if (elem && !instance.state.networkElement)
//                 instance.setState({networkElement: elem});
//         }
//
//         return (
//             <div className="App">
//                 <div ref={refCallback}></div>
//             </div>
//         );
//     }
// }
//
// export default App;
function range(start, stop, step) {
    var a = [start], b = start;
    while (b < stop) {
        a.push(b += step || 1);
    }
    return a;
}

class GremlinConnector {

    query() {
        const nodes = [
            {id: 1, label: "User", properties: {title: "node 1 tootip text"}},
            {id: 2, label: "UserProfile", properties: {title: "node 2 tootip text"}},
            {id: 3, label: "UserSetting", properties: {title: "node 3 tootip text"}},
            {id: 4, label: "Login", properties: {title: "node 4 tootip text"}},
            {id: 5, label: "Login", properties: {title: "node 5 tootip text"}}
        ];

        const edges = [
            {id: "1-2", from: 1, to: 2, label: "has_profile", properties: {}},
            {id: "1-3", from: 1, to: 3, label: "has_setting", properties: {}},
            {id: "2-4", from: 2, to: 4, label: "has_login", properties: {}},
            {id: "2-5", from: 2, to: 5, label: "has_login", properties: {}}
        ];
        return {nodes, edges};
    }

    query2() {
        const nodes = [
            {id: 6, label: "Node 6", properties: {title: "node 6 tootip text"}},
            {id: 7, label: "Node 7", properties: {title: "node 7 tootip text"}},
            {id: 8, label: "Node 8", properties: {title: "node 8 tootip text"}}
        ];
        const edges = [];
        nodes.forEach((node) => {
            edges.push(
                {id: node.id + "-1", from: node.id, to: 1, label: "has_connection", properties: {"title": "connection"}}
            )
            edges.push(
                {id: node.id + "-2", from: node.id, to: 2, label: "has_connection", properties: {"title": "connection"}}
            )
        })
        return {nodes, edges};
    }

    query3() {
        const nodeRange = range(9, 30);
        const nodes = [];
        nodeRange.forEach((nodeId) => {
            nodes.push({id: nodeId, label: "Node " + nodeId, properties: {title: "node " + nodeId + " tootip text"}})
        })

        const edges = [];
        nodeRange.forEach((nodeId) => {
            edges.push(
                {id: nodeId + "-8", from: nodeId, to: 8, label: "has_connection", properties: {"title": "connection"}}
            )
        })
        return {nodes, edges};
    }

}

const connector = new GremlinConnector()

class QueryConsole extends React.Component {

    render() {
        return (
            <div>
                <input type="button" onClick={() => this.props.updateState({query: "query1"})} value={"query1"}/>
                <input type="button" onClick={() => this.props.updateState({query: "query2"})} value={"query2"}/>
                <input type="button" onClick={() => this.props.updateState({query: "query3"})} value={"query3"}/>
            </div>
        )
    }

}

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            query: null
        };
    }

    updateState(data) {
        this.setState(data);
    }


    render() {
        return (
            <div className="App">
                <QueryConsole updateState={this.updateState.bind(this)}/>
                <GraphCanvas query={this.state.query}
                             containerId={"graphNetwork"} connector={connector}/>
                {/*<NodeMenu/>*/}
                <div id="eventSpan"></div>
            </div>
        )
    }


}

export default App;
