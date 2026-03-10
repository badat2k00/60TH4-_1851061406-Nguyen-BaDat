import SummaryApi from "../common";
// const productCategory = [
//     { id : 1, label : "Phân bón", value : "Phân bón",c:"1"},
//     { id : 2, label : "Hạt giống", value : "Hạt giống",c:"1"},
//     { id : 3, label : "Thuốc bảo vệ thực vật", value : "Thuốc bảo vệ thực vật",c:"1"},
//     { id : 4, label : "Dụng cụ làm vườn", value : "Dụng cụ làm vườn",c:"1"},
//     { id : 5, label : "Khay chậu", value : "Khay chậu",c:"1"},
//     { id : 6, label : "Cây giống", value : "Cây giống",c:"1"},
//     { id : 7, label : "Hệ thống tưới", value : "Hệ thống tưới",c:"1"},
//     { id : 8, label : "Giá thể", value : "Giá thể",c:"1"},
//     { id : 9, label : "Đất trồng", value : "Đất trồng",c:"1"},
//     { id : 10, label : "Chế phẩm sinh học", value : "Chế phẩm sinh học",c:"1"}
// // ]
// export default productCategory

const productCategory=async()=>{
    try{
    const response = await fetch(SummaryApi.getAllCategory.url, {
        method: SummaryApi.getAllCategory.method,
        credentials: "include",
      });
  
      const dataResponse = await response.json();
  
      if (dataResponse.success) {
        console.log(dataResponse.data)
        return dataResponse.data;
      } else {
        throw new Error(dataResponse.message);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
}
export default productCategory


