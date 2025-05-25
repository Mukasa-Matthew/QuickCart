'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
// Assuming useUser comes from Clerk for authentication
import { useUser } from "@clerk/nextjs";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()

    // Destructure user from the useUser hook
    // This 'user' object will contain the authenticated user's details from Clerk
    const { user } = useUser();

    const [products, setProducts] = useState([])
    // userData should ideally be populated by the 'user' object from Clerk
    // For now, it's using dummy data as per your original code.
    const [userData, setUserData] = useState(false)
    // isSeller is currently hardcoded. In a real app, this would be determined
    // based on the user's roles or metadata from the 'user' object.
    const [isSeller, setIsSeller] = useState(true)
    const [cartItems, setCartItems] = useState({})

    // Function to fetch product data (currently using dummy data)
    const fetchProductData = async () => {
        setProducts(productsDummyData)
    }

    // Function to fetch user data (currently using dummy data)
    // You might want to update this to use the 'user' object from Clerk directly
    // e.g., setUserData(user);
    const fetchUserData = async () => {
        setUserData(userDummyData) // Still using dummy data as per original code
    }

    // Adds an item to the cart or increments its quantity
    const addToCart = async (itemId) => {
        // Create a deep clone of cartItems to ensure immutability
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
    }

    // Updates the quantity of an item in the cart
    const updateCartQuantity = async (itemId, quantity) => {
        // Create a deep clone of cartItems
        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId]; // Remove item if quantity is 0
        } else {
            cartData[itemId] = quantity; // Update quantity
        }
        setCartItems(cartData)
    }

    // Calculates the total number of items in the cart
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    // Calculates the total amount of items in the cart
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            // Find the product information based on itemId
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0 && itemInfo) { // Ensure itemInfo exists
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        // Return amount rounded to two decimal places
        return Math.floor(totalAmount * 100) / 100;
    }

    // Effect hook to fetch product data on component mount
    useEffect(() => {
        fetchProductData()
    }, []) // Empty dependency array means this runs once on mount

    // Effect hook to fetch user data on component mount
    // Consider adding 'user' to the dependency array if you want to update
    // userData when the Clerk 'user' object changes (e.g., after login/logout)
    useEffect(() => {
        fetchUserData()
    }, []) // Empty dependency array means this runs once on mount

    // Value object to be provided to consumers of the context
    const value = {
        user, // The Clerk user object
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
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
