import React from 'react';
import logo from '../assets/logo.png';
import '../index.css'

const Header = () => {
    return (
        <header className="flex items-center justify-between bg-[#703f28] px-3 py-3">
            <div className="flex items-center gap-4">
                <img
                    src={logo}
                    alt="Logo"
                    className="w-16 h-16 rounded-full shadow-md hover:scale-105 transition-transform duration-200"
                />
                <h1 className="text-3xl font-bold lobster-regular drop-shadow-md text-white">
                    Digital Menu
                </h1>

            </div>

            <nav className="hidden md:flex gap-6">
                <a href="#menu" className="text-white text-lg font-medium hover:text-[#f5e3c1] transition duration-150">Menu</a>
                <a href="#about" className="text-white text-lg font-medium hover:text-[#f5e3c1] transition duration-150">About</a>
                <a href="#contact" className="text-white text-lg font-medium hover:text-[#f5e3c1] transition duration-150">Contact</a>
            </nav>
        </header>
    );
};

export default Header;
