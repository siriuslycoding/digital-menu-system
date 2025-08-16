import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
// import backIcon from '../assets/arrow-left.png';

const Bill = () => {
  const [clicked, setClicked] = useState(false);
  const [billData, setBillData] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();

  const handleClick = () => setClicked(true);

  const handleYes = () => {
    navigate('/done');
  };

  const handleNo = () => {
    setClicked(false);
  };

  useEffect(() => {
    fetch('http://localhost:4000/api/bill')
      .then(res => res.json())
      .then(data => setBillData(data))
       .then(() => {
                setRefresh(prev => !prev);  //Trigger refresh
            })
      .catch(err => console.log("Failed to fetch bill data:", err));
  }, [refresh]);

  useEffect(() => {
    fetch('http://localhost:4000/api/menu')
      .then(res => res.json())
      .then(data => setMenuData(data))
      .catch(err => console.log("Failed to fetch menu data:", err));
  }, [refresh]);

  useEffect(() => {
    fetch('http://localhost:4000/api/cart')
      .then(res => res.json())
      .then(data => setCartData(data))
      .catch(err => console.log("Failed to fetch cart data:", err));
  }, [refresh]);

  const total = billData.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <div>
      <div className="TopNavbar">
        {/* <img src={backIcon} alt="Back" className="backIcon" /> */}
        <h2>Your Cart</h2>
      </div>

      <div className="cartPage">
        <div className="cartItemsContainer">
          {billData.map((item, index) => (
            <div className="cartItem" key={index}>
              <h4>{item.name}</h4>
              <p>Qty: {item.qty}</p>
              <p>Price: ₹{item.price}</p>
              <p>Total: ₹{item.qty * item.price}</p>
            </div>
          ))}
          <div className="totalAmount">
            Total Amount: ₹{total}
          </div>
        </div>

        <div className="pay-container">
          <button onClick={handleClick} className="pay-button">Pay</button>
        </div>

        {clicked && (
          <div className="confirm-blur">
            <div className="confirm-box">
              <p className="coffee-heading">Confirm Payment?</p>
              <button onClick={handleYes} className="confirm-button">Yes</button>
              <button onClick={handleNo} className="confirm-button">No</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bill;