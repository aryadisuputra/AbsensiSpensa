angular.module('app.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
      .state('welcome', {
        url: '/welcome',
        templateUrl: 'templates/auth/welcome/welcome.html',
        controller: 'welcomeCtrl'
      })

      .state('absensiSiswa', {
        url: '/absensiSiswa',
        templateUrl: 'templates/absensi_umum/absensi_umum.html',
        controller: 'absensiUmumCtrl'
      })

      .state('dashboardAbsen1', {
        url: '/dashboardAbsen1',
        templateUrl: 'templates/user/dashboard1.html',
        controller: 'dashboardAbsen1Ctrl'
      })
      .state('dashboardAbsen2', {
        url: '/dashboardAbsen2',
        templateUrl: 'templates/user/dashboard2.html',
        controller: 'dashboardAbsen2Ctrl'
      })
      .state('dashboardAbsen3', {
        url: '/dashboardAbsen3',
        templateUrl: 'templates/user/dashboard3.html',
        controller: 'dashboardAbsen3Ctrl'
      })

      .state('dashboardAbsenBelakang', {
        url: '/dashboardAbsenBelakang',
        templateUrl: 'templates/user/dashboardbelakang.html',
        controller: 'dashboardAbsenBelakangCtrl'
      })

      .state('alat1', {
        url: '/alat1',
        templateUrl: 'templates/auth/welcome/alat1.html',
        controller: 'alat1Ctrl'
      })

      .state('alat2', {
        url: '/alat2',
        templateUrl: 'templates/auth/welcome/alat2.html',
        controller: 'alat2Ctrl'
      })

      .state('alat3', {
        url: '/alat3',
        templateUrl: 'templates/auth/welcome/alat3.html',
        controller: 'alat3Ctrl'
      })

      .state('alatbelakang', {
        url: '/alatbelakang',
        templateUrl: 'templates/auth/welcome/alatbelakang.html',
        controller: 'alatbelakangCtrl'
      })

      // LOGIN ADMIN
      .state('loginAdmin', {
        url: '/loginAdmin',
        templateUrl: 'templates/admin/login/login.html',
        controller: 'loginAdminCtrl'
      })

      .state('berandaAdmin', {
        url: '/berandaAdmin',
        templateUrl: 'templates/admin/dashboard/dashboard.html',
        controller: 'berandaAdminCtrl'
      })


      .state('data_absensiAdmin', {
        url: '/data_absensiAdmin',
        templateUrl: 'templates/admin/data_absensi/data_absensi.html',
        controller: 'data_absensiAdminCtrl'
      })

      .state('data_siswaAdmin', {
        url: '/data_siswaAdmin',
        templateUrl: 'templates/admin/data_siswa/data_siswa.html',
        controller: 'data_siswaAdminCtrl'
      })

      .state('bukusaku', {
        url: '/bukusaku',
        templateUrl: 'templates/admin/bukusaku/bukusaku.html',
        controller: 'bukusakuCtrl'
      })

      .state('bukusaku_siswa', {
        params: {
          id: '',
        },
        url: '/bukusaku_siswa',
        templateUrl: 'templates/admin/bukusaku/bukusaku_siswa.html',
        controller: 'bukusaku_siswaCtrl'
      })
      
    $urlRouterProvider.otherwise('/welcome')


  });