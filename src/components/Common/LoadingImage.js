import React from 'react';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';

const Image = createImageProgress(FastImage);

export const LoadingImage = props => {
  const {style, ...rest} = props;
  return <Image {...rest} style={[style, {overflow: 'hidden'}]} />;
};
