import { Icon, Layout } from 'antd';
import autobind from 'autobind-decorator';
import React, { Component } from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router';
import AppMenu from './menu';
import HomePage from './pages/home';
import MyUserItemListPage from './pages/MyUser';
import TestIndex from './pages/TestModel/index';
const { Sider } = Layout;

interface AppProps extends RouteComponentProps {}
interface AppState {
    collapsed: boolean;
}

class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            collapsed: true
        };
    }

    @autobind
    private toggle() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        return (
            <Layout>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}
                >
                    <div className="logo" onClick={this.toggle}>
                        <Icon
                            type={
                                this.state.collapsed
                                    ? 'menu-unfold'
                                    : 'menu-fold'
                            }
                        />
                        {!this.state.collapsed && <h1>Packing List</h1>}
                    </div>
                    <AppMenu />
                </Sider>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/test" component={TestIndex} />
                <Route exact path="/myuser" component={MyUserItemListPage} />
            </Layout>
        );
    }
}

export default withRouter(App);
