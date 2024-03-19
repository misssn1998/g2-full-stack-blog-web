window.addEventListener(`load`, async function(){

    const deleteButton = document.querySelectorAll(".delete-button")
    const articleCount = document.querySelector("#article-count-header")
    const dropDownDiv = document.querySelectorAll(".each-posts-links")
    const dropDownArrow = document.querySelectorAll(".drop-down-arrow")

    let articleCounter = deleteButton.length

    dropDownDiv.forEach((e,i)=>{
        dropDownArrow[i].addEventListener(`click`, (e)=>{
            if (dropDownDiv[i].style.display === "block") {
                dropDownDiv[i].style.display = "none";
              } else {
                dropDownDiv[i].style.display = "block";
              }
        })
    })

    deleteButton.forEach((e,i)=>{
        deleteButton[i].addEventListener(`click`, async(e)=>{
            let articleId = e.target.getAttribute("article-id")
            if(confirm("Are you sure you want to delete this article?")){
                await deleteArticle(articleId)
                const elementToRemove =document.querySelector(`#article${articleId}`)
                articleCounter--
                elementToRemove.innerHTML = "<h2>Article has been deleted</h2>"
                elementToRemove.remove();
                articleCount.innerHTML = `Your stories(${articleCounter})`
            }else{
                txt = "Cancelled"
            }
        })
    })
    
    async function deleteArticle(id){
        await fetch(`/api/delete-article?articleId=${id}`)
        alert("Article deleted")
    }
})