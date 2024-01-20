"use client"
import React, { useState, useEffect } from 'react';
import { Button, Card, Tag, Space, Image, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import brands from '../brands.json';
import products from '../products.json';

const { Text, Link } = Typography;

export default function Home() {
    const [randomIndices, setRandomIndices] = useState<number[]>([]);
    useEffect(() => {
      setRandomIndices(Array.from({ length: 6 }, () => Math.floor(Math.random() * products.length)));
    }, []);

    function capitaliseFirstLetter(word: string) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }

    return (
      <div className="bodyContent">
        <div style={{backgroundColor:"white", margin:"0.5% 0 2% 0"}}>
          {/* this is the punchout part */}
          <Image
            src="/homepage-banner-punchout.svg"
            width="100%"
            height="auto"
            preview={false}
          />
        </div>
        {/* featured brand is shown here */}
        <div id="featuredBrands" style={{margin:"0.5% 0 2% 0"}}>
            <span style={{fontSize:"150%", fontWeight:"bolder"}}>Featured Brands</span>
            <div style={{height: "40px"}}>
              <span className="description">Browse the full catalog of brands today</span>
              <Button type="link" style={{float:"right", color:"rgba(42, 100, 219, 1)"}}>
                View <RightOutlined />
              </Button>
            </div>
            <div style={{display: "flex", flexWrap: "wrap"}}>
              {brands.map((brand, index) => (
                brand.featured === true ? (
                  <Card 
                    key={index}
                    style={{width:"240px", marginRight:"0.5%", marginTop: "1%"}}
                  >
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 70}}>
                      {brand.image && <Image src={brand.image.url} width={150} preview={false} />}
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                      <span style={{marginTop: '10%', fontWeight: 'bolder'}}>{brand.name}</span>
                      <span className="description">{brand.productCount} Products</span>
                    </div>
                  </Card>
                ) : null
              ))}
            </div>
        </div>
        {/* popular products are shown here */}
        <div id="popularProducts">
          <span style={{fontSize:"150%", fontWeight:"bolder"}}>Our Most Popular Products</span>
          <span style={{display: "block"}} className="description">Trusted by the best companies in Asia</span>
          <div style={{display: "flex", flexWrap: "wrap", marginTop: "1%", gap:"0.5%"}}>
            {randomIndices.map((randomIndex, index) => {
              const product = products[randomIndex];

              // split the price into two parts
              // because I want to style the currency
              let splitLowPrice: string[] = [];
              let splitHighPrice: string[] = [];
              if (product.lowPricePretty && product.highPricePretty) {
                splitLowPrice = product.lowPricePretty.split(" ");
                splitHighPrice = product.highPricePretty.split(" ");
              } else if (product.lowPricePretty) {
                splitLowPrice = product.lowPricePretty.split(" ");
              } else if (product.highPricePretty) {
                splitHighPrice = product.highPricePretty.split(" ");
              }
              return (
                <Link key={index} href={`/product/${product.id}`}>
                  <Card
                    hoverable
                    style={{width:"240px", height:"100%", marginTop: "1%"}}
                  >
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 150}}>
                      <Image 
                        width={150}
                        src={product.images[0].url}
                        preview={false}
                      />
                    </div>
                    <Space direction="vertical" size={0} style={{height: 80}}>
                      {product.vipPriceFlag === true ? (
                        <Tag className="vip-price">VIP Price</Tag>
                      ) : null}
                      {product.bulkDiscountFlag === true ? (
                        <Tag className="bulk-discount">Bulk Discount</Tag>
                      ) : null}
                      {product.moq > 1 ? (
                        <Tag className="moq">MOQ: {product.moq}</Tag>
                      ) : null}
                    </Space>
                    <Space
                      direction="vertical"
                      size={0}
                    >
                      {product.highPriceOriginalPretty !== null ? (
                        <Text delete>
                          <span style={{color:"rgba(134, 138, 146, 1)", fontSize:"small"}}>
                            {product.highPriceOriginalPretty} &mdash; {product.highPriceOriginalPretty}
                          </span>
                        </Text>
                      ) : null}
                      <span style={{fontWeight:"bold", color:"rgba(42, 100, 219, 1)"}}>
                        {product.lowPricePretty && product.highPricePretty ? (
                          <>
                            <sup>{splitLowPrice[0]}</sup>{splitLowPrice[1]} &mdash; <sup>{splitHighPrice[0]}</sup>{splitHighPrice[1]}
                          </>
                        ) : product.lowPricePretty !== null ? (
                          <>
                            <sup>{splitLowPrice[0]}</sup>{splitLowPrice[1]}
                          </>
                        ) : product.highPricePretty !== null ? (
                          <>
                            <sup>{splitHighPrice[0]}</sup>{splitHighPrice[1]}
                          </>
                        ) : null}
                      </span>
                      <span className="description">{product.title.replace(capitaliseFirstLetter(product.metadata.brand), "").replace("Authorized Distributor", "").replace(capitaliseFirstLetter(product.metadata.brand), "")}</span>
                    </Space>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    )
}