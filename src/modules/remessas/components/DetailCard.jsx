import React from 'react';
import { Card } from 'flowbite-react';

const DetailCard = ({ title, children }) => {
    return (
        <Card className="h-full">
            <h5 className="text-lg font-semibold mb-2">{title}</h5>
            <div>
                {children}
            </div>
        </Card>
    );
};

export default DetailCard;