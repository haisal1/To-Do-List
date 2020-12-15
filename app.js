const ItemContainer = document.getElementById("items");

///Date in real time///
const realDate = document.getElementById("headerDate");
const data = new Date();
let optionsDate = { weekday: "long", month: "long", day: "numeric", year: "numeric" };
realDate.innerHTML = data.toLocaleDateString("en-US", optionsDate);


////Clock in real time////
const realTimeClock = () => {
    const timer = new Date();
    const localTime = document.getElementById("headerClock");
    let hours = timer.getHours();
    let minutes = timer.getMinutes();
    let seconds = timer.getSeconds();
    let amPm = (hours < 12) ? "AM" : "PM";
    hours = (hours > 12) ? hours - 12 : hours;
    hours = ("0" + hours).slice(-2);
    minutes = ("0" + minutes).slice(-2);
    seconds = ("0" + seconds).slice(-2);
    localTime.innerHTML = `${hours}:${minutes}:${seconds} ${amPm}`;
    setTimeout(realTimeClock, 1000);
};
realTimeClock();


////clear all elements////
const clearStorage = document.getElementsByClassName("headerClear");
clearStorage[0].addEventListener("click", function () {
    localStorage.clear();
    location.reload();
});
ItemContainer.removeChild(ItemContainer.childNodes[0]);



//////////delete multiple elements////////////////
const deleteMultiple=document.getElementsByClassName("headerDelete");
deleteMultiple[0].addEventListener("click",function(){
        let y=[]
const deleteMultipleElements=(param)=>{
        if(param.childNodes[1].checked){
            y.push(param.id)
        }}
    ItemContainer.childNodes.forEach(element=>deleteMultipleElements(element));
    for(i=0;i<y.length;i++){
        List.splice(y[i]-i,1);
    }
    for (i = 0; i < List.length; i++) {
        List[i].id = i;
    }
    saveLocalStore();
    location.reload();
})

///input date min and max made dynamic///
const dateOfExpire = (() => {
    let day = data.getDate();
    day = ("0" + day).slice(-2);
    let month = data.getMonth();
    let year = data.getFullYear();
    document.getElementById("deadlineData").min = `${year}-${month + 1}-${day}`;
    document.getElementById("deadlineData").max = `${year + 1}-${month + 1}-${day}`;
})();

///////create new entry +display/////

const saveLocalStore = () => {
    localStorage.setItem("listOfToDo", JSON.stringify(List));
}

let List;
let id;
let pStatus;
let dataToTake = localStorage.getItem("listOfToDo");
const addElements = (id, text, status) => {
    let value1, value2, value3;
    let showValue1, showValue2, showValue3;
    let showLessMore,show="";
    if(text.length>80){
    text=text.slice(0,77);
    text=text.concat("...");
showLessMore="showLessMore";
show=`<span id="${id}" job="showLessMore"> ShowMore</span>`;
    }
    if (status == "notStarted") {
        pStatus = "notStarted";
        value1 = "notStarted";
        showValue1 = "Not Started";
        value2 = "inProgress";
        showValue2 = "In Progress";
        value3 = "completed";
        showValue3 = "Completed";
    } else if (status == "inProgress") {
        pStatus = "inProgress";
        value1 = "inProgress";
        showValue1 = "In Progress";
        value2 = "notStarted";
        showValue2 = "Not Started";
        value3 = "completed";
        showValue3 = "Completed";
    } else {
        pStatus = "completed";
        value1 = "completed";
        showValue1 = "Completed";
        value2 = "notStarted";
        showValue2 = "Not Started";
        value3 = "inProgress";
        showValue3 = "In Progress";
    }
    let item = `<li id="${id}" class="inputedContent" job="">
    <input id="${id}" type="checkbox" class="checkBox" job="">
    <input id="${id}" type="text" class="hiddenEdit" job="">
    <p id="${id}" job="showTime" class="itemContent ${pStatus} ${showLessMore}">${text}${show}</p>
    <p id=${id} job="" class="timerShow"></p>
            <div class="itemButtons" job="">    
                <select job="select" id="${id}" class="itemSelector" name="typesOfCheck">
                    <option class="itemOption" value="${value1}">${showValue1}</option>
                    <option class="itemOption" value="${value2}">${showValue2}</option>
                    <option class="itemOption" value="${value3}">${showValue3}</option>
                </select>
                <i id="${id}" class="fa fa-edit editButton" job="edit"></i>
                <i id="${id}" class="fa fa-trash deleteButton" job="delete"></i>
            </div>
        </li>`;
    ItemContainer.insertAdjacentHTML("beforeend", item);
}

//////////// initializing screen ///////////

const onScreenSeen = (elementToParse) => {
    elementToParse.forEach(function (item) {
        addElements(item.id, item.text, item.status);
    })
};

///////////data base plus initialization //////////////

if (dataToTake) {
    List = JSON.parse(dataToTake);
    id = List.length;
    onScreenSeen(List);
}
else {
    List = [];
    id = 0;
}
const form = document.getElementById("addDataForm");
form.addEventListener("submit", function (e) {
    let status = "notStarted";
    let text = document.getElementById("addToDo").value;
    if(text.replace(/\s/g,"") == ""){
        e.preventDefault();
    }else{ let expireDate = document.getElementById("deadlineData").value;
    let expireTime = document.getElementById("deadlineTime").value;
    addElements(id, text, status);
    List.push({
        id: id,
        text: text,
        expireDate: expireDate,
        expireTime: expireTime,
        status: status,
    })
    saveLocalStore();
    id++;}
})

/////////////////inside item delete/////////////////////////
const deleteElement = (element) => {
    List.splice(element.id, 1);
    for (i = 0; i < List.length; i++) {
        List[i].id = i;
    }
}

////////////status bar changer/////////////////////
const changeStatus = (element) => {
    let paragraphStatusClass = element.parentNode.parentNode.childNodes[5].classList;
    if (element.value == "notStarted") {
        List[element.id].status = "notStarted";
        paragraphStatusClass.remove("completed", "inProgress");
        paragraphStatusClass.add("notStarted");
    }
    else if (element.value == "inProgress") {
        List[element.id].status = "inProgress";
        paragraphStatusClass.remove("completed","notStarted");
        paragraphStatusClass.add("inProgress");
    } else {
        List[element.id].status = "completed";
        paragraphStatusClass.remove("inProgress","notStarted");
        paragraphStatusClass.add("completed");
    }
}
/////////////////edit text content //////////////////
const editElement=(element)=>{
    let input=element.parentNode.parentNode.childNodes[3];
    let text=element.parentNode.parentNode.childNodes[5];
    input.value=List[element.id].text;
    input.style.display="inline";
    text.style.display="none";
}
////event for new input showed after the click edit event///////////////////
const itemText=document.querySelectorAll(".itemContent");
const inputNewText=document.querySelectorAll(".hiddenEdit")
inputNewText.forEach(element=>element.addEventListener("keyup",function(event){
        let itemTextId=itemText[event.target.id];
        let inputNewTextId=inputNewText[event.target.id];
        if(event.key=="Enter"){
            if(event.target.value){
                id=element.id;
                showLess=`<span id="${id}" job="showLessMore"> ShowLess</span>`;
        showMore=`<span id="${id}" job="showLessMore"> ShowMore</span>`;
                itemTextId.innerHTML=event.target.value.slice(0,77).concat(`...`).concat(showMore);
        itemTextId.style.display="inline";
        inputNewTextId.style.display="none";
        List[event.target.id].text=event.target.value;
        saveLocalStore();}
        else{itemTextId.style.display="inline";
        inputNewTextId.style.display="none";} 
        } else if(event.key=="Escape"){
            itemTextId.style.display="inline";
            inputNewTextId.style.display="none";
        }
    }))
    
    //////// Show less Show more /////////////////

    const showLessMore=(element)=>{
        id=element.id;
        showLess=`<span id="${id}" job="showLessMore"> ShowLess</span>`;
        showMore=`<span id="${id}" job="showLessMore"> ShowMore</span>`;
        if(element.innerText==" ShowMore"){
            element.parentNode.innerHTML=List[element.id].text.concat(showLess)
        }else{
            element.parentNode.innerHTML=List[element.id].text.slice(0,77).concat("...").concat(showMore)
        }
    }

    /////////////////Show Timer///////////////

    const showTime=(element)=>{
        
        if(element.parentNode.childNodes[7].style.display=="none"){
            element.parentNode.childNodes[7].style.display="inline";
        }else if(element.parentNode.childNodes[7].style.display=="inline"){
            element.parentNode.childNodes[7].style.display="none";
        }else{
            element.parentNode.childNodes[7].style.display="inline";
        }
    }



    //////////////////creating the event for the page by the jobs on each element//////////////////
ItemContainer.addEventListener("click", function (event) {
    const element = event.target;
    const elementJob = element.attributes.job.value;
    if (elementJob == "delete") {
        deleteElement(element);
        saveLocalStore();
        location.reload();
    } else if (elementJob == "edit") {
        editElement(element);
        saveLocalStore();
    }
    else if (elementJob == "showTime") {
        showTime(element);
    } else if (elementJob == "select") {
        changeStatus(element);
        saveLocalStore();
    } else if (elementJob=="showLessMore"){
        showLessMore(element);
    }
})

//////////////filter all elements from list//////////
const filterSelector=document.querySelector(".filterSelector");
const filterItemValues=document.querySelectorAll(".itemContent");
filterSelector.addEventListener("click",function(event){
    filterItemValues.forEach(function(element){
         switch(event.target.value){
        case "filterNotStarted":
            if(element.classList.contains("notStarted")){
                element.parentNode.style.display="flex";
            }else{
                element.parentNode.style.display="none";
            }
            break;
            case "filterInProgress":
            if(element.classList.contains("inProgress")){
                element.parentNode.style.display="flex";
            }else{
                element.parentNode.style.display="none";
            }
            break;
            case "filterCompleted":
            if(element.classList.contains("completed")){
                element.parentNode.style.display="flex";
            }else{
                element.parentNode.style.display="none";
            }break;
            case "filterExpired":
                if(element.classList.contains("deadLine")){
                    element.parentNode.style.display="flex";
                }else{
                    element.parentNode.style.display="none";
                }break;
            break;
            default:element.parentNode.style.display="flex";
    }})
})

const realTimeExpire=()=>{
    expires =document.querySelectorAll(".timerShow");
    expires.forEach(function(element){
        let expireCountdown=[];
let expiringData=List[element.id].expireDate.split("-");
let expiringTime=List[element.id].expireTime.split(":");
expiringTime.push("00");
expiringData.forEach(element=>expireCountdown.push(Number(element)));
expiringTime.forEach(element=>expireCountdown.push(Number(element)));
expireCountdown[1]=expireCountdown[1]-1;
    let actualData=new Date();
    let deadline=new Date(expireCountdown[0],expireCountdown[1],expireCountdown[2],expireCountdown[3],expireCountdown[4]);
    let difference=deadline-actualData;
    let days=Math.floor((difference)/(1000*60*60*24));
    let hours=Math.floor((difference)%(1000*60*60*24)/(1000*60*60));
    let minutes = Math.floor(((difference) % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor(((difference) % (1000 * 60)) / 1000);
    let timer=`Days:${days} Hours:${hours} Minutes:${minutes} Seconds:${seconds}`
    element.innerHTML=(timer)
    if(difference<0){
        element.innerHTML="Expired";
        element.parentNode.childNodes[5].classList.add("deadLine");
    }
}
    )
            setTimeout(realTimeExpire, 1000);
}
realTimeExpire();