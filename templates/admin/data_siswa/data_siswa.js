angular.module('data_siswaAdmin', [])
    .controller('data_siswaAdminCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        $("#alert-dataSiswa-success").hide();
        $("#alert-updateSiswa-success").hide();
        $("#alert-dataSiswa-warning").hide();
        $("#alert-deleteSiswa-danger").hide();
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
                $scope.cetak = function () {
                    var wb = XLSX.utils.table_to_book(document.getElementById('tbl-data-adminSiswa'));
                    XLSX.writeFile(wb, "Data Absensi" + ".xlsx");
                }
            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }

            var ref = firebase.database().ref("dataSiswa");
            var listRef = $firebaseArray(ref);

            $ionicLoading.show();
            listRef.$loaded().then(function (response) {
                $ionicLoading.hide();
                console.log(response);
                $scope.siswa = response;
            })
            // CREATE
            $scope.tambah = function () {
                var nama = document.getElementById("namaAbsenAdd").value;
                var jenis_kelamin = document.getElementById("jenisKelaminAbsenAdd").value;
                var tempat_lahir = document.getElementById("tempat_lahirAbsenAdd").value;
                var tanggal_lahir = document.getElementById("tanggal_lahirAbsenAdd").value;
                var agama = document.getElementById("agamaAbsenAdd").value;
                var nisn = document.getElementById("nisnAbsenAdd").value;
                var nis = document.getElementById("nisAbsenAdd").value;
                var noabsen = document.getElementById("noAbsenAdd").value;
                var kelas = document.getElementById("kelasAbsenAdd").value;
                var alamat = document.getElementById("alamatAbsenAdd").value;
                var email= nisn+'@gmail.com';
                var password = '12345678';

                // console.log(tanggal_lahir)
                // console.log(nama +' '+ nisn + ' ' +jenis_kelamin+ ' ' + tempat_lahir + ' ' + tanggal_lahir + ' ' + agama +' ' + alamat)
                var reftambahSiswa = firebase.database().ref('dataSiswa/' + nisn)
                reftambahSiswa.set({
                    "nama": nama,
                    "nisn": nisn,
                    "jenis_kelamin" : jenis_kelamin,
                    "tempat_lahir": tempat_lahir,
                    "tanggal_lahir": tanggal_lahir,
                    "agama": agama,
                    "alamat" : alamat,
                    "email":email,
                    "password":password,
                    "foto":"https://firebasestorage.googleapis.com/v0/b/absensispensa-ffd99.appspot.com/o/user-image.png?alt=media&token=64049cca-f8eb-4b3e-a816-1e96d7c1fef7",
                    "kelas": kelas,
                    "nis": nis,
                    "no_absen": noabsen,
                    "uid": "-"

                }).then(function (response) {
                    $("#modal_tambah").modal('hide');
                    $('.modal-backdrop').remove();
                    $("#alert-dataSiswa-success").show(function () {
                        $("#alert-dataSiswa-success").fadeTo(2000, 500).slideUp(500, function () {
                            $("#alert-dataSiswa-success").slideUp(500);
                        });
                    });
                    return true;
                })
            }
            //UPDATE
            var updateID = '';
            $('body').on('click', '.updateDataSiswa ', function () {
                updateID = $(this).attr('data-id');
                // window.alert(updateID);
                firebase.database().ref('dataSiswa/' + updateID).on('value', function (snapshot) {
                    var values = snapshot.val();
                    document.getElementById("namaAbsen").value = values.nama;
                    document.getElementById("nisnAbsen").value = values.nisn;
                    document.getElementById("nisAbsen").value = values.nis;
                    document.getElementById("agamaAbsen").value = values.agama;
                    document.getElementById("alamatAbsen").value = values.alamat;
                    document.getElementById("jenisKelaminAbsen").value = values.jenis_kelamin;
                    document.getElementById("tanggal_lahirAbsen").value = values.tanggal_lahir;
                    document.getElementById("tempat_lahirAbsen").value = values.tempat_lahir;
                    document.getElementById("noabsenAbsen").value = values.no_absen;
                    document.getElementById("kelasAbsen").value = values.kelas;
                    document.getElementById("fotoSiswa").src = values.foto;


                });

                $scope.simpan = function () {
                    var nisn = document.getElementById("nisnAbsen").value;
                    console.log(nisn)
                    // File 
                    var storageRefDok = firebase.storage().ref("siswa/" +nisn+ "/fotoAbsen");
                    var storageDok = $firebaseStorage(storageRefDok);
                    var fileDok = document.getElementById("fotoAbsen").files[0];

                    var metadata = {
                        contentType: fileDok.type
                    }
                    //Upload File
                    console.log(file);
                    var uploadTask = storageDok.$put(fileDok);
                    $ionicLoading.show();
                    uploadTask.$complete(function (snapshot) {
                        //console.log(snapshot);
                        storageRefDok.getDownloadURL().then(function (url) {
                            //console.log(url);
                            var refAddFoto = firebase.database().ref('dataSiswa/' + nisn)
                            refAddFoto.update({
                                "foto": url,
                            }).then(function (response) {
                                $ionicLoading.hide();
                                ////console.log(response);
                                return true;
                            }).then(function (error) {
                                ////console.log(error);
                            });
                        }).catch(function (error) {
                            // Handle any errors
                        });
                    })
                }

                $scope.simpanEditData = function () {
                    $ionicLoading.show()
                    console.log(updateID);
                    var namaEdit = document.getElementById("namaAbsen").value;
                    var alamatEdit = document.getElementById("alamatAbsen").value;
                    console.log(namaEdit, alamatEdit);
                    firebase.database().ref('dataSiswa/' + updateID).update({
                        "nama": namaEdit,
                        "alamat": alamatEdit
                    }).then(function (response) {
                        $ionicLoading.hide();
                        window.alert('Data Berhasil di Update')
                        $("#modal_edit").modal('hide');
                        ////console.log(response);
                        return true;
                    })
                }
            });

            //HAPUS
            var id = '';
            $("body").on('click', '.removeDataSiswa', function () {
                id = $(this).attr('data-id');
                $scope.HapusData = function () {
                    firebase.database().ref('dataSiswa/' + id).remove();
                    // window.alert("Data Berhasil Dihapus");
                    $("#modal_hapus").modal('hide');
                    $("#alert-deleteSiswa-danger").show(function () {
                        $("#alert-deleteSiswa-danger").fadeTo(2000, 500).slideUp(500, function () {
                            $("#alert-deleteSiswa-danger").slideUp(500);
                        });
                    });

                }
            });

        });
        $scope.dataAbsensi = function () {
            $state.go('data_absensiAdmin');
        }
        $scope.dataSiswa = function () {
            $state.go('data_siswaAdmin');
        }
        $scope.beranda = function () {
            $state.go('berandaAdmin');
        }
    }])
