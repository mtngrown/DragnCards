import React from "react";
import { useSelector } from 'react-redux';
import { SideBarRoundStep } from "./SideBarRoundStep";

export const SideBarPhase = React.memo(({
  playerN,
  gameBroadcast,
  chatBroadcast,
  phaseInfo,
}) => {
  const phaseStore = state => state?.gameUi?.game?.phase;
  const currentPhase = useSelector(phaseStore);
  console.log("Rendering SideBarPhase", currentPhase, phaseInfo.name);
  const isPhase = phaseInfo.name === currentPhase;
  return (
    <div 
      className={"relative text-center select-none text-gray-100"}
      style={{height: phaseInfo.height, maxHeight: phaseInfo.height, borderBottom: (phaseInfo.phase === "End") ? "" : "1px solid"}}
    >
      <div
        className={`absolute h-full ${isPhase ? "bg-red-800" : ""}`}
        style={{width:"24px", writingMode:"vertical-rl"}} 
      >
        {phaseInfo.label}
      </div>
      <div className="w-full h-full text-sm flex flex-col float-left">
        {phaseInfo.steps.map((step, _stepIndex) => {
          return (
            <SideBarRoundStep
              playerN={playerN}
              phase={phaseInfo.name}
              stepInfo={step}
              gameBroadcast={gameBroadcast}
              chatBroadcast={chatBroadcast}
            />
          )
        })}
      </div>
    </div>
  )
})