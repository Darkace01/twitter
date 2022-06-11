import Image from 'next/image';
import React from 'react';
import { Tweet } from '../typings';
import TimeAgo from 'react-timeago';
import {
  ChatAlt2Icon,
  HeartIcon,
  SwitchHorizontalIcon,
  UploadIcon,
} from '@heroicons/react/outline';

interface Props {
  tweet: Tweet;
}
function Tweet({ tweet }: Props) {
  return (
    <div className='flex flex-col space-x-3 border-y p-5 border-gray-100'>
      <div className='flex space-x-3 '>
        <div className='relative h-10 w-10'>
          <Image
            src={tweet.profileImg}
            objectFit='cover'
            layout='fill'
            className='rounded-full'
            alt={tweet.username}
          />
        </div>
        <div>
          <div className='flex items-center space-x-1'>
            <p className='mr-1'>{tweet.username}</p>
            <p className='hidden text-sm text-gray-500 sm:inline'>
              @{tweet.username.replace(/\s+/g, '').toLowerCase()} ·
            </p>
            <TimeAgo
              className='text-sm text-gray-500'
              date={tweet._createdAt}
            />
          </div>
          <p className='pt-1'>{tweet.text}</p>
          {tweet.image && (
            <div className='relative m-5 ml-0 mb-1 max-h-60 min-h-[10rem] w-full'>
              <Image
                src={tweet.image}
                objectFit='cover'
                layout='fill'
                className='rounded-lg shadow-sm'
                alt={tweet.text}
              />
            </div>
          )}
        </div>
      </div>
      <div className='mt-5 flex justify-between'>
        <div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
          <ChatAlt2Icon className='h-5 w-5' />
          <p>5</p>
        </div>
        <div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
          <SwitchHorizontalIcon className='h-5 w-5' />
        </div>
        <div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
          <HeartIcon className='h-5 w-5' />
        </div>
        <div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
          <UploadIcon className='h-5 w-5' />
        </div>
      </div>
    </div>
  );
}

export default Tweet;
