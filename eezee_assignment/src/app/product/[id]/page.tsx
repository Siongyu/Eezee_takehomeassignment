"use client";
import React, { useState, useEffect, useRef, use } from 'react'
import { Button, Divider, Image, Typography, Input, message, Radio } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import { useRouter } from 'next/navigation'
import products from '../../../products.json';
import { useGlobalContext } from '@/context/store';

interface ProductPageProps {
  params: {
    id: string;
  }
}

interface Product {
  id: string;
  images: { url: string }[];
  title: string;
  uniqTitle: string;
  descriptionHtml: string;
  metadata: { 
    brandImage: string; 
    brand: string; 
    model: string 
  };
  vipPriceFlag: boolean;
  bulkDiscountFlag: boolean;
  moq: number;
  lowPrice: number;
  lowPricePretty: string;
  highPrice: number | null;
  highPricePretty: string | null;
  currencySymbol: string;
}

const { Title } = Typography;

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selected , setSelected] = useState<number>(0);
  const { cart, setCart } = useGlobalContext();
  const [messageApi, contextHolder] = message.useMessage()
  const router = useRouter()

  const quantityError = () => {
    if (product) {
      messageApi.open({
        type: 'error',
        content: `selected quantity is less than ${product.moq}`,
      });
    }
  };

  const invalidProductError = () => {
    messageApi.open({
      type: 'error',
      content: 'Invalid product',
    });
  }
  
  const firstRun = useRef(true)

  useEffect(() => {
    const product = products.find(product => product.id === params.id) || null;
    setProduct(product);

    if (!product && firstRun.current) {
      invalidProductError();
      firstRun.current = false;
      const timer = setTimeout(() => {
        messageApi.destroy();
        console.log("redirecting")
        router.push('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [params.id]);


  function handleImageChange(e: RadioChangeEvent) {
    setSelected(e.target.value);
  }

  function capitaliseFirstLetter(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function handleQuantityChange(value: number | undefined) {
    if (value !== undefined) {
      if (value < 1) setQuantity(1);
      else setQuantity(value);
    }
  }

  function handleAddToCart() {
    if (product) {
      if (quantity < product.moq) {
        quantityError();
        return;
      } else {
        // Check if the product is already in the cart
        const existingCartItemIndex = cart.findIndex(cartItem => cartItem.id === product.id);

        if (existingCartItemIndex !== -1) {
          // If the product is already in the cart, increase its quantity
          const updatedCart = [...cart];
          updatedCart[existingCartItemIndex].quantity += quantity;
          setCart(updatedCart);
          localStorage.setItem('cart', JSON.stringify(updatedCart));
        } else {
          // If the product is not in the cart, add it
          const newCartItem = {
            id: product.id,
            quantity: quantity,
          };

          const updatedCart = [...cart, newCartItem];
          setCart(updatedCart);
          localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
      } 
    }
  }

  return (
    <div className="bodyContent" style={{display: "flex", marginTop: "0.5%", gap: "1%"}}>
      <>{contextHolder}</>
      {/* product */}
      {product && (
        <>
        <div className="productDetails" style={{ backgroundColor: "white", borderRadius: "10px", width: "60%" }}>
          <div style={{ margin: "2%" }}>
            <div id="viewBrandCard" style={{ display: "flex", gap: "2%" }}>
              <div style={{
                backgroundColor: "rgba(245, 245, 247, 1)",
                padding: "5px",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
              }}>
                <Image
                  src={product.metadata.brandImage}
                  width={100}
                  preview={false}
                  style={{ backgroundColor: "white", padding: "10px" }} />
                <span>
                  <Button type="link" style={{ fontSize: "small" }}>View Brand</Button>
                </span>
              </div>
              <div id="productTitleBrandModel">
                <Title level={2} style={{ margin: 0 }}>{capitaliseFirstLetter(product.metadata.brand)} {product.title.replace(capitaliseFirstLetter(product.metadata.brand), "").replace("Authorized Distributor", "").replace(capitaliseFirstLetter(product.metadata.brand), "")}</Title>
                <span style={{ display: "block" }}>Brand:<Button type="link" style={{ paddingLeft: '5px' }}>{capitaliseFirstLetter(product.metadata.brand)}</Button></span>
                <span style={{ display: "block" }}>Model:<Button type="link" style={{ paddingLeft: '5px' }}>{product.metadata.model}</Button></span>
              </div>
            </div>
            <Divider />
            <div id="imageArea" style={{display: "flex", flexDirection: "column"}}>
              <div id="focusedImage" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400}}>
                <Image
                  src={product.images[selected].url}
                  width={400}
                  preview={false}
                />
              </div>
              <div id="multipleImages">
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%"}}>
                  <Radio.Group value={selected} onChange={handleImageChange} style={{display: 'flex', gap: "5%"}}>
                    {product.images.map((image, index) => (
                      <Radio.Button key={index} value={index} style={{width: '100px', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Image
                          src={image.url}
                          style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'cover'}}
                          preview={false}
                        />
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                </div>
              </div>
            </div>
            <Divider />
            <div>
              <Title level={3}>Product Description</Title>
              <span className="description" style={{ fontSize: "large", fontWeight: "bold" }}>Specification</span>
              <span className="description" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
            </div>
          </div>
        </div>
        <div id="purchaseArea" style={{ backgroundColor: "white", borderRadius: "10px", height: "fit-content", width: "33%" }}>
          <div style={{ margin: "2%"}}>
            <div id="price">
              <Title level={2} style={{color: "rgba(42, 100, 219, 1)"}}><sup>{product.currencySymbol}</sup>{(product.lowPrice).toFixed(2)}</Title>
            </div>
            <Divider style={{borderTop: '2px dashed rgba(228, 229, 231, 1)'}} />
            <div className="quantity">
              <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Quantity: </span>
              <div className="quantityComponent">
                <div style={{border: '1px solid rgba(228, 229, 231, 1)'}}>
                  <Button type="link" icon={<MinusOutlined />} style={{color: "rgba(42, 100, 219, 1)"}} onClick={() => {
                    if ((quantity - 1) > 0) {
                      setQuantity(quantity-1);
                    }}}
                  />
                </div>
                <div>
                  <Input 
                    min={1}
                    value={quantity} 
                    style={{ textAlign: "center", width: 70, color: "rgba(85, 88, 93, 1)"}}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value !== null) {
                        handleQuantityChange(value);
                      }
                    }}
                  />
                </div>
                <div style={{border: '1px solid rgba(228, 229, 231, 1)'}}>
                  <Button type="link" icon={<PlusOutlined />} style={{color: "rgba(42, 100, 219, 1)"}} onClick={() => setQuantity(quantity+1)}/>
                </div>
              </div>
            </div>
            <div style={{display: "flex", flexDirection: "column", marginTop: "2%"}}>
              <Button type="primary" style={{marginBottom: "2%"}} onClick={handleAddToCart}>Add to Cart</Button>
              <Button style={{color: "rgba(42, 100, 219, 1)"}}>Add to Favourites</Button>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  )
}