angular.module('app.bukusaku', [])
    .controller('bukusakuCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        $("#alert-email-tidak-ditemukan").hide();
        $("#alert-emailAdmin-tidak-ditemukan").hide();
        $("#alert-password-salah").hide();

        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('USER AKTIF');
                var useraktif = firebase.auth().currentUser;
                console.log(useraktif.uid)
                $ionicLoading.hide();
                var dbRef = firebase.database();
                var pengguna = dbRef.ref('admin');
                pengguna.orderByChild('id').equalTo(useraktif.uid).on("value", function (snapshot) {
                    console.log(snapshot.val());
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            let firebaseRefKey = firebase.database().ref('admin').child(data.key);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    "nama": dataSnapShot.val().nama,
                                    "sekolah": dataSnapShot.val().sekolah,
                                };

                                console.log($scope.formData.nama)

                            })
                        });
                    } else {
                        $ionicLoading.hide();
                        console.log('TIDAK AKTIF');
                        $state.go('welcome');
                    }

                })

                $scope.logout = function () {
                    $("#modal_keluar").modal('hide')
                    firebase.auth().signOut();
                }
            }
            else {
                console.log('TIDAK AKTIF')
            }
        });
        const video = document.createElement("video");
        const canvasElement = document.getElementById("qr-canvas");
        const canvas = canvasElement.getContext("2d");
        const outputData = document.getElementById("outputData");

        qrcode.callback = res => {
            if (res) {
                id = res
                outputData.innerText = res;
                //   console.log(outputData);
                scanning = false;

                firebase.database().ref('dataSiswa').orderByChild('nisn').equalTo(res).on('value', function (snapshot) {
                    hasil = snapshot.val();
                    console.log(hasil);
                    if (snapshot.val()) {
                        $ionicLoading.show()
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            let firebaseRefKey = firebase.database().ref('dataSiswa').child(data.key);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                console.log(dataSnapShot.val().nama);
                                $state.go('bukusaku_siswa', {
                                    "id": data.key,
                                });

                            })
                        });

                    }

                });


                video.srcObject.getTracks().forEach(track => {
                    track.stop();
                });

                //   qrResult.hidden = false;
                canvasElement.hidden = true;
                //   btnScanQR.hidden = true;
            }
        };

        navigator.mediaDevices
            .getUserMedia({ video: { facingMode: "environment" } })
            // .getUserMedia({ video: true})
            .then(function (stream) {
                scanning = true;
                //   qrResult.hidden = true;
                //   btnScanQR.hidden = true;
                canvasElement.hidden = false;
                document.getElementById("scanan").hidden = false;
                document.getElementById("tombolqr").hidden = true;
                video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
                video.srcObject = stream;
                video.play();
                tick();
                scan();
            });

        $scope.batalscan = function () {
            document.getElementById("scanan").hidden = true;
            document.getElementById("tombolqr").hidden = false;
        }


        function tick() {
            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

            scanning && requestAnimationFrame(tick);
        }

        function scan() {
            try {
                qrcode.decode();
            } catch (e) {
                setTimeout(scan, 300);
            }
        }
        $scope.welcome = function () {
            $state.go('welcome');
        }
    }])

    .controller('bukusaku_siswaCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        var id = $stateParams.id;
        //CEK STATUS USER
        // firebase.auth().onAuthStateChanged(function (user) {
        //     if (user) {
        //         console.log('USER AKTIF');
        //         var useraktif = firebase.auth().currentUser;
        //         console.log(useraktif.uid)
        //         $ionicLoading.hide();
        //         var dbRef = firebase.database();
        //         var pengguna = dbRef.ref('admin');
        //         pengguna.orderByChild('id').equalTo(useraktif.uid).on("value", function (snapshot) {
        //             console.log(snapshot.val());
        //             if (snapshot.val() != null) {
        //                 snapshot.forEach(function (data) {
        //                     console.log(data.key);
        //                     let firebaseRefKey = firebase.database().ref('admin').child(data.key);
        //                     firebaseRefKey.on('value', (dataSnapShot) => {
        //                         $scope.formDataAdmin = {
        //                             "nama": dataSnapShot.val().nama,
        //                             "sekolah": dataSnapShot.val().sekolah,
        //                         };

        //                         console.log($scope.formDataAdmin.nama)

        //                     })
        //                 });
        //             } else {
        //                 $ionicLoading.hide();
        //                 console.log('TIDAK AKTIF');
        //                 $state.go('welcome');
        //             }

        //         })

        //         $scope.logout = function () {
        //             $("#modal_keluar").modal('hide')
        //             firebase.auth().signOut();
        //         }
        //     }
        //     else {
        //         console.log('TIDAK AKTIF')
        //     }
        // });

        console.log('ID' + id);
        var dbRef = firebase.database();
        var pengguna = dbRef.ref('dataSiswa');
        pengguna.orderByChild('nisn').equalTo(id).on("value", function (snapshot) {
            console.log(snapshot.val());
            if (snapshot.val() != null) {
                snapshot.forEach(function (data) {
                    console.log(data.key);
                    let firebaseRefKey = firebase.database().ref('dataSiswa').child(data.key);
                    firebaseRefKey.on('value', (dataSnapShot) => {
                        $scope.formData = {
                            "uid": dataSnapShot.val().uid,
                            "nama": dataSnapShot.val().nama,
                            "absen": dataSnapShot.val().no_absen,
                            "nisn": dataSnapShot.val().nisn,
                            "kelas": dataSnapShot.val().kelas,
                            "foto": dataSnapShot.val().foto

                        };

                    })
                    $ionicLoading.hide();
                    console.log($scope.formData.nama);
                });
            } else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
            }

        })
        $scope.simpan = function () {
            $state.go('berandaAdmin');
        }

    }])

