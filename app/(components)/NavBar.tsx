import Link from 'next/link'
import React from 'react'
import AnimatedSvgLogo from './AnimatedSvgLogo'

const navItems = [
    { title: "About", href: "#about" },
    { title: "Experience", href: "#experience" },
    { title: "Work", href: "#work" },
    { title: "Contact", href: "#contact" },
]
function NavBar() {
    return (
        <nav className='flex justify-between w-full px-5 py-7 fixed top-0 z-1000 bg-background/5 backdrop-blur-lg ' >
            <Link className='my-auto w-[100px] hoverEffect' href="/#main" ><AnimatedSvgLogo/></Link>
            <div className='flex gap-3 text-sm my-auto'>
                {navItems.map((item, index) => (
                    <Link key={item.href} href={item.href} className='p-2 hover:text-primary transition-color duration-300 '>
                        <span className='text-primary mr-1 font-mono ' >0{index+1}.</span>
                        {item.title}
                    </Link>
                ))}
                <div className='hoverEffect rounded-md' >
                    <button className="text-sm p-2 border border-buttonBorder text-primary rounded-md bg-background ">
                        Resume
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default NavBar