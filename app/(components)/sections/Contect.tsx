import React from 'react';

function Contact() {
    return (
        <section className=" text-foreground py-20 px-10 md:px-20 text-center h-screen flex flex-col items-center justify-center" id="contact">
            <p className='hover:text-primary transition-color duration-300 text-3xl font-semibold'>
                <span className='text-primary mr-1 font-mono ' >04. </span>
                {`What's Next?`}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-muted mt-2">Get In Touch</h2>
            <p className="text-muted max-w-xl mx-auto mt-4 text-sm md:text-base">
                {`Although I'm not currently looking for any new opportunities, my inbox is always open.
                Whether you have a question or just want to say hi, I'll try my best to get back to you!`}
            </p>
            <a
                href="mailto:vc8bp3@gmail.com"
                className="border border-primary text-primary px-6 py-2 rounded-md mt-6 inline-block hover:bg-primary hover:text-background transition"
            >
                Say Hello
            </a>
        </section>
    );
}

export default Contact;
