angular.module('app.dashboardAbsen', [])
    .controller('dashboardAbsen1Ctrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('USER AKTIF');
                $ionicLoading.show();
                var useraktif = firebase.auth().currentUser;
                console.log(useraktif.uid)
                var dbRef = firebase.database();
                var pengguna = dbRef.ref('dataSiswa');
                pengguna.orderByChild('uid').equalTo(useraktif.uid).on("value", function (snapshot) {
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
                        $state.go('welcome');
                    }

                })

                $scope.logout = function () {
                    $("#modal_keluar").modal('hide')
                    firebase.auth().signOut();
                }
                // getSuhu
                firebase.database().ref('DHT11/temp').on('value', function (snapshot) {
                    var values = snapshot.val();
                    var number_suhu = parseFloat(values.suhu);
                    document.getElementById("suhu").value = number_suhu.toFixed(2);
                    $scope.suhu = number_suhu.toFixed(2);
                    console.log(parseInt(number_suhu.toFixed(2)))
                    if (parseInt(number_suhu.toFixed(2)) > 0 && parseInt(number_suhu.toFixed(2)) < 37.5) {
                        $ionicLoading.show();
                        console.log('TES');
                        var suhu = document.getElementById("suhu").value;
                        console.log(suhu)
                        var waktu = $filter('date')(new Date(), 'dd-MM-yyyy HH:mm:ss');
                        var tanggal = $filter('date')(new Date(), 'dd-MM-yyyy');
                        var bulan = $filter('date')(new Date(), 'MM-yyyy');

                        console.log($scope.formData.nama);


                        firebase.database().ref('absensi/' + bulan + '/'+ tanggal + '/' + $scope.formData.uid).set({
                            nama: $scope.formData.nama,
                            waktu: waktu,
                            tanggal: tanggal,
                            uid: $scope.formData.uid,
                            nisn: $scope.formData.nisn,
                            suhu: suhu,
                            absen: $scope.formData.absen,
                            kelas: $scope.formData.kelas,
                        })
                            .then(function () {
                                Swal.fire({
                                    title: 'Absensi Berhasil!',
                                    text: 'Suhu Anda :' + $scope.suhu,
                                    icon: 'success',
                                    showCancelButton: false,
                                    showConfirmButton: false
                                })
                                // $("#modal_tambah").modal();
                                $ionicLoading.hide();
                                var delayInMilliseconds = 3000; //1 second

                                setTimeout(function () {
                                    //your code to be executed after 1 second
                                    firebase.database().ref('DHT11/temp').update({
                                        suhu: '0',
                                    }).then(function () {
                                        // $("#modal_tambah").modal('fade')
                                        // $("#modal_tambah").modal('hide')
                                        Swal.close();
                                        $state.go('alat1');
                                    })
                                }, delayInMilliseconds);
                            })
                    } else if (parseInt(number_suhu.toFixed(2)) > 37.5) {
                        // window.alert('KURANG')
                        console.log('TES');
                        Swal.fire({
                            title: 'Absensi Gagal!',
                            text: 'Suhu anda melebihi suhu normal. Silahkan cek kembali,',
                            icon: 'danger',
                            showCancelButton: false,
                            showConfirmButton: false
                        })
                        // $("#modal_tambah").modal();
                        $ionicLoading.hide();
                        var delayInMilliseconds = 2500; //1 second

                        setTimeout(function () {
                            //your code to be executed after 1 second
                            firebase.database().ref('DHT11/temp').update({
                                suhu: '0',
                            }).then(function () {
                                // $("#modal_tambah").modal('fade')
                                // $("#modal_tambah").modal('hide')
                                Swal.close();
                                $state.go('alat1');
                            })
                        }, delayInMilliseconds);
                    }
                });

                // $scope.hadir = function () {
                //     $ionicLoading.show();
                //     console.log('TES');
                //     var suhu = document.getElementById("suhu").value;
                //     console.log(suhu)
                //     var waktu = $filter('date')(new Date(), 'dd-MM-yyyy HH:mm:ss');
                //     var tanggal = $filter('date')(new Date(), 'dd-MM-yyyy');

                //     console.log($scope.formData.nama);


                //     firebase.database().ref('absensi/' + bulan + '/'+ tanggal + '/' + $scope.formData.uid).set({
                //         nama: $scope.formData.nama,
                //         waktu: waktu,
                //         tanggal: tanggal,
                //         uid: $scope.formData.uid,
                //         absen: $scope.formData.absen,
                //         nisn: $scope.formData.nisn,
                //         kelas: $scope.formData.kelas,
                //     })
                //         .then(function () {
                //             $ionicLoading.hide();
                //             firebase.database().ref('DHT22/temp').update({
                //                 suhu: '0',
                //             })
                //             $state.go('welcome');
                //         })
                // }
            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('alat1');
            }
        });
    }])
    .controller('dashboardAbsen2Ctrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('USER AKTIF');
                $ionicLoading.show();
                var useraktif = firebase.auth().currentUser;
                console.log(useraktif.uid)
                var dbRef = firebase.database();
                var pengguna = dbRef.ref('dataSiswa');
                pengguna.orderByChild('uid').equalTo(useraktif.uid).on("value", function (snapshot) {
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
                        $state.go('welcome');
                    }

                })

                $scope.logout = function () {
                    $("#modal_keluar").modal('hide')
                    firebase.auth().signOut();
                }
                // getSuhu
                firebase.database().ref('DHT22/temp').on('value', function (snapshot) {
                    var values = snapshot.val();
                    var number_suhu = parseFloat(values.suhu);
                    document.getElementById("suhu").value = number_suhu.toFixed(2);
                    $scope.suhu = number_suhu.toFixed(2);
                    console.log(parseInt(number_suhu.toFixed(2)))
                    if (parseInt(number_suhu.toFixed(2)) > 0 && parseInt(number_suhu.toFixed(2)) < 37.5) {
                        $ionicLoading.show();
                        console.log('TES');
                        var suhu = document.getElementById("suhu").value;
                        console.log(suhu)
                        var waktu = $filter('date')(new Date(), 'dd-MM-yyyy HH:mm:ss');
                        var tanggal = $filter('date')(new Date(), 'dd-MM-yyyy');
                        var bulan = $filter('date')(new Date(), 'MM-yyyy');

                        console.log($scope.formData.nama);


                        firebase.database().ref('absensi/' + bulan + '/'+ tanggal + '/' + $scope.formData.uid).set({
                            nama: $scope.formData.nama,
                            waktu: waktu,
                            tanggal: tanggal,
                            uid: $scope.formData.uid,
                            nisn: $scope.formData.nisn,
                            suhu: suhu,
                            absen: $scope.formData.absen,
                            kelas: $scope.formData.kelas,
                        })
                            .then(function () {
                                Swal.fire({
                                    title: 'Absensi Berhasil!',
                                    text: 'Suhu Anda :' + $scope.suhu,
                                    icon: 'success',
                                    showCancelButton: false,
                                    showConfirmButton: false
                                })
                                // $("#modal_tambah").modal();
                                $ionicLoading.hide();
                                var delayInMilliseconds = 3000; //1 second

                                setTimeout(function () {
                                    //your code to be executed after 1 second
                                    firebase.database().ref('DHT22/temp').update({
                                        suhu: '0',
                                    }).then(function () {
                                        // $("#modal_tambah").modal('fade')
                                        // $("#modal_tambah").modal('hide')
                                        Swal.close();
                                        $state.go('alat2');
                                    })
                                }, delayInMilliseconds);
                            })
                    } else if (parseInt(number_suhu.toFixed(2)) > 37.5) {
                        // window.alert('KURANG')
                        console.log('TES');
                        Swal.fire({
                            title: 'Absensi Gagal!',
                            text: 'Suhu anda melebihi suhu normal. Silahkan cek kembali,',
                            icon: 'danger',
                            showCancelButton: false,
                            showConfirmButton: false
                        })
                        // $("#modal_tambah").modal();
                        $ionicLoading.hide();
                        var delayInMilliseconds = 2500; //1 second

                        setTimeout(function () {
                            //your code to be executed after 1 second
                            firebase.database().ref('DHT22/temp').update({
                                suhu: '0',
                            }).then(function () {
                                // $("#modal_tambah").modal('fade')
                                // $("#modal_tambah").modal('hide')
                                Swal.close();
                                $state.go('alat2');
                            })
                        }, delayInMilliseconds);
                    }
                });

                // $scope.hadir = function () {
                //     $ionicLoading.show();
                //     console.log('TES');
                //     var suhu = document.getElementById("suhu").value;
                //     console.log(suhu)
                //     var waktu = $filter('date')(new Date(), 'dd-MM-yyyy HH:mm:ss');
                //     var tanggal = $filter('date')(new Date(), 'dd-MM-yyyy');

                //     console.log($scope.formData.nama);


                //     firebase.database().ref('absensi/' + bulan + '/'+ tanggal + '/' + $scope.formData.uid).set({
                //         nama: $scope.formData.nama,
                //         waktu: waktu,
                //         tanggal: tanggal,
                //         uid: $scope.formData.uid,
                //         absen: $scope.formData.absen,
                //         nisn: $scope.formData.nisn,
                //         kelas: $scope.formData.kelas,
                //     })
                //         .then(function () {
                //             $ionicLoading.hide();
                //             firebase.database().ref('DHT22/temp').update({
                //                 suhu: '0',
                //             })
                //             $state.go('welcome');
                //         })
                // }
            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('alat2');
            }
        });
    }])
    .controller('dashboardAbsen3Ctrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('USER AKTIF');
                $ionicLoading.show();
                var useraktif = firebase.auth().currentUser;
                console.log(useraktif.uid)
                var dbRef = firebase.database();
                var pengguna = dbRef.ref('dataSiswa');
                pengguna.orderByChild('uid').equalTo(useraktif.uid).on("value", function (snapshot) {
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
                        $state.go('welcome');
                    }

                })

                $scope.logout = function () {
                    $("#modal_keluar").modal('hide')
                    firebase.auth().signOut();
                }
                // getSuhu
                firebase.database().ref('DHT33/temp').on('value', function (snapshot) {
                    var values = snapshot.val();
                    var number_suhu = parseFloat(values.suhu);
                    document.getElementById("suhu").value = number_suhu.toFixed(2);
                    $scope.suhu = number_suhu.toFixed(2);
                    console.log(parseInt(number_suhu.toFixed(2)))
                    if (parseInt(number_suhu.toFixed(2)) > 0 && parseInt(number_suhu.toFixed(2)) < 37.5) {
                        $ionicLoading.show();
                        console.log('TES');
                        var suhu = document.getElementById("suhu").value;
                        console.log(suhu)
                        var waktu = $filter('date')(new Date(), 'dd-MM-yyyy HH:mm:ss');
                        var tanggal = $filter('date')(new Date(), 'dd-MM-yyyy');
                        var bulan = $filter('date')(new Date(), 'MM-yyyy');

                        console.log($scope.formData.nama);


                        firebase.database().ref('absensi/' + bulan + '/'+ tanggal + '/' + $scope.formData.uid).set({
                            nama: $scope.formData.nama,
                            waktu: waktu,
                            tanggal: tanggal,
                            uid: $scope.formData.uid,
                            nisn: $scope.formData.nisn,
                            suhu: suhu,
                            absen: $scope.formData.absen,
                            kelas: $scope.formData.kelas,
                        })
                            .then(function () {
                                Swal.fire({
                                    title: 'Absensi Berhasil!',
                                    text: 'Suhu Anda :' + $scope.suhu,
                                    icon: 'success',
                                    showCancelButton: false,
                                    showConfirmButton: false
                                })
                                // $("#modal_tambah").modal();
                                $ionicLoading.hide();
                                var delayInMilliseconds = 3000; //1 second

                                setTimeout(function () {
                                    //your code to be executed after 1 second
                                    firebase.database().ref('DHT33/temp').update({
                                        suhu: '0',
                                    }).then(function () {
                                        // $("#modal_tambah").modal('fade')
                                        // $("#modal_tambah").modal('hide')
                                        Swal.close();
                                        $state.go('alat3');
                                    })
                                }, delayInMilliseconds);
                            })
                    } else if (parseInt(number_suhu.toFixed(2)) > 37.5) {
                        // window.alert('KURANG')
                        console.log('TES');
                        Swal.fire({
                            title: 'Absensi Gagal!',
                            text: 'Suhu anda melebihi suhu normal. Silahkan cek kembali,',
                            icon: 'danger',
                            showCancelButton: false,
                            showConfirmButton: false
                        })
                        // $("#modal_tambah").modal();
                        $ionicLoading.hide();
                        var delayInMilliseconds = 2500; //1 second

                        setTimeout(function () {
                            //your code to be executed after 1 second
                            firebase.database().ref('DHT33/temp').update({
                                suhu: '0',
                            }).then(function () {
                                // $("#modal_tambah").modal('fade')
                                // $("#modal_tambah").modal('hide')
                                Swal.close();
                                $state.go('alat3');
                            })
                        }, delayInMilliseconds);
                    }
                });

                // $scope.hadir = function () {
                //     $ionicLoading.show();
                //     console.log('TES');
                //     var suhu = document.getElementById("suhu").value;
                //     console.log(suhu)
                //     var waktu = $filter('date')(new Date(), 'dd-MM-yyyy HH:mm:ss');
                //     var tanggal = $filter('date')(new Date(), 'dd-MM-yyyy');

                //     console.log($scope.formData.nama);


                //     firebase.database().ref('absensi/' + bulan + '/'+ tanggal + '/' + $scope.formData.uid).set({
                //         nama: $scope.formData.nama,
                //         waktu: waktu,
                //         tanggal: tanggal,
                //         uid: $scope.formData.uid,
                //         absen: $scope.formData.absen,
                //         nisn: $scope.formData.nisn,
                //         kelas: $scope.formData.kelas,
                //     })
                //         .then(function () {
                //             $ionicLoading.hide();
                //             firebase.database().ref('DHT22/temp').update({
                //                 suhu: '0',
                //             })
                //             $state.go('welcome');
                //         })
                // }
            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('alat3');
            }
        });
    }])
    .controller('dashboardAbsenBelakangCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('USER AKTIF');
                $ionicLoading.show();
                var useraktif = firebase.auth().currentUser;
                console.log(useraktif.uid)
                var dbRef = firebase.database();
                var pengguna = dbRef.ref('dataSiswa');
                pengguna.orderByChild('uid').equalTo(useraktif.uid).on("value", function (snapshot) {
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
                        $state.go('welcome');
                    }

                })

                $scope.logout = function () {
                    $("#modal_keluar").modal('hide')
                    firebase.auth().signOut();
                }
                // getSuhu
                firebase.database().ref('DHT33/temp').on('value', function (snapshot) {
                    var values = snapshot.val();
                    var number_suhu = parseFloat(values.suhu);
                    document.getElementById("suhu").value = number_suhu.toFixed(2);
                    $scope.suhu = number_suhu.toFixed(2);
                    console.log(parseInt(number_suhu.toFixed(2)))
                    if (parseInt(number_suhu.toFixed(2)) > 0 && parseInt(number_suhu.toFixed(2)) < 37.5) {
                        $ionicLoading.show();
                        console.log('TES');
                        var suhu = document.getElementById("suhu").value;
                        console.log(suhu)
                        var waktu = $filter('date')(new Date(), 'dd-MM-yyyy HH:mm:ss');
                        var tanggal = $filter('date')(new Date(), 'dd-MM-yyyy');
                        var bulan = $filter('date')(new Date(), 'MM-yyyy');

                        console.log($scope.formData.nama);


                        firebase.database().ref('absensi/' + bulan + '/'+ tanggal + '/' + $scope.formData.uid).set({
                            nama: $scope.formData.nama,
                            waktu: waktu,
                            tanggal: tanggal,
                            uid: $scope.formData.uid,
                            nisn: $scope.formData.nisn,
                            suhu: suhu,
                            absen: $scope.formData.absen,
                            kelas: $scope.formData.kelas,
                        })
                            .then(function () {
                                Swal.fire({
                                    title: 'Absensi Berhasil!',
                                    text: 'Suhu Anda :' + $scope.suhu,
                                    icon: 'success',
                                    showCancelButton: false,
                                    showConfirmButton: false
                                })
                                // $("#modal_tambah").modal();
                                $ionicLoading.hide();
                                var delayInMilliseconds = 3000; //1 second

                                setTimeout(function () {
                                    //your code to be executed after 1 second
                                    firebase.database().ref('DHT33/temp').update({
                                        suhu: '0',
                                    }).then(function () {
                                        // $("#modal_tambah").modal('fade')
                                        // $("#modal_tambah").modal('hide')
                                        Swal.close();
                                        $state.go('alatbelakang');
                                    })
                                }, delayInMilliseconds);
                            })
                    } else if (parseInt(number_suhu.toFixed(2)) > 37.5) {
                        // window.alert('KURANG')
                        console.log('TES');
                        Swal.fire({
                            title: 'Absensi Gagal!',
                            text: 'Suhu anda melebihi suhu normal. Silahkan cek kembali,',
                            icon: 'danger',
                            showCancelButton: false,
                            showConfirmButton: false
                        })
                        // $("#modal_tambah").modal();
                        $ionicLoading.hide();
                        var delayInMilliseconds = 2500; //1 second

                        setTimeout(function () {
                            //your code to be executed after 1 second
                            firebase.database().ref('DHT33/temp').update({
                                suhu: '0',
                            }).then(function () {
                                // $("#modal_tambah").modal('fade')
                                // $("#modal_tambah").modal('hide')
                                Swal.close();
                                $state.go('alatbelakang');
                            })
                        }, delayInMilliseconds);
                    }
                });

                // $scope.hadir = function () {
                //     $ionicLoading.show();
                //     console.log('TES');
                //     var suhu = document.getElementById("suhu").value;
                //     console.log(suhu)
                //     var waktu = $filter('date')(new Date(), 'dd-MM-yyyy HH:mm:ss');
                //     var tanggal = $filter('date')(new Date(), 'dd-MM-yyyy');

                //     console.log($scope.formData.nama);


                //     firebase.database().ref('absensi/' + bulan + '/'+ tanggal + '/' + $scope.formData.uid).set({
                //         nama: $scope.formData.nama,
                //         waktu: waktu,
                //         tanggal: tanggal,
                //         uid: $scope.formData.uid,
                //         absen: $scope.formData.absen,
                //         nisn: $scope.formData.nisn,
                //         kelas: $scope.formData.kelas,
                //     })
                //         .then(function () {
                //             $ionicLoading.hide();
                //             firebase.database().ref('DHT22/temp').update({
                //                 suhu: '0',
                //             })
                //             $state.go('welcome');
                //         })
                // }
            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('alat3');
            }
        });
    }])
