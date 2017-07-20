$(document).ready(function () {

	// Load nem-browser library
	var nem = require("nem-sdk").default;
	var nem1= require("nem-sdk").default;
	var nem2 = require("nem-sdk").default;
	var nem3 = require("nem-sdk").default;

    // Create an NIS endpoint object
	var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

	// Get an empty un-prepared transfer transaction object
	var transferTransaction = nem.model.objects.get("transferTransaction");

	// Get an empty common object to hold pass and key
	var common = nem.model.objects.get("common");var common = nem.model.objects.get("common");

	// Set default amount in view. It is text input so we can handle dot and comma as decimal mark easily (need cleaning but provided by the library)
	
	var rBytes1 = '';
	var privateKey1 = '';
	var keyPair1 = '';

	var rBytes2 = '';
	var privateKey2 = '';
	var keyPair2 = '';

	var rBytes3 = '';
	var privateKey3 = '';
	var keyPair3 = '';
	

	var pub1 ='02ef091a86056808a04f43bfacbe1e6a6bac2ade6d3d1cdd8a7a75b17b634fdd';
		var pub2='9673b0ecab4475cce52fdd6e3e255973971ad30ede601edfb025a6203023450c';
		var pub3='f64af5807c04defa850378168dbe565251896a880b1cbfe6ceb6566ab9c59629';

	

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
				$("#section3").hide();
				$("#section4").fadeIn();
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


		// Create key 1
		rBytes1 = nem1.crypto.nacl.randomBytes(32);
		privateKey1 = nem1.utils.convert.ua2hex(rBytes1);
		keyPair1 = nem1.crypto.keyPair.create(privateKey1);
		//pub1 = keyPair1.publicKey.toString();
		//pub1 = ua2hexConv(keyPair1.publicKey.data);

		


		// Create key 2
		rBytes2 = nem2.crypto.nacl.randomBytes(32);
		privateKey2 = nem2.utils.convert.ua2hex(rBytes2);
		keyPair2 = nem2.crypto.keyPair.create(privateKey2);
		//pub2 = keyPair2.publicKey.toString();
		//pub2 = ua2hexConv(keyPair2.publicKey.data);


		// Create key 3 (recovery key)
		var passphrase = $('#rndseed').text()+$('#answer1').val().toLowerCase()+$('#answer2').val().toLowerCase()+$('#answer3').val().toLowerCase()+$('#answer4').val().toLowerCase();
		privateKey3 = nem3.crypto.helpers.derivePassSha(passphrase, 6000).priv; 
		keyPair3 = nem3.crypto.keyPair.create(privateKey3);
		//pub3 = keyPair3.publicKey.toString();
		//pub3 = ua2hexConv(keyPair3.publicKey.data);

		$('#pk1').text(privateKey1);
		$('#pk2').text(privateKey2);


		var pathname = window.location.href;
		var uri = pathname + '?seed=' + $('#rndseed').text() + '&Q1=' + $('#question1').find(":selected").text() + '&Q2=' + $('#question2').find(":selected").text() + '&Q3=' + $('#question3').find(":selected").text()+ '&Q4=Your e-mail address?';
		$('#wh').text(encodeURI(uri.replace("multisig.htm", "index.htm"))); 

		$(window).scrollTop(0);
	});

	$("#backbtnSec3").click(function() {
		$("#section3").hide();
		$("#section2").fadeIn();

		$(window).scrollTop(0);
	});

	// Call send function when click on send button
	$("#nextbtnSec3").click(function() {
	

		var PKmultisig = $('#privatekeyMultisig').val();

		send(PKmultisig,pub1,pub2,pub3);
	});

   function ua2hexConv(ua) {
		var s = '';
		var _hexEncodeArrayy = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
		for (var i = 0; i < ua.length; i++) {
			var code = ua[i];
			s += _hexEncodeArrayy[code >>> 4];
			s += _hexEncodeArrayy[code & 0x0F];
		}
		return s;
	};



});