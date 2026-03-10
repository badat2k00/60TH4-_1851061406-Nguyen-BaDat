const splitAddress=(data)=>{
    if(data){
    let ArrayAddress=data.split(",")
    return ArrayAddress;
    }else{
        return ""
    }
}
export default splitAddress