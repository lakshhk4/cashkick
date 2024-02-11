"use client";

import Image from "next/image";
import Header from "../../component/header";
import { useEffect, useState } from "react";
import SearchPlayer from "../../component/SearchPlayer";

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [isSellMode, setIsSellMode] = useState(false);
  const [units, setUnits] = useState(1);
  const [incrementError, setIncrementError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/user");

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const jsonData = await res.json();
      setUserData(jsonData);
    } catch (error) {
      console.error(error);
      // Handle the error as needed
    }
    console.log(userData);
  };

  const searchPlayer = async (playerName) => {
    try {
      const response = await fetch("http://localhost:8000/search/player", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ player_name: playerName }),
      });

      if (response.ok) {
        const playerData = await response.json();
        setSearchResult(playerData);
        setIsSellMode(false);
        setUnits(1);
      } else {
        console.error("Failed to fetch player data");
        setSearchResult(null);
      }
    } catch (error) {
      console.error("Error during search:", error);
      setSearchResult(null);
    }
  };

  const handleSell = async () => {
    if (searchResult && userData) {
      const newBudget = parseInt(searchResult.cost) + userData.budget; // replace 'cost' with the actual property name

      console.info(newBudget);

      try {
        const response = await fetch("http://localhost:8000/sell/player", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            player_details: searchResult,
            budget: newBudget,
          }),
        });

        if (response.ok) {
          // Update the local state by removing the sold player
          // setUserData({
          //   ...userData,
          //   players: userData.players.filter(
          //     (player) => player !== searchResult
          //   ),
          //   budget: userData.budget + playerPrice,
          // });

          fetchData();

          setSearchResult(null);
          setIsSellMode(false);
          console.log("Sell successful!");
        } else {
          console.error("Failed to sell player");
          console.error(response);
        }
      } catch (error) {
        console.error("Error during sell:", error);
      }
    }
  };

  const handleBuy = async () => {
    if (searchResult && userData) {
      const playerCost = searchResult.cost * units; // replace 'cost' with the actual property name
      const remainingBudget = userData.budget - playerCost;

      if (remainingBudget >= 0) {
        // If the user has enough budget, send update request
        try {
          const response = await fetch("http://localhost:8000/buy/player", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              player_details: searchResult,
              cost: playerCost,
              remaining_budget: remainingBudget,
              units: units,
            }),
          });

          if (response.ok) {
            // Update the local state with the new budget
            // setUserData({
            //   ...userData,
            //   budget: remainingBudget,
            //   players: [...(userData.players || []), searchResult.player_details],
            // });

            fetchData();

            console.log("Purchase successful!");
          } else {
            console.error("Failed to update user data");
            console.error(response);
          }
        } catch (error) {
          console.error("Error during purchase:", error);
        }
      } else {
        console.log("Not enough budget to make the purchase");
      }
    }
  };

  if (!userData) {
    // Data is still loading, return loading indicator or something
    return <div>Loading...</div>;
  }

  const handlePlayerItemClick = (item) => {
    console.log(item);
    setSearchResult(item);
    setIsSellMode(true);
    setUnits(item.units)
  };

  const handleIncrement = () => {
    if (!isSellMode || units < searchResult.units) {
      setUnits((prevUnits) => prevUnits + 1);
      if (incrementError) setIncrementError(false);
    } else {
      setIncrementError(true);
    }
  };
  
  const handleDecrement = () => {
    if (units > 1) {
      setUnits((prevUnits) => prevUnits - 1);
      if (incrementError) setIncrementError(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-start p-24">
      <div className="flex flex-row w-full justify-between items-center">
        <span className="text-2xl font-semibold items-start">
          Welcome Back, {userData.name}
        </span>
      </div>

      <div className="h-[0.5px] w-full bg-slate-500 mt-8"></div>

      <div className="grid grid-cols-2 w-full justify-between py-12">
        <div className="flex flex-col items-start">
          <div className="flex flex-row justify-between w-full">
            <span className="text-xl font-semibold">My Portfolio</span>
            <span className="text-xl font-semibold">Today's Performance</span>
          </div>

          <div className="flex flex-row justify-between w-full">
            <span className="text-5xl font-bold mt-4">${userData.budget}</span>
            <span className="text-5xl font-bold mt-4 text-green-500">9.3%</span>
          </div>

          <span className="text-xl font-bold mt-12">Top Players</span>

          {userData.players.map((player, index) => {
            return (
              <div
                key={index}
                className="bg-slate-900 w-full flex flex-row justify-between items-center mt-2 p-4 rounded-md"
                onClick={() => handlePlayerItemClick(player)}
              >
                <div className="flex flex-row items-center">
                  <Image
                    src={player.url}
                    alt={player.name}
                    height={40}
                    width={40}
                    className="rounded-full aspect-square object-cover"
                  ></Image>
                  <span className="ms-3 text-2xl">{player.name}</span>
                  <span className="ms-3 text-xl">{player.rating}</span>
                </div>
                <span className="ms-3 text-xl">{player.units}</span>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col items-start px-16">
          <SearchPlayer onSearch={searchPlayer} />

          {searchResult ? (
            <div className="flex flex-col items-center w-full px-20 py-10">
              <div className="flex flex-row w-full justify-between">
                <span className="text-4xl">{searchResult.name}</span>
                <span className="text-4xl font-bold">
                  {searchResult.rating}
                </span>
              </div>

              <span className="w-full text-left text-2xl mt-4">
                ${searchResult.cost}
              </span>

              <Image
                src={searchResult.url}
                alt={searchResult.name}
                height={80}
                width={80}
                className="rounded-full aspect-square object-cover"
              ></Image>

              <div className="flex flex-col items-center mt-8">
                <span className="text-2xl">Units</span>
                <div className="flex items-center mt-2">
                  <button
                    onClick={handleDecrement}
                    className="bg-gray-800 px-4 py-2 rounded-l"
                  >
                    -
                  </button>
                  <span className="bg-gray-600 px-4 py-2">{units}</span>
                  <button
                    onClick={handleIncrement}
                    className="bg-gray-800 px-4 py-2 rounded-r"
                  >
                    +
                  </button>
                </div>
              </div>

              {incrementError && <p>Cannot sell more stocks than you own</p>}

              {isSellMode ? (
                <button
                  onClick={handleSell}
                  className="w-1/2 rounded-xl bg-red-500 p-4 mt-8"
                >
                  <span className="text-2xl">Sell</span>
                </button>
              ) : (
                <button
                  onClick={handleBuy}
                  disabled={searchResult.cost > userData.budget}
                  className="w-1/2 rounded-xl bg-green-500 p-4 mt-8"
                >
                  <span className="text-2xl">Buy</span>
                </button>
              )}

              {searchResult.cost * units > userData.budget && !isSellMode && (
                <p>Cannot afford to buy this player with the current budget.</p>
              )}
            </div>
          ) : (
            <div className="mt-20">
              Select an existing player to view their details or search for a
              new player
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
