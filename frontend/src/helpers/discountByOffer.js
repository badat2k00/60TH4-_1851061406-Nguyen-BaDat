const discountByOffer=(totalPrice,discountType,discountValue,maxDiscountMoney)=>{
    if(discountType==="percentage"){
    return maxDiscountMoney>(totalPrice*discountValue*0.01)?totalPrice*discountValue*0.01:0
    }else{
        return discountValue>totalPrice?0:discountValue
    }
}
export default discountByOffer
