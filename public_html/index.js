async function getUser(){
  const rawResponse = await fetch('/api/signed-in');
  const content = await rawResponse.json();
  return content;
}

function setListItemName(hangTag, bbName){
  let postNum;
  switch(hangTag){
    case "1":
      postNum = "1st Generation";
      break;
    case "2":
      postNum = "2nd Generation";
      break;
    case "3":
      postNum = "3rd Generation";
      break;
    case "4":
      postNum = "4th Generation";
      break;
    case "5":
      postNum = "5th Generation";
      break;
    case "6":
      postNum = "6th Generation";
      break;
    case "7":
      postNum = "7th Generation";
      break;
    case "8":
      postNum = "8th Generation";
      break;
    case "9":
      postNum = "9th Generation";
      break;
    case "10":
      postNum = "10th Generation";
      break;
    case "11":
      postNum = "11th Generation";
      break;
    case "12":
      postNum = "12th Generation";
      break;
    case "13":
      postNum = "13th Generation";
      break;
    case "14":
      postNum = "14th Generation";
      break;
    case "15":
      postNum = "15th Generation";
      break;
    case "16":
      postNum = "16th Generation";
      break;
    case "17":
      postNum = "17th Generation";
      break;
    case "18":
      postNum = "18th Generation";
      break;
    case "19":
      postNum = "19th Generation";
      break;
    case "4, 5" || "45":
      postNum = "4th/5th Generation"
      break;
    case "6, 7":
      postNum = "6th/7th Generation"
      break;
    case "7, 11":
      postNum = "7th/11th Generation"
      break;
    case "14, 17":
      postNum = "14th/17th Generation";
      break;
    case "14 sm" || "14sm":
      postNum = "sm 14th Generation";
      break;
    case "15 sm":
      postNum = "sm 15th Generation";
      break;
    case "15 UK":
      postNum = "UK 15th Generation";
      break;
    case "15, ?":
      postNum = "15th/?th Generation";
      break;
    case "15, 18UK":
      postNum = "UK 15th/18th Generation";
      break;
    case "15UK, 19":
      postNum = "UK 15th/19th Generation";
      break;
    case "16,18":
      postNum = "16th/18th Generation";
      break;
    case "17 sm":
      postNum = "sm 17th Generation";
      break;
    case "17,18":
      postNum = "17th/18th Generation";
      break;
    case "17, 18":
      postNum = "17th/18th Generation";
      break;
    case "18 sm":
      postNum = "sm 18th Generation";
      break;
    case "18 UK":
      postNum = "UK 18th Generation";
      break;
    case "18,19":
      postNum = "18th/19th Generation";
      break;
    case "18, 19":
      postNum = "18th/19th Generation";
      break;
    case "19 sm":
      postNum = "sm 19th Generation";
      break;
    case "19 UK":
      postNum = "UK 19th Generation";
      break;
    case "19,19":
      postNum = "19th Generation";
      break;
    case "19, 19":
      postNum = "19th Generation";
      break;
    case "3,4":
      postNum = "3rd/4th Generation";
      break;
    case "4,5":
      postNum = "4th/5th Generation";
      break;
    case "6,7":
      postNum = "6th/7th Generation";
      break;
    case "7,10":
      postNum = "7th/10th Generation";
      break;
    case "7,11":
      postNum = "7th/11th Generation";
      break;
    case "7,8":
      postNum = "7th/8th Generation";
      break;
    case "7,8,9":
      postNum = "7th/8th/9th Generation";
      break;
    case "7,9":
      postNum = "7th/9th Generation";
      break;
    default:
      postNum = hangTag;
      break;
  }
  return postNum + " " + bbName;
}

function getData(){
  document.querySelector('#loader-gif').style.display = "block";
  return new Promise((resolve, reject) => {
    fetch('/api/checked')
      .then(response => response.json())
      .then(response => {
        const checkedData = response.data;
        let liString = "";
        for(var j = 0; j < checkedData.length; j++){
            const listItemName = setListItemName(checkedData[j]['Hang Tag'], checkedData[j]['Beanie Baby Name'])
            if(checkedData[j]['checked']){
              liString += `<li style="list-style: none; class='bb-list-item'"><input type='checkbox' checked class='beanie-baby-list-item' data-id='${listItemName}' /> ${listItemName}</li>`;
            } else {
              liString += `<li style="list-style: none; class='bb-list-item'"><input type='checkbox' class='beanie-baby-list-item' data-id='${listItemName}' /> ${listItemName}</li>`;
            }
        }

        document.querySelector('#beanie-baby-list').innerHTML = liString;
        document.querySelector('#loader-gif').style.display = "none";
        resolve(response.data)
      });
  })
}

let bbdata = null;
getData().then(function(data){
  bbdata = data;
})

document.addEventListener('click', async function(e){
  const data = await getUser();
  if(e.target.className == 'beanie-baby-list-item'){
    (async () => {
      const rawResponse = await fetch('/api/checked', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          checked: e.target.checked,
          bb: e.target.getAttribute('data-id'),
          user: data.user.username
        })
      });
      if(e.target.checked){
        let filteredBb = bbdata.filter(bb => e.target.getAttribute('data-id') == setListItemName(bb['Hang Tag'],bb['Beanie Baby Name']))
        filteredBb[0]['checked'] = true;
      }
      const content = await rawResponse.json();
    })();
  } else if (e.target.className == "show-all-checkbox"){
    document.querySelector('.search-bb-input').value = "";
    if(e.target.checked){
      const filteredBbs = bbdata.filter(bb => bb['checked'] == true);
      let liString = "";
      for(var j = 0; j < filteredBbs.length; j++){
        const listItemName = setListItemName(filteredBbs[j]['Hang Tag'], filteredBbs[j]['Beanie Baby Name'])
        liString += `<li style="list-style: none; class='bb-list-item'"><input type='checkbox' checked class='beanie-baby-list-item' data-id='${listItemName}' /> ${listItemName}</li>`;
      }

      document.querySelector('#beanie-baby-list').innerHTML = liString;
      document.querySelector('#loader-gif').style.display = "none";
    } else {
      getData()
    }
  }
});


document.querySelector('.search-bb-input').addEventListener('keydown', function(e){
  document.querySelector('#loader-gif').style.display = "block";
  let inputValue = null;
  if(e.key == "Backspace"){
    inputValue = e.target.value.substring(0, e.target.value.length - 1)
  } else if (e.key == "Space"){
    inputValue = e.target.value + " ";
  } else {
    inputValue = e.target.value + e.key;
  }
  const filteredBbs = bbdata.filter(bb => bb['Beanie Baby Name'].toLowerCase().includes(inputValue.toLowerCase()));
  let liString = "";
  for(var j = 0; j < filteredBbs.length; j++){
      const listItemName = setListItemName(filteredBbs[j]['Hang Tag'],filteredBbs[j]['Beanie Baby Name'])
      if(filteredBbs[j]['checked']){
        liString += `<li style="list-style: none; class='bb-list-item'"><input type='checkbox' checked class='beanie-baby-list-item' data-id='${listItemName}' /> ${listItemName}</li>`;
      } else {
        liString += `<li style="list-style: none; class='bb-list-item'"><input type='checkbox' class='beanie-baby-list-item' data-id='${listItemName}' /> ${listItemName}</li>`;
      }
  }

  document.querySelector('#beanie-baby-list').innerHTML = liString;
  document.querySelector('#loader-gif').style.display = "none";
})
