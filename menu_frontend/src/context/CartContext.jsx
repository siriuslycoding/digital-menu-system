import { useContext, useEffect, useState, createContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            const res = await fetch('/api/bill');
            const data = await res.json();
            setCart(data);
        };
        fetchCart();
    }, []);

    const addToCart = async (item) => {
        const res = await fetch('/api/bill', {
            method: 'POST',
            body: JSON.stringify({ ...item, qty: 1 }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setCart(prev => [...prev, data]);
        console.log(cart);
    };

    const updateQty = async (id, newQty) => {
        const res = await fetch(`/api/bill/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ qty: newQty }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setCart(prev => prev.map(item => item._id === id ? data : item));
    };

    const deleteFromCart = async (id) => {
        await fetch(`/api/bill/${id}`, { method: 'DELETE' });
        setCart(prev => prev.filter(item => item._id !== id));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQty, deleteFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);