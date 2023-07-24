
document.addEventListener('DOMContentLoaded', function() {
    const username = document.querySelector("#username").innerHTML
    show_following(username);
});

function show_following(username){
    if (username != "_/log-out/_"){
        fetch("following_posts/" + username)
        .then(response => response.json())
        .then(posts => {put_all(posts);})
        .then(()=>{put_likes();})    
        //.catch(error => console.log("error in 'show_following()'\n" + error.message));
    }
}
