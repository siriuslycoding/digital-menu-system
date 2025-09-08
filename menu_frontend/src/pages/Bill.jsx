import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
// import backIcon from '../assets/arrow-left.png';
import { Menu, X } from 'lucide-react'; // for hamburger & close icons


const Bill = () => {
  const [clicked, setClicked] = useState(false);
  const [billData, setBillData] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // for hamburger toggle


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
      <div className="TopNavbar relative flex items-center justify-center px-3 bg-[#703f28] shadow-md">
  {/* Title centered */}
  <h2 className="text-lg font-bold text-white relative top-3.5">Your Cart</h2>

  {/* Hamburger absolutely positioned on right */}
  <button
    className="absolute right-3 md:hidden p-2 rounded-lg hover:bg-amber-700"
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  >
    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
  </button>
</div>



      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-2 bg-[#5a3221] p-3 rounded-lg shadow-lg">
          <button
            onClick={() => {
              navigate('/');
              setMobileMenuOpen(false);
            }}
            className="w-full px-4 py-2 bg-white text-amber-800 border-2 border-amber-500 font-semibold rounded-xl shadow hover:bg-amber-100 transition"
          >
            Menu
          </button>
        </div>
      )}

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