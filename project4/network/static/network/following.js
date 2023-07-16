
document.addEventListener('DOMContentLoaded', function() {
    const username = document.querySelector("#username").innerHTML
    show_following(username);
});

function show_following(username){
    if (username != "_/log-out/_"){
        fetch("following_posts/" + username)
        .then(response => response.json())
        .then(posts => {put_all(posts);})
        .then(paginate)
        .catch(error => alert("El error está en el fetch de show_following\n" + error.message));
    }
}

function put_all(posts){
    console.log(posts);
    const b_all = document.querySelector("#all_posts");

    if (posts != null){
    posts.forEach(post => {
        const box = document.createElement("div");
        box.className="border border-dark";

        box.innerHTML=`
            <a href="user/${post.name}"><h4>${post.name}</h4></a>
            <p>${post.content}</p>
            <p>${post.time}</p>
            <p>Likes: ${post.likes}</p>
            `;
        const username = document.querySelector("#username").innerHTML;
        if ((username != "_/log-out/_") && (username == post.name)){
            box.innerHTML+=`<button>Edit</button>`;
        }
       
        b_all.appendChild(box);
    });
    }
    if (posts.length==0)
        b_all.innerHTML="<h5> There are no posts by the people you are following <h5>";
}
