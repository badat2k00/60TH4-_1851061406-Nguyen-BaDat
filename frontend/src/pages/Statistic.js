import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS
} from "chart.js/auto";
import { Bar} from "react-chartjs-2";
import countUsersSignUp from "../helpers/countUserSignUp";
import countOrdersPaid from "../helpers/countOrdersPaid";
import countProductsBuy from "../helpers/countProductsBuy";
import getTotalAmount from "../helpers/getTotalAmount";
import displayVNDCurrency from "../helpers/displayCurrency";
const options1 = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Thống kê doanh thu",
    },
  },
};

const options2 = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Thống kê người dùng",
    },
  },
};
const options3 = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Thống kê vật tư đã bán",
    },
  },
};
const options4 = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Thống kê số lượng đơn hàng",
    },
  },
};

// ChartJS.register(
//   CategoryScale,
//   BararScale,
//   PointElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

const Statistic = () => {
  const [value, setValue] = useState("Revenue");
  const [userCounts, setUserCounts] = useState(0);
  const [orderCounts, setOrderCounts] = useState(0);
  const [product, setProduct] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [chartData, setChartData] = useState({
    labels: ["Loading..."],
    datasets: [
      {
        label: "Data type",
        data: [0],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  });
  const [chartData1, setChartData1] = useState({
    labels: ["Loading..."],
    datasets: [
      {
        label: "Data type",
        data: [0],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  });
  const [chartData2, setChartData2] = useState({
    labels: ["Loading..."],
    datasets: [
      {
        label: "Data type",
        data: [0],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  });
  const [chartData3, setChartData3] = useState({
    labels: ["Loading..."],
    datasets: [
      {
        label: "Data type",
        data: [0],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  });

  useEffect(() => {
    // if (value === "User") {
    countUsersSignUp()
      .then((data) => {
        const labels = ["Users"];
        // setUserCounts(data)
        const usercounts = [data];
        setUserCounts(data);
        setChartData({
          labels: labels,
          datasets: [
            {
              label: "User Sign-Ups",
              data: usercounts,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setChartData1({
          labels: ["Error"],
          datasets: [
            {
              label: "User Sign-Ups",
              data: [0],
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        });
      });
    // }
    // if (value === "Orders Paid") {
    countOrdersPaid()
      .then((data) => {
        console.log(data);
        const labels = ["Orders Paid"];
        const orderPaidCounts = [data];
        setOrderCounts(data);
        setChartData1({
          labels: labels,
          datasets: [
            {
              label: "Order Paid",
              data: orderPaidCounts,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setChartData1({
          labels: ["Error"],
          datasets: [
            {
              label: "User Sign-Ups",
              data: [0],
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        });
      });
    // }

    countProductsBuy().then((data) => {
      const product=[data];
      setProduct(data)
      const labels=["Sold Product"]
      setChartData2({
        labels: labels,
        datasets: [
          {
            label: "Sold Product",
            data: product,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      });
    });
    getTotalAmount().then((data) => {const product=[data];
      setTotalAmount(data)
      const labels=["All Amount"]
      setChartData3({
        labels: labels,
        datasets: [
          {
            label: "All Amount",
            data: product,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      });});
  }, []);
  useEffect(() => {
    countUsersSignUp()
    .then((data) => {
      const labels = ["Users"];
      // setUserCounts(data)
      const usercounts = [data];
      setUserCounts(data);
      setChartData({
        labels: labels,
        datasets: [
          {
            label: "User Sign-Ups",
            data: usercounts,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.5)",
          },
        ],
      });
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      setChartData1({
        labels: ["Error"],
        datasets: [
          {
            label: "User Sign-Ups",
            data: [0],
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      });
    });
  // }
  // if (value === "Orders Paid") {
  countOrdersPaid()
    .then((data) => {
      console.log(data);
      const labels = ["Orders Paid"];
      const orderPaidCounts = [data];
      setOrderCounts(data);
      setChartData1({
        labels: labels,
        datasets: [
          {
            label: "Order Paid",
            data: orderPaidCounts,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "green",
          },
        ],
      });
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      setChartData1({
        labels: ["Error"],
        datasets: [
          {
            label: "User Sign-Ups",
            data: [0],
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "yellow",
          },
        ],
      });
    });
  // }

  countProductsBuy().then((data) => {
    const product=[data];
    setProduct(data)
    const labels=["Sold Product"]
    setChartData2({
      labels: labels,
      datasets: [
        {
          label: "Sold Product",
          data: product,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "red",
        },
      ],
    });
  });
  getTotalAmount().then((data) => {const product=[data];
    setTotalAmount(data)
    const labels=["All Amount"]
    setChartData3({
      labels: labels,
      datasets: [
        {
          label: "All Amount",
          data: product,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "blue",
        },
      ],
    });});
  
    return () => {
    
    }
  }, [])
  

  // const handleChange = (e) => {
  //   setValue(e.target.value);
  // };

  const displayModal=()=>{
    
  }
  return (
    <div>
      <div className="flex bg-red-400 gap-2 w-full h-1/5 justify-center items-center">
        <div className="w-full h-full bg-blue-400 text-center flex flex-col">
          <h2>Số người đăng ký</h2>
          <h1>{userCounts}</h1>
        </div>
        <div className="w-full h-full bg-blue-400 text-center">
          <h2>Số đơn hàng </h2>
          <h1>{orderCounts}</h1>
        </div>
        <div className="w-full h-full bg-blue-400 text-center">
          <h2>Vật tư đã bán</h2>
          <h1>{product}</h1>
        </div>
        <div className="w-full h-full bg-blue-400 text-center flex flex-col">
          <h2>Doanh thu</h2>
          <h1>{displayVNDCurrency(totalAmount)}</h1>
        </div>
      </div>
      {/* <select name="type" value={value} onChange={handleChange}>
        <option value="Revenue">Revenue</option>
        <option value="User">User</option>
        <option value="Orders Paid">Orders Paid</option>
      </select> */}
{/*
      <select className="bg-red-300 " onChange={displayModal}>
        <option value="">Khoảng thời gian </option>
        <option value="">Tháng</option>
        <option value="">Năm</option> 
      </select>
      */}


      <div className=" flex w-full flex-wrap">
        <div className=" w-1/2 h-1/5 gap-3 ">
          <Bar options={options4} data={chartData1} />
        </div>
        <div className="w-1/2 h-1/5 gap-3 ">
          <Bar options={options2} data={chartData} />
        </div>
        <div className=" w-1/2 h-1/5 gap-3 ">
          <Bar options={options3} data={chartData2} />
        </div>
        <div className=" w-1/2 h-1/5 gap-3 ">
          <Bar options={options1} data={chartData3} />
        </div>
      </div>

      
    </div>
  );
};

export default Statistic;

// Tổng chi /Tổng thu , Đơn hàng mới , Khách hàng đăng nhập ,10 mặt hàng bán chạy nhất
// Thống kê:
/* 
const totalProducts = array.reduce((sum, obj) => sum + obj.items.length, 0);
*/
