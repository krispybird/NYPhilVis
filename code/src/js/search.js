output = "";

var availableEntities = []
function getAvailableEntries(d){
  $.each(data, function(key, val){
  
  output += "<div class='values'>";
    output += '<h5 class="value-id">' + val.id + '</h5>';
    output += '<p class="value-name">' + val.name + '</p>'
  output += "</div>";

});
}

//shows availableo 
//$('#content').html(output);

/* SEEKER FUNCTION */
 if (!RegExp.escape) {
   RegExp.escape = function (s) {
     return s.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
   };
 }
 
 jQuery(function(){
  var $rows = $('.values');
  $('#seeker').keyup(function () {
    var regex =  new RegExp(RegExp.escape($.trim(this.value).replace(/\s+/g, ' ')), 'i')
    $rows.hide().filter(function () {
      var text = $(this).children(".value-name").text().replace(/\s+/g, ' ');
      return regex.test(text)
    }).show();
  });


  $( function() {
  $( "#search-bar").click(function(){
      $("#search-bar").val("");
    }
  )}) ;