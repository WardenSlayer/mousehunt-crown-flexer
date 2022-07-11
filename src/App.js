import "./App.css";
import { mapMiceData, miceData, domToPng, download, repoGo } from "./utils.js";
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
import React, { useState, useEffect } from "react";
/////////////////////////////////////////////////////////////////////////////////////////////////
function App() {
  useEffect(() => {}, []);
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
        crownData={["bronze", "silver", "gold", "platinum", "diamond", "nth"]}
        catchNumber={state[4]}
      />
      <MainPanel
        className="Main"
        mouse={state[0]}
        img={state[1]}
        landscape={state[2]}
        crown={state[3]}
        catchNumber={state[4]}
      />
      <MainPanel
        className="Mobile"
        mouse={state[0]}
        img={state[1]}
        landscape={state[2]}
        crown={state[3]}
        catchNumber={state[4]}
      />
    </div>
  );
}
export default App;

function appDefaultState(miceData) {
  return ["none", "none", "none", "none", "none"];
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
        catchNumber={props.catchNumber}
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
        catchNumber={props.catchNumber}
      />
      <NumberEntry
        className="NumberEntry"
        update={props.update}
        mouse={props.mouse}
        img={props.img}
        landscape={props.landscape}
        crown={props.crown}
        catchNumber={props.catchNumber}
      />
      <ButtonPanel
        mouse={props.mouse}
        crown={props.crown}
        catchNumber={props.catchNumber}
      />
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
  // console.log(options);
  return options;
}

function Search(props) {
  return (
    <Select
      className={props.className}
      options={props.options}
      placeholder={props.placeholder}
      disabled={searchDisabled(props.placeholder, props.mouse)}
      searchable={true}
      backspaceDelete={false}
      clearable={true}
      onChange={(values) =>
        SearchOnChange(
          props.placeholder,
          values,
          props.update,
          props.mouse,
          props.img,
          props.landscape,
          props.crown,
          props.catchNumber
        )
      }
    />
  );
}

function searchDisabled(type, mouse) {
  if (type !== "Select Crown") {
    return false;
  } else if (mouse === "none") {
    return true;
  } else {
    return false;
  }
}

function SearchOnChange(
  type,
  values,
  update,
  mouse,
  img,
  landscape,
  crown,
  cNumber
) {
  //console.log(type, values, update, mouse, img, landscape, crown, cNumber);
  if (values.length > 0) {
    const newMouse = mapMiceData(values[0].value);
    if (type === "Select Mouse") {
      mouse = newMouse.name;
      img = newMouse.img;
      landscape = newMouse.landscape;
    } else if (type === "Select Crown") {
      crown = values[0].value;
    }
  }
  //console.log([mouse, img, landscape, crown]);
  update([mouse, img, landscape, crown, cNumber]);
  setTimeout(() => {
    if (mouse !== "none" && crown !== "none") {
      domToPng();
    }
  }, 250);
}

function NumberEntry(props) {
  const handleChange = (event) => {
    props.update([
      props.mouse,
      props.img,
      props.landscape,
      props.crown,
      event.target.value,
    ]);
    setTimeout(() => {
      domToPng();
    }, 250);
  };
  return (
    <div>
      <input
        className={props.className}
        type="number"
        placeholder="Select Catch #"
        disabled={isDisabled(props.crown)}
        value={props.catchNumber}
        onChange={handleChange}
      />
    </div>
  );
}

function isDisabled(crown) {
  if (crown !== "nth") {
    return true;
  } else {
    return false;
  }
}

function ButtonPanel(props) {
  return (
    <div className="ButtonPanel">
      <PrimaryButton
        className={"PrimaryButton TitleText TextCenter ButtonMargin"}
        label="Github"
        onClick={(e) => repoGo()}
      />
      {showButtons(props.mouse, props.crown, props.catchNumber)}
    </div>
  );
}

function showButtons(mouse, crown, catchNumber) {
  if (mouse === "none" || crown === "none") {
    return false;
  } else if (crown === "nth" && catchNumber === "none") {
    return false;
  } else {
    return (
      <PrimaryButton
        className={"PrimaryButton TitleText TextCenter"}
        label="Download"
        onClick={(e) => download()}
      />
    );
  }
}

function PrimaryButton(props) {
  return (
    <div className={props.className} onClick={props.onClick}>
      {props.label}
    </div>
  );
}

function Disclaimer(props) {
  return (
    <div className="Disclaimer">
      {disclaimerText()}
      <a href="http://hitgrab.com/games/" target="_blank" rel="noreferrer">
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
  if (props.mouse === "none" || props.crown === "none") {
    return false;
  } else if (
    props.crown === "nth" &&
    (props.catchNumber === "none" || props.className === "Mobile")
  ) {
    return false;
  } else if (props.className === "Main") {
    return (
      <div className={props.className}>
        <ImageCanvas
          mouse={props.mouse}
          img={props.img}
          landscape={props.landscape}
          crown={props.crown}
          catchNumber={props.catchNumber}
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
          catchNumber={props.catchNumber}
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
      <TextPanel
        mouse={props.mouse}
        crown={props.crown}
        catchNumber={props.catchNumber}
      />
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
      <CrownText
        crown={props.crown}
        mouse={props.mouse}
        catchNumber={props.catchNumber}
      />
      {maybeHideImg(props.mouse, props.crown, props.catchNumber)}
    </div>
  );
}

function maybeHideImg(mouse, crown, catchNumber) {
  const source = mapCrown(mouse, crown, catchNumber)[0];
  if (crown === "nth" && source === "noCrown") {
    return false;
  } else {
    return <img src={source} alt="Flex Text"></img>;
  }
}

function CrownText(props) {
  return (
    <div className="CrownText">
      {maybeHideCrown(props.mouse, props.crown, props.catchNumber)}
      <p className="PlainText">Congratulations!</p>
    </div>
  );
}

function maybeHideCrown(mouse, crown, catchNumber) {
  if (crown !== "nth") {
    return (
      <div>
        <p className="TitleText TextLeft">
          {mapCrown(mouse, crown, catchNumber)[1]}
        </p>
        <p className="PlainText">
          {"You earned a " + crown + " King's Crown."}
        </p>
      </div>
    );
  } else {
    return (
      <div>
        <p className="TitleText TextLeft">
          {mapCrown(mouse, crown, catchNumber)[1]}
        </p>
      </div>
    );
  }
}

function mapCrown(mouse, crown_tag, catch_count) {
  let num = "";
  let img = "";
  let crn = "";
  let toast = "";
  catch_count = Math.abs(parseInt(catch_count, 10));
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
  } else if (crown_tag === "nth" && isNaN(catch_count)) {
    crn = "Nth";
  } else {
    const catchFormat = catchCountFormat(catch_count);
    num = catchFormat[0];
    img = catchFormat[1];
    crn = "Nth";
  }
  const crownText = "You caught your " + num + " " + mouse + ".";
  return [img, crownText, crn, toast];
}

function catchCountFormat(count) {
  let cNum = "";
  const j = count % 10,
    k = count % 100;
  if (j === 1 && k !== 11) {
    cNum = count + "st";
  } else if (j === 2 && k !== 12) {
    cNum = count + "nd";
  } else if (j === 3 && k !== 13) {
    cNum = count + "rd";
  } else {
    cNum = count + "th";
  }
  //
  let img = "";
  if (count >= 2500) {
    img = diamondCrown;
  } else if (count >= 1000) {
    img = platinumCrown;
  } else if (count >= 500) {
    img = goldCrown;
  } else if (count >= 100) {
    img = silverCrown;
  } else if (count >= 10) {
    img = bronzeCrown;
  } else {
    img = "noCrown";
  }
  return [cNum, img];
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
