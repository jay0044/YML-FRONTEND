import React from "react";
import CategoryList from "../components/CategoryList";
import BannerProduct from "../components/BannerProduct";
import HorizontalCardProduct from "../components/HorizontalCardProduct";
import VerticalCardProduct from "../components/VerticalCardProduct";
import AdBanner from "../components/AdBannerProduct";
import GroceryCart from "../components/GroceryCard";
import Offer from "../components/Offer";
import { Link } from "react-router-dom";
import SaleBanner from "../components/Time";
import CardPage from "../components/Cards";
import Column from "../components/ColoumnCategory";
import Beauty from "../assest/CategoryImgs/Beauty.png";
import Stationary from "../assest/CategoryImgs/Stationary.png";
import PersonalCare from "../assest/CategoryImgs/Personal Care.png";
import HomeDecor from "../assest/CategoryImgs/Home Decor.png";
import Footer from "../components/Footer";
import SaleHighlight from "../components/SaleHighlight";
import CardPageNew from "../components/CardsNew";

const Home = () => {
  return (
    <>
      <div className="px-6 flex justify-center items-center flex-col pb-10">
        <SaleHighlight /> {/* 🔥 Add here just after header */}
        <CategoryList />
        <BannerProduct />
        <Link
          to={
            "/product-category?category=groceries&category=kitchenware&category=toys,%20games&category=beauty&category=stationary&category=electronics&category=home%20decor&category=personal%20care&category=gifts,%20hampers&category=fashion"
          }
        >
          <AdBanner />
        </Link>
        <CardPageNew />
        <GroceryCart
          category={"groceries"}
          heading={"Top Picks in Groceries"}
        />
        {/* <Offer /> */}
        <CardPage />
        {/* You can reuse this pattern for more GroceryCart components */}
        {/* <GroceryCart category={"medicines"} heading={"Essential Medicines"} />
  <GroceryCart category={"fruits"} heading={"Fresh Fruits & Vegetables"} /> */}
        <Column
          category={"beauty"}
          heading={"Trending Beauty Essentials"}
          image={Beauty}
        />
        <Column
          category={"stationary"}
          heading={"Smart Stationery Supplies"}
          image={Stationary}
        />
        <Column
          category={"personal care"}
          heading={"Everyday Personal Care"}
          image={PersonalCare}
        />
        <Column
          category={"home decor"}
          heading={"Stylish Home Decor"}
          image={HomeDecor}
        />
      </div>
      <Footer />
    </>
  );
};

export default Home;
