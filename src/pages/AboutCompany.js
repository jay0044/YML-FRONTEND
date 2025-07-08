import React from "react";
// import gif from "../../src/assest/a.gif"
const AboutCompany = () => {
  return (
    <div>
      <section className="text-gray-700 body-font overflow-hidden">
        <div className="container px-5 py-12 mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h4 className="tracking-widest text-sky-700 uppercase font-semibold text-lg">
              Want to know about us?
            </h4>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              About YML
            </h1>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">
            {/* Image */}
            <div>
              <img
                src="/about.svg"
                alt="About us illustration"
                className="w-full h-64 md:h-[500px] lg:h-[600px] rounded-md"
              />
            </div>

            {/* Content */}
            <div>
              <div className="text-center lg:text-left">
                <h3 className="text-sm tracking-widest text-sky-700 uppercase font-semibold">
                  Your E-Commerce Partner
                </h3>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
                  YAHSHUA MARKETING LIMITED
                </h2>

                {/* Ratings */}
                <div className="flex items-center justify-center lg:justify-start mb-4">
                  {[...Array(4)].map((_, index) => (
                    <svg
                      key={index}
                      fill="currentColor"
                      className="w-5 h-5 text-sky-700"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <svg
                    fill="none"
                    stroke="currentColor"
                    className="w-5 h-5 text-sky-700"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="ml-3 text-gray-600 text-sm">4 Reviews</span>
                </div>

                {/* Social Icons */}
                <div className="flex justify-center lg:justify-start space-x-4 mb-6">
                  {["facebook", "twitter", "message-circle"].map(
                    (icon, idx) => (
                      <a
                        key={idx}
                        href="#"
                        className="text-gray-500 hover:text-sky-700"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          {icon === "facebook" && (
                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                          )}
                          {icon === "twitter" && (
                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                          )}
                          {icon === "message-circle" && (
                            <path d="M21 11.5a8.5 8.5 0 01-8.5 8.5h-.5a8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 018.6-12.8A8.48 8.48 0 0121 11.5z" />
                          )}
                        </svg>
                      </a>
                    )
                  )}
                </div>

                {/* Description */}
                <p className="leading-relaxed text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
                  At <strong>YML Mart</strong>, our mission is to redefine your
                  online shopping experience by offering a wide range of
                  high-quality products at unbeatable prices. As a newly
                  launched e-commerce platform, we're committed to bringing you
                  the latest trends and essentials across categories like
                  electronics, fashion, home goods, and more. Our user-friendly
                  site, fast delivery, and dedicated support team ensure your
                  shopping journey is smooth and satisfying.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutCompany;
