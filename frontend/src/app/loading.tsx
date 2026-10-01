import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Pulsing ring behind the logo */}
        <div className="absolute inset-0 rounded-full border-4 border-accent/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        
        <Image 
          src="/upha.png" 
          alt="Loading..." 
          width={80} 
          height={80} 
          className="object-contain animate-pulse relative z-10"
        />
      </div>
      <div className="mt-8 text-primary font-heading tracking-[0.2em] font-bold uppercase text-sm animate-pulse">
        Loading...
      </div>
    </div>
  );
}
