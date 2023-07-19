
document.addEventListener('DOMContentLoaded', function() {
    const username = document.querySelector("#username").innerHTML
    show_following(username);
});

function show_following(username){
    if (username != "_/log-out/_"){
        fetch("following_posts/" + username)
        .then(response => response.json())
        .then(posts => {put_all(posts);})
        .catch(error => alert("El error está en el fetch de show_following\n" + error.message));
    }
}

function put_all(posts){
    if (posts.length==0)
        b_all.innerHTML="<h5> There are no posts by the people you are following <h5>";
    else{
        fetch("/all_likes",{method:"POST"})
        .then(response => response.json())
        .then(jsonlikes => {
            let likes=[];
            jsonlikes.forEach(like => {
                likes.push(like.post);
            });
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
                        `;
                    like_button(box, post.pk, likes);
                    b_all.appendChild(box);
                 });
            }
        })
        .then(paginate)
        .catch(error => alert("El error está en el fetch de get_all_likes\n" + error.message));
    }
}
