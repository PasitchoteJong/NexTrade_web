import React from 'react'
import { Outlet } from "react-router-dom";
import Navbar from '../components/Navbar';

export default function UserLayout() {
  return (
    <div className='min-h-screen bg-base-200'>
      <Navbar />
      <main className='p-4 lg:p-8'>
        <Outlet />
      </main>
    </div>
  );
}
