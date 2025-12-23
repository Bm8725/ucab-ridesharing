"use client";

import {
  Heart,
  MessageCircle,
  Share2,
  Home,
  Search,
  Plus,
  User,
  Music,
  Bookmark,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef } from "react";

export default function TakPakTikTokResponsive() {
  const [activeTab, setActiveTab] = useState("home");
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef([]);

  const videos = [
    {
      id: 1,
      user: "TakPak Official",
      description: "Premium corporate media experience",
      music: "TakPak Original Sound",
    },
    {
      id: 2,
      user: "TakPak Studio",
      description: "Gold & black — refined digital presence",
      music: "Studio Session #24",
    },
  ];

  const togglePlay = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative h-screen w-full bg-neutral-950 text-yellow-500 font-sans overflow-hidden">
      {/* Pages */}
      {activeTab === "home" && (
        <div className="h-full overflow-y-scroll snap-y snap-mandatory">
          {videos.map((video, index) => (
            <section
              key={video.id}
              className="h-screen w-full snap-start flex items-center justify-center border-b border-yellow-700/40"
            >
              <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl h-full flex items-end p-5 md:p-8">
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  className="absolute inset-0 w-full h-full object-cover"
                  src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onClick={() => togglePlay(index)}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                {/* Info */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="z-10 max-w-[75%] space-y-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold">
                      T
                    </div>
                    <div>
                      <p className="font-semibold text-sm md:text-base">{video.user}</p>
                      <button className="text-xs border border-yellow-500/60 px-2 py-0.5 rounded-full hover:bg-yellow-500 hover:text-black transition">
                        Follow
                      </button>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-yellow-500/80">
                    {video.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-yellow-500/70">
                    <Music className="w-4 h-4" />
                    <span className="truncate">{video.music}</span>
                  </div>
                </motion.div>

                {/* Actions */}
                <div className="absolute right-4 bottom-28 flex flex-col gap-6 items-center">
                  <Heart />
                  <MessageCircle />
                  <Bookmark />
                  <Share2 />
                </div>
              </div>
            </section>
          ))}
        </div>
      )}

      {activeTab === "discover" && (
        <div className="h-full flex items-center justify-center text-sm opacity-80">
          Discover Page
        </div>
      )}

      {activeTab === "inbox" && (
        <div className="h-full flex items-center justify-center text-sm opacity-80">
          Inbox Page
        </div>
      )}

      {activeTab === "profile" && (
        <div className="h-full flex items-center justify-center text-sm opacity-80">
          Profile Page
        </div>
      )}

      {/* Bottom Navigation (TikTok-style) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950 border-t border-yellow-700/40">
        <div className="max-w-md mx-auto flex justify-between items-center px-8 py-3 text-yellow-500">
          <button onClick={() => setActiveTab("home")} className={activeTab === "home" ? "text-yellow-400" : "opacity-60"}>
            <Home />
          </button>
          <button onClick={() => setActiveTab("discover")} className={activeTab === "discover" ? "text-yellow-400" : "opacity-60"}>
            <Search />
          </button>
          <button className="relative -mt-6 bg-yellow-500 text-black rounded-full w-12 h-12 flex items-center justify-center shadow-md">
            <Plus />
          </button>
          <button onClick={() => setActiveTab("inbox")} className={activeTab === "inbox" ? "text-yellow-400" : "opacity-60"}>
            <MessageCircle />
          </button>
          <button onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? "text-yellow-400" : "opacity-60"}>
            <User />
          </button>
        </div>
      </div>
    </div>
  );
}