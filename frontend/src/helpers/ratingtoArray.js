function ratingtoArray(rating){
    let a=[];
    for(let i=0;i<5;i++){
        if(rating>1){
        a.push(1);
        rating-=1
        }else{
          a.push(rating);
          rating=0
    }
    }
    return a
}
export default ratingtoArray;