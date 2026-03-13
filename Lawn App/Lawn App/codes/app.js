let customers = JSON.parse(localStorage.getItem("customers")) || [];
let money = Number(localStorage.getItem("money")) || 0;

function save(){
localStorage.setItem("customers",JSON.stringify(customers));
localStorage.setItem("money",money);
}

function showPage(page){
document.getElementById("todayPage").innerHTML="";
document.getElementById("customersPage").innerHTML="";
document.getElementById("moneyPage").innerHTML="";

if(page==="today") renderToday();
if(page==="customers") renderCustomers();
if(page==="money") renderMoney();
}

function todayName(){
return new Date().toLocaleDateString("en-US",{weekday:"long"});
}

function renderToday(){
let div=document.getElementById("todayPage");
let today=todayName();

customers.forEach(c=>{
if(c.day===today){

let card=document.createElement("div");
card.className="card";

card.innerHTML=`
<b>${c.name}</b><br>
${c.address}<br>
$${c.price}<br>
${c.frequency}<br>
${c.notes || ""}<br>

<button onclick="navigate('${c.address}')">Navigate</button>
<button onclick="markMowed(${c.id})">Mowed</button>
<button onclick="markPaid(${c.id})">Paid</button>
`;

div.appendChild(card);
}

});
}

function renderCustomers(){

let div=document.getElementById("customersPage");

let form=document.createElement("div");

form.innerHTML=`

<h3>Add Lawn</h3>

<input id="name" placeholder="Name">
<input id="address" placeholder="Address">
<input id="phone" placeholder="Phone">
<input id="email" placeholder="Email">

<input id="price" placeholder="Price">

<select id="day">
<option>Monday</option>
<option>Tuesday</option>
<option>Wednesday</option>
<option>Thursday</option>
<option>Friday</option>
<option>Saturday</option>
<option>Sunday</option>
</select>

<select id="frequency">
<option>Weekly</option>
<option>Biweekly</option>
</select>

<textarea id="notes" placeholder="Notes"></textarea>

<button onclick="addCustomer()">Add Lawn</button>

`;

div.appendChild(form);

customers.forEach((c,index)=>{

let card=document.createElement("div");
card.className="card drag";
card.draggable=true;

card.innerHTML=`

<b>${c.name}</b><br>
${c.day} - ${c.frequency}<br>
$${c.price}<br>
${c.notes || ""}<br>

<button onclick="editCustomer(${c.id})">Edit</button>
<button onclick="deleteCustomer(${c.id})">Delete</button>

`;

card.addEventListener("dragstart",e=>{
e.dataTransfer.setData("index",index);
});

card.addEventListener("dragover",e=>e.preventDefault());

card.addEventListener("drop",e=>{
let from=e.dataTransfer.getData("index");
let temp=customers[from];
customers.splice(from,1);
customers.splice(index,0,temp);
save();
showPage("customers");
});

div.appendChild(card);

});
}

function renderMoney(){

let div=document.getElementById("moneyPage");

div.innerHTML=`

<div class="card">

<h2>Total Earned</h2>

<h1>$${money}</h1>

</div>

`;

}

function addCustomer(){

let customer={

id:Date.now(),
name:document.getElementById("name").value,
address:document.getElementById("address").value,
phone:document.getElementById("phone").value,
email:document.getElementById("email").value,
price:Number(document.getElementById("price").value),
day:document.getElementById("day").value,
frequency:document.getElementById("frequency").value,
notes:document.getElementById("notes").value,
mowed:false,
paid:false

};

customers.push(customer);
save();
showPage("customers");

}

function deleteCustomer(id){
customers=customers.filter(c=>c.id!==id);
save();
showPage("customers");
}

function editCustomer(id){

let c=customers.find(x=>x.id===id);

let name=prompt("Name",c.name);
let price=prompt("Price",c.price);
let notes=prompt("Notes",c.notes);

c.name=name;
c.price=price;
c.notes=notes;

save();
showPage("customers");

}

function navigate(address){
let encoded=encodeURIComponent(address);
window.open(`https://www.google.com/maps/dir/?api=1&destination=${encoded}`);
}

function markMowed(id){
let c=customers.find(x=>x.id===id);
c.mowed=true;
save();
}

function markPaid(id){

let c=customers.find(x=>x.id===id);

if(c.mowed && !c.paid){

money+=Number(c.price);
c.paid=true;

save();
renderToday();

}

}

showPage("today");
