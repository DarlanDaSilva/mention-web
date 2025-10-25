"use client";

import Head from "next/head";

export default function Page() {
  return (
    <>
      <Head>
        <title>Mention</title>
        <meta name="description" content="Aplicativo Mention" />
      </Head>

      {/* 🔷 Header */}
      <header
        style={{
          background: "#007bff",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {/* Logo e título */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img
            src="https://i.ibb.co/v6K2KbWY/20251016-225434-0000.png"
            alt="Mention Logo"
            style={{ width: 28, height: 28 }}
          />
          <div>
            <h1 style={{ fontSize: 18, margin: 0, fontWeight: "bold" }}>Mention</h1>
            <p style={{ margin: 0, fontSize: 12 }}>Seu feed de postagens em um só lugar</p>
          </div>
        </div>

        {/* Botão Download */}
        <a
          href="https://mention-web.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.6)",
            transition: "all 0.2s ease",
          }}
        >
          <img
            src="https://img.icons8.com/pulsar-line/48/FFFFFF/download.png"
            alt="Download"
            style={{ width: 22, height: 22 }}
          />
        </a>
      </header>
    </>
  );
}
