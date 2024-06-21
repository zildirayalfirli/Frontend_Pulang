import React from 'react';
import closebutton from "../../assets/x.svg";

export default function Modal({ title, children, onClose }) {
  return (
    <div className='fixed z-10 inset-0 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity' aria-hidden='true'>
          <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
        </div>
        <span className='inline-block align-middle h-screen' aria-hidden='true'>&#8203;</span>
        <div className='inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle max-w-md w-full'>
          <div className='bg-white px-4 py-4 w-full flex flex-col justify-center items-center'>
            <div className='w-full mt-4 mr-8 flex justify-end cursor-pointer'>
              <img onClick={onClose} src={closebutton} alt="input" className="scale-150" />
            </div>
            <div className='w-full flex flex-col justify-center items-center'>
              <div className='mt-3 text-left flex w-full justify-center'>
                <h3 className='text-lg leading-6 font-medium text-gray-900' id='modal-title'>{title}</h3>
                <div className='mt-2'>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
