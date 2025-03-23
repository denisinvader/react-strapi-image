import { ComponentPropsWithRef, memo } from 'react';

export interface StrapiImageImgProps extends ComponentPropsWithRef<'img'> {
}

export const StrapiImageImg = memo(function StrapiImageImg({
  ...props
}: StrapiImageImgProps) {
  return (
    <img
      {...props}
    />
  );
});

StrapiImageImg.displayName = 'StrapiImageImg';
