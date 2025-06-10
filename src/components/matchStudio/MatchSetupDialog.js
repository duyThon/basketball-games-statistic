import React, { useEffect, useState } from "react";
import teamAPI from "../../api/teamAPI";
import matchAPI from "../../api/matchAPI";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { setMatchInfo } from "../../store/matchSlide";

const MatchSetupDialog = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [season, setSeason] = useState("");
  const [gameType, setGameType] = useState("5v5");
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);

  const [teams, setTeams] = useState([]);
  const [showHomeDropdown, setShowHomeDropdown] = useState(false);
  const [showAwayDropdown, setShowAwayDropdown] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await teamAPI.getAllTeams();
        setTeams(res.data);
      } catch (err) {
        console.error("Failed to load teams", err);
      }
    };
    fetchTeams();
  }, []);

  const handleSubmit = async () => {
    if (!homeTeam || !awayTeam || homeTeam === awayTeam) {
      alert("Please select valid teams");
      return;
    } else {
      let data = {
        homeTeam: homeTeam,
        awayTeam,
      };
      try {
        const res = await matchAPI.createMatch({
          gameType,
          homeTeam,
          awayTeam,
          status: "Upcoming",
          date: "",
          videoUrl: [],
        });
        console.log(res.data);
        let matchId = res.data.id;
        if (matchId) {
          navigate(`/match-studio/${matchId}`, { replace: true }); // chuyển route mới
        }
      } catch (error) {
        console.error("Error creating match:", error);
      }
    }
    // dispatch(setMatchInfo({ season, gameType, homeTeam, awayTeam }));
    onClose();
  };

  const renderDropdown = (type) => {
    const isHome = type === "home";
    const selectedTeamId = isHome ? homeTeam : awayTeam;
    const setSelected = isHome ? setHomeTeam : setAwayTeam;
    const toggleDropdown = isHome
      ? () => setShowHomeDropdown(!showHomeDropdown)
      : () => setShowAwayDropdown(!showAwayDropdown);

    const filterTeams = isHome
      ? teams
      : teams.filter((team) => team._id !== homeTeam); // không cho chọn trùng

    const selectedTeam = teams.find((t) => t._id === selectedTeamId);

    return (
      <div className="relative w-full mb-4">
        <div
          className="border rounded p-2 flex justify-between items-center cursor-pointer hover:bg-gray-100"
          onClick={toggleDropdown}
        >
          {selectedTeam ? (
            <div className="flex items-center gap-2">
              <img
                src={selectedTeam.avatar}
                alt="avatar"
                className="w-6 h-6 rounded-full"
              />
              <span>{selectedTeam.name}</span>
            </div>
          ) : (
            <span className="text-gray-400">
              {isHome ? "Select Home Team" : "Select Away Team"}
            </span>
          )}
          <span>▼</span>
        </div>

        {(isHome ? showHomeDropdown : showAwayDropdown) && (
          <div className="absolute bg-white border rounded shadow w-full z-10 max-h-60 overflow-auto">
            {filterTeams.map((team) => (
              <div
                key={team._id}
                className="p-2 hover:bg-blue-100 cursor-pointer flex items-center gap-2"
                onClick={() => {
                  setSelected(team._id);
                  isHome
                    ? setShowHomeDropdown(false)
                    : setShowAwayDropdown(false);
                }}
              >
                <img
                  src={team.avatar}
                  alt={team.name}
                  className="w-6 h-6 rounded-full"
                />
                <span>{team.name}</span>
              </div>
            ))}

            <div
              className="p-2 hover:bg-green-100 cursor-pointer text-sm text-green-600 font-semibold border-t"
              // onClick={() => alert("Open Create New Team modal")}
            >
              ➕ Create new team
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Create New Match</h2>

        {/* Season */}
        {/* <label className="block text-sm font-medium">Season</label>
        <input
          type="text"
          className="w-full border p-2 rounded mb-4"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          placeholder="e.g. 2024-2025"
        /> */}

        {/* Match Type */}
        <label className="block text-sm font-medium">Match Type</label>
        <select
          className="w-full border p-2 rounded mb-4"
          value={gameType}
          onChange={(e) => setGameType(e.target.value)}
        >
          <option value="5v5">5v5</option>
          <option value="3v3">3v3</option>
        </select>

        {/* Dropdowns */}
        <label className="block text-sm font-medium">Home Team</label>
        {renderDropdown("home")}
        <label className="block text-sm font-medium">Away Team</label>
        {renderDropdown("away")}

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchSetupDialog;
