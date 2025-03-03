"use client"
import React, { useEffect, useState } from 'react'
import { LuPlay } from 'react-icons/lu'

interface imgType {
    url: string,
    alt: string
}

function Images({ images, videoUrl }: { images: imgType[], videoUrl?: string }) {
    const [activeImage, setActiveImage] = useState(images[0]?.url || "")
    const [isVideoPlaying, setIsVideoPlaying] = useState(false)

    useEffect(() => {
        setActiveImage(images[0]?.url || "")
    }, [images])
    return (
        <>
            <div className="mb-16">
                {videoUrl && !isVideoPlaying ? (
                    <div
                        className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-700 mb-4 cursor-pointer group"
                        onClick={() => setIsVideoPlaying(true)}
                    >
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/30 transition-all">
                            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <LuPlay className="h-10 w-10 text-white fill-white" />
                            </div>
                        </div>
                        <img
                            src={images[0]?.url || "/placeholder.svg?height=600&width=1200"}
                            alt="Video thumbnail"
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : videoUrl ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-700 mb-4">
                        <video controls autoPlay className="w-full h-full object-contain bg-black"
                            onEnded={() => setIsVideoPlaying(false)}
                        >
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                ) : null}

                {images.length > 0 && (
                    <div className="space-y-4">
                        <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                            <img
                                src={activeImage || images[0].url}
                                alt={images.find((img) => img.url === activeImage)?.alt || "Project image"}
                                className="w-full h-full object-contain bg-gray-950"
                            />
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`flex-shrink-0 w-24 h-16 md:w-32 md:h-20 rounded-md overflow-hidden border-2 cursor-pointer snap-start  ${activeImage === image.url ? "border-blue-500" : "border-gray-700 hover:border-gray-500"}`}
                                    onClick={() => setActiveImage(image.url)}
                                >
                                    <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Images;
