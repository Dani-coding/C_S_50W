
document.addEventListener('DOMContentLoaded', function() {
    const name = document.querySelector("#profile_name").innerHTML
    show_all(name);
    show_follow(name);
});

function show_follow(name){
    const username = document.querySelector("#username").innerHTML;
    const info = document.querySelector("#profile_data");
    info.classList.remove("hidden");
    
    if ((username!="_/log-out/_") && (username!=name)){
        const names = `${username} :: ${name}`;

        fetch("/is_following/"+ names)
        .then(response => response.json())
        .then(data => {

           // const info = document.querySelector("#profile_data");
            info.appendChild(create_info(name, names, true));

            n_followers();
            n_follows();
            set_following(data);
        })
        .catch(error => console.log("error in 'show_follow()'\n" + error.message));
    }
    else{
        //info.classList.remove("hidden");
        info.appendChild(create_info(name, "", false));
        n_followers();
        n_follows();
    }
}

function set_following(data){

    const link = document.querySelector("#follow_button");        
    const icon = document.querySelector("#follow_icon");

    if (data==1){
        link.innerHTML="Unfollow";
        link.title="Stop following";
        icon.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" > <path class="my_green" <path d="M14 19.2857L15.8 21L20 17M4 21C4 17.134 7.13401 14 11 14C12.4872 14 13.8662 14.4638 15 15.2547M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </svg>`;        
    }
    else{
        link.innerHTML="Follow";
        link.title="Start following";
        icon.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" > <path class="my_red" <path d="M15 16L20 21M20 16L15 21M11 14C7.13401 14 4 17.134 4 21H11M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </svg>`;        
    }
}

function n_followers(){
    const name = document.querySelector("#profile_name").innerHTML;
    const box1 = document.querySelector("#num_followers");
    
    fetch("/n_followers/"+ name)
    .then(response => response.json())
    .then(data => {
        box1.innerHTML = `Is followed by <b>${data}</b> users`;        
    })
    .catch(error => console.log("error in 'n_followers()'\n" + error.message)); 
}

function n_follows(){

    const name = document.querySelector("#profile_name").innerHTML;
    const box2 = document.querySelector("#num_follows");
    
    fetch("/n_follows/"+ name)
    .then(response => response.json())
    .then(data => {
        box2.innerHTML = `Is following <b>${data}</b> users`;
    })
    .catch(error => console.log("error in 'n_follows()'\n" + error.message));
}

function change(names){

    fetch("/f_change/" + names)
    .then(response => response.text())
    .then(data => {
        set_following(data);
        n_followers();
    })
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

function create_info(name, names, follow){
    const main = document.createElement("div");
    main.className="post-main"
    main.style.margin="0";

    const header = document.createElement("div");
    header.className = "post-header";
    const text = document.createElement("span");
    text.className="profile-text";
    text.innerHTML=`User `;
    header.appendChild(text);
    const user= document.createElement("span");
    user.className="profile-name";
    user.innerHTML=`${name}`;
    header.appendChild(user);
    if (follow){
        const icon = document.createElement("span");
        icon.id="follow_icon";
        header.appendChild(icon);
        const link = document.createElement("span");
        link.id="follow_button";
        link.className="follow_link";
        link.title="Stop following";
        link.addEventListener("click", () => change(names));
        header.appendChild(link);
    }
    main.appendChild(header);

    const body1 = document.createElement("div");
    body1.className = "post-body";
    let aux = document.createElement("span");
    aux.className ="profile-data";
    aux.id = "num_followers";
    body1.appendChild(aux);
    main.appendChild(body1);

    const footer = document.createElement("div");
    footer.className = "post-footer";
    aux = document.createElement("span");
    aux.className ="profile-data";
    aux.id = "num_follows";
    footer.appendChild(aux);
    main.appendChild(footer);
    
    return main;
    
}