import React from 'react';

const GamesList = ({ gamesList, isGamesLoading, searchQuery }) => {
  // Filter games berdasarkan pencarian
  const filteredGames = gamesList.filter(game => {
    return (
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (isGamesLoading) {
    return <div className="p-4 text-center text-gray-500">Memuat data games...</div>;
  }

  if (filteredGames.length === 0) {
    return <div className="p-4 text-center text-gray-500">Game tidak ditemukan</div>;
  }

  return (
    <div className="divide-y divide-gray-100 px-2">
      {filteredGames.map((game, index) => (
        <div key={index} className="p-4 hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-700 rounded-[6px] mr-3">
                <i className={game.icon}></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{game.title}</h3>
                <p className="text-[12px] text-gray-600">
                  {game.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GamesList;