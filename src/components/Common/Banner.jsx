import Image from 'next/image';
import Link from 'next/link';

export default function Banner({url, title, subtitle, btnTitle, btnUrl}) {
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
        <p className="text-lg md:text-xl max-w-xl drop-shadow-md mb-5">{subtitle}</p>
        {btnTitle && btnUrl && (
          <Link 
            href={btnUrl} 
            className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300 inline-block"
          >
            {btnTitle}
          </Link>
        )}
      </div>
    </div>
  );
}
