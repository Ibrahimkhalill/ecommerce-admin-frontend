import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./Home.css";
function Home() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}/admin-panel/api/get/sales-summary/`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        const result = await response.json();
        setData(result);
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAllData();
  }, []);

  return (
    <div>
      <Sidebar pageName="Home" />
      <div className="container py-5">
        <div className="d-flex flex-wrap gap-5 ">
          <div className="box item-1">
            <img
              src="https://i.pinimg.com/originals/a3/6b/42/a36b422bb2bebcbd77bba846b83ddf5d.png"
              alt=""
            />
            <h5>Available Product ({data.available_product})</h5>
          </div>
          <div className="box item-2">
            {" "}
            <img
              src="https://cdn-icons-png.flaticon.com/512/4715/4715149.png"
              alt=""
            />
            <h5>Today Order ({data.today_orders})</h5>
          </div>
          <div className="box item-4">
            <img
              src="https://cdn.iconscout.com/icon/free/png-256/free-sell-stock-icon-download-in-svg-png-gif-file-formats--stocks-forex-market-trading-pack-business-icons-1715904.png"
              alt=""
            />
            <h5>Today Sell ({data.today_sales})</h5>
          </div>
          <div className="box item-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/8070/8070604.png"
              alt=""
            />
            <h5> Total Sell ({data.total_sales})</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
