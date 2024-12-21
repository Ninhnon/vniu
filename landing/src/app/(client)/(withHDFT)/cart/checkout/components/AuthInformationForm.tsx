'use client';

import { AddAddress } from '@/app/(authenticated)/user/profile/AddAddress';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

const AuthInformationForm = ({
  setPage,
  user,
  addresses,
  setUserFullname,
  setUserAddress,
  setUserEmail,
}) => {
  const [addressValue, setAddressValue] = useState(
    addresses?.[0]?.addressValue
  );
  const [selectedType, setSelectedType] = React.useState(
    new Set([addresses?.[0]?.addressValue?.toString()])
  );
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName);
  const [email, setEmail] = useState(user?.email);
  useEffect(() => {
    if (selectedType.size > 0) {
      const addressValueArray = Array.from(selectedType);
      setUserAddress(addressValueArray?.[0]);
    }
  }, [selectedType]);
  return user && addresses ? (
    <div className="flex flex-col h-full justify-between">
      <div className="w-[95%] h-full flex flex-col gap-y-6">
        <Input
          placeholder="Enter full name"
          value={fullName}
          onChange={(e) => {
            setUserFullname(e.target.value);
          }}
          label="Full Name"
        />
        <Input
          placeholder="Enter email"
          value={email}
          disabled
          onChange={(e) => {
            setUserEmail(e.target.value);
          }}
          label="Email"
        />

        <Label>Address</Label>
        <Select
          key={'method'}
          radius={'md'}
          label="Address"
          disallowEmptySelection={true}
          autoFocus={false}
          placeholder="Select address"
          selectedKeys={selectedType}
          onSelectionChange={(keys) => {
            setSelectedType(keys);
          }}
          className="max-w-xs lg:max-w-lg"
        >
          {addresses?.map((item) => {
            return (
              <SelectItem key={item?.addressValue} value={item.addressValue}>
                {item?.addressValue}
              </SelectItem>
            );
          })}
        </Select>
        <Button
          disabled={!fullName || !email}
          className="w-32"
          onClick={() => {
            setIsAddressModalOpen(true);
          }}
        >
          Add Address
        </Button>
        <AddAddress
          isModalOpen={isAddressModalOpen}
          setIsModalOpen={setIsAddressModalOpen}
        />
      </div>
      <div className="mt-20 w-full flex justify-center">
        <Button
          className="w-32"
          onClick={() => {
            setPage('2');
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <Loader />
    </div>
  );
};

export default AuthInformationForm;
