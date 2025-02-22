import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EL OMRAN",
  description: "Employee Management System",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <header className="bg-gray-800 text-white p-4">
            <nav className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">EL OMRAN</h1>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/employees" className="hover:text-gray-300">
                    حط الصنايعي
                  </Link>
                </li>
                <li>
                  <Link href="/daily-records" className="hover:text-gray-300">
                    حط المصاريف
                  </Link>
                </li>
                <li>
                  <Link href="/reports" className="hover:text-gray-300">
                    التقارير
                  </Link>
                </li>
              </ul>
            </nav>
          </header>
          <main className="flex-grow container mx-auto p-4">{children}</main>
          <footer className="bg-gray-800 text-white p-4">
            <div className="container mx-auto text-center">
              © 2025 EL OMRAN. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

import "./globals.css";
