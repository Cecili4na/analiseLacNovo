"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-screen min-h-screen m-0 p-0">
      {/* Header */}
      <header className="w-screen bg-[#8BA989] m-0 p-0">
        <div className="w-screen flex justify-between items-center px-4 py-4">
          <div className="flex items-center gap-2">
            <img
              src="/images/logo-panc.png"
              alt="AnaliseLAC Logo"
              className="h-8 w-auto"
            />
            <h1 className="text-white text-2xl font-semibold">AnaliseLAC</h1>
          </div>
          <button className="bg-white px-6 py-2 rounded-lg text-[#8BA989] font-medium">
            Entrar
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-screen bg-[#F0F0E5] flex flex-col items-center justify-center m-0 p-0">
        <div className="w-screen text-center">
          <h2 className="text-4xl font-bold mb-2">
            Análise Sensorial de
          </h2>
          <h3 className="text-4xl font-bold text-[#8BA989] mb-6">
            Laticínios Caprinos
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8 px-4">
            Plataforma especializada para avaliação e análise sensorial de produtos lácteos
            caprinos de forma eficiente e padronizada.
          </p>
          <button className="bg-[#8BA989] text-white px-8 py-3 rounded-lg font-medium">
            Acessar Plataforma
          </button>
        </div>
      </main>
    </div>
  );
} 