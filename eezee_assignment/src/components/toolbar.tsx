// to inform nextjs that this is a client component
"use client"
import React from 'react';
import { Col, Row, Input, Button, Badge, Image, Typography } from 'antd'
import { SearchOutlined, ShoppingCartOutlined, MenuOutlined, TagsOutlined, LayoutOutlined } from '@ant-design/icons'
import { useGlobalContext } from '../context/store';

const { Link } = Typography;

export const toolbar:React.FC = () => {
  const { cart, setCart } = useGlobalContext();

  return (
    <div style={{backgroundColor: "white"}}>
			<div className="bodyContent" style={{padding: "1% 0 0.5% 0"}}>
        <Row wrap={true} justify={"space-evenly"} gutter={{ xs: 8, sm: 16, md: 24}}>
          <Col flex="5">
            <Link href="/">
              <Image 
                src="/logo-on-white-nopadding.svg"
                width={200}
                height={50}
                preview={false}
                alt="Eezee logo"
              />
            </Link>
          </Col>
          <Col flex="8">
            <Input 
              className="input-placeholder"
              placeholder="Search Products Here" 
              suffix={
                <Button
                  className="search-button" 
                  shape="circle" icon={<SearchOutlined />} 
                />
              }
            />
          </Col>
          <Col flex="9"></Col>
          <Col flex="2">
            <Badge count={cart.length} showZero offset={[-25, 1]} color='#2A64DB'>
              <Button
                className="shopping-cart-button"
                icon={<ShoppingCartOutlined style={{fontSize:"2rem"}}/>}
              >
                <span style={{display: "block", fontSize: "12px", marginRight: "15%"}}>Cart</span>
              </Button>
            </Badge>
          </Col>
        </Row>
        <Row wrap={true} style={{marginTop: "1%"}}>
          <Col flex="0.1">
            <Button type="link">
              <MenuOutlined /> 
              View All Categories
            </Button>
          </Col>
          <Col flex="0.1">
            <Button type="link">
              <TagsOutlined />
              View All Brands
            </Button>
          </Col>
          <Col flex="0.1">
            <Button type="link">
              <LayoutOutlined /> 
              View All Specs Tables
            </Button>
          </Col>
        </Row>
			</div>
    </div>
  )
}

export default toolbar