import "./App.css";
import { mapMiceData, miceData, domToPng, download, logUse } from "./utils.js";
//
import bronzeCrown from "./images/crown_images/crown_bronze.png";
import silverCrown from "./images/crown_images/crown_silver.png";
import goldCrown from "./images/crown_images/crown_gold.png";
import platinumCrown from "./images/crown_images/crown_platinum.png";
import diamondCrown from "./images/crown_images/crown_diamond.png";
//
import bronzeCrownToast from "./images/crown_images/toaster_crown_bronze_640.png";
import silverCrownToast from "./images/crown_images/toaster_crown_silver_640.png";
import goldCrownToast from "./images/crown_images/toaster_crown_gold_640.png";
import platinumCrownToast from "./images/crown_images/toaster_crown_platinum_640.png";
import diamondCrownToast from "./images/crown_images/toaster_crown_diamond_640.png";
//
import Select from "react-dropdown-select";
import { Text, Linking } from "react-native";
import React, { useState, useEffect } from "react";
/////////////////////////////////////////////////////////////////////////////////////////////////
function App() {
  useEffect(() => {
    logUse();
    localStorage.setItem("mh.cf.imgDrawn", "");
  }, []);
  let defaultState = appDefaultState(miceData);
  const [state, updateState] = useState(defaultState);
  return (
    <div className="App">
      <Menu
        className="Menu"
        mouse={state[0]}
        img={state[1]}
        landscape={state[2]}
        crown={state[3]}
        update={updateState}
        mouseData={miceData}
        crownData={["bronze", "silver", "gold", "platinum", "diamond"]}
      />
      <MainPanel
        className="Main"
        mouse={state[0]}
        img={state[1]}
        landscape={state[2]}
        crown={state[3]}
      />
      <MainPanel
        className="Mobile"
        mouse={state[0]}
        img={state[1]}
        landscape={state[2]}
        crown={state[3]}
      />
    </div>
  );
}
export default App;

function appDefaultState(miceData) {
  const min = 0;
  const max = Math.floor(miceData.length);
  const randMouse = miceData[Math.floor(Math.random() * (max - min + 1) + min)];
  const crowns = ["bronze", "silver", "gold", "platinum", "diamond"];
  const randomCrown = crowns[Math.floor(Math.random() * crowns.length)];
  return [randMouse.name, randMouse.img, randMouse.landscape, randomCrown];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//MENU
function Menu(props) {
  return (
    <div className={props.className}>
      <h2 className="ApplicationTitle">MouseHunt Crown Flexer</h2>
      <Search
        className="Search"
        placeholder="Select Mouse"
        options={searchOptions("Select Mouse", miceData)}
        update={props.update}
        mouse={props.mouse}
        img={props.img}
        landscape={props.landscape}
        crown={props.crown}
      />
      <Search
        className="Search"
        placeholder="Select Crown"
        options={searchOptions("Select Crown", props.crownData)}
        update={props.update}
        mouse={props.mouse}
        img={props.img}
        landscape={props.landscape}
        crown={props.crown}
      />
      <ButtonPanel />
      <Disclaimer url="http://hitgrab.com/games/" />
    </div>
  );
}

function searchOptions(type, data) {
  let options = [];
  data.forEach(function (arrayItem, index) {
    let thisOption = { value: "", label: "" };
    if (type === "Select Mouse") {
      thisOption.label = arrayItem.name;
      thisOption.value = arrayItem.type;
    } else {
      thisOption.label = mapCrown("", arrayItem)[2];
      thisOption.value = arrayItem;
    }
    options.push(thisOption);
  });
  options.sort(function (a, b) {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  });
  //console.log(options);
  return options;
}

function Search(props) {
  return (
    <Select
      className={props.className}
      options={props.options}
      placeholder={props.placeholder}
      searchable={false}
      backspaceDelete={false}
      //clearable={true}
      onChange={(values) =>
        SearchOnChange(
          props.placeholder,
          values,
          props.update,
          props.mouse,
          props.img,
          props.landscape,
          props.crown
        )
      }
    />
  );
}
function SearchOnChange(type, values, update, mouse, img, landscape, crown) {
  //console.log(type, values, update, mouse, img, landscape, crown);
  const newMouse = mapMiceData(values[0].value);
  if (type === "Select Mouse") {
    mouse = newMouse.name;
    img = newMouse.img;
    landscape = newMouse.landscape;
  } else if (type === "Select Crown") {
    crown = values[0].value;
  }
  //console.log([mouse, img, landscape, crown]);
  update([mouse, img, landscape, crown]);
  localStorage.setItem("mh.cf.imgDrawn", "Y");
  setTimeout(() => {
    domToPng();
  }, 250);
}

function showButtons() {
  const imgDrawn = localStorage.getItem("mh.cf.imgDrawn");
  if (imgDrawn == "Y") {
    return <PrimaryButton label="Download" onClick={(e) => download()} />;
  } else {
    return false;
  }
}

function ButtonPanel(props) {
  return (
    <div className="ButtonPanel">
      <div>{showButtons()}</div>
    </div>
  );
}

function PrimaryButton(props) {
  return (
    <div className="PrimaryButton TitleText TextCenter" onClick={props.onClick}>
      {props.label}
    </div>
  );
}

function Disclaimer(props) {
  return (
    <div className="Disclaimer">
      {disclaimerText()}
      <a href="http://hitgrab.com/games/" target="_blank">
        Here!
      </a>
    </div>
  );
}

function disclaimerText() {
  const text1 = "All of the images used in this application are copyright ";
  const text2 = "They are really awesome and you should check them out ";
  const hg = "Hitgrab, the developers of MouseHunt. ";
  return text1 + hg + text2;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//MAIN
function MainPanel(props) {
  if (props.className === "Main") {
    return (
      <div className={props.className}>
        <ImageCanvas
          mouse={props.mouse}
          img={props.img}
          landscape={props.landscape}
          crown={props.crown}
        />
      </div>
    );
  } else {
    return (
      <div className={props.className}>
        <MobileImageCanvas
          mouse={props.mouse}
          img={props.img}
          landscape={props.landscape}
          crown={props.crown}
        />
      </div>
    );
  }
}

function ImageCanvas(props) {
  return (
    <div className="ImageCanvas">
      <MousePanel
        mouse={props.mouse}
        img={props.img}
        landscape={props.landscape}
      />
      <TextPanel mouse={props.mouse} crown={props.crown} />
    </div>
  );
}

function MousePanel(props) {
  return (
    <div className="MousePanel">
      <div className="HeaderSpacer"></div>
      <img
        src={require("./images/mouse_images/" + props.img)}
        className={mouseImageClass(props.landscape, "B")}
        alt="Some Awesome Mouse"
      ></img>
      <MouseName mouse={props.mouse} />
    </div>
  );
}

function mouseImageClass(landscape, type) {
  let style = "";
  if (landscape && type === "B") {
    style = "MouseImageLand";
  } else if (landscape && type === "M") {
    style = "MobileMouseImageLand";
  } else if (type === "B") {
    style = "MouseImagePort";
  } else {
    style = "MobileMouseImagePort";
  }
  return style;
}

function MouseName(props) {
  return (
    <div className="MouseName">
      <p className="SubTitleText TextCenter">{props.mouse}</p>
    </div>
  );
}

function TextPanel(props) {
  return (
    <div className="TextPanel">
      <CrownText crown={props.crown} mouse={props.mouse} />
      <img src={mapCrown(props.mouse, props.crown)[0]} alt="Flex Text"></img>
    </div>
  );
}

function CrownText(props) {
  return (
    <div className="CrownText">
      <p className="TitleText TextLeft">
        {mapCrown(props.mouse, props.crown)[1]}
      </p>
      <p className="PlainText">
        {"You earned a " + props.crown + " King's Crown."}
      </p>
      <p className="PlainText">Congratulations!</p>
    </div>
  );
}

function mapCrown(mouse, crown_tag) {
  let num = "";
  let img = "";
  let crn = "";
  let toast = "";
  if (crown_tag === "bronze") {
    num = "10th";
    img = bronzeCrown;
    crn = "Bronze";
    toast = bronzeCrownToast;
  } else if (crown_tag === "silver") {
    num = "100th";
    img = silverCrown;
    crn = "Silver";
    toast = silverCrownToast;
  } else if (crown_tag === "gold") {
    num = "500th";
    img = goldCrown;
    crn = "Gold";
    toast = goldCrownToast;
  } else if (crown_tag === "platinum") {
    num = "1000th";
    img = platinumCrown;
    crn = "Platinum";
    toast = platinumCrownToast;
  } else if (crown_tag === "diamond") {
    num = "2500th";
    img = diamondCrown;
    crn = "Diamond";
    toast = diamondCrownToast;
  }
  const crownText = "You caught your " + num + " " + mouse + ".";
  return [img, crownText, crn, toast];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//MOBILE
function MobileImageCanvas(props) {
  return (
    <div className="gameView">
      <HuntResult
        mouse={props.mouse}
        img={props.img}
        landscape={props.landscape}
        crown={props.crown}
      />
      <ToastPanel
        mouse={props.mouse}
        img={props.img}
        landscape={props.landscape}
        crown={props.crown}
      />
    </div>
  );
}

function HuntResult(props) {
  return (
    <div className="HuntResultMobile">
      <HuntResultText mouse={props.mouse} />
      <div className="ResultFlair">
        <img
          src={require("./images/misc_images/msg_tray_regal_640.png")}
          alt="Flair"
          width="60%"
        ></img>
      </div>
      <MobileMousePanel
        mouse={props.mouse}
        img={props.img}
        landscape={props.landscape}
      />
    </div>
  );
}

function HuntResultText(props) {
  return (
    <div className="HuntResultText">
      <p className="MobileTextA">Congrats! You Caught a</p>
      <p className="MobileTextB">{props.mouse}</p>
    </div>
  );
}

function MobileMousePanel(props) {
  return (
    <div className="MobileMousePanel">
      <img
        src={require("./images/mouse_images/" + props.img)}
        className={mouseImageClass(props.landscape, "M")}
        alt="Some Awesome Mouse"
      ></img>
    </div>
  );
}

function ToastPanel(props) {
  return (
    <div className="ToastPanel">
      <img
        className="Toaster"
        src={mapCrown(props.mouse, props.crown)[3]}
        alt="Some Awesome Crown"
      ></img>
    </div>
  );
}
