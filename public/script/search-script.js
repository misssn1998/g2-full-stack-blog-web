window.addEventListener(`load`, function () {

    const searchBarForm = document.querySelector("#searchInput")
    const searchByTitleContainer = document.querySelector("#searchByTitle")
    const searchByAuthorContainer = document.querySelector("#searchByAuthor")
    const searchNavBar = document.querySelector(".search_bar")
    const searchAllButton = document.createElement("a")
    searchAllButton.id = "viewAllSearchResults"
    searchAllButton.innerText = "View all search results"
    const searchResultContainer = document.querySelector("#searchResultContainer")
    


    window.addEventListener(`click`, (e)=>{
        if(e.target.className != "search"){
            searchResultContainer.style.display = "none"
            // searchNavBar.style.border="1px solid black"
        }
     
    })

    searchNavBar.addEventListener(`click`,()=>{
        // searchResultContainer.style.display = "flex"
        // searchNavBar.style.border = "7px solid purple"
        searchBarForm.style.border = "transparent"

    })

    searchBarForm.addEventListener(`keyup`, (e)=>{
        if(e.key ==="Enter"){
            window.location.href = `/searched-Article?search=${searchBarForm.value}`
        }
    })

    searchBarForm.addEventListener(`input`, async (e) => {
        if(searchBarForm.value){
            searchResultContainer.style.display = "flex"
        } else{
            searchResultContainer.style.display = "none"
        }
        searchNavBar.style.overflow = "visible"
        searchByTitleContainer.innerHTML = ""
        searchByAuthorContainer.innerHTML = ""
        searchAllButton.setAttribute("href", `/searched-Article?search=${searchBarForm.value}`)
        const results = await getSearchResults(searchBarForm.value)

        const resultByTitle = results["articlesByTitle"]
        const resultsByUser = results["articlesByUser"]
        

        if (resultByTitle != undefined) {
            const byTitleHeader = document.createElement("div")
            byTitleHeader.innerHTML = "<h2>Matching Title</h2>"
            byTitleHeader.classList.add("individualResult")
            searchByTitleContainer.append(byTitleHeader)
            const titleSearchResultContainer = document.createElement("div")
            titleSearchResultContainer.id = "titleSearchResultContainer"
            searchByTitleContainer.appendChild(titleSearchResultContainer)
            for (let i = 0; i < resultByTitle.length; i++) {
                const searchResultDiv = document.createElement("div")
                searchResultDiv.setAttribute("id", `${resultByTitle[i]["article_id"]}`)
                const searchResult = document.createElement("p")
                searchResult.setAttribute("id", `${resultByTitle[i]["article_id"]}`)
                searchResult.innerText = `${resultByTitle[i]["title"]}`
                searchResultDiv.append(searchResult)
                searchResultDiv.addEventListener(`click`, (e)=>{
                    window.location.href = `/article/${e.target.id}`
                })
                titleSearchResultContainer.append(searchResultDiv)
            }
        }

        if (resultsByUser != undefined) {
            const byUserHeader = document.createElement("div")
            byUserHeader.innerHTML = "<h2>Matching user</h2>"
            searchByTitleContainer.append(byUserHeader)
            for (let i = 0; i < resultsByUser.length; i++) {
                const searchResultDiv = document.createElement("div")
                searchResultDiv.setAttribute("id", `${resultsByUser[i]["id"]}`)
                const searchResult = document.createElement("p")
                searchResult.setAttribute("id", `${resultsByUser[i]["id"]}`)
                searchResult.innerText = `${resultsByUser[i]["fname"]} ${resultsByUser[i]["lname"]}`
                searchResultDiv.addEventListener(`click`, (e)=>{
                    window.location.href = `/profile?id=${e.target.id}`
                })
                searchResultDiv.append(searchResult)
                searchByAuthorContainer.append(searchResultDiv)
            }
        }

        if(resultByTitle.length > 0 || resultsByUser.length > 0){
            searchResultContainer.appendChild(searchAllButton);
        } else {
            searchResultContainer.removeChild(searchAllButton)
        }
    })

    async function getSearchResults(search) {
        const response = await fetch(`/api/get-search?searchTerm=${search}`)
        const list = await response.json()

        return list
    }
})