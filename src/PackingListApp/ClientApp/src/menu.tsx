import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Layout, Menu, Icon } from 'antd';

interface AppMenuProps extends RouteComponentProps {

}
interface AppMenuState {
}

class AppMenu extends Component<AppMenuProps, AppMenuState> {
    constructor(props: AppMenuProps) {
        super(props);
    }
   
    render() {
        return (<Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item title={<span>Inicio</span>} key="home" onClick={() => this.props.history.push('/')}>
                <Icon type="home" /><span>Inicio</span>
            </Menu.Item>
        </Menu>
        );
    }
}

export default withRouter(AppMenu);