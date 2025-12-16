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
        {/* H1: Fluid Typography - Mobile-First Responsive */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-white font-display font-bold mb-3 md:mb-4 max-w-4xl tracking-tight">
          {title}
        </h1>
        {/* Subtitle: Proportional to H1 */}
        <p className="text-sm md:text-base text-white/90 max-w-2xl font-sans leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
