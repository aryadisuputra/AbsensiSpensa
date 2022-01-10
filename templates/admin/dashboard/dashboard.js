angular.module('app.dashboardAdmin', [])
    .controller('berandaAdminCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        var userID = $stateParams.idUser;

        $scope.toogle = function () {
            // toogle.preventDefault();
            $("#wrapper").toggleClass("toggled");
        }

        $ionicLoading.show();
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
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }

            $scope.dataAbsensi = function () {

                $state.go('data_absensiAdmin');
            }
            $scope.dataSiswa = function () {
                $state.go('data_siswaAdmin');
            }
            $scope.beranda = function () {
                $state.go('berandaAdmin');
            }

            $scope.bukusaku = function () {
                $state.go('bukusaku');
            }
        });
    }])
