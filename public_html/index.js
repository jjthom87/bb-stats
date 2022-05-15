async function getUser(){
  const rawResponse = await fetch('/api/signed-in');
  const content = await rawResponse.json();
  return content;
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
            if(checkedData[j]['checked']){
              liString += `<li style="list-style: none; class='bb-list-item'"><input type='checkbox' checked class='beanie-baby-list-item' data-id='${checkedData[j]['Hang Tag']}th Generation ${checkedData[j]['Beanie Baby Name']}' /> ${checkedData[j]['Hang Tag']}th Generation ${checkedData[j]['Beanie Baby Name']}</li>`;
            } else {
              liString += `<li style="list-style: none; class='bb-list-item'"><input type='checkbox' class='beanie-baby-list-item' data-id='${checkedData[j]['Hang Tag']}th Generation ${checkedData[j]['Beanie Baby Name']}' /> ${checkedData[j]['Hang Tag']}th Generation ${checkedData[j]['Beanie Baby Name']}</li>`;
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
      const content = await rawResponse.json();
    })();
  } else if (e.target.className == "show-all-checkbox"){
    if(e.target.checked){
      const filteredBbs = bbdata.filter(bb => bb['checked'] == true);
      let liString = "";
      for(var j = 0; j < filteredBbs.length; j++){
        liString += `<li style="list-style: none; class='bb-list-item'"><input type='checkbox' checked class='beanie-baby-list-item' data-id='${filteredBbs[j]['Hang Tag']}th Generation ${filteredBbs[j]['Beanie Baby Name']}' /> ${filteredBbs[j]['Hang Tag']}th Generation ${filteredBbs[j]['Beanie Baby Name']}</li>`;
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
      if(filteredBbs[j]['checked']){
        liString += `<li style="list-style: none; class='bb-list-item'"><input type='checkbox' checked class='beanie-baby-list-item' data-id='${filteredBbs[j]['Hang Tag']}th Generation ${filteredBbs[j]['Beanie Baby Name']}' /> ${filteredBbs[j]['Hang Tag']}th Generation ${filteredBbs[j]['Beanie Baby Name']}</li>`;
      } else {
        liString += `<li style="list-style: none; class='bb-list-item'"><input type='checkbox' class='beanie-baby-list-item' data-id='${filteredBbs[j]['Hang Tag']}th Generation ${filteredBbs[j]['Beanie Baby Name']}' /> ${filteredBbs[j]['Hang Tag']}th Generation ${filteredBbs[j]['Beanie Baby Name']}</li>`;
      }
  }

  document.querySelector('#beanie-baby-list').innerHTML = liString;
  document.querySelector('#loader-gif').style.display = "none";
})
