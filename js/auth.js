import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"
const firebaseConfig = {
    apiKey: "AIzaSyD34fZiUsl_zW3QF5-DxgJwT5gc4eY75vs",
    authDomain: "secondbrain-f51eb.firebaseapp.com",
    projectId: "secondbrain-f51eb",
    storageBucket: "secondbrain-f51eb.appspot.com",
    messagingSenderId: "165333528780",
    appId: "1:165333528780:web:eecce3036df6f99d7b5269",
    measurementId: "G-0F4FLNEM15"
  };

const app = initializeApp(firebaseConfig);



$(document).ready(function() {
    $('.user').click(function() {
        $('.auth_modal_window').show();
    });
    
    $('.not_now_btn').click(function() {
        $('.auth_modal_window').hide();
    });
    
    $(window).click(function(event) {
        if (event.target === $('.auth_modal_window')[0]) {
            $('.auth_modal_window').hide();
        }
    });
    
    
    $('#auth').submit(function(event) {
        event.preventDefault();
        const auth = getAuth();
        const name = $('#name').val();
        const password = $('#pswrd').val();
    
        signInWithEmailAndPassword(auth, name, password)
        .then(function(userCredential) {
            const user = userCredential.user;
            $('.auth_modal_window').hide();
            console.log('User registered:', user);
          })
        .catch(function(error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Registration error:', errorCode, errorMessage);
        });
    });
});
