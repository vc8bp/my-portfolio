"use client";

import React, { useState } from "react";
import { LuPlay } from "react-icons/lu";

interface ImageType {
  url: string;
  alt: string;
}

export default function Images({
  images,
  videoUrl,
}: {
  images: ImageType[];
  videoUrl?: string;
}) {
  const [activeImage, setActiveImage] = useState(images[0]?.url ?? "");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const active = images.find((img) => img.url === activeImage) ?? images[0];

  return (
    <div className="space-y-4">
      {videoUrl && !isVideoPlaying && (
        <button
          type="button"
          className="group relative block aspect-video w-full overflow-hidden border border-rule"
          onClick={() => setIsVideoPlaying(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[0]?.url}
            alt=""
            className="h-full w-full object-cover opacity-50 transition-opacity group-hover:opacity-70"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center border border-signal bg-[var(--scrim)] transition-colors group-hover:bg-signal">
              <LuPlay className="h-6 w-6 fill-signal text-signal transition-colors group-hover:fill-ink group-hover:text-ink" />
            </span>
          </span>
          <span className="absolute bottom-3 left-3 font-mono text-xs text-text">
            Play walkthrough
          </span>
        </button>
      )}

      {videoUrl && isVideoPlaying && (
        <div className="aspect-video w-full border border-rule bg-black">
          <video
            controls
            autoPlay
            className="h-full w-full object-contain"
            onEnded={() => setIsVideoPlaying(false)}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {images.length > 0 && (
        <>
          <figure className="border border-rule bg-panel">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active?.url}
              alt={active?.alt ?? "Project screen"}
              className="aspect-video w-full object-contain"
            />
            {active?.alt && (
              <figcaption className="border-t border-rule px-4 py-2.5 font-mono text-xs text-dim2">
                {active.alt}
              </figcaption>
            )}
          </figure>

          {images.length > 1 && (
            <div className="flex snap-x gap-2 overflow-x-auto pb-2">
              {images.map((image) => (
                <button
                  type="button"
                  key={image.url}
                  aria-label={`Show ${image.alt}`}
                  aria-current={activeImage === image.url}
                  className={`h-14 w-24 flex-shrink-0 snap-start overflow-hidden border transition-colors md:h-16 md:w-28 ${
                    activeImage === image.url
                      ? "border-signal"
                      : "border-rule opacity-60 hover:opacity-100"
                  }`}
                  onClick={() => setActiveImage(image.url)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
