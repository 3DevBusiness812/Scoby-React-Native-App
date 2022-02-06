import React from 'react'
import { Svg, Path, Defs, Pattern, Use, Image } from 'react-native-svg'

export default function MediaIco () {
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
