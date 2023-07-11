
document.addEventListener('DOMContentLoaded', function() {

  // By default, load the inbox
  load_mailbox('inbox');

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email());
});


function compose_email() {

  // Show compose view and hide other views
  document.querySelector("#to_error").style.display = "none";
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  document.querySelector("#compose-submit").addEventListener("click", () => send_data());
}


function send_data(){

    data = JSON.stringify({
      recipients: document.querySelector("#compose-recipients").value,
      subject: document.querySelector("#compose-subject").value,
      body: document.querySelector("#compose-body").value,
    });
    
    fetch("/emails",{
      method: "POST",
      body: data,
    })
    .then(response => {
      if (response.status == 201)
        load_mailbox("sent");
      else{
        document.querySelector("#compose-recipients").focus();
        document.querySelector("#to_error").style.display = "block";
      }
    })   
}


function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch("/emails/" + mailbox)
  .then(response => response.json())
  .then(emails => {
    show_mails(emails);
  })
  .catch(error => alert(error.message)); // ------------------- No funciona, no pilla el error
  

  //--------- reaccionar a eventos, por ejemplo, pinchar e ir a mail
}


function show_mails(emails){
  const view = document.querySelector("#emails-view");
  emails.forEach(mail => {
    const entry = document.createElement("div");
    entry.className="entry";
    entry.className="border border-dark";
    entry.innerHTML="From:" + mail.sender + " ; Subject: " + mail.subject + " ; In:" + mail.timestamp;
    if ( !mail.read ){
      entry.style.backgroundColor = "red";
    }
    else{
      entry.style.backgroundColor = "white";

    }
    view.appendChild(entry);
  });
}