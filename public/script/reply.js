window.addEventListener('load', function() {
    const textareaOpener1 = document.querySelectorAll('.textareaOpener-1');
    const textareaOpener2 = document.querySelectorAll('.textareaOpener-2');
    
    const replyContainer = document.querySelectorAll('.reply-container');
    const secondLevel = document.querySelectorAll('.second-level-form');

    const commentBtn = document.getElementById("comment-btn");
    const commentContainer = document.querySelector('.comment-container');

    commentBtn.addEventListener("click", function() {
        if (commentContainer.style.display === 'block') {
            commentContainer.style.display = 'none';
        } else {
            commentContainer.style.display = 'block';
        }
    })


    textareaOpener1.forEach((e,index)=>{
        e.addEventListener('click', function(e) {

            if (replyContainer[index].style.display === 'block') {
                replyContainer[index].style.display = 'none';
            } else {
                replyContainer[index].style.display = 'block';
            }
        })
    })

    textareaOpener2.forEach((e,index)=>{
        e.addEventListener('click', function(e) {
            if (secondLevel[index].style.display === 'block') {
                secondLevel[index].style.display = 'none';
            } else {
                secondLevel[index].style.display = 'block';
            }
        })
    })




})

    


