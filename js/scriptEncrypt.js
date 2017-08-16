
// Load nem-browser library
var nem = require("nem-sdk").default;


// Create random bytes from PRNG
var rBytes = nem.crypto.nacl.randomBytes(32);

// Convert the random bytes to hex
var randomSeed = uaConv(rBytes);
$('#rndseed').text(randomSeed);

var encryptMode=0;
var encryptKey='';

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

    
    if (nem.utils.helpers.isPrivateKeyValid( $('#privatekeyProv').val() )!=1 && encryptMode==0) {

        alert('Private key is not valid !');
        throw new Error('Private key is not valid !');

    };



    $("#section2").hide();
	$("#section3").fadeIn();

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
    
    if (encryptMode==0) {

        var passphrase = $('#rndseed').text()+$('#answer1').val().toLowerCase()+$('#answer2').val().toLowerCase()+$('#answer3').val().toLowerCase()+$('#answer4').val().toLowerCase();
        var pKey = EncryptPrivateKey(passphrase);
        $('#pk').text(pKey);
    
        var pathname = window.location.href;
        var uri = pathname + '?seeden=' + $('#rndseed').text() + '&encrypt=' + pKey + '&Q1=' + $('#question1').find(":selected").text() + '&Q2=' + $('#question2').find(":selected").text() + '&Q3=' + $('#question3').find(":selected").text()+ '&Q4=Your e-mail address?';
        $('#wh').text(encodeURI(uri));

        $('#txtRecov').hide();
        $('#txtEncryp').show();

    };
    if (encryptMode==1) {

        var passphrase = $('#rndseed').text()+$('#answer1').val().toLowerCase()+$('#answer2').val().toLowerCase()+$('#answer3').val().toLowerCase()+$('#answer4').val().toLowerCase();
        var pKey = DecryptPrivateKey(passphrase);
        $('#pk').text(pKey);

        $('#txtRecov').show();
        $('#txtEncryp').hide();
        
    };

	
	
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

function EncryptPrivateKey(passphrase) {

	var encrypted = CryptoJS.AES.encrypt($('#privatekeyProv').val(), passphrase);
    return encrypted;
};

function DecryptPrivateKey(passphrase) {

    
        var decrypted = CryptoJS.AES.decrypt(encryptKey, passphrase);
        return decrypted.toString(CryptoJS.enc.Utf8);
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

	if( urlParam('seeden') != null) {
		$("#section1").hide();
		$("#section2").fadeIn();

		$('#rndseed').text(decodeURI(urlParam('seeden')));

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

        encryptMode=1;
        encryptKey = decodeURI(urlParam('encrypt'));
        $('#privatekeyProv').hide();
        $('#privatekeyProvTxt').hide();
        


	}
    
};



