import React from 'react'
import { Skeleton } from './ui/skeleton'

export function LoadImage() {
  return (
    <div className='flex flex-col space-y-3 items-center'>
        <Skeleton className='h-[350px] w-[450px] rounded-xl' />
        <Skeleton className='h-[50px] w-[110px] rounded-xl' />
    </div>
  )
}
