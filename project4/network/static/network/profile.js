
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
            const box = document.querySelector("#profile_data");
            box.classList.remove("hidden");
            const text = document.createElement("span");
            text.className="profile-text";
            text.innerHTML=`User `;
            box.appendChild(text);
            const user= document.createElement("span");
            user.className="profile-name";
            user.innerHTML=`${name}`;
            box.appendChild(user);
            const icon = document.createElement("span");
            icon.id="follow_icon";
            box.appendChild(icon);
            const link = document.createElement("span");
            link.id="follow_button";
            link.className="follow_link";
            link.title="Stop following";
            link.addEventListener("click", () => change(names));
            box.appendChild(link);
            if (data==1){
                link.innerHTML="Unfollow";
                icon.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" > <path class="my_green" <path d="M14 19.2857L15.8 21L20 17M4 21C4 17.134 7.13401 14 11 14C12.4872 14 13.8662 14.4638 15 15.2547M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </svg>`;        
            }
            else{
                link.innerHTML="Follow";
                icon.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" > <path class="my_red" <path d="M15 16L20 21M20 16L15 21M11 14C7.13401 14 4 17.134 4 21H11M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </svg>`;        

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
        //document.querySelector("#follow_button").innerHTML=data;
        const link = document.querySelector("#follow_button");        
        const icon = document.querySelector("#follow_icon");

        if (data=="Unfollow"){
            link.innerHTML="Unfollow";
            icon.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" > <path class="my_green" <path d="M14 19.2857L15.8 21L20 17M4 21C4 17.134 7.13401 14 11 14C12.4872 14 13.8662 14.4638 15 15.2547M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </svg>`;        
        }
        else{
            link.innerHTML="Follow";
            icon.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" > <path class="my_red" <path d="M15 16L20 21M20 16L15 21M11 14C7.13401 14 4 17.134 4 21H11M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </svg>`;        

        }
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
