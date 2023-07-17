
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
    .catch(error => console.log("error en new_post" + error))
    document.querySelector("#content").value = "";

    window.location.reload();
    
    //add_new();
}

function show_all(){
    fetch("/all_posts")
    .then(response => response.json())
    .then(posts => {put_all(posts);})
    .then(paginate)
    .catch(error => alert("El error está en el fetch de show_all\n" + error.message));
}
function put_all(posts){
    console.log(posts);
    if (posts != null){
    const b_all = document.querySelector("#all_posts");
    posts.forEach(post => {
        const box = document.createElement("div");
        box.className="border border-dark";

        box.innerHTML=`
            <a href="user/${post.name}"><h4>${post.name}</h4></a>
            <p>${post.content}</p>
            <p>${post.time}</p>
            <p>Likes: ${post.likes}</p>
            <p hidden>${post.pk}</p>  
            `;
        const username = document.querySelector("#username").innerHTML;
        if ((username != "_/log-out/_") && (username == post.name)){
            let b = document.createElement("button");
            b.innerHTML="Edit"
            b.addEventListener("click", () => edit_begin(box));
            box.appendChild(b);
        }
        b_all.appendChild(box);
    });
    }
}
/*
function add_new(){
    fetch("/all_posts")
    .then(response => response.json())
    .then(posts => {
        const b_all = document.querySelector("#all_posts");
        const post = posts[0];
        const box = document.createElement("div");
        box.className="border border-dark";
        box.innerHTML=`
            <a href="user/${post.name}"><h4>${post.name}</h4></a>
            <p>${post.content}</p>
            <p>${post.time}</p>
            <p>Likes: ${post.likes}</p>
            <p hidden>${post.id}</p>
        `;
        const username = document.querySelector("#username").innerHTML;
        if ((username != "_/log-out/_") && (username == post.name)){
            let b = document.createElement("button");
            b.innerHTML="Edit"
            b.addEventListener("click", () => edit_begin(box));
            box.appendChild(b);
        }
        b_all.appendChild(box);
    })
    .then(paginate(true))
    .catch(error => alert("error fetching last_post to add_new\n" + error));
}
*/