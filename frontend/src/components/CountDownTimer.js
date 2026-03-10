import React,{useEffect,useState} from 'react'
import SummaryApi from '../common';
import { getRemainingTime } from '../helpers/convertTime';
const CountDownTimer = () => {
  const [createdAt, setCreatedAt] = useState(null);
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    const fetchOrder=async()=>{
    try {
    const dataResponse = await fetch(SummaryApi.getLastestOrder.url, {
      method: SummaryApi.getLastestOrder.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });
    const dataApi = await dataResponse.json();
    console.log(dataApi.data);
        
    if (dataApi.success && dataApi.data) {
      setCreatedAt(dataApi.data.orderDate);
      setRemainingMs(getRemainingTime(dataApi.data.orderDate));
    }
    } catch (error) {
        console.log(error)
    }
}
fetchOrder()
  }, []);

  useEffect(() => {
    if (!createdAt || remainingMs <= 0) return;
    const interval = setInterval(() => {
      setRemainingMs(getRemainingTime(createdAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [createdAt, remainingMs]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };
//   if (!createdAt) return <div>Đang tải...</div>;
   return (<>
   {!createdAt&&"Đang tải"}
    {remainingMs<=0 ?"Đã hết thời gian chỉnh sửa" :<div>Thời gian sửa còn lại: {formatTime(remainingMs)}</div>}
    
    </>);

 
}

export default CountDownTimer