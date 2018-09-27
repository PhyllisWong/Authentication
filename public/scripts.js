$(document).ready(function() {
  // add all code here
  console.log(Cookies.get())

  // This means they are not authenticated
  // show signup or login
  if(Cookies.get('nToken')){
    $('.unauthenticated').css('color', 'red');
  }
  // They are authenticated
  // hide login or signup
  else{
    console.log("BEER")
    $('.authenticated').css('display', 'none');
  }
});