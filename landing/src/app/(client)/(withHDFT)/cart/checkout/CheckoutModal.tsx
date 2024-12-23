import DialogCustom from '@/components/ui/dialogCustom';
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import MultiStepProgressBar from './components/childComponents/MultiProgressBar';
import GuestInformationForm from './components/GuestInformationForm';
import { Button } from '@/components/ui/button';
import { PaymentForm } from './components/PaymentForm';
import { useSession } from 'next-auth/react';
import AuthInformationForm from './components/AuthInformationForm';
import { useUser } from '@/hooks/useUser';
import { useQuery } from '@tanstack/react-query';
import { getRequest } from '@/lib/fetch';
import { Label } from '@/components/ui/label';
import { currencyFormat } from '@/lib/utils';
import Loader from '@/components/Loader';

interface CheckoutModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (input: boolean) => void;
  checkedItems?: any;
  total?: number;
  selectedShipping?: any;
  selectedPromotion?: any;
  selectedPaymentType?: any;
}

const CheckoutModal = ({
  isModalOpen,
  setIsModalOpen,
  checkedItems,
  total,
  selectedShipping,
  selectedPromotion,
  selectedPaymentType,
}: CheckoutModalProps) => {
  const [page, setPage] = useState('1');
  const [userFullName, setUserFullName] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [addressId, setAddressId] = useState();

  const session = useSession();
  const { onGetUserDetail } = useUser();
  const { data: userInfo, isLoading: isLoadingUserInfo } = useQuery({
    queryKey: ['userInfo', session?.data?.user?.id],
    queryFn: async () => {
      const res = await onGetUserDetail();
      return res;
    },
    enabled: !!session?.data?.user?.id,
  });

  const { data: userAddresses, isLoading: isLoadingUserAddresses } = useQuery(
    ['userAddresses', session?.data?.user?.id],
    async () => {
      const res = await getRequest({
        endPoint: `/api/v1/users/${session?.data?.user?.id}/addresses/filter-and-sort?PageSize=10&PageIndex=1`,
      });
      return res.value.items;
    },
    { enabled: !!session?.data?.user?.id }
  );

  useEffect(() => {
    if (userInfo) {
      setUserFullName(userInfo?.fullName || '');
      setUserEmail(userInfo?.email || '');
    }
  }, [userInfo]);

  return (
    <div className="w-full h-full px-1">
      <DialogCustom
        className="w-full lg:w-[50%] h-[80%] lg:h-[95%] flex items-center justify-center"
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        warningOnClose={true}
        callBack={() => {}}
      >
        {(isLoadingUserInfo || isLoadingUserAddresses) &&
        session?.data?.user?.id ? (
          <div className="flex items-center justify-center h-full w-full">
            <Loader />
          </div>
        ) : (
          <div className="flex w-full flex-col gap-y-5">
            {/* <MultiStepProgressBar page={page} onPageNumberClick={() => {}} /> */}
            <Label>Your total amount: {currencyFormat(total)} </Label>
            <Tabs
              selectedKey={page}
              classNames={{
                tabList: 'gap-6 w-full  ',
              }}
              aria-label="Options"
            >
              <Tab key={'1'} title="Information">
                {userInfo && userAddresses ? (
                  <AuthInformationForm
                    setUserEmail={setUserEmail}
                    setUserFullname={setUserFullName}
                    setUserAddress={setUserAddress}
                    user={userInfo}
                    addresses={userAddresses}
                    setPage={setPage}
                    setAddressId={setAddressId}
                  />
                ) : (
                  <GuestInformationForm
                    email={userEmail}
                    setEmail={setUserEmail}
                    fullName={userFullName}
                    setFullName={setUserFullName}
                    addressValue={userAddress}
                    setAddressValue={setUserAddress}
                    setPage={setPage}
                  />
                )}
              </Tab>
              <Tab key={'2'} title="Payment">
                <div className="w-full h-full">
                  <PaymentForm
                    userFullName={userFullName}
                    userAddress={userAddress}
                    userEmail={userEmail}
                    checkedItems={checkedItems}
                    total={total}
                    selectedPaymentType={selectedPaymentType}
                    selectedShipping={selectedShipping}
                    selectedPromotion={selectedPromotion}
                    addressId={addressId}
                  />
                  <div className="w-full flex flex-row items-center justify-center gap-x-10 ">
                    <Button
                      className="w-32 mt-10"
                      onClick={() => {
                        setPage('1');
                      }}
                    >
                      Back
                    </Button>
                  </div>
                </div>
              </Tab>
              <Tab key={'3'} title="Complete">
                <Card>
                  <CardBody>
                    Thank you for your purchase! We hope you have the best
                    experience with our products!
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>
        )}
      </DialogCustom>
    </div>
  );
};
export default CheckoutModal;
