import React, { Component } from 'react';
import { Layout, Col, Row, Card, Divider, DatePicker, Modal, InputNumber } from 'antd';
import HeaderComponent from '../components/shell/header';
const { Content } = Layout;
import HttpService from 'src/services/http-service';
import { resolve } from 'src/inversify.config';
import autobind from 'autobind-decorator';
import { Link } from 'react-router-dom';

interface HomePageProps {

}

interface HomePageState {
    result: string | undefined;
}

class HomePage extends Component<HomePageProps, HomePageState> {
    @resolve(HttpService)
    httpService!: HttpService;

    constructor(props: HomePageProps) {
        super(props);
        this.state = {
            result: undefined
        };
    }

    componentDidMount() {
        this.loadData();
    }

    @autobind
    private loadData() {
        this.httpService.get("/home/online").then(result => {
            this.setState({ result: result.data as any });
        }).catch(error => {
            console.error(error);
        });
    }


    render() {
        return <Layout>
            <HeaderComponent title='Test Iberant' />
            <Content className='page-content'>
                <div style={{ margin: "12px" }}>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Card title="Models">
                                <ul>
                                    <li><Link to='/test'>TestModel</Link></li>
                                    <li><Link to='/usuario'>UsuarioModel</Link></li>
                                   
                                </ul>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Content>
        </Layout>
    }
}

export default HomePage