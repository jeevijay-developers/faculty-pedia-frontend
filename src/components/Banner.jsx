import Image from 'next/image';

export default function Banner({url, title, subtitle}) {
  return (
    <div className="relative w-full overflow-hidden">
      <Image
        src={url}
        alt="Classes Banner"
        height={600}
         width={1200}
        className="w-full h-64 md:h-96 object-cover"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">{title}</h1>
        <p className="text-lg md:text-xl max-w-xl drop-shadow-md">{subtitle}</p>
      </div>
    </div>
  );
}
