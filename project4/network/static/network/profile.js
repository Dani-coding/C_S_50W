
document.addEventListener('DOMContentLoaded', function() {
    const name = document.querySelector("#profile_name").innerHTML
    show_all(name);
    show_follow(name);
    /*
    try{
        document.querySelector("#submit_new").addEventListener('click', () => new_post());
    }catch{}
    */
});

function show_follow(name){
    const username = document.querySelector("#username").innerHTML;
    const b_follow = document.querySelector("#follow");
    b_follow.className="border border-dark";
    const box1 = document.createElement("div");
    const box2 = document.createElement("div");
    b_follow.appendChild(box1);
    b_follow.appendChild(box2);
    box1.id="followers";
    box2.id="follows";
    n_followers();
    n_follows();

    if ((username!="_/log-out/_") && (username!=name)){
        const names = `${username} :: ${name}`;

        fetch("/is_following/"+ names)
        .then(response => response.json())
        .then(data => {
            const b = document.querySelector("#follow_button");
            b.style.display = "block";
            b.addEventListener("click", () => change(names));
            if (data==1){
                b.innerHTML="Unfollow";
            }
            else{
                b.innerHTML="Follow";
            }
        })
        .catch(error => alert("El error está en el fetch is_following\n" + error.message));
    }
}

function n_followers(){
    const name = document.querySelector("#profile_name").innerHTML;
    const box1 = document.querySelector("#followers");
    
    fetch("/n_followers/"+ name)
    .then(response => response.json())
    .then(data => {
        box1.innerHTML = `${name} has ${data} followers`;        
    })
    .catch(error => alert("El error está en el fetch followers del change\n" + error.message)); 
}

function n_follows(){
    const name = document.querySelector("#profile_name").innerHTML;
    const box2 = document.querySelector("#follows");
    
    fetch("/n_follows/"+ name)
    .then(response => response.json())
    .then(data => {
        box2.innerHTML = `${name} follows ${data} users`;
    })
    .catch(error => alert("El error está en el fetch follows\n" + error.message));
}


function change(names){
    const username = document.querySelector("#username").innerHTML;
    const name = document.querySelector("#profile_name").innerHTML;

    fetch("/f_change/" + names)
    .then(response => response.text())
    .then(data => {
        document.querySelector("#follow_button").innerHTML=data;
    })
    .then(n_followers)
    .catch(error => alert("El error está en el fetch f_change\n" + error.message));
}

function show_all(name){
    fetch("/posts_of/" + name)
    .then(response => response.json())
    .then(posts => {
        const username = document.querySelector("#username").innerHTML;
        if (username != "_/log-out/_")
            put_all_likes(posts);
        else 
            put_all(posts);
    })
    .catch(error => alert("El error está en el fetch de show_all\n" + error.message));
}

function put_all_likes(posts){
    fetch("/all_likes",{method:"POST"})
    .then(response => response.json())
    .then(jsonlikes => {
        let likes=[];
        jsonlikes.forEach(like => {
            likes.push(like.post);
        });
        if (posts != null){
            const username = document.querySelector("#username").innerHTML;
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
                if (username == post.name){
                    const b = document.createElement("button");
                    b.innerHTML="Edit"
                    b.addEventListener("click", () => edit_begin(box));
                    box.appendChild(b);
                }
                like_button(box, post.pk, likes);
                b_all.appendChild(box);
            });
        }
    })
    .then(paginate)
    .catch(error => alert("El error está en el fetch de get_all_likes\n" + error.message));
}

function put_all(posts){
    if (posts != null){
        const b_all = document.querySelector("#all_posts"); 
        posts.forEach(post => {
            const box = document.createElement("div");
            box.className="border border-dark";
            box.innerHTML=`
                <h4>${post.name}</h4>
                <p>${post.content}</p>
                <p>${post.time}</p>
                <p>Likes: ${post.likes}</p>
                <p hidden>${post.pk}</p>  
            `;
            b_all.appendChild(box);
        });
    }
    paginate();
}
