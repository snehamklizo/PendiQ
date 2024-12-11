import React from 'react'
import { IoMdInformationCircleOutline } from "react-icons/io"

const TopTaskCompleter = () => {
    const growth = 15;
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <div className="grid grid-cols-3 gap-2 items-start">
        <div className="col-span-2">
          <div className="flex items-center gap-1 mb-1">
            <h6 className="text-md text-gray-500 font-medium">TaskAce</h6>
            <div className="tooltip tooltip-primary" data-tip="The person who completed the most tasks">
            <IoMdInformationCircleOutline className="text-gray-500 text-md" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold">Hart Hagerty</h2>
          <p className={`text-sm ${growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {growth > 0 ? '+' : ''}{growth} task ahead of you
          </p>
        </div>
        <div className="w-full h-100 flex justify-end">
            <div className="avatar">
                <div className="w-20 rounded">
                    <img src="https://img.daisyui.com/images/profile/demo/2@94.webp" />
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default TopTaskCompleter