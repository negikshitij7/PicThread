// for letting the seo bots know

import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import "../globals.css"
import { Metadata } from "next"

export const metadata:Metadata={
    title:"Threads",
    description:"A Next.js 14 Meta Threads App"
}

const inter=Inter({subsets:["latin"]})

export default function RootLayout({children}:{children:React.ReactNode})
{
    return (
        <ClerkProvider>
           <html lang="en">
            <body className={`bg-dark-1 ${inter.className}`}>
            <div className="w-full flex justify-center items-center">
            {children}
            </div>        
            </body>             
            </html>
        </ClerkProvider>
    )
}