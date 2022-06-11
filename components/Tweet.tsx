import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { Comment, CommentBody, Tweet } from '../typings';
import TimeAgo from 'react-timeago';
import {
  ChatAlt2Icon,
  HeartIcon,
  SwitchHorizontalIcon,
  UploadIcon,
} from '@heroicons/react/outline';
import { fetchComments } from '../utils/fetchComments';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface Props {
  tweet: Tweet;
}
function Tweet({ tweet }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBoxVisible, setCommentBoxVisible] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [isRefreshingComments, setIsRefreshingComments] =
    useState<boolean>(false);
  const refreshComments = async () => {
    const comments: Comment[] = await fetchComments(tweet._id);
    setComments(comments);
  };
  const { data: session } = useSession();
  useEffect(() => {
    refreshComments();
  }, []);

  useEffect(() => {
    refreshComments();
    setIsRefreshingComments(false);
  }, [isRefreshingComments]);

  const postComment = async () => {
    const commentBody: CommentBody = {
      comment: input,
      username: session?.user?.name || 'Unknown User',
      profileImg: session?.user?.image || 'https://links.papareact.com/gll',
      tweetId: tweet._id,
    };
    const result = await fetch('/api/addComment', {
      body: JSON.stringify(commentBody),
      method: 'POST',
    });

    const json = await result.json();

    toast('Comment Posted', {
      icon: '🕊️',
    });
    return json;
  };

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postComment();
    setIsRefreshingComments(true);
    setInput('');
    setCommentBoxVisible(false);
  };

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
        <div className='flex flex-col flex-1'>
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
            <div className='relative m-5 ml-0 mb-1 max-h-60 min-h-[10rem] lg:min-h-[15rem] w-full'>
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
        <div
          className='flex cursor-pointer items-center space-x-3 text-gray-400'
          onClick={() => session && setCommentBoxVisible(!commentBoxVisible)}
        >
          <ChatAlt2Icon className='h-5 w-5' />
          <p>{comments?.length}</p>
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
      {/* TODO: Comment box logic */}
      {commentBoxVisible && (
        <form className='mt-3 flex space-x-3' onSubmit={handleComment}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type='text'
            placeholder='Write a comment...'
            className='flex-1 rounded-lg bg-gray-100 p-2 outline-none'
          />
          <button
            className='text-twitter disabled:text-gray-200'
            disabled={!input}
            type='submit'
          >
            Post
          </button>
        </form>
      )}
      {comments?.length > 0 && (
        <div className='my-2 mt-5 max-h-44 space-y-5 overflow-y-scroll border-t border-gray-100 p-5 scrollbar-hide'>
          {comments?.map((comment) => (
            <div key={comment._id} className='relative flex space-x-2'>
              <hr className='absolute left-5 top-10 h-8 border-x border-twitter/30' />
              <div className='relative h-7 w-7 mt-2'>
                <Image
                  src={comment.profileImg}
                  objectFit='cover'
                  layout='fill'
                  className='rounded-full'
                  alt={comment.username}
                />
              </div>
              <div>
                <div className='flex items-center space-x-1'>
                  <p className='mr-1 font-bold'>{comment.username}</p>
                  <p className='hidden text-sm text-gray-500 lg:inline'>
                    @{comment.username.replace(/\s+/g, '').toLowerCase()} ·
                  </p>
                  <TimeAgo
                    className='text-sm text-gray-500'
                    date={comment._createdAt}
                  />
                </div>
                <p>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tweet;
