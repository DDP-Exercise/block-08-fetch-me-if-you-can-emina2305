"use strict";

/*******************************************************
 *  Posts
 *
 *  See: https://jsonplaceholder.typicode.com/posts
 *
 *  Your posts should have:
 *      -id
 *      -title
 *      -body
 *
 *  You can skip the userId, your users know their posts (see class.user.js)
 *
 *  posts should also have comments[] (see main.js).
 *
 *  When printing a post, don't forget to make a button that
 *  loads the comments for the post. Once they are loaded, print them.
 *  *******************************************************/

export class Post {
    constructor({ id, title, body }) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.comments = [];
    }

    setComments(comments) {
        this.comments = comments.map(({ id, name, email, body }) => ({
            id,
            name,
            email,
            body,
        }));
    }

    render() {
        const article = document.createElement("article");
        article.className = "post-card";
        article.dataset.postCard = String(this.id);

        const title = document.createElement("h3");
        title.textContent = this.title;

        const body = document.createElement("p");
        body.textContent = this.body;

        const commentsButton = document.createElement("button");
        commentsButton.className = "post-card__button";
        commentsButton.type = "button";
        commentsButton.dataset.action = "load-comments";
        commentsButton.dataset.postId = String(this.id);
        commentsButton.setAttribute("aria-expanded", "false");
        commentsButton.setAttribute("aria-controls", `post-${this.id}-comments`);
        commentsButton.textContent = "Load comments";

        const commentsContainer = document.createElement("section");
        commentsContainer.className = "comments";
        commentsContainer.id = `post-${this.id}-comments`;
        commentsContainer.hidden = true;
        commentsContainer.setAttribute("aria-live", "polite");

        article.append(title, body, commentsButton, commentsContainer);

        return article;
    }

    renderComments() {
        const wrapper = document.createElement("div");

        if (this.comments.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "empty-message";
            emptyMessage.textContent = "No comments found for this post.";
            wrapper.append(emptyMessage);
            return wrapper;
        }

        const heading = document.createElement("h4");
        heading.textContent = "Comments";

        const list = document.createElement("ul");
        list.className = "comments__list";

        this.comments.forEach((comment) => {
            const item = document.createElement("li");
            item.className = "comments__item";

            const name = document.createElement("strong");
            name.textContent = comment.name;

            const email = document.createElement("a");
            email.href = `mailto:${comment.email}`;
            email.textContent = comment.email;

            const body = document.createElement("p");
            body.textContent = comment.body;

            item.append(name, email, body);
            list.append(item);
        });

        wrapper.append(heading, list);
        return wrapper;
    }
}