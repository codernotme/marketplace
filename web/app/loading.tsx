import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute w-[500px] h-[500px] bg-black/10 rounded-full blur-3xl animate-pulse" />

      {/* Animated logo mark */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer spinning ring */}
        <div className="absolute w-24 h-24 rounded-full border-[3px] border-[#F5F5F5]" />
        <div className="absolute w-24 h-24 rounded-full border-[3px] border-t-[#84D347] border-r-transparent border-b-transparent border-l-transparent animate-spin" />

        {/* Middle counter-spinning ring */}
        <div className="absolute w-16 h-16 rounded-full border-[2px] border-dashed border-gray-200 animate-[spin_3s_linear_infinite_reverse]" />

        {/* Center logo block */}
        <div className="relative z-10 w-10 h-10 rounded-xl overflow-hidden shadow-lg">
          <Image src="/logo.svg" alt="themrktplace" width={40} height={40} className="w-full h-full object-cover" priority />
        </div>
      </div>

      {/* Brand name with letter animation */}
      <div className="flex items-center gap-0.5 mb-3">
        {'themrktplace'.split('').map((char, i) => (
          <span
            key={i}
            className="font-display font-black text-2xl tracking-tighter text-black"
            style={{
              animationName: 'fadeInUp',
              animationDuration: '0.4s',
              animationDelay: `${i * 0.05}s`,
              animationFillMode: 'both',
              animationTimingFunction: 'ease-out',
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Loading bar */}
      <div className="w-40 h-0.5 bg-[#F5F5F5] rounded-full overflow-hidden">
        <div className="h-full bg-black rounded-full animate-[loadingBar_1.5s_ease-in-out_infinite]" />
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes loadingBar {
          0%   { width: 0%;   margin-left: 0; }
          50%  { width: 70%;  margin-left: 15%; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}
