//const paginationNumbers = document.getElementById("pagination-numbers");
//const paginatedList = document.getElementById("all_posts");
//const listItems = paginatedList.querySelectorAll("div");
//const nextButton = document.getElementById("next-button");
//const prevButton = document.getElementById("prev-button");

const paginationLimit = 10;
//const pageCount = Math.ceil(listItems.length / paginationLimit);
let currentPage;

function paginate(){
    console.log("entra en paginate");
    getPaginationNumbers();
    setCurrentPage(1);

    document.querySelectorAll(".pagination-number").forEach((button) => {
        const pageIndex = Number(button.getAttribute("page-index"));
        if (pageIndex) {
          button.addEventListener("click", () => {
            setCurrentPage(pageIndex);
          });
        }
      });

}
/*
window.addEventListener("load", () => {

    getPaginationNumbers();
    setCurrentPage(1);

    document.querySelectorAll(".pagination-number").forEach((button) => {
        const pageIndex = Number(button.getAttribute("page-index"));
        if (pageIndex) {
          button.addEventListener("click", () => {
            setCurrentPage(pageIndex);
          });
        }
      });

});
*/  

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
    const pageCount = Math.ceil(listItems.length / paginationLimit);
    console.log(`hay ${listItems.length} items, y por tanto, se usarán ${pageCount} páginas`);
    for (let i = 1; i <= pageCount; i++) {  
        appendPageNumber(i);  
    }

};

const setCurrentPage = (pageNum) => {
    currentPage = pageNum;  
    handleActivePageNumber();

    const paginatedList = document.getElementById("all_posts");
    const listItems = paginatedList.querySelectorAll("div");


    const prevRange = (pageNum - 1) * paginationLimit;  
    const currRange = pageNum * paginationLimit;  
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


  
  
