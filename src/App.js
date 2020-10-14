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
        return [{id: 8, label: "Node 8", title: "node 8 tootip text"}]
    }

    query3() {
        return [{id: 9, label: "Node 9", title: "node 8 tootip text"}]
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
            </div>
        )
    }


}

export default App;
