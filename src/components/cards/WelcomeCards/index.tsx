import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { IWelcomeCardProps } from '@/types/welcome.type';

const WelcomeCard = ({ title, description, icon, route }: IWelcomeCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <button 
      className="p-6 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer w-full text-left"
      onClick={handleClick}
      aria-label={`Navegar para ${title}: ${description}`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="text-[#7ad33e] [&_svg]:!w-10 [&_svg]:!h-10">
          {icon}
        </div>
        <div>
          <ArrowRight className="text-gray-300 group-hover:text-gray-900 transition-colors" />
        </div>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </button>
  );
};

export default WelcomeCard;