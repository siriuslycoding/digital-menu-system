import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'

// const data = [
//     { name: "Tea", qty: 1, price: 20 },
//     { name: "Coffee", qty: 2, price: 50 },
//     { name: "Cake", qty: 1, price: 30 },
//     { name: "Tea", qty: 1, price: 20 },
//     { name: "Coffee", qty: 2, price: 50 },
//     { name: "Cake", qty: 1, price: 30 },
//     { name: "Tea", qty: 1, price: 20 },
//     { name: "Coffee", qty: 2, price: 50 },
//     { name: "Cake", qty: 1, price: 30 }
// ];


const Bill = () => {
    const [clicked, setClicked] = useState(false);
    const handleClick = () => setClicked(true);

    const navigate = useNavigate();

    const [yes, setYes] = useState(false);
    const [no, setNo] = useState(false);

    const [billData, setBillData] = useState([])
    const [menuData, setMenuData] = useState([])
    const [cartData, setCartData] = useState([])

    const handleYes = () => {
        setYes(true);
        navigate('/done')
    }
    const handleNo = () => {
        setNo(true);
        navigate('/bill')
        setClicked(false)
    }

    useEffect(() => {
        fetch('http://localhost:4000/api/bill')
            .then(res => res.json())
            .then(data => {
                console.log('Fetched bill:', data);
                setBillData(data)
            })

            .catch(err => console.log("Failed to fetch bill data:", err));
    }, []);

    useEffect(() => {
        fetch('http://localhost:4000/api/menu')
            .then(res => res.json())
            .then(data => {
                console.log('Fetched menu:', data);
                setMenuData(data)
            })

            .catch(err => console.log("Failed to fetch menu data:", err));
    }, []);

    useEffect(() => {
        fetch('http://localhost:4000/api/cart')
            .then(res => res.json())
            .then(data => {
                console.log('Fetched cart:', data);
                setCartData(data)
            })

            .catch(err => console.log("Failed to fetch cart data:", err));
    }, []);

    const total = billData.reduce((sum, item) => sum + item.qty * item.price, 0);
    console.log("Cart Data:", cartData);
    console.log("Menu Data:", menuData);
    console.log("Bill Data:", billData);

    return (
        <>
            <div className="Payment">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Qty</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.name}</td>
                                <td>{data.qty}</td>
                                <td>{data.qty * data.price}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="2" style={{ fontWeight: "bold", textAlign: "right" }}>
                                Total
                            </td>
                            <td style={{ fontWeight: "bold" }}>{total}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="pay-container">
                <button onClick={handleClick} className="pay-button">Pay</button>
            </div>

            {clicked && (
                <div className="confirm-blur">
                    <div className="confirm-box">
                        <div style={{ textAlign: "center", color: "white", marginTop: "1rem" }}>
                            <p className="text-lg font-semibold mb-4 text-orange-900">Confirm Payment?</p>
                            <button onClick={handleYes} className="confirm-button">Yes</button>
                            <button onClick={handleNo} className="confirm-button">No</button>
                        </div>
                    </div>
                </div>
            )}


        </>
    );
};

export default Bill;
