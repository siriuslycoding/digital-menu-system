import React from 'react'
import veg from '../assets/Veg_symbol.svg'
import coffee from '../assets/coffee.svg'

const MenuItem = () => {
    return (
        <div className='m-3 p-2 border-b'>
            <div className="flex items-center gap-4 ">
                <img src={veg} alt="Veg" className="w-7 h-7" />
                <p className="font-semibold text-xl flex-1">Name</p>
                <p className="text-lg mr-4">₹Price</p>
                <button className="bg-green-600 px-2 p-1 rounded-full text-lg hover:bg-green-700 transition">
                    +
                </button>
            </div>
            <div className='flex flex-row mt-1'>
                <p className='flex-1'>Description</p>
                <img src={coffee} alt="item img" className='w-10 h-10' />
            </div>

        </div>
    )
}

export default MenuItem