
const url = "http://localhost:8080/api/districtbyprovince";
async function getDistrictByProvince(provinceId){
  try {
    let response=await fetch(`${url}/${provinceId}`)
    const text = await response.json();
    // if (!text || !text.data) {
    //   console.error('Invalid response format:', text);
    //   return [];
    // }
    let districts = [];
    text.data.forEach((district) => {
      const { district_id, district_name  } = district;
      let payload = { district_id, district_name  };
      // console.log(payload);
      districts.push(payload);
    });
    return districts;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}
export default getDistrictByProvince;
