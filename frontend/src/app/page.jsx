'use client';
import { useState } from 'react';
import NavigationBar from '@/components/navbar';
import Toasty from '@/components/toast';
import DropdownMenu from '@/components/dropdown';
import Spravka from '@/components/Spravka';
import { ThemeProvider } from 'next-themes';
import Surovini from '@/components/Surovini';


export default function Home({data}) {
  const [isOpen, setOpen] = useState(false);
  const [isOpen1, setOpen1] = useState(false);
  const [isRaw, setRaw] = useState(false);
  const [toasty, setToasty] = useState({
    vis: false,
    text: '',
    status: ''
  });
  return (
    <>
      <ThemeProvider>
        <div className={ isOpen1 ? 'flex flex-col min-h-screen' : null }>
          <NavigationBar isOpen={isOpen} setOpen={setOpen} isOpen1={isOpen1} setOpen1={setOpen1} />
          <Spravka isOpen={isOpen1} setOpen={setOpen1} toasty={toasty} setToasty={setToasty} />
        </div>
        <Surovini isOpen={isOpen} setOpen={setOpen} setToasty={setToasty} toasty={toasty}  />
        <Toasty text={toasty.text} toasty={toasty} setToasty={setToasty}  />
      </ThemeProvider>
    </>
  )
};