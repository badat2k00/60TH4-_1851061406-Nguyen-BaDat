

import SummaryApi from "../common";

const countProductsBuy = async () => {
  try {
    const response = await fetch(SummaryApi.countProductsBuy.url, {
      method: SummaryApi.countProductsBuy.method,
      credentials: "include",
    });

    const dataResponse = await response.json();

    if (dataResponse.success) {
      return dataResponse.data;
    } else {
      throw new Error(dataResponse.message);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export default countProductsBuy;
