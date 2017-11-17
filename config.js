var BigNumber = require('bignumber.js');

var TEST_ENV = true;

var TEST_ATTEND_ADDR = "0xA4c37888A127f89EE02D2B838Bd9A9E0272054aF";
var TEST_TOKEN_ADDR = "0x6c3184e7207C760EeE026DDDDbc3ad00e748992E";
var TEST_REGISTRY_ADDR = "0x715ccF30954c94d581BEd30dF099e9A8B269eE77";

var PROD_ATTEND_ADDR = "0xaa4751b249a9fa09a8cd8146820493b85c7e72d5";
var PROD_TOKEN_ADDR = "0x220392e76058BAd0798E16F16987093EBB0944DB";
var PROD_REGISTRY_ADDR = "0x715ccF30954c94d581BEd30dF099e9A8B269eE77";

if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	// set the provider you want from Web3.providers
	//web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	alert("No web3 provider found");
}

//web3.eth.defaultAccount = web3.eth.accounts[0];

// Attendance contract
var attendABI = '[{"constant":false,"inputs":[{"name":"hashes","type":"bytes32[]"},{"name":"amounts","type":"uint256[]"}],"name":"addCodes","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"state","type":"bool"}],"name":"setState","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"setTokenContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"code","type":"uint256"}],"name":"submit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"class_on","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]';
var attendContract = web3.eth.contract(JSON.parse(attendABI));
var attend = 
	TEST_ENV ? 
		attendContract.at(TEST_ATTEND_ADDR):
		attendContract.at(PROD_ATTEND_ADDR);

// Token contract
var tokensABI = '[{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"total","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}]';
var tokensContract = web3.eth.contract(JSON.parse(tokensABI));
var tokens = 
	TEST_ENV ?
		tokensContract.at(TEST_TOKEN_ADDR):
		tokensContract.at(PROD_TOKEN_ADDR);

// Registry contract
var registryABI = '[{"constant":false,"inputs":[{"name":"name","type":"string"}],"name":"setRegistry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"class","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"adr","type":"address"}],"name":"getName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]';
var registryContract = web3.eth.contract(JSON.parse(registryABI));
var registry = 
	TEST_ENV ?
		registryContract.at(TEST_REGISTRY_ADDR):
		registryContract.at(PROD_REGISTRY_ADDR);