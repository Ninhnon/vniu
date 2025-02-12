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
  setAddressId,
}) => {
  const [addressList, setAddressList] = useState([]);
  const [selectedType, setSelectedType] = useState(new Set());
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  useEffect(() => {
    if (addresses) {
      const addressTemps = addresses.map((address) => ({
        addressId: address?.id,
        addressValue: `${address?.unitNumber}, ${address?.streetNumber}, ${address?.addressLine1}, ${address?.province}, ${address?.city}`,
      }));
      setAddressList(addressTemps);
      if (addressTemps.length > 0) {
        setSelectedType(new Set([addressTemps[0].addressValue]));
        setUserAddress(addressTemps[0].addressValue);
        setAddressId(addressTemps[0].addressId);
      }
    }
  }, [addresses, setUserAddress]);

  useEffect(() => {
    if (selectedType.size > 0) {
      const addressValueArray = Array.from(selectedType);
      setUserAddress(addressValueArray[0]);
    }
  }, [selectedType, setUserAddress]);

  return user && addresses ? (
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
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          label="Phone Number"
        />

        <Label>Address</Label>
        <Select
          key="method"
          radius="md"
          label="Address"
          disallowEmptySelection
          autoFocus={false}
          placeholder="Select address"
          selectedKeys={selectedType}
          onSelectionChange={(keys) => setSelectedType(keys)}
          className="max-w-xs lg:max-w-lg"
        >
          {addressList.map((item) => (
            <SelectItem
              key={item.addressValue}
              value={item.addressValue}
              textValue={item.addressValue}
            >
              {item.addressValue}
            </SelectItem>
          ))}
        </Select>
        <Button
          disabled={!fullName || !email}
          className="w-32"
          onClick={() => setIsAddressModalOpen(true)}
        >
          Add Address
        </Button>
        <AddAddress
          isModalOpen={isAddressModalOpen}
          setIsModalOpen={setIsAddressModalOpen}
        />
      </div>
      <div className="mt-20 w-full flex justify-center">
        <Button className="w-32" onClick={() => setPage('2')}>
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
