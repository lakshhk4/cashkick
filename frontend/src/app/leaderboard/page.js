import { Table } from "flowbite-react";

const Leaderboard = () => {
  return (
    <div className="grid grid-cols-2 mt-20">
      <div className="flex flex-col items-center px-20">
        <span className="text-4xl font-semibold">Global Leaderboard</span>
        <Table className="table-fixed mt-10 text-xl">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3"> Wealth</th>
              <th scope="col" className="px-6 py-3">Liquidity</th>
            </tr>
            
          </thead>
          <tbody>
              <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6">Ayush</td>
                <td className="px-6">20,000,000</td>
                <td className="px-6">15,000,000</td>
              </tr>
              <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6">Siddhant</td>
                <td className="px-6">13,000,000</td>
                <td className="px-6">9,000,000</td>
              </tr>
              <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6">Lakshh</td>
                <td className="px-6">12,000,000</td>
                <td className="px-6">3,000,000</td>
              </tr>
              <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6">Bajo</td>
                <td className="px-6">11,000,000</td>
                <td className="px-6">10,000,000</td>
              </tr>
            </tbody>
        </Table>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-4xl font-semibold">My Private League</span>
        <button className="bg-white mt-4 text-black py-2 px-6 rounded-xl">Add friends to my league</button>
        <Table className="table-fixed mt-10 text-xl">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3"> Wealth</th>
              <th scope="col" className="px-6 py-3">Liquidity</th>
            </tr>
            
          </thead>
          <tbody>
              <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6">Ayush</td>
                <td className="px-6">20,000,000</td>
                <td className="px-6">15,000,000</td>
              </tr>
              <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6">Siddhant</td>
                <td className="px-6">13,000,000</td>
                <td className="px-6">9,000,000</td>
              </tr>
              
            </tbody>
        </Table>

        
      </div>
    </div>
  );
};

export default Leaderboard;
