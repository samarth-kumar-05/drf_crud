function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

// Use csrf token while doing post request, this will prevent 500 Server Error
$.ajaxSetup({
    crossDomain: false, // obviates need for sameOrigin test
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type)) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
}); 

//All Products API
$.ajax({
    url : "http://localhost:8000/api/book-list/",
    dataType: "json",
    success : function (response) {
        let trHTML = '';
        $.each(response, function (i, item) {
           trHTML += "<tr><th>" + item.id + "</th><td>" + item.name + "</td><td>" + item.author  +  "</td><td> <button class='btn btn-success update btn-sm' id ="+ item.id +" data-toggle='modal' data-target='#editProduct'>Update</button> <button class='btn btn-danger btn-sm delete' id ="+ item.id +" data-toggle='modal' data-target='#deleteProduct'>Delete</button>"
           "</td></tr>";
        });
        $('#Product-Records').append(trHTML);
    }
});

$('#create').click(function(){ 
    $("#add-Product").trigger('reset');
});

//Save New Product Button
$(function() { 
        $('#addProduct').on('submit', function(e) { 
            e.preventDefault();  

            let myurl = "http://localhost:8000/api/book-create/";

        $.ajax({
            type : 'POST',
            url : myurl,
            data : $("#addProduct :input").serializeArray(),
            dataType: "json",
            success: function(data){
                alert("Book Added!");
                location.reload();
            },
            error:function(data){
                alert("Book Not Added!");
                location.reload();
            }
        });
    });
});

//Edit Products API
$('#Product-Records').on('click', '.update', function(e){
    e.preventDefault();
    
    let id = $(this).attr('id');
    $('input[id=Myid]').val(id);

    let myurl = "http://localhost:8000/api/'book-detail/"+id+"/";

    $( "#p-name" ).change(function() {
        $('input[name=name]').val($(this).val());
    });
    $( "#a-name" ).change(function() {
        $('input[author=author]').val($(this).val());
    });


    $.ajax({
        async: true,
        url:myurl,
        method:'GET',
        success: function(result){
            $('input[name="name"]').val(result.name);
            $('input[name="author"]').val(result.name);

        }
    });

});

//Save Edited Product Button
$(function() { 
        $('#editProduct').on('submit', function(e) { 
            e.preventDefault();  

            let id = $("#Myid").attr("value");
            console.log(id);

            let myurl = "http://localhost:8000/api/book-update/"+id+"/";

        $.ajax({
            type : 'PUT',
            url : myurl,
            data : $("#editProduct :input").serializeArray(),
            dataType: "json",
            success: function(data){
                alert("Book Updated!");
                location.reload();
            },
            error:function(data){
                alert("Book Not Updated!");
                location.reload();
            }
        });
    });
});

//Delete Products API
$('#Product-Records').on('click', ".delete", function(e){
    e.preventDefault();
    
    let id = $(this).attr('id');
    $('input[id=Myid]').val(id);
    console.log(id)

    let myurl = "http://localhost:8000/api/book-delete/"+id+"/";

    $.ajax({
        async: true,
        url:myurl,
        method:'GET',
        success: function(result){
            $('input[name="id"]').val(result.id);
        }
    });

});

//Save Delete Products Button
$(function() { 
        $('#deleteProduct').on('submit', function(e) { 
            e.preventDefault(); 

            let id = $("#Myid").attr("value");
            console.log(id);

        let myurl = "http://localhost:8000/api/book-delete/"+id+"/";

        $.ajax({
            async: true,
            url:myurl,
            method:'DELETE',
            success: function(result){
                location.reload();
            },
            error:function(result){
                alert("Book Not Deleted!");
                location.reload();
            }
        });

    });
});   