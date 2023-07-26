
document.addEventListener('DOMContentLoaded', function() {
    show_all();
    new_box();
});

async function new_post(){

    data = JSON.stringify({
        content: document.querySelector("#new_textarea").value
    });

    await fetch("/new_post",{
        method: "POST",
        body: data,
    })
    .then(()=>{
        document.querySelector("#new_textarea").value = "";
        window.location.reload();    
    })
    .catch(error => console.log("error in 'new_post()'\n" + error))  
}

function new_box(){
    //try {
    const new_box = document.getElementById("new_box_data");
    if (new_box!=null){
    let aux = document.createElement("div");
    aux.id = "new_post_header";
    aux.className="new-post-header"; 
    let b1 = document.createElement("div");
    b1.className="post-name nohover edit_headers";
    b1.id ="new_post_text";
    b1.innerHTML="New post . . .";    
    aux.appendChild(b1);
    b1 = document.createElement("div");
    b1.innerHTML = `<svg class="new-post-icon" viewBox="0 0 30 30"><g stroke-width="0"></g><g  stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path id="new_post_icon" d="M29.069,22.276c-0.791,0.932-1.917,1.409-3.052,1.409c-0.913,0-1.834-0.312-2.587-0.949l-8.42-7.152l-8.42,7.151 c-1.683,1.43-4.208,1.225-5.639-0.459c-1.43-1.686-1.224-4.208,0.46-5.64l11.01-9.351c1.493-1.269,3.686-1.269,5.178,0 l11.011,9.351C30.294,18.068,30.499,20.591,29.069,22.276z"></path> </g> </g></svg>`;
    b1.addEventListener("click", () => change_new_post()); 
    aux.appendChild(b1);
    new_box.appendChild(aux);

    aux= document.createElement("textarea");
    aux.className=("edit_area");
    aux.id="new_textarea";
    aux.rows="3";
    new_box.appendChild(aux);
    
    aux = document.createElement("div");
    aux.id = "new_post_footer";
    aux.className="post-footer post-name edit_headers";
    aux.innerHTML="Post";
    aux.addEventListener('click', () => new_post());
    new_box.appendChild(aux);
    change_new_post();
    }
    else{
        const box = document.getElementById("contenido");
        box.classList.add("top-space")

    }
    //} catch {}
}

function change_new_post(){
    const a = document.getElementById("new_post_icon");
    if (a.className.baseVal == "")
    {
        a.className.baseVal = "new-down";
        let aux = document.getElementById("new_textarea");
        aux.classList.add("hidden");
        aux = document.getElementById("new_post_footer");
        aux.classList.add("hidden");
        aux = document.getElementById("new_post_header");
        aux.classList.add("new-header-alone");
        aux = document.getElementById("new_post_text");
        aux.innerHTML="New post"; 
        aux = document.getElementById("new_box_data");
        aux.classList.add("new-box-close");


    }
    else{
        a.className.baseVal = "";
        let aux = document.getElementById("new_textarea");
        aux.classList.remove("hidden");
        aux.focus();
        aux = document.getElementById("new_post_footer");
        aux.classList.remove("hidden");
        aux = document.getElementById("new_post_header");
        aux.classList.remove("new-header-alone");
        aux = document.getElementById("new_post_text");
        aux.innerHTML="New post . . ."; 
        aux = document.getElementById("new_box_data");
        aux.classList.remove("new-box-close");

    }

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
