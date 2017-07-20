

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

	// Create random bytes from PRNG
	var rBytes = nem.crypto.nacl.randomBytes(32);

	// Convert the random bytes to hex
	var randomSeed = uaConv(rBytes);
	$('#rndseed').text(randomSeed);

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
	

	var pub1 ='';
	
	var pub2='';
	
	var pub3='';
	

	

	/**
     * Build transaction from form data and send
     */
	function send(key4conv,pub1,pub2,pub3) {



		// Set the private key in common object
		common.privateKey = key4conv; 


		var keyPair = nem.crypto.keyPair.create(common.privateKey);
		var publicKey = keyPair.publicKey.toString();
		var address = nem.model.address.toAddress(publicKey, nem.model.network.data.testnet.id);

		



		var tx = publicKey;
		var signatoryArray = [];
		var address1 = nem.model.address.toAddress(pub1, nem.model.network.data.testnet.id)
		signatoryArray.push({
                address: address1,
                pubKey: pub1
            });
		var address2 = nem.model.address.toAddress(pub1, nem.model.network.data.testnet.id)
		signatoryArray.push({
                address: address2,
                pubKey: pub2
            });
		var address3 = nem.model.address.toAddress(pub1, nem.model.network.data.testnet.id)
		signatoryArray.push({
                address: address3,
                pubKey: pub3
            });
		
		var transactionEntity = constructAggregate(tx, signatoryArray);
		console.log('NEW entity');
		console.log(JSON.stringify(transactionEntity));

		// Serialize transfer transaction and announce
		nem.model.transactions.send(common, transactionEntity, endpoint).then(function(res){
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
		pub1 = ua2hexConv(keyPair1.publicKey.data);



		// Create key 2
		rBytes2 = nem2.crypto.nacl.randomBytes(32);
		privateKey2 = nem2.utils.convert.ua2hex(rBytes2);
		keyPair2 = nem2.crypto.keyPair.create(privateKey2);
		//pub2 = keyPair2.publicKey.toString();
		pub2 = ua2hexConv(keyPair2.publicKey.data);


		// Create key 3 (recovery key)
		var passphrase = $('#rndseed').text()+$('#answer1').val().toLowerCase()+$('#answer2').val().toLowerCase()+$('#answer3').val().toLowerCase()+$('#answer4').val().toLowerCase();
		privateKey3 = nem3.crypto.helpers.derivePassSha(passphrase, 6000).priv; 
		keyPair3 = nem3.crypto.keyPair.create(privateKey3);
		//pub3 = keyPair3.publicKey.toString();
		pub3 = ua2hexConv(keyPair3.publicKey.data);

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

	function constructAggregate(tx, signatoryArray) {
        var timeStamp = createNEMTimeStamp();
        var version = -1744830462;
        var due = nem.model.network.data.testnet.id === nem.model.network.data.testnet.id ? 60 : 24 * 60;
        var data = CREATE_DATA(4097, tx, timeStamp, due, version);
        var totalFee = (1) * 1000000;
        var custom = {
            'fee': totalFee,
            'modifications': [],
            'minCosignatories': {
                'relativeChange': 2
            }
        };
        for (var i = 0; i < signatoryArray.length; i++) {
            custom.modifications.push({
                "modificationType": 1,
                "cosignatoryAccount": signatoryArray[i].pubKey
            });
        }

        // Sort modification array by addresses
        if (custom.modifications.length > 1) {
            custom.modifications.sort((a, b) => {
                if ( nem.model.address.toAddress(a.cosignatoryAccount, nem.model.network.data.testnet.id) < nem.model.address.toAddress(b.cosignatoryAccount, nem.model.network.data.testnet.id)) return -1;
                if (nem.model.address.toAddress(a.cosignatoryAccount, nem.model.network.data.testnet.id) > nem.model.address.toAddress(b.cosignatoryAccount, nem.model.network.data.testnet.id)) return 1;
                return 0;
            });
        }

        var entity = $.extend(data, custom);
        return entity;
    };

	// NEM epoch time
	var NEM_EPOCH = Date.UTC(2015, 2, 29, 0, 6, 25, 0);

	/**
	* createNEMTimeStamp() Create a time stamp for a NEM transaction
	*
	* @return NEM transaction timestamp
	*/
	function createNEMTimeStamp() {
		return Math.floor((Date.now() / 1000) - (NEM_EPOCH / 1000));
	}

	 /**
     * CREATE_DATA() Create the common part of a transaction
     *
     * @param txType: The type of the transaction
     * @param senderPublicKey: The sender public key
     * @param timeStamp: The timestamp of the transation
     * @param due: The deadline in minutes
     * @param version: The network version
     *
     * return: common transaction object
     */
    function CREATE_DATA(txtype, senderPublicKey, timeStamp, due, version) {
        return {
            'type': txtype,
            'version': version,
            'signer': senderPublicKey,
            'timeStamp': timeStamp,
            'deadline': timeStamp + due * 60
        };
    }




});