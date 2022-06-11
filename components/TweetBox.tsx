import Image from 'next/image';
import {
  CalendarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  SearchCircleIcon,
} from '@heroicons/react/outline';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Tweet, TweetBody } from '../typings';
import { fetchTweets } from '../utils/fetchTweets';
import toast from 'react-hot-toast';

interface Props {
  setTweets: Dispatch<SetStateAction<Tweet[]>>;
}
function TweetBox({ setTweets }: Props) {
  const [input, setInput] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageUrlBoxIsOpen, setImageUrlBoxIsOpen] = useState<boolean>(false);
  const { data: session } = useSession();

  const addImageToTweet = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!imageInputRef.current?.value) return;
    setImage(imageInputRef.current.value);
    imageInputRef.current.value = '';
    setImageUrlBoxIsOpen(false);
  };
  const postTweet = async () => {
    const tweetBody: TweetBody = {
      text: input,
      username: session?.user?.name || 'Unknown User',
      profileImg: session?.user?.image || 'https://links.papareact.com/gll',
      image,
    };
    const result = await fetch('/api/addTweet', {
      body: JSON.stringify(tweetBody),
      method: 'POST',
    });

    const json = await result.json();

    const newTweets = await fetchTweets();
    setTweets(newTweets);

    toast('Tweet Posted', {
      icon: '🕊️',
    });
    return json;
  };
  const handleSubmit = (
    e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    postTweet();
    setInput('');
    setImage('');
    setImageUrlBoxIsOpen(false);
  };
  return (
    <div className='flex space-x-2 p-5'>
      <div className='h-14 w-14 relative mt-4'>
        <Image
          src={session?.user?.image || 'https://links.papareact.com/gll'}
          objectFit='cover'
          layout='fill'
          alt='User Name'
          className='rounded-full'
        />
      </div>
      <div className='flex flex-1 items-center pl-2'>
        <form action='' className='flex flex-1 flex-col'>
          <input
            type='text'
            placeholder="What's happening?"
            className='h-24 w-full text-xl outline-none placeholder:text-xl'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className='flex items-center'>
            <div className='flex flex-1  space-x-2 text-twitter'>
              <PhotographIcon
                onClick={() => setImageUrlBoxIsOpen(!imageUrlBoxIsOpen)}
                className='h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150'
              />
              <SearchCircleIcon className='h-5 w-5' />
              <EmojiHappyIcon className='h-5 w-5' />
              <CalendarIcon className='h-5 w-5' />
              <LocationMarkerIcon className='h-5 w-5' />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!input || !session}
              className='bg-twitter px-5 py-2 font-bold text-white rounded-full disabled:opacity-40 disabled:cursor-not-allowed'
            >
              Tweet
            </button>
          </div>
          {imageUrlBoxIsOpen && (
            <form className='mt-5 flex rounded-lg bg-twitter/80 py-2 px-3'>
              <input
                ref={imageInputRef}
                type='text'
                placeholder='Enter Image URL...'
                className='flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white'
              />
              <button
                type='submit'
                onClick={addImageToTweet}
                className='font-bold text-white'
              >
                Add Image
              </button>
            </form>
          )}
          {image && (
            <div className='relative mt-10 h-40'>
              <Image
                src={image}
                objectFit='cover'
                layout='fill'
                alt='Tweet'
                className='rounded-xl shadow-lg'
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default TweetBox;
