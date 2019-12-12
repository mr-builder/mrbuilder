import React from 'react';
import './tailwind.twcss';

export default () => {
  const [count, setCount] = React.useState(0);

  const updateCount = () => {
    setCount(count + 1);
  };

  return (
    <div className='md:flex p-5'>
      <div className='md:flex-shrink-0'>
        <img
          className='rounded-lg md:w-56'
          src='https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=448&q=80'
          alt='Woman paying for a purchase'
        />
      </div>
      <div className='mt-4 md:mt-0 md:ml-6'>
        <div className='uppercase tracking-wide text-sm text-indigo-600 font-bold'>
          Marketing
        </div>
        <a
          href='#'
          className='block mt-1 text-lg leading-tight font-semibold text-gray-900 hover:underline'
        >
          Finding customers for your new business
        </a>
        <p className='mt-2 text-gray-600'>
          Getting a new business off the ground is a lot of hard work. Here are
          five ideas you can use to find your first customers.
        </p>
        <button className={`btn btn-gnarly w-full mt-3`} onClick={updateCount}>
          Add: {count}
        </button>
        <button
          className={`border border-custom-red bg-indigo-600 p-2 text-white mt-3 w-full`}
          onClick={() => {
            setCount(count + 1);
          }}
        >
          Add: {count}
        </button>
        <button
          className={`btn my-3 w-full`}
          onClick={() => {
            setCount(0);
          }}
        >
          Reset
        </button>
        <div className='text-custom-red'>
          And this text color is custom red!
        </div>
      </div>
    </div>
  );
};
