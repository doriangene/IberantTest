import { Card, Col, Layout, Row } from 'antd';
import autobind from 'autobind-decorator';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { resolve } from 'src/inversify.config';
import HttpService from 'src/services/http-service';
import HeaderComponent from '../components/shell/header';
const { Content } = Layout;

interface HomePageProps {}

interface HomePageState {
    result: string | undefined;
}

class HomePage extends Component<HomePageProps, HomePageState> {
    @resolve(HttpService) httpService!: HttpService;

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
        this.httpService
            .get('/home/online')
            .then(result => {
                this.setState({ result: result.data as any });
            })
            .catch(error => {
                console.error(error);
            });
    }

    render() {
        return (
            <Layout>
                <HeaderComponent title="Test Iberant" />
                <Content className="page-content">
                    <div style={{ margin: '12px' }}>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Card title="Models">
                                    <ul>
                                        <li>
                                            <Link to="/test">TestModel</Link>
                                        </li>
                                        <li>
                                            <Link to="/myuser">MyUser</Link>
                                        </li>
                                    </ul>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default HomePage;
