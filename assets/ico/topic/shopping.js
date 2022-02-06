import React from 'react'
import { Svg, Path, Defs, Pattern, Use, Image } from 'react-native-svg'

export default function ShoppingIco () {
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
