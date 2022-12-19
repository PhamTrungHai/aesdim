import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function CheckOutSteps(props) {
  return (
    <Row className="checkout-steps">
      <Col className={props.step1 ? 'active' : ''}>Chọn Sản Phẩm</Col>
      <Col className={props.step2 ? 'active' : ''}>Thông Tin Nhận Hàng</Col>
      <Col className={props.step3 ? 'active' : ''}>Thanh Toán</Col>
      <Col className={props.step4 ? 'active' : ''}>Hoàn Tất</Col>
    </Row>
  );
}
