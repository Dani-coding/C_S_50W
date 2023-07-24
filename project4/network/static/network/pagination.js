
const next_button = document.getElementById("next-button");
const prev_button = document.getElementById("prev-button");

const pag_limit = 10;

let currentPage;

function to_top(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function needed(){

    const listItems = document.getElementById("all_posts").childNodes;

    if (listItems.length>10)
        return true;
    else
        return false;

}

function paginate(){
    
    document.getElementById("pagination-numbers").innerHTML="";

    if (needed()){
        document.getElementById("pagination-nav").classList.remove("hidden");
        getPaginationNumbers();
        setCurrentPage(1);

        prev_button.addEventListener("click", () => {
            setCurrentPage(currentPage - 1);
            to_top();
        });
        
        next_button.addEventListener("click", () => {
            setCurrentPage(currentPage + 1);
            to_top();
        });
        
        document.querySelectorAll(".my-pagination-number").forEach((button) => {
            const pageIndex = Number(button.getAttribute("page-index"));
            if (pageIndex) {
                button.addEventListener("click", () => {
                    setCurrentPage(pageIndex);
                    to_top();
                });
            }
        });
    }
}

const appendPageNumber = (index) => {
    const paginationNumbers = document.getElementById("pagination-numbers");
    const pageNumber = document.createElement("button");  
    pageNumber.className = "my-pagination-number";  
    pageNumber.innerHTML = index;  
    pageNumber.setAttribute("page-index", index);  
    pageNumber.setAttribute("aria-label", "Page " + index);  
    paginationNumbers.appendChild(pageNumber);  
};
  
const getPaginationNumbers = () => {  

    const listItems = document.getElementById("all_posts").childNodes;
    const pageCount = Math.ceil(listItems.length / pag_limit);

    for (let i = 1; i <= pageCount; i++) {  
        appendPageNumber(i);  
    }

};

const setCurrentPage = (pageNum) => {
    
    currentPage = pageNum;  
    handleActivePageNumber();
    handlePageButtonsStatus();

    const listItems = document.getElementById("all_posts").childNodes;
    const prevRange = (pageNum - 1) * pag_limit;  
    const currRange = pageNum * pag_limit;  

    listItems.forEach((item, index) => {  
        item.classList.add("hidden");  
        if (index >= prevRange && index < currRange) {  
            item.classList.remove("hidden");  
        }  
    });  
};
  
const handleActivePageNumber = () => {

    document.querySelectorAll(".my-pagination-number").forEach((button) => {
        button.classList.remove("my-active");
        const pageIndex = Number(button.getAttribute("page-index"));
        if (pageIndex == currentPage) {
            button.classList.add("my-active");
        }
    });
};

const disableButton = (button) => {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
};
  
const enableButton = (button) => {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
};
  
const handlePageButtonsStatus = () => {

    const listItems = document.getElementById("all_posts").childNodes;
    const pageCount = Math.ceil(listItems.length / pag_limit);

    if (currentPage === 1) {
        disableButton(prev_button);
    } else {
        enableButton(prev_button);
    }
    if (pageCount === currentPage) {
        disableButton(next_button);
    } else {
        enableButton(next_button);
    }   
};



// *************  Pagination with Bootstrap *************  // 

/*
const pag_limit = 10;
let currentPage;

function to_top(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
    //document.getElementById("all_posts").focus();
}

function needed(){
    const paginatedList = document.getElementById("all_posts");
    const listItems = paginatedList.children;
    if (listItems.length>10)
        return true;
    else
        return false;
}

function paginate(){
    document.getElementById("buttons-list").innerHTML="";

    if (needed()){
        document.getElementById("pagination-nav").classList.remove("d-none");
        setButtons();
        setCurrentPage(1);
    }
}

const setButtons = () => {
    const buttonsUl = document.getElementById("buttons-list");
    const li1 = document.createElement("li");
    const prev_button = document.createElement("button");  
    li1.className = "page-item";
    prev_button.className = "page-link";  
    prev_button.innerHTML = "&lt";
    prev_button.style.boxShadow = "none";
    prev_button.id = "prev_button";
    prev_button.title = "Previous page";
    prev_button.ariaLabel = "previous page";
    prev_button.addEventListener("click", () => setCurrentPage(currentPage - 1));
    li1.appendChild(prev_button);
    buttonsUl.appendChild(li1);

    getPaginationNumbers();

    const li2 = document.createElement("li");
    const next_button = document.createElement("button");  
    li2.className = "page-item";
    next_button.className = "page-link";  
    next_button.innerHTML = "&gt";
    next_button.style.boxShadow = "none";
    next_button.id = "next_button";
    next_button.title = "Next page";
    next_button.ariaLabel = "next page";
    next_button.addEventListener("click", () => setCurrentPage(currentPage + 1));
    li2.appendChild(next_button);
    buttonsUl.appendChild(li2);

}
 
const getPaginationNumbers = () => {  
    const paginatedList = document.getElementById("all_posts");
    const listItems = paginatedList.children;
    const pageCount = Math.ceil(listItems.length / pag_limit);
    for (let i = 1; i <= pageCount; i++) {  
        appendPageNumber(i);  
    }
};

const appendPageNumber = (index) => {
    const buttonsUl = document.getElementById("buttons-list");
    const pageNumber = document.createElement("button");  
    const li = document.createElement("li");
    li.className = "page-item";
    pageNumber.className = "pagination-number page-link";  
    pageNumber.innerHTML = index;  
    pageNumber.style.boxShadow = "none";
    pageNumber.title = `Page ${index}`;
    pageNumber.ariaLabel = `page ${index}`;
    pageNumber.addEventListener("click", () => setCurrentPage(index));
    pageNumber.setAttribute("page-index", index);  
    li.appendChild(pageNumber)
    buttonsUl.appendChild(li);  
};

const setCurrentPage = (pageNum) => {
    currentPage = pageNum;  
    handleActivePageNumber();
    handlePageButtonsStatus();
    to_top();

    const paginatedList = document.getElementById("all_posts");
    const listItems = paginatedList.children;
    const prevRange = (pageNum - 1) * pag_limit;  
    const currRange = pageNum * pag_limit;  

    for (let i = 0; i < listItems.length; i++){
        const item = listItems[i];
        item.classList.add("d-none");  
        if (i >= prevRange && i < currRange) {  
            item.classList.remove("d-none");  
        }  
    }
};
  
const handleActivePageNumber = () => {
    document.querySelectorAll(".pagination-number").forEach((button) => {
        button.classList.remove("active");
        const pageIndex = Number(button.getAttribute("page-index"));
        if (pageIndex == currentPage) {
            button.classList.add("active");
        }
    });
};

const handlePageButtonsStatus = () => {
    const paginatedList = document.getElementById("all_posts");
    const listItems = paginatedList.children;
    const pageCount = Math.ceil(listItems.length / pag_limit);

    const prev_button = document.getElementById("prev_button");
    const next_button = document.getElementById("next_button");

    if (currentPage === 1) {
        //prev_button.disabled = "true";
        prev_button.classList.add("disabled");
    } else {
       // prev_button.disabled = "false";
        prev_button.classList.remove("disabled");
    }
    if (pageCount === currentPage) {
        //next_button.disabled = "true";
        next_button.classList.add("disabled");
    } else {
        //next_button.disabled = "false";
        next_button.classList.remove("disabled");
    }   
};

*/