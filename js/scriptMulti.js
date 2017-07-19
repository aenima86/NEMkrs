$(document).ready(function () {



	// Load nem-browser library
	var nem = require("nem-sdk").default;

    // Create an NIS endpoint object
	var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

	// Get an empty un-prepared transfer transaction object
	var transferTransaction = nem.model.objects.get("transferTransaction");

	// Get an empty common object to hold pass and key
	var common = nem.model.objects.get("common");


	// Create random bytes from PRNG
	var rBytes = nem.crypto.nacl.randomBytes(32);

	// Convert the random bytes to hex
	var randomSeed = uaConv(rBytes);
	$('#rndseed').text(randomSeed);

	//check if we are in recovery mode
	urlCheck();



	// Convert the random bytes to hex
	var privateKey = nem.utils.convert.ua2hex(rBytes);

	var keyPair = nem.crypto.keyPair.create(privateKey);

	var publicKey = keyPair.publicKey.toString();

	var address = nem.model.address.toAddress(publicKey, nem.model.network.data.mainnet.id); //nem.model.network.data.mainnet.id  nem.model.network.data.testnet.id





	$("#startBtn").click(function(){
		$("#section1").hide();
		$("#section2").fadeIn();

		$(window).scrollTop(0);
		
	});
	$("#nextbtnSec2").click(function(){

		var privateKey = $('#privatekeyMultisig').val();

		// Check private key for errors
		if (privateKey.length !== 64 && privateKey.length !== 66) return alert('Invalid private key, length must be 64 or 66 characters !');
		if (!nem.utils.helpers.isHexadecimal(privateKey)) return alert('Private key must be hexadecimal only !');

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
	$("#backbtnSec3").click(function(){
		$("#section3").hide();
		$("#section2").fadeIn();

		$(window).scrollTop(0);
		
	});
	$("#nextbtnSec3").click(function(){
		$("#section3").hide();
		$("#section4").fadeIn();

		$(window).scrollTop(0);

		// Create key 1
		var rBytes1 = nem.crypto.nacl.randomBytes(32);
		var privateKey1 = nem.utils.convert.ua2hex(rBytes1);
		var keyPair1 = nem.crypto.keyPair.create(privateKey1);
		var publicKey1 = keyPair1.publicKey.toString();


		// Create key 2
		var rBytes2 = nem.crypto.nacl.randomBytes(32);
		var privateKey2 = nem.utils.convert.ua2hex(rBytes2);
		var keyPair2 = nem.crypto.keyPair.create(privateKey2);
		var publicKey2 = keyPair2.publicKey.toString();

		// Create key 3 (recovery key)
		var passphrase = $('#rndseed').text()+$('#answer1').val()+$('#answer2').val()+$('#answer3').val()+$('#answer4').val();
		var privateKey3 = makePrivateKey(passphrase);
		var keyPair3 = nem.crypto.keyPair.create(privateKey3);
		var publicKey3 = keyPair3.publicKey.toString();

		$('#pk1').text(privateKey1);
		$('#pk2').text(privateKey2);


		var pathname = window.location.href;
		var uri = pathname + '?seed=' + $('#rndseed').text() + '&Q1=' + $('#question1').find(":selected").text() + '&Q2=' + $('#question2').find(":selected").text() + '&Q3=' + $('#question3').find(":selected").text()+ '&Q4=Your e-mail address?';
		$('#wh').text(encodeURI(uri.replace("multisig.htm", "index.htm")));



		var PKmultisig = $('#privatekeyMultisig').val();


		convert2multisig(PKmultisig,publicKey1,publicKey2,publicKey3);

		
	});



	function uaConv(ua) {
		var s = '';
		var _hexEncodeArrayy = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
		for (var i = 0; i < ua.length; i++) {
			var code = ua[i];
			s += _hexEncodeArrayy[code >>> 4];
			s += _hexEncodeArrayy[code & 0x0F];
		}
		return s;
	};

	function makePrivateKey(passphrase) {

		var privateKey = nem.crypto.helpers.derivePassSha(passphrase, 6000).priv;
		return privateKey;
	};

	function urlParam(name) {

		try {
			var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
			return results[1] || 0;
	
		}
		catch(err) {
			
		}


	}

	function urlCheck() {

		if( urlParam('seed') != null) {
			$("#section1").hide();
			$("#section2").fadeIn();

			$('#rndseed').text(decodeURI(urlParam('seed')));

			var select = document.getElementById('question1');
			select.options[select.options.length] = new Option(decodeURI(urlParam('Q1')));
			select.selectedIndex = select.options.length-1;
			$('#question1').attr("disabled", "disabled");

			var select = document.getElementById('question2');
			select.options[select.options.length] = new Option(decodeURI(urlParam('Q2')));
			select.selectedIndex = select.options.length-1;
			$('#question2').attr("disabled", "disabled");

			var select = document.getElementById('question3');
			select.options[select.options.length] = new Option(decodeURI(urlParam('Q3')));
			select.selectedIndex = select.options.length-1;
			$('#question3').attr("disabled", "disabled");


		}
		
	};


	function convert2multisig(key4conv,pub1,pub2,pub3) {
	

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

		
		
	};
});
