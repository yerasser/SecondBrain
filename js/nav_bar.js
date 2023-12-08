import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"
import { getFirestore, collection, addDoc, getDoc, getDocs, deleteDoc, doc} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'

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
const db = getFirestore(app)

let user = null;
onAuthStateChanged(auth, (authUser) => {
    user = authUser
})


$(document).ready(function() {
    $('.user').click(function() {
        if(user) {
            $('#account_email').text(user.email)
            $('#account_window').show();
        } else {
            $('#login_window').show();
        }
    });
    
    $('.to_signup').click(function() {
        $('#signup_window').show();
    });
    $('.to_login').click(function() {
        $('#signup_window').hide();
    });
    
    $(window).click(function(event) {
        if ((event.target === $('#login_window')[0]) || (event.target === $('#signup_window')[0]) || (event.target === $('#account_window')[0])) {
            $('#login_window').hide();
            $('#signup_window').hide();
            $('#account_window').hide()
        }
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
            $('.auth_btn').addClass('error_input');
            setTimeout(function() { 
                $('.auth_btn').removeClass('error_input')
            }, 500)
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
            $('.auth_btn').addClass('error_input');
            setTimeout(function() { 
                $('.auth_btn').removeClass('error_input')
            }, 500)
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
            console.error('Registration error:', errorCode, errorMessage);
        });
    });
    
    onAuthStateChanged(auth, async function() {
        if (user) {
          const querySnapshot = await getDocs(collection(db, user.uid));
          $('.note_list').empty()
          $('.all_notes').empty()
          querySnapshot.forEach((document) => {
            $('.note_list').append('<li class="item_note_list" data-note-id="' + document.data().id + '"><span class="note_name">' + document.data().title + '</span></li>');
            $('.all_notes').append('<div class="note" data-note-id="' + document.data().id + '"><div class="container_note_title"><h1 class="note_title" contenteditable="true">' + document.data().title + '</h1></div><div class="container_note_body"><div class="note_body" contenteditable="true">' + document.data().body + '</div></div></div>');
          });
        } else {
          $('.note_list').empty()
          $('.all_notes').empty()
          $('.note_list').append('<li class="item_note_list active_item" data-note-id="1"><span class="note_name">Untitled</span></li>');
            $('.all_notes').append('<div class="note active_note" data-note-id="1"><div class="container_note_title"><h1 class="note_title" contenteditable="true">Untitled</h1></div><div class="container_note_body"><div class="note_body" contenteditable="true">Hello</div></div></div>');
        }
    });

    $('.logout').click(function() {
        auth.signOut()
    })

    // async function saveNotes() {
        
    // // }

    // $(window).on('beforeunload', async function() {
    //     const querySnapshot = await getDocs(collection(db, user.uid));
    //     querySnapshot.forEach(async function(document) {
    //         await deleteDoc(doc(db, user.uid, document.id));    
    //     })
    //     $('.all_notes .note').each(async function() {
    //         const noteId = $(this).data('noteId');
    //         const noteTitle = $(this).find('.note_title').text();
    //         const noteBody = $(this).find('.note_body').text();
    //         try {
    //           const docRef = await addDoc(collection(db, user.uid), {
    //             id: noteId,
    //             title: noteTitle,
    //             body: noteBody,
    //           });
    //           console.log("Document written with ID: ", docRef.id);
    //         } catch (e) {
    //           console.error("Error adding document: ", e);
    //         }
    //       });
    // })

    $('#save_notes').click(async function() {
        $(this).text('Saving')
        const querySnapshot = await getDocs(collection(db, user.uid));
        querySnapshot.forEach(async function(document) {
            await deleteDoc(doc(db, user.uid, document.id));    
        })
        $('.all_notes .note').each(async function() {
            const noteId = $(this).data('noteId');
            const noteTitle = $(this).find('.note_title').text();
            const noteBody = $(this).find('.note_body').text();
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

