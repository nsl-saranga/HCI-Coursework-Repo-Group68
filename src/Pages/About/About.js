import React from 'react';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import '../About/About.css';

import aboutHeroImg from '../../assets/about-hero.jpeg';
import teamImg from '../../assets/team.jpg';
import craftImg from '../../assets/craft.jpeg';
import designImg from '../../assets/design.jpg';
import deliverImg from '../../assets/deliver.jpeg';
import showroomImg from '../../assets/showroom.png';

const AboutUsPage = () => {
  return (
    <>
      <NavBar />

      <section className="section__container about-hero__container">
        <div className="about-hero__image">
          <img src={aboutHeroImg} alt="Furniture craftsmanship" />
        </div>
        <div className="about-hero__content">
          <h1 className="section__header">Our Story</h1>
          <p className="section__description">
            Founded in 2015, FurniCraft began as a small workshop with a big vision - to bring 
            handcrafted, sustainable furniture to homes worldwide.
          </p>
        </div>
      </section>

      <section className="section__container mission__container">
        <div className="mission__content">
          <h2 className="section__header">Our Mission</h2>
          <p>
            At FurniCraft, we believe furniture should be both beautiful and built to last. 
            We combine traditional craftsmanship with modern design to create pieces that 
            tell a story and stand the test of time.
          </p>
        </div>
      </section>

      <section className="section__container values__container">
        <h2 className="section__header">Our Values</h2>
        <div className="values__grid">
          <div className="value__card">
            <h3>Sustainability</h3>
            <p>
              We source materials responsibly, using FSC-certified woods and eco-friendly 
              finishes to minimize our environmental impact.
            </p>
          </div>
          <div className="value__card">
            <h3>Quality Craftsmanship</h3>
            <p>
              Each piece is handcrafted by skilled artisans who take pride in their work, 
              ensuring exceptional quality in every detail.
            </p>
          </div>
          <div className="value__card">
            <h3>Customer Satisfaction</h3>
            <p>
              Your happiness is our priority. From design to delivery, we're committed to 
              providing an exceptional experience.
            </p>
          </div>
        </div>
      </section>

      <section className="section__container team__container">
        <div className="team__image">
          <img src={teamImg} alt="FurniCraft team" />
        </div>
        <div className="team__content">
          <h2 className="section__header">Meet Our Team</h2>
          <p>
            Our diverse team of designers, craftsmen, and customer service professionals 
            share a passion for creating furniture that transforms houses into homes.
          </p>
        </div>
      </section>

      <section className="section__container process__container">
        <h2 className="section__header">Our Process</h2>
        <div className="process__steps">
          <div className="process__step">
            <span>1</span>
            <h3>Design</h3>
            <img src={designImg} alt="Crafting process" />
            <p>Our designers create timeless pieces that blend form and function.</p>
          </div>
          <div className="process__step">
            <span>2</span>
            <h3>Craft</h3>
            <img src={craftImg} alt="Crafting process" />
            <p>Skilled artisans bring each design to life with meticulous attention to detail.</p>
          </div>
          <div className="process__step">
            <span>3</span>
            <h3>Deliver</h3>
            <img src={deliverImg} alt="Crafting process" />
            <p>We carefully package and ship your furniture with white-glove service.</p>
          </div>
        </div>
      </section>

      <section className="section__container visit__container">
        <div className="visit__content">
          <h2 className="section__header">Visit Our Showroom</h2>
          <p>
            Experience our furniture in person at our flagship showroom in Portland, Oregon.
          </p>
          <address>
            123 Furniture Avenue<br />
            Portland, OR 97201<br />
            Open Mon-Sat: 10am-7pm
          </address>
        </div>
        <div className="visit__image">
          <img src={showroomImg} alt="FurniCraft showroom" />
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AboutUsPage;