"use client";
import { useEffect, useRef } from "react";

const videos = [
  {
    id: 1,
    embed: "https://player.mediadelivery.net/embed/519066/73170d47-5ebd-4609-bd01-53712bb1ba5d",
    title: "Primeiro vídeo Bunny Stream",
  },
  {
    id: 2,
    embed: "https://player.mediadelivery.net/embed/519066/f12a51a3-3d8f-4fa0-9cda-123456789aaa",
    title: "Segundo vídeo de teste",
  },
  {
    id: 3,
    embed: "https://player.mediadelivery.net/embed/519066/f93b22ff-bcb4-4b0b-bb43-987654321bbb",
    title: "Terceiro vídeo",
  },
  {
    id: 4,
    embed: "https://player.mediadelivery.net/embed/519066/a07d99e1-03f4-42b3-a3a4-abcdefabcdef",
    title: "Quarto vídeo",
  },
  {
    id: 5,
    embed: "https://player.mediadelivery.net/embed/519066/66dd88a9-bf77-4c7c-9a23-fedcba987654",
    title: "Quinto vídeo",
  },
];

export default function Home() {
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
      }}
    >
      {videos.map((v) => (
        <div
          key={v.id}
          style={{
            height: "100vh",
            scrollSnapAlign: "start",
            position: "relative",
            background: "#000",
          }}
        >
          <iframe
            src={`${v.embed}?autoplay=false&loop=true&muted=true&responsive=true`}
            allow="autoplay; fullscreen; picture-in-picture"
            style={{
              border: 0,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            loading="lazy"
            allowFullScreen
          ></iframe>

          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              color: "#fff",
              fontSize: 18,
              textShadow: "0 0 8px #000",
            }}
          >
            {v.title}
          </div>
        </div>
      ))}
    </div>
  );
          }
