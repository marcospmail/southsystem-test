import React, { ImgHTMLAttributes, useState } from 'react'

import fallbackImg from '../../assets/fallback-image.png'

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
}

const Image: React.FC<ImageProps> = ({
  src,
  fallbackSrc = fallbackImg,
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState(src)
  const [fallbackOn, setFallbackOn] = useState(false)

  return (
    <img
      src={imgSrc}
      className={imgSrc === fallbackSrc ? 'fallback' : undefined}
      onError={() => {
        setFallbackOn(true)
        setImgSrc(fallbackSrc)
      }}
      {...rest}
    />
  )
}

export default Image
