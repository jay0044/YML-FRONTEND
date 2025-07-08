import React from "react";

import babycare from "../assest/Deals & Offers/babycare.jpg";
import Earbuds from "../assest/Deals & Offers/earbuds.jpg";
import Fashion from "../assest/Deals & Offers/Fashion.jpg";
import Gifting from "../assest/Deals & Offers/Gifting.jpg";
import Kitchen from "../assest/Deals & Offers/Kitchen.jpg";
import Homedecor from "../assest/Deals & Offers/Homedecor.jpg";
import Oil from "../assest/Deals & Offers/Oil.jpg";
import Personal from "../assest/Deals & Offers/Personal Care.jpg";
import Electronics from "../assest/Deals & Offers/Wearables.jpg";
import Softdrink from "../assest/Deals & Offers/Softdrink.jpg";
import Deals from "../assest/Deals & Offers/Deal.png";

// List of card data
const cardData = [
  {
    title: "Baby Care Deals",
    offer: "From ₹299",
    imgSrc: babycare,
    discount: "Up to 80% Off",
    link: "/product-category?subcategory=mom,%20baby%20care",
  },
  {
    title: "Earbuds & More",
    offer: "From ₹999",
    imgSrc: Earbuds,
    discount: "Up to 75% Off",
    link: "/product-category?subcategory=airpods",
  },
  {
    title: "Fashion Deals",
    offer: "Up to 75% Off",
    imgSrc: Fashion,
    discount: "Up to 75% Off",
    link: "/product-category?category=beauty",
  },
  {
    title: "Gifting Store",
    offer: "Up to 80% Off",
    imgSrc: Gifting,
    discount: "Up to 80% Off",
    link: "/product-category?category=gifts,%20hampers",
  },
  {
    title: "Kitchen Items",
    offer: "Up to 80% Off",
    imgSrc: Kitchen,
    discount: "Up to 80% Off",
    link: "/product-category?category=kitchenware",
  },
  {
    title: "Home Decor Deals",
    offer: "From ₹99",
    imgSrc: Homedecor,
    discount: "Up to 60% Off",
    link: "/product-category?category=kitchenware",
  },
  {
    title: "Oil & Ghee",
    offer: "Under ₹299",
    imgSrc: Oil,
    discount: "Up to 50% Off",
    link: "/product-category?category=groceries",
  },
  {
    title: "Personal Care",
    offer: "From ₹99",
    imgSrc: Personal,
    discount: "Up to 70% Off",
    link: "/product-category?category=personal%20care",
  },
  {
    title: "Wearable Deals",
    offer: "From ₹1299",
    imgSrc: Electronics,
    discount: "Up to 50% Off",
    link: "/product-category?category=electronics",
  },
  {
    title: "Snacks & Cold Drinks",
    offer: "From ₹20",
    imgSrc: Softdrink,
    discount: "Up to 40% Off",
    link: "/product-category?subcategory=biscuits,%20drinks",
  },
];

// Card component
const Card = ({ title, offer, imgSrc, discount, link }) => {
  return (
    <a href={link} className="block">
      <div className="bg-gradient-to-br from-sky-700 to-sky-500 rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full overflow-hidden mb-3 sm:mb-4 border-4 border-white shadow-md">
          <img
            src={imgSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <h3 className="text-sm sm:text-base font-bold text-white mb-1 truncate">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-white opacity-90">{offer}</p>
        <p className="mt-2 px-3 py-1 bg-white text-sky-700 font-bold text-xs sm:text-sm rounded-full shadow-lg">
          {discount}
        </p>
      </div>
    </a>
  );
};

// Main component
const CardPage = () => {
  return (
    <div className="w-full mt-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-2 justify-center mb-4">
          <img src={Deals} alt="Groceries Icon" className="w-12 h-12" />
          <h2 className="font-bold text-sky-800 text-lg sm:text-2xl">
            BEST DEALS & OFFERS
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
          {cardData.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              offer={card.offer}
              imgSrc={card.imgSrc}
              discount={card.discount}
              link={card.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardPage;
