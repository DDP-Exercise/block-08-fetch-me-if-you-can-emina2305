"use strict";

/*******************************************************
 *  Users
 *
 *  See: https://jsonplaceholder.typicode.com/users
 *
 *  Your users should have:
 *      -id
 *      -name
 *      -username
 *      -email
 *      -website
 *
 *  You can skip address, phone and company.
 *
 *  users should also have posts[] (see main.js).
 *
 *  When printing a user, don't forget to make
 *      - href="mailto:.." for the email and
 *      - href=".." target="_blank" for the website.
 *  *******************************************************/

export class User {
    constructor({ id, name, username, email, website }) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.website = website;
        this.posts = [];
    }

    addPost(post) {
        this.posts.push(post);
    }

    getWebsiteUrl() {
        if (!this.website) {
            return "#";
        }

        return this.website.startsWith("http") ? this.website : `https://${this.website}`;
    }

    getInitials() {
        return this.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }

    render() {
        const article = document.createElement("article");
        article.className = "user-card";
        article.dataset.userCard = String(this.id);

        const header = document.createElement("div");
        header.className = "user-card__header";

        const avatar = document.createElement("span");
        avatar.className = "user-card__avatar";
        avatar.textContent = this.getInitials();

        const titleWrap = document.createElement("div");
        titleWrap.className = "user-card__title";

        const name = document.createElement("h2");
        name.textContent = this.name;

        const username = document.createElement("p");
        username.textContent = `@${this.username}`;

        titleWrap.append(name, username);

        const toggleButton = document.createElement("button");
        toggleButton.className = "user-card__toggle";
        toggleButton.type = "button";
        toggleButton.dataset.action = "toggle-user";
        toggleButton.dataset.userId = String(this.id);
        toggleButton.setAttribute("aria-expanded", "false");
        toggleButton.setAttribute("aria-controls", `user-${this.id}-posts`);
        toggleButton.textContent = `Show ${this.posts.length} posts`;

        header.append(avatar, titleWrap, toggleButton);

        const details = document.createElement("div");
        details.className = "user-card__details";

        const contactList = document.createElement("p");
        contactList.className = "user-card__contacts";

        const emailLink = document.createElement("a");
        emailLink.href = `mailto:${this.email}`;
        emailLink.textContent = this.email;

        const websiteLink = document.createElement("a");
        websiteLink.href = this.getWebsiteUrl();
        websiteLink.target = "_blank";
        websiteLink.rel = "noopener noreferrer";
        websiteLink.textContent = this.website;

        contactList.append(emailLink, document.createTextNode(" · "), websiteLink);

        const postsContainer = document.createElement("div");
        postsContainer.className = "posts";
        postsContainer.id = `user-${this.id}-posts`;
        postsContainer.hidden = true;

        if (this.posts.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "empty-message";
            emptyMessage.textContent = "This user has no posts yet.";
            postsContainer.append(emptyMessage);
        } else {
            this.posts.forEach((post) => {
                postsContainer.append(post.render());
            });
        }

        details.append(contactList, postsContainer);
        article.append(header, details);

        return article;
    }
}