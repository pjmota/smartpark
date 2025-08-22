import React from 'react';
import { Users } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import InfoCard from '../GarafeInfoOneCard';
import { IGarageInfoSection } from '@/types/garage.types';

const GarageInfoSection = ({
  totalSpaces,
  occupiedSpaces,
  availableSpaces,
  qrCodeValue,
}: IGarageInfoSection) => {
  return (
    <div className="flex">
      <div className="grid grid-cols-3 gap-4 w-250 mr-3">
        <InfoCard
          label="Total de Vagas"
          value={totalSpaces}
          icon={<Users className="w-5 h-5" />}
          valueColor="text-gray-600"
        />
        <InfoCard
          label="Ocupadas"
          value={occupiedSpaces}
          icon={<Users className="w-5 h-5" />}
          iconColor="text-orange-500"
          valueColor="text-gray-600"
        />
        <InfoCard
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