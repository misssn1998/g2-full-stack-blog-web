window.addEventListener('load', async function () {
    // bell attributes
    const notificationBell = document.querySelector('.bell-icon');
    const notifUnreadTag = document.querySelector('.notify-content .unread');
    const notifUnviewedTag = document.querySelector(
        '.notification-amount > span'
    );

    const userNotifications = await getAllNotifications();
    let totalNumberOfNotif = userNotifications.length;
    let numberOfUnreadNotif = 0;
    for (notif of userNotifications) {
        if (notif.isRead === 0) numberOfUnreadNotif++;
    }

    await setNotificationDropDownMenu();

    notificationBell.addEventListener('click', () => {
        deactivateBell();
        if (checkIfMoreThanZeroNotif()) setTimeout(activateBell, 100);
    });
    setNumberOfNotifications();
    if (checkIfMoreThanZeroNotif()) activateBell();

    // Bell Icon Functions
    function setNumberOfNotifications() {
        let readNotifNum = 0;
        let viewNotifNum = 0;
        for (notif of userNotifications) {
            if (notif.isRead === 0) readNotifNum++;
            if (notif.isViewed === 0) viewNotifNum++;
        }
        //set viewed count
        notifUnviewedTag.textContent = viewNotifNum;

        //set unread count
        if (totalNumberOfNotif === 0) {
            notifUnreadTag.textContent = 'No notifications';
        } else {
            notifUnreadTag.textContent = `Unread: ${readNotifNum}`;
        }
        return readNotifNum;
    }

    function checkIfMoreThanZeroNotif() {
        if (parseInt(notifUnviewedTag.textContent) > 0) return true;
        else return false;
    }

    function activateBell() {
        notificationBell.classList.add('activate');
    }

    function deactivateBell() {
        notificationBell.classList.remove('activate');
    }

    // Notification Functions
    async function getAllNotifications() {
        const response = await fetch(`/api/get-all-notifications`);
        const responseData = await response.json();
        let data = makeArray(responseData);
        if (data.length === 0) notifUnreadTag.textContent = 'No notifications';
        return data;
    }

    async function setNotificationDropDownMenu() {
        const notifyDropMenu = document.querySelector('.notify-content');
        for (notification of userNotifications) {
            await createNotification(notification);
        }

        async function createNotification(indvNotif) {
            let divTag = document.createElement('div');
            divTag.classList.add('clicked', 'notification');
            addLinkToNotificationDiv();
            checkAndUpdateIsViewed();
            checkAndUpdateIsRead();

            const res = await fetch(`/api/get-user-by-id?id=${indvNotif.host_id}`);
            const user = await res.json();
            const icon_path = user.icon_path;
            let imgTag = document.createElement('img');
            imgTag.classList.add('clicked', 'avatar');
            imgTag.setAttribute('src', icon_path);

            let contentDivTag = document.createElement('div');
            

            let p1Tag = document.createElement('p');
            p1Tag.classList.add('clicked');
            p1Tag.innerHTML = indvNotif.content;

            let p2Tag = document.createElement('p');
            p2Tag.classList.add('clicked', 'timestamp');
            const localTime = new Date(indvNotif.time).toLocaleString(); // parse to local time
            p2Tag.innerHTML = localTime;

            createTrashButton();

            divTag.appendChild(imgTag);
            divTag.appendChild(contentDivTag).appendChild(p1Tag);
            divTag.appendChild(contentDivTag).appendChild(p2Tag);
            notifyDropMenu.appendChild(divTag);

            function addLinkToNotificationDiv() {
                divTag.addEventListener('click', function (event) {
                    if (event.target.tagName.toLowerCase() !== 'img') {
                        const profileRoute = `/profile?id=${indvNotif.host_id}`;
                        const articleRoute = `/article/${indvNotif.article_id}`;
                        let route;
                        if (
                            indvNotif.type === 'like' ||
                            indvNotif.type === 'sub'
                        ) {
                            route = profileRoute;
                        } else if (
                            indvNotif.type === 'write' ||
                            'comment' ||
                            'reply'
                        ) {
                            route = articleRoute;
                        }
                        window.location.href = route;
                    }
                });
            }

            function checkAndUpdateIsViewed() {
                notificationBell.addEventListener('click', async function () {
                    notifUnviewedTag.textContent = 0;
                    deactivateBell();
                    if (indvNotif.isViewed === 0) {
                        await fetch(`/api/update-isViewed?id=${indvNotif.id}`);
                    }
                });
            }

            function checkAndUpdateIsRead() {
                if (indvNotif.isRead === 1) {
                    divTag.classList.add('read');
                }
                divTag.addEventListener('click', async function () {
                    if (indvNotif.isRead === 0) {
                        await fetch(`/api/update-isRead?id=${indvNotif.id}`);
                    }
                });
            }

            function createTrashButton() {
                let svgImgTag = document.createElement('img');
                svgImgTag.classList.add('svg-trash', 'clicked');
                svgImgTag.setAttribute('src', '/images/svg/empty.svg');
                svgImgTag.setAttribute('alt', 'trash icon');
                divTag.appendChild(svgImgTag);

                svgImgTag.addEventListener('click', async (event) => {
                    // visually update
                    const parentElement = event.target.parentElement;
                    if (parentElement) {
                        parentElement.remove();
                        totalNumberOfNotif--;
                        if (totalNumberOfNotif === 0) {
                            notifUnreadTag.textContent = 'No Notifications';
                        }
                        if (!parentElement.classList.contains('read')) {
                            numberOfUnreadNotif--;
                            if (totalNumberOfNotif != 0) {
                                notifUnreadTag.textContent = `Unread: ${numberOfUnreadNotif}`;
                            }
                        }

                        // update database
                        const res = await fetch(
                            `/api/delete-notification?id=${indvNotif.id}`,
                            {
                                method: 'DELETE',
                            }
                        );
                        if (res.status === 204)
                            console.log('Notification deleted successfully');
                        else console.log('Error deleting notification');
                    }
                });
            }
        }
    }

    // MISC
    function makeArray(input) {
        if (input === undefined) {
            return [];
        } else if (Array.isArray(input)) {
            return input;
        } else {
            return [input];
        }
    }
});
