import React from 'react'
import { IoArrowUpOutline, IoArrowDownOutline } from "react-icons/io5";
const TaskTable = () => {
  // Add table data array
  const tableData = [
    {
      rank: 1,
      name: "Hart Hagerty",
      country: "United States",
      avatar: "https://img.daisyui.com/images/profile/demo/2@94.webp",
      task_completed: 300,
      task_pending: 4,
      rank_crossed: 3,
      rank_increased: true,
    },
    {
      rank: 2,
      name: "Brice Swyre",
      country: "China",
      avatar: "https://img.daisyui.com/images/profile/demo/3@94.webp",
      task_completed: 250,
      task_pending: 7,
      rank_crossed: 3,
      rank_increased: false,
    },
    {
      rank: 3,
      name: "Marjy Ferencz",
      country: "Russia",
      avatar: "https://img.daisyui.com/images/profile/demo/4@94.webp",
      task_completed: 220,
      task_pending: 10,
      rank_crossed: 0,
      rank_increased: false,
    },
    {
      rank: 4,
      name: "Yancy Tear",
      country: "Brazil",
      avatar: "https://img.daisyui.com/images/profile/demo/5@94.webp",
      task_completed: 220,
      task_pending: 10,
      rank_crossed: 0,
      rank_increased: false,
    },
  ];

  return (
    <div className='w-full'>
      <h1 className='text-xl font-bold mb-2 md:mb-6'>Task Table</h1>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Task completed</th>
              <th>Pending Tasks</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.rank}>
                <td className='font-bold'>{row.rank}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img src={row.avatar} alt="Avatar" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{row.name}</div>
                      <div className="text-sm opacity-50">{row.country}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {row.company}
                  <br />
                  <span className="">{row.task_completed}</span>
                </td>
                <td>{row.task_pending}</td>
                <th>
                    {row?.rank_crossed !== 0 ? 
                    <span className="badge badge-ghost badge-sm">
                        <span className={`${row.rank_increased ? 'text-green-500' : 'text-red-500'}`}>
                        {row.rank_increased ? <IoArrowUpOutline /> : <IoArrowDownOutline /> }
                        </span>
                        <span className={`${row.rank_increased ? 'text-green-500' : 'text-red-500'}`}>
                        {row.rank_crossed}
                        </span>
                    </span>
                    : '-'
                    }
                </th>
              </tr>
            ))}
            <tr className='active'>
                <td className='font-bold'>510</td>
                <td>
                    <div className="flex items-center gap-3">
                        <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12">
                             <img src="https://img.daisyui.com/images/profile/demo/5@94.webp" alt="Avatar" />
                            </div>
                        </div>
                        <div>
                            <div className="font-bold">John Doe</div>
                            <div className="text-sm opacity-50">United States</div>
                        </div>
                    </div>
                </td>
                <td>100</td>
                <td>3</td>
                <td>
                    <span className="badge badge-ghost badge-sm">
                        <span className="text-red-500">
                            <IoArrowDownOutline />
                        </span>
                        <span className="text-red-500">
                            {2}
                        </span>
                    </span>
                </td>
            </tr>
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Task completed</th>
              <th>Pending Tasks</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default TaskTable