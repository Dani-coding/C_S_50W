
document.addEventListener('DOMContentLoaded', function() {
    const name = document.querySelector("#profile_name").innerHTML
    show_all(name);
    show_follow(name);
});

function show_follow(name){
    const username = document.querySelector("#username").innerHTML;
    const b_follow = document.querySelector("#follow");
    b_follow.className="border border-dark";
    
    let box = document.createElement("div");
    box.id="followers";
    b_follow.appendChild(box);
    n_followers();

    box = document.createElement("div");
    box.id="follows";
    b_follow.appendChild(box);
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
        .catch(error => console.log("error in 'show_follow()'\n" + error.message));
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
    .catch(error => console.log("error in 'n_followers()'\n" + error.message)); 
}

function n_follows(){

    const name = document.querySelector("#profile_name").innerHTML;
    const box2 = document.querySelector("#follows");
    
    fetch("/n_follows/"+ name)
    .then(response => response.json())
    .then(data => {
        box2.innerHTML = `${name} follows ${data} users`;
    })
    .catch(error => console.log("error in 'n_follows()'\n" + error.message));
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
    .catch(error => console.log("error in 'change()'\n" + error.message));
}

function show_all(name){

    fetch("/posts_of/" + name)
    .then(response => response.json())
    .then(posts => {
        put_all(posts);
    })
    .then(()=>{
        const username = document.querySelector("#username").innerHTML;
        if (username != "_/log-out/_")
            put_likes();
    })
    .catch(error =>  console.log("error in 'show_all()'\n" + error.message));
}
