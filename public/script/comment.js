window.addEventListener('load', async function () {
    displayDeleteButton();
    await commentsOnArticle();
    await commentOnComment();
    await deleteComment();

    const user_id = document.getElementById('user_id_temp_storage').value;

    if (!user_id) {
        const replyBtns = document.querySelectorAll('.reply-btn');

        replyBtns.forEach(btn => {
            btn.hidden = true;
        })
    }
});

function verifyLogInStatus() {
    const user_id = document.getElementById('user_id_temp_storage').value;

    if (!user_id) {
        const replyBtns = document.querySelectorAll('.reply-btn');

        replyBtns.forEach(btn => {
            btn.hidden = true;
        })

        window.location.assign('/login');
        return true;
    }
}

function displayDeleteButton() {
    const deleteCommentButtons = document.querySelectorAll(
        '.deleteCommentButton'
    );
    deleteCommentButtons.forEach((button) => {
        const commenter_id = button.nextElementSibling.value;
        const author_id = document.getElementById('author_id_temp_storage').value;
        const user_id = document.getElementById('user_id_temp_storage').value;
        if (commenter_id !== user_id && author_id !== user_id) {
            button.hidden = true;
        }
    });
}

async function deleteComment() {
    const deleteCommentButtons = document.querySelectorAll(
        '.deleteCommentButton'
    );
    deleteCommentButtons.forEach((button) => {
        button.addEventListener('click', async function (e) {
            e.preventDefault();
            const deleteButtonParentDiv = e.target.parentElement;
            const currentCommentDiv = deleteButtonParentDiv.parentElement;

            const comment_id = button.previousElementSibling.value;
            const article_id = document.getElementById(
                'article_id_temp_storage'
            ).value;

            const data = {
                comment_idKey: comment_id,
                article_idKey: article_id,
            };

            try {
                const response = await fetch('/api/deleteComment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const responseData = await response.text();

                if (!response.ok) {
                    throw new Error(
                        'Request failed with status: ' +
                        response.status +
                        ' ' +
                        responseData
                    );
                }

                currentCommentDiv.remove();

            } catch (e) {
                alert(e)
            }

            const directTimer = setTimeout(() => {
                location.reload();
                clearTimeout(directTimer);
            }, 300);

        })
    })
}

async function commentsOnArticle() {
    const form = document.getElementById('comment_on_article_form');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const loginOrNot = verifyLogInStatus();

        if (loginOrNot) {
            return;
        }

        const content = form.querySelector('textarea').value;
        const article_id = document.getElementById(
            'article_id_temp_storage'
        ).value;

        const formParentDiv = e.target.parentElement;
        const comments_div = formParentDiv.parentElement;

        const data = {
            contentKey: content,
            article_idKey: article_id,
        };

        try {
            const response = await fetch('/api/addComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();
            const articleId = responseData.article_id;
            const parentId = responseData.comments_id;

            if (!response.ok) {
                throw new Error(
                    'Request failed with status: ' +
                    response.status +
                    ' ' +
                    responseData
                );
            }

            const textareas = document.querySelectorAll('textarea');

            textareas.forEach((textarea) => {
                textarea.value = '';
            });

            // send and create notification article author
            await fetch('/api/create-new-comment-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ articleId, parentId }),
            });
        } catch (e) {
            alert(e);
        }

        const directTimer = setTimeout(() => {
            location.reload();
            clearTimeout(directTimer);
        }, 300);

    })
}

async function commentOnComment() {
    const forms = document.querySelectorAll('.comment_on_comment_form');

    forms.forEach(await attachListenerToForm);

    async function attachListenerToForm(form) {
        form.addEventListener('submit', async function (e) {

            const loginOrNot = verifyLogInStatus();

            if (loginOrNot) {
                return;
            }

            e.preventDefault();
            const content = form.querySelector('textarea').value;
            const comment_id = form.querySelector(
                'input[name="comment_id_storage"]'
            ).value;
            const article_id = document.getElementById(
                'article_id_temp_storage'
            ).value;

            const data = {
                contentKey: content,
                comment_idKey: comment_id,
                article_idKey: article_id,
            };

            const formParentDiv = e.target.parentElement;
            const comments_div = formParentDiv.parentElement;
            console.log(comments_div);

            try {
                const response = await fetch('/api/addComment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const responseData = await response.json();
                const articleId = responseData.article_id;
                const parentId = responseData.comments_id;

                if (!response.ok) {
                    throw new Error(
                        'Request failed with status: ' +
                        response.status +
                        ' ' +
                        responseData
                    );
                }

                const textareas = document.querySelectorAll('textarea');

                textareas.forEach((textarea) => {
                    textarea.value = '';
                });

                await fetch('/api/create-new-comment-notification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ articleId, parentId }),
                });
            } catch (e) {
                alert(e);
            }

            const directTimer = setTimeout(() => {
                location.reload();
                clearTimeout(directTimer);
            }, 300);

        })
    }
}
