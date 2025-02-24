import "./globals.css";
import Header from "@/components/header";
import { UserProvider } from "./context/UserContext";
import HeaderClient from "@/components/HeaderClient";

export const metadata = {
  title: "Next.js Page Routing & Rendering",
  description: "Learn how to route to different pages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode,
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <HeaderClient />
          <main>{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
