import { Poppins, Roboto } from "next/font/google";
import "../(website)/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // ✅ choose what you actually use
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${roboto.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
