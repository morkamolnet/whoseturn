
$(function () {

  var cookie = Cookies.get('user');

  function getUsers(){
    $.getJSON( "/beers/", function(data) {
      for(key in data){
        //Populate list
        $('#users').append('<li id="'+key+'" data-id="'+data[key]._id+'" data-name="'+data[key].cookie+'"\
         data-qty="'+data[key].unconfirmed+'"> \
         <div class="todo-icon fui-user"></div><div class="todo-count">'+ data[key].beers +'\
         </div><div class="todo-content"><h4 class="todo-name">'+data[key].name+'</h4>\
         <span class="unconfirmed">'+ data[key].unconfirmed +'</span><span id="static"> unconfirmed</span></div></li>');

        $('#selectopt').append('<option value="'+data[key].name+'">'+data[key].name+'</option>')
      }
    });
  }

  function updateUsers(){

    $.getJSON( "/beers/", function(data) {
      for(key in data){
       //Refresh list
       $('#'+key).data("id", data[key]._id);
       $('#'+key).data("name", data[key].cookie);
       $('#'+key).data("qty", data[key].unconfirmed);
       $('#'+key+ " .todo-count").text(data[key].beers);
       $('#'+key+ " .todo-name").text(data[key].name);
       $('#'+key+ " .unconfirmed").text(data[key].unconfirmed);
        }
      });
    }

    $('.todo').on('click', 'li', function() {
      var id = $(this).data('id');
      var antal = $(this).data('qty');
      var user = $(this).data('name');
      
      if(antal > 0 && cookie != user){
        $(this).toggleClass('todo-done').delay(500).queue(function() {
          $(this).toggleClass("todo-done");
          $(this).dequeue();
          $.post("/update", { id: id, qty: antal}, function(data){
            updateUsers()
          });
        });
      }
    });

    $('#post').click(function(){
      var optn = $('#selectopt').find(":selected").val()
      if(optn.length > 0){
        if(cookie == undefined || cookie == ""){
          Cookies.set('user', optn);
          cookie = optn;
        }

        $.post("/addround", { cookie: cookie, user:optn}, function(data){
          updateUsers();
        });

        $('#selectopt').select2('val', '');
      }
    });

    getUsers()

    if ($('[data-toggle="select"]').length) {
      $('[data-toggle="select"]').select2({minimumResultsForSearch: -1});
    }

});
