
import React, { useState, useEffect } from 'react';
import { Form, Icon, Input, Button, Tooltip, Row, Col, Divider, Modal, message } from 'antd';
import { useSelector } from 'react-redux';
import TextArea from 'antd/lib/input/TextArea';
import { useFirestore, useFirestoreConnect, isLoaded } from 'react-redux-firebase'
import { Link, useLocation, useHistory } from "react-router-dom";
import shortid from 'shortid';
import { FaChurch, FaPray, FaMicrophone, FaStop } from 'react-icons/fa';
import publicIp from 'public-ip';
import iplocation from "iplocation";
import ModalRastrear from './ModalRastrear';

function HomeForm(props) {
    const firestore = useFirestore();
    const location = useLocation();
    const history = useHistory();
    const [iconLoading, setIconLoading] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [audio, setAudio] = useState(false);
    const [recording, setRecording] = useState(false);
    const [visible, setVisible] = useState(false);

    const { getFieldDecorator } = props.form;

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                setIconLoading(true);

                const ip = await publicIp.v4();
                const ipLocation = await iplocation(ip);
                const code = shortid.generate();
                firestore.add('intencoes', {
                    ...values,
                    code,
                    createdAt: new Date(),
                    ip,
                    ...ipLocation, 
                    oracoes: [],
                    comentarios: []
                }).then((data) => {
                    setIconLoading(false);
                    props.form.resetFields();
                    message.success('Intenção enviada com sucesso! que Deus abençoe sua vida.');
                    history.push(`/intencao?code=${code}`);
                });


            }
        });
    };

    const abrirModalRastrarIntencao = () => {
        setVisible(true);
    }

    return (
        <Row>
            <Col span={12} offset={6}>
                <Link to="/" style={{ display: 'block', fontFamily: `'Beth Ellen', cursive`, textAlign: 'center', fontSize: 60, margin: '60px auto' }}>
                    Anjo<span style={{ color: '#b7b7b7' }}>bom</span>
                </Link>
                <Form onSubmit={handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('content', {
                            rules: [{ required: true, message: 'Por favor, preencha sua intenção ou partilha.' }],
                        })(
                            <TextArea
                                autoSize={{ minRows: 4, maxRows: 12 }}
                                type="password"
                                placeholder="Coloque aqui suas intenções ou partilha. Algum anjo bom irá rezar por você."
                            />,
                        )}
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon="check"
                            loading={iconLoading}
                            className="login-form-button">
                            Solicitar Oração
                            </Button>
                    </Form.Item>
                </Form>
                <Divider />
                <div style={{ textAlign: 'center' }}>
                    {/*<Link style={{ color: '#688e66' }} to='/login'><FaChurch /> Área do Intercessor</Link>*/}
                    <Button onClick={() => abrirModalRastrarIntencao()} style={{ color: '#a25050' }} type="link"><FaPray /> Rastrear Intenção</Button>
                    <br /><br /><br />
                    <small>AnjoBom 2020</small>
                </div>
                <ModalRastrear visible={visible} />
            </Col>
        </Row>
    );
}

const Home = Form.create({ name: 'home' })(HomeForm);
export default Home;