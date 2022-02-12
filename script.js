// function makeApiCall(){
//     $(document).ready(function() {
//         var cityName= document.getElementById('city').value; // city
//         var url = 'https://api.openbrewerydb.org/breweries?by_city='+cityName+'';
//         console.log(url);

//         $.ajax({url:url, dataType:"json"})
//         .then(function(data) {
//             console.log(data);
//             for(var i=0;i<20;i++){
//                 //console.log(url);
//                 //need brewery Name, Type, Street Address, & button to add review 
//                 var title = data[i].name;
//                 console.log(title);
//                 var typeBrew = data[i].brewery_type;
//                 var address = data[i].street;
//                 var card = document.createElement('div');
//                 card.className = "cards";
//                 var card_body = document.createElement('div');
//                 var header = document.createElement('h1');
//                 header.className = "card-title";
//                 var type = document.createElement('p');
//                 type.className = "card-text";
//                 var location = document.createElement('p');
//                 location.className = "card-text";
//                 header.innerHTML = title;
//                 type.innerHTML = typeBrew;
//                 location.innerHTML = address;
//                 var addReviewB = document.createElement('button');
//                 addReviewB.className = "btn btn-primary";
//                 addReviewB.innerHTML = "Add Review";
//                 addReviewB.onclick = loadModule();
//                 card_body.appendChild(header);
//                 card_body.appendChild(type);
//                 card_body.appendChild(location);
//                 card_body.appendChild(addReviewB);
//                 card.appendChild(card_body);
//                 document.getElementById("brewCards").appendChild(card);

//             }
//         })
//     })
// }

// function openModal(name){
//     //document.getElementById("cool").style = "background-color: red;"
//     var modal_insert = document.getElementById("brew_namee");
//     modal_insert.innerHTML = name;
// }
