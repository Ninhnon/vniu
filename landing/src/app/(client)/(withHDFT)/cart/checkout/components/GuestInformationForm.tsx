import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import React from 'react';

const GuestInformationForm = ({
  email,
  setEmail,
  fullName,
  setFullName,
  addressValue,
  setAddressValue,
  setPage,
}) => {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="w-[95%] h-full flex flex-col gap-y-6">
        <Input
          placeholder="Enter full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          label="Full Name"
        />
        <Input
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
        />
        <Input
          placeholder="Enter address"
          value={addressValue}
          onChange={(e) => setAddressValue(e.target.value)}
          label="Address"
        />
      </div>
      <div className="mt-20 w-full flex justify-center">
        <Button className="w-32" onClick={() => setPage('2')}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default GuestInformationForm;
