## Key Recovery Service (KRS)
The recovery of keys is a big challenge in all cryptocurrencies. One of the main concerns for many people using cryptocurrencies is security of their funds. This is not an easy task for most people, because we are used to centralized organizations taking care of security and supporting us when we have forgotten our password. In crypto-land our funds are forever lost if we loses our keys or in some cases, a third party services have scammed people stealing all their crypto coins. This is why a Key Recovery Service (KRS) is highly relevant for adoption of a cryptocurrency such as NEM.

The KRS is built around two use cases:
* Single key KRS: a user loses his private key and needs to recover the key. 
* Multisig KRS: a user wants to use a third-party service (e.g. a wallet), but want to make sure he can access his funds if the service shuts down, he forgets his password or he loses faith in the service. 

## Single key KRS
This KRS idea comprises that the user uses the KRS service to generate a private key or encrypt an existing. The key is generated or encrypted based on a random seed + personal identifiable information. Furthermore, a unique webhook is generated – this can be stored without high security (e.g. in email or notes) because the webhook can only be activated to restore the keys in combination with the personal identifiable information (which is only known to the user).

![KRS](http://i.imgur.com/JHpkJqJ.png)

The user can choose which personal identifiable information he wishes to identify him, for example could this information be the title of his favorite book in combination with his passport number and his credit card number. Information which is only known to the user creating the keys. The KRS service is all browser based, which is important for security because no information is leaving the users own computer. Subsequently, the users new private key is calculated and can be imported into the user’s wallet. Furthermore, a unique link is created which the user can store in a non-secure manner, and can be activated for a recovery of his key. 

![KRS](http://i.imgur.com/UuE8gyP.png) 

## Multisig KRS
A major problem wallet users encounter is the security of the keys. While most new secure wallets (in the crypto world) implement multi-signature, in which 1 or 2 keys are created and stored by the user, a problem arises when the user forgets one of the passwords as they would then lose access to the wallet and its contents. The idea with a 2-3 multi signature wallet where the user controls 2/3 key and the service 1/3 is important because the user is in control and his fund cannot be compromised in case the service shut down, get hacked etc. 

![KRS]( http://i.imgur.com/Z0ye6gF.png)

The multi signature KRS tries to deal with creating 2-3 multisig accounts and the problem of recovering lost keys. The idea is in basic pretty simple, the user provides a private key with enough funds for a multisig conversion fee. Then the KRS create the 2-3 multi signature account where 1 key can be store by the user, 1 key can be store by the service and 1 key by the KRS. This is not entirely true, because the KRS doesn’t store any keys but the user is provided with a unique link which can be activated along with the personal identifiable information for recovering the last key. The KRS is open source which means that anyone could run the service and the user could in principal use any of these providers to recover his keys. 
![KRS demo]( http://i.imgur.com/6tT20Jb.png)

Check out the demo at: [DEMO]( http://rawgit.com/aenima86/NEMkrs/master/index.htm) (tested in Chrome 59.0.3071.115, pulling code from github)

or 

the github: [https://github.com/aenima86/NEMkrs]( https://github.com/aenima86/NEMkrs) 

## Constructing recovery key
The KRS uses the [NEM-sdk](https://github.com/QuantumMechanics/NEM-sdk) for core functionality. One important aspect when dealing with crypto-keys is that they are created with the proper randomness in order to be safe. The random seed are created using the random bytes function when the website is loaded.

```javascript
// Load nem-browser library
var nem = require("nem-sdk").default;
// Create random bytes from PRNG
var rBytes = nem.crypto.nacl.randomBytes(32);
// Convert the random bytes to hex
var randomSeed = uaConv(rBytes);
```
To calculate the recovery private key, the random seed is combined with the personal identifiable information provided by the user. Beside the private key a webhook containing the random seed and the question selected by the user are constructed. 


```text
. . . index.htm?seed=5afcfa29c6bd34b5e9830360665559f278b8bcaa2ad0e93141023fd07dc1895d&Q1=Your%20national%20identification%20number?&Q2=Your%20date%20of%20birth?&Q3=Your%20pasport%20number?&Q4=Your%20e-mail%20address? 
```
By activating the webhook the user can reconstruct the answers and the KRS can in combination with the random seed recover the private key. This method is smart because the user does not have to trust a KRS service for storing his private keys.

## Converting to multisignature account
For the multisig 2-3 KRS we need the user to provide a private key for the account to be converted. The account needs to hold enough funds to pay the fee for converting to a multi signature account and activating the new keys (total of ~5 xem on the testnet). Before we convert the account, we need to create 3 new private keys, the first two keys are created by pure randomness:


```javascript
// Create key 1
var rBytes1 = nem.crypto.nacl.randomBytes(32);
var privateKey1 = nem.utils.convert.ua2hex(rBytes1);
var keyPair1 = nem.crypto.keyPair.create(privateKey1);
var publicKey1 = keyPair1.publicKey.toString();
```
The last key is created in the same manner described for the single key KRS. This key is hidden from the user, but can be recovered using the web hook with the random seed and the questions. The three new keys are activated by sending 1 xem + fee from the multisignature account to each of the new keys and back again. 
Now we have the private keys and corresponding public keys for the three keypair (+ the private key provided by the user) needed to convert the multi signature account. We do this by broadcasting a multisig transaction to the network.

Assuming we want to convert Johns account with public key:

* Account **'John'** public key: a1aaca6c17a24252e674d155713cdf55996ad00175be4af02a20c67b59f9fe8a

Into a 2 of 3 multisig account meaning the account has 3 cosignatories and at least 2 cosignatories have to sign to complete a multisig transaction

* Cosignatory **'Key 1'** public key: 6083df7119d43e815ed2967c795f806f6b73f8f92a56a7611e3848816ec50958
* Cosignatory **'Key 2'** public key: 0662ed29cbfa7038530fb7f52df865eed6708d51bc7a24bcd05db35185b53c70
* Cosignatory **'KRS Key'** public key: cc61676a4275abcffd10a9ea1081091ff054a1a8a720429256aebf8034aab099

We would have to create a JSON object that looks similar to this (test network):
```text
{
        "timeStamp": 9111526,
        "fee": 28000000,
        "type": 4097,
        "deadline": 9154726,
        "version": -1744830462,
        "signer": "a1aaca6c17a24252e674d155713cdf55996ad00175be4af02a20c67b59f9fe8a",
        "modifications": [
        {
        "modificationType": 1,
        "cosignatoryAccount": "6083df7119d43e815ed2967c795f806f6b73f8f92a56a7611e3848816ec50958"
        },{
        "modificationType": 1,
        "cosignatoryAccount": "0662ed29cbfa7038530fb7f52df865eed6708d51bc7a24bcd05db35185b53c70"
        },{
        "modificationType": 1,
        "cosignatoryAccount": "cc61676a4275abcffd10a9ea1081091ff054a1a8a720429256aebf8034aab099"
        }
        ],
        "minCosignatories" : {
        "relativeChange": 2
        }
}
```
After the transaction is signed and is accepted by the network by including it into a block, the Johns account is now a 2 of 3 multisig account. From this point on, only the cosignatories can initiate a transaction for the Johns account. Also, any transaction from account John must be a multisig transaction. We recommend you create a new testnet account and use [ the test net faucet]( http://test-nem-faucet.44uk.net/) to get some xem to test this KRS.

*Credits*

Author: Aenima

Icons made by DinosoftLabs & Freepik from www.flaticon.com, Creative Commons BY 3.0





