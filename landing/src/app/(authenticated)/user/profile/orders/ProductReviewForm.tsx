'use client';
import { Button } from '@/components/ui/button';
import { Spinner, Textarea } from '@nextui-org/react';
import React, { useState } from 'react';
import Image from 'next/legacy/image';
import { FaCheckCircle, FaStar, FaExclamationTriangle } from 'react-icons/fa';
import { Controller, useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Zoom } from '@/components/ui/zoom-image';
import { type FileWithPath } from 'react-dropzone';
import { FileDialog } from '@/app/(authenticated)/admin/add-product/FileDialog';
import { useSession } from 'next-auth/react';
import { useReview } from '@/hooks/useReview';
import { useRouter } from 'next/navigation';
import DialogCustom from '@/components/ui/dialogCustom';
import { useQueryClient } from '@tanstack/react-query';

type FileWithPreview = FileWithPath & {
  preview: string;
};
const ProductReviewForm = ({ product }) => {
  //Router for redirecting
  const router = useRouter();
  const queryClient = useQueryClient();
  //POST hook
  const { onPostProductReview } = useReview();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  //Star rating when hover and click
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  //Loading and success
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  //Show dialog
  const [isShowDialog, setIsShowDialog] = useState(false);
  //Invalid input
  const [isContentValid, setIsContentValid] = useState(false);

  //Get session
  const session = useSession();
  const userId = session?.data?.user?.id;

  const { handleSubmit, control, reset } = useForm();
  //Submit function
  const onSubmit = async (data) => {
    await setIsInvalid(false);
    console.log(
      'isInvalid = ' +
        isInvalid +
        ' rating = ' +
        rating +
        ' isContentValid = ' +
        isContentValid
    );
    // Reset isInvalid to false when the dialog is opened
    if (rating === 0) {
      setIsInvalid(true); // Set isInvalid to true if rating is 0
      return;
    }
    if (data.text === '') {
      setIsContentValid(false);
      setIsInvalid(true); // Set isInvalid to true if content is empty
      return;
    } else {
      setIsContentValid(true);
    }
    //If all input is valid, then submit
    // Set loading state to true when submitting for submiting dialog

    setIsLoading(true);

    // const [data] = useQuery('key', func(), {});
    const ret = await onPostProductReview({
      ...data,
      rating: parseInt(data.rating),
      files: [...files],
      userId: userId,
      productId: product.id,
      orderedLineId: product.orderLines[0].id,
    });

    if (ret.isSuccess) {
      console.log(ret);
      // Set loading state to false and show success dialog
      setIsLoading(false);
      setShowSuccess(true);

      // Reset form and other state variables after submission after 2sec
      setTimeout(() => {
        reset();
        setFiles([]);
        setRating(0);
        setHover(0);
        setIsShowDialog(false);
        setIsLoading(false);
        setShowSuccess(false);
        setIsInvalid(false);
      }, 2000);
      queryClient.refetchQueries(['productReview', product.id, 1]);
    }
  };
  return (
    <div>
      <div className="flex items-center justify-center">
        <Button
          className="z-50 border-transparent hover:scale-105 hover:transition hover:duration-200 font-semibold text-white"
          onClick={() => {
            const getSession = async () => {
              if (!session) {
                console.log('no session');
                router.push('/auth/login');
              } else {
                setIsShowDialog(true);
                setIsVisible(!isVisible);
              }
            };
            getSession();
          }}
        >
          Review
        </Button>
      </div>
      {/* Check condition to open dialog */}
      {isShowDialog ? (
        <DialogCustom
          warningOnClose={true}
          className="flex justify-center items-center w-[90%] lg:w-[60%] h-[90%]"
          isModalOpen={isShowDialog}
          setIsModalOpen={setIsShowDialog}
          callBack={() => {
            // Reset form details and state varibles
            // when the dialog is closed
            reset();
            setRating(0);
            setHover(0);
            setFiles([]);
            setIsInvalid(false);
          }}
        >
          <div className="flex flex-col w-full h-auto pr-4 gap-6">
            <div className="w-full h-fit flex flex-col pt-2 items-center gap-3">
              <span className="text-[12px] sm:text-sm md:text-base font-semibold">
                Write a Product Review
              </span>
              <span className="text-[10px] sm:text-sm text-gray-500">
                Share your experiences with everyone.
              </span>
              <div className="w-full h-fit mt-2 flex flex-row gap-3 items-center">
                <Image
                  src={product?.orderLines[0].imageUrl}
                  alt={'image'}
                  width={60}
                  height={50}
                  className="rounded-md object-cover object-center"
                />
                <span className="text-[10px] sm:text-sm text-gray-700">
                  {product?.orderLines[0].productName}
                </span>
              </div>
            </div>

            <div className="flex w-full h-fit mt-3 flex-col gap-3">
              <Label className="font-semibold text-[10px] sm:text-[14px]">
                Overall Rating
              </Label>
              <div className="flex gap-2 justify-start">
                {[1, 2, 3, 4, 5].map((star, index) => {
                  const currentRating = index + 1;

                  return (
                    <label
                      className="flex items-center justify-center"
                      key={currentRating}
                    >
                      <Controller
                        name="rating"
                        control={control}
                        defaultValue={''}
                        render={({ field }) => (
                          <>
                            <FaStar
                              style={{ cursor: 'pointer' }}
                              size={24}
                              color={
                                currentRating <= (hover || rating)
                                  ? '#ffc107'
                                  : '#e4e5e9'
                              }
                              onMouseEnter={() => setHover(currentRating)}
                              onMouseLeave={() => setHover(rating)}
                            />
                            <input
                              type="radio"
                              name="rating"
                              className="invisible"
                              value={currentRating}
                              onChange={(e) => {
                                field.onChange(e);
                                setRating(currentRating); // Set the rating when the radio button is clicked
                              }}
                            />
                          </>
                        )}
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col w-full h-fit gap-2">
              <Label className="font-semibold text-[10px] sm:text-[14px]">
                Comment
              </Label>
              <Controller
                defaultValue={''}
                name="text"
                control={control}
                render={({ field }) => {
                  return (
                    <Textarea
                      className="h-full"
                      minRows={20}
                      size="sm"
                      type="textarea"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  );
                }}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label className="font-semibold text-[10px] sm:text-[14px]">
                Images
              </Label>
              {files?.length ? (
                <div className="flex items-center gap-2">
                  {files.map((file, i) => (
                    <Zoom key={i}>
                      <Image
                        src={file.preview}
                        alt={file.name}
                        className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
                        width={80}
                        height={80}
                      />
                    </Zoom>
                  ))}
                </div>
              ) : null}
              <Controller
                defaultValue={''}
                name={'image'}
                control={control}
                render={({ field }) => {
                  return (
                    <FileDialog
                      setValue={field.onChange}
                      name="images"
                      maxFiles={8}
                      maxSize={1024 * 1024 * 4}
                      files={files}
                      setFiles={setFiles}
                      disabled={false}
                    />
                  );
                }}
              />
              <div className="flex w-full mt-5 justify-center items-center">
                <Button
                  className="w-[50%] inset-0 border-transparent hover:scale-105 hover:transition text-[13px] sm:text-[16px] hover:duration-200 font-semibold text-white rounded-md"
                  onClick={async () => {
                    try {
                      await handleSubmit(onSubmit)();
                    } catch (error) {
                      // Handle submission error if needed
                    }
                  }}
                >
                  Confirm
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-3 items-center justify-center">
              {/* Loading Dialog */}
              {isLoading && !showSuccess && rating !== 0 && isContentValid && (
                <DialogCustom
                  className="w-[90%] lg:w-[50%] h-fit items-center justify-center"
                  isModalOpen={isLoading}
                  notShowClose={true}
                >
                  <div className="flex flex-col gap-3 items-center justify-center">
                    <Spinner size="lg" />
                    <div className="text-center font-semibold text-xs sm:text-sm">
                      Saving your review...
                    </div>
                  </div>
                </DialogCustom>
              )}

              {/* Invalid Dialog */}
              {isInvalid ? (
                <DialogCustom
                  className="w-[90%] lg:w-[50%] h-fit items-center justify-center"
                  isModalOpen={!isLoading}
                >
                  <div className="flex flex-col gap-3 items-center justify-center">
                    {rating === 0 ? (
                      <>
                        <FaExclamationTriangle
                          className="text-gray-700"
                          size={35}
                        />
                        <div className="text-center font-semibold text-xs sm:text-sm">
                          Please select a star rating!
                        </div>
                      </>
                    ) : !isContentValid ? (
                      <>
                        <FaExclamationTriangle
                          className="text-gray-700"
                          size={35}
                        />
                        <div className="text-center font-semibold text-xs sm:text-sm">
                          Please enter content!
                        </div>
                      </>
                    ) : null}
                  </div>
                </DialogCustom>
              ) : null}

              {/* Success Dialog */}
              {showSuccess && (
                <DialogCustom
                  className="w-[90%] lg:w-[50%] h-fit items-center justify-center"
                  isModalOpen={!isLoading}
                  notShowClose={true}
                >
                  <div className="flex flex-col gap-3 items-center justify-center">
                    <FaCheckCircle className="text-gray-700" size={35} />
                    <div className="text-center font-semibold text-xs sm:text-sm">
                      Review has been saved!
                    </div>
                  </div>
                </DialogCustom>
              )}
            </div>
          </div>
        </DialogCustom>
      ) : null}
    </div>
  );
};

export default ProductReviewForm;
