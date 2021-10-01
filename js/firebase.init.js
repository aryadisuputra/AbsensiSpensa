angular.module('firebaseConfig', ['firebase'])

    .run(function () {

        // My app's Firebase configuration
        var config = {
            apiKey: "AIzaSyDuqvx5ygbCRsis0mUlUSn_xQdk--Lzmrs",
            authDomain: "absensispensa-ffd99.firebaseapp.com",
            databaseURL: "https://absensispensa-ffd99-default-rtdb.firebaseio.com",
            projectId: "absensispensa-ffd99",
            storageBucket: "absensispensa-ffd99.appspot.com",
            messagingSenderId: "593660630964",
            appId: "1:593660630964:web:52040acde57644a42d04e1",
            measurementId: "G-0FX0F95CQQ"
        };
        // Initialize Firebase
        firebase.initializeApp(config);
        // firebase.analytics();


    })

/*

.service("TodoExample", ["$firebaseArray", function($firebaseArray){
    var ref = firebase.database().ref().child("todos");
    var items = $firebaseArray(ref);
    var todos = {
        items: items,
        addItem: function(title){
            items.$add({
                title: title,
                finished: false
            })
        },
        setFinished: function(item, newV){
            item.finished = newV;
            items.$save(item);
        }
    }
    return todos;
}])

*/




// angular.module('firebaseConfig', ['firebase'])

//     .run(function () {

//         // My app's Firebase configuration
//         var config = {
//             apiKey: "AIzaSyBEk-ynCcQyVkDqhTDNOyO-CSCzkbar0JA",
//             authDomain: "denpasar-10e2a.firebaseapp.com",
//             databaseURL: "https://denpasar-10e2a.firebaseio.com",
//             projectId: "denpasar",
//             storageBucket: "denpasar.appspot.com",
//             messagingSenderId: "76976225491",
//             appId: "1:76976225491:web:7c589489dbad41f530a826",
//             measurementId: "G-ZS8LB8SZRZ"
//         };
//         // Initialize Firebase
//         firebase.initializeApp(config);
//         // firebase.analytics();


//     })

// /*

// .service("TodoExample", ["$firebaseArray", function($firebaseArray){
//     var ref = firebase.database().ref().child("todos");
//     var items = $firebaseArray(ref);
//     var todos = {
//         items: items,
//         addItem: function(title){
//             items.$add({
//                 title: title,
//                 finished: false
//             })
//         },
//         setFinished: function(item, newV){
//             item.finished = newV;
//             items.$save(item);
//         }
//     }
//     return todos;
// }])

// */