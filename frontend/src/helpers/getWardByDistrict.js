

const url = "http://localhost:8080/api//wardbydistrict";
async function getWardByDistrict(districtid){
    let response=await fetch(`${url}/${districtid}`)
    const text = await response.json();
    if (!text || !text.data) {
      console.error('Invalid response format:', text);
      return []; 
  }
    let wards = [];
    text.data.forEach((ward) => {
      const { ward_id, ward_name} = ward;
      let payload = { ward_id, ward_name  };
      // console.log(payload);
      wards.push(payload);
    });
    return wards;
}
export default getWardByDistrict;
