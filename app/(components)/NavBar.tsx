"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import AnimatedSvgLogo from './AnimatedSvgLogo'

const navItems = [
    { title: "About", href: "#about" },
    { title: "Experience", href: "#experience" },
    { title: "Work", href: "#work" },
    { title: "Contact", href: "#contact" },
]

function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className='flex justify-between w-full px-5 py-7 fixed top-0 z-1000 bg-background/5 backdrop-blur-lg'>
            <Link className='my-auto w-[100px] hoverEffect' href="/#main"><AnimatedSvgLogo/></Link>
            
            {/* Desktop Menu */}
            <div className='hidden md:flex gap-3 text-sm my-auto'>
                {navItems.map((item, index) => (
                    <Link key={item.href} href={item.href} className='p-2 hover:text-primary transition-color duration-300'>
                        <span className='text-primary mr-1 font-mono'>0{index+1}.</span>
                        {item.title}
                    </Link>
                ))}
                <div className='hoverEffect rounded-md'>
                    <Link target="_blank" href='/vivek chaturvedi resume.pdf'>
                        <button className="text-sm p-2 border border-buttonBorder text-primary rounded-md bg-background">
                            Resume
                        </button>
                    </Link>
                </div>
            </div>

            <button 
                className="md:hidden z-50 relative"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
            >
                <div className={`w-6 h-0.5 bg-primary transition-all duration-300 ${isMenuOpen ? 'rotate-[45deg] translate-y-1.5' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-primary my-1.5 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-primary transition-all duration-300 ${isMenuOpen ? '-rotate-[45deg] -translate-y-1.5' : ''}`}></div>
            </button>

            <div className={`
                fixed top-0 right-0 h-screen w-[60%] bg-background backdrop-blur-lg
                flex flex-col justify-center items-start
                transform transition-transform duration-300 ease-in-out
                
                md:hidden
                
                ${isMenuOpen ? 'translate-x-0 pl-10' : 'translate-x-full'}
            `}>
                <div className='flex flex-col items-start gap-8 text-lg'>
                    {navItems.map((item, index) => (
                        <Link 
                            key={item.href} 
                            href={item.href} 
                            className='p-2 hover:text-primary transition-color duration-300'
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <span className='text-primary mr-1 font-mono'>0{index+1}.</span>
                            {item.title}
                        </Link>
                    ))}
                    <div className='hoverEffect rounded-md'>
                        <Link target="_blank" href='/vivek chaturvedi resume.pdf'>
                            <button className="text-sm p-2 border border-buttonBorder text-primary rounded-md bg-background">
                                Resume
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavBar