import SummaryApi from "../common"
import { toast } from 'react-toastify'



// import viMessages from '../locales/vi.json';
// import enMessages from '../locales/en.json';

// Hàm để lấy thông điệp đã dịch
// const getLocalizedMessage = (messageKey, language) => {
//   const messages = language === 'vi' ? viMessages : enMessages;
//   return messages[messageKey] || messageKey;
// };
const addToCart = async(e,id,message) =>{
    // let lng = "vi"
    e?.stopPropagation()
    e?.preventDefault()
    
    const response = await fetch(SummaryApi.addToCartProduct.url,{
        method : SummaryApi.addToCartProduct.method,
        credentials : 'include',
        headers : {
            "content-type" : 'application/json'
        },
        body : JSON.stringify(
            { productId : id }
        )
    })

    const responseData = await response.json()


    if(responseData.success){
        // toast.success(getLocalizedMessage(responseData.message, lng));
        console.log(responseData.data2)
    }

    if(responseData.error&&message===true){
        toast.error((responseData.message))
    }

    if(responseData.error&&message===false){
        // toast.error((responseData.message))
   
    }

    return responseData  

}


export default addToCart