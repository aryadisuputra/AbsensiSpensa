angular.module('app.authentification', [])
  .controller('welcomeCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
    $("#alert-email-tidak-ditemukan").hide();
    $("#alert-emailAdmin-tidak-ditemukan").hide();
    $("#alert-password-salah").hide();

    firebase.auth().signOut();


    //CEK STATUS USER

    $scope.alat1 = function () {
      $state.go('alat1');
    }
    $scope.alat2 = function () {
      $state.go('alat2');
    }
    $scope.alat3 = function () {
      $state.go('alat3');
    }

  }])

  .controller('alat1Ctrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
    $("#alert-email-tidak-ditemukan").hide();
    $("#alert-emailAdmin-tidak-ditemukan").hide();
    $("#alert-password-salah").hide();

    firebase.auth().signOut();


    //CEK STATUS USER
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log('USER AKTIF');
        $state.go('dashboardAbsen1');
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
                var emailogin = dataSnapShot.val().email;
                var passwordlogin = dataSnapShot.val().password;
                var nisn = dataSnapShot.val().nisn;
                firebase.auth().signInWithEmailAndPassword(emailogin, passwordlogin).then(function (result) {
                  var userUid = result.user.uid;
                  $ionicLoading.hide()
                  $state.go('dashboardAbsen1',
                    {
                      nisn: res
                    });
                }).catch(function (error) {
                  // Handle Errors here.
                  $ionicLoading.hide()
                  var errorCode = error.code;
                  var errorMessage = error.message;

                  if (errorCode == 'auth/user-not-found') {
                    // return window.alert('Akun Siswa belum terdaftar');
                    $firebaseAuth().$createUserWithEmailAndPassword(emailogin, passwordlogin)
                    .then(function (response) {
                        var user = firebase.auth().currentUser;
                        firebase.database().ref('dataSiswa').child(nisn).update({
                            uid: user.uid,

                        });
                        $ionicLoading.hide();
                        // window.alert('Upload Berhasil');
                        // $state.go('dashboard');
                    })

                    .catch(function (error) {
                        $ionicLoading.hide();
                        //console.log(error);
                        $ionicPopup.alert({
                            title: 'Information',
                            template: error.message,
                            okType: 'button-positive'
                        });
                    });
                  }
                  else if (errorCode == 'auth/wrong-password') {
                    return window.alert('Password tidak sesuai');
                  }
                  else {
                    return window.alert(errorMessage);
                  }
                });
              })
            });

          }
          else {
            // window.alert('ID di scan Tidak Ada');
            Swal.fire({
              title: 'Absensi Gagal!',
              text: 'Akun Belum Terdata',
              icon: 'success',
              showCancelButton: false,
              showConfirmButton: false
            })
          // $("#modal_tambah").modal();
          $ionicLoading.hide();
          var delayInMilliseconds = 2500; //1 second
          
          setTimeout(function() {
              //your code to be executed after 1 second
              Swal.close();
              location.reload()
          }, delayInMilliseconds);

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
    .getUserMedia({ video: true})
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
    // $scope.scanqr = function () {
    //   // $state.go('scankartu');
    //   navigator.mediaDevices
    //     .getUserMedia({ video: { facingMode: "environment" } })
    //     .then(function (stream) {
    //       scanning = true;
    //       //   qrResult.hidden = true;
    //       //   btnScanQR.hidden = true;
    //       canvasElement.hidden = false;
    //       document.getElementById("scanan").hidden = false;
    //       document.getElementById("tombolqr").hidden = true;
    //       video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    //       video.srcObject = stream;
    //       video.play();
    //       tick();
    //       scan();
    //     });
    // }

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
    // btnScanQR.onclick = () => {

    //   };
  }])

  .controller('alat2Ctrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
    $("#alert-email-tidak-ditemukan").hide();
    $("#alert-emailAdmin-tidak-ditemukan").hide();
    $("#alert-password-salah").hide();

    firebase.auth().signOut();


    //CEK STATUS USER
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log('USER AKTIF');
        $state.go('dashboardAbsen2');
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

        firebase.database().ref('siswa').orderByChild('nisn').equalTo(res).on('value', function (snapshot) {
          hasil = snapshot.val();
          console.log(hasil);
          if (snapshot.val()) {
            $ionicLoading.show()
            snapshot.forEach(function (data) {
              console.log(data.key);
              let firebaseRefKey = firebase.database().ref('siswa').child(data.key);
              firebaseRefKey.on('value', (dataSnapShot) => {

                console.log(dataSnapShot.val().nama);
                var emailogin = dataSnapShot.val().email;
                var passwordlogin = dataSnapShot.val().password;
                firebase.auth().signInWithEmailAndPassword(emailogin, passwordlogin).then(function (result) {
                  var userUid = result.user.uid;
                  $ionicLoading.hide()
                  $state.go('dashboardAbsen2',
                    {
                      nisn: res
                    });
                }).catch(function (error) {
                  // Handle Errors here.
                  $ionicLoading.hide()
                  var errorCode = error.code;
                  var errorMessage = error.message;

                  if (errorCode == 'auth/user-not-found') {
                    return window.alert('Akun Siswa belum terdaftar');
                  }
                  else if (errorCode == 'auth/wrong-password') {
                    return window.alert('Password tidak sesuai');
                  }
                  else {
                    return window.alert(errorMessage);
                  }
                });
              })
            });

          }
          else {
            return window.alert('ID di scan Tidak Ada');
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
    .getUserMedia({ video: true})
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
    // $scope.scanqr = function () {
    //   // $state.go('scankartu');
    //   navigator.mediaDevices
    //     .getUserMedia({ video: { facingMode: "environment" } })
    //     .then(function (stream) {
    //       scanning = true;
    //       //   qrResult.hidden = true;
    //       //   btnScanQR.hidden = true;
    //       canvasElement.hidden = false;
    //       document.getElementById("scanan").hidden = false;
    //       document.getElementById("tombolqr").hidden = true;
    //       video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    //       video.srcObject = stream;
    //       video.play();
    //       tick();
    //       scan();
    //     });
    // }

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
    // btnScanQR.onclick = () => {

    //   };
  }])

  .controller('alat3Ctrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
    $("#alert-email-tidak-ditemukan").hide();
    $("#alert-emailAdmin-tidak-ditemukan").hide();
    $("#alert-password-salah").hide();

    firebase.auth().signOut();


    //CEK STATUS USER
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log('USER AKTIF');
        $state.go('dashboardAbsen3');
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

        firebase.database().ref('siswa').orderByChild('nisn').equalTo(res).on('value', function (snapshot) {
          hasil = snapshot.val();
          console.log(hasil);
          if (snapshot.val()) {
            $ionicLoading.show()
            snapshot.forEach(function (data) {
              console.log(data.key);
              let firebaseRefKey = firebase.database().ref('siswa').child(data.key);
              firebaseRefKey.on('value', (dataSnapShot) => {

                console.log(dataSnapShot.val().nama);
                var emailogin = dataSnapShot.val().email;
                var passwordlogin = dataSnapShot.val().password;
                firebase.auth().signInWithEmailAndPassword(emailogin, passwordlogin).then(function (result) {
                  var userUid = result.user.uid;
                  $ionicLoading.hide()
                  $state.go('dashboardAbsen3',
                    {
                      nisn: res
                    });
                }).catch(function (error) {
                  // Handle Errors here.
                  $ionicLoading.hide()
                  var errorCode = error.code;
                  var errorMessage = error.message;

                  if (errorCode == 'auth/user-not-found') {
                    return window.alert('Akun Siswa belum terdaftar');
                  }
                  else if (errorCode == 'auth/wrong-password') {
                    return window.alert('Password tidak sesuai');
                  }
                  else {
                    return window.alert(errorMessage);
                  }
                });
              })
            });

          }
          else {
            return window.alert('ID di scan Tidak Ada');
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
    .getUserMedia({ video: true})
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
    // $scope.scanqr = function () {
    //   // $state.go('scankartu');
    //   navigator.mediaDevices
    //     .getUserMedia({ video: { facingMode: "environment" } })
    //     .then(function (stream) {
    //       scanning = true;
    //       //   qrResult.hidden = true;
    //       //   btnScanQR.hidden = true;
    //       canvasElement.hidden = false;
    //       document.getElementById("scanan").hidden = false;
    //       document.getElementById("tombolqr").hidden = true;
    //       video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    //       video.srcObject = stream;
    //       video.play();
    //       tick();
    //       scan();
    //     });
    // }

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
    // btnScanQR.onclick = () => {

    //   };
  }])


