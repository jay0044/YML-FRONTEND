import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productCategory from "../helpers/productCategory"; // Ensure this file exports the category data structure
import VerticalCard from "../components/VerticalCard"; // Ensure this is your product display component
import Loader from "../components/Loader"; // Ensure this is your loading component
import SummaryApi from "../common"; // Ensure this is your API configuration
import { FaTimes, FaBars, FaSortAmountUp } from "react-icons/fa"; // For sidebar toggle icons
import { MdCategory } from "react-icons/md";
import Footer from "../components/Footer"; // Ensure this is your footer component

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Sidebar visible by default
  const [selectCategory, setSelectCategory] = useState({});
  const [selectSubcategory, setSelectSubcategory] = useState({});
  const [filterCategoryList, setFilterCategoryList] = useState([]);
  const [filterSubcategoryList, setFilterSubcategoryList] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const prevSearchRef = useRef("");

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListinArray = urlSearch.getAll("category");
  const urlSubcategoryListinArray = urlSearch.getAll("subcategory");

  // Sync state with URL parameters and open sidebar by default
  useEffect(() => {
    const urlCategoryListObject = {};
    const urlSubcategoryListObject = {};

    urlCategoryListinArray.forEach((el) => {
      urlCategoryListObject[el] = true;
    });

    urlSubcategoryListinArray.forEach((el) => {
      urlSubcategoryListObject[el] = true;
    });

    setSelectCategory(urlCategoryListObject);
    setSelectSubcategory(urlSubcategoryListObject);
    setIsSidebarVisible(true); // Open sidebar when the page loads
  }, [location.search]);

  // Fetch data based on filters
  const fetchData = async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.filterProduct.url, {
      method: SummaryApi.filterProduct.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: filterCategoryList,
        subcategory: filterSubcategoryList,
        sortBy: sortBy,
      }),
    });

    const dataResponse = await response.json();
    setData(dataResponse?.data || []);
    setLoading(false);
  };

  // Update filter lists and manage URL
  useEffect(() => {
    const arrayOfCategory = Object.keys(selectCategory).filter(
      (key) => selectCategory[key]
    );
    const arrayOfSubcategory = Object.keys(selectSubcategory).filter(
      (key) => selectSubcategory[key]
    );

    if (
      JSON.stringify(arrayOfCategory) !== JSON.stringify(filterCategoryList)
    ) {
      setFilterCategoryList(arrayOfCategory);
    }

    if (
      JSON.stringify(arrayOfSubcategory) !==
      JSON.stringify(filterSubcategoryList)
    ) {
      setFilterSubcategoryList(arrayOfSubcategory);
    }

    const newSearch = [
      ...arrayOfCategory.map((el) => `category=${el}`),
      ...arrayOfSubcategory.map((el) => `subcategory=${el}`),
    ].join("&");

    if (newSearch !== prevSearchRef.current) {
      navigate("/product-category?" + newSearch);
      prevSearchRef.current = newSearch;
    }
  }, [
    selectCategory,
    selectSubcategory,
    filterCategoryList,
    filterSubcategoryList,
    navigate,
  ]);

  // Fetch data when filters change
  useEffect(() => {
    if (filterCategoryList.length > 0 || filterSubcategoryList.length > 0) {
      fetchData();
    }
  }, [filterCategoryList, filterSubcategoryList, sortBy]);

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    setSelectCategory((prev) => ({
      ...prev,
      [value]: checked,
    }));

    // Deselect all subcategories if the category is unchecked
    if (!checked) {
      const category = productCategory.find((cat) => cat.value === value);
      category.subcategories.forEach((sub) => {
        setSelectSubcategory((prev) => ({
          ...prev,
          [sub.value]: false,
        }));
      });
    }
  };

  const handleSelectSubcategory = (e) => {
    const { value, checked } = e.target;

    // Deselect all other subcategories before selecting the new one
    setSelectSubcategory({
      [value]: checked, // Only one subcategory can be selected at a time
    });

    const parentCategory = productCategory.find((category) =>
      category.subcategories.some((subcat) => subcat.value === value)
    );

    if (parentCategory) {
      setSelectCategory((prev) => ({
        ...prev,
        [parentCategory.value]: true, // Ensure parent category is selected
      }));
    }
  };

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target;
    setSortBy(value);
  };

  return (
    <>
      <div className="container mx-auto py-6 relative">
        <div className="lg:grid grid-cols-[240px_1fr] gap-6">
          {/* Sidebar */}
          <div
            className={`bg-gradient-to-br from-sky-700 to-sky-500 p-4 shadow border border-slate-200 rounded-xl min-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 ${
              isSidebarVisible ? "block" : "hidden"
            } lg:block`}
          >
            {/* Sort By Section */}
            <div className="mb-6">
              <h3 className="text-sm uppercase font-bold text-white tracking-wide border-b pb-2 border-white mb-2 flex items-center gap-2">
                <FaSortAmountUp />
                Sort by
              </h3>

              <form className="text-sm flex flex-col gap-2 text-white">
                {[
                  { label: "Price - Low to High", value: "asc" },
                  { label: "Price - High to Low", value: "dsc" },
                  { label: "Popularity", value: "popularity" },
                ].map((option, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 p-1 rounded cursor-pointer font-semibold
                  ${
                    sortBy === option.value
                      ? "bg-white text-sky-700"
                      : "hover:bg-slate-100 hover:text-sky-700"
                  }
                `}
                  >
                    <input
                      type="radio"
                      name="sortBy"
                      checked={sortBy === option.value}
                      onChange={handleOnChangeSortBy}
                      value={option.value}
                      className="accent-green-700"
                      id={`sort-${option.value}`}
                    />
                    <label
                      htmlFor={`sort-${option.value}`}
                      className="cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </form>
            </div>

            {/* Category Section */}
            <div>
              <h3 className="text-sm uppercase font-bold text-white tracking-wide border-b pb-2 border-white mb-2 flex items-center gap-2">
                <MdCategory />
                Category
              </h3>
              <form className="text-sm flex flex-col gap-2 text-white">
                {productCategory.map((category, index) => (
                  <div key={index}>
                    {/* Category */}
                    <div
                      className={`flex items-center gap-2 p-1 rounded cursor-pointer font-semibold 
                    ${
                      selectCategory[category.value]
                        ? "bg-white text-sky-700"
                        : "hover:bg-slate-100 hover:text-sky-700"
                    }
                  `}
                    >
                      <input
                        type="checkbox"
                        name="category"
                        checked={selectCategory[category.value] || false}
                        value={category.value}
                        id={category.value}
                        onChange={handleSelectCategory}
                        className="accent-green-700"
                      />
                      <label
                        htmlFor={category.value}
                        className="cursor-pointer"
                      >
                        {category.label}
                      </label>
                    </div>

                    {/* Subcategories */}
                    {(selectCategory[category.value] ||
                      Object.keys(selectSubcategory).some((sub) =>
                        category.subcategories.some((s) => s.value === sub)
                      )) &&
                      category.subcategories?.map((subcategory, subIndex) => (
                        <div className="ml-5" key={subIndex}>
                          <div
                            className={`flex items-center gap-2 p-1 rounded cursor-pointer font-medium
                            ${
                              selectSubcategory[subcategory.value]
                                ? "bg-white text-sky-700"
                                : ""
                            }
                          `}
                          >
                            <input
                              type="checkbox"
                              name="subcategory"
                              checked={
                                selectSubcategory[subcategory.value] || false
                              }
                              value={subcategory.value}
                              id={subcategory.value}
                              onChange={handleSelectSubcategory}
                              className="accent-green-700"
                            />
                            <label
                              htmlFor={subcategory.value}
                              className="cursor-pointer"
                            >
                              {subcategory.label}
                            </label>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </form>
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-4 lg:mt-0 px-0 lg:px-5">
            <p className="font-semibold text-gray-700 text-base mb-4">
              Showing{" "}
              <span className="inline-block text-sm font-bold text-white bg-sky-700 px-2 py-1 rounded-full align-middle">
                {data.length}
              </span>{" "}
              Results :
            </p>

            <div className="h-full">
              {loading ? (
                <Loader />
              ) : (
                data.length > 0 && (
                  <VerticalCard data={data} loading={loading} />
                )
              )}
            </div>
          </div>
        </div>

        {/* Mobile Toggle Sidebar Button */}
        <button
          onClick={toggleSidebar}
          className="fixed mt-14 top-4 right-4 z-50 bg-sky-600 hover:bg-sky-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 lg:hidden"
          aria-label="Toggle Sidebar"
        >
          {isSidebarVisible ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>
      <Footer />
    </>
  );
};

export default CategoryProduct;
