import React from 'react'
// import { Svg, G, Path, Defs, Filter, FeFlood, FeGaussianBlur, FeComposite, FeBlend,Circle } from 'react-native-svg';
// import Svg, {
//   Circle,
//   Ellipse,
//   G,
//   Text,
//   TSpan,
//   TextPath,
//   Path,
//   Polygon,
//   Polyline,
//   Line,
//   Rect,
//   Use,
//   Image,
//   Symbol,
//   Defs,
//   LinearGradient,
//   RadialGradient,
//   Stop,
//   ClipPath,
//   Pattern,
//   Mask,
// } from 'react-native-svg';

// export default function SwitchCameraIco({ tintColor }) {
//   return (
//     // <Svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
//     //   <G filter="url(#filter0_b)">
//     //     <Path d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z" fill="black" fill-opacity="0.24" />
//     //     <Path d="M13.2734 27.5625H26.7266C28.3594 27.5625 29.1797 26.75 29.1797 25.1406V16.9609C29.1797 15.3516 28.3594 14.5469 26.7266 14.5469H24.9062C24.2969 14.5469 24.1016 14.4219 23.7578 14.0313L23.125 13.3281C22.7344 12.8984 22.3359 12.6641 21.5312 12.6641H18.4141C17.6094 12.6641 17.2109 12.8984 16.8203 13.3281L16.1953 14.0313C15.8516 14.4141 15.6562 14.5469 15.0469 14.5469H13.2734C11.6406 14.5469 10.8203 15.3516 10.8203 16.9609V25.1406C10.8203 26.75 11.6406 27.5625 13.2734 27.5625ZM23.3125 23.3125L21.8359 21.375C21.6328 21.1094 21.7656 20.7656 22.0859 20.7656H23.1406C23.1406 18.8594 21.8359 17.5313 20 17.5313C19.4219 17.5313 18.9453 17.6719 18.4766 17.9297C17.9453 18.1875 17.5391 17.8828 17.5391 17.5C17.5391 17.3125 17.625 17.1016 17.8516 16.9609C18.3516 16.6563 19.1328 16.3906 20 16.3906C22.4922 16.3906 24.2891 18.2031 24.2891 20.7656H25.2266C25.5469 20.7656 25.6641 21.1016 25.4531 21.375L23.9844 23.3125C23.8203 23.5313 23.4922 23.5391 23.3125 23.3125ZM20 24.9766C17.5078 24.9766 15.7031 23.0781 15.7031 20.6016H14.7734C14.4531 20.6016 14.3359 20.2578 14.5391 19.9844L16.0234 18.0469C16.1875 17.8359 16.5078 17.8203 16.6875 18.0469L18.1641 19.9844C18.3672 20.2578 18.2344 20.6016 17.9062 20.6016H16.8594C16.8594 22.4141 18.1562 23.8281 20 23.8281C20.5859 23.8281 21.0547 23.6875 21.5156 23.4375C22.0625 23.1641 22.4531 23.4922 22.4531 23.8906C22.4531 24.0781 22.3594 24.2578 22.1484 24.4063C21.6484 24.7266 20.8594 24.9766 20 24.9766Z" fill="white" />
//     //   </G>
//     //   <Defs>
//     //     <Filter id="filter0_b" x="-16" y="-16" width="72" height="72" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
//     //       <FeFlood flood-opacity="0" result="BackgroundImageFix" />
//     //       <FeGaussianBlur in="BackgroundImage" stdDeviation="8" />
//     //       <FeComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
//     //       <FeBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
//     //     </Filter>
//     //   </Defs>
//     // </Svg>
//     <Svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <G filter="url(#filter0_b)">
//         <Circle cx="15" cy="15" r="15" fill="black" fill-opacity="0.24" />
//       </G>
//       <Defs>
//         <Filter id="filter0_b" x="-4" y="-4" width="38" height="38" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
//           <FeFlood flood-opacity="0" result="BackgroundImageFix" />
//           <FeGaussianBlur in="BackgroundImage" stdDeviation="2" />
//           <FeComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
//           <FeBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
//         </Filter>
//       </Defs>
//     </Svg>

//   )
// }

import { SvgUri } from 'react-native-svg'
import testSvg from './test.svg'
export default () => (
  <SvgUri
    width='100'
    height='100'
    svgXmlData={testSvg}
  />
)
