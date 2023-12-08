$(document).ready(function() {
    $('.nav-bar__show').click(function() {
        $('.side-bar').toggleClass('active-side-bar')
    })

    $('.note-list').on('click', '.note-list__item', function() {
        $(this).addClass('active-item').siblings().removeClass('active-item');

        let activeNoteId = $(this).data('note-id');
        $('.note').filter('[data-note-id="' + activeNoteId + '"]').addClass('active-note').siblings().removeClass('active-note');
    });

    $('.notes-container').on('input', '.note__title-item', function() {
        $('.active-item .note-list__item__name').text($(this).text());
        $(this).blur(function() {
            if($(this).text() === '') {
                $(this).text('Untitled')
                $('.active-item .note-list__item__name').text('Untitled');
            }
        })
    });

    $('.new-note').click(function() {
        let noteId = $('.note-list .note-list__item').length + 1; 
        $('.note-list').append('<li class="note-list__item" data-note-id="' + noteId + '"><span class="note-list__item__name">Untitled</span></li>');
        $('.notes-container').append('<div class="note" data-note-id="' + noteId + '"><div class="note__title-container"><h1 class="note__title-item" contenteditable="true">Untitled</h1></div><div class="note__body-container"><div class="note__body-item" contenteditable="true">First note</div></div></div>');
    });

    $('.delete-note').click(function() {
        $('.active-item').remove();
        $('.active-note').remove();
    })

    $('.sort').click(function(event) {
        $('.sort__select').show();
        event.stopPropagation();
    })
    $('.sort__select').change(function() {
        let items = $('.note-list .note-list__item');
        switch($(this).val()) {
            case 'new-to-old':
                items.sort(function(a, b) {
                    return $(b).data('note-id') - $(a).data('note-id');
                })
                $('.note-list').html(items);
                break;
            case 'old-to-new':
                items.sort(function(a, b) {
                    return $(a).data('note-id') - $(b).data('note-id');
                })
                $('.note-list').html(items);
                break;
            case 'a-z':
                items.sort(function(a, b) {
                    let aName = $(a).find('.note-list__item__name').text().toLowerCase();
                    let bName = $(b).find('.note-list__item__name').text().toLowerCase();
                    return aName.localeCompare(bName);
                });
                $('.note-list').html(items);
                break;
            case 'z-a':
                items.sort(function(a, b) {
                    let aName = $(a).find('.note-list__item__name').text().toLowerCase();
                    let bName = $(b).find('.note-list__item__name').text().toLowerCase();
                    return bName.localeCompare(aName);
                });
                $('.note-list').html(items);
                break;
        }
        $(this).hide()
    })
    $(document).click(function(e) {
        if (!$(e.target).closest('.sort__select').length) {
          $('.sort__select').hide();
        }
    });
})
