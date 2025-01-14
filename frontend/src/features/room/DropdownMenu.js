import React, { useState, useEffect } from "react";
import { DropdownMenuCommon } from "./DropdownMenuCommon";
import { useMousePosition } from "../../contexts/MousePositionContext";
import { useDropdownMenu, useSetDropdownMenu } from "../../contexts/DropdownMenuContext";

import "../../css/custom-dropdown.css";

export const DropdownMenu = React.memo(({
  playerN,
  gameBroadcast,
  chatBroadcast,
}) => {
  const mousePosition = useMousePosition();
  const dropdownMenu = useDropdownMenu();
  const setDropdownMenu = useSetDropdownMenu();
  
  const [isHovering, setIsHovering] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isOpen, setIsOpen] = useState(false);  
  console.log("Rendering DropdownMenu ", isHovering, playerN);

  useEffect(() => {

    const handleClick = (event) => {
      if (!isOpen) return;
      // Menu is open
      if (!isHovering || playerN === null) {
        setIsOpen(false);
        setDropdownMenu(null);
        return;
      }
    }

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    }
  }, [dropdownMenu, isHovering])

  if (!mousePosition) return null;
  if (!dropdownMenu) return null;

  if (!isOpen) {
    setMouseX(mousePosition.x);
    setMouseY(mousePosition.y);
    setIsOpen(true);
  }

  return (
    <DropdownMenuCommon
      playerN={playerN}
      gameBroadcast={gameBroadcast}
      chatBroadcast={chatBroadcast}
      mouseX={mouseX}
      mouseY={mouseY}
      dropdownMenu={dropdownMenu}
      setDropdownMenu={setDropdownMenu}
      setIsHovering={setIsHovering}
    />
  )

})