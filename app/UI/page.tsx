import React from 'react'

const TestPage = () => {
    return (
        <>
            {/* <div className='min-h-screen min-w-screen bg-gray-300 flex items-center justify-center'> */}
            <div className='grid place-items-center h-screen bg-gray-500 '>
                <button
                    className="group relative px-10 py-2 rounded shadow-sm ring-1 ring-black/10 cursor-pointer
             hover:bg-black hover:text-white hover:shadow-lg
             transition-all duration-300 ease-out
             active:scale-95"
                >
                    Subscribe

                    {/* Star Icon */}
                    <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400
               opacity-0 group-active:opacity-100
               group-active:-translate-y-12
               transition-all duration-500 ease-out"
                    >
                        ⭐
                    </span>
                </button>
                <p className='text-6xl text-neutral-700 text-shadow-black/10 text-shadow-lg tracking-tight'>Hello world</p>


            </div>
        </>
    )
}

export default TestPage