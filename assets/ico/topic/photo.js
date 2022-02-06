import React from 'react'
import { Svg, Path, Defs, Pattern, Use, Image } from 'react-native-svg'

export default function PhotoIco () {
  return (
    <Svg width='18' height='19' viewBox='0 0 18 19' fill='none' xmlns='http://www.w3.org/2000/svg' xlink='http://www.w3.org/1999/xlink'>
      <Path d='M0 18.26H18V0.26H0V18.26Z' fill='url(#pattern0)' />
      <Defs>
        <Pattern id='pattern0' patternContentUnits='objectBoundingBox' width='1' height='1'>
          <Use href='#image0' transform='scale(0.015625)' />
        </Pattern>
        <Image id='image0' width='64' height='64' href='data:image/png;base64,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' />
      </Defs>
    </Svg>

  )
}
