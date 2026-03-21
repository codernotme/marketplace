export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <div className="relative flex items-center justify-center w-20 h-20 mb-4">
        <div className="absolute inset-0 border-4 border-[#F5F5F5] rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-[#84D347] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <div className="w-8 h-8 bg-black rounded-lg shadow-sm"></div>
      </div>
      <h2 className="font-display text-xl font-bold tracking-tight text-black animate-pulse">
        themrktplace
      </h2>
    </div>
  );
}
