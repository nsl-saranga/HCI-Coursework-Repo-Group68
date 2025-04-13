import React from 'react';
import NavBar from '../../components/NavBar/NavBar';
// import SideBar from '../../Components/SideBar/SideBar';
// import HomeCarousel from '../../Components/HomeCorousel/HomeCorousel';
import Footer from '../../components/Footer/Footer';
import Card from '../../components/Card/Card';
import furnitureProducts from '../../js/products';
import './HomePage.css';
// import logoImage from '../../assets/logo.jpg'

import headerImg from '../../assets/header.png'
import user1Img from '../../assets/user-1.jpg'
import user2Img from '../../assets/user-2.jpg'
import user3Img from '../../assets/user-3.jpg'
import product1Img from '../../assets/product-1.png'
import product2Img from '../../assets/product-2.png'
import product3Img from '../../assets/product-3.png'
import product4Img from '../../assets/product-4.png'
import product5Img from '../../assets/product-5.png'
import product6Img from '../../assets/product-6.png'



const HomePage = () => {
  return (
    <>
    <NavBar/>

    <header class="section__container header__container" id="home">
      <div class="header__image">
        <img src={headerImg} alt="header" />
      </div>
      <div class="header__content">
        <div>
          <h1>FurniCraft: Where Art Meet Furniture</h1>
          <p>
          Discover refined interiors crafted with style and soul — curated by design professionals at FurniCraft.
          </p>
        </div>
      </div>
    </header>

    <section class="section__container deals__container">
      <div class="deals__card">
        <h2 class="section__header">Hot 🔥 deals for you</h2>
        <p>Online shopping for retail sales direct to consumers</p>
      </div>
      <div class="deals__card">
        <span><i class="ri-cash-line"></i></span>
        <h4>1.5% cashback</h4>
        <p>Earn a 5% cashback reward on every furniture purchase you make!</p>
      </div>
      <div class="deals__card">
        <span><i class="ri-calendar-schedule-line"></i></span>
        <h4>30 day terms</h4>
        <p>
          Take advantage of our 30-day payment terms, completely interest-free!
        </p>
      </div>
      <div class="deals__card">
        <span><i class="ri-money-rupee-circle-line"></i></span>
        <h4>Save money</h4>
        <p>
          Discover unbeatable prices and save big money on top-quality
          furniture!
        </p>
      </div>
    </section>

    <section class="section__container product__container" id="product">
      <h2 class="section__header">New Arrivals</h2>
      <div className="product__grid">
        {furnitureProducts.map(product => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </section>
    <section class="section__container product__container" id="product">
      <h2 class="section__header">Best Sellers</h2>
      <div className="product__grid">
        {furnitureProducts.map(product => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </section>

    <section class="section__container client__container">
      <div class="client__content">
        <h2 class="section__header">What our happy client say</h2>
        <p class="section__description">
          Testimonials Highlighting Our Commitment to Quality, Exceptional
          Service, and Customer Satisfaction
        </p>
        <div class="swiper">
        
          <div class="swiper-wrapper">
        
            <div class="swiper-slide">
              <div class="client__card">
                <img src={user1Img} alt="user" />
                <div>
                  <p>
                    Furni.shop transformed my living space with their beautiful
                    and affordable furniture. The 5% cashback was a delightful
                    bonus!
                  </p>
                  <h4>David Miller</h4>
                  <h5>Real Estate Agent</h5>
                </div>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="client__card">
                <img src={user2Img} alt="user" />
                <div>
                  <p>
                    Exceptional quality and service! The furniture is stunning,
                    and the 30-day payment terms made it incredibly convenient.
                  </p>
                  <h4>Sarah Thompson</h4>
                  <h5>Interior Designer</h5>
                </div>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="client__card">
                <img src={user3Img} alt="user" />
                <div>
                  <p>
                    The 30-day terms made it easy for us to furnish our new home
                    without financial stress. Highly recommended!
                  </p>
                  <h4>Michael Lee</h4>
                  <h5>Entrepreneur</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
   
  
    </section>

    
    <Footer/>
    
   

  
    </>
  );
};

export default HomePage;