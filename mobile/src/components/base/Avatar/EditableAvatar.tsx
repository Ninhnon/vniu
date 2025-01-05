import {IEditableAvatarProps, IPermissionModalContent} from '.';
import {useAppImageCropPicker} from '@hooks/app/useAppImageCropPicker';
import {Controller, useFormContext} from 'react-hook-form';
import {RESULTS} from 'react-native-permissions';

import React, {useCallback, useMemo, useRef, useState} from 'react';

import {Linking, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';

import {imageUpload} from '@configs/imageUpload';
import {sizeScale} from '@utils/dimensions';
import {Permissions, isRequireLibraryPermission} from '@utils/permissions';

import {COLORS} from '@assets/color';

import {
  DialogCard,
  DialogModal,
  Image,
  SvgIcon,
  TDialogModalRef,
} from '../index';

const EditableAvatar = ({size = 36}: IEditableAvatarProps) => {
  // const {data} = useGetProfileQuery();
  const data = {};

  const [imagePatch, setImagePatch] = useState<string>(data?.avatar || '');

  const permissionModalRef = useRef<TDialogModalRef>(null);

  const deniedModalRef = useRef<TDialogModalRef>(null);

  const _handleOpenModalPermission = async (
    onChange?: (value: string) => void,
  ) => {
    const result = await _handleCheckPermission();
    // From Android version 10, it's no longer require permission to access photos
    if (result === RESULTS.BLOCKED) {
      deniedModalRef.current?.show();
      return;
    }

    if (result === RESULTS.DENIED && isRequireLibraryPermission) {
      permissionModalRef.current?.show();
      return;
    }

    _handlePickImage(onChange);
  };

  const {pickImage} = useAppImageCropPicker({
    options: imageUpload.kycImagePickOption,
    onPermissionDenied: _handleOpenModalPermission,
  });
  console.log('🚀 ~ EditableAvatar ~ pickImage:', pickImage);

  const _handlePickImage = useCallback(
    (onChange?: (value: string) => void) => {
      pickImage().then(image => {
        console.log('🚀 ~ pickImage ~ image:', image);
        if (image?.path) {
          const patch = Platform.OS==='ios' ? `file://${image.path}` : image?.path;
          console.log('🚀 ~ pickImage ~ patch:', patch);

          setImagePatch(patch);
          onChange?.(patch);
        }
      });
    },
    [pickImage],
  );

  const _handleCloseModalPermission = () => {
    permissionModalRef.current?.hide();
  };

  const _handleCloseDeniedModal = () => {
    permissionModalRef.current?.hide();
    deniedModalRef.current?.hide();
  };

  const _handleOnGranted = useCallback(() => {
    _handlePickImage();
  }, [_handlePickImage]);

  const _handleOnDenied = () => {
    deniedModalRef.current?.show();
  };

  const _handleRequestPermission = useCallback(() => {
    Permissions.library.request({
      onGrantedCallback: _handleOnGranted,
      onDeniedCallback: _handleOnDenied,
    });
  }, [_handleOnGranted]);

  const _handleCheckPermission = async () => {
    return await Permissions.library.check();
  };

  const _handleNavToSetting = () => {
    Linking.openSettings();
  };

  const avatarStyle = useMemo(
    () =>
      StyleSheet.compose(styles.avatar, {
        width: sizeScale(size),
        height: sizeScale(size),
        borderRadius: sizeScale(size) / 2,
      }),
    [size],
  );

  const ImageComp = useCallback(() => {
    if (imagePatch !== '' && data?.avatar !== imagePatch) {
      return <Image.Patch patch={imagePatch} style={avatarStyle} />;
    } else if (data?.avatar === imagePatch) {
      return <Image.CDN uri={data?.avatar} style={avatarStyle} />;
    } else {
      return <Image.Local source={'logo'} style={avatarStyle} />;
    }
  }, [avatarStyle, data?.avatar, imagePatch]);

  const DeniedModalComp = useCallback(() => {
    return (
      <DialogModal ref={deniedModalRef}>
        <PermissionModalContent
          title="Access permission required"
          positiveLabel="OK"
          neutralLabel="Cancel"
          description="Please go to your phone settings and turn on photo access permission for ACRO in order to use this feature."
          onPositivePress={_handleNavToSetting}
          onNeutralPress={_handleCloseDeniedModal}
        />
      </DialogModal>
    );
  }, []);

  const RequestModalComp = useCallback(() => {
    return (
      <DialogModal ref={permissionModalRef}>
        <PermissionModalContent
          title="Let ACRO access your photos?"
          positiveLabel="Give access"
          neutralLabel="Cancel"
          description="This lets you choose which photo you want to set as your profile picture."
          onPositivePress={_handleRequestPermission}
          onNeutralPress={_handleCloseModalPermission}
        />
        <DeniedModalComp />
      </DialogModal>
    );
  }, [DeniedModalComp, _handleRequestPermission]);
  const {control} = useFormContext();
  return (
    <>
      <Controller
        name={'avatar'}
        control={control}
        render={({field: {onChange}}) => (
          <TouchableOpacity
            onPress={() => _handleOpenModalPermission(onChange)}>
            <ImageComp />
            <View style={styles.editWrapper}>
              <SvgIcon name="pencilSimpleLine" size={20} />
            </View>
            <RequestModalComp />
            <DeniedModalComp />
          </TouchableOpacity>
        )}
      />
    </>
  );
};

export default EditableAvatar;

const PermissionModalContent = ({
  description = 'This lets you choose which photo you want to set as your profile picture.',
  neutralLabel = 'Cancel',
  onNeutralPress,
  onPositivePress,
  positiveLabel = 'Give access',
  title = 'Let ACRO access your photos?',
}: IPermissionModalContent) => {
  return (
    <>
      <DialogCard.ContentWrapper>
        <DialogCard.TextTitle>{title}</DialogCard.TextTitle>
        <DialogCard.TextDescription>{description}</DialogCard.TextDescription>
      </DialogCard.ContentWrapper>
      <DialogCard.ActionWrapper>
        <DialogCard.Button
          label={neutralLabel}
          onPress={onNeutralPress}
          backgroundColor="SURFACE_OFF_WHITE"
        />
        <DialogCard.Button
          label={positiveLabel}
          onPress={onPositivePress}
          backgroundColor="SURFACE_ACCENT_5"
          labelColor="ELEMENT_ACCENT"
        />
      </DialogCard.ActionWrapper>
    </>
  );
};
const styles = StyleSheet.create({
  avatar: {borderWidth: 1, borderColor: COLORS.BORDER_NEUTRAL},

  editWrapper: {
    backgroundColor: COLORS.SURFACE_OFF_WHITE,
    borderWidth: 1,
    borderColor: COLORS.BORDER_NEUTRAL,
    borderRadius: 8,
    position: 'absolute',
    top: sizeScale(60),
    left: sizeScale(60),
    padding: sizeScale(4),
  },
});
