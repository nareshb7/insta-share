import React from "react"
import { ButtonProps } from "./StyleModels"
import './styles.scss'



export const Button =({text, className= 'btn', onClick, ...rest}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>)=> {
    return <button {...rest} onClick={onClick} className={`btnC ${className}`}>{text}</button>
}