import toast from "react-hot-toast";
import SummaryApi from "../common";

const AddToCart = async (e, id, authToken) => {
  try {
    // Prevent navigation if event exists
    e?.stopPropagation?.();
    e?.preventDefault?.();

    const response = await fetch(SummaryApi.addToCartProduct.url, {
      method: SummaryApi.addToCartProduct.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ productId: id }),
    });

    const responseData = await response.json();

    if (response.ok && responseData.success) {
      toast.success(responseData.message || "Added to cart successfully");
    } else if (responseData.error || !response.ok) {
      toast.error(responseData.message || "Failed to add to cart");
    }

    return responseData;
  } catch (error) {
    console.error("AddToCart Error:", error);
    toast.error("Something went wrong. Please try again.");
    return { error: true, message: error.message };
  }
};

export default AddToCart;
