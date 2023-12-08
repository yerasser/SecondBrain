$(document).ready(function() {
    $('.show').click(function() {
        $('.side_bar').toggleClass('active_side_bar')
        
    })

    $('.note_list').on('click', '.item_note_list', function() {
        $(this).addClass('active_item').siblings().removeClass('active_item');

        let activeNoteId = $(this).data('note-id');
        $('.note').filter('[data-note-id="' + activeNoteId + '"]').addClass('active_note').siblings().removeClass('active_note');
    });

    $('.all_notes').on('input', '.note_title', function() {
        $('.active_item .note_name').text($(this).text());
        $(this).blur(function() {
            if($(this).text() === '') {
                $(this).text('Untitled')
                $('.active_item .note_name').text('Untitled');
            }
        })
    });

    $('.new_note').click(function() {
        let noteId = $('.note_list .item_note_list').length + 1; 
        $('.note_list').append('<li class="item_note_list" data-note-id="' + noteId + '"><span class="note_name">Untitled</span></li>');
        $('.all_notes').append('<div class="note" data-note-id="' + noteId + '"><div class="container_note_title"><h1 class="note_title" contenteditable="true">Untitled</h1></div><div class="container_note_body"><div class="note_body" contenteditable="true">First note</div></div></div>');
    });

    $('.delete_note').click(function() {
        $('.active_item').remove();
        $('.active_note').remove();
    })

    $('.sort').click(function(event) {
        $('.sort_select').show();
        event.stopPropagation();
    })
    $('.sort_select').change(function() {
        let items = $('.note_list .item_note_list');
        switch($(this).val()) {
            case 'new_to_old':
                items.sort(function(a, b) {
                    return $(a).data('note-id') - $(b).data('note-id');
                })
                $('.note_list').html(items);
                break;
            case 'old_to_new':
                items.sort(function(a, b) {
                    return $(b).data('note-id') - $(a).data('note-id');
                })
                $('.note_list').html(items);
                break;
            case 'a_z':
                items.sort(function(a, b) {
                    let aName = $(a).find('.note_name').text().toLowerCase();
                    let bName = $(b).find('.note_name').text().toLowerCase();
                    return aName.localeCompare(bName);
                });
                $('.note_list').html(items);
                break;
            case 'z_a':
                items.sort(function(a, b) {
                    let aName = $(a).find('.note_name').text().toLowerCase();
                    let bName = $(b).find('.note_name').text().toLowerCase();
                    return bName.localeCompare(aName);
                });
                $('.note_list').html(items);
                break;
        }
        $(this).hide()
    })
    $(document).click(function(e) {
        if (!$(e.target).closest('.sort_select').length) {
          $('.sort_select').hide();
        }
    });
})
