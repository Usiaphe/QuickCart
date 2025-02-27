'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";  // ✅ Import this

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
};

export const AppContextProvider = (props) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY;
    const router = useRouter();

    const { user } = useUser(); // Now it won't be undefined

    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(false);
    const [isSeller, setIsSeller] = useState(true);
    const [cartItems, setCartItems] = useState({});

    const fetchProductData = async () => {
        setProducts(productsDummyData);
    };

    const fetchUserData = async () => {
        setUserData(userDummyData);
    };

    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = (cartData[itemId] || 0) + 1;
        setCartItems(cartData);
    };

    const updateCartQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData);
    };

    const getCartCount = () => {
        return Object.values(cartItems).reduce((sum, count) => sum + count, 0);
    };

    const getCartAmount = () => {
        return Math.floor(
            Object.entries(cartItems).reduce((sum, [id, qty]) => {
                let itemInfo = products.find((p) => p._id === id);
                return itemInfo ? sum + itemInfo.offerPrice * qty : sum;
            }, 0) * 100
        ) / 100;
    };

    useEffect(() => {
        fetchProductData();
    }, []);

    useEffect(() => {
        fetchUserData();
    }, []);

    const value = {
        user,
        currency,
        router,
        isSeller,
        setIsSeller,
        userData,
        fetchUserData,
        products,
        fetchProductData,
        cartItems,
        setCartItems,
        addToCart,
        updateCartQuantity,
        getCartCount,
        getCartAmount
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
