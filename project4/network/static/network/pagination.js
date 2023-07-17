const next_button = document.getElementById("next-button");
const prev_button = document.getElementById("prev-button");

const pag_limit = 10;
let currentPage;

function to_top(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function paginate(){
    console.log("entra en paginate");
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
    
    document.querySelectorAll(".pagination-number").forEach((button) => {
        const pageIndex = Number(button.getAttribute("page-index"));
        if (pageIndex) {
            button.addEventListener("click", () => {
                setCurrentPage(pageIndex);
                to_top();
            });
        }
      });
}

const appendPageNumber = (index) => {
    const paginationNumbers = document.getElementById("pagination-numbers");
    const pageNumber = document.createElement("button");  
    pageNumber.className = "pagination-number";  
    pageNumber.innerHTML = index;  
    pageNumber.setAttribute("page-index", index);  
    pageNumber.setAttribute("aria-label", "Page " + index);  
    paginationNumbers.appendChild(pageNumber);  
};
  
const getPaginationNumbers = () => {  
    const paginatedList = document.getElementById("all_posts");
    const listItems = paginatedList.querySelectorAll("div");
    const pageCount = Math.ceil(listItems.length / pag_limit);
    console.log(`hay ${listItems.length} items, y por tanto, se usarán ${pageCount} páginas`);
    for (let i = 1; i <= pageCount; i++) {  
        appendPageNumber(i);  
    }

};

const setCurrentPage = (pageNum) => {
    currentPage = pageNum;  
    handleActivePageNumber();
    handlePageButtonsStatus();

    const paginatedList = document.getElementById("all_posts");
    const listItems = paginatedList.querySelectorAll("div");


    const prevRange = (pageNum - 1) * pag_limit;  
    const currRange = pageNum * pag_limit;  
    console.log(`se deberían mostrar entradas desde ${prevRange} hasta ${currRange}`);

    listItems.forEach((item, index) => {  
        item.classList.add("hidden");  
        if (index >= prevRange && index < currRange) {  
            item.classList.remove("hidden");  
        }  
    });  
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

const disableButton = (button) => {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
};
  
const enableButton = (button) => {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
};
  
const handlePageButtonsStatus = () => {
    const paginatedList = document.getElementById("all_posts");
    const listItems = paginatedList.querySelectorAll("div");
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