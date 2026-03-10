const url = "http://localhost:8080/api/provinces";

async function getAllProvince() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const text = await response.json();
    let provinces = text.results.map(({ province_id, province_name }) => ({
      province_id,
      province_name,
    }));
    return provinces;
  } catch (error) {
    console.error("Failed to fetch provinces:", error);
    throw error;
  }
}

export default getAllProvince;

// const url=`https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1`;

// async function getAllProvince() {
//   try{
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }
//     const text = await response.json();
//     const dataArray = text.data?.data ?? [];

//     // Sử dụng `map` để trả về danh sách đã xử lý
//     const provinces = dataArray.map(({ code, name_with_type }) => ({
//       code,
//       name_with_type,
//     }));
//         // console.log(provinces);
//  return provinces
//       }catch(err){
//         console.error("Error fetching provinces:", err); // Xử lý lỗi
//         return [];
//       }

// }

// export default getAllProvince;

// async function getAllProvince() {
//   // let attempt = 0;

//   // while (attempt < retries) {
//     try {
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const text = await response.json();
//       const dataArray = text.data?.data ?? [];
//       const provinces = dataArray.map(({ province_id, province_name }) => ({
//         province_id,
//         province_name,
//       }));

//       return provinces; // Thành công
//     } catch (err) {
//       console.error(`Lần thử $attempt + 1} thất bại:`, err);
//       // attempt++;
//       // if (attempt >= retries) {
//       //   console.error("Thử lại thất bại toàn bộ.");
//       //   return []; // Trả về mảng rỗng nếu thất bại
//       // }
//       // await new Promise((resolve) => setTimeout(resolve, delay)); // Chờ một thời gian trước khi thử lại
//     }
//   // }
// }
