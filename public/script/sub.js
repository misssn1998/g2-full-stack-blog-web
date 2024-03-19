window.addEventListener("load", function () {

    const btn_unsubscription = document.querySelectorAll(".btn_unsubscription");
    btn_unsubscription.forEach(async (btn) => {
        const idValue = btn.querySelector(".subscription_id");
        const subscription_id = idValue.value
        btn.addEventListener("click", function () {
            removeSubscription(subscription_id);
        });
    })

    const btn_unsubscriber = document.querySelectorAll(".btn_unsubscriber");
    btn_unsubscriber.forEach(async (btn) => {
        const idValue = btn.querySelector(".subscriber_id");
        const subscriber_id = idValue.value
        btn.addEventListener("click", function () {
            removeSubscriber(subscriber_id);
        });
    })

    async function removeSubscription(subscription_id) {
        const subscriptionId = subscription_id;
        fetch(`/removeSubscription?id=${subscriptionId}`)
            .then(response => {
                if (response.status === 200) {
                    location.reload();
                } else {
                    console.error('Error removing subscription');
                }
            })
            .catch(error => {
                console.error('Network error:', error);
            });
    }

    async function removeSubscriber(subscriber_id) {
        const subscriberId = subscriber_id;
        fetch(`/removeSubscriber?id=${subscriberId}`)
            .then(response => {
                if (response.status === 200) {
                    location.reload();
                } else {
                    console.error('Error removing subscription');
                }
            })
            .catch(error => {
                console.error('Network error:', error);
            });
    }

})
