// "Promisified" contract calls for convenience
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

// Switch the "Class is X" text
function switchClassStatus(on) {
	$("#class-status")
		.text(on ? "ON" : "OFF")
		.css("color", on ? "#36ff32" : "#ff5656");
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

// The actual thing
$(document).ready(function() {

	// Initial check for class status
	getClassStatus()
		.then((result) => switchClassStatus(result), (error) => {
			$("#class-status")
				.text("???")
				.css("color", "red");
		});	
	
	// Check current account's balance
    $("#check-tokens-button").click(function() {
		tokens.balanceOf(web3.eth.defaultAccount, async (error, result) => {
			let resultTable = $("#check-tokens-result-table");
			if (error)
				setAlert("danger", $("#check-tokens-result-text"), error.message);
			else {
				$("#balance-table").show();
				resultTable.html("");	// Clear previous result
				
				let student = await getCurrentStudent();
				student = student ? student : "None";
				let address = web3.eth.defaultAccount;
				let balance = result.toNumber();
				
				let rowString = 
					"<td>" + address + "</td>" +
					"<td>" + student + "</td>" +
					"<td>" + balance + "</td>";
				let row = $("<tr>").append(rowString);
				
				resultTable.append(row);
			}
		});
	});
	
	// Submit a code
	$("#submit-code-button").on("click", async function() {
		let resultText = $("#submit-code-result");
		
		let classOn = await getClassStatus();
		if (classOn instanceof Error)
			setAlert("danger", resultText, classOn.message);
		else if (!classOn) {
			let message = "Class is <strong>OFF!</strong> You cannot submit codes yet";
			setAlert("danger", resultText, message);
		}
		else {
			attend.submit($("#input-submit-code").val(), (error, result) => {
				if (error)
					setAlert("danger", resultText, error.message);
				else
					setAlert("success", resultText, "Transaction sent successfully");
			});
		}
	});
	
	// Set the class on/off
	$("#switch-class-button").click(async function() {
		let resultText = $("#switch-class-result");
		let classOn = await getClassStatus();
		attend.setState(!classOn, (error, result) => {
			if (error) setAlert("danger", resultText, error.message);
			else {
				setAlert("success", resultText, "Transaction sent successfully");
				switchClassStatus(!classOn);
			}
		});
	});
	
	// Add codes with rewards
	$("#add-codes-button").click(function() {
		let hashes = [], rewards = [];
		$(".code-input").each((i, elem) => hashes.push(sha3num($(elem).val())));
		$(".reward-input").each((i, elem) => rewards.push($(elem).val()));
		
		let resultText = $("#add-codes-result");
		attend.addCodes(hashes, rewards, (error, result) => {
			if (error) setAlert("danger", resultText, error.message);
			else setAlert("success", resultText, "Transaction sent successfully");
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
		attend.setTokenContract(address, (error, result) => {
			if (error) setAlert("danger", resultText, error.message);
			else setAlert("success", resultText, "Transaction sent successfully");
		});
	});
	
	// Withdraw
	$("#withdraw-button").click(function() {
		let resultText = $("#withdraw-result");
		attend.withdraw((error, result) => {
			if (error) {
				console.error(error);
				setAlert("danger", resultText, error.message);
			}
			else setAlert("success", resultText, "Transaction sent successfully");
		});
	});
});