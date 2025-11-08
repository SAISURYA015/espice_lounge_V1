import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import ScrollToTopButton from "./_components/ScrollToTopButton";

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

export const metadata = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Spice Lounge",
      url: "https://espicelounge.com",
      logo: "https://espicelounge.com/shared/logos/logo.png",
      email: "info@espicelounge.com",
      telephone: "+91 63626 72263",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Western Dallas Centre, 5th Floor, Survey No.83/1, Knowledge City, Raidurg, Gachibowli",
        addressLocality: "Hyderabad",
        addressRegion: "Telangana",
        postalCode: "500032",
        addressCountry: "IN",
      },

      creator: {
        "@type": "Organization",
        name: "CHS Digital World",
        url: "https://chsdigitalworld.com",
        logo: "https://chsdigitalworld.com/img/logo.png",
      },
    },
    {
      "@type": "WebSite",
      name: "Spice Lounge",
      url: "https://espicelounge.com",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://espicelounge.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${roboto.variable} antialiased`}>
        {children}
        <ScrollToTopButton />
      </body>
    </html>
  );
}
