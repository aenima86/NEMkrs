$(document).ready(function () {

	// Load nem-browser library
	var nem = require("nem-sdk").default;

    // Create an NIS endpoint object
	var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

	// Get an empty un-prepared transfer transaction object
	var transferTransaction = nem.model.objects.get("transferTransaction");

	// Get an empty common object to hold pass and key
	var common = nem.model.objects.get("common");var common = nem.model.objects.get("common");

	// Set default amount in view. It is text input so we can handle dot and comma as decimal mark easily (need cleaning but provided by the library)
	


	

	/**
     * Build transaction from form data and send
     */
	function send(key4conv,pub1,pub2,pub3) {


		// Set the private key in common object
		common.privateKey = key4conv; 


		var keyPair = nem.crypto.keyPair.create(common.privateKey);
		var publicKey = keyPair.publicKey.toString();
		var address = nem.model.address.toAddress(publicKey, nem.model.network.data.testnet.id)

		console.log(publicKey);
		console.log(address);


		// Set the cleaned amount into transfer transaction object
		transferTransaction.amount = nem.utils.helpers.cleanTextAmount(0);

		// Recipient address must be clean (no hypens: "-")
		transferTransaction.recipient = nem.model.address.clean(address);

		// Set message
		transferTransaction.message ='';

		// Prepare the updated transfer transaction object
		var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);
		console.log(transactionEntity);

		strtest = '{ "timeStamp": 9111526, "fee": 500000, "type": 4097, "deadline": 9154726, "version": -1744830462, "signer": "'+publicKey+'", "modifications": [ { "modificationType": 1, "cosignatoryAccount": "'+pub1+'" },{ "modificationType": 1, "cosignatoryAccount": "'+pub2+'" },{ "modificationType": 1, "cosignatoryAccount": "'+pub3+'" } ], "minCosignatories" : { "relativeChange": 2 } }';
		var obj1 = JSON.parse(strtest);
		obj1.timeStamp = transactionEntity.timeStamp
		obj1.deadline = transactionEntity.deadline


		// Serialize transfer transaction and announce
		nem.model.transactions.send(common, obj1, endpoint).then(function(res){
			// If code >= 2, it's an error
			if (res.code >= 2) {
				alert(res.message);
			} else {
				alert(res.message);
			}
		}, function(err) {
			alert(err);
		});
	}



	// Call start function
	$("#startBtn").click(function() {
		$("#section1").hide();
		$("#section2").fadeIn();

		$(window).scrollTop(0);
	});

	 
	$("#nextbtnSec2").click(function() {
		var privateKey = $('#privatekeyMultisig').val();

		// Check private key for errors
		//if (privateKey.length !== 64 && privateKey.length !== 66) return alert('Invalid private key, length must be 64 or 66 characters !');
		//if (!nem.utils.helpers.isHexadecimal(privateKey)) return alert('Private key must be hexadecimal only !');

		$("#section2").hide();
		$("#section3").fadeIn();

		
		$('#PK4C').text($('#privatekeyMultisig').val());

		$('#q1').text($('#question1').find(":selected").text());
		$('#q2').text($('#question2').find(":selected").text());
		$('#q3').text($('#question3').find(":selected").text());
		$('#q4').text("E-mail");

		$('#a1').text($('#answer1').val());
		$('#a2').text($('#answer2').val());
		$('#a3').text($('#answer3').val());
		$('#a4').text($('#answer4').val());

		$(window).scrollTop(0);
	});

	$("#backbtnSec3").click(function() {
		$("#section3").hide();
		$("#section2").fadeIn();

		$(window).scrollTop(0);
	});

	// Call send function when click on send button
	$("#nextbtnSec3").click(function() {
		var pub1 ='d6343879a5634610132b58948ff0aa32d36f364fca7c59058d9b21ed9ba846ff';
		var pub2='05cf7da0bc154c598c394aaf9501cffaec39a3bd92fef884ab8df440439c12e1';
		var pub3='cc61676a4275abcffd10a9ea1081091ff054a1a8a720429256aebf8034aab099';
	  //send('913e172803bb22eb0f06bf90d9d52da066b55a376a451ecea691069b14e10580',pub1,pub2,pub3);
	/*
	  // Create key 1
		var rBytes1 = nem.crypto.nacl.randomBytes(32);
		var privateKey1 = nem.utils.convert.ua2hex(rBytes1);
		var keyPair1 = nem.crypto.keyPair.create(privateKey1);
		var pub1 = keyPair1.publicKey.toString();
		// Create key 2
		var rBytes2 = nem.crypto.nacl.randomBytes(32);
		var privateKey2 = nem.utils.convert.ua2hex(rBytes2);
		var keyPair2 = nem.crypto.keyPair.create(privateKey2);
		var pub2 = keyPair2.publicKey.toString();
		// Create key 2
		var rBytes3 = nem.crypto.nacl.randomBytes(32);
		var privateKey3 = nem.utils.convert.ua2hex(rBytes3);
		var keyPair3 = nem.crypto.keyPair.create(privateKey3);
		var pub3 = keyPair3.publicKey.toString();*/

		var PKmultisig = $('#privatekeyMultisig').val();

		send(PKmultisig,pub1,pub2,pub3);
	});



});