import uuid from 'uuid';
import * as firebase from 'firebase';
import { Alert } from 'react-native';

class fb {

    constructor() {

    }

    login(password, username) {

        return fetch(`https://us-central1-bpdatabase-58f91.cloudfunctions.net/auth?username=${username}&password=${password}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => {

            if(response.status !== 200) {
                Alert.alert("Wrong username or password...");
            }
            else {
                let token = response['_bodyText'];
                return token;
            }
        })
    }

    async showData(token) {
        return fetch(`https://us-central1-bpdatabase-58f91.cloudfunctions.net/getPackets?token=${token}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            var packets = JSON.parse(response['_bodyText']);
            //console.log(packets);
            return packets;
        })
    }

    async addToDatabase(state, token, author) {


        var obj = { author: author, sourceAddress: state.sourceAddress, destinationAddress: state.destinationAddress, amount: state.amount};
        var myJSON = JSON.stringify(obj);

        console.log(myJSON);

        return fetch(
            `https://us-central1-bpdatabase-58f91.cloudfunctions.net/addPacket?token=${token}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: myJSON
            }).then((response) => {
                if(response.status !== 200) {
                Alert.alert("Payment was not added to the database", "Missing parameters");
                }
                else {
                Alert.alert("Success", "Payment was added")
                }
        });
    }

    async showPayment(id, token) {

        return fetch(`https://us-central1-bpdatabase-58f91.cloudfunctions.net/getPaymentId?key=${id}&token=${token}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            var payment = JSON.parse(response['_bodyText']);
            return payment;
        })
    }

    async sendPayment(state) {

        const sourceAddress = state.sourceAddress;
        const destinationAddress = state.destinationAddress;
        const amount = state.amount;

        //console.log("SA: " + sourceAddress + ", DA: " + destinationAddress + ", Amount: " + amount)

        return fetch(`https://us-central1-bpdatabase-58f91.cloudfunctions.net/sendPayment?sourceAddress=${sourceAddress}&destinationAddress=${destinationAddress}&amount=${amount}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(Alert.alert("Transaction COMPLETED", "haha"))


    }
}

fb.instance = new fb();
fb.instance.token = '';
fb.instance.author = '';
export default fb;
