import React, { Component } from 'react';
import { Layout, Icon } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
const { Header } = Layout;

interface HeaderComponentProps extends RouteComponentProps {
    title: string,
    type?: string,
    canGoBack?: boolean;
}

class HeaderComponent extends Component<HeaderComponentProps> {
    render() {
        return <Header style={{ background: '#fff', padding: 0 }}>
            <ul className="toolbar">
                <li key='title' className="title">
                    <div style={{ paddingTop: 0 }}>
                        {this.props.canGoBack && <Icon type='left-circle' style={{ marginRight: 10, display: 'inline-block' }} onClick={() => this.props.history.goBack()} />}
                        {this.props.type && <span className="header-type" style={{ height: this.props.type ? 30 : 20, display: 'inline-block' }}>{this.props.type}:&nbsp;&nbsp;</span>}
                        <span style={{ lineHeight: 2 }}>{this.props.title}</span>
                    </div>
                </li>
            </ul>
        </Header>
    }
}

export default withRouter(HeaderComponent);