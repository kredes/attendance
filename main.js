var BigNumber = require('bignumber.js');

if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	// set the provider you want from Web3.providers
	//web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	alert("No web3 provider found");
}

//web3.eth.defaultAccount = web3.eth.accounts[0];

var attendABI = '[{"constant":false,"inputs":[{"name":"hashes","type":"bytes32[]"},{"name":"amounts","type":"uint256[]"}],"name":"addCodes","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"state","type":"bool"}],"name":"setState","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"setTokenContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"code","type":"uint256"}],"name":"submit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"class_on","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]';
var attendContract = web3.eth.contract(JSON.parse(attendABI));
//var attend = attendContract.at('0xaa4751b249a9fa09a8cd8146820493b85c7e72d5');
var attend = attendContract.at('0xA4c37888A127f89EE02D2B838Bd9A9E0272054aF');

var bctABI = '[{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"total","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}]';
var bctContract = web3.eth.contract(JSON.parse(bctABI));
//var bct = bctContract.at('0x220392e76058BAd0798E16F16987093EBB0944DB');
var bct = bctContract.at('0x6c3184e7207C760EeE026DDDDbc3ad00e748992E');

var registryABI = '[{"constant":false,"inputs":[{"name":"name","type":"string"}],"name":"setRegistry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"class","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"adr","type":"address"}],"name":"getName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]';
var registryContract = web3.eth.contract(JSON.parse(registryABI));
var registry = registryContract.at('0x715ccF30954c94d581BEd30dF099e9A8B269eE77');

function getCurrentStudent() {
	return new Promise((resolve, reject) => {
		registry.getName(web3.eth.defaultAccount, (error, result) => {
			if (error) reject(error);
			else resolve(result);
		});
	});
}

function getClassStatus() {
	return new Promise((resolve, reject) => {
		attend.class_on.call((error, result) => {
			if (error) reject(error);
			else resolve(result);
		});
	});
}

function switchClassStatus(on) {
	$("#class-status")
		.text(on ? "ON" : "OFF")
		.css("color", on ? "green" : "red");
	$("#switch-class-button")
		.val(on ? "End class" : "Start class");
}

// Remove any previous alert class from elem
function removeAlerts(elem) {
	elem.attr('class', function(i, c){
		return c.replace(/(^|\s)alert-\S+/g, '');
	});
}

function setAlert(type, elem, message) {
	removeAlerts(elem);
	if (type === "danger") {
		elem.addClass("alert-danger");
		elem.css("color", "red");
	} else if (type === "success") {
		elem.addClass("alert-success");
		elem.css("color", "green");
	}
	elem.html(message);
	elem.show();
}

function addCodeInputRow() {
	$("#code-input-form")
		.append($(".code-input-row").last().clone(true, true));
	$(".code-input-row:last").prev().find(".one-more-code").hide();
	$(".code-input").last().val("");
	$(".reward-input").last().val("");
}


$(document).ready(function() {

	// Initial check for class status
	getClassStatus()
		.then((result) => switchClassStatus(result), (error) => {
			$("#class-status")
				.text("???")
				.css("color", "red");
		});	
	
	// Check current account's balance
    $("#check-bct-button").click(function() {
		bct.balanceOf(web3.eth.defaultAccount, async (error, result) => {
			let $resultTable = $("#check-bct-result");
			if (error)
				resultText.text(error.message);
			else {
				$("#balance-table").show();
				$resultTable.html("");
				
				let student = await getCurrentStudent();
				student = student ? student : "None";
				let address = web3.eth.defaultAccount;
				let balance = result.toNumber();
				
				let rowString = 
					"<td>" + address + "</td>" +
					"<td>" + student + "</td>" +
					"<td>" + balance + "</td>";
				let row = $("<tr>").append(rowString);
				
				$resultTable.append(row);
			}
		});
	});
	
	// Submit a code
	$("#submit-code-button").on("click", async function() {
		let resultText = $("#submit-code-result");
		
		let classOn = await getClassStatus();
		
		if (classOn instanceof Error)
			setAlert("danger", resultText, classOn.message);
		else if (classOn) {
			attend.submit($("#input-submit-code").val(), (error, result) => {
					if (error)
						setAlert("danger", resultText, error.message);
					else
						setAlert("success", resultText, "Code submitted successfully");
				});
		} else
			setAlert("danger", resultText, "Class is <strong>OFF!</strong> You cannot submit codes yet");
	});
	
	// Set the class on/off
	$("#switch-class-button").click(async function() {
		let resultText = $("#switch-class-result");
		let classOn = await getClassStatus();
		attend.setState(!classOn, (error, result) => {
			if (error) setAlert("danger", resultText, error.message);
			else
				switchClassStatus(!classOn);
		});
	});
	
	// Add codes with rewards
	$("#add-codes-button").click(function() {
		let hashes = [], rewards = [];
		$(".code-input").each((i, elem) => hashes.push(sha3num($(elem).val())));
		$(".reward-input").each((i, elem) => rewards.push($(elem).val()));
		
		let resultText = $("#add-codes-result");
		attend.addCodes(hashes, rewards, (result, error) => {
			if (error) setAlert("danger", resultText, error.message);
			else setAlert("success", resultText, "Codes added succesfully");
		});
	});
	
	$(".one-more-code").click(() => addCodeInputRow());
	$("#more-codes-button").click(() => {
		let n = parseInt($("#more-codes-input").val(), 10);
		for (let i = 0; i < n; ++i) addCodeInputRow();
	});
	
	// Set Attend's token contract
	$("#token-contract-button").click(function() {
		let address = $("#token-contract-input").val();
		let resultText = $("#token-contract-result");
		attend.setTokenContract(address, (result, error) => {
			if (error) setAlert("danger", resultText, error.message);
			else setAlert("success", resultText, "Token contract set successfully");
		});
	});
	
	// Withdraw
	$("#withdraw-button").click(function() {
		let resultText = $("#withdraw-result");
		attend.withdraw((result, error) => {
			if (error) {
				console.error(error);
				setAlert("danger", resultText, error.message);
			}
			else setAlert("success", resultText, "Tokens withdrawn successfully");
		});
	});
});