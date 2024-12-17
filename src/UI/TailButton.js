import React from 'react'

export default function TailButton({caption, color, handleClick, size}) {
  const btColor = {
    'blue': 'bg-blue-500' ,
    'orange' : 'bg-orange-500' ,
    'green' : 'bg-green-500',
    'darkblue': 'bg-blue-900'
  }
  const btColorHover = {
    'blue': 'hover:bg-blue-800' ,
    'orange' : 'hover:bg-orange-800',
    'green' : 'hover:bg-green-800'

  }
  return (
    <button className={`inline-flex justify-center items-center
                       ${btColor[color]}
                       ${btColorHover[color]}
                       font-bold text-white rounded-md
                       ${size ? size : ''}
                        p-3 mx-2
                       `}
                       onClick={handleClick}
                       >
      {caption}
    </button>
  )
}
