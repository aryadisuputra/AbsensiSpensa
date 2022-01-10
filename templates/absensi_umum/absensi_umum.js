angular.module('absensiUmum', [])
    .controller('absensiUmumCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
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
        var ref = firebase.database().ref("absensi");
        var listRef = $firebaseArray(ref);

        $ionicLoading.show();
        listRef.$loaded().then(function (response) {
            $ionicLoading.hide();
            console.log(response);
            $scope.tanggal = response;
        })
        $scope.form = {
            "pilihTanggal": '',
            "pilihKelas": '',
        };
        $scope.getTanggal = function () {
            var ref2 = firebase.database().ref("absensi").child($scope.form.pilihTanggal);
            var listRef2 = $firebaseArray(ref2);
            console.log(listRef2)

            listRef2.$loaded().then(function (response) {
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
                    var ref3 = firebase.database().ref("absensi").child($scope.form.pilihTanggal);
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
                    var ref3 = firebase.database().ref("absensi").child($scope.form.pilihTanggal).orderByChild('kelas').equalTo($scope.form.pilihKelas);
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
                firebase.database().ref('absensi/' + $scope.form.pilihTanggal + '/' + updateID).on('value', function (snapshot) {
                    var values = snapshot.val();
                    document.getElementById("waktuAbsen").value = values.waktu;
                    document.getElementById("namaAbsen").value = values.nama;
                    document.getElementById("noabsenAbsen").value = values.absen;
                    document.getElementById("kelasAbsen").value = values.kelas;
                    document.getElementById("suhuAbsen").value = values.suhu;
                    document.getElementById("nisnAbsen").value = values.nisn;
                });
            });
        }

        //HAPUS
        var id = '';
        $("body").on('click', '.removeDataSiswa', function () {
            id = $(this).attr('data-id');
            $scope.HapusData = function () {
                firebase.database().ref('admin_Siswa/' + id).remove();
                // window.alert("Data Berhasil Dihapus");
                $("#modal_hapus").modal('hide');
                $("#alert-deleteSiswa-danger").show(function () {
                    $("#alert-deleteSiswa-danger").fadeTo(2000, 500).slideUp(500, function () {
                        $("#alert-deleteSiswa-danger").slideUp(500);
                    });
                });

            }
        });
    }])