import Image from 'next/image';

interface ContactHeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export default function ContactHero({ title, subtitle, backgroundImage }: ContactHeroProps) {
  return (
    <div className="relative h-[30vh] md:h-[40vh] lg:h-[50vh] w-full">
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt="Solar installation"
        fill
        className="object-cover"
        priority
        sizes="100vw"
        quality={85}
      />

      {/* Dark overlay with gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-sm md:px-lg">
        <h1 className="text-3xl md:text-5xl lg:text-6xl text-white font-bold mb-sm max-w-4xl">
          {title}
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl font-light">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
