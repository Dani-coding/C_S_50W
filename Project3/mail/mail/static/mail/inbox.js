
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
  document.querySelector('#mail-view').style.display = 'none';
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
  document.querySelector('#mail-view').style.display = 'none';


  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch("/emails/" + mailbox)
  .then(response => response.json())
  .then(emails => {
    show_mails(emails, mailbox);
  })
  .catch(error => alert(error.message)); // ------------------- No funciona, no pilla el error
}

function show_mails(emails, type){
  const view = document.querySelector("#emails-view");
  emails.forEach(mail => {
    const entry = document.createElement("div");
    entry.className="container";
    const box1 = document.createElement("div");
    box1.className="row";
    const box2 = document.createElement("div");
    box2.className="border border-dark col-11";
    box2.style.cursor="pointer";
    const box3 = document.createElement("div");
    box3.className="row";
    let box = document.createElement("div");
    box.className="col-3 align-middle";
    box.innerHTML = `<b>From: </b>${mail.sender}`;
    box3.appendChild(box);
    box = document.createElement("div");
    box.className="col-5 align-middle";
    box.innerHTML =  "<b>Subject: </b>" + mail.subject;
    box3.appendChild(box);
    box = document.createElement("div");
    box.className="col-3 align-middle";
    box.innerHTML =  "<b>On: </b>" + mail.timestamp;
    box3.appendChild(box);
    box2.appendChild(box3);
    box1.appendChild(box2);
    if (type != "sent"){
      box = document.createElement("div");
      box.className="col-1";
      const button = document.createElement("button");
      button.className="btn btn-secondary btn-sm mb-1 mt-1";
      if (type == "inbox"){
        button.innerHTML="Archive";
        button.addEventListener('click', function() {
          fetch("/emails/" + mail.id, {
            method: 'PUT',
            body: JSON.stringify({
              archived: true
            })
          })
          .then(()=>load_mailbox('inbox'))  
        });
      }
      else{
        button.innerHTML="Unarchive";
        button.addEventListener('click', function() {
          fetch("/emails/" + mail.id, {
            method: 'PUT',
            body: JSON.stringify({
              archived: false
            })
          })
          .then(()=>load_mailbox('inbox'))  
        });
      }

      box.appendChild(button);
      box1.appendChild(box);
      if ( !mail.read )
        box2.style.backgroundColor = "gray";
      else
        box2.style.backgroundColor = "white";  
    }
   
    box2.addEventListener('click', function() {
      fetch("/emails/" + mail.id, {
        method: 'PUT',
        body: JSON.stringify({
          read: true
        })
      })
      open_mail(mail.id);
    });
    entry.appendChild(box1);
    view.appendChild(entry);
  });

}

function open_mail(id){
  fetch("/emails/" + id)
  .then(response => response.json())
  .then(mail => {
      show_mail(mail);
  });
}


function show_mail(mail){

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'block';

  const box = document.querySelector('#mail-view');
  box.innerHTML = "";
  let aux = document.createElement("p");
  aux.innerHTML= "<b>From: </b>" + mail.sender;
  box.appendChild(aux);
  const recipients = mail.recipients;
  let to = "<b>To: </b>";
  recipients.forEach(element => {
    to = to + element + ", ";
  });
  to = to.slice(0, -2);
  aux = document.createElement("p");
  aux.innerHTML= to;
  box.appendChild(aux);
  aux = document.createElement("p");
  aux.innerHTML= "<b>Subject: </b>" + mail.subject;
  box.appendChild(aux);
  aux = document.createElement("p");
  aux.innerHTML= "<b>Timestamp: </b>" + mail.timestamp;
  box.appendChild(aux);
  aux = document.createElement("button");
  aux.className = "btn btn-sm btn-outline-primary";
  aux.innerHTML="Reply";
  aux.addEventListener('click', () => reply_email(mail));
  box.appendChild(aux);
  aux = document.createElement("hr");
  box.appendChild(aux);
  aux = document.createElement("textarea");
  aux.innerHTML= mail.body;
  aux.className = "form-control";
  box.appendChild(aux);

}

function reply_email(mail) {

  // Show compose view and hide other views
  document.querySelector("#to_error").style.display = "none";
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  
  // Clear out composition fields
  let subject = mail.subject;
  if (subject.slice(0,4) != "RE: ")
    subject = "RE: " + subject;
  const body = "\n - - - - - - \nOn " + mail.timestamp + " " + mail.sender + " wrote:\n" + mail.body + "\n";

  document.querySelector('#compose-recipients').value = mail.sender;
  document.querySelector('#compose-subject').value = subject;
  document.querySelector('#compose-body').value = body;
  document.querySelector("#compose-body").focus();
  document.querySelector("#compose-body").setSelectionRange(0,0);

  document.querySelector("#compose-submit").addEventListener("click", () => send_data());
}