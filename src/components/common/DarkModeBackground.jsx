import React, { useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";

/**
 * DarkModeBackground
 * Renders the ambient particles & ink animation video exclusively when dark mode is enabled.
 * In light mode, the video is paused and completely hidden to optimize performance and preserve
 * the light mode aesthetic.
 */
export function DarkModeBackground() {
    const { isDark } = useTheme();
    const videoRef = useRef(null);

    // Synchronize video playback with dark mode state
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isDark) {
            // Smoothly start playing when customer switches to dark mode
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    // Browser autoplay constraints handled silently
                    console.debug("Dark mode background video autoplay deferred:", error);
                });
            }
        } else {
            // Strictly pause playback when in light mode to save resources
            video.pause();
        }
    }, [isDark]);

    const handleCanPlay = () => {
        if (isDark && videoRef.current && videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
        }
    };

    const baseUrl = import.meta.env.BASE_URL || "/";
    const videoSource = `${baseUrl.endsWith("/") ? baseUrl : baseUrl + "/"}videos/dark-mode-bg.mp4`;

    return (
        <div
            className={`dark-mode-bg-portal ${isDark ? "theme-dark-active" : "theme-light-dormant"}`}
            aria-hidden="true"
        >
            <video
                ref={videoRef}
                className="dark-mode-ambient-video"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                onCanPlay={handleCanPlay}
            >
                <source src={videoSource} type="video/mp4" />
                <source src="/videos/dark-mode-bg.mp4" type="video/mp4" />
                <source src="./videos/dark-mode-bg.mp4" type="video/mp4" />
            </video>

            {/* Botanical Dark Vignette & Shimmer Layers */}
            <div className="dark-mode-ambient-tint" />
            <div className="dark-mode-ambient-vignette" />
        </div>
    );
}

export default DarkModeBackground;
