// ----------------------
// LOGIN
// ----------------------


/* ADMIN LOGIN FIX */
function login(){

let username = document.getElementById("admin-username").value.trim();
let mobile = document.getElementById("mobile").value.trim();
let password = document.getElementById("admin-password").value;

// get stored admin
let admin = JSON.parse(localStorage.getItem("admin"));

if(!admin){
alert("No admin registered. Please register first.");
return;
}

// check details
if(
username === admin.name &&
mobile === admin.mobile &&
password === admin.password
){
alert("Login Successful");

// redirect to admin panel
window.location.href = "admin.html";
}
else{
alert("Invalid username or mobile");
}

}




// ----------------------
// REGISTER USER
// ----------------------
function registerUser(){

let name = document.getElementById("name").value;
let mobile = document.getElementById("mobile").value;
let password = document.getElementById("password").value;
let confirm = document.getElementById("confirm").value;
let role = document.getElementById("role").value;

if(name=="" || mobile=="" || password=="" || confirm=="" || role==""){
alert("Enter all details");
return;
}

if(password !== confirm){
alert("Password not match");
return;
}

if(mobile.length != 10 || isNaN(mobile)){
alert("Enter valid mobile number");
return;
}

let users = JSON.parse(localStorage.getItem("users")) || [];

users.push({name, mobile, password, role});

localStorage.setItem("users",JSON.stringify(users));

alert("Registration Successful");

window.location.href="index.html";
}

//------------
//admin profile 
//------------

function registerUser(){

let name = document.getElementById("name").value;
let mobile = document.getElementById("mobile").value;
let password = document.getElementById("password").value;
let confirm = document.getElementById("confirm").value;
let address = document.querySelector(".centerInput").value;
let file = document.querySelector("input[type='file']").files[0];

// Validation
if(password !== confirm){
alert("Passwords do not match");
return;
}

// Create admin object
let adminData = {
name: name,
mobile: mobile,
password: password,
address: address,
photo: ""
};

// Handle image
if(file){
let reader = new FileReader();

reader.onload = function(){
adminData.photo = reader.result;

localStorage.setItem("admin", JSON.stringify(adminData));

// redirect
window.location.href = "admin.html";
};

reader.readAsDataURL(file);

}else{

localStorage.setItem("admin", JSON.stringify(adminData));
window.location.href = "admin.html";
}

}



// ----------------------
// ADD CANDIDATE (FIXED)
// ----------------------
function addCandidate(){  
    

let name = document.getElementById("name").value;
let age = document.getElementById("age").value;

// ✅ FIXED HERE (was aadress ❌)
let address = document.getElementById("address").value;

let qualification = document.getElementById("qualification").value;
let symbol = document.getElementById("symbol").value;
let photoFile = document.getElementById("photo").files[0];

if(name=="" || age=="" || address=="" || qualification=="" || symbol==""){
alert("Enter candidate details");
return;
}



let candidates = JSON.parse(localStorage.getItem("candidates")) || [];

// ✅ simplified (no delay issue)
let pass = prompt("Set candidate password");

// ❌ If cancel or empty → STOP here
if(pass === null || pass.trim() === ""){
alert("Password is required!");
return; // ⛔ stops registration
}

let newCandidate = {
name, age, address, qualification, symbol,
photo: "",
password: pass,
votes: 0,
approved: false
};

if(photoFile){

let reader = new FileReader();

reader.onload = function(){

newCandidate.photo = reader.result;

candidates.push(newCandidate);
localStorage.setItem("candidates",JSON.stringify(candidates));

alert("Candidate Registered");

// ✅ redirect working
window.location.href = "view-all-candidates.html";

};

reader.readAsDataURL(photoFile);

}else{

candidates.push(newCandidate);
localStorage.setItem("candidates",JSON.stringify(candidates));

alert("Candidate Registered");

// ✅ redirect working
window.location.href = "view-all-candidates.html";
}

}




// ----------------------
// APPROVE
// ----------------------
function approve(index){

let candidates = JSON.parse(localStorage.getItem("candidates")) || [];

candidates[index].approved = true;

localStorage.setItem("candidates", JSON.stringify(candidates));

if(confirm("Candidate Approved Successfully")){
window.location.href = "admin.html";
}

}


// ----------------------
// REJECT
// ----------------------
function reject(index){

let candidates = JSON.parse(localStorage.getItem("candidates")) || [];
let rejected = JSON.parse(localStorage.getItem("rejectedCandidates")) || [];

rejected.push(candidates[index]);
candidates.splice(index,1);

localStorage.setItem("candidates", JSON.stringify(candidates));
localStorage.setItem("rejectedCandidates", JSON.stringify(rejected));

if(confirm("Candidate Rejected Successfully")){
window.location.href = "admin.html";
}

}


// ----------------------
// VIEW PAGES
// ----------------------
function viewApproved(){
window.location.href="approved-candidates.html";
}

function viewRejected(){
window.location.href="rejected-candidates.html";
}


// ----------------------
// START VOTING
// ----------------------
function startVoting(){
localStorage.setItem("electionStopped","false");
window.location.href="voter.html";
}


// ----------------------
// ADD VOTE PAGE ENTRY
// ----------------------
function addVote(){

let stopped = localStorage.getItem("electionStopped");

if(stopped=="true"){
alert("Election stopped");
return;
}

window.location.href="voter.html";
}


// ----------------------
// VOTER LOGIN
// ----------------------
function voterLogin(){

let voterid = document.getElementById("voterid").value.trim();

if(voterid === ""){
alert("Please enter Aadhaar or Voter ID");
return;
}

let aadhaarPattern = /^\d{12}$/;
let voterPattern = /^[A-Z]{3}\d{6}$/;

if(!aadhaarPattern.test(voterid) && !voterPattern.test(voterid)){
alert("Enter valid Aadhaar OR Voter ID");
return;
}

let votedList = JSON.parse(localStorage.getItem("votedList")) || [];

if(votedList.includes(voterid)){
alert("You already voted");
return;
}

localStorage.setItem("currentVoter", voterid);

window.location.href = "vote.html";

}


// ----------------------
// VOTE FUNCTION
// ----------------------
function vote(index){

let voter = localStorage.getItem("currentVoter");

if(!voter){
alert("Login first");
window.location.href="voter.html";
return;
}

let votedList = JSON.parse(localStorage.getItem("votedList")) || [];

if(votedList.includes(voter)){
alert("You already voted");
return;
}

if(!confirm("Confirm to vote?")) return;

let candidates = JSON.parse(localStorage.getItem("candidates")) || [];

candidates[index].votes++;

localStorage.setItem("candidates", JSON.stringify(candidates));

votedList.push(voter);
localStorage.setItem("votedList", JSON.stringify(votedList));

alert("✔ Your vote is done");

setTimeout(()=>{
window.location.href="voter.html";
},1000);
}


// ----------------------
// RESULT PAGE
// ----------------------
function openResultPage(){
window.location="download-result.html";
}

function downloadResult(){

let candidates = JSON.parse(localStorage.getItem("candidates")) || [];

if(candidates.length === 0){
alert("No data available");
return;
}

// ✅ ONLY ONE WINNER
let maxVotes = Math.max(...candidates.map(c => c.votes));
let winner = candidates.find(c => c.votes === maxVotes);

// build rows
let rows = "";

candidates.forEach((c) => {

let isWinner = c.votes === maxVotes;

rows += `
<tr ${isWinner ? 'style="background:#d4edda;font-weight:bold;"' : ''}>

<td><img src="${c.photo || 'https://via.placeholder.com/50'}" width="50"></td>
<td>${c.name}</td>
<td>${c.age}</td>
<td>${c.qualification}</td>
<td>${c.symbol}</td>
<td>${c.votes}</td>
<td>
${isWinner ? '🏆 Winner' : ''}
</td>

</tr>
`;

});

// ✅ ALWAYS SHOW SINGLE WINNER
let resultNote = `<h3 style="text-align:center;color:green;">
Winner: ${winner.name}
</h3>`;

// final HTML
let html = `
<html>
<head>
<title>Election Result</title>

<style>
body{
font-family:Arial;
padding:20px;
}

h2{
text-align:center;
margin-bottom:10px;
}

table{
width:100%;
border-collapse:collapse;
}

th, td{
border:1px solid black;
padding:10px;
text-align:center;
}

th{
background:#2e7d32;
color:white;
}
</style>

</head>

<body>

<h2>Election Result</h2>

${resultNote}

<table>

<tr>
<th>Photo</th>
<th>Name</th>
<th>Age</th>
<th>Qualification</th>
<th>Symbol</th>
<th>Votes</th>
<th>Status</th>
</tr>

${rows}

</table>

</body>
</html>
`;

// open print window
let win = window.open('', '', 'width=900,height=700');

win.document.write(html);
win.document.close();

setTimeout(()=>{
win.print();
},500);

}

// ----------------------
// RESET
// ----------------------
function resetElection(){

localStorage.clear();

alert("Election reset successfully");

window.location.href = "admin.html";

}

function resetElectionConfirm(){

if(confirm("Are you sure you want to reset the election?")){
resetElection();
}

}

// ----------------------
// CANDIDATE LOGIN (NEW)
// ----------------------
function candidateLogin(){

let username = document.getElementById("candidate-username").value;
let password = document.getElementById("candidate-password").value;

if(username === "" || password === ""){
alert("Enter username and password");
return;
}

let candidates = JSON.parse(localStorage.getItem("candidates")) || [];

// find approved candidate with correct login
let found = candidates.find(c =>
    c.name === username &&
    c.password === password &&
    c.approved === true
);

if(!found){
alert("Invalid details or not approved");
return;
}

// save logged candidate
localStorage.setItem("loggedCandidate", JSON.stringify(found));

// ✅ REDIRECT HERE
window.location.href = "candidate-dashboard.html";
}


// ----------------------
// SHOW PROFILE
// ----------------------
function showCandidateProfile(c){

document.getElementById("candidateDetails").innerHTML = `
<img src="${c.photo || 'https://via.placeholder.com/100'}"
style="width:100px;height:100px;border-radius:50%;margin-bottom:10px;">

<h3>${c.name}</h3>

<p><b>Age:</b> ${c.age}</p>
<p><b>Address:</b> ${c.address}</p>
<p><b>Qualification:</b> ${c.qualification}</p>
<p><b>Symbol:</b> ${c.symbol}</p>
`;

}


// ----------------------
// VIEW RESULT (ONLY HIS VOTES)
// ----------------------
function showCandidateResult(){

let c = JSON.parse(localStorage.getItem("loggedCandidate"));

document.getElementById("candidateDetails").innerHTML += `
<hr>
<h3>Votes: ${c.votes || 0}</h3>
`;

}
