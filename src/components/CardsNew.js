import React from "react";

import PaanCorner from "../assest/Deals/paan-corner_web.avif";
import Dairy from "../assest/Deals/Slice-2_10.avif";
import FruitsVegs from "../assest/Deals/Slice-3_9.avif";
import ColdDrinks from "../assest/Deals/Slice-4_9.avif";
import Snacks from "../assest/Deals/Slice-5_4.avif";
import Sweet from "../assest/Deals/Slice-7_3.avif";
import BreakFast from "../assest/Deals/Slice-6_5.avif";
import Bakery from "../assest/Deals/Slice-8_4.avif";
import TeaCoffee from "../assest/Deals/Slice-9_3.avif";
import AttaRice from "../assest/Deals/Slice-10.avif";
import MasalaOil from "../assest/Deals/Slice-11.avif";
import Sauces from "../assest/Deals/Slice-12.avif";
import ChikenMeat from "../assest/Deals/Slice-13.avif";
import Organic from "../assest/Deals/Slice-14.avif";
import BabyCare from "../assest/Deals/Slice-15.avif";
import PharmaWellness from "../assest/Deals/Slice-16.avif";
import Cleaning from "../assest/Deals/Slice-17.avif";
import HomeOffice from "../assest/Deals/Slice-18.avif";
import PersonalCare from "../assest/Deals/Slice-19.avif";
import Petcare from "../assest/Deals/Slice-20.avif";

// Card data
const cardData = [
  {
    title: "Paan Corner",
    offer: "From ₹299",
    imgSrc: PaanCorner,
    link: "/product-category?subcategory=mom,%20baby%20care",
  },
  {
    title: "Dairy, Bread & Eggs",
    offer: "From ₹999",
    imgSrc: Dairy,
    link: "/product-category?category=groceries&subcategory=dairy,%20bakery",
  },
  {
    title: "Fruits & Vegetables",
    offer: "Upto 75% Off",
    imgSrc: FruitsVegs,
    link: "/product-category?category=groceries&subcategory=fruits,%20vegetables",
  },
  {
    title: "Cold Drinks & Juices",
    offer: "Upto 80% Off",
    imgSrc: ColdDrinks,
    link: "/product-category?category=groceries&subcategory=biscuits,%20drinks",
  },
  {
    title: "Snacks & Munchies",
    offer: "Upto 80% Off",
    imgSrc: Snacks,
    link: "/product-category?category=groceries&subcategory=snacks",
  },
  {
    title: "Breakfast & Instant Food",
    offer: "From ₹99",
    imgSrc: BreakFast,
    link: "/product-category?category=kitchenware",
  },
  {
    title: "Sweet Tooth",
    offer: "Under ₹299",
    imgSrc: Sweet,
    link: "/product-category?category=groceries",
  },
  {
    title: "Bakery & Biscuits",
    offer: "From ₹99",
    imgSrc: Bakery,
    link: "/product-category?category=groceries&subcategory=dairy,%20bakery",
  },
  {
    title: "Tea, Coffee & Health Drink",
    offer: "From ₹1299",
    imgSrc: TeaCoffee,
    link: "/product-category?category=electronics",
  },
  {
    title: "Atta, Rice & Dal",
    offer: "From ₹20",
    imgSrc: AttaRice,
    link: "/product-category?category=groceries&subcategory=cooking%20essentials",
  },
  {
    title: "Masala, Oil & More",
    offer: "From ₹20",
    imgSrc: MasalaOil,
    link: "/product-category?subcategory=biscuits,%20drinks",
  },
  {
    title: "Sauces & Spreads",
    offer: "From ₹20",
    imgSrc: Sauces,
    link: "/product-category?subcategory=biscuits,%20drinks",
  },
  {
    title: "Chiken, Meat & Fish",
    offer: "From ₹20",
    imgSrc: ChikenMeat,
    link: "/product-category?category=groceries&subcategory=dry%20fish",
  },
  {
    title: "Organic & Health Living",
    offer: "From ₹20",
    imgSrc: Organic,
    link: "/product-category?subcategory=biscuits,%20drinks",
  },
  {
    title: "Baby Care",
    offer: "From ₹20",
    imgSrc: BabyCare,
    link: "/product-category?category=groceries&subcategory=mom,%20baby%20care",
  },
  {
    title: "Pharma & Wellness",
    offer: "From ₹20",
    imgSrc: PharmaWellness,
    link: "/product-category?subcategory=biscuits,%20drinks",
  },
  {
    title: "Cleaning Essentials",
    offer: "From ₹20",
    imgSrc: Cleaning,
    link: "/product-category?subcategory=biscuits,%20drinks",
  },
  {
    title: "Home & Office",
    offer: "From ₹20",
    imgSrc: HomeOffice,
    link: "/product-category?subcategory=biscuits,%20drinks",
  },
  {
    title: "Personal Care",
    offer: "From ₹20",
    imgSrc: PersonalCare,
    link: "/product-category?subcategory=biscuits,%20drinks",
  },
  {
    title: "Pet Care",
    offer: "From ₹20",
    imgSrc: Petcare,
    link: "/product-category?subcategory=biscuits,%20drinks",
  },
];

// Card Component - Blinkit Style
const Card = ({ title, offer, imgSrc, link }) => {
  return (
    <a href={link} className="block group">
      <div className="bg-white flex items-center justify-center overflow-hidden">
        <img
          src={imgSrc}
          alt={title}
          className="transition-transform duration-200 group-hover:scale-105"
        />
      </div>
    </a>
  );
};

// Main Component
const CardPageNew = () => {
  return (
    <div className="container mx-auto mt-4">
      {/* Responsive Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-10 lg:grid-cols-10 gap-3 sm:gap-4 md:gap-2">
        {cardData.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            offer={card.offer}
            imgSrc={card.imgSrc}
            link={card.link}
          />
        ))}
      </div>
    </div>
  );
};

export default CardPageNew;
