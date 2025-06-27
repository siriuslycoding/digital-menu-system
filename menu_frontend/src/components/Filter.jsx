import React, { useState } from 'react'

function Price({ value }) {
    return value &&
        <div>
            <p>123</p>
        </div>
}

function Sections({ value }) {
    return value &&
        <div>
            <p>456</p>
        </div>
}

function Vnv({ value }) {
    return value &&
        <div>
            <p>789</p>
        </div>
}

function Cspec({ value }) {
    return value &&
        <div>
            <p>012</p>
        </div>
}

function Avl({ value }) {
    return value &&
        <div>
            <p>345</p>
        </div>
}

const Filter = () => {
    const [select, setSelect] = useState(Array(5).fill(false));
    function handleClick(i) {
        const nextSelect = select.slice().fill(false);
        nextSelect[i] = true;
        setSelect(nextSelect);
    }

    return (
        <>
            <div className="fixed inset-0 z-40 bg-opacity-30 backdrop-blur-sm"></div>
            <div className="fixed inset-5 top-40 z-40 text-orange-900 bg-white rounded-xl shadow-xl p-2 h-fit">
                <div className='flex flex-row gap-6'>
                    <div className='flex flex-col w-1/3'>
                        <p className=''>Sort by</p>
                        <button onClick={() => handleClick(0)} className='cursor-pointer mt-1 p-2 border-2 rounded-2xl text-sm'>Price</button>
                        <button onClick={() => handleClick(1)} className='cursor-pointer mt-1 p-2 border-2 rounded-2xl text-sm'>Sections</button>
                        <button onClick={() => handleClick(2)} className='cursor-pointer mt-1 p-2 border-2 rounded-2xl text-sm'>Veg/Non-veg</button>
                        <button onClick={() => handleClick(3)} className='cursor-pointer mt-1 p-2 border-2 rounded-2xl text-sm'>Chef's Special</button>
                        <button onClick={() => handleClick(4)} className='cursor-pointer mt-1 p-2 border-2 rounded-2xl text-sm'>Available Now</button>
                    </div>

                    <div className='mt-6'>
                        <Price value={select[0]} />
                        <Sections value={select[1]} />
                        <Vnv value={select[2]} />
                        <Cspec value={select[3]} />
                        <Avl value={select[4]} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Filter
