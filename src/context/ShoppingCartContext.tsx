import { ReactNode, createContext, useContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";



type ShoppingCartProviderProps = {
    children: ReactNode
}

type CartItem = {
    id: number
    quantity: number
}

type ShoppingCartContext = {
    openCart: () => void
    closeCart: () => void
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    decreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void
    cartQuantity: number
    cartItems: CartItem[]
}

const ShoppingCartContext = createContext({} as ShoppingCartContext)

export function useShoppingCart(){
    return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps){
    const [cartItem, setCartItem] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState<boolean>(false)
    function getItemQuantity(id: number){
        return cartItem.find(item => item.id === id)?.quantity || 0
    }
    function increaseCartQuantity(id: number){
        setCartItem(curItems => {
            if (curItems.find(item => item.id === id) == null){
                return [...curItems, {id, quantity: 1}]
            }else{
                return curItems.map(item => {
                    if (item.id === id){
                        return {...item, quantity: item.quantity + 1}
                    }else{
                        return item
                    }
                })
            }
        }) 
    }
    function decreaseCartQuantity(id: number){
        setCartItem(curItems => {
            if (curItems.find(item => item.id === id)?.quantity === 1){
                return curItems.filter(item => item.id !== id)
            }else{
                return curItems.map(item => {
                    if (item.id === id){
                        return {...item, quantity: item.quantity - 1}
                    }else{
                        return item
                    }
                })
            }
        }) 
    }

    function removeFromCart(id: number){
        setCartItem(curItems => {
            return curItems.filter(item => item.id !== id)
        })
    }

    const cartQuantity = cartItem.reduce((quantity, item) => item.quantity + quantity, 0) 

    function openCart(){
        setIsOpen(true)
    }
    function closeCart(){
        setIsOpen(false)
    }
    return <ShoppingCartContext.Provider value={{getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart, cartQuantity, openCart, closeCart, cartItem}}>
        {children}
        <ShoppingCart isOpen={isOpen}/>
    </ShoppingCartContext.Provider>
}