angular.module('data_absensiAdmin', [])
    .controller('data_absensiAdminCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        $("#alert-dataAbsensi-success").hide();
        $("#alert-updateAbsensi-success").hide();
        $("#alert-dataAbsensi-warning").hide();
        $("#alert-deleteAbsensi-danger").hide();
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
                                    // "nip": dataSnapShot.val().nip,
                                    "nama": dataSnapShot.val().nama,
                                };

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

            var ref = firebase.database().ref("absensi");
            var listRef = $firebaseArray(ref);

            $ionicLoading.show();
            listRef.$loaded().then(function (response) {
                $ionicLoading.hide();
                console.log(response);
                $scope.bulan = response;
            })
            $scope.form = {
                "pilihTanggal": '',
                "pilihBulan": '',
                "pilihKelas": '',
            };
            $scope.getBulan = function () {
                console.log($scope.form.pilihBulan)
                if ($scope.form.pilihBulan != '') {
                    $scope.tampilPilihTanggal = true;
                    var ref2 = firebase.database().ref("absensi").child($scope.form.pilihBulan);
                    var listRef2 = $firebaseArray(ref2);
                    console.log(listRef2)

                    listRef2.$loaded().then(function (response) {
                        console.log(response);
                        $scope.tanggal = response;
                    })
                    $scope.getTanggal = function () {
                        var ref3 = firebase.database().ref("absensi").child($scope.form.pilihBulan).child($scope.form.pilihTanggal);
                        var listRef3 = $firebaseArray(ref3);

                        listRef3.$loaded().then(function (response) {
                            console.log(response);
                            $scope.absensi = response;
                            $scope.jumlahSiswa = response.length;
                        })

                        $scope.cetak = function () {
                            console.log('TES');
                            var wb = XLSX.utils.table_to_book(document.getElementById('tbl-data-absenSiswa'));
                            XLSX.writeFile(wb, "Data Absensi " + $scope.form.pilihTanggal + ".xlsx");
                        }

                        $scope.getKelas = function () {
                            console.log($scope.form.pilihKelas)
                            if ($scope.form.pilihKelas == 'all') {
                                var ref3 = firebase.database().ref("absensi").child($scope.form.pilihBulan).child($scope.form.pilihTanggal);
                                var listRef3 = $firebaseArray(ref3);
                                console.log(listRef3)

                                listRef3.$loaded().then(function (response) {
                                    console.log(response);
                                    $scope.absensi = response;
                                    $scope.jumlahSiswa = response.length;
                                })

                                $scope.cetak = function () {
                                    console.log('TES');
                                    var wb = XLSX.utils.table_to_book(document.getElementById('tbl-data-absenSiswa'));
                                    XLSX.writeFile(wb, "Data Absensi " + $scope.form.pilihTanggal + ".xlsx");
                                }
                            } else {
                                var ref3 = firebase.database().ref("absensi").child($scope.form.pilihBulan).child($scope.form.pilihTanggal).orderByChild('kelas').equalTo($scope.form.pilihKelas);
                                var listRef3 = $firebaseArray(ref3);
                                console.log(listRef3)

                                listRef3.$loaded().then(function (response) {
                                    console.log(response);
                                    $scope.absensi = response;
                                    $scope.jumlahSiswa = response.length;
                                })

                                $scope.cetak = function () {
                                    console.log('TES');
                                    var wb = XLSX.utils.table_to_book(document.getElementById('tbl-data-absenSiswa'));
                                    XLSX.writeFile(wb, "Data Absensi Kelas " + $scope.form.pilihKelas + ' tanggal ' + $scope.form.pilihTanggal + ".xlsx");
                                }
                            }
                        }

                        //UPDATE
                        var updateID = '';
                        $('body').on('click', '.updateDataAbsensi ', function () {
                            updateID = $(this).attr('data-id');
                            // window.alert(updateID);
                            firebase.database().ref('absensi/' + $scope.form.pilihBulan + '/'+ $scope.form.pilihTanggal + '/' + updateID).on('value', function (snapshot) {
                                var values = snapshot.val();
                                document.getElementById("waktuAbsen").value = values.waktu;
                                document.getElementById("namaAbsen").value = values.nama;
                                document.getElementById("noabsenAbsen").value = values.absen;
                                document.getElementById("kelasAbsen").value = values.kelas;
                                var number_suhu = parseFloat(values.suhu);
                                document.getElementById("suhuAbsen").value = number_suhu.toFixed(2);
                                document.getElementById("nisnAbsen").value = values.nisn;
                            });
                        });

                        //HAPUS
                        var id = '';
                        $("body").on('click', '.removeDataSiswa', function () {
                            id = $(this).attr('data-id');
                            $scope.HapusData = function () {
                                firebase.database().ref('absensi/' + $scope.form.pilihBulan + '/'+ $scope.form.pilihTanggal + '/'+ id).remove();
                                // window.alert("Data Berhasil Dihapus");
                                $("#modal_hapus").modal('hide');
                                $("#alert-deleteAbsensi-danger").show(function () {
                                    $("#alert-deleteAbsensi-danger").fadeTo(2000, 500).slideUp(500, function () {
                                        $("#alert-deleteAbsensi-danger").slideUp(500);
                                    });
                                });

                            }
                        });
                    }
                } else {
                    $scope.tampilPilihTanggal = false;
                }
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
        });
    }])