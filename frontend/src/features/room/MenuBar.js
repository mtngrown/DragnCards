import React, { Component, useState, useRef } from "react";
import { getCurrentFace } from "./CardView"
import { MenuBarUser } from "./MenuBarUser"
import { GROUPSINFO, sectionToGroupID, sectionToDiscardGroupID } from "./Constants";

const cardDB = require('../../cardDB/playringsCardDB.json');

export const MenuBar = React.memo(({
    gameUI,
    setShowSpawn,
    handleBrowseSelect,
    gameBroadcast,
    chatBroadcast,
    observingPlayerN,
    setObservingPlayerN,
  }) => {
    
    const inputFile = useRef(null);
    const groups = gameUI["game"]["groups"];

    const handleMenuClick = (data) => {
        console.log(data);
        if (data.action === "reset_game") {
            gameBroadcast("reset_game",{});
            chatBroadcast("game_update",{message: "reset the game."});
        } else if (data.action === "load_deck") {
            loadDeckFile();
        } else if (data.action === "spawn_card") {
            setShowSpawn(true);
        } else if (data.action === "look_at") {
            handleBrowseSelect(data.groupID);
        }
    }

    const loadDeckFile = () => {
      inputFile.current.click();
    }
    const loadDeck = async(event) => {
      event.preventDefault();
      const reader = new FileReader();
      reader.onload = async (event) => { 
        const xmltext = (event.target.result)
        //console.log(xmltext)
        var parseString = require('xml2js').parseString;
        parseString(xmltext, function (err, deckJSON) {
          console.dir(deckJSON);
          console.log(deckJSON.deck.section);
          const sections = deckJSON.deck.section;
          var loadList = [];
          sections.forEach(section => {
            const sectionName = section['$'].name;
            console.log(sectionName);
            const cards = section.card;
            if (!cards) return;
            cards.forEach(card => {
              const cardid = card['$'].id;
              const quantity = parseInt(card['$'].qty);
              var cardRow = cardDB[cardid];
              cardRow['discardgroupid'] = sectionToDiscardGroupID(sectionName,'Player1');
              console.log(cardRow);
              if (cardRow) {
                loadList.push({'cardRow': cardRow, 'quantity': quantity, 'groupID': sectionToGroupID(sectionName,'Player1')})
              }
                //console.log('thiscard', cardRow);
            })
          })
          console.log(loadList);
          gameBroadcast("load_cards",{load_list: loadList});
          chatBroadcast("game_update",{message: "loaded a deck."});
        })
      }
      reader.readAsText(event.target.files[0]);
    }
    
    const sumStagingThreat = () => {
      const stagingStacks = gameUI["game"]["groups"]["gSharedStaging"]["stacks"];
      var stagingThreat = 0;
      stagingStacks.forEach(stack => {
        const topCard = stack["cards"][0];
        const currentFace = getCurrentFace(topCard);
        stagingThreat = stagingThreat + currentFace["threat"] + topCard["tokens"]["threat"];
      })
      return stagingThreat;
    }

    return(
      <div className="h-full">
        <ul className="top-level-menu float-left">
        <li><div className="h-full flex text-xl items-center justify-center" href="#">Menu</div>
            <ul className="second-level-menu">
              <li>
                <a  onClick={() => handleMenuClick({action:"load_deck"})} href="#">Load Deck</a>
                <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={loadDeck}/>
              </li>
              <li><a  onClick={() => handleMenuClick({action:"spawn_card"})} href="#">Spawn Card</a></li>
              <li>
                  <a href="#">Reset Game</a>
                  <ul className="third-level-menu">
                      <li><a onClick={() => handleMenuClick({action:"reset_game"})} href="#">Confirm</a></li>
                  </ul>
              </li>
            </ul>
        </li>
        <li>
        <div className="h-full flex text-xl items-center justify-center" href="#">Look at...</div>
          <ul className="second-level-menu">
              <li>
                <a href="#">Shared</a>
                <ul className="third-level-menu">
                  {Object.keys(GROUPSINFO).map((groupID, index) => {
                    const group = groups[groupID];
                    if (group["controller"] === "Shared")
                      return(<li><a onClick={() => handleMenuClick({action:"look_at",groupID:groupID})} href="#">{GROUPSINFO[groupID].name}</a></li>) 
                    else return null;
                  })}
                </ul>
              </li>
              <li>
                <a href="#">Player 1</a>
                  <ul className="third-level-menu">
                    {Object.keys(GROUPSINFO).map((groupID, index) => {
                    const group = groups[groupID];
                    if (group["controller"] === "Player1")
                        return(<li><a onClick={() => handleMenuClick({action:"look_at",groupID:groupID})} href="#">{GROUPSINFO[groupID].name}</a></li>) 
                      else return null;
                    })}
                </ul>
              </li>
              <li>
                  <a href="#">Player 2</a>
                  <ul className="third-level-menu">
                    {Object.keys(GROUPSINFO).map((groupID, index) => {
                      const group = groups[groupID];
                      if (group["controller"] === "Player2")
                          return(<li><a onClick={() => handleMenuClick({action:"look_at",groupID:groupID})} href="#">{GROUPSINFO[groupID].name}</a></li>) 
                        else return null;
                      })}
                  </ul>
              </li>
              <li>
                  <a href="#">Player 3</a>
                  <ul className="third-level-menu">
                    {Object.keys(GROUPSINFO).map((groupID, index) => {
                      const group = groups[groupID];
                      if (group["controller"] === "Player3")
                          return(<li><a onClick={() => handleMenuClick({action:"look_at",groupID:groupID})} href="#">{GROUPSINFO[groupID].name}</a></li>) 
                        else return null;
                      })}
                  </ul>
              </li>
              <li>
                  <a href="#">Player 4</a>
                  <ul className="third-level-menu">
                    {Object.keys(GROUPSINFO).map((groupID, index) => {
                      const group = groups[groupID];
                      if (group["controller"] === "Player4")
                          return(<li><a onClick={() => handleMenuClick({action:"look_at",groupID:groupID})} href="#">{GROUPSINFO[groupID].name}</a></li>) 
                        else return null;
                      })}
                  </ul>
              </li>
          </ul>
        </li>
      </ul>
      <div className="float-left h-full bg-gray-600" style={{width: "15%"}}>
        <div className="float-left h-full w-1/3">
          <div className="h-1/2 w-full flex justify-center">
            Round
          </div>
          <div className="h-1/2 w-full flex justify-center">
            <div className="text-xl">{gameUI["game"]["round_number"]}</div>
            <img className="h-full ml-1" src={process.env.PUBLIC_URL + '/images/tokens/time.png'}></img>
          </div>
        </div>
        <div className="float-left h-full w-1/3">
          <div className="h-1/2 w-full flex justify-center">
            Staging
          </div>
          <div className="h-1/2 w-full flex justify-center">
            <div className="text-xl">{sumStagingThreat()}</div>
            <img className="h-full ml-1" src={process.env.PUBLIC_URL + '/images/tokens/threat.png'}></img>
          </div>
        </div>
        <div className="float-left h-full w-1/3">
          <div className="h-1/2 w-full flex justify-center">
            Progress
          </div>
          <div className="h-1/2 w-full flex justify-center">
            <div className="text-xl">{gameUI["game"]["round_number"]}</div>
            <img className="h-full ml-1" src={process.env.PUBLIC_URL + '/images/tokens/progress.png'}></img>
          </div>
        </div>
      </div>

      <MenuBarUser
        gameUI={gameUI}
        PlayerN={"Player1"}
        playerIndex={1}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        observingPlayerN={observingPlayerN}
        setObservingPlayerN={setObservingPlayerN}
      ></MenuBarUser>
      <MenuBarUser
        gameUI={gameUI}
        PlayerN={"Player2"}
        playerIndex={2}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        observingPlayerN={observingPlayerN}
        setObservingPlayerN={setObservingPlayerN}
      ></MenuBarUser>
      <MenuBarUser
        gameUI={gameUI}
        PlayerN={"Player3"}
        playerIndex={3}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        observingPlayerN={observingPlayerN}
        setObservingPlayerN={setObservingPlayerN}
      ></MenuBarUser>
      <MenuBarUser
        gameUI={gameUI}
        PlayerN={"Player4"}
        playerIndex={4}
        gameBroadcast={gameBroadcast}
        chatBroadcast={chatBroadcast}
        observingPlayerN={observingPlayerN}
        setObservingPlayerN={setObservingPlayerN}
      ></MenuBarUser>
    </div>
  )
})