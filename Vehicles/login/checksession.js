
  
  fetch(
    "../ctrl_session.php"
      )
      .then(onSessionResponse)
      .then(onText);
    
    
    function onSessionResponse(response) {
      return response.json();
    }
    
    function onText(text) {
      if (text.error == 0) 
        location.href = "../homepage/homepage.html";
        
    
  }

