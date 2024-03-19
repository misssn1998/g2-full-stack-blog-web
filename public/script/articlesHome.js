window.addEventListener("load", function () {

    function displaySubOption() {
        const btn_option = document.querySelectorAll(".btn_sub_option");
        const user_id = document.querySelector("#current_user_id");
        btn_option.forEach(async (btn) => {
            //let isClick = 0;
            const author_id = btn.querySelector('.article_author_id');
            const btn_subscribe = btn.querySelector('.btn_subscribe');

            

            try {
                if ((user_id.value != author_id.value) && user_id.value != null) {
                    const option = document.createElement("button");

                    const subOption = document.createElement("button")
                    subOption.innerHTML = `<img class="unsubBtn" src="/images/subscribe.png">Subscribe`;
                    subOption.addEventListener(`click`, (e)=>{
                        addSubscription(subscription_id);
                        subOption.style.display = "none"
                        unsubOption.style.display = "block"
                    })

                    const unsubOption = document.createElement("button")
                    unsubOption.innerHTML = `<img class="unsubBtn" src="/images/unsubscribe.png">Unsubscribe`
                    unsubOption.addEventListener(`click`, (e)=>{
                        removeSubscription(subscription_id);
                        subOption.style.display = "block"
                        unsubOption.style.display = "none"
                    })

                    unsubOption.setAttribute("class", "subscribe-button")
                    subOption.setAttribute("class", "subscribe-button")

                    option.setAttribute("class", "subscribe-button")
                    const isSubscribe = await checkIfSubscribe(user_id.value, author_id.value);
                    console.log(isSubscribe)
                    const subscription_id = author_id.value;
                    if (isSubscribe == 1) {
                        // option.innerHTML = `<img src="/images/unsubscribe.png">Unsubscribe`;
                        // option.addEventListener("click", function () {
                        //     removeSubscription(subscription_id);
                        //     option.innerHTML = `<img src="/images/subscribe.png">Subscribe`;
                        // });
                        unsubOption.style.display ="block"
                        subOption.style.display="none"
                    } else if (isSubscribe == 0) {
                        // option.innerHTML = `<img src="/images/subscribe.png">Subscribe`;
                        // option.addEventListener("click", function () {
                        //     addSubscription(subscription_id);
                        //     option.innerHTML = `<img src="/images/unsubscribe.png">Unsubscribe`;
                        // });
                        unsubOption.style.display ="none"
                        subOption.style.display="block"
                    }
                    // btn_subscribe.appendChild(option);
                    btn_subscribe.append(unsubOption);
                    btn_subscribe.append(subOption);
                }
            }
            catch (error) {

            }
        });

        // btn.addEventListener("click",  function () {
        //     if (!isClick) {
        //         btn_subscribe.appendChild(option);
        //         isClick = 1;
        //     } else {
        //         btn_subscribe.removeChild(option);
        //         isClick = 0;
        //     }
        // });


    }

    async function checkIfSubscribe(user_id, check_id) {
        const response = await fetch(`/api/checkIfSub`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id, check_id }),
        });
        const isSubscribe = await response.text();
        return (isSubscribe === '1');
    }

    async function removeSubscription(subscription_id) {
        const subscriptionId = subscription_id;
        fetch(`/removeSubscription?id=${subscriptionId}`)
            .then(response => {
                if (response.status === 200) {
                    // location.reload();
                } else {
                    console.error('Error removing subscription');
                }
            })
            .catch(error => {
                console.error('Network error:', error);
            });
    }

    async function addSubscription(subscription_id) {
        const subscriptionId = subscription_id;
        fetch(`/addSubscription?id=${subscriptionId}`)
            .then(response => {
                if (response.status === 200) {
                    // location.reload();
                } else {
                    console.error('Error removing subscription');
                }
            })
            .catch(error => {
                console.error('Network error:', error);
            });
    }
    // displaySubOption();


    // articlesHome.registerHelper('isEqual', function(user_id, author_id, options) {
    //     if (user_id === author_id) {
    //       return options.fn(this);
    //     } else {
    //       return options.inverse(this);
    //     }
    //   });

})