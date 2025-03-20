"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from 'next/link'  // Import Link from next/link
import React from 'react'

function Header() {
    const path = usePathname()

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
        <Image src={'/logo.svg'} width={160} height={100} alt="logo"/>
        <ul className='hidden md:flex gap-6'>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path === '/dashboard' ? 'text-blue-500 font-bold' : 'text-black'}`}>
                <Link href="/dashboard">Dashboard</Link>  {/* Link to Dashboard */}
            </li>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path === '/dashboard/upgrade' ? 'text-blue-500 font-bold' : 'text-black'}`}>
                <Link href="/dashboard/upgrade">Upgrade</Link>  {/* Link to Upgrade */}
            </li>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path === '/dashboard/how' ? 'text-blue-500 font-bold' : 'text-black'}`}>
                <Link href="/dashboard/how">How it works</Link>  {/* Link to How it works */}
            </li>
        </ul>
        <UserButton/>
    </div>
  )
}

export default Header
