import React from 'react'
import { Svg, Path, Defs, Pattern, Use, Image } from 'react-native-svg'

export default function TravelIco () {
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
