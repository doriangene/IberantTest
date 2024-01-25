import React, { Component } from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router';
import HomePage from './pages/home';
import TestIndex from './pages/TestModel/index';
import UserIndex from './pages/User/index';
import autobind from 'autobind-decorator';
import { Layout, Menu, Icon, Divider, Modal, DatePicker, Input, InputNumber } from 'antd';
import HttpService from './services/http-service';
const { Sider } = Layout;
import AppMenu from './menu';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { container } from './inversify.config';


interface AppProps extends RouteComponentProps {

}
interface AppState {
    collapsed: boolean;
}

class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            collapsed: true,
        };
    }
    
    @autobind
    private toggle() {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
 
    render() {
        return (
            <Layout>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}>
                    <div className="logo" onClick={this.toggle}>
                        <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                       {!this.state.collapsed && <h1>Packing List</h1>} 
                    </div>
                    <AppMenu  /> 
                </Sider>
                <Route exact path='/' component={HomePage} />
                <Route exact path='/occupation' component={TestIndex} />
                <Route exact path='/user' component={UserIndex} />
            </Layout>);
    }
}

export default withRouter(App);