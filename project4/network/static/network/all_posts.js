
document.addEventListener('DOMContentLoaded', function() {
    show_all();
    try{
        document.querySelector("#submit_new").addEventListener('click', () => new_post());
    }catch{}
});

async function new_post(){

    data = JSON.stringify({
        content: document.querySelector("#content").value
    });

    await fetch("/new_post",{
        method: "POST",
        body: data,
    })
    .then(()=>{
        document.querySelector("#content").value = "";
        window.location.reload();    
    })
    .catch(error => console.log("error in 'new_post()'\n" + error))  
}

function show_all(){

    fetch("/all_posts")
    .then(response => response.json())
    .then(posts => {
            put_all(posts);
    })
    .then(()=>{
        const username = document.querySelector("#username").innerHTML;
        if (username != "_/log-out/_")
            put_likes();
    })
    .catch(error => console.log("error in 'show_all()'\n" + error.message));
}
