import React from 'react';
import { Users } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import GarageInfoOneCard from '../GarageInfoOneCard';
import { IGarageInfoSection } from '@/types/garage.type';

const GarageInfoSection = ({
  totalSpaces,
  occupiedSpaces,
  availableSpaces,
  qrCodeValue,
}: IGarageInfoSection) => {
  return (
    <div className="flex justify-between">
      <div className="grid grid-cols-3 gap-5 w-300">
        <GarageInfoOneCard
          label="Total de Vagas"
          value={totalSpaces}
          icon={<Users className="w-5 h-5" />}
          valueColor="text-gray-600"
        />
        <GarageInfoOneCard
          label="Ocupadas"
          value={occupiedSpaces}
          icon={<Users className="w-5 h-5" />}
          iconColor="text-orange-500"
          valueColor="text-gray-600"
        />
        <GarageInfoOneCard
          label="Disponíveis"
          value={availableSpaces}
          icon={<Users className="w-5 h-5" />}
          iconColor="text-green-500"
          valueColor="text-gray-600"
        />
      </div>
      <div className="flex flex-col items-end justify-center">
        <QRCodeSVG value={qrCodeValue} level="H" className="w-30 h-20" version={"7"} />
      </div>
    </div>
  );
};

export default GarageInfoSection;