import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'

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
const auth = getAuth();
const db = getFirestore(app);

let user = null;
onAuthStateChanged(auth, (authUser) => {
    user = authUser;
});


$(document).ready(function() {
    function clearLists() {
        $('.note-list').empty()
        $('.notes-container').empty()
    }

    function showError() {
        $('.gradient-btn').addClass('error-btn');
        setTimeout(function() { 
            $('.gradient-btn').removeClass('error-btn')
        }, 500);
    };

    $('.nav-bar__user').click(function() {
        if(user) {
            $('#account_email').text(user.email)
            $('#account_window').show();
        } else {
            $('#login_window').show();
        }
    });
    
    $('.another-way-btn').click(function() {
        $('#signup_window').toggle();
    });
    
    $(window).click(function(event) {
        if ((event.target === $('#login_window')[0]) || (event.target === $('#signup_window')[0]) || (event.target === $('#account_window')[0])) {
            $('#login_window').hide();
            $('#signup_window').hide();
            $('#account_window').hide();
        };
    });

    
    $('#login').submit(function(event) {
        event.preventDefault();
        const email = $('#login_email').val();
        const password = $('#login_password').val();
    
        signInWithEmailAndPassword(auth, email, password)
        .then(function(userCredential) {
            const user = userCredential.user;
            $('#login_window').hide()
        })
        .catch(function(error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            showError();
            console.error('Registration error:', errorCode, errorMessage);
        });
    });

    $('#signup').submit(function(event) {
        event.preventDefault();
        const email = $('#signup_email').val();
        let password = '';
        try {
            if ($('#signup_password').val() == $('#signup_password_confirm').val()) {
                password = $('#signup_password').val()
            } else {
                throw 'different passwords';
            }
        } catch(error) {
            showError();
            return;
        }
        createUserWithEmailAndPassword(auth, email, password)
        .then(function(userCredential) {
            const user = userCredential.user;
            $('#signup_window').hide()
            $('#login_window').hide()
        })
        .catch(function(error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            showError();
            console.error('Registration error:', errorCode, errorMessage);
        });
    });
    
    onAuthStateChanged(auth, async function() {
        if (user) {
            const querySnapshot = await getDocs(collection(db, user.uid));
            clearLists();
            querySnapshot.forEach((document) => {
                $('.note-list').append('<li class="note-list__item" data-note-id="' + document.data().id + '"><span class="note_name">' + document.data().title + '</span></li>');
                $('.notes-container').append('<div class="note" data-note-id="' + document.data().id + '"><div class="note__title-container"><h1 class="note__title-item" contenteditable="true">' + document.data().title + '</h1></div><div class="note__body-container"><div class="note__body-item" contenteditable="true">' + document.data().body + '</div></div></div>');
            });
        } else {
            clearLists();
            $('.note-list').append('<li class="note-list__item active-item" data-note-id="1"><span     class="note_name">Untitled</span></li>');
            $('.notes-container').append('<div class="note active-note" data-note-id="1"><div class="note__title-container"><h1 class="note__title-item" contenteditable="true">Untitled</h1></div><div class="note__body-container"><div class="note__body-item" contenteditable="true">Hello</div></div></div>');
        }
    });

    $('.nav-bar__logout').click(function() {
        auth.signOut()
    })

    $('#save_notes').click(async function() {
        $(this).text('Saving')
        const querySnapshot = await getDocs(collection(db, user.uid));
        querySnapshot.forEach(async function(document) {
            await deleteDoc(doc(db, user.uid, document.id));    
        })
        $('.notes-container .note').each(async function() {
            const noteId = $(this).data('noteId');
            const noteTitle = $(this).find('.note__title-item').text();
            const noteBody = $(this).find('.note__body-item').text();
            try {
                const docRef = await addDoc(collection(db, user.uid), {
                    id: noteId,
                    title: noteTitle,
                    body: noteBody,
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        });
        $(this).text('Save notes')
    })
});

