'use client';

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackToHero(){
    const [visible, setVisible] = useState(false);

    useEffect(()=>{
        const sentinel = document.getElementById('hero-sentinel');

        if(!sentinel){
            const onScroll = ()=>setVisible(window.scrollY > 300);
            onScroll();
            window.addEventListener('scroll', onScroll , {passive: true});

            return ()=> window.removeEventListener('scroll',onScroll)
        }
        
        const obs = new IntersectionObserver(
            (entries) => setVisible(!entries[0].isIntersecting),
            {threshold: 0}
        )

        obs.observe(sentinel);

        return ()=> obs.disconnect()
    
    
    },[])

    if(!visible) return null;

    return (
        <button
          onClick={() => document.getElementById("hero-section")?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 rounded-full bg-white/70 border border-orange-400 text-white p-3 shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      );


}